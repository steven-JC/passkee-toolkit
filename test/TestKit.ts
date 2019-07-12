import { TestKit } from '@/typings/TestKit'
const $: TestKit = require('../index')
declare var $Z
export default () => {
    it.only('mock list', async () => {
        $.page.evaluate(() => {
            $Z.ajax({
                url: '/api/list?0',
                type: 'post',
                async: false,
                success(data) {
                    console.log(data)
                }
            })
        })
        await $.mock({ '/api/list': '0.json' })
    })

    it.only('mock list*2', async () => {
        $.mock({ '/api/list': '0.json' })
        await $.page.evaluate(() => {
            let res
            $Z.ajax({
                url: 'https://registry.npm.taobao.org/passkee',
                async: false,
                success(data) {
                    res = data.id
                }
            })
            $Z.ajax({
                url: '/api/list?1',
                data: res,
                type: 'post',
                success(data) {
                    console.log(data)
                }
            })
        })
        await $.delay(1000)
    })

    it.only('mock list detail', async () => {
        $.mock({ '/api/list': '0.json', '/api/detail': 'all.json' })
        await $.page.evaluate(() => {
            $Z.ajax({
                url: '/api/detail',
                success(data) {
                    console.log(data)
                }
            })

            $Z.ajax({
                url: '/api/list?2',
                success(data) {
                    console.log(data)
                }
            })
        })
        await $.delay(1000)
    })

    it.only('mock list detail * 3 sync', async () => {
        $.mock({
            '/api/list': '0.json',
            '/api/detail1': 'all.json',
            '/api/detail2': 'all.json',
            '/api/detail3': 'all.json'
        })
        await $.page.evaluate(() => {
            $Z.ajax({
                url: '/api/detail1',
                success(data) {
                    console.log(data)
                }
            })

            $Z.ajax({
                url: '/api/detail2',
                async: false,
                success(data) {
                    console.log(data)
                }
            })

            $Z.ajax({
                url: '/api/detail3',
                success(data) {
                    console.log(data)
                }
            })

            $Z.ajax({
                url: '/api/list?2',
                success(data) {
                    console.log(data)
                }
            })
        })
        await $.delay(1000)
    })

    it('$(selector)', async () => {
        const el = $('body')
        if (!el.waitFor) {
            throw 'err'
        }
    })

    it(`$('') error`, async () => {
        return new Promise((r, rj) => {
            try {
                $('')
                rj('error')
            } catch (e) {
                r(e.toString())
            }
        })
    })

    it(`$.waitFor.delay`, async () => {
        const t1 = Date.now()
        await $.delay()
        if (Date.now() - t1 < 1000) {
            throw `${Date.now() - t1}`
        }
    })
}
