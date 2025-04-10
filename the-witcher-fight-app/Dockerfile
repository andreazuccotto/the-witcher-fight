# Usa un'immagine base di Node.js
FROM node:20-alpine

# Imposta la directory di lavoro
WORKDIR /app

# Copia solo i file necessari per installare le dipendenze
COPY package*.json ./

# Installa le dipendenze
RUN npm install -g npm@11.2.0 && npm install

# Installa nodemon come dipendenza globale
RUN npm install -g nodemon

# Copia il resto dei file dell'applicazione
COPY . .

# Espone la porta su cui l'applicazione sarà in ascolto
EXPOSE 3000

# Comando per avviare l'applicazione in modalità sviluppo con nodemon
CMD ["nodemon", "--watch", ".", "--legacy-watch", "--exec", "next", "dev"]