import utils from '../utils'
declare const global: any
export default async () => {
    const href = await global.page.evaluate(() => {
        return location.href
    })
    return utils.parseUrl(href, href)
}
