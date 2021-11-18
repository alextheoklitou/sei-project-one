// * DOM Variables

const grid = document.querySelector('#grid')
const start = document.querySelector('#start')
const scoreDisplay = document.querySelector('#score-display')
const scoreboard = document.querySelector('#scoreboard')
const livesDisplay = document.querySelector('#lives-display')
const livesTracker = document.querySelector('#livestracker')
const result = document.querySelector('#result')
const resultDisplay = document.querySelector('#result-display')
const audioPlayerShoot = document.querySelector('#audio-shoot')
const audioPlayerAlienHit = document.querySelector('#audio-alien')
const audioPlayerExplosion = document.querySelector('#audio-explosion')
const audioPlayerMusic = document.querySelector('#audio-music')
const playAgain = document.querySelector('#reload')
const levelUpButton = document.querySelector('#level-up')
const musicButton = document.querySelector('#music-toggle')
const reloadButton = document.querySelector('#reload')
audioPlayerMusic.src = '../assets/everythingisawesome.mp3'
audioPlayerShoot.src = '../assets/shoot.wav'
audioPlayerAlienHit.src = '../assets/invaderkilled.wav'
audioPlayerExplosion.src = '../assets/explosion.wav'

// * Game Variables

const width = 19
const gridCellCount = width * width
const cells = []
const barrier1Positions = [267, 272, 277, 282]
const barrier2Positions = [268, 273, 278, 283]
const barrier3Positions = [269, 274, 279, 284]
let aliens = [25, 31, 45, 49, 63, 64, 65, 66, 67, 68, 69, 81, 82, 84, 85, 86, 88, 89, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 118, 120, 121, 122, 123, 124, 125, 126, 128, 137, 139, 145, 147, 159, 160, 162, 163]
let gameOn = false
let playerPosition = 332
let alienMoveTracker = 4
let aliensMovingRight = true
let score = 0
let playerBulletMoving = null
let aliensMoving = null
let bombMovement = null
let lives = 3
let bombsDroppingTimer = null
let endGameCheckerTimer = null
let muted = true
audioPlayerMusic.muted = true
audioPlayerShoot.muted = true
audioPlayerAlienHit.muted = true
audioPlayerExplosion.muted = true

// * Level Up Variables
let level = 1
let aliensMovingInterval = 400
let aliensBombSpeed = 200
let alienBombInterval = 1200

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

function playerShoot (e) {
  if(e.keyCode === 32 && gameOn) {
    audioPlayerShoot.play()
    e.preventDefault()
    let bulletPosition = playerPosition - 19
    const playerBulletMoving = window.setInterval(() => {
      const y = Math.floor(bulletPosition / width)
      if(y === 0) {
        cells[bulletPosition].classList.remove('bullet')
      } else if (cells[bulletPosition].classList.contains('alien')) {
        audioPlayerAlienHit.play()
        cells[bulletPosition].classList.remove('alien', 'bullet')
        const alienIndex = aliens.indexOf(bulletPosition)
        aliens.splice(alienIndex, 1)
        score = score + 100
        scoreDisplay.textContent = score
        clearInterval(playerBulletMoving)
      } else if (cells[bulletPosition].classList.contains('barrier1')) {
        cells[bulletPosition].classList.remove('barrier1')
        cells[bulletPosition].classList.remove('bullet')
        clearInterval(playerBulletMoving)
      } else if (cells[bulletPosition].classList.contains('barrier2')) {
        cells[bulletPosition].classList.remove('barrier2')
        cells[bulletPosition].classList.remove('bullet')
        clearInterval(playerBulletMoving)
      } else if (cells[bulletPosition].classList.contains('barrier3')) {
        cells[bulletPosition].classList.remove('barrier3')
        cells[bulletPosition].classList.remove('bullet')
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
    if (cells[bombPosition].classList.contains('player')) {
      audioPlayerExplosion.play()
      cells[bombPosition].classList.remove('bomb')
      clearInterval(bombMovement)
      lives--
      livesDisplay.textContent = lives
    } else if (y === 18) {
      cells[bombPosition].classList.remove('bomb')
    } else if (cells[bombPosition].classList.contains('barrier1')) {
      cells[bombPosition].classList.remove('barrier1')
      cells[bombPosition].classList.remove('bomb')
      clearInterval(bombMovement)
    } else if (cells[bombPosition].classList.contains('barrier2')) {
      cells[bombPosition].classList.remove('barrier2')
      cells[bombPosition].classList.remove('bomb')
      clearInterval(bombMovement)
    } else if (cells[bombPosition].classList.contains('barrier3')) {
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

function musicToggle() {
  muted = !muted
  if (muted) {
    audioPlayerMusic.muted = true
    audioPlayerShoot.muted = true
    audioPlayerAlienHit.muted = true
    audioPlayerExplosion.muted = true
    musicButton.textContent = 'UNMUTE'
  } else if (!muted) {
    audioPlayerMusic.muted = false
    audioPlayerShoot.muted = false
    audioPlayerAlienHit.muted = false
    audioPlayerExplosion.muted = false
    audioPlayerMusic.play()
    musicButton.textContent = 'MUTE'
  }
}

// * Start Game

function startGame() {
  gameOn = true
  start.classList.add('hidden')
  grid.classList.remove('hidden')
  grid.classList.add('grid')
  scoreboard.classList.remove('hidden')
  livesTracker.classList.remove('hidden')
  addPlayer(playerPosition)
  addAliens(aliens)
  moveAliens()
  bombsDroppingTimer = window.setInterval(() => {
    alienShoot()
  },alienBombInterval)
  endGameChecker()
  barrier1Positions.forEach(position => {
    cells[position].classList.add('barrier1')
  })
  barrier2Positions.forEach(position => {
    cells[position].classList.add('barrier2')
  })
  barrier3Positions.forEach(position => {
    cells[position].classList.add('barrier3')
  })
}


//* End Checker
function endGameChecker () {
  endGameCheckerTimer = window.setInterval(() => {
    let y = null
    aliens.forEach(alien => {
      y = Math.floor(alien / width)
    })
    if (lives === 0) {
      endGame(`You lose! Your final score is ${score}!`)
      return
    } else if (aliens.length === 0) {
      levelCompleted(`You have completed level ${level}! Your current score is ${score}!`)
      return
    } else if (y === 18) {
      endGame(`You lose! Your final score is ${score}!`)
      return
    }
  }, 100)
}


// * End Game
function endGame (endgamestatement) {
  removePlayer()
  removeAliens()
  clearInterval(bombMovement)
  clearInterval(aliensMoving)
  clearInterval(bombsDroppingTimer)
  clearInterval(playerBulletMoving)
  clearInterval(endGameCheckerTimer)
  grid.classList.remove('grid')
  grid.classList.add('hidden')
  result.classList.remove('hidden')
  reloadButton.classList.remove('hidden')
  resultDisplay.innerHTML = endgamestatement
  scoreboard.classList.add('hidden')
  livesTracker.classList.add('hidden')
  cells.forEach(cell => {
    cells[cell].classList.remove('bomb')
  })
  cells.forEach(cell => {
    cells[cell].classList.remove('bullet')
  })
}

function levelCompleted (endgamestatement) {
  removePlayer()
  removeAliens()
  clearInterval(bombMovement)
  clearInterval(aliensMoving)
  clearInterval(bombsDroppingTimer)
  clearInterval(playerBulletMoving)
  clearInterval(endGameCheckerTimer)
  grid.classList.remove('grid')
  grid.classList.add('hidden')
  result.classList.remove('hidden')
  resultDisplay.innerHTML = endgamestatement
  levelUpButton.classList.remove('hidden')
  scoreboard.classList.add('hidden')
  livesTracker.classList.add('hidden')
  cells.forEach(cell => {
    cells[cell].classList.remove('bomb')
  })
  cells.forEach(cell => {
    cells[cell].classList.remove('bullet')
  })
}

// * Level Up
function levelUp() {
  level = level + 1
  aliensMovingInterval = 400
  aliensBombSpeed = 200
  alienBombInterval = alienBombInterval - (level * 20)
  removePlayer()
  result.classList.add('hidden')
  scoreboard.classList.remove('hidden')
  livesTracker.classList.remove('hidden')
  levelUpButton.classList.add('hidden')
  aliens = [25, 31, 45, 49, 63, 64, 65, 66, 67, 68, 69, 81, 82, 84, 85, 86, 88, 89, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 118, 120, 121, 122, 123, 124, 125, 126, 128, 137, 139, 145, 147, 159, 160, 162, 163]
  aliensMovingRight = true
  playerBulletMoving = null
  aliensMoving = null
  bombMovement = null
  bombsDroppingTimer = null
  endGameCheckerTimer = null
  // livesDisplay.textContent = lives
  // scoreDisplay.textContent = score
  alienMoveTracker = 4
  playerPosition = 332
  startGame()
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

// * Reload
function reset() {
  removePlayer()
  result.classList.add('hidden')
  reloadButton.classList.add('hidden')
  scoreboard.classList.remove('hidden')
  livesTracker.classList.remove('hidden')
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
  startGame()
}

// * Events
createGrid()
start.addEventListener('click', startGame)
document.addEventListener('keyup', handleKeyUp)
document.addEventListener('keyup', playerShoot)
playAgain.addEventListener('click', reset)
levelUpButton.addEventListener('click', levelUp)
musicButton.addEventListener('click', musicToggle)
musicButton.textContent = 'UNMUTE'