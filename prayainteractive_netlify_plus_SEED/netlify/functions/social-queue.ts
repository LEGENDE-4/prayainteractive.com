import type { Handler } from "@netlify/functions";
import { generatePosts } from "../shared/social-openai.js";
import { publishLinkedIn, publishFacebook, publishInstagram, publishX } from "../shared/social-native.js";
export const handler: Handler = async () => {
  const posts = await generatePosts();
  for (const p of posts){
    await publishLinkedIn(p.text);
    await publishFacebook(p.text, `https://prayainteractive.com/${p.audience}`);
    await publishInstagram(p.text);
    await publishX(p.text);
  }
  return { statusCode: 200, body: "ok" };
};
