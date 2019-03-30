import { BaseValidator } from 'tsc-parsers'

export function post(parameters: { [name: string]: BaseValidator } = {}) {
    return function(_target, _key, descriptor) {
        const originalMethod = descriptor.value
        descriptor.value = function() {
            const req = arguments[0]
            const res = arguments[1]

            if (req.method !== 'POST') {
                console.error(`Incorrect http method`)
                return res.status(404).json({})
            }

            // Iterate through each BaseValidator and make sure the given input can be deserialized
            // If not, we return a 400, leaving our actual functions clean and DRY
            for (const param of Object.keys(parameters)) {
                try {
                    req.body[param] = parameters[param].deserialize(req.body[param])
                } catch (error) {
                    return res.status(400).json({
                        success: false,
                        message: 'Invalid parameters provided',
                    })
                }
            }

            const result = originalMethod.apply(this, arguments)
            return result
        }
        return descriptor
    }
}