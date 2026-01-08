FROM node:25-alpine

WORKDIR /app

ARG UI_PATH

COPY ${UI_PATH}/package*.json ./
RUN npm ci

COPY ${UI_PATH}/ .

EXPOSE 5173
CMD sh -c "npm run dev -- --host"