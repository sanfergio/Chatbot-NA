// bot/handlers.js

const { client } = require("./client");
const { menuPrincipal } = require("./menu");
// Importa os estados para poder manipulá-los
const {
  usuariosAtendidos,
  atendimentoHumano,
  temporizadores,
} = require("./state");

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const enviarMenu = async (msg) => {
  await delay(500);
  await client.sendMessage(msg.from, menuPrincipal);
};

// A função agora recebe 'atendimentoHumano' para poder alterá-lo
const responderOpcao = async (entrada, msg, chat) => {
  await chat.sendStateTyping();
  await delay(1500);

  const respostas = {
    // As respostas de 1 a 7 continuam as mesmas
    1: `💊 *Como funciona?*\n\nTrabalhamos com suplementos de alta qualidade, preços acessíveis e entrega rápida para todo o Brasil!\n\n1️⃣ Acesse nosso site ou chame um atendente.  \n2️⃣ Escolha seus produtos favoritos.  \n3️⃣ Finalize a compra e receba em casa com segurança!`,
    2: `🎉 *Promoções especiais do mês!*\n\n🚚 Frete *GRÁTIS* em *QUALQUER* compra! \n🎁 Na compra de *3 produtos*, o *4º é grátis*!\n\nConfira todas no nosso site 👉 https://newandrews.com.br`,
    3: `✨ *Benefícios dos nossos produtos:*\n\n✅ Suplementos aprovados pela Anvisa  \n✅ Qualidade premium com preço acessível  \n✅ Entrega rápida e grátis para todo o Brasil\n✅ Produzimos nossos próprios produtos\n✅ Garantia de satisfação ou seu dinheiro de volta\n✅ Suporte especializado para tirar suas dúvidas`,
    4: `🛒 *Como comprar?*\n\nVocê pode comprar diretamente pelo nosso site com total segurança.\n\n👉 Acesse agora: https://newandrews.com.br`,
    5: `❓ *Outras dúvidas?*\n\nVocê deseja ser atendido(a) pela nossa equipe de atendimento?\n\nDigite *0* para conversar com um atendente agora mesmo. 👩‍💼`,
    6: `🤝 *Revenda, distribuição e parcerias:*\n\nTem interesse em revender ou distribuir nossos produtos? Ótimo!\n\nClique no link abaixo e fale com nosso consultor:\n\n👉 https://api.whatsapp.com/send/?phone=5521979089061&text=Olá%21+Tenho+interesse+em+me+tornar+revendedor+ou+parceiro+da+New+Andrew\'s+Suplementos&app_absent=0`,
    7: `📘 *Confira nosso catálogo completo de produtos no link abaixo:*\n\n👉 ${"https://www.canva.com/design/DAGKvqOdiGc/7qEKsItG3Udb_Y6lnWNo8w/view?utm_content=DAGKvqOdiGc&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=hb5a073ccf5"}`,
    // Alteramos a lógica das opções 8 e 0
    8: `✅ Conversa encerrada. Quando quiser voltar, é só mandar uma nova mensagem!`,
    0: `👩‍💼 *Encaminhando para atendimento...*\n\nAguarde um momento que nossa equipe irá te responder diretamente por aqui.`,
  };

  if (respostas[entrada]) {
    await client.sendMessage(msg.from, respostas[entrada]);

    // *** LÓGICA ALTERADA ***
    if (entrada === "0") {
      const numeroAtendente = "5524981513730@c.us";
      const numeroCliente = msg.from.replace("@c.us", "");
      const alerta = `📨 *Novo atendimento solicitado!*\n\nUsuário ${numeroCliente} digitou 0 para falar com um atendente.`;

      await client.sendMessage(numeroAtendente, alerta);
      // Coloca o usuário no modo "atendimento humano" (bot pausado)
      atendimentoHumano.add(msg.from);
      return;
    }

    if (entrada === "8") {
      // Apenas reseta o estado do usuário para que ele comece do zero na próxima vez
      usuariosAtendidos.delete(msg.from);
      if (temporizadores.has(msg.from)) {
        clearTimeout(temporizadores.get(msg.from));
        temporizadores.delete(msg.from);
      }
      return;
    }

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
    // Reseta o estado do usuário
    usuariosAtendidos.delete(msg.from);
    if (temporizadores.has(msg.from)) {
      clearTimeout(temporizadores.get(msg.from));
      temporizadores.delete(msg.from);
    }
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
