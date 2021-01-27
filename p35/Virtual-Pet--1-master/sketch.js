var database;

var dog, sadDog, happyDog;
var foodS, foodStock;
var fedTime, lastFed;
var feed, addFood;
var foodObj;
var milkImg, milk;
var name;

function preload()
{
  sadDog = loadImage("Dog.png");
  happyDog = loadImage("happy dog.png");
  milkImg = loadImage("milk.png");
}

function setup() 
{
  createCanvas(1000,400);

  database = firebase.database();
 
  foodObj = new Food();

  foodStock = database.ref('Food');
  foodStock.on("value", readStock);
  
  dog = createSprite(800, 200, 150, 150);
  dog.addImage(sadDog);
  dog.scale = 0.15;

  name =  createInput("Enter Name", 800, 250);
    
  feed = createButton("Feed the dog");
  feed.position(700, 95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(800, 95);
  addFood.mousePressed(addFoods);
}

function draw() 
{
  background(46,139,87);

  foodObj.display();

  fedTime = database.ref('FeedTime');

  fedTime.on("value",function(data){
    lastFed = data.val();
  });
 
  fill(255,255,254);
  textSize(15);

  if(lastFed >=  12)
  {
    text("Last Feed : "+ lastFed % 12 + " PM", 350, 30);
  }
  else if(lastFed == 0)
  {
     text("Last Feed : 12 AM", 350, 30);
  }
  else
  {
     text("Last Feed : " + lastFed + " AM", 350, 30);
  }
 
  drawSprites();
}

function readStock(data)
{
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

function feedDog()
{
  dog.addImage(happyDog);

  milk = createSprite( 720, 220, 10, 10);
  milk.addImage(milkImg);
  milk.scale = 0.1;

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);

  database.ref('/').update({
    
    Food: foodObj.getFoodStock(),

    FeedTime: hour()
  })
}

function addFoods()
{
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}