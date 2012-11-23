ig.module(
	'game.main'
)
.requires(
	'impact.game',
	'impact.font',

	'game.entities.player',
	'game.levels.1',
	'game.levels.2'
)
.defines(function(){



// Helper shizzle voor ambilight.
var _lastUpdated = new Date()

function _rgbToHex(r, g, b) {
	r = Math.round( r );
	g = Math.round( g );
	b = Math.round( b );
	return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}


MyGame = ig.Game.extend({

	gravity: 300, // All entities are affected by this
	currentLevel: 1,

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

	loadNextLevel: function() {
		//console.log('loadNextLevel');
		//ig.system.clear('#FFF');

		this.currentLevel++; // TODO maximeren
		this.loadLevel( window['Level' + this.currentLevel] );
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

		var now = new Date().getTime()
		  , hex = this.getHexForTimestamp( now )

		ig.game.clearColor = '#' + hex;

		// Stuur de ambilight kleur maar 1 keer per seconden.
		//if( now - _lastUpdated > 1000) {
			// Ambilight heeft wat lag...
			var lagHex = this.getHexForTimestamp( now + 1500);
			//console.log( hex, lagHex );
			sessionStorage.setItem('ambilightColor', lagHex);
			_lastUpdated = now;
		//}
	},

    getHexForTimestamp: function(timestamp) {
        scale = new chroma.ColorScale({
             colors: [
                '#B8684F', // 0u
                '#4FB9C5', // 10u
                '#DE7A75', // 20u
                '#B8684F', // 20u
            ],
            positions: [
                0.0,
                10.0/24.0,
                20.0/24.0,
                1.0],
            mode: 'hcl'
        });

        var duration = 40*1000.0
            , offset = (timestamp % duration) / duration;

        var color = scale.getColor(offset);

        return color.hex().substring(1);
    }


    });



// Start the Game with 60fps, a resolution of 240x160, scaled
// up by a factor of 2
ig.main( '#canvas', MyGame, 60, 1024, 748, 1 );

});
