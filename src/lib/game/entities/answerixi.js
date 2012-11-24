ig.module(
  'game.entities.answerixi'
)
.requires(
  'impact.entity'
)
.defines(function(){
  
EntityAnswerixi = ig.Entity.extend({
  size: {x: 205, y: 317 - 14 * 2},
  offset: {x: 0, y: 14},
  number: 2,
  zIndex: 2,
  
  type: ig.Entity.TYPE.B, // Evil enemy group
  checkAgainst: ig.Entity.TYPE.A, // Check against friendly
  collides: ig.Entity.COLLIDES.FIXED,
  
  animSheet: new ig.AnimationSheet( 'media/answerixi.png', 205, 317 ),
  image2: new ig.Image( 'media/answerixi.png' ),
  image5: new ig.Image( 'media/answerixi5.png' ),

  init: function( x, y, settings ) {
    this.parent( x, y, settings );

    if (this.number == 2) {
      this.animSheet.image = this.image2;
    }
    else if (this.number == 5) {
      this.animSheet.image = this.image5;
    }

    this.addAnim( 'idle', 1, [0] );
    this.addAnim( 'death', .1, [0, 1, 2, 3, 4, 5, 6, 7, 8], true );
  },
  
  update: function() {
    if (this.anims.death.loopCount > 0) {
        this.kill();
    }
    this.parent();
  },

  cleanup: function() {
    this.anims.death.rewind();
    this.currentAnim = this.anims.death;
  },

  handleMovementTrace: function( res ) {
    this.parent( res );
  },  
  
  check: function( other ) {
    //finish
  }
});

});
