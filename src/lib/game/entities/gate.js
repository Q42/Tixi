ig.module(
	'game.entities.gate'
)
.requires(
	'impact.entity'
)
.defines(function(){
	
EntityGate = ig.Entity.extend({
	size: {x: 203, y: 304},
	
	type: ig.Entity.TYPE.B, // Evil enemy group
	checkAgainst: ig.Entity.TYPE.A, // Check against friendly
	collides: ig.Entity.COLLIDES.FIXED,
	
	animSheet: new ig.AnimationSheet( 'media/monster.png', 203, 304 ),
	
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );

		this.addAnim( 'idle', 1, [0] );
        this.addAnim( 'death', 1, [0], true );
	},
	
	
	update: function() {
        if (this.anims.death.loopCount > 0) {
            this.kill();
        }
		this.parent();
	},

    kill: function() {
        if (this.anims.death.loopCount > 0) {
            this.parent();
        }
    },

	handleMovementTrace: function( res ) {
		this.parent( res );
	},	
	
	check: function( other ) {
		//finish
	}
});

});