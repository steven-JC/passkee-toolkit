import 'colors'
import * as path from 'path'
import utils, { compareConst } from './utils'
import config, { IConfigParams } from './utils/config'
import VSelector from './VSelector'
import expects from './lib/expects'
import waitFors from './lib/waitFors'
import location from './lib/location'
import mock from './lib/mock'
import { Page, Browser, NavigationOptions } from 'puppeteer'
import state from './utils/state'

function TestKit(selector) {
    if (!selector) {
        throw new Error('[TestKit] selector is required')
    }
    return new VSelector(selector)
}

Object.defineProperties(TestKit, {
    browser: {
        get(): Browser {
            return state.currentBrowser
        }
    },
    page: {
        get(): Page {
            return state.currentPage
        }
    }
})

// tslint:disable-next-line:no-namespace
namespace TestKit {
    export let browser: Browser
    export let page: Page
}

TestKit.constants = compareConst

TestKit.setBrowser = async (b: Browser) => {
    state.currentBrowser = b

    await TestKit.setCurrentPage((await state.currentBrowser.pages())[0])

    initPage()

    state.currentBrowser.on('targetcreated', (target) => {
        ;(async () => {
            await initPage(await target.page())
        })()
    })
}

TestKit.setCurrentPage = async (p: Page) => {
    state.currentPage = p
}

TestKit.config = (cfg: IConfigParams) => {
    config.setConfig(cfg)
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
    ;(p ? p : state.currentPage).on('console', (msg) => {
        const jsh = msg.args()
        for (const x of jsh) {
            const text = x.toString().replace(/JSHandle\:/g, '')
            if (text.indexOf('[test]') === 0) {
                console.log(` ${text.replace(/\[test\]/g, '')} `.bgYellow)
            }
        }
    })
    ;(p ? p : state.currentPage).on('load', async (response) => {
        await state.currentPage.addScriptTag({
            path: path.join(__dirname, '../browser/$Z.js')
        })
    })
}

TestKit.reload = async (opts?: NavigationOptions) => {
    const spinner = utils.log(`reload page`)
    try {
        await state.currentPage.reload(opts)
        await state.currentPage.waitForFunction('window.$Z')
        spinner.succeed()
    } catch (e) {
        spinner.fail(e)
    }
}

TestKit.title = async () => {
    const spinner = utils.log(`get page title`)
    const res = await state.currentPage.title()
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

export default TestKit
