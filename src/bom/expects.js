const target = require('./target')
const location = require('./location')
const utils = require('../utils')

module.exports = {
    title: async (title, silent) => {
        const spinner = silent ? null : utils.log(`expect title to be ${title}`)
        const titl = await page.title()
        if (title !== titl) {
            !silent && spinner.fail()
        } else {
            !silent && spinner.succeed()
        }
        return true
    },
    target: async (targetUrlSubstr, silent) => {
        const spinner = silent
            ? null
            : utils.log(`expect target exist, ${targetUrlSubstr} `)
        const res = !!(await target.findTarget(targetUrlSubstr, true))
        if (!res) {
            !silent && spinner.fail()
        } else {
            !silent && spinner.succeed()
        }
        return true
    },

    location: async (urlOrPathOrHash, silent) => {
        const spinner = silent
            ? null
            : utils.log(`expect location to be ${urlOrPathOrHash}`)
        const lct = await location()
        const url = utils.parseUrl(urlOrPathOrHash, lct.href)
        const res = utils.compareUrl(url.href, lct.href, silent)
        if (!res) {
            !silent && spinner.fail()
        } else {
            !silent && spinner.succeed()
        }
        return res
    }
}
