const { iniciarBot } = require("./bot/client");

async function start() {
  try {
    await iniciarBot();
  } catch (error) {
    console.error("Erro ao iniciar bot:", error);
  }
}

start();
