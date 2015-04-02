'use strict';

angular.module('crescendoApp')
.controller('Game1Ctrl', [function () {

  var game = new Phaser.Game(640, 480, Phaser.AUTO, 'gameview');

  var PhaserGame = function () {

    this.player = null;
    this.platforms = null;
    this.sky = null;
    this.bubbles = null;
    this.score = 0;
    this.scoreText = 0;

    this.facing = 'left';
    this.edgeTimer = 0;
    this.jumpTimer = 0;

    this.wasStanding = false;
    this.cursors = null;
  };

  PhaserGame.prototype = {

    init: function () {

      this.game.renderer.renderSession.roundPixels = true;

      this.world.resize(640, 2000);

      this.physics.startSystem(Phaser.Physics.ARCADE);

      this.physics.arcade.gravity.y = 750;
      this.physics.arcade.skipQuadtree = false;

    },

    preload: function () {

      this.load.image('trees', 'images/trees.png');
      this.load.image('clouds', 'images/clouds.png');
      this.load.image('bubble', 'images/a-bubble.png');
      this.load.image('platform', 'images/moving_platform.png');
      this.load.image('ice-platform', 'images/ice-platform.png');
      this.load.spritesheet('dude', 'images/crescendodude.png', 49.6, 68);
    },

    create: function () {

      this.stage.backgroundColor = '#2f9acc';

      this.sky = this.add.tileSprite(0, 0, 640, 480, 'clouds');
      this.sky.fixedToCamera = true;
      // this.scoreText.fixedToCamera = true;

      this.add.sprite(0, 1906, 'trees');

      this.platforms = this.add.physicsGroup();

      var x = 0;
      var y = 64;

      for (var i = 0; i < 19; i++) {

        var type = i % 2 === 1 ? 'platform' : 'ice-platform';
        var platform = this.platforms.create(x, y, type);

        platform.body.velocity.x = this.rnd.between(100, 150);

        if (Math.random() > 0.5) {
          platform.body.velocity.x *= -1;
        }

        x += 200;

        if (x >= 600) {
          x = 0;
        }

        y+= 104;
      }

      this.platforms.setAll('body.allowGravity', false);

      this.platforms.setAll('body.immovable', true);

      this.player = this.add.sprite(320, 1952, 'dude');

      this.physics.arcade.enable(this.player);

      this.player.body.collideWorldBounds = true;
      this.player.body.setSize(45, 52, 0, 16);

      this.player.animations.add('left',  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
                                   13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25], 30, true);
      // this.player.animations.add('turn', [4], 20, true);
      this.player.animations.add('right',  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
                                   13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25], 30, true);

      this.camera.follow(this.player);

      this.bubbles = game.add.group();
      this.bubbles.enableBody = true;

      for (i = 0; i < 12; i++) {

        var bubble = this.bubbles.create(i * 70, 0, 'bubble');

        bubble.body.gravity.y = 86;
        // bubble.body.gravity.y = 9;

        bubble.body.bounce.y = 0.7 + Math.random() * 0.2;
      }

      this.scoreText = game.add.text(16, 16, 'score: 0', 
        { fontSize: '32px', fill: '#000' });

      this.cursors = this.input.keyboard.createCursorKeys();
    },

    wrapPlatform: function (platform) {

      if (platform.body.velocity.x < 0 && platform.x <= -160) {
        platform.x = 640;
      }
      else if (platform.body.velocity.x > 0 && platform.x >= 640) {
        platform.x = -160;
      }
    },

    setFriction: function (player, platform) {

      if (platform.key === 'ice-platform') {
        player.body.x -= platform.body.x - platform.body.prev.x;
      }
    },

    update: function () {

      this.sky.tilePosition.y = -(this.camera.y * 0.7);

      this.platforms.forEach(this.wrapPlatform, this);

      this.physics.arcade.collide(this.player, this.
        platforms, this.setFriction, null, this);

      this.physics.arcade.collide(this.bubbles, this.platforms);

      this.physics.arcade.overlap(this.player, this.bubbles, this.collectBubble, null, this);

      var standing = this.player.body.blocked.down ||
      this.player.body.touching.down;

      this.player.body.velocity.x = 0;

      if (this.cursors.left.isDown) {

        this.player.body.velocity.x = -200;

        if (this.facing !== 'left') {

          this.player.anchor.setTo(0.5, 0);
          this.player.scale.x = -1;
          this.player.play('left');
          this.facing = 'left';
        }
      }
      else if (this.cursors.right.isDown) {

        this.player.body.velocity.x = 200;

        if (this.facing !== 'right') {

          this.player.scale.x = 1;
          this.player.play('right');
          this.facing = 'right';
        }
      }
      else {

        if (this.facing !== 'idle') {

          this.player.animations.stop();

          if (this.facing === 'left') {

            this.player.frame = 0;
          }
          else {

            this.player.frame = 5;
          }
          this.facing = 'idle';
        }
      }

      if (!standing && this.wasStanding) {

        this.edgeTimer = this.time.time + 250;
      }

      if ((standing || this.time.time <= this.edgeTimer) &&
        this.cursors.up.isDown && this.time.time > this.jumpTimer) {

        this.player.body.velocity.y = -500;
        this.jumpTimer = this.time.time + 750;
      }

      this.wasStanding = standing;
    },

    collectBubble: function(player, bubble) {

      bubble.kill();
      this.score += 10;
      this.scoreText.text = 'Score: ' + this.score;
    }

    // render: function () {
    //   this.game.debug.body(this.player);
    // }
  };

  game.state.add('Game', PhaserGame, true);

}]);








