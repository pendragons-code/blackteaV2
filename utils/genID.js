const listOfAllRooms = require("../loaders/socketEvents.js");

function generateRoomID(creatorID) {
	let discriminator = Math.floor(Math.random() * 100) + 1;
	let roomID = `${creatorID}#${discriminator}`;
	if(listOfAllRooms[roomID]) return generateRoomID(creatorID);
	return roomID;
}

module.exports = { generateRoomID };