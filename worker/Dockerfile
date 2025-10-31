FROM node:18-bullseye
RUN apt-get update && apt-get install -y poppler-utils imagemagick libfontconfig1 --no-install-recommends && rm -rf /var/lib/apt/lists/*
WORKDIR /worker
COPY package.json package-lock.json* ./
RUN npm ci --only=production
COPY . .
EXPOSE 8080
CMD ["node", "index.js"]
