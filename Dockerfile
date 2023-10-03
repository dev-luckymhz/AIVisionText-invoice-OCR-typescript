# Use the official Node.js 17 image as the base image
FROM node:16.15-alpine
LABEL authors="Zo Ambinintsoa"

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./


# Install the app's dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Expose the port your Nest.js app will run on (adjust as needed)
EXPOSE 3000

# Specify the command to run your Nest.js app
CMD ["npm", "run", "start"]