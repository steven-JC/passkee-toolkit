const utils = require('../utils')
const fs = require('fs-extra')
const path = require('path')
const url = require('url')

let mocking = 0
let u = 0
const errors = []
module.exports = async (maps, headers) => {
    mocking++
    u++
    await page.setRequestInterception(true)
    const promises = []
    const paths = Object.keys(maps)

    for (let i = 0; i < paths.length; i++) {
        ;((index) => {
            promises.push(
                // 同时多个waitforrequest 会导致同一个请求同时进入，因此需要控制好handle的次数
                page.waitForRequest(
                    (request) => {
                        const current = url.parse(request.url()).pathname
                        const fileName = maps[current]
                        if (fileName) {
                            const filePath = path.join(
                                utils.mockDataFolder,
                                current,
                                fileName
                            )
                            if (!fs.existsSync(filePath)) {
                                errors.push(
                                    `[passkee]file is not exist: ${filePath}`
                                )
                                maps[current] = 0
                                return true
                            } else {
                                console.log(u, index, 0, request.url())
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
                                                        'application/json;charset=UTF-8',
                                                    'access-control-allow-methods':
                                                        '*',
                                                    'access-control-allow-headers':
                                                        '*'
                                                },
                                                headers
                                            ),
                                            body: fs.readFileSync(filePath, {
                                                encoding: 'utf-8'
                                            })
                                        })
                                        .catch((e) => {
                                            errors.push(e.toString())
                                        })
                                } catch (e) {
                                    errors.push(e.toString())
                                }
                                maps[current] = 0
                                return true
                            }
                        } else {
                            console.log(u, index, 1, request.url())
                            if (maps[current] !== 0) {
                                request.continue()
                            }
                        }
                    },
                    { timeout: 2000 }
                )
            )
        })(i, u)
    }
    await Promise.all(promises)

    mocking--
    if (!mocking) {
        await page.setRequestInterception(false)
    }

    if (errors.length) {
        const message = errors.join(',')
        errors = []
        throw new Error(`[passkee] mock errors: ${message}`)
    }
}
