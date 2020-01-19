import { Page, Browser } from 'puppeteer'
import Eventemitter3 from 'eventemitter3'
export default new (class State extends Eventemitter3 {
    public lastMousePosition: { x: number; y: number } = { x: 0, y: 0 }
    protected currentPag: Page
    protected currentBrows: Browser
    constructor() {
        super()
    }
    public get currentPage(): Page {
        return this.currentPag
    }
    public set currentPage(page: Page) {
        this.currentPag = page
        this.emit('currentPage.change', page)
    }

    public get currentBrowser(): Browser {
        return this.currentBrows
    }
    public set currentBrowser(browser: Browser) {
        this.currentBrows = browser
        this.emit('currentBrowser.change', browser)
    }
})()
