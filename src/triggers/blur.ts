/***
 *  让元素失去焦点
 * */
import state from '../utils/state'

export default async (selector, offsetY?) => {
    const el = await state.currentPage.$(selector)
    let box
    if (el) {
        box = await el.boundingBox()
    }
    if (!el || !box) {
        throw '[puppeteer-testkit] element not visible or deleted fro document'
    }
    await state.currentPage.mouse.click(
        box.x + box.width / 2,
        box.y - (offsetY || 2)
    )
}
