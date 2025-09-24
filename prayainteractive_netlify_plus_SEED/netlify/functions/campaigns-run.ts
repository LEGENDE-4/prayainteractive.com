import type { Handler } from "@netlify/functions";
import { runCampaignWave } from "../shared/campaigns.js";
export const handler: Handler = async () => {
  await runCampaignWave({ audience:'kids' });
  await runCampaignWave({ audience:'seniors' });
  await runCampaignWave({ audience:'cse' });
  return { statusCode: 200, body: "ok" };
};
