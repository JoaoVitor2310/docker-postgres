# Selects the image/package we are going to use
FROM node:16 
# Chooses the working directory off our container 
WORKDIR /usr/src/app
# Now we are going to copy all the "package" files from our localhost to our workdir virtual machine
COPY package*.json ./
# Runs the command to install all the dependencies 
RUN npm install
# Copies all the files from our localhost to our workdir virtual machine
COPY . .
# Exposes the port of the container to access from outside(local machine)
EXPOSE 3000
# Specifies the command to run when the Docker container is started from the image
CMD ["npm", "run", "dev"]
