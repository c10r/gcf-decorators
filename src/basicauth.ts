const BASIC_PREFIX = 'Basic '

export function basicauth(token: string) {
    return function(_target, _key, descriptor) {
        const originalMethod = descriptor.value
        descriptor.value = function() {
            const req = arguments[0]
            const res = arguments[1]
            const sendUnauthorized = () => res.status(401).json({})

            if (!req.headers || !req.headers.authorization || !req.headers.authorization.startsWith(BASIC_PREFIX)) {
                return sendUnauthorized()
            }

            // Read the ID token from the authorization header
            const idToken = req.headers.authorization.split(BASIC_PREFIX)[1]
            if (idToken !== token) {
                return sendUnauthorized
            }

            const result = originalMethod.apply(this, arguments)
            return result
        }
        return descriptor
    }
}