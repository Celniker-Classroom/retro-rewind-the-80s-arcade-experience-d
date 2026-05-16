let missileTruck;
let missile;
let backgroundImg;
let missileTruckOrientation = "RIGHT";
let groundYLevel;
let leftTruckBound;
let rightTruckBound;
let truckSize;
let missileSize;

async function main() {
    // 1. Initialize Canvas first
    await Canvas('1:1');
    
    
    // 2. Load your image safely using await
    backgroundImg = await loadImage('assets/Background.png');
    groundYLevel = (height/2)*0.78; // 0.78 makes the missile truck at ground level -1=top of screen, 1=bottom of screen
    leftTruckBound = (width/2)*-0.5; //-1=left of screen, 1=right of screen
    rightTruckBound = (width/2)*0.9;
    truckSize = (width/2)*0.001;
    missileSize = (width/2)*0.001;
    

    // 3. Configure the physics world
    

    // 4. Create sprites
    missileTruck = new Sprite();
    missileTruck.x = 100; // Set initial X
    missileTruck.y = groundYLevel; 
    missileTruck.diameter = 50;


    
    missileTruck.img = loadImage('assets/missile-truck.png');

    missile = new Sprite();
    missile.x = 100; // Set initial X
    missile.y = missileTruck.y-(35*truckSize); // 0.86 makes the missile truck at ground level
    missile.scale = missileSize;
    missile.diameter = 50;
    missile.img = await loadImage('assets/long-range-missile.png');



    missile.overlaps(missileTruck); //This tells the physics engine to not create physical forces between the missile and missle truck that would push the two sprites apart.

    
    



    // 5. Define the update loop inside main so it has access to variables
    q5.update = function () { // runs 60 times per second
        
        image(backgroundImg, 0, 0, width, height);
        updateMissileTruck();
        updateMissilePosition();
        console.log("X width: ", width);
        console.log("Y height: ", height);
    };
}

function updateMissileTruck(){
    if(kb.pressing('left')){
        console.log("LEFT");
        missileTruckOrientation = "LEFT";
        missileTruck.vel.x -= (0.00025*width); // Accelerate left
        
    }
    if(kb.pressing('right')){
        console.log("RIGHT");
        missileTruckOrientation = "RIGHT";
        missileTruck.vel.x += (0.00025*width); // Accelerate right
    
    }
    if (missileTruckOrientation == "LEFT"){
        missileTruck.scale.x = -truckSize; // Flips the sprite asset left
    }else{
        missileTruck.scale.x = truckSize; // Flips the sprite asset right
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
    missileTruck.scale.y = truckSize;
}

function updateMissilePosition(){
    if(missileTruckOrientation == "RIGHT"){
        missile.x = missileTruck.x-(100*truckSize);
    }else{
        missile.x = missileTruck.x+(80*truckSize);
    }

}

// Execute the game
main();