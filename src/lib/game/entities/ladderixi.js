ig.module(
  'game.entities.ladderixi'
)
.requires(
  'impact.entity'
)
.defines(function(){
  
EntityLadderixi = ig.Entity.extend({
  size: {x: 93, y: 232},
  
  type: ig.Entity.TYPE.A,
  checkAgainst: ig.Entity.TYPE.B,
  collides: ig.Entity.COLLIDES.NEVER,

  gravityFactor: 0,
  friction: {x: 0, y: 0},
  vel: {x: 0, y: 0},
  zIndex: 2,
  animSheet: new ig.AnimationSheet( 'media/ladderixi.png', 93, 232 ),

  init: function( x, y, settings ) {
    this.parent( x, y, settings );

    this.addAnim( 'idle', 1, [0], true );
  },
  
  update: function() {
    this.parent();
  }

});

});