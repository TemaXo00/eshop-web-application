FROM node:25-alpine

WORKDIR /app/ui

ARG UI_PATH

COPY ${UI_PATH}/package*.json ./
RUN npm ci

COPY ${UI_PATH}/ .

EXPOSE 3000
CMD sh -c "npm run dev -- --host"