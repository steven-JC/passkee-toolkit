const ora = require('ora')

let debug = false

class Log {
    constructor(text, hide) {
        this.hide = hide
        if (!hide) {
            this.text = text
            this.spinner = ora(text).start()
        }
    }
    succeed(text = '') {
        if (!this.hide) {
            this.spinner.text = this.spinner.options.text + ' ' + text
            this.spinner.succeed()
        }
    }
    fail(e) {
        if (!this.hide) {
            this.spinner.fail()
            if (e) {
                throw e
            }
        }
    }
    warn(text = '') {
        if (!this.hide) {
            this.spinner.text = this.spinner.options.text + ' ' + text
            this.spinner.warn()
        }
    }
    info(text = '') {
        if (!this.hide) {
            this.spinner.text = this.spinner.options.text + ' ' + text
            this.spinner.info()
        }
    }
}

module.exports = Log
