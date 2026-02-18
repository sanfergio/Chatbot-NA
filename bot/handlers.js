const { menuPrincipal } = require("./menu");
const { usuariosAtendidos, atendimentoHumano } = require("./state");

async function enviarMenu(sock, chat) {
  await sock.sendMessage(chat, { text: menuPrincipal });
}

async function responderOpcao(sock, entrada, chat) {
  const opcao = entrada.trim();

  // Respostas detalhadas para cada opção
  const respostas = {
    "1": `🔹 *Como funciona?*\n\nA New Andrew's é uma loja online especializada em suplementos de alta qualidade. Você pode navegar pelo nosso catálogo no site, escolher os produtos desejados e finalizar a compra com entrega rápida para todo o Brasil.\n\n➡️ Acesse: www.newandrews.com.br\n\n*Digite "menu" para voltar ao início.*`,

    "2": `🎉 *Promoções*\n\nNo momento estamos com frete grátis em compras acima de R$ 150,00! Além disso, diversos produtos com descontos especiais. Fique de olho no site para não perder nenhuma oferta.\n\n➡️ Confira: www.newandrews.com.br/promocoes\n\n*Digite "menu" para voltar ao início.*`,

    "3": `💪 *Benefícios*\n\n✅ Suplementos aprovados pela Anvisa\n✅ Matéria-prima importada\n✅ Entrega rápida e segura\n✅ Atendimento personalizado\n✅ Produtos com alta pureza e eficácia\n\nSaiba mais em www.newandrews.com.br\n\n*Digite "menu" para voltar ao início.*`,

    "4": `🛒 *Como comprar?*\n\nÉ muito simples:\n1. Acesse www.newandrews.com.br\n2. Navegue pelo catálogo e escolha seus produtos\n3. Adicione ao carrinho\n4. Escolha a forma de pagamento (cartão, boleto ou pix)\n5. Finalize o pedido e aguarde a entrega\n\nQualquer dúvida, estamos aqui!\n\n*Digite "menu" para voltar ao início.*`,

    "5": `🤝 *Seja um Revendedor / Parceiro / Representante*\n\nQuer fazer parte do time New Andrew's? Envie um e-mail para parcerias@newandrews.com.br ou entre em contato pelo WhatsApp comercial: (21) 98052-0003.\n\nOferecemos condições especiais e suporte completo.\n\n*Digite "menu" para voltar ao início.*`,

    "6": `📘 *Catálogo de Suplementos*\n\nConfira todos os nossos produtos no site:\n👉 www.newandrews.com.br/catalogo\n\nTemos whey protein, creatina, aminoácidos, vitaminas e muito mais!\n\n*Digite "menu" para voltar ao início.*`,

    "7": `👩‍💼 *Falar com atendente*\n\nNo momento não há nenhum atendente online disponível. Por favor, tente mais tarde ou envie sua dúvida por e-mail: contato@newandrews.com.br\n\nSe preferir, deixe sua mensagem aqui mesmo que assim que possível retornaremos.\n\n*Digite "menu" para voltar ao início.*`,

    "8": `⚠️ *Problemas, reclamações ou insatisfações*\n\nLamentamos por qualquer inconveniente. Para registrar sua reclamação de forma oficial e acompanhar a resolução, acesse nossa página no Reclame Aqui:\n🔗 https://www.reclameaqui.com.br/empresa/produtos-new-andrews/\n\nTambém estamos à disposição pelo e-mail: suporte@newandrews.com.br\n\n*Digite "menu" para voltar ao início.*`,

    "9": `✅ *Conversa encerrada.*\n\nObrigado por falar com a New Andrew's Suplementos! Sempre que precisar, é só mandar uma mensagem.`
  };

  // Comando "menu" já é tratado separadamente
  if (opcao === "menu") {
    return enviarMenu(sock, chat);
  }

  // Se for uma opção válida (1 a 9)
  if (respostas[opcao]) {
    await sock.sendMessage(chat, { text: respostas[opcao] });

    // Se for a opção 9 (encerrar), remove o usuário do controle
    if (opcao === "9") {
      usuariosAtendidos.delete(chat);
      atendimentoHumano.delete(chat);
      return;
    }

    // Para as demais opções, apenas aguardamos nova interação
    // O prompt para voltar ao menu já está incluso na mensagem
    return;
  }

  // Se o usuário digitou algo não reconhecido
  await sock.sendMessage(chat, {
    text: "❓ Opção inválida. Digite um número de 1 a 9 ou *menu* para ver as opções novamente."
  });
}

module.exports = { enviarMenu, responderOpcao };