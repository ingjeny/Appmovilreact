FROM node:20-bullseye

ENV NODE_ENV=development \
    EXPO_NO_TELEMETRY=1 \
    EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 19000 19001 19002 8081

CMD ["npx", "expo", "start", "--host", "0.0.0.0", "--tunnel"]
