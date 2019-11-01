declare const global: any

import constants from '../constants'
import vars from '../utils/vars'

export default async (
    selector,
    offset: {
        x?: number
        y?: number
        forDispose?: boolean
        forHidden?: boolean
    } = {},
    button
) => {
    offset = Object.assign(
        {
            x: 0,
            y: 0
        },
        offset
    )
    await global.page.waitForSelector(selector)
    const el = await global.page.$(selector)
    await el.focus()
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

    await global.page.mouse.move(x, y, {
        steps: 10
    })
    await global.page.waitFor(100)
    await global.page.mouse.click(x, y, {
        button: constants.MouseButton[button] || 'left'
    })
    vars.lastPos = { x, y }
}
