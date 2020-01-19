import utils from '../utils'
import state from '../utils/state'
import { noParamProps, oneParamProps } from './const'
declare const $Z
export default (VSelector) => {
    // 选择器

    // 无参数
    noParamProps.forEach((it) => {
        VSelector.prototype[it] = async function(silent) {
            const spinner = silent
                ? null
                : utils.log(`visible`, { selectors: this.selectors })
            try {
                const res = await state.currentPage.$eval(
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
                const res = await state.currentPage.$eval(
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
}
