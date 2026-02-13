# Build stage
FROM node:18-alpine AS build

WORKDIR /app

# Copiar arquivos de dependência
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar código fonte
COPY . .

# Produção stage
FROM node:18-alpine

WORKDIR /app

# Copiar apenas o necessário do build
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./
COPY --from=build /app/src ./src

# Expor a porta que o app usa (exemplo 3000)
EXPOSE 3000

# Comando para iniciar
CMD ["npm", "start"]
