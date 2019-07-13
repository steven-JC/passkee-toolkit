const utils = require('../utils')
const fs = require('fs-extra')
const path = require('path')
const url = require('url')
const { ContentType } = require('../constants')
let mocking = 0
const errors = []
module.exports = async (maps, options) => {
    mocking++
    await page.setRequestInterception(true)
    const promises = []
    const paths = Object.keys(maps)

    options = Object.assign({}, utils.mockOptions, options)

    for (let i = 0; i < paths.length; i++) {
        ;((index) => {
            promises.push(
                // 同时多个waitforrequest 会导致同一个请求同时进入，因此需要控制好handle的次数
                page.waitForRequest(
                    (request) => {
                        const urlParsed = url.parse(request.url())
                        const current = urlParsed.pathname
                        const fileName = maps[current]
                        if (fileName) {
                            const filePath = path.join(
                                utils.mockDataFolder,
                                current,
                                fileName
                            )
                            if (!fs.existsSync(filePath)) {
                                errors.push(
                                    `[TestKit] file is not exist: ${filePath}`
                                )
                                maps[current] = 0
                                return true
                            } else {
                                try {
                                    request
                                        .respond({
                                            status: 200,
                                            headers: Object.assign(
                                                {
                                                    'access-control-allow-origin':
                                                        '*',
                                                    'access-control-allow-credentials':
                                                        'true',
                                                    'Content-Type':
                                                        ContentType[
                                                            fileName
                                                                .split('.')
                                                                .pop()
                                                        ] || 'application/json',
                                                    'access-control-allow-methods':
                                                        '*',
                                                    'access-control-allow-headers':
                                                        '*'
                                                },
                                                options.headers
                                            ),
                                            body: fs.readFileSync(filePath, {
                                                encoding: 'utf-8'
                                            })
                                        })
                                        .catch((e) => {
                                            maps[current] = 0
                                            errors.push(e.toString())
                                        })
                                } catch (e) {
                                    maps[current] = 0
                                    errors.push(e.toString())
                                }
                                maps[current] = 0
                                return true
                            }
                        } else {
                            if (maps[current] !== 0) {
                                request.continue()
                            }
                        }
                    },
                    { timeout: options.timeout || 2000 }
                )
            )
        })(i)
    }
    await Promise.all(promises)

    mocking--
    if (!mocking) {
        await page.setRequestInterception(false)
    }

    if (errors.length) {
        const message = errors.join(',')
        errors = []
        throw new Error(`[TestKit] mock errors: ${message}`)
    }
}
