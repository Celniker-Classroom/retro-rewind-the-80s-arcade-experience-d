let wave = 1;
let score = 0;

let enemyMissiles = [];
let explosions = [];
let supplies = [];

let missilesRemaining = 5;
let cityHealth = 100;

let waveCooldown = 0;
let waveState = "COOLDOWN"; // COOLDOWN, STARTING, ACTIVE.


let missileTruck;
let missile;
let backgroundImg;
let missileTruckOrientation = "RIGHT";
let groundYLevel;
let leftTruckBound;
let rightTruckBound;
let truckSize;
let missileSize;
let isMissileFired = false;
let cityLeftBound;
let cityRightBound;

async function main() {
    // 1. Initialize Canvas first
    await Canvas('1:1');
    
    
    // 2. Load your image safely using await
    backgroundImg = await loadImage('assets/Background.png');
    groundYLevel = (height/2)*0.78; // 0.78 makes the missile truck at ground level -1=top of screen, 1=bottom of screen


    leftTruckBound = (width/2)*0; //-1=left of screen, 1=right of screen
    rightTruckBound = (width/2)*0.9;
    cityLeftBound = (width/2)*-0.9;
    cityRightBound = (width/2)*-0.6;



    truckSize = (width/2)*0.001;
    missileSize = (width/2)*0.001;
    

    // 3. Configure the physics world
    

    // 4. Create sprites
    missileTruck = new Sprite();
    missileTruck.x = 100; // Set initial X
    missileTruck.y = groundYLevel; 
    missileTruck.diameter = 300;


    
    missileTruck.img = loadImage('assets/missile-truck.png');

    missile = new Sprite();
    missile.x = 100; // Set initial X
    missile.y = missileTruck.y-(35*truckSize); 
    missile.scale = missileSize;
    missile.diameter = 50;
    missile.img = await loadImage('assets/long-range-missile.png');



    missile.overlaps(missileTruck); //This tells the physics engine to not create physical forces between the missile and missle truck that would push the two sprites apart.
    
    


    




    // 5. Define the update loop inside main so it has access to variables
    q5.update = function () { // runs 60 times per second


        if(waveState == "COOLDOWN"){
            waveState = "STARTING";
            setTimeout(() => {
                startWave();
            }, 5000);
        }

        
        image(backgroundImg, 0, 0, width, height);
        updateMissileTruck();
        updateEnemyMissiles();

        if(isMissileFired){
            fireMissile();
        }else{
            updateMissilePositionAndRotation();
        }
        
        if (kb.presses('space')) {
            isMissileFired = true;
        }

        if(cityHealth<=0){
            gameOver(); //TODO
        }
    };
}






function updateMissileTruck(){
    if(kb.pressing('arrowLeft')){
        missileTruckOrientation = "LEFT";
        missileTruck.vel.x -= (0.00025*width); // Accelerate left        
    }
    if(kb.pressing('arrowRight')){
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




function updateMissilePositionAndRotation(){
    if(missileTruckOrientation == "RIGHT"){
        missile.x = missileTruck.x-(50*truckSize);
    }else{
        missile.x = missileTruck.x+(40*truckSize);
    }

    //update missile rotation
    missile.rotationSpeed = 0.0;
    if(kb.pressing('a')){
        // Set the center of mass to the bottom edge-center of the sprite so the rotation looks more natural
        missile.centerOfMass = { x: 0, y: missile.halfHeight };

        //check upper and lower bounds for missile rotation
        if ((missileTruckOrientation=="LEFT" && missile.rotation<-60)||(missileTruckOrientation=="RIGHT" && missile.rotation<0)){
            missile.rotationSpeed = 0.0;
            
        }
        else{
            missile.rotationSpeed = -0.5;
        }


        
    }else if (kb.pressing('d')){
        // Set the center of mass to the bottom edge-center of the sprite so the rotation looks more natural
        missile.centerOfMass = { x: 0, y: missile.halfHeight };

        //check upper and lower bounds for missile rotation
        if ((missileTruckOrientation=="RIGHT" && missile.rotation>60)||(missileTruckOrientation=="LEFT" && missile.rotation>0)){
            missile.rotationSpeed = 0.0;
            
        }
        else{
            missile.rotationSpeed = 0.5;
        }
    }

    if (kb.pressing('arrowLeft')){
        missile.rotation = -Math.abs(missile.rotation); //changes missile's rotation to match missile truck's orientation
    }
    if (kb.pressing('arrowRight')){
        missile.rotation = Math.abs(missile.rotation); //changes missile's rotation to match missile truck's orientation
    }


}

function fireMissile(){
    //set rotation speed to 0 so that the missile does not rotate once its launched
    missile.rotationSpeed = 0.0;    
    missile.vel.y = 15;
    missile.direction = missile.rotation-90;
    //checks if the missile is at the top of the screen and if it is, it puts the missile back on the truck
    if(missile.y<(height/2)*-1){
        isMissileFired = false;
        missile.y = missileTruck.y-(35*truckSize); 
        missile.vel.y = 0;
        missile.rotation = 0;
    }
}

function spawnEnemyMissile(){
    let enemyMissile = new Sprite();
    enemyMissile.x = random(-width/2, width/2); // Set initial X
    enemyMissile.y = random(-height/2, -height/4); 

    let missileTargetingTruckProbability = 25; //out of 100
    let targetX;
    if(random(1, 100)>missileTargetingTruckProbability){
        targetX = random(cityLeftBound, cityRightBound);
    }else{
        targetX = missileTruck.x;
    }
    
    let targetY = groundYLevel;
    enemyMissile.scale = missileSize;
    enemyMissile.diameter = 50;
    enemyMissile.img = loadImage('assets/long-range-missile.png');
    enemyMissile.rotation = enemyMissile.angleTo(targetX, targetY)+90;
    enemyMissile.direction = enemyMissile.angleTo(targetX, targetY);
    enemyMissile.speed= random(2, 3);
    enemyMissile.rotationLock = true; // Prevents rotation on collision with other enemy missiles
    enemyMissiles.push(enemyMissile);

}

function updateEnemyMissiles(){
    for(let i = enemyMissiles.length - 1; i >= 0; i--){
        let enemyMissile = enemyMissiles[i];
        // missile hit ground
        if(enemyMissile.colliding(missileTruck)){
            explodeMissile(enemyMissile);
            stunTruck(); //TODO
        }
        if(enemyMissile.y > (height/2)*0.7){ // (height/2)*0.7 is little above ground y level
            explodeMissile(enemyMissile);
            enemyMissiles.splice(i, 1);
            if(enemyMissile.x>cityLeftBound && enemyMissile.x<cityRightBound){
                cityHealth-=10;
                console.log("City Health:"+ cityHealth);
            }

        }
        if (missile.colliding(enemyMissile)){
            explodeMissile(enemyMissile);
            enemyMissiles.splice(i, 1);  
        }
    }
    if (waveState == "ACTIVE" && enemyMissiles.length==0){
        waveState = "COOLDOWN";
    }

}
function explodeMissile(missile){
        missile.delete();
        
}

function startWave(){
    let missileCount = 3 + (2*wave);
    let delay = Math.max(1025-(25*wave), 500); //in milliseconds and spawns faster each wave
    for(let i = 0; i<missileCount; i++){
        setTimeout(() => {
            spawnEnemyMissile();
        }, i * delay);
    }
    waveState = "ACTIVE";
    wave++;
}

function stunTruck(){
    console.log("Your truck is stunned!");
}

function gameOver(){
    console.log("Game over!");
}
// Execute the game
main();