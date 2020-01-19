import state from '../utils/state'
import blur from './blur'
/**
 * 用type的方式，设置input的指定value值，支持输入完毕后 blur
 */
export default async (selector, content, autoBlur = true) => {
    await state.currentPage.waitForSelector(selector)
    await state.currentPage.focus(selector)
    await state.currentPage.$eval(selector, (el: HTMLInputElement) => {
        el.value = ''
        return true
    })
    if (content) {
        await state.currentPage.type(selector, content, { delay: 10 })
    }
    if (autoBlur) {
        await blur(selector)
    }
}
