ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'impact.font',
	
	'game.entities.player',
	'game.levels.1'
)
.defines(function(){

MyGame = ig.Game.extend({
	
	gravity: 300, // All entities are affected by this
	
	// Load a font
	font: new ig.Font( 'media/04b03.font.png' ),
	
	
	init: function() {
		// Bind keys
		ig.input.bind( ig.KEY.LEFT_ARROW, 'left' );
		ig.input.bind( ig.KEY.RIGHT_ARROW, 'right' );
		ig.input.bind(ig.KEY.MOUSE1, 'click');

		ig.music.add( 'media/DST-ByTheField.mp3' );
		ig.music.volume = 1;
		ig.music.play();
		
		// Load the LevelTest as required above ('game.level.test')
		this.loadLevel( Level1 );
	},
	
	update: function() {		
		// Update all entities and BackgroundMaps
		this.parent();

		// screen follows the player
		/*
		var player = this.getEntitiesByType( EntityPlayer )[0];
		if( player ) {
			this.screen.x = player.pos.x - ig.system.width/2;
			this.screen.y = player.pos.y - ig.system.height/2;
		}
		*/
	},
	
	draw: function() {
		// Draw all entities and BackgroundMaps
		this.parent();
		
		this.font.draw( 'Arrow Keys, X, C', 2, 2 );
	}
});


// Start the Game with 60fps, a resolution of 240x160, scaled
// up by a factor of 2
ig.main( '#canvas', MyGame, 60, 1024, 748, 1 );

});
