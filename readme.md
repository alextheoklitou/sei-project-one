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
    * Create functions for collisions
    * Winning or Losing
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
      if (x < width - 1) {`
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
### Player and Aliens Shooting and Collisions
The player shooting and the aliens dropping bombs were both quite similar functions, the former triggered by the space key being pressed and the latter on a set interval. The lego piece would then move either upward or downward, depending on whether its an alien bomb or a player shotting, on a nested set interval which would remove the piece from its current cell, change the cell position and add the piece to the new cell, similar to how the player and aliens move.

One of the most challenging aspects of creating this game were the collisions. Once a lego piece is released, there are three options that could happen:
1. The player or an alien is hit and needs to either take damage or be removed
2. One of the shields is hit and needs to be removed
3. The lego piece makes it all the way to the edge of the grid without hitting anything

Nested within each shooting function, I added a series of if statements which where checked every 100 miliseconds as shown below:
```js
function alienShoot () {
  const bombs = aliens[Math.floor(Math.random() * aliens.length)]
  let bombPosition = bombs + 19
  const bombMovement = window.setInterval(() => {
    const y = Math.floor(bombPosition / width)
    if (cells[bombPosition].classList.contains('player')) {
      audioPlayerExplosion.play()
      cells[bombPosition].classList.remove('bomb')
      clearInterval(bombMovement)
      lives--
      livesDisplay.textContent = lives
    } else if (y === 18) {
      cells[bombPosition].classList.remove('bomb')
    } else if (cells[bombPosition].classList.contains('barrier1')) {
      audioPlayerBarrier.play()
      cells[bombPosition].classList.remove('barrier1')
      cells[bombPosition].classList.remove('bomb')
      clearInterval(bombMovement)
    } else if (cells[bombPosition].classList.contains('barrier2')) {
      audioPlayerBarrier.play()
      cells[bombPosition].classList.remove('barrier2')
      cells[bombPosition].classList.remove('bomb')
      clearInterval(bombMovement)
    } else if (cells[bombPosition].classList.contains('barrier3')) {
      audioPlayerBarrier.play()
      cells[bombPosition].classList.remove('barrier3')
      cells[bombPosition].classList.remove('bomb')
      clearInterval(bombMovement)
    } else {
      cells[bombPosition].classList.remove('bomb')
      bombPosition = bombPosition + 19
      cells[bombPosition].classList.add('bomb')
    }
  }, aliensBombSpeed)
}
```
The playerShoot function's main difference is what happens if an alien is hit. Instead of the life count being reduced, the class of 'alien' is removed from that cell.

### Winning or Losing
The last part of Stage 2 was creating a function to check whether the player has won or lost. I achieved this by creating a function which constantly runs in the background and checks a few things:
1. Whether the players lives have reached 0
2. Whether the aliens have reached the bottom of the grid
3. Whether all the aliens have been killed

If either of the first two things happened, then the player lost and it would trigger the 'endGame' function which removes the grid and all its contents, displays a losing message as well as the final score and asks the player whether they want to play again.

If all the aliens are killed then the player has completed that level which triggers the 'levelCompleted' function and asks the player whether they would like to attempt the next level.

At the end of this stage I had reached my MVP and all stages from here onward were purely for aesthetics and improvements.

## Stage 3
Stage 3 of the project was all about look and design. I focused on primary colours and used the original Lego font to give the game a very clean and fun look. I used CSS and I sourced Lego sprites from the internet for this.

## Stage 4
### Bug Fixes
Some of bugs and challenges I had at this stage were:
* Default keyboard behaviours affecting gameplay, specifically the space key. I was able to overcome this by using ```preventDefault```
* The player appearing before the game had started if a key was pressed. I ended up having to create a ```gameOn``` boolean variable which was flipped to true once the game starts and using that I added an If statement within my key handling function which would only work if the ```gameOn``` was a truthy value
* A bug caused my Lego pieces to freeze instead of disappear when an alien was hit. I played around with clearing the interval of the Lego piece moving at different stages of the collision until this was resolved

### Sound Effects and Music
At this stage I was also able to add some sound effects when the player shoots, the aliens drop Lego pieces and any collisions happen. I ended up having to use multiple audio players in my HTML as more than one of those sounds might need to play at the same time.

For the background music I chose the theme song from the Lego Movie, 'Everything Is Awesome' and chose to have the music and all the sound effects start off as muted with the player being able to toggle all sounds with a single button.

## Stage 5
### Stretch Goals
The final stage of my project was all about additional features and stretch goals:
#### Start Page
I focused on creating a start page with game instructions and a start button to start the game. I created a ```startGame``` function which triggered all functions that would start the game such as creating the grid, adding all the elements and triggering the ```endGameChecker``` function.
#### Levels
I was also able to introduce levels to my game which I found relatively easy, making this a huge win for me. Because of how I'd built my alien intervals (movement and Lego pieces dropping) with a variable rather than a number hard coded into the function, every time a level is completed the speed of these intervals is increased by a given percentage:
```js
function levelUp() {
  level = level + 1
  aliensMovingInterval = aliensMovingInterval - (level * 15)
  aliensBombSpeed = aliensBombSpeed - 5
  alienBombInterval = alienBombInterval - (level * 40)
  removePlayer()
  result.classList.add('hidden')
  scoreboard.classList.remove('hidden')
  livesTracker.classList.remove('hidden')
  levelTracker.classList.remove('hidden')
  levelUpButton.classList.add('hidden')
  aliens = [25, 31, 45, 49, 63, 64, 65, 66, 67, 68, 69, 81, 82, 84, 85, 86, 88, 89, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 118, 120, 121, 122, 123, 124, 125, 126, 128, 137, 139, 145, 147, 159, 160, 162, 163]
  aliensMovingRight = true
  playerBulletMoving = null
  aliensMoving = null
  bombMovement = null
  bombsDroppingTimer = null
  endGameCheckerTimer = null
  alienMoveTracker = 4
  playerPosition = 332
  startGame()
  levelDisplay.textContent = level
}
```
#### Play Again Function
This was a more challenging function to add because of how many different intervals had to be cleared and different values had to be reset but I was able to with a single function give the player the option to play again once they lost, without having to refresh the page:
```js
function reset() {
  removePlayer()
  result.classList.add('hidden')
  reloadButton.classList.add('hidden')
  scoreboard.classList.remove('hidden')
  livesTracker.classList.remove('hidden')
  levelTracker.classList.remove('hidden')
  aliens = [25, 31, 45, 49, 63, 64, 65, 66, 67, 68, 69, 81, 82, 84, 85, 86, 88, 89, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 118, 120, 121, 122, 123, 124, 125, 126, 128, 137, 139, 145, 147, 159, 160, 162, 163]
  aliensMovingRight = true
  playerBulletMoving = null
  aliensMoving = null
  bombMovement = null
  bombsDroppingTimer = null
  endGameCheckerTimer = null
  lives = 3
  livesDisplay.textContent = lives
  score = 0
  scoreDisplay.textContent = score
  alienMoveTracker = 4
  playerPosition = 332
  level = 1
  startGame()
}
```

## Key Learning
I learned a lot from this being my very first project. Some of the main things I will take with me into my career are:
* How useful creating a structured, yet flexible plan is
* The importance of storing values in variables rather than hard coding them into functions. This is what enabled me to easily create levels
* Having clear, consistent and DRY code
* Having a CSS day in the middle of the project really helped clear and reset my mind and I was able to really focus on what needed to be done with a rested brain the day after

## Future Improvements
* High Scores leaderboard using Local Storage
* Mothership
* Responsive design
* Different alien structure for each level