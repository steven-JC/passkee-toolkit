import $ from '../src'

export default () => {
    it(`target(...)`, async () => {
        await $.expect.target('registry.npm.taobao.org')
    })

    it(`location`, async () => {
        // await $.expect.location('#/hash?hashparam=3');
        await $.expect.location('/passkee?param=1')
    })
}
