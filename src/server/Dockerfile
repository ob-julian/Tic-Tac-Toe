# https://hub.docker.com/_/node to select a new version
FROM node:21

# Create app directory
WORKDIR /usr/src/

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install Production dependencies
RUN npm install --only=production

# Copy all Server files
COPY server/ server/

# Config files will not be copied for Docker
# To Configure the app, use Environment Variables
# Look at the main README.md for more information

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Set the NODE_ENV to production
ENV NODE_ENV=production

# Run the app
CMD [ "node", "." ]