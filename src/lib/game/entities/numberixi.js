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
  size: {x: 113, y: 92},
  offset: {x: 10, y: 15},
  originalMaxVel: {x: 100, y: 100},
  returningMaxVel: {x: Infinity, y: Infinity},
  maxVel: {x: 100, y: 100},
  friction: {x: 150, y: 0},
  zIndex: 2,

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

  number: 1,

  animSheet: new ig.AnimationSheet( 'media/numberixi.png', 133, 122 ),


  init: function( x, y, settings ) {
    this.parent( x, y, settings );

    number = this.number - 2; //temp
    var offsetCalc = function(x) { return x + number * 6; };

    this.addAnim( 'pause', 1, [0].map(offsetCalc));
    this.addAnim( 'pauseflipped', 1, [1].map(offsetCalc));
    this.addAnim( 'crawl', Math.random()*0.1+0.15, [0, 0, 4, 4, 0, 0, 4, 4, 0, 0, 4, 4, 0, 2, 4, 4].map(offsetCalc) );
    this.addAnim( 'crawlflipped', Math.random()*0.1+0.15, [1, 1, 5, 5, 1, 1, 5, 5, 1, 1, 5, 5, 1, 3, 5, 5].map(offsetCalc) );
        this.addAnim( 'death', 1, [0], true);

        this.maxWalkDistance = Math.random()*20+80;

    this.startX = this.pos.x;
  },

    cleanup: function() {
        this.currentAnim = this.anims.death;
    },

    getPlayer: function () {
      return ig.game.getEntitiesByType('EntityPlayer')[0];
    },

    update: function() {
        if (this.anims.death.loopCount > 0) {
            this.kill();
        }

        this._stopDragging = function() {
      this.state = NumberixiState.RETURNING;
        this.gravityFactor = 0;
          var dx = this.dragStartPos.x - this.pos.x;
          var dy = this.dragStartPos.y - this.pos.y;
          this.dragReturnVelocity.x = dx * 1.5;
          this.dragReturnVelocity.y = dy * 1.5;
          this.maxVel = this.returningMaxVel;
        }

      var player = this.getPlayer();
      var distanceToPlayer = this.distanceTo( player )
      var maxDragDistance = 400

        switch (this.state) {
          case NumberixiState.IDLE:
            player.showMagicBeam(false);
        if (ig.input.pressed('click') && this.inFocus()) {
          // Draggen alleen toegestaan als je in range bent.
          if( distanceToPlayer < maxDragDistance ) {
                this.state = NumberixiState.DRAGGING;
                this.currentAnim = this.movingLeft ? this.anims.pause : this.anims.pauseflipped;
                this.dragStartPos = this.pos;
                this.dragOffset.x = ig.input.mouse.x - this.pos.x;
                this.dragOffset.y = ig.input.mouse.y - this.pos.y;
                this.collides = ig.Entity.COLLIDES.NEVER;
          } else {
            return;
          }
          }
          else
          {
            this.gravityFactor = 1;
              this.collides = ig.Entity.COLLIDES.PASSIVE;
              this.maxVel = this.originalMaxVel;
          this.autoWalk();
        }

            break;

          case NumberixiState.DRAGGING:
            player.showMagicBeam(true);
            // TODO voor Tom als we buiten het scherm bewegen, releasen
          if (ig.input.released('click')) {
              this._stopDragging()

                // check answerixis
                var answerixis = ig.game.getEntitiesByType('EntityAnswerixi');
                var numberixi = this;
                answerixis.forEach(function(answerixi) {
                    var dx = Math.round(numberixi.pos.x - answerixi.pos.x);
                    var dy = Math.round(numberixi.pos.y - answerixi.pos.y);
                    var offBy = 100;
                    if (dx > 51-offBy && dx < 51+offBy && dy > 55-offBy && dy < 55+offBy) {
                        numberixi.state = NumberixiState.IDLE;
                        answerixi.cleanup();
                        numberixi.cleanup();
                    }
                });

          }

          // Als je uit range dragged gaat de numberixi terug.
        // if( distanceToPlayer < maxDragDistance ) {
            this.pos.x = ig.input.mouse.x - this.dragOffset.x;
            this.pos.y = ig.input.mouse.y - this.dragOffset.y;
        //   }else {
        //       this._stopDragging();
        // }
          break;

      case NumberixiState.RETURNING:
        player.showMagicBeam(true);

          var originalXPosReached = (this.dragReturnVelocity.x < 0 && this.pos.x <= this.dragStartPos.x) || (this.dragReturnVelocity.x >= 0 && this.pos.x >= this.dragStartPos.x);
        var originalYPosReached = (this.dragReturnVelocity.y < 0 && this.pos.y <= this.dragStartPos.y) || (this.dragReturnVelocity.y >= 0 && this.pos.y >= this.dragStartPos.y);

        if (originalXPosReached && originalYPosReached) {
          this.state = NumberixiState.IDLE;
          return;
        }

            this.vel.x = originalXPosReached ? 0 : this.dragReturnVelocity.x;
            this.vel.y = originalYPosReached ? 0 : this.dragReturnVelocity.y;

            break;
        }

    player.pointBeamAt({
      x: this.pos.x + this.size.x / 2,
      y: this.pos.y + this.size.y / 2
    });

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
  }
});

});
