declare const global: any
import blur from './blur'
/**
 * 用type的方式，设置input的指定value值，支持输入完毕后 blur
 */
export default async (selector, content, autoBlur = true) => {
    await global.page.waitForSelector(selector)
    await global.page.focus(selector)
    await global.page.$eval(selector, (el) => {
        el.value = ''
        return true
    })
    if (content) {
        await global.page.type(selector, content, { delay: 10 })
    }
    if (autoBlur) {
        await blur(selector)
    }
}
