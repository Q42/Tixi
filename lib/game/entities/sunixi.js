ig.module(
  'game.entities.sunixi'
)
.requires(
  'impact.entity'
)
.defines(function(){
  
EntitySunixi = ig.Entity.extend({
  size: {x: 180, y: 173},
  
  type: ig.Entity.TYPE.A,
  checkAgainst: ig.Entity.TYPE.B,
  collides: ig.Entity.COLLIDES.NEVER,

  gravityFactor: 0,
  friction: {x: 0, y: 0},
  vel: {x: 0, y: 0},
  pos: {x: 880, y: 28},
  zIndex: -10,
  animSheet: new ig.AnimationSheet( 'media/sunixi.png', 180, 173 ),

  init: function( x, y, settings ) {
    this.parent( x, y, settings );
    this.pos = {x: 790, y: 28};

    this.addAnim( 'idle', 1, [0], true );
    this.currentAnim.flip.x = true;
  },
  
  update: function() {
    this.parent();
  }

});

});