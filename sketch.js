
let holes = []; // array of holes objects

let player; // The player object

let pos = []; // Keep track of the locations and magnitude of the different holes

let play = false; // Turns on the game

let timer = 0; // Clock the keep track of time based on delta

let delay = 10; // amount of seconds till next bost

let backRGB_orig = [50, 89, 100]; // background Color 

let backRGB_win = [74, 167, 97]; // Winning back ground 

let backRGB_cur = backRGB_orig; // Current back ground

let winDist = 5000; // Distance past the area of the holes needed to pass to win the game

let win = false; // Has the player won the game

let button; // the button object to finish

let pURL = 'simon_start.html'; // the url of the next puzzel, or puzzel URL

let debris; // A group for the the debri

let timeBar; // Size of the bar


function preload(){
  Star = loadFont('font/TNG_Title.ttf'); //Load in the font
}


function setup() { // Create the objects and canvas, also set up some starting values for the player
  createCanvas(1440, 800);
  textFont(Star);
  textSize(40);
  // Create hole objects
  for (let i = 0; i < 3090; i++) {
    holes.push(new Hole(random(-800, 14200), random(-800, 7460)));
  }

  debris = new Group();

  let temp;
  let imgD = loadImage('img/Debris.png')

  for (let x = 0; x < 100; x++){
    temp = createSprite(random(0, 14200), random(0, 7460)); // Create a new Debris
    temp.setCollider('circle', 0, 0, 50); // Set hitbox
    temp.setSpeed(random(2, 3), random(0, 360));
    temp.addImage(imgD);
    temp.mass = 1.5; // Mass effects the collisions
    temp.restitution = 0.5;
    debris.add(temp); // add to the list of sprites
  }
  let imgP = loadImage('img/Pod.png');
  player = createSprite(-300, 383); // Create player sprite
  player.addImage(imgP);
  player.scale = 0.1; // Set size
  player.rotationSpeed = random(0, 360); // Set the rotation of the sprite
  player.setCollider('circle', 0, 0, 40); // Hitbox
  player.mass = 1;

}





function draw() {

  // Allows the debris and player to colide and the debris with other debris
  player.bounce(debris); // Due to the shape of both the circle and the debris, and the high speeds, the colliion some times don't work perfectly
  debris.bounce(debris); // A posible solution to this would be to use a Circle cast to see if it colides with any thing, and where that colision is, but that is a bit overkill for this



  player.limitSpeed(10000000); // Reduction of the player speed
  clear();


  if ((player.position.x-14200)>winDist){ // Checks if the player has won
    backRGB_cur = backRGB_win;
    win = true;
    play = false;
  }

  else if (player.position.x > 14100){    // turns background greener the closer to the goal they are
    for (let rgb = 0; rgb < 3; rgb++){
      backRGB_cur[rgb] = ((player.position.x-14200)/(winDist)*(backRGB_orig[rgb]-backRGB_win[rgb]))*-1+backRGB_orig[rgb];
    }
    
  }

  else if (player.position.x < 14100) { // Resets the color
    backRGB_cur = [50, 89, 100];
  }


  background(backRGB_cur); // set background color

  // these three if staments make the player bounce off of the sides so that the player can not leave the playing area

  if(player.position.x< -800) { // Left side
    player.position.x = -799;
    player.velocity.x = abs(player.velocity.x);
  }


  if(player.position.y< -800) { // Top side
    player.position.y = -799;
    player.velocity.y = abs(player.velocity.y);
  }

  if(player.position.y>7460) {  // Bottom side
    player.position.y = 7460-1;
    player.velocity.y = -abs(player.velocity.y);
  }

  for (let i = 0; i < debris.length; i++){ // Side colisions for debris

    let sprite = debris[i]; // the selected sprite

    if(sprite.position.x < -800) { // left side
      sprite.position.x = -799;
      sprite.velocity.x = abs(sprite.velocity.x);
    }
  
    if(sprite.position.x > 14100) { // right side
      sprite.position.x = 14100-1;
      sprite.velocity.x = -abs(sprite.velocity.x);
    }
  
    if(sprite.position.y < -800) { // top side
      sprite.position.y = -799;
      sprite.velocity.y = abs(sprite.velocity.y);
    }
  
    if(sprite.position.y >7460) { // bottom side
      sprite.position.y = 7460-1;
      sprite.velocity.y = -abs(sprite.velocity.y);
    }
  }

  for (let i = 0; i < holes.length; i++) { // Updates all the holes
    holes[i].display(i);
  }

  player.rotationSpeed = 1; // Spins the player sprite a bit

  camera.position.x = player.position.x; // Move the camera
  camera.position.y = player.position.y;


  drawSprites(); // Draws all sprites on the screen

  if (!play && !win) { // The starting launch line
    line(camera.mouseX, camera.mouseY, player.position.x, player.position.y);
  }


  if (!play && mouseDown(LEFT) && !win){ // Launches the player at the start of the game when the click the left mouse button
    launch();
  }

  if (play && !win) {  // The main body of the code that only runs after the player has launched them selfes

    timeBar = 50-50*timer/delay; // Gets the size of the bar as a percent of 50

    fill(224, 255, 255); // Collor for the outside bar
    rect(camera.position.x-28, camera.position.y+47, 56, 16, 20); // Outside bar

    fill(80, 125, 42); // Color for inside bar
    if (timeBar > 0){ // Only displays the bar if it is big than 0
      rect(camera.position.x-25, camera.position.y+50, timeBar, 10, 20); // ised bar
    }


    timer += deltaTime/1000; // Increase the time on the timer
    
    if (timer > delay){ // Checks if the player is able to launche again
      line(camera.mouseX, camera.mouseY, player.position.x, player.position.y);
      if (mouseDown(LEFT)){
        launch();
        timer = 0; // resets timer
      }
    }
    for (let x = 0; x < pos.length; x++){ // attrats the player to all the holes
      player.attractionPoint(pos[x][2]*0.1/dist(pos[x][0], pos[x][1], player.position.x, player.position.y), pos[x][0], pos[x][1]);
    }
  }


  if (win){
    Win(); // You win
  }
}

// Hole class
class Hole {
  constructor(sx, sy) { // Set up
    this.x = sx; // Location
    this.y = sy;
    this.mag = 0; // Magnitude of attraction
    this.diameter = random(10, 30); // Size of the black hole
    pos.push([this.x, this.y, this.mag]); // adds values to an array to make acces to these values easy for the player 
  }



  display(id) { // Updates the circle
    fill(0);
    ellipse(this.x, this.y, this.diameter, this.diameter); // Draws the circle
    this.mag = 110000/(sqrt(pow((this.x-player.position.x), 2) + pow((this.y-player.position.x), 2))); // Sets the magnitude of atraction of the player to it
    // this.mag = (100 / abs(this.x - player.position.x) + 100 / abs(this.x - player.position.x)) / 2;

    //Fg = GMm/r^2

    pos[id][2] = this.mag; // updates the mag value in pos
  }
}


function launch(){ // sets the velocity of the player toward the mouse
  play = true;
  player.velocity.x += ((camera.mouseX)-player.position.x)/10;
  player.velocity.y += ((camera.mouseY)-player.position.y)/10;
}


function Win(){ // You win
  player.velocity = [0, 0]; // Stop player movement
  fill('rgba(74,167,97, 0.2)'); // Sets color of the overlay
  rect(camera.position.x-width/2-500, camera.position.y-height/2-500, width*2, height*2); // Create overlay
  fill(255); // Color of text
  textAlign(CENTER, CENTER);
  text('YOU WIN', camera.position.x, camera.position.y+35); // Create text below the player
  button = createA(pURL, "NEXT"); // Next puzzel button
  button.position(width/2, 80); // Next button location, top of the screen
}