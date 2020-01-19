import state from '../utils/state'

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
    const el = await state.currentPage.$(selector)
    let box
    if (el) {
        box = await el.boundingBox()
    }
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
            Math.pow(x - state.lastMousePosition.x, 2) +
                Math.pow(y - state.lastMousePosition.y, 2)
        ) / 5
    )
    await state.currentPage.mouse.move(x, y, {
        steps
    })
    await state.currentPage.waitFor(100)
    await state.currentPage.mouse.up({
        button: button || 'left'
    })
    state.lastMousePosition = { x, y }
}
