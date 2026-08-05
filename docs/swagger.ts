import swaggerUi from "swagger-ui-express";
import YAML from "yaml";

import fs from "fs";

const file = fs.readFileSync("docs/openapi.yml", "utf8");
const swaggerDocument = YAML.parse(file);

export { swaggerUi, swaggerDocument };
