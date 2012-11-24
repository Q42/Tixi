ig.module(
  'game.entities.operatorixi'
)
.requires(
  'impact.entity'
)
.defines(function(){
  
EntityOperatorixi = ig.Entity.extend({
  size: {x: 340 - 57*2, y: 227 - 17*2},
  offset: {x: 57, y: 17},
  numberixi1: undefined,
  numberixi2: undefined,
  zIndex: 2,
  
  type: ig.Entity.TYPE.A, // Evil enemy group
  checkAgainst: ig.Entity.TYPE.B, // Check against friendly
  collides: ig.Entity.COLLIDES.NEVER,
  
  animSheet: new ig.AnimationSheet( 'media/operatorixi.png', 340, 227 ),
  
  
  init: function( x, y, settings ) {
    this.parent( x, y, settings );

    this.addAnim( 'idle', .25, [0, 0, 0, 0, 0, 0, 3, 4, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] );
    this.addAnim( 'operate', .2, [0, 1, 2, 1] );
  },
  
  
  update: function() {
    if (this.numberixi1 && this.numberixi2 && this.numberixi1.state == NumberixiState.LOCKED && this.numberixi2.state == NumberixiState.LOCKED) {
      var newNumberixi = this.numberixi1.number + this.numberixi2.number;
      this.numberixi1.kill();
      this.numberixi1 = null;
      this.numberixi2.kill();
      this.numberixi2 = null;
      this.anims.operate.rewind();
      this.currentAnim = this.anims.operate;
      var self = this;
      setTimeout(function() {
        ig.game.spawnEntity('EntityNumberixi', self.pos.x + 60, self.pos.y + 60, {
          number: newNumberixi
        });
        self.anims.idle.rewind();
        self.currentAnim = self.anims.idle;
      }, 1800);
    }

    this.parent();
  },

  handleMovementTrace: function( res ) {
    this.parent( res );
  }
});

});
