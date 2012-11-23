ig.module(
	'game.entities.exitixi'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityExitixi = ig.Entity.extend({
	size: {x: 105, y: 183},

	type: ig.Entity.TYPE.B, // Evil enemy group
	checkAgainst: ig.Entity.TYPE.A, // Check against friendly
	collides: ig.Entity.COLLIDES.PASSIVE,

	animSheet: new ig.AnimationSheet( 'media/exitixi.png', 105, 183 ),


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
		var isPlayer =  other instanceof EntityPlayer;

		if (!isPlayer) return;

		if( other.state == PlayerState.EXITIXING ) {
			return;
		}

		other.state = PlayerState.EXITIXING;
		other.exitixi = this;

		// Ambilight alert!
		console.info('Sending alert to ambilight.');
		var img = new Image();
		img.src = 'http://www.huelandsspoor.nl/api/effects/alert';
	}
});

});
