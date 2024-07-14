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
		this.winner = "";
		this.playersDoneSettingFood = 0;
		this.currentTurn = creatorID;
		this.usedWords = new Set();
	}

	idToIndex(playerID) {
		try {
			let number = this.players[`${playerID}`].playerIndex;
			return number;
		} catch (e) {
			logError(e);
			io.to(this.roomID).emit("redirectToMain", "An Unknown server side error has occured.");
		}
	}

	broadcast(eventName, details) {
		try {
			if(details) return io.to(this.roomID).emit(eventName, details);
			return io.to(this.roomID).emit(eventName);
		} catch (e) {
			logError(e);
			io.to(this.roomID).emit("redirectToMain", "An Unknown server side error has occured.");
		}
	}

	sendToPlayer(playerID, eventName, details) {
		try {
			if(!details) return io.to(playerID).emit(eventName);
			return io.to(playerID).emit(eventName, details);
		} catch (e) {
			logError(e);
			io.to(this.roomID).emit("redirectToMain", "An Unknown server side error has occured.");
		}
	}

	async addPlayer(playerID) {
		try {
			++this.numberOfOnlinePlayers;
			++this.numberOfUniqueIDs;
			this.players[`${playerID}`] = {
				score: 0,
				playerIndex: this.numberOfUniqueIDs
			}
			await this.broadcast("newPlayerJoined", { playerNumber: this.idToIndex(this.players[`${playerID}`]) }); // I am not accessing this.numberOfUniqueIDs directly to avoid concurrency issues
		} catch (e) {
			logError(e);
			io.to(this.roomID).emit("redirectToMain", "An Unknown server side error has occured.");
		}
	}

	// remove player
	async removePlayer(playerID) {
		try {
			delete this.players[`${playerID}`];
			--this.numberOfOnlinePlayers;
			await this.broadcast("playerLeft", { playerIndex: this.idToIndex(playerID) });
			if(this.numberOfOnlinePlayers < 2 && this.gameRunning) {
				let roomID = this.roomID;
				this.broadcast("playerCountLow");
				console.log(`closing ${roomID}`);
				await delete rooms[roomID];
				console.log(`closed`);
			}
		} catch (e) {
			logError(e);
			io.to(this.roomID).emit("redirectToMain", "An Unknown server side error has occured.");
		}
	}

	// next turn
	nextTurn(playerID) {
		let playerArray = Object.keys(this.players);
		currentIndex = playerArray.indexOf(this.currentTurn);
		
		let nextTurnIndex = currentIndex + 1;
		if(currentIndex >= playerArray.length) nextTurnIndex = 0; // wrapping

		this.currentTurn = playerArray[`${nextTurnIndex}`];
		let playerNextNumber = this.idToIndex(this.currentTurn);

		this.broadcast("nextTurn", { playerNextNumber });
		this.sendToPlayer(this.currentTurn, "yourTurn");
	}

	// start game
	// end game
	// add points
	// playRound

	// winner
	async determineWinner() {
		try {
			let highestScore = 0;
			let playersWithHighestScore = [];
			for(let player in scores) {
				if(scores.hasOwnProperty(player)) {
					let score = scores[player].score;
					if(score > highestScore) {
						highestScore = score;
						playersWithHighestScore = [player];
					} else if(score === highestScore) {
						playersWithHighestScore.push(player);
					}
				}
			}
			// the results return IDs and this is a note to people before using, remember to convert to player Indexes
			if(playersWithHighestScore.length > 1) return { playersWithHighestScore: playersWithHighestScore, victoryStatus: "tie" }; // returns an array e.g. [player1ID player2ID]
			return { playersWithHighestScore: playersWithHighestScore, victoryStatus: "win" }; // returns an array also e.g.[player1ID]
		} catch (e) {
			logError(e);
			io.to(this.roomID).emit("redirectToMain", "An Unknown server side error has occured.");
		}
	}
}

module.exports = gameRoom;