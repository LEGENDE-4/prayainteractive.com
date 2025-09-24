import fs from 'fs';
import { db } from './db.js';

export async function importCsvLeads(csvPath:string){
  const csv = fs.readFileSync(csvPath,'utf-8').trim();
  const [header, ...lines] = csv.split(/\r?\n/);
  const cols = header.split(',');
  for (const line of lines){
    const vals = line.split(',');
    const obj:any = {};
    cols.forEach((c,i)=>obj[c.trim()] = (vals[i]||'').trim());
    if (!obj.audience) continue;
    await db.insertLead(obj);
  }
}
