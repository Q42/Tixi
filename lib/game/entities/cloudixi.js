ig.module(
  'game.entities.cloudixi'
)
.requires(
  'impact.entity'
)
.defines(function(){
  
EntityCloudixi = ig.Entity.extend({
  size: {x: 705, y: 193},
  
  type: ig.Entity.TYPE.A,
  checkAgainst: ig.Entity.TYPE.B,
  collides: ig.Entity.COLLIDES.NEVER,

  gravityFactor: 0,
  friction: {x: 0, y: 0},
  vel: {x: -10, y: 0},
  
  animSheet: new ig.AnimationSheet( 'media/cloud.png', 705, 193 ),

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