'use strict';

angular.module('crescendoApp')
.controller('Game1Ctrl', [ '$state', '$scope', 'AuthService', 'ScoreService', 
function ($state, $scope, AuthService, ScoreService) {

  $scope.$on('$destroy', function () {
    game.destroy();
  });
  
  AuthService.getSession().success(function(user) {
    $scope.userId = user.id;
  });

  // Initializes game and 
  var game = new Phaser.Game(640, 480, Phaser.AUTO, 'gameview');

  var PhaserGame = function () {


    // Initializes game assets
    this.player      = null;
    this.platforms   = null;
    this.sky         = null;
    this.bubbles     = null;

    // Sets game score and lives
    $scope.score     = 0;
    this.totalScore  = 120;
    this.scoreText   = 0;
    this.lives       = 3;
    this.livesText   = 3;
    this.pointsPerBubble = 10;

    // Game controls
    this.facing      = 'left';
    this.edgeTimer   = 0;
    this.jumpTimer   = 0;
    this.wasStanding = false;
    this.cursors     = null;

    // Sets musical scale
    this.cMajorScale = ['bubbleC', 'bubbleD', 'bubbleE', 'bubbleF', 'bubbleG',
                      'bubbleA', 'bubbleB'];

    // Bubbles
    this.bubbleBurst            = null;
    this.randomBubbleCollection = [];

    this.music = null;
  };

  PhaserGame.prototype = {

    init: function () {
      this.world.resize(640, 2000);
      this.physics.startSystem(Phaser.Physics.ARCADE);
      this.physics.arcade.gravity.y = 750;
      this.physics.arcade.skipQuadtree = false;
    },

    // Load assets
    preload: function () {
      this.load.image('trees',        'images/trees.png');
      this.load.image('clouds',       'images/clouds.png');
      this.load.image('bubbleA',      'images/a-bubble.png');
      this.load.image('bubbleAsh',    'images/a-sh-bubble.png');
      this.load.image('bubbleB',      'images/b-bubble.png');
      this.load.image('bubbleC',      'images/c-bubble.png');
      this.load.image('bubbleCsh',    'images/c-sh-bubble.png');
      this.load.image('bubbleD',      'images/d-bubble.png');
      this.load.image('bubbleDsh',    'images/d-sh-bubble.png');
      this.load.image('bubbleE',      'images/e-bubble.png');
      this.load.image('bubbleF',      'images/f-bubble.png');
      this.load.image('bubbleFsh',    'images/f-sh-bubble.png');
      this.load.image('bubbleG',      'images/g-bubble.png');
      this.load.image('bubbleGsh',    'images/g-sh-bubble.png');
      this.load.image('platform',     'images/moving_platform.png');
      this.load.image('ice-platform', 'images/ice-platform.png');
      this.load.audio('bubbleburst',  'audio/woodblock.mp3');
      this.load.audio('ragtime',      'audio/sunflowerslowdrag.mp3');
      this.load.spritesheet('dude',   'images/crescendodude.png', 49.6, 68);
    },

    create: function () {
      // Centers game canvas
      this.game.scale.pageAlignHorizontally = true;
      this.game.scale.pageAlignVertically = true;
      this.game.scale.refresh();

      //Creates background
      this.stage.backgroundColor = '#2f9acc';
      this.sky = this.add.tileSprite(0, 0, 640, 480, 'clouds');
      this.sky.fixedToCamera = true;
      this.add.sprite(0, 1906, 'trees');

      // Enables platform physics
      this.platforms = this.add.physicsGroup();

      // Creates platforms with random 
      // horizontal velocities
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

      // Configures platforms
      this.platforms.setAll('body.allowGravity', false);
      this.platforms.setAll('body.immovable', true);

      // Creates character
      this.player = this.add.sprite(320, 1952, 'dude');

      // Sets character physics
      this.physics.arcade.enable(this.player);
      this.player.body.setSize(45, 52, 0, 16);
      this.player.body.collideWorldBounds = true;

      // Character animations
      var playerFrames = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
                          13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25];                    
      this.player.animations.add('left',  playerFrames, 30, true); 
      this.player.animations.add('right', playerFrames, 30, true); 
      this.camera.follow(this.player);

      // Creates bubbles and bubble sound
      this.bubbleSpawn();
      this.bubbleBurst = game.add.audio('bubbleburst');

      // Adds music
      this.music = game.add.audio('ragtime');
      this.music.play();

      // Places game score
      this.scoreText = game.add.text(16, 16, 'score: 0', 
        { fontSize: '32px', fill: '#000' });

      // Places game lives
      this.livesText = game.add.text(100, 40, 'lives: 3',
        { fontSize: '32px', fill: '#000' });

      // Sets game controls
      this.cursors = this.input.keyboard.createCursorKeys();
      this.jump = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    },

    // Platform positioning based on velocity
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

      var badNoteScore  = this.badNotesArray().length * this.pointsPerBubble;
      var goodNoteScore = this.totalScore - badNoteScore;

      // Game over conditional 
      if ((this.lives > 0) ) {
        // Allows player to collect bubbles
        this.physics.arcade.overlap(this.player, this.randomBubbleCollection, 
                                    this.collectBubble, null, this);
      } else {
        // Game over and score posted to API
        ScoreService.postScore($scope.userId, $scope.score);    
        game.destroy();
        $state.go('dashboard');
      } 

      if (($scope.score === (goodNoteScore - 10))) {
          this.bubbleSpawn();
          this.physics.arcade.overlap(this.player, this.randomBubbleCollection, 
                                    this.collectBubble, null, this);
        }

      // Repeats sky image as camera moves on y axis
      this.sky.tilePosition.y = -(this.camera.y * 0.7);

      // Calls platform positioning
      this.platforms.forEach(this.wrapPlatform, this);

      // Allows collision of world objects
      this.physics.arcade.collide(this.randomBubbleCollection);
      this.physics.arcade.collide(this.badNotesArray);
      this.physics.arcade.collide(this.randomBubbleCollection, this.platforms);
      this.physics.arcade.collide(this.badNotesArray, this.platforms);
      this.physics.arcade.collide(this.player, this.platforms, 
                                  this.setFriction, null, this);
      
      // Fixes score and lives text to camera view
      this.scoreText.x = this.camera.x;
      this.scoreText.y = this.camera.y;
      this.livesText.x = this.camera.x;
      this.livesText.y = this.camera.y + 30;

      // Sets initial player velocity
      this.player.body.velocity.x = 0;


      // Sets player sprite frames and velocity for game key controls
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

      // Checks if character is touching a surface and controls jump time
      var standing = this.player.body.blocked.down ||
                     this.player.body.touching.down;

      if (!standing && this.wasStanding) {

        this.edgeTimer = this.time.time + 250;
      }

      if ((standing || this.time.time <= this.edgeTimer) &&
          (this.cursors.up.isDown || this.jump.isDown) && 
           this.time.time > this.jumpTimer) {
  
        this.player.body.velocity.y = -500;
        this.jumpTimer = this.time.time + 750;
      }

      this.wasStanding = standing;
    },

    bubbleRandomizer: function() {
      return _.sample(['bubbleA', 'bubbleAsh', 'bubbleB', 'bubbleC', 'bubbleCsh', 'bubbleD', 
                       'bubbleDsh', 'bubbleE', 'bubbleF', 'bubbleFsh', 'bubbleG', 'bubbleGsh']);
    },

    bubbleSpawn: function () {
      var self = this;

      // Creates 12 bubbles with physics and groups them
      self.bubbles = game.add.group();
      self.bubbles.enableBody = true;

      for (var i = 0; i < 12; i++) {
        
        // Sets each bubble's origin point
        var bubble = self.bubbles.create(i * 70, (self.camera.screenView.height + 700), self.bubbleRandomizer());

        this.randomBubbleCollection.push(bubble);
      
        // Randomizes each bubble's bounce
        bubble.body.bounce.y = 0.85 + Math.random() * 0.2;

        bubble.body.collideWorldBounds = true;

        // Randomizes each bubble's gravity 
        bubble.body.gravity.y = Math.floor(Math.random() * (1 - 700 + 740)) - 740;
      }
    },

    collectBubble: function(player, bubble) {

      // Removes bubble from view and plays pop sound
      bubble.kill();
      this.bubbleBurst.play();

      // Criteria for increasing/decreasing score and lives
      if (_.contains(this.cMajorScale, bubble.key.toString())) {
        $scope.score       += this.pointsPerBubble;
        this.scoreText.text = 'Score: ' + $scope.score;
      }
      else {
        this.lives         -= 1;
        this.livesText.text = 'Lives: ' + this.lives;
      }
    },

    badNotesArray: function() {
      var allBubbles = _.map(this.randomBubbleCollection, function (bubble) {
        return bubble.key.toString();
      });
      return _.difference(allBubbles, this.cMajorScale);
    }  
  };

  // Creates game state in DOM
  game.state.add('Game', PhaserGame, true);

}]);