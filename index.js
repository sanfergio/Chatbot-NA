// index.js
const http = require('http');
const { client } = require("./bot/client");
const { enviarMenu, responderOpcao } = require("./bot/handlers");
const { iniciarTemporizador, usuariosAtendidos } = require("./bot/timeout");

const conversasEncerradas = new Set(); // Armazena as conversas que devem ser ignoradas
const NUMERO_ATENDENTE = "5524981513730@c.us";

let qrCodeData = null; // aqui vamos armazenar o link do QR gerado

// Quando o QR for recebido do WhatsApp
client.on('qr', (qr) => {
  console.log('📷 Novo QR recebido');
  const qrEncoded = encodeURIComponent(qr);
  qrCodeData = `https://chart.googleapis.com/chart?cht=qr&chs=300x300&chl=${qrEncoded}`;
});

// Quando o bot estiver pronto
client.on("ready", () => {
  console.log("✅ Bot conectado com sucesso!");
});

client.initialize();

const PORT = process.env.PORT || 3000;

// Criando servidor HTTP básico
const server = http.createServer((req, res) => {
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<h2>Servidor rodando. Acesse <a href="/qr">/qr</a> para ver o QR Code.</h2>');
  } else if (req.url === '/qr') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    if (!qrCodeData) {
      res.end('<h3>QR Code ainda não disponível. Aguarde o carregamento...</h3>');
    } else {
      res.end(`
        <div style="text-align: center;">
          <h2>Escaneie o QR Code abaixo:</h2>
          <img src="${qrCodeData}" alt="QR Code" />
        </div>
      `);
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Página não encontrada');
  }
});

server.listen(PORT, () => {
  console.log(`🌐 Servidor web iniciado em http://localhost:${PORT}`);
});

// Quando chegar uma nova mensagem
client.on("message", async (msg) => {
  const entrada = msg.body.trim().toLowerCase(); // texto enviado
  const chat = await msg.getChat(); // informações do chat

  // Se essa conversa está na lista de encerradas, ignora a mensagem
  if (conversasEncerradas.has(msg.from)) return;

  // Se o atendente mandou mensagem para alguém, encerra o bot naquela conversa
  if (msg.from === NUMERO_ATENDENTE && msg.to) {
    conversasEncerradas.add(msg.to); // encerra o bot na conversa com o cliente
    console.log(`👨‍💼 Atendimento humano iniciado com ${msg.to}`);
    return;
  }

  // Inicia ou reinicia o temporizador de inatividade
  iniciarTemporizador(msg.from, chat);

  // Verifica se este número já mandou mensagem antes, aqui eu resolvi o bug de mensagem repetida de boas-vindas
  if (!usuariosAtendidos.has(msg.from)) {
    usuariosAtendidos.add(msg.from); // marca como atendido

    await chat.sendStateTyping(); // simula "digitando..."
    await new Promise((res) => setTimeout(res, 1000)); // espera 1 segundo

    await client.sendMessage(
      msg.from,
      `🤖 *Olá! Seja muito bem-vindo(a) ao atendimento da New Andrew's Suplementos!*\n\n` +
        `Aqui você encontrará informações sobre nossos produtos, promoções, formas de compra e muito mais.\n\n`
    );

    // Envia o menu principal
    return enviarMenu(msg);
  }

  // Se já mandou mensagem antes, responde conforme a opção escolhida
  return responderOpcao(entrada, msg, chat, conversasEncerradas);
});
