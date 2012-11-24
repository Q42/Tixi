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
  
  type: ig.Entity.TYPE.B, // Evil enemy group
  checkAgainst: ig.Entity.TYPE.A, // Check against friendly
  collides: ig.Entity.COLLIDES.FIXED,
  
  animSheet: new ig.AnimationSheet( 'media/answerixi.png', 205, 317 ),

  init: function( x, y, settings ) {
    this.parent( x, y, settings );

    this.addAnim( 'idle', 1, [0] );
    // TODO animatie versoepelen
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
