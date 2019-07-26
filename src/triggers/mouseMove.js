const vars = require('../utils/vars')
module.exports = async (selector, offset = {}) => {
    offset = Object.assign(
        {
            x: 0,
            y: 0
        },
        offset
    )
    const el = await page.$(selector)
    const box = await el.boundingBox()

    if (!el || !box) {
        if (!offset.forDispose && !offset.forHidden) {
            throw new Error('element not visible or deleted fro document')
        } else {
            return
        }
    }

    const x = box.x + (offset.x ? offset.x : box.width / 2)
    const y = box.y + (offset.y ? offset.y : box.height / 2)
    const steps = parseInt(
        Math.sqrt(
            Math.pow(x - vars.lastPos.x, 2) + Math.pow(y - vars.lastPos.y, 2)
        ) / 5
    )
    await page.mouse.move(x, y, {
        steps
    })
    vars.lastPos = { x, y }
}
