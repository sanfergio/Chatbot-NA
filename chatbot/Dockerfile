# Usar imagem Node.js
FROM node:18-alpine

# Criar diretório da app
WORKDIR /app

# Copiar package.json e yarn.lock
COPY package.json yarn.lock ./

# Instalar dependências
RUN yarn install --production

# Copiar o restante do código
COPY . .

# Expor a porta
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["yarn", "start"]
