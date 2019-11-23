import utils from '../utils'

import state from '../utils/state'

export default {
    async findTarget(urlSubstr, silent?) {
        const spinner = silent ? null : utils.log(`find target ${urlSubstr}`)

        const targets = await state.currentBrowser.targets()
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
