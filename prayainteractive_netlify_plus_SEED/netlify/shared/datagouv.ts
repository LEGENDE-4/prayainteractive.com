// Basic fetchers for French open data sources (customize endpoints as needed)
import fetch from 'node-fetch';
import { db } from './db.js';

export async function importEHPADFromDataGouv(url='https://example-ehpad.csv'){
  // Expect CSV with columns: nom;commune;site;email;telephone
  const res = await fetch(url);
  const csv = await res.text();
  const rows = csv.split(/\r?\n/).slice(1).filter(Boolean);
  for (const r of rows.slice(0,200)){ // limit per run
    const cols = r.split(';');
    const lead = {
      audience:'seniors', company_or_org: cols[0], contact_name:'', role_title:'',
      email: cols[3]||null, phone: cols[4]||null, whatsapp:null,
      country:'FR', city: cols[1], website: cols[2] || '',
      consent_source:'public_opendata', consent_date: new Date().toISOString().slice(0,10),
      language:'fr', segment_tags: '{ehpad}', notes:'import data.gouv', score:0, status:'new'
    };
    await db.insertLead(lead);
  }
}

export async function importSchoolsFromEducation(url='https://example-ecoles.csv'){
  // Expect CSV with columns: uai;nom;commune;email;site;tel
  const res = await fetch(url);
  const csv = await res.text();
  const rows = csv.split(/\r?\n/).slice(1).filter(Boolean);
  for (const r of rows.slice(0,200)){
    const c = r.split(';');
    const lead = {
      audience:'kids', company_or_org: c[1], contact_name:'', role_title:'',
      email: c[3]||null, phone: c[5]||null, whatsapp:null,
      country:'FR', city: c[2], website: c[4]||'',
      consent_source:'public_opendata', consent_date: new Date().toISOString().slice(0,10),
      language:'fr', segment_tags: '{ecole}', notes:`UAI ${c[0]}`, score:0, status:'new'
    };
    await db.insertLead(lead);
  }
}
