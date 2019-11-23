import utils from '../utils'
import fs from 'fs-extra'
import path from 'path'
import ejs from 'ejs'
import UrlPattern from 'url-pattern'
import state from '../utils/state'
import config from '../utils/config'

let mocking = 0
let errors: string[] = []

export default async (maps, options?) => {
    mocking++
    await state.currentPage.setRequestInterception(true)
    const routes = Object.keys(maps)

    options = Object.assign({}, config.mockOptions, options)

    const promises: any[] = routes.map((route) => {
        let handled: boolean = false
        return state.currentPage.waitForRequest(
            (request: any): any => {
                if (!handled) {
                    const urlParsed: any = utils.parseUrl(request.url())
                    const current = urlParsed.pathname
                    let fileName = maps[current]
                    let params = {}
                    if (!fileName) {
                        const pattern = new UrlPattern(route)
                        // tslint:disable-next-line:no-conditional-assignment
                        if ((params = pattern.match(current))) {
                            fileName = maps[route]
                        }
                    }
                    if (fileName) {
                        handled = true
                        const filePath = path.join(
                            config.mockDataFolder,
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
                }
            },
            { timeout: options.timeout || 2000 }
        )
    })

    // for (let i = 0; i < routes.length; i++) {
    //     ;((index) => {
    //         promises.push(
    //             // 同时多个waitforrequest 会导致同一个请求同时进入，因此需要控制好handle的次数

    //         )
    //     })(i)
    // }
    await Promise.all(promises)

    mocking--
    if (!mocking) {
        await state.currentPage.setRequestInterception(false)
    }

    if (errors.length) {
        const message = errors.join(',')
        errors = []
        throw new Error(`[TestKit] mock errors: ${message}`)
    }
}
