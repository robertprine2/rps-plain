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

}); // Ends document.ready function