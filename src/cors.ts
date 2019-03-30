import corswrapper = require('cors')

export function cors(origin: string) {
    return function(_target, _key, descriptor) {
        const originalMethod = descriptor.value
        descriptor.value = function() {
            const req = arguments[0]
            const res = arguments[1]

            const customCors = corswrapper({ origin })
            const result = customCors(req, res, async () => originalMethod.apply(this, arguments))
            return result
        }

        return descriptor
    }
}