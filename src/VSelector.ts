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

const mTriggers = {
    click,
    mousedown,
    mouseup,
    mousemove
}

function $(selector) {
    return new VSelector(selector)
}

export default class VSelector {
    public selectors: any = null
    public domSelector: string = ''
    public expect
    public waitFor
    public click: IMouseTrigger
    public mousedown: IMouseTrigger
    public mouseup: IMouseTrigger
    public mousemove: (offset?) => {}
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

        props0.forEach((item) => {
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

        props1.forEach((item) => {
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

        props0.forEach((item) => {
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

        props1.forEach((item) => {
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

        Object.keys(mTriggers).forEach((trigger) => {
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
                    await mTriggers[trigger].call(
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
                            await mTriggers[trigger].call(
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
    async mouse() {}
    async press() {}
    async screenshot() {}
    */
}
// 没参数
const props0 = [
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
const props1 = ['css', 'attr', 'prop', 'data', 'is', 'hasClass']
// 选择器
const selectors = [
    'has',
    'filter',
    'not',
    'parents',
    'parent',
    'children',
    'siblings',
    'prev',
    'next',
    'find',
    'eq',
    'first',
    'last'
]

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
props0.forEach((it) => {
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
props1.forEach((it) => {
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

interface IMouseTrigger {
    (offset?): Promise<any>
    left(offset?): Promise<any>
    middle(offset?): Promise<any>
    right(offset?): Promise<any>
}
