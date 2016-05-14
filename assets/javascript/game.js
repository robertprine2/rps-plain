// Waits until html is finished loading then starts JS

$(document).ready(function(){

	//game object to contain variables and methods

	var game = {

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

		// variable click is for targeting or placing a piece, 0 to target 1 to appendTo

		click: 0,

		// method to generate pieces for placement on the board

		genPieces: function() {

			for (var i = 0; i < game.pieces.length; i++) {

				var p = $('<button>');
				p.addClass("piece");
				p.attr('data-index', i);
				p.attr('data-name', game.pieces[i].name);
				p.append('<p>' + game.pieces[i].name + '</p>');
				p.append(game.pieces[i].image);

				$("#pieces").append(p);

			} // ends for loop

			//puts blank spaces on the board

			$(".moveSpace").append("<img src='assets/images/blank.png'>");

		}, // ends genPieces method

		// method for targeting a piece

		targetPiece: function() {

			$(document.body).on('click', '.piece', function(){

				if (game.click == 0) {
					$(".target").removeClass("target");
					$(this).addClass("target");
					game.click++;
				} // end if

			}); // end on click for .piece

		}, // end targetPiece method



		movePiece: function() {
			$(document.body).on('click', '.moveSpace', function() {

				if (game.click == 1) {
					$(this).empty();
					$('.target').appendTo($(this));
					// var index = $('.target').data('index');
					// $(this).replaceWith(game.pieces[index]);
					game.click = 0;
					// $('.target').removeClass('piece');
					$('.target').addClass("onBoard");
				} // end if

			}); // end on click for .moveSpace

		}, // end movePiece method

	} // Ends game object

	// generates pieces on website

	game.genPieces();

	// on click for targeting a piece to move

	game.targetPiece();

	// on click for moving a piece

	game.movePiece();



	// When name is entered create an object in firebase with name losses wins and ties...in addition create text instead of login box that says, "Hi obj.name! You are player 1. (It's your turn![only after player 2 has joined])" or "Hi obj.name! You are player 2. You are waiting for player 1 to make their choice."....also prints obj.name, choices (r,p,s,l,sp[only after player 2 has logged in as well]), and wins, losses and ties in that order...Also highlights by changin the border color of the player whos turn it is. Once both have joined make turn counter in firebase.

	// Player 1 picks their choice showing them what they chose, but not player 2. Their choice is added to firebase. The turn counter goes up highlighting the other players play area.

	// PLayer 2 picks and their play area is updated with their choice. Their choice is added to firebase. This triggers the showing of both players choices in their respective boxes and who won in the middle box. This also makes the win/loss/tie counters go up

	// After a period of 5ish seconds it the game resets back to after both players logged in, but wins and losses stay the same

	// Players can leave by refreshing (look into having a leave button) which removes their object from firebase. This sends a disconnect message in the chat box based on obj.name (or just a message on the html somewhere if I dont get chat working)

	// create a chat box with form to type and send button. When the send button is clicked move the value to the chatbox and firebase with a obj.name: in front of it and a color based on the player that typed it in....IF there are not curse words in it. Else fill in "My vocabulary isn't big enough to say something of importance. :("



}); // Ends document.ready function