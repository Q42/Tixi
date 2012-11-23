ig.module(
    'game.entities.player'
)
    .requires(
    'impact.entity'
)
    .defines(function () {

    	PlayerState = {
    		PLAYING: 'PLAYING',
    		WINNING: 'WINNING'
    	};

        EntityPlayer = ig.Entity.extend({

            // The players (collision) size is a bit smaller than the animation
            // frames, so we have to move the collision box a bit (offset)
            size:{x:124, y:174},
            offset:{x:0, y:0},

            maxVel:{x:200, y:200},
            friction:{x:600, y:0},

            type:ig.Entity.TYPE.A, // Player friendly group
            checkAgainst:ig.Entity.TYPE.NONE,
            collides:ig.Entity.COLLIDES.PASSIVE,

            state: PlayerState.PLAYING,

            animSheet:new ig.AnimationSheet('media/player.png', 123, 174),

            accelGround:400,
            accelLadder:200,
            health:10,
            flip:false,

            init:function (x, y, settings) {
                this.parent(x, y, settings);
                this.dest = {x:x, y:y};

                // Add the animations
                this.addAnim('idle', .5, [0, 1]);
                this.addAnim('run', 0.07, [0, 1]);
            },

            collideWith:function (other, axis) {
                this.dest = this.pos; // Stop moving
                this.parent(other, axis);
            },
            update:function () {
            	if (this.state == PlayerState.PLAYING)
            	{
	                // move left or right
	                var accel = this.standing ? this.accelGround : this.accelLadder;
	                if (ig.input.pressed('click')) {
	                    this.startTime = new Date();
	                }
	                if (ig.input.released('click') && new Date() - this.startTime < 300) {
	                    this.dest = {
	                        x:ig.game.screen.x + ig.input.mouse.x - this.size.x / 2,
	                        y:ig.game.screen.y + ig.input.mouse.y
	                    };
	                }

                    // Calculate distance to target destination
	                var dist = (this.vel.x * this.vel.x) / (2 * this.friction.x);
	                var real_dist = Math.abs(this.pos.x - this.dest.x);
	                if (real_dist <= dist) {
	                    this.accel.x = 0;
	                } else if (this.pos.x > this.dest.x && real_dist > 1) {
	                    this.flip = true;
	                    this.accel.x = -accel;
	                } else if (this.pos.x < this.dest.x && real_dist > 1) {
	                    this.flip = false;
	                    this.accel.x = accel;
	                }

                    // Update animation
	                if (this.vel.x == 0 && this.accel.x == 0) {
	                    this.currentAnim = this.anims.idle;
	                    this.dest = this.pos;
	                } else {
	                    this.currentAnim = this.anims.run;
	                }

	                this.currentAnim.flip.x = this.flip;
	            }

                // move!
                this.parent();
            }
        });


    });
