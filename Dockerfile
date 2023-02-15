FROM node:16 AS builder

WORKDIR /usr/src/app

COPY src src
COPY package.json ./
COPY yarn.lock ./
COPY tsconfig.json ./

RUN yarn
RUN yarn build

FROM node:16 AS runner

COPY package.json ./
COPY yarn.lock ./

COPY --from=builder /usr/src/app/out ./out

RUN yarn

CMD ["node", "out/index.js"]
