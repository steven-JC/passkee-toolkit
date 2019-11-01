/***
 *  让元素失去焦点
 * */
declare const global: any

export default async (selector, offsetY?) => {
    const el = await global.page.$(selector)
    const box = await el.boundingBox()

    if (!el || !box) {
        throw '[puppeteer-testkit] element not visible or deleted fro document'
    }
    await global.page.mouse.click(box.x + box.width / 2, box.y - (offsetY || 2))
}
