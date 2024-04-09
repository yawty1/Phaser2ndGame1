var config = {
    type: Phaser.AUTO,
    width: 1920,
    height: 1080,
    playerSpeed:1000,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },

    scene: {
        preload: preload,
        create: create,
        update: update
    }
};
//game config
var game = new Phaser.Game(config);
var worldwidth = config.width*6
var star
var score = 0
var bombs 
var bomb 
var lifeLine
var lives = 4
var lifeText
var enemyCount = 10
//assets preload
function preload() {
    this.load.image('tile1', 'assets/tile1.png')
    this.load.image('tile2', 'assets/tile2.png')
    this.load.image('tile3', 'assets/tile3.png')
    this.load.image('bush', 'assets/bush.png')
    this.load.image('rock', 'assets/rock.png')
    this.load.image('tree', 'assets/tree.png')
    this.load.image('tile', 'assets/tile.png')
    this.load.image('fon+', 'assets/fon+.jpg')
    this.load.image('ground', 'assets/platform.png')
    this.load.image('star', 'assets/star.png')
    this.load.image('bomb', 'assets/bomb.png')
    this.load.image('reset', 'assets/reset.png')
    this.load.image('fire', 'assets/fire.png')
    this.load.image('enemy', 'assets/enemy.png')
    this.load.spritesheet('dude',
        'assets/dude.png',
        { frameWidth: 32, frameHeight: 48 }
    );
}

function create() {
    this.add.tileSprite(0, 0, worldwidth, 1080, "fon+").setOrigin(0, 0);
//main platform
    platforms = this.physics.add.staticGroup();
    for (var x = -50; x < worldwidth; x = x + 128) {
        platforms.create(x, 1080 -64, 'tile')
    }

//player physics
    player = this.physics.add.sprite(500, 450, 'dude');
    player
        .setBounce(0.2)
        .setCollideWorldBounds(true)
        .setScale(2)
        .setDepth(5)

    cursors = this.input.keyboard.createCursorKeys();
    this.physics.add.collider(player, platforms)
//enemy
    enemy = this.physics.add.group({
        key: 'enemy',
        repeat: worldwidth/600,
        setXY: { x: 300, y: 700 - 150, stepX: Phaser.Math. FloatBetween (300, 500) }
        });
        enemy.children.iterate (function (child) {
        child
        //.setBounce (Phaser.Math. FloatBetween(0, 1))
        .setCollideWorldBounds (true)
        .setVelocityX(Phaser.Math. FloatBetween(-500, 500))   });
 //camera settings
    this.cameras.main.setBounds(0,0, worldwidth,1080)
    this.physics.world.setBounds(0,0, worldwidth,1080) 
    this.cameras.main.startFollow(player) 
//tree sprite
    tree = this.physics.add.staticGroup()
    for (var x = 0; x < worldwidth; x = x + Phaser.Math.FloatBetween(500,1000)){

        tree
            .create(x,1080-128,'tree')
            .setOrigin(0,1)
            .setScale(Phaser.Math.FloatBetween(.75,1))
            .setDepth(Phaser.Math.Between(1,10))
    }
//bush sprite
    bush = this.physics.add.staticGroup()
    for (var x = 0; x < worldwidth; x = x + Phaser.Math.FloatBetween(300,750)){

        bush
            .create(x,1080-128,'bush')
            .setOrigin(0,1)
            .setScale(Phaser.Math.FloatBetween(1.5,2))
            .setDepth(Phaser.Math.Between(1,10))
    }
//rock sprite
    rock = this.physics.add.staticGroup()
    for (var x = 0; x < worldwidth; x = x + Phaser.Math.FloatBetween(200,400)){

        rock
            .create(x,1080-128,'rock')
            .setOrigin(0,1)
            .setScale(Phaser.Math.FloatBetween(.3,.75))
            .setDepth(Phaser.Math.Between(1,10))
    }
//sky platform
    for(var x=0; x<worldwidth; x=x +128*6){
        var y = Phaser.Math.Between(500,700)
        platforms.create(x,y,'tile1')
        platforms.create(x+128,y,'tile2')
        platforms.create(x+256,y,'tile3')
        //platform rock
        rock
            .create(x+128,y-65,'rock')
            .setScale(Phaser.Math.FloatBetween(1,.8))
            .setDepth(Phaser.Math.Between(1,10))

    }
//anims
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

     this.anims.create({
         key: 'turn',
        frames: [{ key: 'dude', frame: 4 }],
         frameRate: 20
     });

     this.anims.create({
         key: 'right',
         frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
         frameRate: 10,
         repeat: -1
     });
//stars
     stars = this.physics.add.group({
        key: 'star',
        repeat: worldwidth / 12,
        setXY: { x: 12, y: 0, stepX: 120 }
    });
    stars.children.iterate(function (child) {

        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

    });
    function collectStar(player, star) {
        star.disableBody(true, true);
        score += 1;
        var bomb = bombs.create(Phaser.Math.Between(-200, worldwidth ), 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        scoreText.setText('Score: ' + score);

        if (stars.countActive(true) === 0) {
            gameover = true;
    }
}
    this.physics.add.collider(stars, platforms);

    this.physics.add.overlap(player, stars, collectStar, null, this);
//score n lives text    
    scoreText = this.add.text(50, 35, 'Score: 0', { fontSize: '32px', fill: '#000000' }).setOrigin(0, 0).setScrollFactor(0);
    lifeText = this.add.text(250, 35, 'lives: 🖤 🖤 🖤 🖤', { fontSize: '32px', fill: '#000000' }).setOrigin(0, 0).setScrollFactor(0);
    bombs = this.physics.add.group();
//collision platforms w/ enemies n bombs
    this.physics.add.collider(bombs, platforms);
    this.physics.add.collider (enemy, platforms);
//player/enemy collision
    this.physics.add.collider (player, enemy, () => {
    player.x = player.x + Phaser.Math.FloatBetween (-200, 200);
    player.y = player.y - Phaser.Math.FloatBetween (200, 400);
    }, null, this);

    this.physics.add.collider(player, bombs, hitBomb, null, this);
    function hitBomb(player, _bomb) {

        lives = lives - 1;
            var lifeLine = ''
            for (var i = 0; i < lives; i++) {
            lifeLine = lifeLine + ' 🖤'
            }
       
        lifeText.setText('Lives:' + lifeLine)    
        if (lives === 0) {
            player.setTint(0xff0000);
            this.physics.pause();
            player.anims.play('turn');
            gameOver = true;
//reset button
            this.add.text(760, 450, 'You died(((', { fontSize: '60px', fill: '#000000' })
            .setOrigin(0, 0)
            .setScrollFactor(0)
            .setDepth(30)
            var resetButton = this.add.text(760, 520, 'Click to restart', { fontSize: '40px', fill: '#000000' })
            .setOrigin(0, 0)
            .setScrollFactor(0)
            .setDepth(30)
            .setInteractive()
            .setScrollFactor(0)
        
            resetButton.on('pointerdown', function() {
                refreshbody()
            } )
        }

    }

}

function update() {
//character`s ability to walk
    if (cursors.left.isDown) {
        player.setVelocityX(-config.playerSpeed);
        player.anims.play('left', true);
    }
    else if (cursors.right.isDown) {
        player.setVelocityX(config.playerSpeed);
        player.anims.play('right', true);
    }
    else {
        player.setVelocityX(0);
        player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-600);
    }


if (cursors.space.isDown) {
        
//shot create
        fire = this.physics.add.sprite (player.x, player.y, 'fire').setScale(1);
        fire
        .setVelocityX(player.body. velocity.x * 2)
        this.physics.add.collider (fire, platforms, () => {
        fire.disableBody (true, true);
        });
//shot/enemy collision
        this.physics.add.collider (enemy, fire, (enemy, fire) => {
        fire.disableBody (true, true);
        enemy.disableBody (true, true);
        }, null, this);
    if (Math.abs(player.x - enemy.x) < 600) {
        enemy.moveTo(player, player.x, player.y, 300, 1)
        }
//enemy rotation
        enemy.children.iterate((child) => {
        if (Math.random() < 1) {
        child.setVelocityX(Phaser.Math.FloatBetween (-500,500))
              }
        })}}

function refreshbody() {
    console.log ('game over')
    window.location.reload();
}