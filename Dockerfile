FROM node:16

RUN apt-get update
RUN apt-get install ghostscript --yes
RUN apt-get install graphicsmagick --yes

COPY . ./app
WORKDIR /app

RUN yarn install

CMD ["yarn", "dev"]