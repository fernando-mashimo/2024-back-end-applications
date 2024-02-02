FROM public.ecr.aws/lambda/nodejs:18
# Crie e navegue para o diretório de trabalho
WORKDIR /app

# Copie o package.json e o package-lock.json para o diretório de trabalho
COPY package*.json ./

RUN npm install

RUN npm install -g prisma@5.3.0

COPY . .

RUN prisma generate

RUN npm run build

EXPOSE 3000

CMD ["/app/dist/serverless.handler"]