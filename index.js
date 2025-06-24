// index.js
const qrcode = require("qrcode-terminal");
const { client } = require("./bot/client");
const { enviarMenu, responderOpcao } = require("./bot/handlers");
const { iniciarTemporizador, usuariosAtendidos } = require("./bot/timeout");

const conversasEncerradas = new Set(); // Armazena as conversas que devem ser ignoradas
const NUMERO_ATENDENTE = "5524981513730@c.us";

// QR code no terminal
client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

// mostra uma mensagem quando conectado
client.on("ready", () => {
  console.log("✅ Bot conectado com sucesso!");
});

client.initialize();

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
