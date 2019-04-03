# Decorators for Google Cloud Functions

![](https://img.shields.io/npm/v/gcf-decorators.svg)
![](https://img.shields.io/bundlephobia/minzip/gcf-decorators.svg)

Google Cloud Functions is an amazing product that lowers the threshold to develop and deploy code. However, it's still a little raw and lacks many basic validations. Very quickly, developers find themselves repeating the same set of validations across functions, and to that end, this library is meant to aid in making code DRY and clean, allowing developers to focus on core business logic.

## Method Decorators

The library currently only supports using typescript method decorators, which means functions should be in classes instead of in a single file or declared as functions.

**NOTE: Incorrect**

```typescript
exports function helloHttp = (req, res) => {
  res.send(`Hello World!`);
};
```

**Instead, use classes.**

```typescript
class HelloApi {
  static async helloHttp(req, res) {
    res.send(`Hello World!`);
  }
}
```

### Cors

Google's [recommendation](https://cloud.google.com/functions/docs/writing/http#functions_http_cors-nodejs) for handling CORS can be a bit gnarly, especially if the majority of cloud functions need to be cors enabled. With this library, we simply apply the `@cors` decorator to the methods that are API's:

```typescript
class HelloWorldApi {
  @cors() // substitute you own domains here, default is '*'
  static async helloWorld(req, res) {
    return res.status(200).send('Hello world')
  }
}

// In index.ts, do the following:
export const helloWorldApi = {
  helloWorld: HelloWorldApi.helloWorld,
}
```

### Http Methods

Similarly for HTTP methods, Google's [official recommendation](https://github.com/GoogleCloudPlatform/nodejs-docs-samples/blob/master/functions/http/index.js) is extremely verbose. Instead, with this library, we can automatically enforce the correct HTTP method:

```typescript
class HelloWorldApi {
  @post() // anything other than a GET will automatically return a 404, with empty json
  static async helloWorld(req, res) {
    // Do cool POST things
    return res.status(200).send('Hello world')
  }
}

// In index.ts, do the following:
export const helloWorldApi = {
  helloWorld: HelloWorldApi.helloWorld,
}
```

More powerfully, by coupling this library with [tsc-parsers](https://www.npmjs.com/package/tsc-parsers), we can enforce `POST` and `GET` parameters of even complex types.

```typescript
class HelloWorldApi {
  @post({
    message: StringValidator, // Any non-string auto rejected with 400
    count: IntValidator,      // Any non-integer auto rejected with 400
  })
  static async helloWorld(req, res) {
    // Do cool POST things
    return res.status(200).send('Hello world')
  }
}

// In index.ts, do the following:
export const helloWorldApi = {
  helloWorld: HelloWorldApi.helloWorld,
}
```

### Authorization

Currently, this library only supports Basic Authentication.

```typescript
class HelloWorldApi {
  @basicauth(process.env.SUPER_SECRET_PASSWORD)
  @post() // anything other than a GET will automatically return a 404, with empty json
  static async helloWorld(req, res) {
    // Do cool POST things
    return res.status(200).send('Hello world')
  }
}

// In index.ts, do the following:
export const helloWorldApi = {
  helloWorld: HelloWorldApi.helloWorld,
}
```