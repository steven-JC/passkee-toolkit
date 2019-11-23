import utils from '../utils'
import { noParamProps, oneParamProps } from './const'
export default (that, VSelector) => {
    const $ = (selector) => {
        return new VSelector(selector)
    }

    const waitFors = {}

    noParamProps.forEach((item) => {
        waitFors[item] = async (value, options) => {
            const spinner = utils.log(`wait for ${item} to be ${value}`, {
                selectors: that.selectors
            })
            await utils
                .waitFor(async () => {
                    return utils.equat(await $(that.selectors)[item](), value)
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
                    selectors: that.selectors
                }
            )
            await utils
                .waitFor(async () => {
                    return utils.equat(
                        await $(that.selectors)[item](name),
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
                selectors: that.selectors
            })
            await utils
                .waitFor(async () => {
                    return utils.equat(await that[item](true), value)
                }, options)
                .then(() => {
                    spinner.succeed()
                })
                .catch((e) => {
                    spinner.fail(e)
                })
        }
    })
    return waitFors
}
