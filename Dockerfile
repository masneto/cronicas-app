FROM node:20 
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
ENV NODE_ENV=production
USER node
CMD ["npm", "start"]