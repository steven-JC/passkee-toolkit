const utils = require('../utils')
const fs = require('fs-extra')
const path = require('path')
const url = require('url')
const ejs = require('ejs')
const UrlPattern = require('url-pattern')
const { ContentType } = require('../constants')
let mocking = 0
const errors = []
module.exports = async (maps, options) => {
    mocking++
    await page.setRequestInterception(true)
    const promises = []
    const routes = Object.keys(maps)

    options = Object.assign({}, utils.mockOptions, options)

    for (let i = 0; i < routes.length; i++) {
        ;((index) => {
            const route = routes[i]
            promises.push(
                // 同时多个waitforrequest 会导致同一个请求同时进入，因此需要控制好handle的次数
                page.waitForRequest(
                    (request) => {
                        const urlParsed = utils.parseUrl(request.url())
                        console.log(urlParsed)
                        const current = urlParsed.pathname
                        let fileName = maps[current]
                        let params = {}
                        if (!fileName) {
                            const patterns = routes.map(
                                (route) => new UrlPattern(route)
                            )

                            patterns.forEach((pattern, i) => {
                                if ((params = pattern.match(current))) {
                                    fileName = maps[routes[i]]
                                }
                            })
                        }
                        if (fileName) {
                            const filePath = path.join(
                                utils.mockDataFolder,
                                `${fileName}.ejs`
                            )
                            if (!fs.existsSync(filePath)) {
                                errors.push(
                                    `[TestKit] file is not exist: ${filePath}`
                                )
                                maps[current] = 0
                                return true
                            } else {
                                try {
                                    const tpl = fs.readFileSync(filePath, {
                                        encoding: 'utf-8'
                                    })

                                    const res = ejs.render(
                                        tpl,
                                        Object.assign({ params }, urlParsed)
                                    )

                                    console.log(res)
                                    let mockData
                                    try {
                                        mockData = JSON.parse(res)
                                    } catch (e) {
                                        throw new Error(
                                            `[TestKit] ${filePath} is not a valid json file`
                                        )
                                    }

                                    let body
                                    if (typeof mockData.Body === 'object') {
                                        body = JSON.stringify(mockData.Body)
                                    } else {
                                        body = mockData.Body || ''
                                    }
                                    request
                                        .respond({
                                            status: mockData.Status || 200,
                                            headers: Object.assign(
                                                {
                                                    'access-control-allow-origin':
                                                        '*',
                                                    'access-control-allow-credentials':
                                                        'true',
                                                    'Content-Type':
                                                        'application/json',
                                                    'access-control-allow-methods':
                                                        '*',
                                                    'access-control-allow-headers':
                                                        '*'
                                                },
                                                options.headers,
                                                mockData.Headers || {}
                                            ),
                                            body
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
