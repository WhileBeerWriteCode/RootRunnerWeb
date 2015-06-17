/**
 * Created by ben on 6/13/15.
 */

Crafty.scene('Game', function () {

});


Crafty.scene("Loading", function(){
   Crafty.e('2D, DOM, Text')
       .text('Loading...')
       .attr({x: 0, y: Game.height() / 2 - 24, w: Game.width()})
       .textColor('green')
       .css('text-align', 'center')

       /*
            http://craftyjs.com/api/DOM.html
            Note: For entities with "Text" component,
            some css properties are controlled by separate functions .textFont() and .textColor(),
            and ignore .css() settings. See Text component for details.
        */
       .textFont({
           size: '48px',
           weight: 400,
           family: 'Source Code Pro',
           color: 'green'
       });

    var assets = {
      sprites:  {
          "assets/player.png":{
              tile: 48,
              tileh: 64,
              map:{
                  player_sprite: [0, 0]
              }
          }
      }
    };

    var deferredAssets = $.Deferred();
    Crafty.load(assets, function(){
        deferredAssets.resolve();
    });

    var deferredMaps = $.ajax("world.json").done(function(data){
        console.log(data);
        Crafty.asset('world', data);
    });

    $.when(deferredAssets, deferredMaps).then(function(){
       Crafty.scene('Game');
    })
});
