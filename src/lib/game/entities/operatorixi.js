ig.module(
	'game.entities.operatorixi'
)
.requires(
	'impact.entity'
)
.defines(function(){
	
EntityOperatorixi = ig.Entity.extend({
	size: {x: 340, y: 277},
	//offset: {x: 57, y: 17},
	
	type: ig.Entity.TYPE.B, // Evil enemy group
	checkAgainst: ig.Entity.TYPE.A, // Check against friendly
	collides: ig.Entity.COLLIDES.FIXED,
	
	animSheet: new ig.AnimationSheet( 'media/operatorixi.png', 340, 277 ),
	
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );

		this.addAnim( 'idle', 1, [0] );
		// TODO animatie versoepelen
        this.addAnim( 'death', .3, [0], true );
	},
	
	
	update: function() {
        if (this.anims.death.loopCount > 0) {
            this.kill();
        }
		this.parent();
	},

    cleanup: function() {
    	this.currentAnim = this.anims.death;
    },

	handleMovementTrace: function( res ) {
		this.parent( res );
	},	
	
	check: function( other ) {
		//finish
	}
});

});