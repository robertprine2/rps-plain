// Waits until html is finished loading then starts JS

$(document).ready(function(){

	//game object to contain variables and methods

	var game = {

		// variable for firebase app

		dataInfo: new Firebase("https://rpslsp.firebaseio.com/"),

		dataChat: new Firebase("https://chatrps.firebaseio.com/"),

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

		time: "",

		myName: "",

		message: "",

		userId: "",

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

				game.myname = $("#name-input").val().trim();

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

				game.userId = 1;

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

					$("#choices1").addClass('heightHack');
					$("#choices1").append(p);

				} // ends for loop

				$("#score1").html("<p>Wins: "+ game.wins + " Losses: " + game.losses + " Ties: " + game.ties + "</p>");

				$('#winner').html("<p>It is " + game.name + "'s turn.</p>")

				$("#disconnect1").html("<button id='disconnectBut1'>Disconnect</button>");

				// prints player 2's information to DOM

				game.player2Here();

			});

		}, // End of changeDom1 function

		changeDom2: function() {

			// changes the dom to match changes in firebase for player 2

			game.dataInfo.once("value", function(snapshot) {

				$('#winner').html("<p>It is " + game.name + "'s turn.</p>")

				// replaces name input with 

				$("#nameForm").html("Hi " + game.name2 + "! You are player 2.");

				game.userId = 2;

				// Changes what is in player2

				$("#wait2").html("<h3>" + game.name2 + "</h3");

				for (var i = 0; i < game.pieces.length; i++) {

					var p = $('<button>');
					p.addClass("piece");
					p.attr('data-index', i);
					p.attr('data-name', game.pieces[i].name);
					p.append('<p>' + game.pieces[i].name + '</p>');
					p.append(game.pieces[i].image);

					$("#choices2").addClass('heightHack');
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

					// hides all choices but player pick

					$('#choices1').children().not(this).hide();

					// saves button
// ****** tried to allow for you to see opponents button they chose
					// $(this).addClass('p1Pick');

					// $(this).attr('data-pick', game.pieces[$(this).data('index')]);

					game.turn++;

					// update turn to firebase

					game.dataInfo.update({
						turn: game.turn
					}); //  end firebase update

				}); // end of on click for player 1 choice

			} // end of if player 1 hasn't picked

		}, // end of choice function	

		choice2: function() {

			$('#winner').html("<p>It is " + game.name2 + "'s turn.</p>")

			var playersRef = game.dataInfo.child(game.players);

			var player2Ref = playersRef.child(game.player2);

			// on click for player 2 choice

			$('#choices2').on('click', '.piece', function() {

				// updates the pick for player 2 in firebase

				player2Ref.update({pick: $(this).data('name')});

				// saves button for pick
// ****** tried to allow for you to see opponents button they chose
				// $(this).addClass('p2Pick');

				// $(this).attr('data-pick', game.pieces[$(this).data('index')]);

				// hides all choices but player pick

				$('#choices2').children().not(this).hide();

				game.turn++;

				// update turn to firebase

				game.dataInfo.update({
					turn: game.turn
				}); //  end firebase update

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
				game.name = snapshot.val().players[1].name;
				game.name2 = snapshot.val().players[2].name;
				// if it is turn 2 then player 2 picks

				if (game.turn == 2) {
					game.choice2();
				} // end if it is turn 2 then player 2 picks

				// if both players have picked compare choices

				if (game.turn == 3) {
					game.logic();
				} // end of if turn 3

			}); // end dataInfo value

		}, // end updateVar function

		// logic for who wins in the game

		logic: function() {

			// make less typing for me

			var p1 = game.pick;

			var p2 = game.pick2;

			var playersRef = game.dataInfo.child(game.players);

			var player1Ref = playersRef.child(game.player1);

			var player2Ref = playersRef.child(game.player2);

			game.turn++;

			game.dataInfo.update({
				turn: game.turn
			}); //  end firebase update
			
		
			// if it's a tie

			if (p1 == p2) {

				// put "It's a tie!" on the DOM

				$('#winner').html("<h5>It's a tie!</h5>");

				$('#choices1').html('<p>' + game.name + ' chose ' + p1 + '.</p>');

				$('#choices2').html('<p>' + game.name2 + ' chose ' + p2 + '.</p>');

				game.ties++;

				player1Ref.update({
					ties: game.ties
				}); //  end firebase update

				game.ties2++;

				player2Ref.update({
					ties: game.ties2
				}); //  end firebase update

				$("#score1").html("<p>Wins: "+ game.wins + " Losses: " + game.losses + " Ties: " + game.ties + "</p>");

				$("#score2").html("<p>Wins: "+ game.wins2 + " Losses: " + game.losses2 + " Ties: " + game.ties2 + "</p>");

			} // end of if tie

			// if p1 scissors wins

			if ((p1 == 'scissors' && p2 == 'paper') 
				|| (p1 == 'scissors' && p2 == 'lizard')) {

				$('#winner').html("<h5>" + game.name + " wins!</h5>");

				$('#choices1').html('<p>' + game.name + ' chose ' + p1 + '.</p>');

				$('#choices2').html('<p>' + game.name2 + ' chose ' + p2 + '.</p>');

				game.wins++;

				player1Ref.update({
					wins: game.wins
				}); //  end firebase update

				game.losses2++;

				player2Ref.update({
					losses: game.losses2
				}); //  end firebase update

				$("#score1").html("<p>Wins: "+ game.wins + " Losses: " + game.losses + " Ties: " + game.ties + "</p>");

				$("#score2").html("<p>Wins: "+ game.wins2 + " Losses: " + game.losses2 + " Ties: " + game.ties2 + "</p>");

			} // end of if p1 scissors wins

			// if p1 scissors loses

			if ((p1 == 'scissors' && p2 == 'rock') 
				|| (p1 == 'scissors' && p2 == 'spork')) {

				$('#winner').html("<h5>" + game.name2 + " wins!</h5>");

				$('#choices1').html('<p>' + game.name + ' chose ' + p1 + '.</p>');

				$('#choices2').html('<p>' + game.name2 + ' chose ' + p2 + '.</p>');

				game.losses++;

				player1Ref.update({
					losses: game.losses
				}); //  end firebase update

				game.wins2++;

				player2Ref.update({
					wins: game.wins2
				}); //  end firebase update

				$("#score1").html("<p>Wins: "+ game.wins + " Losses: " + game.losses + " Ties: " + game.ties + "</p>");

				$("#score2").html("<p>Wins: "+ game.wins2 + " Losses: " + game.losses2 + " Ties: " + game.ties2 + "</p>");

			} // end of if p1 scissors loses

			// if p1 rock wins

			if ((p1 == 'rock' && p2 == 'scissors') 
				|| (p1 == 'rock' && p2 == 'lizard')) {

				$('#winner').html("<h5>" + game.name + " wins!</h5>");

				$('#choices1').html('<p>' + game.name + ' chose ' + p1 + '.</p>');

				$('#choices2').html('<p>' + game.name2 + ' chose ' + p2 + '.</p>');

				game.wins++;

				player1Ref.update({
					wins: game.wins
				}); //  end firebase update

				game.losses2++;

				player2Ref.update({
					losses: game.losses2
				}); //  end firebase update

				$("#score1").html("<p>Wins: "+ game.wins + " Losses: " + game.losses + " Ties: " + game.ties + "</p>");

				$("#score2").html("<p>Wins: "+ game.wins2 + " Losses: " + game.losses2 + " Ties: " + game.ties2 + "</p>");

			} // end of if p1 rock wins

			// if p1 rock loses

			if ((p1 == 'rock' && p2 == 'paper') 
				|| (p1 == 'rock' && p2 == 'spork')) {

				$('#winner').html("<h5>" + game.name2 + " wins!</h5>");

				$('#choices1').html('<p>' + game.name + ' chose ' + p1 + '.</p>');

				$('#choices2').html('<p>' + game.name2 + ' chose ' + p2 + '.</p>');

				game.losses++;

				player1Ref.update({
					losses: game.losses
				}); //  end firebase update

				game.wins2++;

				player2Ref.update({
					wins: game.wins2
				}); //  end firebase update

				$("#score1").html("<p>Wins: "+ game.wins + " Losses: " + game.losses + " Ties: " + game.ties + "</p>");

				$("#score2").html("<p>Wins: "+ game.wins2 + " Losses: " + game.losses2 + " Ties: " + game.ties2 + "</p>");

			} // end of if p1 rock loses

			// if p1 paper wins

			if ((p1 == 'paper' && p2 == 'rock') 
				|| (p1 == 'paper' && p2 == 'spork')) {

				$('#winner').html("<h5>" + game.name + " wins!</h5>");

				$('#choices1').html('<p>' + game.name + ' chose ' + p1 + '.</p>');

				$('#choices2').html('<p>' + game.name2 + ' chose ' + p2 + '.</p>');

				game.wins++;

				player1Ref.update({
					wins: game.wins
				}); //  end firebase update

				game.losses2++;

				player2Ref.update({
					losses: game.losses2
				}); //  end firebase update

				$("#score1").html("<p>Wins: "+ game.wins + " Losses: " + game.losses + " Ties: " + game.ties + "</p>");

				$("#score2").html("<p>Wins: "+ game.wins2 + " Losses: " + game.losses2 + " Ties: " + game.ties2 + "</p>");

			} // end of if p1 rock wins

			// if p1 paper loses

			if ((p1 == 'paper' && p2 == 'scissors') 
				|| (p1 == 'paper' && p2 == 'lizard')) {

				$('#winner').html("<h5>" + game.name2 + " wins!</h5>");

				$('#choices1').html('<p>' + game.name + ' chose ' + p1 + '.</p>');

				$('#choices2').html('<p>' + game.name2 + ' chose ' + p2 + '.</p>');

				game.losses++;

				player1Ref.update({
					losses: game.losses
				}); //  end firebase update

				game.wins2++;

				player2Ref.update({
					wins: game.wins2
				}); //  end firebase update

				$("#score1").html("<p>Wins: "+ game.wins + " Losses: " + game.losses + " Ties: " + game.ties + "</p>");

				$("#score2").html("<p>Wins: "+ game.wins2 + " Losses: " + game.losses2 + " Ties: " + game.ties2 + "</p>");

			} // end of if p1 paper loses

			// if p1 lizard wins

			if ((p1 == 'lizard' && p2 == 'paper') 
				|| (p1 == 'lizard' && p2 == 'spork')) {

				$('#winner').html("<h5>" + game.name + " wins!</h5>");

				$('#choices1').html('<p>' + game.name + ' chose ' + p1 + '.</p>');

				$('#choices2').html('<p>' + game.name2 + ' chose ' + p2 + '.</p>');

				game.wins++;

				player1Ref.update({
					wins: game.wins
				}); //  end firebase update

				game.losses2++;

				player2Ref.update({
					losses: game.losses2
				}); //  end firebase update

				$("#score1").html("<p>Wins: "+ game.wins + " Losses: " + game.losses + " Ties: " + game.ties + "</p>");

				$("#score2").html("<p>Wins: "+ game.wins2 + " Losses: " + game.losses2 + " Ties: " + game.ties2 + "</p>");

			} // end of if p1 lizard wins

			// if p1 lizard loses

			if ((p1 == 'lizard' && p2 == 'scissors') 
				|| (p1 == 'lizard' && p2 == 'rock')) {

				$('#winner').html("<h5>" + game.name2 + " wins!</h5>");

				$('#choices1').html('<p>' + game.name + ' chose ' + p1 + '.</p>');

				$('#choices2').html('<p>' + game.name2 + ' chose ' + p2 + '.</p>');

				game.losses++;

				player1Ref.update({
					losses: game.losses
				}); //  end firebase update

				game.wins2++;

				player2Ref.update({
					wins: game.wins2
				}); //  end firebase update

				$("#score1").html("<p>Wins: "+ game.wins + " Losses: " + game.losses + " Ties: " + game.ties + "</p>");

				$("#score2").html("<p>Wins: "+ game.wins2 + " Losses: " + game.losses2 + " Ties: " + game.ties2 + "</p>");

			} // end of if p1 lizard loses

			// if p1 spork wins

			if ((p1 == 'spork' && p2 == 'rock') 
				|| (p1 == 'spork' && p2 == 'scissors')) {

				$('#winner').html("<h5>" + game.name + " wins!</h5>");

				$('#choices1').html('<p>' + game.name + ' chose ' + p1 + '.</p>');

				$('#choices2').html('<p>' + game.name2 + ' chose ' + p2 + '.</p>');

				game.wins++;

				player1Ref.update({
					wins: game.wins
				}); //  end firebase update

				game.losses2++;

				player2Ref.update({
					losses: game.losses2
				}); //  end firebase update

				$("#score1").html("<p>Wins: "+ game.wins + " Losses: " + game.losses + " Ties: " + game.ties + "</p>");

				$("#score2").html("<p>Wins: "+ game.wins2 + " Losses: " + game.losses2 + " Ties: " + game.ties2 + "</p>");

			} // end of if p1 spork wins

			// if p1 spork loses

			if ((p1 == 'spork' && p2 == 'paper') 
				|| (p1 == 'spork' && p2 == 'lizard')) {

				$('#winner').html("<h5>" + game.name2 + " wins!</h5>");

				$('#choices1').html('<p>' + game.name + ' chose ' + p1 + '.</p>');

				$('#choices2').html('<p>' + game.name2 + ' chose ' + p2 + '.</p>');

				game.losses++;

				player1Ref.update({
					losses: game.losses
				}); //  end firebase update

				game.wins2++;

				player2Ref.update({
					wins: game.wins2
				}); //  end firebase update

				$("#score1").html("<p>Wins: "+ game.wins + " Losses: " + game.losses + " Ties: " + game.ties + "</p>");

				$("#score2").html("<p>Wins: "+ game.wins2 + " Losses: " + game.losses2 + " Ties: " + game.ties2 + "</p>");

			} // end of if p1 spork loses

			// if player 1

			if (game.userId == 1) {

				setTimeout(function() {
					game.reset(); }, 5000);

			} // end if player 1

			// else player 2

			else {

				setTimeout(function() {
					game.reset2(); }, 5000);

			} // end else player 2

		}, // end of logic function

		reset: function() {

			var playersRef = game.dataInfo.child(game.players);

			var player1Ref = playersRef.child(game.player1);

			var player2Ref = playersRef.child(game.player2);

			player1Ref.update({
				pick: ""
			});

			player2Ref.update({
				pick: ""
			});

			game.dataInfo.update({
				turn: 0
			});

			// Empties the #winner div

			$("#winner").html("");

			// empties the choice paragraph before adding buttons

			$('#choices1').html("");

			$('#choices2').html("");

			for (var i = 0; i < game.pieces.length; i++) {

				var p = $('<button>');
				p.addClass("piece");
				p.attr('data-index', i);
				p.attr('data-name', game.pieces[i].name);
				p.append('<p>' + game.pieces[i].name + '</p>');
				p.append(game.pieces[i].image);

				$("#choices1").addClass('heightHack');
				$("#choices1").append(p);

			} // ends for loop

			$('#winner').html("<p>It is " + game.name + "'s turn.</p>")

		}, // end of reset function

		// changes the dom to match changes in firebase for player 2

		reset2: function() {

			// Empties the #winner div

			$("#winner").html("");

			// empties the choice paragraph before adding buttons

			$('#choices1').html("");

			$('#choices2').html("");

			for (var i = 0; i < game.pieces.length; i++) {

				var p = $('<button>');
				p.addClass("piece");
				p.attr('data-index', i);
				p.attr('data-name', game.pieces[i].name);
				p.append('<p>' + game.pieces[i].name + '</p>');
				p.append(game.pieces[i].image);

				$("#choices2").addClass('heightHack');
				$("#choices2").append(p);

			} // ends for loop

			$('#winner').html("<p>It is " + game.name + "'s turn.</p>")

		}, // end of reset2 function

		disconnect: function () {

			$(document).on('click', "#disconnectBut1", function() {

				var playersRef = game.dataInfo.child(game.players);
				var player1Ref = playersRef.child(game.player1);
				var player2Ref = playersRef.child(game.player2);
				
				player1Ref.remove();
// ******not working
				game.dataInfo.child(turn).remove();
// ******not working
				window.location.href=window.location.href

			});

			$(document).on('click', "#disconnectBut2", function() {

				var playersRef = game.dataInfo.child(game.players);
				var player1Ref = playersRef.child(game.player1);
				var player2Ref = playersRef.child(game.player2);
// ******not working				
				player2Ref.remove();
// ******not working
				game.dataInfo.child(turn).remove();

				window.location.href=window.location.href

			});

		},

		// chat send button

		chatSend: function() {
			$('#send').on('click', function() {

				var typed = $("#message").val().trim();

				var time = Firebase.ServerValue.TIMESTAMP

				game.message = game.myname + ": " + typed;

				game.dataChat.push({
					message: game.message,
					time: time
				})

				document.getElementById("message").value = "";

				return false;

			});// end of on click #send

		}, // end of chatSend function

		chatUpdateLocal: function() {

			game.dataChat.orderByChild("time").on('child_added', function(snapshot) {

				console.log(snapshot.val())
				game.message = snapshot.val().message;
				game.time = snapshot.val().time;

				game.chatPrint();

				
			}); // end dataChat on childAdded
		}, // end chatPrint function

		chatPrint: function() {

			var chatTime = moment(game.time).format("MMM DD, YYYY hh:mm:ss");

			$('#history').append(chatTime + " " + game.message + "<br>");

		},

	} // Ends game object

	

	// When name is entered create an object in firebase with name losses wins and ties...in addition create text instead of login box that says, "Hi obj.name! You are player 1. (It's your turn![only after player 2 has joined])" or "Hi obj.name! You are player 2. You are waiting for player 1 to make their choice."....also prints obj.name, choices (r,p,s,l,sp[only after player 2 has logged in as well]), and wins, losses and ties in that order...Also highlights by changin the border color of the player whos turn it is. Once both have joined make turn counter in firebase.

	game.connect();

	// calls choice function so player1 can choose a button, then player 2, then logic is run

	game.choice();

	// updates game variables

	game.updateVar();

	// enables disconnect buttons

	game.disconnect();

	// enables chatSend function

	game.chatSend();

	// updates local variables from firebase

	game.chatUpdateLocal();

	// Player 1 picks their choice showing them what they chose, but not player 2. Their choice is added to firebase. The turn counter goes up highlighting the other players play area.

	// PLayer 2 picks and their play area is updated with their choice. Their choice is added to firebase. This triggers the showing of both players choices in their respective boxes and who won in the middle box. This also makes the win/loss/tie counters go up

	

	// After a period of 5ish seconds it the game resets back to after both players logged in, but wins and losses stay the same

	// Players can leave by refreshing (look into having a leave button) which removes their object from firebase. This sends a disconnect message in the chat box based on obj.name (or just a message on the html somewhere if I dont get chat working)

	// create a chat box with form to type and send button. When the send button is clicked move the value to the chatbox and firebase with a obj.name: in front of it and a color based on the player that typed it in....IF there are not curse words in it. Else fill in "My vocabulary isn't big enough to say something of importance. :("



}); // Ends document.ready function