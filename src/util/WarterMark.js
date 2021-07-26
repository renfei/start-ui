'use strict'

let watermark = {}

let setWatermark = (userName, userId) => {
    let id = '1.23452384164.123412415'

    if (document.getElementById(id) !== null) {
        document.body.removeChild(document.getElementById(id))
    }

    let can = document.createElement('canvas')
    can.width = 210
    can.height = 160

    let cans = can.getContext('2d')
    cans.rotate(-15 * Math.PI / 180)
    cans.font = '20px Verdana'
    cans.fillStyle = 'rgba(200, 200, 200, 0.20)'
    cans.textAlign = 'left'
    cans.textBaseline = 'Middle'
    cans.fillText(userName, can.width / 3, can.height / 2)
    cans.fillText(userId, can.width / 3, can.height / 1.6)

    let div = document.createElement('div')
    div.id = id
    div.style.pointerEvents = 'none'
    div.style.top = '65px'
    div.style.left = '0px'
    div.style.position = 'fixed'
    div.style.zIndex = '100000'
    div.style.width = '100%'
    div.style.height = '100%'
    div.style.background = 'url(' + can.toDataURL('image/png') + ') left top repeat'
    document.body.appendChild(div)
    return id
}

// 该方法只允许调用一次
watermark.set = (userName, userId) => {
    let id = setWatermark(userName, userId)
    setInterval(() => {
        if (document.getElementById(id) === null) {
            id = setWatermark(userName, userId)
        }
    }, 500)
    window.onresize = () => {
        setWatermark(userName, userId)
    }
}

export default watermark