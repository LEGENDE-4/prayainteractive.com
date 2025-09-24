// Append to server.ts: separate file for clarity (import and mount in server.ts if needed)
import { db } from './api/db.js';

export async function seedLeads(audience:string){
  async function seedOne(aud:string, org:string, email:string){
    await db.insertLead({
      audience: aud, company_or_org: org, contact_name:'', role_title:'',
      email, phone:'', whatsapp:'', country:'FR', city:'Paris',
      consent_source:'manual_seed', consent_date: new Date().toISOString().slice(0,10),
      language:'fr', segment_tags:'{seed}', website:'', notes:'seed', score:0, status:'new'
    });
  }
  if (audience === 'kids' or audience === 'all'){
    await seedOne('kids','École Demo A','classe-a@example.com');
    await seedOne('kids','École Demo B','classe-b@example.com');
  }
  if (audience === 'seniors' or audience === 'all'){
    await seedOne('seniors','EHPAD Demo','direction@ehpad-demo.fr');
  }
  if (audience === 'cse' or audience === 'all'){
    await seedOne('cse','Entreprise Demo','hr@entreprise-demo.fr');
  }
}
