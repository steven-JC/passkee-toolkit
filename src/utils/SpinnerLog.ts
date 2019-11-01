import ora from 'ora'

export default class Log {
    protected hide: boolean
    protected text: string
    protected spinner: any
    constructor(text, hide) {
        this.hide = hide
        if (!hide) {
            this.text = text
            this.spinner = ora(text).start()
        }
    }
    public succeed(text = '') {
        if (!this.hide) {
            this.spinner.text = this.spinner.options.text + ' ' + text
            this.spinner.succeed()
        }
    }
    public fail(e?) {
        if (!this.hide) {
            this.spinner.fail()
        }
        if (e) {
            throw e
        }
    }
    public warn(text = '') {
        if (!this.hide) {
            this.spinner.text = this.spinner.options.text + ' ' + text
            this.spinner.warn()
        }
    }
    public info(text = '') {
        if (!this.hide) {
            this.spinner.text = this.spinner.options.text + ' ' + text
            this.spinner.info()
        }
    }
}
