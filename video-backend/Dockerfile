FROM node:20-slim

# Install ffmpeg + python (needed for some ffmpeg operations)
RUN apt-get update && apt-get install -y \
    ffmpeg \
    ca-certificates \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app/video-backend

COPY video-backend/package*.json ./
RUN npm install --omit=dev

COPY video-backend/ .

# Temp directory for video processing
RUN mkdir -p /tmp/video-studio /app/video-backend/assets/music

EXPOSE 3001

CMD ["node", "server.js"]
