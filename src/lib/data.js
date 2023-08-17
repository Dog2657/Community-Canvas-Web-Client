const baseUrl = 'localhost:80'

export const notifier = new Promise(async (resolve, reject) => {
    const socket = new WebSocket(`ws://${baseUrl}/wsnotifier`);

    socket.onerror = () => reject
    socket.onopen = () => {
        resolve(socket)
    }
})

export const config = new Promise(async (resolve, reject) => {
    try {

        const response = await fetch(`http://${baseUrl}/config`)

        if(!response.ok)
            return reject((await response.json())?.detail || "Network error")

        resolve(response.json())

    } catch (error) {
        reject("Network error")
    }
})

export const sourceCanvas = new Promise(async (resolve, reject) => {
    const details = await config
    
    const images = await Promise.all(
        new Array(details.colums * details.rows).fill(undefined).map((_, index) => new Promise((resolve, reject) => {
            let img = new Image(500, 500)
            img.crossOrigin = "anonymous";
            img.src = `http://${baseUrl}/sections/${index}`
            img.onerror = () => reject
            img.onload = () => {resolve(img)}
        }))
    )

    const canvas = document.createElement('canvas')
    canvas.width = details.width
    canvas.height = details.height

    let context = canvas.getContext('2d')

    context.beginPath();
    context.fillStyle = 'white'
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.stroke();


    let cell_width = details.width / details.colums
    let cell_height = details.height / details.rows

    images.forEach((img, i) => {
      const row = Math.floor(i / details.colums)
      const col = i - (row * details.colums)

      context.drawImage(img, col * cell_width, row * cell_height)
    })

    resolve(canvas)
})