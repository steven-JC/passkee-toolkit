import utils from '../utils'
import { noParamProps, oneParamProps } from './const'
export default (that, VSelector) => {
    const expects = {}
    const $ = (selector) => {
        return new VSelector(selector)
    }
    ;['visible', 'length'].forEach((item) => {
        expects[item] = async (value) => {
            const spinner = utils.log(`expect ${item} to be ${value}`, {
                selectors: that.selectors
            })
            if (!utils.equat(await that[item](true), value)) {
                spinner.fail()
            } else {
                spinner.succeed()
            }
        }
    })

    noParamProps.forEach((item) => {
        expects[item] = async (value) => {
            const spinner = utils.log(`expect ${item} to be ${value}`, {
                selectors: that.selectors
            })
            if (!utils.equat(await $(that.selectors)[item](), value)) {
                spinner.fail()
            } else {
                spinner.succeed()
            }
        }
    })

    oneParamProps.forEach((item) => {
        expects[item] = async (name, value) => {
            const spinner = utils.log(`expect ${item} ${name} to be ${value}`, {
                selectors: that.selectors
            })
            if (!utils.equat(await $(that.selectors)[item](name), value)) {
                spinner.fail()
            } else {
                spinner.succeed()
            }
        }
    })
    return expects
}
