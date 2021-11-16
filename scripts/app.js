



// * DOM Variables
const grid = document.querySelector('.grid')
const start = document.querySelector('#start')
const scoreDisplay = document.querySelector('#score-display')
const livesDisplay = document.querySelector('#lives-display')


// * Game Variables

const width = 19
const gridCellCount = width * width
const cells = []
const alienPosition = [24, 25, 26, 27, 28, 29, 30, 31, 32, 43, 44, 45, 46, 47, 48, 49, 50, 51, 62, 63, 64, 65, 66, 67, 68, 69, 70]
const bulletsArray = []

let gameOn = false
let playerPosition = 332
let aliens = alienPosition.slice()
let alienMoveTracker = 5
let aliensMovingRight = true
let score = 0
let playerBulletMoving = null
let aliensMoving = null
let bombMovement = null
let lives = 3

// * Functions 

function createGrid() {
  for (let i = 0; i < gridCellCount; i++) {
    const cell = document.createElement('div')
    cell.setAttribute('data-index', i)
    cells.push(cell)
    grid.appendChild(cell)
  }
}

function addPlayer(position) {
  cells[position].classList.add('player')
}

function removePlayer() {
  cells[playerPosition].classList.remove('player')
}

function addAliens() {
  aliens.forEach(alien => {
    cells[alien].classList.add('alien')
  })
}

function removeAliens() {
  aliens.forEach(alien => {
    cells[alien].classList.remove('alien')
  })
}

function moveAliens () {
  aliensMoving = window.setInterval(() => {
    removeAliens()
    if (alienMoveTracker < 10) {
      if (aliensMovingRight) {
        aliens = aliens.map(alien => alien + 1)
      } else {
        aliens = aliens.map(alien => alien - 1)
      }
      alienMoveTracker++
    } else if (alienMoveTracker === 10) {
      alienMoveTracker = 0
      aliens = aliens.map(alien => alien + width)
      aliensMovingRight = !aliensMovingRight
    }
    addAliens()
  }, 800)
}

function playerShoot (e) {
  if(e.keyCode === 32 && gameOn) {
    e.preventDefault()
    let bulletPosition = playerPosition - 19
    const playerBulletMoving = window.setInterval(() => {
      const y = Math.floor(bulletPosition / width)
      if(y === 0) {
        cells[bulletPosition].classList.remove('bullet')
      } else if (cells[bulletPosition].classList.contains('alien')) {
        cells[bulletPosition].classList.remove('alien', 'bullet')
        const alienIndex = aliens.indexOf(bulletPosition)
        aliens.splice(alienIndex, 1)
        score = score + 100
        scoreDisplay.textContent = score
        console.log(score)
        clearInterval(playerBulletMoving)
      } else {
        cells[bulletPosition].classList.remove('bullet')
        bulletPosition = bulletPosition - 19
        cells[bulletPosition].classList.add('bullet')
      }
    }, 100)
  }
}



function alienShoot () {
  const bombs = aliens[Math.floor(Math.random() * aliens.length)]
  let bombPosition = bombs + 19
  const bombMovement = window.setInterval(() => {
    const y = Math.floor(bombPosition / width)
    if (y === 18) {
      cells[bombPosition].classList.remove('bomb')
    } else if (cells[bombPosition].classList.contains('player')) {
      cells[bombPosition].classList.remove('bomb')
      clearInterval(bombMovement)
      console.log(bombPosition)
      lives--
      livesDisplay.textContent = lives
    } else {
      cells[bombPosition].classList.remove('bomb')
      bombPosition = bombPosition + 19
      cells[bombPosition].classList.add('bomb')
    }
  }, 200)
}


// * Start Game

function startGame() {
  gameOn = true
  addPlayer(playerPosition)
  addAliens(alienPosition)
  moveAliens()
  window.setInterval(() => {
    alienShoot()
  },1000)
}

// * Player Movement
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


// * Events
createGrid()
start.addEventListener('click', startGame)
document.addEventListener('keyup', handleKeyUp)
document.addEventListener('keyup', playerShoot)