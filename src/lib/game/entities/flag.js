ig.module(
	'game.entities.flag'
)
.requires(
	'impact.entity'
)
.defines(function(){
	
EntityFlag = ig.Entity.extend({
	size: {x: 42, y: 60},
	
	type: ig.Entity.TYPE.B, // Evil enemy group
	checkAgainst: ig.Entity.TYPE.A, // Check against friendly
	collides: ig.Entity.COLLIDES.PASSIVE,
	
	animSheet: new ig.AnimationSheet( 'media/flag.png', 42, 60 ),
	
	
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