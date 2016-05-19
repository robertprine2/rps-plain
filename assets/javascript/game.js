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
			image: "<img src='assets/images/spork.png'>"}
			],

		// variables used for player objects

		name: "",

		pick: "",

		wins: 0,

		losses: 0,

		ties: 0,

		name2: "",

		pick2: "",

		wins2: 0,

		losses2: 0,

		ties2: 0,

		turn: 0,

		players: 'players',

		player1: 1,

		player2: 2,

		// When name is entered create an object in firebase with name losses wins and ties...in addition create text instead of login box that says, "Hi obj.name! You are player 1. (It's your turn![only after player 2 has joined])" or "Hi obj.name! You are player 2. You are waiting for player 1 to make their choice."....also prints obj.name, choices (r,p,s,l,sp[only after player 2 has logged in as well]), and wins, losses and ties in that order...Also highlights by changin the border color of the player whos turn it is. Once both have joined make turn counter in firebase.

		connect: function() {

			$("#connect").on('click', function() {
game.dataInfo.update({
	turn: game.turn
}); //  end firebase update
				// assigns user input as game.name

				game.name = $("#name-input").val().trim();

				game.dataInfo.once("value", function(snapshot) {

					var exists = snapshot.child(game.players).exists();
					var full = snapshot.child(game.players).child(game.player2).exists();
					game.assignPlayer(game.name, game.dataInfo, exists, full);

					
				}); // end of game.dataInfo.once

				// Doesn't refresh the forms

				return false;

			}); // ends on click for the #connect button

		}, // end of connect function

		// does this function to assign players their own objects or tell them that the game is full

		assignPlayer: function(name, dataInfo, exists, full) {

			var playersRef = game.dataInfo.child(game.players);

			// if player 2

			if (exists && !full) {
				
				var player2Ref = playersRef.child(game.player2);
				player2Ref.set({
					name: game.name,
					pick: game.pick,
					wins: game.wins,
					losses: game.losses,
					ties: game.ties
				});

				game.changeDom2();

			} // end if exists and not full (player2)

			// else if no spots are left (already two people playing)

			else if(full) {
				
				alert('The game is full, try again later.');
			
			} // end of else if full

			else {

				var player1Ref = playersRef.child(game.player1);

				player1Ref.set({
					name: game.name,
					pick: game.pick,
					wins: game.wins,
					losses: game.losses,
					ties: game.ties
				});

				game.changeDom1();

			} // end of else player1

		}, // end of assignPlayer function

		changeDom1: function() {

			// changes the dom to match changes in firebase for player 1

			game.dataInfo.once("value", function(snapshot) {

				// replaces name input with 
				game.turn = snapshot.val().turn;

				$("#nameForm").html("Hi " + game.name + "! You are player 1.");

				// Changes what is in player1

				$("#wait1").html("<h3>" + game.name + "</h3");

				for (var i = 0; i < game.pieces.length; i++) {

					var p = $('<button>');
					p.addClass("piece");
					p.attr('data-index', i);
					p.attr('data-name', game.pieces[i].name);
					p.append('<p>' + game.pieces[i].name + '</p>');
					p.append(game.pieces[i].image);

					$("#choices1").append(p);

				} // ends for loop

				$("#score1").html("<p>Wins: "+ game.wins + " Losses: " + game.losses + " Ties: " + game.ties + "</p>");

				$("#disconnect1").html("<button id='disconnectBut1'>Disconnect</button>");

				// prints player 2's information to DOM

				game.player2Here();

			});

		}, // End of changeDom1 function

		changeDom2: function() {

			// changes the dom to match changes in firebase for player 2

			game.dataInfo.once("value", function(snapshot) {

				// replaces name input with 

				$("#nameForm").html("Hi " + game.name + "! You are player 2.");

				// Changes what is in player2

				$("#wait2").html("<h3>" + game.name + "</h3");

				for (var i = 0; i < game.pieces.length; i++) {

					var p = $('<button>');
					p.addClass("piece");
					p.attr('data-index', i);
					p.attr('data-name', game.pieces[i].name);
					p.append('<p>' + game.pieces[i].name + '</p>');
					p.append(game.pieces[i].image);

					$("#choices2").append(p);

				} // ends for loop

				$("#score2").html("<p>Wins: "+ game.wins + " Losses: " + game.losses + " Ties: " + game.ties + "</p>");

				// prints player 1's name over "waiting for player 1" in player 2's DOM

				$("#wait1").html("<h3>" + snapshot.val().players[1].name + "</h3");

				// make player 2's DOM change the div height to keep score at the bottom for player 1

				$("#choices1").addClass('heightHack');

				$("#disconnect2").html("<button id='disconnectBut2'>Disconnect</button>");

				// change player 2's DOM score for player 1

				$("#score1").html("<p>Wins: "+ snapshot.val().players[1].wins + " Losses: " + snapshot.val().players[1].losses + " Ties: " + snapshot.val().players[1].ties + "</p>");

			});

		}, // End of changeDom2 function

		// checks if player2 has joined then updates player1's DOM with player 2's information

		player2Here: function() {

			// ******updates on all value changes. This could be a waste of space, but if I use once it hits before player 2 joins and then doesn't listen anymore.

			game.dataInfo.on("value", function(snapshot) {

				// variable to see if player2 is in firebase

				var full = snapshot.child(game.players).child(game.player2).exists();

				// if player 2 is in firebase then run this code

				if (full) {

					// change player 1's DOM name for player 2

					$("#wait2").html("<h3>" + snapshot.val().players[2].name + "</h3");

					// make player 1's DOM change the div height to keep score at the bottom for player 2

					$("#choices2").addClass('heightHack');

					// change player 1's DOM score for player 2

					$("#score2").html("<p>Wins: "+ snapshot.val().players[2].wins + " Losses: " + snapshot.val().players[2].losses + " Ties: " + snapshot.val().players[2].ties + "</p>");

				} // End of if statment that checks if player 2 is in firebase

			}); // End of dataInfo once

		}, // End of player2Here function

		// Player 1 and Player 2 pick rock, paper, scissors, lizard, or spork

		choice: function() {

			var playersRef = game.dataInfo.child(game.players);

			var player1Ref = playersRef.child(game.player1);

			// add turn to firebase

			game.turn++;

			game.dataInfo.update({
				turn: game.turn
			}); //  end firebase update				

			// if it is turn 1 then player 1 picks

			if (game.turn == 1) {

				// on click for player 1 choice

				$("#choices1").on('click', '.piece', function() {

					// updates the pick for player 1 in firebase

					player1Ref.update({pick: $(this).data('name')});

					$('#choices1').children().not(this).hide();

					game.turn++;

					// update turn to firebase

					game.dataInfo.update({
						turn: game.turn
					}); //  end firebase update

				}); // end of on click for player 1 choice

			} // end of if player 1 hasn't picked

		}, // end of choice function	

		choice2: function() {
console.log("I made it!");

			var playersRef = game.dataInfo.child(game.players);

			var player2Ref = playersRef.child(game.player2);

			// on click for player 2 choice

			$('#choices2').on('click', '.piece', function() {

				// updates the pick for player 2 in firebase

				player2Ref.update({pick: $(this).data('name')});

				$('#choices2').children().not(this).hide();

				game.turn++;

				// update turn to firebase

				game.dataInfo.update({
					turn: game.turn
				}); //  end firebase update

				//******** call logic

			}); // end of click for player 2 choice	

		}, // end of choice2 function

		// updates local variables within game object from firebase

		updateVar: function () {

			game.dataInfo.on("value", function(snapshot) {

				game.turn = snapshot.val().turn;
				console.log(game.turn);
				game.pick = snapshot.val().players[1].pick;
				console.log(game.pick);
				game.pick2 = snapshot.val().players[2].pick;
				console.log(game.pick2);
				game.wins = snapshot.val().players[1].wins;
				console.log(game.wins);
				game.losses = snapshot.val().players[1].losses;
				console.log(game.losses);
				game.ties = snapshot.val().players[1].ties;
				console.log(game.ties);
				game.wins2 = snapshot.val().players[2].wins;
				console.log(game.wins2);
				game.losses2 = snapshot.val().players[2].losses;
				console.log(game.losses2);
				game.ties2 = snapshot.val().players[2].ties;
				console.log(game.ties2);

				// if it is turn 2 then player 2 picks

				if (game.turn == 2) {
					game.choice2();
				} // end if it is turn 2 then player 2 picks

			});

		}, // end updateVar function

		// logic for who wins in the game

		logic: function(p1, p2) {
			// if (turn == 3) {

			// }
			// game.dataInfo.on("value", function(snapshot) {

			// // variable to see if player2 is in firebase

			// 	var full = snapshot.child(game.players).child(game.player2).exists();

			// 	// if player 2 has made a pick

			// 	if (full) {

			// 		// make less typing for me

			// 		var p1 = snapshot.val().players[1].pick;

			// 		var p2 = snapshot.val().players[2].pick;

			// 		console.log(p1, p2);
				
			// 		if (p1 == p2) {

			// 		}

			// 	} // end of if player 2 has made a pick

			// }); // end of dataInfo on

		}, // end of logic function

		disconnect: function () {

			$("#disconnectBut1").on('click', function() {

				var playersRef = game.dataInfo.child(game.players);
				var player1Ref = playersRef.child(game.player1);
				var player2Ref = playersRef.child(game.player2);
				
				playersRef.remove();

				game.data.Info.child(turn)

			});

		},

	} // Ends game object

	

	// When name is entered create an object in firebase with name losses wins and ties...in addition create text instead of login box that says, "Hi obj.name! You are player 1. (It's your turn![only after player 2 has joined])" or "Hi obj.name! You are player 2. You are waiting for player 1 to make their choice."....also prints obj.name, choices (r,p,s,l,sp[only after player 2 has logged in as well]), and wins, losses and ties in that order...Also highlights by changin the border color of the player whos turn it is. Once both have joined make turn counter in firebase.

	game.connect();

	// calls choice function so player1 can choose a button, then player 2, then logic is run

	game.choice();

	// updates game variables

	game.updateVar();

	// Player 1 picks their choice showing them what they chose, but not player 2. Their choice is added to firebase. The turn counter goes up highlighting the other players play area.

	// PLayer 2 picks and their play area is updated with their choice. Their choice is added to firebase. This triggers the showing of both players choices in their respective boxes and who won in the middle box. This also makes the win/loss/tie counters go up

	

	// After a period of 5ish seconds it the game resets back to after both players logged in, but wins and losses stay the same

	// Players can leave by refreshing (look into having a leave button) which removes their object from firebase. This sends a disconnect message in the chat box based on obj.name (or just a message on the html somewhere if I dont get chat working)

	// create a chat box with form to type and send button. When the send button is clicked move the value to the chatbox and firebase with a obj.name: in front of it and a color based on the player that typed it in....IF there are not curse words in it. Else fill in "My vocabulary isn't big enough to say something of importance. :("



}); // Ends document.ready function