import fetch from 'node-fetch';

export async function neverbounceCheck(email:string){
  const url = `https://api.neverbounce.com/v4/single/check?key=${process.env.NEVERBOUNCE_KEY}&email=${encodeURIComponent(email)}`;
  const r = await fetch(url);
  if(!r.ok) throw new Error('NeverBounce error '+r.status);
  return r.json();
}
