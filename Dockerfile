FROM node:20.17.0-bullseye
WORKDIR /app

COPY package*.json ./
RUN npm install -g vite
RUN npm install

COPY . .

#RUN npm run dev
# Copiar wait-for-it.sh al contenedor
COPY wait-for-it/wait-for-it.sh /usr/local/bin/wait-for-it.sh

RUN chmod +x /usr/local/bin/wait-for-it.sh

#Cambiar despues en produccion
CMD ["npm","run","dev"]


