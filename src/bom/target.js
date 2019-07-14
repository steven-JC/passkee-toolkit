const utils = require('../utils')
module.exports = {
    async findTarget(urlSubstr, silent) {
        const spinner = silent ? null : utils.log(`find target ${urlSubstr}`)

        const targets = await browser.targets()
        const res = targets.find(
            (it) => (it.url() || '').indexOf(urlSubstr) > -1
        )
        if (res) {
            !silent && spinner.succeed('success')
        } else {
            !silent && spinner.fail('error')
        }
        return res
    },
    async closeTarget(urlSubstr, silent) {
        const spinner = silent ? null : utils.log(`close target ${urlSubstr}`)
        const target = await this.findTarget(urlSubstr)
        if (target) {
            try {
                await (await target.page()).close()
                !silent && spinner.succeed('success')
            } catch (e) {
                !silent && spinner.fail('error')
            }
        } else {
            !silent && spinner.fail('error')
        }
    }
}
