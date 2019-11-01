import 'colors'
import * as path from 'path'
import utils from './utils'
import constants from './constants'
import VSelector from './VSelector'
import expects from './bom/expects'
import waitFors from './bom/waitFors'
import location from './bom/location'
import mock from './mock'

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
TestKit.browser = null
TestKit.setBrowser = async (b) => {
    global.browser = TestKit.browser = b

    await TestKit.setCurrentPage((await global.browser.pages())[0])

    initPage()

    global.browser.on('targetcreated', (target) => {
        ;(async () => {
            await initPage(await target.page())
        })()
    })
}

TestKit.page = null
TestKit.setCurrentPage = async (p) => {
    global.page = TestKit.page = p
}

TestKit.setDebugMode = (yes) => {
    utils.debugMode = yes
}

TestKit.setScreenshotFolder = (folderPath) => {
    utils.screenshotSaveFolder = folderPath
}

TestKit.setMockDataFolder = (folderPath) => {
    utils.mockDataFolder = folderPath
}

TestKit.setMockOptions = (options) => {
    utils.mockOptions = Object.assign({ timeout: 2000, headers: {} }, options)
}

TestKit.mock = (maps, options?) => {
    const spinner = utils.log(`mocking for request`, { mockMaps: maps })
    return mock(maps, options)
        .then(() => {
            spinner.succeed()
        })
        .catch((e) => {
            spinner.fail(e)
        })
}

function initPage(p?) {
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

TestKit.reload = async (opts?) => {
    const spinner = utils.log(`reload page`)
    try {
        const res = await TestKit.page.reload(opts)
        await global.page.waitForFunction('window.$Z')
        spinner.succeed()
        return res
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
        setTimeout(() => {
            r()
        }, ms || 1000)
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

export default TestKit
