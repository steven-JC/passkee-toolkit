import blur from '../triggers/blur'
import input from '../triggers/input'
import utils, { IOffset } from '../utils'
import screenshot from '../lib/screenshot'
import state from '../utils/state'

import VSExpectPartial from './VSelector.expect'
import VSWaitForPartial from './VSelector.waitFor'
import VSProtoPartial from './VSelector.proto'
import VSMousePartial, { IMouseTrigger } from './VSelector.mouse'
import {
    selectors,
    IVSelectorExpect,
    IVSelectorWaitFor,
    IVSelectorProto
} from './const'
declare const $Z: any

class VSelector {
    public selectors: any = null
    public domSelector: string = ''
    public expect: IVSelectorExpect
    public waitFor: IVSelectorWaitFor
    public click: IMouseTrigger
    public mousedown: IMouseTrigger
    public mouseup: IMouseTrigger
    public mousemove: (offset?: IOffset) => Promise<void>
    constructor(selector) {
        if (selector instanceof Array) {
            this.selectors = JSON.parse(JSON.stringify(selector))
        } else if (typeof selector === 'string' && selector) {
            this.selectors = [{ type: '$', params: [selector] }]
        } else if (!selector) {
            throw new Error('selector cannot be empty')
        }
        this.domSelector = ''
        const waitFors = VSWaitForPartial(this, VSelector)
        const expects = VSExpectPartial(this, VSelector)
        const mouseTriggers = VSMousePartial(this)
        utils.defineFreezedProps(
            this,
            Object.assign(
                {
                    expect: expects,
                    waitFor: waitFors
                },
                mouseTriggers
            )
        )
    }

    public async length(silent?) {
        const spinner: any = silent
            ? null
            : utils.log(`length`, { selectors: this.selectors })
        let length
        try {
            length = await state.currentPage.evaluate((selectors) => {
                return $Z.$select(selectors).length
            }, this.selectors)
            if (spinner) {
                spinner.succeed(length)
            }
        } catch (e) {
            if (spinner) {
                spinner.fail(e)
            }
        }

        return length
    }

    public async visible(silent?) {
        const spinner = silent
            ? null
            : utils.log(`visible`, { selectors: this.selectors })
        let visible
        try {
            const selector = await utils.converToDomSelector(this.selectors)
            if (!selector) {
                return false
            }
            visible = await isVisible(
                await utils.converToDomSelector(this.selectors)
            )
            if (spinner) {
                spinner.succeed(visible)
            }
        } catch (e) {
            if (spinner) {
                spinner.fail(e)
            }
        }
        async function isVisible(selector) {
            return await state.currentPage.$eval(
                'body',
                (el, selector) => {
                    const elem = $Z(selector)[0]
                    return elem && !!(elem.offsetHeight || elem.offsetTop)
                },
                selector
            )
        }
        return visible
    }

    public async blur(offsetY?) {
        const spinner = utils.log(`blur`, { selectors: this.selectors })
        try {
            this.domSelector = await utils.converToDomSelector(
                utils.assignSelectors(this.selectors, [
                    { type: 'filter', params: [':visible'] },
                    { type: 'eq', params: [0] }
                ])
            )
            await blur(this.domSelector, offsetY)
            await state.currentPage.waitFor(2000)
            spinner.succeed()
        } catch (e) {
            spinner.fail(e)
        }
    }

    public async focus() {
        const spinner = utils.log(`focus`, { selectors: this.selectors })
        try {
            this.domSelector = await utils.converToDomSelector(
                utils.assignSelectors(this.selectors, [
                    { type: 'filter', params: [':visible'] },
                    { type: 'eq', params: [0] }
                ])
            )
            await state.currentPage.focus(this.domSelector)
            spinner.succeed()
        } catch (e) {
            spinner.fail(e)
        }
    }

    public async input(content, autoBlur?) {
        const spinner = utils.log(`input ${content}`, {
            selectors: this.selectors
        })
        try {
            this.domSelector = await utils.converToDomSelector(
                utils.assignSelectors(this.selectors, [
                    { type: 'filter', params: [':visible'] },
                    { type: 'eq', params: [0] }
                ])
            )
            await input(this.domSelector, content, autoBlur)
            spinner.succeed()
        } catch (e) {
            spinner.fail(e)
        }
    }

    public async type(content, autoBlur = true) {
        const spinner = utils.log(`type ${content}`, {
            selectors: this.selectors
        })
        try {
            this.domSelector = await utils.converToDomSelector(
                utils.assignSelectors(this.selectors, [
                    { type: 'filter', params: [':visible'] },
                    { type: 'eq', params: [0] }
                ])
            )
            await state.currentPage.type(this.domSelector, content)
            if (autoBlur) {
                await blur(this.domSelector)
            }
            spinner.succeed()
        } catch (e) {
            spinner.fail(e)
        }
    }

    public async hover() {
        const spinner = utils.log(`hover`, {
            selectors: this.selectors
        })
        try {
            this.domSelector = await utils.converToDomSelector(
                utils.assignSelectors(this.selectors, [
                    { type: 'filter', params: [':visible'] },
                    { type: 'eq', params: [0] }
                ])
            )
            await state.currentPage.hover(this.domSelector)
            spinner.succeed()
        } catch (e) {
            spinner.fail(e)
        }
    }

    public async upload(filePaths) {
        const spinner = utils.log(`upload ${filePaths}`, {
            selectors: this.selectors
        })
        try {
            this.domSelector = await utils.converToDomSelector(
                utils.assignSelectors(this.selectors, [
                    { type: 'filter', params: [':visible'] },
                    { type: 'eq', params: [0] }
                ])
            )
            const isFileInput = await state.currentPage.$eval(
                this.domSelector,
                (el: HTMLInputElement) =>
                    el.tagName === 'INPUT' && el.type === 'file'
            )
            if (!isFileInput) {
                spinner.fail(
                    new Error(`[TestKit] the element should be file input`)
                )
            }

            const el = await state.currentPage.$(this.domSelector)
            if (el) {
                await utils.apply(el.uploadFile, filePaths, el)
            }
            spinner.succeed()
        } catch (e) {
            spinner.fail(e)
        }
    }

    public async screenshot(name) {
        const spinner = utils.log(`screenshot ${name}`, {
            selectors: this.selectors
        })
        try {
            this.domSelector = await utils.converToDomSelector(
                utils.assignSelectors(this.selectors, [
                    { type: 'filter', params: [':visible'] },
                    { type: 'eq', params: [0] }
                ])
            )
            await screenshot(this.domSelector, name)
            spinner.succeed()
        } catch (e) {
            spinner.fail(e)
        }
    }
}

VSProtoPartial(VSelector)

selectors.forEach((item) => {
    VSelector.prototype[item] = function() {
        return new VSelector(
            utils.assignSelectors(this.selectors, [
                {
                    type: item,
                    params: Array.prototype.slice.call(arguments)
                }
            ])
        )
    }
})

interface VSelector extends IVSelectorProto {
    filter(selector?: string): VSelector
    parents(selector?: string): VSelector
    parent(selector?: string): VSelector
    children(selector?: string): VSelector
    find(selector: string): VSelector
    eq(index: number): VSelector
}

export default VSelector
