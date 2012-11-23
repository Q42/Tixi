ig.module(
	'game.entities.gate'
)
.requires(
	'impact.entity'
)
.defines(function(){
	
EntityGate = ig.Entity.extend({
	size: {x: 63, y: 142},
	
	type: ig.Entity.TYPE.B, // Evil enemy group
	checkAgainst: ig.Entity.TYPE.A, // Check against friendly
	collides: ig.Entity.COLLIDES.FIXED,
	
	animSheet: new ig.AnimationSheet( 'media/gate.png', 63, 142 ),
	
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );

		this.addAnim( 'idle', 1, [0] );
	},
	
	
	update: function() {
		this.parent();
	},
	
	
	handleMovementTrace: function( res ) {
		this.parent( res );
	},	
	
	check: function( other ) {
		//finish
	}
});

});