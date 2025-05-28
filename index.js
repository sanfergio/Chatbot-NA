const qrcode = require('qrcode-terminal');
const { Client } = require('whatsapp-web.js');

const client = new Client();
const usuariosAtendidos = new Set();
const tempoInatividade = 5 * 60 * 1000; // 5 minutos
const temporizadores = new Map();

const delay = ms => new Promise(res => setTimeout(res, ms));

const menuPrincipal = `
📋 *Menu Principal - New Andrew's Suplementos* 📋

Escolha uma das opções abaixo:

1️⃣ - Como funciona 🧐  
2️⃣ - Promoções e vantagens 💰  
3️⃣ - Benefícios 💊  
4️⃣ - Como comprar 🛒  
5️⃣ - Outras perguntas ❓  
6️⃣ - Quero ser revendedor/parceiro 🤝  
7️⃣ - Ver catálogo 📘
9️⃣ - Encerrar conversa ❌  
0️⃣ - Falar com a equipe de atendimento 👩‍💼`;

const iniciarTemporizador = (userId, chat) => {
    if (temporizadores.has(userId)) clearTimeout(temporizadores.get(userId));

    const timeout = setTimeout(async () => {
        await chat.sendStateTyping();
        await delay(1000);
        await client.sendMessage(userId, '⌛ A conversa foi encerrada por inatividade. Se precisar de ajuda novamente, é só mandar uma mensagem!');
        usuariosAtendidos.delete(userId);
        temporizadores.delete(userId);
    }, tempoInatividade);

    temporizadores.set(userId, timeout);
};

const enviarMenu = async (msg) => {
    await delay(500);
    await client.sendMessage(msg.from, menuPrincipal);
};

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('✅ Bot conectado com sucesso!');
});

client.initialize();

client.on('message', async msg => {
    const entrada = msg.body.trim().toLowerCase();
    const chat = await msg.getChat();

    iniciarTemporizador(msg.from, chat);

    if (!usuariosAtendidos.has(msg.from)) {
        usuariosAtendidos.add(msg.from);

        await chat.sendStateTyping();
        await delay(2000);
        await client.sendMessage(msg.from,
            `🤖 *Olá! Seja muito bem-vindo(a) ao atendimento da New Andrew's Suplementos!*\n\n` +
            `Aqui você encontrará informações sobre nossos produtos, promoções, formas de compra e muito mais.\n\n`);

        return enviarMenu(msg);
    }

    switch (entrada) {
        case '1':
            await chat.sendStateTyping();
            await delay(1500);
            await client.sendMessage(msg.from,
                `💊 *Como funciona?*\n\nTrabalhamos com suplementos de alta qualidade, preços acessíveis e entrega rápida para todo o Brasil!\n\n1️⃣ Acesse nosso site ou chame um atendente.  \n2️⃣ Escolha seus produtos favoritos.  \n3️⃣ Finalize a compra e receba em casa com segurança!`);
            return enviarMenu(msg);

        case '2':
            await chat.sendStateTyping();
            await delay(1500);
            await client.sendMessage(msg.from,
                `🎉 *Promoções especiais do mês!*\n\n🚚 Frete *GRÁTIS* em *QUALQUER* compra! \n🎁 Na compra de *3 produtos*, o *4º é grátis*!\n\nConfira todas no nosso site 👉 https://newandrews.com.br`);
            return enviarMenu(msg);

        case '3':
            await chat.sendStateTyping();
            await delay(1500);
            await client.sendMessage(msg.from,
                `✨ *Benefícios dos nossos produtos:*\n\n✅ Suplementos aprovados pela Anvisa  \n✅ Qualidade premium com preço acessível  \n✅ Entrega rápida e grátis para todo o Brasil\n✅ Produzimos nossos próprios produtos\n✅ Garantia de satisfação ou seu dinheiro de volta\n✅ Suporte especializado para tirar suas dúvidas`);
            return enviarMenu(msg);

        case '4':
            await chat.sendStateTyping();
            await delay(1500);
            await client.sendMessage(msg.from,
                `🛒 *Como comprar?*\n\nVocê pode comprar diretamente pelo nosso site com total segurança.\n\n👉 Acesse agora: https://newandrews.com.br`);
            return enviarMenu(msg);

        case '5':
            await chat.sendStateTyping();
            await delay(1500);
            await client.sendMessage(msg.from,
                `❓ *Outras dúvidas?*\n\nVocê deseja ser atendido(a) pela nossa equipe de atendimento?\n\nDigite *0* para conversar com um atendente agora mesmo. 👩‍💼`);
            return enviarMenu(msg);

        case '6':
            await chat.sendStateTyping();
            await delay(1500);
            await client.sendMessage(msg.from,
                `🤝 *Revenda, distribuição e parcerias:*\n\nTem interesse em revender ou distribuir nossos produtos? Ótimo!\n\nClique no link abaixo e fale com nosso consultor:\n\n👉 https://api.whatsapp.com/send/?phone=5521979089061&text=Olá%21+Tenho+interesse+em+me+tornar+revendedor+ou+parceiro+da+New+Andrew\'s+Suplementos&app_absent=0`);
            return enviarMenu(msg);

        case '7':
            await chat.sendStateTyping();
            await delay(1500);
            await client.sendMessage(msg.from,
                `📘 *Confira nosso catálogo completo de produtos no link abaixo:*\n\n👉 ${'https://www.canva.com/design/DAGKvqOdiGc/7qEKsItG3Udb_Y6lnWNo8w/view?utm_content=DAGKvqOdiGc&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=hb5a073ccf5'}`);
            return enviarMenu(msg);

        case '9':
            await chat.sendStateTyping();
            await delay(1000);
            await client.sendMessage(msg.from, '✅ A conversa foi encerrada com sucesso. Quando quiser voltar, é só mandar uma nova mensagem!');
            usuariosAtendidos.delete(msg.from);
            temporizadores.delete(msg.from);
            return;

        case '0':
            await chat.sendStateTyping();
            await delay(1500);
            await client.sendMessage(msg.from,
                `👩‍💼 *Encaminhando para atendimento...*\n\nAguarde um momento que nossa equipe irá te responder diretamente por aqui.`);
            return;

        default:
            await chat.sendStateTyping();
            await delay(1500);
            await client.sendMessage(msg.from,
                `⚠️ *Opção inválida!*\n\nDigite apenas o número da opção desejada. Exemplo: *1* para "Como funciona".`);
            return enviarMenu(msg);
    }
});
