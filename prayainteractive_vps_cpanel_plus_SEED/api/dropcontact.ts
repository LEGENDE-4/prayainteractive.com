import fetch from 'node-fetch';

export async function dropcontactEnrich(record:{website?:string, company?:string, first_name?:string, last_name?:string}){
  const r = await fetch('https://api.dropcontact.io/batch', {
    method:'POST',
    headers:{ 'Content-Type':'application/json', 'X-Access-Token': process.env.DROPCONTACT_KEY || '' },
    body: JSON.stringify({ data:[record] })
  });
  if(!r.ok) throw new Error('Dropcontact error '+r.status);
  return r.json();
}
