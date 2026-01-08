FROM node:25-alpine

WORKDIR /app

ARG BACKEND_PATH

COPY ${BACKEND_PATH}/package*.json ./
RUN npm ci

COPY ${BACKEND_PATH}/prisma ./prisma
RUN npx prisma generate

COPY ${BACKEND_PATH}/ .

EXPOSE 3000
CMD sh -c "npx prisma migrate deploy && npm run start:dev"