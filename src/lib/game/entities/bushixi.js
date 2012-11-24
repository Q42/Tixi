ig.module(
  'game.entities.bushixi'
)
.requires(
  'impact.entity'
)
.defines(function(){
  
EntityBushixi = ig.Entity.extend({
  size: {x: 190, y: 190},
  
  type: ig.Entity.TYPE.A,
  checkAgainst: ig.Entity.TYPE.B,
  collides: ig.Entity.COLLIDES.NEVER,

  gravityFactor: 0,
  friction: {x: 0, y: 0},
  vel: {x: 0, y: 0},
  zIndex: 1,
  animSheet: new ig.AnimationSheet( 'media/bush.png', 190, 190 ),

  init: function( x, y, settings ) {
    this.parent( x, y, settings );

    this.addAnim( 'idle', 1, [0], true );
    this.currentAnim.flip.x = true;
  },
  
  update: function() {
    this.parent();
  }

});

});