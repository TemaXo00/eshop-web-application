FROM node:25-alpine

WORKDIR /app/backend

COPY package*.json ./
RUN npm ci

COPY prisma ./prisma
RUN npx prisma generate

COPY . .

EXPOSE 3000
CMD sh -c "npx prisma migrate deploy && npm run start:dev"