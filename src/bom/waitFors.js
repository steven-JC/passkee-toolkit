const utils = require('../utils')
const location = require('./location')
const qs = require('qs')
const expects = require('./expects')
module.exports = {
    title: async (title, options) => {
        const spinner = utils.log(`wait for title to be ${title}`)
        await utils
            .waitFor(
                async () => {
                    return expects.title(title, true)
                },
                options,
                `waiting for title: ${title} but timeout (#)`
            )
            .then(() => {
                spinner.succeed()
            })
            .catch((e) => {
                spinner.fail(e)
            })
    },
    target: async (targetUrlSubstr, options) => {
        const spinner = utils.log(`wait for target exist, ${targetUrlSubstr}`)
        await utils
            .waitFor(
                async () => {
                    return expects.target(targetUrlSubstr, true)
                },
                options,
                `waiting for target: ${targetUrlSubstr} but timeout (#)`
            )
            .then(() => {
                spinner.succeed()
            })
            .catch((e) => {
                spinner.fail(e)
            })
    },

    location: async (urlOrPathOrHash, options) => {
        const spinner = utils.log(`wait for location to be ${urlOrPathOrHash}`)
        await utils
            .waitFor(
                async () => {
                    return expects.location(urlOrPathOrHash, true)
                },
                options,
                `waiting for url || Path || Hash: ${urlOrPathOrHash},  but timeout (#)`
            )
            .then(() => {
                spinner.succeed()
            })
            .catch((e) => {
                spinner.fail(e)
            })
    },

    request: async (urlOrPath, postData, options) => {
        const spinner = utils.log(`wait for request, ${urlOrPath}`)
        let data
        try {
            await page.waitForRequest((request) => {
                const urlObj = utils.parseUrl(request.url(), request.url())

                const urlFixed = utils.parseUrl(urlOrPath, urlObj.href)

                if (utils.compareUrl(urlFixed.href, urlObj.href, true)) {
                    if (postData) {
                        data = parseDataString(request.postData())

                        const pdata = parseDataString(postData)

                        if (Object.keys(pdata).length) {
                            return Object.keys(pdata).every(
                                (key) =>
                                    pdata[key] === data[key] ||
                                    JSON.stringify(pdata[key].toString()) ===
                                        JSON.stringify(data[key].toString())
                            )
                        } else {
                            return true
                        }
                    } else {
                        return true
                    }
                } else {
                    return false
                }
            }, options || { timeout: 2000 })
            spinner.succeed()
        } catch (e) {
            spinner.fail()
        }
    },

    response: async (urlOrPath, options) => {
        const spinner = utils.log(`wait for response 200, ${urlOrPath}`)
        try {
            await page.waitForResponse((response) => {
                const urlObj = utils.parseUrl(response.url(), response.url())
                const urlFixed = utils.parseUrl(urlOrPath, urlObj.href)
                return (
                    utils.compareUrl(urlFixed.href, urlObj.href, true) &&
                    response.status() === 200
                )
            }, options || { timeout: 2000 })
            spinner.succeed()
        } catch (e) {
            spinner.fail()
        }
    },

    fn: async (cb, options) => {
        const spinner = utils.log(`wait for fn to return true`)
        await utils
            .waitFor(
                async () => {
                    return await cb()
                },
                options,
                `waiting for callback return true but timeout (#)`
            )
            .then(() => {
                spinner.succeed()
            })
            .catch((e) => {
                spinner.fail(e)
            })
    }
}

function parseDataString(data) {
    if (typeof data === 'object') return data
    if (/^[\[\{].*[\]\}]$/.test(data.trim())) return JSON.parse(data)
    if (typeof data === 'string') return qs.parse(data)
}
function stringifyData(data) {
    if (typeof data === 'object') return JSON.stringify(data)
    else return data.toString()
}
