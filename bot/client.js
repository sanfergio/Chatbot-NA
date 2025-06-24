// bot/client.js

// Importa o "Client" da biblioteca do WhatsApp
const { Client } = require("whatsapp-web.js");

// Cria o cliente (como se fosse abrir o WhatsApp Web)
const client = new Client({
  puppeteer: {
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
});
// Exporta o cliente para que outros arquivos possam usá-lo
module.exports = { client };
