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

    // Atendimento humano
    if (atendimentoHumano.has(sender)) {
      iniciarTemporizador(sender);
      return;
    }

    iniciarTemporizador(sender);

    if (!usuariosAtendidos.has(sender)) {
      usuariosAtendidos.add(sender);

      await sock.sendMessage(sender, {
        text:
          "🤖 *Olá! Seja bem-vindo(a) à New Andrew's Suplementos!*\n\nEscolha uma opção:"
      });

      return enviarMenu(sock, sender);
    }

    return responderOpcao(sock, entrada, sender);
  });
}

function getQR() {
  return currentQR;
}

module.exports = { iniciarBot, getQR };
