const fs = require('fs');

// Define las rutas para AMBOS archivos
const targetPathProd = './src/environments/environment.prod.ts';
const targetPathDev = './src/environments/environment.ts'; // <-- Añade esta línea

// Obtén la URL del backend
const backendUrl = process.env.URL_BACKEND || 'http://localhost:8080/api/v1';


const envConfigFileProd = `
export const environment = {
  production: true,
  apiUrl: '${backendUrl}'
};
`;

// Plantilla para environment.ts (nota: production: false)
const envConfigFileDev = `
export const environment = {
  production: false, 
  apiUrl: '${backendUrl}'
};
`;

// Escribe ambos archivos
fs.writeFileSync(targetPathProd, envConfigFileProd);
fs.writeFileSync(targetPathDev, envConfigFileDev); // <-- Añade esta línea

console.log(`✅ environment.prod.ts y environment.ts generados con apiUrl=${backendUrl}`);