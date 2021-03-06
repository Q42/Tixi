ig.module(
  'game.entities.player'
)
  .requires(
  'impact.entity'
)
.defines(function () {

PlayerState = {
  START: 'START',
  ENTERING: 'ENTERING',
  ENTERED: 'ENTERED',
  PLAYING: 'PLAYING',
  EXITIXING: 'EXITIXING'
};

EntityPlayer = ig.Entity.extend({

  // The players (collision) size is a bit smaller than the animation
  // frames, so we have to move the collision box a bit (offset)
  size:{x:123, y:174},
  offset:{x:0, y:0},
  zIndex: 6,

  maxVel:{x:200, y:200},
  friction:{x:600, y:0},

  type:ig.Entity.TYPE.A, // Player friendly group
  checkAgainst:ig.Entity.TYPE.NONE,
  collides:ig.Entity.COLLIDES.PASSIVE,

  state: PlayerState.START,
  entrance: null,
  exitixi: null,

  magicBeam: null,

  accelGround:400,
  accelLadder:200,
  flip:false,

  init:function (x, y, settings) {
    this.parent(x, y, settings);
    this.dest = {x:x, y:y};
    this.animSheet = new ig.AnimationSheet('media/player.png', 123, 174);

    // Add the animations
    this.addAnim('idle', .3, [0, 0, 0, 0, 0, 0, 0, 0, 0, 1]);
    this.addAnim('run', 0.1, [0, 1]);
    this.addAnim('beaming', 1, [2]);
    this.addAnim('joke', 0.2, [0, 0, 0, 0, 0, 0, 0, 8, 9, 8, 8, 9, 8, 9, 8, 9, 0], true);

    if (!ig.global.wm) {
      this.magicBeam = ig.game.spawnEntity(EntityMagicBeam, this.pos.x, this.pos.y, {});
      this.magicBeam.player = this;
    }
  },

  collideWith:function (other, axis) {
    this.dest = this.pos; // Stop moving
    this.parent(other, axis);
  },

  update:function () {
    if (this.state == PlayerState.START && this.noEntrance)
    {
      this.currentAnim = this.anims.run;

      this.pos.x = -100;
      this.dest = {x: 80, y: this.pos.y};
      this.state = PlayerState.PLAYING;
      ig.game.state = GameState.ENTERED;
    }
    else if (this.state == PlayerState.START && this.entrance) {
      this.currentAnim = this.anims.run;
      this.pos.x = this.entrance.pos.x - this.size.x;
      this.state = PlayerState.ENTERING;
    }
    else if (this.state == PlayerState.ENTERING) {

      var weirdGraphicalOffset = 3;
      this.currentAnim.sheet.clip.left = this.entrance.pos.x - this.pos.x - weirdGraphicalOffset;
      this.vel.x = this.maxVel.x;

      if (this.pos.x >= this.entrance.pos.x) {
        this.state = PlayerState.ENTERED;
        this.vel.x = this.maxVel.x;
        this.entrance.closeDoor();
      }
    }
    else if (this.state == PlayerState.ENTERED && this.entrance.isClosed()) {
      this.entrance.kill();
      this.dest = {x:this.pos.x, y:this.pos.y};
      this.state = PlayerState.PLAYING;
      ig.game.state = GameState.ENTERED;
    }
    else if (this.state == PlayerState.PLAYING)
    {
      if (ig.game.currentLevel == 4 && this.currentAnim != this.anims.joke) {
        this.anims.joke.rewind();
        this.currentAnim = this.anims.joke;
      }
      if (this.currentAnim == this.anims.joke) {
        this.parent();
        return;
      }

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
      // Ga naar links.
      } else if (this.pos.x > this.dest.x && real_dist > 1) {
        this.flip = true;
        this.accel.x = -accel;
      // Ga naar rechts.
      } else if (this.pos.x < this.dest.x && real_dist > 1) {
        this.flip = false;
        this.accel.x = accel;
      }

      // Update animation
      if (this.magicBeam.target) {
        this.currentAnim = this.anims.beaming;
      }
      else if (this.vel.x == 0 && this.accel.x == 0) {
        this.currentAnim = this.anims.idle;
        this.dest = this.pos;
      } else {
        this.currentAnim = this.anims.run;
      }

      this.currentAnim.flip.x = this.flip;
    }

    if (this.state == PlayerState.EXITIXING) {
      var right = (this.pos.x + this.size.x) - (this.exitixi.pos.x + this.exitixi.size.x);

      var weirdGraphicalOffset = 3;
      this.animSheet.clip.right = right + weirdGraphicalOffset;

      if (right >= this.size.x) {
        this.exitixi.closeDoor();
      }

      if (right > this.size.x + 150) {
        ig.game.loadNextLevel();
      }
    }

    // move!
    this.parent();
  },

  setBeamTarget: function (numberixi) {
    if (this.magicBeam.target && !numberixi)
      this.stopBeaming();
    if (numberixi && !this.magicBeam.target)
      this.startBeaming();

    this.magicBeam.target = numberixi;

    if (numberixi) {
      this.flip = this.pos.x > this.magicBeam.target.pos.x;
    }
  },

  startBeaming: function () {
    try {
      this.sound = new ig.Sound( 'media/magic.mp3' );
      this.sound.volume = 0.05;
      this.sound.play();
    }
    catch (e) {
      // sound stuff sometimes crashes on iPad, ignore
    }
  },

  stopBeaming: function () {
    try {
      if (this.sound)
        this.sound.stop();
    }
    catch (e) {
      // sound stuff sometimes crashes on iPad, ignore
    }
  },
});

EntityMagicBeam = ig.Entity.extend({
  size: { x: 952, y: 21 },

  type: ig.Entity.TYPE.NONE,
  checkAgainst: ig.Entity.TYPE.B,
  collides: ig.Entity.COLLIDES.NEVER,
  zIndex: 3,

  player: undefined,
  target: undefined,

  animSheet: null,

  init: function (x, y, settings) {
    this.parent(x, y, settings);

    this.animSheet = new ig.AnimationSheet('media/magic-beam.png', 952, 21);
    this.gravityFactor = 0;

    // Add the animations
    this.addAnim('pulsing', .2, [0, 1, 2, 3, 4, 5, 6]);
  },

  update: function () {

    if (!this.player) return;

    // position magic beam
    var wandPos = {
      x : this.player.pos.x + (this.player.flip ? 10 : 108),
      y : this.player.pos.y + 113
    };

    if (!this.target)
    {
      this.pos.x = -1000;
      this.pos.y = -1000;
      return;
    }
    var targetCenter = {
      x: this.target.pos.x + this.target.size.x / 2,
      y: this.target.pos.y + this.target.size.y / 2
    };

    this.pos.x = wandPos.x;
    this.pos.y = wandPos.y;
    this.size.width = this.dist(wandPos, targetCenter);
    this.animSheet.clip.right = this.animSheet.width - this.size.width;
    this.currentAnim.angle = -this.angle(wandPos, targetCenter) - Math.PI * .5;
    this.currentAnim.pivot.x = 0;
    this.currentAnim.pivot.y = 10;

    this.parent();
  },

  dist: function (p1, p2) {
    var dx = Math.abs(p1.x - p2.x);
    var dy = Math.abs(p1.y - p2.y);
    return Math.sqrt(dx*dx+ dy*dy);
  },

  angle: function (p1, p2) {
    return Math.atan2(p1.x - p2.x, p1.y - p2.y);
  }
});

});
