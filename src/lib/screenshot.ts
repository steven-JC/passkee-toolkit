import utils from '../utils'
import path from 'path'
import fs from 'fs-extra'
import BlinkDiff from 'blink-diff'

declare const global: any
declare const $Z: any

export default async (selector, name) => {
    const offset = await global.page.evaluate((selector) => {
        return $Z(selector).offset()
    }, selector)

    // todo: 优化错误提示
    if (!offset) {
        throw new Error(
            `[puppeteer-testkit] element not visible or deleted fro document`
        )
    }

    const image = await global.page.screenshot({
        // document坐标
        clip: {
            x: offset.left,
            y: offset.top,
            width: offset.width,
            height: offset.height
        },
        encoding: 'binary' // base64 binary
    })

    if (!fs.existsSync(path.join(utils.screenshotSaveFolder, 'A', name))) {
        saveTo(name, 'A', image)
    } else {
        saveTo(name, 'B', image)
        saveTo(name, 'output', '')
        const res: any = await diff(name)
        if (!res.passed) {
            throw new Error(
                `To much differences between the two screenshots, [${path.join(
                    utils.screenshotSaveFolder,
                    'A',
                    name
                ) +
                    '] & [' +
                    path.join(
                        utils.screenshotSaveFolder,
                        'B',
                        name
                    )}], the differences you can find out in [${path.join(
                    utils.screenshotSaveFolder,
                    'output',
                    name
                )}]`
            )
        }
    }
}

function diff(name) {
    const AImage = path.join(utils.screenshotSaveFolder, 'A', name)
    const BImage = path.join(utils.screenshotSaveFolder, 'B', name)
    const OImage = path.join(utils.screenshotSaveFolder, 'output', name)

    return new Promise((r, rj) => {
        const bdiff = new BlinkDiff({
            imageAPath: AImage,
            imageBPath: BImage,
            thresholdType: BlinkDiff.THRESHOLD_PERCENT,
            threshold: 0.0001,
            imageOutputPath: OImage
        })

        bdiff.run(function(error, result) {
            if (error) {
                rj(error)
            } else {
                r(
                    Object.assign(
                        {
                            passed: bdiff.hasPassed(result.code),
                            oPath: OImage,
                            aPath: AImage,
                            bPath: BImage
                        },
                        result
                    )
                )
            }
        })
    })
}

function saveTo(name, target, image) {
    const folder = path.join(utils.screenshotSaveFolder, target)
    if (!fs.existsSync(folder)) {
        fs.mkdirpSync(folder)
    }
    const paths = name.split('/')
    const fileName = paths.pop()
    const nameFolder = path.join(folder, paths.join('/'))
    if (!fs.existsSync(nameFolder)) {
        fs.mkdirpSync(nameFolder)
    }

    fs.writeFileSync(path.join(nameFolder, fileName), image)
}
