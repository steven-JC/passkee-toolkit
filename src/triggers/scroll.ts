import constants from '../constants'

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

    await global.page.mouse.move(
        box.x + (offset.x ? offset.x : box.width / 2),
        box.y + (offset.y ? offset.y : box.height / 2),
        {
            steps: 10
        }
    )
    await global.page.waitFor(100)
    await global.page.mouse.down({
        button: constants.MouseButton[button] || 'left'
    })
}
