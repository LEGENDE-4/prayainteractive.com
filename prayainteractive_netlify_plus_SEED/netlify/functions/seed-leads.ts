import type { Handler } from "@netlify/functions";
import { db } from "../shared/db.js";

async function seedOne(audience:string, org:string, email:string){
  await db.insertLead({
    audience: audience, company_or_org: org, contact_name:'', role_title:'',
    email: email, phone:'', whatsapp:'', country:'FR', city:'Paris',
    consent_source:'manual_seed', consent_date: new Date().toISOString().slice(0,10),
    language:'fr', segment_tags:'{seed}', website:'', notes:'seed', score:0, status:'new'
  });
}

export const handler: Handler = async (event) => {
  const params = new URLSearchParams(event.rawQuery || '');
  const audience = params.get('audience') || 'all';

  if (audience === 'kids' || audience === 'all'){
    await seedOne('kids','École Demo A','classe-a@example.com');
    await seedOne('kids','École Demo B','classe-b@example.com');
  }
  if (audience === 'seniors' || audience === 'all'){
    await seedOne('seniors','EHPAD Demo','direction@ehpad-demo.fr');
  }
  if (audience === 'cse' || audience === 'all'){
    await seedOne('cse','Entreprise Demo','hr@entreprise-demo.fr');
  }

  return { statusCode: 200, body: `seed ok (${audience})` };
};
