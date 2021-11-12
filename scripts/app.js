



// * DOM Variables
const grid = document.querySelector('.grid')
const start = document.querySelector('#start')
const scoreDisplay = document.querySelector('#score-display')

// * Game Variables

const width = 20
const gridCellCount = width * width
const cells = []

let playerPosition = 369

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

function startGame() {
  addPlayer(playerPosition)
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
  addPlayer(playerPosition)
}


// * Events
start.addEventListener('click', startGame)
document.addEventListener('keyup', handleKeyUp)