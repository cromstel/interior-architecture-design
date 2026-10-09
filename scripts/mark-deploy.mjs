import { writeFileSync, readFileSync } from 'node:fs';
const v = process.argv[2] || process.env.DEPLOY_VERSION || 'unknown';
const out = `DEPLOYED_VERSION=${v}\nDEPLOYED_AT=${new Date().toISOString()}\nSITE=interior-design.cromstelit.com\n`;
writeFileSync('DEPLOYED', out);
console.log('Deploy marker written: DEPLOYED_VERSION=' + v);