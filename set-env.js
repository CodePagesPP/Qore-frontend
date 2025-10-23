const fs = require('fs');
const targetPath = './src/environments/environment.prod.ts';
const backendUrl = process.env.URL_BACKEND || 'http://localhost:8080/api/v1';

const envConfigFile = `
export const environment = {
  production: true,
  apiUrl: '${backendUrl}'
};
`;

fs.writeFileSync(targetPath, envConfigFile);
console.log(`✅ environment.prod.ts generado con apiUrl=${backendUrl}`);
