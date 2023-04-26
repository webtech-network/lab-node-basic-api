// Importa o módulo do HTTP
const http = require('http');

// Cria um servidor e atribui uma callback de processamento da requisição
const server = http.createServer((req, res) => {
 res.statusCode = 200; // Retorno OK
 res.setHeader('Content-Type', 'application/json'); 
 res.end('{ "user": "Maria dos doces", "empresa": "PUC Minas" }');
});

// Define parâmetros (hostname e porta) e inicia o servidor
const hostname = '127.0.0.1';
const port = 3000;
server.listen(port, hostname, () => {
 console.log(`Servidor rodando: http://${hostname}:${port}/`);
});
