import utils, { IOffset } from '../utils'

import click from '../triggers/click'
import mousedown from '../triggers/mouseDown'
import mouseup from '../triggers/mouseUp'
import mousemove from '../triggers/mouseMove'
const MouseTrigger = {
    click,
    mousedown,
    mouseup,
    mousemove
}

export default (that) => {
    const mouseTriggers = {}

    Object.keys(MouseTrigger).forEach((trigger) => {
        mouseTriggers[trigger] = async (offset) => {
            const spinner = utils.log(`${trigger}`, {
                selectors: that.selectors
            })
            try {
                that.domSelector = await utils.converToDomSelector(
                    utils.assignSelectors(that.selectors, [
                        { type: 'filter', params: [':visible'] },
                        { type: 'eq', params: [0] }
                    ])
                )
                await MouseTrigger[trigger].call(that, that.domSelector, offset)
                spinner.succeed()
            } catch (e) {
                spinner.fail(e)
            }
        }
        if (trigger !== 'mouseMove') {
            ;['left', 'middle', 'right'].forEach((btn) => {
                mouseTriggers[trigger][btn] = async (offset) => {
                    const spinner = utils.log(`${trigger} ${btn}`, {
                        selectors: that.selectors
                    })
                    try {
                        that.domSelector = await utils.converToDomSelector(
                            utils.assignSelectors(that.selectors, [
                                { type: 'filter', params: [':visible'] },
                                { type: 'eq', params: [0] }
                            ])
                        )
                        await MouseTrigger[trigger].call(
                            that,
                            that.domSelector,
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
    return mouseTriggers
}

export interface IMouseTrigger {
    (offset?: IOffset): Promise<any>
    left(offset?: IOffset): Promise<any>
    middle(offset?: IOffset): Promise<any>
    right(offset?: IOffset): Promise<any>
}
