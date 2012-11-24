ig.module(
  'game.entities.outro'
)
.requires(
  'impact.entity'
)
.defines(function(){
  
EntityOutro = ig.Entity.extend({
  size: {x: 409, y: 249},
  
  type: ig.Entity.TYPE.B, // Evil enemy group
  checkAgainst: ig.Entity.TYPE.A, // Check against friendly
  collides: ig.Entity.COLLIDES.FIXED,
  
  animSheet: new ig.AnimationSheet( 'media/outro.png', 409, 249 ),
  
  init: function( x, y, settings ) {
    this.parent( x, y, settings );
    this.gravityFactor = 0;
    this.addAnim( 'idle', 1, [0] );
  }
});

});
