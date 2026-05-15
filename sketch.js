let missileTruck;
let backgroundImg;
let missileTruckOrientation = "RIGHT";

async function main() {
    // 1. Initialize Canvas first
    await Canvas();
    
    // 2. Load your image safely using await
    backgroundImg = await loadImage('assets/Background.png');

    // 3. Configure the physics world
    world.gravity.y = 0;

    // 4. Create your sprites
    missileTruck = new Sprite();
    missileTruck.x = 100; // Set initial X
    missileTruck.y = ((backgroundImg.height*0.8)/2); // Set initial Y 330 is the Ground level
    missileTruck.diameter = 50;
    missileTruck.img = await loadImage('assets/missile-truck.png');
    
    



    // 5. Define the update loop inside main so it has access to variables
    q5.update = function () { // runs 60 times per second
        background(backgroundImg);
        updateMissileTruck();
        console.log("Y height: ", backgroundImg.height*0.8);
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
    if (missileTruck.x<-300){ 
        missileTruck.x = -300;
    }
    if (missileTruck.x>600){
        missileTruck.x = 600;
    }
}

// Execute the game
main();