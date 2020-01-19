import path from 'path'

export default new (class Config {
    public debugMode: boolean = false
    public screenshotFolder: string = path.join(process.cwd(), 'screenshot')
    public mockDataFolder: string = path.join(process.cwd(), 'mock')
    public mockOptions: {
        timeout: number
        headers: { [key: string]: string }
    }
    public setConfig(config: IConfigParams) {
        if (config.mockOptions) {
            Object.assign(this.mockOptions, config.mockOptions)
        }
        this.debugMode =
            typeof config.debugMode === 'undefined'
                ? this.debugMode
                : config.debugMode
        this.screenshotFolder = config.screenshotFolder || this.screenshotFolder
        this.mockDataFolder = config.mockDataFolder || this.mockDataFolder
    }
})()

export interface IConfigParams {
    debugMode?: boolean
    screenshotFolder?: string
    mockDataFolder?: string
    mockOptions?: {
        timeout: number
        headers: { [key: string]: string }
    }
}
// export default {
//     mousePos: { x: 0, y: 0 },
//     lastPos: { x: 0, y: 0 }
// }
