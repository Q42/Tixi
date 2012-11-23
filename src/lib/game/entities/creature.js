ig.module(
	'game.entities.creature'
)
.requires(
	'impact.entity'
)
.defines(function(){
	
EntityCreature = ig.Entity.extend({
	size: {x: 80, y: 60},
	maxVel: {x: 100, y: 100},
	friction: {x: 150, y: 0},
	
	type: ig.Entity.TYPE.B, // Evil enemy group
	checkAgainst: ig.Entity.TYPE.A, // Check against friendly
	collides: ig.Entity.COLLIDES.PASSIVE,

	speed: 14,
	flip: true,

	startX: undefined,
	maxWalkDistance: 100,
	
	animSheet: new ig.AnimationSheet( 'media/creature_2.png', 80, 60 ),
	
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		
		this.addAnim( 'crawl', 0.08, [0] );

		this.startX = this.pos.x;
	},
	
	
	update: function() {
		var minX = this.startX - this.maxWalkDistance / 2;
		var maxX = this.startX + this.maxWalkDistance / 2;

		if (this.pos.x <= minX || this.pos.x > maxX)
			this.flip = !this.flip;
		
		var xdir = this.flip ? -1 : 1;
		this.vel.x = this.speed * xdir;
		
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