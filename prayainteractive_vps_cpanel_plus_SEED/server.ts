import express from 'express';
import bodyParser from 'body-parser';
import { importEHPADFromDataGouv, importSchoolsFromEducation } from './api/datagouv.js';
import { runCampaignWave } from './api/campaigns.js';
import { generatePosts } from './api/social-openai.js';
import { publishLinkedIn, publishFacebook, publishInstagram, publishX } from './api/social-native.js';

const app = express(); app.use(bodyParser.json());

function guard(req:any,res:any,next:any){ if (req.query.secret !== process.env.CRON_SECRET) return res.sendStatus(403); next(); }

app.get('/health', (_req,res)=>res.send('ok'));
app.post('/cron/daily-prospects', guard, async (_req,res)=>{ 
  await importEHPADFromDataGouv(process.env.EHPAD_CSV_URL || 'https://example-ehpad.csv');
  await importSchoolsFromEducation(process.env.SCHOOLS_CSV_URL || 'https://example-ecoles.csv');
  res.send('ok');
});
app.post('/cron/daily-campaigns', guard, async (_req,res)=>{
  await runCampaignWave({ audience:'kids' });
  await runCampaignWave({ audience:'seniors' });
  await runCampaignWave({ audience:'cse' });
  res.send('ok');
});
app.post('/cron/daily-social', guard, async (_req,res)=>{
  const posts = await generatePosts();
  for (const p of posts){
    await publishLinkedIn(p.text);
    await publishFacebook(p.text, `https://prayainteractive.com/${p.audience}`);
    await publishInstagram(p.text);
    await publishX(p.text);
  }
  res.send('ok');
});

// Webhooks
app.get('/webhooks/whatsapp', (req,res)=>{
  if (req.query['hub.verify_token'] === process.env.WHATSAPP_VERIFY_TOKEN)
    return res.status(200).send(req.query['hub.challenge']);
  return res.sendStatus(403);
});
app.post('/webhooks/whatsapp', (_req,res)=>{ res.send('ok'); });
app.post('/webhooks/brevo', (_req,res)=>{ res.send('ok'); });

app.listen(process.env.PORT || 3000, ()=>console.log('Server running'));


import { seedLeads } from './api/seed.js';
app.post('/seed/leads', async (req,res)=>{
  const audience = (req.query.audience as string) || 'all';
  await seedLeads(audience);
  res.send('seed ok ' + audience);
});
