# filepath: c:\Users\andrea.zuccotto\Progetti\the-witcher-fight\the-witcher-fight-app\Dockerfile

# Usa un'immagine base di Node.js
FROM node:23-alpine AS base

# Imposta la directory di lavoro
WORKDIR /app

# Copia solo i file necessari per installare le dipendenze
COPY package*.json ./

# Installa le dipendenze e nodemon
RUN npm install -g npm@11.3.0 && npm install && npm install -g nodemon

# Copia il resto dei file dell'applicazione
COPY . .

# Imposta i permessi corretti per i file
RUN chmod -R 755 /app

# Espone la porta su cui l'applicazione sarà in ascolto
EXPOSE 3000

# Comando per avviare l'applicazione in modalità sviluppo con nodemon
CMD ["nodemon", "--watch", ".", "--legacy-watch", "--exec", "next", "dev"]