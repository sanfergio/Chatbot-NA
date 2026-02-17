const { menuPrincipal } = require("./menu");
const { usuariosAtendidos, atendimentoHumano } = require("./state");

async function enviarMenu(sock, chat) {
  await sock.sendMessage(chat, { text: menuPrincipal });
}

async function responderOpcao(sock, entrada, chat) {
  const respostas = {
    "1": "💊 Trabalhamos com suplementos premium e entrega rápida!",
    "2": "🎉 Frete grátis este mês!",
    "3": "✨ Produtos aprovados pela Anvisa.",
    "4": "🛒 Compre em https://newandrews.com.br",
    "5": "Digite 0 para falar com atendente.",
    "6": "🤝 Parcerias via WhatsApp.",
    "7": "📘 Catálogo disponível no site.",
    "8": "✅ Conversa encerrada.",
    "0": "👩‍💼 Encaminhando para atendente..."
  };

  if (respostas[entrada]) {
    await sock.sendMessage(chat, { text: respostas[entrada] });

    if (entrada === "0") {
      atendimentoHumano.add(chat);
      return;
    }

    if (entrada === "8") {
      usuariosAtendidos.delete(chat);
      return;
    }

    return enviarMenu(sock, chat);
  }

  if (entrada === "menu") {
    return enviarMenu(sock, chat);
  }

  if (entrada === "sair") {
    usuariosAtendidos.delete(chat);
    await sock.sendMessage(chat, { text: "✅ Conversa encerrada." });
    return;
  }

  await sock.sendMessage(chat, {
    text: "⚠️ Opção inválida. Digite um número do menu."
  });
}

module.exports = { enviarMenu, responderOpcao };
