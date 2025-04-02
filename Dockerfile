FROM node:20-alpine
WORKDIR /app
COPY package*.json .
RUN npm ci --omit=dev
COPY src ./src
EXPOSE 3000
USER node
CMD ["npm", "start"]
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 CMD wget -qO- http://localhost:3000/health || exit 1