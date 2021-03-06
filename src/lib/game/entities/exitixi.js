ig.module(
  'game.entities.exitixi'
)
.requires(
  'impact.entity'
)
.defines(function(){

EntityExitixi = ig.Entity.extend({
  size: {x: 100, y: 183},
  offset: {x: 0, y: 0},

  type: ig.Entity.TYPE.B, // Evil enemy group
  checkAgainst: ig.Entity.TYPE.A, // Check against friendly
  collides: ig.Entity.COLLIDES.PASSIVE,
  entrance: false,

  animSheet: new ig.AnimationSheet( 'media/exitixi.png', 100, 183 ),


  init: function( x, y, settings ) {
    this.parent( x, y, settings );

    this.addAnim( 'closed', 1, [3], true );
    this.addAnim( 'opened', 1, [0], true );
    this.addAnim( 'open', .15, [3, 2, 1, 0], true );
    this.addAnim( 'close', .15, [0, 1, 2, 3], true );

    if (this.entrance) {
      this.currentAnim = this.anims.opened;
    }
    this.currentAnim.flip.x = this.entrance;
  },

  update: function() {
    if (ig.game.state == GameState.ENTERED && !this.entrance && this.currentAnim != this.anims.open) {
      this.anims.open.rewind();
      this.currentAnim = this.anims.open;
      ig.game.state = GameState.PLAYING;
    }
    this.parent();
  },

  handleMovementTrace: function( res ) {
    this.parent( res );
  },

  closeDoor: function () {
    if (this.currentAnim == this.anims.close || this.currentAnim == this.anims.closed) return;

    this.anims.close.rewind();
    this.currentAnim = this.anims.close;
    this.currentAnim.flip.x = this.entrance;
  },
  isClosed: function () {
    return this.currentAnim == this.anims.close && this.currentAnim.frame == 3;
  },

  check: function( other ) {
    var isPlayer =  other instanceof EntityPlayer;
    if (!isPlayer) return;

    if (this.entrance) {
      other.entrance = this;
    }

    if( other.state != PlayerState.PLAYING ) {
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
