import $ from '../src'

declare var $Z

export default () => {
    it('mock ejs', () => {
        return new Promise((r, rj) => {
            $.page
                .evaluate(() => {
                    let res
                    $Z.ajax({
                        url: '/api/list/page/1?a=1&b=2',
                        type: 'post',
                        async: false,
                        success(data) {
                            res = data
                        }
                    })
                    return res
                })
                .then((res) => {
                    if (res.params.num === '1' && res.query.b === '2') {
                        r()
                    } else {
                        rj()
                    }
                })
            $.mock({ '/api/list/page/:num': 'ejs' })
        })
    })
    it('mock body null', async () => {
        return new Promise((r, rj) => {
            $.page
                .evaluate(() => {
                    let res
                    $Z.ajax({
                        url: '/api/list?null',
                        type: 'post',
                        async: false,
                        success(data) {
                            res = data
                        }
                    })
                    return res
                })
                .then((res) => {
                    if (!res) {
                        r()
                    } else {
                        rj()
                    }
                })
            $.mock({ '/api/list': 'body-null' })
        })
    })
    it('mock get', async () => {
        $.mock({ '/api/list': '0' })
        const res = await $.page.evaluate(() => {
            let res
            $Z.ajax({
                url: '/api/list?0',
                type: 'post',
                async: false,
                success(data) {
                    console.log(data)
                    res = data
                }
            })
            return res
        })
        console.log(res)
        if (res.code !== 0) {
            throw new Error('Error')
        }

        await $.delay(1000)
    })

    it('mock request blocking test', async () => {
        $.mock({ '/api/list': '0' })
        const res = await $.page.evaluate(() => {
            let res
            $Z.ajax({
                url: 'https://registry.npm.taobao.org/passkee',
                async: false,
                method: 'post',
                success(data) {
                    res = data.id
                }
            })
            $Z.ajax({
                url: '/api/list?1',
                data: res,
                async: false,
                type: 'post',
                success(data) {
                    console.log(data)
                    res = data
                }
            })
            return res
        })
        if (res.code !== 0) {
            throw new Error('[Error] mock request blocking test ')
        }
        await $.delay(1000)
    })

    it('mock list detail', async () => {
        $.mock({ '/api/list': '0', '/api/detail11': 'all' })
        await $.page.evaluate(() => {
            $Z.ajax({
                url: '/api/detail11',
                success(data) {
                    console.log(data)
                }
            })

            $Z.ajax({
                url: '/api/list',
                success(data) {
                    console.log(data)
                }
            })
        })
    })

    it('mock list detail * 3 sync', async () => {
        $.mock({
            '/api/list': '0',
            '/api/detail1': 'all',
            '/api/detail2': 'all',
            '/api/detail3': 'all'
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
                url: '/api/list',
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
