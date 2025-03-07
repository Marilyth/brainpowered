import { writeFileSync, copyFileSync } from "fs";
writeFileSync("docs/.nojekyll", "");
copyFileSync("CNAME", "docs/CNAME");
