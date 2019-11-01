import utils from '../utils'

declare const global: any

export default {
    async findTarget(urlSubstr, silent?) {
        const spinner = silent ? null : utils.log(`find target ${urlSubstr}`)

        const targets = await global.browser.targets()
        const res = targets.find(
            (it) => (it.url() || '').indexOf(urlSubstr) > -1
        )
        if (res) {
            if (spinner) {
                spinner.succeed('success')
            }
        } else {
            if (spinner) {
                spinner.fail('error')
            }
        }
        return res
    },
    async closeTarget(urlSubstr, silent?) {
        const spinner = silent ? null : utils.log(`close target ${urlSubstr}`)
        const target = await this.findTarget(urlSubstr)
        if (target) {
            try {
                await (await target.page()).close()
                if (spinner) {
                    spinner.succeed('success')
                }
            } catch (e) {
                if (spinner) {
                    spinner.fail('error')
                }
            }
        } else {
            if (spinner) {
                spinner.fail('error')
            }
        }
    }
}
