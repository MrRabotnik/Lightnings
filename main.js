const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

const w = window.innerWidth
const h = window.innerHeight

canvas.width = w
canvas.height = h

// --------------------------------------------

let ballX = randomNumber(w / 2 - 50, w / 2 + 50)
let ballY = randomNumber(h / 2 - 50, h / 2 + 50)
let dirX = "plus"
let dirY = "plus"

let lightningX = randomNumber(50, w - 50)
let lightningY = randomNumber(50, h - 50)

ctx.fillStyle = "black"
ctx.shadowBlur = 1
ctx.shadowColor = "white"
ctx.lineCap = "round"
ctx.lineJoin = "round"

const lightnings = []

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomColor() {
  const r = randomNumber(0, 255)
  const g = randomNumber(0, 255)
  const b = randomNumber(0, 255)
  return `rgb(${r}, ${g}, ${b})`
}

function clearCanvas() {
  ctx.clearRect(0, 0, w, h)
}

function drawBall() {
  ctx.shadowBlur = 30
  ctx.beginPath();
  ctx.arc(ballX, ballY, 50, 0, Math.PI * 2);
  ctx.fill();
  ctx.closePath();
}

function checkBallCords(ballCord, size) {
  if (ballCord > size - 50) {
    if (size === w) dirX = "minus"
    else dirY = "minus"
  } else if (ballCord < 50) {
    if (size === w) dirX = "plus"
    else dirY = "plus"
  }
}

function animateBall() {
  clearCanvas()

  checkBallCords(ballX, w)
  checkBallCords(ballY, h)

  if (dirX === "plus") {
    ballX += 4
  } else {
    ballX -= 4
  }

  if (dirY === "plus") {
    ballY += 4
  } else {
    ballY -= 4
  }

  drawBall()
}

function animateLightnings() {
  ctx.strokeStyle = randomColor()
  // ctx.strokeStyle = "yellow"
  ctx.shadowBlur = 1
  ctx.lineWidth = randomNumber(10, 20)

  lightningX = randomNumber(10, w - 10)
  lightningY = randomNumber(10, h - 10)

  while(Math.abs(lightningX - ballX) < 200 || Math.abs(lightningY - ballY) < 200){
    lightningX = randomNumber(10, w - 10)
    lightningY = randomNumber(10, h - 10)
    console.log("message")
  }

  const arr = [[lightningX, lightningY]]

  function drawLightnings() {
    arr.map((cord, index) => {
      if(index < arr.length - 1){
        ctx.beginPath()
        ctx.moveTo(cord[0], cord[1])
        ctx.lineTo(arr[index + 1][0], arr[index + 1][1])
        ctx.stroke()
        ctx.closePath()
      }
    })
  }

  drawLightnings()

  function animateLightning() {
    ctx.beginPath()
    ctx.lineWidth--

    const arrX = arr[arr.length - 1][0]
    const arrY = arr[arr.length - 1][1]
    ctx.moveTo(arrX, arrY)

    let nextPointX = arrX + randomNumber(-50, 50)
    let nextPointY = arrY + randomNumber(0, 100)

    const minX = Math.abs(Math.floor((ballX - arrX) / 7))
    const minY = Math.abs(Math.floor((ballY - arrY) / 7))

    const maxX = Math.abs(Math.floor((ballX - arrX) / 4))
    const maxY = Math.abs(Math.floor((ballY - arrY) / 4))
    
    if (ballX > arrX) {
      nextPointX = arrX + randomNumber(minX, maxX)
    } else {
      nextPointX = arrX - randomNumber(minX, maxX)
    }

    if (ballY > arrY) {
      nextPointY = arrY + randomNumber(minY, maxY)
    } else {
      nextPointY = arrY - randomNumber(minY, maxY)
    }

    arr.push([nextPointX, nextPointY])
    console.log(arr)
    ctx.lineTo(nextPointX, nextPointY)
    ctx.stroke()
    ctx.closePath()

    if (Math.abs(ballX - arrX) < 50 || Math.abs(ballY - arrY) < 50) {
      clearInterval(interval)
    }
  }

  const interval = setInterval(animateLightning, 20)
}

setInterval(animateBall, 50)
setInterval(animateLightnings, 50)
// animateBall()
// animateLightnings()