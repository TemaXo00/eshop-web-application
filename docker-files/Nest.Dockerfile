FROM node:25-alpine

WORKDIR /app/backend

ARG BACKEND_PATH

COPY ${BACKEND_PATH}/package*.json ./
RUN npm ci

COPY ${BACKEND_PATH}/prisma ./prisma
RUN npx prisma generate

COPY ${BACKEND_PATH}/ .

EXPOSE 5173
CMD sh -c "npx prisma db push && npm run start:dev"