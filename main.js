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

let lightnings = []
let id = 0

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
    ctx.shadowBlur = 50
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
    drawLightnings()

    checkBallCords(ballX, w)
    checkBallCords(ballY, h)

    if (dirX === "plus") {
        ballX += 2
    } else {
        ballX -= 2
    }

    if (dirY === "plus") {
        ballY += 2
    } else {
        ballY -= 2
    }

    drawBall()

    window.requestAnimationFrame(animateBall)
}

function drawLightnings() {
    lightnings?.map(lightning => {
        lightning?.array?.map((cord, index) => {
            if (index < lightning?.array.length - 1) {
                ctx.beginPath()
                ctx.moveTo(cord[0], cord[1])
                ctx.lineTo(lightning?.array[index + 1][0], lightning?.array[index + 1][1])
                ctx.stroke()
                ctx.closePath()
            }
        })
    })
}

function animateLightnings() {
    ctx.strokeStyle = randomColor()
    ctx.shadowBlur = 1
    ctx.lineWidth = randomNumber(10, 20)

    lightningX = randomNumber(10, w - 10)
    lightningY = randomNumber(10, h - 10)

    // while (Math.abs(lightningX - ballX) < 100 || Math.abs(lightningY - ballY) < 100) {
    //     lightningX = randomNumber(10, w - 10)
    //     lightningY = randomNumber(10, h - 10)
    // }

    const arr = [[lightningX, lightningY]]

    lightnings.push({
        "id": id,
        "array": arr
    })

    const lightningId = id++

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
        ctx.lineTo(nextPointX, nextPointY)
        ctx.stroke()
        ctx.closePath()

        lightnings = lightnings.map(lightning => {
            if (lightning?.id === lightningId) {
                return {
                    "array": arr,
                    ...lightning
                }
            }
            return lightning
        })

        if (Math.abs(ballX - arrX) < 30 || Math.abs(ballY - arrY) < 30) {
            clearInterval(interval)
            lightnings = lightnings.filter(lightning => lightning?.id !== lightningId)
        }
    }

    const interval = setInterval(animateLightning, 20)

    window.requestAnimationFrame(animateLightnings)
}

// setInterval(animateBall, 10)
// setInterval(animateLightnings, 50)

requestAnimationFrame(animateBall)
requestAnimationFrame(animateLightnings)