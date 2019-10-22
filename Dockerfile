FROM node:current-alpine

# Create app directory
WORKDIR /usr/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY . .

# RUN npm
RUN npm install

ENV NODE_ENV production

EXPOSE 3001
CMD [ "npm", "start" ]