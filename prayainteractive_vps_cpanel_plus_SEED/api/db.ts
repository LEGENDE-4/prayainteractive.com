import pg from 'pg';
import mysql from 'mysql2/promise';

export type Lead = { id:string, email?:string|null, whatsapp?:string|null };

const pgUrl = process.env.DATABASE_URL || '';
const mysqlUrl = process.env.MYSQL_URL || '';

let pgPool: pg.Pool | null = null;
let myPool: mysql.Pool | null = null;

function usePg(){ if(!pgPool) pgPool = new pg.Pool({ connectionString: pgUrl, ssl: pgUrl.includes('sslmode=require') ? { rejectUnauthorized:false } : undefined }); return pgPool; }
function useMy(){ if(!myPool) myPool = mysql.createPool(mysqlUrl); return myPool; }

const use = () => pgUrl ? 'pg' : (mysqlUrl ? 'my' : 'none');

export const db = {
  async leadsDue(audience:'kids'|'seniors'|'cse'){
    if (use()==='pg'){
      const q = await usePg().query('select id,email,whatsapp from leads where audience=$1 and (next_touch_at is null or next_touch_at<=now()) limit 100',[audience]);
      return q.rows as Lead[];
    } else if (use()==='my'){
      const [rows] = await useMy().query('select id,email,whatsapp from leads where audience=? and (next_touch_at is null or next_touch_at<=now()) limit 100',[audience]);
      return rows as any as Lead[];
    }
    return [];
  },
  async insertLead(l:any){
    if (use()==='pg'){
      await usePg().query(`insert into leads(id,audience,company_or_org,contact_name,role_title,email,phone,whatsapp,country,city,consent_source,consent_date,language,segment_tags,website,notes,score,status)
        values(gen_random_uuid(),$1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)`,[
          l.audience,l.company_or_org,l.contact_name,l.role_title,l.email,l.phone,l.whatsapp,l.country,l.city,l.consent_source,l.consent_date,l.language,l.segment_tags,l.website,l.notes,l.score||0,l.status||'new'
      ]);
    } else if (use()==='my'){
      await useMy().query(`insert into leads(id,audience,company_or_org,contact_name,role_title,email,phone,whatsapp,country,city,consent_source,consent_date,language,segment_tags,website,notes,score,status)
        values(UUID(),?,?,?,?,?,?,?,?,?,?,?,?,?,?,?, ?, ?)`,[
          l.audience,l.company_or_org,l.contact_name,l.role_title,l.email,l.phone,l.whatsapp,l.country,l.city,l.consent_source,l.consent_date,l.language,l.segment_tags,l.website,l.notes,l.score||0,l.status||'new'
      ]);
    }
  },
  async markTouched(id:string, channel:'email'|'whatsapp', variant:'A'|'B'){
    const next = new Date(Date.now()+14*24*60*60*1000);
    if (use()==='pg'){
      await usePg().query('insert into touch_logs(lead_id,channel,variant) values($1,$2,$3)',[id,channel,variant]);
      await usePg().query('update leads set last_touch_at=now(), next_touch_at=$1 where id=$2',[next, id]);
    } else if (use()==='my'){
      await useMy().query('insert into touch_logs(lead_id,channel,variant) values(?,?,?)',[id,channel,variant]);
      await useMy().query('update leads set last_touch_at=now(), next_touch_at=? where id=?',[next, id]);
    }
  }
};
