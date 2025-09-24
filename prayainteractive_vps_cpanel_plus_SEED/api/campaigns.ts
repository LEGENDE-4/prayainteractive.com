import { db } from './db.js';
import { sendBrevo } from './brevo.js';
import { sendWA } from './whatsapp.js';

function html(aud:string, variant:'A'|'B'){
  const subj = {
    kids: {A:"Apprendre en s'amusant — VR à l'école", B:"Transformez votre classe en terrain d'exploration"},
    seniors: {A:"Bien-être cognitif + physique doux en EHPAD", B:"Sourires et mouvement — VR mobile"},
    cse: {A:"Un moment signature pour votre CSE", B:"Fédérez vos équipes avec la VR"}
  }[aud as 'kids'|'seniors'|'cse'][variant];
  const body = `<h1>Bonjour,</h1><p>Découvrez nos séances ${aud} — VR + projections interactives.</p><p><b>Code -10%: PI10</b></p>`;
  return { subject: subj, html: body, text: "Bonjour, découvrez nos séances…" };
}

export async function runCampaignWave({ audience }:{ audience:'kids'|'seniors'|'cse' }){
  const leads = await db.leadsDue(audience);
  for (const lead of leads){
    if (!lead.email) continue;
    const variant = Math.random()<0.5 ? 'A':'B';
    const tpl = html(audience, variant);
    await sendBrevo(lead.email, tpl.subject, tpl.html, tpl.text);
    if (lead.whatsapp && process.env.WHATSAPP_PHONE_NUMBER_ID){
      await sendWA(process.env.WHATSAPP_PHONE_NUMBER_ID, lead.whatsapp, 'pi_followup_2w');
    }
    await db.markTouched(lead.id, 'email', variant);
  }
}
