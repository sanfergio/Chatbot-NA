// bot/timeout.js

const { client } = require("./client");

// Guarda os usuários que já foram atendidos
const usuariosAtendidos = new Set();

// Guarda os temporizadores por usuário
const temporizadores = new Map();

// Define o tempo de inatividade: 5 minutos
const tempoInatividade = 5 * 60 * 1000;

// Delay artificial
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// Inicia ou reinicia o temporizador para um usuário
const iniciarTemporizador = (userId, chat) => {
  // Se já tiver temporizador, remove
  if (temporizadores.has(userId)) clearTimeout(temporizadores.get(userId));

  // Cria um novo temporizador
  const timeout = setTimeout(async () => {
    await chat.sendStateTyping();
    await delay(1000);
    await client.sendMessage(
      userId,
      "⌛ A conversa foi encerrada por inatividade. Se precisar de ajuda novamente, é só mandar uma mensagem!"
    );

    // Limpa os dados desse usuário
    usuariosAtendidos.delete(userId);
    temporizadores.delete(userId);
  }, tempoInatividade);

  // Salva o temporizador
  temporizadores.set(userId, timeout);
};

module.exports = { iniciarTemporizador, usuariosAtendidos };
