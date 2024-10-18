const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
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

const game = new Phaser.Game(config);

let player;
let cursors;
let spiders;
let bullets;
let spacebar;

function preload() {
    this.load.image('sky', 'assets/sky.png');  
    this.load.image('player_standing', 'assets/player_standing.png');  
    this.load.image('player_running', 'assets/player_running.png');
    this.load.image('spider', 'assets/spider.png');  
    this.load.image('bullet', 'assets/bullet.png');  
}

function create() {
    this.add.image(400, 300, 'sky');

    player = this.physics.add.sprite(100, 450, 'player_standing');
    player.setScale(0.5);  
    player.setCollideWorldBounds(true);

    cursors = this.input.keyboard.createCursorKeys();
    spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);  

    
    bullets = this.physics.add.group({
        defaultKey: 'bullet',
    });

    
    spiders = this.physics.add.group({
        key: 'spider',
        repeat: 5,
        setXY: { x: Phaser.Math.Between(50, 750), y: 0, stepX: 100 }
    });

    spiders.children.iterate(function (spider) {
        spider.setScale(0.5);
        spider.setBounce(0.3);
        spider.setVelocityY(Phaser.Math.Between(100, 200));
    });

    
    this.physics.add.overlap(bullets, spiders, destroySpider, null, this);
}

function update() {
    if (cursors.left.isDown) {
        player.setVelocityX(-160);
        player.setTexture('player_running');
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);
        player.setTexture('player_running');
    } else {
        player.setVelocityX(0);
        player.setTexture('player_standing');
    }

    
    if (Phaser.Input.Keyboard.JustDown(spacebar)) {
        shootBullet();
    }

    
    spiders.children.iterate(function (spider) {
        if (spider.y > 600) {
            spider.y = 0;
            spider.setVelocityY(Phaser.Math.Between(100, 200));
            spider.x = Phaser.Math.Between(50, 750);
        }
    });

    
    bullets.children.iterate(function (bullet) {
        if (bullet.y < 0) {
            bullet.destroy();
        }
    });
}

function shootBullet() {
    let bullet = bullets.get(player.x, player.y);
    if (bullet) {
        bullet.setActive(true);
        bullet.setVisible(true);
        bullet.body.velocity.y = -300;  
    }
}

function destroySpider(bullet, spider) {
    bullet.destroy();  
    spider.destroy();  
}
