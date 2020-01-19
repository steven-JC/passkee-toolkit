import utils from '../utils'
import state from '../utils/state'

export default async (): Promise<LocationObject> => {
    const href = await state.currentPage.evaluate(() => {
        return location.href
    })
    return utils.parseUrl(href, href)
}
export interface LocationObject {
    protocol: string | null
    host: string | null
    port: number | null
    hostname: string
    hash: string | null
    search: { [key: string]: string }
    query: string | null
    pathname: string | null
    path: string | null
    href: string | null
    hashQuery: { [key: string]: string }
}
