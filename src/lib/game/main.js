ig.module(
	'game.main'
)
.requires(
	'impact.game',
	'impact.font',

	'plugins.screen-fader',

	'game.entities.player',
	'game.levels.0',
	'game.levels.1',
	'game.levels.2',
	'game.levels.3',
	'game.levels.4'
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

GameState = {
	LOADING: 'LOADING',
	LOADED: 'LOADED',
	ENTERED: 'ENTERED',
	PLAYING: 'PLAYING'
};


MyGame = ig.Game.extend({

	gravity: 300, // All entities are affected by this
	currentLevel: 0,
	numberOfLevels: 4, // excluding title screen
	state: GameState.LOADED,
	screenfaderIn: undefined,
	screenfaderOut: undefined,

	// Load a font
	font: new ig.Font( 'media/04b03.font.png' ),

	init: function() {
		// Bind keys
		ig.input.bind( ig.KEY.LEFT_ARROW, 'left' );
		ig.input.bind( ig.KEY.RIGHT_ARROW, 'right' );
		ig.input.bind(ig.KEY.MOUSE1, 'click');

		ig.music.add( 'media/DST-TimeToDream.mp3' );
		ig.music.volume = 1;
		ig.music.play();

		// Load the LevelTest as required above ('game.level.test')
		this.loadLevel( Level0 );
	},

	loadNextLevel: function() {

		if (this.state != GameState.LOADING) {
			this.state = GameState.LOADING;

			var self = this;
			var speed = 4.0;
			var color = { r: 255, g: 255, b: 255, a: 1 };
			this.screenfaderIn = new ig.ScreenFader( {
				fade: 'in',
				speed: speed,
				color: color,
				callback: function() {
					self.currentLevel++;
					if (self.currentLevel == this.numberOfLevels+1)
						self.currentLevel = 0;
					self.loadLevel( window['Level' + self.currentLevel] );
					self.state = GameState.LOADED;
				}
			} );
			this.screenfaderOut = new ig.ScreenFader( {
				fade: 'out',
				speed: speed,
				color: color
			} );
		}
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

		if (this.state == GameState.LOADING && this.screenfaderIn) {
	    	this.screenfaderIn.draw();
		}
		if (this.state == GameState.LOADED && this.screenfaderOut) {
	    	this.screenfaderOut.draw();
		}
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



// Start the Game with 60fps, a resolution of 1024x748, scaled
// up by a factor of ...
var factor = 1;
ig.main( '#canvas', MyGame, 60, 1024*factor, 748*factor, 1/factor );

});
