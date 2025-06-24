// bot/handlers.js

const { client } = require("./client"); // usa o cliente para enviar mensagens
const { menuPrincipal } = require("./menu"); // importei o texto do menu

// Função que apenas espera um tempo (para simular digitação)
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// Função que envia o menu
const enviarMenu = async (msg) => {
  await delay(500); // espera 0.5 segundos
  await client.sendMessage(msg.from, menuPrincipal); // envia o menu
};

// Função que responde a mensagem do usuário, de acordo com a opção escolhida
const responderOpcao = async (entrada, msg, chat, conversasEncerradas) => {
  await chat.sendStateTyping(); // simula que está digitando
  await delay(1500); // espera 1.5 segundos

  // Respostas para cada opção
  const respostas = {
    1: `💊 *Como funciona?*\n\nTrabalhamos com suplementos de alta qualidade, preços acessíveis e entrega rápida para todo o Brasil!\n\n1️⃣ Acesse nosso site ou chame um atendente.  \n2️⃣ Escolha seus produtos favoritos.  \n3️⃣ Finalize a compra e receba em casa com segurança!`,
    2: `🎉 *Promoções especiais do mês!*\n\n🚚 Frete *GRÁTIS* em *QUALQUER* compra! \n🎁 Na compra de *3 produtos*, o *4º é grátis*!\n\nConfira todas no nosso site 👉 https://newandrews.com.br`,
    3: `✨ *Benefícios dos nossos produtos:*\n\n✅ Suplementos aprovados pela Anvisa  \n✅ Qualidade premium com preço acessível  \n✅ Entrega rápida e grátis para todo o Brasil\n✅ Produzimos nossos próprios produtos\n✅ Garantia de satisfação ou seu dinheiro de volta\n✅ Suporte especializado para tirar suas dúvidas`,
    4: `🛒 *Como comprar?*\n\nVocê pode comprar diretamente pelo nosso site com total segurança.\n\n👉 Acesse agora: https://newandrews.com.br`,
    5: `❓ *Outras dúvidas?*\n\nVocê deseja ser atendido(a) pela nossa equipe de atendimento?\n\nDigite *0* para conversar com um atendente agora mesmo. 👩‍💼`,
    6: `🤝 *Revenda, distribuição e parcerias:*\n\nTem interesse em revender ou distribuir nossos produtos? Ótimo!\n\nClique no link abaixo e fale com nosso consultor:\n\n👉 https://api.whatsapp.com/send/?phone=5521979089061&text=Olá%21+Tenho+interesse+em+me+tornar+revendedor+ou+parceiro+da+New+Andrew\'s+Suplementos&app_absent=0`,
    7: `📘 *Confira nosso catálogo completo de produtos no link abaixo:*\n\n👉 ${"https://www.canva.com/design/DAGKvqOdiGc/7qEKsItG3Udb_Y6lnWNo8w/view?utm_content=DAGKvqOdiGc&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=hb5a073ccf5"}`,
    8: `✅ A conversa foi encerrada com sucesso. Quando quiser voltar, é só mandar uma nova mensagem!`,
    0: `👩‍💼 *Encaminhando para atendimento...*\n\nAguarde um momento que nossa equipe irá te responder diretamente por aqui.`,
  };

  if (respostas[entrada]) {
    await client.sendMessage(msg.from, respostas[entrada]); // envia resposta

    if (entrada === "0") {
      // Se for opção 0, encaminha para o atendimento
      const numeroAtendente = "5524981513730@c.us"; // número do atendente
      const numeroCliente = msg.from.replace("@c.us", ""); // número do cliente sem @c.us
      const alerta = `📨 *Novo atendimento solicitado!*\n\nUsuário ${numeroCliente} digitou 0 para falar com um atendente.`;

      await client.sendMessage(numeroAtendente, alerta);
      conversasEncerradas.add(msg.from); // Encerra o bot para essa conversa
      return; // encerra a conversa
    }

    if (entrada === "8") {
      conversasEncerradas.add(msg.from); // Encerra também quando escolhe 8
      return;
    }

    // Ao invés de mandar o menu direto, pergunta se o usuário quer voltar
    await client.sendMessage(
      msg.from,
      `\n❓ Deseja voltar ao menu principal?\nDigite *menu* para ver as opções ou *sair* para encerrar.`
    );
    return;
  }

  if (entrada === "menu") {
    return enviarMenu(msg);
  }

  if (entrada === "sair") {
    await client.sendMessage(msg.from, "✅ Conversa encerrada. Obrigado!");
    conversasEncerradas.add(msg.from);
    return;
  }

  await client.sendMessage(
    msg.from,
    `⚠️ *Opção inválida!*\n\nDigite apenas o número da opção desejada. Exemplo: *1* para "Como funciona".`
  );
  await client.sendMessage(
    msg.from,
    `\n❓ Deseja voltar ao menu principal?\nDigite *menu* para ver as opções ou *sair* para encerrar.`
  );
};

module.exports = { enviarMenu, responderOpcao };
