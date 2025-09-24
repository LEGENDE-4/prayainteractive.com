import type { Handler } from "@netlify/functions";
import { importCsvLeads } from "../shared/importer.js";
export const handler: Handler = async () => {
  await importCsvLeads("assets/templates/prayainteractive_leads_template.csv");
  return { statusCode: 200, body: "import ok" };
};
