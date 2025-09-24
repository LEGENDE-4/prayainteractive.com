import fetch from 'node-fetch';

export async function sendBrevo(to:string, subject:string, html:string, text=''){
  const r = await fetch('https://api.brevo.com/v3/smtp/email', {
    method:'POST',
    headers:{
      'api-key': process.env.BREVO_API_KEY || '',
      'Content-Type':'application/json'
    },
    body: JSON.stringify({
      sender:{ name: process.env.BREVO_SENDER_NAME || 'PrayaInteractive', email: process.env.BREVO_SENDER_EMAIL || 'hello@prayainteractive.com' },
      to:[{ email: to }], subject, htmlContent: html, textContent: text, tags: ['campaign','prayainteractive']
    })
  });
  if(!r.ok) throw new Error('Brevo send failed '+r.status);
  return r.json();
}
