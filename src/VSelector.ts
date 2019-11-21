import click from './triggers/click'
import mousedown from './triggers/mouseDown'
import mouseup from './triggers/mouseUp'
import mousemove from './triggers/mouseMove'
import blur from './triggers/blur'
import input from './triggers/input'
import utils from './utils'
import screenshot from './screenshot'

import constants from './constants'

declare const global: any
declare const $Z: any

// 没参数
const noParamProps = [
    'text',
    'html',
    'height',
    'width',
    'offset',
    'offsetParent',
    'position',
    'val',
    'index',
    'scrollTop'
]
// 有参数
const oneParamProps = ['css', 'attr', 'prop', 'data', 'hasClass']
// 选择器
const selectors = ['filter', 'parents', 'parent', 'children', 'find', 'eq']

const MouseTrigger = {
    click,
    mousedown,
    mouseup,
    mousemove
}

function $(selector) {
    return new VSelector(selector)
}

class VSelector {
    public selectors: any = null
    public domSelector: string = ''
    public expect: DomExpect
    public waitFor: DomWaitFor
    public click: IMouseTrigger
    public mousedown: IMouseTrigger
    public mouseup: IMouseTrigger
    public mousemove: (offset?: Offset) => Promise<void>
    constructor(selector) {
        if (selector instanceof Array) {
            this.selectors = JSON.parse(JSON.stringify(selector))
        } else if (typeof selector === 'string' && selector) {
            this.selectors = [{ type: '$', params: [selector] }]
        } else if (!selector) {
            throw new Error('selector cannot be empty')
        }
        this.domSelector = ''
        const waitFors = {}
        const expects = {}

        noParamProps.forEach((item) => {
            waitFors[item] = async (value, options) => {
                const spinner = utils.log(`wait for ${item} to be ${value}`, {
                    selectors: this.selectors
                })
                await utils
                    .waitFor(async () => {
                        return utils.equat(
                            await $(this.selectors)[item](),
                            value
                        )
                    }, options)
                    .then(() => {
                        spinner.succeed()
                    })
                    .catch((e) => {
                        spinner.fail(e)
                    })
            }
        })

        oneParamProps.forEach((item) => {
            waitFors[item] = async (name, value, options) => {
                const spinner = utils.log(
                    `wait for ${item} ${name} to be ${value}`,
                    {
                        selectors: this.selectors
                    }
                )
                await utils
                    .waitFor(async () => {
                        return utils.equat(
                            await $(this.selectors)[item](name),
                            value
                        )
                    }, options)
                    .then(() => {
                        spinner.succeed()
                    })
                    .catch((e) => {
                        spinner.fail(e)
                    })
            }
        })
        ;['visible', 'length'].forEach((item) => {
            waitFors[item] = async (value, options) => {
                const spinner = utils.log(`wait for ${item} to be ${value}`, {
                    selectors: this.selectors
                })
                await utils
                    .waitFor(async () => {
                        return utils.equat(await this[item](true), value)
                    }, options)
                    .then(() => {
                        spinner.succeed()
                    })
                    .catch((e) => {
                        spinner.fail(e)
                    })
            }
            expects[item] = async (value) => {
                const spinner = utils.log(`expect ${item} to be ${value}`, {
                    selectors: this.selectors
                })
                if (!utils.equat(await this[item](true), value)) {
                    spinner.fail()
                } else {
                    spinner.succeed()
                }
            }
        })

        noParamProps.forEach((item) => {
            expects[item] = async (value) => {
                const spinner = utils.log(`expect ${item} to be ${value}`, {
                    selectors: this.selectors
                })
                if (!utils.equat(await $(this.selectors)[item](), value)) {
                    spinner.fail()
                } else {
                    spinner.succeed()
                }
            }
        })

        oneParamProps.forEach((item) => {
            expects[item] = async (name, value) => {
                const spinner = utils.log(
                    `expect ${item} ${name} to be ${value}`,
                    {
                        selectors: this.selectors
                    }
                )
                if (!utils.equat(await $(this.selectors)[item](name), value)) {
                    spinner.fail()
                } else {
                    spinner.succeed()
                }
            }
        })

        const mouseTriggers = {}

        Object.keys(MouseTrigger).forEach((trigger) => {
            mouseTriggers[trigger] = async (offset) => {
                const spinner = utils.log(`${trigger}`, {
                    selectors: this.selectors
                })
                try {
                    this.domSelector = await utils.converToDomSelector(
                        utils.assignSelectors(this.selectors, [
                            { type: 'filter', params: [':visible'] },
                            { type: 'eq', params: [0] }
                        ])
                    )
                    await mouseTriggers[trigger].call(
                        this,
                        this.domSelector,
                        offset
                    )
                    spinner.succeed()
                } catch (e) {
                    spinner.fail(e)
                }
            }
            if (trigger !== 'mouseMove') {
                Object.keys(constants.MouseButton).forEach((btn) => {
                    mouseTriggers[trigger][btn] = async (offset) => {
                        const spinner = utils.log(`${trigger} ${btn}`, {
                            selectors: this.selectors
                        })
                        try {
                            this.domSelector = await utils.converToDomSelector(
                                utils.assignSelectors(this.selectors, [
                                    { type: 'filter', params: [':visible'] },
                                    { type: 'eq', params: [0] }
                                ])
                            )
                            await mouseTriggers[trigger].call(
                                this,
                                this.domSelector,
                                offset,
                                btn
                            )
                            spinner.succeed()
                        } catch (e) {
                            spinner.fail(e)
                        }
                    }
                })
            }
        })

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

    public async length(silent) {
        const spinner: any = silent
            ? null
            : utils.log(`length`, { selectors: this.selectors })
        let length
        try {
            length = await global.page.evaluate((selectors) => {
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
            visible = await utils.visible(
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
            await global.page.waitFor(2000)
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
            await global.page.focus(this.domSelector)
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
            await global.page.type(this.domSelector, content)
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
            await global.page.hover(this.domSelector)
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
            const isFileInput = await global.page.$eval(
                this.domSelector,
                (el) => el.tagName === 'INPUT' && el.type === 'file'
            )
            if (!isFileInput) {
                spinner.fail(
                    new Error(`[TestKit] the element should be file input`)
                )
            }

            const el = await global.page.$(this.domSelector)
            await utils.apply(el.uploadFile, filePaths, el)
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

    /* to dev
    async press() {}
    */
}

// 选择器
selectors.forEach((item) => {
    VSelector.prototype[item] = function() {
        return new VSelector(
            utils.assignSelectors(this.selectors, [
                { type: item, params: Array.prototype.slice.call(arguments) }
            ])
        )
    }
})

// 无参数
noParamProps.forEach((it) => {
    VSelector.prototype[it] = async function(silent) {
        const spinner = silent
            ? null
            : utils.log(`visible`, { selectors: this.selectors })
        try {
            const res = await global.page.$eval(
                'body',
                (el, selectors, method) => {
                    return $Z.$select(selectors)[method]()
                },
                this.selectors,
                it
            )
            if (spinner) {
                spinner.succeed(res)
            }
            return res
        } catch (e) {
            if (spinner) {
                spinner.fail(e)
            }
        }
    }
})

// 一个参数
oneParamProps.forEach((it) => {
    VSelector.prototype[it] = async function(param, silent) {
        const spinner = silent
            ? null
            : utils.log(`visible`, { selectors: this.selectors })
        try {
            const res = await global.page.$eval(
                'body',
                (el, selectors, param, method) => {
                    return $Z.$select(selectors)[method](param)
                },
                this.selectors,
                param,
                it
            )
            if (spinner) {
                spinner.succeed(res)
            }
            return res
        } catch (e) {
            if (spinner) {
                spinner.fail(e)
            }
        }
    }
})
interface VSelector {
    text(): Promise<string>
    html(): Promise<string>
    height(): Promise<number>
    width(): Promise<number>
    val(): Promise<string>
    index(): Promise<number>
    offset(): Promise<{
        top: number
        left: number
        width: number
        heigh: number
    }>
    offsetParent(): Promise<{
        top: number
        left: number
        width: number
        heigh: number
    }>
    position(): Promise<{ top: number; left: number }>
    scrollTop(): Promise<number>

    css(name: string): Promise<string>
    attr(attrname: string): Promise<any>
    prop(name: string): Promise<any>
    data(name: string): Promise<any>
    hasClass(name: string): Promise<boolean>

    filter(selector?: string): VSelector
    parents(selector?: string): VSelector
    parent(selector?: string): VSelector
    children(selector?: string): VSelector
    find(selector: string): VSelector
    eq(index: number): VSelector

    first(): VSelector
    last(): VSelector
}
interface IMouseTrigger {
    (offset?): Promise<any>
    left(offset?): Promise<any>
    middle(offset?): Promise<any>
    right(offset?): Promise<any>
}
interface DomWaitFor {
    text(value: string | symbol, options?: WaitForOptions): Promise<void>
    html(value: string | symbol, options?: WaitForOptions): Promise<void>
    height(value: string | symbol, options?: WaitForOptions): Promise<void>
    width(value: number | symbol, options?: WaitForOptions): Promise<void>
    val(value: string | symbol, options?: WaitForOptions): Promise<void>
    index(value: number | symbol, options?: WaitForOptions): Promise<void>

    visible(value: boolean, options?: WaitForOptions): Promise<void>
    length(value: number, options?: WaitForOptions): Promise<void>

    scrollTop(value: number | symbol, options?: WaitForOptions): Promise<void>

    css(
        name: string | symbol,
        value: string,
        options?: WaitForOptions
    ): Promise<void>
    attr(
        name: string | symbol,
        value: string,
        options?: WaitForOptions
    ): Promise<void>
    prop(
        name: string | symbol,
        value: string,
        options?: WaitForOptions
    ): Promise<void>
    data(
        name: string | symbol,
        value: string,
        options?: WaitForOptions
    ): Promise<void>

    hasClass(name: string, value: boolean): Promise<void>
}

interface DomExpect {
    text(value: string | symbol): Promise<void>
    html(value: string | symbol): Promise<void>
    height(value: string | symbol): Promise<void>
    width(value: number | symbol): Promise<void>
    val(value: string | symbol): Promise<void>
    index(value: number | symbol): Promise<void>

    visible(value: boolean): Promise<void>
    length(value: number): Promise<void>

    scrollTop(value: number | symbol): Promise<void>

    css(name: string | symbol, value: string): Promise<void>
    attr(name: string | symbol, value: string): Promise<void>
    prop(name: string | symbol, value: string): Promise<void>
    data(name: string | symbol, value: string): Promise<void>
    hasClass(name: string | symbol, value: boolean): Promise<void>
}

export interface Offset {
    x?: number
    y?: number
}

export interface PlainObject {
    [key: string]: any
}

export interface WaitForOptions {
    timeout?: number
    delay?: number
}

export interface MouseTrigger {
    (offset?: Offset): Promise<void>
    left(offset?: Offset): Promise<void>
    middle(offset?: Offset): Promise<void>
    right(offset?: Offset): Promise<void>
}

export default VSelector
