import { basicauth } from './basicauth'
import { cors } from './cors'
import { get } from './get'
import { post } from './post'

export namespace Http {
    cors
    get
    post
}

export namespace Auth {
    basicauth
}