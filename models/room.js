const { maxExistenceDurationHours } = require("../config/config.json");
const listOfAllRooms = require("../loaders/socketEvents.js");

class gameRoom {
	constructor(creatorID, roomID) {
		this.roomID = roomID;
		this.creatorID = creatorID;
		this.gameRunning = false;
		this.gameEnded = false;
		this.gameStarted = false;
		this.players = {
			[creatorID]: {
				score: 0,
				playerIndex: 1
			}
		};
		this.createdTime = new Date();
		this.expiryTime = new Date();
		this.expiryTime.setHours(this.expiryTime.getHours() + maxExistenceDurationHours);
		this.numberOfUniqueIDs = 1; // this tracks the number of players that have joined the room and will track by using unique ids, this is important as we can use this to assign a player an index
		this.numberOfOnlinePlayers = 1; // this tracks the number of players that are online in the room
		this.playersThatLost = new Set();
		this.winner = "";
		this.playersDoneSettingFood = 0;
		this.currentTurn = creatorID;
		this.usedWords = new Set();
	}

	idToIndex(playerID) {
		let number = this.players[`${playerID}`].playerIndex;
		return number;
	}

}