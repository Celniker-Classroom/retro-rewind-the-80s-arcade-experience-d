//TODO: function to randomly spawn supplies, make wave system better, display city health, score, wave #, # of missiles remaining
let wave = 1;
let score = 0;
let gameState = "TITLESCREEN"; // TITLESCREEN, PLAYING, GAMEOVER

let enemyMissiles = [];
let supplies = [];
let maxSupplies = 3;

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
    initializeSprites();



    // 5. Define the update loop inside main so it has access to variables
    q5.update = function () { // runs 60 times per second
        console.log("Missiles Remaining: ", missilesRemaining)
        console.log("Is Missile Visible? ", missile.visible)
        if (gameState == "TITLESCREEN") {
            drawTitleScreen();
            return;
        }

        if (gameState == "GAMEOVER") {
            drawGameOverScreen();
            return;
        }



        if(waveState == "COOLDOWN"){
            waveState = "STARTING";
            setTimeout(() => {
                startWave();
            }, 5000);
        }

        
        image(backgroundImg, 0, 0, width, height);
        updateMissileTruck();
        updateEnemyMissiles();

        if(isMissileFired && missilesRemaining>0){
            fireMissile();
        }else{
            updateMissilePositionAndRotation();
        }
        
        if (kb.presses('space')) {
            isMissileFired = true;
        }

        if(cityHealth<=0){
            gameState = "GAMEOVER";
        }

        if(supplies.length>maxSupplies){
            supplies[0].delete();
            supplies.shift(); //removes first element from array
        }
    };
}

function initializeSprites(){
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
    missile.img = loadImage('assets/long-range-missile.png');



    missile.overlaps(missileTruck); //This tells the physics engine to not create physical forces between the missile and missle truck that would push the two sprites apart.
}

function drawTitleScreen(){
    background(0);

    textAlign(CENTER, CENTER);

    fill(255);
    textSize(width * 0.06);
    text("Final Interceptor", 0, height * -0.15);

    textSize(width * 0.025);
    text("Press ENTER to Start", 0, height * 0.05);

    textSize(width * 0.018);
    text("Arrow Keys = Move Truck", 0, height * 0.18);
    text("A / D = Aim Missile", 0, height * 0.24);
    text("SPACE = Fire Missile", 0, height * 0.30);

    if (kb.presses('enter')) {
        gameState = "PLAYING";
    }
}


function drawGameOverScreen(){
    allSprites.delete(); //ensures no sprites are left in the game over screen
    background(0);

    textAlign(CENTER, CENTER);

    fill(255, 0, 0);
    textSize(width * 0.07);
    text("GAME OVER", 0, height * -0.1);

    fill(255);
    textSize(width * 0.03);
    text("Final Wave: " + (wave - 1), 0, height * 0.05);
    text("Score: " + score, 0, height * 0.12);

    textSize(width * 0.02);
    text("Press ENTER to Restart", 0, height * 0.25);

    if (kb.presses('enter')) {
        restartGame();
    }
}

function restartGame() {
    wave = 1;
    score = 0;
    cityHealth = 100;

    enemyMissiles = [];
    supplies = [];

    missilesRemaining = 5;

    waveState = "COOLDOWN";


    initializeSprites();
    isMissileFired = false;

    missile.x = missileTruck.x;
    missile.y = missileTruck.y - (35 * truckSize);

    missile.vel.x = 0;
    missile.vel.y = 0;

    missile.rotation = 0;
    gameState = "PLAYING";
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

    //hides missile if you run out of them
    if(missilesRemaining<=0){
        missile.visible = false;
    }else{
        missile.visible = true;
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
        missilesRemaining -=1;
        missile.y = missileTruck.y-(35*truckSize); 
        missile.vel.y = 0;
        missile.rotation = 0;
    }
}

function spawnEnemyMissile(){
    let enemyMissile = new Sprite();
    enemyMissile.x = random(-width/2, width/2); // Set initial X
    enemyMissile.y = random(-height/2, -height/4); 
    let targetX;
    targetX = random(cityLeftBound, cityRightBound);
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

function spawnAmmo(){
    let ammo = new Sprite();
    ammo.x = random(0, width/2); // Set initial X
    ammo.y = groundYLevel; 
    // enemyMissile.scale = missileSize;
    ammo.diameter = 0;
    ammo.img = loadImage('assets/ammo.png');
    // enemyMissile.rotationLock = true; // Prevents rotation on collision with other enemy missiles
    supplies.push(ammo);
}

function spawnHealth(){
    let health = new Sprite();
    health.x = random(0, width/2); // Set initial X
    health.y = groundYLevel; 
    // enemyMissile.scale = missileSize;
    health.diameter = 0;
    health.img = loadImage('assets/health.png');
    // enemyMissile.rotationLock = true; // Prevents rotation on collision with other enemy missiles
    supplies.push(health);
}

function updateEnemyMissiles(){
    for(let i = enemyMissiles.length - 1; i >= 0; i--){
        let enemyMissile = enemyMissiles[i];
        // missile hit ground
        if(enemyMissile.y > (height/2)*0.7){ // (height/2)*0.7 is little above ground y level
            explodeMissile(enemyMissile);
            enemyMissiles.splice(i, 1);
            if(enemyMissile.x>cityLeftBound && enemyMissile.x<cityRightBound){
                cityHealth-=10;
                console.log("City Health:"+ cityHealth);
            }

        }

        //missile collided with player missile: +10 score
        if (missile.colliding(enemyMissile)){
            explodeMissile(enemyMissile);
            enemyMissiles.splice(i, 1);
            isMissileFired=false;
            missilesRemaining -=1;
            missile.y = missileTruck.y-(35*truckSize); 
            missile.vel.y = 0;
            missile.rotation = 0;  
            score+=10;
        }
    }
    if (waveState == "ACTIVE" && enemyMissiles.length==0){
        waveState = "COOLDOWN";
    }

}

function explodeMissile(enemyMissile){
    let explosion = new Sprite();
    explosion.x = enemyMissile.x;
    explosion.y = enemyMissile.y; 
    explosion.img = loadImage('assets/explosion.png');
    enemyMissile.delete();
    setTimeout(() => {
        explosion.delete();
    }, 200);
        
}

function startWave(){
    let missileCount = 3 + (2*wave);
    let delay = Math.max(1025-(25*wave), 500); //in milliseconds and spawns faster each wave
    for(let i = 0; i<missileCount; i++){
        setTimeout(() => {
            spawnEnemyMissile();
        }, i * delay);

        setTimeout(() => {
            if(random(1,4)<3){
                spawnAmmo();
            }else{
                spawnHealth();
            }
        }, i * delay * 2);
    }
    waveState = "ACTIVE";
    wave++;
}


// Execute the game
main();