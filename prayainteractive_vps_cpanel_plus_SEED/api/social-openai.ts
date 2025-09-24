import fetch from 'node-fetch';
import OpenAI from 'openai';

export async function generatePosts(){
  if (!process.env.OPENAI_API_KEY) return [];
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const prompts = [
    {aud:'kids', prompt:'Post FR 60-80 mots pour Kids (maths/géo), ton rassurant, 1 emoji max, CTA Voir la démo.'},
    {aud:'seniors', prompt:'Post FR 80-100 mots Seniors (cognitif + physique doux, PMR), CTA Voir la démo.'},
    {aud:'cse', prompt:'Post FR/EN 70-90 mots CSE (ROI, QVT), CTA Réserver démo.'}
  ];
  const results:any[] = [];
  for (const p of prompts){
    const res = await client.responses.create({ model: 'gpt-4.1-mini', input: p.prompt });
    results.push({ audience:p.aud, text: (res as any).output_text || 'Découvrez nos séances VR.' });
  }
  return results;
}
