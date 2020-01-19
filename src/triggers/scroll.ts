import state from '../utils/state'
declare const $Z
export default async (
    selector,
    scrollOffset: {
        x?: number
        y?: number
    } = {}
) => {
    await state.currentPage.$eval(
        selector,
        (el: HTMLInputElement, scrollOffset) => {
            if (typeof scrollOffset.y === 'number') {
                $Z(el).scrollTop(scrollOffset.y)
            }
            if (typeof scrollOffset.x === 'number') {
                $Z(el).scrollLeft(scrollOffset.x)
            }
        },
        scrollOffset
    )
}
