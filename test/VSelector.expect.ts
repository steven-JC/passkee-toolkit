import $ from '../src'

// 没参数
const props0 = [
    'text',
    'html',
    'height',
    'width',
    'offset',
    'offsetParent',
    'val',
    'index',
    'scrollTop',
    'visible',
    'length'
]
// // 有参数
const props1 = {
    css: 'position',
    attr: 'attr',
    prop: 'nodeName',
    data: 'data',
    hasClass: 'for-ppt-test'
}

// 没时间，只好这样简单校验下
export default () => {
    props0
        .filter((item) => ['val'].indexOf(item) === -1)
        .forEach((method) => {
            it(`VSelector.expect.${method}(NOT_EMPTY)`, async () => {
                if (method === 'visible') {
                    console.log($('#for-ppt-test').expect[method])
                }
                await $('#for-ppt-test').expect[method]($.constants.NOT_EMPTY)
            })
        })

    Object.keys(props1).forEach((method) => {
        it(`VSelector.expect.${method}(${props1[method]}, NOT_EMPTY)`, async () => {
            await $('#for-ppt-test').expect[method](
                props1[method],
                $.constants.NOT_EMPTY
            )
        })
    })
}
