FROM public.ecr.aws/lambda/nodejs:18
# Crie e navegue para o diretório de trabalho
WORKDIR /usr/src/app

# Copie o package.json e o package-lock.json para o diretório de trabalho
COPY package*.json ./

RUN npm install

# Instale as dependências do projeto
COPY . .

EXPOSE 3000

CMD ["/usr/src/app/dist/serverless.handler"]