/**
 * Created by ben on 6/10/15.
 */

Game = {
    // This defines our grid's size and the size of each of its tiles
    map_grid: {
        width:  24,
        height: 16,
        tile: {
            width:  32,
            height: 32
        }
    },

    // The total width of the game screen. Since our grid takes up the entire screen
    //  this is just the width of a tile times the width of the grid
    width: function() {
        return this.map_grid.width * this.map_grid.tile.width;
    },

    // The total height of the game screen. Since our grid takes up the entire screen
    //  this is just the height of a tile times the height of the grid
    height: function() {
        return this.map_grid.height * this.map_grid.tile.height;
    },

    // Initialize and start our game
    start: function() {
        // Start crafty and set a background color so that we can see it's working
        Crafty.init(Game.width(), Game.height());
        Crafty.background('rgb(249, 223, 125)');

        Crafty.scene('Loading');
    }
};

Crafty.c('Grid', {
    init: function() {
        this.attr({
            w: Game.map_grid.tile.width,
            h: Game.map_grid.tile.height
        });
    },
    // Locate this entity at the given position on the grid
    at: function(x, y) {
        if (x === undefined && y === undefined) {
            return { x: this.x / Game.map_grid.tile.width, y: this.y / Game.map_grid.tile.height }
        } else {
            this.attr({ x: x * Game.map_grid.tile.width, y: y * Game.map_grid.tile.height });
            return this;
        }
    }


});


// An "Actor" is an entity that is drawn in 2D on canvas
//  via our logical coordinate grid
Crafty.c('Actor', {
    init: function() {
        this.requires('2D, Canvas, Grid');
    },
});

Crafty.c('Tree', {
    init: function() {
        this.requires('Actor, Color, Solid');
        this.color('rgb(20, 125, 40)');
    }
});

Crafty.c('Bush', {
    init: function() {
        this.requires('Actor, Color, Solid');
        this.color('rgb(20, 185, 40)');
    }
});


// This is the player-controlled character
Crafty.c('PlayerCharacter', {
    init: function() {
        this.requires('Actor, Fourway, player_sprite, SpriteAnimation, Collision')
            .fourway(4)
            .bind('Moved', this.checkCollision)
            .onHit('Village', this.visitVillage)
            .bind('NewDirection', this.changeDirection)
            .reel('player_up', 500, 0, 0, 3)
            .reel('player_right', 500, 0, 1, 3)
            .reel('player_down', 500, 0, 2, 3)
            .reel('player_left', 500, 0, 3, 3)
    },

    changeDirection : function(e){
        if(e.x > 0){
            this.animate('player_right', -1);
        }else if(e.x < 0){
            this.animate('player_left', -1);
        }else if(e.y < 0){
            this.animate('player_up', -1);
        }else if(e.y > 0){
            this.animate('player_down', -1);
        }else{
            this.pauseAnimation();
        }
    },

    checkCollision: function (from) {
        /*
            We are simply moving the player
            back to the position they started at before the collision.
         */
        if(this.hit('Solid')){
            var attrs = {};
            attrs[from.axis] = from.oldValue;
            this.attr(attrs);
        }
    },

    visitVillage: function (data){
        var village = data[0].obj;
        village.collect();
    }



});

// A village is a tile on the grid that the PC must visit in order to win the game
Crafty.c('Village', {
    init: function() {
        this.requires('Actor, Color')
            .color('rgb(170, 125, 40)');
    },

    collect: function() {
        this.destroy();
        Crafty.trigger('VillageVisited', this);
    }
});

