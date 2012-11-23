ig.module(
	'game.entities.numberixi'
)
.requires(
	'impact.entity'
)
.defines(function(){

NumberixiState = {
	IDLE: 'IDLE',
	DRAGGING: 'DRAGGING',
	RETURNING: 'RETURNING'
};

EntityNumberixi = ig.Entity.extend({
	size: {x: 105, y: 69},
	originalMaxVel: {x: 100, y: 100},
	returningMaxVel: {x: Infinity, y: Infinity},
	maxVel: {x: 100, y: 100},
	friction: {x: 150, y: 0},
	
	type: ig.Entity.TYPE.B, // Evil enemy group
	checkAgainst: ig.Entity.TYPE.A, // Check against friendly
	collides: ig.Entity.COLLIDES.PASSIVE,

	speed: 14,
	movingLeft: true,

	startX: undefined,
	maxWalkDistance: 100,

	state: NumberixiState.IDLE,
	dragOffset: {x: undefined, y: undefined},
	dragStartPos: {x: undefined, y: undefined},
	dragReturnVelocity: {x: undefined, y: undefined},
	
	animSheet: new ig.AnimationSheet( 'media/numberixi.png', 105, 69 ),
	
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		
		this.addAnim( 'crawl', 1, [0] );
		this.addAnim( 'crawlflipped', 1, [1] );
        this.addAnim( 'death', 1, [0], true);

		this.startX = this.pos.x;
	},

    kill: function() {
        if (this.anims.death.loopCount > 0) {
            this.parent();
        } else {
            this.currentAnim = this.anims.death;
        }
    },
	
	update: function() {
        if (this.anims.death.loopCount > 0) {
            this.kill();
        }

		if (this.state == NumberixiState.IDLE && ig.input.pressed('click') && this.inFocus()) {
	        this.state = NumberixiState.DRAGGING;
	        this.dragStartPos = this.pos;
	        this.dragOffset.x = ig.input.mouse.x - this.pos.x;
	        this.dragOffset.y = ig.input.mouse.y - this.pos.y;
	        this.collides = ig.Entity.COLLIDES.NEVER;
	    }
	    // TODO voor Tom als we buiten het scherm bewegen, releasen
	    if (this.state == NumberixiState.DRAGGING && ig.input.released('click')) {
	        this.state = NumberixiState.RETURNING;
	    	this.gravityFactor = 0;
	        var dx = this.dragStartPos.x - this.pos.x;
	        var dy = this.dragStartPos.y - this.pos.y;
	        this.dragReturnVelocity.x = dx * 1.5;
	        this.dragReturnVelocity.y = dy * 1.5;
	        this.maxVel = this.returningMaxVel;

            // check monsters
            var monsters = ig.game.getEntitiesByType('EntityAnswerixi');
            var creature = this;
            monsters.forEach(function(monster) {
                var dx = Math.round(creature.pos.x - monster.pos.x);
                var dy = Math.round(creature.pos.y - monster.pos.y);
                var offBy = 50/2;
                if (dx > 51-offBy && dx < 51+offBy && dy > 55-offBy && dy < 55+offBy) {
                    monster.kill();
                    creature.kill();
                }
            });


	    }
	    if (this.state == NumberixiState.RETURNING) {
	    	var originalXPosReached = (this.dragReturnVelocity.x < 0 && this.pos.x <= this.dragStartPos.x) || (this.dragReturnVelocity.x >= 0 && this.pos.x >= this.dragStartPos.x);
			var originalYPosReached = (this.dragReturnVelocity.y < 0 && this.pos.y <= this.dragStartPos.y) || (this.dragReturnVelocity.y >= 0 && this.pos.y >= this.dragStartPos.y);

			if (originalXPosReached && originalYPosReached) {
				this.state = NumberixiState.IDLE;
				return;
			}

	        this.vel.x = originalXPosReached ? 0 : this.dragReturnVelocity.x;
	        this.vel.y = originalYPosReached ? 0 : this.dragReturnVelocity.y;
	    }
	    if (this.state == NumberixiState.IDLE) {
	    	this.gravityFactor = 1;
	        this.collides = ig.Entity.COLLIDES.PASSIVE;
	        this.maxVel = this.originalMaxVel;
	    }

	    if (this.state == NumberixiState.DRAGGING) {
	    	this.pos.x = ig.input.mouse.x - this.dragOffset.x;
	    	this.pos.y = ig.input.mouse.y - this.dragOffset.y;
	    }

	    if (this.state == NumberixiState.IDLE) {
			this.autoWalk();
		}

		this.parent();
	},

	inFocus: function() {
	    return (
	        (this.pos.x <= ig.input.mouse.x && ig.input.mouse.x <= this.pos.x + this.size.x) &&
	        (this.pos.y <= ig.input.mouse.y && ig.input.mouse.y <= this.pos.y + this.size.y)
	    );
	},

	autoWalk: function() {
		var minX = this.startX - this.maxWalkDistance / 2;
		var maxX = this.startX + this.maxWalkDistance / 2;

		if (this.pos.x <= minX && this.movingLeft)
			this.movingLeft = false;
		if (this.pos.x > maxX && !this.movingLeft)
			this.movingLeft = true;
		
		var xdir = this.movingLeft ? -1 : 1;
		this.vel.x = this.speed * xdir;
		this.currentAnim = this.movingLeft ? this.anims.crawl : this.anims.crawlflipped;
	},	
	
	collideWith: function( other, axis ) {
		this.parent( other, axis );

		this.movingLeft = !this.movingLeft;
	},	

	handleMovementTrace: function( res ) {
	    if (this.state == NumberixiState.DRAGGING || this.state == NumberixiState.RETURNING) {
	        res.pos.x = this.pos.x + this.vel.x * ig.system.tick;
        	res.pos.y = this.pos.y + this.vel.y * ig.system.tick;
	        if (this.state == NumberixiState.RETURNING) {
		        if (this.dragReturnVelocity.x < 0 && res.pos.x < this.dragStartPos.x) {
		        	res.pos.x = this.dragStartPos.x;
		        }
		        else if (this.dragReturnVelocity.x > 0 && res.pos.x > this.dragStartPos.x) {
		        	res.pos.x = this.dragStartPos.x;
		        }
		        if (this.dragReturnVelocity.y < 0 && res.pos.y < this.dragStartPos.y) {
		        	res.pos.y = this.dragStartPos.y;
		        }
		        else if (this.dragReturnVelocity.y > 0 && res.pos.y > this.dragStartPos.y) {
		        	res.pos.y = this.dragStartPos.y;
		        }
		    }
	    }
	    this.parent( res );
	},
	
	check: function( other ) {
		//finish
	}
});

});