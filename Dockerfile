FROM node:12

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install
#RUN npm ci --only=production

# Copy app files to source
COPY . .

# Expose port 
EXPOSE 3002
# Run app
#CMD [ "node", "server.js"]
CMD [ "npm", "start"]
#USER node