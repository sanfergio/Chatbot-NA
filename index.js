// index.js
const qrcode = require("qrcode-terminal");
const { client } = require("./bot/client");
const { enviarMenu, responderOpcao } = require("./bot/handlers");
// Importa tudo do novo arquivo de estado
const {
  iniciarTemporizador,
  usuariosAtendidos,
  atendimentoHumano,
} = require("./bot/state");

const NUMERO_ATENDENTE = "5521980520003@c.us"; //5524981513730@c.us esse é o numero que devera ser utilizado

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("✅ Bot conectado com sucesso!");
});

client.initialize();

client.on("message", async (msg) => {
  const entrada = msg.body.trim().toLowerCase();
  const chat = await msg.getChat();
  const userId = msg.from;
  const targetId = msg.to;

  // *** LÓGICA PRINCIPAL ALTERADA ***

  // 1. Verifica se a mensagem é do atendente para um cliente
  if (userId === NUMERO_ATENDENTE && targetId) {
    console.log(
      `👨‍💼 Atendente falando com ${targetId}. Bot pausado para este usuário.`
    );
    // Coloca o cliente no modo de atendimento humano
    atendimentoHumano.add(targetId);
    // Inicia o timer de inatividade para o bot voltar depois de 5 minutos
    iniciarTemporizador(targetId, await client.getChatById(targetId));
    return; // Bot não faz mais nada
  }

  // 2. Verifica se o usuário está em atendimento humano
  if (atendimentoHumano.has(userId)) {
    console.log(
      `🤫 Usuário ${userId} está em atendimento humano. Bot em silêncio.`
    );
    // Apenas reinicia o timer de inatividade toda vez que o cliente manda mensagem
    iniciarTemporizador(userId, chat);
    return; // Bot não responde
  }

  // 3. Se não estiver em atendimento humano, segue o fluxo normal do bot
  iniciarTemporizador(userId, chat); // Inicia ou reinicia o timer de inatividade normal

  if (!usuariosAtendidos.has(userId)) {
    usuariosAtendidos.add(userId);

    await chat.sendStateTyping();
    await new Promise((res) => setTimeout(res, 1000));

    await client.sendMessage(
      userId,
      `🤖 *Olá! Seja muito bem-vindo(a) ao atendimento da New Andrew's Suplementos!*\n\n` +
        `Aqui você encontrará informações sobre nossos produtos, promoções, formas de compra e muito mais.\n\n`
    );

    return enviarMenu(msg);
  }

  // Se já mandou mensagem antes, responde conforme a opção escolhida
  return responderOpcao(entrada, msg, chat);
});
