import state from '../utils/state'

declare const global: any

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
    const steps = Math.ceil(
        Math.sqrt(
            Math.pow(x - state.lastPos.x, 2) + Math.pow(y - state.lastPos.y, 2)
        ) / 5
    )
    await global.page.mouse.move(x, y, {
        steps
    })
    await global.page.waitFor(100)
    await global.page.mouse.down({
        button: button || 'left'
    })
    state.lastPos = { x, y }
}
