# Step 1: Use an official Node.js runtime as a parent image
FROM node:18.17.1
# Create and change to the app directory.
WORKDIR /usr/src/app
 
# Copy application dependency manifests to the container image.
COPY package*.json ./

#to update npm to the latest version.
RUN npm install -g npm@10.5.0 

# Install dependencies
RUN npm install

# Copy local code to the container image.
COPY . .

# Run the postinstall script
RUN npm run postinstall

# Build the application
RUN npm run build

# The application's port.
EXPOSE 5000
# Command to run the application
CMD [ "npm", "run", "start" ]

