// Waits until html is finished loading then starts JS

$(document).ready(function(){

	//game object to contain variables and methods

	var game = {

		// variable for firebase app

		dataInfo: new Firebase("https://rpslsp.firebaseio.com/"),

		// Array with game pieces

		pieces: [
			{name: "rock",
			image: "<img src='assets/images/rock.png'>"},
			{name: "scissors",
			image: "<img src='assets/images/scissors.png'>"},
			{name: "paper",
			image: "<img src='assets/images/paper.png'>"},
			{name: "lizard",
			image: "<img src='assets/images/lizard.png'>"},
			{name: "spork",
			image: "<img src='assets/images/spork.png'>"},
			],

		// variables used for player objects

		name: "",

		pick: "",

		wins: 0,

		losses: 0,

		ties: 0,

		player: 1,

		// When name is entered create an object in firebase with name losses wins and ties...in addition create text instead of login box that says, "Hi obj.name! You are player 1. (It's your turn![only after player 2 has joined])" or "Hi obj.name! You are player 2. You are waiting for player 1 to make their choice."....also prints obj.name, choices (r,p,s,l,sp[only after player 2 has logged in as well]), and wins, losses and ties in that order...Also highlights by changin the border color of the player whos turn it is. Once both have joined make turn counter in firebase.

		connect: function() {

			$("#connect").on('click', function() {

				game.name = $("#name-input").val().trim();

				console.log(game.name);

				// pushes data to firebase

				game.dataInfo.push({
					name: game.name,
					pick: game.pick,
					wins: game.wins,
					losses: game.losses,
					ties: game.ties,
					player: game.player
				});

				// if player is 1 then add 1, else subtract 1

				if (game.player == 1) {
					game.player++;
				}

				else {
					game.player--;
				}

				// Doesn't refresh the forms

				return false;

			}); // ends on click for the #connect button

		}, // end of connect function

		// does this function whenever a value in firebase changes

		fireData: function() {
			game.dataInfo.on('value', function(snapshot) {

				console.log(snapshot.val());

			}, function (errorObject) {
				console.log("The read failed: " + errorObject.code);
			})
		},

	} // Ends game object

	// When name is entered create an object in firebase with name losses wins and ties...in addition create text instead of login box that says, "Hi obj.name! You are player 1. (It's your turn![only after player 2 has joined])" or "Hi obj.name! You are player 2. You are waiting for player 1 to make their choice."....also prints obj.name, choices (r,p,s,l,sp[only after player 2 has logged in as well]), and wins, losses and ties in that order...Also highlights by changin the border color of the player whos turn it is. Once both have joined make turn counter in firebase.

	game.connect();
	
	game.fireData();


	// When name is entered create an object in firebase with name losses wins and ties...in addition create text instead of login box that says, "Hi obj.name! You are player 1. (It's your turn![only after player 2 has joined])" or "Hi obj.name! You are player 2. You are waiting for player 1 to make their choice."....also prints obj.name, choices (r,p,s,l,sp[only after player 2 has logged in as well]), and wins, losses and ties in that order...Also highlights by changin the border color of the player whos turn it is. Once both have joined make turn counter in firebase.

	// Player 1 picks their choice showing them what they chose, but not player 2. Their choice is added to firebase. The turn counter goes up highlighting the other players play area.

	// PLayer 2 picks and their play area is updated with their choice. Their choice is added to firebase. This triggers the showing of both players choices in their respective boxes and who won in the middle box. This also makes the win/loss/tie counters go up

	// After a period of 5ish seconds it the game resets back to after both players logged in, but wins and losses stay the same

	// Players can leave by refreshing (look into having a leave button) which removes their object from firebase. This sends a disconnect message in the chat box based on obj.name (or just a message on the html somewhere if I dont get chat working)

	// create a chat box with form to type and send button. When the send button is clicked move the value to the chatbox and firebase with a obj.name: in front of it and a color based on the player that typed it in....IF there are not curse words in it. Else fill in "My vocabulary isn't big enough to say something of importance. :("



}); // Ends document.ready function