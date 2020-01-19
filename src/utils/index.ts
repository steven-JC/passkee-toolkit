import ExpectError from './ExpectError'
import TimeoutError from './TimeoutError'
import qs from 'qs'
import * as url from 'url'
import SpinnerLog from './SpinnerLog'
import config from './config'

export const compareConst = {
    UNDEFINED: 'UNDEFINED',
    NULL: 'NULL',
    EMPTY: 'EMPTY', // 空串
    NOT_EMPTY: 'NOT_EMPTY'
}

import state from '../utils/state'
declare const $Z: any

const utils = {
    log(text, options?): SpinnerLog {
        for (const x in options) {
            if (options.hasOwnProperty(x)) {
                let str
                switch (x) {
                    case 'selectors':
                        str = options[x]
                            .map(
                                (item) =>
                                    `${item.type}(${item.params
                                        .map((item) => item.toString())
                                        .join(',')})`
                            )
                            .join('.')
                        text = `${str} ${text} `
                        break
                    case 'mockMaps':
                        str = Object.keys(options[x])
                            .map((item) => `${item}:${options[x][item]}`)
                            .join(',')
                        text = `${text} ${str}`
                        break
                    default:
                        text = `${text} ${x}`
                        break
                }
            }
        }
        return new SpinnerLog(text, !config.debugMode)
    },
    compareUrl: (urlOrPathOrHash, basetUrl, silent) => {
        const base: any = utils.parseUrl(basetUrl, basetUrl)
        const urlObj: any = utils.parseUrl(urlOrPathOrHash, basetUrl)
        if (urlObj.protocol !== base.protocol) {
            if (!silent) {
                throw new Error(
                    `expected protocol ${urlObj.protocol}, but found ${base.protocol}`
                )
            }
            return false
        }
        if (urlObj.host !== base.host) {
            if (!silent) {
                throw new Error(
                    `expected host ${urlObj.host}, but found ${base.host}`
                )
            }
            return false
        }
        if (urlObj.pathname !== base.pathname) {
            if (!silent) {
                throw new Error(
                    `expected pathname ${urlObj.pathname}, but found ${base.pathname}`
                )
            }
            return false
        }
        const params = urlObj.search
        if (params && Object.keys(params).length) {
            const search = base.search || {}
            if (
                !Object.keys(params).every((key) => search[key] === params[key])
            ) {
                if (!silent) {
                    throw new Error(
                        `expected search map ${JSON.stringify(
                            params
                        )}, but found ${JSON.stringify(search)}`
                    )
                }
                return false
            }
        }
        if (urlObj.hash) {
            if (urlObj.hash !== base.hash) {
                if (!silent) {
                    throw new Error(
                        `expected hash ${urlObj.hash}, but found ${base.hash}`
                    )
                }
                return false
            }
            const hashQuery = urlObj.hashQuery
            if (hashQuery && Object.keys(hashQuery).length) {
                const tHashQuery = base.hashQuery
                if (
                    !Object.keys(hashQuery).every(
                        (key) => tHashQuery[key] === hashQuery[key]
                    )
                ) {
                    if (!silent) {
                        throw new Error(
                            `expected hash query map ${JSON.stringify(
                                hashQuery
                            )}, but found ${JSON.stringify(tHashQuery)}`
                        )
                    }
                    return false
                }
            }
        }

        return true
    },
    parseUrl(uri, contextUrl?) {
        if (contextUrl) {
            const context: any = url.parse(contextUrl)
            if (uri[0] === '#') {
                uri = context.baseUrl + uri
            } else if (!/^[a-z]+?\:?\/\//.test(uri)) {
                uri =
                    context.protocol +
                    '//' +
                    context.host +
                    (uri[0] === '/' ? uri : '/' + uri)
            } else if (/^\/\//.test(uri)) {
                uri = context.protocol + uri
            }
        }

        const urlObj: any = { ...url.parse(uri) }
        if (urlObj.query) {
            urlObj.search = urlObj.query ? qs.parse(urlObj.query) : {}
        } else {
            urlObj.search = {}
        }
        if (urlObj.hash) {
            const hash = urlObj.hash.split('?')
            urlObj.hash = hash[0]
            urlObj.hashQuery = hash[1] ? qs.parse(hash[1]) : {}
        } else {
            urlObj.hashQuery = {}
        }

        urlObj.baseUrl = urlObj.protocol + '//' + urlObj.host + urlObj.pathname

        return urlObj
    },
    defineFreezedProps(context, obj) {
        for (const x in obj) {
            if (obj.hasOwnProperty(x)) {
                Object.defineProperty(context, x, {
                    value: obj[x],
                    configurable: false,
                    writable: false
                })
            }
        }
    },

    async converToDomSelector(selectors) {
        const marks = await state.currentPage.$eval(
            'body',
            (el, selectors) => {
                return $Z.getMarks($Z.$select(selectors))
            },
            selectors
        )
        return marks.map((item) => `[test-ppt-mark="${item}"]`).join(',')
    },
    async converToString(selectors) {
        return selectors.map((item) => `${item.type}(${item.params})`).join('.')
    },
    async waitFor(fotIt, opts?, errorMsg?) {
        opts = Object.assign({ timeout: 1000, delay: 100 }, opts)
        return await new Promise((r, rj) => {
            let time = opts.timeout
            ;(async () => {
                if (await fotIt()) {
                    return r()
                } else {
                    check()
                }
            })()

            function check() {
                setTimeout(async () => {
                    time -= opts.delay
                    if (!(await fotIt())) {
                        if (time > 0) {
                            check()
                        } else {
                            rj(
                                errorMsg
                                    ? new TimeoutError(
                                          errorMsg.replace(
                                              /\(\#\)/g,
                                              `(timeout: ${opts.timeout}, delay: ${opts.delay})`
                                          )
                                      )
                                    : null
                            )
                        }
                    } else {
                        r()
                    }
                }, opts.delay)
            }
        })
    },
    equat(value, target) {
        if (typeof target === undefined) {
            throw new Error('target is required')
        }
        switch (target) {
            case compareConst.UNDEFINED:
                return typeof value === 'undefined'
            case compareConst.NULL:
                return value === null
            case compareConst.EMPTY:
                return (
                    typeof value === 'undefined' &&
                    value === null &&
                    value === ''
                )
            case compareConst.NOT_EMPTY:
                return (
                    typeof value !== 'undefined' &&
                    value !== null &&
                    value !== ''
                )
            default:
                return value === target
        }
    },
    TimeoutError,
    ExpectError,
    assignSelectors(...args) {
        const vselector: any = []

        args.forEach((item) => {
            if (item) {
                item.forEach((itt) => {
                    vselector.push({
                        type: itt.type,
                        params: itt.params
                    })
                })
            }
        })
        return vselector
    },

    apply(func, args, context) {
        switch (args.length) {
            case 0:
                return context ? func.call(context) : func()
            case 1:
                return context ? func.call(context, args[0]) : func(args[0])
            case 2:
                return context
                    ? func.call(context, args[0], args[1])
                    : func(args[0], args[1])
            case 3:
                return context
                    ? func.call(context, args[0], args[1], args[2])
                    : func(args[0], args[1], args[2])
            case 4:
                return context
                    ? func.call(context, args[0], args[1], args[2], args[3])
                    : func(args[0], args[1], args[2], args[3])
            case 5:
                return context
                    ? func.call(
                          context,
                          args[0],
                          args[1],
                          args[2],
                          args[3],
                          args[4]
                      )
                    : func(args[0], args[1], args[2], args[3], args[4])
            default:
                return func.apply(context || this, args)
        }
    }
}
export interface IPlainObject {
    [key: string]: any
}
export interface IOffset {
    x?: number
    y?: number
}

export default utils
