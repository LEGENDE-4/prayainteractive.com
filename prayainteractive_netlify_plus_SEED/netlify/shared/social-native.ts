import fetch from 'node-fetch';

export async function publishLinkedIn(text:string){
  // Requires LINKEDIN_ACCESS_TOKEN & LINKEDIN_ORG_URN or member URN
  const token = process.env.LINKEDIN_ACCESS_TOKEN || '';
  const org = process.env.LINKEDIN_ORG_URN || '';
  const payload = {
    author: org, lifecycleState: 'PUBLISHED',
    specificContent: { 'com.linkedin.ugc.ShareContent': { shareCommentary: { text }, shareMediaCategory: 'NONE' } },
    visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' }
  };
  const r = await fetch('https://api.linkedin.com/v2/ugcPosts', {
    method:'POST',
    headers:{ 'Authorization':`Bearer ${token}`, 'X-Restli-Protocol-Version':'2.0.0', 'Content-Type':'application/json' },
    body: JSON.stringify(payload)
  });
  return r.status;
}

export async function publishFacebook(text:string, link?:string){
  const pageId = process.env.FACEBOOK_PAGE_ID; const token = process.env.FACEBOOK_PAGE_TOKEN;
  const url = `https://graph.facebook.com/${process.env.META_GRAPH_VERSION || 'v21.0'}/${pageId}/feed`;
  const r = await fetch(url + `?message=${encodeURIComponent(text)}${link?`&link=${encodeURIComponent(link)}`:''}&access_token=${token}`, { method:'POST' });
  return r.status;
}

export async function publishInstagram(text:string){
  const igId = process.env.INSTAGRAM_BUSINESS_ID; const token = process.env.FACEBOOK_PAGE_TOKEN;
  // Create container then publish (simplified)
  const createRes = await fetch(`https://graph.facebook.com/${process.env.META_GRAPH_VERSION || 'v21.0'}/${igId}/media?caption=${encodeURIComponent(text)}&access_token=${token}`, { method:'POST' });
  const data = await createRes.json();
  if (!data?.id) return 400;
  const pubRes = await fetch(`https://graph.facebook.com/${process.env.META_GRAPH_VERSION || 'v21.0'}/${igId}/media_publish?creation_id=${data.id}&access_token=${token}`, { method:'POST' });
  return pubRes.status;
}

export async function publishX(text:string){
  // Using v2 'create tweet' endpoint requires OAuth 2.0 user context; details vary by plan.
  const token = process.env.X_BEARER_TOKEN;
  const r = await fetch('https://api.twitter.com/2/tweets', {
    method:'POST',
    headers:{ 'Authorization':`Bearer ${token}`, 'Content-Type':'application/json' },
    body: JSON.stringify({ text })
  });
  return r.status;
}
