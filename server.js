const express = require("express");
const QRCode = require("qrcode");
const { iniciarBot, getQR } = require("./bot/client");

const app = express();
const PORT = 3000;

app.get("/", async (req, res) => {
  const qr = getQR();

  if (!qr) {
    return res.send("<h2>✅ Bot conectado com sucesso!</h2>");
  }

  const qrImage = await QRCode.toDataURL(qr);

  res.send(`
    <h1>📱 Escaneie o QR Code</h1>
    <img src="${qrImage}" />
    <p>Atualize a página se necessário.</p>
  `);
});

app.listen(PORT, () => {
  console.log(`🌐 http://localhost:${PORT}`);
  iniciarBot();
});
