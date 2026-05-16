let missileTruck;
let missile;
let backgroundImg;
let missileTruckOrientation = "RIGHT";
let groundYLevel = (window.screen.height/2)*0.7; // 0.7 makes the missile truck at ground level -1=top of screen, 1=bottom of screen
let leftTruckBound = (window.screen.width/2)*-0.5; //-1=left of screen, 1=right of screen
let rightTruckBound = (window.screen.width/2)*0.9;

async function main() {
    // 1. Initialize Canvas first
    await Canvas();
    
    // 2. Load your image safely using await
    backgroundImg = await loadImage('assets/Background.png');

    // 3. Configure the physics world
    world.gravity.y = 0;

    // 4. Create sprites
    missileTruck = new Sprite();
    missileTruck.x = 100; // Set initial X
    missileTruck.y = groundYLevel; 
    missileTruck.diameter = 50;
    missileTruck.img = loadImage('assets/missile-truck.png');

    missile = new Sprite();
    missile.x = 100; // Set initial X
    missile.y = missileTruck.y-35; // 0.86 makes the missile truck at ground level
    missile.diameter = 50;
    missile.img = await loadImage('assets/long-range-missile.png');
    
    



    // 5. Define the update loop inside main so it has access to variables
    q5.update = function () { // runs 60 times per second
        
        background(backgroundImg);
        updateMissileTruck();
        updateMissilePosition();
        console.log("X height: ", window.screen.width);
        console.log("Y height: ", window.screen.height);
    };
}

function updateMissileTruck(){
    if(kb.pressing('left')){
        console.log("LEFT");
        missileTruckOrientation = "LEFT";
        missileTruck.vel.x -= 0.5; // Accelerate left
        
    }
    if(kb.pressing('right')){
        console.log("RIGHT");
        missileTruckOrientation = "RIGHT";
        missileTruck.vel.x += 0.5; // Accelerate right
    
    }
    if (missileTruckOrientation == "LEFT"){
        missileTruck.scale.x = -1; // Flips the sprite asset left
    }else{
        missileTruck.scale.x = 1; // Flips the sprite asset right
    }
    // Add friction to stop
    missileTruck.vel.x *= 0.9;

    //prevents the truck from going out of bounds
    if (missileTruck.x<leftTruckBound){ 
        missileTruck.x = leftTruckBound;
    }
    if (missileTruck.x>rightTruckBound){
        missileTruck.x = rightTruckBound;
    }
}

function updateMissilePosition(){
    if(missileTruckOrientation == "RIGHT"){
        missile.x = missileTruck.x-100;
    }else{
        missile.x = missileTruck.x+80;
    }

}

// Execute the game
main();