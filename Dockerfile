FROM node:latest

# Create the gameRoomSystem's directory
RUN mkdir -p /usr/src/gameRoomSystem
WORKDIR /usr/src/gameRoomSystem

COPY package.json /usr/src/gameRoomSystem
RUN npm install
RUN npm i -g pm2

COPY . /usr/src/gameRoomSystem

EXPOSE 5678

# Start the gameRoomSystem.
CMD ["npm", "run", "deploy"]