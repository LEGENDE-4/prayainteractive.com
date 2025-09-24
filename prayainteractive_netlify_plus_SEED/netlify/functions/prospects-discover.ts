import type { Handler } from "@netlify/functions";
import { importEHPADFromDataGouv, importSchoolsFromEducation } from "../shared/datagouv.js";
export const handler: Handler = async () => {
  await importEHPADFromDataGouv(process.env.EHPAD_CSV_URL || "https://example-ehpad.csv");
  await importSchoolsFromEducation(process.env.SCHOOLS_CSV_URL || "https://example-ecoles.csv");
  return { statusCode: 200, body: "ok" };
};
