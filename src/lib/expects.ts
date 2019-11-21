import target from './target'
import location from './location'
import utils from '../utils'
declare const global: any

export default {
    title: async (title, silent?) => {
        const spinner: any = silent
            ? null
            : utils.log(`expect title to be ${title}`)
        const titl = await global.page.title()
        if (title !== titl) {
            if (!silent) {
                spinner.fail()
            }
        } else {
            if (!silent) {
                spinner.succeed()
            }
        }
        return true
    },
    target: async (targetUrlSubstr, silent?) => {
        const spinner: any = silent
            ? null
            : utils.log(`expect target exist, ${targetUrlSubstr} `)
        const res = !!(await target.findTarget(targetUrlSubstr, true))
        if (!res) {
            if (!silent) {
                spinner.fail()
            }
        } else {
            if (!silent) {
                spinner.succeed()
            }
        }
        return true
    },

    location: async (urlOrPathOrHash, silent?) => {
        const spinner: any = silent
            ? null
            : utils.log(`expect location to be ${urlOrPathOrHash}`)
        const lct = await location()
        const url = utils.parseUrl(urlOrPathOrHash, lct.href)
        const res = utils.compareUrl(url.href, lct.href, silent)
        if (!res) {
            if (!silent) {
                spinner.fail()
            }
        } else {
            if (!silent) {
                spinner.succeed()
            }
        }
        return res
    }
}
