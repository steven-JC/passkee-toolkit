export default class ExpectError extends Error {
    constructor(message) {
        super(message)
        this.name = 'ExpectError'
    }
}
