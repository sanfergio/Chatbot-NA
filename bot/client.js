const makeWASocket = require("@whiskeysockets/baileys").default;
const {
  useMultiFileAuthState,
  DisconnectReason
} = require("@whiskeysockets/baileys");

const P = require("pino");
const { Boom } = require("@hapi/boom");

const { enviarMenu, responderOpcao } = require("./handlers");
const {
  iniciarTemporizador,
  usuariosAtendidos,
  atendimentoHumano
} = require("./state");

let sock;
let currentQR = null;

// Número do atendente (não usado no momento, mas mantido para futuro)
const NUMERO_ATENDENTE = "5521980520003@s.whatsapp.net";

async function iniciarBot() {
  const { state, saveCreds } = await useMultiFileAuthState("./auth");

  sock = makeWASocket({
    logger: P({ level: "silent" }),
    auth: state,
    printQRInTerminal: false
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", (update) => {
    const { connection, qr, lastDisconnect } = update;

    if (qr) {
      currentQR = qr;
      console.log("📲 QR gerado");
    }

    if (connection === "open") {
      console.log("✅ Bot conectado!");
      currentQR = null;
    }

    if (connection === "close") {
      const shouldReconnect =
        new Boom(lastDisconnect?.error)?.output?.statusCode !==
        DisconnectReason.loggedOut;

      if (shouldReconnect) iniciarBot();
    }
  });

  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message) return;

    const sender = msg.key.remoteJid;
    const fromMe = msg.key.fromMe;

    if (fromMe) return;

    const texto =
      msg.message.conversation ||
      msg.message.extendedTextMessage?.text ||
      "";

    const entrada = texto.trim().toLowerCase();

    // Se estiver em modo atendimento humano (não usado agora, mas mantido)
    if (atendimentoHumano.has(sender)) {
      iniciarTemporizador(sender);
      // Aqui poderia encaminhar a mensagem para o atendente real
      return;
    }

    iniciarTemporizador(sender);

    // Primeira interação do usuário
    if (!usuariosAtendidos.has(sender)) {
      usuariosAtendidos.add(sender);

      await sock.sendMessage(sender, {
        text: `🤖 *Olá! Seja bem-vindo(a) à New Andrew's Suplementos!*\n\nAntes de começarmos, um aviso importante: nosso sistema de atendimento funciona apenas por *mensagens de texto*. Não respondemos a áudios, imagens, vídeos ou ligações.\n\nEscolha uma opção abaixo:`
      });

      return enviarMenu(sock, sender);
    }

    // Responde à opção escolhida
    return responderOpcao(sock, entrada, sender);
  });
}

function getQR() {
  return currentQR;
}

module.exports = { iniciarBot, getQR };