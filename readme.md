# Project 1 - Space Invaders #

## Overview ##
This was the first project as part of the General Assembly Software Engineering Immersive Course. I chose to create an adaptation of the classic arcade game 'Space Invaders'.

## Brief ##
The brief was to create a grid-based game chosen from a list of options over a week.
### Technical Requirements ###
* **Render a game in the browser**
* **Design logic for winning** & **visually display which player won**
* **Include separate HTML / CSS / JavaScript files**
* Stick with **KISS (Keep It Simple Stupid)** and **DRY (Don't Repeat Yourself)** principles
* Use **Javascript** for **DOM manipulation**
* **Deploy your game online**, where the rest of the world can access it
* Use **semantic markup** for HTML and CSS (adhere to best practices)
### Required Deliverables ###
* A **working game, built by you**, hosted somewhere on the internet
* A **link to your hosted working game** in the URL section of your Github repo
* A **git repository hosted on Github**, with a link to your hosted game, and frequent commits dating back to the very beginning of the project
* **A ``readme.md`` file** with explanations of the technologies used, the approach taken, installation instructions, unsolved problems, etc.
* HTML Canvas is *not* to be used.

## Built With ##
* HTML
* CSS
* JavaScript
* Git
* GitHub

## Key Features ##
### Main Requirements ###
* The player should be able to clear at least one wave of aliens
* The player's score should be displayed at the end of the game
### Additional Features I Added ###
* Levels with increasing level of difficulty
* Sound effects and background music which can be muted
* Shields

## Deployed Version ##
[Play the deployed version of the game](https://alextheoklitou.github.io/sei-project-one/)

![Screen Grab of finished version](/assets/spaceInvaders.gif)

## Planning ##
The first thing I did was create the wireframe using Excalidraw:
![Excalidraw screenshot](/assets/project1excalidraw.png)
### Project Stages ###
I started out by separating the project into stages with deadlines:
* Stage 1 - Basic Elements Created
  * Duration: 1 day
  * Tasks:
    * Finishing the project plan
    * Adding elements to the page
* Stage 2 - MVP
  * Duration: 2 days
  * Tasks:
    * Create functions for player and alien movement
    * Create functions for player and alien shooting
    * Create functions for interaction of shooting lego pieces with aliens and player
* Stage 3 - CSS
  * Duration: 1 day
  * Tasks:
    * Work on CSS adding Lego sprites
* Stage 4 - Bugs and Sound
  * Duration: 1 day
  * Tasks:
    * Fix any pending bugs
    * Add sound effects and background music
* Stage 5 - Stretch Goals
  * Duration: 1 day
  * Tasks:
    * Add starting page with instructions
    * Introduce levels
    * Play again button to reset game once player loses
    * Add shields

## Stage 1 ##
### Creating the Grid
The first thing I worked on was creating the grid for the game to run on. I opted for 19 x 19 grid and I used DOM manipulation to push the cells into an empty ```div```. The below function was used:
```js
function createGrid() {
  for (let i = 0; i < gridCellCount; i++) {
    const cell = document.createElement('div')
    cell.setAttribute('data-index', i)
    cells.push(cell)
    grid.appendChild(cell)
  }
}
```
### Adding the Aliens ###
Next up was adding the aliens to the grid. To immitage the 'block-like' look of Lego, I decided to just add colour to cells to create the original Space Invader alien shape. As all my cells were numbered, I had to work out what number cells needed to have the class of 'alien'. Below is my Excalidraw of working this out:

![Excalidraw screenshot](/assets/grid.png)

Using an array with the numbers of these cells, I was able to use a ```forEach``` function to create the aliens as shown below:
```js
function addAliens() {
  aliens.forEach(alien => {
    cells[alien].classList.add('alien')
  })
}
```

### Adding the Player ###
In a similar way of adding the aliens, I added the class of 'player' to the player starting position using this function:
```js
function addPlayer(position) {
  cells[position].classList.add('player')
}
```

## Stage 2 ##
### Player and Alien Movement ###
The player and the aliens move in a similar way with one main difference, the player is controlled by the keyboard whereas the aliens are controlled by a set timer.

For all movable objects there were three functions needed:
* Add player/alien
* Remove player/alien
* Move player/alien

The 'Add' and 'Remove' functions were both controlled by the 'Move' function. The object would first be removed, it's position changed in the appropriate array and then added again in the new position.

I tackled the player movement first using a 'keyup' event listener which triggered the below function:
```js
function handleKeyUp(e) {
  const x = playerPosition % width
  removePlayer()
  switch(e.code) {
    case 'ArrowRight':
      if (x < width - 1) {
        playerPosition++
      }
      break
    case 'ArrowLeft':
      if (x > 0) {
        playerPosition--
      }
      break
    default:
      console.log('Invalid Key, do nothing')
  }
  if (gameOn) {
    addPlayer(playerPosition)
  } else {
    console.log('game hasn\'t started yet')
  }
}
```

For the alien movement, the biggest challenge was creating a function that was able to not only switch from left to right when the aliens reached the border, but also move a row down every time the aliens switched direction.

I was able to achieve this by using a 'movement tracker' variable, which would track how many times the aliens moved. Once the tracker reached 8, a boolean called 'aliensMovingRight' was flipped, the tracker was reset to 0 and the width of the grid was added to all alien cell numbers in the array and this can be seen in the function below:
```js
function moveAliens () {
  aliensMoving = window.setInterval(() => {
    removeAliens()
    if (alienMoveTracker < 8) {
      if (aliensMovingRight) {
        aliens = aliens.map(alien => alien + 1)
      } else {
        aliens = aliens.map(alien => alien - 1)
      }
      alienMoveTracker++
    } else if (alienMoveTracker === 8) {
      alienMoveTracker = 0
      aliens = aliens.map(alien => alien + width)
      aliensMovingRight = !aliensMovingRight
    }
    addAliens()
  }, aliensMovingInterval)
}
```