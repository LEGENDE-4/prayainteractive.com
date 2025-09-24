import fetch from 'node-fetch';

export async function sendWA(phoneNumberId:string, to:string, template:string){
  const url = `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`;
  const payload = {
    messaging_product: 'whatsapp',
    to, type: 'template',
    template: { name: template, language: { code: 'fr' } }
  };
  const r = await fetch(url, {
    method:'POST',
    headers:{ 'Authorization':`Bearer ${process.env.WHATSAPP_TOKEN}`, 'Content-Type':'application/json' },
    body: JSON.stringify(payload)
  });
  if(!r.ok) throw new Error('WA send failed '+r.status);
  return r.json();
}
