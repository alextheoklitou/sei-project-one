



// * DOM Variables
const grid = document.querySelector('.grid')
const start = document.querySelector('#start')
const scoreDisplay = document.querySelector('#score-display')

// * Game Variables

const width = 19
const gridCellCount = width * width
const cells = []

let gameOn = false
let playerPosition = 332
let alienPosition = [24, 25, 26, 27, 28, 29, 30, 31, 32]
let aliens = alienPosition.slice()

// * Functions 

function createGrid() {
  for (let i = 0; i < gridCellCount; i++) {
    const cell = document.createElement('div')
    cell.setAttribute('data-index', i)
    cells.push(cell)
    grid.appendChild(cell)
  }
}
createGrid()

function addPlayer(position) {
  cells[position].classList.add('player')
}

function addAliens() {
  aliens.forEach(alien => {
    cells[alien].classList.add('alien')
  })
}

function startGame() {
  gameOn = true
  addPlayer(playerPosition)
  addAliens(alienPosition)
}

function removePlayer() {
  cells[playerPosition].classList.remove('player')
}

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
start.addEventListener('click', startGame)
document.addEventListener('keyup', handleKeyUp)
