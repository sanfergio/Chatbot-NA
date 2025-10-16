// bot/state.js

const { client } = require("./client");

// Guarda os usuários que já receberam a primeira mensagem
const usuariosAtendidos = new Set();

// Guarda os usuários que estão em atendimento humano (o bot está pausado para eles)
const atendimentoHumano = new Set();

// Guarda os temporizadores por usuário
const temporizadores = new Map();

// Define o tempo de inatividade: 5 minutos
const tempoInatividade = 5 * 60 * 1000;

// Delay artificial
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// Função que inicia ou reinicia o temporizador para um usuário
const iniciarTemporizador = (userId, chat) => {
  // Se já tiver temporizador, remove o antigo
  if (temporizadores.has(userId)) clearTimeout(temporizadores.get(userId));

  // Cria um novo temporizador
  const timeout = setTimeout(async () => {
    // Verifica se o usuário estava em atendimento humano
    if (atendimentoHumano.has(userId)) {
      // Se estava, o bot avisa que voltou
      await chat.sendStateTyping();
      await delay(1000);
      await client.sendMessage(
        userId,
        "Olá! O atendimento com nossa equipe foi finalizado por inatividade. Se precisar de algo mais, estou à disposição! É só mandar uma mensagem que eu te mostro o menu. 😊"
      );

      // Remove o usuário do estado de atendimento humano e da lista de atendidos
      // para que na próxima mensagem ele receba o menu como se fosse um novo contato.
      atendimentoHumano.delete(userId);
      usuariosAtendidos.delete(userId);
    } else {
      // Se não estava em atendimento humano, é a inatividade normal
      await chat.sendStateTyping();
      await delay(1000);
      await client.sendMessage(
        userId,
        "⌛ A conversa foi encerrada por inatividade. Se precisar de ajuda novamente, é só mandar uma mensagem!"
      );

      // Limpa os dados desse usuário para recomeçar na próxima interação
      usuariosAtendidos.delete(userId);
    }

    // Limpa o temporizador da memória
    temporizadores.delete(userId);
  }, tempoInatividade);

  // Salva o novo temporizador
  temporizadores.set(userId, timeout);
};

module.exports = {
  iniciarTemporizador,
  usuariosAtendidos,
  atendimentoHumano,
  temporizadores,
};
