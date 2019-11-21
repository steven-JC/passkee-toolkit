import 'colors'
import * as path from 'path'
import utils from './utils'
import constants from './constants'
import VSelector, { PlainObject } from './VSelector'
import expects from './bom/expects'
import waitFors from './bom/waitFors'
import location from './bom/location'
import mock from './mock'
import { Page, Browser, NavigationOptions } from 'puppeteer'
declare const global: any

global.browser = null
global.page = null

utils.screenshotSaveFolder = path.join(process.cwd(), 'screenshot')
utils.mockDataFolder = path.join(process.cwd(), 'mock')

function TestKit(selector) {
    if (!selector) {
        throw new Error('[TestKit] selector is required')
    }
    return new VSelector(selector)
}

TestKit.constants = constants.CompareVars
TestKit.browser
TestKit.page

TestKit.setBrowser = async (b: Browser) => {
    global.browser = TestKit.browser = b

    await TestKit.setCurrentPage((await global.browser.pages())[0])

    initPage()

    global.browser.on('targetcreated', (target) => {
        ;(async () => {
            await initPage(await target.page())
        })()
    })
}

TestKit.setCurrentPage = async (p: Page) => {
    global.page = TestKit.page = p
}

TestKit.setDebugMode = (yes: boolean) => {
    utils.debugMode = yes
}

TestKit.setScreenshotFolder = (folderPath: string) => {
    utils.screenshotSaveFolder = folderPath
}

TestKit.setMockDataFolder = (folderPath: string) => {
    utils.mockDataFolder = folderPath
}

TestKit.setMockOptions = (options: {
    timeout: number
    headers: PlainObject
}) => {
    utils.mockOptions = Object.assign({ timeout: 2000, headers: {} }, options)
}

TestKit.mock = (
    maps: { [path: string]: string },
    options?: { timeout?: number; headers?: { [key: string]: string } }
) => {
    const spinner = utils.log(`mocking for request`, { mockMaps: maps })
    return mock(maps, options)
        .then(() => {
            spinner.succeed()
        })
        .catch((e) => {
            spinner.fail(e)
        })
}

function initPage(p?: Page) {
    // TODO: 可能会比较慢，导致 $Z undifined，需要一个机制去告知用例执行时机
    ;(p ? p : global.page).on('console', (msg) => {
        const jsh = msg.args()
        for (const x of jsh) {
            const text = x.toString().replace(/JSHandle\:/g, '')
            if (text.indexOf('[test]') === 0) {
                console.log(` ${text.replace(/\[test\]/g, '')} `.bgYellow)
            }
        }
    })
    ;(p ? p : global.page).on('load', async (response) => {
        await global.page.addScriptTag({
            path: path.join(__dirname, '../browser/$Z.js')
        })
    })
}

TestKit.reload = async (opts?: NavigationOptions) => {
    const spinner = utils.log(`reload page`)
    try {
        await TestKit.page.reload(opts)
        await global.page.waitForFunction('window.$Z')
        spinner.succeed()
    } catch (e) {
        spinner.fail(e)
    }
}

TestKit.title = async () => {
    const spinner = utils.log(`get page title`)
    const res = await global.page.title()
    if (res) {
        spinner.succeed(res)
    } else {
        spinner.fail()
    }
}

// TestKit.findTarget = utils.findTarget
// TestKit.closeTarget = utils.closeTarget
TestKit.location = location

TestKit.delay = (ms?) => {
    const spinner = utils.log(`delay ${ms || 1000}ms`)
    return new Promise((r, rj) => {
        setTimeout(r, ms || 1000)
    })
        .then(() => {
            spinner.succeed()
        })
        .catch((e) => {
            spinner.fail(e)
        })
}

TestKit.waitFor = waitFors
TestKit.expect = expects

// utils.defineFreezedProps(TestKit, { waitFor: waitFors, expect: expects })

// Object.freeze(TestKit.waitFor)
module TestKit {
    export let browser: Browser
    export let page: Page
}
export default TestKit
