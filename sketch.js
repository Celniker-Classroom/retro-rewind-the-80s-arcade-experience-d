let ball;
let backgroundImg;

async function main() {
    // 1. Initialize Canvas first
    await Canvas();
    
    // 2. Load your image safely using await
    backgroundImg = await loadImage('assets/Background.png');

    // 3. Configure the physics world
    world.gravity.y = 10;

    // 4. Create your sprites
    ball = new Sprite();
    ball.diameter = 50;
    ball.img = '🤪🤪🤪🤪';

    let groundA = new Sprite();
    groundA.x = -120;
    groundA.width = 220;
    groundA.rotation = 30;
    groundA.physics = STATIC;

    let groundB = new Sprite();
    groundB.x = 120;
    groundB.width = 220;
    groundB.rotation = -30;
    groundB.physics = STATIC;

    // 5. Define the update loop inside main so it has access to variables
    q5.update = function () {
        background(backgroundImg);
        text('click to jump!', 0, -50);

        if (mouse.presses()) ball.vel.y = -5;
    };
}

// Execute the game
main();