var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res, err) => function __init() {
  if (err) throw err[0];
  try {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  } catch (e) {
    throw err = [e], e;
  }
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// cypher-executor/node_modules/.pnpm/hono@4.12.10/node_modules/hono/dist/compose.js
var compose;
var init_compose = __esm({
  "cypher-executor/node_modules/.pnpm/hono@4.12.10/node_modules/hono/dist/compose.js"() {
    compose = (middleware, onError, onNotFound) => {
      return (context, next) => {
        let index = -1;
        return dispatch(0);
        async function dispatch(i) {
          if (i <= index) {
            throw new Error("next() called multiple times");
          }
          index = i;
          let res;
          let isError = false;
          let handler;
          if (middleware[i]) {
            handler = middleware[i][0][0];
            context.req.routeIndex = i;
          } else {
            handler = i === middleware.length && next || void 0;
          }
          if (handler) {
            try {
              res = await handler(context, () => dispatch(i + 1));
            } catch (err) {
              if (err instanceof Error && onError) {
                context.error = err;
                res = await onError(err, context);
                isError = true;
              } else {
                throw err;
              }
            }
          } else {
            if (context.finalized === false && onNotFound) {
              res = await onNotFound(context);
            }
          }
          if (res && (context.finalized === false || isError)) {
            context.res = res;
          }
          return context;
        }
      };
    };
  }
});

// cypher-executor/node_modules/.pnpm/hono@4.12.10/node_modules/hono/dist/http-exception.js
var init_http_exception = __esm({
  "cypher-executor/node_modules/.pnpm/hono@4.12.10/node_modules/hono/dist/http-exception.js"() {
  }
});

// cypher-executor/node_modules/.pnpm/hono@4.12.10/node_modules/hono/dist/request/constants.js
var GET_MATCH_RESULT;
var init_constants = __esm({
  "cypher-executor/node_modules/.pnpm/hono@4.12.10/node_modules/hono/dist/request/constants.js"() {
    GET_MATCH_RESULT = /* @__PURE__ */ Symbol();
  }
});

// cypher-executor/node_modules/.pnpm/hono@4.12.10/node_modules/hono/dist/utils/body.js
async function parseFormData(request, options) {
  const formData = await request.formData();
  if (formData) {
    return convertFormDataToBodyData(formData, options);
  }
  return {};
}
function convertFormDataToBodyData(formData, options) {
  const form = /* @__PURE__ */ Object.create(null);
  formData.forEach((value, key) => {
    const shouldParseAllValues = options.all || key.endsWith("[]");
    if (!shouldParseAllValues) {
      form[key] = value;
    } else {
      handleParsingAllValues(form, key, value);
    }
  });
  if (options.dot) {
    Object.entries(form).forEach(([key, value]) => {
      const shouldParseDotValues = key.includes(".");
      if (shouldParseDotValues) {
        handleParsingNestedValues(form, key, value);
        delete form[key];
      }
    });
  }
  return form;
}
var parseBody, handleParsingAllValues, handleParsingNestedValues;
var init_body = __esm({
  "cypher-executor/node_modules/.pnpm/hono@4.12.10/node_modules/hono/dist/utils/body.js"() {
    init_request();
    parseBody = async (request, options = /* @__PURE__ */ Object.create(null)) => {
      const { all = false, dot = false } = options;
      const headers = request instanceof HonoRequest ? request.raw.headers : request.headers;
      const contentType = headers.get("Content-Type");
      if (contentType?.startsWith("multipart/form-data") || contentType?.startsWith("application/x-www-form-urlencoded")) {
        return parseFormData(request, { all, dot });
      }
      return {};
    };
    handleParsingAllValues = (form, key, value) => {
      if (form[key] !== void 0) {
        if (Array.isArray(form[key])) {
          ;
          form[key].push(value);
        } else {
          form[key] = [form[key], value];
        }
      } else {
        if (!key.endsWith("[]")) {
          form[key] = value;
        } else {
          form[key] = [value];
        }
      }
    };
    handleParsingNestedValues = (form, key, value) => {
      if (/(?:^|\.)__proto__\./.test(key)) {
        return;
      }
      let nestedForm = form;
      const keys = key.split(".");
      keys.forEach((key2, index) => {
        if (index === keys.length - 1) {
          nestedForm[key2] = value;
        } else {
          if (!nestedForm[key2] || typeof nestedForm[key2] !== "object" || Array.isArray(nestedForm[key2]) || nestedForm[key2] instanceof File) {
            nestedForm[key2] = /* @__PURE__ */ Object.create(null);
          }
          nestedForm = nestedForm[key2];
        }
      });
    };
  }
});

// cypher-executor/node_modules/.pnpm/hono@4.12.10/node_modules/hono/dist/utils/url.js
var splitPath, splitRoutingPath, extractGroupsFromPath, replaceGroupMarks, patternCache, getPattern, tryDecode, tryDecodeURI, getPath, getPathNoStrict, mergePath, checkOptionalParameter, _decodeURI, _getQueryParam, getQueryParam, getQueryParams, decodeURIComponent_;
var init_url = __esm({
  "cypher-executor/node_modules/.pnpm/hono@4.12.10/node_modules/hono/dist/utils/url.js"() {
    splitPath = (path) => {
      const paths = path.split("/");
      if (paths[0] === "") {
        paths.shift();
      }
      return paths;
    };
    splitRoutingPath = (routePath) => {
      const { groups, path } = extractGroupsFromPath(routePath);
      const paths = splitPath(path);
      return replaceGroupMarks(paths, groups);
    };
    extractGroupsFromPath = (path) => {
      const groups = [];
      path = path.replace(/\{[^}]+\}/g, (match2, index) => {
        const mark = `@${index}`;
        groups.push([mark, match2]);
        return mark;
      });
      return { groups, path };
    };
    replaceGroupMarks = (paths, groups) => {
      for (let i = groups.length - 1; i >= 0; i--) {
        const [mark] = groups[i];
        for (let j = paths.length - 1; j >= 0; j--) {
          if (paths[j].includes(mark)) {
            paths[j] = paths[j].replace(mark, groups[i][1]);
            break;
          }
        }
      }
      return paths;
    };
    patternCache = {};
    getPattern = (label, next) => {
      if (label === "*") {
        return "*";
      }
      const match2 = label.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
      if (match2) {
        const cacheKey = `${label}#${next}`;
        if (!patternCache[cacheKey]) {
          if (match2[2]) {
            patternCache[cacheKey] = next && next[0] !== ":" && next[0] !== "*" ? [cacheKey, match2[1], new RegExp(`^${match2[2]}(?=/${next})`)] : [label, match2[1], new RegExp(`^${match2[2]}$`)];
          } else {
            patternCache[cacheKey] = [label, match2[1], true];
          }
        }
        return patternCache[cacheKey];
      }
      return null;
    };
    tryDecode = (str2, decoder) => {
      try {
        return decoder(str2);
      } catch {
        return str2.replace(/(?:%[0-9A-Fa-f]{2})+/g, (match2) => {
          try {
            return decoder(match2);
          } catch {
            return match2;
          }
        });
      }
    };
    tryDecodeURI = (str2) => tryDecode(str2, decodeURI);
    getPath = (request) => {
      const url = request.url;
      const start = url.indexOf("/", url.indexOf(":") + 4);
      let i = start;
      for (; i < url.length; i++) {
        const charCode = url.charCodeAt(i);
        if (charCode === 37) {
          const queryIndex = url.indexOf("?", i);
          const hashIndex = url.indexOf("#", i);
          const end = queryIndex === -1 ? hashIndex === -1 ? void 0 : hashIndex : hashIndex === -1 ? queryIndex : Math.min(queryIndex, hashIndex);
          const path = url.slice(start, end);
          return tryDecodeURI(path.includes("%25") ? path.replace(/%25/g, "%2525") : path);
        } else if (charCode === 63 || charCode === 35) {
          break;
        }
      }
      return url.slice(start, i);
    };
    getPathNoStrict = (request) => {
      const result = getPath(request);
      return result.length > 1 && result.at(-1) === "/" ? result.slice(0, -1) : result;
    };
    mergePath = (base, sub, ...rest) => {
      if (rest.length) {
        sub = mergePath(sub, ...rest);
      }
      return `${base?.[0] === "/" ? "" : "/"}${base}${sub === "/" ? "" : `${base?.at(-1) === "/" ? "" : "/"}${sub?.[0] === "/" ? sub.slice(1) : sub}`}`;
    };
    checkOptionalParameter = (path) => {
      if (path.charCodeAt(path.length - 1) !== 63 || !path.includes(":")) {
        return null;
      }
      const segments = path.split("/");
      const results = [];
      let basePath = "";
      segments.forEach((segment) => {
        if (segment !== "" && !/\:/.test(segment)) {
          basePath += "/" + segment;
        } else if (/\:/.test(segment)) {
          if (/\?/.test(segment)) {
            if (results.length === 0 && basePath === "") {
              results.push("/");
            } else {
              results.push(basePath);
            }
            const optionalSegment = segment.replace("?", "");
            basePath += "/" + optionalSegment;
            results.push(basePath);
          } else {
            basePath += "/" + segment;
          }
        }
      });
      return results.filter((v, i, a) => a.indexOf(v) === i);
    };
    _decodeURI = (value) => {
      if (!/[%+]/.test(value)) {
        return value;
      }
      if (value.indexOf("+") !== -1) {
        value = value.replace(/\+/g, " ");
      }
      return value.indexOf("%") !== -1 ? tryDecode(value, decodeURIComponent_) : value;
    };
    _getQueryParam = (url, key, multiple) => {
      let encoded;
      if (!multiple && key && !/[%+]/.test(key)) {
        let keyIndex2 = url.indexOf("?", 8);
        if (keyIndex2 === -1) {
          return void 0;
        }
        if (!url.startsWith(key, keyIndex2 + 1)) {
          keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
        }
        while (keyIndex2 !== -1) {
          const trailingKeyCode = url.charCodeAt(keyIndex2 + key.length + 1);
          if (trailingKeyCode === 61) {
            const valueIndex = keyIndex2 + key.length + 2;
            const endIndex = url.indexOf("&", valueIndex);
            return _decodeURI(url.slice(valueIndex, endIndex === -1 ? void 0 : endIndex));
          } else if (trailingKeyCode == 38 || isNaN(trailingKeyCode)) {
            return "";
          }
          keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
        }
        encoded = /[%+]/.test(url);
        if (!encoded) {
          return void 0;
        }
      }
      const results = {};
      encoded ??= /[%+]/.test(url);
      let keyIndex = url.indexOf("?", 8);
      while (keyIndex !== -1) {
        const nextKeyIndex = url.indexOf("&", keyIndex + 1);
        let valueIndex = url.indexOf("=", keyIndex);
        if (valueIndex > nextKeyIndex && nextKeyIndex !== -1) {
          valueIndex = -1;
        }
        let name = url.slice(
          keyIndex + 1,
          valueIndex === -1 ? nextKeyIndex === -1 ? void 0 : nextKeyIndex : valueIndex
        );
        if (encoded) {
          name = _decodeURI(name);
        }
        keyIndex = nextKeyIndex;
        if (name === "") {
          continue;
        }
        let value;
        if (valueIndex === -1) {
          value = "";
        } else {
          value = url.slice(valueIndex + 1, nextKeyIndex === -1 ? void 0 : nextKeyIndex);
          if (encoded) {
            value = _decodeURI(value);
          }
        }
        if (multiple) {
          if (!(results[name] && Array.isArray(results[name]))) {
            results[name] = [];
          }
          ;
          results[name].push(value);
        } else {
          results[name] ??= value;
        }
      }
      return key ? results[key] : results;
    };
    getQueryParam = _getQueryParam;
    getQueryParams = (url, key) => {
      return _getQueryParam(url, key, true);
    };
    decodeURIComponent_ = decodeURIComponent;
  }
});

// cypher-executor/node_modules/.pnpm/hono@4.12.10/node_modules/hono/dist/request.js
var tryDecodeURIComponent, HonoRequest;
var init_request = __esm({
  "cypher-executor/node_modules/.pnpm/hono@4.12.10/node_modules/hono/dist/request.js"() {
    init_http_exception();
    init_constants();
    init_body();
    init_url();
    tryDecodeURIComponent = (str2) => tryDecode(str2, decodeURIComponent_);
    HonoRequest = class {
      /**
       * `.raw` can get the raw Request object.
       *
       * @see {@link https://hono.dev/docs/api/request#raw}
       *
       * @example
       * ```ts
       * // For Cloudflare Workers
       * app.post('/', async (c) => {
       *   const metadata = c.req.raw.cf?.hostMetadata?
       *   ...
       * })
       * ```
       */
      raw;
      #validatedData;
      // Short name of validatedData
      #matchResult;
      routeIndex = 0;
      /**
       * `.path` can get the pathname of the request.
       *
       * @see {@link https://hono.dev/docs/api/request#path}
       *
       * @example
       * ```ts
       * app.get('/about/me', (c) => {
       *   const pathname = c.req.path // `/about/me`
       * })
       * ```
       */
      path;
      bodyCache = {};
      constructor(request, path = "/", matchResult = [[]]) {
        this.raw = request;
        this.path = path;
        this.#matchResult = matchResult;
        this.#validatedData = {};
      }
      param(key) {
        return key ? this.#getDecodedParam(key) : this.#getAllDecodedParams();
      }
      #getDecodedParam(key) {
        const paramKey = this.#matchResult[0][this.routeIndex][1][key];
        const param = this.#getParamValue(paramKey);
        return param && /\%/.test(param) ? tryDecodeURIComponent(param) : param;
      }
      #getAllDecodedParams() {
        const decoded = {};
        const keys = Object.keys(this.#matchResult[0][this.routeIndex][1]);
        for (const key of keys) {
          const value = this.#getParamValue(this.#matchResult[0][this.routeIndex][1][key]);
          if (value !== void 0) {
            decoded[key] = /\%/.test(value) ? tryDecodeURIComponent(value) : value;
          }
        }
        return decoded;
      }
      #getParamValue(paramKey) {
        return this.#matchResult[1] ? this.#matchResult[1][paramKey] : paramKey;
      }
      query(key) {
        return getQueryParam(this.url, key);
      }
      queries(key) {
        return getQueryParams(this.url, key);
      }
      header(name) {
        if (name) {
          return this.raw.headers.get(name) ?? void 0;
        }
        const headerData = {};
        this.raw.headers.forEach((value, key) => {
          headerData[key] = value;
        });
        return headerData;
      }
      async parseBody(options) {
        return parseBody(this, options);
      }
      #cachedBody = (key) => {
        const { bodyCache, raw: raw2 } = this;
        const cachedBody = bodyCache[key];
        if (cachedBody) {
          return cachedBody;
        }
        const anyCachedKey = Object.keys(bodyCache)[0];
        if (anyCachedKey) {
          return bodyCache[anyCachedKey].then((body) => {
            if (anyCachedKey === "json") {
              body = JSON.stringify(body);
            }
            return new Response(body)[key]();
          });
        }
        return bodyCache[key] = raw2[key]();
      };
      /**
       * `.json()` can parse Request body of type `application/json`
       *
       * @see {@link https://hono.dev/docs/api/request#json}
       *
       * @example
       * ```ts
       * app.post('/entry', async (c) => {
       *   const body = await c.req.json()
       * })
       * ```
       */
      json() {
        return this.#cachedBody("text").then((text) => JSON.parse(text));
      }
      /**
       * `.text()` can parse Request body of type `text/plain`
       *
       * @see {@link https://hono.dev/docs/api/request#text}
       *
       * @example
       * ```ts
       * app.post('/entry', async (c) => {
       *   const body = await c.req.text()
       * })
       * ```
       */
      text() {
        return this.#cachedBody("text");
      }
      /**
       * `.arrayBuffer()` parse Request body as an `ArrayBuffer`
       *
       * @see {@link https://hono.dev/docs/api/request#arraybuffer}
       *
       * @example
       * ```ts
       * app.post('/entry', async (c) => {
       *   const body = await c.req.arrayBuffer()
       * })
       * ```
       */
      arrayBuffer() {
        return this.#cachedBody("arrayBuffer");
      }
      /**
       * Parses the request body as a `Blob`.
       * @example
       * ```ts
       * app.post('/entry', async (c) => {
       *   const body = await c.req.blob();
       * });
       * ```
       * @see https://hono.dev/docs/api/request#blob
       */
      blob() {
        return this.#cachedBody("blob");
      }
      /**
       * Parses the request body as `FormData`.
       * @example
       * ```ts
       * app.post('/entry', async (c) => {
       *   const body = await c.req.formData();
       * });
       * ```
       * @see https://hono.dev/docs/api/request#formdata
       */
      formData() {
        return this.#cachedBody("formData");
      }
      /**
       * Adds validated data to the request.
       *
       * @param target - The target of the validation.
       * @param data - The validated data to add.
       */
      addValidatedData(target, data) {
        this.#validatedData[target] = data;
      }
      valid(target) {
        return this.#validatedData[target];
      }
      /**
       * `.url()` can get the request url strings.
       *
       * @see {@link https://hono.dev/docs/api/request#url}
       *
       * @example
       * ```ts
       * app.get('/about/me', (c) => {
       *   const url = c.req.url // `http://localhost:8787/about/me`
       *   ...
       * })
       * ```
       */
      get url() {
        return this.raw.url;
      }
      /**
       * `.method()` can get the method name of the request.
       *
       * @see {@link https://hono.dev/docs/api/request#method}
       *
       * @example
       * ```ts
       * app.get('/about/me', (c) => {
       *   const method = c.req.method // `GET`
       * })
       * ```
       */
      get method() {
        return this.raw.method;
      }
      get [GET_MATCH_RESULT]() {
        return this.#matchResult;
      }
      /**
       * `.matchedRoutes()` can return a matched route in the handler
       *
       * @deprecated
       *
       * Use matchedRoutes helper defined in "hono/route" instead.
       *
       * @see {@link https://hono.dev/docs/api/request#matchedroutes}
       *
       * @example
       * ```ts
       * app.use('*', async function logger(c, next) {
       *   await next()
       *   c.req.matchedRoutes.forEach(({ handler, method, path }, i) => {
       *     const name = handler.name || (handler.length < 2 ? '[handler]' : '[middleware]')
       *     console.log(
       *       method,
       *       ' ',
       *       path,
       *       ' '.repeat(Math.max(10 - path.length, 0)),
       *       name,
       *       i === c.req.routeIndex ? '<- respond from here' : ''
       *     )
       *   })
       * })
       * ```
       */
      get matchedRoutes() {
        return this.#matchResult[0].map(([[, route]]) => route);
      }
      /**
       * `routePath()` can retrieve the path registered within the handler
       *
       * @deprecated
       *
       * Use routePath helper defined in "hono/route" instead.
       *
       * @see {@link https://hono.dev/docs/api/request#routepath}
       *
       * @example
       * ```ts
       * app.get('/posts/:id', (c) => {
       *   return c.json({ path: c.req.routePath })
       * })
       * ```
       */
      get routePath() {
        return this.#matchResult[0].map(([[, route]]) => route)[this.routeIndex].path;
      }
    };
  }
});

// cypher-executor/node_modules/.pnpm/hono@4.12.10/node_modules/hono/dist/utils/html.js
var HtmlEscapedCallbackPhase, raw, resolveCallback;
var init_html = __esm({
  "cypher-executor/node_modules/.pnpm/hono@4.12.10/node_modules/hono/dist/utils/html.js"() {
    HtmlEscapedCallbackPhase = {
      Stringify: 1,
      BeforeStream: 2,
      Stream: 3
    };
    raw = (value, callbacks) => {
      const escapedString = new String(value);
      escapedString.isEscaped = true;
      escapedString.callbacks = callbacks;
      return escapedString;
    };
    resolveCallback = async (str2, phase, preserveCallbacks, context, buffer) => {
      if (typeof str2 === "object" && !(str2 instanceof String)) {
        if (!(str2 instanceof Promise)) {
          str2 = str2.toString();
        }
        if (str2 instanceof Promise) {
          str2 = await str2;
        }
      }
      const callbacks = str2.callbacks;
      if (!callbacks?.length) {
        return Promise.resolve(str2);
      }
      if (buffer) {
        buffer[0] += str2;
      } else {
        buffer = [str2];
      }
      const resStr = Promise.all(callbacks.map((c) => c({ phase, buffer, context }))).then(
        (res) => Promise.all(
          res.filter(Boolean).map((str22) => resolveCallback(str22, phase, false, context, buffer))
        ).then(() => buffer[0])
      );
      if (preserveCallbacks) {
        return raw(await resStr, callbacks);
      } else {
        return resStr;
      }
    };
  }
});

// cypher-executor/node_modules/.pnpm/hono@4.12.10/node_modules/hono/dist/context.js
var TEXT_PLAIN, setDefaultContentType, createResponseInstance, Context;
var init_context = __esm({
  "cypher-executor/node_modules/.pnpm/hono@4.12.10/node_modules/hono/dist/context.js"() {
    init_request();
    init_html();
    TEXT_PLAIN = "text/plain; charset=UTF-8";
    setDefaultContentType = (contentType, headers) => {
      return {
        "Content-Type": contentType,
        ...headers
      };
    };
    createResponseInstance = (body, init) => new Response(body, init);
    Context = class {
      #rawRequest;
      #req;
      /**
       * `.env` can get bindings (environment variables, secrets, KV namespaces, D1 database, R2 bucket etc.) in Cloudflare Workers.
       *
       * @see {@link https://hono.dev/docs/api/context#env}
       *
       * @example
       * ```ts
       * // Environment object for Cloudflare Workers
       * app.get('*', async c => {
       *   const counter = c.env.COUNTER
       * })
       * ```
       */
      env = {};
      #var;
      finalized = false;
      /**
       * `.error` can get the error object from the middleware if the Handler throws an error.
       *
       * @see {@link https://hono.dev/docs/api/context#error}
       *
       * @example
       * ```ts
       * app.use('*', async (c, next) => {
       *   await next()
       *   if (c.error) {
       *     // do something...
       *   }
       * })
       * ```
       */
      error;
      #status;
      #executionCtx;
      #res;
      #layout;
      #renderer;
      #notFoundHandler;
      #preparedHeaders;
      #matchResult;
      #path;
      /**
       * Creates an instance of the Context class.
       *
       * @param req - The Request object.
       * @param options - Optional configuration options for the context.
       */
      constructor(req, options) {
        this.#rawRequest = req;
        if (options) {
          this.#executionCtx = options.executionCtx;
          this.env = options.env;
          this.#notFoundHandler = options.notFoundHandler;
          this.#path = options.path;
          this.#matchResult = options.matchResult;
        }
      }
      /**
       * `.req` is the instance of {@link HonoRequest}.
       */
      get req() {
        this.#req ??= new HonoRequest(this.#rawRequest, this.#path, this.#matchResult);
        return this.#req;
      }
      /**
       * @see {@link https://hono.dev/docs/api/context#event}
       * The FetchEvent associated with the current request.
       *
       * @throws Will throw an error if the context does not have a FetchEvent.
       */
      get event() {
        if (this.#executionCtx && "respondWith" in this.#executionCtx) {
          return this.#executionCtx;
        } else {
          throw Error("This context has no FetchEvent");
        }
      }
      /**
       * @see {@link https://hono.dev/docs/api/context#executionctx}
       * The ExecutionContext associated with the current request.
       *
       * @throws Will throw an error if the context does not have an ExecutionContext.
       */
      get executionCtx() {
        if (this.#executionCtx) {
          return this.#executionCtx;
        } else {
          throw Error("This context has no ExecutionContext");
        }
      }
      /**
       * @see {@link https://hono.dev/docs/api/context#res}
       * The Response object for the current request.
       */
      get res() {
        return this.#res ||= createResponseInstance(null, {
          headers: this.#preparedHeaders ??= new Headers()
        });
      }
      /**
       * Sets the Response object for the current request.
       *
       * @param _res - The Response object to set.
       */
      set res(_res) {
        if (this.#res && _res) {
          _res = createResponseInstance(_res.body, _res);
          for (const [k, v] of this.#res.headers.entries()) {
            if (k === "content-type") {
              continue;
            }
            if (k === "set-cookie") {
              const cookies = this.#res.headers.getSetCookie();
              _res.headers.delete("set-cookie");
              for (const cookie of cookies) {
                _res.headers.append("set-cookie", cookie);
              }
            } else {
              _res.headers.set(k, v);
            }
          }
        }
        this.#res = _res;
        this.finalized = true;
      }
      /**
       * `.render()` can create a response within a layout.
       *
       * @see {@link https://hono.dev/docs/api/context#render-setrenderer}
       *
       * @example
       * ```ts
       * app.get('/', (c) => {
       *   return c.render('Hello!')
       * })
       * ```
       */
      render = (...args) => {
        this.#renderer ??= (content) => this.html(content);
        return this.#renderer(...args);
      };
      /**
       * Sets the layout for the response.
       *
       * @param layout - The layout to set.
       * @returns The layout function.
       */
      setLayout = (layout) => this.#layout = layout;
      /**
       * Gets the current layout for the response.
       *
       * @returns The current layout function.
       */
      getLayout = () => this.#layout;
      /**
       * `.setRenderer()` can set the layout in the custom middleware.
       *
       * @see {@link https://hono.dev/docs/api/context#render-setrenderer}
       *
       * @example
       * ```tsx
       * app.use('*', async (c, next) => {
       *   c.setRenderer((content) => {
       *     return c.html(
       *       <html>
       *         <body>
       *           <p>{content}</p>
       *         </body>
       *       </html>
       *     )
       *   })
       *   await next()
       * })
       * ```
       */
      setRenderer = (renderer) => {
        this.#renderer = renderer;
      };
      /**
       * `.header()` can set headers.
       *
       * @see {@link https://hono.dev/docs/api/context#header}
       *
       * @example
       * ```ts
       * app.get('/welcome', (c) => {
       *   // Set headers
       *   c.header('X-Message', 'Hello!')
       *   c.header('Content-Type', 'text/plain')
       *
       *   return c.body('Thank you for coming')
       * })
       * ```
       */
      header = (name, value, options) => {
        if (this.finalized) {
          this.#res = createResponseInstance(this.#res.body, this.#res);
        }
        const headers = this.#res ? this.#res.headers : this.#preparedHeaders ??= new Headers();
        if (value === void 0) {
          headers.delete(name);
        } else if (options?.append) {
          headers.append(name, value);
        } else {
          headers.set(name, value);
        }
      };
      status = (status) => {
        this.#status = status;
      };
      /**
       * `.set()` can set the value specified by the key.
       *
       * @see {@link https://hono.dev/docs/api/context#set-get}
       *
       * @example
       * ```ts
       * app.use('*', async (c, next) => {
       *   c.set('message', 'Hono is hot!!')
       *   await next()
       * })
       * ```
       */
      set = (key, value) => {
        this.#var ??= /* @__PURE__ */ new Map();
        this.#var.set(key, value);
      };
      /**
       * `.get()` can use the value specified by the key.
       *
       * @see {@link https://hono.dev/docs/api/context#set-get}
       *
       * @example
       * ```ts
       * app.get('/', (c) => {
       *   const message = c.get('message')
       *   return c.text(`The message is "${message}"`)
       * })
       * ```
       */
      get = (key) => {
        return this.#var ? this.#var.get(key) : void 0;
      };
      /**
       * `.var` can access the value of a variable.
       *
       * @see {@link https://hono.dev/docs/api/context#var}
       *
       * @example
       * ```ts
       * const result = c.var.client.oneMethod()
       * ```
       */
      // c.var.propName is a read-only
      get var() {
        if (!this.#var) {
          return {};
        }
        return Object.fromEntries(this.#var);
      }
      #newResponse(data, arg, headers) {
        const responseHeaders = this.#res ? new Headers(this.#res.headers) : this.#preparedHeaders ?? new Headers();
        if (typeof arg === "object" && "headers" in arg) {
          const argHeaders = arg.headers instanceof Headers ? arg.headers : new Headers(arg.headers);
          for (const [key, value] of argHeaders) {
            if (key.toLowerCase() === "set-cookie") {
              responseHeaders.append(key, value);
            } else {
              responseHeaders.set(key, value);
            }
          }
        }
        if (headers) {
          for (const [k, v] of Object.entries(headers)) {
            if (typeof v === "string") {
              responseHeaders.set(k, v);
            } else {
              responseHeaders.delete(k);
              for (const v2 of v) {
                responseHeaders.append(k, v2);
              }
            }
          }
        }
        const status = typeof arg === "number" ? arg : arg?.status ?? this.#status;
        return createResponseInstance(data, { status, headers: responseHeaders });
      }
      newResponse = (...args) => this.#newResponse(...args);
      /**
       * `.body()` can return the HTTP response.
       * You can set headers with `.header()` and set HTTP status code with `.status`.
       * This can also be set in `.text()`, `.json()` and so on.
       *
       * @see {@link https://hono.dev/docs/api/context#body}
       *
       * @example
       * ```ts
       * app.get('/welcome', (c) => {
       *   // Set headers
       *   c.header('X-Message', 'Hello!')
       *   c.header('Content-Type', 'text/plain')
       *   // Set HTTP status code
       *   c.status(201)
       *
       *   // Return the response body
       *   return c.body('Thank you for coming')
       * })
       * ```
       */
      body = (data, arg, headers) => this.#newResponse(data, arg, headers);
      /**
       * `.text()` can render text as `Content-Type:text/plain`.
       *
       * @see {@link https://hono.dev/docs/api/context#text}
       *
       * @example
       * ```ts
       * app.get('/say', (c) => {
       *   return c.text('Hello!')
       * })
       * ```
       */
      text = (text, arg, headers) => {
        return !this.#preparedHeaders && !this.#status && !arg && !headers && !this.finalized ? new Response(text) : this.#newResponse(
          text,
          arg,
          setDefaultContentType(TEXT_PLAIN, headers)
        );
      };
      /**
       * `.json()` can render JSON as `Content-Type:application/json`.
       *
       * @see {@link https://hono.dev/docs/api/context#json}
       *
       * @example
       * ```ts
       * app.get('/api', (c) => {
       *   return c.json({ message: 'Hello!' })
       * })
       * ```
       */
      json = (object, arg, headers) => {
        return this.#newResponse(
          JSON.stringify(object),
          arg,
          setDefaultContentType("application/json", headers)
        );
      };
      html = (html, arg, headers) => {
        const res = (html2) => this.#newResponse(html2, arg, setDefaultContentType("text/html; charset=UTF-8", headers));
        return typeof html === "object" ? resolveCallback(html, HtmlEscapedCallbackPhase.Stringify, false, {}).then(res) : res(html);
      };
      /**
       * `.redirect()` can Redirect, default status code is 302.
       *
       * @see {@link https://hono.dev/docs/api/context#redirect}
       *
       * @example
       * ```ts
       * app.get('/redirect', (c) => {
       *   return c.redirect('/')
       * })
       * app.get('/redirect-permanently', (c) => {
       *   return c.redirect('/', 301)
       * })
       * ```
       */
      redirect = (location, status) => {
        const locationString = String(location);
        this.header(
          "Location",
          // Multibyes should be encoded
          // eslint-disable-next-line no-control-regex
          !/[^\x00-\xFF]/.test(locationString) ? locationString : encodeURI(locationString)
        );
        return this.newResponse(null, status ?? 302);
      };
      /**
       * `.notFound()` can return the Not Found Response.
       *
       * @see {@link https://hono.dev/docs/api/context#notfound}
       *
       * @example
       * ```ts
       * app.get('/notfound', (c) => {
       *   return c.notFound()
       * })
       * ```
       */
      notFound = () => {
        this.#notFoundHandler ??= () => createResponseInstance();
        return this.#notFoundHandler(this);
      };
    };
  }
});

// cypher-executor/node_modules/.pnpm/hono@4.12.10/node_modules/hono/dist/router.js
var METHOD_NAME_ALL, METHOD_NAME_ALL_LOWERCASE, METHODS, MESSAGE_MATCHER_IS_ALREADY_BUILT, UnsupportedPathError;
var init_router = __esm({
  "cypher-executor/node_modules/.pnpm/hono@4.12.10/node_modules/hono/dist/router.js"() {
    METHOD_NAME_ALL = "ALL";
    METHOD_NAME_ALL_LOWERCASE = "all";
    METHODS = ["get", "post", "put", "delete", "options", "patch"];
    MESSAGE_MATCHER_IS_ALREADY_BUILT = "Can not add a route since the matcher is already built.";
    UnsupportedPathError = class extends Error {
    };
  }
});

// cypher-executor/node_modules/.pnpm/hono@4.12.10/node_modules/hono/dist/utils/constants.js
var COMPOSED_HANDLER;
var init_constants2 = __esm({
  "cypher-executor/node_modules/.pnpm/hono@4.12.10/node_modules/hono/dist/utils/constants.js"() {
    COMPOSED_HANDLER = "__COMPOSED_HANDLER";
  }
});

// cypher-executor/node_modules/.pnpm/hono@4.12.10/node_modules/hono/dist/hono-base.js
var notFoundHandler, errorHandler, Hono;
var init_hono_base = __esm({
  "cypher-executor/node_modules/.pnpm/hono@4.12.10/node_modules/hono/dist/hono-base.js"() {
    init_compose();
    init_context();
    init_router();
    init_constants2();
    init_url();
    notFoundHandler = (c) => {
      return c.text("404 Not Found", 404);
    };
    errorHandler = (err, c) => {
      if ("getResponse" in err) {
        const res = err.getResponse();
        return c.newResponse(res.body, res);
      }
      console.error(err);
      return c.text("Internal Server Error", 500);
    };
    Hono = class _Hono {
      get;
      post;
      put;
      delete;
      options;
      patch;
      all;
      on;
      use;
      /*
        This class is like an abstract class and does not have a router.
        To use it, inherit the class and implement router in the constructor.
      */
      router;
      getPath;
      // Cannot use `#` because it requires visibility at JavaScript runtime.
      _basePath = "/";
      #path = "/";
      routes = [];
      constructor(options = {}) {
        const allMethods = [...METHODS, METHOD_NAME_ALL_LOWERCASE];
        allMethods.forEach((method) => {
          this[method] = (args1, ...args) => {
            if (typeof args1 === "string") {
              this.#path = args1;
            } else {
              this.#addRoute(method, this.#path, args1);
            }
            args.forEach((handler) => {
              this.#addRoute(method, this.#path, handler);
            });
            return this;
          };
        });
        this.on = (method, path, ...handlers) => {
          for (const p of [path].flat()) {
            this.#path = p;
            for (const m of [method].flat()) {
              handlers.map((handler) => {
                this.#addRoute(m.toUpperCase(), this.#path, handler);
              });
            }
          }
          return this;
        };
        this.use = (arg1, ...handlers) => {
          if (typeof arg1 === "string") {
            this.#path = arg1;
          } else {
            this.#path = "*";
            handlers.unshift(arg1);
          }
          handlers.forEach((handler) => {
            this.#addRoute(METHOD_NAME_ALL, this.#path, handler);
          });
          return this;
        };
        const { strict, ...optionsWithoutStrict } = options;
        Object.assign(this, optionsWithoutStrict);
        this.getPath = strict ?? true ? options.getPath ?? getPath : getPathNoStrict;
      }
      #clone() {
        const clone = new _Hono({
          router: this.router,
          getPath: this.getPath
        });
        clone.errorHandler = this.errorHandler;
        clone.#notFoundHandler = this.#notFoundHandler;
        clone.routes = this.routes;
        return clone;
      }
      #notFoundHandler = notFoundHandler;
      // Cannot use `#` because it requires visibility at JavaScript runtime.
      errorHandler = errorHandler;
      /**
       * `.route()` allows grouping other Hono instance in routes.
       *
       * @see {@link https://hono.dev/docs/api/routing#grouping}
       *
       * @param {string} path - base Path
       * @param {Hono} app - other Hono instance
       * @returns {Hono} routed Hono instance
       *
       * @example
       * ```ts
       * const app = new Hono()
       * const app2 = new Hono()
       *
       * app2.get("/user", (c) => c.text("user"))
       * app.route("/api", app2) // GET /api/user
       * ```
       */
      route(path, app2) {
        const subApp = this.basePath(path);
        app2.routes.map((r) => {
          let handler;
          if (app2.errorHandler === errorHandler) {
            handler = r.handler;
          } else {
            handler = async (c, next) => (await compose([], app2.errorHandler)(c, () => r.handler(c, next))).res;
            handler[COMPOSED_HANDLER] = r.handler;
          }
          subApp.#addRoute(r.method, r.path, handler);
        });
        return this;
      }
      /**
       * `.basePath()` allows base paths to be specified.
       *
       * @see {@link https://hono.dev/docs/api/routing#base-path}
       *
       * @param {string} path - base Path
       * @returns {Hono} changed Hono instance
       *
       * @example
       * ```ts
       * const api = new Hono().basePath('/api')
       * ```
       */
      basePath(path) {
        const subApp = this.#clone();
        subApp._basePath = mergePath(this._basePath, path);
        return subApp;
      }
      /**
       * `.onError()` handles an error and returns a customized Response.
       *
       * @see {@link https://hono.dev/docs/api/hono#error-handling}
       *
       * @param {ErrorHandler} handler - request Handler for error
       * @returns {Hono} changed Hono instance
       *
       * @example
       * ```ts
       * app.onError((err, c) => {
       *   console.error(`${err}`)
       *   return c.text('Custom Error Message', 500)
       * })
       * ```
       */
      onError = (handler) => {
        this.errorHandler = handler;
        return this;
      };
      /**
       * `.notFound()` allows you to customize a Not Found Response.
       *
       * @see {@link https://hono.dev/docs/api/hono#not-found}
       *
       * @param {NotFoundHandler} handler - request handler for not-found
       * @returns {Hono} changed Hono instance
       *
       * @example
       * ```ts
       * app.notFound((c) => {
       *   return c.text('Custom 404 Message', 404)
       * })
       * ```
       */
      notFound = (handler) => {
        this.#notFoundHandler = handler;
        return this;
      };
      /**
       * `.mount()` allows you to mount applications built with other frameworks into your Hono application.
       *
       * @see {@link https://hono.dev/docs/api/hono#mount}
       *
       * @param {string} path - base Path
       * @param {Function} applicationHandler - other Request Handler
       * @param {MountOptions} [options] - options of `.mount()`
       * @returns {Hono} mounted Hono instance
       *
       * @example
       * ```ts
       * import { Router as IttyRouter } from 'itty-router'
       * import { Hono } from 'hono'
       * // Create itty-router application
       * const ittyRouter = IttyRouter()
       * // GET /itty-router/hello
       * ittyRouter.get('/hello', () => new Response('Hello from itty-router'))
       *
       * const app = new Hono()
       * app.mount('/itty-router', ittyRouter.handle)
       * ```
       *
       * @example
       * ```ts
       * const app = new Hono()
       * // Send the request to another application without modification.
       * app.mount('/app', anotherApp, {
       *   replaceRequest: (req) => req,
       * })
       * ```
       */
      mount(path, applicationHandler, options) {
        let replaceRequest;
        let optionHandler;
        if (options) {
          if (typeof options === "function") {
            optionHandler = options;
          } else {
            optionHandler = options.optionHandler;
            if (options.replaceRequest === false) {
              replaceRequest = (request) => request;
            } else {
              replaceRequest = options.replaceRequest;
            }
          }
        }
        const getOptions = optionHandler ? (c) => {
          const options2 = optionHandler(c);
          return Array.isArray(options2) ? options2 : [options2];
        } : (c) => {
          let executionContext = void 0;
          try {
            executionContext = c.executionCtx;
          } catch {
          }
          return [c.env, executionContext];
        };
        replaceRequest ||= (() => {
          const mergedPath = mergePath(this._basePath, path);
          const pathPrefixLength = mergedPath === "/" ? 0 : mergedPath.length;
          return (request) => {
            const url = new URL(request.url);
            url.pathname = url.pathname.slice(pathPrefixLength) || "/";
            return new Request(url, request);
          };
        })();
        const handler = async (c, next) => {
          const res = await applicationHandler(replaceRequest(c.req.raw), ...getOptions(c));
          if (res) {
            return res;
          }
          await next();
        };
        this.#addRoute(METHOD_NAME_ALL, mergePath(path, "*"), handler);
        return this;
      }
      #addRoute(method, path, handler) {
        method = method.toUpperCase();
        path = mergePath(this._basePath, path);
        const r = { basePath: this._basePath, path, method, handler };
        this.router.add(method, path, [handler, r]);
        this.routes.push(r);
      }
      #handleError(err, c) {
        if (err instanceof Error) {
          return this.errorHandler(err, c);
        }
        throw err;
      }
      #dispatch(request, executionCtx, env, method) {
        if (method === "HEAD") {
          return (async () => new Response(null, await this.#dispatch(request, executionCtx, env, "GET")))();
        }
        const path = this.getPath(request, { env });
        const matchResult = this.router.match(method, path);
        const c = new Context(request, {
          path,
          matchResult,
          env,
          executionCtx,
          notFoundHandler: this.#notFoundHandler
        });
        if (matchResult[0].length === 1) {
          let res;
          try {
            res = matchResult[0][0][0][0](c, async () => {
              c.res = await this.#notFoundHandler(c);
            });
          } catch (err) {
            return this.#handleError(err, c);
          }
          return res instanceof Promise ? res.then(
            (resolved) => resolved || (c.finalized ? c.res : this.#notFoundHandler(c))
          ).catch((err) => this.#handleError(err, c)) : res ?? this.#notFoundHandler(c);
        }
        const composed = compose(matchResult[0], this.errorHandler, this.#notFoundHandler);
        return (async () => {
          try {
            const context = await composed(c);
            if (!context.finalized) {
              throw new Error(
                "Context is not finalized. Did you forget to return a Response object or `await next()`?"
              );
            }
            return context.res;
          } catch (err) {
            return this.#handleError(err, c);
          }
        })();
      }
      /**
       * `.fetch()` will be entry point of your app.
       *
       * @see {@link https://hono.dev/docs/api/hono#fetch}
       *
       * @param {Request} request - request Object of request
       * @param {Env} Env - env Object
       * @param {ExecutionContext} - context of execution
       * @returns {Response | Promise<Response>} response of request
       *
       */
      fetch = (request, ...rest) => {
        return this.#dispatch(request, rest[1], rest[0], request.method);
      };
      /**
       * `.request()` is a useful method for testing.
       * You can pass a URL or pathname to send a GET request.
       * app will return a Response object.
       * ```ts
       * test('GET /hello is ok', async () => {
       *   const res = await app.request('/hello')
       *   expect(res.status).toBe(200)
       * })
       * ```
       * @see https://hono.dev/docs/api/hono#request
       */
      request = (input, requestInit, Env, executionCtx) => {
        if (input instanceof Request) {
          return this.fetch(requestInit ? new Request(input, requestInit) : input, Env, executionCtx);
        }
        input = input.toString();
        return this.fetch(
          new Request(
            /^https?:\/\//.test(input) ? input : `http://localhost${mergePath("/", input)}`,
            requestInit
          ),
          Env,
          executionCtx
        );
      };
      /**
       * `.fire()` automatically adds a global fetch event listener.
       * This can be useful for environments that adhere to the Service Worker API, such as non-ES module Cloudflare Workers.
       * @deprecated
       * Use `fire` from `hono/service-worker` instead.
       * ```ts
       * import { Hono } from 'hono'
       * import { fire } from 'hono/service-worker'
       *
       * const app = new Hono()
       * // ...
       * fire(app)
       * ```
       * @see https://hono.dev/docs/api/hono#fire
       * @see https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
       * @see https://developers.cloudflare.com/workers/reference/migrate-to-module-workers/
       */
      fire = () => {
        addEventListener("fetch", (event) => {
          event.respondWith(this.#dispatch(event.request, event, void 0, event.request.method));
        });
      };
    };
  }
});

// cypher-executor/node_modules/.pnpm/hono@4.12.10/node_modules/hono/dist/router/reg-exp-router/matcher.js
function match(method, path) {
  const matchers = this.buildAllMatchers();
  const match2 = ((method2, path2) => {
    const matcher = matchers[method2] || matchers[METHOD_NAME_ALL];
    const staticMatch = matcher[2][path2];
    if (staticMatch) {
      return staticMatch;
    }
    const match3 = path2.match(matcher[0]);
    if (!match3) {
      return [[], emptyParam];
    }
    const index = match3.indexOf("", 1);
    return [matcher[1][index], match3];
  });
  this.match = match2;
  return match2(method, path);
}
var emptyParam;
var init_matcher = __esm({
  "cypher-executor/node_modules/.pnpm/hono@4.12.10/node_modules/hono/dist/router/reg-exp-router/matcher.js"() {
    init_router();
    emptyParam = [];
  }
});

// cypher-executor/node_modules/.pnpm/hono@4.12.10/node_modules/hono/dist/router/reg-exp-router/node.js
function compareKey(a, b) {
  if (a.length === 1) {
    return b.length === 1 ? a < b ? -1 : 1 : -1;
  }
  if (b.length === 1) {
    return 1;
  }
  if (a === ONLY_WILDCARD_REG_EXP_STR || a === TAIL_WILDCARD_REG_EXP_STR) {
    return 1;
  } else if (b === ONLY_WILDCARD_REG_EXP_STR || b === TAIL_WILDCARD_REG_EXP_STR) {
    return -1;
  }
  if (a === LABEL_REG_EXP_STR) {
    return 1;
  } else if (b === LABEL_REG_EXP_STR) {
    return -1;
  }
  return a.length === b.length ? a < b ? -1 : 1 : b.length - a.length;
}
var LABEL_REG_EXP_STR, ONLY_WILDCARD_REG_EXP_STR, TAIL_WILDCARD_REG_EXP_STR, PATH_ERROR, regExpMetaChars, Node;
var init_node = __esm({
  "cypher-executor/node_modules/.pnpm/hono@4.12.10/node_modules/hono/dist/router/reg-exp-router/node.js"() {
    LABEL_REG_EXP_STR = "[^/]+";
    ONLY_WILDCARD_REG_EXP_STR = ".*";
    TAIL_WILDCARD_REG_EXP_STR = "(?:|/.*)";
    PATH_ERROR = /* @__PURE__ */ Symbol();
    regExpMetaChars = new Set(".\\+*[^]$()");
    Node = class _Node {
      #index;
      #varIndex;
      #children = /* @__PURE__ */ Object.create(null);
      insert(tokens, index, paramMap, context, pathErrorCheckOnly) {
        if (tokens.length === 0) {
          if (this.#index !== void 0) {
            throw PATH_ERROR;
          }
          if (pathErrorCheckOnly) {
            return;
          }
          this.#index = index;
          return;
        }
        const [token, ...restTokens] = tokens;
        const pattern = token === "*" ? restTokens.length === 0 ? ["", "", ONLY_WILDCARD_REG_EXP_STR] : ["", "", LABEL_REG_EXP_STR] : token === "/*" ? ["", "", TAIL_WILDCARD_REG_EXP_STR] : token.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
        let node;
        if (pattern) {
          const name = pattern[1];
          let regexpStr = pattern[2] || LABEL_REG_EXP_STR;
          if (name && pattern[2]) {
            if (regexpStr === ".*") {
              throw PATH_ERROR;
            }
            regexpStr = regexpStr.replace(/^\((?!\?:)(?=[^)]+\)$)/, "(?:");
            if (/\((?!\?:)/.test(regexpStr)) {
              throw PATH_ERROR;
            }
          }
          node = this.#children[regexpStr];
          if (!node) {
            if (Object.keys(this.#children).some(
              (k) => k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR
            )) {
              throw PATH_ERROR;
            }
            if (pathErrorCheckOnly) {
              return;
            }
            node = this.#children[regexpStr] = new _Node();
            if (name !== "") {
              node.#varIndex = context.varIndex++;
            }
          }
          if (!pathErrorCheckOnly && name !== "") {
            paramMap.push([name, node.#varIndex]);
          }
        } else {
          node = this.#children[token];
          if (!node) {
            if (Object.keys(this.#children).some(
              (k) => k.length > 1 && k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR
            )) {
              throw PATH_ERROR;
            }
            if (pathErrorCheckOnly) {
              return;
            }
            node = this.#children[token] = new _Node();
          }
        }
        node.insert(restTokens, index, paramMap, context, pathErrorCheckOnly);
      }
      buildRegExpStr() {
        const childKeys = Object.keys(this.#children).sort(compareKey);
        const strList = childKeys.map((k) => {
          const c = this.#children[k];
          return (typeof c.#varIndex === "number" ? `(${k})@${c.#varIndex}` : regExpMetaChars.has(k) ? `\\${k}` : k) + c.buildRegExpStr();
        });
        if (typeof this.#index === "number") {
          strList.unshift(`#${this.#index}`);
        }
        if (strList.length === 0) {
          return "";
        }
        if (strList.length === 1) {
          return strList[0];
        }
        return "(?:" + strList.join("|") + ")";
      }
    };
  }
});

// cypher-executor/node_modules/.pnpm/hono@4.12.10/node_modules/hono/dist/router/reg-exp-router/trie.js
var Trie;
var init_trie = __esm({
  "cypher-executor/node_modules/.pnpm/hono@4.12.10/node_modules/hono/dist/router/reg-exp-router/trie.js"() {
    init_node();
    Trie = class {
      #context = { varIndex: 0 };
      #root = new Node();
      insert(path, index, pathErrorCheckOnly) {
        const paramAssoc = [];
        const groups = [];
        for (let i = 0; ; ) {
          let replaced = false;
          path = path.replace(/\{[^}]+\}/g, (m) => {
            const mark = `@\\${i}`;
            groups[i] = [mark, m];
            i++;
            replaced = true;
            return mark;
          });
          if (!replaced) {
            break;
          }
        }
        const tokens = path.match(/(?::[^\/]+)|(?:\/\*$)|./g) || [];
        for (let i = groups.length - 1; i >= 0; i--) {
          const [mark] = groups[i];
          for (let j = tokens.length - 1; j >= 0; j--) {
            if (tokens[j].indexOf(mark) !== -1) {
              tokens[j] = tokens[j].replace(mark, groups[i][1]);
              break;
            }
          }
        }
        this.#root.insert(tokens, index, paramAssoc, this.#context, pathErrorCheckOnly);
        return paramAssoc;
      }
      buildRegExp() {
        let regexp = this.#root.buildRegExpStr();
        if (regexp === "") {
          return [/^$/, [], []];
        }
        let captureIndex = 0;
        const indexReplacementMap = [];
        const paramReplacementMap = [];
        regexp = regexp.replace(/#(\d+)|@(\d+)|\.\*\$/g, (_, handlerIndex, paramIndex) => {
          if (handlerIndex !== void 0) {
            indexReplacementMap[++captureIndex] = Number(handlerIndex);
            return "$()";
          }
          if (paramIndex !== void 0) {
            paramReplacementMap[Number(paramIndex)] = ++captureIndex;
            return "";
          }
          return "";
        });
        return [new RegExp(`^${regexp}`), indexReplacementMap, paramReplacementMap];
      }
    };
  }
});

// cypher-executor/node_modules/.pnpm/hono@4.12.10/node_modules/hono/dist/router/reg-exp-router/router.js
function buildWildcardRegExp(path) {
  return wildcardRegExpCache[path] ??= new RegExp(
    path === "*" ? "" : `^${path.replace(
      /\/\*$|([.\\+*[^\]$()])/g,
      (_, metaChar) => metaChar ? `\\${metaChar}` : "(?:|/.*)"
    )}$`
  );
}
function clearWildcardRegExpCache() {
  wildcardRegExpCache = /* @__PURE__ */ Object.create(null);
}
function buildMatcherFromPreprocessedRoutes(routes) {
  const trie = new Trie();
  const handlerData = [];
  if (routes.length === 0) {
    return nullMatcher;
  }
  const routesWithStaticPathFlag = routes.map(
    (route) => [!/\*|\/:/.test(route[0]), ...route]
  ).sort(
    ([isStaticA, pathA], [isStaticB, pathB]) => isStaticA ? 1 : isStaticB ? -1 : pathA.length - pathB.length
  );
  const staticMap = /* @__PURE__ */ Object.create(null);
  for (let i = 0, j = -1, len = routesWithStaticPathFlag.length; i < len; i++) {
    const [pathErrorCheckOnly, path, handlers] = routesWithStaticPathFlag[i];
    if (pathErrorCheckOnly) {
      staticMap[path] = [handlers.map(([h]) => [h, /* @__PURE__ */ Object.create(null)]), emptyParam];
    } else {
      j++;
    }
    let paramAssoc;
    try {
      paramAssoc = trie.insert(path, j, pathErrorCheckOnly);
    } catch (e) {
      throw e === PATH_ERROR ? new UnsupportedPathError(path) : e;
    }
    if (pathErrorCheckOnly) {
      continue;
    }
    handlerData[j] = handlers.map(([h, paramCount]) => {
      const paramIndexMap = /* @__PURE__ */ Object.create(null);
      paramCount -= 1;
      for (; paramCount >= 0; paramCount--) {
        const [key, value] = paramAssoc[paramCount];
        paramIndexMap[key] = value;
      }
      return [h, paramIndexMap];
    });
  }
  const [regexp, indexReplacementMap, paramReplacementMap] = trie.buildRegExp();
  for (let i = 0, len = handlerData.length; i < len; i++) {
    for (let j = 0, len2 = handlerData[i].length; j < len2; j++) {
      const map = handlerData[i][j]?.[1];
      if (!map) {
        continue;
      }
      const keys = Object.keys(map);
      for (let k = 0, len3 = keys.length; k < len3; k++) {
        map[keys[k]] = paramReplacementMap[map[keys[k]]];
      }
    }
  }
  const handlerMap = [];
  for (const i in indexReplacementMap) {
    handlerMap[i] = handlerData[indexReplacementMap[i]];
  }
  return [regexp, handlerMap, staticMap];
}
function findMiddleware(middleware, path) {
  if (!middleware) {
    return void 0;
  }
  for (const k of Object.keys(middleware).sort((a, b) => b.length - a.length)) {
    if (buildWildcardRegExp(k).test(path)) {
      return [...middleware[k]];
    }
  }
  return void 0;
}
var nullMatcher, wildcardRegExpCache, RegExpRouter;
var init_router2 = __esm({
  "cypher-executor/node_modules/.pnpm/hono@4.12.10/node_modules/hono/dist/router/reg-exp-router/router.js"() {
    init_router();
    init_url();
    init_matcher();
    init_node();
    init_trie();
    nullMatcher = [/^$/, [], /* @__PURE__ */ Object.create(null)];
    wildcardRegExpCache = /* @__PURE__ */ Object.create(null);
    RegExpRouter = class {
      name = "RegExpRouter";
      #middleware;
      #routes;
      constructor() {
        this.#middleware = { [METHOD_NAME_ALL]: /* @__PURE__ */ Object.create(null) };
        this.#routes = { [METHOD_NAME_ALL]: /* @__PURE__ */ Object.create(null) };
      }
      add(method, path, handler) {
        const middleware = this.#middleware;
        const routes = this.#routes;
        if (!middleware || !routes) {
          throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
        }
        if (!middleware[method]) {
          ;
          [middleware, routes].forEach((handlerMap) => {
            handlerMap[method] = /* @__PURE__ */ Object.create(null);
            Object.keys(handlerMap[METHOD_NAME_ALL]).forEach((p) => {
              handlerMap[method][p] = [...handlerMap[METHOD_NAME_ALL][p]];
            });
          });
        }
        if (path === "/*") {
          path = "*";
        }
        const paramCount = (path.match(/\/:/g) || []).length;
        if (/\*$/.test(path)) {
          const re = buildWildcardRegExp(path);
          if (method === METHOD_NAME_ALL) {
            Object.keys(middleware).forEach((m) => {
              middleware[m][path] ||= findMiddleware(middleware[m], path) || findMiddleware(middleware[METHOD_NAME_ALL], path) || [];
            });
          } else {
            middleware[method][path] ||= findMiddleware(middleware[method], path) || findMiddleware(middleware[METHOD_NAME_ALL], path) || [];
          }
          Object.keys(middleware).forEach((m) => {
            if (method === METHOD_NAME_ALL || method === m) {
              Object.keys(middleware[m]).forEach((p) => {
                re.test(p) && middleware[m][p].push([handler, paramCount]);
              });
            }
          });
          Object.keys(routes).forEach((m) => {
            if (method === METHOD_NAME_ALL || method === m) {
              Object.keys(routes[m]).forEach(
                (p) => re.test(p) && routes[m][p].push([handler, paramCount])
              );
            }
          });
          return;
        }
        const paths = checkOptionalParameter(path) || [path];
        for (let i = 0, len = paths.length; i < len; i++) {
          const path2 = paths[i];
          Object.keys(routes).forEach((m) => {
            if (method === METHOD_NAME_ALL || method === m) {
              routes[m][path2] ||= [
                ...findMiddleware(middleware[m], path2) || findMiddleware(middleware[METHOD_NAME_ALL], path2) || []
              ];
              routes[m][path2].push([handler, paramCount - len + i + 1]);
            }
          });
        }
      }
      match = match;
      buildAllMatchers() {
        const matchers = /* @__PURE__ */ Object.create(null);
        Object.keys(this.#routes).concat(Object.keys(this.#middleware)).forEach((method) => {
          matchers[method] ||= this.#buildMatcher(method);
        });
        this.#middleware = this.#routes = void 0;
        clearWildcardRegExpCache();
        return matchers;
      }
      #buildMatcher(method) {
        const routes = [];
        let hasOwnRoute = method === METHOD_NAME_ALL;
        [this.#middleware, this.#routes].forEach((r) => {
          const ownRoute = r[method] ? Object.keys(r[method]).map((path) => [path, r[method][path]]) : [];
          if (ownRoute.length !== 0) {
            hasOwnRoute ||= true;
            routes.push(...ownRoute);
          } else if (method !== METHOD_NAME_ALL) {
            routes.push(
              ...Object.keys(r[METHOD_NAME_ALL]).map((path) => [path, r[METHOD_NAME_ALL][path]])
            );
          }
        });
        if (!hasOwnRoute) {
          return null;
        } else {
          return buildMatcherFromPreprocessedRoutes(routes);
        }
      }
    };
  }
});

// cypher-executor/node_modules/.pnpm/hono@4.12.10/node_modules/hono/dist/router/reg-exp-router/prepared-router.js
var init_prepared_router = __esm({
  "cypher-executor/node_modules/.pnpm/hono@4.12.10/node_modules/hono/dist/router/reg-exp-router/prepared-router.js"() {
    init_router();
    init_matcher();
    init_router2();
  }
});

// cypher-executor/node_modules/.pnpm/hono@4.12.10/node_modules/hono/dist/router/reg-exp-router/index.js
var init_reg_exp_router = __esm({
  "cypher-executor/node_modules/.pnpm/hono@4.12.10/node_modules/hono/dist/router/reg-exp-router/index.js"() {
    init_router2();
    init_prepared_router();
  }
});

// cypher-executor/node_modules/.pnpm/hono@4.12.10/node_modules/hono/dist/router/smart-router/router.js
var SmartRouter;
var init_router3 = __esm({
  "cypher-executor/node_modules/.pnpm/hono@4.12.10/node_modules/hono/dist/router/smart-router/router.js"() {
    init_router();
    SmartRouter = class {
      name = "SmartRouter";
      #routers = [];
      #routes = [];
      constructor(init) {
        this.#routers = init.routers;
      }
      add(method, path, handler) {
        if (!this.#routes) {
          throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
        }
        this.#routes.push([method, path, handler]);
      }
      match(method, path) {
        if (!this.#routes) {
          throw new Error("Fatal error");
        }
        const routers = this.#routers;
        const routes = this.#routes;
        const len = routers.length;
        let i = 0;
        let res;
        for (; i < len; i++) {
          const router = routers[i];
          try {
            for (let i2 = 0, len2 = routes.length; i2 < len2; i2++) {
              router.add(...routes[i2]);
            }
            res = router.match(method, path);
          } catch (e) {
            if (e instanceof UnsupportedPathError) {
              continue;
            }
            throw e;
          }
          this.match = router.match.bind(router);
          this.#routers = [router];
          this.#routes = void 0;
          break;
        }
        if (i === len) {
          throw new Error("Fatal error");
        }
        this.name = `SmartRouter + ${this.activeRouter.name}`;
        return res;
      }
      get activeRouter() {
        if (this.#routes || this.#routers.length !== 1) {
          throw new Error("No active router has been determined yet.");
        }
        return this.#routers[0];
      }
    };
  }
});

// cypher-executor/node_modules/.pnpm/hono@4.12.10/node_modules/hono/dist/router/smart-router/index.js
var init_smart_router = __esm({
  "cypher-executor/node_modules/.pnpm/hono@4.12.10/node_modules/hono/dist/router/smart-router/index.js"() {
    init_router3();
  }
});

// cypher-executor/node_modules/.pnpm/hono@4.12.10/node_modules/hono/dist/router/trie-router/node.js
var emptyParams, hasChildren, Node2;
var init_node2 = __esm({
  "cypher-executor/node_modules/.pnpm/hono@4.12.10/node_modules/hono/dist/router/trie-router/node.js"() {
    init_router();
    init_url();
    emptyParams = /* @__PURE__ */ Object.create(null);
    hasChildren = (children) => {
      for (const _ in children) {
        return true;
      }
      return false;
    };
    Node2 = class _Node2 {
      #methods;
      #children;
      #patterns;
      #order = 0;
      #params = emptyParams;
      constructor(method, handler, children) {
        this.#children = children || /* @__PURE__ */ Object.create(null);
        this.#methods = [];
        if (method && handler) {
          const m = /* @__PURE__ */ Object.create(null);
          m[method] = { handler, possibleKeys: [], score: 0 };
          this.#methods = [m];
        }
        this.#patterns = [];
      }
      insert(method, path, handler) {
        this.#order = ++this.#order;
        let curNode = this;
        const parts = splitRoutingPath(path);
        const possibleKeys = [];
        for (let i = 0, len = parts.length; i < len; i++) {
          const p = parts[i];
          const nextP = parts[i + 1];
          const pattern = getPattern(p, nextP);
          const key = Array.isArray(pattern) ? pattern[0] : p;
          if (key in curNode.#children) {
            curNode = curNode.#children[key];
            if (pattern) {
              possibleKeys.push(pattern[1]);
            }
            continue;
          }
          curNode.#children[key] = new _Node2();
          if (pattern) {
            curNode.#patterns.push(pattern);
            possibleKeys.push(pattern[1]);
          }
          curNode = curNode.#children[key];
        }
        curNode.#methods.push({
          [method]: {
            handler,
            possibleKeys: possibleKeys.filter((v, i, a) => a.indexOf(v) === i),
            score: this.#order
          }
        });
        return curNode;
      }
      #pushHandlerSets(handlerSets, node, method, nodeParams, params) {
        for (let i = 0, len = node.#methods.length; i < len; i++) {
          const m = node.#methods[i];
          const handlerSet = m[method] || m[METHOD_NAME_ALL];
          const processedSet = {};
          if (handlerSet !== void 0) {
            handlerSet.params = /* @__PURE__ */ Object.create(null);
            handlerSets.push(handlerSet);
            if (nodeParams !== emptyParams || params && params !== emptyParams) {
              for (let i2 = 0, len2 = handlerSet.possibleKeys.length; i2 < len2; i2++) {
                const key = handlerSet.possibleKeys[i2];
                const processed = processedSet[handlerSet.score];
                handlerSet.params[key] = params?.[key] && !processed ? params[key] : nodeParams[key] ?? params?.[key];
                processedSet[handlerSet.score] = true;
              }
            }
          }
        }
      }
      search(method, path) {
        const handlerSets = [];
        this.#params = emptyParams;
        const curNode = this;
        let curNodes = [curNode];
        const parts = splitPath(path);
        const curNodesQueue = [];
        const len = parts.length;
        let partOffsets = null;
        for (let i = 0; i < len; i++) {
          const part = parts[i];
          const isLast = i === len - 1;
          const tempNodes = [];
          for (let j = 0, len2 = curNodes.length; j < len2; j++) {
            const node = curNodes[j];
            const nextNode = node.#children[part];
            if (nextNode) {
              nextNode.#params = node.#params;
              if (isLast) {
                if (nextNode.#children["*"]) {
                  this.#pushHandlerSets(handlerSets, nextNode.#children["*"], method, node.#params);
                }
                this.#pushHandlerSets(handlerSets, nextNode, method, node.#params);
              } else {
                tempNodes.push(nextNode);
              }
            }
            for (let k = 0, len3 = node.#patterns.length; k < len3; k++) {
              const pattern = node.#patterns[k];
              const params = node.#params === emptyParams ? {} : { ...node.#params };
              if (pattern === "*") {
                const astNode = node.#children["*"];
                if (astNode) {
                  this.#pushHandlerSets(handlerSets, astNode, method, node.#params);
                  astNode.#params = params;
                  tempNodes.push(astNode);
                }
                continue;
              }
              const [key, name, matcher] = pattern;
              if (!part && !(matcher instanceof RegExp)) {
                continue;
              }
              const child = node.#children[key];
              if (matcher instanceof RegExp) {
                if (partOffsets === null) {
                  partOffsets = new Array(len);
                  let offset = path[0] === "/" ? 1 : 0;
                  for (let p = 0; p < len; p++) {
                    partOffsets[p] = offset;
                    offset += parts[p].length + 1;
                  }
                }
                const restPathString = path.substring(partOffsets[i]);
                const m = matcher.exec(restPathString);
                if (m) {
                  params[name] = m[0];
                  this.#pushHandlerSets(handlerSets, child, method, node.#params, params);
                  if (hasChildren(child.#children)) {
                    child.#params = params;
                    const componentCount = m[0].match(/\//)?.length ?? 0;
                    const targetCurNodes = curNodesQueue[componentCount] ||= [];
                    targetCurNodes.push(child);
                  }
                  continue;
                }
              }
              if (matcher === true || matcher.test(part)) {
                params[name] = part;
                if (isLast) {
                  this.#pushHandlerSets(handlerSets, child, method, params, node.#params);
                  if (child.#children["*"]) {
                    this.#pushHandlerSets(
                      handlerSets,
                      child.#children["*"],
                      method,
                      params,
                      node.#params
                    );
                  }
                } else {
                  child.#params = params;
                  tempNodes.push(child);
                }
              }
            }
          }
          const shifted = curNodesQueue.shift();
          curNodes = shifted ? tempNodes.concat(shifted) : tempNodes;
        }
        if (handlerSets.length > 1) {
          handlerSets.sort((a, b) => {
            return a.score - b.score;
          });
        }
        return [handlerSets.map(({ handler, params }) => [handler, params])];
      }
    };
  }
});

// cypher-executor/node_modules/.pnpm/hono@4.12.10/node_modules/hono/dist/router/trie-router/router.js
var TrieRouter;
var init_router4 = __esm({
  "cypher-executor/node_modules/.pnpm/hono@4.12.10/node_modules/hono/dist/router/trie-router/router.js"() {
    init_url();
    init_node2();
    TrieRouter = class {
      name = "TrieRouter";
      #node;
      constructor() {
        this.#node = new Node2();
      }
      add(method, path, handler) {
        const results = checkOptionalParameter(path);
        if (results) {
          for (let i = 0, len = results.length; i < len; i++) {
            this.#node.insert(method, results[i], handler);
          }
          return;
        }
        this.#node.insert(method, path, handler);
      }
      match(method, path) {
        return this.#node.search(method, path);
      }
    };
  }
});

// cypher-executor/node_modules/.pnpm/hono@4.12.10/node_modules/hono/dist/router/trie-router/index.js
var init_trie_router = __esm({
  "cypher-executor/node_modules/.pnpm/hono@4.12.10/node_modules/hono/dist/router/trie-router/index.js"() {
    init_router4();
  }
});

// cypher-executor/node_modules/.pnpm/hono@4.12.10/node_modules/hono/dist/hono.js
var Hono2;
var init_hono = __esm({
  "cypher-executor/node_modules/.pnpm/hono@4.12.10/node_modules/hono/dist/hono.js"() {
    init_hono_base();
    init_reg_exp_router();
    init_smart_router();
    init_trie_router();
    Hono2 = class extends Hono {
      /**
       * Creates an instance of the Hono class.
       *
       * @param options - Optional configuration options for the Hono instance.
       */
      constructor(options = {}) {
        super(options);
        this.router = options.router ?? new SmartRouter({
          routers: [new RegExpRouter(), new TrieRouter()]
        });
      }
    };
  }
});

// cypher-executor/node_modules/.pnpm/hono@4.12.10/node_modules/hono/dist/index.js
var init_dist = __esm({
  "cypher-executor/node_modules/.pnpm/hono@4.12.10/node_modules/hono/dist/index.js"() {
    init_hono();
  }
});

// cypher-executor/src/lib/hash.ts
async function deriveRecipeHash(canonicalId) {
  return "rec_" + await sha256Prefix(canonicalId);
}
function isComponentHash(id) {
  return /^cmp_[0-9a-f]{8}$/.test(id);
}
function isRecipeHash(id) {
  return /^rec_[0-9a-f]{8}$/.test(id);
}
async function sha256Prefix(input) {
  const data = new TextEncoder().encode(input);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 8);
}
var init_hash = __esm({
  "cypher-executor/src/lib/hash.ts"() {
    "use strict";
  }
});

// cypher-executor/src/lib/kbdb-caller.ts
function withCaller(headers, caller) {
  return { ...headers, [KBDB_CALLER_HEADER]: caller.slice(0, 120) };
}
function withEssential(headers) {
  return { ...headers, [KBDB_ESSENTIAL_HEADER]: "account" };
}
var KBDB_CALLER_HEADER, KBDB_CALLERS, KBDB_ESSENTIAL_HEADER;
var init_kbdb_caller = __esm({
  "cypher-executor/src/lib/kbdb-caller.ts"() {
    "use strict";
    KBDB_CALLER_HEADER = "X-Arcrun-Caller";
    KBDB_CALLERS = {
      /** kbdb-proxy.ts：CLI（acr kbdb *）透過 cypher 轉發打 KBDB 基本盤。 */
      proxy: "cypher-kbdb-proxy",
      /** kbdb-asset-store.ts：WEBHOOKS／RECIPES／EXEC_CONTEXT 三個名字唯一的讀寫入口（Arcrun#98）。 */
      assetStore: "cypher-asset-store",
      /** recipe-expander.ts 的 kbdb_block fragment：某個 workflow 執行中展開 recipe 時讀的知識片段。 */
      recipeFragment: (workflowId) => workflowId ? `workflow:${workflowId}` : "cypher-recipe-fragment",
      /** webhook-handlers.ts 的 recordRecipeStats：執行結束後回寫 recipe 市場星數（fire-and-forget）。 */
      recipeStats: "cypher-recipe-stats",
      /** execution-logger.ts 的 writeExecutionVerdict：執行結束後寫入 KBDB 執行紀錄（fire-and-forget）。 */
      executionLog: "cypher-execution-log",
      /** lib/telemetry.ts 的 recordTelemetry：agent-telemetry entry（fire-and-forget，inkstone/Arcrun#268）。 */
      telemetry: "cypher-telemetry"
    };
    KBDB_ESSENTIAL_HEADER = "X-Arcrun-Essential";
  }
});

// cypher-executor/src/lib/constants.ts
var VALID_EDGE_TYPES, SEMANTIC_EDGE_MAP, WAIT_MAX_MS, BUILTIN_COMPONENTS;
var init_constants3 = __esm({
  "cypher-executor/src/lib/constants.ts"() {
    "use strict";
    VALID_EDGE_TYPES = /* @__PURE__ */ new Set([
      // 現有
      "PIPE",
      "IF",
      "FOREACH",
      "CONTINUE",
      // 新增：執行語意
      "IS_A",
      "ON_SUCCESS",
      "ON_FAIL",
      // 新增：條件語意（SDD workflow-discovery 3.11）—— 讀上游 if_control/switch 的 branch
      "ON_TRUE",
      "ON_FALSE",
      "ON_BRANCH",
      // 新增：觸發語意
      "ON_CLICK",
      "CALLS_SUBFLOW",
      // 新增：結構語意（記錄圖結構，不執行）
      "CONTAINS",
      "HAS_STYLE",
      "HAS_BEHAVIOR"
    ]);
    SEMANTIC_EDGE_MAP = {
      // 中文語意詞
      "\u5B8C\u6210\u5F8C": "PIPE",
      "\u5931\u6557\u6642": "ON_FAIL",
      "\u5C0D\u6BCF\u500B": "FOREACH",
      "\u689D\u4EF6\u6EFF\u8DB3\u6642": "IF",
      // 條件分支語意（SDD workflow-discovery 3.11）：讓意圖工作流寫得出兩條路
      "\u6210\u7ACB\u6642": "ON_TRUE",
      "\u70BA\u771F\u6642": "ON_TRUE",
      "\u4E0D\u6210\u7ACB\u6642": "ON_FALSE",
      "\u70BA\u5047\u6642": "ON_FALSE",
      "\u5426\u5247": "ON_FALSE",
      // 英文別名
      "SUCCESS": "ON_SUCCESS",
      "FAIL": "ON_FAIL",
      "TRUE": "ON_TRUE",
      "FALSE": "ON_FALSE",
      "ELSE": "ON_FALSE",
      "BRANCH": "ON_BRANCH",
      "CLICK": "ON_CLICK",
      "SUBFLOW": "CALLS_SUBFLOW"
    };
    WAIT_MAX_MS = 3e4;
    BUILTIN_COMPONENTS = /* @__PURE__ */ new Map([
      ["comp_passthrough", (ctx) => ctx],
      ["comp_uppercase", (ctx) => {
        const c = ctx;
        return { ...c, text: String(c.text || "").toUpperCase() };
      }],
      ["comp_counter", (ctx) => {
        const c = ctx;
        return { ...c, count: (Number(c.count) || 0) + 1 };
      }],
      // ── wait：等待 N 毫秒後繼續（Arcrun#101，2026-08-12）────────────────────────
      //
      // 為什麼「等待」搬進引擎，而不是修那顆 WASM：
      //
      // 舊實作是 registry/components/wait/main.go（TinyGo → WASM），用 time.Sleep。
      // TinyGo 的 sleep 走 WASI `poll_oneoff`；而每顆 component worker 的 WASI shim 把
      // poll_oneoff 實作成 ENOSYS（`.component-builds/*/src/index.ts`：`poll_oneoff: () => 76`）
      // ⇒ TinyGo 排程器拿不到「睡到某個時間」的手段，退化成迴圈重讀 `clock_time_get`
      // 自旋等時間到（wasm 內可見 runtime.sleepTicks / sleepQueue / runtime.ticks 符號）。
      //
      // 🔴 到這裡為止是**查得到原始碼的事實**。再往下「所以那個自旋迴圈的結束條件永遠
      //    不成立」曾被當成結論寫在這裡，但**寫了測試去證，反而被打臉**：在
      //    vitest-pool-workers 的 workerd 裡，同步自旋 2553 圈之後 Date.now() 就前進了
      //    ⇒ 時鐘並沒有全程凍結。
      //    ⇒ 「為什麼三秒的等待會拖到 35 秒才死」的完整機制**目前仍是推測**，
      //      證據只有下面 leo 的四次實測。別把它當定論往外傳。
      //
      // 所以症狀不是「等 N 秒花 N 秒 CPU」，而是「不管 ms 填多少都跑到 CPU 上限被砍」。
      // leo 2026-08-12 在 youlin stage 實測（只有 input >> wait 兩個節點）：
      //   ms=3000 → 38.9s 後 503 / ms=20000 → 34.0s / ms=30000 → 34.9s / 寫死 3000 → 34.8s
      // 四個值同一個死法、與 ms 無關 —— 3 秒的等待撐到 35 秒才死，就是「迴圈根本沒結束」
      // 的證據（若成本與時長成正比，ms=3000 只會花 3 秒 CPU，根本不該死）。
      // 也就是說 wait 零件在 Workers 上從來沒有真的等待成功過，不只是貴。
      //
      // 純 WASI 沙箱（stdin→stdout、無 socket、同步呼叫）本來就沒有「不花 CPU 地等」這種
      // 東西 —— 會等的只有宿主。故 wait 與 trigger_workflow 同類：**是 orchestrator 的
      // 執行排程職責，不是業務邏輯**（rule 02 §2.3 明列「workflow 執行排程」屬 cypher-executor
      // 合法職責；§2.2 禁的是解密／簽章／template 展開／具體 API 呼叫，等待都不是）。
      // 搬進引擎不違反「業務邏輯走 WASM」鐵律。引擎這側 await 一個 timer 只花 wall-clock、
      // 不記 CPU ⇒ 等 30 秒與等 3 秒同價（皆 ≈0）。
      //
      // I/O 契約沿用 component.contract.yaml，既有 workflow 的 wait 節點定義不必改：
      //   吃 ms（必填 > 0）＋可選 context；ms > WAIT_MAX_MS 截斷；
      //   回 { success: true, data: { ...context, waited_ms } }；ms <= 0 回 success:false。
      // 唯一刻意的放寬：ms 允許數字字串（"3000"）。WASM 版 json.Unmarshal 進 int 會直接
      // 失敗，但 node.data 走 interpolateData 後 `ms: "{{input.delay}}"` 必然是字串
      // ⇒ 收字串只會把「本來就跑不動的」變成跑得動，不會改變任何既有成功案例的行為。
      ["wait", async (ctx) => {
        const c = ctx && typeof ctx === "object" ? ctx : {};
        const requested = typeof c.ms === "number" ? c.ms : Number(c.ms);
        if (!Number.isFinite(requested) || requested <= 0) {
          return { success: false, error: "ms \u5FC5\u9808\u5927\u65BC 0" };
        }
        const ms = Math.min(Math.floor(requested), WAIT_MAX_MS);
        await new Promise((resolve) => setTimeout(resolve, ms));
        const passthrough = c.context && typeof c.context === "object" && !Array.isArray(c.context) ? c.context : {};
        return { success: true, data: { ...passthrough, waited_ms: ms } };
      }]
    ]);
  }
});

// cypher-executor/src/routes/recipes.ts
function recipeCredentialNames(r) {
  const names = /* @__PURE__ */ new Set();
  for (const c of r.credentials_required ?? []) if (c?.key) names.add(c.key);
  const scan = (v) => {
    if (typeof v === "string") {
      for (const m of v.matchAll(/\{\{credential\.(\w+)\}\}/g)) names.add(m[1]);
    } else if (Array.isArray(v)) {
      v.forEach(scan);
    } else if (v && typeof v === "object") {
      Object.values(v).forEach(scan);
    }
  };
  scan(r.endpoint);
  scan(r.headers);
  scan(r.body);
  scan(r.body_template);
  return [...names];
}
async function recipeAuthSecretNames(r, kv, cache) {
  if (r.auth === "binding") return [];
  const service = r.auth_service || r.canonical_id;
  if (!service) return [];
  let pending = cache?.get(service);
  if (!pending) {
    pending = resolveAuthRecipe(service, kv).catch(() => null);
    cache?.set(service, pending);
  }
  const ar = await pending;
  if (!ar || !DISPATCHABLE_AUTH_PRIMITIVES.has(ar.primitive)) return [];
  return (ar.required_secrets ?? []).filter((s) => s?.key && !s.optional).map((s) => s.key);
}
async function installRecipeRecord(kv, recipe) {
  const uuid = recipe.uuid;
  const { canonical_id, hash_id } = recipe;
  const listRaw = await kv.get(kIdxCanonical(canonical_id));
  const uuids = listRaw ? JSON.parse(listRaw) : [];
  if (!uuids.includes(uuid)) uuids.push(uuid);
  await Promise.all([
    kv.put(`recipe:${uuid}`, JSON.stringify(recipe)),
    kv.put(kIdxCanonical(canonical_id), JSON.stringify(uuids)),
    kv.put(kIdxInstalled(canonical_id), uuid),
    kv.put(`idx:${hash_id}`, canonical_id)
  ]);
}
async function upsertPrivateRecipe(kv, body) {
  const canonicalId = (body.canonical_id ?? "").trim().toLowerCase();
  if (!canonicalId) return { ok: false, error: "canonical_id \u5FC5\u586B" };
  if (!body.endpoint) return { ok: false, error: "endpoint \u5FC5\u586B" };
  const hashId = await deriveRecipeHash(canonicalId);
  const now2 = Date.now();
  const existing = await resolveRecipe(canonicalId, kv);
  const recipe = {
    uuid: existing?.uuid ?? crypto.randomUUID(),
    author: body.author ?? existing?.author ?? "local",
    derived_from: body.derived_from ?? existing?.derived_from,
    canonical_id: canonicalId,
    hash_id: hashId,
    display_name: body.display_name,
    description: body.description,
    endpoint: body.endpoint,
    method: (body.method ?? "POST").toUpperCase(),
    headers: body.headers,
    body: body.body,
    // ③ payload/回應/binding 三層（3.12）：全選填，沒給就是 undefined＝既有行為
    body_template: body.body_template,
    response_map: body.response_map,
    auth: body.auth,
    binding_name: body.binding_name,
    auth_service: body.auth_service,
    credentials_required: body.credentials_required,
    created_at: existing?.created_at ?? now2,
    updated_at: now2
  };
  await installRecipeRecord(kv, recipe);
  return { ok: true, recipe };
}
async function fetchMarketStat(env, canonicalId) {
  try {
    const base = kbdbBaseUrl(env);
    const headers = {};
    if (env.KBDB_INTERNAL_TOKEN) headers["Authorization"] = `Bearer ${env.KBDB_INTERNAL_TOKEN}`;
    const res = await fetch(`${base}/recipe-stats/${encodeURIComponent(canonicalId)}`, { headers });
    if (!res.ok) return null;
    const json = await res.json();
    if (!json.stat) return null;
    return {
      success_count: json.stat.success_count ?? 0,
      failure_count: json.stat.failure_count ?? 0
    };
  } catch {
    return null;
  }
}
async function listAllRecipes(kv) {
  const list = await kv.list({ prefix: "recipe:" });
  const all = (await Promise.all(
    list.keys.map((k) => kv.get(k.name, "json"))
  )).filter(Boolean);
  const hasUuid = new Set(all.filter((r) => r.uuid).map((r) => r.canonical_id));
  return all.filter((r) => r.uuid || !hasUuid.has(r.canonical_id));
}
async function resolveRecipe(id, kv) {
  const direct = await kv.get(`recipe:${id}`, "json");
  if (direct && direct.uuid) return direct;
  let canonicalId = id;
  if (id.startsWith("rec_")) {
    const looked = await kv.get(`idx:${id}`);
    if (!looked) return direct;
    canonicalId = looked;
  }
  const installedUuid = await kv.get(kIdxInstalled(canonicalId));
  if (installedUuid) {
    const byUuid = await kv.get(`recipe:${installedUuid}`, "json");
    if (byUuid) return byUuid;
  }
  return direct ?? await kv.get(`recipe:${canonicalId}`, "json");
}
async function resolveAuthRecipe(service, kv) {
  return kv.get(`auth_recipe:${service}`, "json");
}
var recipesRouter, DISPATCHABLE_AUTH_PRIMITIVES, kIdxCanonical, kIdxInstalled;
var init_recipes = __esm({
  "cypher-executor/src/routes/recipes.ts"() {
    "use strict";
    init_dist();
    init_hash();
    init_endpoints();
    recipesRouter = new Hono2();
    DISPATCHABLE_AUTH_PRIMITIVES = /* @__PURE__ */ new Set(["static_key", "service_account", "oauth2"]);
    kIdxCanonical = (canonicalId) => `idx:canonical:${canonicalId}`;
    kIdxInstalled = (canonicalId) => `idx:installed:${canonicalId}`;
    recipesRouter.post("/recipes", async (c) => {
      let body;
      try {
        body = await c.req.json();
      } catch {
        return c.json({ success: false, error: "request body \u5FC5\u9808\u70BA JSON" }, 400);
      }
      const r = await upsertPrivateRecipe(c.env.RECIPES, body);
      if (!r.ok) return c.json({ success: false, error: r.error }, 400);
      return c.json({ success: true, recipe: r.recipe });
    });
    recipesRouter.post("/recipes/submit", async (c) => {
      let body;
      try {
        body = await c.req.json();
      } catch {
        return c.json({ success: false, error: "request body \u5FC5\u9808\u70BA JSON" }, 400);
      }
      const canonicalId = (body.canonical_id ?? "").trim().toLowerCase();
      if (!canonicalId) return c.json({ success: false, error: "canonical_id \u5FC5\u586B" }, 400);
      if (!body.endpoint) return c.json({ success: false, error: "endpoint \u5FC5\u586B" }, 400);
      const hashId = await deriveRecipeHash(canonicalId);
      const now2 = Date.now();
      const recipe = {
        uuid: crypto.randomUUID(),
        author: body.author ?? body.submitter ?? "anonymous",
        derived_from: body.derived_from,
        canonical_id: canonicalId,
        hash_id: hashId,
        display_name: body.display_name,
        description: body.description,
        endpoint: body.endpoint,
        method: (body.method ?? "POST").toUpperCase(),
        headers: body.headers,
        body: body.body,
        auth_service: body.auth_service,
        credentials_required: body.credentials_required,
        created_at: now2,
        updated_at: now2
      };
      await installRecipeRecord(c.env.RECIPES, recipe);
      const kbdbBase3 = kbdbBaseUrl(c.env);
      const evidence = {
        content: canonicalId,
        entry_type: "recipe_submission",
        metadata_json: JSON.stringify({
          uuid: recipe.uuid,
          canonical_id: canonicalId,
          author: recipe.author,
          submitter: body.submitter ?? "unknown",
          claimed_stat: body.stat ?? null,
          submitted_at: now2
        })
      };
      const kbdbHeaders2 = { "Content-Type": "application/json" };
      if (c.env.KBDB_INTERNAL_TOKEN) kbdbHeaders2["Authorization"] = `Bearer ${c.env.KBDB_INTERNAL_TOKEN}`;
      c.executionCtx.waitUntil(
        fetch(`${kbdbBase3}/entries`, {
          method: "POST",
          headers: kbdbHeaders2,
          body: JSON.stringify(evidence)
        }).catch(() => void 0)
      );
      return c.json({ success: true, recipe, evidence_recorded: true });
    });
    recipesRouter.post("/recipes/migrate-uuid", async (c) => {
      const list = await c.env.RECIPES.list({ prefix: "recipe:" });
      let migrated = 0, skipped = 0;
      const errors = [];
      for (const k of list.keys) {
        try {
          const rec = await c.env.RECIPES.get(k.name, "json");
          if (!rec || !rec.canonical_id) {
            skipped++;
            continue;
          }
          if (rec.uuid) {
            skipped++;
            continue;
          }
          const migrated_recipe = {
            ...rec,
            uuid: crypto.randomUUID(),
            author: rec.author ?? "system"
            // 舊種子歸 system
          };
          await installRecipeRecord(c.env.RECIPES, migrated_recipe);
          migrated++;
        } catch (e) {
          errors.push(`${k.name}: ${e instanceof Error ? e.message : String(e)}`);
        }
      }
      return c.json({ success: errors.length === 0, migrated, skipped, errors });
    });
    recipesRouter.get("/recipes/:id", async (c) => {
      const id = c.req.param("id");
      const recipe = await resolveRecipe(id, c.env.RECIPES);
      if (!recipe) return c.json({ success: false, error: `\u627E\u4E0D\u5230 recipe: ${id}` }, 404);
      return c.json({ success: true, recipe });
    });
    recipesRouter.get("/recipes", async (c) => {
      const list = await c.env.RECIPES.list({ prefix: "recipe:" });
      const all = (await Promise.all(
        list.keys.map((k) => c.env.RECIPES.get(k.name, "json"))
      )).filter(Boolean);
      const hasUuidVersion = new Set(all.filter((r) => r.uuid).map((r) => r.canonical_id));
      const recipes = all.filter((r) => r.uuid || !hasUuidVersion.has(r.canonical_id));
      return c.json({ success: true, recipes, count: recipes.length });
    });
    recipesRouter.get("/public-recipes", async (c) => {
      const q = (c.req.query("q") ?? "").trim().toLowerCase();
      const limit = Math.min(Number(c.req.query("limit") ?? 50), 200);
      const offset = Number(c.req.query("offset") ?? 0);
      const all = await listAllRecipes(c.env.RECIPES);
      const matched = q ? all.filter((r) => r.canonical_id.toLowerCase().includes(q) || (r.display_name ?? "").toLowerCase().includes(q) || (r.description ?? "").toLowerCase().includes(q)) : all;
      if (q && matched.length === 0) {
        return c.json({
          found: false,
          query: q,
          hint: `\u516C\u5EAB\u7121\u7B26\u5408\u300C${q}\u300D\u7684 recipe\u3002\u53EF\u81EA\u884C\u5EFA\u7ACB\u4E26 submit-p \u6295\u7A3F\u6210\u70BA\u4F5C\u8005\uFF08app-store \u6A21\u578B\uFF09\u3002`
        });
      }
      const page = matched.slice(offset, offset + limit);
      const withStats = await Promise.all(
        page.map(async (r) => ({
          uuid: r.uuid,
          canonical_id: r.canonical_id,
          author: r.author,
          display_name: r.display_name,
          description: r.description,
          market_stat: await fetchMarketStat(c.env, r.uuid ?? r.canonical_id)
          // §7.5.h per-uuid
        }))
      );
      return c.json({ found: true, recipes: withStats, count: matched.length });
    });
    recipesRouter.get("/public-recipes/:canonical_id", async (c) => {
      const canonicalId = c.req.param("canonical_id").trim().toLowerCase();
      const author = c.req.query("author");
      const all = await listAllRecipes(c.env.RECIPES);
      let versions = all.filter((r) => r.canonical_id === canonicalId);
      if (author) versions = versions.filter((r) => r.author === author);
      if (versions.length === 0) {
        return c.json({
          found: false,
          canonical_id: canonicalId,
          hint: `\u516C\u5EAB\u7121 recipe\u300C${canonicalId}\u300D${author ? `\uFF08author=${author}\uFF09` : ""}\u3002\u53EF\u81EA\u884C\u5EFA\u7ACB\u4E26 submit-p \u6295\u7A3F\u6210\u70BA\u4F5C\u8005\uFF08app-store \u6A21\u578B\uFF09\u3002`
        });
      }
      let best = versions[0];
      let bestStat = null;
      let bestScore = -1;
      for (const v of versions) {
        const stat = await fetchMarketStat(c.env, v.uuid ?? v.canonical_id);
        const score = stat?.success_count ?? 0;
        if (score > bestScore) {
          bestScore = score;
          best = v;
          bestStat = stat;
        }
      }
      return c.json({ found: true, recipe: best, market_stat: bestStat });
    });
    recipesRouter.delete("/recipes/:id", async (c) => {
      const id = c.req.param("id");
      const recipe = await resolveRecipe(id, c.env.RECIPES);
      if (!recipe) return c.json({ success: false, error: `\u627E\u4E0D\u5230 recipe: ${id}` }, 404);
      const canonicalId = recipe.canonical_id;
      const ops = [
        c.env.RECIPES.delete(`idx:${recipe.hash_id}`),
        c.env.RECIPES.delete(`recipe:${canonicalId}`)
        // 舊 key（若存在）
      ];
      if (recipe.uuid) {
        ops.push(c.env.RECIPES.delete(`recipe:${recipe.uuid}`));
        const listRaw = await c.env.RECIPES.get(kIdxCanonical(canonicalId));
        const uuids = listRaw ? JSON.parse(listRaw) : [];
        const left = uuids.filter((u) => u !== recipe.uuid);
        if (left.length > 0) {
          ops.push(c.env.RECIPES.put(kIdxCanonical(canonicalId), JSON.stringify(left)));
          const installed = await c.env.RECIPES.get(kIdxInstalled(canonicalId));
          if (installed === recipe.uuid) ops.push(c.env.RECIPES.put(kIdxInstalled(canonicalId), left[0]));
        } else {
          ops.push(c.env.RECIPES.delete(kIdxCanonical(canonicalId)));
          ops.push(c.env.RECIPES.delete(kIdxInstalled(canonicalId)));
        }
      }
      await Promise.all(ops);
      return c.json({ success: true, deleted: recipe.uuid ?? canonicalId });
    });
    recipesRouter.post("/auth-recipes", async (c) => {
      let body;
      try {
        body = await c.req.json();
      } catch {
        return c.json({ success: false, error: "request body \u5FC5\u9808\u70BA JSON" }, 400);
      }
      const service = (body.service ?? "").trim().toLowerCase();
      if (!service) return c.json({ success: false, error: "service \u5FC5\u586B" }, 400);
      if (!body.primitive) return c.json({ success: false, error: "primitive \u5FC5\u586B" }, 400);
      if (!body.base_url) return c.json({ success: false, error: "base_url \u5FC5\u586B" }, 400);
      if (!body.required_secrets?.length) return c.json({ success: false, error: "required_secrets \u5FC5\u586B" }, 400);
      if (!body.inject) return c.json({ success: false, error: "inject \u5FC5\u586B" }, 400);
      const missingHelp = body.required_secrets.filter((s) => !s.help_url || !/^https?:\/\//.test(s.help_url));
      if (missingHelp.length > 0) {
        return c.json({
          success: false,
          error: `\u6BCF\u500B required_secret \u5FC5\u9808\u6709 help_url\uFF08\u5B98\u65B9\u6587\u4EF6\u9023\u7D50\uFF0Chttp(s)://\uFF09\u3002\u7F3A\uFF1A${missingHelp.map((s) => s.key).join(", ")}`,
          requires: "help_url"
        }, 400);
      }
      const now2 = Date.now();
      const existing = await c.env.RECIPES.get(`auth_recipe:${service}`, "json");
      const recipe = {
        kind: "auth_recipe",
        service,
        version: body.version ?? 1,
        primitive: body.primitive,
        base_url: body.base_url,
        display_name: body.display_name,
        description: body.description,
        service_account_kind: body.service_account_kind,
        token_exchange: body.token_exchange,
        required_secrets: body.required_secrets,
        inject: body.inject,
        created_at: existing?.created_at ?? now2,
        updated_at: now2
      };
      await c.env.RECIPES.put(`auth_recipe:${service}`, JSON.stringify(recipe));
      return c.json({ success: true, recipe });
    });
    recipesRouter.get("/auth-recipes", async (c) => {
      const list = await c.env.RECIPES.list({ prefix: "auth_recipe:" });
      const recipes = await Promise.all(
        list.keys.map((k) => c.env.RECIPES.get(k.name, "json"))
      );
      return c.json({ success: true, recipes: recipes.filter(Boolean), count: recipes.length });
    });
    recipesRouter.get("/auth-recipes/:service", async (c) => {
      const service = c.req.param("service");
      const recipe = await resolveAuthRecipe(service, c.env.RECIPES);
      if (!recipe) return c.json({ success: false, error: `\u627E\u4E0D\u5230 auth recipe: ${service}` }, 404);
      return c.json({ success: true, recipe });
    });
    recipesRouter.delete("/auth-recipes/:service", async (c) => {
      const service = c.req.param("service");
      const recipe = await resolveAuthRecipe(service, c.env.RECIPES);
      if (!recipe) return c.json({ success: false, error: `\u627E\u4E0D\u5230 auth recipe: ${service}` }, 404);
      await c.env.RECIPES.delete(`auth_recipe:${service}`);
      return c.json({ success: true, deleted: service });
    });
  }
});

// cypher-executor/src/lib/recipe-payload.ts
function getPath2(obj, path) {
  let cur = obj;
  for (const part of path.split(".")) {
    if (cur === null || cur === void 0) return void 0;
    if (typeof cur !== "object") return void 0;
    cur = cur[part];
  }
  return cur;
}
function renderBodyTemplate(template, ctx) {
  if (template === void 0 || template === null) return void 0;
  return renderValue(template, ctx);
}
function renderValue(v, ctx) {
  if (typeof v === "string") return renderString(v, ctx);
  if (Array.isArray(v)) return v.map((item) => renderValue(item, ctx));
  if (v !== null && typeof v === "object") {
    const out = {};
    for (const [k, val] of Object.entries(v)) {
      out[k] = renderValue(val, ctx);
    }
    return out;
  }
  return v;
}
function renderString(s, ctx) {
  const single = s.match(/^\s*\{\{([\w.]+)\}\}\s*$/);
  if (single) {
    const val = getPath2(ctx, single[1]);
    return val === void 0 ? s : val;
  }
  return s.replace(/\{\{([\w.]+)\}\}/g, (_, key) => {
    const val = getPath2(ctx, key);
    if (val === void 0) return `{{${key}}}`;
    return typeof val === "string" ? val : JSON.stringify(val);
  });
}
function applyResponseMap(body, map) {
  if (!map) return { raw: body };
  let picked = map.text_path ? getPath2(body, map.text_path) : body;
  if (map.thinking_model && Array.isArray(picked)) {
    const real = picked.filter(
      (p) => !(p && typeof p === "object" && p.thought === true)
    );
    const last = real[real.length - 1];
    picked = last && typeof last === "object" ? last.text : last;
  }
  if (typeof picked !== "string") return { text: void 0, raw: body };
  return { text: sanitize(picked, map), raw: body };
}
function sanitize(input, map) {
  let s = input.trim();
  if (map.answer_marker) {
    const idx = s.lastIndexOf(map.answer_marker);
    if (idx >= 0) s = s.slice(idx + map.answer_marker.length);
  }
  const prefixes = map.strip_prefixes ?? [];
  if (prefixes.length > 0) {
    let changed = true;
    while (changed) {
      changed = false;
      s = s.trimStart();
      for (const p of prefixes) {
        if (p && s.startsWith(p)) {
          s = s.slice(p.length);
          changed = true;
        }
      }
    }
  }
  return s.trim();
}
var init_recipe_payload = __esm({
  "cypher-executor/src/lib/recipe-payload.ts"() {
    "use strict";
  }
});

// cypher-executor/src/types.ts
async function kvGetNodeOutput(store2, nodeId) {
  try {
    const val = await store2.kv.get(`${store2.runId}:node:${nodeId}`, "json");
    return val;
  } catch {
    return void 0;
  }
}
async function kvSetNodeOutput(store2, nodeId, output) {
  try {
    await store2.kv.put(
      `${store2.runId}:node:${nodeId}`,
      JSON.stringify(output),
      { expirationTtl: 3600 }
    );
  } catch {
  }
}
var WorkflowPaused, ExecutionError;
var init_types = __esm({
  "cypher-executor/src/types.ts"() {
    "use strict";
    WorkflowPaused = class extends Error {
      task_id;
      run_id;
      paused_node_id;
      trace_so_far;
      constructor(task_id, run_id, paused_node_id, trace_so_far) {
        super(`workflow paused at node ${paused_node_id} waiting for task ${task_id}`);
        this.name = "WorkflowPaused";
        this.task_id = task_id;
        this.run_id = run_id;
        this.paused_node_id = paused_node_id;
        this.trace_so_far = trace_so_far;
      }
    };
    ExecutionError = class extends Error {
      failed_node;
      failed_input;
      trace;
      constructor(message, failed_node, failed_input, trace) {
        super(message);
        this.name = "ExecutionError";
        this.failed_node = failed_node;
        this.failed_input = failed_input;
        this.trace = trace;
      }
    };
  }
});

// cypher-executor/src/lib/wasi-shim.ts
async function rsaPkcs1Sha256Sign(data, pkcs8) {
  const cryptoKey = await crypto.subtle.importKey(
    "pkcs8",
    pkcs8,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", cryptoKey, data);
  return new Uint8Array(sig);
}
function secretGet(env, ref) {
  if (!/^CRED_/.test(ref)) return null;
  const value = env[ref];
  return typeof value === "string" ? value : null;
}
function createArcrunHostFunctions(env, _apiKey) {
  return {
    crypto_sign_rs256: (data, pkcs8) => rsaPkcs1Sha256Sign(data, pkcs8),
    secret_get: async (ref) => secretGet(env, ref)
  };
}
var init_wasi_shim = __esm({
  "cypher-executor/src/lib/wasi-shim.ts"() {
    "use strict";
  }
});

// cypher-executor/src/lib/secret-backend.ts
function secretBackendMode(env) {
  const v = (env.SECRET_BACKEND ?? "").trim().toLowerCase();
  if (v === "" || v === "cf") return "cf";
  if (v === "local") return "local";
  return "invalid";
}
function localBackendReady(env) {
  return typeof env.PRIVATE_SECRET_KEY === "string" && env.PRIVATE_SECRET_KEY.length >= MIN_KEY_LEN;
}
function b64(bytes) {
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s);
}
function unb64(s) {
  const bin = atob(s);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}
async function deriveAesKey(masterKey) {
  const ikm = await crypto.subtle.importKey("raw", enc.encode(masterKey), "HKDF", false, ["deriveKey"]);
  return crypto.subtle.deriveKey(
    { name: "HKDF", hash: "SHA-256", salt: enc.encode(HKDF_SALT), info: new Uint8Array(0) },
    ikm,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}
function aad(apiKey, ref) {
  return enc.encode(`${apiKey}|${ref}`);
}
async function sealSecret(masterKey, apiKey, ref, value) {
  const key = await deriveAesKey(masterKey);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = await crypto.subtle.encrypt({ name: "AES-GCM", iv, additionalData: aad(apiKey, ref) }, key, enc.encode(value));
  return { v: 1, iv: b64(iv), ct: b64(new Uint8Array(ct)) };
}
async function openSecret(masterKey, apiKey, ref, sealed) {
  if (!sealed || sealed.v !== 1) return null;
  try {
    const key = await deriveAesKey(masterKey);
    const pt = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: unb64(sealed.iv), additionalData: aad(apiKey, ref) },
      key,
      unb64(sealed.ct)
    );
    return dec.decode(pt);
  } catch {
    return null;
  }
}
async function kbdbFetch(env, path, init) {
  const { base, headers } = kbdbBase(env);
  return fetch(`${base}${path}`, { ...init, headers: { ...headers, ...init?.headers } });
}
async function findSecretRow(env, apiKey, ref) {
  const qs = new URLSearchParams({ owner_id: apiKey, entry_type: SECRET_ENTRY_TYPE, page_name: ref, limit: "1" });
  const res = await kbdbFetch(env, `/entries?${qs.toString()}`);
  if (!res.ok) throw new Error(`KBDB /entries \u67E5\u8A62\u5931\u6557\uFF1AHTTP ${res.status}`);
  const body = await res.json().catch(() => null);
  return body?.entries?.[0] ?? null;
}
function requireLocalReady(env) {
  if (!localBackendReady(env)) {
    throw new Error(
      "\u4F01\u696D\u79C1\u6709\u96F2\u91D1\u9470\u4FDD\u7BA1\u672A\u5C31\u7DD2\uFF1ASECRET_BACKEND=local \u9700\u8981 PRIVATE_SECRET_KEY\uFF08\u81F3\u5C11 32 \u5B57\u5143\uFF0C\u7531\u9019\u53F0 server \u7684\u8A2D\u5B9A\u63D0\u4F9B\uFF09"
    );
  }
  return env.PRIVATE_SECRET_KEY;
}
async function putLocalSecret(env, apiKey, ref, value) {
  const master = requireLocalReady(env);
  const sealed = await sealSecret(master, apiKey, ref, value);
  const metadata_json = JSON.stringify(sealed);
  const existing = await findSecretRow(env, apiKey, ref);
  const res = existing ? await kbdbFetch(env, `/entries/${encodeURIComponent(existing.id)}`, { method: "PATCH", body: JSON.stringify({ metadata_json }) }) : await kbdbFetch(env, `/entries`, {
    method: "POST",
    body: JSON.stringify({ entry_type: SECRET_ENTRY_TYPE, owner_id: apiKey, page_name: ref, metadata_json })
  });
  if (!res.ok) throw new Error(`\u91D1\u9470\u4FDD\u7BA1\u5BEB\u5165\u5931\u6557\uFF1AHTTP ${res.status}`);
}
async function deleteLocalSecret(env, apiKey, ref) {
  const existing = await findSecretRow(env, apiKey, ref);
  if (!existing) return;
  const res = await kbdbFetch(env, `/entries/${encodeURIComponent(existing.id)}`, { method: "DELETE" });
  if (!res.ok && res.status !== 404) throw new Error(`\u91D1\u9470\u4FDD\u7BA1\u522A\u9664\u5931\u6557\uFF1AHTTP ${res.status}`);
}
async function getLocalSecret(env, apiKey, ref) {
  if (!localBackendReady(env)) return null;
  let sealed;
  try {
    const row = await findSecretRow(env, apiKey, ref);
    sealed = row?.metadata_json ? JSON.parse(row.metadata_json) : null;
  } catch {
    return null;
  }
  if (!sealed) return null;
  return openSecret(env.PRIVATE_SECRET_KEY, apiKey, ref, sealed);
}
async function getLocalSecretStrict(env, apiKey, ref) {
  const master = requireLocalReady(env);
  const row = await findSecretRow(env, apiKey, ref);
  if (!row) return null;
  if (!row.metadata_json) throw new Error("\u91D1\u9470\u4FDD\u7BA1\u5167\u5BB9\u640D\u6BC0\uFF08\u7A7A\u5217\uFF09");
  const sealed = JSON.parse(row.metadata_json);
  const v = await openSecret(master, apiKey, ref, sealed);
  if (v === null) throw new Error("\u91D1\u9470\u4FDD\u7BA1\u89E3\u4E0D\u958B\uFF08\u4E3B\u91D1\u9470\u4E0D\u7B26\u6216\u5BC6\u6587\u88AB\u6539\u52D5\uFF09");
  return v;
}
var SECRET_ENTRY_TYPE, HKDF_SALT, MIN_KEY_LEN, enc, dec;
var init_secret_backend = __esm({
  "cypher-executor/src/lib/secret-backend.ts"() {
    "use strict";
    init_kbdb_proxy();
    SECRET_ENTRY_TYPE = "credential_secret";
    HKDF_SALT = "arcrun-private-secret-v1";
    MIN_KEY_LEN = 32;
    enc = new TextEncoder();
    dec = new TextDecoder();
  }
});

// cypher-executor/src/lib/tenant.ts
function knowledgeOwner(env) {
  const injected = (env.ARCRUN_NAMESPACE ?? "").trim();
  if (injected) return injected;
  const legacy = (env.CONSOLE_TENANT ?? "").trim();
  if (legacy) return legacy;
  throw new TenantUnresolvedError(
    "\u9019\u500B\u90E8\u7F72\u6C92\u6709\u77E5\u8B58\u547D\u540D\u7A7A\u9593\uFF08\u74B0\u5883\u8B8A\u6578 ARCRUN_NAMESPACE / CONSOLE_TENANT \u90FD\u6C92\u8A2D\uFF09\uFF0C\u7121\u6CD5\u6C7A\u5B9A\u8981\u7528\u54EA\u500B owner_id \u53D6\u8CC7\u6599\u3002",
    "tenant_unresolved"
  );
}
function tenantFromApiKey(apiKey) {
  const key = (apiKey ?? "").trim();
  if (!key) throw new TenantUnresolvedError("\u7F3A\u5C11 X-Arcrun-API-Key\uFF0C\u7121\u6CD5\u6C7A\u5B9A\u67E5\u8A62\u7BC4\u570D", "missing_api_key");
  return key;
}
function accountTenant(env) {
  return env.CONSOLE_TENANT || "leo";
}
function credentialOwner(env) {
  try {
    return knowledgeOwner(env);
  } catch {
    return accountTenant(env);
  }
}
function legacyCredentialOwner(env) {
  const legacy = accountTenant(env);
  return legacy && legacy !== credentialOwner(env) ? legacy : null;
}
function ownerQuery(tenant2) {
  return `owner_id=${encodeURIComponent(tenant2)}`;
}
function ownerField(tenant2) {
  return tenant2;
}
function censusQueryAllTenants() {
  return "owner_id=";
}
function isOwnedBy(value, tenant2) {
  return typeof value === "string" && value === tenant2;
}
var TenantUnresolvedError;
var init_tenant = __esm({
  "cypher-executor/src/lib/tenant.ts"() {
    "use strict";
    TenantUnresolvedError = class extends Error {
      code;
      constructor(message, code = "tenant_unresolved") {
        super(message);
        this.name = "TenantUnresolvedError";
        this.code = code;
      }
    };
  }
});

// cypher-executor/src/actions/auth-dispatcher.ts
async function resolveSecretsFromNewHome(env, apiKey, names) {
  return (await resolveSecretsFromNewHomeDetailed(env, apiKey, names)).resolved;
}
async function resolveSecretsFromNewHomeDetailed(env, apiKey, names) {
  const resolved = {};
  if (names.length === 0) return { resolved, directoryError: null };
  const { refs, directoryError } = await getCredentialSecretRefsDetailed(env, apiKey);
  if (Object.keys(refs).length === 0) return { resolved, directoryError };
  const mode = secretBackendMode(env);
  const secretGet2 = mode === "local" ? async (ref) => {
    if (!/^CRED_/.test(ref)) return null;
    const v = await getLocalSecret(env, apiKey, ref);
    if (v !== null) return v;
    const legacy = apiKey === credentialOwner(env) ? legacyCredentialOwner(env) : null;
    return legacy ? getLocalSecret(env, legacy, ref) : null;
  } : mode === "invalid" ? async () => null : createArcrunHostFunctions(env, apiKey).secret_get;
  if (!secretGet2) return { resolved, directoryError };
  const resolvedNames = [];
  for (const name of names) {
    const ref = refs[name];
    if (!ref) continue;
    const value = await secretGet2(ref);
    if (value === null) continue;
    resolved[name] = value;
    resolvedNames.push(name);
  }
  if (resolvedNames.length > 0) touchLastUsed(env, apiKey, resolvedNames);
  return { resolved, directoryError };
}
function explainCredentialFailure(message, directoryError, names) {
  if (!directoryError) return message;
  return `credential \u76EE\u9304\u8B80\u4E0D\u5230\uFF08${directoryError}\uFF09\uFF0C${names.join("\u3001")} \u7121\u6CD5\u5F9E\u4FDD\u7BA1\u8655\u53D6\u7528\u2014\u2014\u9019\u4E0D\u4EE3\u8868 credential \u4E0D\u5B58\u5728\uFF0C\u662F\u77E5\u8B58\u5EAB\uFF08KBDB\uFF09\u9019\u4E00\u523B\u56DE\u932F\uFF0C\u8ACB\u5148\u78BA\u8A8D KBDB \u662F\u5426\u6B63\u5E38\u3002\u9000\u56DE\u820A\u8DEF\u5F91\u7684\u7D50\u679C\uFF1A${message}`;
}
function oauth2CacheKey(apiKey, service) {
  return `${apiKey}\0${service}`;
}
async function readOAuth2Cache(_env, apiKey, service) {
  const slot = oauth2Cache.get(oauth2CacheKey(apiKey, service));
  if (!slot) return null;
  if (slot.expiresAt - 60 <= Math.floor(Date.now() / 1e3)) {
    oauth2Cache.delete(oauth2CacheKey(apiKey, service));
    return null;
  }
  return { accessToken: slot.accessToken, expiresAt: slot.expiresAt };
}
async function writeOAuth2Cache(_env, apiKey, service, accessToken, expiresAt) {
  if (oauth2Cache.size >= OAUTH2_CACHE_MAX) {
    const oldest = oauth2Cache.keys().next().value;
    if (oldest !== void 0) oauth2Cache.delete(oldest);
  }
  oauth2Cache.set(oauth2CacheKey(apiKey, service), { accessToken, expiresAt });
}
async function tryAuthDispatch(componentId, input, env, apiKey, redactor) {
  if (AUTH_PRIMITIVE_IDS.has(componentId)) {
    return null;
  }
  let service = componentId;
  const apiRecipe = await resolveRecipe(componentId, env.RECIPES);
  if (apiRecipe?.auth_service) {
    service = apiRecipe.auth_service;
  }
  const recipe = await resolveAuthRecipe(service, env.RECIPES);
  if (!recipe) return null;
  if (!SUPPORTED_PRIMITIVES.has(recipe.primitive)) return null;
  const secretNames = recipe.required_secrets.filter((s) => !s.optional).map((s) => s.key);
  const { resolved: resolvedSecrets, directoryError } = await resolveSecretsFromNewHomeDetailed(env, apiKey, secretNames);
  redactor?.addRecord(resolvedSecrets, (name) => `credential:${name}`);
  const oauth2Cache2 = recipe.primitive === "oauth2" ? await readOAuth2Cache(env, apiKey, service) : null;
  const primitiveUrl = componentUrl(`auth_${recipe.primitive}`, env);
  const res = await fetch(primitiveUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "authenticate",
      api_key: apiKey,
      service,
      // 只在有取到值時帶上（空物件也無妨，WASM 對 nil/空 map 同樣視為缺席）
      resolved_secrets: resolvedSecrets,
      recipe,
      ...oauth2Cache2 ? { cached_access_token: oauth2Cache2.accessToken, cached_expires_at: oauth2Cache2.expiresAt } : {}
    })
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      explainCredentialFailure(
        `auth primitive "${recipe.primitive}" \u56DE\u50B3 ${res.status}: ${text.slice(0, 200)}`,
        directoryError,
        secretNames
      )
    );
  }
  const result = await res.json().catch(() => null);
  if (!result || result.success === false) {
    throw new Error(
      explainCredentialFailure(`auth primitive \u5931\u6557: ${result?.error ?? "\u672A\u77E5\u932F\u8AA4"}`, directoryError, secretNames)
    );
  }
  if (result.cache?.access_token && typeof result.cache.expires_at === "number") {
    void writeOAuth2Cache(env, apiKey, service, result.cache.access_token, result.cache.expires_at).catch(() => {
    });
  }
  redactor?.addRecord(result.auth_headers, (k) => `auth_header:${k}`);
  redactor?.addRecord(result.auth_query, (k) => `auth_query:${k}`);
  redactor?.addRecord(result.auth_body, (k) => `auth_body:${k}`);
  redactor?.addRecord(result.auth_path, (k) => `auth_path:${k}`);
  return {
    ...input,
    _auth_headers: result.auth_headers ?? {},
    _auth_query: result.auth_query ?? {},
    _auth_body: result.auth_body ?? {},
    _auth_path: result.auth_path ?? {}
  };
}
function collectCredentialNames(value, out) {
  if (typeof value === "string") {
    for (const m of value.matchAll(CREDENTIAL_REF)) out.add(m[1]);
  } else if (Array.isArray(value)) {
    for (const v of value) collectCredentialNames(v, out);
  } else if (value && typeof value === "object") {
    for (const v of Object.values(value)) collectCredentialNames(v, out);
  }
}
function replaceCredentialRefs(value, resolved) {
  if (typeof value === "string") {
    return value.replace(
      CREDENTIAL_REF,
      (orig, name) => Object.prototype.hasOwnProperty.call(resolved, name) ? resolved[name] : orig
    );
  }
  if (Array.isArray(value)) return value.map((v) => replaceCredentialRefs(v, resolved));
  if (value && typeof value === "object") {
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      out[k] = replaceCredentialRefs(v, resolved);
    }
    return out;
  }
  return value;
}
async function resolveCredentialRefs(data, env, apiKey, redactor) {
  const names = /* @__PURE__ */ new Set();
  collectCredentialNames(data, names);
  if (names.size === 0) return data;
  const nameList = [...names];
  const { resolved: resolvedSecrets, directoryError } = await resolveSecretsFromNewHomeDetailed(env, apiKey, nameList);
  redactor?.addRecord(resolvedSecrets, (name) => `credential:${name}`);
  if (nameList.every((n) => Object.prototype.hasOwnProperty.call(resolvedSecrets, n))) {
    return replaceCredentialRefs(data, resolvedSecrets);
  }
  const url = componentUrl("auth_static_key", env);
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "resolve_credentials",
      api_key: apiKey,
      names: nameList,
      resolved_secrets: resolvedSecrets
    })
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      explainCredentialFailure(`credential resolve \u56DE\u50B3 ${res.status}: ${text.slice(0, 200)}`, directoryError, nameList)
    );
  }
  const result = await res.json().catch(() => null);
  if (!result || result.success === false) {
    throw new Error(
      explainCredentialFailure(`credential resolve \u5931\u6557: ${result?.error ?? "\u672A\u77E5\u932F\u8AA4"}`, directoryError, nameList)
    );
  }
  redactor?.addRecord(result.credentials, (name) => `credential:${name}`);
  return replaceCredentialRefs(data, result.credentials ?? {});
}
var oauth2Cache, OAUTH2_CACHE_MAX, SUPPORTED_PRIMITIVES, AUTH_PRIMITIVE_IDS, CREDENTIAL_REF;
var init_auth_dispatcher = __esm({
  "cypher-executor/src/actions/auth-dispatcher.ts"() {
    "use strict";
    init_recipes();
    init_endpoints();
    init_wasi_shim();
    init_secret_backend();
    init_credentials();
    init_tenant();
    oauth2Cache = /* @__PURE__ */ new Map();
    OAUTH2_CACHE_MAX = 200;
    SUPPORTED_PRIMITIVES = /* @__PURE__ */ new Set(["static_key", "service_account", "oauth2"]);
    AUTH_PRIMITIVE_IDS = /* @__PURE__ */ new Set([
      "auth_static_key",
      "auth_service_account",
      "auth_oauth2",
      "auth_mtls"
    ]);
    CREDENTIAL_REF = /\{\{credential\.(\w+)\}\}/g;
  }
});

// cypher-executor/node_modules/.pnpm/zod@3.23.8/node_modules/zod/lib/index.mjs
function setErrorMap(map) {
  overrideErrorMap = map;
}
function getErrorMap() {
  return overrideErrorMap;
}
function addIssueToContext(ctx, issueData) {
  const overrideMap = getErrorMap();
  const issue = makeIssue({
    issueData,
    data: ctx.data,
    path: ctx.path,
    errorMaps: [
      ctx.common.contextualErrorMap,
      ctx.schemaErrorMap,
      overrideMap,
      overrideMap === errorMap ? void 0 : errorMap
      // then global default map
    ].filter((x) => !!x)
  });
  ctx.common.issues.push(issue);
}
function __classPrivateFieldGet(receiver, state, kind, f) {
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}
function __classPrivateFieldSet(receiver, state, value, kind, f) {
  if (kind === "m") throw new TypeError("Private method is not writable");
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
}
function processCreateParams(params) {
  if (!params)
    return {};
  const { errorMap: errorMap2, invalid_type_error, required_error, description } = params;
  if (errorMap2 && (invalid_type_error || required_error)) {
    throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  }
  if (errorMap2)
    return { errorMap: errorMap2, description };
  const customMap = (iss, ctx) => {
    var _a, _b;
    const { message } = params;
    if (iss.code === "invalid_enum_value") {
      return { message: message !== null && message !== void 0 ? message : ctx.defaultError };
    }
    if (typeof ctx.data === "undefined") {
      return { message: (_a = message !== null && message !== void 0 ? message : required_error) !== null && _a !== void 0 ? _a : ctx.defaultError };
    }
    if (iss.code !== "invalid_type")
      return { message: ctx.defaultError };
    return { message: (_b = message !== null && message !== void 0 ? message : invalid_type_error) !== null && _b !== void 0 ? _b : ctx.defaultError };
  };
  return { errorMap: customMap, description };
}
function timeRegexSource(args) {
  let regex = `([01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d`;
  if (args.precision) {
    regex = `${regex}\\.\\d{${args.precision}}`;
  } else if (args.precision == null) {
    regex = `${regex}(\\.\\d+)?`;
  }
  return regex;
}
function timeRegex(args) {
  return new RegExp(`^${timeRegexSource(args)}$`);
}
function datetimeRegex(args) {
  let regex = `${dateRegexSource}T${timeRegexSource(args)}`;
  const opts = [];
  opts.push(args.local ? `Z?` : `Z`);
  if (args.offset)
    opts.push(`([+-]\\d{2}:?\\d{2})`);
  regex = `${regex}(${opts.join("|")})`;
  return new RegExp(`^${regex}$`);
}
function isValidIP(ip, version) {
  if ((version === "v4" || !version) && ipv4Regex.test(ip)) {
    return true;
  }
  if ((version === "v6" || !version) && ipv6Regex.test(ip)) {
    return true;
  }
  return false;
}
function floatSafeRemainder(val, step) {
  const valDecCount = (val.toString().split(".")[1] || "").length;
  const stepDecCount = (step.toString().split(".")[1] || "").length;
  const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
  const valInt = parseInt(val.toFixed(decCount).replace(".", ""));
  const stepInt = parseInt(step.toFixed(decCount).replace(".", ""));
  return valInt % stepInt / Math.pow(10, decCount);
}
function deepPartialify(schema) {
  if (schema instanceof ZodObject) {
    const newShape = {};
    for (const key in schema.shape) {
      const fieldSchema = schema.shape[key];
      newShape[key] = ZodOptional.create(deepPartialify(fieldSchema));
    }
    return new ZodObject({
      ...schema._def,
      shape: () => newShape
    });
  } else if (schema instanceof ZodArray) {
    return new ZodArray({
      ...schema._def,
      type: deepPartialify(schema.element)
    });
  } else if (schema instanceof ZodOptional) {
    return ZodOptional.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodNullable) {
    return ZodNullable.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodTuple) {
    return ZodTuple.create(schema.items.map((item) => deepPartialify(item)));
  } else {
    return schema;
  }
}
function mergeValues(a, b) {
  const aType = getParsedType(a);
  const bType = getParsedType(b);
  if (a === b) {
    return { valid: true, data: a };
  } else if (aType === ZodParsedType.object && bType === ZodParsedType.object) {
    const bKeys = util.objectKeys(b);
    const sharedKeys = util.objectKeys(a).filter((key) => bKeys.indexOf(key) !== -1);
    const newObj = { ...a, ...b };
    for (const key of sharedKeys) {
      const sharedValue = mergeValues(a[key], b[key]);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newObj[key] = sharedValue.data;
    }
    return { valid: true, data: newObj };
  } else if (aType === ZodParsedType.array && bType === ZodParsedType.array) {
    if (a.length !== b.length) {
      return { valid: false };
    }
    const newArray = [];
    for (let index = 0; index < a.length; index++) {
      const itemA = a[index];
      const itemB = b[index];
      const sharedValue = mergeValues(itemA, itemB);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newArray.push(sharedValue.data);
    }
    return { valid: true, data: newArray };
  } else if (aType === ZodParsedType.date && bType === ZodParsedType.date && +a === +b) {
    return { valid: true, data: a };
  } else {
    return { valid: false };
  }
}
function createZodEnum(values, params) {
  return new ZodEnum({
    values,
    typeName: ZodFirstPartyTypeKind.ZodEnum,
    ...processCreateParams(params)
  });
}
function custom(check, params = {}, fatal) {
  if (check)
    return ZodAny.create().superRefine((data, ctx) => {
      var _a, _b;
      if (!check(data)) {
        const p = typeof params === "function" ? params(data) : typeof params === "string" ? { message: params } : params;
        const _fatal = (_b = (_a = p.fatal) !== null && _a !== void 0 ? _a : fatal) !== null && _b !== void 0 ? _b : true;
        const p2 = typeof p === "string" ? { message: p } : p;
        ctx.addIssue({ code: "custom", ...p2, fatal: _fatal });
      }
    });
  return ZodAny.create();
}
var util, objectUtil, ZodParsedType, getParsedType, ZodIssueCode, quotelessJson, ZodError, errorMap, overrideErrorMap, makeIssue, EMPTY_PATH, ParseStatus, INVALID, DIRTY, OK, isAborted, isDirty, isValid, isAsync, errorUtil, _ZodEnum_cache, _ZodNativeEnum_cache, ParseInputLazyPath, handleResult, ZodType, cuidRegex, cuid2Regex, ulidRegex, uuidRegex, nanoidRegex, durationRegex, emailRegex, _emojiRegex, emojiRegex, ipv4Regex, ipv6Regex, base64Regex, dateRegexSource, dateRegex, ZodString, ZodNumber, ZodBigInt, ZodBoolean, ZodDate, ZodSymbol, ZodUndefined, ZodNull, ZodAny, ZodUnknown, ZodNever, ZodVoid, ZodArray, ZodObject, ZodUnion, getDiscriminator, ZodDiscriminatedUnion, ZodIntersection, ZodTuple, ZodRecord, ZodMap, ZodSet, ZodFunction, ZodLazy, ZodLiteral, ZodEnum, ZodNativeEnum, ZodPromise, ZodEffects, ZodOptional, ZodNullable, ZodDefault, ZodCatch, ZodNaN, BRAND, ZodBranded, ZodPipeline, ZodReadonly, late, ZodFirstPartyTypeKind, instanceOfType, stringType, numberType, nanType, bigIntType, booleanType, dateType, symbolType, undefinedType, nullType, anyType, unknownType, neverType, voidType, arrayType, objectType, strictObjectType, unionType, discriminatedUnionType, intersectionType, tupleType, recordType, mapType, setType, functionType, lazyType, literalType, enumType, nativeEnumType, promiseType, effectsType, optionalType, nullableType, preprocessType, pipelineType, ostring, onumber, oboolean, coerce, NEVER, z;
var init_lib = __esm({
  "cypher-executor/node_modules/.pnpm/zod@3.23.8/node_modules/zod/lib/index.mjs"() {
    (function(util2) {
      util2.assertEqual = (val) => val;
      function assertIs(_arg) {
      }
      util2.assertIs = assertIs;
      function assertNever(_x) {
        throw new Error();
      }
      util2.assertNever = assertNever;
      util2.arrayToEnum = (items) => {
        const obj = {};
        for (const item of items) {
          obj[item] = item;
        }
        return obj;
      };
      util2.getValidEnumValues = (obj) => {
        const validKeys = util2.objectKeys(obj).filter((k) => typeof obj[obj[k]] !== "number");
        const filtered = {};
        for (const k of validKeys) {
          filtered[k] = obj[k];
        }
        return util2.objectValues(filtered);
      };
      util2.objectValues = (obj) => {
        return util2.objectKeys(obj).map(function(e) {
          return obj[e];
        });
      };
      util2.objectKeys = typeof Object.keys === "function" ? (obj) => Object.keys(obj) : (object) => {
        const keys = [];
        for (const key in object) {
          if (Object.prototype.hasOwnProperty.call(object, key)) {
            keys.push(key);
          }
        }
        return keys;
      };
      util2.find = (arr, checker) => {
        for (const item of arr) {
          if (checker(item))
            return item;
        }
        return void 0;
      };
      util2.isInteger = typeof Number.isInteger === "function" ? (val) => Number.isInteger(val) : (val) => typeof val === "number" && isFinite(val) && Math.floor(val) === val;
      function joinValues(array, separator = " | ") {
        return array.map((val) => typeof val === "string" ? `'${val}'` : val).join(separator);
      }
      util2.joinValues = joinValues;
      util2.jsonStringifyReplacer = (_, value) => {
        if (typeof value === "bigint") {
          return value.toString();
        }
        return value;
      };
    })(util || (util = {}));
    (function(objectUtil2) {
      objectUtil2.mergeShapes = (first, second) => {
        return {
          ...first,
          ...second
          // second overwrites first
        };
      };
    })(objectUtil || (objectUtil = {}));
    ZodParsedType = util.arrayToEnum([
      "string",
      "nan",
      "number",
      "integer",
      "float",
      "boolean",
      "date",
      "bigint",
      "symbol",
      "function",
      "undefined",
      "null",
      "array",
      "object",
      "unknown",
      "promise",
      "void",
      "never",
      "map",
      "set"
    ]);
    getParsedType = (data) => {
      const t = typeof data;
      switch (t) {
        case "undefined":
          return ZodParsedType.undefined;
        case "string":
          return ZodParsedType.string;
        case "number":
          return isNaN(data) ? ZodParsedType.nan : ZodParsedType.number;
        case "boolean":
          return ZodParsedType.boolean;
        case "function":
          return ZodParsedType.function;
        case "bigint":
          return ZodParsedType.bigint;
        case "symbol":
          return ZodParsedType.symbol;
        case "object":
          if (Array.isArray(data)) {
            return ZodParsedType.array;
          }
          if (data === null) {
            return ZodParsedType.null;
          }
          if (data.then && typeof data.then === "function" && data.catch && typeof data.catch === "function") {
            return ZodParsedType.promise;
          }
          if (typeof Map !== "undefined" && data instanceof Map) {
            return ZodParsedType.map;
          }
          if (typeof Set !== "undefined" && data instanceof Set) {
            return ZodParsedType.set;
          }
          if (typeof Date !== "undefined" && data instanceof Date) {
            return ZodParsedType.date;
          }
          return ZodParsedType.object;
        default:
          return ZodParsedType.unknown;
      }
    };
    ZodIssueCode = util.arrayToEnum([
      "invalid_type",
      "invalid_literal",
      "custom",
      "invalid_union",
      "invalid_union_discriminator",
      "invalid_enum_value",
      "unrecognized_keys",
      "invalid_arguments",
      "invalid_return_type",
      "invalid_date",
      "invalid_string",
      "too_small",
      "too_big",
      "invalid_intersection_types",
      "not_multiple_of",
      "not_finite"
    ]);
    quotelessJson = (obj) => {
      const json = JSON.stringify(obj, null, 2);
      return json.replace(/"([^"]+)":/g, "$1:");
    };
    ZodError = class _ZodError extends Error {
      constructor(issues) {
        super();
        this.issues = [];
        this.addIssue = (sub) => {
          this.issues = [...this.issues, sub];
        };
        this.addIssues = (subs = []) => {
          this.issues = [...this.issues, ...subs];
        };
        const actualProto = new.target.prototype;
        if (Object.setPrototypeOf) {
          Object.setPrototypeOf(this, actualProto);
        } else {
          this.__proto__ = actualProto;
        }
        this.name = "ZodError";
        this.issues = issues;
      }
      get errors() {
        return this.issues;
      }
      format(_mapper) {
        const mapper = _mapper || function(issue) {
          return issue.message;
        };
        const fieldErrors = { _errors: [] };
        const processError = (error) => {
          for (const issue of error.issues) {
            if (issue.code === "invalid_union") {
              issue.unionErrors.map(processError);
            } else if (issue.code === "invalid_return_type") {
              processError(issue.returnTypeError);
            } else if (issue.code === "invalid_arguments") {
              processError(issue.argumentsError);
            } else if (issue.path.length === 0) {
              fieldErrors._errors.push(mapper(issue));
            } else {
              let curr = fieldErrors;
              let i = 0;
              while (i < issue.path.length) {
                const el = issue.path[i];
                const terminal = i === issue.path.length - 1;
                if (!terminal) {
                  curr[el] = curr[el] || { _errors: [] };
                } else {
                  curr[el] = curr[el] || { _errors: [] };
                  curr[el]._errors.push(mapper(issue));
                }
                curr = curr[el];
                i++;
              }
            }
          }
        };
        processError(this);
        return fieldErrors;
      }
      static assert(value) {
        if (!(value instanceof _ZodError)) {
          throw new Error(`Not a ZodError: ${value}`);
        }
      }
      toString() {
        return this.message;
      }
      get message() {
        return JSON.stringify(this.issues, util.jsonStringifyReplacer, 2);
      }
      get isEmpty() {
        return this.issues.length === 0;
      }
      flatten(mapper = (issue) => issue.message) {
        const fieldErrors = {};
        const formErrors = [];
        for (const sub of this.issues) {
          if (sub.path.length > 0) {
            fieldErrors[sub.path[0]] = fieldErrors[sub.path[0]] || [];
            fieldErrors[sub.path[0]].push(mapper(sub));
          } else {
            formErrors.push(mapper(sub));
          }
        }
        return { formErrors, fieldErrors };
      }
      get formErrors() {
        return this.flatten();
      }
    };
    ZodError.create = (issues) => {
      const error = new ZodError(issues);
      return error;
    };
    errorMap = (issue, _ctx) => {
      let message;
      switch (issue.code) {
        case ZodIssueCode.invalid_type:
          if (issue.received === ZodParsedType.undefined) {
            message = "Required";
          } else {
            message = `Expected ${issue.expected}, received ${issue.received}`;
          }
          break;
        case ZodIssueCode.invalid_literal:
          message = `Invalid literal value, expected ${JSON.stringify(issue.expected, util.jsonStringifyReplacer)}`;
          break;
        case ZodIssueCode.unrecognized_keys:
          message = `Unrecognized key(s) in object: ${util.joinValues(issue.keys, ", ")}`;
          break;
        case ZodIssueCode.invalid_union:
          message = `Invalid input`;
          break;
        case ZodIssueCode.invalid_union_discriminator:
          message = `Invalid discriminator value. Expected ${util.joinValues(issue.options)}`;
          break;
        case ZodIssueCode.invalid_enum_value:
          message = `Invalid enum value. Expected ${util.joinValues(issue.options)}, received '${issue.received}'`;
          break;
        case ZodIssueCode.invalid_arguments:
          message = `Invalid function arguments`;
          break;
        case ZodIssueCode.invalid_return_type:
          message = `Invalid function return type`;
          break;
        case ZodIssueCode.invalid_date:
          message = `Invalid date`;
          break;
        case ZodIssueCode.invalid_string:
          if (typeof issue.validation === "object") {
            if ("includes" in issue.validation) {
              message = `Invalid input: must include "${issue.validation.includes}"`;
              if (typeof issue.validation.position === "number") {
                message = `${message} at one or more positions greater than or equal to ${issue.validation.position}`;
              }
            } else if ("startsWith" in issue.validation) {
              message = `Invalid input: must start with "${issue.validation.startsWith}"`;
            } else if ("endsWith" in issue.validation) {
              message = `Invalid input: must end with "${issue.validation.endsWith}"`;
            } else {
              util.assertNever(issue.validation);
            }
          } else if (issue.validation !== "regex") {
            message = `Invalid ${issue.validation}`;
          } else {
            message = "Invalid";
          }
          break;
        case ZodIssueCode.too_small:
          if (issue.type === "array")
            message = `Array must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `more than`} ${issue.minimum} element(s)`;
          else if (issue.type === "string")
            message = `String must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `over`} ${issue.minimum} character(s)`;
          else if (issue.type === "number")
            message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
          else if (issue.type === "date")
            message = `Date must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${new Date(Number(issue.minimum))}`;
          else
            message = "Invalid input";
          break;
        case ZodIssueCode.too_big:
          if (issue.type === "array")
            message = `Array must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `less than`} ${issue.maximum} element(s)`;
          else if (issue.type === "string")
            message = `String must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `under`} ${issue.maximum} character(s)`;
          else if (issue.type === "number")
            message = `Number must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
          else if (issue.type === "bigint")
            message = `BigInt must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
          else if (issue.type === "date")
            message = `Date must be ${issue.exact ? `exactly` : issue.inclusive ? `smaller than or equal to` : `smaller than`} ${new Date(Number(issue.maximum))}`;
          else
            message = "Invalid input";
          break;
        case ZodIssueCode.custom:
          message = `Invalid input`;
          break;
        case ZodIssueCode.invalid_intersection_types:
          message = `Intersection results could not be merged`;
          break;
        case ZodIssueCode.not_multiple_of:
          message = `Number must be a multiple of ${issue.multipleOf}`;
          break;
        case ZodIssueCode.not_finite:
          message = "Number must be finite";
          break;
        default:
          message = _ctx.defaultError;
          util.assertNever(issue);
      }
      return { message };
    };
    overrideErrorMap = errorMap;
    makeIssue = (params) => {
      const { data, path, errorMaps, issueData } = params;
      const fullPath = [...path, ...issueData.path || []];
      const fullIssue = {
        ...issueData,
        path: fullPath
      };
      if (issueData.message !== void 0) {
        return {
          ...issueData,
          path: fullPath,
          message: issueData.message
        };
      }
      let errorMessage = "";
      const maps = errorMaps.filter((m) => !!m).slice().reverse();
      for (const map of maps) {
        errorMessage = map(fullIssue, { data, defaultError: errorMessage }).message;
      }
      return {
        ...issueData,
        path: fullPath,
        message: errorMessage
      };
    };
    EMPTY_PATH = [];
    ParseStatus = class _ParseStatus {
      constructor() {
        this.value = "valid";
      }
      dirty() {
        if (this.value === "valid")
          this.value = "dirty";
      }
      abort() {
        if (this.value !== "aborted")
          this.value = "aborted";
      }
      static mergeArray(status, results) {
        const arrayValue = [];
        for (const s of results) {
          if (s.status === "aborted")
            return INVALID;
          if (s.status === "dirty")
            status.dirty();
          arrayValue.push(s.value);
        }
        return { status: status.value, value: arrayValue };
      }
      static async mergeObjectAsync(status, pairs) {
        const syncPairs = [];
        for (const pair of pairs) {
          const key = await pair.key;
          const value = await pair.value;
          syncPairs.push({
            key,
            value
          });
        }
        return _ParseStatus.mergeObjectSync(status, syncPairs);
      }
      static mergeObjectSync(status, pairs) {
        const finalObject = {};
        for (const pair of pairs) {
          const { key, value } = pair;
          if (key.status === "aborted")
            return INVALID;
          if (value.status === "aborted")
            return INVALID;
          if (key.status === "dirty")
            status.dirty();
          if (value.status === "dirty")
            status.dirty();
          if (key.value !== "__proto__" && (typeof value.value !== "undefined" || pair.alwaysSet)) {
            finalObject[key.value] = value.value;
          }
        }
        return { status: status.value, value: finalObject };
      }
    };
    INVALID = Object.freeze({
      status: "aborted"
    });
    DIRTY = (value) => ({ status: "dirty", value });
    OK = (value) => ({ status: "valid", value });
    isAborted = (x) => x.status === "aborted";
    isDirty = (x) => x.status === "dirty";
    isValid = (x) => x.status === "valid";
    isAsync = (x) => typeof Promise !== "undefined" && x instanceof Promise;
    (function(errorUtil2) {
      errorUtil2.errToObj = (message) => typeof message === "string" ? { message } : message || {};
      errorUtil2.toString = (message) => typeof message === "string" ? message : message === null || message === void 0 ? void 0 : message.message;
    })(errorUtil || (errorUtil = {}));
    ParseInputLazyPath = class {
      constructor(parent, value, path, key) {
        this._cachedPath = [];
        this.parent = parent;
        this.data = value;
        this._path = path;
        this._key = key;
      }
      get path() {
        if (!this._cachedPath.length) {
          if (this._key instanceof Array) {
            this._cachedPath.push(...this._path, ...this._key);
          } else {
            this._cachedPath.push(...this._path, this._key);
          }
        }
        return this._cachedPath;
      }
    };
    handleResult = (ctx, result) => {
      if (isValid(result)) {
        return { success: true, data: result.value };
      } else {
        if (!ctx.common.issues.length) {
          throw new Error("Validation failed but no issues detected.");
        }
        return {
          success: false,
          get error() {
            if (this._error)
              return this._error;
            const error = new ZodError(ctx.common.issues);
            this._error = error;
            return this._error;
          }
        };
      }
    };
    ZodType = class {
      constructor(def) {
        this.spa = this.safeParseAsync;
        this._def = def;
        this.parse = this.parse.bind(this);
        this.safeParse = this.safeParse.bind(this);
        this.parseAsync = this.parseAsync.bind(this);
        this.safeParseAsync = this.safeParseAsync.bind(this);
        this.spa = this.spa.bind(this);
        this.refine = this.refine.bind(this);
        this.refinement = this.refinement.bind(this);
        this.superRefine = this.superRefine.bind(this);
        this.optional = this.optional.bind(this);
        this.nullable = this.nullable.bind(this);
        this.nullish = this.nullish.bind(this);
        this.array = this.array.bind(this);
        this.promise = this.promise.bind(this);
        this.or = this.or.bind(this);
        this.and = this.and.bind(this);
        this.transform = this.transform.bind(this);
        this.brand = this.brand.bind(this);
        this.default = this.default.bind(this);
        this.catch = this.catch.bind(this);
        this.describe = this.describe.bind(this);
        this.pipe = this.pipe.bind(this);
        this.readonly = this.readonly.bind(this);
        this.isNullable = this.isNullable.bind(this);
        this.isOptional = this.isOptional.bind(this);
      }
      get description() {
        return this._def.description;
      }
      _getType(input) {
        return getParsedType(input.data);
      }
      _getOrReturnCtx(input, ctx) {
        return ctx || {
          common: input.parent.common,
          data: input.data,
          parsedType: getParsedType(input.data),
          schemaErrorMap: this._def.errorMap,
          path: input.path,
          parent: input.parent
        };
      }
      _processInputParams(input) {
        return {
          status: new ParseStatus(),
          ctx: {
            common: input.parent.common,
            data: input.data,
            parsedType: getParsedType(input.data),
            schemaErrorMap: this._def.errorMap,
            path: input.path,
            parent: input.parent
          }
        };
      }
      _parseSync(input) {
        const result = this._parse(input);
        if (isAsync(result)) {
          throw new Error("Synchronous parse encountered promise.");
        }
        return result;
      }
      _parseAsync(input) {
        const result = this._parse(input);
        return Promise.resolve(result);
      }
      parse(data, params) {
        const result = this.safeParse(data, params);
        if (result.success)
          return result.data;
        throw result.error;
      }
      safeParse(data, params) {
        var _a;
        const ctx = {
          common: {
            issues: [],
            async: (_a = params === null || params === void 0 ? void 0 : params.async) !== null && _a !== void 0 ? _a : false,
            contextualErrorMap: params === null || params === void 0 ? void 0 : params.errorMap
          },
          path: (params === null || params === void 0 ? void 0 : params.path) || [],
          schemaErrorMap: this._def.errorMap,
          parent: null,
          data,
          parsedType: getParsedType(data)
        };
        const result = this._parseSync({ data, path: ctx.path, parent: ctx });
        return handleResult(ctx, result);
      }
      async parseAsync(data, params) {
        const result = await this.safeParseAsync(data, params);
        if (result.success)
          return result.data;
        throw result.error;
      }
      async safeParseAsync(data, params) {
        const ctx = {
          common: {
            issues: [],
            contextualErrorMap: params === null || params === void 0 ? void 0 : params.errorMap,
            async: true
          },
          path: (params === null || params === void 0 ? void 0 : params.path) || [],
          schemaErrorMap: this._def.errorMap,
          parent: null,
          data,
          parsedType: getParsedType(data)
        };
        const maybeAsyncResult = this._parse({ data, path: ctx.path, parent: ctx });
        const result = await (isAsync(maybeAsyncResult) ? maybeAsyncResult : Promise.resolve(maybeAsyncResult));
        return handleResult(ctx, result);
      }
      refine(check, message) {
        const getIssueProperties = (val) => {
          if (typeof message === "string" || typeof message === "undefined") {
            return { message };
          } else if (typeof message === "function") {
            return message(val);
          } else {
            return message;
          }
        };
        return this._refinement((val, ctx) => {
          const result = check(val);
          const setError = () => ctx.addIssue({
            code: ZodIssueCode.custom,
            ...getIssueProperties(val)
          });
          if (typeof Promise !== "undefined" && result instanceof Promise) {
            return result.then((data) => {
              if (!data) {
                setError();
                return false;
              } else {
                return true;
              }
            });
          }
          if (!result) {
            setError();
            return false;
          } else {
            return true;
          }
        });
      }
      refinement(check, refinementData) {
        return this._refinement((val, ctx) => {
          if (!check(val)) {
            ctx.addIssue(typeof refinementData === "function" ? refinementData(val, ctx) : refinementData);
            return false;
          } else {
            return true;
          }
        });
      }
      _refinement(refinement) {
        return new ZodEffects({
          schema: this,
          typeName: ZodFirstPartyTypeKind.ZodEffects,
          effect: { type: "refinement", refinement }
        });
      }
      superRefine(refinement) {
        return this._refinement(refinement);
      }
      optional() {
        return ZodOptional.create(this, this._def);
      }
      nullable() {
        return ZodNullable.create(this, this._def);
      }
      nullish() {
        return this.nullable().optional();
      }
      array() {
        return ZodArray.create(this, this._def);
      }
      promise() {
        return ZodPromise.create(this, this._def);
      }
      or(option) {
        return ZodUnion.create([this, option], this._def);
      }
      and(incoming) {
        return ZodIntersection.create(this, incoming, this._def);
      }
      transform(transform) {
        return new ZodEffects({
          ...processCreateParams(this._def),
          schema: this,
          typeName: ZodFirstPartyTypeKind.ZodEffects,
          effect: { type: "transform", transform }
        });
      }
      default(def) {
        const defaultValueFunc = typeof def === "function" ? def : () => def;
        return new ZodDefault({
          ...processCreateParams(this._def),
          innerType: this,
          defaultValue: defaultValueFunc,
          typeName: ZodFirstPartyTypeKind.ZodDefault
        });
      }
      brand() {
        return new ZodBranded({
          typeName: ZodFirstPartyTypeKind.ZodBranded,
          type: this,
          ...processCreateParams(this._def)
        });
      }
      catch(def) {
        const catchValueFunc = typeof def === "function" ? def : () => def;
        return new ZodCatch({
          ...processCreateParams(this._def),
          innerType: this,
          catchValue: catchValueFunc,
          typeName: ZodFirstPartyTypeKind.ZodCatch
        });
      }
      describe(description) {
        const This = this.constructor;
        return new This({
          ...this._def,
          description
        });
      }
      pipe(target) {
        return ZodPipeline.create(this, target);
      }
      readonly() {
        return ZodReadonly.create(this);
      }
      isOptional() {
        return this.safeParse(void 0).success;
      }
      isNullable() {
        return this.safeParse(null).success;
      }
    };
    cuidRegex = /^c[^\s-]{8,}$/i;
    cuid2Regex = /^[0-9a-z]+$/;
    ulidRegex = /^[0-9A-HJKMNP-TV-Z]{26}$/;
    uuidRegex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i;
    nanoidRegex = /^[a-z0-9_-]{21}$/i;
    durationRegex = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/;
    emailRegex = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i;
    _emojiRegex = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
    ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
    ipv6Regex = /^(([a-f0-9]{1,4}:){7}|::([a-f0-9]{1,4}:){0,6}|([a-f0-9]{1,4}:){1}:([a-f0-9]{1,4}:){0,5}|([a-f0-9]{1,4}:){2}:([a-f0-9]{1,4}:){0,4}|([a-f0-9]{1,4}:){3}:([a-f0-9]{1,4}:){0,3}|([a-f0-9]{1,4}:){4}:([a-f0-9]{1,4}:){0,2}|([a-f0-9]{1,4}:){5}:([a-f0-9]{1,4}:){0,1})([a-f0-9]{1,4}|(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2})))$/;
    base64Regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
    dateRegexSource = `((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))`;
    dateRegex = new RegExp(`^${dateRegexSource}$`);
    ZodString = class _ZodString extends ZodType {
      _parse(input) {
        if (this._def.coerce) {
          input.data = String(input.data);
        }
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.string) {
          const ctx2 = this._getOrReturnCtx(input);
          addIssueToContext(ctx2, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.string,
            received: ctx2.parsedType
          });
          return INVALID;
        }
        const status = new ParseStatus();
        let ctx = void 0;
        for (const check of this._def.checks) {
          if (check.kind === "min") {
            if (input.data.length < check.value) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.too_small,
                minimum: check.value,
                type: "string",
                inclusive: true,
                exact: false,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "max") {
            if (input.data.length > check.value) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.too_big,
                maximum: check.value,
                type: "string",
                inclusive: true,
                exact: false,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "length") {
            const tooBig = input.data.length > check.value;
            const tooSmall = input.data.length < check.value;
            if (tooBig || tooSmall) {
              ctx = this._getOrReturnCtx(input, ctx);
              if (tooBig) {
                addIssueToContext(ctx, {
                  code: ZodIssueCode.too_big,
                  maximum: check.value,
                  type: "string",
                  inclusive: true,
                  exact: true,
                  message: check.message
                });
              } else if (tooSmall) {
                addIssueToContext(ctx, {
                  code: ZodIssueCode.too_small,
                  minimum: check.value,
                  type: "string",
                  inclusive: true,
                  exact: true,
                  message: check.message
                });
              }
              status.dirty();
            }
          } else if (check.kind === "email") {
            if (!emailRegex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "email",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "emoji") {
            if (!emojiRegex) {
              emojiRegex = new RegExp(_emojiRegex, "u");
            }
            if (!emojiRegex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "emoji",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "uuid") {
            if (!uuidRegex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "uuid",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "nanoid") {
            if (!nanoidRegex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "nanoid",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "cuid") {
            if (!cuidRegex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "cuid",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "cuid2") {
            if (!cuid2Regex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "cuid2",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "ulid") {
            if (!ulidRegex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "ulid",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "url") {
            try {
              new URL(input.data);
            } catch (_a) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "url",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "regex") {
            check.regex.lastIndex = 0;
            const testResult = check.regex.test(input.data);
            if (!testResult) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "regex",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "trim") {
            input.data = input.data.trim();
          } else if (check.kind === "includes") {
            if (!input.data.includes(check.value, check.position)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_string,
                validation: { includes: check.value, position: check.position },
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "toLowerCase") {
            input.data = input.data.toLowerCase();
          } else if (check.kind === "toUpperCase") {
            input.data = input.data.toUpperCase();
          } else if (check.kind === "startsWith") {
            if (!input.data.startsWith(check.value)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_string,
                validation: { startsWith: check.value },
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "endsWith") {
            if (!input.data.endsWith(check.value)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_string,
                validation: { endsWith: check.value },
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "datetime") {
            const regex = datetimeRegex(check);
            if (!regex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_string,
                validation: "datetime",
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "date") {
            const regex = dateRegex;
            if (!regex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_string,
                validation: "date",
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "time") {
            const regex = timeRegex(check);
            if (!regex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_string,
                validation: "time",
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "duration") {
            if (!durationRegex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "duration",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "ip") {
            if (!isValidIP(input.data, check.version)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "ip",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "base64") {
            if (!base64Regex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "base64",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else {
            util.assertNever(check);
          }
        }
        return { status: status.value, value: input.data };
      }
      _regex(regex, validation, message) {
        return this.refinement((data) => regex.test(data), {
          validation,
          code: ZodIssueCode.invalid_string,
          ...errorUtil.errToObj(message)
        });
      }
      _addCheck(check) {
        return new _ZodString({
          ...this._def,
          checks: [...this._def.checks, check]
        });
      }
      email(message) {
        return this._addCheck({ kind: "email", ...errorUtil.errToObj(message) });
      }
      url(message) {
        return this._addCheck({ kind: "url", ...errorUtil.errToObj(message) });
      }
      emoji(message) {
        return this._addCheck({ kind: "emoji", ...errorUtil.errToObj(message) });
      }
      uuid(message) {
        return this._addCheck({ kind: "uuid", ...errorUtil.errToObj(message) });
      }
      nanoid(message) {
        return this._addCheck({ kind: "nanoid", ...errorUtil.errToObj(message) });
      }
      cuid(message) {
        return this._addCheck({ kind: "cuid", ...errorUtil.errToObj(message) });
      }
      cuid2(message) {
        return this._addCheck({ kind: "cuid2", ...errorUtil.errToObj(message) });
      }
      ulid(message) {
        return this._addCheck({ kind: "ulid", ...errorUtil.errToObj(message) });
      }
      base64(message) {
        return this._addCheck({ kind: "base64", ...errorUtil.errToObj(message) });
      }
      ip(options) {
        return this._addCheck({ kind: "ip", ...errorUtil.errToObj(options) });
      }
      datetime(options) {
        var _a, _b;
        if (typeof options === "string") {
          return this._addCheck({
            kind: "datetime",
            precision: null,
            offset: false,
            local: false,
            message: options
          });
        }
        return this._addCheck({
          kind: "datetime",
          precision: typeof (options === null || options === void 0 ? void 0 : options.precision) === "undefined" ? null : options === null || options === void 0 ? void 0 : options.precision,
          offset: (_a = options === null || options === void 0 ? void 0 : options.offset) !== null && _a !== void 0 ? _a : false,
          local: (_b = options === null || options === void 0 ? void 0 : options.local) !== null && _b !== void 0 ? _b : false,
          ...errorUtil.errToObj(options === null || options === void 0 ? void 0 : options.message)
        });
      }
      date(message) {
        return this._addCheck({ kind: "date", message });
      }
      time(options) {
        if (typeof options === "string") {
          return this._addCheck({
            kind: "time",
            precision: null,
            message: options
          });
        }
        return this._addCheck({
          kind: "time",
          precision: typeof (options === null || options === void 0 ? void 0 : options.precision) === "undefined" ? null : options === null || options === void 0 ? void 0 : options.precision,
          ...errorUtil.errToObj(options === null || options === void 0 ? void 0 : options.message)
        });
      }
      duration(message) {
        return this._addCheck({ kind: "duration", ...errorUtil.errToObj(message) });
      }
      regex(regex, message) {
        return this._addCheck({
          kind: "regex",
          regex,
          ...errorUtil.errToObj(message)
        });
      }
      includes(value, options) {
        return this._addCheck({
          kind: "includes",
          value,
          position: options === null || options === void 0 ? void 0 : options.position,
          ...errorUtil.errToObj(options === null || options === void 0 ? void 0 : options.message)
        });
      }
      startsWith(value, message) {
        return this._addCheck({
          kind: "startsWith",
          value,
          ...errorUtil.errToObj(message)
        });
      }
      endsWith(value, message) {
        return this._addCheck({
          kind: "endsWith",
          value,
          ...errorUtil.errToObj(message)
        });
      }
      min(minLength, message) {
        return this._addCheck({
          kind: "min",
          value: minLength,
          ...errorUtil.errToObj(message)
        });
      }
      max(maxLength, message) {
        return this._addCheck({
          kind: "max",
          value: maxLength,
          ...errorUtil.errToObj(message)
        });
      }
      length(len, message) {
        return this._addCheck({
          kind: "length",
          value: len,
          ...errorUtil.errToObj(message)
        });
      }
      /**
       * @deprecated Use z.string().min(1) instead.
       * @see {@link ZodString.min}
       */
      nonempty(message) {
        return this.min(1, errorUtil.errToObj(message));
      }
      trim() {
        return new _ZodString({
          ...this._def,
          checks: [...this._def.checks, { kind: "trim" }]
        });
      }
      toLowerCase() {
        return new _ZodString({
          ...this._def,
          checks: [...this._def.checks, { kind: "toLowerCase" }]
        });
      }
      toUpperCase() {
        return new _ZodString({
          ...this._def,
          checks: [...this._def.checks, { kind: "toUpperCase" }]
        });
      }
      get isDatetime() {
        return !!this._def.checks.find((ch) => ch.kind === "datetime");
      }
      get isDate() {
        return !!this._def.checks.find((ch) => ch.kind === "date");
      }
      get isTime() {
        return !!this._def.checks.find((ch) => ch.kind === "time");
      }
      get isDuration() {
        return !!this._def.checks.find((ch) => ch.kind === "duration");
      }
      get isEmail() {
        return !!this._def.checks.find((ch) => ch.kind === "email");
      }
      get isURL() {
        return !!this._def.checks.find((ch) => ch.kind === "url");
      }
      get isEmoji() {
        return !!this._def.checks.find((ch) => ch.kind === "emoji");
      }
      get isUUID() {
        return !!this._def.checks.find((ch) => ch.kind === "uuid");
      }
      get isNANOID() {
        return !!this._def.checks.find((ch) => ch.kind === "nanoid");
      }
      get isCUID() {
        return !!this._def.checks.find((ch) => ch.kind === "cuid");
      }
      get isCUID2() {
        return !!this._def.checks.find((ch) => ch.kind === "cuid2");
      }
      get isULID() {
        return !!this._def.checks.find((ch) => ch.kind === "ulid");
      }
      get isIP() {
        return !!this._def.checks.find((ch) => ch.kind === "ip");
      }
      get isBase64() {
        return !!this._def.checks.find((ch) => ch.kind === "base64");
      }
      get minLength() {
        let min = null;
        for (const ch of this._def.checks) {
          if (ch.kind === "min") {
            if (min === null || ch.value > min)
              min = ch.value;
          }
        }
        return min;
      }
      get maxLength() {
        let max = null;
        for (const ch of this._def.checks) {
          if (ch.kind === "max") {
            if (max === null || ch.value < max)
              max = ch.value;
          }
        }
        return max;
      }
    };
    ZodString.create = (params) => {
      var _a;
      return new ZodString({
        checks: [],
        typeName: ZodFirstPartyTypeKind.ZodString,
        coerce: (_a = params === null || params === void 0 ? void 0 : params.coerce) !== null && _a !== void 0 ? _a : false,
        ...processCreateParams(params)
      });
    };
    ZodNumber = class _ZodNumber extends ZodType {
      constructor() {
        super(...arguments);
        this.min = this.gte;
        this.max = this.lte;
        this.step = this.multipleOf;
      }
      _parse(input) {
        if (this._def.coerce) {
          input.data = Number(input.data);
        }
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.number) {
          const ctx2 = this._getOrReturnCtx(input);
          addIssueToContext(ctx2, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.number,
            received: ctx2.parsedType
          });
          return INVALID;
        }
        let ctx = void 0;
        const status = new ParseStatus();
        for (const check of this._def.checks) {
          if (check.kind === "int") {
            if (!util.isInteger(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_type,
                expected: "integer",
                received: "float",
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "min") {
            const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
            if (tooSmall) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.too_small,
                minimum: check.value,
                type: "number",
                inclusive: check.inclusive,
                exact: false,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "max") {
            const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
            if (tooBig) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.too_big,
                maximum: check.value,
                type: "number",
                inclusive: check.inclusive,
                exact: false,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "multipleOf") {
            if (floatSafeRemainder(input.data, check.value) !== 0) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.not_multiple_of,
                multipleOf: check.value,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "finite") {
            if (!Number.isFinite(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.not_finite,
                message: check.message
              });
              status.dirty();
            }
          } else {
            util.assertNever(check);
          }
        }
        return { status: status.value, value: input.data };
      }
      gte(value, message) {
        return this.setLimit("min", value, true, errorUtil.toString(message));
      }
      gt(value, message) {
        return this.setLimit("min", value, false, errorUtil.toString(message));
      }
      lte(value, message) {
        return this.setLimit("max", value, true, errorUtil.toString(message));
      }
      lt(value, message) {
        return this.setLimit("max", value, false, errorUtil.toString(message));
      }
      setLimit(kind, value, inclusive, message) {
        return new _ZodNumber({
          ...this._def,
          checks: [
            ...this._def.checks,
            {
              kind,
              value,
              inclusive,
              message: errorUtil.toString(message)
            }
          ]
        });
      }
      _addCheck(check) {
        return new _ZodNumber({
          ...this._def,
          checks: [...this._def.checks, check]
        });
      }
      int(message) {
        return this._addCheck({
          kind: "int",
          message: errorUtil.toString(message)
        });
      }
      positive(message) {
        return this._addCheck({
          kind: "min",
          value: 0,
          inclusive: false,
          message: errorUtil.toString(message)
        });
      }
      negative(message) {
        return this._addCheck({
          kind: "max",
          value: 0,
          inclusive: false,
          message: errorUtil.toString(message)
        });
      }
      nonpositive(message) {
        return this._addCheck({
          kind: "max",
          value: 0,
          inclusive: true,
          message: errorUtil.toString(message)
        });
      }
      nonnegative(message) {
        return this._addCheck({
          kind: "min",
          value: 0,
          inclusive: true,
          message: errorUtil.toString(message)
        });
      }
      multipleOf(value, message) {
        return this._addCheck({
          kind: "multipleOf",
          value,
          message: errorUtil.toString(message)
        });
      }
      finite(message) {
        return this._addCheck({
          kind: "finite",
          message: errorUtil.toString(message)
        });
      }
      safe(message) {
        return this._addCheck({
          kind: "min",
          inclusive: true,
          value: Number.MIN_SAFE_INTEGER,
          message: errorUtil.toString(message)
        })._addCheck({
          kind: "max",
          inclusive: true,
          value: Number.MAX_SAFE_INTEGER,
          message: errorUtil.toString(message)
        });
      }
      get minValue() {
        let min = null;
        for (const ch of this._def.checks) {
          if (ch.kind === "min") {
            if (min === null || ch.value > min)
              min = ch.value;
          }
        }
        return min;
      }
      get maxValue() {
        let max = null;
        for (const ch of this._def.checks) {
          if (ch.kind === "max") {
            if (max === null || ch.value < max)
              max = ch.value;
          }
        }
        return max;
      }
      get isInt() {
        return !!this._def.checks.find((ch) => ch.kind === "int" || ch.kind === "multipleOf" && util.isInteger(ch.value));
      }
      get isFinite() {
        let max = null, min = null;
        for (const ch of this._def.checks) {
          if (ch.kind === "finite" || ch.kind === "int" || ch.kind === "multipleOf") {
            return true;
          } else if (ch.kind === "min") {
            if (min === null || ch.value > min)
              min = ch.value;
          } else if (ch.kind === "max") {
            if (max === null || ch.value < max)
              max = ch.value;
          }
        }
        return Number.isFinite(min) && Number.isFinite(max);
      }
    };
    ZodNumber.create = (params) => {
      return new ZodNumber({
        checks: [],
        typeName: ZodFirstPartyTypeKind.ZodNumber,
        coerce: (params === null || params === void 0 ? void 0 : params.coerce) || false,
        ...processCreateParams(params)
      });
    };
    ZodBigInt = class _ZodBigInt extends ZodType {
      constructor() {
        super(...arguments);
        this.min = this.gte;
        this.max = this.lte;
      }
      _parse(input) {
        if (this._def.coerce) {
          input.data = BigInt(input.data);
        }
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.bigint) {
          const ctx2 = this._getOrReturnCtx(input);
          addIssueToContext(ctx2, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.bigint,
            received: ctx2.parsedType
          });
          return INVALID;
        }
        let ctx = void 0;
        const status = new ParseStatus();
        for (const check of this._def.checks) {
          if (check.kind === "min") {
            const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
            if (tooSmall) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.too_small,
                type: "bigint",
                minimum: check.value,
                inclusive: check.inclusive,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "max") {
            const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
            if (tooBig) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.too_big,
                type: "bigint",
                maximum: check.value,
                inclusive: check.inclusive,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "multipleOf") {
            if (input.data % check.value !== BigInt(0)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.not_multiple_of,
                multipleOf: check.value,
                message: check.message
              });
              status.dirty();
            }
          } else {
            util.assertNever(check);
          }
        }
        return { status: status.value, value: input.data };
      }
      gte(value, message) {
        return this.setLimit("min", value, true, errorUtil.toString(message));
      }
      gt(value, message) {
        return this.setLimit("min", value, false, errorUtil.toString(message));
      }
      lte(value, message) {
        return this.setLimit("max", value, true, errorUtil.toString(message));
      }
      lt(value, message) {
        return this.setLimit("max", value, false, errorUtil.toString(message));
      }
      setLimit(kind, value, inclusive, message) {
        return new _ZodBigInt({
          ...this._def,
          checks: [
            ...this._def.checks,
            {
              kind,
              value,
              inclusive,
              message: errorUtil.toString(message)
            }
          ]
        });
      }
      _addCheck(check) {
        return new _ZodBigInt({
          ...this._def,
          checks: [...this._def.checks, check]
        });
      }
      positive(message) {
        return this._addCheck({
          kind: "min",
          value: BigInt(0),
          inclusive: false,
          message: errorUtil.toString(message)
        });
      }
      negative(message) {
        return this._addCheck({
          kind: "max",
          value: BigInt(0),
          inclusive: false,
          message: errorUtil.toString(message)
        });
      }
      nonpositive(message) {
        return this._addCheck({
          kind: "max",
          value: BigInt(0),
          inclusive: true,
          message: errorUtil.toString(message)
        });
      }
      nonnegative(message) {
        return this._addCheck({
          kind: "min",
          value: BigInt(0),
          inclusive: true,
          message: errorUtil.toString(message)
        });
      }
      multipleOf(value, message) {
        return this._addCheck({
          kind: "multipleOf",
          value,
          message: errorUtil.toString(message)
        });
      }
      get minValue() {
        let min = null;
        for (const ch of this._def.checks) {
          if (ch.kind === "min") {
            if (min === null || ch.value > min)
              min = ch.value;
          }
        }
        return min;
      }
      get maxValue() {
        let max = null;
        for (const ch of this._def.checks) {
          if (ch.kind === "max") {
            if (max === null || ch.value < max)
              max = ch.value;
          }
        }
        return max;
      }
    };
    ZodBigInt.create = (params) => {
      var _a;
      return new ZodBigInt({
        checks: [],
        typeName: ZodFirstPartyTypeKind.ZodBigInt,
        coerce: (_a = params === null || params === void 0 ? void 0 : params.coerce) !== null && _a !== void 0 ? _a : false,
        ...processCreateParams(params)
      });
    };
    ZodBoolean = class extends ZodType {
      _parse(input) {
        if (this._def.coerce) {
          input.data = Boolean(input.data);
        }
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.boolean) {
          const ctx = this._getOrReturnCtx(input);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.boolean,
            received: ctx.parsedType
          });
          return INVALID;
        }
        return OK(input.data);
      }
    };
    ZodBoolean.create = (params) => {
      return new ZodBoolean({
        typeName: ZodFirstPartyTypeKind.ZodBoolean,
        coerce: (params === null || params === void 0 ? void 0 : params.coerce) || false,
        ...processCreateParams(params)
      });
    };
    ZodDate = class _ZodDate extends ZodType {
      _parse(input) {
        if (this._def.coerce) {
          input.data = new Date(input.data);
        }
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.date) {
          const ctx2 = this._getOrReturnCtx(input);
          addIssueToContext(ctx2, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.date,
            received: ctx2.parsedType
          });
          return INVALID;
        }
        if (isNaN(input.data.getTime())) {
          const ctx2 = this._getOrReturnCtx(input);
          addIssueToContext(ctx2, {
            code: ZodIssueCode.invalid_date
          });
          return INVALID;
        }
        const status = new ParseStatus();
        let ctx = void 0;
        for (const check of this._def.checks) {
          if (check.kind === "min") {
            if (input.data.getTime() < check.value) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.too_small,
                message: check.message,
                inclusive: true,
                exact: false,
                minimum: check.value,
                type: "date"
              });
              status.dirty();
            }
          } else if (check.kind === "max") {
            if (input.data.getTime() > check.value) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.too_big,
                message: check.message,
                inclusive: true,
                exact: false,
                maximum: check.value,
                type: "date"
              });
              status.dirty();
            }
          } else {
            util.assertNever(check);
          }
        }
        return {
          status: status.value,
          value: new Date(input.data.getTime())
        };
      }
      _addCheck(check) {
        return new _ZodDate({
          ...this._def,
          checks: [...this._def.checks, check]
        });
      }
      min(minDate, message) {
        return this._addCheck({
          kind: "min",
          value: minDate.getTime(),
          message: errorUtil.toString(message)
        });
      }
      max(maxDate, message) {
        return this._addCheck({
          kind: "max",
          value: maxDate.getTime(),
          message: errorUtil.toString(message)
        });
      }
      get minDate() {
        let min = null;
        for (const ch of this._def.checks) {
          if (ch.kind === "min") {
            if (min === null || ch.value > min)
              min = ch.value;
          }
        }
        return min != null ? new Date(min) : null;
      }
      get maxDate() {
        let max = null;
        for (const ch of this._def.checks) {
          if (ch.kind === "max") {
            if (max === null || ch.value < max)
              max = ch.value;
          }
        }
        return max != null ? new Date(max) : null;
      }
    };
    ZodDate.create = (params) => {
      return new ZodDate({
        checks: [],
        coerce: (params === null || params === void 0 ? void 0 : params.coerce) || false,
        typeName: ZodFirstPartyTypeKind.ZodDate,
        ...processCreateParams(params)
      });
    };
    ZodSymbol = class extends ZodType {
      _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.symbol) {
          const ctx = this._getOrReturnCtx(input);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.symbol,
            received: ctx.parsedType
          });
          return INVALID;
        }
        return OK(input.data);
      }
    };
    ZodSymbol.create = (params) => {
      return new ZodSymbol({
        typeName: ZodFirstPartyTypeKind.ZodSymbol,
        ...processCreateParams(params)
      });
    };
    ZodUndefined = class extends ZodType {
      _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.undefined) {
          const ctx = this._getOrReturnCtx(input);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.undefined,
            received: ctx.parsedType
          });
          return INVALID;
        }
        return OK(input.data);
      }
    };
    ZodUndefined.create = (params) => {
      return new ZodUndefined({
        typeName: ZodFirstPartyTypeKind.ZodUndefined,
        ...processCreateParams(params)
      });
    };
    ZodNull = class extends ZodType {
      _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.null) {
          const ctx = this._getOrReturnCtx(input);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.null,
            received: ctx.parsedType
          });
          return INVALID;
        }
        return OK(input.data);
      }
    };
    ZodNull.create = (params) => {
      return new ZodNull({
        typeName: ZodFirstPartyTypeKind.ZodNull,
        ...processCreateParams(params)
      });
    };
    ZodAny = class extends ZodType {
      constructor() {
        super(...arguments);
        this._any = true;
      }
      _parse(input) {
        return OK(input.data);
      }
    };
    ZodAny.create = (params) => {
      return new ZodAny({
        typeName: ZodFirstPartyTypeKind.ZodAny,
        ...processCreateParams(params)
      });
    };
    ZodUnknown = class extends ZodType {
      constructor() {
        super(...arguments);
        this._unknown = true;
      }
      _parse(input) {
        return OK(input.data);
      }
    };
    ZodUnknown.create = (params) => {
      return new ZodUnknown({
        typeName: ZodFirstPartyTypeKind.ZodUnknown,
        ...processCreateParams(params)
      });
    };
    ZodNever = class extends ZodType {
      _parse(input) {
        const ctx = this._getOrReturnCtx(input);
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.never,
          received: ctx.parsedType
        });
        return INVALID;
      }
    };
    ZodNever.create = (params) => {
      return new ZodNever({
        typeName: ZodFirstPartyTypeKind.ZodNever,
        ...processCreateParams(params)
      });
    };
    ZodVoid = class extends ZodType {
      _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.undefined) {
          const ctx = this._getOrReturnCtx(input);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.void,
            received: ctx.parsedType
          });
          return INVALID;
        }
        return OK(input.data);
      }
    };
    ZodVoid.create = (params) => {
      return new ZodVoid({
        typeName: ZodFirstPartyTypeKind.ZodVoid,
        ...processCreateParams(params)
      });
    };
    ZodArray = class _ZodArray extends ZodType {
      _parse(input) {
        const { ctx, status } = this._processInputParams(input);
        const def = this._def;
        if (ctx.parsedType !== ZodParsedType.array) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.array,
            received: ctx.parsedType
          });
          return INVALID;
        }
        if (def.exactLength !== null) {
          const tooBig = ctx.data.length > def.exactLength.value;
          const tooSmall = ctx.data.length < def.exactLength.value;
          if (tooBig || tooSmall) {
            addIssueToContext(ctx, {
              code: tooBig ? ZodIssueCode.too_big : ZodIssueCode.too_small,
              minimum: tooSmall ? def.exactLength.value : void 0,
              maximum: tooBig ? def.exactLength.value : void 0,
              type: "array",
              inclusive: true,
              exact: true,
              message: def.exactLength.message
            });
            status.dirty();
          }
        }
        if (def.minLength !== null) {
          if (ctx.data.length < def.minLength.value) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_small,
              minimum: def.minLength.value,
              type: "array",
              inclusive: true,
              exact: false,
              message: def.minLength.message
            });
            status.dirty();
          }
        }
        if (def.maxLength !== null) {
          if (ctx.data.length > def.maxLength.value) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_big,
              maximum: def.maxLength.value,
              type: "array",
              inclusive: true,
              exact: false,
              message: def.maxLength.message
            });
            status.dirty();
          }
        }
        if (ctx.common.async) {
          return Promise.all([...ctx.data].map((item, i) => {
            return def.type._parseAsync(new ParseInputLazyPath(ctx, item, ctx.path, i));
          })).then((result2) => {
            return ParseStatus.mergeArray(status, result2);
          });
        }
        const result = [...ctx.data].map((item, i) => {
          return def.type._parseSync(new ParseInputLazyPath(ctx, item, ctx.path, i));
        });
        return ParseStatus.mergeArray(status, result);
      }
      get element() {
        return this._def.type;
      }
      min(minLength, message) {
        return new _ZodArray({
          ...this._def,
          minLength: { value: minLength, message: errorUtil.toString(message) }
        });
      }
      max(maxLength, message) {
        return new _ZodArray({
          ...this._def,
          maxLength: { value: maxLength, message: errorUtil.toString(message) }
        });
      }
      length(len, message) {
        return new _ZodArray({
          ...this._def,
          exactLength: { value: len, message: errorUtil.toString(message) }
        });
      }
      nonempty(message) {
        return this.min(1, message);
      }
    };
    ZodArray.create = (schema, params) => {
      return new ZodArray({
        type: schema,
        minLength: null,
        maxLength: null,
        exactLength: null,
        typeName: ZodFirstPartyTypeKind.ZodArray,
        ...processCreateParams(params)
      });
    };
    ZodObject = class _ZodObject extends ZodType {
      constructor() {
        super(...arguments);
        this._cached = null;
        this.nonstrict = this.passthrough;
        this.augment = this.extend;
      }
      _getCached() {
        if (this._cached !== null)
          return this._cached;
        const shape2 = this._def.shape();
        const keys = util.objectKeys(shape2);
        return this._cached = { shape: shape2, keys };
      }
      _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.object) {
          const ctx2 = this._getOrReturnCtx(input);
          addIssueToContext(ctx2, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.object,
            received: ctx2.parsedType
          });
          return INVALID;
        }
        const { status, ctx } = this._processInputParams(input);
        const { shape: shape2, keys: shapeKeys } = this._getCached();
        const extraKeys = [];
        if (!(this._def.catchall instanceof ZodNever && this._def.unknownKeys === "strip")) {
          for (const key in ctx.data) {
            if (!shapeKeys.includes(key)) {
              extraKeys.push(key);
            }
          }
        }
        const pairs = [];
        for (const key of shapeKeys) {
          const keyValidator = shape2[key];
          const value = ctx.data[key];
          pairs.push({
            key: { status: "valid", value: key },
            value: keyValidator._parse(new ParseInputLazyPath(ctx, value, ctx.path, key)),
            alwaysSet: key in ctx.data
          });
        }
        if (this._def.catchall instanceof ZodNever) {
          const unknownKeys = this._def.unknownKeys;
          if (unknownKeys === "passthrough") {
            for (const key of extraKeys) {
              pairs.push({
                key: { status: "valid", value: key },
                value: { status: "valid", value: ctx.data[key] }
              });
            }
          } else if (unknownKeys === "strict") {
            if (extraKeys.length > 0) {
              addIssueToContext(ctx, {
                code: ZodIssueCode.unrecognized_keys,
                keys: extraKeys
              });
              status.dirty();
            }
          } else if (unknownKeys === "strip") ;
          else {
            throw new Error(`Internal ZodObject error: invalid unknownKeys value.`);
          }
        } else {
          const catchall = this._def.catchall;
          for (const key of extraKeys) {
            const value = ctx.data[key];
            pairs.push({
              key: { status: "valid", value: key },
              value: catchall._parse(
                new ParseInputLazyPath(ctx, value, ctx.path, key)
                //, ctx.child(key), value, getParsedType(value)
              ),
              alwaysSet: key in ctx.data
            });
          }
        }
        if (ctx.common.async) {
          return Promise.resolve().then(async () => {
            const syncPairs = [];
            for (const pair of pairs) {
              const key = await pair.key;
              const value = await pair.value;
              syncPairs.push({
                key,
                value,
                alwaysSet: pair.alwaysSet
              });
            }
            return syncPairs;
          }).then((syncPairs) => {
            return ParseStatus.mergeObjectSync(status, syncPairs);
          });
        } else {
          return ParseStatus.mergeObjectSync(status, pairs);
        }
      }
      get shape() {
        return this._def.shape();
      }
      strict(message) {
        errorUtil.errToObj;
        return new _ZodObject({
          ...this._def,
          unknownKeys: "strict",
          ...message !== void 0 ? {
            errorMap: (issue, ctx) => {
              var _a, _b, _c, _d;
              const defaultError = (_c = (_b = (_a = this._def).errorMap) === null || _b === void 0 ? void 0 : _b.call(_a, issue, ctx).message) !== null && _c !== void 0 ? _c : ctx.defaultError;
              if (issue.code === "unrecognized_keys")
                return {
                  message: (_d = errorUtil.errToObj(message).message) !== null && _d !== void 0 ? _d : defaultError
                };
              return {
                message: defaultError
              };
            }
          } : {}
        });
      }
      strip() {
        return new _ZodObject({
          ...this._def,
          unknownKeys: "strip"
        });
      }
      passthrough() {
        return new _ZodObject({
          ...this._def,
          unknownKeys: "passthrough"
        });
      }
      // const AugmentFactory =
      //   <Def extends ZodObjectDef>(def: Def) =>
      //   <Augmentation extends ZodRawShape>(
      //     augmentation: Augmentation
      //   ): ZodObject<
      //     extendShape<ReturnType<Def["shape"]>, Augmentation>,
      //     Def["unknownKeys"],
      //     Def["catchall"]
      //   > => {
      //     return new ZodObject({
      //       ...def,
      //       shape: () => ({
      //         ...def.shape(),
      //         ...augmentation,
      //       }),
      //     }) as any;
      //   };
      extend(augmentation) {
        return new _ZodObject({
          ...this._def,
          shape: () => ({
            ...this._def.shape(),
            ...augmentation
          })
        });
      }
      /**
       * Prior to zod@1.0.12 there was a bug in the
       * inferred type of merged objects. Please
       * upgrade if you are experiencing issues.
       */
      merge(merging) {
        const merged = new _ZodObject({
          unknownKeys: merging._def.unknownKeys,
          catchall: merging._def.catchall,
          shape: () => ({
            ...this._def.shape(),
            ...merging._def.shape()
          }),
          typeName: ZodFirstPartyTypeKind.ZodObject
        });
        return merged;
      }
      // merge<
      //   Incoming extends AnyZodObject,
      //   Augmentation extends Incoming["shape"],
      //   NewOutput extends {
      //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
      //       ? Augmentation[k]["_output"]
      //       : k extends keyof Output
      //       ? Output[k]
      //       : never;
      //   },
      //   NewInput extends {
      //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
      //       ? Augmentation[k]["_input"]
      //       : k extends keyof Input
      //       ? Input[k]
      //       : never;
      //   }
      // >(
      //   merging: Incoming
      // ): ZodObject<
      //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
      //   Incoming["_def"]["unknownKeys"],
      //   Incoming["_def"]["catchall"],
      //   NewOutput,
      //   NewInput
      // > {
      //   const merged: any = new ZodObject({
      //     unknownKeys: merging._def.unknownKeys,
      //     catchall: merging._def.catchall,
      //     shape: () =>
      //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
      //     typeName: ZodFirstPartyTypeKind.ZodObject,
      //   }) as any;
      //   return merged;
      // }
      setKey(key, schema) {
        return this.augment({ [key]: schema });
      }
      // merge<Incoming extends AnyZodObject>(
      //   merging: Incoming
      // ): //ZodObject<T & Incoming["_shape"], UnknownKeys, Catchall> = (merging) => {
      // ZodObject<
      //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
      //   Incoming["_def"]["unknownKeys"],
      //   Incoming["_def"]["catchall"]
      // > {
      //   // const mergedShape = objectUtil.mergeShapes(
      //   //   this._def.shape(),
      //   //   merging._def.shape()
      //   // );
      //   const merged: any = new ZodObject({
      //     unknownKeys: merging._def.unknownKeys,
      //     catchall: merging._def.catchall,
      //     shape: () =>
      //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
      //     typeName: ZodFirstPartyTypeKind.ZodObject,
      //   }) as any;
      //   return merged;
      // }
      catchall(index) {
        return new _ZodObject({
          ...this._def,
          catchall: index
        });
      }
      pick(mask) {
        const shape2 = {};
        util.objectKeys(mask).forEach((key) => {
          if (mask[key] && this.shape[key]) {
            shape2[key] = this.shape[key];
          }
        });
        return new _ZodObject({
          ...this._def,
          shape: () => shape2
        });
      }
      omit(mask) {
        const shape2 = {};
        util.objectKeys(this.shape).forEach((key) => {
          if (!mask[key]) {
            shape2[key] = this.shape[key];
          }
        });
        return new _ZodObject({
          ...this._def,
          shape: () => shape2
        });
      }
      /**
       * @deprecated
       */
      deepPartial() {
        return deepPartialify(this);
      }
      partial(mask) {
        const newShape = {};
        util.objectKeys(this.shape).forEach((key) => {
          const fieldSchema = this.shape[key];
          if (mask && !mask[key]) {
            newShape[key] = fieldSchema;
          } else {
            newShape[key] = fieldSchema.optional();
          }
        });
        return new _ZodObject({
          ...this._def,
          shape: () => newShape
        });
      }
      required(mask) {
        const newShape = {};
        util.objectKeys(this.shape).forEach((key) => {
          if (mask && !mask[key]) {
            newShape[key] = this.shape[key];
          } else {
            const fieldSchema = this.shape[key];
            let newField = fieldSchema;
            while (newField instanceof ZodOptional) {
              newField = newField._def.innerType;
            }
            newShape[key] = newField;
          }
        });
        return new _ZodObject({
          ...this._def,
          shape: () => newShape
        });
      }
      keyof() {
        return createZodEnum(util.objectKeys(this.shape));
      }
    };
    ZodObject.create = (shape2, params) => {
      return new ZodObject({
        shape: () => shape2,
        unknownKeys: "strip",
        catchall: ZodNever.create(),
        typeName: ZodFirstPartyTypeKind.ZodObject,
        ...processCreateParams(params)
      });
    };
    ZodObject.strictCreate = (shape2, params) => {
      return new ZodObject({
        shape: () => shape2,
        unknownKeys: "strict",
        catchall: ZodNever.create(),
        typeName: ZodFirstPartyTypeKind.ZodObject,
        ...processCreateParams(params)
      });
    };
    ZodObject.lazycreate = (shape2, params) => {
      return new ZodObject({
        shape: shape2,
        unknownKeys: "strip",
        catchall: ZodNever.create(),
        typeName: ZodFirstPartyTypeKind.ZodObject,
        ...processCreateParams(params)
      });
    };
    ZodUnion = class extends ZodType {
      _parse(input) {
        const { ctx } = this._processInputParams(input);
        const options = this._def.options;
        function handleResults(results) {
          for (const result of results) {
            if (result.result.status === "valid") {
              return result.result;
            }
          }
          for (const result of results) {
            if (result.result.status === "dirty") {
              ctx.common.issues.push(...result.ctx.common.issues);
              return result.result;
            }
          }
          const unionErrors = results.map((result) => new ZodError(result.ctx.common.issues));
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_union,
            unionErrors
          });
          return INVALID;
        }
        if (ctx.common.async) {
          return Promise.all(options.map(async (option) => {
            const childCtx = {
              ...ctx,
              common: {
                ...ctx.common,
                issues: []
              },
              parent: null
            };
            return {
              result: await option._parseAsync({
                data: ctx.data,
                path: ctx.path,
                parent: childCtx
              }),
              ctx: childCtx
            };
          })).then(handleResults);
        } else {
          let dirty = void 0;
          const issues = [];
          for (const option of options) {
            const childCtx = {
              ...ctx,
              common: {
                ...ctx.common,
                issues: []
              },
              parent: null
            };
            const result = option._parseSync({
              data: ctx.data,
              path: ctx.path,
              parent: childCtx
            });
            if (result.status === "valid") {
              return result;
            } else if (result.status === "dirty" && !dirty) {
              dirty = { result, ctx: childCtx };
            }
            if (childCtx.common.issues.length) {
              issues.push(childCtx.common.issues);
            }
          }
          if (dirty) {
            ctx.common.issues.push(...dirty.ctx.common.issues);
            return dirty.result;
          }
          const unionErrors = issues.map((issues2) => new ZodError(issues2));
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_union,
            unionErrors
          });
          return INVALID;
        }
      }
      get options() {
        return this._def.options;
      }
    };
    ZodUnion.create = (types, params) => {
      return new ZodUnion({
        options: types,
        typeName: ZodFirstPartyTypeKind.ZodUnion,
        ...processCreateParams(params)
      });
    };
    getDiscriminator = (type) => {
      if (type instanceof ZodLazy) {
        return getDiscriminator(type.schema);
      } else if (type instanceof ZodEffects) {
        return getDiscriminator(type.innerType());
      } else if (type instanceof ZodLiteral) {
        return [type.value];
      } else if (type instanceof ZodEnum) {
        return type.options;
      } else if (type instanceof ZodNativeEnum) {
        return util.objectValues(type.enum);
      } else if (type instanceof ZodDefault) {
        return getDiscriminator(type._def.innerType);
      } else if (type instanceof ZodUndefined) {
        return [void 0];
      } else if (type instanceof ZodNull) {
        return [null];
      } else if (type instanceof ZodOptional) {
        return [void 0, ...getDiscriminator(type.unwrap())];
      } else if (type instanceof ZodNullable) {
        return [null, ...getDiscriminator(type.unwrap())];
      } else if (type instanceof ZodBranded) {
        return getDiscriminator(type.unwrap());
      } else if (type instanceof ZodReadonly) {
        return getDiscriminator(type.unwrap());
      } else if (type instanceof ZodCatch) {
        return getDiscriminator(type._def.innerType);
      } else {
        return [];
      }
    };
    ZodDiscriminatedUnion = class _ZodDiscriminatedUnion extends ZodType {
      _parse(input) {
        const { ctx } = this._processInputParams(input);
        if (ctx.parsedType !== ZodParsedType.object) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.object,
            received: ctx.parsedType
          });
          return INVALID;
        }
        const discriminator = this.discriminator;
        const discriminatorValue = ctx.data[discriminator];
        const option = this.optionsMap.get(discriminatorValue);
        if (!option) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_union_discriminator,
            options: Array.from(this.optionsMap.keys()),
            path: [discriminator]
          });
          return INVALID;
        }
        if (ctx.common.async) {
          return option._parseAsync({
            data: ctx.data,
            path: ctx.path,
            parent: ctx
          });
        } else {
          return option._parseSync({
            data: ctx.data,
            path: ctx.path,
            parent: ctx
          });
        }
      }
      get discriminator() {
        return this._def.discriminator;
      }
      get options() {
        return this._def.options;
      }
      get optionsMap() {
        return this._def.optionsMap;
      }
      /**
       * The constructor of the discriminated union schema. Its behaviour is very similar to that of the normal z.union() constructor.
       * However, it only allows a union of objects, all of which need to share a discriminator property. This property must
       * have a different value for each object in the union.
       * @param discriminator the name of the discriminator property
       * @param types an array of object schemas
       * @param params
       */
      static create(discriminator, options, params) {
        const optionsMap = /* @__PURE__ */ new Map();
        for (const type of options) {
          const discriminatorValues = getDiscriminator(type.shape[discriminator]);
          if (!discriminatorValues.length) {
            throw new Error(`A discriminator value for key \`${discriminator}\` could not be extracted from all schema options`);
          }
          for (const value of discriminatorValues) {
            if (optionsMap.has(value)) {
              throw new Error(`Discriminator property ${String(discriminator)} has duplicate value ${String(value)}`);
            }
            optionsMap.set(value, type);
          }
        }
        return new _ZodDiscriminatedUnion({
          typeName: ZodFirstPartyTypeKind.ZodDiscriminatedUnion,
          discriminator,
          options,
          optionsMap,
          ...processCreateParams(params)
        });
      }
    };
    ZodIntersection = class extends ZodType {
      _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        const handleParsed = (parsedLeft, parsedRight) => {
          if (isAborted(parsedLeft) || isAborted(parsedRight)) {
            return INVALID;
          }
          const merged = mergeValues(parsedLeft.value, parsedRight.value);
          if (!merged.valid) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.invalid_intersection_types
            });
            return INVALID;
          }
          if (isDirty(parsedLeft) || isDirty(parsedRight)) {
            status.dirty();
          }
          return { status: status.value, value: merged.data };
        };
        if (ctx.common.async) {
          return Promise.all([
            this._def.left._parseAsync({
              data: ctx.data,
              path: ctx.path,
              parent: ctx
            }),
            this._def.right._parseAsync({
              data: ctx.data,
              path: ctx.path,
              parent: ctx
            })
          ]).then(([left, right]) => handleParsed(left, right));
        } else {
          return handleParsed(this._def.left._parseSync({
            data: ctx.data,
            path: ctx.path,
            parent: ctx
          }), this._def.right._parseSync({
            data: ctx.data,
            path: ctx.path,
            parent: ctx
          }));
        }
      }
    };
    ZodIntersection.create = (left, right, params) => {
      return new ZodIntersection({
        left,
        right,
        typeName: ZodFirstPartyTypeKind.ZodIntersection,
        ...processCreateParams(params)
      });
    };
    ZodTuple = class _ZodTuple extends ZodType {
      _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        if (ctx.parsedType !== ZodParsedType.array) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.array,
            received: ctx.parsedType
          });
          return INVALID;
        }
        if (ctx.data.length < this._def.items.length) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: this._def.items.length,
            inclusive: true,
            exact: false,
            type: "array"
          });
          return INVALID;
        }
        const rest = this._def.rest;
        if (!rest && ctx.data.length > this._def.items.length) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: this._def.items.length,
            inclusive: true,
            exact: false,
            type: "array"
          });
          status.dirty();
        }
        const items = [...ctx.data].map((item, itemIndex) => {
          const schema = this._def.items[itemIndex] || this._def.rest;
          if (!schema)
            return null;
          return schema._parse(new ParseInputLazyPath(ctx, item, ctx.path, itemIndex));
        }).filter((x) => !!x);
        if (ctx.common.async) {
          return Promise.all(items).then((results) => {
            return ParseStatus.mergeArray(status, results);
          });
        } else {
          return ParseStatus.mergeArray(status, items);
        }
      }
      get items() {
        return this._def.items;
      }
      rest(rest) {
        return new _ZodTuple({
          ...this._def,
          rest
        });
      }
    };
    ZodTuple.create = (schemas, params) => {
      if (!Array.isArray(schemas)) {
        throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
      }
      return new ZodTuple({
        items: schemas,
        typeName: ZodFirstPartyTypeKind.ZodTuple,
        rest: null,
        ...processCreateParams(params)
      });
    };
    ZodRecord = class _ZodRecord extends ZodType {
      get keySchema() {
        return this._def.keyType;
      }
      get valueSchema() {
        return this._def.valueType;
      }
      _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        if (ctx.parsedType !== ZodParsedType.object) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.object,
            received: ctx.parsedType
          });
          return INVALID;
        }
        const pairs = [];
        const keyType = this._def.keyType;
        const valueType = this._def.valueType;
        for (const key in ctx.data) {
          pairs.push({
            key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, key)),
            value: valueType._parse(new ParseInputLazyPath(ctx, ctx.data[key], ctx.path, key)),
            alwaysSet: key in ctx.data
          });
        }
        if (ctx.common.async) {
          return ParseStatus.mergeObjectAsync(status, pairs);
        } else {
          return ParseStatus.mergeObjectSync(status, pairs);
        }
      }
      get element() {
        return this._def.valueType;
      }
      static create(first, second, third) {
        if (second instanceof ZodType) {
          return new _ZodRecord({
            keyType: first,
            valueType: second,
            typeName: ZodFirstPartyTypeKind.ZodRecord,
            ...processCreateParams(third)
          });
        }
        return new _ZodRecord({
          keyType: ZodString.create(),
          valueType: first,
          typeName: ZodFirstPartyTypeKind.ZodRecord,
          ...processCreateParams(second)
        });
      }
    };
    ZodMap = class extends ZodType {
      get keySchema() {
        return this._def.keyType;
      }
      get valueSchema() {
        return this._def.valueType;
      }
      _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        if (ctx.parsedType !== ZodParsedType.map) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.map,
            received: ctx.parsedType
          });
          return INVALID;
        }
        const keyType = this._def.keyType;
        const valueType = this._def.valueType;
        const pairs = [...ctx.data.entries()].map(([key, value], index) => {
          return {
            key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, [index, "key"])),
            value: valueType._parse(new ParseInputLazyPath(ctx, value, ctx.path, [index, "value"]))
          };
        });
        if (ctx.common.async) {
          const finalMap = /* @__PURE__ */ new Map();
          return Promise.resolve().then(async () => {
            for (const pair of pairs) {
              const key = await pair.key;
              const value = await pair.value;
              if (key.status === "aborted" || value.status === "aborted") {
                return INVALID;
              }
              if (key.status === "dirty" || value.status === "dirty") {
                status.dirty();
              }
              finalMap.set(key.value, value.value);
            }
            return { status: status.value, value: finalMap };
          });
        } else {
          const finalMap = /* @__PURE__ */ new Map();
          for (const pair of pairs) {
            const key = pair.key;
            const value = pair.value;
            if (key.status === "aborted" || value.status === "aborted") {
              return INVALID;
            }
            if (key.status === "dirty" || value.status === "dirty") {
              status.dirty();
            }
            finalMap.set(key.value, value.value);
          }
          return { status: status.value, value: finalMap };
        }
      }
    };
    ZodMap.create = (keyType, valueType, params) => {
      return new ZodMap({
        valueType,
        keyType,
        typeName: ZodFirstPartyTypeKind.ZodMap,
        ...processCreateParams(params)
      });
    };
    ZodSet = class _ZodSet extends ZodType {
      _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        if (ctx.parsedType !== ZodParsedType.set) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.set,
            received: ctx.parsedType
          });
          return INVALID;
        }
        const def = this._def;
        if (def.minSize !== null) {
          if (ctx.data.size < def.minSize.value) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_small,
              minimum: def.minSize.value,
              type: "set",
              inclusive: true,
              exact: false,
              message: def.minSize.message
            });
            status.dirty();
          }
        }
        if (def.maxSize !== null) {
          if (ctx.data.size > def.maxSize.value) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_big,
              maximum: def.maxSize.value,
              type: "set",
              inclusive: true,
              exact: false,
              message: def.maxSize.message
            });
            status.dirty();
          }
        }
        const valueType = this._def.valueType;
        function finalizeSet(elements2) {
          const parsedSet = /* @__PURE__ */ new Set();
          for (const element of elements2) {
            if (element.status === "aborted")
              return INVALID;
            if (element.status === "dirty")
              status.dirty();
            parsedSet.add(element.value);
          }
          return { status: status.value, value: parsedSet };
        }
        const elements = [...ctx.data.values()].map((item, i) => valueType._parse(new ParseInputLazyPath(ctx, item, ctx.path, i)));
        if (ctx.common.async) {
          return Promise.all(elements).then((elements2) => finalizeSet(elements2));
        } else {
          return finalizeSet(elements);
        }
      }
      min(minSize, message) {
        return new _ZodSet({
          ...this._def,
          minSize: { value: minSize, message: errorUtil.toString(message) }
        });
      }
      max(maxSize, message) {
        return new _ZodSet({
          ...this._def,
          maxSize: { value: maxSize, message: errorUtil.toString(message) }
        });
      }
      size(size, message) {
        return this.min(size, message).max(size, message);
      }
      nonempty(message) {
        return this.min(1, message);
      }
    };
    ZodSet.create = (valueType, params) => {
      return new ZodSet({
        valueType,
        minSize: null,
        maxSize: null,
        typeName: ZodFirstPartyTypeKind.ZodSet,
        ...processCreateParams(params)
      });
    };
    ZodFunction = class _ZodFunction extends ZodType {
      constructor() {
        super(...arguments);
        this.validate = this.implement;
      }
      _parse(input) {
        const { ctx } = this._processInputParams(input);
        if (ctx.parsedType !== ZodParsedType.function) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.function,
            received: ctx.parsedType
          });
          return INVALID;
        }
        function makeArgsIssue(args, error) {
          return makeIssue({
            data: args,
            path: ctx.path,
            errorMaps: [
              ctx.common.contextualErrorMap,
              ctx.schemaErrorMap,
              getErrorMap(),
              errorMap
            ].filter((x) => !!x),
            issueData: {
              code: ZodIssueCode.invalid_arguments,
              argumentsError: error
            }
          });
        }
        function makeReturnsIssue(returns, error) {
          return makeIssue({
            data: returns,
            path: ctx.path,
            errorMaps: [
              ctx.common.contextualErrorMap,
              ctx.schemaErrorMap,
              getErrorMap(),
              errorMap
            ].filter((x) => !!x),
            issueData: {
              code: ZodIssueCode.invalid_return_type,
              returnTypeError: error
            }
          });
        }
        const params = { errorMap: ctx.common.contextualErrorMap };
        const fn = ctx.data;
        if (this._def.returns instanceof ZodPromise) {
          const me = this;
          return OK(async function(...args) {
            const error = new ZodError([]);
            const parsedArgs = await me._def.args.parseAsync(args, params).catch((e) => {
              error.addIssue(makeArgsIssue(args, e));
              throw error;
            });
            const result = await Reflect.apply(fn, this, parsedArgs);
            const parsedReturns = await me._def.returns._def.type.parseAsync(result, params).catch((e) => {
              error.addIssue(makeReturnsIssue(result, e));
              throw error;
            });
            return parsedReturns;
          });
        } else {
          const me = this;
          return OK(function(...args) {
            const parsedArgs = me._def.args.safeParse(args, params);
            if (!parsedArgs.success) {
              throw new ZodError([makeArgsIssue(args, parsedArgs.error)]);
            }
            const result = Reflect.apply(fn, this, parsedArgs.data);
            const parsedReturns = me._def.returns.safeParse(result, params);
            if (!parsedReturns.success) {
              throw new ZodError([makeReturnsIssue(result, parsedReturns.error)]);
            }
            return parsedReturns.data;
          });
        }
      }
      parameters() {
        return this._def.args;
      }
      returnType() {
        return this._def.returns;
      }
      args(...items) {
        return new _ZodFunction({
          ...this._def,
          args: ZodTuple.create(items).rest(ZodUnknown.create())
        });
      }
      returns(returnType) {
        return new _ZodFunction({
          ...this._def,
          returns: returnType
        });
      }
      implement(func) {
        const validatedFunc = this.parse(func);
        return validatedFunc;
      }
      strictImplement(func) {
        const validatedFunc = this.parse(func);
        return validatedFunc;
      }
      static create(args, returns, params) {
        return new _ZodFunction({
          args: args ? args : ZodTuple.create([]).rest(ZodUnknown.create()),
          returns: returns || ZodUnknown.create(),
          typeName: ZodFirstPartyTypeKind.ZodFunction,
          ...processCreateParams(params)
        });
      }
    };
    ZodLazy = class extends ZodType {
      get schema() {
        return this._def.getter();
      }
      _parse(input) {
        const { ctx } = this._processInputParams(input);
        const lazySchema = this._def.getter();
        return lazySchema._parse({ data: ctx.data, path: ctx.path, parent: ctx });
      }
    };
    ZodLazy.create = (getter, params) => {
      return new ZodLazy({
        getter,
        typeName: ZodFirstPartyTypeKind.ZodLazy,
        ...processCreateParams(params)
      });
    };
    ZodLiteral = class extends ZodType {
      _parse(input) {
        if (input.data !== this._def.value) {
          const ctx = this._getOrReturnCtx(input);
          addIssueToContext(ctx, {
            received: ctx.data,
            code: ZodIssueCode.invalid_literal,
            expected: this._def.value
          });
          return INVALID;
        }
        return { status: "valid", value: input.data };
      }
      get value() {
        return this._def.value;
      }
    };
    ZodLiteral.create = (value, params) => {
      return new ZodLiteral({
        value,
        typeName: ZodFirstPartyTypeKind.ZodLiteral,
        ...processCreateParams(params)
      });
    };
    ZodEnum = class _ZodEnum extends ZodType {
      constructor() {
        super(...arguments);
        _ZodEnum_cache.set(this, void 0);
      }
      _parse(input) {
        if (typeof input.data !== "string") {
          const ctx = this._getOrReturnCtx(input);
          const expectedValues = this._def.values;
          addIssueToContext(ctx, {
            expected: util.joinValues(expectedValues),
            received: ctx.parsedType,
            code: ZodIssueCode.invalid_type
          });
          return INVALID;
        }
        if (!__classPrivateFieldGet(this, _ZodEnum_cache, "f")) {
          __classPrivateFieldSet(this, _ZodEnum_cache, new Set(this._def.values), "f");
        }
        if (!__classPrivateFieldGet(this, _ZodEnum_cache, "f").has(input.data)) {
          const ctx = this._getOrReturnCtx(input);
          const expectedValues = this._def.values;
          addIssueToContext(ctx, {
            received: ctx.data,
            code: ZodIssueCode.invalid_enum_value,
            options: expectedValues
          });
          return INVALID;
        }
        return OK(input.data);
      }
      get options() {
        return this._def.values;
      }
      get enum() {
        const enumValues = {};
        for (const val of this._def.values) {
          enumValues[val] = val;
        }
        return enumValues;
      }
      get Values() {
        const enumValues = {};
        for (const val of this._def.values) {
          enumValues[val] = val;
        }
        return enumValues;
      }
      get Enum() {
        const enumValues = {};
        for (const val of this._def.values) {
          enumValues[val] = val;
        }
        return enumValues;
      }
      extract(values, newDef = this._def) {
        return _ZodEnum.create(values, {
          ...this._def,
          ...newDef
        });
      }
      exclude(values, newDef = this._def) {
        return _ZodEnum.create(this.options.filter((opt) => !values.includes(opt)), {
          ...this._def,
          ...newDef
        });
      }
    };
    _ZodEnum_cache = /* @__PURE__ */ new WeakMap();
    ZodEnum.create = createZodEnum;
    ZodNativeEnum = class extends ZodType {
      constructor() {
        super(...arguments);
        _ZodNativeEnum_cache.set(this, void 0);
      }
      _parse(input) {
        const nativeEnumValues = util.getValidEnumValues(this._def.values);
        const ctx = this._getOrReturnCtx(input);
        if (ctx.parsedType !== ZodParsedType.string && ctx.parsedType !== ZodParsedType.number) {
          const expectedValues = util.objectValues(nativeEnumValues);
          addIssueToContext(ctx, {
            expected: util.joinValues(expectedValues),
            received: ctx.parsedType,
            code: ZodIssueCode.invalid_type
          });
          return INVALID;
        }
        if (!__classPrivateFieldGet(this, _ZodNativeEnum_cache, "f")) {
          __classPrivateFieldSet(this, _ZodNativeEnum_cache, new Set(util.getValidEnumValues(this._def.values)), "f");
        }
        if (!__classPrivateFieldGet(this, _ZodNativeEnum_cache, "f").has(input.data)) {
          const expectedValues = util.objectValues(nativeEnumValues);
          addIssueToContext(ctx, {
            received: ctx.data,
            code: ZodIssueCode.invalid_enum_value,
            options: expectedValues
          });
          return INVALID;
        }
        return OK(input.data);
      }
      get enum() {
        return this._def.values;
      }
    };
    _ZodNativeEnum_cache = /* @__PURE__ */ new WeakMap();
    ZodNativeEnum.create = (values, params) => {
      return new ZodNativeEnum({
        values,
        typeName: ZodFirstPartyTypeKind.ZodNativeEnum,
        ...processCreateParams(params)
      });
    };
    ZodPromise = class extends ZodType {
      unwrap() {
        return this._def.type;
      }
      _parse(input) {
        const { ctx } = this._processInputParams(input);
        if (ctx.parsedType !== ZodParsedType.promise && ctx.common.async === false) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.promise,
            received: ctx.parsedType
          });
          return INVALID;
        }
        const promisified = ctx.parsedType === ZodParsedType.promise ? ctx.data : Promise.resolve(ctx.data);
        return OK(promisified.then((data) => {
          return this._def.type.parseAsync(data, {
            path: ctx.path,
            errorMap: ctx.common.contextualErrorMap
          });
        }));
      }
    };
    ZodPromise.create = (schema, params) => {
      return new ZodPromise({
        type: schema,
        typeName: ZodFirstPartyTypeKind.ZodPromise,
        ...processCreateParams(params)
      });
    };
    ZodEffects = class extends ZodType {
      innerType() {
        return this._def.schema;
      }
      sourceType() {
        return this._def.schema._def.typeName === ZodFirstPartyTypeKind.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
      }
      _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        const effect = this._def.effect || null;
        const checkCtx = {
          addIssue: (arg) => {
            addIssueToContext(ctx, arg);
            if (arg.fatal) {
              status.abort();
            } else {
              status.dirty();
            }
          },
          get path() {
            return ctx.path;
          }
        };
        checkCtx.addIssue = checkCtx.addIssue.bind(checkCtx);
        if (effect.type === "preprocess") {
          const processed = effect.transform(ctx.data, checkCtx);
          if (ctx.common.async) {
            return Promise.resolve(processed).then(async (processed2) => {
              if (status.value === "aborted")
                return INVALID;
              const result = await this._def.schema._parseAsync({
                data: processed2,
                path: ctx.path,
                parent: ctx
              });
              if (result.status === "aborted")
                return INVALID;
              if (result.status === "dirty")
                return DIRTY(result.value);
              if (status.value === "dirty")
                return DIRTY(result.value);
              return result;
            });
          } else {
            if (status.value === "aborted")
              return INVALID;
            const result = this._def.schema._parseSync({
              data: processed,
              path: ctx.path,
              parent: ctx
            });
            if (result.status === "aborted")
              return INVALID;
            if (result.status === "dirty")
              return DIRTY(result.value);
            if (status.value === "dirty")
              return DIRTY(result.value);
            return result;
          }
        }
        if (effect.type === "refinement") {
          const executeRefinement = (acc) => {
            const result = effect.refinement(acc, checkCtx);
            if (ctx.common.async) {
              return Promise.resolve(result);
            }
            if (result instanceof Promise) {
              throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
            }
            return acc;
          };
          if (ctx.common.async === false) {
            const inner = this._def.schema._parseSync({
              data: ctx.data,
              path: ctx.path,
              parent: ctx
            });
            if (inner.status === "aborted")
              return INVALID;
            if (inner.status === "dirty")
              status.dirty();
            executeRefinement(inner.value);
            return { status: status.value, value: inner.value };
          } else {
            return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((inner) => {
              if (inner.status === "aborted")
                return INVALID;
              if (inner.status === "dirty")
                status.dirty();
              return executeRefinement(inner.value).then(() => {
                return { status: status.value, value: inner.value };
              });
            });
          }
        }
        if (effect.type === "transform") {
          if (ctx.common.async === false) {
            const base = this._def.schema._parseSync({
              data: ctx.data,
              path: ctx.path,
              parent: ctx
            });
            if (!isValid(base))
              return base;
            const result = effect.transform(base.value, checkCtx);
            if (result instanceof Promise) {
              throw new Error(`Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.`);
            }
            return { status: status.value, value: result };
          } else {
            return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((base) => {
              if (!isValid(base))
                return base;
              return Promise.resolve(effect.transform(base.value, checkCtx)).then((result) => ({ status: status.value, value: result }));
            });
          }
        }
        util.assertNever(effect);
      }
    };
    ZodEffects.create = (schema, effect, params) => {
      return new ZodEffects({
        schema,
        typeName: ZodFirstPartyTypeKind.ZodEffects,
        effect,
        ...processCreateParams(params)
      });
    };
    ZodEffects.createWithPreprocess = (preprocess, schema, params) => {
      return new ZodEffects({
        schema,
        effect: { type: "preprocess", transform: preprocess },
        typeName: ZodFirstPartyTypeKind.ZodEffects,
        ...processCreateParams(params)
      });
    };
    ZodOptional = class extends ZodType {
      _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType === ZodParsedType.undefined) {
          return OK(void 0);
        }
        return this._def.innerType._parse(input);
      }
      unwrap() {
        return this._def.innerType;
      }
    };
    ZodOptional.create = (type, params) => {
      return new ZodOptional({
        innerType: type,
        typeName: ZodFirstPartyTypeKind.ZodOptional,
        ...processCreateParams(params)
      });
    };
    ZodNullable = class extends ZodType {
      _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType === ZodParsedType.null) {
          return OK(null);
        }
        return this._def.innerType._parse(input);
      }
      unwrap() {
        return this._def.innerType;
      }
    };
    ZodNullable.create = (type, params) => {
      return new ZodNullable({
        innerType: type,
        typeName: ZodFirstPartyTypeKind.ZodNullable,
        ...processCreateParams(params)
      });
    };
    ZodDefault = class extends ZodType {
      _parse(input) {
        const { ctx } = this._processInputParams(input);
        let data = ctx.data;
        if (ctx.parsedType === ZodParsedType.undefined) {
          data = this._def.defaultValue();
        }
        return this._def.innerType._parse({
          data,
          path: ctx.path,
          parent: ctx
        });
      }
      removeDefault() {
        return this._def.innerType;
      }
    };
    ZodDefault.create = (type, params) => {
      return new ZodDefault({
        innerType: type,
        typeName: ZodFirstPartyTypeKind.ZodDefault,
        defaultValue: typeof params.default === "function" ? params.default : () => params.default,
        ...processCreateParams(params)
      });
    };
    ZodCatch = class extends ZodType {
      _parse(input) {
        const { ctx } = this._processInputParams(input);
        const newCtx = {
          ...ctx,
          common: {
            ...ctx.common,
            issues: []
          }
        };
        const result = this._def.innerType._parse({
          data: newCtx.data,
          path: newCtx.path,
          parent: {
            ...newCtx
          }
        });
        if (isAsync(result)) {
          return result.then((result2) => {
            return {
              status: "valid",
              value: result2.status === "valid" ? result2.value : this._def.catchValue({
                get error() {
                  return new ZodError(newCtx.common.issues);
                },
                input: newCtx.data
              })
            };
          });
        } else {
          return {
            status: "valid",
            value: result.status === "valid" ? result.value : this._def.catchValue({
              get error() {
                return new ZodError(newCtx.common.issues);
              },
              input: newCtx.data
            })
          };
        }
      }
      removeCatch() {
        return this._def.innerType;
      }
    };
    ZodCatch.create = (type, params) => {
      return new ZodCatch({
        innerType: type,
        typeName: ZodFirstPartyTypeKind.ZodCatch,
        catchValue: typeof params.catch === "function" ? params.catch : () => params.catch,
        ...processCreateParams(params)
      });
    };
    ZodNaN = class extends ZodType {
      _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.nan) {
          const ctx = this._getOrReturnCtx(input);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.nan,
            received: ctx.parsedType
          });
          return INVALID;
        }
        return { status: "valid", value: input.data };
      }
    };
    ZodNaN.create = (params) => {
      return new ZodNaN({
        typeName: ZodFirstPartyTypeKind.ZodNaN,
        ...processCreateParams(params)
      });
    };
    BRAND = /* @__PURE__ */ Symbol("zod_brand");
    ZodBranded = class extends ZodType {
      _parse(input) {
        const { ctx } = this._processInputParams(input);
        const data = ctx.data;
        return this._def.type._parse({
          data,
          path: ctx.path,
          parent: ctx
        });
      }
      unwrap() {
        return this._def.type;
      }
    };
    ZodPipeline = class _ZodPipeline extends ZodType {
      _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        if (ctx.common.async) {
          const handleAsync = async () => {
            const inResult = await this._def.in._parseAsync({
              data: ctx.data,
              path: ctx.path,
              parent: ctx
            });
            if (inResult.status === "aborted")
              return INVALID;
            if (inResult.status === "dirty") {
              status.dirty();
              return DIRTY(inResult.value);
            } else {
              return this._def.out._parseAsync({
                data: inResult.value,
                path: ctx.path,
                parent: ctx
              });
            }
          };
          return handleAsync();
        } else {
          const inResult = this._def.in._parseSync({
            data: ctx.data,
            path: ctx.path,
            parent: ctx
          });
          if (inResult.status === "aborted")
            return INVALID;
          if (inResult.status === "dirty") {
            status.dirty();
            return {
              status: "dirty",
              value: inResult.value
            };
          } else {
            return this._def.out._parseSync({
              data: inResult.value,
              path: ctx.path,
              parent: ctx
            });
          }
        }
      }
      static create(a, b) {
        return new _ZodPipeline({
          in: a,
          out: b,
          typeName: ZodFirstPartyTypeKind.ZodPipeline
        });
      }
    };
    ZodReadonly = class extends ZodType {
      _parse(input) {
        const result = this._def.innerType._parse(input);
        const freeze = (data) => {
          if (isValid(data)) {
            data.value = Object.freeze(data.value);
          }
          return data;
        };
        return isAsync(result) ? result.then((data) => freeze(data)) : freeze(result);
      }
      unwrap() {
        return this._def.innerType;
      }
    };
    ZodReadonly.create = (type, params) => {
      return new ZodReadonly({
        innerType: type,
        typeName: ZodFirstPartyTypeKind.ZodReadonly,
        ...processCreateParams(params)
      });
    };
    late = {
      object: ZodObject.lazycreate
    };
    (function(ZodFirstPartyTypeKind2) {
      ZodFirstPartyTypeKind2["ZodString"] = "ZodString";
      ZodFirstPartyTypeKind2["ZodNumber"] = "ZodNumber";
      ZodFirstPartyTypeKind2["ZodNaN"] = "ZodNaN";
      ZodFirstPartyTypeKind2["ZodBigInt"] = "ZodBigInt";
      ZodFirstPartyTypeKind2["ZodBoolean"] = "ZodBoolean";
      ZodFirstPartyTypeKind2["ZodDate"] = "ZodDate";
      ZodFirstPartyTypeKind2["ZodSymbol"] = "ZodSymbol";
      ZodFirstPartyTypeKind2["ZodUndefined"] = "ZodUndefined";
      ZodFirstPartyTypeKind2["ZodNull"] = "ZodNull";
      ZodFirstPartyTypeKind2["ZodAny"] = "ZodAny";
      ZodFirstPartyTypeKind2["ZodUnknown"] = "ZodUnknown";
      ZodFirstPartyTypeKind2["ZodNever"] = "ZodNever";
      ZodFirstPartyTypeKind2["ZodVoid"] = "ZodVoid";
      ZodFirstPartyTypeKind2["ZodArray"] = "ZodArray";
      ZodFirstPartyTypeKind2["ZodObject"] = "ZodObject";
      ZodFirstPartyTypeKind2["ZodUnion"] = "ZodUnion";
      ZodFirstPartyTypeKind2["ZodDiscriminatedUnion"] = "ZodDiscriminatedUnion";
      ZodFirstPartyTypeKind2["ZodIntersection"] = "ZodIntersection";
      ZodFirstPartyTypeKind2["ZodTuple"] = "ZodTuple";
      ZodFirstPartyTypeKind2["ZodRecord"] = "ZodRecord";
      ZodFirstPartyTypeKind2["ZodMap"] = "ZodMap";
      ZodFirstPartyTypeKind2["ZodSet"] = "ZodSet";
      ZodFirstPartyTypeKind2["ZodFunction"] = "ZodFunction";
      ZodFirstPartyTypeKind2["ZodLazy"] = "ZodLazy";
      ZodFirstPartyTypeKind2["ZodLiteral"] = "ZodLiteral";
      ZodFirstPartyTypeKind2["ZodEnum"] = "ZodEnum";
      ZodFirstPartyTypeKind2["ZodEffects"] = "ZodEffects";
      ZodFirstPartyTypeKind2["ZodNativeEnum"] = "ZodNativeEnum";
      ZodFirstPartyTypeKind2["ZodOptional"] = "ZodOptional";
      ZodFirstPartyTypeKind2["ZodNullable"] = "ZodNullable";
      ZodFirstPartyTypeKind2["ZodDefault"] = "ZodDefault";
      ZodFirstPartyTypeKind2["ZodCatch"] = "ZodCatch";
      ZodFirstPartyTypeKind2["ZodPromise"] = "ZodPromise";
      ZodFirstPartyTypeKind2["ZodBranded"] = "ZodBranded";
      ZodFirstPartyTypeKind2["ZodPipeline"] = "ZodPipeline";
      ZodFirstPartyTypeKind2["ZodReadonly"] = "ZodReadonly";
    })(ZodFirstPartyTypeKind || (ZodFirstPartyTypeKind = {}));
    instanceOfType = (cls, params = {
      message: `Input not instance of ${cls.name}`
    }) => custom((data) => data instanceof cls, params);
    stringType = ZodString.create;
    numberType = ZodNumber.create;
    nanType = ZodNaN.create;
    bigIntType = ZodBigInt.create;
    booleanType = ZodBoolean.create;
    dateType = ZodDate.create;
    symbolType = ZodSymbol.create;
    undefinedType = ZodUndefined.create;
    nullType = ZodNull.create;
    anyType = ZodAny.create;
    unknownType = ZodUnknown.create;
    neverType = ZodNever.create;
    voidType = ZodVoid.create;
    arrayType = ZodArray.create;
    objectType = ZodObject.create;
    strictObjectType = ZodObject.strictCreate;
    unionType = ZodUnion.create;
    discriminatedUnionType = ZodDiscriminatedUnion.create;
    intersectionType = ZodIntersection.create;
    tupleType = ZodTuple.create;
    recordType = ZodRecord.create;
    mapType = ZodMap.create;
    setType = ZodSet.create;
    functionType = ZodFunction.create;
    lazyType = ZodLazy.create;
    literalType = ZodLiteral.create;
    enumType = ZodEnum.create;
    nativeEnumType = ZodNativeEnum.create;
    promiseType = ZodPromise.create;
    effectsType = ZodEffects.create;
    optionalType = ZodOptional.create;
    nullableType = ZodNullable.create;
    preprocessType = ZodEffects.createWithPreprocess;
    pipelineType = ZodPipeline.create;
    ostring = () => stringType().optional();
    onumber = () => numberType().optional();
    oboolean = () => booleanType().optional();
    coerce = {
      string: ((arg) => ZodString.create({ ...arg, coerce: true })),
      number: ((arg) => ZodNumber.create({ ...arg, coerce: true })),
      boolean: ((arg) => ZodBoolean.create({
        ...arg,
        coerce: true
      })),
      bigint: ((arg) => ZodBigInt.create({ ...arg, coerce: true })),
      date: ((arg) => ZodDate.create({ ...arg, coerce: true }))
    };
    NEVER = INVALID;
    z = /* @__PURE__ */ Object.freeze({
      __proto__: null,
      defaultErrorMap: errorMap,
      setErrorMap,
      getErrorMap,
      makeIssue,
      EMPTY_PATH,
      addIssueToContext,
      ParseStatus,
      INVALID,
      DIRTY,
      OK,
      isAborted,
      isDirty,
      isValid,
      isAsync,
      get util() {
        return util;
      },
      get objectUtil() {
        return objectUtil;
      },
      ZodParsedType,
      getParsedType,
      ZodType,
      datetimeRegex,
      ZodString,
      ZodNumber,
      ZodBigInt,
      ZodBoolean,
      ZodDate,
      ZodSymbol,
      ZodUndefined,
      ZodNull,
      ZodAny,
      ZodUnknown,
      ZodNever,
      ZodVoid,
      ZodArray,
      ZodObject,
      ZodUnion,
      ZodDiscriminatedUnion,
      ZodIntersection,
      ZodTuple,
      ZodRecord,
      ZodMap,
      ZodSet,
      ZodFunction,
      ZodLazy,
      ZodLiteral,
      ZodEnum,
      ZodNativeEnum,
      ZodPromise,
      ZodEffects,
      ZodTransformer: ZodEffects,
      ZodOptional,
      ZodNullable,
      ZodDefault,
      ZodCatch,
      ZodNaN,
      BRAND,
      ZodBranded,
      ZodPipeline,
      ZodReadonly,
      custom,
      Schema: ZodType,
      ZodSchema: ZodType,
      late,
      get ZodFirstPartyTypeKind() {
        return ZodFirstPartyTypeKind;
      },
      coerce,
      any: anyType,
      array: arrayType,
      bigint: bigIntType,
      boolean: booleanType,
      date: dateType,
      discriminatedUnion: discriminatedUnionType,
      effect: effectsType,
      "enum": enumType,
      "function": functionType,
      "instanceof": instanceOfType,
      intersection: intersectionType,
      lazy: lazyType,
      literal: literalType,
      map: mapType,
      nan: nanType,
      nativeEnum: nativeEnumType,
      never: neverType,
      "null": nullType,
      nullable: nullableType,
      number: numberType,
      object: objectType,
      oboolean,
      onumber,
      optional: optionalType,
      ostring,
      pipeline: pipelineType,
      preprocess: preprocessType,
      promise: promiseType,
      record: recordType,
      set: setType,
      strictObject: strictObjectType,
      string: stringType,
      symbol: symbolType,
      transformer: effectsType,
      tuple: tupleType,
      "undefined": undefinedType,
      union: unionType,
      unknown: unknownType,
      "void": voidType,
      NEVER,
      ZodIssueCode,
      quotelessJson,
      ZodError
    });
  }
});

// cypher-executor/src/lib/prompt-recipe-schema.ts
var TransformSchema, KBDBBlockFragmentSchema, KVFragmentSchema, FragmentSchema, InputSchema, PromptAssemblySchema, OutputSpecSchema, PromptRecipeSchema;
var init_prompt_recipe_schema = __esm({
  "cypher-executor/src/lib/prompt-recipe-schema.ts"() {
    "use strict";
    init_lib();
    TransformSchema = z.string().regex(/^[a-z_]+(:.+)?$/, "transform \u5FC5\u9808\u70BA name \u6216 name:arg \u683C\u5F0F");
    KBDBBlockFragmentSchema = z.object({
      var: z.string().min(1),
      // prompt template 內的變數名
      source: z.literal("kbdb_block"),
      block_id: z.string().optional(),
      // 二擇一
      block_page_name: z.string().optional(),
      // 比 block_id 穩定
      field: z.string().default("content")
      // 抓 block 的哪個欄位
    });
    KVFragmentSchema = z.object({
      var: z.string().min(1),
      source: z.literal("kv"),
      key: z.string().min(1)
    });
    FragmentSchema = z.discriminatedUnion("source", [
      KBDBBlockFragmentSchema,
      KVFragmentSchema
    ]).superRefine((d, ctx) => {
      if (d.source === "kbdb_block" && !d.block_id && !d.block_page_name) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "block_id \u6216 block_page_name \u5FC5\u586B\u5176\u4E00"
        });
      }
    });
    InputSchema = z.object({
      var: z.string().min(1),
      from: z.string().min(1),
      // JSONPath-lite，如 "ctx.read_drafts.blocks"
      transform: TransformSchema.optional(),
      default: z.unknown().optional()
      // from 取不到時的預設值（避免炸 prompt）
    });
    PromptAssemblySchema = z.object({
      system: z.string().min(1),
      // 模板，可含 {{var}}
      user: z.string().min(1)
    });
    OutputSpecSchema = z.object({
      format: z.enum(["text", "json"]).default("text"),
      // 若 format=json，可選 schema 做 parse 後驗證（簡化版，列必填欄位即可）
      required_fields: z.array(z.string()).optional()
    });
    PromptRecipeSchema = z.object({
      kind: z.literal("prompt_recipe"),
      name: z.string().min(1).regex(/^[a-z][a-z0-9_]*$/, "name \u70BA lowercase + underscore"),
      version: z.number().int().positive().default(1),
      description: z.string().optional(),
      model: z.enum(["haiku", "sonnet", "opus"]).default("sonnet"),
      fragments: z.array(FragmentSchema).default([]),
      inputs: z.array(InputSchema).default([]),
      prompt_assembly: PromptAssemblySchema,
      output: OutputSpecSchema.default({ format: "text" })
    });
  }
});

// cypher-executor/src/lib/recipe-loader.ts
async function loadPromptRecipe(recipeRef, recipesKv) {
  const key = recipeRef.startsWith("prompt_recipe:") ? recipeRef : `prompt_recipe:${recipeRef}`;
  const raw2 = await recipesKv.get(key);
  if (!raw2) {
    throw new RecipeLoadError(`\u627E\u4E0D\u5230 recipe: ${key}`, key);
  }
  let parsed;
  try {
    parsed = JSON.parse(raw2);
  } catch (e) {
    throw new RecipeLoadError(
      `recipe ${key} \u4E0D\u662F\u5408\u6CD5 JSON: ${e instanceof Error ? e.message : String(e)}`,
      key
    );
  }
  const result = PromptRecipeSchema.safeParse(parsed);
  if (!result.success) {
    const issues = result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
    throw new RecipeLoadError(`recipe ${key} schema \u9A57\u8B49\u5931\u6557: ${issues}`, key);
  }
  return result.data;
}
var RecipeLoadError;
var init_recipe_loader = __esm({
  "cypher-executor/src/lib/recipe-loader.ts"() {
    "use strict";
    init_prompt_recipe_schema();
    RecipeLoadError = class extends Error {
      constructor(message, recipe) {
        super(message);
        this.recipe = recipe;
      }
      recipe;
    };
  }
});

// cypher-executor/src/lib/recipe-transforms.ts
function applyTransform(value, spec) {
  const colonIdx = spec.indexOf(":");
  const name = colonIdx === -1 ? spec : spec.slice(0, colonIdx);
  const arg = colonIdx === -1 ? void 0 : spec.slice(colonIdx + 1);
  const fn = transforms[name];
  if (!fn) throw new Error(`\u672A\u77E5 transform: ${name}`);
  return fn(value, arg);
}
var transforms;
var init_recipe_transforms = __esm({
  "cypher-executor/src/lib/recipe-transforms.ts"() {
    "use strict";
    transforms = {
      json_array: (v) => JSON.stringify(v ?? []),
      to_string: (v) => {
        if (v === null || v === void 0) return "";
        if (typeof v === "object") return JSON.stringify(v);
        return String(v);
      },
      join: (v, sep) => {
        if (!Array.isArray(v)) throw new Error("join: input \u4E0D\u662F array");
        return v.map((x) => typeof x === "string" ? x : JSON.stringify(x)).join(sep ?? "\n");
      },
      markdown_list: (v) => {
        if (!Array.isArray(v)) throw new Error("markdown_list: input \u4E0D\u662F array");
        return v.map((x) => `- ${typeof x === "string" ? x : JSON.stringify(x)}`).join("\n");
      },
      extract_field: (v, field) => {
        if (!field) throw new Error("extract_field: \u9700\u8981 field \u53C3\u6578\uFF0C\u4F8B\u5982 extract_field:page_name");
        if (!Array.isArray(v)) throw new Error("extract_field: input \u4E0D\u662F array");
        return v.map((x) => x && typeof x === "object" ? x[field] : void 0);
      },
      first: (v) => {
        if (!Array.isArray(v)) return v;
        return v[0];
      },
      pluck_content: (v) => {
        if (!Array.isArray(v)) throw new Error("pluck_content: input \u4E0D\u662F array");
        return v.map((b) => b && typeof b === "object" ? String(b.content ?? "") : "").filter((s) => s.length > 0).join("\n\n---\n\n");
      }
    };
  }
});

// cypher-executor/src/lib/kbdb-tally.ts
function newKbdbTally() {
  return { rowsRead: 0, rowsWritten: 0, statements: 0 };
}
function addKbdbResponse(tally, res) {
  if (!tally) return;
  const r = Number(res.headers.get("X-KBDB-Rows-Read") ?? "0");
  const w = Number(res.headers.get("X-KBDB-Rows-Written") ?? "0");
  const s = Number(res.headers.get("X-KBDB-Statements") ?? "0");
  if (Number.isFinite(r)) tally.rowsRead += r;
  if (Number.isFinite(w)) tally.rowsWritten += w;
  if (Number.isFinite(s)) tally.statements += s;
}
var init_kbdb_tally = __esm({
  "cypher-executor/src/lib/kbdb-tally.ts"() {
    "use strict";
  }
});

// cypher-executor/src/lib/recipe-expander.ts
function getByPath(ctx, path) {
  const parts = path.split(".");
  let cur = ctx;
  for (const p of parts) {
    if (cur === null || cur === void 0) return void 0;
    if (typeof cur !== "object") return void 0;
    cur = cur[p];
  }
  return cur;
}
function interpolate(template, vars) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] !== void 0 ? vars[key] : `{{${key}}}`);
}
async function fetchKbdbBlock(env, apiKey, fragment) {
  const base = kbdbBaseUrl(env);
  let url;
  if (fragment.block_id) {
    url = `${base}/blocks/${encodeURIComponent(fragment.block_id)}`;
  } else {
    url = `${base}/blocks?page_name=${encodeURIComponent(fragment.block_page_name)}&limit=1`;
  }
  const res = await fetch(url, {
    headers: withCaller({ Authorization: `Bearer ${apiKey}` }, KBDB_CALLERS.recipeFragment())
  });
  addKbdbResponse(env.__kbdbTally, res);
  if (!res.ok) throw new Error(`KBDB fragment \u6293\u53D6\u5931\u6557 (${res.status}): ${url}`);
  const data = await res.json();
  const block = fragment.block_id ? data : data.blocks?.[0] ?? {};
  if (!block) throw new Error(`KBDB block \u4E0D\u5B58\u5728: ${fragment.block_id ?? fragment.block_page_name}`);
  const fieldVal = block[fragment.field];
  if (fieldVal === void 0) throw new Error(`block \u7F3A\u6B04\u4F4D "${fragment.field}"`);
  return fieldVal;
}
async function resolveFragment(env, apiKey, frag) {
  if (frag.source === "kv") {
    const val = await env.RECIPES.get(frag.key);
    if (val === null) throw new Error(`KV \u627E\u4E0D\u5230 key: ${frag.key}`);
    return { var: frag.var, value: val };
  }
  return { var: frag.var, value: await fetchKbdbBlock(env, apiKey, frag) };
}
function resolveInput(input, ctx) {
  let val = getByPath(ctx, input.from);
  const beforeDefault = val;
  if (val === void 0) val = input.default;
  try {
    if (input.transform) val = applyTransform(val, input.transform);
    return { var: input.var, value: val };
  } catch (e) {
    const valType = Array.isArray(beforeDefault) ? `array(${beforeDefault.length})` : beforeDefault === void 0 ? "undefined(default applied)" : typeof beforeDefault;
    throw new Error(`${e instanceof Error ? e.message : String(e)} [path=${input.from}, type=${valType}]`);
  }
}
async function expandPromptRecipe(recipeRef, ctx, env, apiKey) {
  const recipe = await loadPromptRecipe(recipeRef, env.RECIPES);
  const vars = {};
  for (const frag of recipe.fragments) {
    const { var: name, value } = await resolveFragment(env, apiKey, frag);
    vars[name] = typeof value === "string" ? value : JSON.stringify(value);
  }
  for (const inp of recipe.inputs) {
    const { var: name, value } = resolveInput(inp, ctx);
    vars[name] = typeof value === "string" ? value : JSON.stringify(value);
  }
  const system = interpolate(recipe.prompt_assembly.system, vars);
  const user = interpolate(recipe.prompt_assembly.user, vars);
  const prompt = `${system}

--- USER ---

${user}`;
  return {
    prompt,
    model: recipe.model,
    output_format: recipe.output.format,
    output_required_fields: recipe.output.required_fields
  };
}
var init_recipe_expander = __esm({
  "cypher-executor/src/lib/recipe-expander.ts"() {
    "use strict";
    init_recipe_loader();
    init_recipe_transforms();
    init_kbdb_caller();
    init_kbdb_tally();
    init_endpoints();
  }
});

// cypher-executor/src/lib/paused-runs.ts
async function readIndex(kv, apiKey) {
  const raw2 = await kv.get(`${IDX_PREFIX}${apiKey}`);
  if (!raw2) return [];
  try {
    const arr = JSON.parse(raw2);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}
async function writeIndex(kv, apiKey, entries) {
  const now2 = Date.now();
  const fresh = entries.filter((e) => e.expires_at > now2);
  await kv.put(`${IDX_PREFIX}${apiKey}`, JSON.stringify(fresh), { expirationTtl: TTL_SECONDS });
}
async function persistPausedRun(kv, taskId, state) {
  await kv.put(`${KEY_PREFIX}${taskId}`, JSON.stringify(state), { expirationTtl: TTL_SECONDS });
  if (state.api_key) {
    const idx = await readIndex(kv, state.api_key);
    const filtered = idx.filter((e) => e.task_id !== taskId);
    filtered.unshift({
      task_id: taskId,
      run_id: state.run_id,
      paused_node_id: state.paused_node_id,
      workflow_name: state.graph.name,
      expires_at: state.expires_at,
      persisted_at: Date.now()
    });
    await writeIndex(kv, state.api_key, filtered.slice(0, 100));
  }
}
async function loadPausedRun(kv, taskId) {
  const raw2 = await kv.get(`${KEY_PREFIX}${taskId}`);
  if (!raw2) return null;
  try {
    return JSON.parse(raw2);
  } catch {
    return null;
  }
}
async function listPausedRunsByApiKey(kv, apiKey, limit = 20) {
  const idx = await readIndex(kv, apiKey);
  const now2 = Date.now();
  return idx.filter((e) => e.expires_at > now2).slice(0, limit);
}
async function consumePausedRun(kv, taskId) {
  const state = await loadPausedRun(kv, taskId);
  if (!state) return null;
  await kv.delete(`${KEY_PREFIX}${taskId}`).catch(() => {
  });
  if (state.api_key) {
    const idx = await readIndex(kv, state.api_key);
    const filtered = idx.filter((e) => e.task_id !== taskId);
    await writeIndex(kv, state.api_key, filtered).catch(() => {
    });
  }
  return state;
}
function isResumablePending(result) {
  if (!result || typeof result !== "object") return null;
  const r = result;
  if (r.pending !== true) return null;
  if (typeof r.task_id !== "string" || !r.task_id) return null;
  return { task_id: r.task_id };
}
function parseRecipeOutput(result, format, requiredFields) {
  if (format !== "json" || !result || typeof result !== "object") return result;
  const r = result;
  const text = r.data?.text ?? r.text;
  if (typeof text !== "string") return result;
  let jsonText = String(text).trim();
  const fenceMatch = jsonText.match(/^```(?:json)?\s*\n([\s\S]*?)\n```$/);
  if (fenceMatch) jsonText = fenceMatch[1].trim();
  try {
    const parsed = JSON.parse(jsonText);
    if (requiredFields && parsed && typeof parsed === "object") {
      const missing = requiredFields.filter((f) => !(f in parsed));
      if (missing.length > 0) {
        return { success: false, error: `recipe output \u7F3A\u6B04\u4F4D: ${missing.join(", ")}`, raw: parsed };
      }
    }
    return { success: true, data: parsed, ...parsed && typeof parsed === "object" ? parsed : {} };
  } catch (e) {
    return { success: false, error: `recipe output JSON parse \u5931\u6557: ${e instanceof Error ? e.message : String(e)}`, raw_text: text };
  }
}
var KEY_PREFIX, IDX_PREFIX, TTL_SECONDS;
var init_paused_runs = __esm({
  "cypher-executor/src/lib/paused-runs.ts"() {
    "use strict";
    KEY_PREFIX = "paused_run:";
    IDX_PREFIX = "paused_idx:";
    TTL_SECONDS = 24 * 60 * 60;
  }
});

// cypher-executor/src/lib/magic-vars.ts
function isoWeekNumber(d) {
  const target = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const dayNum = (target.getUTCDay() + 6) % 7;
  target.setUTCDate(target.getUTCDate() - dayNum + 3);
  const firstThursday = new Date(Date.UTC(target.getUTCFullYear(), 0, 4));
  const weekNum = 1 + Math.round(
    ((target.getTime() - firstThursday.getTime()) / 864e5 - 3 + (firstThursday.getUTCDay() + 6) % 7) / 7
  );
  return { year: target.getUTCFullYear(), week: weekNum };
}
function pad2(n) {
  return n.toString().padStart(2, "0");
}
function buildMagicVars(now2 = /* @__PURE__ */ new Date()) {
  const iso = now2.toISOString();
  const yyyy = now2.getUTCFullYear();
  const mm = pad2(now2.getUTCMonth() + 1);
  const dd = pad2(now2.getUTCDate());
  const hh = pad2(now2.getUTCHours());
  const mi = pad2(now2.getUTCMinutes());
  const ss = pad2(now2.getUTCSeconds());
  const yesterday = new Date(now2.getTime() - 864e5);
  const yMm = pad2(yesterday.getUTCMonth() + 1);
  const yDd = pad2(yesterday.getUTCDate());
  const { year: isoYear, week: isoWeek } = isoWeekNumber(now2);
  return {
    // 日期 / 時間（UTC）
    _today: `${yyyy}-${mm}-${dd}`,
    // 2026-05-16
    _yesterday: `${yesterday.getUTCFullYear()}-${yMm}-${yDd}`,
    // 2026-05-15
    _now: iso,
    // ISO 8601
    _now_unix: now2.getTime(),
    // unix ms
    _now_unix_s: Math.floor(now2.getTime() / 1e3),
    // unix sec
    // 個別欄位（給 path / page_name 拼）
    _year: yyyy,
    _month: mm,
    _day: dd,
    _hour: hh,
    _minute: mi,
    _second: ss,
    // ISO 週（roadmap weekly archive 必備）
    _iso_week: `${isoYear}-W${pad2(isoWeek)}`,
    // 2026-W20
    _iso_week_num: isoWeek,
    _iso_year: isoYear,
    // 簡單時間 slot（cron-friendly）
    _yyyymm: `${yyyy}${mm}`,
    // 202605
    _yyyymmdd: `${yyyy}${mm}${dd}`,
    // 20260516
    // 週幾（0=週日，1=週一 ... 6=週六；ISO 風格在 _iso_weekday）
    _weekday: now2.getUTCDay(),
    _iso_weekday: (now2.getUTCDay() + 6) % 7 + 1
    // 1=Mon...7=Sun
  };
}
var init_magic_vars = __esm({
  "cypher-executor/src/lib/magic-vars.ts"() {
    "use strict";
  }
});

// cypher-executor/src/lib/telemetry.ts
function recordNodeSteps(env, apiKey, workflowName, steps, ctx) {
  if (steps.length === 0) return;
  const failed = steps.filter((s) => !s.ok).length;
  recordTelemetry(env, apiKey, {
    event_type: "node_steps",
    workflow_name: workflowName,
    duration_ms: steps.reduce((sum, s) => sum + s.duration_ms, 0),
    ...failed > 0 ? { error_code: "node_error" } : {},
    steps
  }, ctx);
}
function recordTelemetry(_env, _apiKey, _record, _ctx) {
}
var init_telemetry = __esm({
  "cypher-executor/src/lib/telemetry.ts"() {
    "use strict";
  }
});

// cypher-executor/src/lib/trace-redaction.ts
function redactionMarker(label) {
  return `[redacted:${label}]`;
}
var MIN_SUBSTRING_LEN, MAX_DEPTH, TraceRedactor;
var init_trace_redaction = __esm({
  "cypher-executor/src/lib/trace-redaction.ts"() {
    "use strict";
    MIN_SUBSTRING_LEN = 4;
    MAX_DEPTH = 64;
    TraceRedactor = class {
      /** 真身 → 標記用的 label。用 Map 讓同一個值只登記一次。 */
      labels = /* @__PURE__ */ new Map();
      /** 依長度由長到短排序的真身清單（先換長的，避免長值被短值切碎）。 */
      sortedCache = null;
      /**
       * 登記一個「不准出現在 trace 裡」的真身。
       * 非字串、空字串、純空白一律忽略（那些不是秘密，拿去比對只會誤傷）。
       */
      add(value, label) {
        if (typeof value !== "string") return;
        if (value.trim().length === 0) return;
        if (this.labels.has(value)) return;
        this.labels.set(value, label);
        this.sortedCache = null;
      }
      /** 登記一整個 `{ name: 真身 }` map；label 由 name 決定。 */
      addRecord(record, label) {
        if (!record || typeof record !== "object") return;
        for (const [key, value] of Object.entries(record)) this.add(value, label(key));
      }
      /** 目前登記了幾個真身（0 = 這次執行沒用到任何 credential，redact 直接短路）。 */
      get size() {
        return this.labels.size;
      }
      /** 把一個字串裡所有登記過的真身換成標記。 */
      redactString(input) {
        if (this.labels.size === 0) return input;
        let out = input;
        for (const secret of this.sorted()) {
          const marker = redactionMarker(this.labels.get(secret));
          if (secret.length < MIN_SUBSTRING_LEN) {
            if (out === secret) out = marker;
            continue;
          }
          if (out.includes(secret)) out = out.split(secret).join(marker);
        }
        return out;
      }
      /**
       * 深走一個值，回傳「同形狀但值被遮過」的副本。
       * 沒登記任何真身時原樣回傳同一個 reference（零成本，不影響 99% 的執行）。
       */
      redact(value) {
        if (this.labels.size === 0) return value;
        return this.walk(value, /* @__PURE__ */ new WeakMap(), 0);
      }
      sorted() {
        if (this.sortedCache === null) {
          this.sortedCache = [...this.labels.keys()].sort((a, b) => b.length - a.length);
        }
        return this.sortedCache;
      }
      walk(value, seen, depth) {
        if (typeof value === "string") return this.redactString(value);
        if (value === null || typeof value !== "object") return value;
        if (value instanceof Date) return value;
        if (depth >= MAX_DEPTH) return redactionMarker("depth-limit");
        const cached = seen.get(value);
        if (cached !== void 0) return cached;
        if (Array.isArray(value)) {
          const out2 = [];
          seen.set(value, out2);
          for (const item of value) out2.push(this.walk(item, seen, depth + 1));
          return out2;
        }
        const out = {};
        seen.set(value, out);
        for (const [key, child] of Object.entries(value)) {
          out[this.redactString(key)] = this.walk(child, seen, depth + 1);
        }
        return out;
      }
    };
  }
});

// cypher-executor/src/graph-executor.ts
function propagateCtx(context, upstreamResult, upstreamNodeId) {
  const baseCtx = typeof context === "object" && context !== null ? context : {};
  const baseResult = typeof upstreamResult === "object" && upstreamResult !== null ? upstreamResult : {};
  return {
    ...baseCtx,
    ...baseResult,
    [upstreamNodeId]: upstreamResult
  };
}
function interpolateString(s, ctx) {
  const single = s.match(/^\s*\{\{([\w.]+)\}\}\s*$/);
  if (single) {
    const val = getNestedValue(ctx, single[1]);
    return val === void 0 ? s : val;
  }
  return s.replace(/\{\{([\w.]+)\}\}/g, (_, key) => {
    const val = getNestedValue(ctx, key);
    if (val === void 0) return `{{${key}}}`;
    if (typeof val === "string") return val;
    return JSON.stringify(val);
  });
}
function interpolateValue(v, ctx) {
  if (typeof v === "string") return interpolateString(v, ctx);
  if (Array.isArray(v)) return v.map((item) => interpolateValue(item, ctx));
  if (v !== null && typeof v === "object") {
    const result = {};
    for (const [k, val] of Object.entries(v)) {
      result[k] = interpolateValue(val, ctx);
    }
    return result;
  }
  return v;
}
function interpolateData(data, ctx) {
  if (!data) return {};
  return interpolateValue(data, ctx);
}
function getNestedValue(ctx, path) {
  const parts = path.split(".");
  let cur = ctx;
  for (const p of parts) {
    if (cur === null || cur === void 0) return void 0;
    if (typeof cur !== "object") return void 0;
    cur = cur[p];
  }
  return cur;
}
function readBranch(result) {
  if (!result || typeof result !== "object") return void 0;
  const r = result;
  const data = r.data && typeof r.data === "object" ? r.data : void 0;
  const named = data?.branch ?? r.branch;
  if (typeof named === "string") return named;
  const bool = data?.result ?? r.result;
  if (typeof bool === "boolean") return bool ? "true" : "false";
  return void 0;
}
function isFailure(result) {
  if (!result || typeof result !== "object") return false;
  const r = result;
  return r["success"] === false || "error" in r;
}
function deriveExecutionVerdict(graph, trace) {
  const onFailFrom = new Set(
    graph.edges.filter((e) => e.type === "ON_FAIL").map((e) => e.from)
  );
  for (const step of trace) {
    if (onFailFrom.has(step.nodeId)) continue;
    if (step.error) {
      return { success: false, failedNode: step.nodeId, error: step.error };
    }
    if (isFailure(step.output)) {
      const out = step.output;
      const err = typeof out.error === "string" ? out.error : `\u7BC0\u9EDE ${step.nodeId} \u56DE\u50B3 success:false`;
      return { success: false, failedNode: step.nodeId, error: err };
    }
  }
  return { success: true };
}
function evaluateCondition(condition, context) {
  if (!context || typeof context !== "object") return false;
  const ctx = context;
  const expr = condition.replace(/result\./g, "").replace(/ctx\./g, "");
  const eqMatch = expr.match(/^(\w+)\s*===?\s*(.+)$/);
  if (eqMatch) {
    const key2 = eqMatch[1];
    const rawVal = eqMatch[2].trim();
    const expected = rawVal === "true" ? true : rawVal === "false" ? false : rawVal.replace(/['"]/g, "");
    return ctx[key2] === expected;
  }
  const gtMatch = expr.match(/^(\w+)\s*>\s*(\d+)$/);
  if (gtMatch) {
    return Number(ctx[gtMatch[1]]) > Number(gtMatch[2]);
  }
  const key = expr.trim();
  if (key && key in ctx) return !!ctx[key];
  return true;
}
function getIterableFromContext(context, key) {
  if (!context || typeof context !== "object") return [];
  const variants = [
    key + "s",
    // paragraph → paragraphs
    key.replace(/y$/, "ies"),
    // entity → entities
    key.replace(/(s|x|z|ch|sh)$/, "$1es"),
    // box → boxes
    key
    // singular fallback
  ];
  const obj = context;
  for (const v of variants) {
    if (Array.isArray(obj[v])) return obj[v];
  }
  for (const val of Object.values(obj)) {
    if (val !== null && typeof val === "object" && !Array.isArray(val)) {
      for (const v of variants) {
        const nested = val[v];
        if (Array.isArray(nested)) return nested;
      }
    }
  }
  return [];
}
var GraphExecutor;
var init_graph_executor = __esm({
  "cypher-executor/src/graph-executor.ts"() {
    "use strict";
    init_types();
    init_auth_dispatcher();
    init_recipe_expander();
    init_recipes();
    init_paused_runs();
    init_magic_vars();
    init_telemetry();
    init_trace_redaction();
    init_endpoints();
    GraphExecutor = class _GraphExecutor {
      loader;
      workflowLoader;
      env;
      apiKey;
      recordComponentReference;
      // kbdb-base §7.1+§7.5.h：本次執行用到的 recipe **key**（uuid 優先，舊資料 fallback canonical_id）。
      // 判定單位是「工作流執行」（n8n execution）：執行結束後由 executeWebhookGraph 一次性把這組 key
      // 各記成功/失敗到 KBDB 市場星數（per-uuid → 能區分同 canonical 的不同作者版本，§7.5.5）。執行中只收集。
      usedRecipeKeys = /* @__PURE__ */ new Set();
      // resumable workflow（SDD: resumable-workflow/design.md）
      // 暫停時持久化 state 用，需在 execute 進入時設定
      currentGraph;
      currentRunId;
      // inkstone/Arcrun#197：本次執行解出來的 credential 真身名單。
      // 唯一用途＝把值寫進「除錯面」（trace / failed_input / 錯誤訊息 / 回傳的 data）之前
      // 換成標記。每次 execute / resumeFromPaused 進入時重建，不跨執行殘留。
      //
      // 🔴 為什麼遮在這裡而不是在各個 route：trace 只有這一個產地，
      // 而它的消費端有五個（POST /execute、cypher-handlers、webhook-handlers、
      // GET /executions/:task_id、POST /workflows/resume）＋ 一個持久化端（paused KV）。
      // 遮在產地＝六個出口一次補齊；遮在出口＝下一個新出口又會漏。
      redactor = new TraceRedactor();
      // inkstone/arcrun-rag#196：本次執行的 step-level 遙測先收在這裡，執行結束寫成一筆。
      // 原本每個 Component 節點各打一次 fetch，佔掉免費層每次呼叫 50 子請求的額度。
      nodeSteps = [];
      constructor(loader, workflowLoader, env, apiKey) {
        this.loader = loader;
        this.workflowLoader = workflowLoader;
        this.env = env;
        this.apiKey = apiKey;
      }
      async execute(graph, initialContext, kvNamespace) {
        const trace = [];
        this.redactor = new TraceRedactor();
        const kvStore = kvNamespace ? { runId: `${graph.id}-${Date.now()}`, kv: kvNamespace } : void 0;
        this.currentGraph = graph;
        this.currentRunId = kvStore?.runId ?? `${graph.id}-${Date.now()}`;
        const ctxWithMagic = {
          ...initialContext,
          ...buildMagicVars(),
          ...this.apiKey !== void 0 ? { _tenant: this.apiKey } : {}
        };
        const hasIncoming = new Set(graph.edges.map((e) => e.to));
        const startNodes = graph.nodes.filter((n) => !hasIncoming.has(n.id));
        if (startNodes.length === 0) {
          return { data: ctxWithMagic, trace };
        }
        const fanIn = /* @__PURE__ */ new Map();
        for (const node of graph.nodes) {
          const inDeg = graph.edges.filter((e) => e.to === node.id).length;
          if (inDeg > 1) {
            fanIn.set(node.id, { ctx: { ...ctxWithMagic }, remaining: inDeg });
          }
        }
        this.nodeSteps = [];
        let results;
        try {
          results = await Promise.all(
            startNodes.map(
              (node) => this.executeNode(node, graph, ctxWithMagic, /* @__PURE__ */ new Set(), trace, fanIn, kvStore)
            )
          );
        } finally {
          this.flushNodeSteps(graph);
        }
        let mergedResult;
        if (results.length === 1) {
          mergedResult = results[0];
        } else {
          mergedResult = results.reduce(
            (acc, r) => ({
              ...acc,
              ...typeof r === "object" && r !== null ? r : {}
            }),
            {}
          );
        }
        return { data: this.redactor.redact(mergedResult), trace };
      }
      /**
       * 從 paused state 繼續執行 workflow
       * SDD: resumable-workflow/design.md §3.2
       *
       * 流程：
       * 1. 把 paused_node 當已執行（result = callbackResult，注入進 context）
       * 2. 找出 paused_node 的所有下游節點當新起點
       * 3. 執行下游節點直到結束（或再次 paused）
       */
      async resumeFromPaused(args) {
        const { graph, paused_node_id, paused_context, prior_trace, kvNamespace } = args;
        let { callback_result } = args;
        this.redactor = new TraceRedactor();
        callback_result = parseRecipeOutput(
          callback_result,
          args.recipe_output_format,
          args.recipe_output_required_fields
        );
        this.currentGraph = graph;
        this.currentRunId = `${graph.id}-resume-${Date.now()}`;
        const trace = [...prior_trace];
        const kvStore = kvNamespace ? { runId: this.currentRunId, kv: kvNamespace } : void 0;
        if (kvStore) {
          await kvSetNodeOutput(kvStore, paused_node_id, callback_result);
        }
        const mergedContext = {
          ...paused_context,
          ...callback_result && typeof callback_result === "object" ? callback_result : {},
          [paused_node_id]: callback_result
        };
        if (kvStore) {
          if (!mergedContext._kv_outputs) mergedContext._kv_outputs = {};
          mergedContext._kv_outputs[paused_node_id] = callback_result;
        }
        const downstreamEdges = graph.edges.filter((e) => e.from === paused_node_id);
        if (downstreamEdges.length === 0) {
          return { data: this.redactor.redact(callback_result), trace };
        }
        const fanIn = /* @__PURE__ */ new Map();
        for (const node of graph.nodes) {
          const inDeg = graph.edges.filter((e) => e.to === node.id).length;
          if (inDeg > 1) {
            fanIn.set(node.id, { ctx: { ...mergedContext }, remaining: inDeg });
          }
        }
        const visited = /* @__PURE__ */ new Set([`${paused_node_id}:${JSON.stringify(paused_context).slice(0, 50)}`]);
        const downstreamNodes = downstreamEdges.map((e) => graph.nodes.find((n) => n.id === e.to)).filter((n) => !!n);
        this.nodeSteps = [];
        let results;
        try {
          results = await Promise.all(
            downstreamNodes.map(
              (node) => this.executeNode(node, graph, mergedContext, visited, trace, fanIn, kvStore)
            )
          );
        } finally {
          this.flushNodeSteps(graph);
        }
        let mergedResult;
        if (results.length === 1) {
          mergedResult = results[0];
        } else {
          mergedResult = results.reduce(
            (acc, r) => ({
              ...acc,
              ...typeof r === "object" && r !== null ? r : {}
            }),
            {}
          );
        }
        return { data: this.redactor.redact(mergedResult), trace };
      }
      /** 把本次收集的 step-level 遙測寫成一筆（成功、失敗、暫停都寫）。 */
      flushNodeSteps(graph) {
        const steps = this.nodeSteps;
        this.nodeSteps = [];
        if (this.env && steps.length > 0) recordNodeSteps(this.env, this.apiKey, graph.name, steps);
      }
      async executeNode(node, graph, context, visited, trace, fanIn, kvStore) {
        const nodeKey = `${node.id}:${JSON.stringify(context).slice(0, 50)}`;
        if (visited.has(nodeKey)) return context;
        visited.add(nodeKey);
        const start = Date.now();
        let result = context;
        let nodeInput = context;
        try {
          switch (node.type) {
            case "Input":
              result = node.data ?? context;
              nodeInput = result;
              break;
            case "Component": {
              if (!node.componentId) throw new Error(`\u7BC0\u9EDE ${node.id} \u7F3A\u5C11 componentId`);
              const runner = await this.loader(node.componentId);
              const ctx = context;
              const authoredData = node.data ?? {};
              const dataWithCredentials = this.env && this.apiKey ? await resolveCredentialRefs(authoredData, this.env, this.apiKey, this.redactor) : authoredData;
              const resolvedData = interpolateData(dataWithCredentials, ctx);
              let mergedContext = {
                ...ctx,
                ...resolvedData
              };
              if (node.componentId === "claude_api") {
                mergedContext.callback_url = `${publicBaseUrl(this.env ?? {})}/workflows/resume`;
              }
              if (typeof resolvedData.recipe === "string" && this.env?.RECIPES) {
                try {
                  const expanded = await expandPromptRecipe(
                    resolvedData.recipe,
                    ctx,
                    this.env,
                    this.apiKey ?? ""
                  );
                  mergedContext = {
                    ...mergedContext,
                    prompt: expanded.prompt,
                    model: expanded.model,
                    _recipe_output_format: expanded.output_format,
                    _recipe_output_required_fields: expanded.output_required_fields
                  };
                } catch (e) {
                  throw new Error(`recipe \u5C55\u958B\u5931\u6557 (${resolvedData.recipe}): ${e instanceof Error ? e.message : String(e)}`);
                }
              }
              if (this.env && this.apiKey) {
                const dispatched = await tryAuthDispatch(node.componentId, mergedContext, this.env, this.apiKey, this.redactor);
                if (dispatched) {
                  mergedContext = dispatched;
                }
              }
              if (this.env?.RECIPES) {
                try {
                  const apiRecipe = await resolveRecipe(node.componentId, this.env.RECIPES);
                  if (apiRecipe) this.usedRecipeKeys.add(apiRecipe.uuid ?? apiRecipe.canonical_id);
                } catch {
                }
              }
              nodeInput = mergedContext;
              result = await runner(mergedContext);
              const pending = isResumablePending(result);
              if (pending && this.env?.EXEC_CONTEXT && this.currentGraph && this.currentRunId) {
                trace.push({
                  nodeId: node.id,
                  type: node.type,
                  input: this.redactor.redact(nodeInput),
                  output: this.redactor.redact(result),
                  duration_ms: Date.now() - start
                });
                await persistPausedRun(this.env.EXEC_CONTEXT, pending.task_id, {
                  run_id: this.currentRunId,
                  graph: this.currentGraph,
                  paused_node_id: node.id,
                  paused_context: this.redactor.redact(context),
                  paused_pending_result: this.redactor.redact(result),
                  trace_so_far: trace,
                  api_key: this.apiKey,
                  expires_at: Date.now() + 24 * 60 * 60 * 1e3,
                  recipe_output_format: mergedContext._recipe_output_format,
                  recipe_output_required_fields: mergedContext._recipe_output_required_fields
                });
                throw new WorkflowPaused(pending.task_id, this.currentRunId, node.id, trace);
              }
              result = parseRecipeOutput(
                result,
                mergedContext._recipe_output_format,
                mergedContext._recipe_output_required_fields
              );
              if (kvStore && result !== null && result !== void 0 && graph.edges.some((e) => e.from === node.id && e.type === "PIPE")) {
                await kvSetNodeOutput(kvStore, node.id, result);
              }
              void this.recordComponentReference?.(node.componentId, graph.id).catch(() => {
              });
              break;
            }
            case "Output":
              result = context;
              break;
          }
        } catch (e) {
          if (e instanceof WorkflowPaused) throw e;
          const errMsg = this.redactor.redactString(e.message || String(e));
          const duration_ms2 = Date.now() - start;
          trace.push({
            nodeId: node.id,
            type: node.type,
            input: this.redactor.redact(nodeInput),
            output: null,
            error: errMsg,
            duration_ms: duration_ms2
          });
          if (node.type === "Component") {
            this.nodeSteps.push({ component_id: node.componentId, duration_ms: duration_ms2, ok: false, error_code: "node_error" });
          }
          if (e instanceof ExecutionError) throw e;
          throw new ExecutionError(
            `Node ${node.id} failed: ${errMsg}`,
            node.id,
            // #197：`failed_input` 直接進 HTTP 回應（execute.ts / cypher-handlers.ts）
            this.redactor.redact(nodeInput),
            trace
          );
        }
        const duration_ms = Date.now() - start;
        trace.push({
          nodeId: node.id,
          type: node.type,
          input: this.redactor.redact(nodeInput),
          output: this.redactor.redact(result),
          duration_ms
        });
        if (node.type === "Component") {
          this.nodeSteps.push({ component_id: node.componentId, duration_ms, ok: true });
        }
        const ownResult = result;
        let returnValue = ownResult;
        const outEdges = graph.edges.filter((e) => e.from === node.id);
        for (const edge of outEdges) {
          const nextNode = graph.nodes.find((n) => n.id === edge.to);
          if (!nextNode) continue;
          switch (edge.type) {
            case "PIPE": {
              const pipeContext = propagateCtx(context, ownResult, node.id);
              if (kvStore) {
                const kvOutput = await kvGetNodeOutput(kvStore, node.id);
                if (kvOutput !== void 0) {
                  if (!pipeContext._kv_outputs) pipeContext._kv_outputs = {};
                  pipeContext._kv_outputs[node.id] = kvOutput;
                }
              }
              const fanInState = fanIn.get(nextNode.id);
              if (fanInState) {
                Object.assign(fanInState.ctx, pipeContext);
                fanInState.remaining--;
                if (fanInState.remaining === 0) {
                  returnValue = await this.executeNode(nextNode, graph, fanInState.ctx, visited, trace, fanIn, kvStore);
                }
              } else {
                returnValue = await this.executeNode(nextNode, graph, pipeContext, visited, trace, fanIn, kvStore);
              }
              break;
            }
            case "ON_SUCCESS": {
              if (!isFailure(ownResult)) {
                const mergedCtx = propagateCtx(context, ownResult, node.id);
                returnValue = await this.executeNode(nextNode, graph, mergedCtx, visited, trace, fanIn, kvStore);
              }
              break;
            }
            case "ON_FAIL": {
              if (isFailure(ownResult)) {
                const mergedCtx = propagateCtx(context, ownResult, node.id);
                returnValue = await this.executeNode(nextNode, graph, mergedCtx, visited, trace, fanIn, kvStore);
              }
              break;
            }
            case "IF": {
              const passes = evaluateCondition(edge.condition ?? "true", ownResult);
              if (passes) {
                const mergedCtx = propagateCtx(context, ownResult, node.id);
                returnValue = await this.executeNode(nextNode, graph, mergedCtx, visited, trace, fanIn, kvStore);
              }
              break;
            }
            // ── 條件邊（SDD workflow-discovery 3.11 / CP arcrun-usable 步驟 5 缺口①）──
            // 為什麼要有：`if_control` 回 {result, branch} 卻沒有邊讀得懂它，
            // AI 照規矩用了零件仍得寫 code 判斷走哪條 ⇒「全變成 code」的根（Arcrun#5）。
            // 讀法對齊零件 output_schema：優先 data.branch（if_control/switch 的正式形狀），
            // 相容 top-level branch / result 布林。讀不出分支＝不走（誠實，不亂挑一條）。
            case "ON_TRUE": {
              if (readBranch(ownResult) === "true") {
                const mergedCtx = propagateCtx(context, ownResult, node.id);
                returnValue = await this.executeNode(nextNode, graph, mergedCtx, visited, trace, fanIn, kvStore);
              }
              break;
            }
            case "ON_FALSE": {
              if (readBranch(ownResult) === "false") {
                const mergedCtx = propagateCtx(context, ownResult, node.id);
                returnValue = await this.executeNode(nextNode, graph, mergedCtx, visited, trace, fanIn, kvStore);
              }
              break;
            }
            case "ON_BRANCH": {
              const actual = readBranch(ownResult);
              if (edge.branch !== void 0 && actual !== void 0 && actual === edge.branch) {
                const mergedCtx = propagateCtx(context, ownResult, node.id);
                returnValue = await this.executeNode(nextNode, graph, mergedCtx, visited, trace, fanIn, kvStore);
              }
              break;
            }
            case "FOREACH": {
              const iteratorKey = edge.iterator ?? "item";
              let items = getIterableFromContext(ownResult, iteratorKey);
              if (items.length === 0) {
                items = getIterableFromContext(context, iteratorKey);
              }
              const iterResults = [];
              const baseForeachCtx = propagateCtx(context, ownResult, node.id);
              for (const item of items) {
                const itemContext = {
                  ...baseForeachCtx,
                  [iteratorKey]: item
                };
                const itemResult = await this.executeNode(nextNode, graph, itemContext, /* @__PURE__ */ new Set(), trace, fanIn, kvStore);
                iterResults.push(itemResult);
              }
              if (iterResults.length > 0) {
                const failures = iterResults.filter(
                  (r) => r !== null && typeof r === "object" && r.success === false
                );
                if (failures.length === iterResults.length) {
                  const first = failures[0];
                  const errParts = [];
                  if (first.error) errParts.push(String(first.error));
                  if (typeof first.status === "number") errParts.push(`HTTP ${first.status}`);
                  const bodyData = first.data;
                  if (bodyData && typeof bodyData.body === "string" && bodyData.body) {
                    errParts.push(bodyData.body.slice(0, 200));
                  }
                  throw new Error(
                    `FOREACH \u6240\u6709 ${iterResults.length} \u9805\u76EE\u5747\u5931\u6557\uFF08\u9996\u9805\uFF1A${errParts.join("\uFF1B") || "\u672A\u77E5\u932F\u8AA4"}\uFF09`
                  );
                }
              }
              returnValue = { ...ownResult, results: iterResults };
              break;
            }
            case "CALLS_SUBFLOW": {
              const subWorkflowId = nextNode.componentId?.replace("workflow://", "") ?? nextNode.id;
              if (this.workflowLoader) {
                const subGraph = await this.workflowLoader(subWorkflowId);
                const subExecutor = new _GraphExecutor(this.loader, this.workflowLoader);
                const subResult = await subExecutor.execute(
                  subGraph,
                  ownResult,
                  kvStore?.kv
                );
                returnValue = {
                  ...ownResult,
                  ...subResult.data
                };
              }
              break;
            }
            case "ON_CLICK": {
              const mergedCtx = propagateCtx(context, ownResult, node.id);
              returnValue = await this.executeNode(nextNode, graph, mergedCtx, visited, trace, fanIn, kvStore);
              break;
            }
            case "IS_A": {
              break;
            }
            case "CONTAINS":
            case "HAS_STYLE":
            case "HAS_BEHAVIOR": {
              break;
            }
            case "CONTINUE":
              break;
          }
        }
        return returnValue;
      }
    };
  }
});

// cypher-executor/src/lib/schemas.ts
var graphSchema, executeSchema;
var init_schemas = __esm({
  "cypher-executor/src/lib/schemas.ts"() {
    "use strict";
    init_lib();
    graphSchema = z.object({
      id: z.string().min(1),
      name: z.string().min(1),
      nodes: z.array(z.object({
        id: z.string(),
        type: z.enum(["Input", "Component", "Output"]),
        componentId: z.string().optional(),
        label: z.string().optional(),
        data: z.record(z.unknown()).optional()
      })),
      edges: z.array(z.object({
        from: z.string(),
        to: z.string(),
        type: z.enum(["PIPE", "IF", "FOREACH", "CONTINUE", "IS_A", "ON_SUCCESS", "ON_FAIL", "ON_TRUE", "ON_FALSE", "ON_BRANCH", "ON_CLICK", "CALLS_SUBFLOW", "CONTAINS", "HAS_STYLE", "HAS_BEHAVIOR"]),
        condition: z.string().optional(),
        iterator: z.string().optional(),
        branch: z.string().optional()
        // ON_BRANCH 的具名分支（SDD workflow-discovery 3.11）
      }))
    });
    executeSchema = z.object({
      graph: graphSchema,
      context: z.record(z.unknown()).default({})
    });
  }
});

// cypher-executor/src/actions/execution-evaluator.ts
function componentVerdictsFromTrace(nodes, trace) {
  const componentByNodeId = /* @__PURE__ */ new Map();
  for (const n of nodes) {
    if (n.type === "Component" && n.componentId) componentByNodeId.set(n.id, n.componentId);
  }
  const verdicts = [];
  for (const step of trace) {
    const componentId = componentByNodeId.get(step.nodeId);
    if (!componentId) continue;
    const out = step.output;
    const outputSaysFailed = typeof out === "object" && out !== null && !Array.isArray(out) && out.success === false;
    verdicts.push({
      component_id: componentId,
      success: !step.error && !outputSaysFailed,
      duration_ms: Math.max(0, Number(step.duration_ms) || 0)
    });
  }
  return verdicts;
}
function aggregateVerdicts(verdicts) {
  const byId = /* @__PURE__ */ new Map();
  for (const v of verdicts) {
    const a = byId.get(v.component_id) ?? { component_id: v.component_id, runs: 0, success_runs: 0, duration_ms: 0 };
    a.runs += 1;
    a.success_runs += v.success ? 1 : 0;
    a.duration_ms += v.duration_ms;
    byId.set(v.component_id, a);
  }
  return [...byId.values()];
}
async function recordComponentStats(env, nodes, trace) {
  try {
    const base = registryBaseUrl(env);
    if (!base) return;
    const verdicts = componentVerdictsFromTrace(nodes, trace);
    if (verdicts.length === 0) return;
    await Promise.all(
      aggregateVerdicts(verdicts).map(
        (a) => fetch(`${base}/analytics/record`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            canonical_id: a.component_id,
            // 舊版 registry 不認 runs 時只會記 1 筆：給它「全部成功才算成功」的保守值
            success: a.success_runs === a.runs,
            duration_ms: a.duration_ms,
            runs: a.runs,
            success_runs: a.success_runs
          })
        }).catch(() => void 0)
        // 統計失敗不影響執行
      )
    );
  } catch {
  }
}
var init_execution_evaluator = __esm({
  "cypher-executor/src/actions/execution-evaluator.ts"() {
    "use strict";
    init_endpoints();
  }
});

// cypher-executor/src/lib/run-scratch.ts
function createRunScratch() {
  const m = /* @__PURE__ */ new Map();
  const scratch = {
    async get(key, type) {
      const raw2 = m.get(key);
      if (raw2 === void 0) return null;
      const t = typeof type === "string" ? type : type?.type;
      if (t === "json") {
        try {
          return JSON.parse(raw2);
        } catch {
          return null;
        }
      }
      return raw2;
    },
    async put(key, value) {
      m.set(key, String(value));
    },
    async delete(key) {
      m.delete(key);
    },
    async list(options) {
      const p = options?.prefix ?? "";
      return { keys: [...m.keys()].filter((k) => k.startsWith(p)).sort().map((name) => ({ name })), list_complete: true, cacheStatus: null };
    }
  };
  return scratch;
}
var init_run_scratch = __esm({
  "cypher-executor/src/lib/run-scratch.ts"() {
    "use strict";
  }
});

// cypher-executor/src/actions/webhook-handlers.ts
var webhook_handlers_exports = {};
__export(webhook_handlers_exports, {
  executeWebhookGraph: () => executeWebhookGraph,
  generateToken: () => generateToken,
  validateAndParseWebhook: () => validateAndParseWebhook
});
function recordRecipeStats(env, recipeKeys, ok, at, ctx) {
  if (recipeKeys.size === 0) return;
  const base = kbdbBaseUrl(env);
  let headers = { "Content-Type": "application/json" };
  if (env.KBDB_INTERNAL_TOKEN) headers["Authorization"] = `Bearer ${env.KBDB_INTERNAL_TOKEN}`;
  headers = withCaller(headers, KBDB_CALLERS.recipeStats);
  const promise = Promise.all(
    [...recipeKeys].map(
      (key) => fetch(`${base}/recipe-stats/record`, {
        method: "POST",
        headers,
        body: JSON.stringify({ canonical_id: key, ok, at })
      }).catch(() => void 0)
    )
  ).then(() => void 0);
  if (ctx?.waitUntil) ctx.waitUntil(promise);
  else void promise;
}
function generateToken() {
  const tokenBytes = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(tokenBytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}
async function validateAndParseWebhook(raw2) {
  try {
    return JSON.parse(raw2);
  } catch {
    return null;
  }
}
async function executeWebhookGraph(env, graph, triggerContext, token, apiKey, ctx, userAgent) {
  const parsed = graphSchema.safeParse(graph);
  if (!parsed.success) {
    return { success: false, error: "\u5716\u5B9A\u7FA9\u5DF2\u5931\u6548", duration_ms: 0 };
  }
  const loader = createComponentLoader(env);
  const executor = new GraphExecutor(loader, void 0, env, apiKey);
  const start = Date.now();
  try {
    const result = await executor.execute(
      parsed.data,
      { ...triggerContext, _webhook_token: token },
      createRunScratch()
      // #98：節點 output 只活在這次執行的記憶體（暫停執行另走 env.EXEC_CONTEXT → KBDB）
    );
    const duration_ms = Date.now() - start;
    const verdict = deriveExecutionVerdict(parsed.data, result.trace);
    recordTelemetry(env, apiKey, {
      event_type: verdict.success ? "run_success" : "run_fail",
      workflow_name: token,
      error_code: verdict.success ? void 0 : "node_failed_unhandled",
      duration_ms,
      agent_user_agent: userAgent
    }, ctx);
    recordRecipeStats(env, executor.usedRecipeKeys, verdict.success, Date.now(), ctx);
    {
      const statsPromise = recordComponentStats(
        env,
        parsed.data.nodes,
        result.trace
      );
      if (ctx?.waitUntil) ctx.waitUntil(statsPromise);
      else void statsPromise;
    }
    if (!verdict.success) {
      return {
        success: false,
        data: result.data,
        error: verdict.error,
        trace: result.trace,
        duration_ms
      };
    }
    return { success: true, data: result.data, trace: result.trace, duration_ms };
  } catch (err) {
    const duration_ms = Date.now() - start;
    const errMsg = err instanceof Error ? err.message : String(err);
    const isPaused = /workflow paused/i.test(errMsg);
    recordTelemetry(env, apiKey, {
      event_type: isPaused ? "run_success" : "run_fail",
      workflow_name: token,
      error_code: isPaused ? "paused_awaiting_resume" : "execution_error",
      duration_ms,
      agent_user_agent: userAgent
    }, ctx);
    if (!isPaused) {
      recordRecipeStats(env, executor.usedRecipeKeys, false, Date.now(), ctx);
    }
    if (!isPaused && err instanceof ExecutionError) {
      const statsPromise = recordComponentStats(
        env,
        parsed.data.nodes,
        err.trace
      );
      if (ctx?.waitUntil) ctx.waitUntil(statsPromise);
      else void statsPromise;
    }
    if (err instanceof ExecutionError) {
      const traceFormatted = err.trace.map((s) => ({
        node: s.nodeId,
        status: s.error ? "failed" : "success",
        ...s.error ? { error: s.error } : {}
      }));
      return {
        success: false,
        error: errMsg,
        trace: traceFormatted,
        duration_ms
      };
    }
    return { success: false, error: errMsg, duration_ms };
  }
}
var init_webhook_handlers = __esm({
  "cypher-executor/src/actions/webhook-handlers.ts"() {
    "use strict";
    init_types();
    init_graph_executor();
    init_schemas();
    init_component_loader();
    init_telemetry();
    init_execution_evaluator();
    init_run_scratch();
    init_kbdb_caller();
    init_endpoints();
  }
});

// cypher-executor/src/lib/component-loader.ts
function wasmWorkerUrl(canonicalId, subdomain) {
  const kebab = canonicalId.replace(/_/g, "-");
  return `https://arcrun-${kebab}.${subdomain}.workers.dev`;
}
function createComponentLoader(env) {
  return async (componentId) => {
    if (componentId === "trigger_workflow") {
      return makeTriggerWorkflowRunner(env);
    }
    const builtin = BUILTIN_COMPONENTS.get(componentId);
    if (builtin) return builtin;
    if (componentId.startsWith("http://") || componentId.startsWith("https://")) {
      return makeHttpRunner(componentId);
    }
    if (isComponentHash(componentId)) {
      const canonicalId = await env.WEBHOOKS.get(`idx:${componentId}`);
      if (canonicalId) {
        const runner = makeLogicRunner(canonicalId, env);
        if (runner) return runner;
      }
      throw new Error(`\u627E\u4E0D\u5230\u96F6\u4EF6 hash "${componentId}"\uFF0C\u8ACB\u78BA\u8A8D\u5DF2\u900F\u904E acr push \u4E0A\u50B3`);
    }
    if (isRecipeHash(componentId)) {
      const recipe = await resolveRecipe(componentId, env.RECIPES);
      if (recipe) return pickRecipeRunner(recipe, env);
      throw new Error(`\u627E\u4E0D\u5230 recipe hash "${componentId}"\uFF0C\u8ACB\u78BA\u8A8D\u5DF2\u900F\u904E acr push \u4E0A\u50B3`);
    }
    const logicRunner = makeLogicRunner(componentId, env);
    if (logicRunner) return logicRunner;
    if (WASM_HTTP_RUNNER_IDS.has(componentId)) {
      return makeHttpRunner(componentUrl(componentId, env));
    }
    const authRecipe = await resolveAuthRecipe(componentId, env.RECIPES);
    if (authRecipe) return makeAuthRecipeRunner(authRecipe);
    const kvRecipe = await resolveRecipe(componentId, env.RECIPES);
    if (kvRecipe) return pickRecipeRunner(kvRecipe, env);
    throw new Error(
      `\u627E\u4E0D\u5230\u96F6\u4EF6 "${componentId}"\u3002
\u908F\u8F2F\u96F6\u4EF6\uFF1A${Object.keys(LOGIC_BINDING_MAP).join(", ")}
\u6216\u50B3\u5165\u5916\u90E8 URL\uFF08https://...\uFF09\u3001recipe hash\uFF08rec_xxxxxxxx\uFF09\u3001\u96F6\u4EF6 hash\uFF08cmp_xxxxxxxx\uFF09`
    );
  };
}
function makeTriggerWorkflowRunner(env) {
  return async (ctx) => {
    const c = ctx && typeof ctx === "object" ? ctx : {};
    const workflowName = String(c.workflow_name ?? "");
    const apiKey = String(c.api_key ?? "");
    const input = c.input && typeof c.input === "object" ? c.input : {};
    const wait = c.wait !== false;
    if (!workflowName) return { success: false, error: "trigger_workflow \u7F3A workflow_name" };
    if (!apiKey) return { success: false, error: "trigger_workflow \u7F3A api_key" };
    const wfKey = `${apiKey}:wf:${workflowName}`;
    const wfRaw = await env.WEBHOOKS.get(wfKey, "text");
    if (!wfRaw) return { success: false, error: `\u627E\u4E0D\u5230 workflow "${workflowName}" (key=${wfKey})` };
    let record;
    try {
      record = JSON.parse(wfRaw);
    } catch {
      return { success: false, error: `workflow "${workflowName}" KV \u5167\u5BB9\u975E JSON` };
    }
    if (!record.graph) return { success: false, error: `workflow "${workflowName}" \u7F3A graph \u6B04\u4F4D` };
    const { executeWebhookGraph: executeWebhookGraph2 } = await Promise.resolve().then(() => (init_webhook_handlers(), webhook_handlers_exports));
    const triggerContext = { ...input, _triggered_by: "trigger_workflow" };
    if (wait) {
      const r = await executeWebhookGraph2(env, record.graph, triggerContext, workflowName, apiKey);
      const isPaused = !r.success && typeof r.error === "string" && /workflow paused/i.test(r.error);
      return {
        success: r.success || isPaused,
        triggered_workflow: workflowName,
        status: r.success ? "completed" : isPaused ? "running_async" : "failed",
        sub_result: r
      };
    } else {
      void executeWebhookGraph2(env, record.graph, triggerContext, workflowName, apiKey).catch((e) => console.error("[trigger_workflow] fire-and-forget fail", workflowName, e));
      return { success: true, triggered_workflow: workflowName, mode: "fire_and_forget" };
    }
  };
}
function makeHttpRunner(url) {
  return async (ctx) => {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ctx)
    });
    if (!res.ok) {
      const text2 = await res.text();
      return { success: false, status: res.status, error: text2.slice(0, 200) };
    }
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      return { success: true, data: text };
    }
  };
}
function makeLogicRunner(canonicalId, env) {
  const bindingKey = LOGIC_BINDING_MAP[canonicalId];
  if (!bindingKey) return null;
  const svc = env[bindingKey];
  if (svc) {
    return async (ctx) => {
      const res = await svc.fetch(new Request("https://component/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ctx)
      }));
      if (!res.ok) {
        const text = await res.text();
        return { success: false, error: `${canonicalId} \u56DE\u50B3 ${res.status}: ${text.slice(0, 200)}` };
      }
      try {
        return await res.json();
      } catch {
        return { success: false, error: `${canonicalId} \u56DE\u50B3\u975E JSON` };
      }
    };
  }
  return makeHttpRunner(componentUrl(canonicalId, env));
}
function pickRecipeRunner(recipe, env) {
  return recipe.auth === "binding" ? makeBindingRecipeRunner(recipe, env) : makeRecipeRunner(recipe);
}
function makeBindingRecipeRunner(recipe, env) {
  return async (ctx) => {
    const ctxObj = ctx && typeof ctx === "object" ? ctx : {};
    const name = recipe.binding_name ?? "AI";
    const binding = env[name];
    if (!binding) {
      return {
        success: false,
        error: `recipe "${recipe.canonical_id}" \u5BA3\u544A auth: binding\u3001binding_name: "${name}"\uFF0C\u4F46\u9019\u500B\u90E8\u7F72\u6C92\u6709\u7D81\u5B9A ${name}\u3002\u8ACB\u5728 wrangler.toml \u88DC\u4E0A\u8A72 binding \u5F8C\u91CD\u65B0\u90E8\u7F72\u3002`
      };
    }
    const target = recipe.endpoint;
    const payload = renderBodyTemplate(recipe.body_template ?? recipe.body, ctxObj) ?? Object.fromEntries(Object.entries(ctxObj).filter(([k]) => !k.startsWith("_")));
    try {
      const runner = binding;
      if (typeof runner.run !== "function") {
        return {
          success: false,
          error: `binding "${name}" \u6C92\u6709 run() \u65B9\u6CD5\uFF0C\u76EE\u524D binding \u578B\u53EA\u652F\u63F4 run(model, input) \u5F62\u72C0\uFF08\u5982 env.AI\uFF09\u3002`
        };
      }
      const data = await runner.run(target, payload);
      if (recipe.response_map) {
        const normalized = applyResponseMap(data, recipe.response_map);
        return { success: true, data, text: normalized.text };
      }
      return { success: true, data };
    } catch (e) {
      return {
        success: false,
        error: `binding "${name}" \u547C\u53EB\u5931\u6557\uFF08${target}\uFF09\uFF1A${e instanceof Error ? e.message : String(e)}`
      };
    }
  };
}
function makeRecipeRunner(recipe) {
  return async (ctx) => {
    const ctxObj = ctx && typeof ctx === "object" ? ctx : {};
    const authPath = ctxObj._auth_path ?? {};
    const interpolate2 = (s) => s.replace(
      /\{\{(auth\.)?(\w+)\}\}/g,
      (_, authPrefix, k) => String(authPrefix ? authPath[k] ?? "" : ctxObj[k] ?? "")
    );
    const method = (recipe.method ?? "POST").toUpperCase();
    const authHeaders = ctxObj._auth_headers ?? {};
    const headers = {
      "Content-Type": "application/json",
      ...authHeaders
    };
    for (const [k, v] of Object.entries(recipe.headers ?? {})) {
      headers[k] = interpolate2(v);
    }
    let bodyStr;
    if (recipe.body_template) {
      bodyStr = JSON.stringify(renderBodyTemplate(recipe.body_template, ctxObj));
    } else if (recipe.body) {
      bodyStr = interpolate2(JSON.stringify(recipe.body));
    } else if (method !== "GET") {
      const bodyObj = Object.fromEntries(
        Object.entries(ctxObj).filter(([k]) => !k.startsWith("_"))
      );
      bodyStr = JSON.stringify(bodyObj);
    }
    const res = await fetch(interpolate2(recipe.endpoint), {
      method,
      headers,
      body: bodyStr
    });
    const data = await readBodyOnce(res);
    if (recipe.response_map) {
      const normalized = applyResponseMap(data, recipe.response_map);
      return { success: res.ok, status: res.status, data, text: normalized.text };
    }
    return { success: res.ok, status: res.status, data };
  };
}
function makeAuthRecipeRunner(recipe) {
  return async (ctx) => {
    const ctxObj = ctx && typeof ctx === "object" ? ctx : {};
    const authHeaders = ctxObj._auth_headers ?? {};
    const authQuery = ctxObj._auth_query ?? {};
    const path = typeof ctxObj._path === "string" ? ctxObj._path : "";
    const method = (ctxObj.method ?? "POST").toUpperCase();
    const url = new URL(recipe.base_url.replace(/\/$/, "") + path);
    for (const [k, v] of Object.entries(authQuery)) {
      url.searchParams.set(k, v);
    }
    const headers = {
      "Content-Type": "application/json",
      ...authHeaders
    };
    const bodyObj = Object.fromEntries(
      Object.entries(ctxObj).filter(([k]) => !k.startsWith("_") && k !== "method")
    );
    const res = await fetch(url.toString(), {
      method,
      headers,
      body: method !== "GET" ? JSON.stringify(bodyObj) : void 0
    });
    const data = await readBodyOnce(res);
    return { success: res.ok, status: res.status, data };
  };
}
async function readBodyOnce(res) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
var WASM_HTTP_RUNNER_IDS, LOGIC_BINDING_MAP, RUNTIME_NATIVE_COMPONENT_IDS;
var init_component_loader = __esm({
  "cypher-executor/src/lib/component-loader.ts"() {
    "use strict";
    init_constants3();
    init_hash();
    init_recipes();
    init_recipe_payload();
    init_endpoints();
    WASM_HTTP_RUNNER_IDS = /* @__PURE__ */ new Set([
      // 通用 HTTP 零件
      "http_request",
      // 串流轉發零件（Arcrun#242）：source_url 回應 body 直接轉送成 dest_url 請求 body，
      // 大型內容不進 stdin/stdout JSON 通道，用於部署整包 Worker bundle 等場景。
      "fetch_relay",
      // 通用 code 零件（sandbox inline JS，Arcrun#10 / 07-thin-shell §3.5 code-node）：獨立 Worker，
      // URL 走 wasmWorkerUrl 通用推導（arcrun-code.{WORKER_SUBDOMAIN}.workers.dev，
      // self-hosted 由 WORKER_SUBDOMAIN var 注入自己的 subdomain，無寫死官方域名）。
      // 漏這行 = workflow 寫 `component: code` 落到 step 8 直接「找不到零件」（#29 發現）。
      "code",
      // gmail / telegram / line_notify / google_sheets 已降級為 recipe（2026-05-29 Phase 2）：
      //   recipe:gmail_send / telegram_send / line_notify_send / google_sheets_read|append
      //   走 step 6 KV recipe 解析，不再是零件。零件目錄已刪。
      "cron",
      // Auth primitives
      "auth_static_key",
      "auth_service_account",
      "auth_oauth2",
      "auth_mtls",
      // hash（Arcrun#91，2026-08-13）：純計算零件（sha256/sha1/md5，hex/base64），
      // 出貨線版本號機制與成品指紋核對用它。no_network_syscall，故不走 LOGIC_BINDING_MAP
      // 的 Service Binding 路（rule 3.1 禁新增 binding），走這裡的通用 wasmWorkerUrl 推導，
      // 與 code/cron 同一形狀（獨立 Worker，白名單只是「知道這個 canonical_id 存在」）。
      "hash"
    ]);
    LOGIC_BINDING_MAP = {
      if_control: "SVC_IF_CONTROL",
      switch: "SVC_SWITCH",
      foreach_control: "SVC_FOREACH_CONTROL",
      filter: "SVC_FILTER",
      merge: "SVC_MERGE",
      try_catch: "SVC_TRY_CATCH",
      // wait 已於 Arcrun#101（2026-08-12）移進 BUILTIN_COMPONENTS（step 1）——
      // 等待是 orchestrator 的排程職責，WASI 沙箱裡做不到「不花 CPU 地等」。理由全文見
      // constants.ts 的 wait 註解。這裡刻意**移除**而非留著：step 1 本來就先於 step 5 命中，
      // 留下這行只會讓讀者以為 wait 還走 SVC_WAIT（實際永遠走不到）＝誤導人的死路由。
      // wrangler.toml 的 SVC_WAIT binding 不動（rule 3.1：13 個既有 binding 保留不新增），
      // 拆綁定要重新部署、與本票無關。
      set: "SVC_SET",
      array_ops: "SVC_ARRAY_OPS",
      string_ops: "SVC_STRING_OPS",
      number_ops: "SVC_NUMBER_OPS",
      date_ops: "SVC_DATE_OPS",
      validate_json: "SVC_VALIDATE_JSON"
      // ai_transform_compile / ai_transform_run 已刪除（2026-05-29）：
      // Arcrun 是 AI 呼叫的工具，工作流不該內嵌 AI 節點回頭呼叫 AI（n8n 才需要，因它沒大腦）。
    };
    RUNTIME_NATIVE_COMPONENT_IDS = /* @__PURE__ */ new Set([
      "trigger_workflow",
      ...BUILTIN_COMPONENTS.keys(),
      ...Object.keys(LOGIC_BINDING_MAP),
      ...WASM_HTTP_RUNNER_IDS
    ]);
  }
});

// cypher-executor/src/lib/endpoints.ts
function isPrivateCloud(env) {
  return /^(1|true|yes|on)$/i.test(String(env.PRIVATE_CLOUD ?? "").trim());
}
function componentUrl(canonicalId, env) {
  const kebab = canonicalId.replace(/_/g, "-");
  const template = String(env.COMPONENT_URL_TEMPLATE ?? "").trim();
  if (template) {
    if (!template.includes("{name}") && !template.includes("{id}")) {
      throw new EndpointConfigError(
        "COMPONENT_URL_TEMPLATE",
        "\u6A23\u677F\u88E1\u8981\u6709 {name}\uFF08\uFF1Darcrun-<\u96F6\u4EF6\u540D>\uFF09\u6216 {id}\uFF08\uFF1D<\u96F6\u4EF6\u540D>\uFF09\uFF0C\u5426\u5247\u6240\u6709\u96F6\u4EF6\u6703\u6307\u5230\u540C\u4E00\u500B\u4F4D\u5740"
      );
    }
    return trimSlash(template.replaceAll("{name}", `arcrun-${kebab}`).replaceAll("{id}", kebab));
  }
  if (isPrivateCloud(env)) {
    throw new EndpointConfigError("COMPONENT_URL_TEMPLATE", "\u79C1\u6709\u96F2\u6A21\u5F0F\uFF08PRIVATE_CLOUD\uFF09\u4E0D\u63A8\u5C0E workers.dev \u4F4D\u5740\uFF0C\u5FC5\u9808\u660E\u8A2D\u96F6\u4EF6\u4F4D\u5740\u6A23\u677F");
  }
  const sub = String(env.WORKER_SUBDOMAIN ?? "").trim();
  if (!sub) {
    throw new EndpointConfigError("WORKER_SUBDOMAIN", "\u4E5F\u6C92\u6709 COMPONENT_URL_TEMPLATE\uFF0C\u7121\u5F9E\u6C7A\u5B9A\u96F6\u4EF6\u5728\u54EA");
  }
  return wasmWorkerUrl(canonicalId, sub);
}
function kbdbBaseUrl(env) {
  const v = String(env.KBDB_BASE_URL ?? "").trim();
  if (!v) throw new EndpointConfigError("KBDB_BASE_URL", "KBDB \u4F4D\u5740\u6C92\u6709\u9810\u8A2D\u503C\uFF0C\u5FC5\u9808\u660E\u8A2D");
  return trimSlash(v);
}
function registryBaseUrl(env) {
  const v = String(env.REGISTRY_BASE_URL ?? "").trim();
  if (v) return trimSlash(v);
  try {
    return componentUrl("registry", env);
  } catch {
    return void 0;
  }
}
function publicBaseUrl(env) {
  const v = String(env.PUBLIC_BASE_URL ?? "").trim();
  if (v) return trimSlash(v);
  if (isPrivateCloud(env)) {
    throw new EndpointConfigError("PUBLIC_BASE_URL", "\u79C1\u6709\u96F2\u6A21\u5F0F\u4E0D\u9810\u8A2D\u70BA\u5B98\u65B9\u7DB2\u57DF\uFF0C\u5FC5\u9808\u660E\u8A2D\u672C\u5F15\u64CE\u7684\u5C0D\u5916\u4F4D\u5740");
  }
  return "https://cypher.arcrun.dev";
}
function mcpBaseUrl(env) {
  const v = String(env.MCP_BASE_URL ?? "").trim();
  if (v) return trimSlash(v);
  if (isPrivateCloud(env)) return "";
  try {
    return componentUrl("mcp", env);
  } catch {
    return "";
  }
}
var EndpointConfigError, trimSlash;
var init_endpoints = __esm({
  "cypher-executor/src/lib/endpoints.ts"() {
    "use strict";
    init_component_loader();
    EndpointConfigError = class extends Error {
      missing;
      constructor(missing, detail) {
        super(`[endpoint-config] ${missing} \u672A\u8A2D\u5B9A\uFF1A${detail}`);
        this.name = "EndpointConfigError";
        this.missing = missing;
      }
    };
    trimSlash = (s) => s.replace(/\/+$/, "");
  }
});

// cypher-executor/src/routes/kbdb-proxy.ts
function kbdbBase(env) {
  const base = kbdbBaseUrl(env);
  let headers = { "Content-Type": "application/json" };
  if (env.KBDB_INTERNAL_TOKEN) headers["Authorization"] = `Bearer ${env.KBDB_INTERNAL_TOKEN}`;
  headers = withCaller(headers, KBDB_CALLERS.proxy);
  return { base, headers };
}
function tenant(c) {
  return c.req.header("X-Arcrun-API-Key") ?? null;
}
function forwardQuery(c) {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(c.req.query())) {
    if (k === "owner_id" || v === void 0 || v === "") continue;
    params.set(k, v);
  }
  return params;
}
var kbdbProxyRouter, NEED_KEY;
var init_kbdb_proxy = __esm({
  "cypher-executor/src/routes/kbdb-proxy.ts"() {
    "use strict";
    init_dist();
    init_kbdb_caller();
    init_endpoints();
    kbdbProxyRouter = new Hono2();
    NEED_KEY = { error: "\u7F3A\u5C11 X-Arcrun-API-Key header" };
    kbdbProxyRouter.post("/kbdb/templates", async (c) => {
      const owner = tenant(c);
      if (!owner) return c.json(NEED_KEY, 401);
      const body = await c.req.json().catch(() => null);
      if (!body || !body.name || !Array.isArray(body.slots)) {
        return c.json({ error: "name \u8207 slots[] \u5FC5\u586B" }, 400);
      }
      const { base, headers } = kbdbBase(c.env);
      const res = await fetch(`${base}/templates`, {
        method: "POST",
        headers,
        // created_by 帶上租戶當溯源，但 template 本身全域可見可用
        body: JSON.stringify({ name: body.name, slots: body.slots, description: body.description, created_by: owner })
      });
      return new Response(res.body, { status: res.status, headers: { "Content-Type": "application/json" } });
    });
    kbdbProxyRouter.get("/kbdb/templates", async (c) => {
      if (!tenant(c)) return c.json(NEED_KEY, 401);
      const { base, headers } = kbdbBase(c.env);
      const res = await fetch(`${base}/templates`, { headers });
      return new Response(res.body, { status: res.status, headers: { "Content-Type": "application/json" } });
    });
    kbdbProxyRouter.get("/kbdb/templates/:idOrName", async (c) => {
      if (!tenant(c)) return c.json(NEED_KEY, 401);
      const { base, headers } = kbdbBase(c.env);
      const res = await fetch(`${base}/templates/${encodeURIComponent(c.req.param("idOrName"))}`, { headers });
      return new Response(res.body, { status: res.status, headers: { "Content-Type": "application/json" } });
    });
    kbdbProxyRouter.post("/kbdb/records", async (c) => {
      const owner = tenant(c);
      if (!owner) return c.json(NEED_KEY, 401);
      const body = await c.req.json().catch(() => null);
      if (!body || !body.template || !body.values && !body.entry_ids) {
        return c.json({ error: "template \u5FC5\u586B\uFF0Cvalues \u8207 entry_ids \u81F3\u5C11\u8981\u6709\u4E00\u500B" }, 400);
      }
      const { base, headers } = kbdbBase(c.env);
      const res = await fetch(`${base}/records`, {
        method: "POST",
        headers,
        // 強制以租戶身份隔離：忽略 caller 自帶 owner_id，一律用 header 身份（防跨租戶寫入）
        body: JSON.stringify({
          template: body.template,
          ...body.values ? { values: body.values } : {},
          ...body.entry_ids ? { entry_ids: body.entry_ids } : {},
          owner_id: owner
        })
      });
      return new Response(res.body, { status: res.status, headers: { "Content-Type": "application/json" } });
    });
    kbdbProxyRouter.get("/kbdb/records/by-template/:template", async (c) => {
      const owner = tenant(c);
      if (!owner) return c.json(NEED_KEY, 401);
      const { base, headers } = kbdbBase(c.env);
      const params = forwardQuery(c);
      params.set("owner_id", owner);
      const res = await fetch(
        `${base}/records/by-template/${encodeURIComponent(c.req.param("template"))}?${params.toString()}`,
        { headers }
      );
      return new Response(res.body, { status: res.status, headers: { "Content-Type": "application/json" } });
    });
    kbdbProxyRouter.post("/kbdb/records/backfill-library", async (c) => {
      const owner = tenant(c);
      if (!owner) return c.json(NEED_KEY, 401);
      const body = await c.req.json().catch(() => null);
      if (!body || !body.library) return c.json({ error: "library \u5FC5\u586B" }, 400);
      const { base, headers } = kbdbBase(c.env);
      const res = await fetch(`${base}/records/backfill-library`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          library: body.library,
          owner_id: owner,
          triplet_template: body.triplet_template,
          source_prefix: body.source_prefix,
          limit: body.limit
        })
      });
      return new Response(res.body, { status: res.status, headers: { "Content-Type": "application/json" } });
    });
    kbdbProxyRouter.get("/kbdb/records/backfill-library/status", async (c) => {
      const owner = tenant(c);
      if (!owner) return c.json(NEED_KEY, 401);
      const { base, headers } = kbdbBase(c.env);
      const params = new URLSearchParams({ owner_id: owner });
      for (const k of ["triplet_template", "source_prefix"]) {
        const v = c.req.query(k);
        if (v) params.set(k, v);
      }
      const res = await fetch(`${base}/records/backfill-library/status?${params.toString()}`, { headers });
      return new Response(res.body, { status: res.status, headers: { "Content-Type": "application/json" } });
    });
    kbdbProxyRouter.get("/kbdb/records/:recordId", async (c) => {
      if (!tenant(c)) return c.json(NEED_KEY, 401);
      const { base, headers } = kbdbBase(c.env);
      const res = await fetch(`${base}/records/${encodeURIComponent(c.req.param("recordId"))}`, { headers });
      return new Response(res.body, { status: res.status, headers: { "Content-Type": "application/json" } });
    });
    kbdbProxyRouter.patch("/kbdb/records/:recordId", async (c) => {
      if (!tenant(c)) return c.json(NEED_KEY, 401);
      const body = await c.req.json().catch(() => null);
      if (!body || typeof body.values !== "object" || body.values === null) {
        return c.json({ error: "values \u5FC5\u586B\uFF08{slot\u540D: \u5167\u5BB9}\uFF09" }, 400);
      }
      const { base, headers } = kbdbBase(c.env);
      const res = await fetch(`${base}/records/${encodeURIComponent(c.req.param("recordId"))}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ values: body.values })
      });
      return new Response(res.body, { status: res.status, headers: { "Content-Type": "application/json" } });
    });
    kbdbProxyRouter.get("/kbdb/search", async (c) => {
      const owner = tenant(c);
      if (!owner) return c.json(NEED_KEY, 401);
      const q = c.req.query("q");
      if (!q) return c.json({ error: "q \u5FC5\u586B" }, 400);
      const { base, headers } = kbdbBase(c.env);
      const params = forwardQuery(c);
      params.set("owner_id", owner);
      const res = await fetch(`${base}/entries/search?${params.toString()}`, { headers });
      return new Response(res.body, { status: res.status, headers: { "Content-Type": "application/json" } });
    });
    kbdbProxyRouter.get("/kbdb/retrieve", async (c) => {
      const owner = tenant(c);
      if (!owner) return c.json(NEED_KEY, 401);
      const q = c.req.query("q") || c.req.query("question");
      if (!q) return c.json({ error: "q \u5FC5\u586B" }, 400);
      const { base, headers } = kbdbBase(c.env);
      const params = forwardQuery(c);
      params.set("q", q);
      params.delete("question");
      params.set("owner_id", owner);
      try {
        const res = await fetch(`${base}/retrieve?${params.toString()}`, { headers });
        return new Response(res.body, { status: res.status, headers: { "Content-Type": "application/json" } });
      } catch (e) {
        return c.json({ success: false, error: `KBDB \u4E0D\u53EF\u9054\uFF08${base}\uFF09\uFF1A${e instanceof Error ? e.message : String(e)}` }, 502);
      }
    });
    kbdbProxyRouter.post("/kbdb/entries", async (c) => {
      const owner = tenant(c);
      if (!owner) return c.json(NEED_KEY, 401);
      const body = await c.req.json().catch(() => null);
      if (!body || !body.entry_type) return c.json({ error: "entry_type \u5FC5\u586B" }, 400);
      const { base, headers } = kbdbBase(c.env);
      const res = await fetch(`${base}/entries`, {
        method: "POST",
        headers,
        // 強制以租戶身份隔離：忽略 caller 自帶 owner_id，一律用 header 身份（防跨租戶寫入）
        body: JSON.stringify({ ...body, owner_id: owner })
      });
      return new Response(res.body, { status: res.status, headers: { "Content-Type": "application/json" } });
    });
    kbdbProxyRouter.get("/kbdb/entries", async (c) => {
      const owner = tenant(c);
      if (!owner) return c.json(NEED_KEY, 401);
      const { base, headers } = kbdbBase(c.env);
      const params = forwardQuery(c);
      const search = params.get("search");
      if (search && !params.get("q")) params.set("q", search);
      params.delete("search");
      params.set("owner_id", owner);
      const res = await fetch(`${base}/entries?${params.toString()}`, { headers });
      return new Response(res.body, { status: res.status, headers: { "Content-Type": "application/json" } });
    });
    kbdbProxyRouter.get("/kbdb/entries/library-cards", async (c) => {
      const owner = tenant(c);
      if (!owner) return c.json(NEED_KEY, 401);
      const { base, headers } = kbdbBase(c.env);
      const params = forwardQuery(c);
      params.set("owner_id", owner);
      const res = await fetch(`${base}/entries/library-cards?${params.toString()}`, { headers });
      return new Response(res.body, { status: res.status, headers: { "Content-Type": "application/json" } });
    });
    kbdbProxyRouter.get("/kbdb/entries/:id", async (c) => {
      if (!tenant(c)) return c.json(NEED_KEY, 401);
      const { base, headers } = kbdbBase(c.env);
      const res = await fetch(`${base}/entries/${encodeURIComponent(c.req.param("id"))}`, { headers });
      return new Response(res.body, { status: res.status, headers: { "Content-Type": "application/json" } });
    });
    kbdbProxyRouter.get("/kbdb/graph/neighbors/:name", async (c) => {
      const owner = tenant(c);
      if (!owner) return c.json(NEED_KEY, 401);
      const { base, headers } = kbdbBase(c.env);
      const params = forwardQuery(c);
      params.set("owner_id", owner);
      try {
        const res = await fetch(
          `${base}/graph/neighbors/${encodeURIComponent(c.req.param("name"))}?${params.toString()}`,
          { headers }
        );
        return new Response(res.body, { status: res.status, headers: { "Content-Type": "application/json" } });
      } catch (e) {
        return c.json({ error: `KBDB \u4E0D\u53EF\u9054\uFF08${base}\uFF09\uFF1A${e instanceof Error ? e.message : String(e)}` }, 502);
      }
    });
    kbdbProxyRouter.get("/kbdb/map", async (c) => {
      if (!tenant(c)) return c.json(NEED_KEY, 401);
      const { base, headers } = kbdbBase(c.env);
      const owner = c.req.query("owner_id");
      const qs = owner ? `?owner_id=${encodeURIComponent(owner)}` : "";
      try {
        const res = await fetch(`${base}/map${qs}`, { headers });
        return new Response(res.body, { status: res.status, headers: { "Content-Type": "application/json" } });
      } catch (e) {
        return c.json({ success: false, error: `KBDB \u4E0D\u53EF\u9054\uFF08${base}\uFF09\uFF1A${e instanceof Error ? e.message : String(e)}` }, 502);
      }
    });
    kbdbProxyRouter.get("/kbdb/map/:library", async (c) => {
      if (!tenant(c)) return c.json(NEED_KEY, 401);
      const { base, headers } = kbdbBase(c.env);
      const owner = c.req.query("owner_id");
      const qs = owner ? `?owner_id=${encodeURIComponent(owner)}` : "";
      try {
        const res = await fetch(`${base}/map/${encodeURIComponent(c.req.param("library"))}${qs}`, { headers });
        return new Response(res.body, { status: res.status, headers: { "Content-Type": "application/json" } });
      } catch (e) {
        return c.json({ success: false, error: `KBDB \u4E0D\u53EF\u9054\uFF08${base}\uFF09\uFF1A${e instanceof Error ? e.message : String(e)}` }, 502);
      }
    });
    kbdbProxyRouter.put("/kbdb/map/:library/narrative", async (c) => {
      if (!tenant(c)) return c.json(NEED_KEY, 401);
      const body = await c.req.json().catch(() => null);
      const narrative = typeof body?.narrative === "string" ? body.narrative : "";
      if (!narrative.trim()) return c.json({ error: "narrative \u5FC5\u586B\uFF08\u4E0D\u5F97\u7A7A\u767D\uFF09" }, 400);
      const owner = (typeof body?.owner_id === "string" ? body.owner_id : c.req.query("owner_id")) || void 0;
      const { base, headers } = kbdbBase(c.env);
      try {
        const res = await fetch(`${base}/map/${encodeURIComponent(c.req.param("library"))}/narrative`, {
          method: "PUT",
          headers,
          body: JSON.stringify({ narrative, ...owner ? { owner_id: owner } : {} })
        });
        return new Response(res.body, { status: res.status, headers: { "Content-Type": "application/json" } });
      } catch (e) {
        return c.json({ success: false, error: `KBDB \u4E0D\u53EF\u9054\uFF08${base}\uFF09\uFF1A${e instanceof Error ? e.message : String(e)}` }, 502);
      }
    });
    kbdbProxyRouter.post("/kbdb/map/recompute", async (c) => {
      if (!tenant(c)) return c.json(NEED_KEY, 401);
      const body = await c.req.json().catch(() => ({}));
      const library = (typeof body.library === "string" ? body.library : c.req.query("library")) || "";
      if (!library.trim()) return c.json({ error: "library \u5FC5\u586B" }, 400);
      const owner = (typeof body.owner_id === "string" ? body.owner_id : c.req.query("owner_id")) || void 0;
      const { base, headers } = kbdbBase(c.env);
      try {
        const res = await fetch(`${base}/map/recompute`, {
          method: "POST",
          headers,
          body: JSON.stringify({ ...body, library, ...owner ? { owner_id: owner } : {} })
        });
        return new Response(res.body, { status: res.status, headers: { "Content-Type": "application/json" } });
      } catch (e) {
        return c.json({ success: false, error: `KBDB \u4E0D\u53EF\u9054\uFF08${base}\uFF09\uFF1A${e instanceof Error ? e.message : String(e)}` }, 502);
      }
    });
    kbdbProxyRouter.patch("/kbdb/entries/:id", async (c) => {
      if (!tenant(c)) return c.json(NEED_KEY, 401);
      const body = await c.req.json().catch(() => ({}));
      const { owner_id: _drop, ...patch } = body ?? {};
      const { base, headers } = kbdbBase(c.env);
      const res = await fetch(`${base}/entries/${encodeURIComponent(c.req.param("id"))}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify(patch)
      });
      return new Response(res.body, { status: res.status, headers: { "Content-Type": "application/json" } });
    });
  }
});

// cypher-executor/src/routes/credentials.ts
function legacyOwnerFor(env, apiKey) {
  return apiKey === credentialOwner(env) ? legacyCredentialOwner(env) : null;
}
async function deriveSecretRef(apiKey, name) {
  const hash8 = await sha256Prefix(apiKey);
  return `CRED_${name.toUpperCase()}_${hash8.toUpperCase()}`;
}
async function storeCredential(env, apiKey, name, value, service) {
  const secretRef = await deriveSecretRef(apiKey, name);
  await putCredentialSecret(env, apiKey, secretRef, value);
  await upsertCredentialEntry(env, apiKey, name, service, "standard", secretRef);
}
function validateName(name) {
  return typeof name === "string" && /^\w+$/.test(name);
}
function validSensitivity(s) {
  return s === "standard" || s === "high";
}
function isSecretsNotReady(e) {
  if (e instanceof SecretsNotReadyError) return true;
  const msg = e instanceof Error ? e.message : String(e);
  return /缺 CF_SECRETS_API_TOKEN \/ CF_ACCOUNT_ID 設定/.test(msg);
}
async function putWorkerSecret(env, secretRef, value, tokenOverride) {
  const token = tokenOverride || env.CF_SECRETS_TOKEN_FROM_REQUEST || env.CF_SECRETS_API_TOKEN;
  if (!token || !env.CF_ACCOUNT_ID) {
    throw new SecretsNotReadyError(
      "\u6B64 worker \u7F3A CF_SECRETS_API_TOKEN / CF_ACCOUNT_ID \u8A2D\u5B9A\uFF0C\u5BEB\u5165\u8DEF\u5F91\u672A\u5C31\u7DD2\uFF08\u898B credential-store-migration.md T3\uFF1Aacr init/update \u61C9\u78BA\u4FDD\u9019\u5169\u9805\u5C31\u7DD2\uFF09"
    );
  }
  const url = `https://api.cloudflare.com/client/v4/accounts/${env.CF_ACCOUNT_ID}/workers/scripts/${CYPHER_SCRIPT_NAME}/secrets`;
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name: secretRef, text: value, type: "secret_text" })
  });
  const body = await res.json().catch(() => null);
  if (!res.ok || !body?.success) {
    const detail = body?.errors?.map((e) => e.message).filter(Boolean).join("; ") || `HTTP ${res.status}`;
    throw new Error(`CF Workers Secrets \u5BEB\u5165\u5931\u6557\uFF1A${detail}`);
  }
}
async function deleteWorkerSecret(env, secretRef, tokenOverride) {
  const token = tokenOverride || env.CF_SECRETS_TOKEN_FROM_REQUEST || env.CF_SECRETS_API_TOKEN;
  if (!token || !env.CF_ACCOUNT_ID) {
    throw new SecretsNotReadyError("\u6B64 worker \u7F3A CF_SECRETS_API_TOKEN / CF_ACCOUNT_ID \u8A2D\u5B9A\uFF0C\u522A\u9664\u8DEF\u5F91\u672A\u5C31\u7DD2");
  }
  const url = `https://api.cloudflare.com/client/v4/accounts/${env.CF_ACCOUNT_ID}/workers/scripts/${CYPHER_SCRIPT_NAME}/secrets/${secretRef}`;
  const res = await fetch(url, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  });
  if (res.status === 404) return;
  const body = await res.json().catch(() => null);
  if (!res.ok || !body?.success) {
    const detail = body?.errors?.map((e) => e.message).filter(Boolean).join("; ") || `HTTP ${res.status}`;
    throw new Error(`CF Workers Secrets \u522A\u9664\u5931\u6557\uFF1A${detail}`);
  }
}
async function putCredentialSecret(env, apiKey, secretRef, value) {
  const mode = secretBackendMode(env);
  if (mode === "local") return putLocalSecret(env, apiKey, secretRef, value);
  if (mode === "invalid") throw new Error(`SECRET_BACKEND \u8A2D\u5B9A\u503C\u7121\u6CD5\u8FA8\u8B58\uFF08\u53EA\u63A5\u53D7 cf \u6216 local\uFF09\uFF1A${env.SECRET_BACKEND}`);
  return putWorkerSecret(env, secretRef, value);
}
async function deleteCredentialSecret(env, apiKey, secretRef) {
  const mode = secretBackendMode(env);
  if (mode === "local") return deleteLocalSecret(env, apiKey, secretRef);
  if (mode === "invalid") throw new Error(`SECRET_BACKEND \u8A2D\u5B9A\u503C\u7121\u6CD5\u8FA8\u8B58\uFF08\u53EA\u63A5\u53D7 cf \u6216 local\uFF09\uFF1A${env.SECRET_BACKEND}`);
  return deleteWorkerSecret(env, secretRef);
}
function parseMeta(row) {
  try {
    const m = row.metadata_json ? JSON.parse(row.metadata_json) : {};
    return {
      service: typeof m.service === "string" ? m.service : null,
      sensitivity: m.sensitivity === "high" ? "high" : "standard",
      secret_ref: typeof m.secret_ref === "string" ? m.secret_ref : "",
      last_used_at: typeof m.last_used_at === "number" ? m.last_used_at : null
    };
  } catch {
    return { service: null, sensitivity: "standard", secret_ref: "", last_used_at: null };
  }
}
async function kbdbCredFetch(env, path, init) {
  const { base, headers } = kbdbBase(env);
  return fetch(`${base}${path}`, {
    ...init,
    headers: { ...headers, ...init?.headers }
  });
}
function invalidateCredentialCache(apiKey) {
  delete dirCache[apiKey];
  for (const k of Object.keys(dirCache)) delete dirCache[k];
}
async function fetchDirectoryRows(env, owner) {
  const qs = new URLSearchParams({ owner_id: owner, entry_type: CREDENTIAL_ENTRY_TYPE, limit: "200" });
  const res = await kbdbCredFetch(env, `/entries?${qs.toString()}`);
  if (!res.ok) {
    return { rows: [], error: `KBDB \u56DE HTTP ${res.status}` };
  }
  const body = await res.json().catch(() => null);
  const rows = (body?.entries ?? []).filter((e) => !!e.page_name).map((e) => {
    const meta = parseMeta(e);
    return {
      id: e.id,
      name: e.page_name,
      secret_ref: meta.secret_ref,
      service: meta.service,
      sensitivity: meta.sensitivity,
      last_used_at: meta.last_used_at
    };
  });
  return { rows, error: null };
}
async function getCredentialDirectory(env, apiKey) {
  const now2 = Date.now();
  const cached = dirCache[apiKey];
  if (cached && now2 - cached.fetchedAt < DIR_CACHE_TTL_MS) return { rows: cached.rows, error: null };
  const primary = await fetchDirectoryRows(env, apiKey);
  if (primary.error) return primary;
  let rows = primary.rows;
  const legacy = legacyOwnerFor(env, apiKey);
  if (legacy) {
    const old = await fetchDirectoryRows(env, legacy);
    if (!old.error) {
      const have = new Set(rows.map((r) => r.name));
      rows = [...rows, ...old.rows.filter((r) => !have.has(r.name))];
    }
  }
  dirCache[apiKey] = { rows, fetchedAt: now2 };
  return { rows, error: null };
}
async function getCredentialSecretRefsDetailed(env, apiKey) {
  const { rows, error } = await getCredentialDirectory(env, apiKey);
  const refs = {};
  for (const r of rows) {
    if (r.secret_ref) refs[r.name] = r.secret_ref;
  }
  return { refs, directoryError: error };
}
function touchLastUsed(env, apiKey, names) {
  const cached = dirCache[apiKey];
  if (!cached || names.length === 0) return;
  const now2 = Math.floor(Date.now() / 1e3);
  for (const r of cached.rows) {
    if (!names.includes(r.name)) continue;
    if (typeof r.last_used_at === "number" && now2 - r.last_used_at < LAST_USED_MIN_INTERVAL_S) continue;
    const meta = {
      service: r.service,
      sensitivity: r.sensitivity,
      secret_ref: r.secret_ref,
      last_used_at: now2
    };
    kbdbCredFetch(env, `/entries/${encodeURIComponent(r.id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ metadata_json: JSON.stringify(meta) })
    }).catch(() => {
    });
    r.last_used_at = now2;
  }
}
async function findCredentialEntry(env, apiKey, name) {
  const qs = new URLSearchParams({
    owner_id: apiKey,
    entry_type: CREDENTIAL_ENTRY_TYPE,
    page_name: name,
    limit: "1"
  });
  const res = await kbdbCredFetch(env, `/entries?${qs.toString()}`);
  if (!res.ok) throw new Error(`KBDB /entries \u67E5\u8A62\u5931\u6557\uFF1AHTTP ${res.status}`);
  const body = await res.json().catch(() => null);
  return body?.entries?.[0] ?? null;
}
async function locateCredentialEntry(env, apiKey, name) {
  const entry = await findCredentialEntry(env, apiKey, name);
  if (entry) return { owner: apiKey, entry };
  const legacy = legacyOwnerFor(env, apiKey);
  if (legacy) {
    const old = await findCredentialEntry(env, legacy, name);
    if (old) return { owner: legacy, entry: old };
  }
  return null;
}
async function upsertCredentialEntry(env, apiKey, name, service, sensitivity, secretRef) {
  const existing = await findCredentialEntry(env, apiKey, name);
  const meta = {
    service,
    sensitivity,
    secret_ref: secretRef,
    last_used_at: existing ? parseMeta(existing).last_used_at : null
  };
  if (existing) {
    const res = await kbdbCredFetch(env, `/entries/${encodeURIComponent(existing.id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ metadata_json: JSON.stringify(meta) })
    });
    if (!res.ok) throw new Error(`credential \u76EE\u9304\u66F4\u65B0\u5931\u6557\uFF1AHTTP ${res.status}`);
  } else {
    const res = await kbdbCredFetch(env, `/entries`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        entry_type: CREDENTIAL_ENTRY_TYPE,
        owner_id: apiKey,
        page_name: name,
        metadata_json: JSON.stringify(meta)
      })
    });
    if (!res.ok) throw new Error(`credential \u76EE\u9304\u5EFA\u7ACB\u5931\u6557\uFF1AHTTP ${res.status}`);
  }
  invalidateCredentialCache(apiKey);
}
async function listCredentialRows(env, apiKey) {
  const fetchOwner = async (owner) => {
    const qs = new URLSearchParams({ owner_id: owner, entry_type: CREDENTIAL_ENTRY_TYPE, limit: "200" });
    const res = await kbdbCredFetch(env, `/entries?${qs.toString()}`);
    if (!res.ok) throw new Error(`credential \u76EE\u9304\u67E5\u8A62\u5931\u6557\uFF1AHTTP ${res.status}`);
    const body = await res.json().catch(() => null);
    return (body?.entries ?? []).filter((e) => !!e.page_name).map((e) => {
      const meta = parseMeta(e);
      return { name: e.page_name, service: meta.service, sensitivity: meta.sensitivity, created_at: e.created_at, last_used_at: meta.last_used_at };
    });
  };
  const rows = await fetchOwner(apiKey);
  const legacy = legacyOwnerFor(env, apiKey);
  if (legacy) {
    const old = await fetchOwner(legacy).catch(() => []);
    const have = new Set(rows.map((r) => r.name));
    rows.push(...old.filter((r) => !have.has(r.name)));
  }
  return rows;
}
async function hasCredential(env, apiKey, name) {
  const hit = await locateCredentialEntry(env, apiKey, name);
  return hit !== null;
}
async function findEntryBySecretRef(env, apiKey, secretRef) {
  const { rows } = await getCredentialDirectory(env, apiKey);
  const hit = rows.find((r) => r.secret_ref === secretRef);
  return hit ? { name: hit.name } : null;
}
async function writeCredential(env, apiKey, name, value, service, sensitivityRaw) {
  const sensitivity = validSensitivity(sensitivityRaw) ? sensitivityRaw : "standard";
  const secretRef = await deriveSecretRef(apiKey, name);
  const clash = await findEntryBySecretRef(env, apiKey, secretRef);
  if (clash && clash.name !== name) {
    throw new Error(
      `\u540D\u7A31\u300C${name}\u300D\u884D\u751F\u51FA\u7684\u5132\u5B58\u4F4D\u7F6E\u5DF2\u88AB\u300C${clash.name}\u300D\u4F54\u7528\uFF08\u5B83\u5148\u524D\u5F9E\u300C${name}\u300D\u6539\u540D\u96E2\u958B\uFF09\uFF0C\u63DB\u4E00\u500B\u540D\u5B57\u518D\u5EFA\u7ACB\u3002`
    );
  }
  await putCredentialSecret(env, apiKey, secretRef, value);
  await upsertCredentialEntry(env, apiKey, name, service ?? null, sensitivity, secretRef);
  return { secretRef, sensitivity };
}
async function deleteCredentialByName(env, apiKey, name) {
  try {
    const owners = [apiKey, legacyOwnerFor(env, apiKey)].filter((o) => !!o);
    let deleted = false;
    for (const owner of owners) {
      const entry = await findCredentialEntry(env, owner, name);
      if (!entry) continue;
      const meta = parseMeta(entry);
      if (meta.secret_ref) await deleteCredentialSecret(env, owner, meta.secret_ref);
      const res = await kbdbCredFetch(env, `/entries/${encodeURIComponent(entry.id)}`, { method: "DELETE" });
      if (!res.ok) return { ok: false, status: 502, error: `credential \u76EE\u9304\u522A\u9664\u5931\u6557\uFF1AHTTP ${res.status}` };
      deleted = true;
    }
    if (deleted) {
      invalidateCredentialCache(apiKey);
      return { ok: true };
    }
    return { ok: false, status: 404, error: `\u627E\u4E0D\u5230 credential\u300C${name}\u300D` };
  } catch (e) {
    return { ok: false, status: 502, error: e instanceof Error ? e.message : String(e) };
  }
}
async function editCredential(env, apiKey, currentName, updates) {
  const located = await locateCredentialEntry(env, apiKey, currentName);
  if (!located) throw new Error(`\u627E\u4E0D\u5230 credential\u300C${currentName}\u300D`);
  const { entry, owner } = located;
  const meta = parseMeta(entry);
  if (!meta.secret_ref) throw new Error(`credential\u300C${currentName}\u300D\u7F3A secret_ref\uFF0C\u8CC7\u6599\u7570\u5E38\uFF0C\u7121\u6CD5\u4FEE\u6539`);
  const newName = updates.newName && updates.newName !== currentName ? updates.newName : currentName;
  if (!validateName(newName)) throw new Error("\u540D\u7A31\u53EA\u80FD\u5305\u542B\u82F1\u6587\u5B57\u6BCD\u3001\u6578\u5B57\u548C\u5E95\u7DDA");
  if (newName !== currentName) {
    const clash = await locateCredentialEntry(env, apiKey, newName);
    if (clash) throw new Error(`\u540D\u7A31\u300C${newName}\u300D\u5DF2\u88AB\u4F7F\u7528`);
  }
  const service = updates.service !== void 0 ? updates.service || null : meta.service;
  if (updates.value) {
    await putCredentialSecret(env, owner, meta.secret_ref, updates.value);
  }
  const newMeta = {
    service,
    sensitivity: meta.sensitivity,
    secret_ref: meta.secret_ref,
    last_used_at: meta.last_used_at
  };
  const res = await kbdbCredFetch(env, `/entries/${encodeURIComponent(entry.id)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ page_name: newName, metadata_json: JSON.stringify(newMeta) })
  });
  if (!res.ok) throw new Error(`credential \u4FEE\u6539\u5931\u6557\uFF1AHTTP ${res.status}`);
  invalidateCredentialCache(apiKey);
  return { name: newName, service, sensitivity: meta.sensitivity };
}
var credentialsRouter, CYPHER_SCRIPT_NAME, SECRETS_NOT_READY_CODE, SecretsNotReadyError, CREDENTIAL_ENTRY_TYPE, DIR_CACHE_TTL_MS, dirCache, LAST_USED_MIN_INTERVAL_S, VALUE_LIKE_FIELDS;
var init_credentials = __esm({
  "cypher-executor/src/routes/credentials.ts"() {
    "use strict";
    init_dist();
    init_hash();
    init_kbdb_proxy();
    init_secret_backend();
    init_tenant();
    credentialsRouter = new Hono2();
    CYPHER_SCRIPT_NAME = "arcrun-cypher-executor";
    SECRETS_NOT_READY_CODE = "secrets_write_unavailable";
    SecretsNotReadyError = class extends Error {
      code = SECRETS_NOT_READY_CODE;
    };
    CREDENTIAL_ENTRY_TYPE = "credential";
    DIR_CACHE_TTL_MS = 6e4;
    dirCache = {};
    LAST_USED_MIN_INTERVAL_S = 300;
    VALUE_LIKE_FIELDS = ["value", "secret", "token", "text", "plaintext"];
    credentialsRouter.post("/credentials/directory", async (c) => {
      const apiKey = c.req.header("X-Arcrun-API-Key");
      if (!apiKey) {
        return c.json({ error: "\u7F3A\u5C11 X-Arcrun-API-Key header" }, 401);
      }
      const body = await c.req.json().catch(() => null);
      const name = body?.name;
      if (!validateName(name)) {
        return c.json({ error: "name \u5FC5\u586B\uFF0C\u53EA\u80FD\u5305\u542B\u82F1\u6587\u5B57\u6BCD\u3001\u6578\u5B57\u548C\u5E95\u7DDA" }, 400);
      }
      const offending = VALUE_LIKE_FIELDS.filter((f) => body?.[f] !== void 0);
      if (offending.length > 0) {
        return c.json({
          error: `\u9019\u652F\u7AEF\u9EDE\u53EA\u5BEB\u76EE\u9304\uFF0C\u4E0D\u6536\u91D1\u9470\u503C\uFF08\u6536\u5230 ${offending.join("/")}\uFF09\u3002\u503C\u8ACB\u7531\u6301\u6709 Cloudflare \u5BEB\u5165\u6191\u8B49\u7684\u4E00\u65B9\u76F4\u63A5 PUT \u9032 Workers Secrets\uFF0Csecret \u540D\u7A31\u7528\u672C\u7AEF\u9EDE\u56DE\u7684 secret_ref\uFF08D36\uFF1A\u53EA\u6709\u4E00\u689D\u91D1\u9470\u50B3\u905E\u8DEF\u5F91\uFF09\u3002`
        }, 400);
      }
      const service = typeof body?.service === "string" ? body.service : null;
      const sensitivity = validSensitivity(body?.sensitivity) ? body.sensitivity : "standard";
      try {
        const secretRef = await deriveSecretRef(apiKey, name);
        await upsertCredentialEntry(c.env, apiKey, name, service, sensitivity, secretRef);
        return c.json({
          success: true,
          name,
          service,
          sensitivity,
          // 呼叫端拿這兩個值去寫值那一半：PUT /accounts/:id/workers/scripts/{secret_script}/secrets
          // body { name: secret_ref, text: <明文>, type: 'secret_text' }。
          secret_ref: secretRef,
          secret_script: CYPHER_SCRIPT_NAME
        });
      } catch (e) {
        return c.json({ success: false, error: e instanceof Error ? e.message : String(e) }, 502);
      }
    });
    credentialsRouter.post("/credentials", async (c) => {
      const apiKey = c.req.header("X-Arcrun-API-Key");
      if (!apiKey) {
        return c.json({ error: "\u7F3A\u5C11 X-Arcrun-API-Key header" }, 401);
      }
      const body = await c.req.json().catch(() => null);
      if (!validateName(body?.name)) {
        return c.json({ error: "name \u5FC5\u586B\uFF0C\u53EA\u80FD\u5305\u542B\u82F1\u6587\u5B57\u6BCD\u3001\u6578\u5B57\u548C\u5E95\u7DDA" }, 400);
      }
      if (!body?.value || typeof body.value !== "string") {
        return c.json({ error: "value \u5FC5\u586B\uFF08credential \u660E\u6587\u503C\uFF0C\u7D93 TLS \u50B3\u8F38\uFF09" }, 400);
      }
      try {
        const { secretRef, sensitivity } = await writeCredential(
          c.env,
          apiKey,
          body.name,
          body.value,
          body.service,
          body.sensitivity
        );
        return c.json({ success: true, name: body.name, service: body.service ?? null, sensitivity, secret_ref: secretRef });
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        return c.json({ success: false, error: msg }, msg.includes("\u4F54\u7528") ? 409 : 502);
      }
    });
    credentialsRouter.put("/credentials/:name", async (c) => {
      const apiKey = c.req.header("X-Arcrun-API-Key");
      if (!apiKey) {
        return c.json({ error: "\u7F3A\u5C11 X-Arcrun-API-Key header" }, 401);
      }
      const name = c.req.param("name");
      if (!validateName(name)) {
        return c.json({ error: "name \u53EA\u80FD\u5305\u542B\u82F1\u6587\u5B57\u6BCD\u3001\u6578\u5B57\u548C\u5E95\u7DDA" }, 400);
      }
      const body = await c.req.json().catch(() => null);
      if (!body?.value || typeof body.value !== "string") {
        return c.json({ error: "value \u5FC5\u586B\uFF08credential \u660E\u6587\u503C\uFF0C\u7D93 TLS \u50B3\u8F38\uFF09" }, 400);
      }
      try {
        const { secretRef, sensitivity } = await writeCredential(
          c.env,
          apiKey,
          name,
          body.value,
          body.service,
          body.sensitivity
        );
        return c.json({ success: true, name, service: body.service ?? null, sensitivity, secret_ref: secretRef });
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        return c.json({ success: false, error: msg }, msg.includes("\u4F54\u7528") ? 409 : 502);
      }
    });
    credentialsRouter.delete("/credentials/:name", async (c) => {
      const apiKey = c.req.header("X-Arcrun-API-Key");
      if (!apiKey) {
        return c.json({ error: "\u7F3A\u5C11 X-Arcrun-API-Key header" }, 401);
      }
      const name = c.req.param("name");
      const result = await deleteCredentialByName(c.env, apiKey, name);
      if (!result.ok) return c.json({ success: false, error: result.error }, result.status);
      return c.json({ success: true, name, source: "workers-secrets" });
    });
    credentialsRouter.patch("/credentials/:name", async (c) => {
      const apiKey = c.req.header("X-Arcrun-API-Key");
      if (!apiKey) {
        return c.json({ error: "\u7F3A\u5C11 X-Arcrun-API-Key header" }, 401);
      }
      const name = c.req.param("name");
      const body = await c.req.json().catch(() => null);
      const newName = typeof body?.new_name === "string" ? body.new_name : void 0;
      const service = typeof body?.service === "string" ? body.service : void 0;
      const value = typeof body?.value === "string" ? body.value : void 0;
      try {
        const result = await editCredential(c.env, apiKey, name, { newName, service, value });
        return c.json({ success: true, ...result });
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        const status = msg.includes("\u627E\u4E0D\u5230") ? 404 : msg.includes("\u5DF2\u88AB\u4F7F\u7528") ? 409 : 502;
        return c.json({ success: false, error: msg }, status);
      }
    });
    credentialsRouter.get("/credentials/catalog", async (c) => {
      const apiKey = c.req.header("X-Arcrun-API-Key");
      if (!apiKey) {
        return c.json({ error: "\u7F3A\u5C11 X-Arcrun-API-Key header" }, 401);
      }
      try {
        const rows = await listCredentialRows(c.env, apiKey);
        return c.json({ success: true, credentials: rows, total: rows.length });
      } catch (e) {
        return c.json({ success: false, error: e instanceof Error ? e.message : String(e) }, 502);
      }
    });
    credentialsRouter.get("/credentials", async (c) => {
      const apiKey = c.req.header("X-Arcrun-API-Key");
      if (!apiKey) {
        return c.json({ error: "\u7F3A\u5C11 X-Arcrun-API-Key header" }, 401);
      }
      try {
        const rows = await listCredentialRows(c.env, apiKey);
        return c.json({ success: true, credentials: rows, total: rows.length });
      } catch (e) {
        return c.json({ success: false, error: e instanceof Error ? e.message : String(e) }, 502);
      }
    });
  }
});

// cypher-executor/src/lib/portal-auth-store.ts
init_credentials();

// cypher-executor/src/lib/ephemeral-store.ts
init_kbdb_proxy();

// cypher-executor/src/lib/release-body.ts
function releaseBody(res) {
  try {
    if (res && res.body && !res.bodyUsed) void res.body.cancel().catch(() => void 0);
  } catch {
  }
}

// cypher-executor/src/lib/ephemeral-store.ts
init_kbdb_caller();
var EphemeralStoreError = class extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
    this.name = "EphemeralStoreError";
  }
  status;
};
async function kFetch(env, path, init) {
  const { base, headers } = kbdbBase(env);
  try {
    return await fetch(`${base}${path}`, {
      ...init,
      // 短效資料＝session／鎖定計數／密碼重設票，全是帳號基本操作（#293）：走保留額度。
      headers: { ...withEssential(headers), ...init?.headers }
    });
  } catch (e) {
    throw new EphemeralStoreError(`fetch ${path} \u5931\u6557\uFF1A${e instanceof Error ? e.message : String(e)}`);
  }
}
async function sha256Hex(input) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
var ensuredTemplates = /* @__PURE__ */ new Set();
async function ensureTemplate(env, name, slots) {
  if (ensuredTemplates.has(name)) return;
  const got = await kFetch(env, `/templates/${encodeURIComponent(name)}`);
  releaseBody(got);
  if (!got.ok) {
    releaseBody(await kFetch(env, "/templates", {
      method: "POST",
      body: JSON.stringify({ name, slots })
    }).catch(() => void 0));
  }
  ensuredTemplates.add(name);
}
async function findByHash(env, template, hashField, hash) {
  const res = await kFetch(
    env,
    `/records/by-source/${encodeURIComponent(template)}?field=${encodeURIComponent(hashField)}&value=${encodeURIComponent(hash)}`
  );
  if (!res.ok) {
    releaseBody(res);
    return null;
  }
  const body = await res.json().catch(() => null);
  const id = body?.record_ids?.[0];
  if (!id) return null;
  const rec = await kFetch(env, `/records/${encodeURIComponent(id)}`);
  if (!rec.ok) {
    releaseBody(rec);
    return null;
  }
  const recBody = await rec.json().catch(() => null);
  return recBody?.record ?? null;
}
async function deleteRecordById(env, recordId) {
  releaseBody(await kFetch(env, `/records/${encodeURIComponent(recordId)}`, { method: "DELETE" }).catch(() => void 0));
}
async function ephemeralPut(env, opts) {
  await ensureTemplate(env, opts.template, [...opts.slots, opts.hashField, "exp"]);
  const hash = await sha256Hex(opts.rawKey);
  const exp = opts.ttlSeconds === null ? "never" : String(Date.now() + opts.ttlSeconds * 1e3);
  const values = { ...opts.values, [opts.hashField]: hash, exp };
  const existing = opts.fresh ? null : await findByHash(env, opts.template, opts.hashField, hash);
  if (existing) {
    const res2 = await kFetch(env, `/records/${encodeURIComponent(existing.record_id)}`, {
      method: "PATCH",
      body: JSON.stringify({ values })
    });
    releaseBody(res2);
    if (!res2.ok) throw new EphemeralStoreError(`PATCH /records(${opts.template}) \u2192 ${res2.status}`, res2.status);
    return;
  }
  const res = await kFetch(env, "/records", {
    method: "POST",
    body: JSON.stringify({ template: opts.template, values })
  });
  releaseBody(res);
  if (!res.ok) throw new EphemeralStoreError(`POST /records(${opts.template}) \u2192 ${res.status}`, res.status);
}
async function ephemeralGet(env, opts) {
  const hash = await sha256Hex(opts.rawKey);
  const found = await findByHash(env, opts.template, opts.hashField, hash);
  if (!found) return null;
  const exp = Number(found.values.exp);
  const expired = Number.isFinite(exp) && exp < Date.now();
  if (opts.consume || expired) await deleteRecordById(env, found.record_id);
  if (expired) return null;
  return found.values;
}
async function ephemeralDelete(env, opts) {
  const hash = await sha256Hex(opts.rawKey);
  const found = await findByHash(env, opts.template, opts.hashField, hash);
  if (found) await deleteRecordById(env, found.record_id);
}

// cypher-executor/src/lib/portal-auth-store.ts
init_secret_backend();
var LOCAL_AUTH_OWNER = "__arcrun_auth_store__";
var LOCAL_AUTH_REF = "ARCRUN_AUTH_STORE";
function authStoreIsLocal(env) {
  return secretBackendMode(env) === "local";
}
async function loadLocalStrict(env) {
  const raw2 = await getLocalSecretStrict(env, LOCAL_AUTH_OWNER, LOCAL_AUTH_REF);
  if (raw2 === null) return emptyStore();
  const p = JSON.parse(raw2);
  return {
    version: 1,
    console: p.console ?? null,
    users: Array.isArray(p.users) ? p.users : [],
    passwords: p.passwords && typeof p.passwords === "object" ? p.passwords : {}
  };
}
async function hydrateAuthStore(env) {
  if (!authStoreIsLocal(env) || !localBackendReady(env)) return;
  try {
    overlay = await loadLocalStrict(env);
    overlayAt = Date.now();
  } catch {
  }
}
async function writeLocalStore(env, data) {
  if (!localBackendReady(env)) {
    throw new AuthStoreWriteError("\u4F01\u696D\u79C1\u6709\u96F2\u8A8D\u8B49\u4FDD\u7BA1\u672A\u5C31\u7DD2\uFF1A\u9700\u8981 PRIVATE_SECRET_KEY\uFF08\u81F3\u5C11 32 \u5B57\u5143\uFF0C\u7531\u9019\u53F0 server \u7684\u8A2D\u5B9A\u63D0\u4F9B\uFF09\u3002");
  }
  try {
    await putLocalSecret(env, LOCAL_AUTH_OWNER, LOCAL_AUTH_REF, JSON.stringify({ ...data, version: 1 }));
  } catch (e) {
    throw new AuthStoreWriteError(`\u8A8D\u8B49\u8CC7\u6599\u5BEB\u5165\u5931\u6557\uFF1A${e instanceof Error ? e.message : String(e)}`);
  }
  overlay = { version: 1, console: data.console ?? null, users: [...data.users], passwords: { ...data.passwords } };
  overlayAt = Date.now();
}
var AUTH_STORE_PREFIX = "ARCRUN_AUTH_STORE";
var SHARD_MAX_BYTES = 4600;
var AUTH_OVERLAY_TTL_MS = 18e4;
var ACCEL_KEY = "auth_store_recent";
var ACCEL_TTL_SECONDS = 600;
var ACCEL_TEMPLATE = "auth_store_written_marker";
var AUTH_ID_PREFIX = "auth:";
var AuthStoreWriteError = class extends Error {
};
var AuthStorePropagatingError = class extends AuthStoreWriteError {
  constructor() {
    super("\u8A8D\u8B49\u8CC7\u6599\u6B63\u5728\u66F4\u65B0\u4E2D\uFF08Cloudflare \u6B63\u5728\u92EA\u958B\u65B0\u7248\u672C\uFF09\uFF0C\u8ACB\u7B49\u5E7E\u79D2\u518D\u8A66\u4E00\u6B21\u2014\u2014\u525B\u624D\u7684\u8B8A\u66F4\u6C92\u6709\u907A\u5931\u3002");
    this.name = "AuthStorePropagatingError";
  }
};
var overlay = null;
var overlayAt = 0;
function emptyStore() {
  return { version: 1, console: null, users: [], passwords: {} };
}
function shardNames(env) {
  const bag = env;
  return Object.keys(bag).filter((k) => k === AUTH_STORE_PREFIX || /^ARCRUN_AUTH_STORE_\d+$/.test(k)).filter((k) => typeof bag[k] === "string" && bag[k].length > 0).sort((a, b) => shardIndex(a) - shardIndex(b));
}
function shardIndex(name) {
  if (name === AUTH_STORE_PREFIX) return 0;
  return Number.parseInt(name.slice(AUTH_STORE_PREFIX.length + 1), 10) || 0;
}
function shardNameOf(index) {
  return index === 0 ? AUTH_STORE_PREFIX : `${AUTH_STORE_PREFIX}_${index}`;
}
function authStoreWritable(env, tokenOverride) {
  if (authStoreIsLocal(env)) return localBackendReady(env);
  return Boolean((tokenOverride || env.CF_SECRETS_TOKEN_FROM_REQUEST || env.CF_SECRETS_API_TOKEN) && env.CF_ACCOUNT_ID);
}
function readAuthStore(env) {
  if (authStoreIsLocal(env)) return overlay ?? emptyStore();
  if (overlay && Date.now() - overlayAt < AUTH_OVERLAY_TTL_MS) return overlay;
  return readAuthStoreFromEnv(env);
}
function readAuthStoreFromEnv(env) {
  const bag = env;
  const out = emptyStore();
  for (const name of shardNames(env)) {
    let parsed = null;
    try {
      parsed = JSON.parse(bag[name]);
    } catch {
      continue;
    }
    if (!parsed || typeof parsed !== "object") continue;
    if (parsed.console && !out.console) out.console = parsed.console;
    if (Array.isArray(parsed.users)) {
      for (const u of parsed.users) {
        if (u && typeof u.email === "string" && typeof u.id === "string") out.users.push(u);
      }
    }
    if (parsed.passwords && typeof parsed.passwords === "object") {
      for (const [id, hash] of Object.entries(parsed.passwords)) {
        if (typeof hash === "string" && !(id in out.passwords)) out.passwords[id] = hash;
      }
    }
  }
  return out;
}
function findAuthUserByEmail(env, email) {
  const needle = email.trim().toLowerCase();
  return readAuthStore(env).users.find((u) => u.email.toLowerCase() === needle) ?? null;
}
function findAuthUserById(env, id) {
  return readAuthStore(env).users.find((u) => u.id === id) ?? null;
}
function isAuthStoreId(recordId) {
  return recordId.startsWith(AUTH_ID_PREFIX);
}
async function writeAuthStore(env, data, tokenOverride) {
  if (authStoreIsLocal(env)) return writeLocalStore(env, data);
  if (!authStoreWritable(env, tokenOverride)) {
    throw new AuthStoreWriteError(
      "\u9019\u53F0\u5BE6\u4F8B\u76EE\u524D\u5BEB\u4E0D\u9032\u8A8D\u8B49\u5132\u5B58\uFF08\u7F3A\u53EF\u7528\u7684 Cloudflare \u5BEB\u5165\u6191\u8B49\uFF1ACF_SECRETS_API_TOKEN\uFF09\u3002\u9019\u662F\u5E73\u53F0\u7AEF\u7684\u5DF2\u77E5\u9650\u5236\uFF0C\u4E0D\u662F\u4F60\u64CD\u4F5C\u932F\u8AA4\u2014\u2014\u76EE\u524D\u6C92\u6709\u4F60\u81EA\u5DF1\u5728\u756B\u9762\u4E0A\u80FD\u505A\u7684\u4E0B\u4E00\u6B65\uFF0C\u8ACB\u628A\u9019\u5247\u8A0A\u606F\u5B8C\u6574\u622A\u5716\uFF0F\u8907\u88FD\u7D66\u652F\u63F4\uFF0C\u4E26\u8A3B\u660E\u4F60\u525B\u624D\u5728\u505A\u4EC0\u9EBC\uFF08\u4F8B\u5982\uFF1A\u5B89\u88DD\u7CBE\u9748\u88E1\u5EFA\u7ACB\u7B2C\u4E00\u500B\u5E33\u865F\u3001\u4E8B\u5F8C\u65B0\u589E\u4F7F\u7528\u8005\u3001\u6216\u4FEE\u6539\u5BC6\u78BC\uFF09\uFF0C\u6703\u9700\u8981\u4EBA\u5DE5\u5354\u52A9\u6392\u9664\u3002"
    );
  }
  const shards = [];
  const writtenAt = Date.now();
  let current = { v: 1, w: writtenAt, console: data.console ?? null, users: [], passwords: data.passwords };
  for (const u of data.users) {
    const trial = { ...current, users: [...current.users ?? [], u] };
    const size = new TextEncoder().encode(JSON.stringify(trial)).length;
    if (size > SHARD_MAX_BYTES && (current.users ?? []).length > 0) {
      shards.push(JSON.stringify(current));
      current = { v: 1, users: [u] };
    } else {
      current = trial;
    }
  }
  shards.push(JSON.stringify(current));
  for (const s of shards) {
    if (new TextEncoder().encode(s).length > 5e3) {
      throw new AuthStoreWriteError("\u55AE\u7B46\u8A8D\u8B49\u8CC7\u6599\u8D85\u904E Cloudflare \u8B8A\u6578 5 KB \u4E0A\u9650\uFF0C\u7121\u6CD5\u5BEB\u5165\u3002");
    }
  }
  const existing = shardNames(env);
  for (let i = 0; i < shards.length; i++) {
    await putWorkerSecret(env, shardNameOf(i), shards[i], tokenOverride);
  }
  for (const name of existing) {
    if (shardIndex(name) >= shards.length) await deleteWorkerSecret(env, name, tokenOverride);
  }
  overlay = { version: 1, console: data.console ?? null, users: [...data.users], passwords: { ...data.passwords } };
  overlayAt = Date.now();
  try {
    await ephemeralPut(env, {
      template: ACCEL_TEMPLATE,
      slots: ["written_at"],
      hashField: "key_hash",
      rawKey: ACCEL_KEY,
      values: { written_at: String(writtenAt) },
      ttlSeconds: ACCEL_TTL_SECONDS
    });
  } catch {
  }
}
function envWrittenAt(env) {
  const bag = env;
  let w = 0;
  for (const name of shardNames(env)) {
    try {
      const parsed = JSON.parse(bag[name]);
      if (typeof parsed?.w === "number" && parsed.w > w) w = parsed.w;
    } catch {
    }
  }
  return w;
}
async function lastWrittenAt(env) {
  try {
    const rec = await ephemeralGet(env, { template: ACCEL_TEMPLATE, hashField: "key_hash", rawKey: ACCEL_KEY });
    const n = Number(rec?.written_at ?? 0);
    return Number.isFinite(n) ? n : 0;
  } catch {
    return 0;
  }
}
async function authStoreStaleHere(env) {
  if (authStoreIsLocal(env)) return false;
  const last = await lastWrittenAt(env);
  if (!last) return false;
  if (overlay && overlayAt >= last) return false;
  return envWrittenAt(env) < last;
}
async function hydrateFromAccelerator(_env) {
  return false;
}
async function authStoreRecentlyWritten(env) {
  return authStoreStaleHere(env);
}
function unionStores(a, b) {
  const byId = /* @__PURE__ */ new Map();
  for (const u of [...a.users, ...b.users]) {
    const prev = byId.get(u.id);
    if (!prev || (u.updated_at ?? "") >= (prev.updated_at ?? "")) byId.set(u.id, u);
  }
  return {
    version: 1,
    console: a.console ?? b.console ?? null,
    users: [...byId.values()],
    passwords: { ...a.passwords, ...b.passwords }
  };
}
async function mutateAuthStore(env, fn, tokenOverride) {
  if (authStoreIsLocal(env)) {
    let base;
    try {
      base = await loadLocalStrict(env);
    } catch (e) {
      throw new AuthStoreWriteError(`\u8A8D\u8B49\u8CC7\u6599\u8B80\u53D6\u5931\u6557\uFF0C\u70BA\u907F\u514D\u8986\u5BEB\u5DF2\u4E2D\u6B62\uFF1A${e instanceof Error ? e.message : String(e)}`);
    }
    await fn(base);
    await writeLocalStore(env, base);
    return base;
  }
  if (await authStoreStaleHere(env)) throw new AuthStorePropagatingError();
  const next = unionStores(readAuthStore(env), readAuthStoreFromEnv(env));
  await fn(next);
  await writeAuthStore(env, next, tokenOverride);
  return next;
}
function findPortalPasswordHash(env, recordId) {
  return readAuthStore(env).passwords[recordId] ?? null;
}
async function setPortalPasswordHash(env, recordId, passwordHash, tokenOverride) {
  await mutateAuthStore(env, (data) => {
    data.passwords[recordId] = passwordHash;
  }, tokenOverride);
}
async function migrateConsoleCredentials(env, record, tokenOverride) {
  if (readAuthStore(env).console) return { migrated: false };
  let migrated = false;
  await mutateAuthStore(
    env,
    (data) => {
      if (data.console) return;
      data.console = record;
      migrated = true;
    },
    tokenOverride
  );
  return { migrated };
}

// cypher-executor/src/index.ts
init_dist();

// cypher-executor/node_modules/.pnpm/hono@4.12.10/node_modules/hono/dist/middleware/cors/index.js
var cors = (options) => {
  const defaults = {
    origin: "*",
    allowMethods: ["GET", "HEAD", "PUT", "POST", "DELETE", "PATCH"],
    allowHeaders: [],
    exposeHeaders: []
  };
  const opts = {
    ...defaults,
    ...options
  };
  const findAllowOrigin = ((optsOrigin) => {
    if (typeof optsOrigin === "string") {
      if (optsOrigin === "*") {
        if (opts.credentials) {
          return (origin2) => origin2 || null;
        }
        return () => optsOrigin;
      } else {
        return (origin2) => optsOrigin === origin2 ? origin2 : null;
      }
    } else if (typeof optsOrigin === "function") {
      return optsOrigin;
    } else {
      return (origin2) => optsOrigin.includes(origin2) ? origin2 : null;
    }
  })(opts.origin);
  const findAllowMethods = ((optsAllowMethods) => {
    if (typeof optsAllowMethods === "function") {
      return optsAllowMethods;
    } else if (Array.isArray(optsAllowMethods)) {
      return () => optsAllowMethods;
    } else {
      return () => [];
    }
  })(opts.allowMethods);
  return async function cors2(c, next) {
    function set(key, value) {
      c.res.headers.set(key, value);
    }
    const allowOrigin = await findAllowOrigin(c.req.header("origin") || "", c);
    if (allowOrigin) {
      set("Access-Control-Allow-Origin", allowOrigin);
    }
    if (opts.credentials) {
      set("Access-Control-Allow-Credentials", "true");
    }
    if (opts.exposeHeaders?.length) {
      set("Access-Control-Expose-Headers", opts.exposeHeaders.join(","));
    }
    if (c.req.method === "OPTIONS") {
      if (opts.origin !== "*" || opts.credentials) {
        set("Vary", "Origin");
      }
      if (opts.maxAge != null) {
        set("Access-Control-Max-Age", opts.maxAge.toString());
      }
      const allowMethods = await findAllowMethods(c.req.header("origin") || "", c);
      if (allowMethods.length) {
        set("Access-Control-Allow-Methods", allowMethods.join(","));
      }
      let headers = opts.allowHeaders;
      if (!headers?.length) {
        const requestHeaders = c.req.header("Access-Control-Request-Headers");
        if (requestHeaders) {
          headers = requestHeaders.split(/\s*,\s*/);
        }
      }
      if (headers?.length) {
        set("Access-Control-Allow-Headers", headers.join(","));
        c.res.headers.append("Vary", "Access-Control-Request-Headers");
      }
      c.res.headers.delete("Content-Length");
      c.res.headers.delete("Content-Type");
      return new Response(null, {
        headers: c.res.headers,
        status: 204,
        statusText: "No Content"
      });
    }
    await next();
    if (opts.origin !== "*" || opts.credentials) {
      c.header("Vary", "Origin", { append: true });
    }
  };
};

// cypher-executor/src/lib/cron-match.ts
function matchField(expr, value, min, max) {
  if (expr === "*") return true;
  for (const part of expr.split(",")) {
    if (matchPart(part.trim(), value, min, max)) return true;
  }
  return false;
}
function matchPart(part, value, min, max) {
  if (part.startsWith("*/")) {
    const step = parseInt(part.slice(2), 10);
    if (!Number.isFinite(step) || step <= 0) return false;
    return (value - min) % step === 0;
  }
  if (part.includes("-")) {
    const [rangePart, stepStr] = part.split("/");
    const [aStr, bStr] = rangePart.split("-");
    const a = parseInt(aStr, 10);
    const b = parseInt(bStr, 10);
    if (!Number.isFinite(a) || !Number.isFinite(b)) return false;
    if (value < a || value > b) return false;
    if (stepStr === void 0) return true;
    const step = parseInt(stepStr, 10);
    if (!Number.isFinite(step) || step <= 0) return false;
    return (value - a) % step === 0;
  }
  const n = parseInt(part, 10);
  if (!Number.isFinite(n)) return false;
  if (n < min || n > max) return false;
  return value === n;
}
function cronMatch(expr, date) {
  const fields = expr.trim().split(/\s+/);
  if (fields.length !== 5) return false;
  const [m, h, dom, mon, dow] = fields;
  return matchField(m, date.getUTCMinutes(), 0, 59) && matchField(h, date.getUTCHours(), 0, 23) && matchField(dom, date.getUTCDate(), 1, 31) && matchField(mon, date.getUTCMonth() + 1, 1, 12) && matchField(dow, date.getUTCDay(), 0, 6);
}
function extractCronExpr(graph) {
  if (!graph || typeof graph !== "object") return null;
  const nodes = graph.nodes;
  if (!Array.isArray(nodes)) return null;
  for (const node of nodes) {
    if (node.componentId !== "cron") continue;
    const expr = node.data?.cron_expr;
    if (typeof expr === "string" && expr.trim()) return expr.trim();
  }
  return null;
}

// cypher-executor/src/lib/cron-index.ts
var CRON_INDEX_KEY = "cron-idx:_all";
function cronEntryKey(apiKey, name) {
  return `${apiKey}:${name}`;
}
function parseCronEntryKey(entryKey) {
  const idx = entryKey.indexOf(":");
  if (idx <= 0) return null;
  return { apiKey: entryKey.slice(0, idx), name: entryKey.slice(idx + 1) };
}
async function readCronIndex(kv) {
  const raw2 = await kv.get(CRON_INDEX_KEY, "text");
  if (!raw2) return {};
  try {
    const parsed = JSON.parse(raw2);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}
async function updateCronIndexEntry(kv, apiKey, name, cronExpr) {
  const index = await readCronIndex(kv);
  const entryKey = cronEntryKey(apiKey, name);
  if (cronExpr) {
    if (index[entryKey] === cronExpr) return;
    index[entryKey] = cronExpr;
  } else {
    if (!(entryKey in index)) return;
    delete index[entryKey];
  }
  await kv.put(CRON_INDEX_KEY, JSON.stringify(index));
}

// cypher-executor/src/scheduled.ts
init_webhook_handlers();

// cypher-executor/src/actions/execution-logger.ts
init_kbdb_proxy();
init_kbdb_caller();
function extractTarget(input) {
  if (!input) return void 0;
  const raw2 = input.page_name ?? input.path;
  if (raw2 === void 0 || raw2 === null) return void 0;
  return typeof raw2 === "string" ? raw2 : JSON.stringify(raw2);
}
async function writeExecutionVerdict(env, workflowId, nodes, verdict, durationMs, message, input, apiKey, kbdbUsage) {
  void nodes;
  try {
    const { base, headers } = kbdbBase(env);
    const res = await fetch(`${base}/execution-log/record`, {
      method: "POST",
      // 這支自己也是一次 KBDB 呼叫——蓋掉 kbdbBase() 預設的 'cypher-kbdb-proxy'，
      // 剎車紀錄點名時才不會誤指成 CLI 那條 proxy。
      headers: withCaller(headers, KBDB_CALLERS.executionLog),
      body: JSON.stringify({
        workflow_id: workflowId,
        owner_id: apiKey ?? null,
        verdict,
        duration_ms: Math.max(0, Math.round(durationMs)),
        message: message ?? "",
        target: extractTarget(input) ?? null,
        ...kbdbUsage ? { kbdb_rows_written: kbdbUsage.rowsWritten, kbdb_rows_read: kbdbUsage.rowsRead } : {}
      })
    });
    releaseBody(res);
  } catch {
  }
}

// cypher-executor/src/scheduled.ts
init_kbdb_proxy();

// cypher-executor/src/lib/fts-backfill-tick.ts
init_kbdb_proxy();
var MAX_TICK_CALLS = 15;
var CALL_LIMIT = 1e4;
async function runFtsBackfillTick(env, log = console.log, logError = console.error) {
  const { base, headers } = kbdbBase(env);
  let totalScanned = 0;
  for (let i = 0; i < MAX_TICK_CALLS; i++) {
    let body = null;
    try {
      const res = await fetch(`${base}/entries/fts-backfill`, {
        method: "POST",
        headers,
        body: JSON.stringify({ limit: CALL_LIMIT })
      });
      body = await res.json().catch(() => null);
      log("[scheduled] fts-backfill tick", i, res.status, JSON.stringify(body));
    } catch (e) {
      logError("[scheduled] fts-backfill tick failed", i, e);
      return { calls: i, totalScanned, stoppedBecause: "error" };
    }
    if (!body?.success) {
      return { calls: i + 1, totalScanned, stoppedBecause: "error" };
    }
    totalScanned += body.scanned ?? 0;
    if (body.done || body.next_cursor === null) {
      return { calls: i + 1, totalScanned, stoppedBecause: "done" };
    }
    if (body.write_error === "platform_quota_exceeded") {
      return { calls: i + 1, totalScanned, stoppedBecause: "platform_quota_exceeded" };
    }
    if (body.write_error === "other") {
      return { calls: i + 1, totalScanned, stoppedBecause: "error" };
    }
    if (body.quota_exceeded) {
      return { calls: i + 1, totalScanned, stoppedBecause: "quota_exceeded" };
    }
    if (!body.scanned) {
      return { calls: i + 1, totalScanned, stoppedBecause: "no_progress" };
    }
  }
  return { calls: MAX_TICK_CALLS, totalScanned, stoppedBecause: "max_calls" };
}

// cypher-executor/src/lib/usage-brake-notify-tick.ts
init_kbdb_proxy();
var SKIPPED = { skipped: true, checked: 0, notified: 0, errors: 0 };
async function runUsageBrakeNotifyTick(env, log = console.log, logError = console.error) {
  const webhookUrl = env.NOTIFY_LEO_WEBHOOK_URL;
  if (!webhookUrl) return SKIPPED;
  const { base, headers } = kbdbBase(env);
  let list = [];
  try {
    const res = await fetch(`${base}/usage-brakes?pending_notify=1`, { headers });
    const body = await res.json().catch(() => null);
    if (!body?.success) {
      logError("[scheduled] usage-brake-notify: GET /usage-brakes \u56DE\u61C9\u4E0D\u5B8C\u6574", res.status, JSON.stringify(body));
      return { skipped: false, checked: 0, notified: 0, errors: 1 };
    }
    list = body.brakes ?? [];
  } catch (e) {
    logError("[scheduled] usage-brake-notify: GET /usage-brakes \u5931\u6557", e);
    return { skipped: false, checked: 0, notified: 0, errors: 1 };
  }
  let notified = 0;
  let errors = 0;
  for (const b of list) {
    try {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // notify-leo.yaml 只吃 {{input.text}}；署名鐵律（agent-memory.md）：開頭標身份。
        body: JSON.stringify({ text: `[KBDB${b.kind === "warning" ? "\u7528\u91CF\u63D0\u9192" : "\u524E\u8ECA"}] ${b.message ?? ""}` })
      });
      if (!res.ok) {
        errors++;
        logError("[scheduled] usage-brake-notify: \u9001\u901A\u77E5\u5931\u6557", b.id, res.status);
        continue;
      }
      notified++;
      log("[scheduled] usage-brake-notify: \u5DF2\u901A\u77E5", b.id);
      await fetch(`${base}/usage-brakes/${encodeURIComponent(b.id)}/notified`, { method: "POST", headers }).catch((e) => logError("[scheduled] usage-brake-notify: \u6A19\u8A18 notified \u5931\u6557\uFF08\u4E0B\u4E00\u8F2A\u6703\u91CD\u901A\u77E5\u4E00\u6B21\uFF09", b.id, e));
    } catch (e) {
      errors++;
      logError("[scheduled] usage-brake-notify: \u9001\u901A\u77E5\u4F8B\u5916", b.id, e);
    }
  }
  return { skipped: false, checked: list.length, notified, errors };
}

// cypher-executor/src/scheduled.ts
async function handleScheduled(controller, env, ctx) {
  const now2 = new Date(controller.scheduledTime);
  console.log("[scheduled] tick", now2.toISOString(), "controller.cron=", controller.cron);
  const index = await readCronIndex(env.WEBHOOKS);
  const entries = Object.entries(index);
  let triggered = 0;
  for (const [entryKey, cronExpr] of entries) {
    const parsed = parseCronEntryKey(entryKey);
    if (!parsed) continue;
    const { apiKey, name } = parsed;
    if (!cronExpr) continue;
    if (!cronMatch(cronExpr, now2)) continue;
    const wfKey = `${apiKey}:wf:${name}`;
    const wfRaw = await env.WEBHOOKS.get(wfKey, "text");
    if (!wfRaw) {
      console.warn("[scheduled] cron-idx \u5C0D\u61C9 workflow \u4E0D\u5B58\u5728", wfKey);
      continue;
    }
    let record;
    try {
      record = JSON.parse(wfRaw);
    } catch {
      continue;
    }
    triggered++;
    console.log("[scheduled] trigger", name, "apiKey=", apiKey.slice(0, 12) + "...", "cron=", cronExpr);
    const triggerContext = {
      api_key: apiKey,
      _triggered_by: "cron",
      _scheduled_at: now2.toISOString()
    };
    const graphForVerdict = record.graph;
    const workflowId = graphForVerdict.id ?? name;
    const nodesForVerdict = Array.isArray(graphForVerdict.nodes) ? graphForVerdict.nodes : [];
    ctx.waitUntil(
      executeWebhookGraph(env, record.graph, triggerContext, name, apiKey).then(
        (r) => {
          console.log("[scheduled] done", name, r.success, r.duration_ms + "ms");
          return writeExecutionVerdict(
            env,
            workflowId,
            nodesForVerdict,
            r.success ? "success" : "failed",
            r.duration_ms,
            r.error ?? "",
            triggerContext,
            apiKey
          );
        },
        (e) => console.error("[scheduled] fail", name, e)
      )
    );
  }
  console.log(`[scheduled] scanned ${entries.length} cron-idx entries, ${triggered} triggered`);
  if (now2.getUTCHours() === 2 && now2.getUTCMinutes() === 30) {
    const { base, headers } = kbdbBase(env);
    ctx.waitUntil(
      fetch(`${base}/execution-log/cleanup`, { method: "POST", headers }).then(async (r) => {
        const body = await r.json().catch(() => null);
        console.log("[scheduled] execution-log cleanup", r.status, JSON.stringify(body));
      }).catch((e) => console.error("[scheduled] execution-log cleanup failed", e))
    );
  }
  if (now2.getUTCMinutes() === 15) {
    ctx.waitUntil(
      runFtsBackfillTick(env).then(
        (summary) => console.log("[scheduled] fts-backfill tick summary", JSON.stringify(summary)),
        (e) => console.error("[scheduled] fts-backfill tick summary failed", e)
      )
    );
  }
  ctx.waitUntil(
    runUsageBrakeNotifyTick(env).then(
      (summary) => {
        if (!summary.skipped) console.log("[scheduled] usage-brake-notify tick summary", JSON.stringify(summary));
      },
      (e) => console.error("[scheduled] usage-brake-notify tick failed", e)
    )
  );
}

// cypher-executor/src/lib/kbdb-asset-store.ts
init_kbdb_caller();
init_kbdb_tally();
init_endpoints();
function kbdbBase2(env) {
  return kbdbBaseUrl(env);
}
function kbdbHeaders(env) {
  let h = { "Content-Type": "application/json" };
  if (env.KBDB_INTERNAL_TOKEN) h["Authorization"] = `Bearer ${env.KBDB_INTERNAL_TOKEN}`;
  h = withCaller(h, KBDB_CALLERS.assetStore);
  return h;
}
var AssetStoreUnavailableError = class extends Error {
  constructor(op, detail, status) {
    super(`\u77E5\u8B58\u5EAB\uFF08KBDB\uFF09\u66AB\u6642\u8B80\u5BEB\u4E0D\u5230\uFF08${op}\uFF09\uFF1A${detail}\u3002\u9019\u4E0D\u662F\u300C\u4F60\u6C92\u6709\u9019\u7B46\u8CC7\u6599\u300D\uFF0C\u8ACB\u7A0D\u5F8C\u518D\u8A66\u3002`);
    this.status = status;
    this.name = "AssetStoreUnavailableError";
  }
  status;
};
var UnsupportedAssetKeyError = class extends Error {
  constructor(store2, key) {
    super(`${store2} \u4E0D\u8A8D\u5F97\u9019\u7A2E key\uFF1A\u300C${key}\u300D\u3002\u8CC7\u6599\u7684\u5BB6\u5DF2\u6539\u70BA KBDB record\uFF0C\u6BCF\u4E00\u578B\u90FD\u8981\u5728 kbdb-asset-store.ts \u767B\u8A18\u3002`);
    this.name = "UnsupportedAssetKeyError";
  }
};
var ASSET_TEMPLATES = {
  workflow: {
    name: "arcrun_workflow",
    slots: ["name", "description", "cron_expr", "definition", "updated_at"],
    description: "Arcrun \u5177\u540D\u5DE5\u4F5C\u6D41\uFF08acr push\uFF0F\u5B89\u88DD\u5668\u5BEB\u5165\uFF09\u3002definition\uFF1D\u4F7F\u7528\u8005\u5BEB\u7684\u90A3\u4EFD\u5DE5\u4F5C\u6D41\u5B9A\u7FA9\u539F\u6587\u3002"
  },
  app: {
    name: "arcrun_app_install",
    slots: ["app_id", "name", "version", "definition", "updated_at"],
    description: "Arcrun App \u7684\u5B89\u88DD\u614B\uFF08\u5E02\u96C6\u6309\u4E0B\u5B89\u88DD\u4E4B\u5F8C\u7559\u4E0B\u7684\u90A3\u7B46\uFF09\u3002"
  },
  webhook: {
    name: "arcrun_webhook",
    slots: ["token", "description", "definition", "updated_at"],
    description: "Arcrun \u533F\u540D webhook\uFF08POST /webhooks \u5EFA\u7ACB\uFF09\u3002"
  },
  folderTree: {
    name: "arcrun_folder_tree",
    slots: ["library", "sync_token", "definition", "updated_at"],
    description: "\u540C\u6B65\u5C0F\u5E6B\u624B\u56DE\u5831\u7684\u5730\u7AEF\u8CC7\u6599\u593E\u6A39\uFF08portal \u986F\u793A\u7528\u7684\u6295\u5F71\uFF09\u3002"
  },
  daemonHint: {
    name: "arcrun_daemon_hint",
    slots: ["names", "expires_at", "updated_at"],
    description: "\u540C\u6B65\u5C0F\u5E6B\u624B\u6700\u8FD1\u56DE\u5831\u5728\u770B\u5B88\u7684\u5EAB\u540D\uFF08\u6709\u6548\u671F 48 \u5C0F\u6642\uFF09\u3002"
  },
  cronIndex: {
    name: "arcrun_cron_index",
    slots: ["index", "updated_at"],
    description: "\u6709\u6392\u7A0B\u7684\u5DE5\u4F5C\u6D41\u4E00\u89BD\uFF08scheduled() \u6BCF\u5206\u9418\u53EA\u8B80\u9019\u4E00\u7B46\uFF0C\u4E0D\u6383\u5168\u90E8\u5DE5\u4F5C\u6D41\uFF09\u3002"
  },
  apiRecipe: {
    name: "arcrun_api_recipe",
    slots: ["recipe_key", "canonical_id", "hash_id", "uuid", "definition", "updated_at"],
    description: "Arcrun API recipe\uFF08\u6253\u67D0\u500B\u5916\u90E8 API \u7684\u8A2D\u5B9A\uFF09\u3002"
  },
  recipeInstalled: {
    name: "arcrun_recipe_installed",
    slots: ["canonical_id", "uuid", "updated_at"],
    description: "\u9019\u53F0\u5BE6\u4F8B\u5C0D\u67D0\u500B canonical_id \u76EE\u524D\u5B89\u88DD\u7684\u662F\u54EA\u4E00\u7248 recipe\uFF08\u4F7F\u7528\u8005\u7684\u9078\u64C7\uFF09\u3002"
  },
  authRecipe: {
    name: "arcrun_auth_recipe",
    slots: ["service", "definition", "updated_at"],
    description: "Arcrun auth recipe\uFF08\u600E\u9EBC\u8A8D\u8B49\uFF1B\u53EA\u6709\u5B9A\u7FA9\uFF0C\u6C92\u6709\u4EFB\u4F55\u5BC6\u6587\uFF09\u3002"
  },
  promptRecipe: {
    name: "arcrun_prompt_recipe",
    slots: ["name", "definition", "updated_at"],
    description: "Arcrun prompt recipe\u3002"
  },
  pausedRun: {
    name: "arcrun_paused_run",
    slots: ["task_id", "api_key", "run_id", "workflow_name", "paused_node_id", "expires_at", "persisted_at", "state", "updated_at"],
    description: "\u7B49\u56DE\u547C\u7684\u66AB\u505C\u57F7\u884C\uFF0824 \u5C0F\u6642\u5167\u6709\u6548\uFF1Bstate\uFF1D\u6062\u5FA9\u6642\u8981\u7528\u7684\u7E8C\u884C\u8CC7\u6599\uFF0Ctrace \u5DF2\u906E\u853D\uFF09\u3002"
  }
};
var INSTANCE_ASSET_OWNER = "arcrun::assets";
function tenantAssetOwner(tenant2) {
  return `${tenant2}::assets`;
}
var nowIso = () => (/* @__PURE__ */ new Date()).toISOString();
function jsonField(value, ...keys) {
  try {
    const obj = JSON.parse(value);
    for (const k of keys) {
      const v = obj?.[k];
      if (typeof v === "string" && v.trim()) return v.trim();
      if (typeof v === "number") return String(v);
    }
  } catch {
  }
  return "";
}
var ANON_WEBHOOK_RE = /^[0-9a-f]{32}$/;
function pausedRunOwner(apiKey) {
  return `${apiKey || "arcrun"}::runs`;
}
function classify(store2, key) {
  if (store2 === "EXEC_CONTEXT") {
    if (key.startsWith("paused_run:")) {
      const taskId = key.slice("paused_run:".length);
      if (!taskId) return null;
      return {
        kind: "record",
        tpl: "pausedRun",
        recordId: `asset:paused_run:${taskId}`,
        owner: pausedRunOwner(""),
        valueSlot: "state",
        expires: true,
        ownerFromValue: (v) => pausedRunOwner(jsonField(v, "api_key")),
        lift: (v) => ({
          task_id: taskId,
          api_key: jsonField(v, "api_key"),
          run_id: jsonField(v, "run_id"),
          workflow_name: (() => {
            try {
              return String(JSON.parse(v).graph?.name ?? "");
            } catch {
              return "";
            }
          })(),
          paused_node_id: jsonField(v, "paused_node_id"),
          expires_at: jsonField(v, "expires_at"),
          persisted_at: String(Date.now())
        })
      };
    }
    if (key.startsWith("paused_idx:")) {
      return { kind: "derived", derive: "paused_index", arg: key.slice("paused_idx:".length) };
    }
    return null;
  }
  if (store2 === "RECIPES") {
    if (key.startsWith("idx:installed:")) {
      const canonical = key.slice("idx:installed:".length);
      if (!canonical) return null;
      return {
        kind: "record",
        tpl: "recipeInstalled",
        recordId: `asset:recipe_installed:${canonical}`,
        owner: INSTANCE_ASSET_OWNER,
        valueSlot: "uuid",
        lift: () => ({ canonical_id: canonical })
      };
    }
    if (key.startsWith("idx:canonical:")) {
      return { kind: "derived", derive: "recipe_canonical_list", arg: key.slice("idx:canonical:".length) };
    }
    if (key.startsWith("idx:")) {
      return { kind: "derived", derive: "recipe_hash", arg: key.slice("idx:".length) };
    }
    if (key.startsWith("recipe:")) {
      const id = key.slice("recipe:".length);
      if (!id) return null;
      return {
        kind: "record",
        tpl: "apiRecipe",
        recordId: `asset:recipe:${id}`,
        owner: INSTANCE_ASSET_OWNER,
        valueSlot: "definition",
        lift: (v) => ({
          recipe_key: id,
          canonical_id: jsonField(v, "canonical_id"),
          hash_id: jsonField(v, "hash_id"),
          uuid: jsonField(v, "uuid")
        })
      };
    }
    if (key.startsWith("auth_recipe:")) {
      const service = key.slice("auth_recipe:".length);
      if (!service) return null;
      return {
        kind: "record",
        tpl: "authRecipe",
        recordId: `asset:auth_recipe:${service}`,
        owner: INSTANCE_ASSET_OWNER,
        valueSlot: "definition",
        lift: () => ({ service })
      };
    }
    if (key.startsWith("prompt_recipe:")) {
      const name = key.slice("prompt_recipe:".length);
      if (!name) return null;
      return {
        kind: "record",
        tpl: "promptRecipe",
        recordId: `asset:prompt_recipe:${name}`,
        owner: INSTANCE_ASSET_OWNER,
        valueSlot: "definition",
        lift: () => ({ name })
      };
    }
    return null;
  }
  if (key === "cron-idx:_all") {
    return {
      kind: "record",
      tpl: "cronIndex",
      recordId: "asset:cron_index",
      owner: INSTANCE_ASSET_OWNER,
      valueSlot: "index",
      lift: () => ({})
    };
  }
  if (key.startsWith("cron-idx:") || key.startsWith("idx:")) {
    return { kind: "derived", derive: "none", arg: key };
  }
  const portalAt = key.indexOf(":portal:");
  if (portalAt > 0) {
    const tenant2 = key.slice(0, portalAt);
    const rest = key.slice(portalAt + ":portal:".length);
    if (rest.startsWith("folder_tree:")) {
      const library = rest.slice("folder_tree:".length);
      if (!library) return null;
      return {
        kind: "record",
        tpl: "folderTree",
        recordId: `asset:folder_tree:${tenant2}:${library}`,
        owner: tenantAssetOwner(tenant2),
        valueSlot: "definition",
        lift: (v) => ({ library, sync_token: jsonField(v, "sync_token") })
      };
    }
    if (rest === "daemon_active_libs") {
      return {
        kind: "record",
        tpl: "daemonHint",
        recordId: `asset:daemon_hint:${tenant2}`,
        owner: tenantAssetOwner(tenant2),
        valueSlot: "names",
        lift: () => ({})
      };
    }
    return null;
  }
  const appAt = key.indexOf(":app:");
  if (appAt > 0) {
    const tenant2 = key.slice(0, appAt);
    const id = key.slice(appAt + ":app:".length);
    if (!tenant2 || !id) return null;
    return {
      kind: "record",
      tpl: "app",
      recordId: `asset:app:${tenant2}:${id}`,
      owner: tenantAssetOwner(tenant2),
      valueSlot: "definition",
      lift: (v) => ({ app_id: id, name: jsonField(v, "name"), version: jsonField(v, "version") }),
      legacyEntryId: `arcrun:app:${tenant2}:${id}`
    };
  }
  const wfAt = key.indexOf(":wf:");
  if (wfAt > 0) {
    const tenant2 = key.slice(0, wfAt);
    const name = key.slice(wfAt + ":wf:".length);
    if (!tenant2 || !name) return null;
    return {
      kind: "record",
      tpl: "workflow",
      recordId: `asset:wf:${tenant2}:${name}`,
      owner: tenantAssetOwner(tenant2),
      valueSlot: "definition",
      lift: (v) => ({ name, description: jsonField(v, "description"), cron_expr: jsonField(v, "cron_expr") })
    };
  }
  if (ANON_WEBHOOK_RE.test(key)) {
    return {
      kind: "record",
      tpl: "webhook",
      recordId: `asset:webhook:${key}`,
      owner: INSTANCE_ASSET_OWNER,
      valueSlot: "definition",
      lift: (v) => ({ token: key, description: jsonField(v, "description") })
    };
  }
  return null;
}
function listTarget(store2, prefix) {
  const p = prefix ?? "";
  if (store2 === "RECIPES") {
    if (p === "recipe:") {
      return { tpl: "apiRecipe", owner: INSTANCE_ASSET_OWNER, toKey: (v, id) => `recipe:${v.recipe_key || id.slice("asset:recipe:".length)}` };
    }
    if (p === "auth_recipe:") {
      return { tpl: "authRecipe", owner: INSTANCE_ASSET_OWNER, toKey: (v, id) => `auth_recipe:${v.service || id.slice("asset:auth_recipe:".length)}` };
    }
    if (p === "prompt_recipe:") {
      return { tpl: "promptRecipe", owner: INSTANCE_ASSET_OWNER, toKey: (v, id) => `prompt_recipe:${v.name || id.slice("asset:prompt_recipe:".length)}` };
    }
    return null;
  }
  if (p === "") {
    return { tpl: "webhook", owner: INSTANCE_ASSET_OWNER, toKey: (v, id) => v.token || id.slice("asset:webhook:".length) };
  }
  const wf = p.match(/^(.+):wf:$/);
  if (wf) {
    const tenant2 = wf[1];
    return { tpl: "workflow", owner: tenantAssetOwner(tenant2), toKey: (v, id) => `${tenant2}:wf:${v.name || id.slice(`asset:wf:${tenant2}:`.length)}` };
  }
  const app2 = p.match(/^(.+):app:$/);
  if (app2) {
    const tenant2 = app2[1];
    return {
      tpl: "app",
      owner: tenantAssetOwner(tenant2),
      toKey: (v, id) => `${tenant2}:app:${v.app_id || id.slice(`asset:app:${tenant2}:`.length)}`,
      legacy: { entryType: "app_install", owner: tenant2, toKey: (page) => `${tenant2}:app:${page}` }
    };
  }
  return null;
}
var ensuredTemplates2 = /* @__PURE__ */ new Set();
async function kbdbFetch2(env, path, init, op) {
  const extra = init?.headers ?? {};
  try {
    const method = (init?.method ?? "GET").toUpperCase();
    const essential = method !== "GET" || path.startsWith("/templates");
    const baseH = essential ? withEssential(kbdbHeaders(env)) : kbdbHeaders(env);
    const res = await fetch(`${kbdbBase2(env)}${path}`, { ...init, headers: { ...baseH, ...extra } });
    addKbdbResponse(env.__kbdbTally, res);
    return res;
  } catch (e) {
    throw new AssetStoreUnavailableError(op, e instanceof Error ? e.message : String(e));
  }
}
async function ensureTemplate2(env, spec) {
  if (ensuredTemplates2.has(spec.name)) return;
  const got = await kbdbFetch2(env, `/templates/${encodeURIComponent(spec.name)}`, void 0, "template");
  if (got.ok) {
    const body = await got.json().catch(() => null);
    const tpl = body?.template;
    if (tpl?.id) {
      let current = [];
      try {
        const parsed = JSON.parse(tpl.slots_json ?? "[]");
        if (Array.isArray(parsed)) current = parsed.filter((s) => typeof s === "string");
      } catch {
      }
      const missing = spec.slots.filter((s) => !current.includes(s));
      if (missing.length > 0) {
        const patched = await kbdbFetch2(env, `/templates/${encodeURIComponent(tpl.id)}`, {
          method: "PATCH",
          body: JSON.stringify({ slots: [...current, ...missing] })
        }, "template");
        if (!patched.ok) throw new AssetStoreUnavailableError("template", `\u88DC\u6B04\u4F4D ${spec.name} \u2192 HTTP ${patched.status}`, patched.status);
      }
      ensuredTemplates2.add(spec.name);
      return;
    }
  } else if (got.status !== 404) {
    throw new AssetStoreUnavailableError("template", `GET /templates/${spec.name} \u2192 HTTP ${got.status}`, got.status);
  }
  const res = await kbdbFetch2(env, "/templates", {
    method: "POST",
    body: JSON.stringify({ name: spec.name, slots: spec.slots, description: spec.description, created_by: "arcrun" })
  }, "template");
  if (!res.ok) {
    const again = await kbdbFetch2(env, `/templates/${encodeURIComponent(spec.name)}`, void 0, "template");
    if (!again.ok) throw new AssetStoreUnavailableError("template", `POST /templates ${spec.name} \u2192 HTTP ${res.status}`, res.status);
  }
  ensuredTemplates2.add(spec.name);
}
async function getRecord(env, recordId) {
  const res = await kbdbFetch2(env, `/records/${encodeURIComponent(recordId)}`, void 0, "get");
  if (res.status === 404) return null;
  if (!res.ok) throw new AssetStoreUnavailableError("get", `GET /records/${recordId} \u2192 HTTP ${res.status}`, res.status);
  const body = await res.json().catch(() => null);
  return body?.record ?? null;
}
async function upsertRecord(env, tpl, recordId, owner, values) {
  const path = `/records/${encodeURIComponent(recordId)}`;
  const patchInit = { method: "PATCH", body: JSON.stringify({ values }) };
  const patch = await kbdbFetch2(env, path, patchInit, "put");
  if (patch.ok) return;
  if (patch.status === 400) {
    ensuredTemplates2.delete(tpl.name);
    await ensureTemplate2(env, tpl);
    const retry = await kbdbFetch2(env, path, patchInit, "put");
    if (retry.ok) return;
    if (retry.status !== 404) throw new AssetStoreUnavailableError("put", `PATCH ${path} \u2192 HTTP ${retry.status}`, retry.status);
  } else if (patch.status !== 404) {
    throw new AssetStoreUnavailableError("put", `PATCH ${path} \u2192 HTTP ${patch.status}`, patch.status);
  }
  await ensureTemplate2(env, tpl);
  const created = await kbdbFetch2(env, "/records", {
    method: "POST",
    body: JSON.stringify({ template: tpl.name, record_id: recordId, owner_id: owner, values, derived_cell_ids: true })
  }, "put");
  if (!created.ok) {
    const detail = await created.text().catch(() => "");
    throw new AssetStoreUnavailableError("put", `POST /records\uFF08${tpl.name}\uFF09\u2192 HTTP ${created.status} ${detail.slice(0, 200)}`, created.status);
  }
}
async function deleteRecord(env, recordId) {
  const res = await kbdbFetch2(env, `/records/${encodeURIComponent(recordId)}`, { method: "DELETE" }, "delete");
  if (!res.ok && res.status !== 404) throw new AssetStoreUnavailableError("delete", `DELETE /records/${recordId} \u2192 HTTP ${res.status}`, res.status);
}
async function listRecords(env, tpl, owner) {
  const out = [];
  const limit = 500;
  for (let offset = 0; ; offset += limit) {
    const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
    if (owner) params.set("owner_id", owner);
    const res = await kbdbFetch2(env, `/records/by-template/${encodeURIComponent(tpl.name)}?${params}`, void 0, "list");
    if (!res.ok) throw new AssetStoreUnavailableError("list", `GET /records/by-template/${tpl.name} \u2192 HTTP ${res.status}`, res.status);
    const body = await res.json().catch(() => null);
    const page = body?.records ?? [];
    out.push(...page);
    if (page.length < limit) break;
  }
  return out;
}
async function recordIdsBySource(env, tpl, field, value, owner) {
  const params = new URLSearchParams({ field, value, owner_id: owner });
  const res = await kbdbFetch2(env, `/records/by-source/${encodeURIComponent(tpl.name)}?${params}`, void 0, "lookup");
  if (!res.ok) throw new AssetStoreUnavailableError("lookup", `GET /records/by-source/${tpl.name} \u2192 HTTP ${res.status}`, res.status);
  const body = await res.json().catch(() => null);
  return body?.record_ids ?? [];
}
function envelopeValue(metadataJson) {
  if (!metadataJson) return null;
  try {
    const envl = JSON.parse(metadataJson);
    if (envl?.arcrun_asset !== true) return null;
    if (typeof envl.definition_raw === "string") return envl.definition_raw;
    return envl.definition === void 0 ? null : JSON.stringify(envl.definition);
  } catch {
    return null;
  }
}
async function getLegacyEnvelope(env, entryId) {
  const res = await kbdbFetch2(env, `/entries/${encodeURIComponent(entryId)}`, void 0, "get");
  if (!res.ok) return null;
  const body = await res.json().catch(() => null);
  return envelopeValue(body?.entry?.metadata_json);
}
async function listLegacyEnvelopes(env, entryType, owner) {
  const params = new URLSearchParams({ entry_type: entryType, owner_id: owner, limit: "1000" });
  const res = await kbdbFetch2(env, `/entries?${params}`, void 0, "list");
  if (!res.ok) return [];
  const body = await res.json().catch(() => null);
  const out = [];
  for (const e of body?.entries ?? []) {
    const v = envelopeValue(e.metadata_json);
    if (v !== null && e.page_name) out.push({ page_name: e.page_name, value: v });
  }
  return out;
}
var RECIPE_CACHE_MS = 3e4;
var recipeCache = /* @__PURE__ */ new Map();
var recipeCacheGen = 0;
function clearRecipeCache() {
  recipeCacheGen++;
  recipeCache.clear();
}
function shape(raw2, type) {
  if (raw2 === null) return null;
  const t = typeof type === "string" ? type : type?.type;
  if (t === "json") {
    try {
      return JSON.parse(raw2);
    } catch {
      return null;
    }
  }
  if (t === "arrayBuffer" || t === "stream") {
    throw new Error("\u8CC7\u7522\u5132\u5B58\u53EA\u5B58\u6587\u5B57\u6587\u4EF6\uFF0C\u4E0D\u652F\u63F4 arrayBuffer\uFF0Fstream \u8B80\u6CD5");
  }
  return raw2;
}
var KbdbAssetStore = class {
  constructor(store2, env) {
    this.store = store2;
    this.env = env;
  }
  store;
  env;
  /**
   * 本請求內的讀取備忘：list() 回來的 record 本來就帶完整內容，呼叫端接著逐筆 get()
   * 時直接命中，不再每筆打一次 KBDB（否則「列出 N 支工作流」＝N+1 個 subrequest，
   * 免費方案 50 個的上限很快就撞到）。實例是 per-request 的（withAssetStores），
   * 所以這份備忘不會跨請求變舊。
   */
  memo = /* @__PURE__ */ new Map();
  async readRaw(key) {
    const ref = classify(this.store, key);
    if (!ref) return null;
    if (ref.kind === "derived") return this.derive(ref);
    const rec = await getRecord(this.env, ref.recordId);
    if (rec) {
      const v = rec.values?.[ref.valueSlot];
      if (v === void 0 || v === "") return null;
      if (ref.tpl === "daemonHint" || ref.expires) {
        const exp = Number(rec.values.expires_at ?? 0);
        if (exp && Date.now() > exp) return null;
      }
      return v;
    }
    if (ref.legacyEntryId) return getLegacyEnvelope(this.env, ref.legacyEntryId);
    return null;
  }
  async derive(ref) {
    if (ref.derive === "none") return null;
    if (ref.derive === "paused_index") {
      const now2 = Date.now();
      const recs = await listRecords(this.env, ASSET_TEMPLATES.pausedRun, pausedRunOwner(ref.arg));
      const rows = recs.map((r) => ({
        task_id: r.values.task_id ?? "",
        run_id: r.values.run_id ?? "",
        paused_node_id: r.values.paused_node_id ?? "",
        workflow_name: r.values.workflow_name || void 0,
        expires_at: Number(r.values.expires_at ?? 0),
        persisted_at: Number(r.values.persisted_at ?? 0)
      })).filter((e) => e.task_id && e.expires_at > now2).sort((a, b) => b.persisted_at - a.persisted_at);
      return JSON.stringify(rows);
    }
    const tpl = ASSET_TEMPLATES.apiRecipe;
    if (ref.derive === "recipe_canonical_list") {
      const ids2 = await recordIdsBySource(this.env, tpl, "canonical_id", ref.arg, INSTANCE_ASSET_OWNER);
      const uuids = ids2.map((id) => id.slice("asset:recipe:".length)).filter((k) => k && k !== ref.arg);
      return uuids.length > 0 ? JSON.stringify(uuids) : null;
    }
    const ids = await recordIdsBySource(this.env, tpl, "hash_id", ref.arg, INSTANCE_ASSET_OWNER);
    for (const id of ids) {
      const rec = await getRecord(this.env, id);
      const canonical = rec?.values?.canonical_id;
      if (canonical) return canonical;
    }
    return null;
  }
  async get(key, type) {
    if (this.memo.has(key)) return shape(this.memo.get(key) ?? null, type);
    if (this.store === "RECIPES") {
      const hit = recipeCache.get(key);
      if (hit && Date.now() - hit.at < RECIPE_CACHE_MS) return shape(hit.value, type);
      const gen = recipeCacheGen;
      const raw2 = await this.readRaw(key);
      if (gen === recipeCacheGen) recipeCache.set(key, { at: Date.now(), value: raw2 });
      return shape(raw2, type);
    }
    return shape(await this.readRaw(key), type);
  }
  async getWithMetadata(key, type) {
    return { value: await this.get(key, type), metadata: null, cacheStatus: null };
  }
  async put(key, value, options) {
    if (typeof value !== "string") throw new Error("\u8CC7\u7522\u5132\u5B58\u53EA\u5B58\u6587\u5B57\u6587\u4EF6");
    const ref = classify(this.store, key);
    if (!ref) throw new UnsupportedAssetKeyError(this.store, key);
    if (ref.kind === "derived") return;
    if (this.store === "RECIPES") clearRecipeCache();
    this.memo.delete(key);
    const values = { ...ref.lift(value), [ref.valueSlot]: value, updated_at: nowIso() };
    if (ref.tpl === "daemonHint") {
      const ttl = options?.expirationTtl ?? 172800;
      values.expires_at = String(options?.expiration ? options.expiration * 1e3 : Date.now() + ttl * 1e3);
    }
    const owner = ref.ownerFromValue ? ref.ownerFromValue(value) : ref.owner;
    await upsertRecord(this.env, ASSET_TEMPLATES[ref.tpl], ref.recordId, owner, values);
  }
  async delete(key) {
    const ref = classify(this.store, key);
    if (!ref || ref.kind === "derived") return;
    if (this.store === "RECIPES") clearRecipeCache();
    this.memo.delete(key);
    await deleteRecord(this.env, ref.recordId);
    if (ref.legacyEntryId) {
      await kbdbFetch2(this.env, `/entries/${encodeURIComponent(ref.legacyEntryId)}`, { method: "DELETE" }, "delete").catch(() => null);
    }
  }
  async list(options) {
    const target = listTarget(this.store, options?.prefix ?? void 0);
    if (!target) {
      return { keys: [], list_complete: true, cacheStatus: null };
    }
    const records = await listRecords(this.env, ASSET_TEMPLATES[target.tpl], target.owner);
    const names = /* @__PURE__ */ new Set();
    for (const r of records) {
      const k = target.toKey(r.values ?? {}, r.record_id);
      if (!k) continue;
      names.add(k);
      const ref = classify(this.store, k);
      if (ref?.kind === "record") {
        const v = r.values?.[ref.valueSlot];
        this.memo.set(k, v === void 0 || v === "" ? null : v);
      }
    }
    if (target.legacy) {
      for (const e of await listLegacyEnvelopes(this.env, target.legacy.entryType, target.legacy.owner)) {
        const k = target.legacy.toKey(e.page_name);
        if (names.has(k)) continue;
        names.add(k);
        this.memo.set(k, e.value);
      }
    }
    return { keys: [...names].sort().map((name) => ({ name })), list_complete: true, cacheStatus: null };
  }
};
function withAssetStores(env, tally) {
  const withTally = tally ? { ...env, __kbdbTally: tally } : env;
  return {
    ...withTally,
    WEBHOOKS: new KbdbAssetStore("WEBHOOKS", withTally),
    RECIPES: new KbdbAssetStore("RECIPES", withTally),
    EXEC_CONTEXT: new KbdbAssetStore("EXEC_CONTEXT", withTally)
  };
}

// cypher-executor/src/index.ts
init_kbdb_tally();

// cypher-executor/src/lib/grant-session.ts
var GRANT_SESSION_HEADER = "x-arcrun-grant-session";
var GRANT_SESSION_TTL_MS = 30 * 6e4;
var MAX_ENTRIES = 200;
var store = /* @__PURE__ */ new Map();
async function sha256Hex2(s) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
function sweep(now2) {
  for (const [k, v] of store) if (v.exp <= now2) store.delete(k);
  while (store.size > MAX_ENTRIES) {
    const first = store.keys().next().value;
    if (first === void 0) break;
    store.delete(first);
  }
}
async function mintGrantSession(token, bearer, now2 = Date.now()) {
  sweep(now2);
  const raw2 = crypto.getRandomValues(new Uint8Array(32));
  const id = [...raw2].map((b) => b.toString(16).padStart(2, "0")).join("");
  store.set(await sha256Hex2(id), { token, bearerHash: await sha256Hex2(bearer), exp: now2 + GRANT_SESSION_TTL_MS });
  return id;
}
async function lookupGrantSession(id, bearer, now2 = Date.now()) {
  if (!/^[0-9a-f]{64}$/.test(id) || !bearer) return null;
  const key = await sha256Hex2(id);
  const e = store.get(key);
  if (!e) return null;
  if (e.exp <= now2) {
    store.delete(key);
    return null;
  }
  if (e.bearerHash !== await sha256Hex2(bearer)) return null;
  return e.token;
}

// cypher-executor/src/routes/health.ts
init_dist();
init_secret_backend();
init_kbdb_proxy();
var healthRouter = new Hono2();
var DATA_LAYER_CACHE_MS = 1e4;
var dataLayerCache = null;
async function dataLayerStatus(env) {
  const now2 = Date.now();
  if (dataLayerCache && now2 - dataLayerCache.at < DATA_LAYER_CACHE_MS) return dataLayerCache.block;
  let block;
  try {
    const { base, headers } = kbdbBase(env);
    const res = await fetch(`${base}/health`, { headers, signal: AbortSignal.timeout(5e3) });
    const body = await res.json().catch(() => null);
    block = body?.data_layer ?? {
      ok: false,
      reason: "kbdb_health_unreadable",
      detail: `HTTP ${res.status}`,
      summary: "\u9019\u53F0\u7684 kbdb \u9084\u6C92\u6709\u8CC7\u6599\u5C64\u4E16\u4EE3\u63A2\u91DD\uFF08\u6BD4 Arcrun#159 \u7684\u4FEE\u6CD5\u820A\uFF09\u2014\u2014\u72C0\u614B\u672A\u77E5\u3002"
    };
  } catch (e) {
    block = {
      ok: false,
      reason: "kbdb_unreachable",
      detail: e instanceof Error ? e.message : String(e),
      summary: "\u6253\u4E0D\u5230 kbdb\u2014\u2014\u8CC7\u6599\u5C64\u72C0\u614B\u672A\u77E5\uFF08\u672A\u77E5\u4E0D\u7B49\u65BC\u5065\u5EB7\uFF09\u3002"
    };
  }
  dataLayerCache = { at: now2, block };
  return block;
}
function authStoreStatus(env) {
  const store2 = readAuthStore(env);
  const writable = authStoreWritable(env);
  return {
    console: { home: "workers-secrets", writable, configured: store2.console !== null },
    portal_users: { password_home: "workers-secrets", writable, passwords_migrated: Object.keys(store2.passwords).length }
  };
}
healthRouter.get("/health", async (c) => {
  const bundleVersion = c.env.ARCRUN_BUNDLE_VERSION;
  const bundleCommit = c.env.ARCRUN_BUNDLE_COMMIT;
  const dataLayer = await dataLayerStatus(c.env);
  return c.json({
    ok: true,
    status: dataLayer.ok ? "ok" : "degraded",
    data_layer: dataLayer,
    ...bundleVersion ? { bundle_version: bundleVersion } : {},
    ...bundleCommit ? { bundle_commit: bundleCommit } : {},
    auth_store: authStoreStatus(c.env),
    // inkstone/Arcrun#276：金鑰值放哪（cf＝Workers Secrets／local＝企業私有雲由這台 server 保存）。
    // local 另報主金鑰有沒有設（只回布林，不回內容）。
    credential_store: (() => {
      const backend = secretBackendMode(c.env);
      return backend === "local" ? { backend, ready: localBackendReady(c.env) } : { backend };
    })(),
    // arcrun-rag#38/#69/#25（2026-08-11）：安裝器判斷「要不要重推」只比 bundle_version——
    // 但這次要修的洞是「installer 從沒注入過 PORTAL_MAIL_RELAY_BASE」，跟 bundle 內容
    // 版本無關（同一個 cypher 版本，有的實例有這個 var、有的沒有）。純比版本號的話，
    // 已經在最新版的實例（如 leo 自己那台）永遠不會因為「按更新」而重推，這個 var
    // 就永遠補不進去。只回布林（有沒有設，不回值本身）——不洩漏郵差網址。
    mail_relay_configured: Boolean(String(c.env.PORTAL_MAIL_RELAY_BASE ?? "").trim()),
    // Arcrun#98 c11358（leo：「一台實例的 portal 永遠指向實際安裝它的那台安裝器」）：
    // 有設就吐出去（非機密，只是一個 URL），portal 前端拿它取代寫死的 install.arcrun.dev，
    // 這樣版本檢查／「前往安裝精靈」兩處才會跟著這台實例真正的安裝來源走，而不是恆指 prod。
    // 未注入（尚未走過會設這個 var 的部署）→ 省略該欄，前端退回原本寫死的 prod 網址
    // （同 bundle_version 的既有行為：省略欄位 ≠ 回傳假值）。
    ...c.env.INSTALLER_ORIGIN ? { installer_origin: c.env.INSTALLER_ORIGIN } : {}
  });
});
healthRouter.get(
  "/",
  (c) => c.json({
    service: "arcrun-cypher-executor",
    version: "1.0.0",
    status: "ok"
  })
);

// cypher-executor/src/routes/execute.ts
init_dist();
init_types();
init_graph_executor();
init_schemas();
init_component_loader();
init_run_scratch();
var executeRouter = new Hono2();
executeRouter.post("/execute", async (c) => {
  const body = await c.req.json();
  const parsed = executeSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: "\u5716\u5B9A\u7FA9\u9A57\u8B49\u5931\u6557", details: parsed.error.issues }, 400);
  }
  const { graph, context } = parsed.data;
  const apiKey = c.req.header("x-arcrun-api-key") ?? void 0;
  const loader = createComponentLoader(c.env);
  const executor = new GraphExecutor(loader, void 0, c.env, apiKey);
  const start = Date.now();
  try {
    const result = await executor.execute(graph, context, createRunScratch());
    const duration_ms = Date.now() - start;
    const verdict = deriveExecutionVerdict(graph, result.trace);
    c.executionCtx.waitUntil(
      writeExecutionVerdict(
        c.env,
        graph.id,
        graph.nodes,
        verdict.success ? "success" : "failed",
        duration_ms,
        verdict.success ? "\u57F7\u884C\u5B8C\u6210" : (verdict.error ?? "\u7BC0\u9EDE\u5931\u6557").slice(0, 100),
        context,
        apiKey,
        c.env.__kbdbTally
      )
    );
    if (!verdict.success) {
      return c.json({
        success: false,
        error: verdict.error,
        failed_node: verdict.failedNode ?? null,
        data: result.data,
        trace: result.trace,
        duration_ms
      }, 500);
    }
    return c.json({ success: true, data: result.data, trace: result.trace, duration_ms });
  } catch (err) {
    const duration_ms = Date.now() - start;
    const errMsg = err instanceof Error ? err.message : String(err);
    c.executionCtx.waitUntil(
      writeExecutionVerdict(c.env, graph.id, graph.nodes, "failed", duration_ms, errMsg.slice(0, 100), context, apiKey, c.env.__kbdbTally)
    );
    if (err instanceof ExecutionError) {
      const traceFormatted = err.trace.map((s) => ({
        node: s.nodeId,
        status: s.error ? "failed" : "success",
        ...s.error ? { error: s.error } : {}
      }));
      return c.json({
        success: false,
        error: errMsg,
        failed_node: err.failed_node,
        failed_input: err.failed_input,
        trace: traceFormatted,
        duration_ms
      }, 500);
    }
    return c.json({ success: false, error: errMsg, failed_node: null, trace: [], duration_ms }, 500);
  }
});

// cypher-executor/src/routes/cypher.ts
init_dist();

// cypher-executor/src/actions/cypher-handlers.ts
init_types();
init_graph_executor();
init_schemas();
init_component_loader();
init_execution_evaluator();

// cypher-executor/src/actions/triplet-parser.ts
init_constants3();
function parseTriplets(rawTriplets) {
  const edges = [];
  const nodeNames = /* @__PURE__ */ new Set();
  const fromSet = /* @__PURE__ */ new Set();
  const toSet = /* @__PURE__ */ new Set();
  for (const line of rawTriplets) {
    if (typeof line !== "string") continue;
    const parts = line.split(">>").map((s) => s.trim());
    if (parts.length !== 3) continue;
    const [from, action, to] = parts;
    edges.push({ from, to, label: action });
    nodeNames.add(from);
    nodeNames.add(to);
    fromSet.add(from);
    toSet.add(to);
  }
  if (nodeNames.size === 0) return null;
  const sourceNodes = new Set([...fromSet].filter((n) => !toSet.has(n)));
  const sinkNodes = new Set([...toSet].filter((n) => !fromSet.has(n)));
  return { edges, nodeNames, sourceNodes, sinkNodes };
}
var INPUT_NAMES = /* @__PURE__ */ new Set(["input", "trigger", "webhook", "start"]);
var OUTPUT_NAMES = /* @__PURE__ */ new Set(["output", "result", "end", "done"]);
function isVirtualIoName(name) {
  const lower = name.toLowerCase();
  return INPUT_NAMES.has(lower) || OUTPUT_NAMES.has(lower);
}
function resolveNodeRole(name, parsed) {
  if (INPUT_NAMES.has(name.toLowerCase())) return "Input";
  if (OUTPUT_NAMES.has(name.toLowerCase())) return "Output";
  if (parsed.sourceNodes.has(name)) return "Input";
  return "Component";
}
function toEdgeType(label) {
  const upper = label.toUpperCase();
  if (VALID_EDGE_TYPES.has(upper)) return upper;
  return SEMANTIC_EDGE_MAP[label] ?? SEMANTIC_EDGE_MAP[upper] ?? "PIPE";
}

// cypher-executor/src/actions/search-nodes.ts
init_component_loader();
init_endpoints();
init_recipes();

// cypher-executor/src/lib/branch-hints.ts
var BRANCH_HINTS = {
  if_control: {
    branch_field: "data.branch",
    branches: ["true", "false"],
    edge_types: ["ON_TRUE", "ON_FALSE"],
    usage: '\u9019\u9846\u7B97\u5B8C\u6703\u8F38\u51FA data.branch\uFF08"true"\uFF0F"false"\uFF09\u3002\u4E0B\u6E38\u63A5\u5169\u689D\u908A\uFF1AON_TRUE \u63A5\u689D\u4EF6\u6210\u7ACB\u8981\u505A\u7684\u4E8B\uFF0CON_FALSE \u63A5\u4E0D\u6210\u7ACB\u8981\u505A\u7684\u4E8B\u3002**\u4E0D\u9700\u8981\u81EA\u5DF1\u5BEB code \u5224\u65B7\u8D70\u54EA\u689D**\u2014\u2014\u5F15\u64CE\u4F9D branch \u81EA\u52D5\u9078\u8DEF\u3002',
    example: "\u5224\u65B7\u6709\u6C92\u6709\u65B0\u8CC7\u6599 >> ON_TRUE >> \u50B3\u5230 telegram\n\u5224\u65B7\u6709\u6C92\u6709\u65B0\u8CC7\u6599 >> ON_FALSE >> \u7D50\u675F\n\uFF08\u4E2D\u6587\u8A9E\u610F\u8A5E\u4EA6\u53EF\uFF1A\u300C\u6210\u7ACB\u6642\u300D\uFF1DON_TRUE\u3001\u300C\u5426\u5247\u300D\uFF1DON_FALSE\uFF09"
  },
  switch: {
    branch_field: "data.branch",
    branches: "\u7531 input_schema.cases[].branch \u8207 default_branch \u6C7A\u5B9A\uFF08N \u8DEF\uFF0C\u975E\u56FA\u5B9A\u6E05\u55AE\uFF09",
    edge_types: ["ON_BRANCH"],
    usage: "\u9019\u9846\u4F9D value \u6BD4\u5C0D cases\uFF0C\u8F38\u51FA data.branch\uFF1D\u547D\u4E2D\u90A3\u500B case \u7684 branch \u540D\uFF08\u90FD\u6C92\u4E2D\u5247\u662F default_branch\uFF09\u3002\u4E0B\u6E38**\u6BCF\u689D\u8DEF\u5404\u63A5\u4E00\u689D ON_BRANCH \u908A\uFF0C\u4E26\u5728\u908A\u4E0A\u6A19 branch \u7B49\u65BC\u4F60\u5728 cases \u88E1\u53D6\u7684\u540D\u5B57**\u3002default_branch \u4E0D\u9700\u8981\u7279\u5225\u7684\u908A\u578B\uFF0C\u7167\u6A23\u7528 ON_BRANCH \u6A19\u5B83\u7684\u540D\u5B57\u5373\u53EF\u3002",
    example: '{"cases":[{"match":"active","branch":"branch_active"}],"default_branch":"branch_default"}\nedges: [\n  {"from":"my_switch","to":"\u8655\u7406\u555F\u7528","type":"ON_BRANCH","branch":"branch_active"},\n  {"from":"my_switch","to":"\u8655\u7406\u5176\u4ED6","type":"ON_BRANCH","branch":"branch_default"}\n]'
  },
  try_catch: {
    branch_field: "data.branch",
    branches: ["try", "catch"],
    edge_types: ["ON_BRANCH"],
    usage: '\u9019\u9846\u770B\u4E0A\u6E38 error \u662F\u5426\u975E\u7A7A\uFF0C\u8F38\u51FA data.branch\uFF08"try"\uFF1D\u6C92\u932F\uFF0F"catch"\uFF1D\u6709\u932F\uFF09\u3002\u4E0B\u6E38\u63A5\u5169\u689D ON_BRANCH \u908A\uFF0Cbranch \u5206\u5225\u6A19 "try" \u8207 "catch"\u3002**\u932F\u8AA4\u8655\u7406\u4E0D\u9700\u8981\u5BEB code**\u2014\u2014\u628A\u8981\u88DC\u6551\u7684\u7BC0\u9EDE\u63A5\u5728 catch \u90A3\u689D\u908A\u5F8C\u9762\u5373\u53EF\u3002',
    example: 'edges: [\n  {"from":"my_try_catch","to":"\u6B63\u5E38\u6D41\u7A0B","type":"ON_BRANCH","branch":"try"},\n  {"from":"my_try_catch","to":"\u88DC\u6551\u6D41\u7A0B","type":"ON_BRANCH","branch":"catch"}\n]'
  }
};
function branchHintFor(componentId) {
  if (!componentId) return void 0;
  return BRANCH_HINTS[componentId.toLowerCase()];
}

// cypher-executor/src/actions/search-nodes.ts
async function searchNodes(parsed, config, env, mode = "discover", target) {
  const nodeResults = {};
  const missingNodes = [];
  if (mode === "compile") {
    for (const nodeName of parsed.nodeNames) {
      const role = resolveNodeRole(nodeName, parsed);
      if ((role === "Input" || role === "Output") && isVirtualIoName(nodeName)) {
        nodeResults[nodeName] = { status: "found", componentId: nodeName.toLowerCase(), type: role };
        continue;
      }
      const configComponent = config?.[nodeName]?.component;
      nodeResults[nodeName] = {
        status: configComponent ? "found" : "unchecked",
        componentId: configComponent ?? nodeName,
        type: role
      };
    }
    return { nodeResults, missingNodes };
  }
  const registryBase = env ? registryBaseUrl(env) : void 0;
  const wantComponents = target !== "recipe";
  const wantRecipes = target !== "component";
  const catalog = !wantComponents ? { status: "ok", entries: [] } : registryBase ? await fetchCatalog(registryBase) : { status: "unreachable", entries: [] };
  const recipes = wantRecipes && env?.RECIPES ? await listAllRecipes2(env.RECIPES) : [];
  const byId = /* @__PURE__ */ new Map();
  for (const e of catalog.entries) {
    const prev = byId.get(e.canonical_id);
    if (!prev || (e.score ?? 0) > (prev.score ?? 0)) byId.set(e.canonical_id, e);
    for (const a of e.aliases ?? []) if (!byId.has(a)) byId.set(a, e);
  }
  for (const nodeName of parsed.nodeNames) {
    const role = resolveNodeRole(nodeName, parsed);
    if ((role === "Input" || role === "Output") && isVirtualIoName(nodeName)) {
      nodeResults[nodeName] = { status: "found", componentId: nodeName.toLowerCase(), type: role };
      continue;
    }
    const configComponent = config?.[nodeName]?.component;
    const componentId = configComponent ?? nodeName;
    if (configComponent) {
      nodeResults[nodeName] = { status: "found", componentId, type: role };
      continue;
    }
    if (wantComponents && RUNTIME_NATIVE_COMPONENT_IDS.has(componentId)) {
      nodeResults[nodeName] = {
        status: "found",
        componentId,
        type: role,
        source: "builtin",
        branch_hint: branchHintFor(componentId)
      };
      continue;
    }
    if (catalog.status === "unreachable") {
      nodeResults[nodeName] = { status: "unknown", componentId, type: role };
      continue;
    }
    if (catalog.status === "no_endpoint") {
      const legacy = await legacyPerNodeLookup(registryBase, componentId, nodeName, role, env, recipes);
      nodeResults[nodeName] = legacy.info;
      if (legacy.missing) missingNodes.push(nodeName);
      continue;
    }
    const hit = byId.get(componentId);
    if (hit) {
      nodeResults[nodeName] = {
        status: "found",
        componentId,
        type: role,
        source: "component",
        input_schema: hit.input_schema,
        success_rate: typeof hit.success_rate === "number" ? hit.success_rate : void 0,
        stability: typeof hit.stability === "string" ? hit.stability : void 0,
        branch_hint: branchHintFor(componentId)
      };
      continue;
    }
    const recipe = recipes.find((r) => r.canonical_id === componentId);
    if (recipe) {
      nodeResults[nodeName] = {
        status: "found",
        componentId: recipe.canonical_id,
        type: role,
        source: "recipe",
        description: recipe.description,
        endpoint: recipe.endpoint,
        payload_hint: buildPayloadHint(recipe)
      };
      continue;
    }
    const substituted = trySubstitution(nodeName, catalog.entries, recipes);
    if (substituted) {
      nodeResults[nodeName] = { ...substituted, type: role };
      continue;
    }
    const similarComponents = similarFromCatalog(catalog.entries, nodeName);
    const similarRecipes = similarFromRecipes(recipes, nodeName);
    nodeResults[nodeName] = {
      status: "not_found",
      componentId,
      type: role,
      suggestion: buildSuggestion(componentId),
      ...similarComponents.length > 0 ? { similar_components: similarComponents } : {},
      ...similarRecipes.length > 0 ? { similar_recipes: similarRecipes } : {}
    };
    missingNodes.push(nodeName);
  }
  return { nodeResults, missingNodes };
}
async function fetchCatalog(registryBase) {
  try {
    const res = await fetch(`${registryBase}/components/catalog`, { signal: AbortSignal.timeout(1e4) });
    if (res.status === 404) return { status: "no_endpoint", entries: [] };
    if (!res.ok) return { status: "unreachable", entries: [] };
    const body = await res.json();
    return { status: "ok", entries: body.data?.components ?? [] };
  } catch {
    return { status: "unreachable", entries: [] };
  }
}
async function listAllRecipes2(kv) {
  try {
    const list = await kv.list({ prefix: "recipe:" });
    return (await Promise.all(
      list.keys.map((k) => kv.get(k.name, "json"))
    )).filter(Boolean);
  } catch {
    return [];
  }
}
function similarFromCatalog(entries, nodeName) {
  const searchableOf = (e) => [e.canonical_id, e.display_name ?? "", e.description ?? "", ...e.aliases ?? [], ...e.tags ?? []].join(" ").toLowerCase();
  const full = nodeName.toLowerCase();
  const direct = entries.filter((e) => searchableOf(e).includes(full)).map((e) => e.canonical_id);
  if (direct.length > 0) return [...new Set(direct)].slice(0, 3);
  const tokens = extractTokens(nodeName);
  if (tokens.length === 0) return [];
  const count = /* @__PURE__ */ new Map();
  for (const e of entries) {
    const hay = searchableOf(e);
    const hits = tokens.filter((t) => hay.includes(t)).length;
    if (hits > 0) count.set(e.canonical_id, Math.max(count.get(e.canonical_id) ?? 0, hits));
  }
  return [...count.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([id]) => id);
}
function similarFromRecipes(recipes, nodeName) {
  const tokens = [nodeName.toLowerCase(), ...extractTokens(nodeName)];
  const seen = /* @__PURE__ */ new Set();
  const matched = [];
  for (const r of recipes) {
    if (seen.has(r.canonical_id)) continue;
    const hay = `${r.canonical_id} ${r.display_name ?? ""} ${r.description ?? ""}`.toLowerCase();
    if (tokens.some((t) => hay.includes(t))) {
      seen.add(r.canonical_id);
      matched.push(r.canonical_id);
    }
  }
  return matched.slice(0, 3);
}
async function legacyPerNodeLookup(registryBase, componentId, nodeName, role, env, recipes) {
  const q = await fetchComponent(registryBase, componentId);
  if (!q.ok) return { info: { status: "unknown", componentId, type: role }, missing: false };
  if (q.entry) {
    return {
      info: {
        status: "found",
        componentId,
        type: role,
        source: "component",
        input_schema: q.entry.input_schema,
        success_rate: q.entry.success_rate,
        stability: q.entry.stability,
        branch_hint: branchHintFor(componentId)
      },
      missing: false
    };
  }
  const recipe = recipes.find((r) => r.canonical_id === componentId) ?? (env?.RECIPES ? await resolveRecipe(componentId, env.RECIPES) : null);
  if (recipe) {
    return {
      info: {
        status: "found",
        componentId: recipe.canonical_id,
        type: role,
        source: "recipe",
        description: recipe.description,
        endpoint: recipe.endpoint,
        payload_hint: buildPayloadHint(recipe)
      },
      missing: false
    };
  }
  const similarComponents = await searchSimilarComponents(registryBase, nodeName);
  const similarRecipes = similarFromRecipes(recipes, nodeName);
  return {
    info: {
      status: "not_found",
      componentId,
      type: role,
      suggestion: buildSuggestion(componentId),
      ...similarComponents.length > 0 ? { similar_components: similarComponents } : {},
      ...similarRecipes.length > 0 ? { similar_recipes: similarRecipes } : {}
    },
    missing: true
  };
}
function trySubstitution(nodeName, catalogEntries, recipes) {
  const lower = nodeName.toLowerCase();
  const serviceHits = SERVICE_HINTS.filter((w) => lower.includes(w));
  if (serviceHits.length > 0) {
    const matched = /* @__PURE__ */ new Map();
    for (const r of recipes) {
      const hay = `${r.canonical_id} ${r.display_name ?? ""} ${r.description ?? ""}`.toLowerCase();
      if (serviceHits.every((h) => hay.includes(h))) matched.set(r.canonical_id, r);
    }
    if (matched.size !== 1) return null;
    const recipe = [...matched.values()][0];
    return {
      status: "resolved",
      componentId: recipe.canonical_id,
      source: "recipe",
      description: recipe.description,
      endpoint: recipe.endpoint,
      substitution: {
        from: nodeName,
        componentId: "http_request",
        // recipe＝http_request＋參數模板的具名封裝
        recipe: recipe.canonical_id,
        reason: `\u670D\u52D9\u8A5E\u300C${serviceHits.join("\u3001")}\u300D\u552F\u4E00\u547D\u4E2D recipe\u300C${recipe.canonical_id}\u300D\uFF1Bworkflow config \u5BEB component: ${recipe.canonical_id}\uFF08\u5E95\u5C64\u96F6\u4EF6\uFF1Dhttp_request\uFF09\uFF0C\u53EA\u9700\u586B payload`
      }
    };
  }
  const tokens = extractTokens(nodeName);
  if (tokens.length === 0) return null;
  const byCanonical = /* @__PURE__ */ new Map();
  for (const e of catalogEntries) {
    const strongHay = [e.canonical_id, e.display_name ?? "", ...e.aliases ?? []].join(" ").toLowerCase();
    const weakHay = [e.description ?? "", ...e.tags ?? []].join(" ").toLowerCase();
    const strongHits = tokens.filter((t) => strongHay.includes(t));
    const weakCount = tokens.filter((t) => weakHay.includes(t)).length;
    const score = strongHits.length * 10 + weakCount;
    if (score === 0) continue;
    const prev = byCanonical.get(e.canonical_id);
    if (!prev || score > prev.score) byCanonical.set(e.canonical_id, { entry: e, score, strongHits });
  }
  const ranked = [...byCanonical.values()].sort((a, b) => b.score - a.score);
  const top = ranked[0];
  if (!top || top.strongHits.length === 0) return null;
  if (ranked[1] && ranked[1].score >= top.score) return null;
  return {
    status: "resolved",
    componentId: top.entry.canonical_id,
    source: "component",
    input_schema: top.entry.input_schema,
    success_rate: typeof top.entry.success_rate === "number" ? top.entry.success_rate : void 0,
    stability: typeof top.entry.stability === "string" ? top.entry.stability : void 0,
    // 替換成分岔零件時（例「判斷有沒有新資料」→ if_control）一併附分支用法，
    // 否則 AI 換到零件卻不知道怎麼接兩條路，仍會退回寫 code。
    branch_hint: branchHintFor(top.entry.canonical_id),
    substitution: {
      from: nodeName,
      componentId: top.entry.canonical_id,
      reason: `\u65B7\u8A5E\u300C${top.strongHits.join("\u3001")}\u300D\u547D\u4E2D\u96F6\u4EF6\u300C${top.entry.canonical_id}\u300D\uFF08${top.entry.display_name ?? ""}\uFF09\u5F37\u6B04\u4F4D\u4E14\u5206\u6578\u552F\u4E00\u6700\u9AD8\uFF1B\u53EA\u9700\u7167 input_schema \u586B payload`
    }
  };
}
var SERVICE_HINTS = [
  "google",
  "gmail",
  "sheets",
  "slides",
  "gdocs",
  "drive",
  "calendar",
  "youtube",
  "slack",
  "telegram",
  "discord",
  "line",
  "whatsapp",
  "twilio",
  "notion",
  "airtable",
  "trello",
  "jira",
  "asana",
  "linear",
  "github",
  "gitea",
  "gitlab",
  "bitbucket",
  "stripe",
  "paypal",
  "shopify",
  "hubspot",
  "salesforce",
  "openai",
  "anthropic",
  "claude",
  "gemini",
  "groq",
  "twitter",
  "facebook",
  "instagram",
  "linkedin",
  "dropbox",
  "zoom",
  "sendgrid",
  "mailgun",
  "kbdb"
];
var COMPUTE_HINTS = [
  "encrypt",
  "decrypt",
  "cipher",
  "aes",
  "rsa",
  "sha",
  "md5",
  "hmac",
  "hash",
  "sign",
  "verify",
  "encode",
  "decode",
  "base64",
  "hex",
  "compress",
  "decompress",
  "zip",
  "gzip",
  "uuid",
  "random",
  "regex",
  "math",
  "calc",
  "sort",
  "dedup",
  "diff",
  "template",
  "render",
  "convert",
  "transform",
  "parse",
  "format",
  "csv",
  "xml"
];
function buildSuggestion(componentId) {
  const lower = componentId.toLowerCase();
  const serviceHit = SERVICE_HINTS.find((w) => lower.includes(w));
  const computeHit = COMPUTE_HINTS.find((w) => lower.includes(w));
  if (serviceHit) {
    return `\u5169\u5EAB\u90FD\u67E5\u904E\uFF0C\u96F6\u4EF6 registry \u8207 recipe \u5EAB\u7686\u7121\u300C${componentId}\u300D\u3002\u540D\u5B57\u542B\u670D\u52D9\u8A5E\u300C${serviceHit}\u300D\uFF1D\u5916\u90E8 API \u6A23\u8C8C \u2192 \u6C92\u6709\u6B64 recipe\uFF0C\u53EF\u81EA\u5DF1\u5BEB\uFF1A\u5BEB\u6CD5\u770B skill\u300Cwrite_recipe\u300D\uFF08arcrun_get_skill('write_recipe')\uFF09\uFF0C\u5BEB\u597D\u7528 acr recipe push \u6216 POST /recipes \u88DD\u4E0A\u5373\u53EF\u7528\uFF0C\u4E0D\u7528\u6539\u5E73\u53F0\u3002`;
  }
  if (computeHit) {
    return `\u5169\u5EAB\u90FD\u67E5\u904E\uFF0C\u96F6\u4EF6 registry \u8207 recipe \u5EAB\u7686\u7121\u300C${componentId}\u300D\u3002\u540D\u5B57\u542B\u8A08\u7B97\u8A5E\u300C${computeHit}\u300D\uFF1D\u8A08\u7B97\u539F\u8A9E\u6A23\u8C8C \u2192 \u6C92\u6709\u6B64\u96F6\u4EF6\uFF0C\u53EF\u6295\u7A3F PR \u65B0\u589E WASM component\uFF1A\u505A\u6CD5\u770B skill\u300Cadd_new_wasm_component\u300D\uFF08arcrun_get_skill('add_new_wasm_component')\uFF09\u3002`;
  }
  return `\u5169\u5EAB\u90FD\u67E5\u904E\uFF0C\u96F6\u4EF6 registry \u8207 recipe \u5EAB\u7686\u7121\u300C${componentId}\u300D\uFF0C\u4E14\u540D\u5B57\u5224\u4E0D\u51FA\u578B\u3002\u7F3A\u5916\u90E8 API \u2192 \u81EA\u5DF1\u5BEB recipe\uFF08skill\u300Cwrite_recipe\u300D\uFF09\uFF1B\u7F3A\u8A08\u7B97\u80FD\u529B \u2192 \u6295\u7A3F\u96F6\u4EF6 PR\uFF08skill\u300Cadd_new_wasm_component\u300D\uFF0Ccomponent \u9032 WASM \u6C99\u7BB1\uFF09\u3002`;
}
function buildPayloadHint(recipe) {
  const parts = [];
  if (recipe.body_template) {
    parts.push("payload \u5DF2\u6536\u5728 recipe \u7684 body_template \u88E1\uFF0C\u4F60\u53EA\u8981\u628A {{\u8B8A\u6578}} \u5C0D\u61C9\u7684\u503C\u653E\u9032\u7BC0\u9EDE context");
  } else if (recipe.body) {
    parts.push("payload \u5F62\u72C0\u898B body \u6B04\u4F4D\uFF08{{\u8B8A\u6578}} \u7531\u7BC0\u9EDE context \u586B\uFF09");
  } else {
    parts.push("\u672A\u5B9A\u7FA9 body_template\uFF1A\u7BC0\u9EDE context \u6703\u6574\u5305\u7576 body \u9001\u51FA\uFF08_ \u958B\u982D\u7684\u5167\u90E8\u6B04\u4F4D\u6703\u88AB\u5254\u9664\uFF09");
  }
  if (recipe.response_map) {
    parts.push("\u56DE\u61C9\u5DF2\u6B63\u898F\u5316\uFF1A\u57F7\u884C\u7D50\u679C\u9664\u4E86\u539F\u59CB data\uFF0C\u53E6\u9644 text\uFF08\u53D6\u503C\u8DEF\u5F91\u7B49\u898F\u5247\u5BEB\u5728 recipe \u88E1\uFF0C\u63DB\u6E90\u4E0D\u5FC5\u6539 workflow\uFF09");
  } else {
    parts.push("\u672A\u5B9A\u7FA9 response_map\uFF1A\u56DE\u61C9\u539F\u6A23\u653E\u5728 data\uFF0C\u53D6\u503C\u8981\u81EA\u5DF1\u6307\u8DEF\u5F91");
  }
  if (recipe.auth === "binding") {
    parts.push(`\u8A8D\u8B49\uFF1Dbinding\uFF08\u514D\u91D1\u9470\uFF0C\u7528\u5E73\u53F0\u5167\u5EFA ${recipe.binding_name ?? "AI"}\uFF09`);
  } else if (recipe.auth_service) {
    parts.push(`\u8A8D\u8B49\u8D70 auth recipe\u300C${recipe.auth_service}\u300D\uFF08\u91D1\u9470\u7531\u7CFB\u7D71\u5728\u57F7\u884C\u524D\u6CE8\u5165\uFF0C\u4F60\u4E0D\u5FC5\u4E5F\u4E0D\u8A72\u586B\uFF09`);
  }
  return {
    body_template: recipe.body_template,
    response_map: recipe.response_map,
    usage: parts.join("\uFF1B") + "\u3002"
  };
}
async function fetchComponent(registryBase, id) {
  try {
    const res = await fetch(`${registryBase}/components/${encodeURIComponent(id)}`, {
      signal: AbortSignal.timeout(5e3)
    });
    if (res.status === 404) return { ok: true };
    if (!res.ok) return { ok: false };
    const body = await res.json();
    if (body.success === false) return { ok: true };
    const d = body.data ?? body;
    return {
      ok: true,
      entry: {
        input_schema: d.input_schema,
        success_rate: typeof d.success_rate === "number" ? d.success_rate : void 0,
        stability: typeof d.stability === "string" ? d.stability : void 0
      }
    };
  } catch {
    return { ok: false };
  }
}
function extractTokens(name) {
  const tokens = [];
  const ascii = name.toLowerCase().match(/[a-z0-9]{3,}/g) ?? [];
  tokens.push(...ascii);
  const cjkRuns = name.match(/[一-鿿]+/g) ?? [];
  for (const run2 of cjkRuns) {
    for (let i = 0; i + 2 <= run2.length; i++) tokens.push(run2.slice(i, i + 2));
  }
  return [...new Set(tokens)].slice(0, 8);
}
async function searchRegistryIds(registryBase, q) {
  try {
    const res = await fetch(`${registryBase}/components/search?q=${encodeURIComponent(q)}`, {
      signal: AbortSignal.timeout(5e3)
    });
    if (!res.ok) return [];
    const body = await res.json();
    return (body.data?.results ?? []).map((r) => r.canonical_id).filter((s) => !!s);
  } catch {
    return [];
  }
}
async function searchSimilarComponents(registryBase, nodeName) {
  const direct = await searchRegistryIds(registryBase, nodeName);
  if (direct.length > 0) return direct.slice(0, 3);
  const tokens = extractTokens(nodeName);
  if (tokens.length === 0) return [];
  const hits = await Promise.all(tokens.map((t) => searchRegistryIds(registryBase, t)));
  const count = /* @__PURE__ */ new Map();
  for (const ids of hits) {
    for (const id of ids) count.set(id, (count.get(id) ?? 0) + 1);
  }
  return [...count.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([id]) => id);
}

// cypher-executor/src/actions/graph-builder.ts
function buildExecutionGraph(parsed, nodeResults, graphId, graphName, config) {
  const nodes = [...parsed.nodeNames].map((name) => {
    const nr = nodeResults[name];
    const id = name.toLowerCase().replace(/\s+/g, "-");
    const nodeConfig = config?.[name] ?? {};
    const componentId = nodeConfig.component ?? nr.componentId;
    const { component: _component, ...staticParams } = nodeConfig;
    const data = Object.keys(staticParams).length > 0 ? staticParams : void 0;
    return { id, type: nr.type, componentId, label: name, data };
  });
  const edges = parsed.edges.map((e) => {
    let iterator;
    let label = e.label;
    const foreachMatch = label.match(/^(?:對每個|FOREACH)\s+(\w+)$/i);
    if (foreachMatch) {
      iterator = foreachMatch[1];
      label = "\u5C0D\u6BCF\u500B";
    }
    let branch;
    const branchMatch = label.match(/^(?:ON_BRANCH|分支)\s*[（(]\s*([\w-]+)\s*[）)]$/i);
    if (branchMatch) {
      branch = branchMatch[1];
      label = "ON_BRANCH";
    }
    const edge = {
      from: e.from.toLowerCase().replace(/\s+/g, "-"),
      to: e.to.toLowerCase().replace(/\s+/g, "-"),
      type: toEdgeType(label)
    };
    if (iterator) edge.iterator = iterator;
    if (branch) edge.branch = branch;
    return edge;
  });
  return { id: graphId, name: graphName, nodes, edges };
}

// cypher-executor/src/actions/cypher-handlers.ts
init_run_scratch();
async function handleCypherSearch(triplets, env, mode = "discover", target) {
  const parsed = parseTriplets(triplets);
  if (!parsed) {
    throw new Error("\u7121\u6CD5\u89E3\u6790\u4EFB\u4F55\u7BC0\u9EDE");
  }
  const { nodeResults, missingNodes } = await searchNodes(parsed, void 0, env, mode, target);
  const graph = buildExecutionGraph(parsed, nodeResults, "cypher-search-result", "Cypher Search Result");
  return { nodes: nodeResults, cypher: { nodes: graph.nodes, edges: graph.edges }, missing: missingNodes };
}
async function compileCypherBinding(flow, config, graphId, graphName, env) {
  const parsed = parseTriplets(flow);
  if (!parsed) {
    throw new Error("\u7121\u6CD5\u89E3\u6790\u4EFB\u4F55\u7BC0\u9EDE\uFF08flow \u4E09\u5143\u7D44\u683C\u5F0F\u932F\u8AA4\uFF09");
  }
  const { nodeResults } = await searchNodes(parsed, config, env, "compile");
  return buildExecutionGraph(parsed, nodeResults, graphId, graphName, config);
}
async function handleCypherExecute(triplets, context, graphId, graphName, config, env, waitUntil, apiKey) {
  const parsed = parseTriplets(triplets);
  if (!parsed) {
    throw new Error("\u7121\u6CD5\u89E3\u6790\u4EFB\u4F55\u7BC0\u9EDE");
  }
  const { nodeResults } = await searchNodes(parsed, config, env, "compile");
  const graph = buildExecutionGraph(parsed, nodeResults, graphId, graphName, config);
  const parseResult = graphSchema.safeParse(graph);
  if (!parseResult.success) {
    throw new Error("\u5716\u5B9A\u7FA9\u7522\u751F\u5931\u6557");
  }
  const loader = createComponentLoader(env);
  const executor = new GraphExecutor(loader, void 0, env, apiKey);
  const start = Date.now();
  try {
    const result = await executor.execute(parseResult.data, context ?? {}, createRunScratch());
    const duration_ms = Date.now() - start;
    waitUntil(recordComponentStats(env, graph.nodes, result.trace));
    const verdict = deriveExecutionVerdict(parseResult.data, result.trace);
    if (!verdict.success) {
      return {
        success: false,
        error: verdict.error,
        data: result.data,
        trace: result.trace,
        duration_ms,
        graph
      };
    }
    return { success: true, data: result.data, trace: result.trace, duration_ms, graph };
  } catch (err) {
    const duration_ms = Date.now() - start;
    if (err instanceof WorkflowPaused) {
      return {
        success: true,
        paused: true,
        task_id: err.task_id,
        run_id: err.run_id,
        paused_node_id: err.paused_node_id,
        trace: err.trace_so_far,
        duration_ms,
        graph
      };
    }
    const errMsg = err instanceof Error ? err.message : String(err);
    if (err instanceof ExecutionError) {
      waitUntil(recordComponentStats(env, graph.nodes, err.trace));
      const traceFormatted = err.trace.map((s) => ({
        node: s.nodeId,
        status: s.error ? "failed" : "success",
        ...s.error ? { error: s.error } : {}
      }));
      throw new Error(JSON.stringify({
        success: false,
        error: errMsg,
        failed_node: err.failed_node,
        failed_input: err.failed_input,
        trace: traceFormatted,
        duration_ms
      }));
    }
    throw err;
  }
}

// cypher-executor/src/actions/target-search.ts
init_endpoints();

// cypher-executor/src/lib/workflow-search.ts
init_endpoints();
async function fetchTenantWorkflowSearch(env, apiKey, q, mode = "semantic") {
  const base = kbdbBaseUrl(env);
  const headers = { "Content-Type": "application/json" };
  if (env.KBDB_INTERNAL_TOKEN) headers["Authorization"] = `Bearer ${env.KBDB_INTERNAL_TOKEN}`;
  const params = new URLSearchParams({
    q,
    owner_id: apiKey,
    // 租戶隔離（只搜本租戶的 workflow）
    entry_type: "workflow",
    // base 通用 filter（Q4），只回 workflow entry
    mode
  });
  return fetch(`${base}/entries/search?${params.toString()}`, { headers });
}

// cypher-executor/src/actions/target-search.ts
async function searchByTarget(target, query, env, apiKey) {
  if (target === "component") {
    const registryBase = registryBaseUrl(env);
    if (!registryBase) return { ok: false, status: 502, error: "registry \u4F4D\u7F6E\u672A\u8A2D\u5B9A\uFF08REGISTRY_BASE_URL\uFF0FCOMPONENT_URL_TEMPLATE\uFF0FWORKER_SUBDOMAIN \u7686\u7F3A\uFF09" };
    try {
      const res2 = await fetch(
        `${registryBase}/components/search?q=${encodeURIComponent(query)}`,
        { signal: AbortSignal.timeout(1e4) }
      );
      if (!res2.ok) return { ok: false, status: 502, error: `registry \u641C\u5C0B\u5931\u6557\uFF08HTTP ${res2.status}\uFF09` };
      const body2 = await res2.json();
      const results = (body2.data?.results ?? []).map((r) => {
        if (!r || typeof r !== "object") return r;
        const rec = r;
        const hint = branchHintFor(typeof rec.canonical_id === "string" ? rec.canonical_id : void 0);
        return hint ? { ...rec, branch_hint: hint } : rec;
      });
      return {
        ok: true,
        body: {
          target,
          query,
          results,
          count: body2.data?.count ?? 0
        }
      };
    } catch (e) {
      return { ok: false, status: 502, error: `registry \u67E5\u4E0D\u901A\uFF1A${e instanceof Error ? e.message : String(e)}` };
    }
  }
  if (target === "recipe") {
    if (!env.RECIPES) return { ok: false, status: 502, error: "RECIPES KV \u672A\u7D81\u5B9A" };
    const all = await listAllRecipes2(env.RECIPES);
    const q = query.toLowerCase();
    const seen = /* @__PURE__ */ new Set();
    const results = [];
    for (const r of all) {
      if (seen.has(r.canonical_id)) continue;
      const hay = `${r.canonical_id} ${r.display_name ?? ""} ${r.description ?? ""}`.toLowerCase();
      if (!hay.includes(q)) continue;
      seen.add(r.canonical_id);
      results.push({
        canonical_id: r.canonical_id,
        display_name: r.display_name,
        description: r.description,
        endpoint: r.endpoint,
        // 3.12：逐顆查 recipe 時也要說得出「payload 怎麼填、回應怎麼取值」
        payload_hint: buildPayloadHint(r)
      });
    }
    return {
      ok: true,
      body: {
        target,
        query,
        results,
        count: results.length,
        note: "\u641C\u7684\u662F\u672C\u90E8\u7F72\u79C1\u5EAB\uFF08workflow \u53EF\u76F4\u63A5 component: <canonical_id> \u5F15\u7528\uFF09\u3002\u516C\u5EAB\uFF08\u591A\u4F5C\u8005\u5E02\u5834\uFF09\u8D70 MCP arcrun_recipe_search\uFF0FGET /public-recipes\u3002"
      }
    };
  }
  if (!apiKey) return { ok: false, status: 401, error: "target=workflow \u9700\u8981 X-Arcrun-API-Key header\uFF08workflow \u641C\u5C0B\u9650\u672C\u79DF\u6236\uFF09" };
  const res = await fetchTenantWorkflowSearch(env, apiKey, query);
  if (!res.ok) return { ok: false, status: 502, error: `workflow \u641C\u5C0B\u5931\u6557\uFF08KBDB HTTP ${res.status}\uFF09` };
  const body = await res.json();
  return { ok: true, body: { target, query, ...body } };
}

// cypher-executor/src/routes/cypher.ts
var cypherRouter = new Hono2();
var VALID_TARGETS = /* @__PURE__ */ new Set(["component", "recipe", "workflow"]);
cypherRouter.post("/cypher/search", async (c) => {
  const body = await c.req.json();
  const rawTriplets = body?.triplets;
  const target = typeof body?.target === "string" ? body.target : void 0;
  if (target !== void 0 && !VALID_TARGETS.has(target)) {
    return c.json({ error: `target \u53EA\u63A5\u53D7 component\uFF0Frecipe\uFF0Fworkflow\uFF0C\u6536\u5230\u300C${target}\u300D` }, 400);
  }
  const query = typeof body?.query === "string" ? body.query.trim() : "";
  if (query) {
    if (!target) {
      return c.json({ error: "\u7D66 query \u5FC5\u9808\u540C\u6642\u7D66 target\uFF08component\uFF0Frecipe\uFF0Fworkflow\uFF09\uFF0C\u6307\u660E\u8981\u641C\u54EA\u500B\u5EAB" }, 400);
    }
    const apiKey = c.req.header("X-Arcrun-API-Key") ?? void 0;
    const r = await searchByTarget(target, query, c.env, apiKey);
    if (!r.ok) return c.json({ error: r.error }, r.status);
    return c.json(r.body);
  }
  if (!Array.isArray(rawTriplets) || rawTriplets.length === 0) {
    return c.json({ error: "triplets \u5FC5\u9808\u70BA\u975E\u7A7A\u5B57\u4E32\u9663\u5217\uFF08\u6216\u7D66 query + target \u505A\u540D\u5B57\u641C\u5C0B\uFF09" }, 400);
  }
  const mode = body?.mode === "compile" ? "compile" : "discover";
  if (target && mode === "compile") {
    return c.json({ error: "mode=compile\uFF08\u8907\u88FD\u8DEF\u5F91\uFF09\u4E0D\u67E5\u5EAB\uFF0C\u4E0D\u63A5\u53D7 target\uFF1B\u8981\u6307\u5B9A\u641C\u5C0B\u5C0D\u8C61\u8ACB\u7528 discover\uFF08\u9810\u8A2D\uFF09" }, 400);
  }
  if (target === "workflow") {
    return c.json({ error: 'target=workflow \u662F\u540D\u5B57\u641C\u5C0B\uFF0C\u8ACB\u6539\u5E36 { target: "workflow", query: "..." }\uFF08\u4E0D\u5403 triplets\uFF09' }, 400);
  }
  try {
    const now2 = /* @__PURE__ */ new Date();
    const timestamp = now2.toISOString();
    const versionId = `search-v1-${now2.getFullYear()}${String(now2.getMonth() + 1).padStart(2, "0")}${String(now2.getDate()).padStart(2, "0")}-${String(now2.getHours()).padStart(2, "0")}${String(now2.getMinutes()).padStart(2, "0")}${String(now2.getSeconds()).padStart(2, "0")}`;
    const result = await handleCypherSearch(rawTriplets, c.env, mode, target);
    const response = {
      version: versionId,
      timestamp,
      triplets: rawTriplets,
      nodes: result.nodes,
      cypher: result.cypher,
      missing: result.missing
    };
    return c.json(response);
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err);
    return c.json({ error: errMsg }, 400);
  }
});
cypherRouter.post("/cypher/execute", async (c) => {
  const body = await c.req.json();
  if (!Array.isArray(body?.triplets) || body.triplets.length === 0) {
    return c.json({ error: "triplets \u5FC5\u9808\u70BA\u975E\u7A7A\u5B57\u4E32\u9663\u5217" }, 400);
  }
  const graphId = typeof body.graph_id === "string" ? body.graph_id : `triplet-exec-${Date.now()}`;
  const graphName = typeof body.graph_name === "string" ? body.graph_name : "Triplet Execution";
  const now2 = /* @__PURE__ */ new Date();
  const timestamp = now2.toISOString();
  const versionId = `execute-v1-${now2.getFullYear()}${String(now2.getMonth() + 1).padStart(2, "0")}${String(now2.getDate()).padStart(2, "0")}-${String(now2.getHours()).padStart(2, "0")}${String(now2.getMinutes()).padStart(2, "0")}${String(now2.getSeconds()).padStart(2, "0")}`;
  const apiKey = c.req.header("X-Arcrun-API-Key") ?? void 0;
  try {
    const result = await handleCypherExecute(
      body.triplets,
      body.context,
      graphId,
      graphName,
      body.config,
      c.env,
      (p) => c.executionCtx.waitUntil(p),
      apiKey
    );
    const response = {
      version: versionId,
      timestamp,
      ...result
    };
    return c.json(response);
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err);
    try {
      const parsed = JSON.parse(errMsg);
      const response = {
        version: versionId,
        timestamp,
        ...parsed
      };
      return c.json(response, 500);
    } catch {
      return c.json({ version: versionId, timestamp, success: false, error: errMsg, duration_ms: 0 }, 500);
    }
  }
});

// cypher-executor/src/routes/validate.ts
init_dist();
init_schemas();
init_telemetry();
var validateRouter = new Hono2();
validateRouter.post("/validate", async (c) => {
  const start = Date.now();
  const apiKey = c.req.header("X-Arcrun-API-Key");
  const userAgent = c.req.header("User-Agent") ?? void 0;
  const body = await c.req.json();
  const parsed = graphSchema.safeParse(body);
  if (!parsed.success) {
    recordTelemetry(c.env, apiKey, {
      event_type: "validation_error",
      error_code: "schema_failed",
      duration_ms: Date.now() - start,
      agent_user_agent: userAgent
    }, c.executionCtx);
    return c.json({ valid: false, errors: parsed.error.issues }, 400);
  }
  const nodeIds = new Set(parsed.data.nodes.map((n) => n.id));
  const invalidEdges = parsed.data.edges.filter((e) => !nodeIds.has(e.from) || !nodeIds.has(e.to));
  if (invalidEdges.length > 0) {
    recordTelemetry(c.env, apiKey, {
      event_type: "validation_error",
      error_code: "edge_node_missing",
      duration_ms: Date.now() - start,
      agent_user_agent: userAgent
    }, c.executionCtx);
    return c.json({
      valid: false,
      errors: invalidEdges.map((e) => `\u908A ${e.from} \u2192 ${e.to} \u6307\u5411\u4E0D\u5B58\u5728\u7684\u7BC0\u9EDE`)
    }, 400);
  }
  return c.json({ valid: true, nodeCount: parsed.data.nodes.length, edgeCount: parsed.data.edges.length });
});

// cypher-executor/src/routes/docs.ts
init_dist();

// cypher-executor/src/lib/openapi.ts
var OPENAPI_SPEC = {
  openapi: "3.0.3",
  info: {
    title: "arcrun cypher-executor API",
    description: "AI Workflow Execution Engine \u2014 \u900F\u904E\u4E09\u5143\u7D44 Triplet \u6216\u5716 Graph \u5B9A\u7FA9\u5DE5\u4F5C\u6D41\uFF0C\u7CFB\u7D71\u57F7\u884C\u4E26\u56DE\u50B3\u7D50\u679C",
    version: "1.0.0",
    contact: {
      name: "arcrun",
      url: "https://github.com/arcrun/arcrun"
    }
  },
  servers: [
    { url: "https://cypher.arcrun.dev", description: "arcrun.dev Hosted" },
    { url: "http://localhost:8787", description: "Local Development" }
  ],
  paths: {
    "/": {
      get: {
        summary: "Health Check",
        tags: ["Health"],
        responses: {
          "200": {
            description: "Service is running",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    service: { type: "string" },
                    version: { type: "string" },
                    status: { type: "string" }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/cypher/search": {
      post: {
        summary: "\u641C\u5C0B\u5DE5\u4F5C\u6D41\u9700\u8981\u7684\u96F6\u4EF6",
        tags: ["Cypher"],
        description: "\u7528\u4E09\u5143\u7D44\u63CF\u8FF0\u5DE5\u4F5C\u6D41\uFF0C\u7CFB\u7D71\u89E3\u6790\u4E26\u5F9E Registry \u67E5\u8A62\u5C0D\u61C9\u96F6\u4EF6",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  triplets: {
                    type: "array",
                    items: { type: "string" },
                    example: ["start >> \u5B8C\u6210\u5F8C >> get-data", "get-data >> \u5B8C\u6210\u5F8C >> done"],
                    description: '\u4E09\u5143\u7D44\u9663\u5217\uFF0C\u683C\u5F0F\uFF1A"FROM >> ACTION >> TO"'
                  },
                  auto_publish: {
                    type: "boolean",
                    default: true,
                    description: "\u7F3A\u5931\u7684\u96F6\u4EF6\u662F\u5426\u81EA\u52D5\u7522\u751F\u767C\u4F48"
                  }
                },
                required: ["triplets"]
              }
            }
          }
        },
        responses: {
          "200": {
            description: "\u96F6\u4EF6\u641C\u5C0B\u6210\u529F\uFF08\u542B\u7248\u672C\u865F\u548C\u6642\u6233\uFF0C\u9069\u5408 Markdown \u6587\u6A94\u8FFD\u8E64\uFF09",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    version: { type: "string", example: "search-v1-20260327-143022", description: "\u7248\u672C\u865F\uFF08endpoint-v{major}-{timestamp}\uFF09" },
                    timestamp: { type: "string", format: "date-time", description: "ISO 8601 \u6642\u6233" },
                    triplets: { type: "array", items: { type: "string" }, description: "\u56DE\u9001\u7684\u4E09\u5143\u7D44\u5217\u8868" },
                    nodes: { type: "object", description: "\u641C\u5C0B\u5230\u7684\u96F6\u4EF6\u53CA\u5176\u72C0\u614B" },
                    cypher: { type: "object", description: "\u5DE5\u4F5C\u6D41\u5716\uFF08null \u82E5\u6709\u7F3A\u5931\u96F6\u4EF6\uFF09" },
                    missing: { type: "array", items: { type: "string" }, description: "\u7F3A\u5931\u96F6\u4EF6\u5217\u8868" },
                    auto_published: { type: "object", description: "\u81EA\u52D5\u767C\u4F48\u7684\u96F6\u4EF6\uFF08\u82E5 auto_publish=true\uFF09" }
                  }
                }
              }
            }
          },
          "400": { description: "\u7121\u6CD5\u89E3\u6790\u4E09\u5143\u7D44" }
        }
      }
    },
    "/cypher/execute": {
      post: {
        summary: "\u57F7\u884C\u5DE5\u4F5C\u6D41",
        tags: ["Cypher"],
        description: "\u76F4\u63A5\u57F7\u884C triplets\uFF0C\u56DE\u50B3\u5B8C\u6574\u57F7\u884C\u7D50\u679C\u3002\u652F\u63F4\u81EA\u52D5\u767C\u4F48\u7F3A\u5931\u96F6\u4EF6\u3002",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  triplets: {
                    type: "array",
                    items: { type: "string" },
                    description: '\u4E09\u5143\u7D44\u9663\u5217\uFF0C\u683C\u5F0F\uFF1A"FROM >> ACTION >> TO"'
                  },
                  context: {
                    type: "object",
                    description: "\u57F7\u884C\u4E0A\u4E0B\u6587\uFF0C\u50B3\u5165\u5404\u7BC0\u9EDE\u4F5C\u70BA\u521D\u59CB\u53C3\u6578"
                  },
                  auto_publish: {
                    type: "boolean",
                    default: true,
                    description: "\u7F3A\u5931\u7684\u96F6\u4EF6\u662F\u5426\u81EA\u52D5\u7522\u751F\u81E8\u6642\u5BE6\u4F5C"
                  }
                },
                required: ["triplets"]
              }
            }
          }
        },
        responses: {
          "200": {
            description: "\u57F7\u884C\u6210\u529F\uFF08\u542B\u7248\u672C\u865F\u548C\u6642\u6233\uFF09",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    version: { type: "string", example: "execute-v1-20260327-143022", description: "\u7248\u672C\u865F\uFF08endpoint-v{major}-{timestamp}\uFF09" },
                    timestamp: { type: "string", format: "date-time", description: "ISO 8601 \u6642\u6233" },
                    success: { type: "boolean", enum: [true] },
                    data: { type: "object", description: "\u57F7\u884C\u7D50\u679C" },
                    trace: { type: "array", description: "\u57F7\u884C\u8DDF\u8E64" },
                    duration_ms: { type: "number" }
                  }
                }
              }
            }
          },
          "500": {
            description: "\u57F7\u884C\u5931\u6557\u6216\u90E8\u4EFD\u96F6\u4EF6\u7F3A\u5931\uFF08\u542B\u7248\u672C\u865F\u548C\u6642\u6233\uFF09",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    version: { type: "string", example: "execute-v1-20260327-143022", description: "\u7248\u672C\u865F\uFF08endpoint-v{major}-{timestamp}\uFF09" },
                    timestamp: { type: "string", format: "date-time", description: "ISO 8601 \u6642\u6233" },
                    success: { type: "boolean", enum: [false] },
                    error: { type: "string" },
                    missing: { type: "array", items: { type: "string" }, description: "\u7121\u6CD5\u81EA\u52D5\u767C\u4F48\u7684\u7F3A\u5931\u96F6\u4EF6" },
                    auto_published: {
                      type: "object",
                      description: "\u81EA\u52D5\u767C\u4F48\u7684\u96F6\u4EF6\u8CC7\u8A0A",
                      additionalProperties: {
                        type: "object",
                        properties: {
                          ok: { type: "boolean" },
                          componentId: { type: "string" },
                          temporary_endpoint: { type: "string", format: "uri", description: "\u81E8\u6642\u5BE6\u4F5C\u7684 URL" },
                          implement_by: { type: "string", format: "date-time", description: "\u5BE6\u4F5C\u622A\u6B62\u6642\u9593" }
                        }
                      }
                    },
                    duration_ms: { type: "number" }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/webhooks": {
      post: {
        summary: "\u5EFA\u7ACB Webhook",
        tags: ["Webhooks"],
        description: "\u5C07\u5DE5\u4F5C\u6D41\u8A3B\u518A\u6210 Webhook\uFF0C\u5F97\u5230\u516C\u958B URL",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  triplets: {
                    type: "array",
                    items: { type: "string" }
                  },
                  description: { type: "string" }
                }
              }
            }
          }
        },
        responses: {
          "201": {
            description: "Webhook \u5EFA\u7ACB\u6210\u529F",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    token: { type: "string" },
                    webhook_url: { type: "string", format: "uri" },
                    description: { type: "string" },
                    created_at: { type: "string", format: "date-time" }
                  }
                }
              }
            }
          }
        }
      },
      get: {
        summary: "\u5217\u51FA\u6240\u6709 Webhooks",
        tags: ["Webhooks"],
        parameters: [
          {
            name: "Authorization",
            in: "header",
            required: true,
            schema: { type: "string", example: "Bearer u6u_xxxxx" },
            description: "API Key \u8A8D\u8B49"
          }
        ],
        responses: {
          "200": {
            description: "Webhooks \u5217\u8868",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    webhooks: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          token: { type: "string" },
                          description: { type: "string" },
                          created_at: { type: "string", format: "date-time" }
                        }
                      }
                    },
                    total: { type: "number" }
                  }
                }
              }
            }
          },
          "401": { description: "\u672A\u6388\u6B0A" }
        }
      }
    },
    "/webhooks/{token}": {
      get: {
        summary: "\u67E5\u8A62\u55AE\u500B Webhook",
        tags: ["Webhooks"],
        parameters: [
          {
            name: "token",
            in: "path",
            required: true,
            schema: { type: "string" }
          }
        ],
        responses: {
          "200": {
            description: "Webhook \u8CC7\u8A0A"
          },
          "404": { description: "Webhook \u4E0D\u5B58\u5728" }
        }
      },
      delete: {
        summary: "\u522A\u9664 Webhook",
        tags: ["Webhooks"],
        parameters: [
          {
            name: "token",
            in: "path",
            required: true,
            schema: { type: "string" }
          }
        ],
        responses: {
          "200": { description: "Webhook \u5DF2\u522A\u9664" },
          "404": { description: "Webhook \u4E0D\u5B58\u5728" }
        }
      }
    }
  },
  components: {
    securitySchemes: {
      ApiKeyAuth: {
        type: "apiKey",
        in: "header",
        name: "Authorization"
      }
    }
  }
};

// cypher-executor/src/routes/docs.ts
var docsRouter = new Hono2();
docsRouter.get("/openapi.json", (c) => {
  return c.json(OPENAPI_SPEC);
});
docsRouter.get("/docs", (c) => {
  const specStr = JSON.stringify(OPENAPI_SPEC);
  const htmlStr = `<!doctype html>
<html>
  <head>
    <title>Cypher Executor API Docs</title>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@4/swagger-ui.css">
    <style>html { box-sizing: border-box; overflow: -moz-scrollbars-vertical; overflow-y: scroll; } *, *:before, *:after { box-sizing: inherit; } body { margin:0; padding:0; }</style>
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@4/swagger-ui-bundle.js"> <\/script>
    <script src="https://unpkg.com/swagger-ui-dist@4/swagger-ui-standalone-preset.js"> <\/script>
    <script>
    window.onload = () => {
      window.ui = SwaggerUIBundle({
        spec: ${specStr},
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        plugins: [
          SwaggerUIBundle.plugins.DownloadUrl
        ],
        layout: "BaseLayout"
      })
    }
  <\/script>
  </body>
</html>
  `;
  return c.html(htmlStr);
});

// cypher-executor/src/routes/webhooks.ts
init_dist();
init_webhook_handlers();

// cypher-executor/src/actions/webhook-graph-resolver.ts
init_schemas();
async function resolveWebhookGraph(body, description, env) {
  if (Array.isArray(body.triplets) && body.triplets.length > 0) {
    const parsed = parseTriplets(body.triplets);
    if (!parsed) return { resolvedGraph: {}, error: "\u7121\u6CD5\u89E3\u6790 triplets" };
    const { nodeResults } = await searchNodes(parsed);
    const graphId = `webhook-${Date.now()}`;
    const graphName = description || `Webhook ${(/* @__PURE__ */ new Date()).toISOString()}`;
    const graph = buildExecutionGraph(parsed, nodeResults, graphId, graphName);
    const parseResult = graphSchema.safeParse(graph);
    if (!parseResult.success) {
      return { resolvedGraph: {}, error: "\u5716\u5B9A\u7FA9\u7522\u751F\u5931\u6557" };
    }
    return { resolvedGraph: graph };
  }
  if (body.graph && typeof body.graph === "object") {
    const graphWithDefaults = {
      id: `webhook-${Date.now()}`,
      name: description || `Webhook ${(/* @__PURE__ */ new Date()).toISOString()}`,
      ...body.graph
    };
    const parsed = graphSchema.safeParse(graphWithDefaults);
    if (!parsed.success) {
      return { resolvedGraph: {}, error: "\u5716\u5B9A\u7FA9\u9A57\u8B49\u5931\u6557" };
    }
    return { resolvedGraph: graphWithDefaults };
  }
  if (body.nodes && body.edges) {
    const graphWithDefaults = {
      id: `webhook-${Date.now()}`,
      name: description || `Webhook ${(/* @__PURE__ */ new Date()).toISOString()}`,
      ...body
    };
    const parsed = graphSchema.safeParse(graphWithDefaults);
    if (!parsed.success) {
      return { resolvedGraph: {}, error: "\u5716\u5B9A\u7FA9\u9A57\u8B49\u5931\u6557" };
    }
    return { resolvedGraph: graphWithDefaults };
  }
  return { resolvedGraph: {}, error: "\u9700\u63D0\u4F9B graph \u7269\u4EF6\u6216 triplets \u9663\u5217" };
}

// cypher-executor/src/routes/webhooks.ts
var webhooksRouter = new Hono2();
webhooksRouter.post("/webhooks", async (c) => {
  const body = await c.req.json().catch(() => null);
  if (!body) return c.json({ error: "invalid json" }, 400);
  const description = typeof body.description === "string" ? body.description : "";
  const resolved = await resolveWebhookGraph(body, description, c.env);
  if (resolved.error) {
    return c.json({ error: resolved.error }, 400);
  }
  const token = generateToken();
  const record = {
    graph: resolved.resolvedGraph,
    description,
    created_at: (/* @__PURE__ */ new Date()).toISOString()
  };
  await c.env.WEBHOOKS.put(token, JSON.stringify(record));
  const baseUrl = new URL(c.req.url).origin;
  return c.json({
    token,
    webhook_url: `${baseUrl}/webhooks/${token}/trigger`,
    description: record.description,
    created_at: record.created_at
  }, 201);
});
webhooksRouter.post("/webhooks/:token/trigger", async (c) => {
  const token = c.req.param("token");
  if (!token || token.length < 16) {
    return c.json({ error: "invalid token" }, 400);
  }
  const raw2 = await c.env.WEBHOOKS.get(token, "text");
  if (!raw2) return c.json({ error: "webhook not found" }, 404);
  const record = await validateAndParseWebhook(raw2);
  if (!record) return c.json({ error: "webhook \u5B9A\u7FA9\u640D\u6BC0" }, 500);
  let triggerContext = {};
  try {
    const body = await c.req.json().catch(() => null);
    if (body && typeof body === "object") {
      triggerContext = body;
    }
  } catch {
  }
  const apiKey = c.req.header("X-Arcrun-API-Key") ?? void 0;
  const result = await executeWebhookGraph(c.env, record.graph, triggerContext, token, apiKey);
  const graph = record.graph;
  const workflowId = graph.id ?? token;
  const nodes = Array.isArray(graph.nodes) ? graph.nodes : [];
  c.executionCtx.waitUntil(
    writeExecutionVerdict(c.env, workflowId, nodes, result.success ? "success" : "failed", result.duration_ms, result.error ?? "", triggerContext, apiKey, c.env.__kbdbTally)
  );
  return c.json(result, result.success ? 200 : 500);
});

// cypher-executor/src/routes/webhooks-crud.ts
init_dist();
init_webhook_handlers();
var webhooksCrudRouter = new Hono2();
webhooksCrudRouter.get("/webhooks/:token", async (c) => {
  const token = c.req.param("token");
  const raw2 = await c.env.WEBHOOKS.get(token, "text");
  if (!raw2) return c.json({ error: "not found" }, 404);
  const record = await validateAndParseWebhook(raw2);
  if (!record) return c.json({ error: "\u8CC7\u6599\u640D\u6BC0" }, 500);
  return c.json({
    token,
    description: record.description,
    created_at: record.created_at
  });
});
webhooksCrudRouter.put("/webhooks/:token", async (c) => {
  const token = c.req.param("token");
  if (!token || token.length < 16) {
    return c.json({ error: "invalid token" }, 400);
  }
  const raw2 = await c.env.WEBHOOKS.get(token, "text");
  if (!raw2) return c.json({ error: "webhook not found" }, 404);
  const existing = await validateAndParseWebhook(raw2);
  if (!existing) return c.json({ error: "webhook \u5B9A\u7FA9\u640D\u6BC0" }, 500);
  const body = await c.req.json().catch(() => null);
  if (!body) return c.json({ error: "invalid json" }, 400);
  const updatedRecord = {
    graph: existing.graph,
    description: existing.description,
    created_at: existing.created_at
  };
  if (body.description !== void 0) {
    updatedRecord.description = typeof body.description === "string" ? body.description : existing.description;
  }
  if (body.graph !== void 0) {
    updatedRecord.graph = body.graph;
  }
  await c.env.WEBHOOKS.put(token, JSON.stringify(updatedRecord));
  const baseUrl = new URL(c.req.url).origin;
  return c.json({
    token,
    webhook_url: `${baseUrl}/webhooks/${token}/trigger`,
    description: updatedRecord.description,
    created_at: updatedRecord.created_at,
    updated: true
  });
});
webhooksCrudRouter.delete("/webhooks/:token", async (c) => {
  const token = c.req.param("token");
  if (!token || token.length < 16) {
    return c.json({ error: "invalid token" }, 400);
  }
  const existing = await c.env.WEBHOOKS.get(token, "text");
  if (!existing) return c.json({ error: "webhook not found" }, 404);
  await c.env.WEBHOOKS.delete(token);
  return c.json({ deleted: true, token });
});

// cypher-executor/src/routes/webhooks-list.ts
init_dist();
init_webhook_handlers();
var webhooksListRouter = new Hono2();
webhooksListRouter.get("/webhooks", async (c) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader) {
    return c.json({ error: "unauthorized: missing Authorization header" }, 401);
  }
  const list = await c.env.WEBHOOKS.list();
  const webhooks = [];
  for (const key of list.keys) {
    const raw2 = await c.env.WEBHOOKS.get(key.name, "text");
    if (!raw2) continue;
    const record = await validateAndParseWebhook(raw2);
    if (!record) continue;
    webhooks.push({
      token: key.name,
      description: record.description,
      created_at: record.created_at
    });
  }
  return c.json({ webhooks, total: webhooks.length });
});

// cypher-executor/src/index.ts
init_recipes();
init_credentials();

// cypher-executor/src/routes/webhooks-named.ts
init_dist();
init_webhook_handlers();
init_schemas();
init_telemetry();
init_endpoints();
var webhooksNamedRouter = new Hono2();
function kvKey(apiKey, name) {
  return `${apiKey}:wf:${name}`;
}
async function writeWorkflowSearchEntry(env, apiKey, name, description, workflowId) {
  const base = kbdbBaseUrl(env);
  const headers = { "Content-Type": "application/json" };
  if (env.KBDB_INTERNAL_TOKEN) headers["Authorization"] = `Bearer ${env.KBDB_INTERNAL_TOKEN}`;
  await fetch(`${base}/entries`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      entry_type: "workflow",
      owner_id: apiKey,
      // 租戶隔離（與 kbdb-proxy 同身份）
      page_name: name,
      content: description,
      // 被 embed / LIKE 命中的主體
      // KBDB createEntry 吃 metadata_json（TEXT），embed.ts isEmbeddable 讀 metadata_json.embed === true。
      metadata_json: JSON.stringify({
        embed: true,
        // #7 精耕開關：標 true 才進 Vectorize
        workflow_name: name,
        workflow_id: workflowId ?? name
      })
    })
  });
}
function extractCredentialNames(graph) {
  const found = /* @__PURE__ */ new Set();
  const re = /\{\{\s*credential\.([\w.-]+)\s*\}\}/g;
  let m;
  const text = JSON.stringify(graph) ?? "";
  while ((m = re.exec(text)) !== null) found.add(m[1]);
  return [...found].sort();
}
webhooksNamedRouter.post("/webhooks/named", async (c) => {
  const apiKey = c.req.header("X-Arcrun-API-Key");
  if (!apiKey) {
    return c.json({ error: "\u7F3A\u5C11 X-Arcrun-API-Key header" }, 401);
  }
  const body = await c.req.json().catch(() => null);
  if (!body?.name || !body.graph) {
    return c.json({ error: "\u7F3A\u5C11\u5FC5\u8981\u6B04\u4F4D\uFF1Aname, graph" }, 400);
  }
  if (typeof body.description !== "string" || body.description.trim() === "") {
    return c.json({
      error: "description \u5FC5\u586B\uFF1A\u8ACB\u64CD\u76E4\u7684 AI \u64DA\u5BE6\u5BEB\u4E00\u53E5\u300C\u9019\u5DE5\u4F5C\u6D41\u80FD\u505A\u4EC0\u9EBC\u300D\uFF08\u5982\u300C\u547C\u53EB\u53EF Upsert Google Sheets\u300D\uFF09\uFF0C\u7528\u6236\u53EF\u518D\u6539\u3002\u4F9B\u8A9E\u610F\u641C\u5C0B\u7528\uFF0C\u4E0D\u662F\u5BEB\u6587\u7AE0\u3002",
      requires: "description"
    }, 400);
  }
  const name = body.name.trim();
  if (!/^[\w-]+$/.test(name)) {
    return c.json({ error: "workflow name \u53EA\u80FD\u5305\u542B\u82F1\u6587\u5B57\u6BCD\u3001\u6578\u5B57\u3001\u5E95\u7DDA\u548C\u9023\u5B57\u865F" }, 400);
  }
  let graph = body.graph;
  if (Array.isArray(body.graph.flow) && !Array.isArray(body.graph.nodes)) {
    const rawConfig = body.config ?? body.graph.config;
    try {
      graph = await compileCypherBinding(
        body.graph.flow,
        rawConfig,
        name,
        name,
        c.env
      );
    } catch (e) {
      return c.json({ error: `flow \u7DE8\u8B6F\u5931\u6557\uFF1A${e instanceof Error ? e.message : String(e)}` }, 400);
    }
    const compiled = graphSchema.safeParse(graph);
    if (!compiled.success) {
      return c.json({ error: "\u5716\u5B9A\u7FA9\u7DE8\u8B6F\u5F8C\u4ECD\u7121\u6548\uFF0C\u8ACB\u6AA2\u67E5 flow \u4E09\u5143\u7D44\u8207 config", details: compiled.error.issues }, 400);
    }
  }
  const cronExpr = extractCronExpr(graph);
  const record = {
    name,
    graph,
    config: body.config,
    description: body.description.trim(),
    // R1：已驗非空（見上），存 trim 後的值
    created_at: (/* @__PURE__ */ new Date()).toISOString(),
    cron_expr: cronExpr ?? void 0
  };
  const start = Date.now();
  await c.env.WEBHOOKS.put(kvKey(apiKey, name), JSON.stringify(record));
  await updateCronIndexEntry(c.env.WEBHOOKS, apiKey, name, cronExpr);
  c.executionCtx.waitUntil(
    writeWorkflowSearchEntry(c.env, apiKey, name, record.description).catch(() => {
    })
  );
  recordTelemetry(c.env, apiKey, {
    event_type: "deploy_success",
    workflow_name: name,
    duration_ms: Date.now() - start,
    agent_user_agent: c.req.header("User-Agent") ?? void 0
  }, c.executionCtx);
  const baseUrl = new URL(c.req.url).origin;
  return c.json({
    name,
    webhook_url: `${baseUrl}/webhooks/named/${name}/trigger`,
    description: record.description,
    created_at: record.created_at,
    // Arcrun#292：公開觸發是設計（無需金鑰即可 POST）；帶憑證的工作流據此在 push 輸出明講
    public_trigger: true,
    credentials_used: extractCredentialNames({ graph, config: body.config })
  }, 201);
});
webhooksNamedRouter.get("/workflows/search", async (c) => {
  const apiKey = c.req.header("X-Arcrun-API-Key");
  if (!apiKey) return c.json({ error: "\u7F3A\u5C11 X-Arcrun-API-Key header" }, 401);
  const q = c.req.query("q");
  if (!q) return c.json({ error: "q \u5FC5\u586B\uFF1A\u7528\u81EA\u7136\u8A9E\u8A00\u63CF\u8FF0\u8981\u627E\u7684\u5DE5\u4F5C\u6D41\uFF08\u5982\u300C\u628A\u8CC7\u6599\u5BEB\u9032 Google Sheets\u300D\uFF09" }, 400);
  const mode = c.req.query("mode") === "keyword" ? "keyword" : "semantic";
  const res = await fetchTenantWorkflowSearch(c.env, apiKey, q, mode);
  return new Response(res.body, { status: res.status, headers: { "Content-Type": "application/json" } });
});
webhooksNamedRouter.post("/workflows/backfill-search-entries", async (c) => {
  const apiKey = c.req.header("X-Arcrun-API-Key");
  if (!apiKey) return c.json({ error: "\u7F3A\u5C11 X-Arcrun-API-Key header" }, 401);
  const prefix = `${apiKey}:wf:`;
  const list = await c.env.WEBHOOKS.list({ prefix });
  const backfilled = [];
  const needsDescription = [];
  const errors = [];
  for (const k of list.keys) {
    const name = k.name.slice(prefix.length);
    const raw2 = await c.env.WEBHOOKS.get(k.name, "text");
    if (!raw2) continue;
    const rec = JSON.parse(raw2);
    const desc = rec.description?.trim();
    if (!desc) {
      needsDescription.push(name);
      continue;
    }
    try {
      await writeWorkflowSearchEntry(c.env, apiKey, name, desc);
      backfilled.push(name);
    } catch (e) {
      errors.push(`${name}: ${e instanceof Error ? e.message : String(e)}`);
    }
  }
  return c.json({
    backfilled,
    backfilled_count: backfilled.length,
    needs_description: needsDescription,
    needs_description_count: needsDescription.length,
    errors,
    hint: needsDescription.length > 0 ? `${needsDescription.length} \u500B\u5DE5\u4F5C\u6D41\u7F3A description \u7121\u6CD5\u88AB\u641C\u5C0B\u3002\u8ACB\u64CD\u76E4\u7684 AI re-deploy \u5B83\u5011\u6642\u64DA\u5BE6\u88DC\u4E00\u53E5\u300C\u80FD\u505A\u4EC0\u9EBC\u300D\uFF08\u4E0D\u81EA\u52D5\u7DE8\u9020\uFF09\u3002` : void 0
  });
});
webhooksNamedRouter.post("/webhooks/named/migrate-cron-index", async (c) => {
  const list = await c.env.WEBHOOKS.list({ prefix: "cron-idx:" });
  let migrated = 0, skipped = 0;
  const errors = [];
  for (const k of list.keys) {
    if (k.name === CRON_INDEX_KEY) {
      skipped++;
      continue;
    }
    const parts = k.name.split(":");
    if (parts.length < 3) {
      skipped++;
      continue;
    }
    const apiKey = parts[1];
    const name = parts.slice(2).join(":");
    try {
      const raw2 = await c.env.WEBHOOKS.get(k.name, "text");
      if (!raw2) {
        skipped++;
        continue;
      }
      const idx = JSON.parse(raw2);
      if (!idx.cron_expr) {
        skipped++;
        continue;
      }
      await updateCronIndexEntry(c.env.WEBHOOKS, apiKey, name, idx.cron_expr);
      migrated++;
    } catch (e) {
      errors.push(`${k.name}: ${e instanceof Error ? e.message : String(e)}`);
    }
  }
  return c.json({ success: errors.length === 0, migrated, skipped, errors });
});
webhooksNamedRouter.post("/webhooks/named/:name/trigger", async (c) => {
  const apiKey = c.req.header("X-Arcrun-API-Key");
  if (!apiKey) {
    return c.json({ error: "\u7F3A\u5C11 X-Arcrun-API-Key header" }, 401);
  }
  return triggerNamed(c, apiKey, c.req.param("name"));
});
webhooksNamedRouter.post("/webhooks/named/:ns/:name/trigger", async (c) => {
  return triggerNamed(c, c.req.param("ns"), c.req.param("name"));
});
async function triggerNamed(c, apiKey, name) {
  const raw2 = await c.env.WEBHOOKS.get(kvKey(apiKey, name), "text");
  if (!raw2) {
    return c.json({ error: `\u627E\u4E0D\u5230 workflow "${name}"\uFF0C\u8ACB\u5148\u57F7\u884C acr push` }, 404);
  }
  let record;
  try {
    record = JSON.parse(raw2);
  } catch {
    return c.json({ error: "workflow \u5B9A\u7FA9\u640D\u6BC0" }, 500);
  }
  let triggerContext = {};
  try {
    const body = await c.req.json().catch(() => null);
    if (body && typeof body === "object") {
      triggerContext = body;
    }
  } catch {
  }
  const graph = record.graph;
  const workflowId = graph.id ?? name;
  const nodes = Array.isArray(graph.nodes) ? graph.nodes : [];
  const userAgent = c.req.header("User-Agent") ?? void 0;
  if (c.req.query("async") === "1") {
    c.executionCtx.waitUntil(
      executeWebhookGraph(c.env, record.graph, triggerContext, name, apiKey, c.executionCtx, userAgent).then(
        (result2) => writeExecutionVerdict(c.env, workflowId, nodes, result2.success ? "success" : "failed", result2.duration_ms, result2.error ?? "", triggerContext, apiKey, c.env.__kbdbTally)
      )
    );
    return c.json({ accepted: true }, 202);
  }
  const result = await executeWebhookGraph(
    c.env,
    record.graph,
    triggerContext,
    name,
    apiKey,
    c.executionCtx,
    userAgent
  );
  c.executionCtx.waitUntil(
    writeExecutionVerdict(c.env, workflowId, nodes, result.success ? "success" : "failed", result.duration_ms, result.error ?? "", triggerContext, apiKey, c.env.__kbdbTally)
  );
  return c.json(result, result.success ? 200 : 500);
}
var MAX_QUERY_OUTPUT_BYTES = 5 * 1024 * 1024;
function queryStringContext(c) {
  return { ...c.req.query() };
}
async function bodyContext(c) {
  const body = await c.req.json().catch(() => null);
  return body && typeof body === "object" ? body : {};
}
async function queryNamed(c, apiKey, name, triggerContext) {
  const raw2 = await c.env.WEBHOOKS.get(kvKey(apiKey, name), "text");
  if (!raw2) {
    return c.json({ error: `\u627E\u4E0D\u5230 workflow "${name}"\uFF0C\u8ACB\u5148\u57F7\u884C acr push` }, 404);
  }
  let record;
  try {
    record = JSON.parse(raw2);
  } catch {
    return c.json({ error: "workflow \u5B9A\u7FA9\u640D\u6BC0" }, 500);
  }
  const graph = record.graph;
  const workflowId = graph.id ?? name;
  const nodes = Array.isArray(graph.nodes) ? graph.nodes : [];
  const userAgent = c.req.header("User-Agent") ?? void 0;
  const result = await executeWebhookGraph(
    c.env,
    record.graph,
    triggerContext,
    name,
    apiKey,
    c.executionCtx,
    userAgent
  );
  c.executionCtx.waitUntil(
    writeExecutionVerdict(c.env, workflowId, nodes, result.success ? "success" : "failed", result.duration_ms, result.error ?? "", triggerContext, apiKey, c.env.__kbdbTally)
  );
  if (!result.success) {
    const paused = typeof result.error === "string" && /workflow paused/i.test(result.error);
    return c.json(
      {
        success: false,
        error: result.error ?? "\u5DE5\u4F5C\u6D41\u57F7\u884C\u5931\u6557",
        trace: result.trace,
        ...paused ? { paused: true, hint: "\u6B64\u5DE5\u4F5C\u6D41\u6703\u66AB\u505C\u7B49\u5F85\u975E\u540C\u6B65 callback\uFF0C\u7121\u6CD5\u7576\u540C\u6B65\u67E5\u8A62\u7AEF\u9EDE\uFF1B\u6539\u7528 /webhooks/named/:name/trigger?async=1 + /workflows/resume\u3002" } : {}
      },
      paused ? 409 : 500
    );
  }
  const serialized = JSON.stringify(result.data ?? null);
  const byteLen = new TextEncoder().encode(serialized).byteLength;
  if (byteLen > MAX_QUERY_OUTPUT_BYTES) {
    return c.json(
      {
        success: false,
        error: `\u67E5\u8A62\u8F38\u51FA\u904E\u5927\uFF08${byteLen} bytes > \u4E0A\u9650 ${MAX_QUERY_OUTPUT_BYTES}\uFF09\u3002\u8ACB\u5728 workflow \u5167\u5148\u805A\u5408 / \u5206\u9801\u518D\u56DE\u3002`
      },
      413
    );
  }
  return new Response(serialized, {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      "X-Arcrun-Duration-Ms": String(result.duration_ms)
    }
  });
}
webhooksNamedRouter.get("/webhooks/named/:name/query", async (c) => {
  const apiKey = c.req.header("X-Arcrun-API-Key");
  if (!apiKey) return c.json({ error: "\u7F3A\u5C11 X-Arcrun-API-Key header" }, 401);
  return queryNamed(c, apiKey, c.req.param("name"), queryStringContext(c));
});
webhooksNamedRouter.post("/webhooks/named/:name/query", async (c) => {
  const apiKey = c.req.header("X-Arcrun-API-Key");
  if (!apiKey) return c.json({ error: "\u7F3A\u5C11 X-Arcrun-API-Key header" }, 401);
  return queryNamed(c, apiKey, c.req.param("name"), await bodyContext(c));
});
webhooksNamedRouter.post("/webhooks/named/:ns/:name/query", async (c) => {
  return queryNamed(c, c.req.param("ns"), c.req.param("name"), await bodyContext(c));
});
webhooksNamedRouter.get("/q/:ns/:name", async (c) => {
  return queryNamed(c, c.req.param("ns"), c.req.param("name"), queryStringContext(c));
});
webhooksNamedRouter.get("/webhooks/named/:name/definition", async (c) => {
  const apiKey = c.req.header("X-Arcrun-API-Key");
  if (!apiKey) return c.json({ error: "\u7F3A\u5C11 X-Arcrun-API-Key header" }, 401);
  const name = c.req.param("name");
  const raw2 = await c.env.WEBHOOKS.get(kvKey(apiKey, name), "text");
  if (!raw2) return c.json({ error: `\u627E\u4E0D\u5230 workflow "${name}"` }, 404);
  const rec = JSON.parse(raw2);
  return c.json({
    name: rec.name,
    description: rec.description ?? "",
    graph: rec.graph,
    config: rec.config ?? {},
    created_at: rec.created_at ?? "",
    ...rec.cron_expr ? { cron_expr: rec.cron_expr } : {}
  });
});
webhooksNamedRouter.get("/webhooks/named", async (c) => {
  const apiKey = c.req.header("X-Arcrun-API-Key");
  if (!apiKey) {
    return c.json({ error: "\u7F3A\u5C11 X-Arcrun-API-Key header" }, 401);
  }
  const prefix = `${apiKey}:wf:`;
  const list = await c.env.WEBHOOKS.list({ prefix });
  const baseUrl = new URL(c.req.url).origin;
  const result = await Promise.all(
    list.keys.map(async (k) => {
      const name = k.name.slice(prefix.length);
      const raw2 = await c.env.WEBHOOKS.get(k.name, "text");
      const rec = raw2 ? JSON.parse(raw2) : null;
      return {
        name,
        description: rec?.description ?? "",
        created_at: rec?.created_at ?? "",
        cron_expr: rec?.cron_expr,
        webhook_url: `${baseUrl}/webhooks/named/${name}/trigger`
      };
    })
  );
  return c.json({ workflows: result, total: result.length });
});
webhooksNamedRouter.delete("/webhooks/named/:name", async (c) => {
  const apiKey = c.req.header("X-Arcrun-API-Key");
  if (!apiKey) {
    return c.json({ error: "\u7F3A\u5C11 X-Arcrun-API-Key header" }, 401);
  }
  const name = c.req.param("name");
  const existing = await c.env.WEBHOOKS.get(kvKey(apiKey, name), "text");
  if (!existing) {
    return c.json({ error: `\u627E\u4E0D\u5230 workflow "${name}"` }, 404);
  }
  await c.env.WEBHOOKS.delete(kvKey(apiKey, name));
  await updateCronIndexEntry(c.env.WEBHOOKS, apiKey, name, null);
  return c.json({ deleted: true, name });
});

// cypher-executor/src/routes/auth.ts
init_dist();
init_credentials();

// cypher-executor/src/lib/platform-oauth-users.ts
init_kbdb_proxy();
var PlatformUserStoreError = class extends Error {
};
async function kFetch2(env, path, init) {
  const { base, headers } = kbdbBase(env);
  try {
    return await fetch(`${base}${path}`, {
      ...init,
      headers: { ...headers, ...init?.headers }
    });
  } catch (e) {
    throw new PlatformUserStoreError(`fetch ${path} \u5931\u6557\uFF1A${e instanceof Error ? e.message : String(e)}`);
  }
}
async function sha256Hex3(input) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
var TEMPLATE = "platform_oauth_user";
var SLOTS = [
  "provider_key_hash",
  "api_key_hash",
  "email",
  "display_name",
  "avatar_url",
  "api_key",
  "provider",
  "provider_id",
  "created_at",
  "revoked"
];
var templateEnsured = false;
async function ensureTemplate3(env) {
  if (templateEnsured) return;
  const got = await kFetch2(env, `/templates/${TEMPLATE}`);
  if (!got.ok) {
    await kFetch2(env, "/templates", { method: "POST", body: JSON.stringify({ name: TEMPLATE, slots: SLOTS }) }).catch(
      () => void 0
    );
  }
  templateEnsured = true;
}
function toUser(recordId, v) {
  return {
    record_id: recordId,
    email: v.email ?? "",
    display_name: v.display_name ?? "",
    avatar_url: v.avatar_url || void 0,
    api_key: v.api_key ?? "",
    provider: v.provider ?? "google",
    provider_id: v.provider_id ?? "",
    created_at: v.created_at ?? "",
    revoked: v.revoked === "true"
  };
}
async function findByHash2(env, field, hash) {
  const res = await kFetch2(env, `/records/by-source/${TEMPLATE}?field=${encodeURIComponent(field)}&value=${encodeURIComponent(hash)}`);
  if (!res.ok) return null;
  const body = await res.json().catch(() => null);
  const id = body?.record_ids?.[0];
  if (!id) return null;
  const rec = await kFetch2(env, `/records/${encodeURIComponent(id)}`);
  if (!rec.ok) return null;
  const recBody = await rec.json().catch(() => null);
  return recBody?.record ?? null;
}
async function findPlatformUserByProvider(env, provider, providerId) {
  const hash = await sha256Hex3(`${provider}:${providerId}`);
  const found = await findByHash2(env, "provider_key_hash", hash);
  return found ? toUser(found.record_id, found.values) : null;
}
async function findPlatformUserByApiKey(env, apiKey) {
  const hash = await sha256Hex3(apiKey);
  const found = await findByHash2(env, "api_key_hash", hash);
  return found ? toUser(found.record_id, found.values) : null;
}
async function createPlatformUser(env, input) {
  await ensureTemplate3(env);
  const values = {
    provider_key_hash: await sha256Hex3(`${input.provider}:${input.provider_id}`),
    api_key_hash: await sha256Hex3(input.api_key),
    email: input.email,
    display_name: input.display_name,
    avatar_url: input.avatar_url ?? "",
    api_key: input.api_key,
    provider: input.provider,
    provider_id: input.provider_id,
    created_at: (/* @__PURE__ */ new Date()).toISOString(),
    revoked: "false"
  };
  const res = await kFetch2(env, "/records", { method: "POST", body: JSON.stringify({ template: TEMPLATE, values }) });
  if (!res.ok) throw new PlatformUserStoreError(`POST /records(${TEMPLATE}) \u2192 ${res.status}`);
  const body = await res.json().catch(() => null);
  const recordId = body?.record?.record_id;
  if (!recordId) throw new PlatformUserStoreError("POST /records \u56DE\u61C9\u7F3A record_id");
  return { ...input, record_id: recordId, created_at: values.created_at, revoked: false };
}
async function updatePlatformUser(env, recordId, patch) {
  const values = {};
  if (patch.display_name !== void 0) values.display_name = patch.display_name;
  if (patch.avatar_url !== void 0) values.avatar_url = patch.avatar_url ?? "";
  if (patch.api_key !== void 0) {
    values.api_key = patch.api_key;
    values.api_key_hash = await sha256Hex3(patch.api_key);
  }
  if (patch.revoked !== void 0) values.revoked = String(patch.revoked);
  if (Object.keys(values).length === 0) return;
  const res = await kFetch2(env, `/records/${encodeURIComponent(recordId)}`, { method: "PATCH", body: JSON.stringify({ values }) });
  if (!res.ok) throw new PlatformUserStoreError(`PATCH /records/${recordId} \u2192 ${res.status}`);
}

// cypher-executor/src/routes/auth.ts
var authRouter = new Hono2();
var STATE_TEMPLATE = "platform_oauth_state";
var STATE_TTL_SECONDS = 600;
var SESSION_TEMPLATE = "platform_oauth_session";
var SESSION_TTL_SECONDS = 7 * 24 * 60 * 60;
function getLandingOrigin(c) {
  const origin2 = c.req.raw.headers.get("origin");
  const allowed = ["https://arcrun.dev", "https://www.arcrun.dev"];
  if (origin2 && allowed.includes(origin2)) return origin2;
  return "https://arcrun.dev";
}
function generateApiKey() {
  return "ak_" + randomToken(24);
}
async function upsertAuthRecipe(recipes, recipe) {
  const key = `auth_recipe:${recipe.service}`;
  const existing = await recipes.get(key);
  if (existing) return;
  await recipes.put(key, JSON.stringify({ ...recipe, created_at: Date.now(), updated_at: Date.now() }));
}
function randomToken(bytes = 32) {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return Array.from(arr).map((b) => b.toString(16).padStart(2, "0")).join("");
}
function getSessionId(req) {
  const cookie = req.headers.get("cookie") ?? "";
  const match2 = cookie.match(/arcrun_session=([a-f0-9]+)/);
  return match2 ? match2[1] : null;
}
function getApiKeyFromRequest(req) {
  const direct = req.headers.get("x-arcrun-api-key");
  if (direct) return direct;
  const auth = req.headers.get("authorization") ?? "";
  const match2 = auth.match(/^Bearer\s+(ak_\S+)/i);
  return match2 ? match2[1] : null;
}
async function resolveSession(c) {
  const sessId = getSessionId(c.req.raw);
  if (sessId) {
    const sess = await ephemeralGet(c.env, { template: SESSION_TEMPLATE, hashField: "session_hash", rawKey: sessId });
    if (sess?.record_id) {
      const user = await findPlatformUserByApiKey(c.env, sess.api_key ?? "");
      if (user && !user.revoked && user.record_id === sess.record_id) return user;
    }
  }
  const apiKey = getApiKeyFromRequest(c.req.raw);
  if (apiKey) {
    const user = await findPlatformUserByApiKey(c.env, apiKey);
    if (user && !user.revoked && user.api_key === apiKey) return user;
  }
  return null;
}
authRouter.get("/auth/google/start", async (c) => {
  const clientId = c.env.GOOGLE_CLIENT_ID;
  if (!clientId) return c.json({ error: "Google OAuth not configured" }, 503);
  const state = randomToken(16);
  const stateRecord = {
    provider: "google",
    redirect_back: c.req.query("redirect") ?? "/dashboard",
    created_at: Date.now()
  };
  await ephemeralPut(c.env, {
    template: STATE_TEMPLATE,
    slots: ["provider", "redirect_back", "created_at"],
    hashField: "state_hash",
    rawKey: state,
    values: {
      provider: stateRecord.provider,
      redirect_back: stateRecord.redirect_back,
      created_at: String(stateRecord.created_at)
    },
    ttlSeconds: STATE_TTL_SECONDS
  });
  const redirectUri = "https://cypher.arcrun.dev/auth/callback";
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid profile email",
    state,
    access_type: "offline",
    prompt: "consent"
  });
  return Response.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`, 302);
});
authRouter.get("/auth/github/start", async (c) => {
  const clientId = c.env.GITHUB_CLIENT_ID;
  if (!clientId) return c.json({ error: "GitHub OAuth not configured" }, 503);
  const state = randomToken(16);
  const stateRecord = {
    provider: "github",
    redirect_back: c.req.query("redirect") ?? "/dashboard",
    created_at: Date.now()
  };
  await ephemeralPut(c.env, {
    template: STATE_TEMPLATE,
    slots: ["provider", "redirect_back", "created_at"],
    hashField: "state_hash",
    rawKey: state,
    values: {
      provider: stateRecord.provider,
      redirect_back: stateRecord.redirect_back,
      created_at: String(stateRecord.created_at)
    },
    ttlSeconds: STATE_TTL_SECONDS
  });
  const redirectUri = "https://cypher.arcrun.dev/auth/callback";
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: "read:user user:email",
    state
  });
  return Response.redirect(`https://github.com/login/oauth/authorize?${params}`, 302);
});
authRouter.get("/auth/callback", async (c) => {
  const code = c.req.query("code");
  const state = c.req.query("state");
  const error = c.req.query("error");
  const landingOrigin = getLandingOrigin(c);
  if (error || !code || !state) {
    return Response.redirect(`${landingOrigin}/login?error=${encodeURIComponent(error ?? "cancelled")}`, 302);
  }
  const stateVals = await ephemeralGet(c.env, { template: STATE_TEMPLATE, hashField: "state_hash", rawKey: state, consume: true });
  if (!stateVals) {
    return Response.redirect(`${landingOrigin}/login?error=invalid_state`, 302);
  }
  const stateRecord = {
    provider: stateVals.provider ?? "google",
    redirect_back: stateVals.redirect_back ?? "/dashboard",
    created_at: Number(stateVals.created_at) || Date.now()
  };
  try {
    let email;
    let displayName;
    let avatarUrl;
    let providerId;
    let pendingCredential = null;
    const provider = stateRecord.provider;
    const redirectUri = "https://cypher.arcrun.dev/auth/callback";
    if (provider === "google") {
      const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          code,
          client_id: c.env.GOOGLE_CLIENT_ID ?? "",
          client_secret: c.env.GOOGLE_CLIENT_SECRET ?? "",
          redirect_uri: redirectUri,
          grant_type: "authorization_code"
        })
      });
      if (!tokenRes.ok) throw new Error("google token exchange failed");
      const tokenData = await tokenRes.json();
      const userRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${tokenData.access_token}` }
      });
      if (!userRes.ok) throw new Error("google userinfo failed");
      const userInfo = await userRes.json();
      email = userInfo.email.toLowerCase();
      displayName = userInfo.name;
      avatarUrl = userInfo.picture;
      providerId = userInfo.sub;
      if (tokenData.refresh_token) {
        pendingCredential = { name: "google_refresh_token", value: tokenData.refresh_token, service: "google_user" };
        void upsertAuthRecipe(c.env.RECIPES, {
          kind: "auth_recipe",
          service: "google_user",
          version: 1,
          primitive: "oauth2",
          base_url: "https://www.googleapis.com",
          display_name: "Google\uFF08\u7528\u6236\u5E33\u865F\uFF09",
          oauth2: {
            token_endpoint: "https://oauth2.googleapis.com/token",
            client_id: c.env.GOOGLE_CLIENT_ID ?? "",
            client_secret: c.env.GOOGLE_CLIENT_SECRET ?? "",
            scopes: ["https://www.googleapis.com/auth/drive", "https://www.googleapis.com/auth/spreadsheets"]
          },
          required_secrets: [{ key: "google_refresh_token", label: "Google Refresh Token" }],
          inject: { header: { Authorization: "Bearer {{runtime.access_token}}" } }
        });
      }
    } else {
      const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Accept": "application/json"
        },
        body: new URLSearchParams({
          code,
          client_id: c.env.GITHUB_CLIENT_ID ?? "",
          client_secret: c.env.GITHUB_CLIENT_SECRET ?? "",
          redirect_uri: redirectUri
        })
      });
      if (!tokenRes.ok) throw new Error("github token exchange failed");
      const tokenData = await tokenRes.json();
      const userRes = await fetch("https://api.github.com/user", {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          "User-Agent": "arcrun",
          "Accept": "application/vnd.github+json"
        }
      });
      if (!userRes.ok) throw new Error("github user fetch failed");
      const userInfo = await userRes.json();
      let ghEmail = userInfo.email ?? "";
      if (!ghEmail) {
        const emailsRes = await fetch("https://api.github.com/user/emails", {
          headers: {
            Authorization: `Bearer ${tokenData.access_token}`,
            "User-Agent": "arcrun",
            "Accept": "application/vnd.github+json"
          }
        });
        if (emailsRes.ok) {
          const emails = await emailsRes.json();
          const primary = emails.find((e) => e.primary && e.verified);
          ghEmail = primary?.email ?? emails[0]?.email ?? "";
        }
      }
      if (!ghEmail) throw new Error("github email not available");
      email = ghEmail.toLowerCase();
      displayName = userInfo.name ?? userInfo.login;
      avatarUrl = userInfo.avatar_url;
      providerId = String(userInfo.id);
      if (tokenData.access_token) {
        pendingCredential = { name: "github_access_token", value: tokenData.access_token, service: "github_user" };
        void upsertAuthRecipe(c.env.RECIPES, {
          kind: "auth_recipe",
          service: "github_user",
          version: 1,
          primitive: "static_key",
          base_url: "https://api.github.com",
          display_name: "GitHub\uFF08\u7528\u6236\u5E33\u865F\uFF09",
          required_secrets: [{ key: "github_access_token", label: "GitHub Access Token" }],
          inject: { header: { Authorization: "Bearer {{secret.github_access_token}}" } }
        });
      }
    }
    const existing = await findPlatformUserByProvider(c.env, provider, providerId);
    let apiKey;
    let recordId;
    if (existing && !existing.revoked) {
      apiKey = existing.api_key;
      recordId = existing.record_id;
      await updatePlatformUser(c.env, recordId, { display_name: displayName, avatar_url: avatarUrl });
    } else if (existing) {
      apiKey = generateApiKey();
      recordId = existing.record_id;
      await updatePlatformUser(c.env, recordId, { display_name: displayName, avatar_url: avatarUrl, api_key: apiKey, revoked: false });
    } else {
      apiKey = generateApiKey();
      const created = await createPlatformUser(c.env, {
        email,
        display_name: displayName,
        avatar_url: avatarUrl,
        api_key: apiKey,
        provider,
        provider_id: providerId
      });
      recordId = created.record_id;
    }
    if (pendingCredential) {
      try {
        await storeCredential(c.env, apiKey, pendingCredential.name, pendingCredential.value, pendingCredential.service);
      } catch (e) {
        console.error("\u5B58 provider token \u5931\u6557\uFF08\u4E0D\u5F71\u97FF\u767B\u5165\uFF09:", e instanceof Error ? e.message : String(e));
      }
    }
    const sessionId = randomToken(32);
    await ephemeralPut(c.env, {
      template: SESSION_TEMPLATE,
      slots: ["record_id", "api_key", "email"],
      hashField: "session_hash",
      rawKey: sessionId,
      values: { record_id: recordId, api_key: apiKey, email },
      ttlSeconds: SESSION_TTL_SECONDS
    });
    const redirectBack = stateRecord.redirect_back.startsWith("/") ? stateRecord.redirect_back : "/dashboard";
    return new Response(null, {
      status: 302,
      headers: {
        Location: `${landingOrigin}${redirectBack}`,
        "Set-Cookie": `arcrun_session=${sessionId}; Path=/; HttpOnly; Secure; SameSite=Lax; Domain=.arcrun.dev; Max-Age=${7 * 24 * 60 * 60}`
      }
    });
  } catch (err) {
    console.error("[auth/callback]", err);
    return Response.redirect(`${landingOrigin}/login?error=server_error`, 302);
  }
});
authRouter.post("/auth/logout", async (c) => {
  const sessId = getSessionId(c.req.raw);
  if (sessId) {
    await ephemeralDelete(c.env, { template: SESSION_TEMPLATE, hashField: "session_hash", rawKey: sessId });
  }
  const landingOrigin = getLandingOrigin(c);
  return new Response(null, {
    status: 302,
    headers: {
      Location: `${landingOrigin}/`,
      "Set-Cookie": "arcrun_session=; Path=/; HttpOnly; Secure; SameSite=Lax; Domain=.arcrun.dev; Max-Age=0"
    }
  });
});
authRouter.get("/me", async (c) => {
  const user = await resolveSession(c);
  if (!user) return c.json({ error: "not authenticated" }, 401);
  return c.json({
    email: user.email,
    display_name: user.display_name,
    avatar_url: user.avatar_url,
    api_key: user.api_key,
    provider: user.provider,
    created_at: user.created_at
  });
});
authRouter.put("/me/api-key/rotate", async (c) => {
  const user = await resolveSession(c);
  if (!user) return c.json({ error: "not authenticated" }, 401);
  const newRaw = randomToken(24);
  const newKey = "ak_" + newRaw;
  await updatePlatformUser(c.env, user.record_id, { api_key: newKey });
  return c.json({
    success: true,
    api_key: newKey,
    message: "API Key rotated. Your existing workflow credentials are still stored under the old key namespace."
  });
});
authRouter.delete("/me/api-key", async (c) => {
  const user = await resolveSession(c);
  if (!user) return c.json({ error: "not authenticated" }, 401);
  await updatePlatformUser(c.env, user.record_id, { revoked: true });
  const sessId = getSessionId(c.req.raw);
  if (sessId) await ephemeralDelete(c.env, { template: SESSION_TEMPLATE, hashField: "session_hash", rawKey: sessId });
  return new Response(JSON.stringify({ success: true, message: "API Key revoked." }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": "arcrun_session=; Path=/; HttpOnly; Secure; SameSite=Lax; Domain=.arcrun.dev; Max-Age=0"
    }
  });
});

// cypher-executor/src/routes/resume.ts
init_dist();
init_types();
init_graph_executor();
init_component_loader();
init_paused_runs();
init_run_scratch();
var resumeRouter = new Hono2();
resumeRouter.post("/workflows/resume", async (c) => {
  let body;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "request body \u5FC5\u9808\u70BA JSON" }, 400);
  }
  const taskId = typeof body.task_id === "string" ? body.task_id : void 0;
  if (!taskId) {
    return c.json({ error: "task_id \u5FC5\u586B" }, 400);
  }
  const state = await consumePausedRun(c.env.EXEC_CONTEXT, taskId);
  if (!state) {
    return c.json({
      success: true,
      noop: true,
      reason: `paused state \u4E0D\u5B58\u5728\u6216\u5DF2\u904E\u671F (task_id=${taskId})`
    });
  }
  const callbackResult = {
    success: body.success ?? true,
    data: body.data,
    error: body.error
  };
  const loader = createComponentLoader(c.env);
  const executor = new GraphExecutor(loader, void 0, c.env, state.api_key);
  const start = Date.now();
  try {
    const result = await executor.resumeFromPaused({
      graph: state.graph,
      paused_node_id: state.paused_node_id,
      paused_context: state.paused_context,
      callback_result: callbackResult,
      prior_trace: state.trace_so_far,
      kvNamespace: createRunScratch(),
      // #98：恢復是新的一趟執行（新 run_id），節點 output 住記憶體
      recipe_output_format: state.recipe_output_format,
      recipe_output_required_fields: state.recipe_output_required_fields
    });
    const duration_ms = Date.now() - start;
    const verdict = deriveExecutionVerdict(state.graph, result.trace);
    if (!verdict.success) {
      return c.json({
        success: false,
        resumed: true,
        error: verdict.error,
        failed_node: verdict.failedNode ?? null,
        task_id: taskId,
        run_id: state.run_id,
        data: result.data,
        trace: result.trace,
        duration_ms
      }, 500);
    }
    return c.json({
      success: true,
      resumed: true,
      task_id: taskId,
      run_id: state.run_id,
      data: result.data,
      trace: result.trace,
      duration_ms
    });
  } catch (err) {
    if (err instanceof WorkflowPaused) {
      return c.json({
        success: true,
        paused_again: true,
        task_id: err.task_id,
        run_id: err.run_id,
        paused_node_id: err.paused_node_id
      });
    }
    const errMsg = err instanceof Error ? err.message : String(err);
    return c.json({ success: false, error: errMsg, task_id: taskId, run_id: state.run_id }, 500);
  }
});

// cypher-executor/src/routes/executions.ts
init_dist();
init_paused_runs();
init_kbdb_proxy();
var executionsRouter = new Hono2();
executionsRouter.get("/executions/paused", async (c) => {
  const apiKey = c.req.header("X-Arcrun-API-Key");
  if (!apiKey) {
    return c.json({
      ok: false,
      error_code: "auth_missing",
      human_message: "\u7F3A X-Arcrun-API-Key header",
      next_actions: ["call /me \u53D6\u5F97\u4F60\u7684 ak_xxx\uFF0C\u52A0\u9032 header"]
    }, 401);
  }
  const limitParam = c.req.query("limit");
  const limit = Math.min(Math.max(parseInt(limitParam || "20", 10), 1), 100);
  const paused = await listPausedRunsByApiKey(c.env.EXEC_CONTEXT, apiKey, limit);
  return c.json({
    ok: true,
    data: { count: paused.length, paused },
    hints: paused.length > 0 ? [`${paused.length} \u500B workflow \u7B49 callback resume\u3002call get_execution_trace(task_id) \u770B\u7D30\u7BC0`] : ["\u6C92\u6709\u4EFB\u4F55 paused workflow"]
  });
});
executionsRouter.get("/executions/:task_id", async (c) => {
  const apiKey = c.req.header("X-Arcrun-API-Key");
  if (!apiKey) {
    return c.json({
      ok: false,
      error_code: "auth_missing",
      human_message: "\u7F3A X-Arcrun-API-Key header",
      next_actions: ["\u52A0 X-Arcrun-API-Key header"]
    }, 401);
  }
  const taskId = c.req.param("task_id");
  const raw2 = await c.env.EXEC_CONTEXT.get(`paused_run:${taskId}`);
  if (!raw2) {
    return c.json({
      ok: false,
      error_code: "not_found",
      human_message: `task_id "${taskId}" \u6C92\u5C0D\u61C9\u7684 paused state\uFF08\u53EF\u80FD\u5DF2 resume \u5B8C\u3001\u904E 24h TTL \u88AB GC\u3001\u6216\u5F9E\u672A\u5B58\u5728\uFF09`,
      next_actions: [
        "call /executions/paused \u770B\u7576\u524D\u6240\u6709 paused\uFF0C\u78BA\u8A8D task_id \u6B63\u78BA",
        "\u82E5\u8A72 workflow \u4E0D\u662F paused \u578B\uFF0C\u770B /workflows/:name/executions \u67E5\u6B77\u53F2 verdict"
      ]
    }, 404);
  }
  let state;
  try {
    state = JSON.parse(raw2);
  } catch {
    return c.json({
      ok: false,
      error_code: "internal_error",
      human_message: "paused state JSON \u640D\u6BC0",
      next_actions: ["\u544A\u8A34 leo / \u5E73\u53F0\u7DAD\u8B77\u8005"]
    }, 500);
  }
  if (state.api_key !== apiKey) {
    return c.json({
      ok: false,
      error_code: "not_found",
      // 不洩漏存在性
      human_message: `task_id "${taskId}" \u627E\u4E0D\u5230`,
      next_actions: ["\u78BA\u8A8D task_id \u5C6C\u65BC\u4F60 (\u7528 /executions/paused \u5217\u51FA)"]
    }, 404);
  }
  return c.json({
    ok: true,
    data: {
      task_id: taskId,
      run_id: state.run_id,
      paused_node_id: state.paused_node_id,
      paused_context: state.paused_context,
      paused_pending_result: state.paused_pending_result,
      trace_so_far: state.trace_so_far,
      expires_at: state.expires_at
    },
    hints: [
      "paused \u72C0\u614B = workflow \u7B49 daemon callback\u3002\u7B49\u5C0D\u61C9 service \u56DE POST /workflows/resume \u5373\u53EF\u7E7C\u7E8C",
      "\u82E5 daemon \u639B\u4E86\uFF0C\u770B expires_at \u2014 \u904E 24h KV TTL \u6703 GC \u6B64 state"
    ]
  });
});
executionsRouter.get("/workflows/:name/executions", async (c) => {
  const apiKey = c.req.header("X-Arcrun-API-Key");
  if (!apiKey) {
    return c.json({
      ok: false,
      error_code: "auth_missing",
      human_message: "\u7F3A X-Arcrun-API-Key header",
      next_actions: ["\u52A0 X-Arcrun-API-Key header"]
    }, 401);
  }
  const name = c.req.param("name");
  const limitParam = c.req.query("limit");
  const limit = Math.min(Math.max(parseInt(limitParam || "10", 10), 1), 100);
  const wfRaw = await c.env.WEBHOOKS.get(`${apiKey}:wf:${name}`, "text");
  if (!wfRaw) {
    return c.json({
      ok: false,
      error_code: "not_found",
      human_message: `workflow "${name}" \u4E0D\u5B58\u5728\u6216\u4E0D\u5C6C\u65BC\u4F60`,
      next_actions: ["call /webhooks/named \u770B\u4F60\u6709\u4EC0\u9EBC workflow"]
    }, 404);
  }
  const { base, headers } = kbdbBase(c.env);
  const params = new URLSearchParams({ workflow_id: name, owner_id: apiKey, limit: String(limit) });
  const kbdbRes = await fetch(`${base}/execution-log?${params.toString()}`, { headers });
  const kbdbBody = await kbdbRes.json().catch(() => null);
  const executions = (kbdbRes.ok && kbdbBody?.success ? kbdbBody.executions ?? [] : []).map((r) => ({
    timestamp: String(r.recorded_at),
    workflow_id: name,
    verdict: r.verdict,
    duration_ms: r.duration_ms,
    message: r.message ?? "",
    ...r.target ? { target: r.target } : {}
  }));
  return c.json({
    ok: true,
    data: {
      workflow_name: name,
      count: executions.length,
      executions
    },
    hints: executions.length === 0 ? ["\u5C1A\u672A\u6709\u4EFB\u4F55\u57F7\u884C\u7D00\u9304\u3002\u5148 call /webhooks/named/:name/trigger \u8DD1\u4E00\u6B21"] : [`\u6700\u8FD1 ${executions.length} \u6B21\u3002\u770B\u5230 verdict=failed \u7684\uFF0Ccall /executions/:task_id \u770B paused state \u6216\u7E7C\u7E8C debug`]
  });
});

// cypher-executor/src/routes/init-seed.ts
init_dist();
init_hash();
init_recipes();

// cypher-executor/src/lib/api-recipe-seeds.ts
var KBDB_BASE_TOKEN = "{{KBDB_BASE_URL}}";
function resolveKbdbSeedBase(text, resolveBase) {
  return text.includes(KBDB_BASE_TOKEN) ? text.replaceAll(KBDB_BASE_TOKEN, resolveBase()) : text;
}
var API_RECIPE_SEEDS = [
  // ── KBDB（Supabase 模式，auth_service=kbdb static_key）──
  {
    canonical_id: "kbdb_get",
    display_name: "KBDB Get",
    description: "GET \u8B80\u53D6 block / \u67E5\u8A62\u3002_path \u5E36\u67E5\u8A62\u8DEF\u5F91\u3002auth: kbdb static_key\u3002",
    endpoint: "{{KBDB_BASE_URL}}{{_path}}",
    method: "GET",
    auth_service: "kbdb"
  },
  {
    canonical_id: "kbdb_create_block",
    display_name: "KBDB Create Block",
    description: "POST /blocks \u5EFA\u7ACB block\u3002body \u5E36 block \u6B04\u4F4D\uFF08content/type/page_name/source/user_id \u7B49\uFF09\u3002auth: kbdb static_key\u3002",
    endpoint: "{{KBDB_BASE_URL}}/blocks",
    method: "POST",
    auth_service: "kbdb"
  },
  {
    canonical_id: "kbdb_patch_block",
    display_name: "KBDB Patch Block",
    description: "PATCH /blocks/:id \u5C40\u90E8\u66F4\u65B0\u3002_path \u5E36 /blocks/{id}\uFF0Cbody \u5E36\u8981\u6539\u7684\u6B04\u4F4D\u3002auth: kbdb static_key\u3002",
    endpoint: "{{KBDB_BASE_URL}}{{_path}}",
    method: "PATCH",
    auth_service: "kbdb"
  },
  {
    canonical_id: "kbdb_delete",
    display_name: "KBDB Delete",
    description: "DELETE /blocks/:id \u522A\u9664 block\u3002_path \u5E36 /blocks/{id}\u3002auth: kbdb static_key\u3002",
    endpoint: "{{KBDB_BASE_URL}}{{_path}}",
    method: "DELETE",
    auth_service: "kbdb"
  },
  {
    canonical_id: "kbdb_ingest",
    display_name: "KBDB Ingest",
    description: "POST /blocks/ingest \u6279\u6B21\u5BEB\u5165\u3002body \u5E36 input\u3002auth: kbdb static_key\u3002",
    endpoint: "{{KBDB_BASE_URL}}/blocks/ingest",
    method: "POST",
    auth_service: "kbdb"
  },
  // ── Google（service_account）──
  {
    canonical_id: "gmail_send",
    display_name: "Gmail Send",
    description: "\u5BC4 Gmail\u3002POST messages/send\uFF0Cbody \u5E36 raw\uFF08base64url MIME\uFF09\u3002auth: google service_account\u3002",
    endpoint: "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
    method: "POST",
    auth_service: "google_gmail_sa"
  },
  {
    canonical_id: "google_sheets_append",
    display_name: "Google Sheets Append",
    // 壓測階段 12 修正：append 官方 API 是 POST .../values/{range}:append（PUT 是 values.update 覆寫的動詞），
    // 種子寫死 PUT 導致每個 self-host 用戶 seed 到壞 recipe（PUT :append → Google 400）。
    // body 形狀屬工作流，泛用種子不寫死欄位 → 由工作流的 _path + body 處理（body_from 機制待 §13.4 補）。
    description: "\u8FFD\u52A0\u4E00\u5217\u5230 Sheets\u3002POST .../values/{range}:append?valueInputOption=RAW\uFF0Cbody \u5E36 {values:[[...]]}\u3002auth: google service_account\u3002",
    endpoint: "https://sheets.googleapis.com{{_path}}",
    method: "POST",
    auth_service: "google_sheets_sa"
  },
  {
    canonical_id: "google_sheets_read",
    display_name: "Google Sheets Read",
    description: "\u8B80 Sheets\u3002GET values\u3002_path \u5E36\u5B8C\u6574\u8DEF\u5F91\u3002auth: google service_account\u3002",
    endpoint: "https://sheets.googleapis.com{{_path}}",
    method: "GET",
    auth_service: "google_sheets_sa"
  },
  // ── 訊息（static_key）──
  {
    canonical_id: "telegram_send",
    display_name: "Telegram Send",
    description: "Telegram sendMessage\u3002token \u5728 URL path\uFF08{{auth.bot_token}}\uFF09\uFF0Cbody \u5E36 chat_id+text\u3002auth: static_key path \u6CE8\u5165\u3002",
    endpoint: "https://api.telegram.org/bot{{auth.bot_token}}/sendMessage",
    method: "POST",
    auth_service: "telegram"
  },
  {
    canonical_id: "line_notify_send",
    display_name: "LINE Notify",
    description: "LINE Notify \u63A8\u8A0A\u606F\u3002POST notify\uFF0Cbody \u5E36 message\uFF08form-urlencoded\uFF09\u3002auth: static_key Bearer line token\u3002",
    endpoint: "https://notify-api.line.me/api/notify",
    method: "POST",
    auth_service: "line_notify"
  },
  // ── LLM 對話（binding＝免金鑰，3.12 第四型認證的第一個真實案例）──
  //
  // 為什麼進種子（而非寫在某個產品的安裝器裡）：「裝好之後預設有哪些 recipe」是平台能力，
  // 與本檔其餘種子同理由（見檔頭）。裝完 /init/seed 就有 ⇒ **用戶不填任何金鑰就能問答**。
  //
  // 換模型／換供應商＝**改這一筆 recipe**（endpoint + body_template + response_map），
  // workflow 的 ask_llm 節點不動——這正是「換源＝換 recipe 不是換引擎」。
  //
  // 選型實測（2026-08-03，在 1.4.4 實例上跑真實長度的 RAG prompt，每個模型連跑 2 次）：
  //   @cf/meta/llama-4-scout-17b-16e-instruct        2373／2173 ms　✅ 答案最完整、引用正確
  //   @cf/meta/llama-3.3-70b-instruct-fp8-fast       3261／2147 ms　✅ 可用但波動較大
  //   @cf/mistralai/mistral-small-3.1-24b-instruct   3560／3631 ms
  //   @cf/qwen/qwen2.5-coder-32b-instruct            3572／3353 ms
  //   @cf/openai/gpt-oss-120b                        1971／2295 ms　❌ 回應形狀不同，response 取不到文字
  //   @cf/google/gemma-3-12b-it                      ❌ 5018 This account is not allowed to access this model
  // 對照舊路徑（Gemini `gemma-4-31b-it`）：同型提問 **16.87 s**，且吐整段英文思考草稿
  //   ⇒ 選 llama-4-scout：**快 7 倍以上，且不需要淨化思考草稿**。
  {
    canonical_id: "workers_ai_chat",
    display_name: "Workers AI \u5C0D\u8A71\uFF08\u514D\u91D1\u9470\uFF09",
    description: "Cloudflare Workers AI \u6587\u5B57\u751F\u6210\uFF0C\u8D70 env.AI binding \u21D2 \u4E0D\u9700\u8981\u4EFB\u4F55 API \u91D1\u9470\u3002ctx \u5E36 prompt\uFF0C\u56DE\u61C9\u6B63\u898F\u5316\u6210 text\uFF08\u542B\u3010\u7B54\u3011\u6A19\u8A18\u8207\u524D\u7DB4\u6DE8\u5316\uFF09\u3002\u63DB\u6A21\u578B\uFF1D\u6539\u672C recipe \u7684 endpoint\uFF0Cworkflow \u4E0D\u52D5\u3002",
    endpoint: "@cf/meta/llama-4-scout-17b-16e-instruct",
    method: "POST",
    auth: "binding",
    binding_name: "AI",
    body_template: {
      messages: [{ role: "user", content: "{{prompt}}" }],
      max_tokens: 1024,
      temperature: 0.2
    },
    response_map: {
      // Workers AI chat 回應：{ response: "…" }（另有 OpenAI 相容的 choices，取 response 最穩）
      text_path: "response",
      // 提示詞要求答案以【答】開頭；模型偶爾會在前面多帶一行 ⇒ 取最後一個標記之後
      answer_marker: "\u3010\u7B54\u3011",
      // 前綴組合順序不定，循環剝殼（規則見 recipe-payload.ts sanitize）
      strip_prefixes: ["*", "-", "\u2022", ">", "#", '"', "\u300C", "\u3010\u7B54\u3011", "Answer:", "Draft:"]
    }
  },
  // ── 萃取 AI（inkstone/Arcrun#277）：小幫手送文字上雲，雲端用哪個 AI 由**這台雲端**的管理員選 ──
  //
  // 「每種 AI 一份 recipe」（leo 09-29）。執行器是 lib/extract-ai.ts（不認得任何一家 AI 的形狀，
  // 只照 recipe 組請求）；要接新的 AI 供應商＝在這裡加一筆，不改執行器。
  // 輸入 ctx：messages／max_tokens／temperature／response_format（要 JSON 時才有）／base_url／model。
  // 選填欄位沒值時，lib 會把整個欄位剔除（不會把 `{{x}}` 字面送出去）。
  {
    canonical_id: "extract_ai_workers_ai",
    display_name: "\u8403\u53D6 AI\uFF1ACloudflare Workers AI\uFF08\u514D\u91D1\u9470\uFF09",
    description: "CF \u96F2\u9810\u8A2D\u3002\u8D70 env.AI binding\uFF0C\u4E0D\u9700\u8981\u4EFB\u4F55\u91D1\u9470\uFF1B\u6A21\u578B\u9078\u578B\u8207 workers_ai_chat \u540C\u4E00\u652F\uFF08llama-4-scout\uFF09\u3002\u4F01\u696D\u79C1\u6709\u96F2\u6C92\u6709\u9019\u500B binding \u21D2 \u8ACB\u6539\u9078 extract_ai_openai_compat\u3002",
    endpoint: "@cf/meta/llama-4-scout-17b-16e-instruct",
    method: "POST",
    auth: "binding",
    binding_name: "AI",
    body_template: {
      messages: "{{messages}}",
      max_tokens: "{{max_tokens}}",
      temperature: "{{temperature}}",
      response_format: "{{response_format}}"
    },
    response_map: { text_path: "response" }
  },
  {
    canonical_id: "extract_ai_openai_compat",
    display_name: "\u8403\u53D6 AI\uFF1AOpenAI \u76F8\u5BB9\u7AEF\u9EDE\uFF08Ollama\uFF0FvLLM\uFF0FLM Studio\u2026\uFF09",
    description: "\u4F01\u696D\u79C1\u6709\u96F2\u7528\u3002POST {{base_url}}/v1/chat/completions\uFF0Cbody \u70BA OpenAI chat \u683C\u5F0F\u3002\u91D1\u9470\u9078\u586B\uFF08\u5167\u7DB2 Ollama \u901A\u5E38\u4E0D\u9700\u8981\uFF09\uFF1A\u6709\u8A2D credential\u300Cextract_ai_api_key\u300D\u624D\u5E36 Authorization\u3002",
    endpoint: "{{base_url}}/v1/chat/completions",
    method: "POST",
    headers: { Authorization: "Bearer {{credential.extract_ai_api_key}}" },
    body_template: {
      model: "{{model}}",
      messages: "{{messages}}",
      max_tokens: "{{max_tokens}}",
      temperature: "{{temperature}}",
      response_format: "{{response_format}}"
    },
    response_map: { text_path: "choices.0.message.content" }
  }
];

// cypher-executor/src/routes/init-seed.ts
init_endpoints();

// cypher-executor/src/lib/auth-recipe-seeds.ts
var now = Date.now();
var GOOGLE_SA_SECRETS = [
  {
    key: "client_email",
    label: "Service Account Email\uFF08client_email\uFF09",
    help: "Service Account \u7684\u4FE1\u7BB1\uFF0C\u5F62\u5982 xxx@yyy.iam.gserviceaccount.com\uFF08\u5C31\u662F\u4E0B\u8F09\u7684 SA JSON \u88E1 client_email \u90A3\u4E00\u884C\u7684\u503C\uFF09",
    help_url: "https://console.cloud.google.com/iam-admin/serviceaccounts"
  },
  {
    key: "private_key",
    label: "Service Account Private Key\uFF08private_key\uFF09",
    help: "SA JSON \u88E1 private_key \u90A3\u4E00\u6BB5\uFF08-----BEGIN PRIVATE KEY----- \u2026 -----END PRIVATE KEY-----\uFF09\uFF0C\u6574\u6BB5\u8CBC\u4E0A\u5373\u53EF\uFF0C\u542B\u771F\u5BE6\u63DB\u884C\u6216 \\n \u90FD\u80FD\u8A8D",
    help_url: "https://console.cloud.google.com/iam-admin/serviceaccounts"
  }
];
var AUTH_RECIPE_SEEDS = [
  // ── Static Key 類 ──────────────────────────────────────────────────────────
  {
    kind: "auth_recipe",
    service: "notion",
    version: 1,
    primitive: "static_key",
    base_url: "https://api.notion.com/v1",
    display_name: "Notion",
    description: "Notion API \u2014 \u9801\u9762\u3001\u8CC7\u6599\u5EAB\u8B80\u5BEB",
    required_secrets: [
      {
        key: "notion_token",
        label: "Internal Integration Token",
        help: "\u81F3 https://www.notion.so/my-integrations \u5EFA\u7ACB Integration",
        help_url: "https://www.notion.so/my-integrations"
      }
    ],
    inject: {
      header: {
        Authorization: "Bearer {{secret.notion_token}}",
        "Notion-Version": "2022-06-28"
      }
    },
    created_at: now,
    updated_at: now
  },
  {
    kind: "auth_recipe",
    service: "slack",
    version: 1,
    primitive: "static_key",
    base_url: "https://slack.com/api",
    display_name: "Slack",
    description: "Slack Bot API \u2014 \u767C\u8A0A\u606F\u3001\u67E5\u983B\u9053",
    required_secrets: [
      {
        key: "slack_bot_token",
        label: "Bot User OAuth Token (xoxb-...)",
        help: "\u81F3 https://api.slack.com/apps \u5EFA\u7ACB App\uFF0C\u53D6\u5F97 Bot Token",
        help_url: "https://api.slack.com/apps"
      }
    ],
    inject: {
      header: {
        Authorization: "Bearer {{secret.slack_bot_token}}"
      }
    },
    created_at: now,
    updated_at: now
  },
  {
    kind: "auth_recipe",
    service: "github",
    version: 1,
    primitive: "static_key",
    base_url: "https://api.github.com",
    display_name: "GitHub",
    description: "GitHub REST API \u2014 repo\u3001issue\u3001PR \u64CD\u4F5C",
    required_secrets: [
      {
        key: "github_token",
        label: "Personal Access Token (classic \u6216 fine-grained)",
        help: "\u81F3 https://github.com/settings/tokens \u5EFA\u7ACB",
        help_url: "https://github.com/settings/tokens"
      }
    ],
    inject: {
      header: {
        Authorization: "Bearer {{secret.github_token}}",
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28"
      }
    },
    created_at: now,
    updated_at: now
  },
  {
    kind: "auth_recipe",
    service: "openai",
    version: 1,
    primitive: "static_key",
    base_url: "https://api.openai.com/v1",
    display_name: "OpenAI",
    description: "OpenAI API \u2014 Chat Completions\u3001Embeddings \u7B49",
    required_secrets: [
      {
        key: "openai_api_key",
        label: "API Key (sk-...)",
        help: "\u81F3 https://platform.openai.com/api-keys \u5EFA\u7ACB",
        help_url: "https://platform.openai.com/api-keys"
      }
    ],
    inject: {
      header: {
        Authorization: "Bearer {{secret.openai_api_key}}"
      }
    },
    created_at: now,
    updated_at: now
  },
  {
    kind: "auth_recipe",
    service: "anthropic",
    version: 1,
    primitive: "static_key",
    base_url: "https://api.anthropic.com/v1",
    display_name: "Anthropic (Claude)",
    description: "Anthropic API \u2014 Claude \u6A21\u578B\u547C\u53EB",
    required_secrets: [
      {
        key: "anthropic_api_key",
        label: "API Key",
        help: "\u81F3 https://console.anthropic.com/settings/keys \u5EFA\u7ACB",
        help_url: "https://console.anthropic.com/settings/keys"
      }
    ],
    inject: {
      header: {
        "x-api-key": "{{secret.anthropic_api_key}}",
        "anthropic-version": "2023-06-01"
      }
    },
    created_at: now,
    updated_at: now
  },
  {
    kind: "auth_recipe",
    service: "airtable",
    version: 1,
    primitive: "static_key",
    base_url: "https://api.airtable.com/v0",
    display_name: "Airtable",
    description: "Airtable API \u2014 \u8B80\u5BEB Base \u8CC7\u6599",
    required_secrets: [
      {
        key: "airtable_token",
        label: "Personal Access Token",
        help: "\u81F3 https://airtable.com/create/tokens \u5EFA\u7ACB",
        help_url: "https://airtable.com/create/tokens"
      }
    ],
    inject: {
      header: {
        Authorization: "Bearer {{secret.airtable_token}}"
      }
    },
    created_at: now,
    updated_at: now
  },
  {
    kind: "auth_recipe",
    service: "discord",
    version: 1,
    primitive: "static_key",
    base_url: "https://discord.com/api/v10",
    display_name: "Discord",
    description: "Discord Bot API \u2014 \u767C\u8A0A\u606F\u3001\u7BA1\u7406\u4F3A\u670D\u5668",
    required_secrets: [
      {
        key: "discord_bot_token",
        label: "Bot Token",
        help: "\u81F3 https://discord.com/developers/applications \u5EFA\u7ACB Bot\uFF0C\u53D6\u5F97 Token",
        help_url: "https://discord.com/developers/applications"
      }
    ],
    inject: {
      header: {
        Authorization: "Bot {{secret.discord_bot_token}}"
      }
    },
    created_at: now,
    updated_at: now
  },
  {
    kind: "auth_recipe",
    service: "stripe",
    version: 1,
    primitive: "static_key",
    base_url: "https://api.stripe.com/v1",
    display_name: "Stripe",
    description: "Stripe API \u2014 \u652F\u4ED8\u3001\u5BA2\u6236\u3001\u8A02\u95B1\u7BA1\u7406",
    required_secrets: [
      {
        key: "stripe_secret_key",
        label: "Secret Key (sk_live_... \u6216 sk_test_...)",
        help: "\u81F3 https://dashboard.stripe.com/apikeys \u53D6\u5F97",
        help_url: "https://dashboard.stripe.com/apikeys"
      }
    ],
    inject: {
      header: {
        Authorization: "Bearer {{secret.stripe_secret_key}}"
      }
    },
    created_at: now,
    updated_at: now
  },
  {
    kind: "auth_recipe",
    service: "twilio",
    version: 1,
    primitive: "static_key",
    base_url: "https://api.twilio.com/2010-04-01",
    display_name: "Twilio",
    description: "Twilio API \u2014 SMS\u3001\u96FB\u8A71\u3001WhatsApp",
    required_secrets: [
      {
        key: "twilio_account_sid",
        label: "Account SID",
        help: "\u81F3 https://console.twilio.com/ \u53D6\u5F97",
        help_url: "https://console.twilio.com/"
      },
      {
        key: "twilio_auth_token",
        label: "Auth Token",
        help: "\u81F3 https://console.twilio.com/ \u53D6\u5F97",
        help_url: "https://console.twilio.com/"
      }
    ],
    inject: {
      header: {
        Authorization: "Basic {{secret.twilio_account_sid}}:{{secret.twilio_auth_token}}"
      }
    },
    created_at: now,
    updated_at: now
  },
  {
    kind: "auth_recipe",
    service: "sendgrid",
    version: 1,
    primitive: "static_key",
    base_url: "https://api.sendgrid.com/v3",
    display_name: "SendGrid",
    description: "SendGrid Email API \u2014 \u767C\u9001\u4EA4\u6613\u90F5\u4EF6",
    required_secrets: [
      {
        key: "sendgrid_api_key",
        label: "API Key (SG....)",
        help: "\u81F3 https://app.sendgrid.com/settings/api_keys \u5EFA\u7ACB",
        help_url: "https://app.sendgrid.com/settings/api_keys"
      }
    ],
    inject: {
      header: {
        Authorization: "Bearer {{secret.sendgrid_api_key}}"
      }
    },
    created_at: now,
    updated_at: now
  },
  {
    kind: "auth_recipe",
    service: "hubspot",
    version: 1,
    primitive: "static_key",
    base_url: "https://api.hubapi.com",
    display_name: "HubSpot",
    description: "HubSpot CRM API \u2014 \u806F\u7D61\u4EBA\u3001\u516C\u53F8\u3001\u4EA4\u6613\u7BA1\u7406",
    required_secrets: [
      {
        key: "hubspot_token",
        label: "Private App Access Token",
        help: "\u81F3 HubSpot Settings \u2192 Integrations \u2192 Private Apps \u5EFA\u7ACB",
        help_url: "https://developers.hubspot.com/docs/api/private-apps"
      }
    ],
    inject: {
      header: {
        Authorization: "Bearer {{secret.hubspot_token}}"
      }
    },
    created_at: now,
    updated_at: now
  },
  {
    kind: "auth_recipe",
    service: "linear",
    version: 1,
    primitive: "static_key",
    base_url: "https://api.linear.app",
    display_name: "Linear",
    description: "Linear API \u2014 Issue\u3001Project \u7BA1\u7406",
    required_secrets: [
      {
        key: "linear_api_key",
        label: "Personal API Key",
        help: "\u81F3 https://linear.app/settings/api \u5EFA\u7ACB",
        help_url: "https://linear.app/settings/api"
      }
    ],
    inject: {
      header: {
        Authorization: "{{secret.linear_api_key}}"
      }
    },
    created_at: now,
    updated_at: now
  },
  {
    kind: "auth_recipe",
    service: "shopify",
    version: 1,
    primitive: "static_key",
    base_url: "https://{{secret.shopify_store}}.myshopify.com/admin/api/2024-01",
    display_name: "Shopify",
    description: "Shopify Admin API \u2014 \u8A02\u55AE\u3001\u5546\u54C1\u3001\u5BA2\u6236\u7BA1\u7406",
    required_secrets: [
      {
        key: "shopify_access_token",
        label: "Admin API Access Token",
        help: "\u81F3 Shopify Admin \u2192 Apps \u2192 App and sales channel settings \u2192 Private apps",
        help_url: "https://shopify.dev/docs/apps/auth/admin-app-access-tokens"
      },
      {
        key: "shopify_store",
        label: "Store subdomain\uFF08\u4E0D\u542B .myshopify.com\uFF09",
        help: "\u4F8B\u5982 my-store\uFF08\u5C0D\u61C9 my-store.myshopify.com\uFF09"
      }
    ],
    inject: {
      header: {
        "X-Shopify-Access-Token": "{{secret.shopify_access_token}}"
      }
    },
    created_at: now,
    updated_at: now
  },
  {
    kind: "auth_recipe",
    service: "resend",
    version: 1,
    primitive: "static_key",
    base_url: "https://api.resend.com",
    display_name: "Resend",
    description: "Resend Email API \u2014 \u767C\u9001\u4EA4\u6613\u90F5\u4EF6",
    required_secrets: [
      {
        key: "resend_api_key",
        label: "API Key (re_...)",
        help: "\u81F3 https://resend.com/api-keys \u5EFA\u7ACB",
        help_url: "https://resend.com/api-keys"
      }
    ],
    inject: {
      header: {
        Authorization: "Bearer {{secret.resend_api_key}}"
      }
    },
    created_at: now,
    updated_at: now
  },
  {
    kind: "auth_recipe",
    service: "supabase",
    version: 1,
    primitive: "static_key",
    base_url: "https://{{secret.supabase_project_ref}}.supabase.co/rest/v1",
    display_name: "Supabase",
    description: "Supabase REST API \u2014 \u8CC7\u6599\u5EAB\u8B80\u5BEB",
    required_secrets: [
      {
        key: "supabase_service_key",
        label: "Service Role Key (eyJ...)",
        help: "\u81F3 Supabase Project Settings \u2192 API \u2192 service_role key",
        help_url: "https://supabase.com/dashboard"
      },
      {
        key: "supabase_project_ref",
        label: "Project Reference ID\uFF08URL \u4E2D\u7684 xxx.supabase.co \u7684 xxx\uFF09"
      }
    ],
    inject: {
      header: {
        Authorization: "Bearer {{secret.supabase_service_key}}",
        apikey: "{{secret.supabase_service_key}}"
      }
    },
    created_at: now,
    updated_at: now
  },
  {
    kind: "auth_recipe",
    service: "typeform",
    version: 1,
    primitive: "static_key",
    base_url: "https://api.typeform.com",
    display_name: "Typeform",
    description: "Typeform API \u2014 \u8868\u55AE\u3001\u554F\u5377\u56DE\u61C9\u8B80\u53D6",
    required_secrets: [
      {
        key: "typeform_token",
        label: "Personal Access Token",
        help: "\u81F3 https://admin.typeform.com/account#/section/tokens \u5EFA\u7ACB",
        help_url: "https://developer.typeform.com/get-started/"
      }
    ],
    inject: {
      header: {
        Authorization: "Bearer {{secret.typeform_token}}"
      }
    },
    created_at: now,
    updated_at: now
  },
  {
    kind: "auth_recipe",
    service: "jira",
    version: 1,
    primitive: "static_key",
    base_url: "https://{{secret.jira_domain}}.atlassian.net/rest/api/3",
    display_name: "Jira",
    description: "Jira API \u2014 Issue\u3001Sprint\u3001Project \u7BA1\u7406",
    required_secrets: [
      {
        key: "jira_api_token",
        label: "API Token",
        help: "\u81F3 https://id.atlassian.com/manage-profile/security/api-tokens \u5EFA\u7ACB",
        help_url: "https://support.atlassian.com/atlassian-account/docs/manage-api-tokens-for-your-atlassian-account/"
      },
      {
        key: "jira_email",
        label: "\u4F60\u7684 Atlassian \u5E33\u865F Email"
      },
      {
        key: "jira_domain",
        label: "Jira \u5B50\u7DB2\u57DF\uFF08xxx.atlassian.net \u7684 xxx\uFF09"
      }
    ],
    inject: {
      header: {
        Authorization: "Basic {{secret.jira_email}}:{{secret.jira_api_token}}",
        Accept: "application/json"
      }
    },
    created_at: now,
    updated_at: now
  },
  {
    kind: "auth_recipe",
    service: "gemini",
    version: 1,
    primitive: "static_key",
    base_url: "https://generativelanguage.googleapis.com/v1beta",
    display_name: "Google Gemini",
    description: "Google Gemini API \u2014 generateContent / embedContent\uFF08\u4F7F\u7528 API Key\uFF09",
    required_secrets: [
      {
        key: "gemini_api_key",
        label: "API Key",
        help: "\u81F3 https://aistudio.google.com/apikey \u5EFA\u7ACB",
        help_url: "https://aistudio.google.com/apikey"
      }
    ],
    inject: {
      header: {
        "x-goog-api-key": "{{secret.gemini_api_key}}"
      }
    },
    created_at: now,
    updated_at: now
  },
  {
    kind: "auth_recipe",
    service: "trello",
    version: 1,
    primitive: "static_key",
    base_url: "https://api.trello.com/1",
    display_name: "Trello",
    description: "Trello API \u2014 boards / cards / lists\uFF08API key + token \u8D70 query string\uFF09",
    required_secrets: [
      {
        key: "trello_api_key",
        label: "API Key",
        help: "\u81F3 https://trello.com/power-ups/admin \u5EFA\u7ACB Power-Up \u5F8C\u53D6\u5F97",
        help_url: "https://trello.com/power-ups/admin"
      },
      {
        key: "trello_token",
        label: "Token",
        help: "\u65BC Power-Up \u9801\u9762\u9EDE\u300CGenerate Token\u300D\u6388\u6B0A\u5F8C\u53D6\u5F97",
        help_url: "https://trello.com/power-ups/admin"
      }
    ],
    inject: {
      query: {
        key: "{{secret.trello_api_key}}",
        token: "{{secret.trello_token}}"
      }
    },
    created_at: now,
    updated_at: now
  },
  {
    kind: "auth_recipe",
    service: "mailgun",
    version: 1,
    primitive: "static_key",
    base_url: "https://api.mailgun.net/v3",
    display_name: "Mailgun",
    description: 'Mailgun API \u2014 \u5BC4\u4FE1\uFF08username \u56FA\u5B9A "api"\uFF0Cpassword \u70BA Private API Key\uFF0C\u8D70 Basic Auth\uFF09',
    required_secrets: [
      {
        key: "mailgun_api_key",
        label: "Private API Key",
        help: "\u81F3 Mailgun Dashboard \u2192 API Security \u2192 Sending Keys \u5EFA\u7ACB",
        help_url: "https://app.mailgun.com/mg/sending/domains"
      },
      {
        key: "mailgun_domain",
        label: "Sending Domain",
        help: "\u4F60\u5728 Mailgun \u8A2D\u5B9A\u597D\u7684 sending domain\uFF08\u4F8B\uFF1Amg.yourdomain.com\uFF09",
        help_url: "https://app.mailgun.com/mg/sending/domains"
      }
    ],
    inject: {
      header: {
        Authorization: "Basic api:{{secret.mailgun_api_key}}"
      }
    },
    created_at: now,
    updated_at: now
  },
  // ── 訊息 / URL-path 注入類（static_key）────────────────────────────────────
  //
  // 2026-06-29 補：以下三個 static_key auth recipe 一直存在於 prod RECIPES KV（手動 seed 過），
  // 但**從未進 source seed**（auth-recipe-seeds.ts）→ 任何全新 self-hosted `POST /init/seed`
  // 只會 seed 23 個、漏掉 telegram/line_notify/kbdb → self-host（mira/leo21c）的 telegram 發訊
  // 走不通（telegram_send 的 auth_service:'telegram' 找不到 auth recipe → {{auth.bot_token}} 注入空）。
  // 這正是「source vs live drift = 假綠」（總管反覆踩的同一類）。把 prod 現役定義回灌 source，
  // 讓 official 與 self-host 共用同一份種子。形態取自 prod GET /auth-recipes/{service}（2026-06-29）。
  // 設計權威：auth-recipe.md §六(line 70-71, telegram path 注入) + §七(line 150-151, kbdb 共用)。
  {
    kind: "auth_recipe",
    service: "telegram",
    version: 1,
    primitive: "static_key",
    base_url: "https://api.telegram.org",
    display_name: "Telegram Bot",
    description: "Telegram Bot API \u2014 sendMessage \u7B49\uFF08bot token \u6CE8\u5165 URL path /bot{token}/\uFF09",
    required_secrets: [
      {
        key: "telegram_bot_token",
        label: "Bot Token\uFF08\u5F9E @BotFather \u53D6\u5F97\uFF09",
        help: "\u5728 Telegram \u5C0D @BotFather \u9001 /newbot \u5EFA\u7ACB bot\uFF0C\u53D6\u5F97\u683C\u5F0F\u70BA 123456:ABC... \u7684 token",
        help_url: "https://core.telegram.org/bots/features#botfather"
      }
    ],
    // path 注入：recipe:telegram_send 的 endpoint 用 {{auth.bot_token}} 從 _auth_path 取值
    // （auth_static_key WASM 解密後輸出 auth_path → auth-dispatcher 帶進 _auth_path
    //   → makeRecipeRunner interpolate）。token 不落 header/query/body，符合 Telegram 的 URL-path 慣例。
    inject: {
      path: {
        bot_token: "{{secret.telegram_bot_token}}"
      }
    },
    created_at: now,
    updated_at: now
  },
  {
    kind: "auth_recipe",
    service: "line_notify",
    version: 1,
    primitive: "static_key",
    base_url: "https://notify-api.line.me",
    display_name: "LINE Notify",
    description: "LINE Notify \u2014 \u63A8\u64AD\u8A0A\u606F\uFF08static_key Bearer\uFF09",
    required_secrets: [
      {
        key: "line_token",
        label: "LINE Notify Token",
        help: "\u81F3 https://notify-bot.line.me/my/ \u767C\u884C\u500B\u4EBA\u5B58\u53D6\u6B0A\u6756",
        help_url: "https://notify-bot.line.me/my/"
      }
    ],
    inject: {
      header: {
        Authorization: "Bearer {{secret.line_token}}"
      }
    },
    created_at: now,
    updated_at: now
  },
  {
    kind: "auth_recipe",
    service: "kbdb",
    version: 1,
    primitive: "static_key",
    base_url: KBDB_BASE_TOKEN,
    // 灌種子時換成部署的 KBDB_BASE_URL（#275）
    display_name: "KBDB",
    description: "KBDB partner API \u2014 block \u8B80\u5BEB\uFF08static_key Bearer\uFF09\u3002kbdb_* recipe \u5171\u7528\u6B64\u628A auth\u3002",
    required_secrets: [
      {
        key: "kbdb_api_key",
        label: "KBDB API Key\uFF08\u81F3 arcrun \u53D6\u7D71\u4E00 API Key \u7576 credential\uFF09",
        help: "KBDB \u63A1 Supabase \u6A21\u5F0F\uFF1A\u8981\u7528 \u2192 \u53BB arcrun \u53D6\u7D71\u4E00 API Key \u7576\u6B64 credential",
        help_url: "https://arcrun.dev"
      }
    ],
    inject: {
      header: {
        Authorization: "Bearer {{secret.kbdb_api_key}}"
      }
    },
    created_at: now,
    updated_at: now
  },
  // ── Service Account 類（Google 家族，共用同一份 service_account_json）────────
  {
    kind: "auth_recipe",
    service: "google_sheets_sa",
    version: 1,
    primitive: "service_account",
    service_account_kind: "google_jwt",
    base_url: "https://sheets.googleapis.com/v4",
    display_name: "Google Sheets (Service Account)",
    description: "Google Sheets API \u2014 \u8A66\u7B97\u8868\u8B80\u5BEB\uFF08\u4F7F\u7528 Service Account\uFF09",
    token_exchange: {
      endpoint: "https://oauth2.googleapis.com/token",
      scopes: ["https://www.googleapis.com/auth/spreadsheets"]
    },
    required_secrets: GOOGLE_SA_SECRETS,
    inject: {
      header: {
        Authorization: "Bearer {{runtime.access_token}}"
      }
    },
    created_at: now,
    updated_at: now
  },
  {
    kind: "auth_recipe",
    service: "google_gmail_sa",
    version: 1,
    primitive: "service_account",
    service_account_kind: "google_jwt",
    base_url: "https://gmail.googleapis.com/gmail/v1",
    display_name: "Gmail (Service Account)",
    description: "Gmail API \u2014 \u767C\u9001\u90F5\u4EF6\uFF08\u4F7F\u7528 Service Account + Domain-Wide Delegation\uFF09",
    token_exchange: {
      endpoint: "https://oauth2.googleapis.com/token",
      scopes: ["https://www.googleapis.com/auth/gmail.send"]
    },
    required_secrets: GOOGLE_SA_SECRETS,
    inject: {
      header: {
        Authorization: "Bearer {{runtime.access_token}}"
      }
    },
    created_at: now,
    updated_at: now
  },
  {
    kind: "auth_recipe",
    service: "google_drive_sa",
    version: 1,
    primitive: "service_account",
    service_account_kind: "google_jwt",
    base_url: "https://www.googleapis.com/drive/v3",
    display_name: "Google Drive (Service Account)",
    description: "Google Drive API \u2014 \u6A94\u6848\u4E0A\u50B3\u3001\u4E0B\u8F09\u3001\u7BA1\u7406\uFF08\u4F7F\u7528 Service Account\uFF09",
    token_exchange: {
      endpoint: "https://oauth2.googleapis.com/token",
      scopes: ["https://www.googleapis.com/auth/drive"]
    },
    required_secrets: GOOGLE_SA_SECRETS,
    inject: {
      header: {
        Authorization: "Bearer {{runtime.access_token}}"
      }
    },
    created_at: now,
    updated_at: now
  }
];

// cypher-executor/src/lib/battery.ts
var PAID_PRICE_PER_MILLION_READ = 1e-3;
var PAID_PRICE_PER_MILLION_WRITTEN = 1;
var BATTERY_WARN_AT = 20;
var BATTERY_SAVER_AT = 10;
function num(n) {
  const v = typeof n === "number" ? n : Number(n);
  return Number.isFinite(v) ? v : 0;
}
function monthPaid(m) {
  if (!m) return null;
  const incR = num(m.paid_included_rows_read);
  const incW = num(m.paid_included_rows_written);
  if (incR <= 0 || incW <= 0) return null;
  const pr = num(m.rows_read) / incR * 100;
  const pw = num(m.rows_written) / incW * 100;
  const overR = Math.max(0, num(m.rows_read) - incR);
  const overW = Math.max(0, num(m.rows_written) - incW);
  const usd = overR / 1e6 * PAID_PRICE_PER_MILLION_READ + overW / 1e6 * PAID_PRICE_PER_MILLION_WRITTEN;
  return { used: Math.max(pr, pw), usd: Math.round(usd * 100) / 100 };
}
function computeBattery(input) {
  const paidMonth = monthPaid(input.month);
  const isPaid = paidMonth !== null && (input.brake_enabled === false || input.month?.exceeded_free_daily === true);
  const reset_at = (isPaid ? input.month?.next_reset_at : null) ?? input.reset_at ?? null;
  const rawUsed = isPaid ? paidMonth.used : Math.max(num(input.percent_written), num(input.percent_read));
  const used = Math.min(100, Math.max(0, rawUsed));
  const remaining = Math.round((100 - used) * 10) / 10;
  const plan = isPaid ? "paid" : "free";
  const basis = isPaid ? "month" : "day";
  const usd = isPaid ? paidMonth.usd : null;
  if (input.brake_enabled === false) {
    const billing = remaining <= 0;
    return {
      state: "nuclear",
      remaining_percent: remaining,
      billing,
      plan,
      basis,
      estimated_overage_usd: usd,
      warn: false,
      saver: false,
      message: billing && isPaid ? `\u672C\u6708\u5167\u542B\u984D\u5EA6\u5DF2\u7528\u5B8C\uFF0C\u8D85\u51FA\u7684\u90E8\u5206\u958B\u59CB\u8A08\u8CBB\uFF08\u76EE\u524D\u4F30\u8A08\u591A\u82B1\u7D04 US$${usd}\uFF09\u3002` : null,
      reset_at
    };
  }
  const where = "\u5230\u300C\u7BA1\u7406\u300D\u9801\u7684\u300C\u6BCF\u65E5\u984D\u5EA6\u524E\u8ECA\u300D\uFF0C\u6309\u300C\u653E\u884C\u300D\u6216\u95DC\u6389\u81EA\u52D5\u524E\u8ECA\u5373\u53EF\u4E0D\u518D\u53D7\u9650";
  const unit = isPaid ? "\u672C\u6708\u5167\u542B\u984D\u5EA6" : "\u4ECA\u5929\u7684\u514D\u8CBB\u984D\u5EA6";
  if (remaining <= 0) {
    return {
      state: "empty",
      remaining_percent: 0,
      billing: false,
      plan,
      basis,
      estimated_overage_usd: usd,
      warn: true,
      saver: true,
      reset_at,
      message: `${unit}\u7528\u5B8C\u4E86\uFF1A\u4E00\u822C\u5BEB\u5165\u66AB\u505C\uFF0C\u767B\u5165\u3001\u653E\u884C\u3001\u66F4\u65B0\u4ECD\u53EF\u4F7F\u7528\u3002${where}\u3002`
    };
  }
  if (remaining <= BATTERY_SAVER_AT) {
    return {
      state: "saver",
      remaining_percent: remaining,
      billing: false,
      plan,
      basis,
      estimated_overage_usd: usd,
      warn: true,
      saver: true,
      reset_at,
      message: `\u5269\u9918\u7528\u91CF\u53EA\u6709 ${remaining}%\uFF0C\u5DF2\u9032\u5165\u7701\u96FB\u6A21\u5F0F\uFF08\u80CC\u666F\u540C\u6B65\u653E\u6162\uFF09\uFF0C\u518D\u7528\u5B8C\u5C31\u6703\u66AB\u505C\u4E00\u822C\u5BEB\u5165\u3002${where}\u3002`
    };
  }
  if (remaining <= BATTERY_WARN_AT) {
    return {
      state: "warn20",
      remaining_percent: remaining,
      billing: false,
      plan,
      basis,
      estimated_overage_usd: usd,
      warn: true,
      saver: false,
      reset_at,
      message: `\u5269\u9918\u7528\u91CF ${remaining}%\uFF0C\u5FEB\u7528\u5B8C\u6642\u6703\u81EA\u52D5\u9032\u5165\u7701\u96FB\u6A21\u5F0F\u3002${where}\u3002`
    };
  }
  return { state: "normal", remaining_percent: remaining, billing: false, plan, basis, estimated_overage_usd: usd, warn: false, saver: false, message: null, reset_at };
}

// cypher-executor/src/routes/portal.ts
init_dist();
init_kbdb_proxy();

// cypher-executor/src/routes/console-auth.ts
init_dist();
init_tenant();
var consoleAuthRouter = new Hono2();
var SESSION_TEMPLATE2 = "console_session";
var SESSION_TTL_SECONDS2 = 30 * 24 * 60 * 60;
async function validateConsoleSession(env, authHeader) {
  const token = (authHeader ?? "").match(/^Bearer\s+(\S+)/i)?.[1];
  if (!token) return false;
  const sess = await ephemeralGet(env, { template: SESSION_TEMPLATE2, hashField: "token_hash", rawKey: token });
  return !!sess;
}
function randomHex(bytes) {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return Array.from(arr).map((b) => b.toString(16).padStart(2, "0")).join("");
}
async function sha256Hex4(input) {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
async function hashPassword(password, salt) {
  let h = `${salt}:${password}`;
  for (let i = 0; i < 3; i++) h = await sha256Hex4(h);
  return h;
}
function tenantOf(c) {
  return knowledgeOwner(c.env);
}
async function loadCredentials(env) {
  const creds = readAuthStore(env).console;
  return creds ? { creds, source: "secrets" } : { creds: null, source: "none" };
}
async function saveCredentials(env, record, tokenOverride) {
  await mutateAuthStore(env, (data) => {
    data.console = record;
  }, tokenOverride);
}
function callerCfToken(c) {
  return c.req.header("x-cf-secrets-token") || void 0;
}
function consoleAuthStoreStatus(env) {
  return {
    home: "workers-secrets",
    writable: authStoreWritable(env)
  };
}
consoleAuthRouter.get("/console/auth-status", async (c) => {
  const { creds, source } = await loadCredentials(c.env);
  return c.json({ configured: !!creds, credentials_source: source, auth_store: consoleAuthStoreStatus(c.env) });
});
consoleAuthRouter.post("/console/setup", async (c) => {
  const { creds: existing } = await loadCredentials(c.env);
  if (existing) {
    return c.json(
      {
        error: "\u9019\u53F0\u5BE6\u4F8B\u5DF2\u7D93\u6709\u7BA1\u7406\u54E1\u5E33\u5BC6\u4E86\uFF0C**\u4F60\u525B\u624D\u8F38\u5165\u7684\u5BC6\u78BC\u6C92\u6709\u88AB\u63A1\u7528**\uFF0C\u76EE\u524D\u7684\u5BC6\u78BC\u4ECD\u662F\u7576\u521D\u8A2D\u5B9A\u7684\u90A3\u4E00\u7D44\u3002\u8981\u7528\u820A\u5BC6\u78BC\u767B\u5165\uFF0C\u6216\u7528 /console/setup/reset\uFF08\u9700\u8981\u820A\u5BC6\u78BC\uFF09\u63DB\u4E00\u7D44\u3002",
        code: "already_configured",
        password_applied: false,
        reset_path: "/console/setup/reset"
      },
      409
    );
  }
  const body = await c.req.json().catch(() => null);
  const email = (body?.email ?? "").trim();
  const password = body?.password ?? "";
  if (!email || !password) return c.json({ error: "email \u8207 password \u5FC5\u586B" }, 400);
  if (password.length < 8) return c.json({ error: "\u5BC6\u78BC\u81F3\u5C11 8 \u78BC" }, 400);
  const salt = randomHex(16);
  const hash = await hashPassword(password, salt);
  const record = { email: email.toLowerCase(), salt, hash, created_at: (/* @__PURE__ */ new Date()).toISOString() };
  try {
    await saveCredentials(c.env, record, callerCfToken(c));
  } catch (e) {
    return c.json({ error: `\u5E33\u5BC6\u6C92\u6709\u5B58\u8D77\u4F86\uFF1A${e instanceof Error ? e.message : String(e)}`, code: "auth_store_not_writable" }, 502);
  }
  const token = randomHex(32);
  await ephemeralPut(c.env, {
    template: SESSION_TEMPLATE2,
    slots: ["created_at"],
    hashField: "token_hash",
    rawKey: token,
    values: { created_at: String(Date.now()) },
    ttlSeconds: SESSION_TTL_SECONDS2
  });
  return c.json({ success: true, session_token: token, tenant: tenantOf(c) });
});
consoleAuthRouter.post("/console/setup/reset", async (c) => {
  const { creds: existing } = await loadCredentials(c.env);
  if (!existing) return c.json({ error: "\u5C1A\u672A\u8A2D\u5B9A\u904E\uFF0C\u8ACB\u7528 /console/setup" }, 400);
  const body = await c.req.json().catch(() => null);
  const currentPassword = body?.current_password ?? "";
  const email = (body?.email ?? "").trim();
  const password = body?.password ?? "";
  if (!currentPassword || !email || !password) return c.json({ error: "current_password\u3001email\u3001password \u5FC5\u586B" }, 400);
  if (password.length < 8) return c.json({ error: "\u65B0\u5BC6\u78BC\u81F3\u5C11 8 \u78BC" }, 400);
  const currentHash = await hashPassword(currentPassword, existing.salt);
  if (currentHash !== existing.hash) return c.json({ error: "\u820A\u5BC6\u78BC\u4E0D\u6B63\u78BA" }, 401);
  const salt = randomHex(16);
  const hash = await hashPassword(password, salt);
  const record = { email: email.toLowerCase(), salt, hash, created_at: existing.created_at };
  try {
    await saveCredentials(c.env, record, callerCfToken(c));
  } catch (e) {
    return c.json({ error: `\u65B0\u5E33\u5BC6\u6C92\u6709\u5B58\u8D77\u4F86\uFF1A${e instanceof Error ? e.message : String(e)}`, code: "auth_store_not_writable" }, 502);
  }
  return c.json({ success: true });
});
function consolePropagating(c) {
  return c.json(
    {
      error: "\u5E33\u865F\u8CC7\u6599\u525B\u525B\u66F4\u65B0\u904E\uFF0C\u9019\u53F0\u4F3A\u670D\u5668\u9084\u5728\u540C\u6B65\u4E2D\u2014\u2014\u8ACB\u7B49 10\uFF5E30 \u79D2\u518D\u767B\u5165\u4E00\u6B21\uFF08\u9019\u4E0D\u662F\u5BC6\u78BC\u932F\uFF09\u3002",
      code: "auth_store_propagating"
    },
    503
  );
}
consoleAuthRouter.post("/console/login", async (c) => {
  const { creds: existing } = await loadCredentials(c.env);
  if (!existing) {
    if (await authStoreStaleHere(c.env)) return consolePropagating(c);
    return c.json(
      {
        error: "\u9019\u53F0\u5BE6\u4F8B\u9084\u6C92\u6709\u7BA1\u7406\u54E1\u5E33\u5BC6\uFF08\u6216\u8B80\u4E0D\u5230\uFF09\u2014\u2014\u4E0D\u662F\u5BC6\u78BC\u932F\u3002\u8ACB\u5148\u5B8C\u6210\u9996\u6B21\u8A2D\u5B9A\u3002",
        code: "auth_store_empty",
        auth_store: consoleAuthStoreStatus(c.env)
      },
      400
    );
  }
  const body = await c.req.json().catch(() => null);
  const email = (body?.email ?? "").trim().toLowerCase();
  const password = body?.password ?? "";
  if (!email || !password) return c.json({ error: "email \u8207 password \u5FC5\u586B" }, 400);
  const hash = await hashPassword(password, existing.salt);
  if (email !== existing.email || hash !== existing.hash) {
    if (await authStoreStaleHere(c.env)) return consolePropagating(c);
    return c.json({ error: "email \u6216\u5BC6\u78BC\u932F\u8AA4" }, 401);
  }
  const token = randomHex(32);
  await ephemeralPut(c.env, {
    template: SESSION_TEMPLATE2,
    slots: ["created_at"],
    hashField: "token_hash",
    rawKey: token,
    values: { created_at: String(Date.now()) },
    ttlSeconds: SESSION_TTL_SECONDS2
  });
  return c.json({ success: true, session_token: token, tenant: tenantOf(c) });
});
consoleAuthRouter.get("/console/session", async (c) => {
  const auth = c.req.header("authorization") ?? "";
  const token = auth.match(/^Bearer\s+(\S+)/i)?.[1];
  if (!token) return c.json({ valid: false }, 401);
  const sess = await ephemeralGet(c.env, { template: SESSION_TEMPLATE2, hashField: "token_hash", rawKey: token });
  if (!sess) return c.json({ valid: false }, 401);
  return c.json({ valid: true, tenant: tenantOf(c) });
});
consoleAuthRouter.post("/console/logout", async (c) => {
  const auth = c.req.header("authorization") ?? "";
  const token = auth.match(/^Bearer\s+(\S+)/i)?.[1];
  if (token) await ephemeralDelete(c.env, { template: SESSION_TEMPLATE2, hashField: "token_hash", rawKey: token });
  return c.json({ success: true });
});

// cypher-executor/src/lib/portal-auth.ts
var PBKDF2_ALGO_PREFIX = "pbkdf2-sha256";
var PBKDF2_ITERATIONS = 1e5;
function b64encode(bytes) {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}
function b64decode(s) {
  try {
    const bin = atob(s);
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  } catch {
    return null;
  }
}
async function deriveBits(password, salt, iterations) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, [
    "deriveBits"
  ]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt, iterations },
    key,
    256
  );
  return new Uint8Array(bits);
}
function constantTimeEqual(a, b) {
  const ab = new TextEncoder().encode(a);
  const bb = new TextEncoder().encode(b);
  let diff = ab.length ^ bb.length;
  const len = Math.max(ab.length, bb.length);
  for (let i = 0; i < len; i++) {
    diff |= (ab[i] ?? 0) ^ (bb[i] ?? 0);
  }
  return diff === 0;
}
async function hashPassword2(password, iterations = PBKDF2_ITERATIONS) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await deriveBits(password, salt, iterations);
  return `${PBKDF2_ALGO_PREFIX}$${iterations}$${b64encode(salt)}$${b64encode(hash)}`;
}
async function verifyPassword(password, stored) {
  const parts = (stored ?? "").split("$");
  if (parts.length !== 4 || parts[0] !== PBKDF2_ALGO_PREFIX) return false;
  const iterations = Number.parseInt(parts[1], 10);
  if (!Number.isFinite(iterations) || iterations < 1 || iterations > 1e7) return false;
  const salt = b64decode(parts[2]);
  if (!salt || salt.length === 0) return false;
  const derived = await deriveBits(password, salt, iterations);
  return constantTimeEqual(b64encode(derived), parts[3]);
}
function randomHex2(bytes) {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return Array.from(arr).map((b) => b.toString(16).padStart(2, "0")).join("");
}
async function sha256Hex5(input) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
function generatePassword(length = 16) {
  const charset = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  const arr = new Uint8Array(length);
  crypto.getRandomValues(arr);
  let out = "";
  for (const b of arr) out += charset[b % charset.length];
  return out;
}

// cypher-executor/src/lib/mcp-redirect-hosts.ts
var MCP_BUILTIN_REDIRECT_HOSTS = ["claude.ai", "claude.com", "anthropic.com"];
var MCP_REDIRECT_HOST_TEMPLATE = "portal_mcp_redirect_host";
function normalizeRedirectHost(input) {
  const raw2 = String(input ?? "").trim();
  if (!raw2) return { ok: false, error: "\u8ACB\u586B\u5165\u7DB2\u5740\u6216\u7DB2\u57DF\uFF08\u4F8B\u5982 n8n.example.com\uFF09" };
  let host = raw2.toLowerCase();
  if (host.includes("://")) {
    let u;
    try {
      u = new URL(raw2);
    } catch {
      return { ok: false, error: `\u770B\u4E0D\u61C2\u9019\u500B\u7DB2\u5740\uFF1A${raw2}` };
    }
    if (u.protocol !== "https:" && u.protocol !== "http:") {
      return { ok: false, error: "\u53EA\u6536 https:// \u958B\u982D\u7684\u7DB2\u5740\uFF08\u672C\u6A5F\u6E2C\u8A66\u53EF\u7528 localhost\uFF09" };
    }
    host = u.hostname.toLowerCase();
  } else {
    host = host.split("/")[0].split("?")[0];
    if (host.includes("@")) return { ok: false, error: "\u8ACB\u4E0D\u8981\u5E36\u5E33\u865F\u5BC6\u78BC\uFF0C\u53EA\u8981\u7DB2\u57DF\u5C31\u597D" };
    if (host.startsWith("[")) return { ok: false, error: "\u4E0D\u652F\u63F4 IPv6 \u4F4D\u5740\uFF0C\u672C\u6A5F\u6E2C\u8A66\u8ACB\u586B localhost" };
    host = host.split(":")[0];
  }
  if (!host) return { ok: false, error: "\u8ACB\u586B\u5165\u7DB2\u5740\u6216\u7DB2\u57DF\uFF08\u4F8B\u5982 n8n.example.com\uFF09" };
  if (!/^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/.test(host)) {
    return { ok: false, error: `\u300C${raw2}\u300D\u4E0D\u662F\u5408\u6CD5\u7684\u7DB2\u57DF\u3002\u4E0D\u63A5\u53D7\u842C\u7528\u5B57\u5143\uFF0C\u8ACB\u586B\u78BA\u5207\u7684\u7DB2\u57DF` };
  }
  const isLocal = host === "localhost" || host === "127.0.0.1";
  if (!isLocal && !host.includes(".")) {
    return { ok: false, error: `\u300C${host}\u300D\u770B\u8D77\u4F86\u4E0D\u662F\u5B8C\u6574\u7DB2\u57DF\uFF08\u5C11\u4E86 .com \u4E4B\u985E\u7684\u7D50\u5C3E\uFF09` };
  }
  if (host.length > 253) return { ok: false, error: "\u7DB2\u57DF\u592A\u9577" };
  if (!isLocal && host.split(".").length < 2) {
    return { ok: false, error: `\u300C${host}\u300D\u7BC4\u570D\u592A\u5927\uFF0C\u8ACB\u586B\u5B8C\u6574\u7DB2\u57DF` };
  }
  if (MCP_BUILTIN_REDIRECT_HOSTS.some((h) => host === h || host.endsWith("." + h))) {
    return { ok: false, error: `\u300C${host}\u300D\u662F\u5167\u5EFA\u5C31\u5141\u8A31\u7684\u7DB2\u57DF\uFF08Claude \u5B98\u65B9\uFF09\uFF0C\u4E0D\u5FC5\u518D\u52A0\u4E00\u6B21` };
  }
  return { ok: true, host };
}
function mcpUrlFor(subdomain) {
  const sub = String(subdomain ?? "").trim();
  if (!sub) return "";
  return `https://arcrun-mcp.${sub}.workers.dev/mcp`;
}

// cypher-executor/src/routes/portal.ts
init_endpoints();

// cypher-executor/src/lib/mcp-token-ttl.ts
var NEVER_EXPIRES_SECONDS = 0;
var DEFAULT_TOKEN_TTL_SECONDS = NEVER_EXPIRES_SECONDS;
var MIN_TOKEN_TTL_SECONDS = 3600;
var MAX_TOKEN_TTL_SECONDS = 31536e4;
var MCP_TOKEN_TTL_TEMPLATE = "portal_mcp_token_ttl";
function normalizeTokenTtl(input) {
  let n;
  if (typeof input === "number") {
    n = input;
  } else if (typeof input === "string" && input.trim() !== "") {
    n = Number(input.trim());
  } else {
    return { ok: false, error: "\u8ACB\u586B\u5165 token \u6709\u6548\u79D2\u6578\uFF08\u6B63\u6574\u6578\uFF09" };
  }
  if (!Number.isFinite(n)) return { ok: false, error: `\u300C${String(input)}\u300D\u4E0D\u662F\u6709\u6548\u7684\u79D2\u6578` };
  n = Math.floor(n);
  if (n === NEVER_EXPIRES_SECONDS) return { ok: true, seconds: NEVER_EXPIRES_SECONDS, clamped: false };
  if (n < 0) return { ok: false, error: "token \u6709\u6548\u79D2\u6578\u4E0D\u80FD\u662F\u8CA0\u6578" };
  const clamped = n < MIN_TOKEN_TTL_SECONDS || n > MAX_TOKEN_TTL_SECONDS;
  const seconds = Math.min(Math.max(n, MIN_TOKEN_TTL_SECONDS), MAX_TOKEN_TTL_SECONDS);
  return { ok: true, seconds, clamped };
}

// cypher-executor/src/lib/portal-seeds.ts
var PORTAL_TEMPLATE_SEEDS = [
  {
    // design §2.1：portal 同仁帳號。password_hash 存 KDF 輸出（pbkdf2-sha256$…，D-6），
    // 永不存明碼；libraries 是 JSON array 字串（["general"] / ["*"]＝全庫）。
    name: "portal_user",
    description: "RAG Portal \u540C\u4EC1\u5E33\u865F\uFF08portal-auth \xA72.1\uFF1B\u8CC7\u6599\u5BEB {tenant}::portal \u5B50 namespace\uFF09",
    slots: ["email", "display_name", "status", "role", "password_hash", "libraries", "created_at", "updated_at"],
    created_by: "system"
  },
  {
    // design §3.2：庫目錄（admin 頁列庫用）。庫本體＝知識條目 metadata_json.$.library 標記，
    // 這裡只是「有哪些庫」的登記簿。
    // graph_source（design D-4，P3）：'true'＝此庫是知識圖譜的萃取來源——graph 粗閘按
    // 「用戶是否擁有 graph 來源庫權限」放行。**沒有任何庫標記時預設視同 general**（D-4 定案）。
    // root / mode / reason（InkStoneCo#44，2026-08-17）：**一個庫＝地端的一個資料夾**，
    // 而在此之前雲端只記得住它的名字，於是「資料夾」在雲端不是一個持久物件——
    // 它是「有卡片才有庫」的副作用（arcrun-rag#106 實測：空資料夾指定了，雲端什麼都不出現）。
    // leo：「**不能因為地端資料夾內沒東西就當作不存在，如果那是他打算放東西的資料夾呢？**」
    // ⇒ 小幫手一報上來就登記，不必等到有卡片。
    //   root＝地端絕對路徑（使用者認得回去的那條路）
    //   mode＝收檔策略（all／curated-wiki／docs-only，地端 IngestPlan 決定）
    //   reason＝那句人話（「為什麼只收這些」）
    // 🔴 這三個是**欄位、不是 JSON 團**（D91）：它們是「資料夾」這個物件本身的屬性。
    //    每輪會變的計數（同步數／總數／整棵樹）**不住在這裡**——那是投影，
    //    見 portal.ts 的 folderTreeKey() 與那段「為什麼樹不進 KBDB」的說明。
    // 既有實例靠 ensurePortalTemplates 的「補 slots」路徑自動補上（同 P3 加 graph_source 那次）。
    name: "portal_library",
    description: "RAG Portal \u5EAB\u76EE\u9304\u767B\u8A18\uFF08portal-auth \xA73.2\uFF1B\u4E00\u500B\u5EAB\uFF1D\u5C0F\u5E6B\u624B\u770B\u5B88\u7684\u4E00\u500B\u8CC7\u6599\u593E\uFF09",
    slots: ["name", "display_name", "description", "status", "graph_source", "root", "mode", "reason"],
    created_by: "system"
  },
  {
    // `inkstone/Arcrun#164`：「哪些網址可以接我的 MCP」——一個網域一筆 record。
    // 為什麼是 record 而不是一個字串設定：加了誰要留得下痕跡（本票紅線第三條），
    // 而「誰在什麼時候加的」是這個物件本身的屬性，不是一團 JSON（D91 同一條）。
    //   host       ＝ 已正規化的小寫網域（lib/mcp-redirect-hosts.ts normalizeRedirectHost）
    //   label      ＝ 使用者自己認得的名字（「我的 n8n」），純顯示用
    //   created_at ＝ ISO 時間字串
    //   created_by ＝ 加它的那個 portal 帳號 email
    // 🔴 不寫 KV（leo 2026-08-25 已禁長效用途），也不加 D1 表——這是 KBDB 萬用表的 template。
    name: "portal_mcp_redirect_host",
    description: "MCP OAuth \u5141\u8A31\u7684 redirect \u7DB2\u57DF\uFF08Arcrun#164\uFF1B\u4E00\u500B\u7DB2\u57DF\u4E00\u7B46\uFF0C\u53EF\u52A0\u53EF\u6536\u56DE\uFF09",
    slots: ["host", "label", "created_at", "created_by"],
    created_by: "system"
  },
  {
    // `inkstone/Arcrun#19`：MCP access_token 的 TTL 交由用戶決定（風險偏好，非技術常數）。
    // 一台實例一筆設定（純量，不是清單）——**鏡像上面 portal_mcp_redirect_host 那條路**
    // （KBDB template ＋ 給 mcp 讀的內部端點），不自創第二套機制（D36）。
    //   ttl_seconds ＝ 已正規化並夾進 [1h, 30d] 的秒數（lib/mcp-token-ttl.ts）
    //   updated_at  ＝ ISO 時間字串
    //   updated_by  ＝ 改它的那個 portal admin email（改了誰要留得下痕跡，D91 同一條）
    // 讀不到／沒設過 → mcp 回退 env MCP_TOKEN_TTL 預設（誠實回退，不假綠）。
    // 🔴 不寫 KV（長效設定，leo 2026-08-25 已禁 KV 長效用途），也不加 D1 表——KBDB 萬用表 template。
    name: "portal_mcp_token_ttl",
    description: "MCP OAuth access_token \u6709\u6548\u79D2\u6578\uFF08Arcrun#19\uFF1B\u4E00\u53F0\u5BE6\u4F8B\u4E00\u7B46\uFF0C\u8B80\u4E0D\u5230\u56DE\u9000 env \u9810\u8A2D\uFF09",
    slots: ["ttl_seconds", "updated_at", "updated_by"],
    created_by: "system"
  },
  {
    // inkstone/Arcrun#277：這台雲端的萃取 AI 由管理員選（每種 AI 一份 recipe，見 api-recipe-seeds）。
    // 一台雲端一筆設定（純量，鏡像 portal_mcp_token_ttl 那條路）；**每台雲端各一份，不跨租戶共用**。
    //   recipe     ＝ extract_ai_workers_ai｜extract_ai_openai_compat
    //   base_url   ＝ OpenAI 相容端點根網址（Workers AI 不用）
    //   model      ＝ 模型名（Workers AI 不填＝recipe 預設）
    //   updated_at／updated_by ＝ 誰在什麼時候改的
    // 金鑰**不在這裡**：只存在 credential 中心（名字 extract_ai_api_key），這筆 record 永遠沒有值。
    // 🔴 不寫 KV、不加 D1 表——KBDB 萬用表 template。
    name: "portal_extract_ai",
    description: "\u9019\u53F0\u96F2\u7AEF\u8403\u53D6\u7528\u7684 AI \u8A2D\u5B9A\uFF08Arcrun#277\uFF1B\u4E00\u53F0\u96F2\u7AEF\u4E00\u7B46\uFF0C\u8B80\u4E0D\u5230\uFF1DCF Workers AI \u9810\u8A2D\uFF09",
    slots: ["recipe", "base_url", "model", "updated_at", "updated_by"],
    created_by: "system"
  },
  {
    // t130：rag_ingest_card.post_triplet 寫 POST /records {template:'triplet'}。
    // 新實例若無此 template 回 400「template not found: triplet」→ 三元組全滅。
    // slots 來源：kbdb_list_templates 核實（2026-07-19，library-map.test.ts PROD_TRIPLET_SLOTS）
    // + library（library-map.ts M1 預案：recompute 歸庫用，ensurePortalTemplates 若缺則 PATCH 補入）。
    // + machine（`inkstone/mira#6`，leo 2026-08-18 拍板「掛上資料夾至少先給一個 ID，
    //   例如 youlinhsieh@Leo-MBA」）：這則知識的原稿**在哪一台機器上**。
    //   為什麼三元組也要有這一格（而不是只放在 block 的 metadata）：`source_uri` 只到
    //   「相對於被監看資料夾的路徑」為止，兩台機器上的 `RFP/design.md` 完全同名 ⇒
    //   rag_ingest_card 的 upsert（先照鍵刪光再寫）會把另一台的三元組無聲刪掉。
    //   machine 是唯一分得開它們的那一維，而 KBDB 會**靜默丟掉** template 沒宣告的 slot
    //   （record-crud.ts createRecord），所以少了這一列，daemon 送上來的值等於沒送。
    //   走的就是 library 當初那條路：加在這裡，ensurePortalTemplates 對既有實例 PATCH 補聯集。
    name: "triplet",
    description: "KBDB \u77E5\u8B58\u5716\u8B5C\u4E09\u5143\u7D44\uFF08kbdb-graph-plugin \u5BEB\u5165\uFF1Bportal \u8B80\u6B64 template \u5EFA\u9130\u63A5\u5716\uFF09",
    slots: [
      "subject",
      "predicate",
      "object",
      "source_block_id",
      "confidence",
      "clusters_json",
      "bridge_score",
      "subject_entity_type",
      "object_entity_type",
      "status",
      "superseded_by",
      "source_uri",
      "content_hash",
      "source_anchor",
      "predicate_embed",
      "library",
      "machine"
    ],
    created_by: "system"
  }
];

// cypher-executor/src/lib/extract-ai.ts
init_recipe_payload();
init_auth_dispatcher();
init_recipes();
var EXTRACT_AI_TEMPLATE = "portal_extract_ai";
var DEFAULT_EXTRACT_AI_RECIPE = "extract_ai_workers_ai";
var EXTRACT_AI_RECIPE_IDS = ["extract_ai_workers_ai", "extract_ai_openai_compat"];
var EXTRACT_AI_CREDENTIAL = "extract_ai_api_key";
var DEFAULT_EXTRACT_AI_CONFIG = { recipe: DEFAULT_EXTRACT_AI_RECIPE };
function validateExtractAiConfig(raw2) {
  if (!raw2 || typeof raw2 !== "object") return { ok: false, error: "body \u5FC5\u9808\u662F JSON \u7269\u4EF6" };
  const o = raw2;
  const recipe = typeof o.recipe === "string" ? o.recipe.trim() : "";
  if (!EXTRACT_AI_RECIPE_IDS.includes(recipe)) {
    return { ok: false, error: `recipe \u5FC5\u9808\u662F ${EXTRACT_AI_RECIPE_IDS.join(" \u6216 ")}` };
  }
  const config = { recipe };
  const model = typeof o.model === "string" ? o.model.trim() : "";
  if (model) config.model = model;
  if (recipe === "extract_ai_openai_compat") {
    const baseUrl = typeof o.base_url === "string" ? o.base_url.trim().replace(/\/+$/, "") : "";
    if (!baseUrl) return { ok: false, error: "OpenAI \u76F8\u5BB9\u7AEF\u9EDE\u5FC5\u9808\u586B base_url\uFF08\u4F8B http://ollama.internal:11434\uFF09" };
    let u;
    try {
      u = new URL(baseUrl);
    } catch {
      return { ok: false, error: "base_url \u4E0D\u662F\u5408\u6CD5\u7DB2\u5740" };
    }
    if (u.protocol !== "http:" && u.protocol !== "https:") {
      return { ok: false, error: "base_url \u53EA\u63A5\u53D7 http\uFF0Fhttps" };
    }
    if (!model) return { ok: false, error: "OpenAI \u76F8\u5BB9\u7AEF\u9EDE\u5FC5\u9808\u586B model\uFF08\u4F8B llama3.1:70b\uFF09" };
    config.base_url = baseUrl;
  }
  return { ok: true, config };
}
async function loadRecipe(env, id) {
  if (id !== DEFAULT_EXTRACT_AI_RECIPE && env.RECIPES) {
    const installed = await resolveRecipe(id, env.RECIPES).catch(() => null);
    if (installed) return installed;
  }
  return API_RECIPE_SEEDS.find((s) => s.canonical_id === id) ?? null;
}
function renderPayload(template, ctx) {
  const rendered = renderBodyTemplate(template, ctx);
  const out = {};
  for (const [k, v] of Object.entries(rendered ?? {})) {
    if (typeof v === "string" && /^\s*\{\{[\w.]+\}\}\s*$/.test(v)) continue;
    out[k] = v;
  }
  return out;
}
var WORKERS_AI_MAX_ATTEMPTS = 3;
var TRANSIENT_WORKERS_AI_CODES = /\b(4007|4002)\b/;
function isTransientWorkersAiError(message) {
  return TRANSIENT_WORKERS_AI_CODES.test(message);
}
function workersAiBackoffMs(attempt, rand = Math.random) {
  return (attempt === 1 ? 1e3 : 3e3) + Math.floor(rand() * 250);
}
var sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function runExtractAi(env, tenant2, config, req) {
  const recipe = await loadRecipe(env, config.recipe);
  if (!recipe) {
    return { ok: false, code: "ai_recipe_missing", error: `\u627E\u4E0D\u5230\u8403\u53D6 AI recipe\u300C${config.recipe}\u300D` };
  }
  const ctx = {
    messages: [{ role: "user", content: req.prompt }],
    max_tokens: req.maxTokens,
    temperature: req.temperature ?? 0.2,
    ...req.jsonObject ? { response_format: { type: "json_object" } } : {},
    ...config.base_url ? { base_url: config.base_url } : {},
    ...config.model ? { model: config.model } : {}
  };
  const payload = renderPayload(recipe.body_template ?? {}, ctx);
  if (recipe.auth === "binding") {
    const name = recipe.binding_name ?? "AI";
    const binding = env[name];
    if (!binding || typeof binding.run !== "function") {
      return { ok: false, code: "ai_binding_missing", error: `\u9019\u500B\u90E8\u7F72\u6C92\u6709\u7D81\u5B9A ${name}` };
    }
    const model2 = config.model || recipe.endpoint;
    let lastError = "";
    for (let attempt = 1; attempt <= WORKERS_AI_MAX_ATTEMPTS; attempt++) {
      try {
        return { ok: true, out: await binding.run(model2, payload), model: model2, provider: recipe.canonical_id };
      } catch (e) {
        lastError = e instanceof Error ? e.message : String(e);
        if (!isTransientWorkersAiError(lastError) || attempt === WORKERS_AI_MAX_ATTEMPTS) break;
        await sleep(workersAiBackoffMs(attempt));
      }
    }
    return { ok: false, code: "ai_failed", error: `Workers AI \u57F7\u884C\u5931\u6557\uFF1A${lastError}` };
  }
  const url = String(renderBodyTemplate(recipe.endpoint, ctx) ?? "");
  if (!/^https?:\/\//.test(url)) {
    return { ok: false, code: "ai_failed", error: `\u8403\u53D6 AI \u7AEF\u9EDE\u7DB2\u5740\u4E0D\u5B8C\u6574\uFF08${url}\uFF09\u2014\u2014\u7BA1\u7406\u54E1\u5C1A\u672A\u8A2D\u5B9A base_url\uFF1F` };
  }
  const headers = { "Content-Type": "application/json" };
  const recipeHeaders = recipe.headers ?? {};
  for (const [k, v] of Object.entries(recipeHeaders)) {
    const names = [...v.matchAll(/\{\{credential\.([\w-]+)\}\}/g)].map((m) => m[1]);
    if (names.length === 0) {
      headers[k] = v;
      continue;
    }
    const secrets = await resolveSecretsFromNewHome(env, tenant2, names);
    if (names.every((n) => secrets[n])) {
      headers[k] = v.replace(/\{\{credential\.([\w-]+)\}\}/g, (_m, n) => secrets[n]);
    }
  }
  const model = String(payload.model ?? config.model ?? "");
  try {
    const res = await fetch(url, {
      method: (recipe.method ?? "POST").toUpperCase(),
      headers,
      body: JSON.stringify(payload)
    });
    const text = await res.text();
    if (!res.ok) {
      return { ok: false, code: "ai_failed", error: `\u8403\u53D6 AI \u7AEF\u9EDE\u56DE ${res.status}\uFF1A${text.slice(0, 200)}` };
    }
    let json;
    try {
      json = JSON.parse(text);
    } catch {
      return { ok: false, code: "ai_failed", error: `\u8403\u53D6 AI \u7AEF\u9EDE\u56DE\u7684\u4E0D\u662F JSON\uFF1A${text.slice(0, 120)}` };
    }
    return { ok: true, out: json, model, provider: recipe.canonical_id };
  } catch (e) {
    return { ok: false, code: "ai_failed", error: `\u8403\u53D6 AI \u7AEF\u9EDE\u9023\u4E0D\u4E0A\uFF1A${e instanceof Error ? e.message : String(e)}` };
  }
}

// cypher-executor/src/routes/portal.ts
init_tenant();
init_credentials();
init_kbdb_caller();

// cypher-executor/src/lib/ai-response.ts
function pickChatContent(o) {
  const choices = o.choices;
  if (!Array.isArray(choices) || choices.length === 0) return void 0;
  const first = choices[0];
  if (!first || typeof first !== "object") return void 0;
  const msg = first.message;
  if (!msg || typeof msg !== "object") return void 0;
  const content = msg.content;
  return typeof content === "string" && content.length > 0 ? content : void 0;
}
function pickResponseValue(out) {
  if (out === null || out === void 0) return void 0;
  if (typeof out === "string") return out;
  if (typeof out !== "object") return out;
  const o = out;
  const chat = pickChatContent(o);
  if (chat !== void 0) return chat;
  if ("response" in o) return o.response;
  const result = o.result;
  if (result && typeof result === "object") {
    const r = result;
    const rc = pickChatContent(r);
    if (rc !== void 0) return rc;
    if ("response" in r) return r.response;
  }
  return void 0;
}
function normalizeAiText(out) {
  const v = pickResponseValue(out);
  if (v === null || v === void 0) return { text: "", kind: "empty" };
  if (typeof v === "string") return { text: v.trim(), kind: v.trim() ? "string" : "empty" };
  if (typeof v === "number" || typeof v === "boolean" || typeof v === "bigint") {
    return { text: String(v), kind: "scalar" };
  }
  if (typeof v === "object") {
    try {
      const s = JSON.stringify(v);
      if (typeof s !== "string") {
        return { text: "", kind: "unrenderable", reason: "JSON.stringify \u56DE undefined" };
      }
      return { text: s, kind: "json" };
    } catch (e) {
      return {
        text: "",
        kind: "unrenderable",
        reason: e instanceof Error ? e.message : "\u7121\u6CD5\u5E8F\u5217\u5316"
      };
    }
  }
  return { text: "", kind: "unrenderable", reason: `\u672A\u9810\u671F\u7684\u578B\u5225 ${typeof v}` };
}
function parseExpectShape(raw2, hasPrompt) {
  const s = String(raw2 ?? "").trim();
  if (s === "json_object" || s === "text") return s;
  return hasPrompt ? "json_object" : "text";
}
function hasJsonObject(text) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start < 0 || end <= start) return { ok: false, reason: "\u6574\u6BB5\u56DE\u61C9\u88E1\u627E\u4E0D\u5230 JSON \u7269\u4EF6\uFF08\u6C92\u6709\u6210\u5C0D\u7684\u5927\u62EC\u865F\uFF09" };
  try {
    const parsed = JSON.parse(text.slice(start, end + 1));
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return { ok: false, reason: "\u5927\u62EC\u865F\u88E1\u7684\u5167\u5BB9\u4E0D\u662F JSON \u7269\u4EF6" };
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, reason: `JSON \u89E3\u6790\u5931\u6557\uFF1A${e instanceof Error ? e.message : "\u672A\u77E5\u932F\u8AA4"}` };
  }
}
function snippetForError(text, max = 120) {
  const one = text.replace(/\s+/g, " ").trim();
  if (!one) return "\uFF08\u7A7A\u7684\uFF09";
  return one.length <= max ? one : one.slice(0, max) + "\u2026";
}

// cypher-executor/src/lib/portal-error-catalog.ts
var PORTAL_ERRORS = {
  config_not_loaded: {
    http_status: 500,
    title: "\u9019\u500B\u9801\u9762\u8F09\u5165\u4E0D\u5230\u5B83\u7684\u8A2D\u5B9A",
    message: "\u9019\u500B\u9801\u9762\u6C92\u6709\u8F09\u5165\u5230\u9023\u7DDA\u8A2D\u5B9A\uFF0C\u6240\u4EE5\u9023\u4E0D\u5230\u4F60\u7684\u670D\u52D9\u3002\u8ACB\u5148\u91CD\u65B0\u6574\u7406\u4E00\u6B21\uFF1B\u5982\u679C\u9084\u662F\u4E00\u6A23\uFF0C\u8ACB\u628A\u9019\u500B\u932F\u8AA4\u78BC\u63D0\u4F9B\u7D66\u67B6\u8A2D\u9019\u53F0\u5BE6\u4F8B\u7684\u4EBA\uFF0C\u6216\u8CBC\u7D66\u4F60\u81EA\u5DF1\u7684 AI \u52A9\u624B\u3002",
    advanced: "\u524D\u7AEF\u8F09\u5165\u4E0D\u5230 config.js \u7684 apiBase\uFF08window.ARCRUN_CONFIG.apiBase \u7A7A\u503C\uFF09\u2014\u2014\u901A\u5E38\u662F UI worker \u7F3A WORKER_SUBDOMAIN\uFF0FapiBase \u6C92\u88AB\u6CE8\u5165\u3002",
    why: "Portal \u7DB2\u9801\u9700\u8981\u4E00\u4EFD\u8A2D\u5B9A\u6A94\uFF08config.js\uFF09\u624D\u77E5\u9053\u8981\u9023\u5230\u54EA\u4E00\u53F0 cypher \u670D\u52D9\u3002\u9019\u4EFD\u8A2D\u5B9A\u662F\u5B89\u88DD\uFF0F\u90E8\u7F72 UI \u6642\u7522\u751F\u7684\uFF1B\u5982\u679C\u5B83\u7F3A\u4E86\uFF0C\u7DB2\u9801\u5C31\u6703\u9023\u4E0D\u5230\u5F8C\u7AEF\u2014\u2014\u9019\u6642\u5B83\u6703\u660E\u767D\u5730\u8AAA\u51FA\u4F86\uFF0C\u800C\u4E0D\u662F\u975C\u9ED8\u5730\u7576\u6389\u3002",
    operator: "\u78BA\u8A8D UI worker \u6709\u8A2D WORKER_SUBDOMAIN\u3001\u4E14 config.js \u7684 apiBase \u6307\u5230\u6B63\u78BA\u7684 cypher-executor \u4F4D\u5740\uFF0C\u91CD\u65B0\u90E8\u7F72 UI \u5F8C\u91CD\u65B0\u6574\u7406\u3002"
  },
  tenant_unresolved: {
    http_status: 500,
    title: "\u9019\u53F0\u5BE6\u4F8B\u9084\u6C92\u8A2D\u5B9A\u597D\u77E5\u8B58\u7684\u5B58\u653E\u4F4D\u7F6E",
    message: "\u9019\u53F0 Arcrun \u5BE6\u4F8B\u9084\u4E0D\u77E5\u9053\u8981\u53BB\u54EA\u88E1\u627E\u4F60\u7684\u77E5\u8B58\u8CC7\u6599\uFF0C\u6240\u4EE5\u66AB\u6642\u6253\u4E0D\u958B\u3002\u9019\u901A\u5E38\u662F\u5B89\u88DD\u6216\u66F4\u65B0\u6C92\u6709\u5B8C\u5168\u8DD1\u5B8C\u9020\u6210\u7684\uFF0C\u4E0D\u662F\u4F60\u64CD\u4F5C\u932F\u8AA4\u3002\u8ACB\u628A\u4E0B\u9762\u7684\u932F\u8AA4\u78BC\u63D0\u4F9B\u7D66\u67B6\u8A2D\u9019\u53F0\u5BE6\u4F8B\u7684\u4EBA\uFF0C\u6216\u8CBC\u7D66\u4F60\u81EA\u5DF1\u7684 AI \u52A9\u624B\uFF0C\u4F9D\u8AAA\u660E\u9801\u8655\u7406\u5373\u53EF\u3002",
    advanced: "\u9019\u500B\u90E8\u7F72\u6C92\u6709\u77E5\u8B58\u547D\u540D\u7A7A\u9593\uFF08\u74B0\u5883\u8B8A\u6578 ARCRUN_NAMESPACE / CONSOLE_TENANT \u90FD\u6C92\u8A2D\uFF09\uFF0C\u56E0\u6B64\u7121\u6CD5\u6C7A\u5B9A\u8981\u7528\u54EA\u500B owner_id \u53BB KBDB \u53D6\u8CC7\u6599\u3002",
    why: "Arcrun \u7528\u4E00\u500B\u300C\u547D\u540D\u7A7A\u9593\u300D\u628A\u4F60\u7684\u77E5\u8B58\u8CC7\u6599\u5708\u5728\u4E00\u8D77\u3002\u5B89\u88DD\uFF0F\u66F4\u65B0\u6642\uFF0C\u9019\u500B\u503C\u6703\u5F9E\u4F60\u7684 ~/.arcrun/config.yaml \u81EA\u52D5\u6CE8\u5165\u5230\u5BE6\u4F8B\u4E0A\u3002\u5982\u679C\u5B89\u88DD\u6216\u66F4\u65B0\u6C92\u8DD1\u5B8C\uFF0C\u9019\u500B\u503C\u5C31\u6703\u7F3A\uFF0C\u5BE6\u4F8B\u5C31\u4E0D\u77E5\u9053\u8A72\u53BB\u54EA\u4E00\u683C\u627E\u8CC7\u6599\u2014\u2014\u9019\u6642\u5B83\u6703\u8AA0\u5BE6\u5730\u8AAA\u300C\u6253\u4E0D\u958B\u300D\uFF0C\u800C\u4E0D\u662F\u5047\u88DD\u4F60\u6C92\u6709\u8CC7\u6599\u3002",
    operator: "\u5728\u67B6\u8A2D\u9019\u53F0\u5BE6\u4F8B\u7684\u6A5F\u5668\u4E0A\u91CD\u8DD1\u4E00\u6B21 `acr update`\uFF0C\u5B83\u6703\u5F9E ~/.arcrun/config.yaml \u7684 api_key \u628A ARCRUN_NAMESPACE \u91CD\u65B0\u6CE8\u5165\u5230 cypher-executor\u3002\u8DD1\u5B8C\u5F8C\u91CD\u65B0\u6574\u7406\u9801\u9762\u5373\u53EF\u3002"
  },
  missing_api_key: {
    http_status: 400,
    title: "\u9019\u500B\u8ACB\u6C42\u6C92\u6709\u5E36\u8EAB\u5206",
    message: "\u9019\u500B\u8ACB\u6C42\u6C92\u6709\u5E36\u4E0A\u53EF\u4EE5\u6C7A\u5B9A\u67E5\u8A62\u7BC4\u570D\u7684\u8EAB\u5206\u8CC7\u8A0A\uFF0C\u6240\u4EE5\u7121\u6CD5\u8655\u7406\u3002\u5982\u679C\u4F60\u662F\u900F\u904E App \u6216\u5DE5\u5177\u9023\u9032\u4F86\u7684\uFF0C\u8ACB\u628A\u9019\u500B\u932F\u8AA4\u78BC\u63D0\u4F9B\u7D66\u67B6\u8A2D\u8005\u6216\u4F60\u7684 AI \u52A9\u624B\u3002",
    advanced: "\u8ACB\u6C42\u7F3A\u5C11 X-Arcrun-API-Key \u6A19\u982D\uFF0C\u7121\u6CD5\u6C7A\u5B9A\u67E5\u8A62\u7684 owner_id \u7BC4\u570D\u3002",
    why: "\u900F\u904E API\uFF0FMCP \u76F4\u63A5\u547C\u53EB\u9019\u53F0\u5BE6\u4F8B\u6642\uFF0C\u9700\u8981\u7528 X-Arcrun-API-Key \u6A19\u982D\u8868\u660E\u300C\u6211\u662F\u8AB0\u300D\uFF0C\u5BE6\u4F8B\u624D\u77E5\u9053\u8A72\u56DE\u54EA\u500B\u7BC4\u570D\u7684\u8CC7\u6599\u3002\u5F9E Portal \u7DB2\u9801\u767B\u5165\u7684\u4E00\u822C\u7528\u6236\u4E0D\u6703\u9047\u5230\u9019\u500B\u3002",
    operator: "\u547C\u53EB\u7AEF\u8981\u5728\u8ACB\u6C42\u6A19\u982D\u5E36\u4E0A X-Arcrun-API-Key\uFF08\uFF1D\u4F60 ~/.arcrun/config.yaml \u7684 api_key\uFF09\u3002\u82E5\u8D70\u7684\u662F\u5B98\u65B9 App\uFF0FMCP\uFF0C\u78BA\u8A8D\u5B83\u5DF2\u7528 `acr` \u8A2D\u5B9A\u904E\u5E33\u865F\u3002"
  },
  auth_store_not_writable: {
    http_status: 502,
    title: "\u9019\u53F0\u5BE6\u4F8B\u76EE\u524D\u7121\u6CD5\u5132\u5B58\u5E33\u865F\u8CC7\u6599",
    message: "\u9019\u53F0 Arcrun \u5BE6\u4F8B\u73FE\u5728\u5BEB\u4E0D\u9032\u5E33\u865F\uFF0F\u5BC6\u78BC\u8CC7\u6599\uFF0C\u6240\u4EE5\u6C92\u8FA6\u6CD5\u5EFA\u7ACB\u6216\u4FEE\u6539\u5E33\u865F\u3002\u9019\u662F\u5E73\u53F0\u7AEF\u7684\u8A2D\u5B9A\u554F\u984C\uFF0C\u4E0D\u662F\u4F60\u64CD\u4F5C\u932F\u8AA4\u2014\u2014\u76EE\u524D\u756B\u9762\u4E0A\u6C92\u6709\u4F60\u81EA\u5DF1\u80FD\u505A\u7684\u4E0B\u4E00\u6B65\u3002\u8ACB\u628A\u9019\u500B\u932F\u8AA4\u78BC\u3001\u4EE5\u53CA\u4F60\u525B\u624D\u5728\u505A\u7684\u4E8B\uFF08\u4F8B\u5982\uFF1A\u5EFA\u7ACB\u7B2C\u4E00\u500B\u5E33\u865F\u3001\u65B0\u589E\u4F7F\u7528\u8005\u3001\u4FEE\u6539\u5BC6\u78BC\uFF09\uFF0C\u4E00\u8D77\u63D0\u4F9B\u7D66\u67B6\u8A2D\u9019\u53F0\u5BE6\u4F8B\u7684\u4EBA\uFF0C\u6216\u8CBC\u7D66\u4F60\u81EA\u5DF1\u7684 AI \u52A9\u624B\u3002",
    advanced: "\u7F3A\u5C11\u53EF\u7528\u7684 Cloudflare \u5BEB\u5165\u6191\u8B49\uFF08CF_SECRETS_API_TOKEN\uFF09\u3002\u8A8D\u8B49\u5132\u5B58\u8D70 Workers per-script Secrets\uFF08D61 \u8A8D\u8B49\u8207\u8CC7\u6599\u5206\u96E2\uFF09\uFF0C\u5BEB\u5165\u9700\u8981\u9019\u628A token\uFF1B\u8B80\u53D6\u4E0D\u9700\u8981\uFF0C\u6240\u4EE5\u65E2\u6709\u5E33\u865F\u4ECD\u767B\u5F97\u9032\u53BB\uFF0C\u53EA\u662F\u4E0D\u80FD\u65B0\u589E\uFF0F\u4FEE\u6539\u3002",
    why: "\u70BA\u4E86\u8B93\u300C\u91CD\u88DD\uFF0F\u63DB\u8CC7\u6599\u5EAB\u90FD\u4E0D\u6703\u628A\u4F60\u9396\u5728\u9580\u5916\u300D\uFF0C\u5E33\u865F\u5BC6\u78BC\u5B58\u5728 Cloudflare \u7684 Workers Secrets \uFF08\u8DDF\u77E5\u8B58\u8CC7\u6599\u5EAB\u5206\u958B\u7684\u5730\u65B9\uFF09\u3002\u5BEB\u9032\u90A3\u88E1\u9700\u8981\u4E00\u628A Cloudflare \u5BEB\u5165 token\uFF1B\u9019\u628A token \u4E0D\u6703\u88AB\u5B89\u88DD\uFF0F\u66F4\u65B0\u81EA\u52D5\u7A2E\u6210\u5E38\u99D0\u503C\uFF0C\u6240\u4EE5\u5728\u67D0\u4E9B\u5BE6\u4F8B\u4E0A\u6703\u7F3A\u2014\u2014\u7F3A\u7684\u6642\u5019\u5C31\u5BEB\u4E0D\u9032\u53BB\u3002",
    operator: "\u9019\u9700\u8981\u4EBA\u5DE5\u5728\u67B6\u8A2D\u9019\u53F0\u5BE6\u4F8B\u7684 Cloudflare \u5E33\u865F\u4E0A\u8655\u7406\uFF1A\u628A\u6709\u6548\u7684 CF_SECRETS_API_TOKEN \u8A2D\u9032 cypher-executor\uFF08wrangler secret put\uFF09\uFF0C\u6216\u7528\u5B89\u88DD\u7CBE\u9748\u7576\u4E0B\u624B\u4E0A\u4ECD\u6709\u6548\u7684 OAuth token \u5E36\u5165\u3002\u55AE\u7D14\u91CD\u8DD1\u5B89\u88DD\uFF0F\u66F4\u65B0**\u4E0D\u4FDD\u8B49**\u7A2E\u597D\u9019\u628A token\uFF0C\u6240\u4EE5\u8ACB\u4E0D\u8981\u53EA\u53EB\u7528\u6236\u91CD\u88DD\u3002"
  },
  ai_binding_missing: {
    http_status: 501,
    title: "\u9019\u53F0\u5BE6\u4F8B\u6C92\u6709\u555F\u7528\u5167\u5EFA AI",
    message: "\u9019\u53F0\u5BE6\u4F8B\u6C92\u6709\u555F\u7528\u5167\u5EFA AI\uFF0C\u6240\u4EE5\u7121\u6CD5\u8655\u7406\u9019\u500B AI \u76F8\u95DC\u7684\u8ACB\u6C42\u3002\u8ACB\u628A\u9019\u500B\u932F\u8AA4\u78BC\u63D0\u4F9B\u7D66\u67B6\u8A2D\u9019\u53F0\u5BE6\u4F8B\u7684\u4EBA\uFF0C\u6216\u8CBC\u7D66\u4F60\u81EA\u5DF1\u7684 AI \u52A9\u624B\u3002",
    advanced: "wrangler.toml \u7F3A [ai] binding\uFF08Workers AI \u672A\u7D81\u5B9A\u5230 cypher-executor\uFF09\u3002",
    why: "\u6709\u4E9B\u529F\u80FD\uFF08\u4F8B\u5982\u628A\u539F\u7A3F\u6574\u7406\u6210\u77E5\u8B58\u5361\uFF09\u7528\u7684\u662F Cloudflare \u5167\u5EFA\u7684 Workers AI\u3002\u5982\u679C\u9019\u53F0\u5BE6\u4F8B\u90E8\u7F72\u7684\u7248\u672C\u6C92\u6709\u7D81\u5B9A\u5B83\uFF0C\u9019\u985E\u529F\u80FD\u5C31\u6703\u8AA0\u5BE6\u5730\u8AAA\u300C\u6C92\u555F\u7528\u300D\uFF0C\u800C\u4E0D\u662F\u5047\u88DD\u6210\u529F\u3002",
    operator: "\u66F4\u65B0\u5230\u542B Workers AI binding \u7684\u77E5\u8B58\u5EAB\u7248\u672C\u5F8C\u91CD\u65B0\u90E8\u7F72 cypher-executor\uFF08wrangler.toml \u9700\u6709 [ai] binding\uFF09\u3002"
  },
  ai_workflow_missing: {
    http_status: 404,
    title: "\u9019\u53F0\u5BE6\u4F8B\u9084\u6C92\u5B89\u88DD AI \u554F\u7B54\u529F\u80FD",
    message: "\u4F60\u60F3\u8A2D\u5B9A\u7684 AI \u554F\u7B54\u529F\u80FD\u9084\u6C92\u6709\u5B89\u88DD\u5728\u9019\u53F0\u5BE6\u4F8B\u4E0A\u3002\u8ACB\u628A\u9019\u500B\u932F\u8AA4\u78BC\u63D0\u4F9B\u7D66\u67B6\u8A2D\u9019\u53F0\u5BE6\u4F8B\u7684\u4EBA\uFF0C\u6216\u8CBC\u7D66\u4F60\u81EA\u5DF1\u7684 AI \u52A9\u624B\u3002",
    advanced: "\u627E\u4E0D\u5230 rag_chat \u554F\u7B54\u5DE5\u4F5C\u6D41\uFF08WEBHOOKS KV \u6C92\u6709\u9019\u53F0\u5BE6\u4F8B\u7684 rag_chat \u8A18\u9304\uFF09\u3002",
    why: "AI \u554F\u7B54\u662F\u4E00\u689D\u53EF\u5B89\u88DD\u7684\u5DE5\u4F5C\u6D41\u3002\u8981\u5148\u628A\u5B83\u88DD\u5230\u5BE6\u4F8B\u4E0A\uFF0C\u624D\u80FD\u66FF\u5B83\u8A2D\u5B9A\u91D1\u9470\u6216\u4F7F\u7528\u5B83\u3002",
    operator: "\u5728\u67B6\u8A2D\u8005\u7684\u6A5F\u5668\u4E0A\u5B89\u88DD\uFF0F\u63A8\u9001 rag_chat \u554F\u7B54\u5DE5\u4F5C\u6D41\uFF08\u900F\u904E\u5B89\u88DD\u7CBE\u9748\u6216 `acr push`\uFF09\u5F8C\u518D\u8A66\u3002"
  },
  ai_workflow_corrupt: {
    http_status: 500,
    title: "AI \u554F\u7B54\u8A2D\u5B9A\u8CC7\u6599\u640D\u58DE",
    message: "\u9019\u53F0\u5BE6\u4F8B\u7684 AI \u554F\u7B54\u8A2D\u5B9A\u8CC7\u6599\u8B80\u4E0D\u51FA\u4F86\uFF08\u683C\u5F0F\u58DE\u4E86\uFF09\uFF0C\u6240\u4EE5\u91D1\u9470\u6C92\u8FA6\u6CD5\u5B58\u9032\u53BB\u3002\u9019\u4E0D\u662F\u4F60\u64CD\u4F5C\u932F\u8AA4\u3002\u8ACB\u628A\u9019\u500B\u932F\u8AA4\u78BC\u63D0\u4F9B\u7D66\u67B6\u8A2D\u9019\u53F0\u5BE6\u4F8B\u7684\u4EBA\uFF0C\u6216\u8CBC\u7D66\u4F60\u81EA\u5DF1\u7684 AI \u52A9\u624B\u3002",
    advanced: "rag_chat \u5DE5\u4F5C\u6D41\u8A18\u9304\u7684 JSON \u89E3\u6790\u5931\u6557\uFF08WEBHOOKS KV \u5167\u5BB9\u6BC0\u640D\uFF09\u3002",
    why: "\u91D1\u9470\u662F\u5BEB\u9032\u300CAI \u554F\u7B54\u5DE5\u4F5C\u6D41\u300D\u9019\u7B46\u8A2D\u5B9A\u88E1\u7684\u3002\u5982\u679C\u90A3\u7B46\u8A2D\u5B9A\u7684\u5167\u5BB9\u58DE\u6389\u4E86\uFF0C\u5C31\u6C92\u6709\u4E00\u500B\u5B8C\u6574\u7684\u5730\u65B9\u53EF\u4EE5\u653E\u91D1\u9470\uFF0C\u6240\u4EE5\u6703\u8AA0\u5BE6\u5730\u64CB\u4E0B\u4F86\uFF0C\u800C\u4E0D\u662F\u628A\u91D1\u9470\u5BEB\u9032\u4E00\u7B46\u58DE\u8CC7\u6599\u3002",
    operator: "\u91CD\u65B0\u5B89\u88DD\uFF0F\u91CD\u65B0\u63A8\u9001 rag_chat \u554F\u7B54\u5DE5\u4F5C\u6D41\u4EE5\u9084\u539F\u4E00\u4EFD\u4E7E\u6DE8\u7684\u8A18\u9304\uFF0C\u7136\u5F8C\u518D\u8A2D\u5B9A\u91D1\u9470\u3002"
  },
  ai_workflow_no_key_field: {
    http_status: 500,
    title: "AI \u554F\u7B54\u8A2D\u5B9A\u627E\u4E0D\u5230\u53EF\u586B\u91D1\u9470\u7684\u4F4D\u7F6E",
    message: "\u9019\u53F0\u5BE6\u4F8B\u7684 AI \u554F\u7B54\u8A2D\u5B9A\u88E1\u6C92\u6709\u53EF\u4EE5\u653E\u91D1\u9470\u7684\u6B04\u4F4D\uFF0C\u6240\u4EE5\u91D1\u9470\u6C92\u6709\u5B58\u9032\u53BB\u3002\u8ACB\u628A\u9019\u500B\u932F\u8AA4\u78BC\u63D0\u4F9B\u7D66\u67B6\u8A2D\u9019\u53F0\u5BE6\u4F8B\u7684\u4EBA\uFF0C\u6216\u8CBC\u7D66\u4F60\u81EA\u5DF1\u7684 AI \u52A9\u624B\u3002",
    advanced: "rag_chat \u5DE5\u4F5C\u6D41\u7684 graph/config \u88E1\u627E\u4E0D\u5230 x-goog-api-key \u6B04\u4F4D\u53EF\u4F9B\u8986\u5BEB\u3002",
    why: "\u8A2D\u5B9A\u91D1\u9470\u7684\u505A\u6CD5\uFF0C\u662F\u628A\u91D1\u9470\u503C\u586B\u9032 AI \u554F\u7B54\u5DE5\u4F5C\u6D41\u88E1\u653E\u91D1\u9470\u7684\u90A3\u500B\u6B04\u4F4D\u3002\u5982\u679C\u9019\u7B46\u8A2D\u5B9A\u7684\u7248\u672C\u8F03\u820A\u3001\u6C92\u6709\u90A3\u500B\u6B04\u4F4D\uFF0C\u5C31\u7121\u8655\u53EF\u586B\u2014\u2014\u9019\u6642\u5B83\u6703\u8AA0\u5BE6\u5730\u8AAA\u300C\u627E\u4E0D\u5230\u4F4D\u7F6E\u300D\uFF0C\u800C\u4E0D\u662F\u5047\u88DD\u5B58\u597D\u4E86\u3002",
    operator: "\u66F4\u65B0\uFF0F\u91CD\u65B0\u63A8\u9001 rag_chat \u554F\u7B54\u5DE5\u4F5C\u6D41\u5230\u542B\u91D1\u9470\u6B04\u4F4D\u7684\u7248\u672C\u5F8C\u518D\u8A2D\u5B9A\u91D1\u9470\u3002"
  }
};
var HELP_BASE_PATH = "/e";
function normalizeOrigin(origin2) {
  return origin2.replace(/\/+$/, "");
}
function helpUrl(origin2, code) {
  return `${normalizeOrigin(origin2)}${HELP_BASE_PATH}/${code}`;
}
var UNKNOWN = {
  http_status: 500,
  title: "\u767C\u751F\u672A\u9810\u671F\u7684\u554F\u984C",
  message: "\u9019\u53F0\u5BE6\u4F8B\u9047\u5230\u4E00\u500B\u672A\u9810\u671F\u7684\u554F\u984C\u3002\u8ACB\u628A\u9019\u500B\u932F\u8AA4\u78BC\u63D0\u4F9B\u7D66\u67B6\u8A2D\u9019\u53F0\u5BE6\u4F8B\u7684\u4EBA\uFF0C\u6216\u8CBC\u7D66\u4F60\u81EA\u5DF1\u7684 AI \u52A9\u624B\u3002",
  why: "\u9019\u662F\u4E00\u500B\u76EE\u524D\u6C92\u6709\u5C08\u5C6C\u8AAA\u660E\u7684\u932F\u8AA4\u78BC\u3002",
  operator: "\u628A\u932F\u8AA4\u78BC\u8207\u91CD\u73FE\u6B65\u9A5F\u63D0\u4F9B\u7D66\u67B6\u8A2D\u8005\uFF0C\u4E26\u6AA2\u67E5 cypher-executor \u7684\u57F7\u884C\u7D00\u9304\u3002"
};
function specFor(code) {
  return PORTAL_ERRORS[code] ?? UNKNOWN;
}
function portalErrorBody(origin2, code, opts) {
  const spec = specFor(code);
  const parts = [spec.advanced, opts?.advanced].filter((s) => Boolean(s && s.trim()));
  const body = {
    error: spec.message,
    code,
    help_url: helpUrl(origin2, code)
  };
  if (parts.length > 0) body.advanced = parts.join("\n");
  return { body, status: spec.http_status };
}
function esc(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
var PAGE_HEAD = `<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Arcrun \u932F\u8AA4\u78BC\u8AAA\u660E</title>
<style>
:root{color-scheme:light dark}
body{margin:0;padding:32px 20px;font-family:-apple-system,"PingFang TC","Noto Sans TC","Microsoft JhengHei",system-ui,sans-serif;line-height:1.75;background:#faf9f6;color:#1e1b16}
@media(prefers-color-scheme:dark){body{background:#16130e;color:#ece7dd}}
main{max-width:680px;margin:0 auto}
.code{display:inline-block;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:14px;padding:3px 10px;border-radius:6px;background:rgba(194,73,46,.12);color:#c2492e;margin-bottom:14px}
h1{font-size:24px;margin:.2em 0 .6em}
h2{font-size:16px;margin:1.8em 0 .4em;opacity:.75}
.msg{font-size:17px}
.op{border:1px dashed rgba(127,127,127,.4);border-radius:10px;padding:14px 16px;background:rgba(127,127,127,.06)}
.op .tag{font-size:13px;opacity:.7;margin-bottom:6px}
code{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;background:rgba(127,127,127,.15);padding:1px 5px;border-radius:4px}
a{color:#c2492e}
ul{padding-left:1.2em}
.foot{margin-top:2.5em;font-size:13px;opacity:.6}
</style></head><body><main>`;
var PAGE_FOOT = `</main></body></html>`;
function renderFaqHtml(origin2, code) {
  const known = code && PORTAL_ERRORS[code] ? code : null;
  if (!known) {
    const items = Object.entries(PORTAL_ERRORS).map(
      ([c, s2]) => `<li><a href="${esc(helpUrl(origin2, c))}"><code>${esc(c)}</code></a> \u2014 ${esc(s2.title)}</li>`
    ).join("");
    return PAGE_HEAD + `<h1>Arcrun \u932F\u8AA4\u78BC\u8AAA\u660E</h1><p class="msg">\u4E0B\u9762\u662F\u9019\u53F0\u5BE6\u4F8B\u53EF\u80FD\u986F\u793A\u7684\u932F\u8AA4\u78BC\u3002\u9EDE\u9032\u53BB\u770B\u5B83\u7684\u610F\u601D\u3001\u70BA\u4EC0\u9EBC\u6703\u767C\u751F\u3001\u4EE5\u53CA\u600E\u9EBC\u89E3\u6C7A\u3002\u4F60\u4E5F\u53EF\u4EE5\u628A\u8A72\u9801\u7DB2\u5740\u76F4\u63A5\u8CBC\u7D66\u4F60\u7684 AI \u52A9\u624B\u3002</p><ul>${items}</ul>` + PAGE_FOOT;
  }
  const s = PORTAL_ERRORS[known];
  return PAGE_HEAD + `<div class="code">${esc(known)}</div><h1>${esc(s.title)}</h1><p class="msg">${esc(s.message)}</p><h2>\u70BA\u4EC0\u9EBC\u6703\u9019\u6A23</h2><p>${esc(s.why)}</p>` + (s.advanced ? `<h2>\u6280\u8853\u7D30\u7BC0</h2><p>${esc(s.advanced)}</p>` : "") + `<h2>\u7D66\u67B6\u8A2D\u9019\u53F0\u5BE6\u4F8B\u7684\u4EBA</h2><div class="op"><div class="tag">\u9019\u4E00\u6BB5\u662F\u7D66\u67B6\u8A2D\u8005\uFF0F\u5DE5\u7A0B\u5E2B\u770B\u7684\uFF0C\u4E0D\u662F\u7D66\u4E00\u822C\u7528\u6236\u7684\u64CD\u4F5C\u6B65\u9A5F</div>${esc(s.operator)}</div><p class="foot">\u932F\u8AA4\u78BC <code>${esc(known)}</code> \xB7 <a href="${esc(helpUrl(origin2, ""))}">\u770B\u5168\u90E8\u932F\u8AA4\u78BC</a></p>` + PAGE_FOOT;
}

// cypher-executor/src/lib/instance-update.ts
var DEFAULT_INSTALLER_ORIGIN = "https://install.arcrun.dev";
async function requestInstanceUpdate(env, fetchImpl = fetch) {
  const token = env.ARCRUN_UPDATE_TOKEN;
  const accountId = env.CF_ACCOUNT_ID;
  if (!token || !accountId) {
    return {
      status: 501,
      body: {
        ok: false,
        state: "unavailable",
        fallback_to_installer: true,
        message: "\u9019\u53F0\u9084\u6C92\u6709\u4E00\u9375\u66F4\u65B0\u7684\u529F\u80FD\uFF0C\u9700\u8981\u5148\u7528\u5B89\u88DD\u9801\u66F4\u65B0\u4E00\u6B21\uFF0C\u4E4B\u5F8C\u5C31\u80FD\u76F4\u63A5\u5728\u9019\u88E1\u66F4\u65B0\u3002"
      }
    };
  }
  const origin2 = (env.INSTALLER_ORIGIN || DEFAULT_INSTALLER_ORIGIN).replace(/\/+$/, "");
  let res;
  try {
    res = await fetchImpl(`${origin2}/api/instance/update`, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
      // body 只有 accountId——刻意沒有版本欄位。
      body: JSON.stringify({ accountId })
    });
  } catch {
    return {
      status: 502,
      body: { ok: false, state: "unavailable", message: "\u66AB\u6642\u9023\u4E0D\u4E0A\u66F4\u65B0\u670D\u52D9\uFF0C\u8ACB\u7A0D\u5F8C\u91CD\u65B0\u6574\u7406\u770B\u770B\u7248\u672C\u6709\u6C92\u6709\u8B8A\u3002" }
    };
  }
  const j = await res.json().catch(() => null);
  const message = typeof j?.message === "string" && j.message ? j.message : "";
  if (!j || res.status >= 500) {
    return {
      status: 502,
      body: { ok: false, state: "unavailable", message: message || "\u66F4\u65B0\u670D\u52D9\u66AB\u6642\u6C92\u6709\u56DE\u61C9\uFF0C\u8ACB\u7A0D\u5F8C\u518D\u8A66\u3002" }
    };
  }
  if (res.status === 401 || res.status === 403) {
    return { status: 200, body: { ok: false, state: "refused", message: message || "\u9019\u500B\u66F4\u65B0\u8981\u6C42\u6C92\u6709\u901A\u904E\u9A57\u8B49\u3002" } };
  }
  if (j.ok === true && j.state === "busy") {
    return { status: 200, body: { ok: true, state: "busy", message: message || "\u6B63\u5728\u5E6B\u4F60\u66F4\u65B0\uFF0C\u8ACB\u7A0D\u5019\u518D\u91CD\u65B0\u6574\u7406\u3002" } };
  }
  if (j.ok === true) {
    const deployed = typeof j.deployed === "number" ? j.deployed : 0;
    return {
      status: 200,
      body: { ok: true, state: deployed > 0 ? "updated" : "up_to_date", deployed, message: message || "\u66F4\u65B0\u5B8C\u6210\u3002" }
    };
  }
  return { status: 200, body: { ok: false, state: "refused", message: message || "\u9019\u6B21\u6C92\u8FA6\u6CD5\u5E6B\u4F60\u66F4\u65B0\u3002" } };
}

// cypher-executor/src/routes/portal.ts
var portalRouter = new Hono2();
var SESSION_TEMPLATE3 = "portal_session";
var LOCKFAIL_TEMPLATE = "portal_lockfail";
var LOCK_LIMIT = 5;
var LOCK_TTL_SECONDS = 15 * 60;
var DEFAULT_SESSION_TTL = 604800;
var USER_TEMPLATE = "portal_user";
var LIBRARY_TEMPLATE = "portal_library";
function portalTenant(env) {
  return accountTenant(env);
}
function portalNamespace(env) {
  return `${accountTenant(env)}::portal`;
}
function sessionTtl(env) {
  const n = Number.parseInt(env.PORTAL_SESSION_TTL ?? "", 10);
  return Number.isFinite(n) && n >= 60 ? n : DEFAULT_SESSION_TTL;
}
function bearerToken(c) {
  const auth = c.req.header("authorization") ?? "";
  return auth.match(/^Bearer\s+(\S+)/i)?.[1] ?? null;
}
var KbdbError = class extends Error {
};
async function kbdbFetch3(env, path, init, opts) {
  const { base, headers } = kbdbBase(env);
  const baseHeaders = opts?.essential ? withEssential(headers) : headers;
  let res;
  try {
    res = await fetch(`${base}${path}`, { ...init, headers: { ...baseHeaders, ...init?.headers } });
  } catch (e) {
    throw new KbdbError(`fetch ${path} \u5931\u6557\uFF1A${e instanceof Error ? e.message : String(e)}`);
  }
  return res;
}
async function run(c, fn) {
  try {
    return await fn();
  } catch (e) {
    if (e instanceof AuthStorePropagatingError) {
      return c.json({ error: e.message, code: "auth_store_propagating" }, 503);
    }
    const origin2 = new URL(c.req.url).origin;
    if (e instanceof AuthStoreWriteError) {
      const { body, status } = portalErrorBody(origin2, "auth_store_not_writable", { advanced: e.message });
      return c.json(body, status);
    }
    if (e instanceof TenantUnresolvedError) {
      const { body, status } = portalErrorBody(origin2, e.code, { advanced: e.message });
      return c.json(body, status);
    }
    if (e instanceof KbdbError) return c.json({ error: `KBDB \u4E0D\u53EF\u9054\u6216\u56DE\u932F\uFF1A${e.message}` }, 502);
    throw e;
  }
}
function honestStop(c, code, advanced) {
  const { body, status } = portalErrorBody(new URL(c.req.url).origin, code, advanced ? { advanced } : void 0);
  return c.json(body, status);
}
async function ensurePortalTemplates(env) {
  const created = [];
  const existing = [];
  const errors = [];
  for (const seed of PORTAL_TEMPLATE_SEEDS) {
    try {
      const got = await kbdbFetch3(env, `/templates/${encodeURIComponent(seed.name)}`, void 0, { essential: true });
      if (got.ok) {
        const body = await got.json().catch(() => null);
        const tpl = body?.template;
        if (tpl?.id && tpl.slots_json) {
          let currentSlots = [];
          try {
            const parsed = JSON.parse(tpl.slots_json);
            if (Array.isArray(parsed)) currentSlots = parsed.filter((s) => typeof s === "string");
          } catch {
          }
          const missing = seed.slots.filter((s) => !currentSlots.includes(s));
          if (missing.length > 0) {
            const patched = await kbdbFetch3(env, `/templates/${encodeURIComponent(tpl.id)}`, {
              method: "PATCH",
              body: JSON.stringify({ slots: [...currentSlots, ...missing] })
            }, { essential: true });
            if (!patched.ok) throw new KbdbError(`PATCH /templates/${seed.name} \u88DC slots \u2192 ${patched.status}`);
          }
        }
        existing.push(seed.name);
        continue;
      }
      if (got.status !== 404) throw new KbdbError(`GET /templates/${seed.name} \u2192 ${got.status}`);
      const res = await kbdbFetch3(env, "/templates", {
        method: "POST",
        body: JSON.stringify({
          name: seed.name,
          slots: seed.slots,
          description: seed.description,
          created_by: seed.created_by
        })
      }, { essential: true });
      if (!res.ok) throw new KbdbError(`POST /templates ${seed.name} \u2192 ${res.status}`);
      created.push(seed.name);
    } catch (e) {
      errors.push(`${seed.name}: ${e instanceof Error ? e.message : String(e)}`);
    }
  }
  return { created, existing, errors };
}
function authUserToRecord(u) {
  return {
    record_id: u.id,
    template_id: USER_TEMPLATE,
    values: {
      email: u.email,
      display_name: u.display_name,
      status: u.status,
      role: u.role,
      password_hash: u.password_hash,
      libraries: JSON.stringify(u.libraries ?? []),
      created_at: u.created_at,
      updated_at: u.updated_at
    }
  };
}
function recordValuesToAuthUser(id, v) {
  return {
    id,
    email: (v.email ?? "").toLowerCase(),
    display_name: v.display_name ?? "",
    status: v.status ?? "active",
    role: v.role ?? "user",
    libraries: parseLibraries(v.libraries),
    password_hash: v.password_hash ?? "",
    created_at: v.created_at ?? (/* @__PURE__ */ new Date()).toISOString(),
    updated_at: v.updated_at ?? (/* @__PURE__ */ new Date()).toISOString()
  };
}
async function promoteToKbdb(env, rec) {
  try {
    const email = (rec.values.email ?? "").toLowerCase();
    if (!email) return null;
    const already = await findKbdbUserRecordId(env, email);
    if (already) return already;
    const recordId = await createKbdbUserRecord(env, email, {
      display_name: rec.values.display_name ?? "",
      status: rec.values.status ?? "active",
      role: rec.values.role ?? "user",
      libraries: rec.values.libraries ?? "[]",
      created_at: rec.values.created_at ?? (/* @__PURE__ */ new Date()).toISOString(),
      updated_at: rec.values.updated_at ?? (/* @__PURE__ */ new Date()).toISOString()
    });
    if (rec.values.password_hash) await setPortalPasswordHash(env, recordId, rec.values.password_hash);
    return recordId;
  } catch {
    return null;
  }
}
async function findUserRecordId(env, email) {
  const inKbdb = await findKbdbUserRecordId(env, email);
  if (inKbdb) return inKbdb;
  return findAuthUserByEmail(env, email)?.id ?? null;
}
async function findKbdbUserRecordId(env, email) {
  const ns = portalNamespace(env);
  const params = new URLSearchParams({
    page_name: email,
    entry_type: USER_TEMPLATE,
    owner_id: ns,
    limit: "1"
  });
  const res = await kbdbFetch3(env, `/entries?${params.toString()}`, void 0, { essential: true });
  if (!res.ok) throw new KbdbError(`head entry \u67E5\u627E \u2192 ${res.status}`);
  const body = await res.json();
  const content = body.entries?.[0]?.content;
  return content ?? null;
}
async function getRecordById(env, recordId) {
  if (isAuthStoreId(recordId)) {
    const u = findAuthUserById(env, recordId);
    return u ? authUserToRecord(u) : null;
  }
  const res = await kbdbFetch3(env, `/records/${encodeURIComponent(recordId)}`, void 0, { essential: true });
  if (res.status === 404) {
    releaseBody(res);
    return null;
  }
  if (!res.ok) {
    releaseBody(res);
    throw new KbdbError(`GET /records/${recordId} \u2192 ${res.status}`);
  }
  const body = await res.json();
  return body.record ?? null;
}
async function patchRecordValues(env, recordId, values) {
  if (isAuthStoreId(recordId)) {
    let updated = null;
    await mutateAuthStore(env, (data) => {
      const idx = data.users.findIndex((u) => u.id === recordId);
      if (idx < 0) throw new KbdbError(`\u8A8D\u8B49\u5132\u5B58\u627E\u4E0D\u5230\u5E33\u865F ${recordId}`);
      const merged = { ...authUserToRecord(data.users[idx]).values, ...values };
      updated = recordValuesToAuthUser(recordId, merged);
      data.users[idx] = updated;
    });
    if (!updated) throw new KbdbError(`\u8A8D\u8B49\u5132\u5B58\u66F4\u65B0\u5931\u6557 ${recordId}`);
    return authUserToRecord(updated);
  }
  const res = await kbdbFetch3(env, `/records/${encodeURIComponent(recordId)}`, {
    method: "PATCH",
    body: JSON.stringify({ values })
  }, { essential: true });
  if (!res.ok) throw new KbdbError(`PATCH /records/${recordId} \u2192 ${res.status}`);
  const body = await res.json();
  if (!body.record) throw new KbdbError(`PATCH /records/${recordId} \u56DE\u61C9\u7F3A record`);
  return body.record;
}
async function deleteKbdbRecord(env, recordId) {
  if (isAuthStoreId(recordId)) {
    let found = false;
    await mutateAuthStore(env, (data) => {
      const idx = data.users.findIndex((u) => u.id === recordId);
      if (idx >= 0) {
        data.users.splice(idx, 1);
        found = true;
      }
    });
    return found;
  }
  const res = await kbdbFetch3(env, `/records/${encodeURIComponent(recordId)}`, { method: "DELETE" }, { essential: true });
  if (res.status === 404) return false;
  if (!res.ok) throw new KbdbError(`DELETE /records/${recordId} \u2192 ${res.status}`);
  return true;
}
function daemonActiveKey(env) {
  return `${portalTenant(env)}:portal:daemon_active_libs`;
}
async function markDaemonLibraryActive(env, library) {
  try {
    const names = /* @__PURE__ */ new Set();
    const raw2 = await env.WEBHOOKS.get(daemonActiveKey(env), "text");
    if (raw2) {
      for (const n of JSON.parse(raw2)) {
        const s = String(n ?? "").trim();
        if (s) names.add(s);
      }
    }
    names.add(library);
    await env.WEBHOOKS.put(daemonActiveKey(env), JSON.stringify([...names]), { expirationTtl: 172800 });
  } catch {
  }
}
async function listRecordsByTemplate(env, template) {
  if (template === USER_TEMPLATE) {
    let fromKbdb = [];
    try {
      fromKbdb = await listKbdbRecordsByTemplate(env, template);
    } catch {
      fromKbdb = [];
    }
    const seen = new Set(fromKbdb.map((r) => (r.values.email ?? "").toLowerCase()));
    const fromLegacy = readAuthStore(env).users.map(authUserToRecord).filter((r) => !seen.has((r.values.email ?? "").toLowerCase()));
    return [...fromKbdb, ...fromLegacy];
  }
  return listKbdbRecordsByTemplate(env, template);
}
async function listKbdbRecordsByTemplate(env, template) {
  const ns = portalNamespace(env);
  const res = await kbdbFetch3(env, `/records/by-template/${encodeURIComponent(template)}?owner_id=${encodeURIComponent(ns)}`);
  if (!res.ok) {
    releaseBody(res);
    throw new KbdbError(`GET /records/by-template/${template} \u2192 ${res.status}`);
  }
  const body = await res.json();
  return body.records ?? [];
}
async function createKbdbUserRecord(env, email, values) {
  const ns = portalNamespace(env);
  const res = await kbdbFetch3(env, "/records", {
    method: "POST",
    body: JSON.stringify({ template: USER_TEMPLATE, owner_id: ns, values: { ...values, email } })
  }, { essential: true });
  if (!res.ok) throw new KbdbError(`POST /records\uFF08portal_user\uFF09\u2192 ${res.status}`);
  const body = await res.json();
  const recordId = body.record?.record_id;
  if (!recordId) throw new KbdbError("POST /records \u56DE\u61C9\u7F3A record_id");
  const head = await kbdbFetch3(env, "/entries", {
    method: "POST",
    body: JSON.stringify({ entry_type: USER_TEMPLATE, page_name: email, content: recordId, owner_id: ns })
  }, { essential: true });
  if (!head.ok) throw new KbdbError(`head entry \u5EFA\u7ACB\u5931\u6557\uFF08record ${recordId} \u5DF2\u5EFA\uFF0C\u9700\u4EBA\u5DE5\u6536\u62FE\uFF09\u2192 ${head.status}`);
  return recordId;
}
async function createPortalUser(env, input, tokenOverride) {
  if (!authStoreWritable(env, tokenOverride)) {
    throw new AuthStoreWriteError(
      "\u9019\u53F0\u5BE6\u4F8B\u76EE\u524D\u5BEB\u4E0D\u9032\u8A8D\u8B49\u5132\u5B58\uFF08\u7F3A\u53EF\u7528\u7684 Cloudflare \u5BEB\u5165\u6191\u8B49\uFF09\u3002\u5B89\u88DD\u7CBE\u9748\u5EFA\u7ACB\u5E33\u865F\u6642\u6703\u81EA\u52D5\u5E36\u4E0A\uFF1B\u5B89\u88DD\u5B8C\u4E4B\u5F8C\u8981\u65B0\u589E\u5E33\u865F\uFF0C\u9700\u8981\u5BE6\u4F8B\u8A2D\u5B9A CF_SECRETS_API_TOKEN\uFF08\u8ACB\u56DE\u5831\u652F\u63F4\uFF09\u3002"
    );
  }
  const now2 = (/* @__PURE__ */ new Date()).toISOString();
  const recordId = await createKbdbUserRecord(env, input.email.toLowerCase(), {
    display_name: input.display_name,
    status: "active",
    role: input.role,
    libraries: JSON.stringify(input.libraries),
    created_at: now2,
    updated_at: now2
  });
  try {
    await setPortalPasswordHash(env, recordId, input.password_hash, tokenOverride);
  } catch (e) {
    await deleteKbdbRecord(env, recordId).catch(() => {
    });
    throw e;
  }
  return recordId;
}
function parseLibraries(raw2) {
  if (!raw2) return [];
  try {
    const arr = JSON.parse(raw2);
    if (Array.isArray(arr) && arr.every((x) => typeof x === "string")) return arr;
  } catch {
  }
  return [];
}
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}
function isValidLibraryName(name) {
  return /^(\*|[A-Za-z0-9_-]{1,64})$/.test(name);
}
function validLibrariesInput(libs) {
  return Array.isArray(libs) && libs.length > 0 && libs.every((x) => typeof x === "string" && isValidLibraryName(x));
}
function toPublicUser(rec) {
  const v = rec.values;
  return {
    record_id: rec.record_id,
    email: v.email ?? "",
    display_name: v.display_name ?? "",
    status: v.status ?? "",
    role: v.role ?? "",
    libraries: parseLibraries(v.libraries),
    created_at: v.created_at ?? "",
    updated_at: v.updated_at ?? ""
  };
}
async function requirePortalUser(c) {
  const token = bearerToken(c);
  if (!token) return { ok: false, res: c.json({ error: "\u672A\u767B\u5165" }, 401) };
  const sess = await ephemeralGet(c.env, { template: SESSION_TEMPLATE3, hashField: "token_hash", rawKey: token });
  if (!sess) return { ok: false, res: c.json({ error: "session \u7121\u6548\u6216\u5DF2\u904E\u671F" }, 401) };
  const recordId = sess.record_id;
  if (!recordId) {
    await ephemeralDelete(c.env, { template: SESSION_TEMPLATE3, hashField: "token_hash", rawKey: token });
    return { ok: false, res: c.json({ error: "session \u7121\u6548\u6216\u5DF2\u904E\u671F" }, 401) };
  }
  let rec = await getRecordById(c.env, recordId);
  if (!rec && await hydrateFromAccelerator(c.env)) {
    rec = await getRecordById(c.env, recordId);
  }
  if (!rec) {
    if (await authStoreRecentlyWritten(c.env)) {
      return {
        ok: false,
        res: c.json(
          {
            error: "\u8A8D\u8B49\u8CC7\u6599\u6B63\u5728\u66F4\u65B0\u4E2D\uFF08Cloudflare \u6B63\u5728\u92EA\u958B\u65B0\u7248\u672C\uFF09\uFF0C\u8ACB\u7A0D\u5019\u5E7E\u79D2\u518D\u8A66\u2014\u2014\u4F60\u4E26\u6C92\u6709\u88AB\u767B\u51FA\u3002",
            code: "auth_store_propagating"
          },
          503
        )
      };
    }
    return { ok: false, res: c.json({ error: "session \u7121\u6548\u6216\u5DF2\u904E\u671F" }, 401) };
  }
  if ((rec.values.status ?? "") !== "active") {
    await ephemeralDelete(c.env, { template: SESSION_TEMPLATE3, hashField: "token_hash", rawKey: token });
    return { ok: false, res: c.json({ error: "\u5E33\u865F\u5DF2\u505C\u7528" }, 403) };
  }
  return { ok: true, user: { token, recordId, values: rec.values } };
}
async function requirePortalAdmin(c) {
  const auth = await requirePortalUser(c);
  if (!auth.ok) return auth;
  if ((auth.user.values.role ?? "") !== "admin") {
    return { ok: false, res: c.json({ error: "\u9700\u8981 admin \u6B0A\u9650" }, 403) };
  }
  return auth;
}
async function graphSourceLibraries(env) {
  const libs = await listRecordsByTemplate(env, LIBRARY_TEMPLATE);
  const marked = libs.filter((l) => (l.values.graph_source ?? "") === "true" && (l.values.status ?? "active") !== "disabled").map((l) => l.values.name ?? "").filter(Boolean);
  return marked.length > 0 ? marked : ["general"];
}
async function hasGraphAccess(env, userLibraries) {
  if (userLibraries.includes("*")) return true;
  if (userLibraries.length === 0) return false;
  const sources = await graphSourceLibraries(env);
  return sources.some((s) => userLibraries.includes(s));
}
function workflowsVisible(env, role) {
  const setting = (env.PORTAL_SHOW_WORKFLOWS ?? "admin").toLowerCase();
  if (setting === "off") return false;
  if (setting === "all") return true;
  return role === "admin";
}
function uploadEnabled(env) {
  return Boolean(env.PORTAL_UPLOAD_REPO && env.PORTAL_UPLOAD_GITEA && env.PORTAL_UPLOAD_TOKEN);
}
async function assertPortalUserRecord(env, recordId) {
  const rec = await getRecordById(env, recordId);
  if (!rec) return null;
  const email = rec.values.email;
  if (!email) return null;
  const headRecordId = await findUserRecordId(env, email);
  if (headRecordId !== recordId) return null;
  return rec;
}
async function isLocked(env, email) {
  return (await lockState(env, email)).locked;
}
async function lockState(env, email) {
  const rec = await ephemeralGet(env, { template: LOCKFAIL_TEMPLATE, hashField: "email_hash", rawKey: email });
  if (!rec) return { locked: false, hasFailures: false };
  return { locked: (Number(rec.count) || 0) >= LOCK_LIMIT, hasFailures: true };
}
async function recordLoginFail(env, email) {
  const rec = await ephemeralGet(env, { template: LOCKFAIL_TEMPLATE, hashField: "email_hash", rawKey: email });
  const count = rec ? Number(rec.count) || 0 : 0;
  await ephemeralPut(env, {
    template: LOCKFAIL_TEMPLATE,
    slots: ["count"],
    hashField: "email_hash",
    rawKey: email,
    values: { count: String(count + 1) },
    ttlSeconds: LOCK_TTL_SECONDS
  });
}
async function clearLoginFail(env, email) {
  await ephemeralDelete(env, { template: LOCKFAIL_TEMPLATE, hashField: "email_hash", rawKey: email });
}
async function instanceHasNoAuthData(env) {
  if (readAuthStore(env).users.length > 0) return false;
  try {
    return (await listKbdbRecordsByTemplate(env, USER_TEMPLATE)).length === 0;
  } catch {
    return true;
  }
}
async function findAndVerifyUser(env, email, password) {
  const attempt = async () => {
    const recordId = await findUserRecordId(env, email);
    const rec = recordId ? await getRecordById(env, recordId) : null;
    const hash = recordId ? findPortalPasswordHash(env, recordId) ?? rec?.values.password_hash ?? "" : "";
    const ok = rec ? await verifyPassword(password, hash) : false;
    return { recordId, rec, ok };
  };
  const first = await attempt();
  if (first.ok) return first;
  if (await hydrateFromAccelerator(env)) {
    const second = await attempt();
    if (second.ok || second.rec) return second;
  }
  return first;
}
function propagatingLogin(c) {
  return c.json(
    {
      error: "\u5E33\u865F\u8CC7\u6599\u525B\u525B\u66F4\u65B0\u904E\uFF0C\u9019\u53F0\u4F3A\u670D\u5668\u9084\u5728\u540C\u6B65\u4E2D\u2014\u2014\u8ACB\u7B49 10\uFF5E30 \u79D2\u518D\u767B\u5165\u4E00\u6B21\uFF08\u9019\u6B21\u4E0D\u7B97\u5931\u6557\uFF09\u3002",
      code: "auth_store_propagating"
    },
    503
  );
}
async function sessionLifeFor(c, body) {
  if (body?.purpose !== "mcp") return sessionTtl(c.env);
  const expected = c.env.KBDB_INTERNAL_TOKEN ?? "";
  const got = (c.req.header("authorization") ?? "").match(/^Bearer\s+(\S+)/i)?.[1] ?? "";
  if (!expected || !got || !constantTimeEqual(got, expected)) return sessionTtl(c.env);
  const ttl = await readMcpTokenTtl(c.env).catch(() => null);
  if (!ttl || ttl.seconds === NEVER_EXPIRES_SECONDS) return null;
  return ttl.seconds;
}
portalRouter.post(
  "/portal/login",
  (c) => run(c, async () => {
    const body = await c.req.json().catch(() => null);
    const email = String(body?.email ?? "").trim().toLowerCase();
    const password = String(body?.password ?? "");
    if (!email || !password) return c.json({ error: "email \u8207 password \u5FC5\u586B" }, 400);
    const lock = await lockState(c.env, email);
    if (lock.locked) {
      return c.json({ error: "\u767B\u5165\u5931\u6557\u6B21\u6578\u904E\u591A\uFF0C\u5DF2\u66AB\u6642\u9396\u5B9A\uFF0C\u8ACB 15 \u5206\u9418\u5F8C\u518D\u8A66" }, 429);
    }
    const t0 = Date.now();
    const { recordId, rec, ok } = await findAndVerifyUser(c.env, email, password);
    const tVerify = Date.now() - t0;
    if (!recordId || !rec) {
      if (await instanceHasNoAuthData(c.env)) {
        return c.json(
          {
            error: "\u9019\u53F0\u5BE6\u4F8B\u8B80\u4E0D\u5230\u4EFB\u4F55\u767B\u5165\u8CC7\u6599\u2014\u2014\u4E0D\u662F\u5BC6\u78BC\u932F\u3002\u8A8D\u8B49\u5132\u5B58\u662F\u7A7A\u7684\uFF0C\u8ACB\u91CD\u65B0\u57F7\u884C\u5B89\u88DD\uFF0F\u66F4\u65B0\u4EE5\u91CD\u65B0\u5EFA\u7ACB\u7BA1\u7406\u54E1\u5E33\u865F\u3002",
            code: "auth_store_empty",
            auth_store: { home: "kbdb", writable: true, users: 0 }
          },
          503
        );
      }
      if (await authStoreStaleHere(c.env)) return propagatingLogin(c);
      await recordLoginFail(c.env, email);
      return c.json({ error: "email \u6216\u5BC6\u78BC\u932F\u8AA4" }, 401);
    }
    if ((rec.values.status ?? "") !== "active") {
      return c.json({ error: "\u5E33\u865F\u5DF2\u505C\u7528" }, 403);
    }
    if (!ok) {
      if (await authStoreStaleHere(c.env)) return propagatingLogin(c);
      await recordLoginFail(c.env, email);
      return c.json({ error: "email \u6216\u5BC6\u78BC\u932F\u8AA4" }, 401);
    }
    let sessionRecordId = recordId;
    if (isAuthStoreId(recordId)) {
      const migrated = await promoteToKbdb(c.env, rec);
      if (migrated) sessionRecordId = migrated;
    }
    const t1 = Date.now();
    const token = randomHex2(32);
    const sessionLife = await sessionLifeFor(c, body);
    await Promise.all([
      lock.hasFailures ? clearLoginFail(c.env, email) : Promise.resolve(),
      ephemeralPut(c.env, {
        template: SESSION_TEMPLATE3,
        slots: ["record_id"],
        hashField: "token_hash",
        rawKey: token,
        values: { record_id: sessionRecordId },
        ttlSeconds: sessionLife,
        fresh: true
      })
    ]);
    c.header("Server-Timing", `verify;dur=${tVerify}, session;dur=${Date.now() - t1}`);
    return c.json({
      success: true,
      session_token: token,
      display_name: rec.values.display_name ?? "",
      role: rec.values.role ?? "user",
      libraries: parseLibraries(rec.values.libraries),
      // session 還能活多久（秒）。**非機密**（是這台實例的 TTL 設定，不是任何人的憑據），
      // 但呼叫端需要它才能把自己發的憑證對齊這個上限——arcrun-mcp 用它把 OAuth
      // access_token 的 TTL 夾到 min(自己的 TTL, 這個值)：否則 MCP token 活 30 天、
      // 底下的 portal session 7 天就死，使用者會在第 8 天遇到「連著卻查不到」的鬼打牆。
      // null＝不過期（僅 MCP 授權、且效期設定為不過期時）。
      session_expires_in: sessionLife
      // 絕不回租戶字串（design §3.3：portal_user 拿到租戶字串就能繞過庫 filter 直打 /kbdb/*）
    });
  })
);
portalRouter.post("/portal/logout", async (c) => {
  const token = bearerToken(c);
  if (token) await ephemeralDelete(c.env, { template: SESSION_TEMPLATE3, hashField: "token_hash", rawKey: token });
  return c.json({ success: true });
});
portalRouter.get(
  "/portal/session",
  (c) => run(c, async () => {
    const auth = await requirePortalUser(c);
    if (!auth.ok) return auth.res;
    const v = auth.user.values;
    const role = v.role ?? "user";
    const libraries = parseLibraries(v.libraries);
    return c.json({
      valid: true,
      display_name: v.display_name ?? "",
      email: v.email ?? "",
      // t53：完成安裝清單在站內生 daemon config.json 要用（身分顯示欄）
      role,
      libraries,
      graph_allowed: await hasGraphAccess(c.env, libraries),
      workflows_visible: workflowsVisible(c.env, role),
      // portal-demo-suite：上傳頁能力（bindings 齊全才 true；同上，只是顯示提示，真閘在路由層）
      upload_enabled: uploadEnabled(c.env)
    });
  })
);
var PWRESET_TEMPLATE = "portal_pwreset";
var PWRESET_TTL_SECONDS = 30 * 60;
var PWRESET_THROTTLE_TEMPLATE = "portal_pwreset_throttle";
var PWRESET_THROTTLE_SECONDS = 120;
var RELAY_TICKET_TEMPLATE = "portal_relay_ticket";
var RELAY_TICKET_TTL_SECONDS = 120;
function portalUiOrigin(env) {
  const declared = String(env.UI_ORIGINS ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  if (declared.length > 0) return declared[0];
  if (isPrivateCloud(env)) return null;
  const sub = String(env.WORKER_SUBDOMAIN ?? "").trim();
  return sub ? `https://arcrun-rag-ui.${sub}.workers.dev` : null;
}
async function issueResetToken(env, recordId, email) {
  const token = randomHex2(32);
  await ephemeralPut(env, {
    template: PWRESET_TEMPLATE,
    slots: ["record_id", "email", "created_at"],
    hashField: "token_hash",
    rawKey: token,
    values: { record_id: recordId, email, created_at: (/* @__PURE__ */ new Date()).toISOString() },
    ttlSeconds: PWRESET_TTL_SECONDS
  });
  return token;
}
async function peekResetToken(env, token) {
  if (!token || !/^[0-9a-f]{16,128}$/i.test(token)) return null;
  const rec = await ephemeralGet(env, { template: PWRESET_TEMPLATE, hashField: "token_hash", rawKey: token });
  if (!rec) return null;
  return { record_id: rec.record_id ?? "", email: rec.email ?? "", created_at: rec.created_at ?? "" };
}
async function restoreResetToken(env, token, payload) {
  const age = Math.floor((Date.now() - new Date(payload.created_at).getTime()) / 1e3);
  const remaining = PWRESET_TTL_SECONDS - (Number.isFinite(age) && age > 0 ? age : 0);
  if (remaining <= 0) return;
  try {
    await ephemeralPut(env, {
      template: PWRESET_TEMPLATE,
      slots: ["record_id", "email", "created_at"],
      hashField: "token_hash",
      rawKey: token,
      values: { record_id: payload.record_id, email: payload.email, created_at: payload.created_at },
      ttlSeconds: remaining
    });
  } catch {
  }
}
async function consumeResetToken(env, token) {
  if (!token || !/^[0-9a-f]{16,128}$/i.test(token)) return null;
  const rec = await ephemeralGet(env, { template: PWRESET_TEMPLATE, hashField: "token_hash", rawKey: token, consume: true });
  if (!rec) return null;
  return { record_id: rec.record_id ?? "", email: rec.email ?? "", created_at: rec.created_at ?? "" };
}
async function writeNewPassword(env, recordId, newPassword) {
  const newHash = await hashPassword2(newPassword);
  await setPortalPasswordHash(env, recordId, newHash);
  await patchRecordValues(env, recordId, {
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  });
}
async function relayResetLink(env, apiOrigin, email, ticket) {
  const base = String(env.PORTAL_MAIL_RELAY_BASE ?? "").trim().replace(/\/$/, "");
  if (!base) return "not_configured";
  const headers = { "Content-Type": "application/json" };
  if (env.PORTAL_MAIL_RELAY_KEY) headers["X-Arcrun-Relay-Key"] = env.PORTAL_MAIL_RELAY_KEY;
  try {
    const res = await fetch(`${base}/api/send-password-reset`, {
      method: "POST",
      headers,
      body: JSON.stringify({ email, api_origin: apiOrigin, ticket })
    });
    return res.ok ? "sent" : "failed";
  } catch {
    return "failed";
  }
}
portalRouter.post(
  "/portal/password/relay-verify",
  (c) => run(c, async () => {
    const body = await c.req.json().catch(() => null);
    const ticket = String(body?.ticket ?? "").trim();
    if (!ticket || !/^[0-9a-f]{8,64}$/i.test(ticket)) return c.json({ ok: false }, 400);
    const rec = await ephemeralGet(c.env, { template: RELAY_TICKET_TEMPLATE, hashField: "ticket_hash", rawKey: ticket, consume: true });
    if (!rec) return c.json({ ok: false }, 404);
    if (!rec.record_id || !rec.api_origin) return c.json({ ok: false }, 404);
    const token = await issueResetToken(c.env, rec.record_id, rec.email ?? "");
    const link = `${rec.api_origin}/portal/password/reset-link?token=${encodeURIComponent(token)}`;
    return c.json({ ok: true, email_sha256: await sha256Hex5(rec.email ?? ""), link });
  })
);
portalRouter.get("/portal/password/reset-link", (c) => {
  const token = c.req.query("token") ?? "";
  const ui = portalUiOrigin(c.env);
  if (!ui) return c.text("\u9019\u53F0\u5BE6\u4F8B\u6C92\u6709\u8A2D\u5B9A portal \u524D\u7AEF\u7DB2\u5740\uFF0C\u7121\u6CD5\u5C0E\u5411\u4FEE\u6539\u5BC6\u78BC\u756B\u9762\u3002", 500);
  return c.redirect(`${ui}/portal/#/reset?token=${encodeURIComponent(token)}`, 302);
});
portalRouter.post(
  "/portal/password/forgot",
  (c) => run(c, async () => {
    const body = await c.req.json().catch(() => null);
    const email = String(body?.email ?? "").trim().toLowerCase();
    if (!email || !isValidEmail(email)) return c.json({ error: "email \u683C\u5F0F\u4E0D\u6B63\u78BA" }, 400);
    if (!String(c.env.PORTAL_MAIL_RELAY_BASE ?? "").trim()) {
      return c.json(
        {
          error: "\u5BC4\u4FE1\u529F\u80FD\u9084\u6C92\u63A5\u4E0A\uFF0C\u6240\u4EE5\u300C\u5FD8\u8A18\u5BC6\u78BC\u300D\u7684\u4FE1\u5BC4\u4E0D\u51FA\u53BB\u3002\u8ACB\u7167\u7576\u521D\u6536\u5230\u7684\u5B89\u88DD\u7DB2\u5740\uFF0C\u91CD\u65B0\u57F7\u884C\u4E00\u6B21\u5B89\u88DD\uFF08\u9078\u540C\u4E00\u500B Cloudflare \u5E33\u865F\uFF09\u2014\u2014\u5B8C\u6210\u5F8C\u9019\u500B\u529F\u80FD\u5C31\u6703\u81EA\u52D5\u63A5\u4E0A\uFF0C\u4E0D\u9700\u8981\u81EA\u5DF1\u8A2D\u5B9A\u4EFB\u4F55\u6771\u897F\uFF0C\u4E5F\u4E0D\u7528\u627E\u4EFB\u4F55\u4EBA\u5E6B\u5FD9\u3002",
          code: "mail_relay_not_configured"
        },
        503
      );
    }
    const generic = {
      success: true,
      message: "\u5982\u679C\u9019\u500B email \u6709\u5E33\u865F\uFF0C\u6211\u5011\u5DF2\u7D93\u628A\u300C\u4FEE\u6539\u5BC6\u78BC\u300D\u7684\u9023\u7D50\u5BC4\u904E\u53BB\u4E86\uFF08\u9023\u7D50 30 \u5206\u9418\u5167\u6709\u6548\u3001\u53EA\u80FD\u7528\u4E00\u6B21\uFF09\u3002"
    };
    const throttled = await ephemeralGet(c.env, { template: PWRESET_THROTTLE_TEMPLATE, hashField: "email_hash", rawKey: email });
    if (throttled) return c.json(generic);
    await ephemeralPut(c.env, {
      template: PWRESET_THROTTLE_TEMPLATE,
      slots: ["marker"],
      hashField: "email_hash",
      rawKey: email,
      values: { marker: "1" },
      ttlSeconds: PWRESET_THROTTLE_SECONDS
    });
    const recordId = await findUserRecordId(c.env, email).catch(() => null);
    if (!recordId) return c.json(generic);
    const apiOrigin = new URL(c.req.url).origin;
    const ticket = randomHex2(16);
    await ephemeralPut(c.env, {
      template: RELAY_TICKET_TEMPLATE,
      slots: ["email", "record_id", "api_origin"],
      hashField: "ticket_hash",
      rawKey: ticket,
      values: { email, record_id: recordId, api_origin: apiOrigin },
      ttlSeconds: RELAY_TICKET_TTL_SECONDS
    });
    await relayResetLink(c.env, apiOrigin, email, ticket);
    return c.json(generic);
  })
);
portalRouter.get(
  "/portal/password/reset",
  (c) => run(c, async () => {
    const payload = await peekResetToken(c.env, c.req.query("token") ?? "");
    if (!payload) {
      return c.json(
        { valid: false, error: "\u9019\u689D\u9023\u7D50\u5DF2\u7D93\u5931\u6548\u4E86\uFF08\u53EA\u80FD\u7528\u4E00\u6B21\u300130 \u5206\u9418\u5167\u6709\u6548\uFF09\u3002\u8ACB\u56DE\u767B\u5165\u9801\u91CD\u65B0\u6309\u4E00\u6B21\u300C\u5FD8\u8A18\u5BC6\u78BC\u300D\u3002" },
        400
      );
    }
    return c.json({ valid: true, email: payload.email });
  })
);
async function handlePasswordChange(c) {
  const body = await c.req.json().catch(() => null);
  const next = String(body?.new ?? "");
  const resetToken = String(body?.reset_token ?? "").trim();
  if (!next) return c.json({ error: "new\uFF08\u65B0\u5BC6\u78BC\uFF09\u5FC5\u586B" }, 400);
  if (next.length < 8) return c.json({ error: "\u65B0\u5BC6\u78BC\u81F3\u5C11 8 \u78BC" }, 400);
  if (resetToken) {
    const payload = await consumeResetToken(c.env, resetToken);
    if (!payload) {
      return c.json(
        { error: "\u9019\u689D\u9023\u7D50\u5DF2\u7D93\u5931\u6548\u4E86\uFF08\u53EA\u80FD\u7528\u4E00\u6B21\u300130 \u5206\u9418\u5167\u6709\u6548\uFF09\u3002\u8ACB\u56DE\u767B\u5165\u9801\u91CD\u65B0\u6309\u4E00\u6B21\u300C\u5FD8\u8A18\u5BC6\u78BC\u300D\u3002", code: "reset_token_invalid" },
        400
      );
    }
    try {
      await writeNewPassword(c.env, payload.record_id, next);
    } catch (e) {
      if (e instanceof AuthStoreWriteError) await restoreResetToken(c.env, resetToken, payload);
      throw e;
    }
    return c.json({ success: true, email: payload.email, via: "reset_link" });
  }
  const auth = await requirePortalUser(c);
  if (!auth.ok) return auth.res;
  const current = String(body?.current ?? "");
  if (!current) return c.json({ error: "current\uFF08\u73FE\u6709\u5BC6\u78BC\uFF09\u5FC5\u586B" }, 400);
  const currentHash = findPortalPasswordHash(c.env, auth.user.recordId) ?? auth.user.values.password_hash ?? "";
  const ok = await verifyPassword(current, currentHash);
  if (!ok) return c.json({ error: "\u820A\u5BC6\u78BC\u4E0D\u6B63\u78BA" }, 401);
  await writeNewPassword(c.env, auth.user.recordId, next);
  return c.json({ success: true, via: "current_password" });
}
portalRouter.post("/portal/password/change", (c) => run(c, () => handlePasswordChange(c)));
portalRouter.post("/portal/me/password", (c) => run(c, () => handlePasswordChange(c)));
portalRouter.post(
  "/portal/admin/bootstrap",
  (c) => run(c, async () => {
    const consoleOk = await validateConsoleSession(c.env, c.req.header("authorization"));
    if (!consoleOk) return c.json({ error: "\u9700\u8981 console owner session\uFF08\u5148\u767B\u5165 /console\uFF09" }, 401);
    const seeded = await ensurePortalTemplates(c.env);
    if (seeded.errors.length > 0) {
      return c.json({ error: `portal templates seed \u5931\u6557\uFF1A${seeded.errors.join("; ")}` }, 502);
    }
    const users = await listRecordsByTemplate(c.env, USER_TEMPLATE);
    if (users.some((u) => (u.values.role ?? "") === "admin")) {
      return c.json({ error: "\u5DF2\u6709 admin\uFF0Cbootstrap \u53EA\u80FD\u57F7\u884C\u4E00\u6B21\uFF1B\u5F8C\u7E8C\u5E33\u865F\u8ACB\u7528 /portal/admin/users" }, 409);
    }
    const body = await c.req.json().catch(() => null);
    const email = String(body?.email ?? "").trim().toLowerCase();
    const password = String(body?.password ?? "");
    const displayName = String(body?.display_name ?? "").trim() || email;
    if (!isValidEmail(email)) return c.json({ error: "email \u683C\u5F0F\u4E0D\u6B63\u78BA" }, 400);
    if (password.length < 8) return c.json({ error: "\u5BC6\u78BC\u81F3\u5C11 8 \u78BC" }, 400);
    if (await findUserRecordId(c.env, email)) return c.json({ error: "\u6B64 email \u5DF2\u5B58\u5728" }, 409);
    const recordId = await createPortalUser(c.env, {
      email,
      display_name: displayName,
      role: "admin",
      libraries: ["*"],
      // bootstrap admin 預設全庫（design §3.3：["*"]＝不注 library filter）
      password_hash: await hashPassword2(password)
    }, c.req.header("x-cf-secrets-token") || void 0);
    return c.json({ success: true, record_id: recordId, email, role: "admin" });
  })
);
portalRouter.post(
  "/portal/admin/recover-password",
  (c) => run(c, async () => {
    const consoleOk = await validateConsoleSession(c.env, c.req.header("authorization"));
    if (!consoleOk) return c.json({ error: "\u9700\u8981 console owner session\uFF08\u5148\u767B\u5165 /console\uFF09" }, 401);
    const body = await c.req.json().catch(() => null);
    const email = String(body?.email ?? "").trim().toLowerCase();
    if (!isValidEmail(email)) return c.json({ error: "email \u683C\u5F0F\u4E0D\u6B63\u78BA" }, 400);
    const recordId = await findUserRecordId(c.env, email);
    const rec = recordId ? await getRecordById(c.env, recordId) : null;
    if (!recordId || !rec) return c.json({ error: `\u627E\u4E0D\u5230 email\uFF1D${email} \u7684 portal \u5E33\u865F` }, 404);
    const password = generatePassword();
    await writeNewPassword(c.env, recordId, password);
    return c.json({ success: true, email, password });
  })
);
portalRouter.get(
  "/portal/admin/users",
  (c) => run(c, async () => {
    const auth = await requirePortalAdmin(c);
    if (!auth.ok) return auth.res;
    const users = await listRecordsByTemplate(c.env, USER_TEMPLATE);
    return c.json({ success: true, users: users.map(toPublicUser), count: users.length });
  })
);
portalRouter.post(
  "/portal/admin/users",
  (c) => run(c, async () => {
    const auth = await requirePortalAdmin(c);
    if (!auth.ok) return auth.res;
    const body = await c.req.json().catch(() => null);
    const email = String(body?.email ?? "").trim().toLowerCase();
    const displayName = String(body?.display_name ?? "").trim() || email;
    const role = body?.role === "admin" ? "admin" : "user";
    const libraries = validLibrariesInput(body?.libraries) ? body.libraries : ["general"];
    if (!isValidEmail(email)) return c.json({ error: "email \u683C\u5F0F\u4E0D\u6B63\u78BA" }, 400);
    if (body?.libraries !== void 0 && !validLibrariesInput(body?.libraries)) {
      return c.json({ error: 'libraries \u9808\u70BA\u975E\u7A7A\u5B57\u4E32\u9663\u5217\uFF08\u5EAB\u540D\u9650 A-Za-z0-9_- \u6216 "*"\uFF09' }, 400);
    }
    if (await findUserRecordId(c.env, email)) return c.json({ error: "\u6B64 email \u5DF2\u5B58\u5728" }, 409);
    let password = body?.password !== void 0 ? String(body.password) : "";
    let generated;
    if (password) {
      if (password.length < 8) return c.json({ error: "\u5BC6\u78BC\u81F3\u5C11 8 \u78BC" }, 400);
    } else {
      generated = generatePassword();
      password = generated;
    }
    const recordId = await createPortalUser(c.env, {
      email,
      display_name: displayName,
      role,
      libraries,
      password_hash: await hashPassword2(password)
    });
    const rec = await getRecordById(c.env, recordId);
    return c.json({
      success: true,
      user: rec ? toPublicUser(rec) : { record_id: recordId, email },
      // 一次性回傳（不儲存明碼）；admin 口頭轉交同仁後即失效於 server 側
      ...generated ? { generated_password: generated } : {}
    });
  })
);
portalRouter.patch(
  "/portal/admin/users/:id",
  (c) => run(c, async () => {
    const auth = await requirePortalAdmin(c);
    if (!auth.ok) return auth.res;
    const recordId = c.req.param("id");
    const rec = await assertPortalUserRecord(c.env, recordId);
    if (!rec) return c.json({ error: "\u7528\u6236\u4E0D\u5B58\u5728" }, 404);
    const body = await c.req.json().catch(() => null);
    if (!body) return c.json({ error: "body \u5FC5\u9808\u662F JSON" }, 400);
    const patch = {};
    if (body.status !== void 0) {
      if (body.status !== "active" && body.status !== "disabled") {
        return c.json({ error: "status \u53EA\u80FD\u662F active / disabled" }, 400);
      }
      patch.status = body.status;
    }
    if (body.role !== void 0) {
      if (body.role !== "user" && body.role !== "admin") return c.json({ error: "role \u53EA\u80FD\u662F user / admin" }, 400);
      patch.role = body.role;
    }
    if (body.libraries !== void 0) {
      if (!validLibrariesInput(body.libraries)) {
        return c.json({ error: 'libraries \u9808\u70BA\u975E\u7A7A\u5B57\u4E32\u9663\u5217\uFF08\u5EAB\u540D\u9650 A-Za-z0-9_- \u6216 "*"\uFF09' }, 400);
      }
      patch.libraries = JSON.stringify(body.libraries);
    }
    if (Object.keys(patch).length === 0) return c.json({ error: "\u6C92\u6709\u53EF\u66F4\u65B0\u7684\u6B04\u4F4D\uFF08status/role/libraries\uFF09" }, 400);
    const isActiveAdmin = (rec.values.role ?? "") === "admin" && (rec.values.status ?? "") === "active";
    const wouldLoseAdmin = patch.status === "disabled" || patch.role === "user";
    if (isActiveAdmin && wouldLoseAdmin) {
      const all = await listRecordsByTemplate(c.env, USER_TEMPLATE);
      const otherActiveAdmins = all.filter(
        (u) => u.record_id !== recordId && (u.values.role ?? "") === "admin" && (u.values.status ?? "") === "active"
      );
      if (otherActiveAdmins.length === 0) {
        return c.json({ error: "\u4E0D\u53EF\u505C\u7528\u6216\u964D\u7D1A\u6700\u5F8C\u4E00\u500B\u7BA1\u7406\u54E1\u2014\u2014\u7CFB\u7D71\u81F3\u5C11\u8981\u4FDD\u7559\u4E00\u500B active admin" }, 409);
      }
    }
    patch.updated_at = (/* @__PURE__ */ new Date()).toISOString();
    const updated = await patchRecordValues(c.env, recordId, patch);
    return c.json({ success: true, user: toPublicUser(updated) });
  })
);
portalRouter.post(
  "/portal/admin/users/:id/reset-password",
  (c) => run(c, async () => {
    const auth = await requirePortalAdmin(c);
    if (!auth.ok) return auth.res;
    const recordId = c.req.param("id");
    const rec = await assertPortalUserRecord(c.env, recordId);
    if (!rec) return c.json({ error: "\u7528\u6236\u4E0D\u5B58\u5728" }, 404);
    const password = generatePassword();
    await writeNewPassword(c.env, recordId, password);
    return c.json({ success: true, password });
  })
);
function toPublicLibrary(rec) {
  const v = rec.values;
  return {
    record_id: rec.record_id,
    name: v.name ?? "",
    display_name: v.display_name ?? "",
    description: v.description ?? "",
    status: v.status ?? "",
    // D-4：此庫是否為知識圖譜萃取來源（graph 粗閘按這個判定；全都沒標 → 預設 general）
    graph_source: (v.graph_source ?? "") === "true",
    // InkStoneCo#44：一個庫＝地端的一個資料夾。這三個是「資料夾」這個物件本身的屬性
    // （小幫手回報時登記，見 POST /portal/daemon/folder-tree），空字串＝這台小幫手還沒報過。
    root: v.root ?? "",
    mode: v.mode ?? "",
    reason: v.reason ?? ""
  };
}
function folderTreeKey(env, library) {
  return `${portalTenant(env)}:portal:folder_tree:${library}`;
}
function normalizeFolderNode(raw2) {
  if (!raw2 || typeof raw2 !== "object") return null;
  const r = raw2;
  const path = typeof r.path === "string" ? r.path : "";
  const num2 = (v) => {
    const n = Number(v);
    return Number.isFinite(n) && n >= 0 ? Math.floor(n) : 0;
  };
  const node = {
    path,
    name: typeof r.name === "string" && r.name ? r.name : path.split("/").pop() || "",
    parent: typeof r.parent === "string" ? r.parent : "-",
    depth: num2(r.depth),
    total_files: num2(r.total_files),
    synced_files: num2(r.synced_files),
    pending_files: num2(r.pending_files),
    unsupported_files: num2(r.unsupported_files),
    excluded_files: num2(r.excluded_files)
  };
  if (r.skipped === true) {
    node.skipped = true;
    node.skip_reason = typeof r.skip_reason === "string" ? r.skip_reason : "";
  }
  return node;
}
async function readFolderTree(env, library) {
  let raw2 = null;
  try {
    raw2 = await env.WEBHOOKS.get(folderTreeKey(env, library), "text");
  } catch {
    return null;
  }
  if (!raw2) return null;
  try {
    return JSON.parse(raw2);
  } catch {
    return null;
  }
}
async function listDaemonReports(env) {
  let libs = [];
  try {
    libs = await listRecordsByTemplate(env, LIBRARY_TEMPLATE);
  } catch {
    return [];
  }
  const names = libs.map((l) => (l.values.name ?? "").trim()).filter(Boolean).slice(0, 25);
  const trees = await Promise.all(names.map((n) => readFolderTree(env, n)));
  return trees.filter((t) => t !== null).map((t) => ({
    machine: t.machine ?? "",
    machine_label: t.machine_label ?? "",
    daemon_version: t.daemon_version ?? "",
    received_at: t.received_at ?? 0
  }));
}
function summarizeFolderTree(tree) {
  let total = 0;
  let synced = 0;
  let pending = 0;
  let unsupported = 0;
  let excluded = 0;
  let skippedDirs = 0;
  for (const n of tree.nodes ?? []) {
    if (n.skipped) skippedDirs++;
    total += n.total_files;
    synced += n.synced_files;
    pending += n.pending_files;
    unsupported += n.unsupported_files;
    excluded += n.excluded_files;
  }
  return {
    root: tree.root,
    mode: tree.mode,
    reason: tree.reason,
    // inkstone/Arcrun#180：庫目錄那張列表就是靠這兩格把庫掛到正確的機器底下。
    // 摘要吐它們（而不是只放在整棵樹裡）的理由：分組要在**畫第一層之前**就成立，
    // 而整棵樹是使用者展開那一列才去抓的 ⇒ 只放樹裡的話第一眼永遠是「未知來源」。
    machine: tree.machine ?? "",
    machine_label: tree.machine_label ?? "",
    node_count: (tree.nodes ?? []).length,
    total_nodes: tree.total_nodes,
    truncated: !!tree.truncated,
    total_files: total,
    synced_files: synced,
    pending_files: pending,
    unsupported_files: unsupported,
    excluded_files: excluded,
    skipped_dirs: skippedDirs,
    generated_at: tree.generated_at,
    received_at: tree.received_at
  };
}
portalRouter.post(
  "/portal/daemon/folder-tree",
  (c) => run(c, async () => {
    const apiKey = (c.req.header("X-Arcrun-API-Key") ?? "").trim();
    if (!apiKey) return c.json({ error: "\u7F3A\u5C11 X-Arcrun-API-Key header" }, 401);
    const body = await c.req.json().catch(() => null);
    if (!body) return c.json({ error: "body \u5FC5\u9808\u662F JSON" }, 400);
    const library = String(body.library ?? "").trim();
    if (!isValidLibraryName(library) || library === "*") {
      return c.json({ error: "library \u9808\u70BA\u5408\u6CD5\u5EAB\u540D\uFF08A-Za-z0-9_-\uFF0C1-64 \u5B57\uFF09" }, 400);
    }
    const rawNodes = Array.isArray(body.nodes) ? body.nodes : [];
    const nodes = rawNodes.map(normalizeFolderNode).filter((n) => n !== null);
    const displayName = String(body.display_name ?? "").trim() || library;
    const root = String(body.root ?? "").trim();
    const mode = String(body.mode ?? "").trim();
    const reason = String(body.reason ?? "").trim();
    const seeded = await ensurePortalTemplates(c.env);
    if (seeded.errors.length > 0) {
      return c.json({ error: `portal templates seed \u5931\u6557\uFF1A${seeded.errors.join("; ")}` }, 502);
    }
    const existing = await listRecordsByTemplate(c.env, LIBRARY_TEMPLATE);
    const mine = existing.find((l) => (l.values.name ?? "") === library);
    let registered = false;
    if (!mine) {
      const res = await kbdbFetch3(c.env, "/records", {
        method: "POST",
        body: JSON.stringify({
          template: LIBRARY_TEMPLATE,
          owner_id: portalNamespace(c.env),
          values: { name: library, display_name: displayName, description: "", status: "active", root, mode, reason }
        })
      });
      if (!res.ok) throw new KbdbError(`POST /records\uFF08portal_library\uFF0C\u8CC7\u6599\u593E\u6A39\u767B\u8A18\uFF09\u2192 ${res.status}`);
      registered = true;
    } else {
      const patch = {};
      if ((mine.values.root ?? "") !== root) patch.root = root;
      if ((mine.values.mode ?? "") !== mode) patch.mode = mode;
      if ((mine.values.reason ?? "") !== reason) patch.reason = reason;
      if (Object.keys(patch).length > 0) await patchRecordValues(c.env, mine.record_id, patch);
    }
    const stored = {
      library,
      display_name: displayName,
      root,
      mode,
      reason,
      // 🔴 缺 → 空字串，**不猜也不 backfill**（同卡片那條路：D97）。
      //    舊版小幫手不送這兩格，而「不知道是哪一台」本身就是要顯示出來的事實。
      machine: String(body.machine ?? "").trim(),
      machine_label: String(body.machine_label ?? "").trim(),
      // arcrun-rag#122：版號只收短字串（防有人塞一大包進 KV）；不合理就當沒送。
      daemon_version: ((v) => v.length <= 40 ? v : "")(String(body.daemon_version ?? "").trim()),
      truncated: body.truncated === true,
      total_nodes: Number.isFinite(Number(body.total_nodes)) ? Number(body.total_nodes) : nodes.length,
      sync_token: String(body.sync_token ?? ""),
      generated_at: Number.isFinite(Number(body.generated_at)) ? Number(body.generated_at) : 0,
      received_at: Math.floor(Date.now() / 1e3),
      nodes
    };
    await c.env.WEBHOOKS.put(folderTreeKey(c.env, library), JSON.stringify(stored));
    await markDaemonLibraryActive(c.env, library);
    return c.json({ success: true, library, registered, nodes: nodes.length, truncated: stored.truncated });
  })
);
portalRouter.get(
  "/portal/admin/folder-tree",
  (c) => run(c, async () => {
    const auth = await requirePortalAdmin(c);
    if (!auth.ok) return auth.res;
    const library = (c.req.query("library") ?? "").trim();
    if (!isValidLibraryName(library) || library === "*") {
      return c.json({ error: "library \u53C3\u6578\u5FC5\u586B\u4E14\u9808\u70BA\u5408\u6CD5\u5EAB\u540D" }, 400);
    }
    const tree = await readFolderTree(c.env, library);
    if (!tree) {
      return c.json({
        success: true,
        library,
        tree: null,
        note: "\u540C\u6B65\u5C0F\u5E6B\u624B\u9084\u6C92\u56DE\u5831\u904E\u9019\u500B\u8CC7\u6599\u593E\u7684\u7D50\u69CB\uFF08\u820A\u7248\u5C0F\u5E6B\u624B\u4E0D\u6703\u56DE\u5831\uFF0C\u66F4\u65B0\u5F8C\u624D\u6703\u51FA\u73FE\uFF09\u3002"
      });
    }
    return c.json({ success: true, library, tree });
  })
);
portalRouter.post(
  "/portal/daemon/extract",
  (c) => run(c, async () => {
    const apiKey = (c.req.header("X-Arcrun-API-Key") ?? "").trim();
    if (!apiKey) return c.json({ error: "\u7F3A\u5C11 X-Arcrun-API-Key header" }, 401);
    const body = await c.req.json().catch(() => null);
    const pageName = String(body?.page_name ?? "").trim();
    const srcText = String(body?.text ?? "");
    const daemonPrompt = String(body?.prompt ?? "").trim();
    const expectShape = parseExpectShape(body?.expect, Boolean(daemonPrompt));
    if (!daemonPrompt && (!pageName || !srcText.trim()))
      return c.json({ error: "page_name \u8207 text \u5FC5\u586B" }, 400);
    let aiConfig = DEFAULT_EXTRACT_AI_CONFIG;
    let configReadError;
    try {
      aiConfig = await readExtractAiConfig(c.env);
    } catch (e) {
      configReadError = `\u8B80\u4E0D\u5230\u9019\u53F0\u96F2\u7AEF\u7684\u8403\u53D6 AI \u8A2D\u5B9A\uFF0C\u5DF2\u9000\u56DE\u9810\u8A2D\uFF1A${e instanceof Error ? e.message : String(e)}`;
    }
    if (aiConfig.recipe === DEFAULT_EXTRACT_AI_CONFIG.recipe && !c.env.AI) {
      return honestStop(c, "ai_binding_missing", configReadError);
    }
    const REL = ">".repeat(2);
    const prompt = daemonPrompt || `\u628A\u4EE5\u4E0B\u539F\u7A3F\u91CD\u5BEB\u6210\u5B9A\u7A3F\u77E5\u8B58\u5361\uFF08\u6B63\u9AD4\u4E2D\u6587\uFF09\u3002\u76F4\u63A5\u8F38\u51FA\u5361\u7247\u672C\u8EAB\uFF1A\u7B2C\u4E00\u884C\u5FC5\u9808\u662F\u300C# ${pageName}\u300D\uFF0C\u4E0D\u8981\u4EFB\u4F55\u524D\u8A00\u3001\u601D\u8003\u904E\u7A0B\u3001\u82F1\u6587\u8349\u7A3F\u6216\u8AAA\u660E\u3002\u683C\u5F0F\uFF1A
# ${pageName}
## \u4E00\u53E5\u8A71\u5B9A\u7FA9
\uFF08\u4E00\u884C\uFF09
## \u8981\u9EDE
- \uFF083-12 \u689D\uFF0C\u5177\u9AD4\u3001\u542B\u6578\u5B57\u689D\u4EF6\uFF09
## \u95DC\u9375\u5BE6\u9AD4
- **\u5BE6\u9AD4\u540D** \u2014 \u4E00\u53E5\u8AAA\u660E
## \u95DC\u806F
- \u5BE6\u9AD4A ${REL} \u95DC\u4FC2 ${REL} \u5BE6\u9AD4B\uFF083-8 \u884C\uFF0C\u7528\u4E0A\u9762\u5BE6\u9AD4\u540D\uFF09

\u539F\u7A3F\uFF1A
${srcText}`;
    try {
      const ran = await runExtractAi(c.env, credentialOwner(c.env), aiConfig, {
        prompt,
        maxTokens: daemonPrompt ? 8192 : 2048,
        temperature: 0.2,
        // 🔴 Arcrun#134（2026-08-27）：呼叫端說它要一個 JSON 物件 ⇒ **就用模型保證得了的方式去要**
        //	（`response_format: json_object` 走受限解碼，語法由平台保證 ⇒ 骰子拿掉）。
        //	實測（youlin 真檔打 6 次）3 次壞在模型把字串收尾引號打成全形 `”`。
        //	只在呼叫端宣告要 JSON 時才要：legacy（要 markdown 卡）那條路一個字都沒動。
        //	#277：組請求的是 recipe（body_template），這裡只宣告「要不要 JSON」。
        jsonObject: expectShape === "json_object"
      });
      if (!ran.ok) {
        if (ran.code === "ai_binding_missing") return honestStop(c, "ai_binding_missing");
        return c.json({ error: `\u96F2\u7AEF\u8403\u53D6\uFF1A${ran.error}`, code: ran.code }, 502);
      }
      const out = ran.out;
      const norm = normalizeAiText(out);
      if (norm.kind === "unrenderable") {
        return c.json({ error: `\u96F2\u7AEF\u8403\u53D6\uFF1A${ran.provider === DEFAULT_EXTRACT_AI_CONFIG.recipe ? "Workers AI" : "AI"} \u7684\u56DE\u61C9\u9084\u539F\u4E0D\u56DE\u6587\u5B57\uFF08${norm.reason ?? "\u672A\u77E5\u539F\u56E0"}\uFF09` }, 502);
      }
      const raw2 = norm.text;
      if (!raw2) return c.json({ error: `${ran.provider === DEFAULT_EXTRACT_AI_CONFIG.recipe ? "Workers AI" : "AI"} \u6C92\u6709\u56DE\u50B3\u5167\u5BB9` }, 502);
      if (daemonPrompt) {
        if (expectShape === "json_object") {
          const check = hasJsonObject(raw2);
          if (!check.ok) {
            return c.json(
              {
                error: `\u96F2\u7AEF\u8403\u53D6\uFF1A\u6A21\u578B\u6C92\u6709\u7167\u5951\u7D04\u56DE JSON \u7269\u4EF6\uFF08${check.reason}\uFF09\u3002\u9019\u4E00\u6BB5\u662F\u5728\u4F60\u7684\u77E5\u8B58\u5EAB\u96F2\u7AEF\u8DD1\u7684\uFF08${ran.provider === DEFAULT_EXTRACT_AI_CONFIG.recipe ? "Workers AI" : "AI"} ${ran.model}\uFF09\uFF0C\u4E0D\u662F\u5728\u4F60\u7684\u96FB\u8166\u4E0A\u3002\u6A21\u578B\u5BE6\u969B\u56DE\u7684\u524D 120 \u5B57\uFF1A${snippetForError(raw2)}`,
                code: "ai_output_not_json_object",
                output_kind: norm.kind
              },
              502
            );
          }
        }
        return c.json({ success: true, output: raw2, output_kind: norm.kind });
      }
      const marker = `# ${pageName}`;
      const idx = raw2.lastIndexOf(marker);
      return c.json({ success: true, card: (idx >= 0 ? raw2.slice(idx) : raw2).trim() + "\n" });
    } catch (e) {
      return c.json({ error: `Workers AI \u57F7\u884C\u5931\u6557\uFF1A${e instanceof Error ? e.message : String(e)}` }, 502);
    }
  })
);
portalRouter.post(
  "/portal/daemon/libraries",
  (c) => run(c, async () => {
    const body = await c.req.json().catch(() => null);
    const email = String(body?.email ?? "").trim().toLowerCase();
    const password = String(body?.password ?? "");
    if (!email || !password) return c.json({ error: "email \u8207 password \u5FC5\u586B" }, 400);
    if (await isLocked(c.env, email)) return c.json({ error: "\u767B\u5165\u5931\u6557\u6B21\u6578\u904E\u591A\uFF0C\u8ACB\u7A0D\u5F8C\u518D\u8A66" }, 429);
    const { rec, ok } = await findAndVerifyUser(c.env, email, password);
    if (!rec || (rec.values.status ?? "") !== "active" || !ok) {
      await recordLoginFail(c.env, email);
      return c.json({ error: "email \u6216\u5BC6\u78BC\u932F\u8AA4" }, 401);
    }
    await clearLoginFail(c.env, email);
    const wanted = Array.isArray(body?.libraries) ? body.libraries : [];
    const seeded = await ensurePortalTemplates(c.env);
    if (seeded.errors.length > 0) {
      return c.json({ error: `portal templates seed \u5931\u6557\uFF1A${seeded.errors.join("; ")}` }, 502);
    }
    const existing = await listRecordsByTemplate(c.env, LIBRARY_TEMPLATE);
    const have = new Set(existing.map((l) => String(l.values.name ?? "")));
    const ns = portalNamespace(c.env);
    const created = [];
    for (const item of wanted) {
      const name = String(item?.name ?? "").trim();
      if (!isValidLibraryName(name) || name === "*" || have.has(name)) continue;
      const res = await kbdbFetch3(c.env, "/records", {
        method: "POST",
        body: JSON.stringify({
          template: LIBRARY_TEMPLATE,
          owner_id: ns,
          values: {
            name,
            display_name: String(item?.display_name ?? "").trim() || name,
            description: "\u540C\u6B65\u5C0F\u5E6B\u624B\u770B\u5B88\u7684\u8CC7\u6599\u593E",
            status: "active"
          }
        })
      });
      if (!res.ok) throw new KbdbError(`POST /records\uFF08portal_library\uFF09\u2192 ${res.status}`);
      have.add(name);
      created.push(name);
    }
    const after = await listRecordsByTemplate(c.env, LIBRARY_TEMPLATE);
    const activeNames = wanted.map((item) => String(item?.name ?? "").trim()).filter(Boolean);
    if (activeNames.length > 0) {
      await c.env.WEBHOOKS.put(daemonActiveKey(c.env), JSON.stringify(activeNames), { expirationTtl: 172800 });
    }
    return c.json({ success: true, created, libraries: after.map(toPublicLibrary) });
  })
);
portalRouter.post(
  "/portal/daemon/config",
  (c) => run(c, async () => {
    const body = await c.req.json().catch(() => null);
    const email = String(body?.email ?? "").trim().toLowerCase();
    const password = String(body?.password ?? "");
    if (!email || !password) return c.json({ error: "email \u8207 password \u5FC5\u586B" }, 400);
    if (await isLocked(c.env, email)) {
      return c.json({ error: "\u767B\u5165\u5931\u6557\u6B21\u6578\u904E\u591A\uFF0C\u5DF2\u66AB\u6642\u9396\u5B9A\uFF0C\u8ACB 15 \u5206\u9418\u5F8C\u518D\u8A66" }, 429);
    }
    const { rec, ok } = await findAndVerifyUser(c.env, email, password);
    if (!rec) {
      await recordLoginFail(c.env, email);
      return c.json({ error: "email \u6216\u5BC6\u78BC\u932F\u8AA4" }, 401);
    }
    if ((rec.values.status ?? "") !== "active") return c.json({ error: "\u5E33\u865F\u5DF2\u505C\u7528" }, 403);
    if (!ok) {
      await recordLoginFail(c.env, email);
      return c.json({ error: "email \u6216\u5BC6\u78BC\u932F\u8AA4" }, 401);
    }
    await clearLoginFail(c.env, email);
    const daemonCfg = {
      cypher_url: new URL(c.req.url).origin,
      namespace: knowledgeOwner(c.env),
      library: "kb",
      email,
      instance_name: String(rec.values.display_name ?? "")
    };
    return c.json({ success: true, config: daemonCfg });
  })
);
portalRouter.post(
  "/portal/admin/chat-key",
  (c) => run(c, async () => {
    const auth = await requirePortalAdmin(c);
    if (!auth.ok) return auth.res;
    const body = await c.req.json().catch(() => null);
    const key = String(body?.key ?? "").trim();
    if (!key) return c.json({ error: "\u8ACB\u8CBC\u4E0A\u4F60\u7684 Google AI \u91D1\u9470" }, 400);
    const tenant2 = knowledgeOwner(c.env);
    const kvKey2 = `${tenant2}:wf:rag_chat`;
    const raw2 = await c.env.WEBHOOKS.get(kvKey2, "text");
    if (!raw2) return honestStop(c, "ai_workflow_missing");
    let record;
    try {
      record = JSON.parse(raw2);
    } catch {
      return honestStop(c, "ai_workflow_corrupt");
    }
    let replaced = 0;
    const visit = (o) => {
      if (Array.isArray(o)) {
        o.forEach(visit);
        return;
      }
      if (o && typeof o === "object") {
        const rec = o;
        for (const k of Object.keys(rec)) {
          if (k.toLowerCase() === "x-goog-api-key") {
            rec[k] = key;
            replaced += 1;
          } else visit(rec[k]);
        }
      }
    };
    visit(record["graph"]);
    visit(record["config"]);
    if (replaced === 0) return honestStop(c, "ai_workflow_no_key_field");
    await c.env.WEBHOOKS.put(kvKey2, JSON.stringify(record));
    return c.json({ success: true, replaced });
  })
);
portalRouter.get(
  "/portal/admin/libraries",
  (c) => run(c, async () => {
    const auth = await requirePortalAdmin(c);
    if (!auth.ok) return auth.res;
    const libs = await listRecordsByTemplate(c.env, LIBRARY_TEMPLATE);
    let daemonActive = null;
    try {
      const raw2 = await c.env.WEBHOOKS.get(daemonActiveKey(c.env), "text");
      if (raw2) daemonActive = new Set(JSON.parse(raw2).map((n) => String(n).trim()));
    } catch {
    }
    const out = libs.map((rec) => {
      const lib = toPublicLibrary(rec);
      const watching = daemonActive === null ? void 0 : daemonActive.has(lib.name);
      return { ...lib, ...watching !== void 0 ? { daemon_watching: watching } : {} };
    });
    const known = new Set(out.map((l) => l.name));
    if (c.req.query("lite") === "1") {
      if (daemonActive) {
        for (const n of daemonActive) {
          if (!n || n === "general" || known.has(n)) continue;
          known.add(n);
          out.push({ record_id: "", name: n, display_name: n, description: "", status: "active", graph_source: false, auto: true, daemon_watching: true });
        }
      }
      return c.json({ success: true, libraries: out, count: out.length, lite: true });
    }
    try {
      const tenant2 = knowledgeOwner(c.env);
      const ownerParam = ownerQuery(tenant2);
      const [cardRes, tripletRes] = await Promise.all([
        kbdbFetch3(c.env, `/entries/library-stats?${ownerParam}`).catch(() => null),
        kbdbFetch3(c.env, `/records/triplet-stats?${ownerParam}`).catch(() => null)
      ]);
      for (const r of [cardRes, tripletRes]) if (r && !r.ok) releaseBody(r);
      const cardMap = /* @__PURE__ */ new Map();
      if (cardRes?.ok) {
        const body = await cardRes.json();
        for (const s of body.stats ?? []) cardMap.set(s.library, s.card_count);
      }
      const tripletMap = /* @__PURE__ */ new Map();
      if (tripletRes?.ok) {
        const body = await tripletRes.json();
        for (const s of body.stats ?? []) tripletMap.set(s.library, s.triplet_count);
      }
      for (const lib of out) {
        lib.card_count = cardMap.get(lib.name) ?? 0;
        lib.triplet_count = tripletMap.get(lib.name) ?? 0;
      }
      {
        for (const name of cardMap.keys()) {
          const n = String(name ?? "").trim();
          if (!n || n === "general" || known.has(n)) continue;
          known.add(n);
          const watching = daemonActive === null ? void 0 : daemonActive.has(n);
          out.push({
            record_id: "",
            name: n,
            display_name: n,
            description: "\u8CC7\u6599\u540C\u6B65\u6642\u81EA\u52D5\u51FA\u73FE\uFF08\u53EF\u5728\u6B64\u88DC\u986F\u793A\u540D\uFF09",
            status: "active",
            graph_source: false,
            auto: true,
            card_count: cardMap.get(n) ?? 0,
            triplet_count: tripletMap.get(n) ?? 0,
            ...watching !== void 0 ? { daemon_watching: watching } : {}
          });
        }
      }
    } catch {
    }
    await Promise.all(out.map(async (lib) => {
      const name = String(lib.name ?? "");
      if (!name) return;
      const tree = await readFolderTree(c.env, name);
      if (tree) lib.folder_tree = summarizeFolderTree(tree);
    }));
    return c.json({ success: true, libraries: out, count: out.length });
  })
);
portalRouter.post(
  "/portal/daemon/libraries",
  (c) => run(c, async () => {
    const body = await c.req.json().catch(() => null);
    const email = String(body?.email ?? "").trim().toLowerCase();
    const password = String(body?.password ?? "");
    if (!email || !password) return c.json({ error: "email \u8207 password \u5FC5\u586B" }, 400);
    const items = Array.isArray(body?.libraries) ? body.libraries : [];
    if (items.length === 0) return c.json({ success: true, registered: [], skipped: [] });
    if (await isLocked(c.env, email)) return c.json({ error: "\u767B\u5165\u5931\u6557\u6B21\u6578\u904E\u591A\uFF0C\u8ACB\u7A0D\u5F8C\u518D\u8A66" }, 429);
    const { rec, ok } = await findAndVerifyUser(c.env, email, password);
    if (!rec || (rec.values.status ?? "") !== "active" || !ok) {
      await recordLoginFail(c.env, email);
      return c.json({ error: "email \u6216\u5BC6\u78BC\u932F\u8AA4" }, 401);
    }
    await clearLoginFail(c.env, email);
    const seeded = await ensurePortalTemplates(c.env);
    if (seeded.errors.length > 0) {
      return c.json({ error: `portal templates seed \u5931\u6557\uFF1A${seeded.errors.join("; ")}` }, 502);
    }
    const existing = await listRecordsByTemplate(c.env, LIBRARY_TEMPLATE);
    const have = new Set(existing.map((l) => l.values.name ?? ""));
    const ns = portalNamespace(c.env);
    const registered = [];
    const skipped = [];
    for (const it of items) {
      const name = String(it?.name ?? "").trim();
      const displayName = String(it?.display_name ?? "").trim() || name;
      if (!isValidLibraryName(name) || name === "*") {
        skipped.push(name || "(\u7A7A)");
        continue;
      }
      if (have.has(name)) {
        skipped.push(name);
        continue;
      }
      const res = await kbdbFetch3(c.env, "/records", {
        method: "POST",
        body: JSON.stringify({
          template: LIBRARY_TEMPLATE,
          owner_id: ns,
          values: { name, display_name: displayName, description: "", status: "active" }
        })
      });
      if (!res.ok) throw new KbdbError(`POST /records\uFF08portal_library\uFF0Cdaemon \u767B\u8A18\uFF09\u2192 ${res.status}`);
      have.add(name);
      registered.push(name);
    }
    return c.json({ success: true, registered, skipped });
  })
);
portalRouter.patch(
  "/portal/admin/libraries/:id",
  (c) => run(c, async () => {
    const auth = await requirePortalAdmin(c);
    if (!auth.ok) return auth.res;
    const recordId = c.req.param("id");
    const libs = await listRecordsByTemplate(c.env, LIBRARY_TEMPLATE);
    if (!libs.some((l) => l.record_id === recordId)) return c.json({ error: "\u5EAB\u4E0D\u5B58\u5728" }, 404);
    const body = await c.req.json().catch(() => null);
    if (!body) return c.json({ error: "body \u5FC5\u9808\u662F JSON" }, 400);
    const patch = {};
    if (body.display_name !== void 0) patch.display_name = String(body.display_name).trim();
    if (body.description !== void 0) patch.description = String(body.description).trim();
    if (body.status !== void 0) {
      if (body.status !== "active" && body.status !== "disabled") {
        return c.json({ error: "status \u53EA\u80FD\u662F active / disabled" }, 400);
      }
      patch.status = body.status;
    }
    if (body.graph_source !== void 0) {
      if (typeof body.graph_source !== "boolean") {
        return c.json({ error: "graph_source \u53EA\u80FD\u662F true / false" }, 400);
      }
      patch.graph_source = body.graph_source ? "true" : "false";
    }
    if (Object.keys(patch).length === 0) {
      return c.json({ error: "\u6C92\u6709\u53EF\u66F4\u65B0\u7684\u6B04\u4F4D\uFF08display_name/description/status/graph_source\uFF09" }, 400);
    }
    const updated = await patchRecordValues(c.env, recordId, patch);
    return c.json({ success: true, library: toPublicLibrary(updated) });
  })
);
async function readExtractAiRow(env) {
  const ns = portalNamespace(env);
  const res = await kbdbFetch3(env, `/records/by-template/${encodeURIComponent(EXTRACT_AI_TEMPLATE)}?owner_id=${encodeURIComponent(ns)}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new KbdbError(`GET /records/by-template/${EXTRACT_AI_TEMPLATE} \u2192 ${res.status}`);
  const body = await res.json();
  for (const r of body.records ?? []) {
    const v = validateExtractAiConfig({ recipe: r.values.recipe, base_url: r.values.base_url, model: r.values.model });
    if (v.ok) {
      return { record_id: r.record_id, config: v.config, updated_at: r.values.updated_at ?? "", updated_by: r.values.updated_by ?? "" };
    }
  }
  return null;
}
async function readExtractAiConfig(env) {
  return (await readExtractAiRow(env))?.config ?? DEFAULT_EXTRACT_AI_CONFIG;
}
portalRouter.get(
  "/portal/admin/extract-ai",
  (c) => run(c, async () => {
    const auth = await requirePortalAdmin(c);
    if (!auth.ok) return auth.res;
    const row = await readExtractAiRow(c.env);
    let hasKey = false;
    try {
      hasKey = await hasCredential(c.env, credentialOwner(c.env), EXTRACT_AI_CREDENTIAL);
    } catch {
      hasKey = false;
    }
    const config = row?.config ?? DEFAULT_EXTRACT_AI_CONFIG;
    return c.json({
      success: true,
      recipe: config.recipe,
      base_url: config.base_url ?? null,
      model: config.model ?? null,
      has_key: hasKey,
      is_default: !row,
      available_recipes: EXTRACT_AI_RECIPE_IDS,
      updated_at: row?.updated_at || null,
      updated_by: row?.updated_by || null
    });
  })
);
portalRouter.put(
  "/portal/admin/extract-ai",
  (c) => run(c, async () => {
    const auth = await requirePortalAdmin(c);
    if (!auth.ok) return auth.res;
    const body = await c.req.json().catch(() => null);
    const v = validateExtractAiConfig(body);
    if (!v.ok) return c.json({ error: v.error }, 400);
    const apiKey = typeof body?.api_key === "string" ? body.api_key.trim() : "";
    if (apiKey) {
      try {
        await storeCredential(c.env, credentialOwner(c.env), EXTRACT_AI_CREDENTIAL, apiKey, "extract_ai");
      } catch (e) {
        return c.json({ error: `\u91D1\u9470\u5132\u5B58\u5931\u6557\uFF1A${e instanceof Error ? e.message : String(e)}` }, 502);
      }
    }
    const seeded = await ensurePortalTemplates(c.env);
    if (seeded.errors.length > 0) {
      return c.json({ error: `portal templates seed \u5931\u6557\uFF1A${seeded.errors.join("; ")}` }, 502);
    }
    const values = {
      recipe: v.config.recipe,
      base_url: v.config.base_url ?? "",
      model: v.config.model ?? "",
      updated_at: (/* @__PURE__ */ new Date()).toISOString(),
      updated_by: auth.user.values.email ?? ""
    };
    const existing = await readExtractAiRow(c.env);
    if (existing) {
      await patchRecordValues(c.env, existing.record_id, values);
    } else {
      const res = await kbdbFetch3(c.env, "/records", {
        method: "POST",
        body: JSON.stringify({ template: EXTRACT_AI_TEMPLATE, owner_id: portalNamespace(c.env), values })
      });
      if (!res.ok) throw new KbdbError(`POST /records\uFF08${EXTRACT_AI_TEMPLATE}\uFF09\u2192 ${res.status}`);
    }
    return c.json({ success: true, recipe: v.config.recipe, base_url: v.config.base_url ?? null, model: v.config.model ?? null });
  })
);
portalRouter.delete(
  "/portal/admin/extract-ai",
  (c) => run(c, async () => {
    const auth = await requirePortalAdmin(c);
    if (!auth.ok) return auth.res;
    const existing = await readExtractAiRow(c.env);
    if (!existing) return c.json({ success: true, already: true });
    const found = await deleteKbdbRecord(c.env, existing.record_id);
    return c.json({ success: true, removed: found });
  })
);
portalRouter.get(
  "/portal/admin/ai",
  (c) => run(c, async () => {
    const auth = await requirePortalAdmin(c);
    if (!auth.ok) return auth.res;
    const tenantSlug = credentialOwner(c.env);
    let hasKey = false;
    try {
      hasKey = await hasCredential(c.env, tenantSlug, "gemini_api_key");
    } catch {
      hasKey = false;
    }
    return c.json({ success: true, has_key: hasKey });
  })
);
portalRouter.get(
  "/portal/admin/execution-log-retention",
  (c) => run(c, async () => {
    const auth = await requirePortalAdmin(c);
    if (!auth.ok) return auth.res;
    const ownerId = knowledgeOwner(c.env);
    const res = await kbdbFetch3(c.env, `/execution-log/retention?${ownerQuery(ownerId)}`);
    if (!res.ok) throw new KbdbError(`GET /execution-log/retention \u2192 ${res.status}`);
    const data = await res.json();
    return c.json({ success: true, retention_days: data.retention_days ?? null, default_days: data.default_days ?? 90 });
  })
);
portalRouter.put(
  "/portal/admin/execution-log-retention",
  (c) => run(c, async () => {
    const auth = await requirePortalAdmin(c);
    if (!auth.ok) return auth.res;
    const body = await c.req.json().catch(() => null);
    const days = body?.retention_days;
    if (days !== null && days !== void 0 && (typeof days !== "number" || !Number.isFinite(days) || days <= 0)) {
      return c.json({ error: "retention_days \u5FC5\u9808\u662F\u6B63\u6574\u6578\uFF0C\u6216 null\uFF08\u4EE3\u8868\u4E0D\u522A\u9664\uFF09" }, 400);
    }
    const ownerId = knowledgeOwner(c.env);
    const res = await kbdbFetch3(c.env, "/execution-log/retention", {
      method: "PUT",
      body: JSON.stringify({ owner_id: ownerField(ownerId), retention_days: days === void 0 ? null : days })
    });
    if (!res.ok) throw new KbdbError(`PUT /execution-log/retention \u2192 ${res.status}`);
    const data = await res.json();
    return c.json({ success: true, retention_days: data.retention_days ?? null });
  })
);
portalRouter.get(
  "/portal/admin/usage-brakes",
  (c) => run(c, async () => {
    const auth = await requirePortalAdmin(c);
    if (!auth.ok) return auth.res;
    const [settingsRes, brakesRes, usageRes] = await Promise.all([
      kbdbFetch3(c.env, "/usage-brakes/settings"),
      kbdbFetch3(c.env, "/usage-brakes?limit=20"),
      kbdbFetch3(c.env, "/usage-brakes/usage")
    ]);
    if (!settingsRes.ok) throw new KbdbError(`GET /usage-brakes/settings \u2192 ${settingsRes.status}`);
    if (!brakesRes.ok) throw new KbdbError(`GET /usage-brakes \u2192 ${brakesRes.status}`);
    if (!usageRes.ok) throw new KbdbError(`GET /usage-brakes/usage \u2192 ${usageRes.status}`);
    const settings = await settingsRes.json();
    const brakesBody = await brakesRes.json();
    const usage = await usageRes.json();
    const active = (brakesBody.brakes ?? []).filter((b) => b.active === true);
    return c.json({
      success: true,
      brake_enabled: settings.brake_enabled !== false,
      updated_at: settings.updated_at ?? null,
      updated_by: settings.updated_by ?? null,
      active_brakes: active,
      // 電池模型（#293 c18013）：判準只在 lib/battery.ts，前端只畫。
      battery: computeBattery({
        brake_enabled: settings.brake_enabled !== false,
        percent_written: usage.percent_written,
        percent_read: usage.percent_read,
        reset_at: usage.reset_at,
        month: usage.month
      }),
      usage: {
        rows_written: usage.rows_written,
        rows_read: usage.rows_read,
        limit_rows_written: usage.limit_rows_written,
        limit_rows_read: usage.limit_rows_read,
        percent_written: usage.percent_written,
        percent_read: usage.percent_read,
        reset_at: usage.reset_at,
        month: usage.month
      }
    });
  })
);
portalRouter.get(
  "/portal/daemon/battery",
  (c) => run(c, async () => {
    const apiKey = (c.req.header("X-Arcrun-API-Key") ?? "").trim();
    if (!apiKey) return c.json({ error: "\u7F3A\u5C11 X-Arcrun-API-Key header" }, 401);
    const [settingsRes, usageRes] = await Promise.all([
      kbdbFetch3(c.env, "/usage-brakes/settings"),
      kbdbFetch3(c.env, "/usage-brakes/usage")
    ]);
    if (!settingsRes.ok) throw new KbdbError(`GET /usage-brakes/settings \u2192 ${settingsRes.status}`);
    if (!usageRes.ok) throw new KbdbError(`GET /usage-brakes/usage \u2192 ${usageRes.status}`);
    const settings = await settingsRes.json();
    const usage = await usageRes.json();
    return c.json({
      success: true,
      battery: computeBattery({
        brake_enabled: settings.brake_enabled !== false,
        percent_written: usage.percent_written,
        percent_read: usage.percent_read,
        reset_at: usage.reset_at,
        month: usage.month
      })
    });
  })
);
portalRouter.post(
  "/portal/admin/usage-brakes/settings",
  (c) => run(c, async () => {
    const auth = await requirePortalAdmin(c);
    if (!auth.ok) return auth.res;
    const body = await c.req.json().catch(() => null);
    if (typeof body?.brake_enabled !== "boolean") {
      return c.json({ error: "brake_enabled \u5FC5\u9808\u662F boolean" }, 400);
    }
    const res = await kbdbFetch3(c.env, "/usage-brakes/settings", {
      method: "POST",
      body: JSON.stringify({ brake_enabled: body.brake_enabled, by: auth.user.values.email ?? "portal" })
    });
    if (!res.ok) throw new KbdbError(`POST /usage-brakes/settings \u2192 ${res.status}`);
    const data = await res.json();
    return c.json({ success: true, brake_enabled: data.brake_enabled !== false });
  })
);
portalRouter.post(
  "/portal/admin/usage-brakes/:id/release",
  (c) => run(c, async () => {
    const auth = await requirePortalAdmin(c);
    if (!auth.ok) return auth.res;
    const id = c.req.param("id");
    const res = await kbdbFetch3(c.env, `/usage-brakes/${encodeURIComponent(id)}/release`, {
      method: "POST",
      body: JSON.stringify({ by: auth.user.values.email ?? "portal" })
    });
    if (res.status === 404) return c.json({ error: "\u627E\u4E0D\u5230\u9019\u7B46\u524E\u8ECA\u7D00\u9304\uFF08\u53EF\u80FD\u5DF2\u7D93\u653E\u884C\u904E\u4E86\uFF09" }, 404);
    if (!res.ok) throw new KbdbError(`POST /usage-brakes/:id/release \u2192 ${res.status}`);
    const data = await res.json();
    return c.json({ success: true, brake: data.brake ?? null });
  })
);
async function listMcpRedirectHosts(env) {
  const rows = await listRecordsByTemplate(env, MCP_REDIRECT_HOST_TEMPLATE);
  return rows.filter((r) => (r.values.host ?? "").trim() !== "").sort((a, b) => (a.values.host ?? "").localeCompare(b.values.host ?? ""));
}
portalRouter.get(
  "/portal/mcp-settings",
  (c) => run(c, async () => {
    const auth = await requirePortalUser(c);
    if (!auth.ok) return auth.res;
    const isAdmin = (auth.user.values.role ?? "") === "admin";
    const sub = String(c.env.WORKER_SUBDOMAIN ?? "").trim();
    const mcpBase = mcpBaseUrl(c.env);
    const mcpUrl = mcpBase ? `${mcpBase}/mcp` : mcpUrlFor(sub);
    const payload = {
      success: true,
      mcp_url: mcpUrl,
      // 誠實講「為什麼沒有」：這台實例的部署設定裡沒有 WORKER_SUBDOMAIN ⇒ 多半是安裝
      // 中途失敗（畫面卻說裝好了）。不要讓使用者以為是自己沒找到。
      mcp_url_reason: mcpUrl ? "" : "\u9019\u500B\u5BE6\u4F8B\u6C92\u6709\u8A18\u9304\u81EA\u5DF1\u7684\u90E8\u7F72\u4F4D\u7F6E\uFF08\u5B89\u88DD\u53EF\u80FD\u6C92\u6709\u5B8C\u6210\uFF09\uFF0C\u6240\u4EE5\u7B97\u4E0D\u51FA MCP \u7DB2\u5740",
      builtin_hosts: [...MCP_BUILTIN_REDIRECT_HOSTS],
      can_edit: isAdmin
    };
    const ttl = await readMcpTokenTtl(c.env).catch(() => null);
    payload.token_ttl_seconds = ttl?.seconds ?? null;
    payload.token_ttl_default_seconds = DEFAULT_TOKEN_TTL_SECONDS;
    if (isAdmin && ttl) {
      payload.token_ttl_updated_at = ttl.updated_at;
      payload.token_ttl_updated_by = ttl.updated_by;
    }
    if (isAdmin) {
      payload.hosts = (await listMcpRedirectHosts(c.env)).map((r) => ({
        record_id: r.record_id,
        host: r.values.host ?? "",
        label: r.values.label ?? "",
        created_at: r.values.created_at ?? "",
        created_by: r.values.created_by ?? ""
      }));
    }
    return c.json(payload);
  })
);
portalRouter.post(
  "/portal/admin/mcp-redirect-hosts",
  (c) => run(c, async () => {
    const auth = await requirePortalAdmin(c);
    if (!auth.ok) return auth.res;
    const body = await c.req.json().catch(() => null);
    const norm = normalizeRedirectHost(body?.host);
    if (!norm.ok) return c.json({ error: norm.error }, 400);
    const seeded = await ensurePortalTemplates(c.env);
    if (seeded.errors.length > 0) {
      return c.json({ error: `portal templates seed \u5931\u6557\uFF1A${seeded.errors.join("; ")}` }, 502);
    }
    const existing = await listMcpRedirectHosts(c.env);
    const dup = existing.find((r) => (r.values.host ?? "") === norm.host);
    if (dup) {
      return c.json({ success: true, already: true, host: norm.host, record_id: dup.record_id });
    }
    const ns = portalNamespace(c.env);
    const res = await kbdbFetch3(c.env, "/records", {
      method: "POST",
      body: JSON.stringify({
        template: MCP_REDIRECT_HOST_TEMPLATE,
        owner_id: ns,
        values: {
          host: norm.host,
          label: String(body?.label ?? "").trim().slice(0, 80),
          created_at: (/* @__PURE__ */ new Date()).toISOString(),
          created_by: auth.user.values.email ?? ""
        }
      })
    });
    if (!res.ok) throw new KbdbError(`POST /records\uFF08${MCP_REDIRECT_HOST_TEMPLATE}\uFF09\u2192 ${res.status}`);
    const created = await res.json().catch(() => null);
    return c.json({
      success: true,
      host: norm.host,
      record_id: created?.record_id ?? created?.record?.record_id ?? ""
    });
  })
);
portalRouter.delete(
  "/portal/admin/mcp-redirect-hosts/:id",
  (c) => run(c, async () => {
    const auth = await requirePortalAdmin(c);
    if (!auth.ok) return auth.res;
    const recordId = c.req.param("id");
    const rows = await listMcpRedirectHosts(c.env);
    const target = rows.find((r) => r.record_id === recordId);
    if (!target) return c.json({ error: "\u9019\u500B\u7DB2\u57DF\u4E0D\u5728\u540D\u55AE\u4E0A\uFF08\u53EF\u80FD\u5DF2\u7D93\u88AB\u79FB\u9664\u4E86\uFF09" }, 404);
    const found = await deleteKbdbRecord(c.env, recordId);
    if (!found) return c.json({ error: "\u9019\u500B\u7DB2\u57DF\u4E0D\u5728\u540D\u55AE\u4E0A\uFF08\u53EF\u80FD\u5DF2\u7D93\u88AB\u79FB\u9664\u4E86\uFF09" }, 404);
    return c.json({ success: true, host: target.values.host ?? "" });
  })
);
portalRouter.get(
  "/portal/internal/mcp-redirect-hosts",
  (c) => run(c, async () => {
    const expected = c.env.KBDB_INTERNAL_TOKEN ?? "";
    if (!expected) {
      return c.json({ error: "\u9019\u53F0\u5BE6\u4F8B\u6C92\u6709\u8A2D\u5B9A\u670D\u52D9\u5167\u90E8\u91D1\u9470\uFF08KBDB_INTERNAL_TOKEN\uFF09\uFF0C\u7121\u6CD5\u56DE\u7B54" }, 503);
    }
    const got = (c.req.header("authorization") ?? "").match(/^Bearer\s+(\S+)/i)?.[1] ?? "";
    if (!got || !constantTimeEqual(got, expected)) return c.json({ error: "unauthorized" }, 401);
    const rows = await listMcpRedirectHosts(c.env);
    return c.json({ success: true, hosts: rows.map((r) => (r.values.host ?? "").trim()).filter(Boolean) });
  })
);
async function readMcpTokenTtl(env) {
  const rows = await listRecordsByTemplate(env, MCP_TOKEN_TTL_TEMPLATE);
  for (const r of rows) {
    const n = Number.parseInt(r.values.ttl_seconds ?? "", 10);
    if (Number.isFinite(n) && n >= 0) {
      return {
        record_id: r.record_id,
        seconds: n,
        updated_at: r.values.updated_at ?? "",
        updated_by: r.values.updated_by ?? ""
      };
    }
  }
  return null;
}
portalRouter.post(
  "/portal/admin/mcp-token-ttl",
  (c) => run(c, async () => {
    const auth = await requirePortalAdmin(c);
    if (!auth.ok) return auth.res;
    const body = await c.req.json().catch(() => null);
    const raw2 = body?.ttl_seconds !== void 0 ? body.ttl_seconds : body?.ttl_days !== void 0 && body.ttl_days !== null ? Number(body.ttl_days) * 86400 : void 0;
    const norm = normalizeTokenTtl(raw2);
    if (!norm.ok) return c.json({ error: norm.error }, 400);
    const seeded = await ensurePortalTemplates(c.env);
    if (seeded.errors.length > 0) {
      return c.json({ error: `portal templates seed \u5931\u6557\uFF1A${seeded.errors.join("; ")}` }, 502);
    }
    const values = {
      ttl_seconds: String(norm.seconds),
      updated_at: (/* @__PURE__ */ new Date()).toISOString(),
      updated_by: auth.user.values.email ?? ""
    };
    const existing = await readMcpTokenTtl(c.env);
    if (existing) {
      await patchRecordValues(c.env, existing.record_id, values);
    } else {
      const ns = portalNamespace(c.env);
      const res = await kbdbFetch3(c.env, "/records", {
        method: "POST",
        body: JSON.stringify({ template: MCP_TOKEN_TTL_TEMPLATE, owner_id: ns, values })
      });
      if (!res.ok) throw new KbdbError(`POST /records\uFF08${MCP_TOKEN_TTL_TEMPLATE}\uFF09\u2192 ${res.status}`);
    }
    return c.json({ success: true, ttl_seconds: norm.seconds, clamped: norm.clamped });
  })
);
portalRouter.delete(
  "/portal/admin/mcp-token-ttl",
  (c) => run(c, async () => {
    const auth = await requirePortalAdmin(c);
    if (!auth.ok) return auth.res;
    const existing = await readMcpTokenTtl(c.env);
    if (!existing) return c.json({ success: true, already: true });
    const found = await deleteKbdbRecord(c.env, existing.record_id);
    return c.json({ success: true, removed: found });
  })
);
portalRouter.get(
  "/portal/internal/mcp-token-ttl",
  (c) => run(c, async () => {
    const expected = c.env.KBDB_INTERNAL_TOKEN ?? "";
    if (!expected) {
      return c.json({ error: "\u9019\u53F0\u5BE6\u4F8B\u6C92\u6709\u8A2D\u5B9A\u670D\u52D9\u5167\u90E8\u91D1\u9470\uFF08KBDB_INTERNAL_TOKEN\uFF09\uFF0C\u7121\u6CD5\u56DE\u7B54" }, 503);
    }
    const got = (c.req.header("authorization") ?? "").match(/^Bearer\s+(\S+)/i)?.[1] ?? "";
    if (!got || !constantTimeEqual(got, expected)) return c.json({ error: "unauthorized" }, 401);
    const ttl = await readMcpTokenTtl(c.env);
    return c.json({ success: true, ttl_seconds: ttl?.seconds ?? null });
  })
);
portalRouter.delete(
  "/portal/admin/libraries/by-name/:name",
  (c) => run(c, async () => {
    const auth = await requirePortalAdmin(c);
    if (!auth.ok) return auth.res;
    const name = decodeURIComponent(c.req.param("name"));
    const body = await c.req.json().catch(() => null);
    const confirm = String(body?.confirm ?? "").trim();
    if (!confirm) return c.json({ error: 'body \u9808\u5E36 { confirm: "<\u5EAB\u540D>" } \u624D\u57F7\u884C\uFF08\u79FB\u9664\u6703\u5F71\u97FF\u8CC7\u6599\u53EF\u641C\u6027\uFF09' }, 400);
    if (confirm !== name) return c.json({ error: `confirm \u503C\u300C${confirm}\u300D\u8207\u5EAB\u540D\u300C${name}\u300D\u4E0D\u7B26` }, 400);
    const ownerId = knowledgeOwner(c.env);
    const res = await kbdbFetch3(c.env, "/entries/deprecate-by-library", {
      method: "PATCH",
      body: JSON.stringify({ owner_id: ownerField(ownerId), library: name })
    });
    if (!res.ok) throw new KbdbError(`PATCH /entries/deprecate-by-library \u2192 ${res.status}`);
    const data = await res.json();
    return c.json({
      success: true,
      deprecated_count: data.deprecated_count ?? 0,
      message: `\u5DF2\u5F9E\u81EA\u52D5\u6E05\u55AE\u79FB\u9664\u300C${name}\u300D\uFF08\u5171\u6A19\u8A18 ${data.deprecated_count ?? 0} \u7B46\u8CC7\u6599\u4E0D\u53EF\u641C\uFF09\u3002\u8CC7\u6599\u4FDD\u7559\u53EF\u9084\u539F\u2014\u2014\u91CD\u65B0\u540C\u6B65\u6642\u6703\u518D\u51FA\u73FE\u3002`
    });
  })
);
portalRouter.post(
  "/portal/admin/ai",
  (c) => run(c, async () => {
    const auth = await requirePortalAdmin(c);
    if (!auth.ok) return auth.res;
    const body = await c.req.json().catch(() => null);
    const rawKey = typeof body?.gemini_api_key === "string" ? body.gemini_api_key.trim() : "";
    if (!rawKey) {
      return c.json({ error: "\u6C92\u6709\u8981\u8B8A\u66F4\u7684\u9805\u76EE\uFF08\u91D1\u9470\u7559\u7A7A\uFF09" }, 400);
    }
    const tenantSlug = credentialOwner(c.env);
    try {
      await storeCredential(c.env, tenantSlug, "gemini_api_key", rawKey, "gemini");
    } catch (e) {
      return c.json(
        { error: `\u91D1\u9470\u5132\u5B58\u5931\u6557\uFF1A${e instanceof Error ? e.message : String(e)}` },
        502
      );
    }
    return c.json({ success: true, has_key: true });
  })
);
function credFail(c, label, e, fallbackStatus = 502) {
  if (isSecretsNotReady(e)) return c.json({ error: "\u9700 Cloudflare \u6388\u6B0A", code: SECRETS_NOT_READY_CODE }, 502);
  const msg = e instanceof Error ? e.message : String(e);
  return c.json({ error: `${label}\uFF1A${msg}` }, fallbackStatus);
}
portalRouter.get(
  "/portal/admin/credentials",
  (c) => run(c, async () => {
    const auth = await requirePortalUser(c);
    if (!auth.ok) return auth.res;
    const tenantSlug = credentialOwner(c.env);
    try {
      const rows = await listCredentialRows(c.env, tenantSlug);
      return c.json({ success: true, credentials: rows, total: rows.length });
    } catch (e) {
      return c.json({ success: false, error: e instanceof Error ? e.message : String(e) }, 502);
    }
  })
);
portalRouter.post(
  "/portal/admin/credentials",
  (c) => run(c, async () => {
    const auth = await requirePortalAdmin(c);
    if (!auth.ok) return auth.res;
    const body = await c.req.json().catch(() => null);
    if (!validateName(body?.name)) {
      return c.json({ error: "name \u5FC5\u586B\uFF0C\u53EA\u80FD\u5305\u542B\u82F1\u6587\u5B57\u6BCD\u3001\u6578\u5B57\u548C\u5E95\u7DDA" }, 400);
    }
    if (!body?.value || typeof body.value !== "string") {
      return c.json({ error: "value \u5FC5\u586B\uFF08\u91D1\u9470\u660E\u6587\u503C\uFF0C\u7D93 TLS \u50B3\u8F38\uFF0C\u4E0D\u843D\u5730\u3001\u4E0D\u8A18 log\uFF09" }, 400);
    }
    const service = typeof body.service === "string" ? body.service : void 0;
    const sensitivity = typeof body.sensitivity === "string" ? body.sensitivity : void 0;
    const tenantSlug = credentialOwner(c.env);
    try {
      await writeCredential(c.env, tenantSlug, body.name, body.value, service, sensitivity);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      return credFail(c, "\u91D1\u9470\u5132\u5B58\u5931\u6557", e, msg.includes("\u4F54\u7528") ? 409 : 502);
    }
    return c.json({ success: true, name: body.name, service: service ?? null });
  })
);
portalRouter.put(
  "/portal/admin/credentials/:name",
  (c) => run(c, async () => {
    const auth = await requirePortalAdmin(c);
    if (!auth.ok) return auth.res;
    const name = c.req.param("name");
    if (!validateName(name)) {
      return c.json({ error: "name \u53EA\u80FD\u5305\u542B\u82F1\u6587\u5B57\u6BCD\u3001\u6578\u5B57\u548C\u5E95\u7DDA" }, 400);
    }
    const body = await c.req.json().catch(() => null);
    if (!body?.value || typeof body.value !== "string") {
      return c.json({ error: "value \u5FC5\u586B\uFF08\u91D1\u9470\u660E\u6587\u503C\uFF0C\u7D93 TLS \u50B3\u8F38\uFF0C\u4E0D\u843D\u5730\u3001\u4E0D\u8A18 log\uFF09" }, 400);
    }
    const service = typeof body.service === "string" ? body.service : void 0;
    const sensitivity = typeof body.sensitivity === "string" ? body.sensitivity : void 0;
    const tenantSlug = credentialOwner(c.env);
    try {
      await writeCredential(c.env, tenantSlug, name, body.value, service, sensitivity);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      return credFail(c, "\u91D1\u9470\u8986\u5BEB\u5931\u6557", e, msg.includes("\u4F54\u7528") ? 409 : 502);
    }
    return c.json({ success: true, name, service: service ?? null });
  })
);
portalRouter.patch(
  "/portal/admin/credentials/:name",
  (c) => run(c, async () => {
    const auth = await requirePortalAdmin(c);
    if (!auth.ok) return auth.res;
    const name = c.req.param("name");
    if (!validateName(name)) {
      return c.json({ error: "name \u53EA\u80FD\u5305\u542B\u82F1\u6587\u5B57\u6BCD\u3001\u6578\u5B57\u548C\u5E95\u7DDA" }, 400);
    }
    const body = await c.req.json().catch(() => null);
    const newName = typeof body?.new_name === "string" ? body.new_name : void 0;
    const service = typeof body?.service === "string" ? body.service : void 0;
    const value = typeof body?.value === "string" ? body.value : void 0;
    const tenantSlug = credentialOwner(c.env);
    try {
      const result = await editCredential(c.env, tenantSlug, name, { newName, service, value });
      return c.json({ success: true, ...result });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      const status = msg.includes("\u627E\u4E0D\u5230") ? 404 : msg.includes("\u5DF2\u88AB\u4F7F\u7528") ? 409 : 502;
      return credFail(c, "\u91D1\u9470\u4FEE\u6539\u5931\u6557", e, status);
    }
  })
);
portalRouter.delete(
  "/portal/admin/credentials/:name",
  (c) => run(c, async () => {
    const auth = await requirePortalAdmin(c);
    if (!auth.ok) return auth.res;
    const name = c.req.param("name");
    const tenantSlug = credentialOwner(c.env);
    const result = await deleteCredentialByName(c.env, tenantSlug, name);
    if (!result.ok) {
      if (isSecretsNotReady(result.error)) return c.json({ error: "\u9700 Cloudflare \u6388\u6B0A", code: SECRETS_NOT_READY_CODE }, 502);
      return c.json({ error: result.error }, result.status);
    }
    return c.json({ success: true, name });
  })
);
portalRouter.delete(
  "/portal/admin/libraries/:id",
  (c) => run(c, async () => {
    const auth = await requirePortalAdmin(c);
    if (!auth.ok) return auth.res;
    const recordId = c.req.param("id");
    const libs = await listRecordsByTemplate(c.env, LIBRARY_TEMPLATE);
    const target = libs.find((l) => l.record_id === recordId);
    if (!target) return c.json({ error: "\u5EAB\u4E0D\u5B58\u5728" }, 404);
    const found = await deleteKbdbRecord(c.env, recordId);
    if (!found) return c.json({ error: "\u5EAB\u4E0D\u5B58\u5728" }, 404);
    try {
      await c.env.WEBHOOKS.delete(folderTreeKey(c.env, target.values.name ?? ""));
    } catch {
    }
    return c.json({
      success: true,
      name: target.values.name ?? "",
      message: `\u5DF2\u5F9E\u76EE\u9304\u79FB\u9664\u300C${target.values.display_name ?? target.values.name ?? ""}\u300D\u3002\u8CC7\u6599\u4ECD\u5728\uFF0C\u91CD\u65B0\u540C\u6B65\u6703\u518D\u51FA\u73FE\u3002`
    });
  })
);
async function buildDiagnostics(env, tenant2) {
  const notes = [];
  let embedding = { checked: false };
  try {
    const [statusRes, selftestRes] = await Promise.all([
      kbdbFetch3(env, `/embed/backfill/status?${ownerQuery(tenant2)}`),
      kbdbFetch3(env, `/embed/selftest?${ownerQuery(tenant2)}`)
    ]);
    const statusBody = await statusRes.json().catch(() => null);
    const selftestBody = await selftestRes.json().catch(() => null);
    embedding = {
      checked: true,
      module_enabled: statusBody?.enabled ?? false,
      // Vectorize+AI binding 都在，才有「index」這回事
      cards_embedded: statusBody?.embedded ?? 0,
      cards_pending: statusBody?.pending ?? 0,
      self_test: {
        ran: selftestBody?.tested ?? false,
        // 三態：true=能搜到自己 ／ false=搜不到自己（index 收錄有缺）／ null=還沒東西可測或模組未開
        found_itself: selftestBody?.tested ? selftestBody?.passed ?? null : null,
        note: selftestBody?.note ?? ""
      }
    };
  } catch (e) {
    notes.push(`embed \u5065\u5EB7\u72C0\u614B\u67E5\u8A62\u5931\u6557\uFF1A${e instanceof Error ? e.message : String(e)}`);
  }
  let library_count = 0;
  let triplet_count = 0;
  const ownerParam = ownerQuery(tenant2);
  try {
    const [registeredLibs, autoRes, tripletRes] = await Promise.all([
      listRecordsByTemplate(env, LIBRARY_TEMPLATE).catch(() => []),
      kbdbFetch3(env, `/entries/libraries?${ownerParam}`),
      kbdbFetch3(env, `/records/triplet-stats?${ownerParam}`)
    ]);
    const knownLibs = new Set(
      registeredLibs.map((r) => (r.values.name ?? "").trim()).filter((n) => !!n)
    );
    const autoBody = await autoRes.json().catch(() => null);
    for (const name of autoBody?.libraries ?? []) {
      const n = String(name ?? "").trim();
      if (n && n !== "general") knownLibs.add(n);
    }
    library_count = knownLibs.size;
    const tripletBody = await tripletRes.json().catch(() => null);
    triplet_count = (tripletBody?.stats ?? []).reduce((sum, s) => sum + (Number(s.triplet_count) || 0), 0);
  } catch (e) {
    notes.push(`\u77E5\u8B58\u5EAB\u898F\u6A21\u67E5\u8A62\u5931\u6557\uFF1A${e instanceof Error ? e.message : String(e)}`);
  }
  let library_scope_check = { ran: false };
  if (library_count === 0 && triplet_count === 0) {
    try {
      const probeRes = await kbdbFetch3(env, `/entries?${new URLSearchParams({ owner_id: ownerField(tenant2), limit: "1" }).toString()}`);
      const probeBody = await probeRes.json().catch(() => null);
      const total = probeBody?.total ?? 0;
      library_scope_check = {
        ran: true,
        any_entries_found: total > 0,
        note: total > 0 ? `\u9019\u500B\u79DF\u6236\u5E95\u4E0B\u67E5\u5F97\u5230\u5176\u4ED6\u8CC7\u6599\uFF08entries \u5171 ${total} \u7B46\uFF09\uFF0C\u4F46\u5EAB\uFF0F\u4E09\u5143\u7D44\u7D71\u8A08\u4ECD\u56DE 0\u2014\u2014\u50CF\u662F\u67E5\u8A62\u65B9\u5F0F\u6216\u79DF\u6236\u5C0D\u4E0D\u4E0A\uFF0C\u4E0D\u50CF\u771F\u7684\u6C92\u8CC7\u6599\uFF0C\u9700\u8981\u4EBA\u518D\u67E5\u4E00\u6B21` : "\u9019\u500B\u79DF\u6236\u5E95\u4E0B\u5B8C\u5168\u67E5\u4E0D\u5230\u4EFB\u4F55\u8CC7\u6599\u2014\u2014\u6BD4\u8F03\u50CF\u662F\u771F\u7684\u9084\u6C92\u6709\u8CC7\u6599\uFF0C\u4E0D\u662F\u67E5\u8A62\u65B9\u5F0F\u932F\u4E86"
      };
    } catch (e) {
      library_scope_check = {
        ran: true,
        any_entries_found: null,
        note: `\u81EA\u6211\u63A2\u6E2C\u67E5\u8A62\u672C\u8EAB\u5931\u6557\uFF1A${e instanceof Error ? e.message : String(e)}`
      };
    }
  }
  return { library_count, triplet_count, library_scope_check, embedding, notes };
}
portalRouter.get(
  "/portal/daemon/diagnostics",
  (c) => run(c, async () => {
    const apiKey = (c.req.header("X-Arcrun-API-Key") ?? "").trim();
    if (!apiKey) return c.json({ error: "\u7F3A\u5C11 X-Arcrun-API-Key header" }, 401);
    const core = await buildDiagnostics(c.env, tenantFromApiKey(apiKey));
    return c.json({
      generated_at: (/* @__PURE__ */ new Date()).toISOString(),
      instance_url: new URL(c.req.url).origin,
      bundle_version: c.env.ARCRUN_BUNDLE_VERSION ?? null,
      ...core
    });
  })
);
async function movePortalPasswordsToAuthStore(env, tokenOverride) {
  const users = (await listRecordsByTemplate(env, USER_TEMPLATE)).filter(
    (r) => !isAuthStoreId(r.record_id) && (r.values.password_hash ?? "") !== ""
  );
  if (users.length === 0) return { moved: 0, already: 0, cleared: 0 };
  let moved = 0;
  let already = 0;
  await mutateAuthStore(
    env,
    (data) => {
      for (const u of users) {
        if (data.passwords[u.record_id]) {
          already++;
          continue;
        }
        data.passwords[u.record_id] = u.values.password_hash;
        moved++;
      }
    },
    tokenOverride
  );
  let cleared = 0;
  for (const u of users) {
    await patchRecordValues(env, u.record_id, { password_hash: "" });
    cleared++;
  }
  return { moved, already, cleared };
}
portalRouter.post(
  "/portal/admin/update",
  (c) => run(c, async () => {
    const auth = await requirePortalAdmin(c);
    if (!auth.ok) return auth.res;
    const r = await requestInstanceUpdate(c.env);
    return c.json(r.body, r.status);
  })
);

// cypher-executor/src/routes/init-seed.ts
var initSeedRouter = new Hono2();
function sameContent(a, b, omit) {
  const strip = (obj) => {
    const rec = obj;
    const out = {};
    for (const k of Object.keys(rec).sort()) {
      if (!omit.includes(k)) out[k] = rec[k];
    }
    return JSON.stringify(out);
  };
  return strip(a) === strip(b);
}
var TIMESTAMP_FIELDS = ["created_at", "updated_at"];
initSeedRouter.post("/init/seed", async (c) => {
  const now2 = Date.now();
  let apiOk = 0;
  let apiWritten = 0;
  let apiFail = 0;
  const apiErrors = [];
  await Promise.all(API_RECIPE_SEEDS.map(async (seed) => {
    try {
      const canonicalId = seed.canonical_id.trim().toLowerCase();
      const hashId = await deriveRecipeHash(canonicalId);
      const existing = await resolveRecipe(canonicalId, c.env.RECIPES);
      const recipe = {
        uuid: existing?.uuid ?? crypto.randomUUID(),
        author: existing?.author ?? "system",
        canonical_id: canonicalId,
        hash_id: hashId,
        display_name: seed.display_name,
        description: seed.description,
        endpoint: resolveKbdbSeedBase(seed.endpoint, () => kbdbBaseUrl(c.env)),
        method: (seed.method ?? "POST").toUpperCase(),
        auth_service: seed.auth_service,
        // ③ payload/回應/binding 三層（3.12）：不列進來的欄位會被**靜默吃掉**——
        // 種子帶了 body_template/response_map/auth 卻沒進 KV，症狀是 recipe 存在但跑起來
        // 「像沒設定過」，且哪裡都不會紅（08-02 manifest.daemon 欄被列舉式重建吃掉的同型）。
        body_template: seed.body_template,
        response_map: seed.response_map,
        auth: seed.auth,
        binding_name: seed.binding_name,
        headers: seed.headers,
        created_at: existing?.created_at ?? now2,
        updated_at: now2
      };
      if (!existing || !sameContent(recipe, existing, TIMESTAMP_FIELDS)) {
        await installRecipeRecord(c.env.RECIPES, recipe);
        apiWritten++;
      }
      apiOk++;
    } catch (e) {
      apiFail++;
      apiErrors.push(`${seed.canonical_id}: ${e instanceof Error ? e.message : String(e)}`);
    }
  }));
  let authOk = 0;
  let authWritten = 0;
  let authFail = 0;
  const authErrors = [];
  await Promise.all(AUTH_RECIPE_SEEDS.map(async (seed) => {
    try {
      const service = seed.service.trim().toLowerCase();
      const existing = await c.env.RECIPES.get(`auth_recipe:${service}`, "json");
      const recipe = {
        ...seed,
        base_url: resolveKbdbSeedBase(seed.base_url, () => kbdbBaseUrl(c.env)),
        service,
        created_at: existing?.created_at ?? now2,
        updated_at: now2
      };
      if (!existing || !sameContent(recipe, existing, TIMESTAMP_FIELDS)) {
        await c.env.RECIPES.put(`auth_recipe:${service}`, JSON.stringify(recipe));
        authWritten++;
      }
      authOk++;
    } catch (e) {
      authFail++;
      authErrors.push(`${seed.service}: ${e instanceof Error ? e.message : String(e)}`);
    }
  }));
  const portalTemplates = await ensurePortalTemplates(c.env);
  const allOk = apiFail === 0 && authFail === 0 && portalTemplates.errors.length === 0;
  const durationMs = Date.now() - now2;
  return c.json(
    {
      success: allOk,
      duration_ms: durationMs,
      api_recipes: {
        seeded: apiOk,
        written: apiWritten,
        unchanged: apiOk - apiWritten,
        failed: apiFail,
        errors: apiErrors
      },
      auth_recipes: {
        seeded: authOk,
        written: authWritten,
        unchanged: authOk - authWritten,
        failed: authFail,
        errors: authErrors
      },
      portal_templates: portalTemplates,
      message: allOk ? `seed \u5B8C\u6210\uFF08${durationMs}ms\uFF09\uFF1A${apiOk} \u500B API recipe\uFF08\u5BEB\u5165 ${apiWritten}\uFF0F\u6CBF\u7528 ${apiOk - apiWritten}\uFF09+ ${authOk} \u500B auth recipe\uFF08\u5BEB\u5165 ${authWritten}\uFF0F\u6CBF\u7528 ${authOk - authWritten}\uFF09+ portal templates\uFF08\u65B0\u5EFA ${portalTemplates.created.length}\uFF0F\u5DF2\u5B58\u5728 ${portalTemplates.existing.length}\uFF09` : `seed \u90E8\u5206\u5931\u6557\uFF08\u8AA0\u5BE6\u56DE\u5831\uFF0C\u672A\u5047\u7DA0\uFF09\uFF1AAPI ${apiOk}\u2713/${apiFail}\u2717\uFF0Cauth ${authOk}\u2713/${authFail}\u2717\uFF0Cportal templates \u932F\u8AA4 ${portalTemplates.errors.length}`
    },
    allOk ? 200 : 207
  );
});

// cypher-executor/src/index.ts
init_kbdb_proxy();

// cypher-executor/src/routes/console-dashboard.ts
init_dist();
init_kbdb_proxy();

// cypher-executor/src/lib/taipei-time.ts
var TAIPEI_OFFSET_MS = 8 * 3600 * 1e3;
function taipeiDayKey(ms) {
  return new Date(ms + TAIPEI_OFFSET_MS).toISOString().slice(0, 10);
}
var TAIPEI_CLIENT_JS = [
  "var TAIPEI_OFFSET_MS = 28800000; // UTC+8\uFF0C\u53F0\u5317\u7121 DST",
  "function tpePad(n) { n = String(n); return n.length < 2 ? '0' + n : n; }",
  "function taipeiDayKey(ms) { return new Date(ms + TAIPEI_OFFSET_MS).toISOString().slice(0, 10); }",
  "function taipeiDateStr(ms) { return taipeiDayKey(ms); }",
  "function taipeiDateTimeStr(ms) { var d = new Date(ms + TAIPEI_OFFSET_MS); return taipeiDayKey(ms) + ' ' + tpePad(d.getUTCHours()) + ':' + tpePad(d.getUTCMinutes()); }",
  "function taipeiTimeStr(ms) { var d = new Date(ms + TAIPEI_OFFSET_MS); return tpePad(d.getUTCHours()) + ':' + tpePad(d.getUTCMinutes()) + ':' + tpePad(d.getUTCSeconds()); }",
  "function taipeiMonthDay(ms) { var d = new Date(ms + TAIPEI_OFFSET_MS); return { month: d.getUTCMonth() + 1, day: d.getUTCDate() }; }"
].join("\n");

// cypher-executor/src/lib/console-dashboard-model.ts
function parseCreatedAtMs(s) {
  if (s === null || s === void 0 || s === "") return null;
  if (typeof s === "number") return s < 1e12 ? s * 1e3 : s;
  if (/^\d+$/.test(s)) {
    const n = Number(s);
    return n < 1e12 ? n * 1e3 : n;
  }
  const iso = /T/.test(s) ? s : `${s.replace(" ", "T")}Z`;
  const ms = Date.parse(iso);
  return Number.isNaN(ms) ? null : ms;
}
function parseJsonContent(e) {
  if (!e.content) return null;
  try {
    const v = JSON.parse(e.content);
    return v && typeof v === "object" ? v : null;
  } catch {
    return null;
  }
}
function agoMinutes(nowMs, ms) {
  return ms === null ? -1 : Math.max(0, Math.round((nowMs - ms) / 6e4));
}
function buildRouteModel(entries, nowMs) {
  const todayKey = taipeiDayKey(nowMs);
  const byTitle = /* @__PURE__ */ new Map();
  for (const e of entries) {
    const j = parseJsonContent(e);
    const title = typeof j?.title === "string" ? j.title : null;
    if (!title || byTitle.has(title)) continue;
    const ms = parseCreatedAtMs(e.created_at);
    byTitle.set(title, {
      title,
      status: typeof j?.status === "string" ? j.status : "todo",
      order: typeof j?.order === "number" ? j.order : 999,
      scope: j?.scope === "week" ? "week" : "today",
      at_ms: ms,
      age_minutes: agoMinutes(nowMs, ms),
      is_today_write: ms !== null && taipeiDayKey(ms) === todayKey
    });
  }
  const tasks = [...byTitle.values()].sort(
    (a, b) => a.scope !== b.scope ? a.scope === "today" ? -1 : 1 : a.order - b.order
  );
  const newestMs = tasks.reduce((m, t) => t.at_ms !== null && (m === null || t.at_ms > m) ? t.at_ms : m, null);
  const isToday = newestMs !== null && taipeiDayKey(newestMs) === todayKey;
  const todayTasks = tasks.filter((t) => t.scope === "today" && t.is_today_write);
  return {
    tasks,
    updated_ago_minutes: agoMinutes(nowMs, newestMs),
    is_today: isToday,
    today_done: todayTasks.filter((t) => t.status === "done").length,
    today_total: todayTasks.length
  };
}
var URGENCY_EMOJI = /(🔴|🟡|🟢|⚪)/u;
var CLOSED_MARKERS = /(✅|已完成|已解|銷案|已銷)/u;
function parseSprintWaitingTable(md, sprintFile) {
  const secIdx = md.search(/^##\s*等\s*leo\s*清單/mu);
  if (secIdx < 0) return null;
  const section = md.slice(secIdx);
  const lines = section.split("\n");
  const items = [];
  let sawTable = false;
  for (const line of lines.slice(1)) {
    if (/^#{2,3}\s/.test(line) && !/^##\s*等/.test(line)) break;
    const m = line.match(/^\|\s*([A-Za-z]?\d+)\s*\|(.*)\|(.*)\|\s*$/u);
    if (!m) continue;
    sawTable = true;
    const id = m[1];
    const item = m[2].trim();
    const urgency = m[3].trim();
    if (item.startsWith("~~")) continue;
    if (CLOSED_MARKERS.test(urgency)) continue;
    items.push({
      id,
      urgency: urgency.match(URGENCY_EMOJI)?.[1] ?? "",
      title: cleanWaitingTitle(item),
      sprint: sprintFile
    });
  }
  if (!sawTable) return null;
  return sortWaitingItems(items);
}
function sortWaitingItems(items) {
  const rank = (u) => u === "\u{1F534}" ? 0 : u === "\u{1F7E1}" ? 1 : 2;
  return items.map((it, i) => ({ it, i })).sort((a, b) => rank(a.it.urgency) - rank(b.it.urgency) || a.i - b.i).map((x) => x.it);
}
function cleanWaitingTitle(raw2) {
  let s = raw2.replace(/\*\*/g, "").replace(/~~/g, "").replace(/`/g, "").trim();
  s = s.replace(/^(?:🔴|🟡|🟢|⚪)\s*/u, "");
  const colon = s.indexOf("\uFF1A");
  if (colon >= 12) s = s.slice(0, colon);
  if (s.length > 80) s = `${s.slice(0, 79)}\u2026`;
  return trimUnbalancedParen(s);
}
function pickLatestSprintFiles(names, n = 2) {
  return names.filter((name) => /^sprint-.*\.md$/.test(name)).sort().slice(-n).reverse();
}
function buildWaitingFallback(entries, nowMs) {
  const byTitle = /* @__PURE__ */ new Map();
  for (const e of entries) {
    const j = parseJsonContent(e);
    const title = typeof j?.title === "string" ? j.title : null;
    if (!title || byTitle.has(title)) continue;
    byTitle.set(title, {
      status: typeof j?.status === "string" ? j.status : "open",
      at_ms: parseCreatedAtMs(e.created_at)
    });
  }
  const open = [...byTitle.entries()].filter(([, v]) => v.status === "open");
  const newestMs = [...byTitle.values()].reduce(
    (m, v) => v.at_ms !== null && (m === null || v.at_ms > m) ? v.at_ms : m,
    null
  );
  const ago = agoMinutes(nowMs, newestMs);
  return {
    items: open.map(([title]) => ({ title })),
    source: byTitle.size ? "kbdb_dash_wait" : "none",
    updated_ago_minutes: ago,
    stale: ago < 0 || ago > 24 * 60,
    note: byTitle.size ? void 0 : "\u7BA1\u7DDA\u672A\u63A5\uFF1Adash_wait \u7121\u8CC7\u6599\u3001Gitea sprint \u8B80\u53D6\u672A\u8A2D\u5B9A\uFF08GITEA_TOKEN\uFF09"
  };
}
var BOARD_LINE = /^- \[([^\]]*)\]\s*(.*)$/u;
var DONE_STAMP = /完成（([^）\n]*)/gu;
var STAMP_DAY = /\d{4}-\d{2}-\d{2}/u;
var UTC_DAYLINE_ACTORS = /\[cloud-worker\]/u;
function nextDayKey(day) {
  const ms = Date.parse(`${day}T00:00:00Z`);
  return Number.isNaN(ms) ? day : new Date(ms + 24 * 3600 * 1e3).toISOString().slice(0, 10);
}
function classifyBoardMark(mark) {
  if (mark === " " || mark === "") return "todo";
  if (mark === "x" || mark === "X") return "done";
  if (mark.startsWith("\u{1F504}")) return "doing";
  if (mark.startsWith("!")) return "blocked";
  return null;
}
function extractCompletedDays(text) {
  const days = [];
  const push = (d) => {
    if (!days.includes(d)) days.push(d);
  };
  for (const m of text.matchAll(DONE_STAMP)) {
    const content = m[1];
    const day = content.match(STAMP_DAY)?.[0];
    if (!day) continue;
    push(day);
    if (UTC_DAYLINE_ACTORS.test(content)) push(nextDayKey(day));
  }
  return days;
}
function trimUnbalancedParen(s) {
  let depth = 0;
  let lastOpen = -1;
  for (let i = 0; i < s.length; i++) {
    if (s[i] === "\uFF08") {
      if (depth === 0) lastOpen = i;
      depth++;
    } else if (s[i] === "\uFF09") {
      depth = Math.max(0, depth - 1);
    }
  }
  if (depth > 0 && lastOpen >= 0) s = s.slice(0, lastOpen).trim();
  return s;
}
function cleanBoardTitle(raw2) {
  let s = raw2.replace(/\*\*/g, "").replace(/~~/g, "").replace(/`/g, "").trim();
  const colon = s.indexOf("\uFF1A");
  if (colon >= 4) s = s.slice(0, colon);
  if (s.length > 80) s = `${s.slice(0, 79)}\u2026`;
  return trimUnbalancedParen(s.trim());
}
function parseSprintTaskBoard(md, sprintFile) {
  const secIdx = md.search(/^##\s*任務板/mu);
  if (secIdx < 0) return null;
  const section = md.slice(secIdx);
  const lines = section.split("\n");
  const tasks = [];
  let current = null;
  for (const line of lines.slice(1)) {
    if (/^##\s/.test(line) && !/^###/.test(line)) break;
    if (/^###\s/.test(line)) {
      current = null;
      continue;
    }
    const m = line.match(BOARD_LINE);
    if (m) {
      current = null;
      const status = classifyBoardMark(m[1]);
      const body = m[2];
      const title = cleanBoardTitle(body);
      if (status === null || !title) continue;
      current = { title, status, completed_days: extractCompletedDays(body), sprint: sprintFile };
      tasks.push(current);
      continue;
    }
    if (/^\s+\S/.test(line)) {
      if (current) {
        for (const d of extractCompletedDays(line)) {
          if (!current.completed_days.includes(d)) current.completed_days.push(d);
        }
      }
      continue;
    }
    if (line.trim() !== "") current = null;
  }
  return tasks.length ? tasks : null;
}
function buildSprintRouteModel(tasks, nowMs) {
  const todayKey = taipeiDayKey(nowMs);
  const doneToday = tasks.filter((t) => t.status === "done" && t.completed_days.includes(todayKey));
  const open = tasks.filter((t) => t.status !== "done");
  return {
    tasks: [...doneToday, ...open].map((t) => ({ title: t.title, status: t.status, sprint: t.sprint })),
    today_done: doneToday.length,
    today_total: doneToday.length + open.length,
    done_today_titles: doneToday.map((t) => t.title)
  };
}
var GITEA_WAITING_CACHE_TTL_SECONDS = 90;
function reviveWaitingAges(model, fetchedAtMs, nowMs) {
  if (model.updated_ago_minutes < 0) return model;
  const drift = Math.max(0, Math.round((nowMs - fetchedAtMs) / 6e4));
  const ago = model.updated_ago_minutes + drift;
  return { ...model, updated_ago_minutes: ago, stale: ago > 48 * 60 };
}

// cypher-executor/src/lib/console-triage-model.ts
var TIER_ALIASES = {
  ai: "ai",
  collab: "collab",
  leo: "leo",
  mira80: "ai",
  collab15: "collab",
  leo5: "leo"
};
function normalizeStatus(v) {
  return v === "done" ? "done" : "new";
}
function normalizeTier(v) {
  const mapped = typeof v === "string" ? TIER_ALIASES[v.trim()] : void 0;
  return mapped ? { tier: mapped, unclassified: false } : { tier: "collab", unclassified: true };
}
function str(v) {
  return typeof v === "string" ? v.trim() : "";
}
function todoToTriageItem(e) {
  const j = parseJsonContent(e);
  const { tier, unclassified } = normalizeTier(j?.owner_tier);
  return {
    id: e.id,
    text: str(j?.text) || (e.content ?? ""),
    tier,
    unclassified,
    project: str(j?.project),
    source: str(j?.source),
    marker: str(j?.marker),
    status: normalizeStatus(j?.status),
    origin: "todo",
    at: e.created_at,
    at_ms: parseCreatedAtMs(e.created_at)
  };
}
function inboxToTriageItem(e) {
  const j = parseJsonContent(e);
  const from = str(j?.from);
  return {
    id: e.id,
    text: str(j?.text) || (e.content ?? ""),
    tier: "collab",
    unclassified: true,
    project: "",
    source: from ? `telegram\u30FB${from}` : "telegram",
    marker: "",
    status: normalizeStatus(j?.status),
    origin: "inbox",
    at: e.created_at,
    at_ms: parseCreatedAtMs(e.created_at)
  };
}
function applyTriageCheck(content, action, nowIso2) {
  let obj;
  try {
    const v = JSON.parse(content ?? "");
    obj = v && typeof v === "object" && !Array.isArray(v) ? v : { text: content ?? "" };
  } catch {
    obj = { text: content ?? "" };
  }
  if (action === "restore") {
    const { checked_via: _via, checked_at: _at, ...rest } = obj;
    return JSON.stringify({ ...rest, status: "new" });
  }
  return JSON.stringify({ ...obj, status: "done", checked_via: "console", checked_at: nowIso2 });
}
function buildTriageModel(todoEntries, inboxEntries) {
  const items = [
    ...todoEntries.map(todoToTriageItem),
    ...inboxEntries.map(inboxToTriageItem)
  ].sort((a, b) => (b.at_ms ?? -1) - (a.at_ms ?? -1));
  const projects = [...new Set(items.map((i) => i.project).filter(Boolean))].sort();
  const counts = { ai: 0, collab: 0, leo: 0, unclassified: 0, done: 0, total: items.length };
  for (const it of items) {
    if (it.status === "done") {
      counts.done++;
      continue;
    }
    counts[it.tier]++;
    if (it.unclassified) counts.unclassified++;
  }
  return { items, projects, counts };
}

// cypher-executor/src/routes/console-dashboard.ts
init_tenant();
var consoleDashboardRouter = new Hono2();
var STALE_MINUTES = 240;
var JUDGE_START_HOUR = 9;
var JUDGE_END_HOUR = 22;
var STANDARD_TASK_STATUS = /* @__PURE__ */ new Set(["done", "doing", "todo", "blocked"]);
async function fetchEntries(env, tenant2, entryType, limit) {
  const { base, headers } = kbdbBase(env);
  const params = new URLSearchParams({ owner_id: tenant2, entry_type: entryType, limit: String(limit) });
  try {
    const res = await fetch(`${base}/entries?${params.toString()}`, { headers });
    if (!res.ok) return [];
    const data = await res.json();
    return data.entries ?? [];
  } catch {
    return [];
  }
}
async function fetchJson(url, headers) {
  try {
    const res = await fetch(url, headers ? { headers } : void 0);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
async function fetchTripletTotal(env, tenant2) {
  const { base, headers } = kbdbBase(env);
  const data = await fetchJson(
    `${base}/records/triplet-stats?owner_id=${encodeURIComponent(tenant2)}`,
    headers
  );
  if (!data || !Array.isArray(data.stats)) return null;
  let total = 0;
  for (const row of data.stats) {
    if (typeof row?.triplet_count !== "number") return null;
    total += row.triplet_count;
  }
  return total;
}
async function fetchEntryTotal(env, filters) {
  const { base, headers } = kbdbBase(env);
  const params = new URLSearchParams({ ...filters, limit: "1" });
  const data = await fetchJson(`${base}/entries?${params.toString()}`, headers);
  return data && typeof data.total === "number" ? data.total : null;
}
async function fetchGiteaSprint(env, nowMs) {
  const base = (env.GITEA_BASE_URL ?? "").replace(/\/$/, "");
  const token = env.GITEA_TOKEN;
  if (!base || !token) return null;
  const repo = env.GITEA_SPRINT_REPO ?? "inkstone/InkStoneCo";
  const dir = env.GITEA_SPRINT_DIR ?? "system-dev/docs/3-specs/autonomy-dispatch";
  const headers = { Authorization: `token ${token}` };
  try {
    const files = await fetchJson(`${base}/api/v1/repos/${repo}/contents/${encodeURI(dir)}`, headers);
    if (!files) return null;
    const sprints = pickLatestSprintFiles(files.map((f) => f.name));
    if (!sprints.length) return null;
    const parsed = await Promise.all(
      sprints.map(async (name) => {
        const rawRes = await fetch(`${base}/api/v1/repos/${repo}/raw/${encodeURI(`${dir}/${name}`)}`, { headers });
        if (!rawRes.ok) return null;
        const text = await rawRes.text();
        return { waiting: parseSprintWaitingTable(text, name), board: parseSprintTaskBoard(text, name) };
      })
    );
    const readFiles = sprints.filter((_, i) => parsed[i]?.waiting != null);
    const merged = parsed.map((p) => p?.waiting).filter((p) => p != null).flat();
    if (!readFiles.length) return null;
    const boardMerged = parsed.map((p) => p?.board).filter((b) => b != null).flat();
    let ago = -1;
    const commits = await fetchJson(
      `${base}/api/v1/repos/${repo}/commits?path=${encodeURIComponent(`${dir}/${readFiles[0]}`)}&limit=1&stat=false&verification=false&files=false`,
      headers
    );
    const date = commits?.[0]?.commit?.committer?.date;
    if (date) {
      const ms = Date.parse(date);
      if (!Number.isNaN(ms)) ago = agoMinutes(nowMs, ms);
    }
    return {
      waiting: {
        items: sortWaitingItems(merged),
        source: "gitea_sprint",
        updated_ago_minutes: ago,
        stale: ago >= 0 && ago > 48 * 60,
        sprint_files: readFiles
      },
      board: boardMerged.length ? boardMerged : null
    };
  } catch {
    return null;
  }
}
async function cachedGiteaSprint(env, nowMs, waitUntil, fetcher = fetchGiteaSprint) {
  if (!env.GITEA_BASE_URL || !env.GITEA_TOKEN) return null;
  const repo = env.GITEA_SPRINT_REPO ?? "inkstone/InkStoneCo";
  const dir = env.GITEA_SPRINT_DIR ?? "system-dev/docs/3-specs/autonomy-dispatch";
  const cacheKey = new Request(
    `https://console-dashboard.arcrun.internal/gitea-waiting?${new URLSearchParams({ base: env.GITEA_BASE_URL, repo, dir }).toString()}`
  );
  const cache = caches.default;
  try {
    const hit = await cache.match(cacheKey);
    if (hit) {
      const envelope2 = await hit.json();
      return {
        waiting: reviveWaitingAges(envelope2.snapshot.waiting, envelope2.fetched_at_ms, nowMs),
        board: envelope2.snapshot.board,
        cache: "hit"
      };
    }
  } catch {
  }
  const fresh = await fetcher(env, nowMs);
  if (!fresh) return null;
  const envelope = { snapshot: fresh, fetched_at_ms: nowMs };
  try {
    waitUntil(
      cache.put(
        cacheKey,
        new Response(JSON.stringify(envelope), {
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": `public, max-age=${GITEA_WAITING_CACHE_TTL_SECONDS}`
          }
        })
      )
    );
  } catch {
  }
  return { ...fresh, cache: "miss" };
}
consoleDashboardRouter.get("/console/dashboard-data", async (c) => {
  const tenant2 = knowledgeOwner(c.env);
  const now2 = Date.now();
  const { base: kbdbUrl, headers: kbdbHeaders2 } = kbdbBase(c.env);
  const [
    beatEntries,
    taskEntries,
    waitEntries,
    inboxEntries,
    giteaSprint,
    kbdbHealth,
    embedStatus,
    graphProbe,
    tripletTotal,
    entriesTotal,
    wikiCardTotal,
    workflowTotal
  ] = await Promise.all([
    fetchEntries(c.env, tenant2, "dash_beat", 100),
    fetchEntries(c.env, tenant2, "dash_task", 200),
    fetchEntries(c.env, tenant2, "dash_wait", 100),
    fetchEntries(c.env, tenant2, "inbox", 200),
    cachedGiteaSprint(c.env, now2, (p) => c.executionCtx.waitUntil(p)),
    fetchJson(`${kbdbUrl}/health`, kbdbHeaders2),
    fetchJson(`${kbdbUrl}/embed/backfill/status`, kbdbHeaders2),
    // 圖服務活著沒（燈號）——數字不從這裡拿，見 fetchTripletTotal。
    // 🔴 inkstone/Arcrun#168 收斂：原本探的是 kbdb-graph-plugin 的 /triplets/stats，
    // 但圖能力已收斂回 KBDB（GET /graph/neighbors/:node）⇒ 探那顆 plugin 等於在量一個
    // 沒有人走的服務：它沒裝就永遠紅燈、裝了也只證明一個不再被使用的東西活著。
    // 改探 KBDB 那支端點本身——用一個不存在的節點名，它會誠實回 count:0 的 200
    //（graph-query.ts：查不到就是空結果，不是錯誤），正好當「這條路通不通」的探針。
    fetchJson(
      `${kbdbUrl}/graph/neighbors/${encodeURIComponent("__arcrun_graph_probe__")}?depth=1`,
      kbdbHeaders2
    ),
    fetchTripletTotal(c.env, tenant2),
    // owner_id 一律鎖本租戶：原本不帶 owner 會混到別租戶（實測 459,137 vs leo 的 458,732）
    fetchEntryTotal(c.env, { owner_id: tenant2 }),
    fetchEntryTotal(c.env, { entry_type: "wiki_card", owner_id: tenant2 }),
    fetchEntryTotal(c.env, { entry_type: "workflow", owner_id: tenant2 })
  ]);
  const beats = [];
  const seenActors = /* @__PURE__ */ new Set();
  for (const e of beatEntries) {
    const j = parseJsonContent(e);
    const actor = typeof j?.actor === "string" ? j.actor : null;
    if (!actor || seenActors.has(actor)) continue;
    seenActors.add(actor);
    const ms = parseCreatedAtMs(e.created_at);
    beats.push({
      actor,
      event: typeof j?.event === "string" ? j.event : "",
      note: typeof j?.note === "string" ? j.note : "",
      at: e.created_at,
      ago_minutes: agoMinutes(now2, ms)
    });
  }
  const lastBeat = beats.filter((b) => b.ago_minutes >= 0).sort((a, b) => a.ago_minutes - b.ago_minutes)[0] ?? null;
  let waiting;
  let waitingCache = null;
  if (giteaSprint) {
    waiting = giteaSprint.waiting;
    waitingCache = giteaSprint.cache;
  } else {
    waiting = buildWaitingFallback(waitEntries, now2);
    if (waiting.source === "kbdb_dash_wait" && !(c.env.GITEA_BASE_URL && c.env.GITEA_TOKEN)) {
      waiting.note = "Gitea sprint \u6E05\u55AE\u672A\u63A5\uFF08\u7F3A GITEA_TOKEN secret\uFF09\u2014\u2014\u4EE5\u4E0B\u662F dash_wait \u6B98\u8CC7\u6599";
    } else if (waiting.source === "kbdb_dash_wait") {
      waiting.note = "Gitea sprint \u6E05\u55AE\u8B80\u53D6\u5931\u6557\u2014\u2014\u4EE5\u4E0B\u662F dash_wait \u6B98\u8CC7\u6599";
    }
  }
  const sprintRoute = giteaSprint?.board ? buildSprintRouteModel(giteaSprint.board, now2) : null;
  const route = buildRouteModel(taskEntries, now2);
  const boardAgo = giteaSprint ? giteaSprint.waiting.updated_ago_minutes : -1;
  const boardUpdatedToday = boardAgo >= 0 && taipeiDayKey(now2 - boardAgo * 6e4) === taipeiDayKey(now2);
  const inboxNew = inboxEntries.reduce((n, e) => {
    const j = parseJsonContent(e);
    return j && j.status !== "done" ? n + 1 : n;
  }, 0);
  const todayWrites = route.tasks.filter((t) => t.is_today_write);
  const hasBlocked = todayWrites.some((t) => t.status === "blocked");
  const hasLagMark = todayWrites.some((t) => !STANDARD_TASK_STATUS.has(t.status));
  const taipeiHour = new Date(now2 + 8 * 3600 * 1e3).getUTCHours();
  const inJudgeWindow = taipeiHour >= JUDGE_START_HOUR && taipeiHour < JUDGE_END_HOUR;
  const beatStale = lastBeat === null || lastBeat.ago_minutes > STALE_MINUTES;
  const kbdbOk = kbdbHealth?.ok === true;
  const light = hasBlocked || inJudgeWindow && beatStale || !kbdbOk ? "red" : hasLagMark ? "yellow" : "green";
  const lightReason = !kbdbOk ? "KBDB \u57FA\u672C\u76E4 /health \u6253\u4E0D\u901A" : hasBlocked ? "\u4ECA\u65E5\u4EFB\u52D9\u6709 blocked" : inJudgeWindow && beatStale ? `\u5FC3\u8DF3\u8D85\u904E ${STALE_MINUTES} \u5206\u9418` : hasLagMark ? "\u4ECA\u65E5\u4EFB\u52D9\u6709\u843D\u5F8C\u6A19\u8A18" : "";
  return c.json({
    light,
    light_reason: lightReason,
    last_beat: lastBeat ? { actor: lastBeat.actor, ago_minutes: lastBeat.ago_minutes, event: lastBeat.event, note: lastBeat.note } : null,
    beats,
    // 路線：sprint 任務板優先（tasks 欄位形狀與 dash_task 版相容——title/status/scope）；
    // 板上開著的項 is_today_write=false（燈號沿 #36 原則只吃 dash_task 今日寫入＋心跳＋KBDB，
    // 板上掛了幾天的 [!] 不會天天亮紅燈——那是「等裁決」不是「今天卡住」）
    tasks: sprintRoute ? sprintRoute.tasks.map((t, i) => ({
      title: t.title,
      status: t.status,
      order: i,
      scope: "today",
      age_minutes: boardAgo,
      is_today_write: t.status === "done",
      // done 項必然是「今天完成」的（模型已濾）
      sprint: t.sprint ?? null
    })) : route.tasks.map((t) => ({
      title: t.title,
      status: t.status,
      order: t.order,
      scope: t.scope,
      age_minutes: t.age_minutes,
      is_today_write: t.is_today_write,
      sprint: null
    })),
    route_meta: sprintRoute ? {
      source: "gitea_sprint_board",
      // is_today＝板檔今天（台北）有 commit 過；false → 頁面誠實標「今日任務板未更新」
      is_today: boardUpdatedToday,
      updated_ago_minutes: boardAgo,
      sprint_files: waiting.sprint_files ?? null
    } : {
      source: "kbdb_dash_task",
      is_today: route.is_today,
      updated_ago_minutes: route.updated_ago_minutes,
      sprint_files: null
    },
    today_done: sprintRoute ? sprintRoute.today_done : route.today_done,
    today_total: sprintRoute ? sprintRoute.today_total : route.today_total,
    done_today_titles: sprintRoute ? sprintRoute.done_today_titles : null,
    waiting: waiting.items,
    waiting_meta: {
      source: waiting.source,
      updated_ago_minutes: waiting.updated_ago_minutes,
      stale: waiting.stale,
      sprint_files: waiting.sprint_files ?? null,
      note: waiting.note ?? null,
      // Gitea 快取層狀態（hit/miss；fallback 路徑為 null）——快取生效的客觀證據
      cache: waitingCache
    },
    inbox_new: inboxNew,
    system: {
      kbdb_ok: kbdbHealth ? kbdbHealth.ok === true : false,
      embed: embedStatus ? { enabled: embedStatus.enabled === true, embedded: embedStatus.embedded ?? null, pending: embedStatus.pending ?? null } : null,
      // ok = 圖查詢通不通（探針讀得到就是通）；triplets = KBDB 真 COUNT（兩件事，不互相吞）
      graph: { ok: graphProbe !== null, triplets: tripletTotal },
      workflow_total: workflowTotal
    },
    kb: {
      entries_total: entriesTotal,
      wiki_card_total: wikiCardTotal,
      triplets_total: tripletTotal
    },
    generated_at: new Date(now2).toISOString()
  });
});
consoleDashboardRouter.get("/console/kb-scale-data", async (c) => {
  const tenant2 = knowledgeOwner(c.env);
  const { base, headers } = kbdbBase(c.env);
  const now2 = Date.now();
  const [wikiCards, tripletTotal, embedStatus] = await Promise.all([
    // limit=1 順手拿最新一筆 created_at（list 為 created_at DESC）＝「最近寫入時間」
    fetchJson(
      `${base}/entries?${new URLSearchParams({ owner_id: tenant2, entry_type: "wiki_card", limit: "1" }).toString()}`,
      headers
    ),
    // #100：三元組數改讀 KBDB 真 COUNT，不再讀 graph-plugin 的分頁長度（見 fetchTripletTotal 註）
    fetchTripletTotal(c.env, tenant2),
    fetchJson(`${base}/embed/backfill/status`, headers)
  ]);
  const latestMs = parseCreatedAtMs(wikiCards?.entries?.[0]?.created_at ?? null);
  return c.json({
    wiki_card_total: typeof wikiCards?.total === "number" ? wikiCards.total : null,
    wiki_card_latest_ago_minutes: latestMs === null ? -1 : agoMinutes(now2, latestMs),
    triplets_total: tripletTotal,
    embedded: embedStatus?.embedded ?? null,
    embed_enabled: embedStatus ? embedStatus.enabled === true : null,
    generated_at: new Date(now2).toISOString()
  });
});
consoleDashboardRouter.get("/console/settings-data", (c) => {
  const raw2 = c.env.MCP_TOKEN_TTL;
  const parsed = raw2 ? parseInt(raw2, 10) : NaN;
  const fromEnv = Number.isFinite(parsed) && parsed > 0;
  return c.json({
    mcp_token_ttl_seconds: fromEnv ? parsed : 2592e3,
    mcp_token_ttl_source: fromEnv ? "env" : "default"
  });
});
consoleDashboardRouter.get("/console/triage-data", async (c) => {
  const ok = await validateConsoleSession(c.env, c.req.header("authorization"));
  if (!ok) return c.json({ error: "\u9700\u8981\u767B\u5165\uFF08console session\uFF09" }, 401);
  const tenant2 = knowledgeOwner(c.env);
  const [todoEntries, inboxEntries] = await Promise.all([
    fetchEntries(c.env, tenant2, "todo", 500),
    fetchEntries(c.env, tenant2, "inbox", 200)
  ]);
  const model = buildTriageModel(todoEntries, inboxEntries);
  return c.json({ ...model, generated_at: (/* @__PURE__ */ new Date()).toISOString() });
});
consoleDashboardRouter.post("/console/triage-check", async (c) => {
  const ok = await validateConsoleSession(c.env, c.req.header("authorization"));
  if (!ok) return c.json({ error: "\u9700\u8981\u767B\u5165\uFF08console session\uFF09" }, 401);
  const body = await c.req.json().catch(() => null);
  const entryId = typeof body?.entry_id === "string" ? body.entry_id.trim() : "";
  if (!entryId) return c.json({ error: "entry_id \u5FC5\u586B" }, 400);
  const action = body?.action === "restore" ? "restore" : "check";
  const tenant2 = knowledgeOwner(c.env);
  const { base, headers } = kbdbBase(c.env);
  const got = await fetchJson(
    `${base}/entries/${encodeURIComponent(entryId)}`,
    headers
  );
  const entry = got?.entry;
  if (!entry) return c.json({ error: "\u627E\u4E0D\u5230\u9019\u7B46\u5F85\u8FA6\uFF08\u53EF\u80FD\u5DF2\u88AB\u522A\u9664\uFF09" }, 404);
  if (entry.owner_id !== tenant2) return c.json({ error: "\u627E\u4E0D\u5230\u9019\u7B46\u5F85\u8FA6\uFF08\u53EF\u80FD\u5DF2\u88AB\u522A\u9664\uFF09" }, 404);
  if (entry.entry_type !== "todo" && entry.entry_type !== "inbox") {
    return c.json({ error: "\u53EA\u6709\u5206\u6D41\u53F0\u9805\u76EE\uFF08todo/inbox\uFF09\u80FD\u5728\u9019\u88E1\u52FE\u6389" }, 400);
  }
  const newContent = applyTriageCheck(entry.content, action, (/* @__PURE__ */ new Date()).toISOString());
  const res = await fetch(`${base}/entries/${encodeURIComponent(entryId)}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({ content: newContent })
  });
  if (!res.ok) return c.json({ error: `KBDB \u56DE\u5BEB\u5931\u6557\uFF08HTTP ${res.status}\uFF09` }, 502);
  return c.json({ success: true, entry_id: entryId, action, status: action === "restore" ? "new" : "done" });
});

// cypher-executor/src/routes/portal-data.ts
init_dist();

// cypher-executor/src/lib/app-glyphs.ts
var APP_GLYPH_IDS = ["doc", "note", "layers", "pin", "wrench", "box", "folder", "check", "bulb", "bell", "chart", "compass"];
var APP_GLYPH_BODIES = {
  doc: '<path d="M6 3h7l5 5v12a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"/><path d="M13 3v5h5"/>',
  note: '<path d="M17 3a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/><path d="M14.5 5.5 18.5 9.5"/>',
  layers: '<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 13 9 5 9-5"/>',
  pin: '<path d="M8.5 3h7l-1 6 3.5 3v2H6v-2l3.5-3-1-6Z"/><path d="M12 14v7"/>',
  wrench: '<path d="M15.5 3.4a5.2 5.2 0 0 0-6.4 6.4l-5.4 5.4a2 2 0 0 0 2.8 2.8l5.4-5.4a5.2 5.2 0 0 0 6.4-6.4l-3 3-2.8-.4-.4-2.8 3-3Z"/>',
  box: '<path d="M3.5 7.5 12 3l8.5 4.5v9L12 21l-8.5-4.5v-9Z"/><path d="M3.5 7.5 12 12l8.5-4.5M12 12v9"/>',
  folder: '<path d="M3 6.5A1.5 1.5 0 0 1 4.5 5h4l2 2.5h7A1.5 1.5 0 0 1 19 9v8.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 3 17.5v-11Z"/>',
  check: '<circle cx="12" cy="12" r="8.5"/><path d="m8 12.2 2.8 2.8L16 9.8"/>',
  bulb: '<path d="M12 3a6 6 0 0 0-3.5 10.9V16h7v-2.1A6 6 0 0 0 12 3Z"/><path d="M9.8 19h4.4M10.5 21.5h3"/>',
  bell: '<path d="M18 8.5a6 6 0 1 0-12 0c0 5.5-2 7-2 7h16s-2-1.5-2-7Z"/><path d="M10.2 19a2.2 2.2 0 0 0 3.6 0"/>',
  chart: '<path d="M4 4v16h16"/><path d="M8 20v-6.5M12.5 20V8.5M17 20v-4"/>',
  compass: '<circle cx="12" cy="12" r="8.5"/><path d="m15.6 8.4-2.1 5.1-5.1 2.1 2.1-5.1 5.1-2.1Z"/>'
};
var EMOJI_GLYPH = {
  "\u{1F4C4}": "doc",
  "\u{1F5D2}\uFE0F": "note",
  "\u{1F5D2}": "note",
  "\u{1F4DD}": "note",
  "\u{1F9E9}": "layers",
  "\u{1F4CC}": "pin",
  "\u{1F527}": "wrench",
  "\u{1F6E0}\uFE0F": "wrench",
  "\u{1F4E6}": "box",
  "\u{1F5C2}\uFE0F": "folder",
  "\u{1F5C2}": "folder",
  "\u{1F4C1}": "folder",
  "\u2705": "check",
  "\u{1F4A1}": "bulb",
  "\u{1F514}": "bell",
  "\u{1F4CA}": "chart",
  "\u{1F4C8}": "chart",
  "\u{1F9ED}": "compass"
};
function appGlyph(icon, name) {
  if (icon && EMOJI_GLYPH[icon]) return EMOJI_GLYPH[icon];
  const seed = String(icon || name || "");
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h, 31) + seed.charCodeAt(i) >>> 0;
  return APP_GLYPH_IDS[h % APP_GLYPH_IDS.length];
}

// cypher-executor/src/lib/app-catalog/notes.json
var notes_default = {
  id: "notes",
  name: "\u7B46\u8A18",
  icon: "\u{1F4DD}",
  version: "1.1.1",
  workflows: [
    {
      name: "create_note",
      description: "\u6536\u4E00\u6BB5 markdown \u5167\u5BB9\uFF08\u53EF\u9078\u65E5\u671F\uFF09\uFF0C\u5BEB\u5165\u4E00\u7B46 note record\uFF0C\u56DE\u50B3\u6574\u7406\u904E\u7684\u4E7E\u6DE8\u6B04\u4F4D \uFF08\u4E0D\u662F KBDB \u539F\u59CB\u56DE\u61C9\u2014\u2014\u90A3\u500B\u8981\u547C\u53EB\u7AEF\u81EA\u5DF1\u525D body \u5B57\u4E32\uFF0C\u4E0D\u8A72\u8B93\u524D\u7AEF\u505A\u9019\u4EF6\u4E8B\uFF09\u3002\n",
      graph: {
        id: "create_note",
        name: "create_note",
        nodes: [
          {
            id: "input",
            type: "Input",
            label: "input"
          },
          {
            id: "prep",
            type: "Component",
            label: "prep",
            componentId: "code",
            data: {
              code: `// \u{1F534} \u771F\u5BE6\u8E29\u904E\u7684\u5751\uFF08\u672C\u6A5F\u7528 matrix/arcrun \u7684 GraphExecutor \u771F\u8DD1\u904E\u624D\u767C\u73FE\uFF0C\u4E0D\u662F\u731C\u7684\uFF09\uFF1A
// {{input.xxx}} \u5728 xxx \u9019\u500B key \u771F\u7684\u4E0D\u5B58\u5728\u6642\uFF0CGraphExecutor \u7684 interpolateString
// \u6703\u56DE\u300C\u539F\u6A23\u4FDD\u7559\u9019\u500B {{...}} \u5B57\u9762\u5B57\u4E32\u300D\uFF0C\u4E0D\u662F undefined\u3001\u4E5F\u4E0D\u662F\u7A7A\u5B57\u4E32
// \uFF08matrix/arcrun/cypher-executor/src/graph-executor.ts interpolateString \u7684\u65E2\u6709\u8A2D\u8A08\uFF1A
//  \u300C\u627E\u4E0D\u5230\u5C31\u4FDD\u7559\u5B57\u9762\u5B57\u4E32\u300D\uFF0C\u662F\u5F15\u64CE\u6545\u610F\u7684\u884C\u70BA\uFF0C\u4E0D\u662F bug\uFF09\u3002
// \u21D2 \u547C\u53EB\u7AEF\u6F0F\u5E36 date \u6642\uFF0C\u9019\u88E1\u6536\u5230\u7684 input.date \u4E0D\u662F undefined\uFF0C\u662F\u5B57\u4E32 "{{input.date}}"
//   \u2014\u2014\u82E5\u53EA\u5224\u65B7 == null || === ''\uFF0C\u9019\u500B\u5B57\u9762\u5B57\u4E32\u6703\u88AB\u8AA4\u5224\u6210\u300C\u6709\u7D66\u503C\u300D\uFF0C
//   \u7136\u5F8C\u5728 YYYY-MM-DD \u683C\u5F0F\u6AA2\u67E5\u90A3\u95DC\u5931\u6557\uFF0C\u8B93\u300C\u4E0D\u5E36 date \u5C31\u7528\u4ECA\u5929\u300D\u6574\u500B\u5931\u6548\u3002
// \u4FEE\u6CD5\uFF1A\u591A\u5224\u4E00\u7A2E\u300C\u770B\u8D77\u4F86\u50CF\u6C92\u89E3\u958B\u7684\u6A21\u677F\u300D\u7684\u5F62\u72C0\uFF0C\u8996\u540C\u6C92\u7D66\u3002
function provided(v) {
  if (typeof v !== 'string') return false;
  var t = v.trim();
  return t !== '' && !/^\\{\\{[\\s\\S]*\\}\\}$/.test(t);
}
const content = provided(input.content) ? String(input.content).trim() : '';
if (!content) return { success: false, error: 'content \u4E0D\u53EF\u70BA\u7A7A\uFF08\u7B46\u8A18\u81F3\u5C11\u8981\u6709\u5167\u5BB9\uFF09' };
const now = new Date();
const rawDate = provided(input.date) ? String(input.date).trim() : now.toISOString().slice(0, 10);
if (!/^\\d{4}-\\d{2}-\\d{2}$/.test(rawDate)) {
  return { success: false, error: 'date \u5FC5\u9808\u662F YYYY-MM-DD \u683C\u5F0F\uFF08\u6536\u5230\uFF1A' + rawDate + '\uFF09' };
}
// parent_id\uFF1A\u7701\u7565\uFF0F\u7A7A\u5B57\u4E32\uFF1D\u4E00\u5247\u7368\u7ACB\u7B46\u8A18\uFF1B\u975E\u7A7A\uFF1D\u9019\u662F\u67D0\u5247\u7B46\u8A18\u7684\u56DE\u8986\uFF08\u503C\uFF1D\u90A3\u5247\u7684 record_id\uFF09\u3002
// \u6C92\u6709\u683C\u5F0F\u9650\u5236\uFF08record_id \u7684\u5F62\u72C0\u7531 KBDB \u6C7A\u5B9A\uFF0C\u9019\u88E1\u4E0D\u91CD\u8907\u9A57\u8B49\u5B83\u7684\u9577\u76F8\uFF09\u2014\u2014
// \u9019\u6A23\u524D\u7AEF\u4E0D\u7528\u5148\u77E5\u9053 record_id \u7684\u683C\u5F0F\u898F\u5247\uFF0C\u53EA\u8981\u300C\u539F\u6A23\u628A\u4E0A\u4E00\u6B65\u62FF\u5230\u7684 id \u50B3\u56DE\u4F86\u300D\u5C31\u5C0D\u3002
const parentId = provided(input.parent_id) ? String(input.parent_id).trim() : '';
return { success: true, content: content, date: rawDate, created_at: now.toISOString(), parent_id: parentId };
`,
              input: {
                content: "{{input.content}}",
                date: "{{input.date}}",
                parent_id: "{{input.parent_id}}"
              },
              limits: {
                timeout_ms: 1e3,
                max_output_bytes: 8192
              }
            }
          },
          {
            id: "write_note",
            type: "Component",
            label: "write_note",
            componentId: "http_request",
            data: {
              method: "POST",
              url: "__CYPHER_BASE__/kbdb/records",
              headers: {
                "Content-Type": "application/json",
                "X-Arcrun-API-Key": "__NAMESPACE__"
              },
              body_json: {
                template: "note",
                values: {
                  date: "{{prep.data.date}}",
                  content: "{{prep.data.content}}",
                  created_at: "{{prep.data.created_at}}",
                  parent_id: "{{prep.data.parent_id}}"
                }
              }
            }
          },
          {
            id: "extract_note",
            type: "Component",
            label: "extract_note",
            componentId: "code",
            data: {
              code: "function parse(b) { if (typeof b === 'string') { try { return JSON.parse(b); } catch (e) { return null; } } return b; }\nconst body = parse(input.body);\nif (!body || body.success !== true || !body.record) {\n  return { success: false, error: (body && body.error) || 'KBDB \u5BEB\u5165\u6C92\u6709\u56DE\u53EF\u7528\u7684 record' };\n}\nconst v = body.record.values || {};\nreturn {\n  success: true,\n  record_id: body.record.record_id,\n  date: v.date || '',\n  content: v.content || '',\n  created_at: v.created_at || '',\n  parent_id: v.parent_id || '',\n};\n",
              input: {
                body: "{{write_note.data.body}}"
              },
              limits: {
                timeout_ms: 1e3,
                max_output_bytes: 65536
              }
            }
          }
        ],
        edges: [
          {
            from: "input",
            to: "prep",
            type: "ON_SUCCESS"
          },
          {
            from: "prep",
            to: "write_note",
            type: "ON_SUCCESS"
          },
          {
            from: "write_note",
            to: "extract_note",
            type: "ON_SUCCESS"
          }
        ]
      }
    },
    {
      name: "list_notes",
      description: "\u53D6\u56DE\u6CB3\u9053\uFF1A\u9810\u8A2D\u5168\u90E8\uFF08\u4F9D created_at \u65B0\u5230\u820A\uFF0C\u53EA\u7B97\u7368\u7ACB\u7B46\u8A18\uFF09\uFF0C\u5E36 date \u53EA\u56DE\u90A3\u4E00\u5929\u7684\u7B46\u8A18\uFF1B \u6BCF\u5247\u7B46\u8A18\u9644\u4E0A\u5B83\u7684\u56DE\u8986\u6E05\u55AE\uFF08replies[]\uFF0C\u4F9D created_at \u7531\u820A\u5230\u65B0\uFF09\u3002\n",
      graph: {
        id: "list_notes",
        name: "list_notes",
        nodes: [
          {
            id: "input",
            type: "Input",
            label: "input"
          },
          {
            id: "fetch_notes",
            type: "Component",
            label: "fetch_notes",
            componentId: "http_request",
            data: {
              method: "GET",
              url: "__CYPHER_BASE__/kbdb/records/by-template/note?limit=500",
              headers: {
                Accept: "application/json",
                "X-Arcrun-API-Key": "__NAMESPACE__"
              }
            }
          },
          {
            id: "filter_sort",
            type: "Component",
            label: "filter_sort",
            componentId: "code",
            data: {
              code: "// \u{1F534} \u771F\u5BE6\u8E29\u904E\u7684\u5751\uFF08\u672C\u6A5F\u7528 matrix/arcrun \u7684 GraphExecutor \u771F\u8DD1\u904E\u624D\u767C\u73FE\u2014\u2014\n// \u4E0D\u52A0\u9019\u6BB5\u9632\u8B77\u6642\uFF0C\u300C\u4E0D\u5E36 date\uFF1D\u67E5\u5168\u90E8\u300D\u9019\u500B\u6700\u5E38\u7528\u7684\u9810\u8A2D\u8DEF\u5F91\u6703\u975C\u9ED8\u56DE\u50B3 0 \u7B46\uFF0C\n// \u8A73\u7D30\u6210\u56E0\u898B notes-create.yaml \u7684 prep \u7BC0\u9EDE\u540C\u6B3E\u8A3B\u89E3\uFF0C\u9019\u88E1\u4E0D\u91CD\u8907\u8CBC\u4E00\u6B21\uFF09\u3002\nfunction provided(v) {\n  if (typeof v !== 'string') return false;\n  var t = v.trim();\n  return t !== '' && !/^\\{\\{[\\s\\S]*\\}\\}$/.test(t);\n}\nfunction parse(b) { if (typeof b === 'string') { try { return JSON.parse(b); } catch (e) { return null; } } return b; }\nconst body = parse(input.body) || {};\nconst records = Array.isArray(body.records) ? body.records : [];\nconst wantDate = provided(input.date) ? String(input.date).trim() : '';\nconst all = records.map(function (r) {\n  const v = r.values || {};\n  return {\n    record_id: r.record_id,\n    date: v.date || '',\n    content: v.content || '',\n    created_at: v.created_at || '',\n    parent_id: v.parent_id || ''\n  };\n});\n// \u5206\u6210\u300C\u7368\u7ACB\u7B46\u8A18\u300D\uFF08parent_id \u7A7A\uFF09\u8207\u300C\u56DE\u8986\u300D\uFF08parent_id \u6307\u56DE\u67D0\u5247\uFF09\uFF0C\n// \u56DE\u8986\u6309 parent_id \u5206\u6876\uFF0C\u639B\u5230\u5C0D\u61C9\u90A3\u5247\u7684 replies[]\uFF08\u6CB3\u9053\u4E0D\u76F4\u63A5\u5217\u56DE\u8986\uFF09\u3002\nconst repliesByParent = {};\nall.forEach(function (n) {\n  if (!n.parent_id) return;\n  (repliesByParent[n.parent_id] = repliesByParent[n.parent_id] || []).push(n);\n});\nObject.keys(repliesByParent).forEach(function (pid) {\n  repliesByParent[pid].sort(function (a, b) { return (a.created_at || '').localeCompare(b.created_at || ''); });\n});\nlet notes = all.filter(function (n) { return !n.parent_id; });\nif (wantDate) notes = notes.filter(function (n) { return n.date === wantDate; });\nnotes.sort(function (a, b) { return (b.created_at || '').localeCompare(a.created_at || ''); });\nnotes = notes.map(function (n) {\n  return Object.assign({}, n, { replies: repliesByParent[n.record_id] || [] });\n});\nreturn { success: true, notes: notes, count: notes.length, date: wantDate || null };\n",
              input: {
                body: "{{fetch_notes.data.body}}",
                date: "{{input.date}}"
              },
              limits: {
                timeout_ms: 3e3,
                max_output_bytes: 4194304
              }
            }
          }
        ],
        edges: [
          {
            from: "input",
            to: "fetch_notes",
            type: "ON_SUCCESS"
          },
          {
            from: "fetch_notes",
            to: "filter_sort",
            type: "ON_SUCCESS"
          }
        ]
      }
    }
  ],
  ui: {
    html: `<!doctype html>
<html lang="zh-Hant">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
<title>\u7B46\u8A18</title>
<!--
  ui/index.html \u2014 \u7B46\u8A18 App \u524D\u7AEF\uFF08inkstone/InkStoneCo#2\uFF1B\u57F7\u884C\u7968 inkstone/arcrun-app-note#1\uFF09

  \u624B\u6A5F\u512A\u5148\u3001\u55AE\u4E00 HTML \u6A94\uFF08\u5916\u52A0 notes-core.js \u4E00\u4EFD\u7D14\u908F\u8F2F\uFF09\uFF0C\u96F6\u5916\u90E8\u4F9D\u8CF4\u3001\u96F6 CDN\uFF0C
  \u7167 design.md \u5C0D\u300C\u756B\u9762\u8CC7\u7522\u8981\u80FD\u843D\u5730\u5230\u5BE6\u4F8B\u300D\u7684\u8981\u6C42\uFF1A\u9019\u500B\u6A94\u6848\u672C\u8EAB\u5C31\u662F\u5168\u90E8\uFF0C
  \u4E0D\u9700\u8981 build pipeline\uFF0C\u8907\u88FD\u9019\u5169\u500B\u6A94\u6848\u5230\u4EFB\u4F55\u5730\u65B9\u90FD\u80FD\u958B\u3002

  \u{1F534} \u9019\u4E00\u9801\u9810\u8A2D\u8DD1\u5728 MOCK \u6A21\u5F0F\uFF08localStorage \u5047\u8CC7\u6599\uFF09\u2014\u2014\u56E0\u70BA inkstone/Arcrun#82
  \u7684\u6CDB\u7528\u52D5\u4F5C\u7AEF\u9EDE\u9084\u6C92\u505A\u51FA\u4F86\uFF0C\u6C92\u6709\u771F\u5F8C\u7AEF\u53EF\u4EE5\u6253\u3002MOCK \u6A6B\u5E45\u6C38\u9060\u986F\u793A\u5728\u756B\u9762\u4E0A\uFF0C
  \u4E0D\u5141\u8A31\u4F7F\u7528\u8005\u8AA4\u4EE5\u70BA\u9019\u662F\u771F\u8CC7\u6599\u3002\u7B49\u771F\u7AEF\u9EDE\u505A\u51FA\u4F86\uFF0C\u53EA\u8981\u5728\u9801\u9762\u8F09\u5165\u524D\u8A2D\u5B9A\uFF1A
      window.ARCRUN_APP_ACTION_ENDPOINT = 'https://.../portal/apps/actions';
  \u9019\u4E00\u9801\u5C31\u6703\u6539\u6253\u771F\u5F8C\u7AEF\uFF0C\u524D\u7AEF\u7A0B\u5F0F\u78BC\u4E00\u884C\u4E0D\u7528\u6539\uFF08\u547C\u53EB\u4ECB\u9762\u898B\u4E0B\u9762 callAction()\uFF09\u3002
-->
<style>
  /*
   * \u639B\u8F09\u5354\u5B9A v0.2\uFF08inkstone/Arcrun#82\uFF0Cleo 2026-08-24 \u62CD\u677F\uFF09\uFF1A\u9019\u500B App \u7528 \`ui.style: inherit\`
   * \uFF08app.yaml \u7701\u7565\u8A72\u6B04\uFF1D\u9810\u8A2D\u503C\uFF09\uFF0CPortal \u6703\u628A\u4E0B\u9762\u6240\u6709 \`:root\`\uFF0F\`html\`\uFF0F\`body\` \u9078\u64C7\u5668\u6574\u689D\u4E1F\u6389\uFF0C
   * \u63DB\u6210\u7956\u5148 \`:host\` \u4E0A\u639B\u7684\u5168\u5C40\u8272\u7968\uFF0F\u5B57\u9AD4\uFF08CSS custom property \u7A7F\u904E shadow \u908A\u754C\u6B63\u5E38\u7E7C\u627F\uFF09\u3002
   * \u21D2 **\u9019\u88E1\u4E0D\u518D\u81EA\u8A02\u4E00\u5957 --bg/--panel/--accent**\uFF08v0.1 \u90A3\u5957\u5728\u771F Portal \u88E1\u6703\u88AB\u780D\u6389\u3001
   *   \u7B49\u65BC\u6574\u9801\u6C92\u6709\u984F\u8272\uFF0C\u9019\u6B63\u662F leo 08-24 \u5BE6\u6E2C\u300C\u5B83\u70BA\u4EC0\u9EBC\u4E0D\u5403\u5168\u5C40\u7684 style\uFF1F\u300D\u90A3\u53E5\u8A71\u7684\u75C5\u6839\uFF09\u3002
   *   \u4E00\u5F8B\u76F4\u63A5\u5F15\u7528 Portal \u7684 CIS token\uFF08\u898B matrix/arcrun console-ui/public/portal/index.html
   *   \`APP_INHERIT_CSS\`\uFF0F\`:root\` \u5B9A\u7FA9\uFF09\uFF1A
   *     --ink / --ink-rgb     \u6587\u5B57\u8272\uFF08\u6DFA\u8272\u4E3B\u984C\u6DF1\u3001\u6DF1\u8272\u4E3B\u984C\u6DFA\uFF0C\u96A8\u4E3B\u984C\u81EA\u52D5\u5207\uFF09
   *     --amber / --amber-rgb \u54C1\u724C\u8272\uFF08\u539F\u672C\u7B46\u8A18\u6309\u9215\u662F\u81EA\u5DF1\u7684\u85CD\u8272\uFF0C\u73FE\u5728\u8DDF\u7CFB\u7D71\u7D71\u4E00\u7528\u5B83\uFF09
   *     --paper-a / --paper-b \u5E95\u8272\uFF08\u7D19\u7D0B\u96D9\u8272\uFF09
   *     --bar-bg              \u5DE5\u5177\u5217\uFF0F\u56FA\u5B9A\u689D\u80CC\u666F
   *   \u672C\u6A5F\u76F4\u63A5\u958B\u9019\u500B\u6A94\u6848\uFF08\u4E0D\u7D93 Portal\uFF09\u6642\u9019\u4E9B\u8B8A\u6578\u4E0D\u5B58\u5728 \u2192 \u700F\u89BD\u5668\u9810\u8A2D\u503C\uFF08\u9ED1\u5B57\u767D\u5E95\uFF09\uFF0C
   *   \u756B\u9762\u4ECD\u53EF\u8B80\uFF0C\u53EA\u662F\u6C92\u6709\u4E3B\u984C\u8272\u2014\u2014\u9019\u662F\u300C\u8DDF\u96A8\u5168\u5C40\u300D\u8A2D\u8A08\u672C\u8EAB\u7684\u8AA0\u5BE6\u4EE3\u50F9\uFF0C\u4E0D\u662F bug\u3002
   */
  * { box-sizing: border-box; }
  html, body {
    margin: 0; padding: 0; height: 100%;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang TC", "Noto Sans TC", sans-serif;
  }
  #app { max-width: 640px; margin: 0 auto; min-height: 100%; display: flex; flex-direction: column; }

  .mock-banner {
    background: rgba(var(--amber-rgb, 217, 120, 79), 0.15); color: var(--amber, #b04a2f);
    font-size: 12px; text-align: center; padding: 6px 10px;
    border-bottom: 1px solid rgba(var(--amber-rgb, 217, 120, 79), 0.4);
  }

  header { padding: 12px 14px 8px; border-bottom: 1px solid rgba(var(--ink-rgb, 23, 24, 26), 0.12); }
  header h1 { font-size: 18px; margin: 0 0 8px; }

  .composer { display: flex; flex-direction: column; gap: 8px; }
  .composer-textbox { position: relative; }
  .composer textarea, .fs-textarea {
    width: 100%; min-height: 72px; resize: vertical;
    background: rgba(var(--ink-rgb, 23, 24, 26), 0.05); color: var(--ink, inherit);
    border: 1px solid rgba(var(--ink-rgb, 23, 24, 26), 0.2);
    border-radius: 10px; padding: 10px 40px 10px 12px; font-size: 15px; font-family: inherit;
  }
  .expand-btn {
    position: absolute; top: 8px; right: 8px; width: 26px; height: 26px; padding: 0;
    display: flex; align-items: center; justify-content: center;
    background: transparent; border: none; border-radius: 6px; cursor: pointer;
    color: rgba(var(--ink-rgb, 23, 24, 26), 0.5); font-size: 14px;
  }
  .expand-btn:hover { background: rgba(var(--ink-rgb, 23, 24, 26), 0.08); }
  .composer-row { display: flex; align-items: center; gap: 8px; justify-content: space-between; }
  .composer-row .hint { font-size: 12px; color: rgba(var(--ink-rgb, 23, 24, 26), 0.5); }
  .composer-row button, .fs-submit {
    background: var(--amber, #333); color: #fff; border: none; border-radius: 999px;
    padding: 8px 18px; font-size: 14px; font-weight: 600; cursor: pointer;
  }
  .composer-row button:disabled, .fs-submit:disabled { opacity: 0.5; cursor: not-allowed; }
  .error-line { color: #c0392b; font-size: 13px; min-height: 16px; }

  /* \u2500\u2500 \u5168\u87A2\u5E55\u8F38\u5165\uFF08leo 2026-08-24\uFF1A\u300C\u539F\u672C\u7B46\u8A18\u8F38\u5165\u754C\u9762\u53EF\u4EE5\u5168\u87A2\u5E55\uFF0C\u4F46\u4E5F\u6C92\u6709\u6309\u9215\u300D\uFF0C
     Mira \u6CB3\u9053\u539F\u7A3F\u7684 Esc \u6536\u8D77\uFF0F\u2318+Enter \u9001\u51FA\u6A21\u5F0F\uFF0C\u898B landing/app/mira/feed/page.tsx
     EditingArea \u7684 popup \u90A3\u6BB5\u2014\u2014\u9019\u88E1\u7167\u5B83\u7684\u9375\u76E4\u884C\u70BA\u505A\uFF0C\u4E0D\u662F\u65B0\u8A2D\u8A08\uFF09 \u2500\u2500 */
  .fs-backdrop {
    position: fixed; inset: 0; background: rgba(0, 0, 0, 0.5);
    display: flex; align-items: center; justify-content: center; z-index: 100; padding: 16px;
  }
  /* \`[hidden]\` \u7684 UA \u9810\u8A2D\u6A23\u5F0F\uFF08display:none\uFF09specificity \u592A\u4F4E\uFF0C\u84CB\u4E0D\u6389\u4E0A\u9762 .fs-backdrop
     \u81EA\u5DF1\u90A3\u689D display:flex\uFF08author style \u4E00\u5F8B\u8D0F\u904E UA style\uFF0C\u8DDF\u5BA3\u544A\u9806\u5E8F\u7121\u95DC\uFF09\u2014\u2014
     \u6C92\u6709\u9019\u689D\uFF0Chidden \u5C6C\u6027\u8A2D\u4E86\u4E5F\u6C92\u7528\uFF0C\u9019\u9846\u80CC\u666F\u6703\u4E00\u76F4\u84CB\u5728\u756B\u9762\u4E0A\u5403\u6389\u6240\u6709\u9EDE\u64CA
     \uFF08browser-e2e.mjs \u7B2C\u4E00\u6B21\u8DD1\u5C31\u649E\u5230\uFF1A#submitBtn \u9EDE\u4E0D\u5230\uFF0C\u56E0\u70BA #fsBackdrop \u6514\u5728\u6700\u4E0A\u5C64\uFF09\u3002 */
  .fs-backdrop[hidden] { display: none; }
  .fs-panel {
    background: var(--paper-a, #fff); color: var(--ink, inherit); width: 100%; max-width: 560px;
    max-height: 80vh; border-radius: 14px; display: flex; flex-direction: column;
    padding: 14px; gap: 10px; box-shadow: 0 12px 40px rgba(0, 0, 0, 0.35);
  }
  .fs-header { display: flex; align-items: center; justify-content: space-between; }
  .fs-header .title { font-size: 15px; font-weight: 600; }
  .fs-close {
    background: transparent; border: none; font-size: 16px; cursor: pointer; padding: 4px 8px;
    color: rgba(var(--ink-rgb, 23, 24, 26), 0.6);
  }
  .fs-textarea { flex: 1; min-height: 240px; resize: none; padding: 12px; }
  .fs-footer { display: flex; align-items: center; justify-content: flex-end; gap: 10px; }
  .fs-kbd { font-size: 12px; color: rgba(var(--ink-rgb, 23, 24, 26), 0.45); margin-right: auto; }

  .calendar-toggle {
    display: flex; align-items: center; justify-content: space-between;
    padding: 8px 14px; font-size: 13px; color: rgba(var(--ink-rgb, 23, 24, 26), 0.55); cursor: pointer;
    border-bottom: 1px solid rgba(var(--ink-rgb, 23, 24, 26), 0.12);
    user-select: none;
  }
  .calendar-toggle .filter-chip {
    background: rgba(var(--amber-rgb, 217, 120, 79), 0.15); color: var(--amber, #b04a2f); border-radius: 999px;
    padding: 3px 10px; font-size: 12px; margin-left: 8px;
  }

  .calendar { padding: 8px 14px 12px; border-bottom: 1px solid rgba(var(--ink-rgb, 23, 24, 26), 0.12); }
  .calendar-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; }
  .calendar-header button {
    background: none; border: none; color: var(--ink, inherit); font-size: 16px; padding: 4px 10px; cursor: pointer;
  }
  .calendar-header .label { font-size: 14px; font-weight: 600; }
  .cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; text-align: center; }
  .cal-dow { font-size: 11px; color: rgba(var(--ink-rgb, 23, 24, 26), 0.5); padding: 2px 0; }
  .cal-cell {
    position: relative; aspect-ratio: 1 / 1; display: flex; align-items: center; justify-content: center;
    border-radius: 8px; font-size: 13px; cursor: pointer; color: var(--ink, inherit);
  }
  .cal-cell.empty { cursor: default; visibility: hidden; }
  .cal-cell.today { border: 1px solid var(--amber, #b04a2f); }
  .cal-cell.selected { background: var(--amber, #b04a2f); color: #fff; font-weight: 700; }
  .cal-cell .dot {
    position: absolute; bottom: 3px; width: 4px; height: 4px; border-radius: 50%;
    background: var(--amber, #b04a2f);
  }
  .cal-cell.selected .dot { background: #fff; }

  .river { flex: 1; overflow-y: auto; padding: 8px 14px 24px; }
  .river-empty { color: rgba(var(--ink-rgb, 23, 24, 26), 0.5); font-size: 14px; text-align: center; padding: 40px 10px; }

  /*
   * \u2500\u2500 \u5361\u7247\uFF08leo 2026-08-24\uFF1A\u300C\u6BCF\u4E00\u5247\u7B46\u8A18\u662F\u4E00\u5F35\u5361\u7247\uFF0C\u5361\u7247\u7684\u5916\u6846\u6C92\u986F\u793A\u300D\uFF09\u2500\u2500
   * \u908A\u754C\u4E00\u5F8B\u7528 Portal \u8272\u7968\uFF08--ink-rgb \u7684\u4F4E\u900F\u660E\u5EA6\uFF09\uFF0C\u4E0D\u5BEB\u6B7B\u984F\u8272\u2014\u2014\u9019\u6A23\u6DFA\u8272\uFF0F\u6DF1\u8272\u4E3B\u984C
   * \u5207\u63DB\u6642\u908A\u754C\u81EA\u52D5\u8DDF\u8457\u63DB\uFF0C\u4E0D\u6703\u6D88\u5931\uFF08\u540C\u4E0A\u65B9\u6A94\u982D\u8AAA\u660E\u7684\u90A3\u500B\u75C5\uFF0C\u4E0D\u91CD\u72AF\u7B2C\u4E8C\u6B21\uFF09\u3002
   */
  .note-card {
    border: 1px solid rgba(var(--ink-rgb, 23, 24, 26), 0.18); border-radius: 12px;
    padding: 12px 14px; margin-bottom: 10px;
  }
  .note-card .meta { font-size: 12px; color: rgba(var(--ink-rgb, 23, 24, 26), 0.5); margin-bottom: 6px; }
  .note-card .content { font-size: 15px; line-height: 1.55; word-break: break-word; }
  .note-card .content p { margin: 0 0 8px; }
  .note-card .content p:last-child { margin-bottom: 0; }
  .note-card .content h1, .note-card .content h2, .note-card .content h3 { margin: 0 0 8px; }
  .note-card .content ul { margin: 0 0 8px; padding-left: 20px; }
  .note-card .content code {
    background: rgba(var(--ink-rgb, 23, 24, 26), 0.08); padding: 1px 5px; border-radius: 4px; font-size: 13px;
  }

  /*
   * \u2500\u2500 \u56DE\u8986\uFF08leo 2026-08-24\uFF1A\u300C\u539F\u672C\u6BCF\u4E00\u5247\u7B46\u8A18\u90FD\u53EF\u4EE5\u56DE\u8986\u2026\u53EF\u4EE5\u81EA\u5DF1\u8A55\u8AD6\u5C31\u662F\u500B indented \u5167\u5BB9\u300D\uFF09\u2500\u2500
   * \u540C Mira \u6CB3\u9053\u539F\u7A3F\u7684 .mira-reply-line\uFF0F.mira-reply-nested\uFF08landing/app/mira/mira.css\uFF09\uFF1A
   * \u6BCF\u4E00\u5247\u56DE\u8986\u662F\u4E00\u9846\u6DE1\u5E95\u7684\u5713\u89D2\u6CE1\u6CE1\uFF0C\u6574\u7D44\u5F80\u53F3\u7E2E\u6392\u3001\u5DE6\u908A\u4E00\u689D\u7D30\u7DDA\u2014\u2014\u4E0D\u662F\u53E6\u4E00\u5F35\u5361\uFF0C
   * \u9019\u6A23\u8996\u89BA\u4E0A\u4E00\u773C\u770B\u5F97\u51FA\u300C\u9019\u662F\u639B\u5728\u4E0A\u9762\u90A3\u5247\u5E95\u4E0B\u7684\u300D\uFF0C\u4E0D\u662F\u5E73\u884C\u7684\u7368\u7ACB\u7B46\u8A18\u3002
   */
  .note-footer { display: flex; align-items: center; gap: 10px; padding-top: 6px; margin-top: 4px; }
  .reply-toggle {
    background: transparent; border: none; cursor: pointer; padding: 2px 0;
    font-size: 13px; color: rgba(var(--ink-rgb, 23, 24, 26), 0.55);
  }
  .reply-toggle:hover { color: var(--amber, #b04a2f); }
  .replies { margin-top: 8px; margin-left: 16px; padding-left: 10px; border-left: 2px solid rgba(var(--ink-rgb, 23, 24, 26), 0.12); }
  .reply-line {
    background: rgba(var(--ink-rgb, 23, 24, 26), 0.05); border-radius: 14px;
    padding: 7px 12px; margin-bottom: 6px; font-size: 13.5px; line-height: 1.5;
  }
  .reply-line .meta { font-size: 11px; color: rgba(var(--ink-rgb, 23, 24, 26), 0.45); margin-bottom: 2px; }
  .reply-composer { margin-top: 6px; display: flex; flex-direction: column; gap: 6px; }
  .reply-composer textarea {
    width: 100%; min-height: 44px; resize: vertical;
    background: rgba(var(--ink-rgb, 23, 24, 26), 0.05); color: var(--ink, inherit);
    border: 1px solid rgba(var(--ink-rgb, 23, 24, 26), 0.2);
    border-radius: 10px; padding: 8px 10px; font-size: 14px; font-family: inherit;
  }
  .reply-composer-row { display: flex; gap: 8px; justify-content: flex-end; }
  .reply-composer-row button {
    background: transparent; color: rgba(var(--ink-rgb, 23, 24, 26), 0.6); border: none;
    border-radius: 999px; padding: 5px 12px; font-size: 12.5px; cursor: pointer;
  }
  .reply-composer-row button.primary { background: var(--amber, #b04a2f); color: #fff; }
  .reply-composer-row button:disabled { opacity: 0.5; cursor: not-allowed; }
</style>
</head>
<body>
<div id="app">
  <div class="mock-banner" id="mockBanner" hidden>
    \u26A0\uFE0F MOCK \u6A21\u5F0F\uFF1A\u8CC7\u6599\u53EA\u5B58\u5728\u9019\u500B\u700F\u89BD\u5668\u7684 localStorage\uFF0C\u4E0D\u662F\u771F\u7684 KBDB\uFF0FArcrun \u5F8C\u7AEF\u3002
  </div>

  <header>
    <h1>\u7B46\u8A18</h1>
    <div class="composer">
      <div class="composer-textbox">
        <textarea id="composerInput" placeholder="\u5BEB\u9EDE\u4EC0\u9EBC\u2026\u2026\u652F\u63F4 Markdown\uFF08# \u6A19\u984C\u3001**\u7C97\u9AD4**\u3001*\u659C\u9AD4*\u3001- \u6E05\u55AE\u3001[\u9023\u7D50](\u7DB2\u5740)\uFF09\uFF08Esc \u6536\u8D77\u3001\u2318+Enter \u9001\u51FA\uFF09"></textarea>
        <button type="button" class="expand-btn" id="composerExpandBtn" title="\u5168\u87A2\u5E55\u7DE8\u8F2F" aria-label="\u5168\u87A2\u5E55\u7DE8\u8F2F">\u26F6</button>
      </div>
      <div class="composer-row">
        <span class="hint" id="composerHint"></span>
        <button id="submitBtn" type="button">\u9001\u51FA</button>
      </div>
      <div class="error-line" id="composerError"></div>
    </div>
  </header>

  <!-- \u5168\u87A2\u5E55\u8F38\u5165\uFF08leo \u53CD\u994B\u300C\u539F\u672C\u53EF\u4EE5\u5168\u87A2\u5E55\u300D\uFF09\uFF1AEsc \u6536\u8D77\uFF0C\u6536\u8D77\u6642\u628A\u5167\u5BB9\u540C\u6B65\u56DE\u4E3B\u8F38\u5165\u6846\uFF0C\u4E0D\u662F\u53E6\u4E00\u4EFD\u8349\u7A3F\u3002 -->
  <div class="fs-backdrop" id="fsBackdrop" hidden>
    <div class="fs-panel">
      <div class="fs-header">
        <span class="title">\u5BEB\u7B46\u8A18</span>
        <button type="button" class="fs-close" id="fsCloseBtn" title="\u6536\u8D77\uFF08Esc\uFF09" aria-label="\u6536\u8D77">\u2715</button>
      </div>
      <textarea class="fs-textarea" id="fsTextarea"></textarea>
      <div class="fs-footer">
        <span class="fs-kbd">Esc \u6536\u8D77 \xB7 \u2318+Enter \u9001\u51FA</span>
        <button type="button" class="fs-submit" id="fsSubmitBtn">\u9001\u51FA</button>
      </div>
    </div>
  </div>

  <div class="calendar-toggle" id="calendarToggle">
    <span>
      <span id="calendarToggleLabel">\u5C0F\u65E5\u66C6</span>
      <span class="filter-chip" id="filterChip" hidden></span>
    </span>
    <span id="calendarChevron">\u25BE</span>
  </div>
  <div class="calendar" id="calendarPanel" hidden>
    <div class="calendar-header">
      <button type="button" id="calPrev" aria-label="\u4E0A\u500B\u6708">\u2039</button>
      <span class="label" id="calLabel"></span>
      <button type="button" id="calNext" aria-label="\u4E0B\u500B\u6708">\u203A</button>
    </div>
    <div class="cal-grid" id="calGrid"></div>
  </div>

  <main class="river" id="river">
    <div class="river-empty">\u8F09\u5165\u4E2D\u2026</div>
  </main>
</div>

<script>
/*
 * notes-core.js \u2014 \u7D14\u908F\u8F2F\u5C64\uFF08inkstone/InkStoneCo#2\uFF1B\u57F7\u884C\u7968 inkstone/arcrun-app-note#1 \u7B46\u8A18 App\uFF09
 *
 * \u523B\u610F\u8DDF DOM \u5206\u958B\u653E\u4E00\u500B\u6A94\u6848\u7684\u7406\u7531\uFF1A\u9019\u6A23 test/test-notes-core.mjs \u624D\u80FD\u5728 Node \u88E1
 * \u76F4\u63A5 require \u9019\u4EFD\u908F\u8F2F\u505A\u55AE\u5143\u6E2C\u8A66\uFF0C\u4E0D\u9700\u8981\u4E00\u9846\u771F\u700F\u89BD\u5668\uFF08headless Chrome \u9019\u985E\u91CD\u4F9D\u8CF4
 * \u5728\u9019\u53F0\u6A5F\u5668\u4E0A\u4E0D\u4E00\u5B9A\u88DD\u5F97\u4E86\uFF1B\u7D14\u51FD\u5F0F\u908F\u8F2F\u7528 node \u5C31\u6E2C\u5F97\u5230\uFF0C\u9019\u662F\u53EF\u4EE5\u505A\u5230\u300C\u6E2C\u904E\u300D\u800C\u4E0D\u662F
 * \u300C\u61C9\u8A72\u53EF\u4EE5\u300D\u7684\u6700\u52D9\u5BE6\u4F5C\u6CD5\uFF09\u3002
 *
 * \u9019\u500B\u6A94\u6848\u4E0D import \u4EFB\u4F55\u6771\u897F\u3001\u4E0D\u78B0 window/document\u2014\u2014\u5728 <script> \u6A19\u7C64\u6216 Node \u90FD\u80FD\u8DD1\u3002
 * \u5C0D\u5916\u7528\u4E00\u500B\u547D\u540D\u7A7A\u9593\u7269\u4EF6 NotesCore \u639B\u4F4F\u6240\u6709\u51FD\u5F0F\uFF0C\u540C\u6642\u5728 Node \u74B0\u5883\uFF08module !== undefined\uFF09
 * \u639B module.exports\uFF0C\u5169\u908A\u5171\u7528\u540C\u4E00\u4EFD\u5BE6\u4F5C\uFF0C\u4E0D\u6703\u51FA\u73FE\u300C\u700F\u89BD\u5668\u7248\u300D\u8DDF\u300C\u6E2C\u8A66\u7248\u300D\u6F02\u79FB\u3002
 */
(function (root) {
  'use strict';

  // \u2500\u2500 \u65E5\u671F \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

  var DATE_RE = /^\\d{4}-\\d{2}-\\d{2}$/;

  function isValidDateStr(s) {
    return typeof s === 'string' && DATE_RE.test(s);
  }

  /** \u4F7F\u7528\u8005\u672C\u5730\u6642\u5340\u7684\u300C\u4ECA\u5929\u300D\uFF0CYYYY-MM-DD\u3002\u523B\u610F\u4E0D\u7528 toISOString()\uFF08\u90A3\u662F UTC\uFF0C\u665A\u4E0A\u5BEB\u7B46\u8A18
   *  \u5BB9\u6613\u8DE8\u65E5\u7B97\u932F\u2014\u2014\u9019\u662F\u820A Mira \u6CB3\u9053\u9801\u8E29\u904E\u7684\u75C5\u4E4B\u4E00\uFF0C\u9019\u88E1\u4E0D\u91CD\u72AF\uFF09\u3002 */
  function todayISO(d) {
    d = d || new Date();
    var y = d.getFullYear();
    var m = String(d.getMonth() + 1).padStart(2, '0');
    var day = String(d.getDate()).padStart(2, '0');
    return y + '-' + m + '-' + day;
  }

  // \u2500\u2500 \u7B46\u8A18\u6392\u5E8F\uFF0F\u904E\u6FFE \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

  /** \u4F9D created_at \u65B0\u5230\u820A\u6392\u5E8F\uFF0C\u56DE\u50B3\u65B0\u9663\u5217\uFF08\u4E0D\u6539\u539F\u9663\u5217\uFF09\u3002created_at \u7F3A\u503C\u6392\u6700\u5F8C\u3002 */
  function sortNotesDesc(notes) {
    return notes.slice().sort(function (a, b) {
      var ca = a && a.created_at ? a.created_at : '';
      var cb = b && b.created_at ? b.created_at : '';
      if (ca === cb) return 0;
      return ca < cb ? 1 : -1; // \u65B0\uFF08\u5B57\u4E32\u8F03\u5927\uFF09\u5728\u524D
    });
  }

  function filterByDate(notes, dateStr) {
    if (!dateStr) return notes.slice();
    return notes.filter(function (n) { return n && n.date === dateStr; });
  }

  /** \u56DE\u50B3\u300C\u6709\u7B46\u8A18\u7684\u65E5\u671F\u300D\u96C6\u5408\uFF08\u7D66\u5C0F\u65E5\u66C6\u756B\u9EDE\u7528\uFF09\u3002 */
  function datesWithNotes(notes) {
    var set = {};
    for (var i = 0; i < notes.length; i++) {
      if (notes[i] && notes[i].date) set[notes[i].date] = true;
    }
    return set;
  }

  // \u2500\u2500 \u5C0F\u65E5\u66C6 \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

  /**
   * \u7522\u751F\u4E00\u500B\u6708\u7684\u65E5\u66C6\u683C\u5B50\u3002year/month \u70BA 0-based month\uFF08\u540C Date \u6163\u4F8B\uFF0C0=\u4E00\u6708\uFF09\u3002
   * \u56DE\u50B3 { year, month, weeks: [[cell,...], ...] }\uFF0Ccell \u70BA null\uFF08\u6708\u9996/\u6708\u5C3E\u88DC\u7A7A\u683C\uFF09
   * \u6216 { day, dateStr, isToday, hasNotes, isSelected }\u3002
   */
  function buildCalendarMonth(year, month, notesByDate, todayStr, selectedStr) {
    notesByDate = notesByDate || {};
    var firstOfMonth = new Date(year, month, 1);
    var daysInMonth = new Date(year, month + 1, 0).getDate();
    var startWeekday = firstOfMonth.getDay(); // 0=Sun

    var cells = [];
    for (var i = 0; i < startWeekday; i++) cells.push(null);
    for (var day = 1; day <= daysInMonth; day++) {
      var dateStr = year + '-' + String(month + 1).padStart(2, '0') + '-' + String(day).padStart(2, '0');
      cells.push({
        day: day,
        dateStr: dateStr,
        isToday: dateStr === todayStr,
        hasNotes: !!notesByDate[dateStr],
        isSelected: !!selectedStr && dateStr === selectedStr,
      });
    }
    while (cells.length % 7 !== 0) cells.push(null);

    var weeks = [];
    for (var w = 0; w < cells.length; w += 7) weeks.push(cells.slice(w, w + 7));
    return { year: year, month: month, weeks: weeks };
  }

  // \u2500\u2500 Markdown\uFF08\u6975\u7C21\u5B50\u96C6\uFF0C\u96F6\u4F9D\u8CF4\u2014\u2014design.md \u8981\u6C42\u55AE\u6A94\uFF0F\u5C11\u6A94\uFF0C\u4E0D\u63A5 CDN\uFF09 \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  //
  // \u652F\u63F4\uFF1A\u8DF3\u812B HTML \u2192 \u6A19\u984C #~###### \u2192 **\u7C97\u9AD4** \u2192 *\u659C\u9AD4* \u2192 \`code\` \u2192 [text](url)
  // \u2192 \u4E00\u822C\u6BB5\u843D\u63DB\u884C \u2192 \u958B\u982D \`- \` \u6216 \`* \` \u7684\u6E05\u55AE\u884C\u3002
  // \u4E0D\u652F\u63F4\uFF1A\u8868\u683C\u3001\u5DE2\u72C0\u6E05\u55AE\u3001\u5716\u7247\u3001fenced code block\u2014\u2014\u7B46\u8A18 App v0.1 \u4E0D\u9700\u8981\uFF0C
  // \u52A0\u4E86\u53EA\u6703\u8B93\u300C\u55AE\u4E00 HTML/JS \u6A94\u300D\u7684\u76EE\u6A19\u8B8A\u91CD\uFF0C\u4E14\u6C92\u6709 leo \u63D0\u51FA\u7684\u9700\u6C42\u6490\u9019\u500B\u8907\u96DC\u5EA6\u3002

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function renderInline(s) {
    s = s.replace(/\`([^\`]+)\`/g, '<code>$1</code>');
    s = s.replace(/\\*\\*([^*]+)\\*\\*/g, '<strong>$1</strong>');
    s = s.replace(/\\*([^*]+)\\*/g, '<em>$1</em>');
    s = s.replace(/\\[([^\\]]+)\\]\\((https?:\\/\\/[^\\s)]+)\\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
    return s;
  }

  function renderMarkdown(md) {
    var lines = escapeHtml(md == null ? '' : md).split(/\\r?\\n/);
    var html = [];
    var listOpen = false;

    function closeList() {
      if (listOpen) { html.push('</ul>'); listOpen = false; }
    }

    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];
      var heading = /^(#{1,6})\\s+(.*)$/.exec(line);
      var listItem = /^[-*]\\s+(.*)$/.exec(line);

      if (heading) {
        closeList();
        var level = heading[1].length;
        html.push('<h' + level + '>' + renderInline(heading[2]) + '</h' + level + '>');
      } else if (listItem) {
        if (!listOpen) { html.push('<ul>'); listOpen = true; }
        html.push('<li>' + renderInline(listItem[1]) + '</li>');
      } else if (line.trim() === '') {
        closeList();
      } else {
        closeList();
        html.push('<p>' + renderInline(line) + '</p>');
      }
    }
    closeList();
    return html.join('\\n');
  }

  // \u2500\u2500 Mock \u5F8C\u7AEF\uFF08design.md K6 \u6CDB\u7528\u52D5\u4F5C\u7AEF\u9EDE\u7684\u5047\u5F62\u72C0\uFF1B\u771F\u7AEF\u9EDE\u898B README\u300C\u9084\u7F3A\u4EC0\u9EBC\u300D\uFF09\u2500\u2500\u2500
  //
  // \u5951\u7D04\u523B\u610F\u8DDF\u300C\u771F\u7684\u6CDB\u7528\u52D5\u4F5C\u7AEF\u9EDE\u300D\u9577\u4E00\u6A23\uFF1Acall(action, params) -> Promise<{success, data|error}>\u3002
  // \u4E4B\u5F8C\u63A5\u4E0A\u771F\u5F8C\u7AEF\uFF0C\u53EA\u8981\u628A\u547C\u53EB\u7AEF\u7684 dispatcher \u63DB\u6210\u771F\u7684 fetch\uFF0C\u9019\u500B\u6A94\u6848\u4E00\u884C\u4E0D\u7528\u6539
  // \u2014\u2014\u9019\u6B63\u662F K6\u300C\u524D\u7AEF\u4E0D\u77E5\u9053 apiBase / \u4E0D\u81EA\u5DF1 fetch\u300D\u7CBE\u795E\u5728 mock \u5C64\u7684\u9AD4\u73FE\uFF1A
  // UI \u6C38\u9060\u53EA\u8A8D\u5F97\u5230 call(action, params)\uFF0C\u4E0D\u7BA1\u80CC\u5F8C\u662F mock \u9084\u662F\u771F\u5F15\u64CE\u3002
  //
  // storage \u53C3\u6578\u662F\u6CE8\u5165\u7684\u6301\u4E45\u5316\u4ECB\u9762\uFF08{ load(): Note[], save(notes: Note[]): void }\uFF09\uFF0C
  // \u9810\u8A2D\u7528\u8A18\u61B6\u9AD4\u9663\u5217\uFF08\u7D66 Node \u6E2C\u8A66\u8207\u300C\u6C92\u6709 localStorage\u300D\u7684\u74B0\u5883\u7528\uFF09\uFF1B
  // \u700F\u89BD\u5668\u7248\u7531 ui/index.html \u6CE8\u5165\u4E00\u4EFD\u5305 localStorage \u7684 storage\u3002

  function createMemoryStorage() {
    var notes = [];
    return {
      load: function () { return notes.slice(); },
      save: function (next) { notes = next.slice(); },
    };
  }

  // \u2500\u2500 \u56DE\u61C9\u4FE1\u5C01\uFF08\u7167\u771F\u5951\u7D04\u7684\u5F62\u72C0\uFF0C\u898B\u4E0B\u65B9 unwrapActionResult \u7684\u9577\u8A3B\u89E3\uFF09\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

  function createMockBackend(storage, idGen) {
    storage = storage || createMemoryStorage();
    var seq = 0;
    idGen = idGen || function () { seq += 1; return 'mock_rec_' + Date.now() + '_' + seq; };

    // \u56DE\u50B3 d \u672C\u8EAB\uFF08\u771F\u5951\u7D04\u88E1 window.arcrunApp.action() resolve \u51FA\u4F86\u7684 {ok,status,d} \u7684 d \u90A3\u5C64\uFF09\uFF1A
    //   \u6210\u529F \u2192 { ok: true, result: { success: true, data: {...} } }
    //   \u5931\u6557 \u2192 { error: "..." }\uFF08\u6C92\u6709 ok \u6B04\u4F4D\u2014\u2014\u7167\u771F\u7AEF\u9EDE\u7684\u5931\u6557\u56DE\u61C9\u5F62\u72C0\uFF09
    function createNote(params) {
      var content = (params && params.content != null) ? String(params.content).trim() : '';
      if (!content) return { error: 'content \u4E0D\u53EF\u70BA\u7A7A\uFF08\u7B46\u8A18\u81F3\u5C11\u8981\u6709\u5167\u5BB9\uFF09' };
      var date = (params && params.date) ? String(params.date).trim() : todayISO();
      if (!isValidDateStr(date)) return { error: 'date \u5FC5\u9808\u662F YYYY-MM-DD \u683C\u5F0F\uFF08\u6536\u5230\uFF1A' + date + '\uFF09' };
      // parent_id\uFF1A\u7701\u7565\uFF0F\u7A7A\u5B57\u4E32\uFF1D\u7368\u7ACB\u7B46\u8A18\uFF1B\u975E\u7A7A\uFF1D\u9019\u662F\u67D0\u5247\u7B46\u8A18\u7684\u56DE\u8986\uFF08\u540C\u771F\u5F8C\u7AEF notes-create.yaml
      // \u7684 prep \u7BC0\u9EDE\u5951\u7D04\u2014\u2014mock \u8DDF\u771F\u5F8C\u7AEF\u5FC5\u9808\u662F\u540C\u4E00\u4EFD\u5951\u7D04\uFF0C\u4E0D\u80FD\u5404\u81EA\u8868\u8FF0\uFF09\u3002
      var parentId = (params && params.parent_id != null) ? String(params.parent_id).trim() : '';
      var note = {
        record_id: idGen(),
        date: date,
        content: content,
        created_at: new Date().toISOString(),
        parent_id: parentId,
      };
      var notes = storage.load();
      notes.push(note);
      storage.save(notes);
      return { ok: true, result: { success: true, data: note } };
    }

    function listNotes(params) {
      var wantDate = (params && params.date) ? String(params.date).trim() : '';
      var all = storage.load();
      // \u540C\u771F\u5F8C\u7AEF notes-list.yaml \u7684 filter_sort\uFF1A\u5206\u7368\u7ACB\u7B46\u8A18\uFF0F\u56DE\u8986\uFF0C\u56DE\u8986\u639B\u5728\u5C0D\u61C9\u90A3\u5247\u7684
      // replies[]\uFF08\u4F9D created_at \u7531\u820A\u5230\u65B0\uFF09\uFF0C\u6CB3\u9053\u53EA\u5217\u7368\u7ACB\u7B46\u8A18\u3002
      var repliesByParent = {};
      all.forEach(function (n) {
        if (!n || !n.parent_id) return;
        (repliesByParent[n.parent_id] = repliesByParent[n.parent_id] || []).push(n);
      });
      Object.keys(repliesByParent).forEach(function (pid) {
        repliesByParent[pid].sort(function (a, b) {
          var ca = (a && a.created_at) || ''; var cb = (b && b.created_at) || '';
          return ca < cb ? -1 : (ca > cb ? 1 : 0);
        });
      });
      var top = all.filter(function (n) { return n && !n.parent_id; });
      var filtered = sortNotesDesc(filterByDate(top, wantDate)).map(function (n) {
        var copy = {};
        for (var k in n) if (Object.prototype.hasOwnProperty.call(n, k)) copy[k] = n[k];
        copy.replies = repliesByParent[n.record_id] || [];
        return copy;
      });
      return {
        ok: true,
        result: { success: true, data: { notes: filtered, count: filtered.length, date: wantDate || null } },
      };
    }

    return {
      // call() \u56DE\u50B3\u5916\u5C64 {ok,status,d}\u2014\u2014\u8DDF window.arcrunApp.action() \u7684 resolve \u5F62\u72C0\u4E00\u81F4\uFF0C
      // \u8B93 ui/index.html \u7684 callAction() \u4E0D\u5FC5\u5206\u5169\u5957\u908F\u8F2F\u8655\u7406 mock \u8207\u771F\u5F8C\u7AEF\u3002
      call: function (action, params) {
        var d;
        if (action === 'create_note') d = createNote(params);
        else if (action === 'list_notes') d = listNotes(params);
        else d = { error: '\u672A\u77E5\u52D5\u4F5C\uFF08\u4E0D\u5728\u767D\u540D\u55AE\uFF09\uFF1A' + action };
        var ok = !!(d && d.ok === true);
        return Promise.resolve({ ok: ok, status: ok ? 200 : 400, d: d });
      },
      _storage: storage, // \u6E2C\u8A66\u7528\uFF1A\u76F4\u63A5\u6AA2\u67E5\u5E95\u5C64\u5132\u5B58
    };
  }

  /**
   * unwrapActionResult(resp) \u2014 \u628A window.arcrunApp.action()\uFF0Fmock \u7684\u56DE\u61C9\u7D71\u4E00\u525D\u6210
   * { success, data } \u6216 { success:false, error }\uFF0CUI \u5C64\u53EA\u8A8D\u9019\u4E00\u7A2E\u5F62\u72C0\u3002
   *
   * resp \u7684\u5F62\u72C0\u662F { ok, status, d }\uFF1A
   *   - resp.ok           \u2190 HTTP \u5C64\u662F\u5426 2xx\uFF08\u771F\u5F8C\u7AEF\uFF1Dfetch \u7684 res.ok\uFF1Bmock \u81EA\u5DF1\u6A21\u64EC\u540C\u6B3E\uFF09
   *   - resp.d             \u2190 body JSON
   *       \u6210\u529F\uFF1A{ ok: true, result: { success, data } }
   *              \u2500 \u5916\u5C64 ok\uFF1A\u6CDB\u7528\u52D5\u4F5C\u7AEF\u9EDE\u672C\u8EAB\u7684\u4FE1\u5C01\uFF08design.md K6\uFF0C
   *                matrix/arcrun cypher-executor/src/routes/portal-data.ts
   *                \`POST /portal/data/apps/:id/action\` \u7684\u65E2\u6709\u56DE\u61C9\u683C\u5F0F\uFF09
   *              \u2500 \u5167\u5C64 success/data\uFF1A\u672C App \u5DE5\u4F5C\u6D41\u7D42\u9EDE code \u7BC0\u9EDE\u7684\u8F38\u51FA\u2014\u2014
   *                WASM component \u57F7\u884C\u7D50\u679C\u7D71\u4E00\u5305\u6210 {success,data:{...}}
   *                \uFF08\u898B\u5404\u96F6\u4EF6\u7684 component.contract.yaml\uFF09\uFF0C
   *                \u672C\u5377\u5DF2\u7528 matrix/arcrun \u7684\u771F GraphExecutor \u5BE6\u969B\u8DD1\u904E
   *                create_note\uFF0Flist_notes \u5169\u689D\uFF0C\u5169\u5C64\u4FE1\u5C01\u90FD\u662F\u7167\u5BE6\u6E2C\u7D50\u679C\u5BEB\u7684\uFF0C
   *                \u4E0D\u662F\u6191\u7A7A\u731C\u7684\u5F62\u72C0\uFF08\u904E\u7A0B\u8207\u8E29\u904E\u7684\u5751\u898B README\u300C\u5DF2\u9A57\u8B49\u7684\u57F7\u884C\u671F\u884C\u70BA\u300D\uFF09\u3002
   *       \u5931\u6557\uFF1A{ error: "..." }\uFF08\u6C92\u6709 ok \u6B04\u4F4D\uFF09
   */
  function unwrapActionResult(resp) {
    if (!resp || !resp.ok) {
      var httpErr = (resp && resp.d && resp.d.error) || ('HTTP ' + (resp && resp.status));
      return { success: false, error: httpErr };
    }
    var d = resp.d;
    if (!d || d.ok !== true) {
      return { success: false, error: (d && d.error) || '\u56DE\u61C9\u6C92\u6709 ok:true\uFF08\u672A\u77E5\u932F\u8AA4\uFF09' };
    }
    var r = d.result;
    if (!r || r.success !== true) {
      return { success: false, error: (r && r.error) || '\u5DE5\u4F5C\u6D41\u57F7\u884C\u5931\u6557\uFF08\u6C92\u6709\u56DE\u53EF\u7528\u7D50\u679C\uFF09' };
    }
    return { success: true, data: r.data };
  }

  var NotesCore = {
    isValidDateStr: isValidDateStr,
    todayISO: todayISO,
    sortNotesDesc: sortNotesDesc,
    filterByDate: filterByDate,
    datesWithNotes: datesWithNotes,
    buildCalendarMonth: buildCalendarMonth,
    renderMarkdown: renderMarkdown,
    escapeHtml: escapeHtml,
    createMemoryStorage: createMemoryStorage,
    createMockBackend: createMockBackend,
    unwrapActionResult: unwrapActionResult,
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = NotesCore;
  } else {
    root.NotesCore = NotesCore;
  }
})(typeof window !== 'undefined' ? window : this);

<\/script>
<script>
(function () {
  'use strict';

  // \u2500\u2500 \u6CDB\u7528\u52D5\u4F5C\u7AEF\u9EDE\u7684\u547C\u53EB\u4ECB\u9762\uFF08design.md K6\uFF0C\u771F\u5951\u7D04\uFF09\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  //
  // \u771F\u6B63\u8DD1\u5728 Arcrun Portal \u88E1\u6642\uFF0CPortal \u7684\u6CDB\u7528 loader \u6703\u628A\u9019\u4E00\u9801\u7684 HTML mount \u9032\u53BB\u3001
  // \u91CD\u65B0\u57F7\u884C\u5167\u5D4C <script>\uFF0C\u7136\u5F8C\u624D\u8A2D\u5B9A window.arcrunApp.action\u2014\u2014\u9019\u662F\u8B80
  // matrix/arcrun \u5206\u652F feat/app-system-v0 \u7684 console-ui/public/portal/index.html
  // renderAppView() \u5C0D\u51FA\u4F86\u7684\u771F\u6D41\u7A0B\uFF0C\u4E0D\u662F\u672C\u5377\u767C\u660E\u7684\u4ECB\u9762\uFF1A
  //   window.arcrunApp.action(actionName, payload)
  //     \u2192 fetch POST /portal/data/apps/notes/action { action, payload }
  //     \u2192 resolve { ok, status, d }\uFF08d = { ok:true, result:{success,data} } \u6216 { error }\uFF09
  // \u9019\u689D\u8DEF\u53EA\u7528\u300C\u50B3 action \u540D\u5B57 + payload\u300D\uFF0C\u524D\u7AEF**\u62FF\u4E0D\u5230**\u4EFB\u4F55\u91D1\u9470\uFF0F\u79DF\u6236\u5B57\u4E32\uFF08K6\uFF09\u3002
  //
  // \u{1F534} \u6642\u5E8F\u9677\u9631\uFF08\u8B80 Portal \u539F\u59CB\u78BC\u624D\u767C\u73FE\uFF0C\u4E0D\u662F\u731C\u7684\uFF09\uFF1APortal \u628A\u9019\u9801\u7684 HTML mount \u9032\u53BB\u3001
  // \u91CD\u65B0\u57F7\u884C <script> \u4E4B\u5F8C\uFF0C**\u624D**\u8A2D\u5B9A window.arcrunApp.action\u2014\u2014\u9806\u5E8F\u53CD\u904E\u4F86\u3002
  // \u82E5\u9019\u652F script \u5728\u9802\u5C64\u540C\u6B65\u547C\u53EB window.arcrunApp.action\uFF0C\u90A3\u500B\u7576\u4E0B\u5B83\u9084\u4E0D\u5B58\u5728\uFF0C
  // \u6703\u76F4\u63A5\u70B8\u6389\u3002\u5C0D\u7B56\uFF1A\u6240\u6709\u521D\u6B21\u8F09\u5165\u547C\u53EB\u4E00\u5F8B\u7528 setTimeout(fn, 0) \u5EF6\u5F8C\u5230\u4E0B\u4E00\u8F2A\u4E8B\u4EF6\u5708\uFF0C
  // \u4F7F\u7528\u8005\u89F8\u767C\u7684\u52D5\u4F5C\uFF08\u6309\u9215\u9EDE\u64CA\uFF09\u672C\u4F86\u5C31\u5728 mount \u5B8C\u6210\u4E4B\u5F8C\u624D\u6703\u767C\u751F\uFF0C\u4E0D\u53D7\u5F71\u97FF\u3002
  // \u898B\u6A94\u6848\u6700\u4E0B\u65B9 \`loadNotes()\` \u7684\u547C\u53EB\u65B9\u5F0F\u3002
  //
  // \u6C92\u6709 window.arcrunApp\uFF08\u672C\u6A5F\u76F4\u63A5\u958B\u9019\u500B\u6A94\u6848\u3001\u6216\u9084\u6C92\u88DD\u9032\u771F Portal\uFF09\u2192 \u9000\u56DE MOCK\uFF1A
  // \u8CC7\u6599\u5B58\u9019\u500B\u700F\u89BD\u5668\u7684 localStorage\uFF0C\u540C\u4E00\u7D44 { ok, status, d } \u4FE1\u5C01\u683C\u5F0F
  // \uFF08NotesCore.createMockBackend \u7522\u751F\uFF09\uFF0CUI \u5C64\u5B8C\u5168\u4E0D\u7528\u5206\u5169\u5957\u908F\u8F2F\u3002
  var APP_ID = 'notes';

  // \u{1F534} \u9019\u689D**\u5FC5\u9808**\u662F\u5373\u6642\u67E5\u3001\u4E0D\u80FD\u5728 script \u9802\u5C64\u7B97\u4E00\u6B21\u5FEB\u53D6\u8D77\u4F86\uFF08\u66FE\u7D93\u9019\u6A23\u5BEB\u904E\uFF0C
  // \u88AB test/browser-e2e.mjs \u7684\u300C\u7B2C\u4E8C\u6BB5\uFF1A\u6A21\u64EC\u771F Portal\u300D\u6293\u5230\uFF09\uFF1APortal \u628A\u9019\u9801\u7684
  // <script> \u57F7\u884C\u5B8C\u4E4B\u5F8C\u624D\u8CE6\u503C window.arcrunApp.action\uFF08\u540C\u4E0A\u65B9\u6642\u5E8F\u9677\u9631\uFF09\u2014\u2014
  // \u82E5\u5728\u9802\u5C64\u540C\u6B65\u7B97\u4E00\u6B21 USING_MOCK\uFF0C\u90A3\u4E00\u523B window.arcrunApp \u5FC5\u5B9A\u9084\u4E0D\u5B58\u5728\uFF0C
  // \u65BC\u662F\u300C\u662F\u4E0D\u662F MOCK\u300D\u9019\u500B\u5224\u65B7\u5728\u771F Portal \u88E1\u6C38\u9060\u5F97\u5230\u932F\u7684\u7B54\u6848\uFF08\u4E00\u5F8B\u8AA4\u5224\u6210 MOCK\uFF0C
  // \u6CB3\u9053\u9EC3\u8272\u6A6B\u5E45\u6C38\u9060show\u3001\u9001\u51FA\u7684\u7B46\u8A18\u6C38\u9060\u5BEB\u9032 localStorage \u800C\u4E0D\u662F\u771F\u7684 KBDB\uFF09\u3002
  // \u6539\u6210\u6BCF\u6B21\u547C\u53EB\u90FD\u91CD\u65B0\u5224\u65B7\uFF0C\u5C31\u4E0D\u6703\u53D7\u5B83\u8CE6\u503C\u7684\u6642\u9593\u9EDE\u5F71\u97FF\u3002
  function usingMock() {
    return !(window.arcrunApp && typeof window.arcrunApp.action === 'function');
  }

  var mockStorage = (function () {
    var KEY = 'arcrun-notes-app:mock-notes:v1';
    function safeParse(raw) { try { return JSON.parse(raw) || []; } catch (e) { return []; } }
    var hasLocalStorage = (function () {
      try { window.localStorage.setItem('__t', '1'); window.localStorage.removeItem('__t'); return true; }
      catch (e) { return false; } // \u79C1\u5BC6\u700F\u89BD\u6A21\u5F0F\u7B49\u74B0\u5883\u53EF\u80FD\u4E1F\u4F8B\u5916\uFF0C\u9000\u56DE\u8A18\u61B6\u9AD4
    })();
    if (!hasLocalStorage) return NotesCore.createMemoryStorage();
    return {
      load: function () { return safeParse(window.localStorage.getItem(KEY)); },
      save: function (notes) { window.localStorage.setItem(KEY, JSON.stringify(notes)); },
    };
  })();

  var mockBackend = NotesCore.createMockBackend(mockStorage);

  // callAction() \u4E00\u5F8B resolve \u6210 { ok, status, d }\uFF0C\u4E0D\u7BA1\u8D70\u771F\u5F8C\u7AEF\u9084\u662F mock\u2014\u2014
  // \u547C\u53EB\u7AEF\u4E00\u5F8B\u7528 NotesCore.unwrapActionResult() \u525D\u6BBC\uFF0C\u4E0D\u5FC5\u77E5\u9053\u80CC\u5F8C\u662F\u54EA\u4E00\u500B\u3002
  function callAction(action, params) {
    if (!usingMock()) return window.arcrunApp.action(action, params || {});
    return mockBackend.call(action, params);
  }

  // \u2500\u2500 \u72C0\u614B \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  var state = {
    notes: [],          // \u76EE\u524D\u62FF\u5230\u7684\u5168\u90E8\u7B46\u8A18\uFF08\u672A\u904E\u6FFE\uFF0C\u6BCF\u5247\u5E36 replies[]\uFF0C\u898B notes-list.yaml\uFF09
    selectedDate: null, // \u5C0F\u65E5\u66C6\u9078\u4E2D\u7684\u65E5\u671F\uFF1Bnull = \u986F\u793A\u5168\u90E8
    calYear: new Date().getFullYear(),
    calMonth: new Date().getMonth(),
    calendarOpen: false,
    openReplyFor: null,   // \u76EE\u524D\u6253\u958B\u56DE\u8986\u8F38\u5165\u6846\u7684\u90A3\u5247 record_id\uFF1Bnull = \u90FD\u6C92\u958B
    replySubmitting: false,
  };

  // \u2500\u2500 DOM \u53C3\u7167 \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  var $ = function (id) { return document.getElementById(id); };
  var composerInput = $('composerInput');
  var composerError = $('composerError');
  var composerHint = $('composerHint');
  var submitBtn = $('submitBtn');
  var river = $('river');
  var calendarToggle = $('calendarToggle');
  var calendarPanel = $('calendarPanel');
  var calendarChevron = $('calendarChevron');
  var filterChip = $('filterChip');
  var calLabel = $('calLabel');
  var calGrid = $('calGrid');
  var composerExpandBtn = $('composerExpandBtn');
  var fsBackdrop = $('fsBackdrop');
  var fsTextarea = $('fsTextarea');
  var fsCloseBtn = $('fsCloseBtn');
  var fsSubmitBtn = $('fsSubmitBtn');

  // \u540C\u300C\u6642\u5E8F\u9677\u9631\u300D\u7406\u7531\uFF1A\u9019\u88E1\u4E5F\u4E0D\u80FD\u540C\u6B65\u5224\u65B7\u2014\u2014\u5EF6\u5230 setTimeout(0) \u4E4B\u5F8C\uFF08loadNotes \u90A3\u500B
  // \u56DE\u547C\u88E1\uFF09\u624D\u6C7A\u5B9A\u6A6B\u5E45\u8981\u4E0D\u8981\u986F\u793A\uFF0C\u6B64\u6642 window.arcrunApp \u624D\u78BA\u5B9A\u5DF2\u7D93\u88AB Portal \u8CE6\u503C\u904E\u3002

  // \u2500\u2500 \u6CB3\u9053\u6E32\u67D3 \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

  // \u6CB3\u9053\u662F Facebook \u6CB3\u9053\u5F0F\uFF08leo 2026-08-24 \u53CD\u994B\uFF09\uFF1A\u6BCF\u4E00\u5247\u7B46\u8A18\u662F\u4E00\u5F35\u5361\u7247\uFF08\u898B\u4E0A\u65B9 CSS
  // .note-card \u7684\u908A\u6846\uFF09\uFF0C\u56DE\u8986\u662F indented \u639B\u5728\u8A72\u5247\u5E95\u4E0B\uFF0C\u4E0D\u662F\u5E73\u884C\u7684\u7368\u7ACB\u5361\u7247\u3002
  function renderRiver() {
    var list = state.selectedDate ? NotesCore.filterByDate(state.notes, state.selectedDate) : state.notes.slice();
    list = NotesCore.sortNotesDesc(list);

    if (list.length === 0) {
      river.innerHTML = '<div class="river-empty">' +
        (state.selectedDate ? '\u9019\u4E00\u5929\u6C92\u6709\u7B46\u8A18\u3002' : '\u9084\u6C92\u6709\u7B46\u8A18\uFF0C\u5BEB\u4E0B\u7B2C\u4E00\u5247\u5427\u3002') +
        '</div>';
      return;
    }

    var html = list.map(renderNoteCard).join('');
    river.innerHTML = html;

    // \u56DE\u8986\u8F38\u5165\u6846\u6253\u958B\u6642\uFF0C\u5E36\u8457\u5B83\u4E00\u8D77\u91CD\u7E6A\uFF08renderRiver \u662F\u6BCF\u6B21 loadNotes/selectDate \u90FD\u6703\u547C\u53EB\u7684
    // \u5168\u91CF\u91CD\u7E6A\uFF0C\u82E5\u4E0D\u5728\u9019\u88E1\u628A\u6E38\u6A19\u653E\u56DE\u53BB\uFF0C\u4F7F\u7528\u8005\u9EDE\u958B\u56DE\u8986\u6846\u5F8C\u6BCF\u6B21\u5217\u8868\u66F4\u65B0\u90FD\u6703\u5931\u7126\uFF09\u3002
    if (state.openReplyFor) {
      var box = river.querySelector('.reply-composer textarea[data-parent="' + state.openReplyFor + '"]');
      if (box) box.focus();
    }
  }

  function renderNoteCard(n) {
    var meta = n.date + '\u3000' + formatTime(n.created_at);
    var replies = n.replies || [];
    var repliesHtml = replies.length ? (
      '<div class="replies">' + replies.map(renderReplyLine).join('') + '</div>'
    ) : '';
    var isOpen = state.openReplyFor === n.record_id;
    var replyComposerHtml = isOpen ? renderReplyComposer(n.record_id) : '';
    return '<div class="note-card" data-note-id="' + attr(n.record_id) + '">' +
      '<div class="meta">' + NotesCore.escapeHtml(meta) + '</div>' +
      '<div class="content">' + NotesCore.renderMarkdown(n.content) + '</div>' +
      '<div class="note-footer">' +
        '<button type="button" class="reply-toggle" data-reply-toggle="' + attr(n.record_id) + '">' +
          (replies.length ? '\u56DE\u8986\uFF08' + replies.length + '\uFF09' : '\u56DE\u8986') +
        '</button>' +
      '</div>' +
      repliesHtml +
      replyComposerHtml +
      '</div>';
  }

  function renderReplyLine(r) {
    return '<div class="reply-line">' +
      '<div class="meta">' + NotesCore.escapeHtml(formatTime(r.created_at)) + '</div>' +
      '<div class="content">' + NotesCore.renderMarkdown(r.content) + '</div>' +
      '</div>';
  }

  function renderReplyComposer(parentId) {
    return '<div class="reply-composer">' +
      '<textarea data-parent="' + attr(parentId) + '" placeholder="\u5BEB\u56DE\u8986\u2026\u2026\uFF08\u2318+Enter \u9001\u51FA\u3001Esc \u6536\u8D77\uFF09"></textarea>' +
      '<div class="reply-composer-row">' +
        '<button type="button" data-reply-cancel="' + attr(parentId) + '">\u53D6\u6D88</button>' +
        '<button type="button" class="primary" data-reply-submit="' + attr(parentId) + '"' +
          (state.replySubmitting ? ' disabled' : '') + '>' +
          (state.replySubmitting ? '\u9001\u51FA\u4E2D\u2026' : '\u9001\u51FA') +
        '</button>' +
      '</div>' +
      '</div>';
  }

  function attr(s) { return NotesCore.escapeHtml(String(s == null ? '' : s)); }

  river.addEventListener('click', function (e) {
    var toggleBtn = e.target.closest('[data-reply-toggle]');
    if (toggleBtn) {
      var id = toggleBtn.getAttribute('data-reply-toggle');
      state.openReplyFor = state.openReplyFor === id ? null : id;
      renderRiver();
      return;
    }
    var cancelBtn = e.target.closest('[data-reply-cancel]');
    if (cancelBtn) {
      state.openReplyFor = null;
      renderRiver();
      return;
    }
    var submitBtnEl = e.target.closest('[data-reply-submit]');
    if (submitBtnEl) {
      submitReply(submitBtnEl.getAttribute('data-reply-submit'));
    }
  });

  river.addEventListener('keydown', function (e) {
    var ta = e.target.closest('.reply-composer textarea');
    if (!ta) return;
    var parentId = ta.getAttribute('data-parent');
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') { e.preventDefault(); submitReply(parentId); return; }
    if (e.key === 'Escape') { e.preventDefault(); state.openReplyFor = null; renderRiver(); }
  });

  function submitReply(parentId) {
    var ta = river.querySelector('.reply-composer textarea[data-parent="' + parentId + '"]');
    var content = ta ? ta.value : '';
    if (!content.trim()) return; // \u7A7A\u767D\u56DE\u8986\u4E0D\u9001\uFF0C\u975C\u9ED8\u64CB\u6389\uFF08\u540C\u4E3B composer \u7684\u300C\u4E0D\u80FD\u662F\u7A7A\u7684\u300D\u898F\u5247\uFF09
    var parentNote = state.notes.filter(function (n) { return n.record_id === parentId; })[0];
    var targetDate = (parentNote && parentNote.date) || NotesCore.todayISO();
    state.replySubmitting = true;
    renderRiver();
    callAction('create_note', { content: content, date: targetDate, parent_id: parentId }).then(function (resp) {
      state.replySubmitting = false;
      var res = NotesCore.unwrapActionResult(resp);
      if (!res || !res.success) {
        renderRiver();
        window.alert('\u56DE\u8986\u9001\u51FA\u5931\u6557\uFF1A' + ((res && res.error) || '\u672A\u77E5\u932F\u8AA4'));
        return;
      }
      state.openReplyFor = null;
      // \u5F8C\u7AEF\u56DE\u4F86\u7684 parent_id \u8DDF\u6211\u5011\u9001\u7684\u4E0D\u4E00\u81F4\uFF1D\u8CC7\u6599\u8868\u7F3A\u300C\u56DE\u8986\u300D\u6B04\u4F4D\u3001\u88AB\u975C\u9ED8\u4E1F\u6389\uFF08\u820A\u7248 note \u8CC7\u6599\u8868\u7684\u75C7\u72C0\uFF1A
      // \u56DE\u8986\u8B8A\u6210\u4E00\u5247\u9802\u5C64\u7B46\u8A18\uFF09\u3002\u4E0D\u5047\u88DD\u6210\u529F\uFF1A\u660E\u8B1B\uFF0C\u4E26\u6307\u51FA\u600E\u9EBC\u4FEE\uFF08inkstone/arcrun-app-note#1 c17811\uFF09\u3002
      if (res.data && res.data.parent_id !== parentId) {
        window.alert('\u9019\u5247\u56DE\u8986\u88AB\u5B58\u6210\u4E86\u7368\u7ACB\u7B46\u8A18\uFF1A\u9019\u53F0\u7684\u7B46\u8A18\u8CC7\u6599\u8868\u9084\u6C92\u6709\u300C\u56DE\u8986\u300D\u6B04\u4F4D\u3002\u8ACB\u5230 App \u5E02\u96C6\u628A\u300C\u7B46\u8A18\u300D\u66F4\u65B0\u5230\u6700\u65B0\u7248\uFF08\u6703\u81EA\u52D5\u88DC\u6B04\u4F4D\uFF09\uFF0C\u518D\u91CD\u65B0\u56DE\u8986\u4E00\u6B21\u3002');
      }
      loadNotes();
    });
  }

  function formatTime(iso) {
    if (!iso) return '';
    var d = new Date(iso);
    if (isNaN(d.getTime())) return '';
    return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
  }

  // \u2500\u2500 \u5C0F\u65E5\u66C6\u6E32\u67D3 \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

  var DOW = ['\u65E5', '\u4E00', '\u4E8C', '\u4E09', '\u56DB', '\u4E94', '\u516D'];

  function renderCalendar() {
    var notesByDate = NotesCore.datesWithNotes(state.notes);
    var todayStr = NotesCore.todayISO();
    var cal = NotesCore.buildCalendarMonth(state.calYear, state.calMonth, notesByDate, todayStr, state.selectedDate);

    calLabel.textContent = state.calYear + ' \u5E74 ' + (state.calMonth + 1) + ' \u6708';

    var html = DOW.map(function (d) { return '<div class="cal-dow">' + d + '</div>'; }).join('');
    cal.weeks.forEach(function (week) {
      week.forEach(function (cell) {
        if (!cell) { html += '<div class="cal-cell empty"></div>'; return; }
        var cls = 'cal-cell';
        if (cell.isToday) cls += ' today';
        if (cell.isSelected) cls += ' selected';
        html += '<div class="' + cls + '" data-date="' + cell.dateStr + '">' +
          cell.day + (cell.hasNotes ? '<span class="dot"></span>' : '') +
          '</div>';
      });
    });
    calGrid.innerHTML = html;

    Array.prototype.forEach.call(calGrid.querySelectorAll('.cal-cell[data-date]'), function (el) {
      el.addEventListener('click', function () {
        var d = el.getAttribute('data-date');
        selectDate(state.selectedDate === d ? null : d); // \u518D\u9EDE\u4E00\u6B21\u540C\u4E00\u5929\uFF1D\u53D6\u6D88\u7BE9\u9078
      });
    });

    filterChip.hidden = !state.selectedDate;
    if (state.selectedDate) filterChip.textContent = state.selectedDate;
  }

  function selectDate(dateStr) {
    state.selectedDate = dateStr;
    if (dateStr) {
      var parts = dateStr.split('-');
      state.calYear = Number(parts[0]);
      state.calMonth = Number(parts[1]) - 1;
    }
    renderCalendar();
    renderRiver();
  }

  calendarToggle.addEventListener('click', function () {
    state.calendarOpen = !state.calendarOpen;
    calendarPanel.hidden = !state.calendarOpen;
    calendarChevron.textContent = state.calendarOpen ? '\u25B4' : '\u25BE';
    if (state.calendarOpen) renderCalendar();
  });

  $('calPrev').addEventListener('click', function () {
    state.calMonth -= 1;
    if (state.calMonth < 0) { state.calMonth = 11; state.calYear -= 1; }
    renderCalendar();
  });
  $('calNext').addEventListener('click', function () {
    state.calMonth += 1;
    if (state.calMonth > 11) { state.calMonth = 0; state.calYear += 1; }
    renderCalendar();
  });

  // \u2500\u2500 \u9001\u51FA\u4E00\u5247\u7B46\u8A18 \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

  function submitNote() {
    var content = composerInput.value;
    composerError.textContent = '';
    if (!content.trim()) { composerError.textContent = '\u7B46\u8A18\u4E0D\u80FD\u662F\u7A7A\u7684\u3002'; return; }

    submitBtn.disabled = true;
    submitBtn.textContent = '\u9001\u51FA\u4E2D\u2026';

    // \u5BEB\u5165\u7684\u65E5\u671F\uFF1A\u82E5\u76EE\u524D\u6B63\u7BE9\u9078\u8457\u67D0\u4E00\u5929\uFF0C\u5C31\u5BEB\u9032\u90A3\u4E00\u5929\uFF08\u65B9\u4FBF\u88DC\u8A18\uFF09\uFF1B\u5426\u5247\u7528\u4ECA\u5929\u3002
    var targetDate = state.selectedDate || NotesCore.todayISO();

    callAction('create_note', { content: content, date: targetDate }).then(function (resp) {
      var res = NotesCore.unwrapActionResult(resp);
      submitBtn.disabled = false;
      submitBtn.textContent = '\u9001\u51FA';
      if (!res || !res.success) {
        composerError.textContent = '\u9001\u51FA\u5931\u6557\uFF1A' + ((res && res.error) || '\u672A\u77E5\u932F\u8AA4');
        return;
      }
      composerInput.value = '';
      loadNotes();
    });
  }

  submitBtn.addEventListener('click', submitNote);
  composerInput.addEventListener('keydown', function (e) {
    // Cmd/Ctrl+Enter \u9001\u51FA\uFF0C\u4E00\u822C Enter \u4FDD\u7559\u7D66\u63DB\u884C\uFF08\u7B46\u8A18\u5E38\u5E38\u662F\u591A\u884C\uFF09\u3002
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') submitNote();
  });
  composerHint.textContent = '\u2318/Ctrl + Enter \u9001\u51FA';

  // \u2500\u2500 \u5168\u87A2\u5E55\u8F38\u5165\uFF08leo 2026-08-24\uFF1A\u300C\u539F\u672C\u7B46\u8A18\u8F38\u5165\u754C\u9762\u53EF\u4EE5\u5168\u87A2\u5E55\uFF0C\u4F46\u4E5F\u6C92\u6709\u6309\u9215\u300D\uFF09\u2500\u2500\u2500
  //
  // \u540C\u4E00\u4EFD\u8349\u7A3F\uFF0C\u4E0D\u662F\u5169\u4EFD\uFF1A\u5C55\u958B\u6642\u628A\u4E3B\u8F38\u5165\u6846\u7684\u503C\u5E36\u904E\u53BB\uFF0C\u6536\u8D77\uFF08Esc \u6216 \u2715\uFF09\u6642\u628A\u5168\u87A2\u5E55\u6846
  // \u7684\u503C\u5E36\u56DE\u4E3B\u8F38\u5165\u6846\u2014\u2014\u4F7F\u7528\u8005\u4E2D\u9014\u5207\u63DB\u4E0D\u6703\u767C\u73FE\u5167\u5BB9\u8B8A\u4E86\uFF0C\u53EA\u662F\u63DB\u4E86\u500B\u66F4\u5927\u7684\u6846\u7DE8\u8F2F\u3002
  // \u9001\u51FA\u53EF\u4EE5\u76F4\u63A5\u5728\u5168\u87A2\u5E55\u6846\u88E1\u6309 \u2318+Enter\uFF0C\u4E0D\u5FC5\u5148\u6536\u8D77\u518D\u6309\u4E3B\u9001\u51FA\u9375\u3002

  function openFullscreen() {
    fsTextarea.value = composerInput.value;
    fsBackdrop.hidden = false;
    setTimeout(function () { fsTextarea.focus(); }, 0);
  }
  function closeFullscreen(syncBack) {
    if (syncBack !== false) composerInput.value = fsTextarea.value;
    fsBackdrop.hidden = true;
  }
  composerExpandBtn.addEventListener('click', openFullscreen);
  fsCloseBtn.addEventListener('click', function () { closeFullscreen(true); });
  fsBackdrop.addEventListener('click', function (e) {
    if (e.target === fsBackdrop) closeFullscreen(true); // \u9EDE\u80CC\u666F\uFF1D\u8DDF Esc \u4E00\u6A23\u6536\u8D77\uFF0C\u4E0D\u662F\u53D6\u6D88
  });
  fsTextarea.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { e.preventDefault(); closeFullscreen(true); return; }
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      composerInput.value = fsTextarea.value;
      closeFullscreen(false); // \u503C\u5DF2\u7D93\u540C\u6B65\u904E\u4E86\uFF0C\u6536\u8D77\u6642\u4E0D\u8981\u7528\uFF08\u53EF\u80FD\u5DF2\u88AB\u6E05\u7A7A\u7684\uFF09fsTextarea \u518D\u84CB\u4E00\u6B21
      submitNote();
    }
  });
  fsSubmitBtn.addEventListener('click', function () {
    composerInput.value = fsTextarea.value;
    closeFullscreen(false);
    submitNote();
  });

  // \u2500\u2500 \u8F09\u5165\u6CB3\u9053 \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

  function loadNotes() {
    callAction('list_notes', {}).then(function (resp) {
      var res = NotesCore.unwrapActionResult(resp);
      if (!res || !res.success) {
        river.innerHTML = '<div class="river-empty">\u8F09\u5165\u5931\u6557\uFF1A' + NotesCore.escapeHtml((res && res.error) || '\u672A\u77E5\u932F\u8AA4') + '</div>';
        return;
      }
      state.notes = (res.data && res.data.notes) || [];
      renderRiver();
      if (state.calendarOpen) renderCalendar();
    });
  }

  // \u{1F534} \u5EF6\u5F8C\u5230\u4E0B\u4E00\u8F2A\u4E8B\u4EF6\u5708\u624D\u7B2C\u4E00\u6B21\u547C\u53EB callAction\u3001\u624D\u6C7A\u5B9A\u8981\u4E0D\u8981\u986F\u793A MOCK \u6A6B\u5E45\uFF1A
  // \u771F Portal \u88E1 window.arcrunApp.action \u662F\u5728\u9019\u652F script \u57F7\u884C\u5B8C\u4E4B\u5F8C\u624D\u88AB\u8CE6\u503C\u7684
  // \uFF08\u898B\u4E0A\u9762\u300C\u6642\u5E8F\u9677\u9631\u300D\u8AAA\u660E\uFF09\u3002\u540C\u6B65\u547C\u53EB\uFF0F\u540C\u6B65\u5224\u65B7\u90FD\u6703\u62FF\u5230\u932F\u7684\u7B54\u6848\uFF08\u6C38\u9060\u8AA4\u5224\u6210 MOCK\uFF09\u3002
  // setTimeout(fn, 0) \u4FDD\u8B49\u665A\u65BC\u90A3\u6B21\u8CE6\u503C\u2014\u2014\u9019\u88E1\u9023\u6A6B\u5E45\u7684\u986F\u793A\u8207\u5426\u90FD\u653E\u9032\u540C\u4E00\u500B\u56DE\u547C\uFF0C
  // \u78BA\u4FDD\u5169\u8005\u7528\u7684\u662F\u540C\u4E00\u6B21\u3001\u540C\u4E00\u500B\u6642\u9593\u9EDE\u5224\u65B7\u51FA\u4F86\u7684\u7D50\u679C\uFF0C\u4E0D\u6703\u4E0D\u4E00\u81F4\u3002
  setTimeout(function () {
    $('mockBanner').hidden = !usingMock();
    loadNotes();
  }, 0);
})();
<\/script>
</body>
</html>
`
  },
  data: [
    {
      name: "note",
      description: "Arcrun \u7B46\u8A18 App \u7684\u4E00\u5247\u7B46\u8A18\u2014\u2014\u6CB3\u9053\u5F0F\uFF1A\u65B0\u7684\u5728\u6700\u4E0A\u9762\uFF0C\u5C0F\u65E5\u66C6\u4F9D date \u7BE9\u9078\u904E\u53BB\u7684\u8A18\u9304\u3002 \u4E00\u5247\u7B46\u8A18\u53EF\u4EE5\u6709\u56DE\u8986\uFF08parent_id \u6307\u56DE\u5B83\uFF09\uFF0C\u56DE\u8986\u662F indented \u639B\u5728\u8A72\u5247\u5E95\u4E0B\uFF0C\u4E0D\u662F\u7368\u7ACB\u7684\u6CB3\u9053\u9805\u76EE\u3002\n",
      slots: [
        "date",
        "content",
        "created_at",
        "parent_id"
      ]
    }
  ],
  actions: [
    "create_note",
    "list_notes"
  ]
};

// workflows/global_index.app.json
var global_index_app_default = {
  id: "global_index",
  name: "\u958B\u5834\u5168\u5C40\u7E3D\u5716",
  version: "0.1.1",
  icon: "\u{1F9ED}",
  workflows: [
    {
      name: "global_index",
      graph: {
        id: "global_index",
        name: "global_index",
        nodes: [
          {
            id: "input",
            type: "Input",
            componentId: "input",
            label: "input"
          },
          {
            id: "prep",
            type: "Component",
            componentId: "code",
            label: "prep",
            data: {
              code: "// \u{1F534} 2026-09-26\uFF08InkStoneCo#17 comment 11577\uFF09\uFF1A\u4E0D\u5E36\u53C3\u6578\u89F8\u767C\u6642 Gitea 404 \u7684\u6839\u56E0\u3002\n// graph-executor.ts interpolateString() \u5C0D\u300C\u6574\u6BB5\u5C31\u662F\u55AE\u4E00 {{x}} \u5F15\u7528\u300D\u4E14 x \u89E3\u4E0D\u51FA\u4F86\n// \uFF08trigger body \u6C92\u5E36\u9019\u500B key\uFF09\u6642\uFF0C\u56DE\u7684\u662F**\u5B57\u9762\u5B57\u4E32** \"{{input.org}}\"\uFF0C\u4E0D\u662F undefined\n// \u4E5F\u4E0D\u662F\u7A7A\u5B57\u4E32\uFF08`return val === undefined ? s : val` \u90A3\u500B s \u5C31\u662F\u539F\u6A23\u6A21\u677F\u6587\u5B57\uFF09\u3002\n// \u820A\u5BEB\u6CD5 `input.org == null ? '' : input.org` \u628A\u9019\u500B\u975E null \u7684\u5B57\u9762\u5B57\u4E32\u7576\u6210\u300C\u4F7F\u7528\u8005\u586B\u4E86\u503C\u300D\uFF0C\n// trim() \u5F8C\u4ECD\u662F\u975E\u7A7A\u5B57\u4E32 \u21D2 `|| 'inkstone'` \u7684\u9810\u8A2D\u503C\u6C38\u9060\u4E0D\u6703\u751F\u6548 \u21D2 org \u8B8A\u6210\n// \u5B57\u9762 \"{{input.org}}\" \u9019\u4E32\u5783\u573E\uFF0C\u88AB\u585E\u9032\u4E0B\u9762\u7684 `/orgs/{{prep.data.org}}/repos` \u8DEF\u5F91\uFF0C\n// Gitea \u5C0D\u4E0D\u4E0A\u4EFB\u4F55 route \u56DE 404\uFF08\u6307\u5411 /api/swagger \u7684\u90A3\u500B\u6CDB\u7528 404\uFF09\u3002\n// \u4FEE\u6CD5\uFF1A\u5148\u904E\u6FFE\u6389\u300C\u6574\u6BB5\u9084\u662F\u6C92\u89E3\u958B\u7684\u6A21\u677F\u4F54\u4F4D\u7B26\u300D\u9019\u500B\u72C0\u614B\uFF0C\u518D\u5957\u9810\u8A2D\u503C\u3002\nfunction unresolved(v) { return typeof v === 'string' && /^\\{\\{.*\\}\\}$/.test(v); }\nvar orgRaw = (input.org == null || unresolved(input.org)) ? '' : input.org;\nvar org = String(orgRaw).trim() || 'inkstone';\nvar fullRaw = (input.full == null || unresolved(input.full)) ? '0' : input.full;\nvar full = String(fullRaw) === '1';\nreturn { success: true, org: org, full: full ? 1 : 0 };\n",
              input: {
                org: "{{input.org}}",
                full: "{{input.full}}"
              },
              limits: {
                timeout_ms: 2e3,
                max_output_bytes: 65536
              }
            }
          },
          {
            id: "fetch_repos",
            type: "Component",
            componentId: "gitea_read",
            label: "fetch_repos",
            data: {
              _path: "/orgs/{{prep.data.org}}/repos?limit=50",
              gitea_token: "{{credential.gitea_token}}"
            }
          },
          {
            id: "plan",
            type: "Component",
            componentId: "code",
            label: "plan",
            data: {
              code: "var raw = input.repos_raw;\nif (typeof raw === 'string') { try { raw = JSON.parse(raw); } catch (e) { raw = null; } }\nif (!Array.isArray(raw)) { return { success: false, error: 'Gitea /orgs/' + input.org + '/repos \u6C92\u6709\u56DE\u4E00\u500B repo \u9663\u5217\uFF08\u62FF\u5230 ' + (typeof input.repos_raw) + '\uFF09' }; }\nvar repos = raw.map(function (r) {\n  return { name: String(r.name || ''), open: Number(r.open_issues_count) || 0, archived: !!r.archived };\n}).filter(function (r) { return r.name; });\nvar total = 0;\nrepos.forEach(function (r) { total += r.open; });\nvar PER = 50;\nvar n = Math.ceil(total / PER);\nif (n < 1) n = 1;\nif (n > 40) n = 40;\nvar pages = [];\nfor (var i = 1; i <= n; i++) pages.push({ n: i });\nreturn { success: true, org: input.org, repos: repos, repo_count: repos.length, expected_open: total, page_count: n, pages: pages };\n",
              input: {
                org: "{{prep.data.org}}",
                repos_raw: "{{fetch_repos.data}}"
              },
              limits: {
                timeout_ms: 3e3,
                max_output_bytes: 262144
              }
            }
          },
          {
            id: "fetch_page",
            type: "Component",
            componentId: "gitea_read",
            label: "fetch_page",
            data: {
              _path: "/repos/issues/search?state=open&owner={{prep.data.org}}&type=issues&limit=50&page={{page.n}}",
              gitea_token: "{{credential.gitea_token}}"
            }
          },
          {
            id: "fetch_map",
            type: "Component",
            componentId: "http_request",
            label: "fetch_map",
            data: {
              method: "GET",
              url: "__CYPHER_BASE__/kbdb/map",
              headers: {
                Accept: "application/json",
                "X-Arcrun-API-Key": "__NAMESPACE__"
              }
            }
          },
          {
            id: "fetch_ticket_lib",
            type: "Component",
            componentId: "http_request",
            label: "fetch_ticket_lib",
            data: {
              method: "GET",
              url: "__CYPHER_BASE__/kbdb/entries/library-cards?library=tickets&limit=1",
              headers: {
                Accept: "application/json",
                "X-Arcrun-API-Key": "__NAMESPACE__"
              }
            }
          },
          {
            id: "assemble",
            type: "Component",
            componentId: "code",
            label: "assemble",
            data: {
              code: "function one(s) { return String(s == null ? '' : s).replace(/\\s+/g, ' ').trim(); }\nfunction parse(b) { if (typeof b === 'string') { try { return JSON.parse(b); } catch (e) { return null; } } return b; }\nvar org = String(input.org || 'inkstone');\nvar full = String(input.full) === '1';\nvar repos = Array.isArray(input.repos) ? input.repos : [];\nvar expected = Number(input.expected_open) || 0;\n\n// \u7968\uFF1A\u628A\u6BCF\u4E00\u9801\u7684\u7D50\u679C\u6524\u5E73\uFF1B\u4E00\u9801\u58DE\u6389\u5C31\u8A18\u4E0B\u4F86\uFF0C\u4E0D\u5047\u88DD\u90A3\u9801\u662F\u7A7A\u7684\nvar pageResults = Array.isArray(input.pages) ? input.pages : [];\nvar rows = [];\nvar badPages = 0;\npageResults.forEach(function (r) {\n  var arr = r && r.success !== false ? parse(r.data) : null;\n  if (!Array.isArray(arr)) { badPages++; return; }\n  arr.forEach(function (i) {\n    if (!i || i.pull_request) return;\n    var repo = (i.repository && i.repository.name) || '?';\n    var labs = (i.labels || []).map(function (l) { return l.name; });\n    rows.push({ repo: repo, n: i.number, t: i.title, l: labs, m: i.milestone ? i.milestone.title : '', c: i.created_at, u: i.updated_at });\n  });\n});\nif (rows.length === 0) { return { success: false, error: '\u7968 index \u4E00\u5F35\u7968\u90FD\u7B97\u4E0D\u51FA\u4F86\uFF08' + pageResults.length + ' \u9801\u3001' + badPages + ' \u9801\u58DE\uFF09\u2192 \u4E0D\u6CE8\u5165\uFF08\u5BE7\u53EF\u51B7\u555F\u52D5\uFF0C\u4E0D\u8981\u6CE8\u5165\u5783\u573E\uFF09' }; }\n\n// \u77E5\u8B58\uFF1A\u85CF\u66F8\u5730\u5716\nvar libs = null;\ntry { var m = parse(input.map_body); if (m && Array.isArray(m.libraries)) libs = m.libraries; } catch (e) { libs = null; }\n// \u7968\u5EAB\u76EE\u9304\nvar tl = parse(input.ticket_lib_body);\nvar ticketTotal = tl && tl.success !== false && typeof tl.total === 'number' ? tl.total : null;\nvar ticketLatest = tl && Array.isArray(tl.cards) && tl.cards[0] ? tl.cards[0] : null;\n\nvar ACT = { 's/doing': 1, 's/stage': 1, 's/triage': 1 };\nvar NEXT = { 's/todo': 1 };\nfunction stateOf(r) {\n  var s = r.l.filter(function (x) { return x.indexOf('s/') === 0; });\n  if (s.length === 0) return 'unlabeled';\n  for (var i = 0; i < s.length; i++) { if (ACT[s[i]]) return 'active'; }\n  for (var j = 0; j < s.length; j++) { if (NEXT[s[j]]) return 'next'; }\n  return 'later';\n}\nfunction rank(r) {\n  var a = r.l.indexOf('s/doing') >= 0 ? 0 : (r.l.indexOf('s/stage') >= 0 ? 1 : 2);\n  var b = r.l.indexOf('p/high') >= 0 ? 0 : 1;\n  return a * 10 + b;\n}\nfunction byRepo(list) {\n  var g = {};\n  list.forEach(function (r) { (g[r.repo] = g[r.repo] || []).push(r); });\n  return g;\n}\nvar act = [], next = [], later = [], unl = [];\nrows.forEach(function (r) {\n  var st = stateOf(r);\n  if (st === 'active') act.push(r); else if (st === 'next') next.push(r); else if (st === 'unlabeled') unl.push(r); else later.push(r);\n});\nact.sort(function (x, y) { return (rank(x) - rank(y)) || (x.repo < y.repo ? -1 : x.repo > y.repo ? 1 : 0) || (x.n - y.n); });\n\nvar NOW = Date.now();\nvar DAY = 24 * 60 * 60 * 1000;\nfunction ms(s) { var t = Date.parse(s || ''); return isNaN(t) ? 0 : t; }\nvar fresh = rows.filter(function (r) { return ms(r.c) > NOW - DAY || ms(r.u) > NOW - DAY; });\nfresh.sort(function (x, y) { return (ms(y.u) || ms(y.c)) - (ms(x.u) || ms(x.c)); });\n\nvar L = [];\nL.push('# \u5168\u5C40\u7E3D\u5716\uFF1A\u73FE\u5728\u6709\u54EA\u4E9B\u7968\u3001\u5EAB\u88E1\u6709\u54EA\u4E9B\u77E5\u8B58');\nL.push('\uFF08\u96F2\u7AEF\u73FE\u7B97 ' + new Date().toISOString() + '\u3000\xB7\u3000\u771F\u76F8\u6E90\uFF1DGitea `' + org + '/*`\uFF0C\u9019\u4EFD\u662F\u6295\u5F71\uFF0C\u6539\u5B83\u6C92\u7528\uFF0C\u4E0B\u6B21\u958B\u5834\u6703\u91CD\u7B97\uFF09');\nL.push('');\nif (fresh.length) {\n  L.push('## \u{1F195} \u904E\u53BB 24 \u5C0F\u6642\u6709 ' + fresh.length + ' \u5F35\u7968\u52D5\u904E\u2014\u2014**\u898F\u5283\u524D\u5148\u770B\u9019\u6BB5**');\n  fresh.slice(0, 12).forEach(function (r) {\n    var isNew = ms(r.c) > NOW - DAY;\n    L.push('- ' + (isNew ? '**\u65B0\u958B** ' : '\u8B8A\u52D5 ') + '`' + org + '/' + r.repo + '#' + r.n + '` \u2014 ' + one(r.t));\n  });\n  if (fresh.length > 12) { L.push('- \u2026\u9084\u6709 ' + (fresh.length - 12) + ' \u5F35\uFF08\u6309\u6700\u5F8C\u8B8A\u52D5\u6642\u9593\u6392\uFF0C\u4E0A\u9762\u662F\u6700\u8FD1\u7684\uFF09'); }\n  L.push('');\n}\n\n// \u4E00\u3001\u7968\uFF1A\u5148\u8B1B\u6BCF\u500B repo \u6709\u5E7E\u5F35\uFF08leo\uFF1A\u300C\u4F60\u4E0D\u77E5\u9053\u54EA\u500B repo \u6709\u54EA\u4E9B\u7968\u300D\u2014\u2014\u9019\u4E00\u884C\u5C31\u662F\u89E3\u90A3\u53E5\u7684\uFF09\nvar withIssues = repos.filter(function (r) { return r.open > 0; }).sort(function (a, b) { return b.open - a.open || (a.name < b.name ? -1 : 1); });\nvar zero = repos.filter(function (r) { return r.open === 0; }).map(function (r) { return r.name; });\nL.push('## \u4E00\u3001\u7968 \u2014 Gitea `' + org + '` ' + repos.length + ' \u500B repo\uFF0C' + withIssues.length + ' \u500B\u6709\u7968\uFF0C\u958B\u8457 ' + rows.length + ' \u5F35');\nL.push('');\nL.push('### \u6BCF\u500B repo \u7684 open \u7968\u6578');\nwithIssues.forEach(function (r) { L.push('- `' + org + '/' + r.name + '` ' + r.open + ' \u5F35'); });\nif (zero.length) L.push('- 0 \u5F35\uFF1A' + zero.map(function (n) { return '`' + n + '`'; }).join(' '));\nif (expected && expected !== rows.length) {\n  L.push('');\n  L.push('> \u26A0\uFE0F repo \u7D71\u8A08\u8AAA\u6709 ' + expected + ' \u5F35\uFF0C\u4F46\u53EA\u6293\u5230 ' + rows.length + ' \u5F35\uFF08' + badPages + ' \u9801\u6C92\u6293\u6210\uFF09\u2014\u2014\u4E0A\u9762\u7684\u6E05\u55AE**\u4E0D\u5B8C\u6574**\uFF0C\u7F3A\u7684\u90A3\u4E9B\u53BB Gitea \u88DC\u67E5\u3002');\n}\nL.push('');\nL.push('### \u5728\u505A\u7684\uFF08' + act.length + ' \u5F35\uFF1Bs/doing \xB7 s/stage \xB7 s/triage\uFF09');\nact.forEach(function (r) {\n  L.push('- `' + org + '/' + r.repo + '#' + r.n + '` ' + r.l.join(' ') + ' \u2014 ' + one(r.t) + (r.m ? '\u3000\u3014' + one(r.m) + '\u3015' : ''));\n});\nL.push('');\nfunction numbersLine(title, list) {\n  var g = byRepo(list);\n  L.push('### ' + title + '\uFF08' + list.length + ' \u5F35' + (full ? '' : '\uFF1B\u53EA\u7D66\u7DE8\u865F\uFF0C\u8981\u770B\u5167\u5BB9\u81EA\u5DF1\u53BB Gitea\uFF0C\u6216 `full=1` \u91CD\u8DD1') + '\uFF09');\n  Object.keys(g).sort().forEach(function (k) {\n    if (full) { g[k].forEach(function (r) { L.push('- `' + org + '/' + k + '#' + r.n + '` ' + r.l.join(' ') + ' \u2014 ' + one(r.t)); }); }\n    else { L.push('- **' + k + '**\uFF1A' + g[k].map(function (r) { return '#' + r.n; }).join(' ')); }\n  });\n  L.push('');\n}\nnumbersLine('\u6392\u597D\u7B49\u958B\u5DE5\u7684\uFF08s/todo\uFF09', next);\nif (unl.length) numbersLine('\u6C92\u6A19\u72C0\u614B\u7684\uFF08\u6C92\u6709 s/* \u6A19\u7C64\u2014\u2014\u5148\u9A57\u50B7\u518D\u6C7A\u5B9A\uFF09', unl);\nnumbersLine('\u73FE\u5728\u4E0D\u8A72\u6311\u4F86\u505A\u7684\uFF08s/backlog \xB7 s/review \xB7 s/pending \u7B49\uFF09', later);\nL.push('> \u4E0A\u9762\u6C92\u6709\u300C\u8AB0\u64CB\u8AB0\u300D\uFF1AGitea \u7684\u64CB\u8DEF\u95DC\u4FC2\u53EA\u80FD\u4E00\u5F35\u4E00\u5F35\u554F\uFF0C\u6703\u628A\u6BCF\u6B21\u57F7\u884C 50 \u500B\u5916\u90E8\u8ACB\u6C42\u7684\u984D\u5EA6\u5403\u5149\u3002');\nL.push('> \u21D2 **\u6311\u7968\u958B\u5DE5\u524D\uFF0C\u81EA\u5DF1\u6253\u4E00\u6B21\u90A3\u5F35\u7968\u7684 `/dependencies` \u78BA\u8A8D\u524D\u7F6E\u505A\u5B8C\u4E86\u6C92\u3002**');\nL.push('');\n\n// \u4E8C\u3001\u77E5\u8B58\nL.push('## \u4E8C\u3001\u77E5\u8B58 \u2014 KBDB \u85CF\u66F8\u5730\u5716');\nif (libs === null) {\n  L.push('\u26A0\uFE0F \u9019\u6B21\u53D6\u4E0D\u5230\u85CF\u66F8\u5730\u5716\uFF0C\u9019\u4E00\u534A**\u4E0D\u6CE8\u5165**\uFF08\u5BE7\u53EF\u51B7\u555F\u52D5\uFF0C\u4E0D\u8981\u6CE8\u5165\u5783\u573E\uFF09\u3002\u8981\u67E5\u8ACB\u76F4\u63A5\u6253 `kbdb_get_map()`\u3002');\n} else {\n  L.push('\u4E00\u5EAB\u4E00\u884C\uFF0C\u53EA\u8AAA\u300C\u6709\u54EA\u4E9B\u5EAB\u3001\u5404\u88DD\u4E86\u4EC0\u9EBC\u300D\u3002\u4E09\u6B65\u8D70\uFF1A`kbdb_get_map` \u2192 `kbdb_get_index(library)` \u2192 `kbdb_get_card`\u3002');\n  libs.forEach(function (x) {\n    var top = (x.top_entities || []).slice(0, 3).join(' / ');\n    var ec = typeof x.entry_count === 'number' ? x.entry_count + ' \u7B46\u5167\u5BB9' : '';\n    if (x.triplet_count > 0 || x.entry_count > 0) {\n      L.push('- `' + x.library + '` \u2014 ' + [ec, (x.triplet_count || 0) + ' \u689D\u4E09\u5143\u7D44'].filter(Boolean).join('\u3001') + (top ? '\uFF1B\u6838\u5FC3\uFF1A' + top : '') + (x.narrative ? '\uFF1B' + one(x.narrative).slice(0, 80) : ''));\n    } else {\n      L.push('- `' + x.library + '` \u2014 **\u7A7A\u7684**');\n    }\n  });\n}\nL.push('');\nL.push('### \u7968\u5EAB\uFF08`tickets`\uFF09\u2014 \u7968\u7684\u7D30\u7BC0\u5728\u5EAB\u88E1\u67E5\u5F97\u5230\u55CE');\nif (ticketTotal === null) {\n  L.push('\u26A0\uFE0F \u9019\u6B21\u8B80\u4E0D\u5230\u7968\u5EAB\u76EE\u9304\uFF08cypher /kbdb/entries/library-cards \u6C92\u56DE\uFF09\uFF0C\u4E0D\u77E5\u9053\u7968\u6709\u6C92\u6709\u9032\u5EAB\u3002');\n} else if (ticketTotal === 0) {\n  L.push('**\u9084\u6C92\u6709\u4EFB\u4F55\u7968\u9032\u5EAB\u3002** \u554F\u300C\u67D0\u5F35\u7968\u7684\u4F86\u9F8D\u53BB\u8108\u300D\u53EA\u80FD\u76F4\u63A5\u8B80 Gitea\u3002\u8981\u704C\uFF1A\u5C0D\u6BCF\u500B repo \u8DD1 `gitea_issues_ingest`\uFF08\u4EBA\u767C\u8D77\uFF0C\u4E0D\u6392\u7A0B\uFF09\u3002');\n} else {\n  var latestAt = ticketLatest && ticketLatest.updated_at ? new Date(ticketLatest.updated_at * 1000).toISOString().slice(0, 16) + 'Z' : '?';\n  L.push('\u5EAB\u88E1\u6709 **' + ticketTotal + ' \u5F35\u7968**\uFF08\u5361\u540D\uFF1D`owner/repo#N`\uFF09\uFF0C\u6700\u8FD1\u4E00\u6B21\u5BEB\u5165 ' + latestAt + (ticketLatest ? '\uFF08`' + ticketLatest.page_name + '`\uFF09' : '') + '\u3002');\n  L.push('\u554F\u67D0\u5F35\u7968\u7684\u4F86\u9F8D\u53BB\u8108\uFF1A`kbdb_get_card(library=\"tickets\", page_name=\"' + org + '/<repo>#<N>\")`\uFF1B\u627E\u76F8\u95DC\u7684\u7968\uFF1A`kbdb_search(q=\u2026)` \u547D\u4E2D page_name \u5E36 `#` \u7684\u5C31\u662F\u7968\u3002');\n  if (ticketTotal < rows.length) L.push('> \u958B\u8457\u7684\u7968\u6709 ' + rows.length + ' \u5F35\u3001\u5EAB\u88E1\u53EA\u6709 ' + ticketTotal + ' \u5F35 \u21D2 \u6C92\u9032\u5EAB\u7684\u90A3\u4E9B\u4ECD\u8981\u53BB Gitea \u8B80\uFF1B\u88DC\u704C\u8DD1 `gitea_issues_ingest`\u3002');\n}\nL.push('');\nL.push('---');\nL.push('- **\u7968\u4E0D\u53EF\u4EE5\u7528\u820A\u7684**\uFF1A\u4EE5\u4E0A\u662F\u9019\u4E00\u523B\u7684\u72C0\u614B\u3002\u8981\u52D5\u67D0\u4E00\u5F35\u4E4B\u524D\u5148\u55AE\u7368\u91CD\u67E5\u90A3\u4E00\u5F35\u2014\u2014\u4F60\u5403\u500B\u98EF\u56DE\u4F86\u5B83\u5C31\u53EF\u80FD\u88AB\u6539\u4E86\u3002');\nL.push('- **\u77E5\u8B58\u53EF\u4EE5\u7A0D\u820A**\uFF1A\u5EAB\u88E1\u7684\u5167\u5BB9\u6628\u5929\u5BEB\u7684\u4ECA\u5929\u8B80\u9084\u662F\u5C0D\u7684\u3002');\nL.push('- **\u9019\u662F index \u4E0D\u662F\u5167\u5BB9**\uFF1A\u5B83\u53EA\u8B93\u4F60\u77E5\u9053\u300C\u6709\u9019\u4EF6\u4E8B\u3001\u53BB\u54EA\u88E1\u627E\u300D\uFF0C\u7D30\u7BC0\u5728\u7968\u4E0A\u8207\u5EAB\u88E1\u3002');\n\nvar md = L.join('\\n');\nreturn { success: true, md: md, bytes: md.length, org: org, repo_count: repos.length, repos_with_issues: withIssues.length, open_issues: rows.length, expected_open: expected, pages: pageResults.length, bad_pages: badPages, active: act.length, libraries: libs === null ? 0 : libs.length, ticket_cards: ticketTotal };\n",
              input: {
                org: "{{prep.data.org}}",
                full: "{{prep.data.full}}",
                repos: "{{plan.data.repos}}",
                expected_open: "{{plan.data.expected_open}}",
                pages: "{{plan.results}}",
                map_body: "{{fetch_map.data.body}}",
                ticket_lib_body: "{{fetch_ticket_lib.data.body}}"
              },
              limits: {
                timeout_ms: 8e3,
                max_output_bytes: 524288
              }
            }
          }
        ],
        edges: [
          {
            from: "input",
            to: "prep",
            type: "ON_SUCCESS"
          },
          {
            from: "prep",
            to: "fetch_repos",
            type: "ON_SUCCESS"
          },
          {
            from: "fetch_repos",
            to: "plan",
            type: "ON_SUCCESS"
          },
          {
            from: "plan",
            to: "fetch_page",
            type: "FOREACH",
            iterator: "page"
          },
          {
            from: "plan",
            to: "fetch_map",
            type: "ON_SUCCESS"
          },
          {
            from: "fetch_map",
            to: "fetch_ticket_lib",
            type: "ON_SUCCESS"
          },
          {
            from: "fetch_ticket_lib",
            to: "assemble",
            type: "ON_SUCCESS"
          }
        ]
      },
      description: "\u958B\u5834\u5168\u5C40\u7E3D\u5716\uFF1A\u4E00\u6B21\u7B97\u51FA\u300C\u73FE\u5728\u6709\u54EA\u4E9B\u7968\u3001\u5EAB\u88E1\u6709\u54EA\u4E9B\u77E5\u8B58\u300D\u7684 index\uFF08md\uFF09\u3002 \u7968\u8D70 Gitea \u6574\u500B\u7D44\u7E54\u7684 open issues \u73FE\u7B97\uFF08\u6BCF\u500B repo \u7684\u7968\u6578\uFF0B\u8DE8 repo \u5206\u9801\u6293\u5168\u90E8\uFF0C\u7121\u5FEB\u53D6\uFF0C \u56E0\u70BA\u72C0\u614B\u672C\u8EAB\u5C31\u662F\u5167\u5BB9\uFF09\uFF1B\u77E5\u8B58\u8D70 KBDB \u85CF\u66F8\u5730\u5716\uFF0B\u7968\u5EAB\uFF08tickets\uFF09\u76EE\u9304\u3002 \u4F9B session \u958B\u5834\u6CE8\u5165\uFF0C\u8B93 AI \u4E0D\u5FC5\u88AB\u4EBA\u63D0\u9192\u300C\u9019\u500B\u6709\u7968\u300D\u300Cwiki \u6709\u8A18\u904E\u300D\u3002"
    }
  ]
};

// workflows/kanban.app.json
var kanban_app_default = {
  id: "kanban",
  name: "\u7968\u770B\u677F",
  icon: "\u{1F5C2}\uFE0F",
  version: "0.2.1",
  changelog: "\u5F9E\u5E02\u96C6\u5B89\u88DD\u6642\uFF0C\u5B83\u8981\u7528\u7684\u5169\u652F recipe\uFF08gitea_read\u3001gitea_issue_labels\uFF09\u6703\u4E00\u8D77\u88DD\u597D\uFF1B\u7F3A gitea_token \u6642\uFF0C\u5E02\u96C6\u6703\u660E\u8B1B\u7F3A\u54EA\u4E00\u628A\u3001\u53BB\u300C\u7BA1\u7406 \u2192 \u91D1\u9470\u7BA1\u7406\u300D\u586B\u30020.2.1\uFF1A\u5169\u652F recipe \u5BA3\u544A\u81EA\u5DF1\u8981 gitea_token\uFF0CRecipe \u6E05\u55AE\u4E0D\u518D\u628A\u5B83\u5011\u6A19\u6210\u300C\u514D\u91D1\u9470\u300D\u3002",
  requires: {
    recipes: [
      {
        canonical_id: "gitea_read",
        display_name: "Gitea Read\uFF08\u552F\u8B80\uFF09",
        description: "\u552F\u8B80\u8B80 Gitea API\u3002GET https://git.uncle6.me/api/v1{{_path}}\uFF0C\u8DEF\u5F91\u7531\u547C\u53EB\u7AEF\u7528 _path \u7D66\uFF08\u4F8B /repos/inkstone/Arcrun/issues?state=open&limit=50\uFF09\u3002auth\uFF1A\u7BC0\u9EDE\u81EA\u5DF1\u5E36 gitea_token \u6B04\u4F4D\uFF08\u5BEB {{credential.gitea_token}}\uFF0C\u503C\u5728\u57F7\u884C\u524D\u624D\u7531\u91D1\u9470\u4E2D\u5FC3\u56DE\u586B\uFF09\u3002\u53EA\u505A GET\uFF0C\u4E0D\u6539\u4EFB\u4F55\u7968\u3002global_index\uFF0Fgitea_issues_ingest \u5169\u652F\u5DE5\u4F5C\u6D41\u7528\u5B83\u2014\u2014\u8D70 recipe \u4E0D\u8D70 http_request \u96F6\u4EF6\uFF0C\u56E0\u70BA\u96F6\u4EF6\u8B80\u4E0D\u56DE\u8D85\u904E 64 KiB \u7684\u56DE\u61C9\uFF0C\u800C\u4E00\u9801 50 \u5F35\u7968\u662F 240 KB \u4EE5\u4E0A\u3002",
        endpoint: "https://git.uncle6.me/api/v1{{_path}}",
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: "token {{gitea_token}}"
        },
        credentials_required: [
          {
            key: "gitea_token",
            inject_as: "gitea_token"
          }
        ]
      },
      {
        canonical_id: "gitea_issue_labels",
        display_name: "Gitea Issue Labels\uFF08\u6574\u7D44\u63DB\u6A19\u7C64\uFF09",
        description: '\u628A Gitea \u4E00\u5F35\u7968\u7684\u6A19\u7C64\u6574\u7D44\u63DB\u6210\u6307\u5B9A\u7684\u90A3\u5E7E\u500B\uFF08PUT https://git.uncle6.me/api/v1/repos/{owner}/{repo}/issues/{n}/labels\uFF09\u3002\u547C\u53EB\u7AEF\u7528 _path \u7D66 /<owner>/<repo>/issues/<n>/labels\uFF0C\u4E26\u5E36\u7BC0\u9EDE\u6B04\u4F4D labels\uFF1D\u6A19\u7C64\u540D\u5B57\u9663\u5217\uFF08\u4F8B ["s/doing","Human"]\uFF0CGitea \u63A5\u53D7\u540D\u5B57\u6216 id\uFF09\u3002auth\uFF1A\u7BC0\u9EDE\u81EA\u5DF1\u5E36 gitea_token \u6B04\u4F4D\uFF08\u5BEB {{credential.gitea_token}}\uFF0C\u503C\u5728\u57F7\u884C\u524D\u624D\u7531\u91D1\u9470\u4E2D\u5FC3\u56DE\u586B\uFF0CD36\uFF09\uFF0C\u8207 gitea_read\uFF0Fgitea_put_file \u540C\u4E00\u628A\u3001\u540C\u4E00\u689D\u8DEF\u3002token \u53EA\u9032 Authorization header\uFF0Cbody_template \u53EA\u6709 labels \u4E00\u6B04 \u21D2 \u91D1\u9470\u4E0D\u6703\u6F0F\u9032\u9001\u51FA\u7684 body\u3002\u662F\u300C\u6574\u7D44\u63DB\u300D\u4E0D\u662F\u300C\u52A0\u4E00\u500B\u300D\uFF1A\u547C\u53EB\u7AEF\u8981\u5148\u8B80\u7968\u3001\u81EA\u5DF1\u7B97\u597D\u65B0\u7684\u6574\u7D44\uFF08\u770B\u677F App \u7684 move_card \u5C31\u662F\u9019\u6A23\u505A\uFF09\u3002\u53EA\u52D5\u6A19\u7C64\uFF0C\u4E0D\u6539\u6A19\u984C\u3001\u5167\u6587\u3001\u72C0\u614B\u3002',
        endpoint: "https://git.uncle6.me/api/v1/repos{{_path}}",
        method: "PUT",
        headers: {
          Accept: "application/json",
          Authorization: "token {{gitea_token}}"
        },
        body_template: {
          labels: "{{labels}}"
        },
        credentials_required: [
          {
            key: "gitea_token",
            inject_as: "gitea_token"
          }
        ]
      }
    ],
    credentials: [
      {
        name: "gitea_token",
        purpose: "\u6709\u8B80\u5BEB\u7968\u6B0A\u9650\u7684 Gitea \u5E33\u865F token\uFF0C\u770B\u677F\u7528\u5B83\u8B80\u7968\u3001\u6539\u6A19\u7C64"
      }
    ]
  },
  workflows: [
    {
      name: "board",
      description: "\u8B80\u4E00\u500B repo \u958B\u8457\u7684\u7968\uFF0C\u4F9D s/* \u72C0\u614B\u6A19\u7C64\u5206\u6B04\uFF0C\u56DE\u50B3\u770B\u677F\u8981\u756B\u7684\u6B04\u8207\u5361\u3002\u552F\u8B80 Gitea\uFF0C\u4E0D\u6539\u4EFB\u4F55\u7968\u3002",
      graph: {
        id: "kanban__board",
        name: "kanban__board",
        nodes: [
          {
            id: "input",
            type: "Input",
            componentId: "input",
            label: "input"
          },
          {
            id: "prep",
            type: "Component",
            componentId: "code",
            label: "prep",
            data: {
              code: `// \u6536\u53C3\u6578\u3001\u9A57 repo\u3002\u6C92\u5E36\u5230\u7684\u9078\u586B\u53C3\u6578\uFF0CArcrun \u6703\u628A "{{input.x}}" \u539F\u6A23\u7559\u8457\uFF08\u4E0D\u662F null\uFF09\u2014\u2014\u7576\u6210\u6C92\u7D66\u3002
function ph(v) { v = String(v == null ? '' : v).trim(); return /^\\{\\{[^{}]*\\}\\}$/.test(v) ? '' : v; }
var repo = ph(input.repo) || 'inkstone/InkStoneCo';
// \u524D\u7AEF\u50B3\u4F86\u7684\u5B57\u4E32\u6703\u88AB\u62FC\u9032 Gitea \u7684\u7DB2\u5740\u8DEF\u5F91\uFF0C\u4E14\u91D1\u9470\u662F\u4F3A\u670D\u5668\u4EE3\u5E36\u7684\u2014\u2014\u6240\u4EE5\u53EA\u51C6 owner/repo \u5169\u6BB5\u3001
// \u4E14 owner \u5FC5\u9808\u5728\u767D\u540D\u55AE\u5167\uFF08\u9019\u500B App \u770B\u7684\u662F\u81EA\u5BB6\u7D44\u7E54\u7684\u7968\uFF0C\u4E0D\u662F\u66FF\u524D\u7AEF\u4EE3\u8B80\u4EFB\u610F repo\uFF09\u3002
if (!/^[A-Za-z0-9_.-]+\\/[A-Za-z0-9_.-]+$/.test(repo) || repo.indexOf('..') >= 0) {
  return { success: false, error: 'repo \u683C\u5F0F\u8981\u662F\u300C\u7D44\u7E54/\u5009\u5EAB\u300D\uFF0C\u4F8B\u5982 inkstone/InkStoneCo\uFF08\u6536\u5230\uFF1A' + repo.slice(0, 60) + '\uFF09' };
}
var OWNERS = ["inkstone"];
if (OWNERS.indexOf(repo.split('/')[0]) < 0) {
  return { success: false, error: '\u9019\u500B\u770B\u677F\u53EA\u8B80 ' + OWNERS.join('\u3001') + ' \u5E95\u4E0B\u7684 repo\uFF08\u6536\u5230\uFF1A' + repo + '\uFF09' };
}
return { success: true, repo: repo };
`,
              input: {
                repo: "{{input.repo}}"
              },
              limits: {
                timeout_ms: 2e3,
                max_output_bytes: 65536
              }
            }
          },
          {
            id: "fetch",
            type: "Component",
            componentId: "gitea_read",
            label: "fetch",
            data: {
              _path: "/repos/{{prep.data.repo}}/issues?state=open&type=issues&limit=50&sort=recentupdate",
              gitea_token: "{{credential.gitea_token}}"
            }
          },
          {
            id: "shape",
            type: "Component",
            componentId: "code",
            label: "shape",
            data: {
              code: `// \u628A Gitea \u56DE\u7684\u7968\u9663\u5217\uFF08open issues\uFF09\u6574\u5F62\u6210\u770B\u677F\u8981\u7684\u6B04\u4F4D\u3002\u7D14\u6574\u5F62\uFF1A\u4E0D\u6253\u7DB2\u8DEF\u3001\u4E0D\u5B58\u4EFB\u4F55\u6771\u897F\u3002
var COLUMNS = [{"id":"s/triage","title":"\u65B0\u9032\u4F86"},{"id":"s/backlog","title":"\u5F85\u6392"},{"id":"s/todo","title":"\u5F85\u9818"},{"id":"s/doing","title":"\u9032\u884C\u4E2D"},{"id":"s/pending","title":"\u5361\u4F4F"},{"id":"s/review","title":"\u5F85\u5BE9"},{"id":"s/stage","title":"\u5F85\u9A57\u6536"}];
var raw = input.issues_raw;
if (typeof raw === 'string') { try { raw = JSON.parse(raw); } catch (e) { raw = null; } }
if (!Array.isArray(raw)) {
  return { success: false, error: 'Gitea \u6C92\u6709\u56DE\u7968\u7684\u9663\u5217\uFF08\u62FF\u5230 ' + (typeof input.issues_raw) + '\uFF09\u3002repo \u4E0D\u5B58\u5728\u3001\u6216\u91D1\u9470\u770B\u4E0D\u5230\u5B83\u6642\u6703\u662F\u9019\u6A23\u3002' };
}
var NONE = { id: '', title: '\u672A\u5206\u985E' };
var order = [NONE].concat(COLUMNS);
var byId = {};
order.forEach(function (c) { byId[c.id] = { id: c.id, title: c.title, cards: [] }; });
raw.forEach(function (it) {
  if (!it || it.pull_request) return; // \u770B\u677F\u53EA\u653E\u7968\uFF0C\u4E0D\u653E PR
  var labels = Array.isArray(it.labels) ? it.labels : [];
  var names = labels.map(function (l) { return String((l && l.name) || ''); });
  var col = '';
  for (var i = 0; i < names.length; i++) { if (names[i] && byId[names[i]]) { col = names[i]; break; } }
  var idx = 0;
  for (var j = 0; j < order.length; j++) if (order[j].id === col) idx = j;
  // \u524D\u4E00\u6B04\uFF0F\u5F8C\u4E00\u6B04\u7684 id \u7B97\u5728\u9019\u88E1\uFF0C\u524D\u7AEF\u53EA\u7BA1\u300C\u6309\u4E86\u5C31\u628A to \u9001\u56DE\u4F86\u300D\uFF0C\u4E0D\u5FC5\u81EA\u5DF1\u61C2\u6B04\u4F4D\u9806\u5E8F\u3002
  // \u300C\u672A\u5206\u985E\u300D\u4E0D\u662F\u9000\u56DE\u53BB\u7684\u76EE\u6A19\uFF08\u5B83\u662F\u300C\u6C92\u6709 s/* \u6A19\u7C64\u300D\u7684\u6A23\u5B50\uFF09\uFF1A\u7B2C\u4E00\u500B\u771F\u6B04\u4F4D\u6C92\u6709\u300C\u524D\u4E00\u6B04\u300D\u3002
  var prev = idx > 1 ? order[idx - 1].id : '';
  var next = idx + 1 < order.length ? order[idx + 1].id : '';
  var meta = ['#' + it.number];
  if (it.assignee && it.assignee.login) meta.push(it.assignee.login);
  if (names.indexOf('Human') >= 0) meta.push('Human');
  if (it.milestone && it.milestone.title) meta.push(it.milestone.title);
  byId[col].cards.push({
    number: it.number,
    title: String(it.title || ''),
    meta: meta.join(' \u30FB '),
    prev: prev,
    next: next,
    updated: String(it.updated_at || ''),
  });
});
var columns = [];
var total = 0;
order.forEach(function (c) {
  var b = byId[c.id];
  if (c.id === '' && b.cards.length === 0) return; // \u6C92\u6709\u672A\u5206\u985E\u7684\u7968\u5C31\u4E0D\u986F\u793A\u90A3\u4E00\u6B04
  b.cards.sort(function (a, z) { return a.updated < z.updated ? 1 : (a.updated > z.updated ? -1 : 0); });
  total += b.cards.length;
  // \u6A19\u984C\u8207\u6578\u5B57\u4E4B\u9593\u7528\u4E0D\u63DB\u884C\u7A7A\u767D\uFF08\\u00A0\uFF09\uFF1A\u6B04\u5BEC\u7531\u5167\u5BB9\u6490\u958B\uFF0C\u7A7A\u6B04\u4E0D\u80FD\u7A84\u5230\u6A19\u984C\u88AB\u6298\u6210\u76F4\u6392\u3002
  columns.push({ id: b.id, title: b.title + '\\u00A0(' + b.cards.length + ')', count: b.cards.length, hint: b.cards.length ? '' : '\u76EE\u524D\u6C92\u6709\u7968', cards: b.cards });
});
return { success: true, repo: input.repo, total: total, truncated: raw.length >= 50, columns: columns };
`,
              input: {
                repo: "{{prep.data.repo}}",
                issues_raw: "{{fetch.data}}"
              },
              limits: {
                timeout_ms: 5e3,
                max_output_bytes: 524288
              }
            }
          }
        ],
        edges: [
          {
            from: "input",
            to: "prep",
            type: "ON_SUCCESS"
          },
          {
            from: "prep",
            to: "fetch",
            type: "ON_SUCCESS"
          },
          {
            from: "fetch",
            to: "shape",
            type: "ON_SUCCESS"
          }
        ]
      }
    },
    {
      name: "move_card",
      description: "\u628A\u4E00\u5F35\u7968\u7684\u72C0\u614B\u6A19\u7C64\u63DB\u6210\u6307\u5B9A\u7684\u90A3\u4E00\u6B04\uFF08\u4FDD\u7559\u5176\u4ED6\u6A19\u7C64\uFF09\u3002\u6539\u7684\u662F Gitea \u4E0A\u90A3\u5F35\u7968\uFF0C\u770B\u677F\u672C\u8EAB\u4E0D\u5B58\u4EFB\u4F55\u6771\u897F\u3002",
      graph: {
        id: "kanban__move_card",
        name: "kanban__move_card",
        nodes: [
          {
            id: "input",
            type: "Input",
            componentId: "input",
            label: "input"
          },
          {
            id: "prep",
            type: "Component",
            componentId: "code",
            label: "prep",
            data: {
              code: `function ph(v) { v = String(v == null ? '' : v).trim(); return /^\\{\\{[^{}]*\\}\\}$/.test(v) ? '' : v; }
var repo = ph(input.repo) || 'inkstone/InkStoneCo';
if (!/^[A-Za-z0-9_.-]+\\/[A-Za-z0-9_.-]+$/.test(repo) || repo.indexOf('..') >= 0) {
  return { success: false, error: 'repo \u683C\u5F0F\u8981\u662F\u300C\u7D44\u7E54/\u5009\u5EAB\u300D\uFF08\u6536\u5230\uFF1A' + repo.slice(0, 60) + '\uFF09' };
}
var OWNERS = ["inkstone"];
if (OWNERS.indexOf(repo.split('/')[0]) < 0) {
  return { success: false, error: '\u9019\u500B\u770B\u677F\u53EA\u52D5 ' + OWNERS.join('\u3001') + ' \u5E95\u4E0B\u7684 repo\uFF08\u6536\u5230\uFF1A' + repo + '\uFF09' };
}
var n = Number(ph(input.number));
if (!isFinite(n) || n < 1 || Math.floor(n) !== n) return { success: false, error: 'number \u8981\u662F\u7968\u865F\uFF08\u6B63\u6574\u6578\uFF09' };
var COLUMNS = [{"id":"s/triage","title":"\u65B0\u9032\u4F86"},{"id":"s/backlog","title":"\u5F85\u6392"},{"id":"s/todo","title":"\u5F85\u9818"},{"id":"s/doing","title":"\u9032\u884C\u4E2D"},{"id":"s/pending","title":"\u5361\u4F4F"},{"id":"s/review","title":"\u5F85\u5BE9"},{"id":"s/stage","title":"\u5F85\u9A57\u6536"}];
var to = ph(input.to);
var ok = false;
COLUMNS.forEach(function (c) { if (c.id === to) ok = true; });
if (!ok) return { success: false, error: '\u76EE\u6A19\u6B04\u4F4D\u4E0D\u5B58\u5728\uFF1A' + to.slice(0, 40) };
return { success: true, repo: repo, number: n, to: to };
`,
              input: {
                repo: "{{input.repo}}",
                number: "{{input.number}}",
                to: "{{input.to}}"
              },
              limits: {
                timeout_ms: 2e3,
                max_output_bytes: 65536
              }
            }
          },
          {
            id: "fetch_issue",
            type: "Component",
            componentId: "gitea_read",
            label: "fetch_issue",
            data: {
              _path: "/repos/{{prep.data.repo}}/issues/{{prep.data.number}}",
              gitea_token: "{{credential.gitea_token}}"
            }
          },
          {
            id: "plan",
            type: "Component",
            componentId: "code",
            label: "plan",
            data: {
              code: "// \u7B97\u51FA\u9019\u5F35\u7968\u65B0\u7684\u6574\u7D44\u6A19\u7C64\uFF1A\u4FDD\u7559\u6240\u6709\u300C\u4E0D\u662F\u72C0\u614B\u300D\u7684\u6A19\u7C64\uFF0C\u628A\u72C0\u614B\u6A19\u7C64\uFF08s/ \u958B\u982D\uFF09\u63DB\u6210\u76EE\u6A19\u90A3\u4E00\u500B\u3002\n// \u72C0\u614B\u6A19\u7C64\u5728\u9019\u500B repo \u662F\u4E92\u65A5\u7684\uFF08exclusive\uFF09\uFF0C\u6240\u4EE5\u63DB\u6210\u4E00\u500B\u3001\u4E0D\u662F\u52A0\u4E00\u500B\u3002\nvar raw = input.issue_raw;\nif (typeof raw === 'string') { try { raw = JSON.parse(raw); } catch (e) { raw = null; } }\nif (!raw || typeof raw !== 'object' || Array.isArray(raw) || !Array.isArray(raw.labels)) {\n  return { success: false, error: 'Gitea \u6C92\u6709\u56DE\u9019\u5F35\u7968\uFF08#' + input.number + '\uFF09\u7684\u5167\u5BB9\u3002\u7968\u865F\u4E0D\u5C0D\u3001\u6216\u91D1\u9470\u770B\u4E0D\u5230\u9019\u500B repo\u3002' };\n}\nif (raw.pull_request) return { success: false, error: '#' + input.number + ' \u662F PR \u4E0D\u662F\u7968\uFF0C\u770B\u677F\u4E0D\u52D5\u5B83' };\nvar keep = [];\nraw.labels.forEach(function (l) {\n  var name = String((l && l.name) || '');\n  if (name && name.indexOf('s/') !== 0) keep.push(name);\n});\nvar labels = keep.concat([input.to]);\nreturn { success: true, labels: labels, number: input.number };\n",
              input: {
                issue_raw: "{{fetch_issue.data}}",
                number: "{{prep.data.number}}",
                to: "{{prep.data.to}}"
              },
              limits: {
                timeout_ms: 2e3,
                max_output_bytes: 65536
              }
            }
          },
          {
            id: "put_labels",
            type: "Component",
            componentId: "gitea_issue_labels",
            label: "put_labels",
            data: {
              _path: "/{{prep.data.repo}}/issues/{{prep.data.number}}/labels",
              labels: "{{plan.data.labels}}",
              gitea_token: "{{credential.gitea_token}}"
            }
          },
          {
            id: "done",
            type: "Component",
            componentId: "code",
            label: "done",
            data: {
              code: "return { success: true, repo: input.repo, number: input.number, to: input.to };\n",
              input: {
                repo: "{{prep.data.repo}}",
                number: "{{prep.data.number}}",
                to: "{{prep.data.to}}"
              },
              limits: {
                timeout_ms: 2e3,
                max_output_bytes: 65536
              }
            }
          }
        ],
        edges: [
          {
            from: "input",
            to: "prep",
            type: "ON_SUCCESS"
          },
          {
            from: "prep",
            to: "fetch_issue",
            type: "ON_SUCCESS"
          },
          {
            from: "fetch_issue",
            to: "plan",
            type: "ON_SUCCESS"
          },
          {
            from: "plan",
            to: "put_labels",
            type: "ON_SUCCESS"
          },
          {
            from: "put_labels",
            to: "done",
            type: "ON_SUCCESS"
          }
        ]
      }
    }
  ],
  ui: {
    html: `<!doctype html>
<html lang="zh-Hant">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>\u7968\u770B\u677F</title>
<!--
  \u7968\u770B\u677F App \u524D\u7AEF\uFF08inkstone/InkStoneCo#18\uFF09

  \u770B\u677F\u4E0D\u64C1\u6709\u81EA\u5DF1\u7684\u8CC7\u6599\u2014\u2014\u5B83\u53EA\u662F Gitea \u7968\u7684\u6295\u5F71\uFF1A
    \xB7 \u6B04\u4F4D \uFF1D \u7968\u4E0A\u7684 s/* \u72C0\u614B\u6A19\u7C64\uFF08\u4E92\u65A5\uFF09
    \xB7 \u8B80   \uFF1D \u52D5\u4F5C board      \u2192 \u5DE5\u4F5C\u6D41\u8B80 Gitea \u7968\u3001\u4F9D\u6A19\u7C64\u5206\u6B04
    \xB7 \u79FB\u52D5 \uFF1D \u52D5\u4F5C move_card  \u2192 \u5DE5\u4F5C\u6D41\u628A\u90A3\u5F35\u7968\u7684 s/* \u6A19\u7C64\u63DB\u6210\u76EE\u6A19\u6B04
  \u55AE\u4E00\u4E8B\u5BE6\u4F86\u6E90\u6C38\u9060\u662F Gitea\uFF1A\u770B\u677F\u58DE\u6389\u3001\u63DB\u6389\u3001\u91CD\u5BEB\u90FD\u4E0D\u6703\u6709\u300C\u5169\u4EFD\u8CC7\u6599\u6F02\u958B\u300D\u3002

  \u756B\u9762\u672C\u8EAB\u7531 A2UI \u524D\u7AEF\u96F6\u4EF6\uFF08Column\uFF0FRow\uFF0FList\uFF0FCard\uFF0FText\uFF0FButton\uFF0C\u76EE\u9304 arcrun:catalog/v0\uFF09\u5BA3\u544A\u7D44\u6210\uFF0C
  Portal \u7684\u6E32\u67D3\u5668 window.ArcrunA2UI \u756B\u5B83\uFF1B\u9019\u652F\u9801\u9762\u53EA\u505A\u4E09\u4EF6\u4E8B\uFF1A\u6253\u52D5\u4F5C\u3001\u628A\u56DE\u61C9\u6574\u5F62\u6210\u96F6\u4EF6\u8981\u7684\u8CC7\u6599\u3001
  \u63A5\u6309\u9215\u4E8B\u4EF6\u3002\u{1F534} \u4E0D\u5BEB\u7DB2\u5740\u3001\u4E0D\u78B0\u91D1\u9470\u3001\u4E0D\u77E5\u9053\u79DF\u6236\u2014\u2014\u552F\u4E00\u7684\u901A\u9053\u662F window.arcrunApp.action\u3002

  v0 \u6C92\u505A\u7684\uFF08\u8AA0\u5BE6\u5217\u51FA\uFF0C\u4E0D\u5047\u88DD\uFF09\uFF1A
    \xB7 \u62D6\u653E\uFF08A2UI \u76EE\u9304\u6C92\u6709\u62D6\u653E\u5143\u4EF6\uFF09\u2192 \u7528\u300C\u25C0 \u25B6\u300D\u628A\u7968\u79FB\u5230\u524D\u4E00\u6B04\uFF0F\u5F8C\u4E00\u6B04
    \xB7 \u6B04\u5167\u9806\u5E8F\uFF08Gitea \u5B58\u4E0D\u4E86\uFF1B\u898F\u683C #136 \u6D1E 3 \u9084\u6C92\u6709\u300CApp \u79C1\u6709\u5C0F\u72C0\u614B\u300D\u7684\u4F4D\u7F6E\uFF09\u2192 \u4E00\u5F8B\u6700\u8FD1\u66F4\u65B0\u7684\u5728\u4E0A\u9762
    \xB7 \u5373\u6642\u63A8\u9001\uFF08#138 v0 \u4E0D\u505A\uFF09\u2192 \u7528\u300C\u91CD\u65B0\u6574\u7406\u300D
-->
<style>
  .kb-bar { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; margin: 0 0 10px; }
  .kb-bar input { flex: 1 1 220px; min-width: 0; padding: 8px 10px; font: inherit; }
  .kb-status { font-size: 13.5px; min-height: 1.4em; margin: 0 0 8px; }
  .kb-status.bad { color: #b3261e; white-space: pre-wrap; }
  .kb-board { overflow-x: auto; padding-bottom: 8px; }
</style>
</head>
<body>
<div class="kb-bar">
  <input id="kb-repo" type="text" value="inkstone/InkStoneCo" aria-label="\u8981\u770B\u54EA\u500B repo \u7684\u7968\uFF08\u7D44\u7E54/\u5009\u5EAB\uFF09" spellcheck="false" autocapitalize="off" />
  <button id="kb-load" class="btn3" type="button">\u91CD\u65B0\u6574\u7406</button>
</div>
<div id="kb-status" class="kb-status" role="status">\u8F09\u5165\u4E2D\u2026</div>
<div id="kb-board" class="kb-board"></div>

<script>
(function () {
  var COMPONENTS = [
    { id: 'root', component: 'List', direction: 'horizontal', children: { componentId: 'col', path: '/columns' } },
    { id: 'col', component: 'Card', child: 'col-body' },
    { id: 'col-body', component: 'Column', children: ['col-head', 'col-hint', 'col-cards'] },
    { id: 'col-head', component: 'Text', text: { path: 'title' }, variant: 'h4' },
    { id: 'col-hint', component: 'Text', text: { path: 'hint' }, variant: 'caption' },
    { id: 'col-cards', component: 'List', children: { componentId: 'card', path: 'cards' } },
    { id: 'card', component: 'Card', child: 'card-body' },
    { id: 'card-body', component: 'Column', children: ['card-title', 'card-meta', 'card-btns'] },
    { id: 'card-title', component: 'Text', text: { path: 'title' }, variant: 'body' },
    { id: 'card-meta', component: 'Text', text: { path: 'meta' }, variant: 'caption' },
    { id: 'card-btns', component: 'Row', children: ['btn-prev', 'btn-next'], justify: 'spaceBetween' },
    { id: 'btn-prev', component: 'Button', child: 'btn-prev-l', action: { event: { name: 'move', context: { number: { path: 'number' }, to: { path: 'prev' } } } } },
    { id: 'btn-prev-l', component: 'Text', text: '\u25C0' },
    { id: 'btn-next', component: 'Button', child: 'btn-next-l', action: { event: { name: 'move', context: { number: { path: 'number' }, to: { path: 'next' } } } } },
    { id: 'btn-next-l', component: 'Text', text: '\u25B6' }
  ];

  var statusEl = document.getElementById('kb-status');
  var repoEl = document.getElementById('kb-repo');
  var boardEl = document.getElementById('kb-board');
  var loadBtn = document.getElementById('kb-load');
  var handle = null;
  var busy = false;

  try { var saved = window.localStorage.getItem('kanban:repo'); if (saved) repoEl.value = saved; } catch (e) { /* \u6C92\u6709\u5132\u5B58\u7A7A\u9593\u5C31\u7528\u9810\u8A2D */ }

  function say(msg, bad) {
    statusEl.textContent = msg || '';
    statusEl.className = 'kb-status' + (bad ? ' bad' : '');
  }

  // \u52D5\u4F5C\u56DE\u61C9\u7684\u5F62\u72C0\uFF1A{ok,status,d}\uFF0Cd\uFF1D{ok:true,result:<\u5DE5\u4F5C\u6D41\u6700\u5F8C\u4E00\u500B\u7BC0\u9EDE\u7684\u8F38\u51FA>} \u6216 {error}\u3002
  // result \u53EF\u80FD\u662F {success,\u2026\u6B04\u4F4D} \u6216 {success,data:{\u2026\u6B04\u4F4D}}\uFF08\u770B\u7BC0\u9EDE\u600E\u9EBC\u5305\uFF09\uFF0C\u5169\u7A2E\u90FD\u8A8D\u3002
  function unwrap(x) {
    if (!x || !x.ok || !x.d || !x.d.ok) {
      var err = (x && x.d && x.d.error) || ('HTTP ' + (x && x.status));
      return { error: hint(String(err)) };
    }
    var r = x.d.result;
    if (r && typeof r === 'object' && r.data && typeof r.data === 'object' && !Array.isArray(r.data) && r.columns === undefined && r.number === undefined) r = r.data;
    if (r && r.success === false) return { error: hint(String(r.error || '\u5DE5\u4F5C\u6D41\u56DE\u5831\u5931\u6557')) };
    return { data: r };
  }

  // \u5931\u6557\u8981\u8AAA\u5F97\u51FA\u4E0B\u4E00\u6B65\uFF08\u4E0D\u662F\u53EA\u4E1F\u4E00\u4E32\u6280\u8853\u5B57\uFF09\u3002
  function hint(err) {
    if (/credential/i.test(err) && /gitea_token/.test(err)) {
      return err + '\\n\u2192 \u9019\u500B\u5BE6\u4F8B\u9084\u6C92\u6709\u300Cgitea_token\u300D\u9019\u628A\u91D1\u9470\u3002\u8ACB\u7BA1\u7406\u54E1\u5230\u300C\u7BA1\u7406 \u2192 \u91D1\u9470\u7BA1\u7406\u300D\u65B0\u589E\u4E00\u628A\u540D\u5B57\u53EB gitea_token \u7684\u91D1\u9470\uFF08\u503C\u662F\u6709\u8B80\u5BEB\u7968\u6B0A\u9650\u7684 Gitea \u5E33\u865F token\uFF09\u3002';
    }
    if (/recipe/i.test(err) && /(gitea_read|gitea_issue_labels)/.test(err)) {
      return err + '\\n\u2192 \u9019\u500B\u5BE6\u4F8B\u9084\u7F3A\u8B80\u5BEB Gitea \u7684 recipe\u3002\u8ACB\u7BA1\u7406\u54E1\u5230\u300CApp \u5E02\u96C6\u300D\u5C0D\u300C\u7968\u770B\u677F\u300D\u518D\u6309\u4E00\u6B21\u5B89\u88DD\uFF0C\u6703\u81EA\u52D5\u88DC\u9F4A\u3002';
    }
    return err;
  }

  function render(data) {
    if (!window.ArcrunA2UI) {
      say('\u756B\u9762\u5143\u4EF6\u6E32\u67D3\u5668\u6C92\u6709\u8F09\u5165\uFF08/portal/a2ui/arcrun-a2ui.js\uFF09\uFF0C\u8ACB\u91CD\u65B0\u6574\u7406\uFF1B\u4ECD\u5931\u6557\u8ACB\u56DE\u5831\u3002', true);
      return;
    }
    var model = { columns: data.columns || [] };
    if (!handle) {
      handle = window.ArcrunA2UI.mount(boardEl, { surfaceId: 'kanban', components: COMPONENTS, data: model }, { onAction: onAction });
    } else {
      handle.update(model);
    }
  }

  function load() {
    if (busy) return Promise.resolve();
    var repo = String(repoEl.value || '').trim();
    busy = true; loadBtn.disabled = true;
    say('\u8B80\u53D6 ' + repo + ' \u7684\u7968\u2026');
    return window.arcrunApp.action('board', { repo: repo }).then(function (x) {
      var u = unwrap(x);
      if (u.error) { say('\u8B80\u4E0D\u5230\u7968\uFF1A' + u.error, true); return; }
      try { window.localStorage.setItem('kanban:repo', repo); } catch (e) { /* \u8A18\u4E0D\u4F4F\u5C31\u7B97\u4E86 */ }
      render(u.data);
      var n = u.data.total || 0;
      say(n === 0 ? '\u9019\u500B repo \u6C92\u6709\u958B\u8457\u7684\u7968\u3002' : ('\u5171 ' + n + ' \u5F35\u958B\u8457\u7684\u7968' + (u.data.truncated ? '\uFF08\u53EA\u8B80\u4E86\u6700\u8FD1\u66F4\u65B0\u7684 50 \u5F35\uFF09' : '') + '\u3002\u25C0 \u25B6 \u628A\u7968\u79FB\u5230\u524D\u4E00\u6B04\uFF0F\u5F8C\u4E00\u6B04\u3002'));
    }).catch(function (e) {
      say('\u8ACB\u6C42\u5931\u6557\uFF1A' + (e && e.message ? e.message : e), true);
    }).then(function () { busy = false; loadBtn.disabled = false; });
  }

  function onAction(a) {
    var name = a && (a.name || (a.event && a.event.name));
    var ctx = (a && (a.context || (a.event && a.event.context))) || {};
    if (name !== 'move') return;
    if (busy) return;
    var to = String(ctx.to == null ? '' : ctx.to);
    var number = ctx.number;
    if (!to) { say('\u9019\u5F35\u7968\u5DF2\u7D93\u5728\u6700\u524D\u9762\uFF0F\u6700\u5F8C\u9762\u4E00\u6B04\uFF0C\u6C92\u6709\u5730\u65B9\u53EF\u4EE5\u518D\u79FB\u3002'); return; }
    var repo = String(repoEl.value || '').trim();
    busy = true; loadBtn.disabled = true;
    say('\u628A #' + number + ' \u79FB\u5230 ' + to + '\u2026');
    window.arcrunApp.action('move_card', { repo: repo, number: number, to: to }).then(function (x) {
      var u = unwrap(x);
      busy = false; loadBtn.disabled = false;
      if (u.error) { say('\u79FB\u52D5\u5931\u6557\uFF08\u7968\u6C92\u6709\u88AB\u6539\uFF09\uFF1A' + u.error, true); return; }
      return load();
    }).catch(function (e) {
      busy = false; loadBtn.disabled = false;
      say('\u8ACB\u6C42\u5931\u6557\uFF1A' + (e && e.message ? e.message : e), true);
    });
  }

  loadBtn.addEventListener('click', load);
  repoEl.addEventListener('keydown', function (e) { if (e.key === 'Enter') load(); });
  load();
})();
<\/script>
</body>
</html>
`,
    style: "inherit"
  },
  actions: [
    "board",
    "move_card"
  ]
};

// cypher-executor/src/lib/app-system.ts
init_kbdb_proxy();
init_webhook_handlers();

// cypher-executor/src/lib/app-ui-assets.ts
var MAX_UI_ASSET_BYTES = 15e5;
var MAX_UI_ASSET_COUNT = 64;
var PATH_RE = /^[A-Za-z0-9._-]+(?:\/[A-Za-z0-9._-]+)*$/;
var MIME_BY_EXT = {
  css: "text/css",
  js: "text/javascript",
  mjs: "text/javascript",
  json: "application/json",
  txt: "text/plain",
  svg: "image/svg+xml",
  html: "text/html",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  webp: "image/webp",
  ico: "image/x-icon",
  avif: "image/avif",
  woff: "font/woff",
  woff2: "font/woff2",
  ttf: "font/ttf",
  otf: "font/otf"
};
function extOf(path) {
  const base = path.slice(path.lastIndexOf("/") + 1);
  const i = base.lastIndexOf(".");
  return i < 0 ? "" : base.slice(i + 1).toLowerCase();
}
function localRefOf(ref, fromDir = "") {
  let v = ref.trim();
  if (!v) return null;
  if (v.startsWith("#") || v.startsWith("/") || v.startsWith("\\")) return null;
  if (/^[a-z][a-z0-9+.-]*:/i.test(v)) return null;
  v = v.replace(/[?#].*$/, "");
  const parts = (fromDir ? `${fromDir}/${v}` : v).split("/");
  const out = [];
  for (const seg of parts) {
    if (seg === "" || seg === ".") continue;
    if (seg === "..") {
      if (out.length === 0) return null;
      out.pop();
      continue;
    }
    out.push(seg);
  }
  return out.length ? out.join("/") : null;
}
function isAssetValue(v) {
  if (typeof v === "string") return true;
  return !!v && typeof v === "object" && typeof v.base64 === "string";
}
function validateUiAssets(assets) {
  if (assets === void 0) return [];
  if (!assets || typeof assets !== "object" || Array.isArray(assets)) {
    return ["ui.assets \u5FC5\u9808\u662F\u7269\u4EF6\uFF08\u8DEF\u5F91 \u2192 \u5167\u5BB9\uFF09"];
  }
  const errors = [];
  const entries = Object.entries(assets);
  if (entries.length > MAX_UI_ASSET_COUNT) errors.push(`ui.assets \u6700\u591A ${MAX_UI_ASSET_COUNT} \u500B\u6A94\uFF08\u73FE\u5728 ${entries.length}\uFF09`);
  let total = 0;
  for (const [path, val] of entries) {
    if (!PATH_RE.test(path) || path.split("/").includes("..")) {
      errors.push(`ui.assets \u7684\u8DEF\u5F91\u300C${path}\u300D\u4E0D\u5408\u6CD5\uFF1A\u53EA\u80FD\u662F\u76F8\u5C0D\u8DEF\u5F91\uFF08\u82F1\u6578\u3001\u9EDE\u3001\u5E95\u7DDA\u3001\u9023\u5B57\u865F\uFF0C\u7528 / \u5206\u8CC7\u6599\u593E\uFF09\uFF0C\u4E0D\u53EF\u542B ..`);
      continue;
    }
    if (!isAssetValue(val)) {
      errors.push(`ui.assets["${path}"] \u5FC5\u9808\u662F\u5B57\u4E32\uFF08\u6587\u5B57\u6A94\uFF09\uFF0C\u6216 { "base64": "\u2026", "type": "image/png" }\uFF08\u4E8C\u9032\u4F4D\u6A94\uFF09`);
      continue;
    }
    if (typeof val === "object" && val.type !== void 0 && (typeof val.type !== "string" || !/^[a-z]+\/[A-Za-z0-9.+-]+$/.test(val.type))) {
      errors.push(`ui.assets["${path}"].type \u5FC5\u9808\u662F MIME \u683C\u5F0F\uFF08\u4F8B\uFF1Aimage/png\uFF09`);
    }
    total += typeof val === "string" ? val.length : val.base64.length;
  }
  if (total > MAX_UI_ASSET_BYTES) {
    errors.push(`ui.assets \u5408\u8A08 ${total} \u5B57\u5143\uFF0C\u8D85\u904E\u4E0A\u9650 ${MAX_UI_ASSET_BYTES}\u3002\u756B\u9762\u5B58\u5728\u77E5\u8B58\u5EAB\u7684\u4E00\u7B46\u7D00\u9304\u88E1\uFF0C\u4E0D\u662F\u6A94\u6848\u4F3A\u670D\u5668\u2014\u2014\u5927\u5716\u8ACB\u7E2E\u5C0F\u6216\u63DB\u6210\u5916\u90E8\u4E0D\u4F9D\u8CF4\u7684\u683C\u5F0F`);
  }
  return errors;
}
function mimeOf(path, val) {
  if (typeof val === "object" && val.type) return val.type;
  return MIME_BY_EXT[extOf(path)] ?? "application/octet-stream";
}
function toDataUri(path, val) {
  const mime = mimeOf(path, val);
  if (typeof val === "string") return `data:${mime};charset=utf-8,${encodeURIComponent(val)}`;
  return `data:${mime};base64,${val.base64.replace(/\s+/g, "")}`;
}
function textOf(path, val) {
  if (typeof val === "string") return val;
  void path;
  return null;
}
function inlineCssUrls(css, cssPath, assets, used, errors) {
  const dir = cssPath.includes("/") ? cssPath.slice(0, cssPath.lastIndexOf("/")) : "";
  return css.replace(/url\(\s*(['"]?)([^'")]+)\1\s*\)/gi, (whole, _q, ref) => {
    const key = localRefOf(ref, dir);
    if (key === null) return whole;
    if (!(key in assets)) {
      errors.push(`\u6A23\u5F0F\u8868\u300C${cssPath}\u300D\u5F15\u7528\u4E86 url(${ref.trim()})\uFF0C\u4F46 ui.assets \u88E1\u6C92\u6709\u300C${key}\u300D`);
      return whole;
    }
    used.add(key);
    return `url("${toDataUri(key, assets[key])}")`;
  });
}
var ATTR_RE = (name) => new RegExp(`(\\s${name}\\s*=\\s*)(?:"([^"]*)"|'([^']*)')`, "i");
function bundleUiAssets(html, assets) {
  if (!assets || Object.keys(assets).length === 0) return { ok: true, html, errors: [], used: [] };
  const errors = [];
  const used = /* @__PURE__ */ new Set();
  const lookup = (ref, what) => {
    const key = localRefOf(ref);
    if (key === null) return null;
    if (!(key in assets)) {
      errors.push(`${what} \u5F15\u7528\u4E86\u300C${ref.trim()}\u300D\uFF0C\u4F46 ui.assets \u88E1\u6C92\u6709\u300C${key}\u300D`);
      return null;
    }
    used.add(key);
    return key;
  };
  const out = html.replace(/<(script|link|img|source|video|audio|track|input)\b([^>]*?)(\/?)>(?:\s*<\/script\s*>)?/gi, (whole, tagRaw, attrs, selfClose) => {
    const tag = tagRaw.toLowerCase();
    if (tag === "script") {
      const m = ATTR_RE("src").exec(attrs);
      if (!m) return whole;
      const ref = m[2] ?? m[3] ?? "";
      const key = lookup(ref, "<script src>");
      if (key === null) return whole;
      const body = textOf(key, assets[key]);
      if (body === null) {
        errors.push(`<script src="${ref}"> \u6307\u5230\u4E8C\u9032\u4F4D\u8CC7\u7522\u300C${key}\u300D\uFF0C\u8173\u672C\u5FC5\u9808\u662F\u6587\u5B57\u6A94`);
        return whole;
      }
      const rest = attrs.replace(ATTR_RE("src"), "").replace(/\s+$/, "");
      return `<script${rest}>${body.replace(/<\/script/gi, "<\\/script")}<\/script>`;
    }
    if (tag === "link") {
      const relM = ATTR_RE("rel").exec(attrs);
      const hrefM = ATTR_RE("href").exec(attrs);
      if (!hrefM) return whole;
      const ref = hrefM[2] ?? hrefM[3] ?? "";
      const isSheet = /(^|\s)stylesheet(\s|$)/i.test(relM ? relM[2] ?? relM[3] ?? "" : "");
      const key = lookup(ref, isSheet ? '<link rel="stylesheet">' : "<link href>");
      if (key === null) return whole;
      if (isSheet) {
        const css = textOf(key, assets[key]);
        if (css === null) {
          errors.push(`<link rel="stylesheet" href="${ref}"> \u6307\u5230\u4E8C\u9032\u4F4D\u8CC7\u7522\u300C${key}\u300D\uFF0C\u6A23\u5F0F\u8868\u5FC5\u9808\u662F\u6587\u5B57\u6A94`);
          return whole;
        }
        return `<style>${inlineCssUrls(css, key, assets, used, errors).replace(/<\/style/gi, "<\\/style")}</style>`;
      }
      return whole.replace(ATTR_RE("href"), (_w, pre) => `${pre}"${toDataUri(key, assets[key])}"`);
    }
    let replaced = whole;
    for (const name of tag === "video" ? ["src", "poster"] : ["src"]) {
      const m = ATTR_RE(name).exec(replaced);
      if (!m) continue;
      const ref = m[2] ?? m[3] ?? "";
      const key = lookup(ref, `<${tag} ${name}>`);
      if (key === null) continue;
      replaced = replaced.replace(ATTR_RE(name), (_w, pre) => `${pre}"${toDataUri(key, assets[key])}"`);
    }
    void selfClose;
    return replaced;
  });
  return { ok: errors.length === 0, html: out, errors, used: [...used] };
}

// cypher-executor/src/lib/app-system.ts
init_recipes();
init_credentials();
function appStore(env) {
  return env.WEBHOOKS;
}
function kbdbBehindHint(e) {
  const msg = e instanceof Error ? `${e.name}: ${e.message}` : String(e);
  if (!msg.includes("KbdbUnavailable")) return null;
  return "\u9019\u53F0\u5BE6\u4F8B\u7684\u77E5\u8B58\u5EAB\uFF08KBDB\uFF09\u6C92\u6709\u56DE\u61C9\uFF0C\u6216\u5B83\u7684\u7248\u672C\u6BD4\u76EE\u524D\u7684\u7A0B\u5F0F\u78BC\u820A\u2014\u2014\u5B89\u88DD\u9700\u8981\u77E5\u8B58\u5EAB\u63D0\u4F9B\u300C\u540C\u4E00\u4EFD\u8CC7\u7522\u6C38\u9060\u540C\u4E00\u5217\u300D\u7684\u5BEB\u5165\u80FD\u529B\u3002\u8ACB\u7BA1\u7406\u8005\u628A\u77E5\u8B58\u5EAB\u4E00\u8D77\u66F4\u65B0\u5230\u540C\u4E00\u7248\uFF1B\u5728\u90A3\u4E4B\u524D**\u5DF2\u7D93\u88DD\u597D\u7684 App \u4E0D\u53D7\u5F71\u97FF**\uFF0C\u7167\u5E38\u53EF\u7528\u3002";
}
var APP_WORKFLOW_TRIGGERS = ["manual", "schedule", "event"];
function resolveWorkflowTrigger(wf) {
  if (typeof wf.trigger === "string" && APP_WORKFLOW_TRIGGERS.includes(wf.trigger)) {
    return wf.trigger;
  }
  return extractCronExpr(wf.graph) ? "schedule" : "manual";
}
function normalizeRequiredCredentials(requires) {
  return (requires?.credentials ?? []).map((c) => typeof c === "string" ? { name: c } : { name: c.name, ...c.purpose ? { purpose: c.purpose } : {} });
}
var APP_UI_STYLES = ["inherit", "own"];
var DEFAULT_APP_UI_STYLE = "inherit";
var ID_RE = /^[a-z][a-z0-9_-]{0,63}$/;
function validateAppDeclaration(raw2) {
  const errors = [];
  if (!raw2 || typeof raw2 !== "object" || Array.isArray(raw2)) {
    return { ok: false, errors: ["\u5BA3\u544A\u5FC5\u9808\u662F\u4E00\u500B JSON \u7269\u4EF6"] };
  }
  const d = raw2;
  if (typeof d.id !== "string" || !ID_RE.test(d.id)) {
    errors.push("id \u5FC5\u586B\uFF0C\u4E14\u53EA\u80FD\u662F\u5C0F\u5BEB\u82F1\u6578\u5B57/\u5E95\u7DDA/\u9023\u5B57\u865F\uFF0C\u958B\u982D\u9808\u70BA\u5B57\u6BCD\uFF08\u226464 \u5B57\uFF09");
  }
  if (typeof d.name !== "string" || d.name.trim() === "") {
    errors.push("name \u5FC5\u586B\uFF0C\u4E0D\u53EF\u7A7A\u5B57\u4E32");
  }
  const hasWorkflows = Array.isArray(d.workflows) && d.workflows.length > 0;
  const hasUi = d.ui && typeof d.ui === "object" && typeof d.ui.html === "string" && d.ui.html.trim() !== "";
  if (!hasWorkflows && !hasUi) {
    errors.push("workflows \u6216 ui \u81F3\u5C11\u8981\u6709\u4E00\u500B\uFF08\u6C92\u6709\u756B\u9762\u4E5F\u6C92\u6709\u5DE5\u4F5C\u6D41\u7684 App \u4E0D\u6210\u7ACB\uFF0Cdesign \xA7\u4E8C\uFF09");
  }
  if (d.workflows !== void 0) {
    if (!Array.isArray(d.workflows)) {
      errors.push("workflows \u5FC5\u9808\u662F\u9663\u5217");
    } else {
      d.workflows.forEach((w, i) => {
        if (!w || typeof w !== "object") {
          errors.push(`workflows[${i}] \u5FC5\u9808\u662F\u7269\u4EF6`);
          return;
        }
        const wf = w;
        if (typeof wf.name !== "string" || wf.name.trim() === "") errors.push(`workflows[${i}].name \u5FC5\u586B`);
        if (!wf.graph || typeof wf.graph !== "object") {
          errors.push(`workflows[${i}].graph \u5FC5\u586B\uFF08\u57F7\u884C\u5716\uFF09`);
        } else {
          const g = wf.graph;
          if (typeof g.id !== "string" || g.id.trim() === "") errors.push(`workflows[${i}].graph.id \u5FC5\u586B`);
          if (typeof g.name !== "string" || g.name.trim() === "") errors.push(`workflows[${i}].graph.name \u5FC5\u586B`);
          if (!Array.isArray(g.nodes)) errors.push(`workflows[${i}].graph.nodes \u5FC5\u9808\u662F\u9663\u5217`);
          if (!Array.isArray(g.edges)) errors.push(`workflows[${i}].graph.edges \u5FC5\u9808\u662F\u9663\u5217`);
        }
        if (wf.trigger !== void 0) {
          const label = typeof wf.name === "string" ? `\u300C${wf.name}\u300D` : `workflows[${i}]`;
          if (typeof wf.trigger !== "string" || !APP_WORKFLOW_TRIGGERS.includes(wf.trigger)) {
            errors.push(`workflows[${i}].trigger \u53EA\u80FD\u662F ${APP_WORKFLOW_TRIGGERS.join("\uFF0F")}\uFF08\u7701\u7565\uFF1D\u770B\u5716\uFF1A\u6709\u6392\u7A0B\u96F6\u4EF6\u662F schedule\uFF0C\u5426\u5247 manual\uFF09`);
          } else {
            const hasCron = Boolean(extractCronExpr(wf.graph));
            if (wf.trigger === "manual" && hasCron) {
              errors.push(`${label} \u5BA3\u544A\u6210\u624B\u52D5\uFF08manual\uFF09\uFF0C\u4F46\u5716\u88E1\u6709\u6392\u7A0B\uFF08cron\uFF09\u96F6\u4EF6\u2014\u2014\u5B83\u6703\u81EA\u5DF1\u7167\u6392\u7A0B\u8DD1\u3002\u62FF\u6389 cron \u96F6\u4EF6\uFF0C\u6216\u6539\u5BA3\u544A schedule`);
            }
            if (wf.trigger === "schedule" && !hasCron) {
              errors.push(`${label} \u5BA3\u544A\u6210\u6392\u7A0B\uFF08schedule\uFF09\uFF0C\u4F46\u5716\u88E1\u6C92\u6709\u6392\u7A0B\uFF08cron\uFF09\u96F6\u4EF6\u2014\u2014\u5B83\u6C38\u9060\u4E0D\u6703\u81EA\u5DF1\u8DD1\u3002\u88DC\u4E0A cron \u96F6\u4EF6\uFF0C\u6216\u6539\u5BA3\u544A manual\uFF0Fevent`);
            }
            if (wf.trigger === "event" && hasCron) {
              errors.push(`${label} \u5BA3\u544A\u6210\u5916\u90E8\u4E8B\u4EF6\uFF08event\uFF09\uFF0C\u4F46\u5716\u88E1\u6709\u6392\u7A0B\uFF08cron\uFF09\u96F6\u4EF6\u2014\u2014\u5169\u7A2E\u555F\u52D5\u65B9\u5F0F\u53EA\u80FD\u9078\u4E00\u7A2E`);
            }
          }
        }
      });
    }
  }
  if (d.ui !== void 0 && !hasUi) {
    errors.push("ui.html \u5FC5\u586B\u4E14\u4E0D\u53EF\u7A7A\uFF08\u6709 ui \u6B04\u4F4D\u5C31\u8981\u6709\u756B\u9762\u5167\u5BB9\uFF09");
  }
  if (d.ui && typeof d.ui === "object") {
    const s = d.ui.style;
    if (s !== void 0 && (typeof s !== "string" || !APP_UI_STYLES.includes(s))) {
      errors.push(`ui.style \u53EA\u80FD\u662F ${APP_UI_STYLES.join(" \u6216 ")}\uFF08\u7701\u7565\uFF1D${DEFAULT_APP_UI_STYLE}\uFF0C\u8DDF\u96A8\u5168\u5C40\uFF09`);
    }
    const ui = d.ui;
    const assetErrors = validateUiAssets(ui.assets);
    errors.push(...assetErrors);
    if (assetErrors.length === 0 && hasUi) {
      errors.push(...bundleUiAssets(ui.html, ui.assets).errors);
    }
  }
  if (d.data !== void 0) {
    if (!Array.isArray(d.data)) {
      errors.push("data \u5FC5\u9808\u662F\u9663\u5217");
    } else {
      d.data.forEach((dt, i) => {
        if (!dt || typeof dt !== "object") {
          errors.push(`data[${i}] \u5FC5\u9808\u662F\u7269\u4EF6`);
          return;
        }
        const decl = dt;
        if (typeof decl.name !== "string" || decl.name.trim() === "") errors.push(`data[${i}].name \u5FC5\u586B`);
        if (!Array.isArray(decl.slots) || decl.slots.some((s) => typeof s !== "string")) {
          errors.push(`data[${i}].slots \u5FC5\u9808\u662F\u5B57\u4E32\u9663\u5217`);
        }
      });
    }
  }
  if (d.requires !== void 0) errors.push(...validateRequires(d.requires));
  if (d.actions !== void 0 && (!Array.isArray(d.actions) || d.actions.some((a) => typeof a !== "string"))) {
    errors.push("actions \u5FC5\u9808\u662F\u5B57\u4E32\u9663\u5217");
  } else if (Array.isArray(d.actions) && Array.isArray(d.workflows)) {
    const wfNames = new Set(
      d.workflows.map((w) => w && typeof w === "object" ? w.name : void 0).filter((n) => typeof n === "string")
    );
    for (const a of d.actions) {
      if (!wfNames.has(a)) {
        errors.push(
          `actions \u88E1\u7684\u300C${a}\u300D\u627E\u4E0D\u5230\u540C\u540D\u7684 workflow\uFF08\u52D5\u4F5C\u540D\u5C31\u662F\u5DE5\u4F5C\u6D41\u672C\u5730\u540D\uFF09\u3002\u9019\u4EFD\u5BA3\u544A\u7684\u5DE5\u4F5C\u6D41\u662F\uFF1A${[...wfNames].join("\uFF0F") || "\uFF08\u4E00\u500B\u90FD\u6C92\u6709\uFF09"}`
        );
      }
    }
  }
  return { ok: errors.length === 0, errors };
}
function validateRequires(raw2) {
  const errors = [];
  if (!raw2 || typeof raw2 !== "object" || Array.isArray(raw2)) return ["requires \u5FC5\u9808\u662F\u7269\u4EF6\uFF08\u53EF\u6709 recipes\u3001credentials \u5169\u6B04\uFF09"];
  const r = raw2;
  for (const k of Object.keys(r)) {
    if (k !== "recipes" && k !== "credentials") errors.push(`requires.${k} \u4E0D\u8A8D\u5F97\uFF08\u53EA\u6709 recipes\u3001credentials\uFF09`);
  }
  if (r.recipes !== void 0) {
    if (!Array.isArray(r.recipes)) errors.push("requires.recipes \u5FC5\u9808\u662F\u9663\u5217");
    else {
      const seen = /* @__PURE__ */ new Set();
      r.recipes.forEach((x, i) => {
        if (!x || typeof x !== "object" || Array.isArray(x)) {
          errors.push(`requires.recipes[${i}] \u5FC5\u9808\u662F\u7269\u4EF6\uFF08recipe \u5168\u6587\uFF09`);
          return;
        }
        const rec = x;
        const cid = typeof rec.canonical_id === "string" ? rec.canonical_id.trim().toLowerCase() : "";
        if (!cid) errors.push(`requires.recipes[${i}].canonical_id \u5FC5\u586B`);
        else if (seen.has(cid)) errors.push(`requires.recipes \u88E1\u300C${cid}\u300D\u91CD\u8907`);
        else seen.add(cid);
        if (typeof rec.endpoint !== "string" || rec.endpoint.trim() === "") errors.push(`requires.recipes[${i}].endpoint \u5FC5\u586B`);
      });
    }
  }
  if (r.credentials !== void 0) {
    if (!Array.isArray(r.credentials)) errors.push("requires.credentials \u5FC5\u9808\u662F\u9663\u5217\uFF08\u91D1\u9470\u7684\u540D\u5B57\uFF09");
    else {
      const seen = /* @__PURE__ */ new Set();
      r.credentials.forEach((x, i) => {
        let name;
        if (typeof x === "string") name = x;
        else if (x && typeof x === "object" && !Array.isArray(x)) {
          const o = x;
          const extra = Object.keys(o).filter((k) => k !== "name" && k !== "purpose");
          if (extra.length > 0) errors.push(`requires.credentials[${i}] \u53EA\u51C6 name\uFF0Fpurpose\uFF0C\u4E0D\u51C6\u6709\u300C${extra.join("\u3001")}\u300D\u2014\u2014\u91D1\u9470\u7684\u503C\u6C38\u9060\u53EA\u7531\u5BE6\u4F8B\u4E3B\u4EBA\u5728\u91D1\u9470\u756B\u9762\u586B\uFF08D36\uFF09`);
          if (o.purpose !== void 0 && typeof o.purpose !== "string") errors.push(`requires.credentials[${i}].purpose \u5FC5\u9808\u662F\u5B57\u4E32`);
          name = o.name;
        } else name = void 0;
        if (!validateName(name)) errors.push(`requires.credentials[${i}] \u7684\u540D\u5B57\u53EA\u80FD\u662F\u82F1\u6578\u5B57\u8207\u5E95\u7DDA\uFF08\u9019\u662F\u91D1\u9470\u7684\u540D\u5B57\uFF0C\u4E0D\u662F\u503C\uFF09`);
        else if (seen.has(name)) errors.push(`requires.credentials \u88E1\u300C${name}\u300D\u91CD\u8907`);
        else seen.add(name);
      });
    }
  }
  return errors;
}
var ICON_SET = ["\u{1F4C4}", "\u{1F5D2}\uFE0F", "\u{1F9E9}", "\u{1F4CC}", "\u{1F527}", "\u{1F4E6}", "\u{1F5C2}\uFE0F", "\u2705", "\u{1F4A1}", "\u{1F514}", "\u{1F4CA}", "\u{1F9ED}"];
function generateIcon(name) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = h * 31 + name.charCodeAt(i) >>> 0;
  return ICON_SET[h % ICON_SET.length];
}
function applyDeclarationDefaults(raw2) {
  const workflows = raw2.workflows ?? [];
  const actions = raw2.actions ?? workflows.filter((w) => resolveWorkflowTrigger(w) === "manual").map((w) => w.name);
  return {
    ...raw2,
    id: raw2.id,
    name: raw2.name,
    icon: raw2.icon ?? generateIcon(raw2.name),
    version: raw2.version ?? "0.0.0",
    workflows,
    data: raw2.data ?? [],
    actions,
    keeps_data: raw2.remove?.keeps_data ?? true
  };
}
var APP_PLACEHOLDERS = ["__NAMESPACE__", "__CYPHER_BASE__"];
function resolveDeclarationPlaceholders(value, coords) {
  const base = coords.cypherBase.replace(/\/+$/, "");
  const swap = (s) => s.split("__NAMESPACE__").join(coords.namespace).split("__CYPHER_BASE__").join(base);
  const walk = (v) => {
    if (typeof v === "string") return swap(v);
    if (Array.isArray(v)) return v.map(walk);
    if (v && typeof v === "object") {
      const out = {};
      for (const [k, val] of Object.entries(v)) out[swap(k)] = walk(val);
      return out;
    }
    return v;
  };
  return walk(value);
}
function remainingPlaceholders(value) {
  const text = JSON.stringify(value) ?? "";
  return APP_PLACEHOLDERS.filter((p) => text.includes(p));
}
async function computeContentHash(raw2) {
  const canonical = canonicalize(raw2);
  const data = new TextEncoder().encode(canonical);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
function canonicalize(value) {
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(",")}]`;
  if (value && typeof value === "object") {
    const keys = Object.keys(value).sort();
    return `{${keys.map((k) => `${JSON.stringify(k)}:${canonicalize(value[k])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}
function appKey(tenant2, id) {
  return `${tenant2}:app:${id}`;
}
function workflowKvKey(tenant2, wfKey) {
  return `${tenant2}:wf:${wfKey}`;
}
async function getInstalledApp(env, tenant2, id) {
  const raw2 = await appStore(env).get(appKey(tenant2, id), "text");
  if (!raw2) return null;
  try {
    return JSON.parse(raw2);
  } catch {
    return null;
  }
}
async function listInstalledApps(env, tenant2) {
  const prefix = `${tenant2}:app:`;
  const list = await appStore(env).list({ prefix });
  const apps = await Promise.all(
    list.keys.map(async (k) => {
      const raw2 = await appStore(env).get(k.name, "text");
      if (!raw2) return null;
      try {
        return JSON.parse(raw2);
      } catch {
        return null;
      }
    })
  );
  return apps.filter((a) => a !== null);
}
async function ensureTemplate4(env, name, slots, description) {
  const { base, headers } = kbdbBase(env);
  const getRes = await fetch(`${base}/templates/${encodeURIComponent(name)}`, { headers });
  if (getRes.ok) {
    const data = await getRes.json().catch(() => null);
    if (data?.success && data.template) {
      const tpl = data.template;
      let current = [];
      try {
        const parsed = JSON.parse(tpl.slots_json ?? "[]");
        if (Array.isArray(parsed)) current = parsed.filter((s) => typeof s === "string");
      } catch {
      }
      const missing = slots.filter((s) => !current.includes(s));
      if (missing.length > 0 && tpl.id) {
        const patched = await fetch(`${base}/templates/${encodeURIComponent(tpl.id)}`, {
          method: "PATCH",
          headers,
          body: JSON.stringify({ slots: [...current, ...missing] })
        });
        if (!patched.ok) throw new Error(`\u88DC\u8CC7\u6599\u6B04\u4F4D ${name}\uFF08${missing.join("\u3001")}\uFF09\u5931\u6557\uFF1AHTTP ${patched.status}`);
      }
      return;
    }
  }
  await fetch(`${base}/templates`, {
    method: "POST",
    headers,
    body: JSON.stringify({ name, slots, description })
  });
}
var RECIPE_BEHAVIOR_FIELDS = [
  "endpoint",
  "method",
  "headers",
  "body",
  "body_template",
  "response_map",
  "auth",
  "binding_name",
  "auth_service",
  "credentials_required"
];
function sameRecipeBehavior(a, b) {
  const pick = (r) => {
    const o = {};
    for (const k of RECIPE_BEHAVIOR_FIELDS) {
      const v = k === "method" ? (r.method ?? "POST").toUpperCase() : r[k];
      if (v !== void 0) o[k] = v;
    }
    return o;
  };
  return canonicalize(pick(a)) === canonicalize(pick(b));
}
async function ensureAppRecipes(env, recipes) {
  const installed = [];
  for (const decl of recipes) {
    const cid = String(decl.canonical_id ?? "").trim().toLowerCase();
    const have = await resolveRecipe(cid, env.RECIPES);
    if (have && sameRecipeBehavior(have, decl)) continue;
    const r = await upsertPrivateRecipe(env.RECIPES, { ...decl, canonical_id: cid });
    if (!r.ok) return { ok: false, error: `recipe\u300C${cid}\u300D\uFF1A${r.error}` };
    installed.push(cid);
  }
  return { ok: true, installed };
}
async function findMissingCredentials(env, tenant2, wanted) {
  if (wanted.length === 0) return { missing: [], checked: true };
  try {
    const have = new Set((await listCredentialRows(env, String(tenant2))).map((r) => r.name));
    return { missing: wanted.filter((w) => !have.has(w.name)), checked: true };
  } catch {
    return { missing: [], checked: false };
  }
}
async function installApp(env, tenant2, rawDecl, opts = {}) {
  let decl0 = rawDecl;
  if (opts.coords) {
    try {
      decl0 = resolveDeclarationPlaceholders(rawDecl, opts.coords);
    } catch (e) {
      return {
        ok: false,
        step: "\u88DC\u4E0A\u9019\u53F0\u5BE6\u4F8B\u7684\u4F4D\u5740",
        errors: [e instanceof Error ? e.message : String(e)],
        hint: "\u9019\u662F\u7CFB\u7D71\u5167\u90E8\u7684\u554F\u984C\uFF0C\u4E0D\u662F\u4F60\u505A\u932F\u4E86\u3002\u628A\u9019\u53E5\u8A71\u56DE\u5831\u7D66\u7BA1\u7406\u8005\u5373\u53EF\u3002"
      };
    }
  }
  const left = remainingPlaceholders(decl0);
  if (left.length > 0) {
    return {
      ok: false,
      step: "\u88DC\u4E0A\u9019\u53F0\u5BE6\u4F8B\u7684\u4F4D\u5740",
      errors: [`\u9019\u4EFD\u5BA3\u544A\u88E1\u9084\u6709\u6C92\u586B\u7684\u4F4D\u7F6E\uFF1A${left.join("\u3001")}`],
      hint: "\u9019\u500B App \u7684\u4F5C\u8005\u7559\u4E86\u8981\u7531\u5BE6\u4F8B\u586B\u7684\u6B04\u4F4D\uFF0C\u4F46\u9019\u53F0\u5BE6\u4F8B\u6C92\u586B\u5F97\u8D77\u4F86\u3002\u8ACB\u56DE\u5831\u7D66\u7BA1\u7406\u8005\u3002"
    };
  }
  const validation = validateAppDeclaration(decl0);
  if (!validation.ok) {
    return {
      ok: false,
      step: "\u6AA2\u67E5\u9019\u500B App \u7684\u5BA3\u544A",
      errors: validation.errors,
      hint: "\u9019\u662F App \u4F5C\u8005\u90A3\u908A\u8981\u4FEE\u7684\uFF0C\u91CD\u8A66\u4E0D\u6703\u8B8A\u597D\u3002\u628A\u4E0A\u9762\u9019\u5E7E\u884C\u539F\u6587\u56DE\u5831\u7D66\u9019\u500B App \u7684\u4F5C\u8005\u3002"
    };
  }
  const decl = applyDeclarationDefaults(decl0);
  const contentHash = await computeContentHash(decl0);
  const existing = await getInstalledApp(env, tenant2, decl.id);
  const wantedCreds = normalizeRequiredCredentials(decl.requires);
  const wantedRecipes = decl.requires?.recipes ?? [];
  const ensured = await ensureAppRecipes(env, wantedRecipes);
  if (!ensured.ok) {
    return {
      ok: false,
      step: "\u5099\u9F4A\u9700\u8981\u7684 recipe",
      errors: [ensured.error],
      hint: "\u9019\u500B App \u9700\u8981\u7684 recipe \u5BEB\u4E0D\u9032\u9019\u53F0\u5BE6\u4F8B\u3002\u7A0D\u7B49\u4E00\u5206\u9418\u518D\u6309\u4E00\u6B21\uFF1B\u4E00\u76F4\u5931\u6557\u5C31\u628A\u9019\u53E5\u8A71\u56DE\u5831\u7D66\u7BA1\u7406\u8005\u3002"
    };
  }
  const credCheck = await findMissingCredentials(env, tenant2, wantedCreds);
  const needs = {
    recipes_installed: ensured.installed,
    missing_credentials: credCheck.missing,
    ...credCheck.checked ? {} : { credentials_check_failed: true }
  };
  if (existing && existing.content_hash === contentHash && existing.status === "active") {
    try {
      for (const dt of decl.data) await ensureTemplate4(env, dt.name, dt.slots, dt.description);
    } catch (e) {
      return {
        ok: false,
        step: "\u6E96\u5099\u8CC7\u6599\u578B\u5225",
        errors: [e instanceof Error ? e.message : String(e)],
        hint: "\u9019\u53F0\u5BE6\u4F8B\u7684\u77E5\u8B58\u5EAB\u670D\u52D9\u6C92\u6709\u56DE\u61C9\u3002\u7A0D\u7B49\u4E00\u5206\u9418\u518D\u6309\u4E00\u6B21\u5B89\u88DD\uFF1B\u4E00\u76F4\u5931\u6557\u5C31\u628A\u9019\u53E5\u8A71\u56DE\u5831\u7D66\u7BA1\u7406\u8005\u3002"
      };
    }
    return { ok: true, changed: false, app: existing, ...needs };
  }
  try {
    for (const dt of decl.data) {
      await ensureTemplate4(env, dt.name, dt.slots, dt.description);
    }
  } catch (e) {
    return {
      ok: false,
      step: "\u6E96\u5099\u8CC7\u6599\u578B\u5225",
      errors: [e instanceof Error ? e.message : String(e)],
      hint: "\u9019\u53F0\u5BE6\u4F8B\u7684\u77E5\u8B58\u5EAB\u670D\u52D9\u6C92\u6709\u56DE\u61C9\u3002\u7A0D\u7B49\u4E00\u5206\u9418\u518D\u6309\u4E00\u6B21\u5B89\u88DD\uFF1B\u4E00\u76F4\u5931\u6557\u5C31\u628A\u9019\u53E5\u8A71\u56DE\u5831\u7D66\u7BA1\u7406\u8005\u3002"
    };
  }
  const workflowRefs = [];
  try {
    for (const wf of decl.workflows) {
      const wfKey = `${decl.id}__${wf.name}`;
      const trigger = resolveWorkflowTrigger(wf);
      const cronExpr = trigger === "schedule" ? extractCronExpr(wf.graph) : null;
      await appStore(env).put(
        workflowKvKey(tenant2, wfKey),
        JSON.stringify({
          graph: wf.graph,
          description: wf.description || `${decl.name}: ${wf.name}`,
          created_at: existing?.installed_at ?? (/* @__PURE__ */ new Date()).toISOString(),
          ...cronExpr ? { cron_expr: cronExpr } : {}
        })
      );
      await updateCronIndexEntry(appStore(env), String(tenant2), wfKey, cronExpr);
      const graphId = typeof wf.graph.id === "string" ? wf.graph.id : void 0;
      workflowRefs.push({
        name: wf.name,
        wf_key: wfKey,
        description: wf.description || "",
        trigger,
        ...cronExpr ? { cron_expr: cronExpr } : {},
        ...graphId ? { graph_id: graphId } : {}
      });
    }
  } catch (e) {
    return {
      ok: false,
      step: "\u5B89\u88DD\u5DE5\u4F5C\u6D41",
      errors: [e instanceof Error ? e.message : String(e)],
      hint: kbdbBehindHint(e) ?? `\u5DF2\u7D93\u88DD\u4E0A ${workflowRefs.length}\uFF0F${decl.workflows.length} \u689D\u3002\u518D\u6309\u4E00\u6B21\u5B89\u88DD\u6703\u5F9E\u982D\u8986\u5BEB\u4E00\u904D\uFF1B\u4E00\u76F4\u5931\u6557\u5C31\u628A\u9019\u53E5\u8A71\u56DE\u5831\u7D66\u7BA1\u7406\u8005\u3002`
    };
  }
  if (existing) {
    const keepKeys = new Set(workflowRefs.map((w) => w.wf_key));
    for (const prev of existing.workflows) {
      if (!keepKeys.has(prev.wf_key)) {
        await appStore(env).delete(workflowKvKey(tenant2, prev.wf_key));
        await updateCronIndexEntry(appStore(env), String(tenant2), prev.wf_key, null);
      }
    }
  }
  const uiHtml = decl.ui ? bundleUiAssets(decl.ui.html, decl.ui.assets).html : void 0;
  const record = {
    id: decl.id,
    name: decl.name,
    icon: decl.icon,
    version: decl.version,
    content_hash: contentHash,
    workflows: workflowRefs,
    actions: decl.actions,
    data_templates: decl.data.map((d) => d.name),
    has_ui: Boolean(uiHtml),
    ui_html: uiHtml,
    ui_style: uiHtml ? decl.ui?.style ?? DEFAULT_APP_UI_STYLE : void 0,
    keeps_data: decl.keeps_data,
    ...wantedRecipes.length || wantedCreds.length ? { requires: { recipes: wantedRecipes.map((r) => String(r.canonical_id).trim().toLowerCase()), credentials: wantedCreds } } : {},
    installed_at: existing?.installed_at ?? (/* @__PURE__ */ new Date()).toISOString(),
    updated_at: (/* @__PURE__ */ new Date()).toISOString(),
    status: "active"
  };
  try {
    await appStore(env).put(appKey(tenant2, decl.id), JSON.stringify(record));
  } catch (e) {
    return {
      ok: false,
      step: "\u5BEB\u5165\u5B89\u88DD\u7D00\u9304",
      errors: [e instanceof Error ? e.message : String(e)],
      hint: kbdbBehindHint(e) ?? "\u5DE5\u4F5C\u6D41\u5DF2\u7D93\u88DD\u597D\u4E86\uFF0C\u53EA\u5DEE\u6700\u5F8C\u9019\u4E00\u7B46\u7D00\u9304\u2014\u2014\u518D\u6309\u4E00\u6B21\u5B89\u88DD\u5C31\u6703\u88DC\u4E0A\u3002"
    };
  }
  return { ok: true, changed: true, app: record, ...needs };
}
async function uninstallApp(env, tenant2, id) {
  const existing = await getInstalledApp(env, tenant2, id);
  if (!existing) return { ok: false, error: "\u9019\u500B App \u6C92\u6709\u5B89\u88DD\u7D00\u9304" };
  try {
    for (const wf of existing.workflows) {
      await appStore(env).delete(workflowKvKey(tenant2, wf.wf_key));
      await updateCronIndexEntry(appStore(env), String(tenant2), wf.wf_key, null);
    }
    await appStore(env).delete(appKey(tenant2, id));
  } catch (e) {
    return {
      ok: false,
      error: kbdbBehindHint(e) ?? `\u79FB\u9664\u5931\u6557\uFF1A${e instanceof Error ? e.message : String(e)}`
    };
  }
  return { ok: true };
}
async function runAppAction(env, tenant2, appId, action, payload, ctx) {
  const guessedKey = `${appId}__${action}`;
  const [app2, guessedRaw] = await Promise.all([
    getInstalledApp(env, tenant2, appId),
    appStore(env).get(workflowKvKey(tenant2, guessedKey), "text")
  ]);
  if (!app2 || app2.status !== "active") return { ok: false, status: 404, error: "\u9019\u500B App \u6C92\u6709\u5B89\u88DD" };
  if (!app2.actions.includes(action)) {
    return { ok: false, status: 403, error: "\u9019\u500B\u52D5\u4F5C\u4E0D\u5728\u9019\u500B App \u7684\u767D\u540D\u55AE\u5167" };
  }
  const wfRef = app2.workflows.find((w) => w.name === action);
  if (!wfRef) return { ok: false, status: 500, error: "\u52D5\u4F5C\u5C0D\u61C9\u7684\u5DE5\u4F5C\u6D41\u907A\u5931\uFF08\u5B89\u88DD\u614B\u640D\u6BC0\uFF09" };
  const raw2 = wfRef.wf_key === guessedKey ? guessedRaw : await appStore(env).get(workflowKvKey(tenant2, wfRef.wf_key), "text");
  if (!raw2) return { ok: false, status: 500, error: "\u5DE5\u4F5C\u6D41\u8CC7\u6599\u907A\u5931\uFF08\u5B89\u88DD\u614B\u640D\u6BC0\uFF09" };
  let graph;
  try {
    const parsed = JSON.parse(raw2);
    if (!parsed.graph) throw new Error("no graph");
    graph = parsed.graph;
  } catch {
    return { ok: false, status: 500, error: "\u5DE5\u4F5C\u6D41\u5B9A\u7FA9\u640D\u6BC0" };
  }
  const result = await executeWebhookGraph(env, graph, payload, wfRef.wf_key, String(tenant2), ctx);
  const g = graph;
  const verdict = writeExecutionVerdict(
    env,
    typeof g.id === "string" ? g.id : wfRef.wf_key,
    Array.isArray(g.nodes) ? g.nodes : [],
    result.success ? "success" : "failed",
    result.duration_ms,
    result.error ?? "",
    { ...payload, _triggered_by: "app" },
    String(tenant2)
  );
  if (ctx) ctx.waitUntil(verdict);
  else await verdict;
  if (!result.success) {
    return { ok: false, status: 502, error: `\u5DE5\u4F5C\u6D41\u57F7\u884C\u5931\u6557\uFF1A${result.error ?? "\u672A\u77E5\u932F\u8AA4"}` };
  }
  return { ok: true, status: 200, result: result.data };
}
function refTrigger(w) {
  return w.trigger ?? "manual";
}
function launchOf(app2) {
  if (app2.has_ui) return { launch: "open" };
  const runnable = app2.workflows.filter((w) => refTrigger(w) === "manual" && app2.actions.includes(w.name));
  if (runnable.length === 0) return { launch: "auto" };
  return runnable.length === 1 ? { launch: "run", run_action: runnable[0].name } : { launch: "run" };
}
function summarizeApp(app2) {
  const l = launchOf(app2);
  return {
    id: app2.id,
    name: app2.name,
    icon: app2.icon,
    glyph: appGlyph(app2.icon, app2.name),
    has_ui: app2.has_ui,
    version: app2.version,
    launch: l.launch,
    ...l.run_action ? { run_action: l.run_action } : {},
    // 自動的那一格要說得出「它什麼時候會自己跑」，使用者才知道它在替他做事。
    schedules: app2.workflows.map((w) => w.cron_expr).filter((x) => typeof x === "string")
  };
}
function detailApp(app2) {
  const l = launchOf(app2);
  return {
    id: app2.id,
    name: app2.name,
    icon: app2.icon,
    version: app2.version,
    has_ui: app2.has_ui,
    ui_html: app2.ui_html,
    // 舊安裝態（v0.1 裝的 App）沒有這一欄——一律當「跟隨全局」，不是「維持原樣」。
    // 那正是 leo 抱怨的那個狀態，預設值要把它修好，不是把它保留下來。
    ui_style: app2.ui_style ?? DEFAULT_APP_UI_STYLE,
    workflows: app2.workflows.map((w) => ({
      name: w.name,
      description: w.description,
      trigger: refTrigger(w),
      ...w.cron_expr ? { cron_expr: w.cron_expr } : {},
      ...w.graph_id ? { graph_id: w.graph_id } : {},
      // 畫面只為「真的按得動」的那幾條長出鍵——白名單仍由 runAppAction 在伺服端把關。
      runnable: app2.actions.includes(w.name)
    })),
    actions: app2.actions,
    launch: l.launch,
    ...l.run_action ? { run_action: l.run_action } : {}
  };
}

// cypher-executor/src/lib/app-catalog.ts
var APP_CATALOG = [
  {
    id: "notes",
    name: "\u7B46\u8A18",
    icon: "\u{1F4DD}",
    // 2026-09-26（arcrun-app-note#1 → c11600）：v0.2 加了 Facebook 河道式設計——
    // 卡片外框、回覆（indented）、全螢幕輸入，跟著 declaration 一起升版。
    summary: "\u96A8\u624B\u5BEB\u4E00\u5247\u7B46\u8A18\uFF0C\u53EF\u4EE5\u56DE\u8986\uFF1B\u4F9D\u65E5\u671F\u6392\u6210\u6CB3\u9053\uFF0C\u5BEB\u4E0B\u53BB\u7684\u5167\u5BB9\u9032\u4F60\u81EA\u5DF1\u7684\u77E5\u8B58\u5EAB\u3002",
    version: "1.1.1",
    author: "Arcrun \u5167\u5EFA",
    declaration: notes_default
  },
  {
    id: "global_index",
    name: "\u958B\u5834\u5168\u5C40\u7E3D\u5716",
    icon: "\u{1F9ED}",
    // inkstone/InkStoneCo#17：一次算出「現在有哪些票、庫裡有哪些知識」的 index。
    // 這個 App 只有工作流、沒有畫面（has_ui=false）——觸發它拿到的是一份 md 總覽。
    summary: "\u4E00\u6B21\u5370\u51FA\u73FE\u5728\u6709\u54EA\u4E9B\u7968\u5728\u52D5\u3001\u77E5\u8B58\u5EAB\u88E1\u6709\u4EC0\u9EBC\uFF0C\u958B\u5834\u5148\u770B\u9019\u4EFD\u4E0D\u5FC5\u88AB\u4EBA\u63D0\u9192\u3002",
    version: "0.1.1",
    author: "Arcrun \u5167\u5EFA",
    declaration: global_index_app_default
  },
  {
    id: "kanban",
    name: "\u7968\u770B\u677F",
    icon: "\u{1F5C2}\uFE0F",
    // inkstone/InkStoneCo#18：看板不擁有資料，只是 Gitea 票的投影——欄位＝s/* 狀態標籤，
    // 移動卡片＝把那張票的標籤換掉。畫面由 A2UI 前端零件宣告組成（#284）。
    // 前置由宣告自己帶（inkstone/Arcrun#285）：recipe gitea_read／gitea_issue_labels 安裝時一起裝好，
    // 金鑰 gitea_token 只宣告名字——缺的時候市集會明講缺哪一把、去「管理 → 金鑰管理」填。
    summary: "\u628A Gitea \u4E0A\u958B\u8457\u7684\u7968\u4F9D\u72C0\u614B\u5206\u6B04\u6392\u958B\uFF0C\u4E00\u773C\u770B\u5230\u8AB0\u5728\u505A\u4EC0\u9EBC\uFF0C\u6309\u4E00\u4E0B\u5C31\u80FD\u628A\u7968\u79FB\u5230\u4E0B\u4E00\u6B04\u3002",
    version: "0.2.1",
    author: "Arcrun \u5167\u5EFA",
    declaration: kanban_app_default
  }
];
function parseVersion(v) {
  if (typeof v !== "string") return null;
  const m = /^v?(\d+)\.(\d+)\.(\d+)(?:[-+].*)?$/.exec(v.trim());
  if (!m) return null;
  return [Number(m[1]), Number(m[2]), Number(m[3])];
}
function compareVersions(a, b) {
  const pa = parseVersion(a);
  const pb = parseVersion(b);
  if (!pa || !pb) return null;
  for (let i = 0; i < 3; i++) {
    if (pa[i] > pb[i]) return 1;
    if (pa[i] < pb[i]) return -1;
  }
  return 0;
}
function updateStatus(installedVersion, catalogVersion2) {
  if (catalogVersion2 === void 0) return "none";
  const c = compareVersions(catalogVersion2, installedVersion);
  if (c === null) return "unknown";
  return c > 0 ? "update" : c < 0 ? "downgrade" : "current";
}
function catalogVersion(e) {
  const dv = e.declaration.version;
  return typeof dv === "string" && dv ? dv : e.version;
}
function updateInfo(installedVersion, id) {
  const entry = findCatalogEntry(id);
  const status = updateStatus(installedVersion, entry ? catalogVersion(entry) : void 0);
  return {
    update_status: status,
    update_available: status === "update",
    ...entry ? { latest_version: catalogVersion(entry) } : {}
  };
}
function findCatalogEntry(id) {
  return APP_CATALOG.find((e) => e.id === id);
}
function catalogListing(installed) {
  const verOf = (id) => installed instanceof Map ? installed.get(id) : void 0;
  const has = (id) => installed.has(id);
  return APP_CATALOG.map((e) => {
    const iv = verOf(e.id);
    const st = has(e.id) && iv !== void 0 ? updateStatus(iv, catalogVersion(e)) : "none";
    return {
      id: e.id,
      name: e.name,
      icon: e.icon,
      glyph: appGlyph(e.icon, e.name),
      summary: e.summary,
      version: catalogVersion(e),
      author: e.author,
      installed: has(e.id),
      ...iv !== void 0 ? { installed_version: iv } : {},
      update_status: st,
      update_available: st === "update",
      needs_credentials: normalizeRequiredCredentials(e.declaration.requires),
      needs_recipes: (e.declaration.requires?.recipes ?? []).map((r) => String(r.canonical_id))
    };
  });
}

// cypher-executor/src/lib/update-center.ts
var DEFAULT_INSTALLER_ORIGIN2 = "https://install.arcrun.dev";
async function fetchInstallerLatest(env, fetchImpl = fetch) {
  const origin2 = (env.INSTALLER_ORIGIN || DEFAULT_INSTALLER_ORIGIN2).replace(/\/+$/, "");
  try {
    const res = await fetchImpl(`${origin2}/api/latest`, { headers: { accept: "application/json" } });
    if (!res.ok) return null;
    const j = await res.json().catch(() => null);
    return j && typeof j === "object" ? j : null;
  } catch {
    return null;
  }
}
function engineStatus(current, latest) {
  if (!latest || !parseVersion(latest)) return "unknown";
  if (!current) return "unknown";
  if (!parseVersion(current)) return "update";
  const c = compareVersions(latest, current);
  return c === 1 ? "update" : c === null ? "unknown" : "current";
}
function daemonStatus(current, latest) {
  if (!current || !latest) return "unknown";
  const c = compareVersions(latest, current);
  return c === 1 ? "update" : c === null ? "unknown" : "current";
}
function groupDaemonReports(reports) {
  const byKey = /* @__PURE__ */ new Map();
  for (const r of reports) {
    const key = r.machine || (r.machine_label ? `label:${r.machine_label}` : "");
    const prev = byKey.get(key);
    if (!prev || (r.received_at || 0) > (prev.received_at || 0)) byKey.set(key, r);
  }
  return [...byKey.values()].sort((a, b) => (b.received_at || 0) - (a.received_at || 0));
}
var DAEMON_HOWTO = "\u5C0F\u5E6B\u624B\u6BCF\u5929\u6703\u81EA\u5DF1\u4E0B\u8F09\u65B0\u7248\uFF0C\u770B\u5230\u9078\u55AE\u4E0A\u7684\u300C\u91CD\u65B0\u555F\u52D5\u4EE5\u5B8C\u6210\u66F4\u65B0\u300D\u6309\u4E00\u4E0B\u5C31\u597D\uFF1B\u60F3\u99AC\u4E0A\u66F4\u65B0\uFF1A\u6253\u958B\u96FB\u8166\u4E0A\u7684 Arcrun\uFF08\u5DE5\u5177\u5217\uFF0F\u7CFB\u7D71\u5323\u5716\u793A\uFF09\u2192\u300C\u7248\u672C\u8207\u66F4\u65B0\u300D\u2192\u300C\u6AA2\u67E5\u66F4\u65B0\u300D\u3002";
function buildUpdateCenter(input) {
  const items = [];
  const latest = input.latest;
  const latestRelease = latest && typeof latest.release === "string" && latest.release || "";
  const daemonLatest = latest && latest.daemon && typeof latest.daemon.version === "string" && latest.daemon.version || "";
  const downloads = {
    ...latest?.daemon?.downloads?.mac ? { mac: latest.daemon.downloads.mac } : {},
    ...latest?.daemon?.downloads?.win ? { win: latest.daemon.downloads.win } : {}
  };
  const es = engineStatus(input.engineCurrent, latestRelease);
  items.push({
    kind: "engine",
    id: "engine",
    name: "Portal\uFF08\u96F2\u7AEF\u5F15\u64CE\uFF09",
    current: input.engineCurrent,
    latest: latestRelease,
    status: es,
    note: es === "update" ? "\u6709\u65B0\u7248\u3002\u6309\u300C\u66F4\u65B0\u300D\u5C31\u6703\u76F4\u63A5\u63DB\u6210\u6700\u65B0\u7248\uFF0C\u77E5\u8B58\u5EAB\u5167\u5BB9\u4E0D\u6703\u52D5\u5230\uFF0C\u4E0D\u7528\u518D\u767B\u5165 Cloudflare\u3002" : es === "current" ? "\u5DF2\u662F\u6700\u65B0\u7248\u3002" : !latestRelease ? "\u66AB\u6642\u67E5\u4E0D\u5230\u6700\u65B0\u7248\uFF0C\u7A0D\u5F8C\u518D\u8A66\u3002" : "\u8B80\u4E0D\u5230\u9019\u53F0\u76EE\u524D\u7684\u7248\u672C\uFF08\u670D\u52D9\u53EF\u80FD\u6B63\u5728\u555F\u52D5\uFF09\u3002",
    action: es === "update" ? { type: "instance_update", admin_only: true } : null
  });
  const machines = groupDaemonReports(input.daemonReports);
  if (machines.length === 0) {
    items.push({
      kind: "daemon",
      id: "daemon",
      name: "\u540C\u6B65\u5C0F\u5E6B\u624B",
      current: "",
      latest: daemonLatest,
      status: "unknown",
      note: "\u9084\u6C92\u6709\u4EFB\u4F55\u4E00\u53F0\u96FB\u8166\u4E0A\u7684\u5C0F\u5E6B\u624B\u56DE\u5831\u904E\u3002\u88DD\u597D\u4E26\u9023\u4E0A\u4E4B\u5F8C\uFF0C\u9019\u88E1\u6703\u5217\u51FA\u6BCF\u4E00\u53F0\u3002" + (daemonLatest ? `\u6700\u65B0\u7248\u662F ${daemonLatest}\u3002` : ""),
      action: { type: "daemon_self_update", admin_only: false, downloads }
    });
  } else {
    for (const m of machines) {
      const st = daemonStatus(m.daemon_version, daemonLatest);
      const label = m.machine_label || (m.machine ? m.machine.slice(0, 8) : "\u9019\u53F0\u96FB\u8166");
      items.push({
        kind: "daemon",
        id: `daemon:${m.machine || m.machine_label || "unknown"}`,
        name: `\u540C\u6B65\u5C0F\u5E6B\u624B\uFF08${label}\uFF09`,
        current: m.daemon_version,
        latest: daemonLatest,
        status: st,
        reported_at: m.received_at,
        note: st === "update" ? `\u6709\u65B0\u7248\u3002${DAEMON_HOWTO}` : st === "current" ? "\u5DF2\u662F\u6700\u65B0\u7248\u3002" : !m.daemon_version ? `\u9019\u53F0\u7684\u5C0F\u5E6B\u624B\u662F\u820A\u7248\uFF0C\u4E0D\u6703\u56DE\u5831\u81EA\u5DF1\u7684\u7248\u672C\uFF0C\u96F2\u7AEF\u770B\u4E0D\u5230\u5B83\u662F\u4E0D\u662F\u6700\u65B0\u3002${DAEMON_HOWTO}` : !daemonLatest ? "\u66AB\u6642\u67E5\u4E0D\u5230\u6700\u65B0\u7248\uFF0C\u7A0D\u5F8C\u518D\u8A66\u3002" : "\u8B80\u4E0D\u61C2\u9019\u53F0\u56DE\u5831\u7684\u7248\u865F\uFF0C\u7121\u6CD5\u6BD4\u5C0D\u3002",
        action: { type: "daemon_self_update", admin_only: false, downloads }
      });
    }
  }
  for (const a of input.apps) {
    const st = a.update_available ? "update" : a.update_status === "current" ? "current" : "unknown";
    items.push({
      kind: "app",
      id: `app:${a.id}`,
      name: a.name || a.id,
      current: a.version,
      latest: a.latest_version ?? "",
      status: st,
      note: st === "update" ? "\u6709\u65B0\u7248\u3002\u6309\u300C\u66F4\u65B0\u300D\u5C31\u63DB\u6210\u65B0\u7248\uFF0CApp \u88E1\u5DF2\u7D93\u5BEB\u7684\u8CC7\u6599\u4E0D\u6703\u4E0D\u898B\u3002" : st === "current" ? "\u5DF2\u662F\u6700\u65B0\u7248\u3002" : a.update_status === "downgrade" ? `\u76EE\u9304\u88E1\u7684\u7248\u672C\uFF08${a.latest_version ?? ""}\uFF09\u6BD4\u4F60\u88DD\u7684\u9084\u820A\uFF0C\u4E0D\u6703\u84CB\u56DE\u53BB\u3002` : a.update_status === "none" ? "\u9019\u500B App \u4E0D\u662F\u5F9E\u5E02\u96C6\u88DD\u7684\uFF0C\u6C92\u6709\u53EF\u6BD4\u5C0D\u7684\u65B0\u7248\u3002" : "\u8B80\u4E0D\u61C2\u9019\u500B App \u7684\u7248\u865F\uFF0C\u7121\u6CD5\u6BD4\u5C0D\u3002",
      action: st === "update" && a.latest_version ? { type: "app_install", admin_only: true, app_id: a.id, to: a.latest_version } : null
    });
  }
  return {
    items,
    updates_available: items.filter((i) => i.status === "update").length,
    latest_known: !!latestRelease
  };
}

// cypher-executor/src/routes/portal-data.ts
init_tenant();
init_webhook_handlers();
init_recipes();
var portalDataRouter = new Hono2();
async function getTenantWorkflowGraph(env, name) {
  const raw2 = await env.WEBHOOKS.get(`${knowledgeOwner(env)}:wf:${name}`, "text");
  if (!raw2) return null;
  try {
    const rec = JSON.parse(raw2);
    return rec.graph && typeof rec.graph === "object" ? rec.graph : null;
  } catch {
    return null;
  }
}
function unwrapWorkflowData(data, key) {
  const outer = data && typeof data === "object" ? data : {};
  if (key in outer) return outer;
  const inner = outer.data;
  if (inner && typeof inner === "object" && key in inner) {
    return inner;
  }
  return outer;
}
function mapGraphNeighborsResponse(data) {
  const layer = unwrapWorkflowData(data, "neighbors");
  const neighbors = Array.isArray(layer.neighbors) ? layer.neighbors : [];
  const edges = Array.isArray(layer.edges) ? layer.edges : [];
  return { neighbors, edges, count: neighbors.length };
}
function dedupeSourcesByPage(sources) {
  const seen = /* @__PURE__ */ new Map();
  for (const s of sources) {
    if (!s || typeof s !== "object") continue;
    const item = s;
    const page = typeof item.page_name === "string" ? item.page_name : typeof item.page === "string" ? item.page : "";
    const machine = typeof item.machine === "string" ? item.machine : "";
    const key = `${page}\0${machine}`;
    const existing = seen.get(key);
    if (existing) {
      existing.count += 1;
    } else {
      seen.set(key, { item, count: 1 });
    }
  }
  return [...seen.values()].map(
    ({ item, count }) => count > 1 ? { ...item, hit_count: count } : item
  );
}
function notFound(c) {
  return c.json({ error: "\u627E\u4E0D\u5230\u9019\u7B46\u8CC7\u6599" }, 404);
}
function entryLibrary(entry) {
  try {
    const meta = JSON.parse(entry.metadata_json ?? "null");
    if (meta && typeof meta.library === "string" && meta.library.trim()) return meta.library;
  } catch {
  }
  return "general";
}
function canReadLibrary(userLibraries, library) {
  return userLibraries.includes("*") || userLibraries.includes(library);
}
var INTERNAL_ENTRY_TYPES = /* @__PURE__ */ new Set(["value", "workflow", "execution_log", "execution_log_usage"]);
function filterDeprecatedEntries(entries) {
  return entries.filter((e) => {
    if (e.entry_type && INTERNAL_ENTRY_TYPES.has(e.entry_type)) return false;
    try {
      const meta = JSON.parse(e.metadata_json ?? "null");
      if (meta && meta.status === "deprecated") return false;
    } catch {
    }
    if (String(e.content ?? "").startsWith("\uFF08\u820A\u7BA1\u7DDA\u7522\u7269")) return false;
    return true;
  });
}
function normalizeCjkQuery(q) {
  const isCjk = (c) => /[぀-鿿豈-﫿]/.test(c);
  const isAsciiAlnum = (c) => /[぀-鿿豈-﫿]/.test(c);
  let result = "";
  for (let i = 0; i < q.length; i++) {
    const ch = q[i];
    if (result.length > 0) {
      const prev = result[result.length - 1];
      if (prev !== " " && ch !== " " && (isCjk(prev) && /[A-Za-z0-9]/.test(ch) || /[A-Za-z0-9]/.test(prev) && isCjk(ch))) {
        result += " ";
      }
    }
    result += ch;
  }
  return result;
}
function findBestNodeMatch(searchTerm, nodeNames) {
  const term = normalizeCjkQuery(searchTerm).toLowerCase();
  if (!term) return null;
  const hits = nodeNames.filter((n) => normalizeCjkQuery(n).toLowerCase().includes(term));
  if (hits.length === 0) return null;
  return hits.reduce((a, b) => a.length <= b.length ? a : b);
}
async function tripletCount(env, owner) {
  try {
    const res = await kbdbFetch3(env, `/records/triplet-stats?${owner === null ? censusQueryAllTenants() : ownerQuery(owner)}`);
    if (!res.ok) return null;
    const body = await res.json().catch(() => null);
    if (!body || !Array.isArray(body.stats)) return null;
    let total = 0;
    for (const row of body.stats) {
      if (typeof row?.triplet_count !== "number") return null;
      total += row.triplet_count;
    }
    return total;
  } catch {
    return null;
  }
}
async function tripletCensus(env, tenant2) {
  const owned = await tripletCount(env, tenant2);
  if (owned !== 0) return { owned, any: null };
  return { owned, any: await tripletCount(env, null) };
}
async function fuzzyFindNode(env, tenant2, searchTerm, libraries) {
  try {
    const res = await kbdbFetch3(env, `/records/by-template/triplet?${ownerQuery(tenant2)}`);
    if (!res.ok) return null;
    const body = await res.json().catch(() => null);
    if (!body || !Array.isArray(body.records)) return null;
    const nodeNames = /* @__PURE__ */ new Set();
    for (const r of body.records) {
      const v = r?.values;
      if (!v || typeof v !== "object") continue;
      const lib = recordLibrary(v);
      if (lib !== null && !canReadLibrary(libraries, lib)) continue;
      if (typeof v.subject === "string" && v.subject.trim()) nodeNames.add(v.subject.trim());
      if (typeof v.object === "string" && v.object.trim()) nodeNames.add(v.object.trim());
    }
    return findBestNodeMatch(searchTerm, [...nodeNames]);
  } catch {
    return null;
  }
}
portalDataRouter.get(
  "/portal/data/search",
  (c) => run(c, async () => {
    const auth = await requirePortalUser(c);
    if (!auth.ok) return auth.res;
    const qRaw = c.req.query("q");
    if (!qRaw) return c.json({ error: "q \u5FC5\u586B" }, 400);
    const q = normalizeCjkQuery(qRaw);
    const libraries = parseLibraries(auth.user.values.libraries);
    if (libraries.length === 0) {
      return c.json({ success: true, entries: [], count: 0, mode: "keyword", note: "\u6B64\u5E33\u865F\u5C1A\u672A\u88AB\u6388\u6B0A\u4EFB\u4F55\u77E5\u8B58\u5EAB\uFF0C\u8ACB\u806F\u7D61\u7BA1\u7406\u54E1\u3002" });
    }
    const params = new URLSearchParams({ q, owner_id: ownerField(knowledgeOwner(c.env)) });
    if (!libraries.includes("*")) params.set("library", libraries.join(","));
    if (c.req.query("mode") === "semantic") {
      params.set("mode", "semantic");
      const msRaw = Number(c.req.query("min_score"));
      if (Number.isFinite(msRaw) && msRaw > 0 && msRaw < 1) params.set("min_score", String(msRaw));
    }
    const entryType = c.req.query("entry_type");
    if (entryType) params.set("entry_type", entryType);
    const limit = c.req.query("limit");
    if (limit && /^\d{1,3}$/.test(limit)) params.set("limit", limit);
    const res = await kbdbFetch3(c.env, `/entries/search?${params.toString()}`);
    if (!res.ok) {
      return new Response(res.body, { status: res.status, headers: { "Content-Type": "application/json" } });
    }
    const body = await res.json().catch(() => null);
    if (!body || !Array.isArray(body.entries)) {
      return c.json(body ?? { error: "KBDB \u56DE\u61C9\u4E0D\u662F JSON" }, body ? 200 : 502);
    }
    const entries = filterDeprecatedEntries(body.entries);
    return c.json({ ...body, entries, count: entries.length });
  })
);
portalDataRouter.get(
  "/portal/data/retrieve",
  (c) => run(c, async () => {
    const auth = await requirePortalUser(c);
    if (!auth.ok) return auth.res;
    const qRaw = c.req.query("q") || c.req.query("question");
    if (!qRaw) return c.json({ error: "q \u5FC5\u586B" }, 400);
    const q = normalizeCjkQuery(qRaw);
    const libraries = parseLibraries(auth.user.values.libraries);
    if (libraries.length === 0) {
      return c.json({
        success: true,
        route: "all",
        vector_used: false,
        libraries_considered: 0,
        libraries: [],
        indexes: [],
        graph_facts: [],
        pages: [],
        pages_count: 0,
        pages_truncated: false,
        note: "\u6B64\u5E33\u865F\u5C1A\u672A\u88AB\u6388\u6B0A\u4EFB\u4F55\u77E5\u8B58\u5EAB\uFF0C\u8ACB\u806F\u7D61\u7BA1\u7406\u54E1\u3002"
      });
    }
    const params = new URLSearchParams({ q, owner_id: ownerField(knowledgeOwner(c.env)) });
    if (!libraries.includes("*")) params.set("library", libraries.join(","));
    const limit = c.req.query("limit");
    if (limit && /^\d{1,3}$/.test(limit)) params.set("limit", limit);
    const pagesLimit = c.req.query("pages_limit");
    if (pagesLimit && /^\d{1,3}$/.test(pagesLimit)) params.set("pages_limit", pagesLimit);
    const graphDepth = c.req.query("graph_depth");
    if (graphDepth && /^\d{1,2}$/.test(graphDepth)) params.set("graph_depth", graphDepth);
    const res = await kbdbFetch3(c.env, `/retrieve?${params.toString()}`);
    if (!res.ok) {
      return new Response(res.body, { status: res.status, headers: { "Content-Type": "application/json" } });
    }
    const body = await res.json().catch(() => null);
    if (!body || !Array.isArray(body.pages)) {
      return c.json(body ?? { error: "KBDB \u56DE\u61C9\u4E0D\u662F JSON" }, body ? 200 : 502);
    }
    const pages = filterDeprecatedEntries(body.pages);
    return c.json({ ...body, pages, pages_count: pages.length });
  })
);
portalDataRouter.get(
  "/portal/data/entries/:id",
  (c) => run(c, async () => {
    const auth = await requirePortalUser(c);
    if (!auth.ok) return auth.res;
    const libraries = parseLibraries(auth.user.values.libraries);
    if (libraries.length === 0) return notFound(c);
    const res = await kbdbFetch3(c.env, `/entries/${encodeURIComponent(c.req.param("id"))}`);
    if (res.status === 404) return notFound(c);
    if (!res.ok) return c.json({ error: `KBDB \u56DE\u932F\uFF08HTTP ${res.status}\uFF09` }, 502);
    const body = await res.json();
    const entry = body.entry;
    if (!entry) return notFound(c);
    if (!isOwnedBy(entry.owner_id, knowledgeOwner(c.env))) return notFound(c);
    if (!canReadLibrary(libraries, entryLibrary(entry))) return notFound(c);
    return c.json({ success: true, entry });
  })
);
async function fetchNeighborsFromKbdb(env, tenant2, node, depth, libraries, directed) {
  const qs = new URLSearchParams();
  qs.set("depth", String(depth));
  qs.set("template", "triplet");
  if (!libraries.includes("*")) qs.set("library", libraries.join(","));
  if (directed) qs.set("directed", "true");
  const res = await kbdbFetch3(env, `/graph/neighbors/${encodeURIComponent(node)}?${qs.toString()}&${ownerQuery(tenant2)}`);
  const body = await res.json().catch(() => null);
  return { ok: res.ok, status: res.status, body };
}
portalDataRouter.get(
  "/portal/data/graph/neighbors/:name",
  (c) => run(c, async () => {
    const auth = await requirePortalUser(c);
    if (!auth.ok) return auth.res;
    const libraries = parseLibraries(auth.user.values.libraries);
    if (!await hasGraphAccess(c.env, libraries)) {
      return c.json({ error: "\u7121\u77E5\u8B58\u5716\u8B5C\u6AA2\u8996\u6B0A\u9650" }, 403);
    }
    const tenant2 = knowledgeOwner(c.env);
    const rawName = c.req.param("name");
    const depthRaw = c.req.query("depth") ?? "";
    const depth = /^\d{1,2}$/.test(depthRaw) ? Number(depthRaw) : 2;
    const directed = c.req.query("directed") === "true";
    const tryNames = [rawName];
    const normalized = normalizeCjkQuery(rawName);
    if (normalized !== rawName) tryNames.push(normalized);
    let first = null;
    try {
      for (const name of tryNames) {
        const r = await fetchNeighborsFromKbdb(c.env, tenant2, name, depth, libraries, directed);
        if (!first) first = r;
        if (!r.ok) break;
        const mapped = mapGraphNeighborsResponse(r.body);
        if (mapped.count > 0) return c.json(mapped);
      }
      if (first?.ok) {
        const fallbackName = await fuzzyFindNode(c.env, tenant2, rawName, libraries);
        if (fallbackName && !tryNames.includes(fallbackName)) {
          const r = await fetchNeighborsFromKbdb(c.env, tenant2, fallbackName, depth, libraries, directed);
          if (r.ok) {
            const mapped = mapGraphNeighborsResponse(r.body);
            if (mapped.count > 0) return c.json(mapped);
          }
        }
      }
    } catch (e) {
      return c.json({ error: `KBDB \u5716\u8B5C\u67E5\u8A62\u4E0D\u53EF\u9054\uFF1A${e instanceof Error ? e.message : String(e)}` }, 502);
    }
    if (!first) return c.json({ error: "KBDB \u5716\u8B5C\u67E5\u8A62\u6C92\u6709\u56DE\u61C9" }, 502);
    if (!first.ok) {
      const err = first.body && typeof first.body === "object" ? first.body : { error: `KBDB \u5716\u8B5C\u67E5\u8A62\u5931\u6557\uFF08HTTP ${first.status}\uFF09` };
      return c.json(err, first.status);
    }
    return c.json(mapGraphNeighborsResponse(first.body));
  })
);
portalDataRouter.get(
  "/portal/data/graph/overview",
  (c) => run(c, async () => {
    const auth = await requirePortalUser(c);
    if (!auth.ok) return auth.res;
    const libraries = parseLibraries(auth.user.values.libraries);
    if (!await hasGraphAccess(c.env, libraries)) {
      return c.json({ error: "\u7121\u77E5\u8B58\u5716\u8B5C\u6AA2\u8996\u6B0A\u9650" }, 403);
    }
    const tenant2 = knowledgeOwner(c.env);
    const [res, census] = await Promise.all([
      kbdbFetch3(c.env, `/records/by-template/triplet?${ownerQuery(tenant2)}&limit=500`),
      tripletCensus(c.env, tenant2)
    ]);
    const tripletsTotal = census.owned;
    if (!res.ok) {
      return new Response(res.body, { status: res.status, headers: { "Content-Type": "application/json" } });
    }
    const body = await res.json().catch(() => null);
    if (!body || !Array.isArray(body.records)) {
      return c.json({ error: "\u4E09\u5143\u7D44\u8B80\u53D6\u5931\u6557\uFF1AKBDB \u56DE\u61C9\u4E0D\u662F\u9810\u671F\u7684 records \u6E05\u55AE" }, 502);
    }
    const records = body.records;
    const EDGE_CAP = 500;
    const seen = /* @__PURE__ */ new Set();
    const edges = [];
    const degree = /* @__PURE__ */ new Map();
    let truncated = false;
    for (const r of records) {
      const v = r && typeof r.values === "object" && r.values ? r.values : null;
      if (!v) continue;
      if (v.status === "deprecated") continue;
      const s = typeof v.subject === "string" ? v.subject.trim() : "";
      const o = typeof v.object === "string" ? v.object.trim() : "";
      if (!s || !o) continue;
      const p = typeof v.predicate === "string" ? v.predicate : "";
      const key = `${s}${p}${o}`;
      if (seen.has(key)) continue;
      seen.add(key);
      if (edges.length >= EDGE_CAP) {
        truncated = true;
        break;
      }
      edges.push({ subject: s, predicate: p, object: o });
      degree.set(s, (degree.get(s) ?? 0) + 1);
      degree.set(o, (degree.get(o) ?? 0) + 1);
    }
    const nodes = [...degree.entries()].map(([name, d]) => ({ name, degree: d }));
    let emptyReason = null;
    if (nodes.length === 0) {
      if (census.owned === null) emptyReason = "unreadable";
      else if (census.owned > 0) emptyReason = "scope_mismatch";
      else if (census.any === null) emptyReason = "unreadable";
      else emptyReason = census.any > 0 ? "scope_mismatch" : "confirmed_empty";
    }
    return c.json({
      nodes,
      edges,
      node_count: nodes.length,
      edge_count: edges.length,
      // 取到的 record 已達 KBDB 單頁上限 → 這張圖只是全庫的一部分，別讓 meta 看起來像全部
      truncated: truncated || records.length >= 500,
      triplets_total: tripletsTotal,
      empty_confirmed: nodes.length > 0 || emptyReason === "confirmed_empty",
      empty_reason: emptyReason
    });
  })
);
portalDataRouter.get(
  "/portal/data/chat",
  (c) => run(c, async () => {
    const auth = await requirePortalUser(c);
    if (!auth.ok) return auth.res;
    const question = c.req.query("question");
    if (!question) return c.json({ error: "question \u5FC5\u586B" }, 400);
    const wfGraph = await getTenantWorkflowGraph(c.env, "rag_chat");
    if (!wfGraph) return c.json({ error: "\u6B64\u5BE6\u4F8B\u672A\u5B89\u88DD\u554F\u7B54 workflow" }, 404);
    const result = await executeWebhookGraph(
      c.env,
      wfGraph,
      { question },
      "rag_chat",
      knowledgeOwner(c.env),
      c.executionCtx
    );
    if (!result.success) {
      return c.json({ error: `rag_chat workflow \u57F7\u884C\u5931\u6557\uFF1A${result.error ?? "\u672A\u77E5\u932F\u8AA4"}` }, 502);
    }
    const inner = unwrapWorkflowData(result.data, "answer");
    const rawSources = Array.isArray(inner.sources) ? inner.sources : [];
    const retrieval = inner.retrieval;
    return c.json({
      answer: typeof inner.answer === "string" ? inner.answer : "",
      sources: dedupeSourcesByPage(rawSources),
      graph_facts: inner.graph_facts ?? null,
      retrieval: retrieval && typeof retrieval === "object" ? retrieval : null
    });
  })
);
var FEEDBACK_MAX_CHARS = 5e3;
portalDataRouter.post(
  "/portal/data/feedback",
  (c) => run(c, async () => {
    const auth = await requirePortalUser(c);
    if (!auth.ok) return auth.res;
    const body = await c.req.json().catch(() => null);
    const text = typeof body?.text === "string" ? body.text.trim() : "";
    if (!text) return c.json({ error: "\u8ACB\u5148\u5BEB\u4E0B\u4F60\u9047\u5230\u7684\u72C0\u6CC1\u518D\u9001\u51FA" }, 400);
    if (text.length > FEEDBACK_MAX_CHARS) {
      return c.json({ error: `\u56DE\u5831\u5167\u5BB9\u592A\u9577\u4E86\uFF08\u4E0A\u9650 ${FEEDBACK_MAX_CHARS} \u5B57\uFF09\uFF0C\u8ACB\u7559\u4E0B\u6700\u95DC\u9375\u7684\u90A3\u5E7E\u53E5` }, 400);
    }
    const wfGraph = await getTenantWorkflowGraph(c.env, "feedback_report");
    if (!wfGraph) return c.json({ error: "\u9019\u500B\u77E5\u8B58\u5EAB\u9084\u6C92\u5B89\u88DD\u300C\u56DE\u5831\u300D\u5DE5\u4F5C\u6D41\uFF0C\u66AB\u6642\u9001\u4E0D\u51FA\u53BB" }, 404);
    const tenant2 = knowledgeOwner(c.env);
    const v = auth.user.values;
    let diagnostics;
    if (body?.attach_diagnostics === true) {
      try {
        diagnostics = await buildDiagnostics(c.env, tenant2);
      } catch (e) {
        diagnostics = { error: `\u96F2\u7AEF\u8A3A\u65B7\u8B80\u53D6\u5931\u6557\uFF1A${e instanceof Error ? e.message : String(e)}` };
      }
    }
    const result = await executeWebhookGraph(
      c.env,
      wfGraph,
      {
        text,
        version: c.env.ARCRUN_BUNDLE_VERSION ?? "unknown",
        instance: tenant2,
        // workflow 的「作業系統」欄在 Portal 這端＝「他是在哪個畫面、用什麼瀏覽器送的」。
        // 分診的人要的是這個，不是 server 的 runtime。長度夾住，避免 UA 把標題頁面撐爛。
        os: portalReporterEnv(body?.user_agent, body?.page),
        diagnostics,
        // 回報者是誰要寫在票上（票上紅線：不能看起來像機器自己開的）。
        reporter: `${v.display_name ?? ""}${v.email ? `\uFF08${v.email}\uFF09` : ""}`.trim() || "\uFF08\u672A\u5177\u540D\u7684 Portal \u4F7F\u7528\u8005\uFF09"
      },
      "feedback_report",
      tenant2,
      c.executionCtx
    );
    if (!result.success) {
      return c.json({ error: `\u6C92\u9001\u51FA\u53BB\uFF0C\u8ACB\u518D\u8A66\u4E00\u6B21\uFF08${result.error ?? "\u5DE5\u4F5C\u6D41\u57F7\u884C\u5931\u6557"}\uFF09` }, 502);
    }
    const inner = unwrapWorkflowData(result.data, "number");
    const number = typeof inner.number === "number" ? inner.number : null;
    if (number === null) {
      return c.json({ error: "\u6C92\u9001\u51FA\u53BB\uFF0C\u8ACB\u518D\u8A66\u4E00\u6B21\uFF08\u5DE5\u4F5C\u6D41\u6C92\u6709\u56DE\u5831\u7968\u865F\uFF09" }, 502);
    }
    return c.json({
      ok: true,
      number,
      url: typeof inner.url === "string" ? inner.url : "",
      // Telegram 那步失敗不影響票已經開成（票上紅線②），只如實回報給前端當附註。
      notify_ok: inner.notify_ok === true
    });
  })
);
function portalReporterEnv(userAgent, pageRaw) {
  const clean = (x, cap) => typeof x === "string" ? x.replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, cap) : "";
  const ua = clean(userAgent, 200);
  const page = clean(pageRaw, 60);
  return `Portal${page ? `\uFF08\u9801\u9762\uFF1A${page}\uFF09` : ""}${ua ? ` ${ua}` : ""}`;
}
function sanitizeUploadFilename(raw2) {
  if (typeof raw2 !== "string") return null;
  let name = (raw2.split(/[/\\]/).pop() ?? "").trim();
  name = name.replace(/[\u0000-\u001f\u007f]/g, "");
  if (!name || name.startsWith(".")) return null;
  if (/\.txt$/i.test(name)) name = name.replace(/\.txt$/i, ".md");
  if (!/\.md$/i.test(name)) name = `${name}.md`;
  if (name.length > 100) return null;
  return name;
}
var MAX_UPLOAD_B64_CHARS = 3 * 1024 * 1024;
portalDataRouter.post(
  "/portal/data/upload",
  (c) => run(c, async () => {
    const auth = await requirePortalUser(c);
    if (!auth.ok) return auth.res;
    if (!uploadEnabled(c.env)) return c.json({ error: "\u6B64\u5BE6\u4F8B\u672A\u555F\u7528\u4E0A\u50B3" }, 404);
    const body = await c.req.json().catch(() => null);
    const filename = sanitizeUploadFilename(body?.filename);
    if (!filename) return c.json({ error: "filename \u7121\u6548\uFF08\u4E0D\u53EF\u542B\u8DEF\u5F91\u3001\u4E0D\u53EF\u7A7A\u3001\u9577\u5EA6\u9650 100\uFF09" }, 400);
    const contentB64 = body?.content_b64;
    if (typeof contentB64 !== "string" || !contentB64) return c.json({ error: "content_b64 \u5FC5\u586B" }, 400);
    if (contentB64.length > MAX_UPLOAD_B64_CHARS) return c.json({ error: "\u6A94\u6848\u904E\u5927\uFF08\u4E0A\u9650\u7D04 2 MB\uFF09" }, 413);
    const base = (c.env.PORTAL_UPLOAD_GITEA ?? "").replace(/\/$/, "");
    const repo = c.env.PORTAL_UPLOAD_REPO ?? "";
    let res;
    try {
      res = await fetch(`${base}/api/v1/repos/${repo}/contents/docs/${encodeURIComponent(filename)}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `token ${c.env.PORTAL_UPLOAD_TOKEN}`
        },
        body: JSON.stringify({
          content: contentB64,
          // commit 訊息帶上傳者（display_name 非機密），收件溯源用；不進任何內容
          message: `portal \u4E0A\u50B3\uFF1Adocs/${filename}\uFF08${auth.user.values.display_name ?? "portal user"}\uFF09`
        })
      });
    } catch (e) {
      return c.json({ error: `\u77E5\u8B58\u5EAB\u6536\u4EF6\u670D\u52D9\u4E0D\u53EF\u9054\uFF1A${e instanceof Error ? e.message : String(e)}` }, 502);
    }
    if (res.status === 409 || res.status === 422) {
      return c.json({ error: "\u540C\u540D\u6587\u4EF6\u5DF2\u5B58\u5728\uFF0C\u8ACB\u6539\u6A94\u540D\u5F8C\u91CD\u50B3" }, 409);
    }
    if (!res.ok) {
      return c.json({ error: `\u77E5\u8B58\u5EAB\u6536\u4EF6\u5931\u6557\uFF08HTTP ${res.status}\uFF09` }, 502);
    }
    return c.json({ success: true, filename, path: `docs/${filename}` });
  })
);
portalDataRouter.get(
  "/portal/data/workflows",
  (c) => run(c, async () => {
    const auth = await requirePortalUser(c);
    if (!auth.ok) return auth.res;
    const setting = (c.env.PORTAL_SHOW_WORKFLOWS ?? "admin").toLowerCase();
    if (setting === "off") return notFound(c);
    if (!workflowsVisible(c.env, auth.user.values.role ?? "user")) {
      return c.json({ error: "\u9700\u8981 admin \u6B0A\u9650" }, 403);
    }
    const tenant2 = knowledgeOwner(c.env);
    const prefix = `${tenant2}:wf:`;
    const list = await c.env.WEBHOOKS.list({ prefix });
    const workflows = await Promise.all(
      list.keys.map(async (k) => {
        const name = k.name.slice(prefix.length);
        const raw2 = await c.env.WEBHOOKS.get(k.name, "text");
        let description = "";
        let created_at = "";
        let cron_expr;
        if (raw2) {
          try {
            const rec = JSON.parse(raw2);
            description = rec.description ?? "";
            created_at = rec.created_at ?? "";
            cron_expr = rec.cron_expr;
          } catch {
          }
        }
        let last_execution = null;
        const execRes = await kbdbFetch3(
          c.env,
          `/execution-log/latest?${new URLSearchParams({ workflow_id: name, owner_id: ownerField(tenant2) }).toString()}`
        );
        const execBody = await execRes.json().catch(() => null);
        if (execRes.ok && execBody?.success && execBody.execution) {
          last_execution = { timestamp: String(execBody.execution.recorded_at), verdict: execBody.execution.verdict };
        }
        return { name, description, created_at, cron_expr, last_execution };
      })
    );
    return c.json({ success: true, workflows, total: workflows.length, read_only: true });
  })
);
portalDataRouter.get(
  "/portal/data/recipes",
  (c) => run(c, async () => {
    const auth = await requirePortalUser(c);
    if (!auth.ok) return auth.res;
    const setting = (c.env.PORTAL_SHOW_WORKFLOWS ?? "admin").toLowerCase();
    if (setting === "off") return notFound(c);
    if (!workflowsVisible(c.env, auth.user.values.role ?? "user")) {
      return c.json({ error: "\u9700\u8981 admin \u6B0A\u9650" }, 403);
    }
    const all = await listAllRecipes(c.env.RECIPES);
    const authCache = /* @__PURE__ */ new Map();
    const recipes = (await Promise.all(
      all.map(async (r) => {
        let host = "";
        try {
          host = new URL(r.endpoint).host;
        } catch {
          host = String(r.endpoint ?? "").split("/")[0] ?? "";
        }
        const credentials = [
          .../* @__PURE__ */ new Set([...recipeCredentialNames(r), ...await recipeAuthSecretNames(r, c.env.RECIPES, authCache)])
        ];
        return {
          canonical_id: r.canonical_id,
          display_name: r.display_name || r.canonical_id,
          description: r.description ?? "",
          method: (r.method ?? "POST").toUpperCase(),
          host,
          // 金鑰名單＝執行時真的會回填的：宣告 ∪ headers/body 裡的 {{credential.*}}（#152 c17107）
          // ∪ auth recipe 的必填 required_secrets（#286）。只看前者會把 gmail_send 標成「免金鑰」。
          credentials,
          auth: r.auth ?? (credentials.length ? "static_key" : "none"),
          author: r.author ?? ""
        };
      })
    )).sort((a, b) => a.canonical_id.localeCompare(b.canonical_id));
    return c.json({ success: true, recipes, total: recipes.length, read_only: true });
  })
);
portalDataRouter.get(
  "/portal/data/apps/glyphs",
  (c) => run(c, async () => {
    const auth = await requirePortalUser(c);
    if (!auth.ok) return auth.res;
    return c.json({ glyphs: APP_GLYPH_BODIES });
  })
);
portalDataRouter.get(
  "/portal/data/apps",
  (c) => run(c, async () => {
    const auth = await requirePortalUser(c);
    if (!auth.ok) return auth.res;
    const tenant2 = knowledgeOwner(c.env);
    const apps = await listInstalledApps(c.env, tenant2);
    return c.json({
      apps: apps.map((a) => ({ ...summarizeApp(a), ...updateInfo(a.version, a.id) })),
      count: apps.length,
      updates_available: apps.filter((a) => updateInfo(a.version, a.id).update_available).length
    });
  })
);
portalDataRouter.get(
  "/portal/data/updates",
  (c) => run(c, async () => {
    const auth = await requirePortalUser(c);
    if (!auth.ok) return auth.res;
    const tenant2 = knowledgeOwner(c.env);
    const [latest, apps, daemonReports] = await Promise.all([
      fetchInstallerLatest(c.env),
      listInstalledApps(c.env, tenant2),
      listDaemonReports(c.env)
    ]);
    const center = buildUpdateCenter({
      engineCurrent: c.env.ARCRUN_BUNDLE_VERSION ?? "",
      latest,
      apps: apps.map((a) => ({ id: a.id, name: a.name, version: a.version, ...updateInfo(a.version, a.id) })),
      daemonReports
    });
    return c.json({ success: true, ...center });
  })
);
portalDataRouter.get(
  "/portal/data/apps/catalog",
  (c) => run(c, async () => {
    const auth = await requirePortalUser(c);
    if (!auth.ok) return auth.res;
    const tenant2 = knowledgeOwner(c.env);
    const installedApps = await listInstalledApps(c.env, tenant2);
    const installed = new Map(installedApps.map((a) => [a.id, a.version]));
    const wanted = /* @__PURE__ */ new Map();
    for (const a of installedApps) for (const w of a.requires?.credentials ?? []) wanted.set(w.name, w);
    const credCheck = await findMissingCredentials(c.env, tenant2, [...wanted.values()]);
    const missingNames = new Set(credCheck.missing.map((m) => m.name));
    const listing = catalogListing(installed).map((e) => {
      const inst = installedApps.find((a) => a.id === e.id);
      if (!inst?.requires?.credentials?.length) return e;
      return {
        ...e,
        missing_credentials: inst.requires.credentials.filter((w) => missingNames.has(w.name)),
        ...credCheck.checked ? {} : { credentials_check_failed: true }
      };
    });
    return c.json({
      apps: listing,
      // 前端拿它決定按鈕長什麼樣：不能裝的人看到的是「要管理員才能裝」，不是一顆按了才失敗的按鈕。
      can_install: (auth.user.values.role ?? "user") === "admin"
    });
  })
);
portalDataRouter.post(
  "/portal/data/apps/catalog/:id/install",
  (c) => run(c, async () => {
    const auth = await requirePortalUser(c);
    if (!auth.ok) return auth.res;
    if ((auth.user.values.role ?? "user") !== "admin") {
      return c.json(
        {
          error: "\u53EA\u6709\u7BA1\u7406\u54E1\u53EF\u4EE5\u5B89\u88DD App",
          step: "\u6AA2\u67E5\u6B0A\u9650",
          hint: "\u9019\u53F0\u5BE6\u4F8B\u7684 App \u6E05\u55AE\u662F\u5168\u7AD9\u5171\u7528\u7684\uFF0C\u6240\u4EE5\u8981\u7BA1\u7406\u54E1\u4F86\u88DD\u3002\u8ACB\u4F60\u7684\u7BA1\u7406\u54E1\u5230\u300CApp \u5E02\u96C6\u300D\u6309\u5B89\u88DD\u3002"
        },
        403
      );
    }
    const id = c.req.param("id");
    const entry = findCatalogEntry(id);
    if (!entry) {
      return c.json(
        {
          error: `\u5E02\u96C6\u88E1\u6C92\u6709\u300C${id}\u300D\u9019\u500B App`,
          step: "\u5728\u5E02\u96C6\u88E1\u627E\u9019\u500B App",
          hint: "\u9019\u53F0\u5BE6\u4F8B\u7684\u5E02\u96C6\u5167\u5BB9\u8DDF\u8457\u7248\u672C\u8D70\u2014\u2014\u91CD\u65B0\u6574\u7406\u9801\u9762\u770B\u770B\uFF1B\u9084\u662F\u6C92\u6709\u5C31\u662F\u9019\u7248\u6C92\u6536\u9304\u5B83\u3002"
        },
        404
      );
    }
    const tenant2 = knowledgeOwner(c.env);
    const before = await getInstalledApp(c.env, tenant2, id);
    const targetVersion = catalogVersion(entry);
    if (before && compareVersions(targetVersion, before.version) === -1) {
      return c.json(
        {
          error: `\u5E02\u96C6\u88E1\u7684\u300C${entry.name}\u300D\u662F v${targetVersion}\uFF0C\u6BD4\u4F60\u5DF2\u88DD\u7684 v${before.version} \u9084\u820A\uFF0C\u4E0D\u662F\u65B0\u7248`,
          step: "\u6BD4\u5C0D\u7248\u672C",
          hint: "\u70BA\u4E86\u4E0D\u628A\u4F60\u7684 App \u9000\u56DE\u820A\u8A2D\u8A08\uFF0C\u9019\u6B21\u6C92\u6709\u52D5\u5B83\u3002\u5982\u679C\u4F60\u78BA\u5B9A\u8981\u9000\u56DE\u53BB\uFF0C\u8ACB\u5148\u79FB\u9664\u518D\u5B89\u88DD\uFF1B\u4E0D\u78BA\u5B9A\u5C31\u7DAD\u6301\u73FE\u5728\u9019\u4E00\u7248\u3002",
          installed_version: before.version,
          catalog_version: targetVersion
        },
        409
      );
    }
    const coords = { namespace: String(tenant2), cypherBase: new URL(c.req.url).origin };
    const result = await installApp(c.env, tenant2, entry.declaration, { coords });
    if (!result.ok) {
      return c.json(
        {
          error: (result.errors ?? ["\u5B89\u88DD\u5931\u6557"]).join("\uFF1B"),
          step: result.step ?? "\u5B89\u88DD",
          hint: result.hint ?? "\u518D\u8A66\u4E00\u6B21\uFF1B\u4E00\u76F4\u5931\u6557\u5C31\u628A\u9019\u6BB5\u8A0A\u606F\u56DE\u5831\u7D66\u7BA1\u7406\u8005\u3002"
        },
        502
      );
    }
    return c.json({
      installed: true,
      changed: result.changed,
      // 這次是不是「更新」（原本就裝著、換成了別的內容）；前端拿來決定要說「已更新到 vX」還是「裝好了」。
      updated: Boolean(before && result.changed),
      from_version: before?.version,
      app: result.app ? summarizeApp(result.app) : void 0,
      // inkstone/Arcrun#285：幫忙裝好的 recipe 名字、還缺的金鑰（名字＋用途；永遠沒有值）。
      recipes_installed: result.recipes_installed ?? [],
      missing_credentials: result.missing_credentials ?? [],
      ...result.credentials_check_failed ? { credentials_check_failed: true } : {}
    });
  })
);
portalDataRouter.get(
  "/portal/data/apps/:id",
  (c) => run(c, async () => {
    const auth = await requirePortalUser(c);
    if (!auth.ok) return auth.res;
    const tenant2 = knowledgeOwner(c.env);
    const app2 = await getInstalledApp(c.env, tenant2, c.req.param("id"));
    if (!app2) return c.json({ error: "\u627E\u4E0D\u5230\u9019\u500B App" }, 404);
    const detail = detailApp(app2);
    if (!detail.has_ui) {
      const withLast = await Promise.all(
        detail.workflows.map(async (w) => {
          let last_execution = null;
          try {
            const res = await kbdbFetch3(
              c.env,
              `/execution-log/latest?${new URLSearchParams({ workflow_id: w.graph_id ?? `${app2.id}__${w.name}`, owner_id: ownerField(tenant2) }).toString()}`
            );
            const b = await res.json().catch(() => null);
            if (res.ok && b?.success && b.execution) {
              last_execution = { timestamp: String(b.execution.recorded_at), verdict: b.execution.verdict };
            }
          } catch {
          }
          return { ...w, last_execution };
        })
      );
      return c.json({ ...detail, workflows: withLast });
    }
    return c.json(detail);
  })
);
portalDataRouter.post(
  "/portal/data/apps/:id/action",
  (c) => run(c, async () => {
    const auth = await requirePortalUser(c);
    if (!auth.ok) return auth.res;
    const tenant2 = knowledgeOwner(c.env);
    const appId = c.req.param("id");
    const body = await c.req.json().catch(() => null);
    const action = typeof body?.action === "string" ? body.action : "";
    if (!action) return c.json({ error: "action \u5FC5\u586B" }, 400);
    const payload = body?.payload && typeof body.payload === "object" ? body.payload : {};
    const result = await runAppAction(c.env, tenant2, appId, action, payload, c.executionCtx);
    if (!result.ok) return c.json({ error: result.error }, result.status);
    return c.json({ ok: true, result: result.result });
  })
);
portalDataRouter.delete(
  "/portal/data/apps/:id",
  (c) => run(c, async () => {
    const auth = await requirePortalUser(c);
    if (!auth.ok) return auth.res;
    if ((auth.user.values.role ?? "user") !== "admin") {
      return c.json({ error: "\u9700\u8981 admin \u6B0A\u9650" }, 403);
    }
    const tenant2 = knowledgeOwner(c.env);
    const result = await uninstallApp(c.env, tenant2, c.req.param("id"));
    if (!result.ok) return c.json({ error: result.error ?? "\u5378\u8F09\u5931\u6557" }, 404);
    return c.json({ removed: true });
  })
);
function recordLibrary(values) {
  const lib = values?.library;
  return typeof lib === "string" && lib.trim() ? lib.trim() : null;
}
function canReadRecord(rec, tenant2, libraries) {
  if (!isOwnedBy(rec.owner_id, tenant2)) return false;
  const lib = recordLibrary(rec.values);
  return lib === null || canReadLibrary(libraries, lib);
}
function cardOriginalLocation(entries, library, libraryRoot) {
  for (const e of entries) {
    if (typeof e.metadata_json !== "string" || !e.metadata_json) continue;
    let meta;
    try {
      meta = JSON.parse(e.metadata_json);
    } catch {
      continue;
    }
    const sourcePath = typeof meta.source_path === "string" && meta.source_path.trim() ? meta.source_path.trim() : null;
    const machine = typeof meta.machine_label === "string" && meta.machine_label.trim() ? meta.machine_label.trim() : typeof meta.machine === "string" && meta.machine.trim() ? meta.machine.trim() : null;
    if (!sourcePath && !machine) continue;
    const root = libraryRoot && libraryRoot.trim() ? libraryRoot.trim() : null;
    return {
      machine,
      library,
      library_root: root,
      source_path: sourcePath,
      full_path: root && sourcePath ? `${root.replace(/\/+$/, "")}/${sourcePath.replace(/^\/+/, "")}` : null
    };
  }
  return null;
}
portalDataRouter.get(
  "/portal/data/library-cards",
  (c) => run(c, async () => {
    const auth = await requirePortalUser(c);
    if (!auth.ok) return auth.res;
    const libraries = parseLibraries(auth.user.values.libraries);
    const library = c.req.query("library") || "";
    if (!library.trim()) return c.json({ error: "\u7F3A\u5C11 library \u53C3\u6578\uFF08\u76EE\u9304\u5929\u751F\u5C6C\u65BC\u67D0\u4E00\u500B\u5EAB\uFF09" }, 400);
    if (!canReadLibrary(libraries, library)) return notFound(c);
    const params = new URLSearchParams({ library });
    params.set("owner_id", String(knowledgeOwner(c.env)));
    const limit = c.req.query("limit");
    if (limit && /^\d{1,3}$/.test(limit)) params.set("limit", limit);
    const res = await kbdbFetch3(c.env, `/entries/library-cards?${params.toString()}`);
    if (!res.ok) return c.json({ error: `KBDB \u56DE\u932F\uFF08HTTP ${res.status}\uFF09` }, 502);
    return new Response(res.body, { status: 200, headers: { "Content-Type": "application/json" } });
  })
);
portalDataRouter.get(
  "/portal/data/card",
  (c) => run(c, async () => {
    const auth = await requirePortalUser(c);
    if (!auth.ok) return auth.res;
    const libraries = parseLibraries(auth.user.values.libraries);
    const library = c.req.query("library") || "";
    const pageName = c.req.query("page_name") || "";
    if (!library.trim() || !pageName.trim()) {
      return c.json({ error: "\u7F3A\u5C11 library \u6216 page_name\uFF08\u4E00\u5F35\u5361\u7531\u300C\u54EA\u500B\u5EAB\u7684\u54EA\u500B\u5361\u540D\u300D\u5B9A\u4F4D\uFF09" }, 400);
    }
    if (!canReadLibrary(libraries, library)) return notFound(c);
    const params = new URLSearchParams({ library, page_name: pageName });
    params.set("owner_id", String(knowledgeOwner(c.env)));
    params.set("limit", "200");
    const res = await kbdbFetch3(c.env, `/entries?${params.toString()}`);
    if (!res.ok) return c.json({ error: `KBDB \u56DE\u932F\uFF08HTTP ${res.status}\uFF09` }, 502);
    const body = await res.json().catch(() => null);
    if (!body || !Array.isArray(body.entries)) {
      return c.json({ error: "KBDB \u56DE\u61C9\u4E0D\u662F\u9810\u671F\u7684 entries \u6E05\u55AE" }, 502);
    }
    const entries = filterDeprecatedEntries(body.entries);
    if (entries.length === 0) return notFound(c);
    const libRecords = await listRecordsByTemplate(c.env, LIBRARY_TEMPLATE).catch(() => []);
    const libRootRaw = libRecords.find((r) => String(r.values.name ?? "") === library)?.values.root;
    const libraryRoot = typeof libRootRaw === "string" ? libRootRaw : null;
    const location = cardOriginalLocation(entries, library, libraryRoot);
    return c.json({
      success: true,
      library,
      page_name: pageName,
      entries,
      count: entries.length,
      location,
      ...location ? {} : { location_hint: "\u9019\u5F35\u5361\u7684\u6BB5\u843D\u6C92\u6709 machine/source_path \u4E2D\u7E7C\u8CC7\u6599\uFF0C\u7B54\u4E0D\u51FA\u539F\u6587\u7684\u5BE6\u9AD4\u4F4D\u7F6E" }
    });
  })
);
portalDataRouter.get(
  "/portal/data/map",
  (c) => run(c, async () => {
    const auth = await requirePortalUser(c);
    if (!auth.ok) return auth.res;
    const libraries = parseLibraries(auth.user.values.libraries);
    if (libraries.length === 0) {
      return c.json({
        success: true,
        libraries: [],
        count: 0,
        empty_confirmed: true,
        empty_reason: "no_library_grant",
        note: "\u6B64\u5E33\u865F\u5C1A\u672A\u88AB\u6388\u6B0A\u4EFB\u4F55\u77E5\u8B58\u5EAB\uFF0C\u8ACB\u806F\u7D61\u7BA1\u7406\u54E1\u3002"
      });
    }
    const tenant2 = knowledgeOwner(c.env);
    const res = await kbdbFetch3(c.env, `/map?${ownerQuery(tenant2)}`);
    if (!res.ok) {
      return new Response(res.body, { status: res.status, headers: { "Content-Type": "application/json" } });
    }
    const body = await res.json().catch(() => null);
    if (!body || !Array.isArray(body.libraries)) {
      return c.json({ error: "\u85CF\u66F8\u5730\u5716\u8B80\u53D6\u5931\u6557\uFF1AKBDB \u56DE\u61C9\u4E0D\u662F\u9810\u671F\u7684 libraries \u6E05\u55AE" }, 502);
    }
    const allowed = body.libraries.filter(
      (l) => typeof l?.library === "string" && canReadLibrary(libraries, l.library)
    );
    if (allowed.length > 0) {
      return c.json({ success: true, libraries: allowed, count: allowed.length, empty_confirmed: false, empty_reason: null });
    }
    if (body.libraries.length > 0) {
      return c.json({
        success: true,
        libraries: [],
        count: 0,
        empty_confirmed: true,
        empty_reason: "filtered_out",
        note: "\u9019\u500B\u5E33\u865F\u76EE\u524D\u6C92\u6709\u4EFB\u4F55\u77E5\u8B58\u5EAB\u7684\u6AA2\u8996\u6B0A\u9650\uFF0C\u8ACB\u806F\u7D61\u7BA1\u7406\u54E1\u958B\u901A\u3002"
      });
    }
    const census = await tripletCensus(c.env, tenant2);
    if (census.owned === null || census.owned === 0 && census.any === null) {
      return c.json({
        success: true,
        libraries: [],
        count: 0,
        empty_confirmed: false,
        empty_reason: "unreadable",
        note: "\u8B80\u4E0D\u5230\u77E5\u8B58\u5EAB\u7684\u7D71\u8A08\uFF0C\u7121\u6CD5\u78BA\u8A8D\u5EAB\u88E1\u6709\u6C92\u6709\u6771\u897F\u2014\u2014\u9019\u4E0D\u662F\u300C\u9084\u6C92\u6709\u77E5\u8B58\u300D\uFF0C\u662F\u9019\u6B21\u8B80\u53D6\u5931\u6557\u3002\u8ACB\u7A0D\u5F8C\u91CD\u6574\u6216\u901A\u77E5\u7BA1\u7406\u54E1\u3002"
      });
    }
    if (census.owned === 0 && (census.any ?? 0) > 0) {
      return c.json({
        success: true,
        libraries: [],
        count: 0,
        empty_confirmed: false,
        empty_reason: "scope_mismatch",
        instance_triplet_count: census.any,
        note: `\u8B80\u4E0D\u5230\u4F60\u9019\u500B\u5E33\u865F\u7BC4\u570D\u5167\u7684\u85CF\u66F8\u2014\u2014\u4F46\u9019\u53F0\u5BE6\u4F8B\u88E1\u6709 ${census.any} \u689D\u77E5\u8B58\u95DC\u806F\u3002\u9019\u4E0D\u662F\u300C\u9084\u6C92\u6709\u77E5\u8B58\u300D\uFF0C\u4E0D\u7528\u53BB\u91CD\u65B0\u4E0A\u50B3\uFF1B\u6BD4\u8F03\u50CF\u77E5\u8B58\u7684\u6B78\u5C6C\u547D\u540D\u7A7A\u9593\u5C0D\u4E0D\u4E0A\u3002\u8ACB\u901A\u77E5\u7BA1\u7406\u54E1\u8DD1\u4E00\u6B21 \`acr update\`\uFF08\u6703\u628A\u4F60\u5B89\u88DD\u6642\u7684\u547D\u540D\u7A7A\u9593\u540C\u6B65\u7D66\u96F2\u7AEF\uFF09\uFF0C\u6216\u6AA2\u67E5 ARCRUN_NAMESPACE \u8A2D\u5B9A\u3002`
      });
    }
    return c.json({
      success: true,
      libraries: [],
      count: 0,
      empty_confirmed: true,
      empty_reason: "confirmed_empty",
      note: "\u77E5\u8B58\u5EAB\u9084\u6C92\u6709\u4EFB\u4F55\u5167\u5BB9\u2014\u2014\u4E0A\u50B3\u6587\u4EF6\u5F8C\u5C31\u6703\u51FA\u73FE\u5728\u9019\u88E1\u3002"
    });
  })
);
portalDataRouter.get(
  "/portal/data/map/:library",
  (c) => run(c, async () => {
    const auth = await requirePortalUser(c);
    if (!auth.ok) return auth.res;
    const libraries = parseLibraries(auth.user.values.libraries);
    const library = c.req.param("library");
    if (!canReadLibrary(libraries, library)) return notFound(c);
    const res = await kbdbFetch3(
      c.env,
      `/map/${encodeURIComponent(library)}?${ownerQuery(knowledgeOwner(c.env))}`
    );
    if (res.status === 404) return notFound(c);
    if (!res.ok) return c.json({ error: `KBDB \u56DE\u932F\uFF08HTTP ${res.status}\uFF09` }, 502);
    return new Response(res.body, { status: 200, headers: { "Content-Type": "application/json" } });
  })
);
portalDataRouter.get(
  "/portal/data/templates",
  (c) => run(c, async () => {
    const auth = await requirePortalUser(c);
    if (!auth.ok) return auth.res;
    const res = await kbdbFetch3(c.env, "/templates");
    if (!res.ok) return c.json({ error: `KBDB \u56DE\u932F\uFF08HTTP ${res.status}\uFF09` }, 502);
    return new Response(res.body, { status: 200, headers: { "Content-Type": "application/json" } });
  })
);
portalDataRouter.post(
  "/portal/data/templates",
  (c) => run(c, async () => {
    const auth = await requirePortalUser(c);
    if (!auth.ok) return auth.res;
    const body = await c.req.json().catch(() => null);
    if (!body || typeof body.name !== "string" || !body.name.trim() || !Array.isArray(body.slots)) {
      return c.json({ error: "name \u8207 slots[] \u5FC5\u586B" }, 400);
    }
    const res = await kbdbFetch3(c.env, "/templates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: body.name,
        slots: body.slots,
        description: typeof body.description === "string" ? body.description : void 0,
        created_by: knowledgeOwner(c.env)
      })
    });
    return new Response(res.body, { status: res.status, headers: { "Content-Type": "application/json" } });
  })
);
portalDataRouter.get(
  "/portal/data/records/by-template/:template",
  (c) => run(c, async () => {
    const auth = await requirePortalUser(c);
    if (!auth.ok) return auth.res;
    const libraries = parseLibraries(auth.user.values.libraries);
    if (libraries.length === 0) return c.json({ success: true, records: [], count: 0, total: 0 });
    const template = c.req.param("template");
    if (template === LIBRARY_TEMPLATE) {
      const all = await listRecordsByTemplate(c.env, LIBRARY_TEMPLATE);
      const records2 = libraries.includes("*") ? all : all.filter((r) => libraries.includes(String(r.values.name ?? "")));
      return c.json({
        success: true,
        records: records2,
        count: records2.length,
        page_size: all.length,
        filtered_out: all.length - records2.length,
        total: records2.length
      });
    }
    const tenant2 = knowledgeOwner(c.env);
    const params = new URLSearchParams(ownerQuery(tenant2));
    for (const k of ["limit", "offset"]) {
      const v = c.req.query(k);
      if (v) params.set(k, v);
    }
    const res = await kbdbFetch3(
      c.env,
      `/records/by-template/${encodeURIComponent(c.req.param("template"))}?${params.toString()}`
    );
    if (!res.ok) return c.json({ error: `KBDB \u56DE\u932F\uFF08HTTP ${res.status}\uFF09` }, 502);
    const body = await res.json().catch(() => null);
    if (!body || !Array.isArray(body.records)) {
      return c.json({ error: "record \u8B80\u53D6\u5931\u6557\uFF1AKBDB \u56DE\u61C9\u4E0D\u662F\u9810\u671F\u7684 records \u6E05\u55AE" }, 502);
    }
    const records = body.records.filter((r) => canReadRecord(r, tenant2, libraries));
    return c.json({
      success: true,
      records,
      count: records.length,
      // 上游這一頁給了幾筆、被這層的庫權限濾掉幾筆——分得出「沒有下一頁」與「這一頁你看不到」。
      page_size: body.records.length,
      filtered_out: body.records.length - records.length,
      limit: body.limit,
      offset: body.offset,
      total: body.total
    });
  })
);
portalDataRouter.get(
  "/portal/data/records/:recordId",
  (c) => run(c, async () => {
    const auth = await requirePortalUser(c);
    if (!auth.ok) return auth.res;
    const libraries = parseLibraries(auth.user.values.libraries);
    if (libraries.length === 0) return notFound(c);
    const res = await kbdbFetch3(c.env, `/records/${encodeURIComponent(c.req.param("recordId"))}`);
    if (res.status === 404) return notFound(c);
    if (!res.ok) return c.json({ error: `KBDB \u56DE\u932F\uFF08HTTP ${res.status}\uFF09` }, 502);
    const body = await res.json().catch(() => null);
    const record = body?.record;
    if (!record) return notFound(c);
    if (!canReadRecord(record, knowledgeOwner(c.env), libraries)) return notFound(c);
    return c.json({ success: true, record });
  })
);
portalDataRouter.post(
  "/portal/data/records",
  (c) => run(c, async () => {
    const auth = await requirePortalUser(c);
    if (!auth.ok) return auth.res;
    const libraries = parseLibraries(auth.user.values.libraries);
    if (libraries.length === 0) {
      return c.json({ error: "\u6B64\u5E33\u865F\u5C1A\u672A\u88AB\u6388\u6B0A\u4EFB\u4F55\u77E5\u8B58\u5EAB\uFF0C\u7121\u6CD5\u5BEB\u5165" }, 403);
    }
    const body = await c.req.json().catch(() => null);
    if (!body || typeof body.template !== "string" || !body.template.trim() || !body.values || typeof body.values !== "object") {
      return c.json({ error: "template \u8207 values \u5FC5\u586B" }, 400);
    }
    const values = body.values;
    const targetLib = recordLibrary(values);
    if (targetLib !== null && !canReadLibrary(libraries, targetLib)) {
      return c.json({ error: `\u7121\u300C${targetLib}\u300D\u5EAB\u7684\u6B0A\u9650\uFF0C\u4E0D\u80FD\u5BEB\u5165\u8A72\u5EAB` }, 403);
    }
    const res = await kbdbFetch3(c.env, "/records", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ template: body.template, values, owner_id: ownerField(knowledgeOwner(c.env)) })
    });
    return new Response(res.body, { status: res.status, headers: { "Content-Type": "application/json" } });
  })
);
portalDataRouter.get(
  "/portal/data/diagnostics",
  (c) => run(c, async () => {
    const auth = await requirePortalUser(c);
    if (!auth.ok) return auth.res;
    const tenant2 = knowledgeOwner(c.env);
    const core = await buildDiagnostics(c.env, tenant2);
    return c.json({
      generated_at: (/* @__PURE__ */ new Date()).toISOString(),
      instance_url: new URL(c.req.url).origin,
      bundle_version: c.env.ARCRUN_BUNDLE_VERSION ?? null,
      ...core
    });
  })
);

// cypher-executor/src/routes/apps.ts
init_dist();
var appsRouter = new Hono2();
function requireApiKey(c) {
  return c.req.header("X-Arcrun-API-Key") ?? null;
}
appsRouter.post("/apps/install", async (c) => {
  const apiKey = requireApiKey(c);
  if (!apiKey) return c.json({ error: "\u7F3A\u5C11 X-Arcrun-API-Key header" }, 401);
  const body = await c.req.json().catch(() => null);
  if (!body) return c.json({ error: "\u7121\u6548\u7684 JSON body" }, 400);
  const declared = body;
  const prev = typeof declared.id === "string" ? await getInstalledApp(c.env, apiKey, declared.id) : null;
  const warnings = [];
  if (prev && compareVersions(declared.version, prev.version) === -1) {
    warnings.push(`\u7248\u672C\u5012\u9000\uFF1A\u9019\u6B21\u9001\u7684\u662F v${String(declared.version)}\uFF0C\u5DF2\u88DD\u7684\u662F v${prev.version}\u3002\u5DF2\u7167\u4F60\u9001\u7684\u5167\u5BB9\u8986\u84CB\uFF1B\u82E5\u4E0D\u662F\u6709\u610F\u9000\u7248\uFF0C\u8ACB\u91CD\u9001\u8F03\u65B0\u7684\u5BA3\u544A\u3002`);
  }
  const result = await installApp(c.env, apiKey, body, {
    coords: { namespace: apiKey, cypherBase: new URL(c.req.url).origin }
  });
  if (!result.ok) {
    return c.json({ error: "\u5BA3\u544A\u672A\u901A\u904E\u9A57\u8B49", step: result.step, hint: result.hint, details: result.errors }, 400);
  }
  return c.json({
    installed: true,
    changed: result.changed,
    app: result.app ? summarizeApp(result.app) : void 0,
    // inkstone/Arcrun#285：與市集一鍵安裝同一份結果——CLI 裝的人也知道還缺哪把金鑰。
    recipes_installed: result.recipes_installed ?? [],
    missing_credentials: result.missing_credentials ?? [],
    ...result.credentials_check_failed ? { credentials_check_failed: true } : {},
    ...warnings.length ? { warnings } : {}
  });
});
appsRouter.delete("/apps/:id", async (c) => {
  const apiKey = requireApiKey(c);
  if (!apiKey) return c.json({ error: "\u7F3A\u5C11 X-Arcrun-API-Key header" }, 401);
  const id = c.req.param("id");
  const result = await uninstallApp(c.env, apiKey, id);
  if (!result.ok) return c.json({ error: result.error ?? "\u5378\u8F09\u5931\u6557" }, 404);
  return c.json({ removed: true });
});
appsRouter.get("/apps/glyphs", (c) => {
  if (!requireApiKey(c)) return c.json({ error: "\u7F3A\u5C11 X-Arcrun-API-Key header" }, 401);
  return c.json({ glyphs: APP_GLYPH_BODIES });
});
appsRouter.get("/apps", async (c) => {
  const apiKey = requireApiKey(c);
  if (!apiKey) return c.json({ error: "\u7F3A\u5C11 X-Arcrun-API-Key header" }, 401);
  const apps = await listInstalledApps(c.env, apiKey);
  return c.json({ apps: apps.map(summarizeApp), count: apps.length });
});

// cypher-executor/src/routes/storage.ts
init_dist();
var storageRouter = new Hono2();
var IMPORT_BATCH_MAX = 8;
var TRANSIENT_NAMESPACES = {
  EXEC_CONTEXT: "\u57F7\u884C\u4E2D\u66AB\u5B58\uFF08\u7BC0\u9EDE output\u300124 \u5C0F\u6642\u5167\u7B49\u5F85\u56DE\u547C\u7684\u66AB\u505C\u57F7\u884C\uFF09\uFF1B\u66F4\u65B0\u5F8C\u91CD\u8DD1\u5373\u53EF",
  ANALYTICS_KV: "\u820A\u7D71\u8A08\uFF0C\u7A0B\u5F0F\u78BC\u5DF2\u4E0D\u8B80\uFF08\u57F7\u884C\u7D00\u9304\u5728 KBDB execution-log\uFF09",
  OAUTH_KV: "MCP OAuth \u7684\u6388\u6B0A\u78BC\u8207 access token\uFF1B\u66F4\u65B0\u5F8C\u5728 client \u91CD\u9023\u4E00\u6B21\u5373\u53EF",
  USERS_KV: "\u5B98\u65B9 SaaS\uFF08arcrun.dev\uFF09GitHub\uFF0FGoogle \u767B\u5165\u7684\u7528\u6236\u8CC7\u6599\uFF1B\u81EA\u67B6\u5BE6\u4F8B\u7684\u767B\u5165\u662F console\uFF0Fportal\uFF0C\u4E0D\u8B80\u9019\u4E00\u4EFD"
};
function sessionsKeyOutcome(key) {
  if (key === "console:credentials") return "console";
  return { key, outcome: "skipped", reason: "\u767B\u5165 session\uFF0FOAuth state\uFF0F\u7BC0\u6D41\u8A08\u6578\uFF0F\u91CD\u8A2D\u7968\u7B49\u66AB\u5B58\uFF1B\u66F4\u65B0\u5F8C\u91CD\u65B0\u767B\u5165\u5373\u53EF" };
}
function credentialsKeyOutcome(key) {
  if (/^[^:]+:oauth2:/.test(key)) {
    return { key, outcome: "skipped", reason: "OAuth2 access_token \u5FEB\u53D6\uFF1B\u4E0B\u6B21\u547C\u53EB\u6703\u91CD\u65B0\u63DB\u767C" };
  }
  return {
    key,
    outcome: "skipped",
    reason: "\u820A\u7684\u81EA\u7BA1\u52A0\u5BC6 credential \u5BC6\u6587\uFF08\u89E3\u5BC6\u6A5F\u5236\u5DF2\u65BC 20c7610 \u79FB\u9664\uFF0C\u5E36\u904E\u4F86\u4E5F\u89E3\u4E0D\u958B\uFF09\uFF1B\u73FE\u884C credential \u5728 Workers Secrets"
  };
}
async function importAsset(env, store2, entry) {
  const ref = classify(store2, entry.key);
  if (!ref) return { key: entry.key, outcome: "skipped", reason: "\u6C92\u6709\u5C0D\u61C9\u7684\u8CC7\u6599\u578B\u5225\uFF08\u4E0D\u662F\u8CC7\u7522\uFF0C\u4E5F\u4E0D\u662F\u7B97\u5F97\u51FA\u4F86\u7684\u7D22\u5F15\uFF09" };
  if (ref.kind === "derived") return { key: entry.key, outcome: "skipped", reason: "\u884D\u751F\u7D22\u5F15\uFF0C\u7531\u8CC7\u7522\u672C\u8EAB\u91CD\u7B97" };
  const kv = store2 === "WEBHOOKS" ? env.WEBHOOKS : env.RECIPES;
  await kv.put(entry.key, entry.value);
  if (store2 === "WEBHOOKS" && ref.tpl === "workflow") {
    let cron = "";
    try {
      cron = String(JSON.parse(entry.value).cron_expr ?? "");
    } catch {
    }
    if (cron) {
      const wfAt = entry.key.indexOf(":wf:");
      await updateCronIndexEntry(env.WEBHOOKS, entry.key.slice(0, wfAt), entry.key.slice(wfAt + 4), cron);
    }
  }
  return { key: entry.key, outcome: "imported" };
}
async function importConsoleCredentials(env, raw2, cfToken) {
  const key = "console:credentials";
  let rec;
  try {
    const parsed = JSON.parse(raw2);
    if (!parsed.email || !parsed.salt || !parsed.hash) throw new Error("\u7F3A email\uFF0Fsalt\uFF0Fhash");
    rec = { email: parsed.email, salt: parsed.salt, hash: parsed.hash, created_at: parsed.created_at ?? (/* @__PURE__ */ new Date()).toISOString() };
  } catch (e) {
    return { key, outcome: "failed", reason: `\u820A\u5E33\u5BC6\u5167\u5BB9\u8B80\u4E0D\u61C2\uFF1A${e instanceof Error ? e.message : String(e)}` };
  }
  let wrote = false;
  try {
    wrote = (await migrateConsoleCredentials(env, rec, cfToken)).migrated;
  } catch (e) {
    return { key, outcome: "failed", reason: `\u5BEB\u4E0D\u9032\u8A8D\u8B49\u5132\u5B58\uFF08Workers Secrets\uFF09\uFF1A${e instanceof Error ? e.message : String(e)}` };
  }
  return wrote ? { key, outcome: "imported" } : { key, outcome: "skipped", reason: "\u65B0\u5BB6\u5DF2\u7D93\u6709\u4E00\u7D44\u7BA1\u7406\u54E1\u5E33\u5BC6\uFF08\u6BD4\u820A KV \u90A3\u4EFD\u65B0\uFF09\uFF0C\u4E0D\u8986\u84CB" };
}
storageRouter.post("/storage/import-kv", async (c) => {
  const expected = c.env.KBDB_INTERNAL_TOKEN ?? "";
  if (!expected) return c.json({ error: "\u9019\u53F0\u5BE6\u4F8B\u6C92\u6709\u8A2D\u5B9A\u670D\u52D9\u5167\u90E8\u91D1\u9470\uFF08KBDB_INTERNAL_TOKEN\uFF09\uFF0C\u7121\u6CD5\u9A57\u8B49\u642C\u9077\u8ACB\u6C42" }, 503);
  const got = (c.req.header("authorization") ?? "").match(/^Bearer\s+(\S+)/i)?.[1] ?? "";
  if (!got || !constantTimeEqual(got, expected)) return c.json({ error: "unauthorized" }, 401);
  const body = await c.req.json().catch(() => null);
  const ns = String(body?.namespace ?? "");
  const entries = Array.isArray(body?.entries) ? body.entries : null;
  if (!ns || !entries) return c.json({ error: "body \u9700\u8981 {namespace, entries:[{key,value}]}" }, 400);
  if (entries.some((e) => typeof e?.key !== "string" || typeof e?.value !== "string")) {
    return c.json({ error: "entries \u6BCF\u4E00\u7B46\u90FD\u8981\u6709\u5B57\u4E32 key \u8207\u5B57\u4E32 value" }, 400);
  }
  if (entries.length > IMPORT_BATCH_MAX) {
    return c.json({ error: `\u4E00\u6B21\u6700\u591A ${IMPORT_BATCH_MAX} \u7B46\uFF08\u5206\u6279\u9001\uFF0C\u907F\u514D\u649E Cloudflare \u6BCF\u8ACB\u6C42 subrequest \u4E0A\u9650\uFF09`, batch_max: IMPORT_BATCH_MAX }, 413);
  }
  const cfToken = c.req.header("x-cf-secrets-token") || void 0;
  const results = [];
  for (const entry of entries) {
    try {
      if (ns === "WEBHOOKS" || ns === "RECIPES") {
        results.push(await importAsset(c.env, ns, entry));
      } else if (ns === "SESSIONS_KV") {
        const o = sessionsKeyOutcome(entry.key);
        results.push(o === "console" ? await importConsoleCredentials(c.env, entry.value, cfToken) : o);
      } else if (ns === "CREDENTIALS_KV") {
        results.push(credentialsKeyOutcome(entry.key));
      } else if (TRANSIENT_NAMESPACES[ns]) {
        results.push({ key: entry.key, outcome: "skipped", reason: TRANSIENT_NAMESPACES[ns] });
      } else {
        results.push({ key: entry.key, outcome: "skipped", reason: `\u4E0D\u8A8D\u5F97\u7684 namespace\u300C${ns}\u300D` });
      }
    } catch (e) {
      results.push({ key: entry.key, outcome: "failed", reason: e instanceof Error ? e.message : String(e) });
    }
  }
  const count = (o) => results.filter((r) => r.outcome === o).length;
  const failed = count("failed");
  return c.json(
    { success: failed === 0, namespace: ns, imported: count("imported"), skipped: count("skipped"), failed, results },
    failed === 0 ? 200 : 207
  );
});
storageRouter.post("/storage/move-portal-passwords", async (c) => {
  const expected = c.env.KBDB_INTERNAL_TOKEN ?? "";
  if (!expected) return c.json({ error: "\u9019\u53F0\u5BE6\u4F8B\u6C92\u6709\u8A2D\u5B9A\u670D\u52D9\u5167\u90E8\u91D1\u9470\uFF08KBDB_INTERNAL_TOKEN\uFF09" }, 503);
  const got = (c.req.header("authorization") ?? "").match(/^Bearer\s+(\S+)/i)?.[1] ?? "";
  if (!got || !constantTimeEqual(got, expected)) return c.json({ error: "unauthorized" }, 401);
  try {
    const r = await movePortalPasswordsToAuthStore(c.env, c.req.header("x-cf-secrets-token") || void 0);
    return c.json({ success: true, ...r });
  } catch (e) {
    return c.json({ success: false, error: e instanceof Error ? e.message : String(e) }, 502);
  }
});

// cypher-executor/src/routes/help.ts
init_dist();
var helpRouter = new Hono2();
function origin(reqUrl) {
  return new URL(reqUrl).origin;
}
helpRouter.get(
  "/e",
  (c) => c.html(renderFaqHtml(origin(c.req.url)))
);
helpRouter.get(
  "/e/:code",
  (c) => c.html(renderFaqHtml(origin(c.req.url), c.req.param("code")))
);

// cypher-executor/src/routes/internal-cron.ts
init_dist();
var internalCronRouter = new Hono2();
internalCronRouter.post("/internal/cron/tick", async (c) => {
  const expected = String(c.env.CRON_TRIGGER_TOKEN ?? "").trim();
  if (!expected) {
    return c.json(
      { success: false, error: "cron_trigger_disabled", message: "CRON_TRIGGER_TOKEN \u672A\u8A2D\u5B9A\uFF1A\u9019\u500B\u5BE6\u4F8B\u6C92\u6709\u958B\u5916\u90E8\u6392\u7A0B\u5165\u53E3\uFF08CF \u96F2\u7531 [triggers].crons \u8CA0\u8CAC\uFF09" },
      503
    );
  }
  const auth = c.req.header("Authorization") ?? "";
  const got = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  if (!got || !constantTimeEqual(got, expected)) return c.json({ error: "unauthorized" }, 401);
  const scheduledTime = Math.floor(Date.now() / 6e4) * 6e4;
  const controller = { scheduledTime, cron: "external", noRetry() {
  } };
  await handleScheduled(controller, c.env, c.executionCtx);
  return c.json({ success: true, scheduled_at: new Date(scheduledTime).toISOString() });
});

// cypher-executor/src/routes/ui-components.ts
init_dist();

// cypher-executor/src/lib/ui-catalog.generated.json
var ui_catalog_generated_default = {
  _generated: "\u7531 console-ui/a2ui/build.mjs \u5F9E registry/ui-components/*/component.contract.yaml \u7522\u751F\u2014\u2014\u52FF\u624B\u6539\uFF0C\u6539\u539F\u7A3F\u5F8C\u91CD\u8DD1",
  catalog_id: "arcrun:catalog/v0",
  protocol_version: "v0.9",
  components: [
    {
      canonical_id: "ui_button",
      display_name: "\u6309\u9215",
      kind: "ui",
      category: "ui",
      version: "v1",
      stability: "floating",
      runtime_compat: [
        "browser"
      ],
      a2ui: {
        component: "Button",
        implementation: "a2ui-basic"
      },
      description: "\u6309\u4E0B\u53BB\u9001\u51FA\u4E00\u500B\u4E8B\u4EF6\u540D\u7A31\uFF08\u53EF\u5E36\u53C3\u6578\uFF09\u3002\u6309\u9215\u672C\u8EAB\u4E0D\u542B\u908F\u8F2F\uFF1A\u8981\u89F8\u767C\u54EA\u500B\u5DE5\u4F5C\u6D41\uFF0C\u7531\u4F3A\u670D\u5668\u7AEF\u7684\u52D5\u4F5C\u767D\u540D\u55AE\u6C7A\u5B9A\u3002",
      renders: "\u4E00\u9846\u6309\u9215\uFF0C\u4E0A\u9762\u7684\u5B57\u7531\u5B50\u5143\u4EF6\uFF08\u901A\u5E38\u662F\u4E00\u500B Text\uFF09\u6C7A\u5B9A\uFF1Bvariant \u70BA primary \u6642\u662F\u4E3B\u8981\u52D5\u4F5C\u7684\u6A23\u5F0F\u3002",
      data_inputs: [
        {
          name: "child",
          what: "\u6309\u9215\u4E0A\u986F\u793A\u7684\u5B50\u5143\u4EF6 id\uFF08\u901A\u5E38\u662F Text\uFF09"
        },
        {
          name: "action",
          what: '{"event": {"name": "\u4E8B\u4EF6\u540D\u7A31", "context": {"\u53C3\u6578": {"path": "/\u6B04\u4F4D"}}}}\u2014\u2014context \u7684\u503C\u53EF\u4EE5\u7D81\u8CC7\u6599'
        }
      ],
      interactions: [
        {
          event: "action.event",
          what: "\u6309\u4E0B\u6642\u9001\u51FA {name, context}\u3002Portal \u628A\u5B83\u8F49\u7D66\u5BBF\u4E3B\uFF08App \u7684\u52D5\u4F5C\u767D\u540D\u55AE\u7AEF\u9EDE\uFF09\uFF1B\u756B\u9762\u5B9A\u7FA9\u88E1\u4E0D\u51C6\u5BEB\u7DB2\u5740\u3001\u8DEF\u5F91\u6216\u6307\u4EE4"
        }
      ],
      states: {
        loading: "\u6309\u9215\u7ACB\u5373\u53EF\u6309\uFF1B\u9001\u51FA\u5F8C\u7684\u7B49\u5F85\u72C0\u614B\u7531\u5BBF\u4E3B\u986F\u793A",
        empty: "\u6C92\u6709 child \u6642\u662F\u4E00\u9846\u6C92\u6709\u5B57\u7684\u6309\u9215\uFF08child \u5FC5\u586B\uFF0C\u9A57\u8B49\u6703\u64CB\uFF09",
        error: "\u5BBF\u4E3B\u56DE\u932F\u8AA4\u6642\u7531\u5BBF\u4E3B\u986F\u793A\uFF0C\u6309\u9215\u672C\u8EAB\u4E0D\u8B8A",
        disabled: "checks \u4E0D\u901A\u904E\u6642\u6309\u9215\u505C\u7528",
        narrow: "\u6309\u9215\u5BEC\u5EA6\u8DDF\u8457\u5B57\uFF0C\u4E0D\u6703\u6490\u7834\u7248\u9762"
      },
      gherkin_tests: [
        {
          scenario: "\u6309\u9215\u4E0A\u7684\u5B57",
          given: '{"components":[{"id":"root","component":"Button","child":"l","action":{"event":{"name":"refresh"}}},{"id":"l","component":"Text","text":"\u91CD\u65B0\u6574\u7406"}]}',
          then_contains: "\u91CD\u65B0\u6574\u7406"
        },
        {
          scenario: "\u4E3B\u8981\u52D5\u4F5C\u6A23\u5F0F\u7684\u6309\u9215",
          given: '{"components":[{"id":"root","component":"Button","child":"l","variant":"primary","action":{"event":{"name":"run","context":{"id":{"path":"/id"}}}}},{"id":"l","component":"Text","text":"\u57F7\u884C"}],"data":{"id":"wf-1"}}',
          then_contains: "\u57F7\u884C"
        }
      ],
      tags: [
        "ui",
        "a2ui",
        "button",
        "action",
        "event"
      ],
      example: '{ "id": "refresh", "component": "Button", "child": "refresh-label", "action": { "event": { "name": "refresh" } } }\n',
      source: "registry/ui-components/button/component.contract.yaml",
      input_schema: {
        type: "object",
        properties: {
          id: {
            $ref: "#/$defs/ComponentId"
          },
          accessibility: {
            $ref: "#/$defs/AccessibilityAttributes"
          },
          weight: {
            type: "number",
            description: "The relative weight of this component within a Row or Column. This is similar to the CSS 'flex-grow' property. Note: this may ONLY be set when the component is a direct descendant of a Row or Column."
          },
          checks: {
            type: "array",
            items: {
              $ref: "#/$defs/CheckRule",
              description: "A single validation rule applied to an input component."
            },
            description: "A list of checks to perform. These are function calls that must return a boolean indicating validity."
          },
          child: {
            $ref: "#/$defs/ComponentId",
            description: "The ID of the child component. Use a 'Text' component for a labeled button. Only use an 'Icon' if the requirements explicitly ask for an icon-only button."
          },
          variant: {
            type: "string",
            enum: [
              "default",
              "primary",
              "borderless"
            ],
            default: "default",
            description: "A hint for the button style. If omitted, a default button style is used. 'primary' indicates this is the main call-to-action button. 'borderless' means the button has no visual border or background, making its child content appear like a clickable link."
          },
          action: {
            $ref: "#/$defs/Action"
          },
          component: {
            const: "Button"
          }
        },
        required: [
          "id",
          "child",
          "action",
          "component"
        ],
        unevaluatedProperties: false
      }
    },
    {
      canonical_id: "ui_card",
      display_name: "\u5361\u7247",
      kind: "ui",
      category: "ui",
      version: "v1",
      stability: "floating",
      runtime_compat: [
        "browser"
      ],
      a2ui: {
        component: "Card",
        implementation: "a2ui-basic"
      },
      description: "\u6709\u5916\u6846\u7684\u5340\u584A\uFF0C\u628A\u4E00\u7D44\u76F8\u95DC\u5167\u5BB9\u6846\u5728\u4E00\u8D77\uFF08\u4E00\u5247\u5DE5\u4F5C\u6D41\u3001\u4E00\u5F35\u7968\u3001\u4E00\u7B46\u932F\u8AA4\uFF09\u3002",
      renders: "\u4E00\u500B\u5E36\u5916\u6846\u8207\u5167\u8DDD\u7684\u65B9\u584A\uFF0C\u88E1\u9762\u653E\u4E00\u500B\u5B50\u5143\u4EF6\uFF1B\u8981\u653E\u591A\u500B\u6771\u897F\u6642\uFF0C\u5B50\u5143\u4EF6\u7528 Column \u6216 Row \u5305\u8D77\u4F86\u3002",
      data_inputs: [
        {
          name: "child",
          what: "\u8981\u6846\u8D77\u4F86\u7684\u90A3\u4E00\u500B\u5B50\u5143\u4EF6\u7684 id\uFF08\u4E0D\u662F\u8CC7\u6599\uFF0C\u662F\u7248\u9762\uFF09"
        }
      ],
      interactions: [],
      states: {
        loading: "\u5916\u6846\u7167\u5E38\u51FA\u73FE\uFF0C\u88E1\u9762\u7531\u5B50\u5143\u4EF6\u81EA\u5DF1\u986F\u793A\u8F09\u5165\u4E2D",
        empty: "\u6C92\u6709\u5B50\u5143\u4EF6\u5C31\u4E0D\u6703\u51FA\u73FE\uFF08child \u5FC5\u586B\uFF09",
        error: "\u5B50\u5143\u4EF6 id \u4E0D\u5B58\u5728\u6642\uFF0C\u6E32\u67D3\u5668\u5728\u4E3B\u63A7\u53F0\u5831\u932F\u3001\u90A3\u4E00\u683C\u7559\u767D\uFF0C\u4E0D\u6703\u6574\u9801\u58DE\u6389",
        disabled: "\u5361\u7247\u672C\u8EAB\u6C92\u6709\u505C\u7528\u72C0\u614B",
        narrow: "\u5BEC\u5EA6\u8DDF\u8457\u5BB9\u5668\u7E2E\uFF0C\u5167\u5BB9\u81EA\u52D5\u63DB\u884C"
      },
      gherkin_tests: [
        {
          scenario: "\u5361\u7247\u6846\u4F4F\u4E00\u6BB5\u6587\u5B57",
          given: '{"components":[{"id":"root","component":"Card","child":"t"},{"id":"t","component":"Text","text":"\u6846\u5728\u5361\u7247\u88E1"}]}',
          then_contains: "\u6846\u5728\u5361\u7247\u88E1"
        },
        {
          scenario: "\u5361\u7247\u88E1\u7684\u6587\u5B57\u53EF\u4EE5\u7D81\u8CC7\u6599",
          given: '{"components":[{"id":"root","component":"Card","child":"t"},{"id":"t","component":"Text","text":{"path":"/title"}}],"data":{"title":"\u5F9E\u8CC7\u6599\u4F86\u7684\u6A19\u984C"}}',
          then_contains: "\u5F9E\u8CC7\u6599\u4F86\u7684\u6A19\u984C"
        }
      ],
      tags: [
        "ui",
        "a2ui",
        "layout",
        "container",
        "card"
      ],
      example: '{ "id": "wf-card", "component": "Card", "child": "wf-body" }\n',
      source: "registry/ui-components/card/component.contract.yaml",
      input_schema: {
        type: "object",
        properties: {
          id: {
            $ref: "#/$defs/ComponentId"
          },
          accessibility: {
            $ref: "#/$defs/AccessibilityAttributes"
          },
          weight: {
            type: "number",
            description: "The relative weight of this component within a Row or Column. This is similar to the CSS 'flex-grow' property. Note: this may ONLY be set when the component is a direct descendant of a Row or Column."
          },
          child: {
            $ref: "#/$defs/ComponentId",
            description: "The ID of the single child component to be rendered inside the card. To display multiple elements, you MUST wrap them in a layout component (like Column or Row) and pass that container's ID here. Do NOT pass multiple IDs or a non-existent ID."
          },
          component: {
            const: "Card"
          }
        },
        required: [
          "id",
          "child",
          "component"
        ],
        unevaluatedProperties: false
      }
    },
    {
      canonical_id: "ui_column",
      display_name: "\u76F4\u6392",
      kind: "ui",
      category: "ui",
      version: "v1",
      stability: "floating",
      runtime_compat: [
        "browser"
      ],
      a2ui: {
        component: "Column",
        implementation: "a2ui-basic"
      },
      description: "\u628A\u5E7E\u500B\u5143\u4EF6\u7531\u4E0A\u5F80\u4E0B\u6392\u3002\u6574\u500B\u756B\u9762\u7684\u9AA8\u67B6\u901A\u5E38\u662F\u4E00\u500B\u76F4\u6392\u3002",
      renders: "\u4E00\u6B04\uFF0C\u5B50\u5143\u4EF6\u4F9D\u5E8F\u5F80\u4E0B\u5806\uFF0Cjustify\uFF0Falign \u63A7\u5236\u9593\u8DDD\u8207\u5C0D\u9F4A\u3002",
      data_inputs: [
        {
          name: "children",
          what: '\u5B50\u5143\u4EF6\u7684 id \u6E05\u55AE\uFF1B\u6216\u6A23\u677F {"componentId": "\u2026", "path": "/\u6E05\u55AE"}\uFF0C\u8CC7\u6599\u9663\u5217\u6709\u5E7E\u7B46\u5C31\u9577\u5E7E\u500B'
        }
      ],
      interactions: [],
      states: {
        loading: "\u5B50\u5143\u4EF6\u5404\u81EA\u986F\u793A",
        empty: "\u7D81\u5230\u7684\u6E05\u55AE\u662F\u7A7A\u9663\u5217\u6642\u4EC0\u9EBC\u90FD\u4E0D\u756B\uFF08\u8981\u986F\u793A\u300C\u6C92\u6709\u8CC7\u6599\u300D\u8ACB\u53E6\u653E\u4E00\u500B Text\uFF09",
        error: "\u67D0\u500B\u5B50\u5143\u4EF6 id \u4E0D\u5B58\u5728\u6642\u53EA\u5C11\u90A3\u4E00\u683C",
        disabled: "\u6C92\u6709\u505C\u7528\u72C0\u614B",
        narrow: "\u672C\u4F86\u5C31\u662F\u55AE\u6B04\uFF0C\u7A84\u87A2\u5E55\u4E0D\u8B8A\u5F62"
      },
      gherkin_tests: [
        {
          scenario: "\u5169\u6BB5\u6587\u5B57\u4E0A\u4E0B\u6392",
          given: '{"components":[{"id":"root","component":"Column","children":["a","b"]},{"id":"a","component":"Text","text":"\u7B2C\u4E00\u884C"},{"id":"b","component":"Text","text":"\u7B2C\u4E8C\u884C"}]}',
          then_contains: "\u7B2C\u4E8C\u884C"
        },
        {
          scenario: "\u7528\u8CC7\u6599\u9663\u5217\u9577\u51FA\u5B50\u5143\u4EF6",
          given: '{"components":[{"id":"root","component":"Column","children":{"componentId":"item","path":"/items"}},{"id":"item","component":"Text","text":{"path":"name"}}],"data":{"items":[{"name":"\u7532"},{"name":"\u4E59"}]}}',
          then_contains: "\u4E59"
        }
      ],
      tags: [
        "ui",
        "a2ui",
        "layout",
        "column",
        "stack"
      ],
      example: '{ "id": "page", "component": "Column", "children": ["title", "list"] }\n',
      source: "registry/ui-components/column/component.contract.yaml",
      input_schema: {
        type: "object",
        properties: {
          id: {
            $ref: "#/$defs/ComponentId"
          },
          accessibility: {
            $ref: "#/$defs/AccessibilityAttributes"
          },
          weight: {
            type: "number",
            description: "The relative weight of this component within a Row or Column. This is similar to the CSS 'flex-grow' property. Note: this may ONLY be set when the component is a direct descendant of a Row or Column."
          },
          children: {
            $ref: "#/$defs/ChildList",
            description: "Defines the children. Use an array of strings for a fixed set of children, or a template object to generate children from a data list. Children cannot be defined inline, they must be referred to by ID."
          },
          justify: {
            type: "string",
            enum: [
              "start",
              "center",
              "end",
              "spaceBetween",
              "spaceAround",
              "spaceEvenly",
              "stretch"
            ],
            default: "start",
            description: "Defines the arrangement of children along the main axis (vertically). Use 'spaceBetween' to push items to the edges (e.g. header at top, footer at bottom), or 'start'/'end'/'center' to pack them together."
          },
          align: {
            type: "string",
            enum: [
              "center",
              "end",
              "start",
              "stretch"
            ],
            default: "stretch",
            description: "Defines the alignment of children along the cross axis (horizontally). This is similar to the CSS 'align-items' property."
          },
          component: {
            const: "Column"
          }
        },
        required: [
          "id",
          "children",
          "component"
        ],
        unevaluatedProperties: false
      }
    },
    {
      canonical_id: "ui_list",
      display_name: "\u6E05\u55AE",
      kind: "ui",
      category: "ui",
      version: "v1",
      stability: "floating",
      runtime_compat: [
        "browser"
      ],
      a2ui: {
        component: "List",
        implementation: "a2ui-basic"
      },
      description: "\u628A\u4E00\u500B\u8CC7\u6599\u9663\u5217\u5C55\u958B\u6210\u91CD\u8907\u7684\u9805\u76EE\uFF1A\u6BCF\u4E00\u7B46\u8CC7\u6599\u9577\u4E00\u500B\u540C\u6A23\u7684\u6A23\u677F\uFF08\u4F8B\u5982\u6BCF\u689D\u5DE5\u4F5C\u6D41\u4E00\u5F35\u5361\uFF09\u3002",
      renders: "\u4E00\u4E32\u76F4\u5411\uFF08\u6216\u6A6B\u5411\uFF09\u6392\u5217\u7684\u9805\u76EE\uFF0C\u6BCF\u4E00\u9805\u90FD\u662F\u540C\u4E00\u500B\u6A23\u677F\u5143\u4EF6\uFF0C\u6A23\u677F\u88E1\u7528\u76F8\u5C0D\u8DEF\u5F91\u8B80\u90A3\u4E00\u7B46\u7684\u6B04\u4F4D\u3002",
      data_inputs: [
        {
          name: "children",
          what: '\u6A23\u677F {"componentId": "\u6BCF\u4E00\u9805\u7684\u5143\u4EF6 id", "path": "/\u8CC7\u6599\u9663\u5217"}\uFF1B\u6A23\u677F\u88E1\u7684 {"path": "name"} \u8B80\u7684\u662F\u90A3\u4E00\u7B46\u7684 name'
        }
      ],
      interactions: [],
      states: {
        loading: "\u9663\u5217\u9084\u6C92\u5230\u6642\u4E0D\u756B\u4EFB\u4F55\u9805\u76EE",
        empty: "\u7A7A\u9663\u5217\u6642\u4E0D\u756B\u4EFB\u4F55\u9805\u76EE\uFF08\u300C\u6C92\u6709\u8CC7\u6599\u300D\u7684\u5B57\u8981\u53E6\u653E\u4E00\u500B Text\uFF0C\u756B\u9762\u5B9A\u7FA9\u81EA\u5DF1\u6C7A\u5B9A\u8981\u4E0D\u8981\u986F\u793A\uFF09",
        error: "\u67D0\u4E00\u7B46\u7F3A\u6B04\u4F4D\u6642\uFF0C\u90A3\u4E00\u7B46\u7684\u5C0D\u61C9\u6587\u5B57\u662F\u7A7A\u7684\uFF0C\u5176\u4ED6\u7B46\u7167\u5E38",
        disabled: "\u6C92\u6709\u505C\u7528\u72C0\u614B",
        narrow: "\u76F4\u5411\u6E05\u55AE\u4E0D\u53D7\u5F71\u97FF\uFF1B\u6A6B\u5411\u6E05\u55AE\u6703\u51FA\u73FE\u6C34\u5E73\u6372\u52D5"
      },
      gherkin_tests: [
        {
          scenario: "\u6BCF\u7B46\u8CC7\u6599\u9577\u4E00\u9805",
          given: '{"components":[{"id":"root","component":"List","children":{"componentId":"row","path":"/workflows"}},{"id":"row","component":"Text","text":{"path":"name"}}],"data":{"workflows":[{"name":"notify_daily"},{"name":"ingest_docs"}]}}',
          then_contains: "ingest_docs"
        },
        {
          scenario: "\u6A23\u677F\u53EF\u4EE5\u662F\u4E00\u5F35\u5361",
          given: '{"components":[{"id":"root","component":"List","children":{"componentId":"card","path":"/items"}},{"id":"card","component":"Card","child":"t"},{"id":"t","component":"Text","text":{"path":"title"}}],"data":{"items":[{"title":"\u7B2C\u4E00\u5F35\u5361"}]}}',
          then_contains: "\u7B2C\u4E00\u5F35\u5361"
        }
      ],
      tags: [
        "ui",
        "a2ui",
        "list",
        "repeat",
        "collection"
      ],
      example: '{ "id": "wf-list", "component": "List", "children": { "componentId": "wf-card", "path": "/workflows" } }\n',
      source: "registry/ui-components/list/component.contract.yaml",
      input_schema: {
        type: "object",
        properties: {
          id: {
            $ref: "#/$defs/ComponentId"
          },
          accessibility: {
            $ref: "#/$defs/AccessibilityAttributes"
          },
          weight: {
            type: "number",
            description: "The relative weight of this component within a Row or Column. This is similar to the CSS 'flex-grow' property. Note: this may ONLY be set when the component is a direct descendant of a Row or Column."
          },
          children: {
            $ref: "#/$defs/ChildList",
            description: "Defines the children. Use an array of strings for a fixed set of children, or a template object to generate children from a data list."
          },
          direction: {
            type: "string",
            enum: [
              "vertical",
              "horizontal"
            ],
            default: "vertical",
            description: "The direction in which the list items are laid out."
          },
          align: {
            type: "string",
            enum: [
              "start",
              "center",
              "end",
              "stretch"
            ],
            default: "stretch",
            description: "Defines the alignment of children along the cross axis."
          },
          component: {
            const: "List"
          }
        },
        required: [
          "id",
          "children",
          "component"
        ],
        unevaluatedProperties: false
      }
    },
    {
      canonical_id: "ui_row",
      display_name: "\u6A6B\u6392",
      kind: "ui",
      category: "ui",
      version: "v1",
      stability: "floating",
      runtime_compat: [
        "browser"
      ],
      a2ui: {
        component: "Row",
        implementation: "a2ui-basic"
      },
      description: "\u628A\u5E7E\u500B\u5143\u4EF6\u7531\u5DE6\u5F80\u53F3\u6392\uFF0C\u4F8B\u5982\u300C\u540D\u7A31\uFF5C\u6392\u7A0B\uFF5C\u6700\u8FD1\u4E00\u6B21\u7D50\u679C\u300D\u653E\u5728\u540C\u4E00\u884C\u3002",
      renders: "\u4E00\u5217\uFF0C\u5B50\u5143\u4EF6\u5DE6\u53F3\u4E26\u6392\uFF0Cjustify \u6C7A\u5B9A\u64E0\u5728\u4E00\u8D77\u6216\u63A8\u5230\u5169\u7AEF\uFF08spaceBetween\uFF09\u3002",
      data_inputs: [
        {
          name: "children",
          what: '\u5B50\u5143\u4EF6\u7684 id \u6E05\u55AE\uFF1B\u6216\u6A23\u677F {"componentId": "\u2026", "path": "/\u6E05\u55AE"}'
        }
      ],
      interactions: [],
      states: {
        loading: "\u5B50\u5143\u4EF6\u5404\u81EA\u986F\u793A",
        empty: "\u6C92\u6709\u5B50\u5143\u4EF6\u6642\u662F\u4E00\u689D\u7A7A\u5217",
        error: "\u67D0\u500B\u5B50\u5143\u4EF6 id \u4E0D\u5B58\u5728\u6642\u53EA\u5C11\u90A3\u4E00\u683C",
        disabled: "\u6C92\u6709\u505C\u7528\u72C0\u614B",
        narrow: "\u5B50\u5143\u4EF6\u5BEC\u5EA6\u7E2E\u5C0F\uFF1B\u5167\u5BB9\u592A\u9577\u6642\u6587\u5B57\u63DB\u884C"
      },
      gherkin_tests: [
        {
          scenario: "\u540D\u7A31\u8207\u72C0\u614B\u4E26\u6392",
          given: '{"components":[{"id":"root","component":"Row","children":["n","s"],"justify":"spaceBetween"},{"id":"n","component":"Text","text":"\u6BCF\u65E5\u5F59\u6574"},{"id":"s","component":"Text","text":"success"}]}',
          then_contains: "\u6BCF\u65E5\u5F59\u6574"
        },
        {
          scenario: "\u4E26\u6392\u7684\u7B2C\u4E8C\u683C\u4E5F\u756B\u5F97\u51FA\u4F86",
          given: '{"components":[{"id":"root","component":"Row","children":["n","s"]},{"id":"n","component":"Text","text":"A"},{"id":"s","component":"Text","text":"\u53F3\u908A\u90A3\u683C"}]}',
          then_contains: "\u53F3\u908A\u90A3\u683C"
        }
      ],
      tags: [
        "ui",
        "a2ui",
        "layout",
        "row",
        "inline"
      ],
      example: '{ "id": "wf-head", "component": "Row", "children": ["wf-name", "wf-last"], "justify": "spaceBetween" }\n',
      source: "registry/ui-components/row/component.contract.yaml",
      input_schema: {
        type: "object",
        properties: {
          id: {
            $ref: "#/$defs/ComponentId"
          },
          accessibility: {
            $ref: "#/$defs/AccessibilityAttributes"
          },
          weight: {
            type: "number",
            description: "The relative weight of this component within a Row or Column. This is similar to the CSS 'flex-grow' property. Note: this may ONLY be set when the component is a direct descendant of a Row or Column."
          },
          children: {
            $ref: "#/$defs/ChildList",
            description: "Defines the children. Use an array of strings for a fixed set of children, or a template object to generate children from a data list. Children cannot be defined inline, they must be referred to by ID."
          },
          justify: {
            type: "string",
            enum: [
              "center",
              "end",
              "spaceAround",
              "spaceBetween",
              "spaceEvenly",
              "start",
              "stretch"
            ],
            default: "start",
            description: "Defines the arrangement of children along the main axis (horizontally). Use 'spaceBetween' to push items to the edges, or 'start'/'end'/'center' to pack them together."
          },
          align: {
            type: "string",
            enum: [
              "start",
              "center",
              "end",
              "stretch"
            ],
            default: "stretch",
            description: "Defines the alignment of children along the cross axis (vertically). This is similar to the CSS 'align-items' property, but uses camelCase values (e.g., 'start')."
          },
          component: {
            const: "Row"
          }
        },
        required: [
          "id",
          "children",
          "component"
        ],
        unevaluatedProperties: false
      }
    },
    {
      canonical_id: "ui_text",
      display_name: "\u6587\u5B57",
      kind: "ui",
      category: "ui",
      version: "v1",
      stability: "floating",
      runtime_compat: [
        "browser"
      ],
      a2ui: {
        component: "Text",
        implementation: "a2ui-basic"
      },
      description: "\u986F\u793A\u4E00\u6BB5\u6587\u5B57\uFF1A\u6A19\u984C\u3001\u5167\u6587\u3001\u6578\u5B57\u3001\u8A3B\u8A18\u3002\u5167\u5BB9\u53EF\u4EE5\u5BEB\u6B7B\uFF0C\u4E5F\u53EF\u4EE5\u7D81\u5230\u8CC7\u6599\u4E0A\u7684\u67D0\u500B\u6B04\u4F4D\u3002",
      renders: "\u4E00\u884C\u6216\u4E00\u6BB5\u6587\u5B57\uFF0Cvariant \u6C7A\u5B9A\u5927\u5C0F\uFF08h1\u2013h5 \u6A19\u984C\u3001body \u5167\u6587\u3001caption \u5C0F\u5B57\u8A3B\u8A18\uFF09\u3002",
      data_inputs: [
        {
          name: "text",
          what: '\u8981\u986F\u793A\u7684\u5B57\u3002\u5BEB\u6B7B\u5C31\u662F\u5B57\u4E32\uFF1B\u8981\u5F9E\u8CC7\u6599\u4F86\u5C31\u5BEB {"path": "/\u6B04\u4F4D"}\uFF0C\u5728 List \u7684\u6A23\u677F\u88E1\u7528\u76F8\u5C0D\u8DEF\u5F91\uFF08\u4F8B {"path": "name"}\uFF09'
        }
      ],
      interactions: [],
      states: {
        loading: "\u8CC7\u6599\u9084\u6C92\u5230\u6642\u986F\u793A\u7A7A\u5B57\u4E32\uFF0C\u4E0D\u986F\u793A undefined",
        empty: "\u7D81\u5230\u7684\u6B04\u4F4D\u4E0D\u5B58\u5728\u6642\u986F\u793A\u7A7A\u5B57\u4E32",
        error: "\u4E0D\u6703\u4E1F\u932F\uFF1B\u756B\u4E0D\u51FA\u4F86\u7684\u503C\u4E00\u5F8B\u7576\u7A7A\u5B57\u4E32",
        disabled: "\u6587\u5B57\u672C\u8EAB\u6C92\u6709\u505C\u7528\u72C0\u614B",
        narrow: "\u81EA\u52D5\u63DB\u884C"
      },
      gherkin_tests: [
        {
          scenario: "\u5BEB\u6B7B\u7684\u6A19\u984C",
          given: '{"components":[{"id":"root","component":"Text","text":"\u5DE5\u4F5C\u6D41","variant":"h2"}]}',
          then_contains: "\u5DE5\u4F5C\u6D41"
        },
        {
          scenario: "\u7D81\u8CC7\u6599\u7684\u6578\u5B57",
          given: '{"components":[{"id":"root","component":"Text","text":{"path":"/count"}}],"data":{"count":"\u5171 3 \u689D"}}',
          then_contains: "\u5171 3 \u689D"
        }
      ],
      tags: [
        "ui",
        "a2ui",
        "text",
        "label",
        "heading"
      ],
      example: '{ "id": "wf-name", "component": "Text", "text": { "path": "name" }, "variant": "h3" }\n',
      source: "registry/ui-components/text/component.contract.yaml",
      input_schema: {
        type: "object",
        properties: {
          id: {
            $ref: "#/$defs/ComponentId"
          },
          accessibility: {
            $ref: "#/$defs/AccessibilityAttributes"
          },
          weight: {
            type: "number",
            description: "The relative weight of this component within a Row or Column. This is similar to the CSS 'flex-grow' property. Note: this may ONLY be set when the component is a direct descendant of a Row or Column."
          },
          text: {
            $ref: "#/$defs/DynamicString",
            description: "The text content to display. While simple Markdown formatting is supported (i.e. without HTML, images, or links), utilizing dedicated UI components is generally preferred for a richer and more structured presentation."
          },
          variant: {
            type: "string",
            enum: [
              "h1",
              "h2",
              "h3",
              "h4",
              "h5",
              "caption",
              "body"
            ],
            default: "body",
            description: "A hint for the base text style."
          },
          component: {
            const: "Text"
          }
        },
        required: [
          "id",
          "text",
          "component"
        ],
        unevaluatedProperties: false
      }
    }
  ],
  a2ui_catalog: {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    catalogId: "arcrun:catalog/v0",
    components: {
      Button: {
        type: "object",
        properties: {
          id: {
            $ref: "#/$defs/ComponentId"
          },
          accessibility: {
            $ref: "#/$defs/AccessibilityAttributes"
          },
          weight: {
            type: "number",
            description: "The relative weight of this component within a Row or Column. This is similar to the CSS 'flex-grow' property. Note: this may ONLY be set when the component is a direct descendant of a Row or Column."
          },
          checks: {
            type: "array",
            items: {
              $ref: "#/$defs/CheckRule",
              description: "A single validation rule applied to an input component."
            },
            description: "A list of checks to perform. These are function calls that must return a boolean indicating validity."
          },
          child: {
            $ref: "#/$defs/ComponentId",
            description: "The ID of the child component. Use a 'Text' component for a labeled button. Only use an 'Icon' if the requirements explicitly ask for an icon-only button."
          },
          variant: {
            type: "string",
            enum: [
              "default",
              "primary",
              "borderless"
            ],
            default: "default",
            description: "A hint for the button style. If omitted, a default button style is used. 'primary' indicates this is the main call-to-action button. 'borderless' means the button has no visual border or background, making its child content appear like a clickable link."
          },
          action: {
            $ref: "#/$defs/Action"
          },
          component: {
            const: "Button"
          }
        },
        required: [
          "id",
          "child",
          "action",
          "component"
        ],
        unevaluatedProperties: false
      },
      Card: {
        type: "object",
        properties: {
          id: {
            $ref: "#/$defs/ComponentId"
          },
          accessibility: {
            $ref: "#/$defs/AccessibilityAttributes"
          },
          weight: {
            type: "number",
            description: "The relative weight of this component within a Row or Column. This is similar to the CSS 'flex-grow' property. Note: this may ONLY be set when the component is a direct descendant of a Row or Column."
          },
          child: {
            $ref: "#/$defs/ComponentId",
            description: "The ID of the single child component to be rendered inside the card. To display multiple elements, you MUST wrap them in a layout component (like Column or Row) and pass that container's ID here. Do NOT pass multiple IDs or a non-existent ID."
          },
          component: {
            const: "Card"
          }
        },
        required: [
          "id",
          "child",
          "component"
        ],
        unevaluatedProperties: false
      },
      Column: {
        type: "object",
        properties: {
          id: {
            $ref: "#/$defs/ComponentId"
          },
          accessibility: {
            $ref: "#/$defs/AccessibilityAttributes"
          },
          weight: {
            type: "number",
            description: "The relative weight of this component within a Row or Column. This is similar to the CSS 'flex-grow' property. Note: this may ONLY be set when the component is a direct descendant of a Row or Column."
          },
          children: {
            $ref: "#/$defs/ChildList",
            description: "Defines the children. Use an array of strings for a fixed set of children, or a template object to generate children from a data list. Children cannot be defined inline, they must be referred to by ID."
          },
          justify: {
            type: "string",
            enum: [
              "start",
              "center",
              "end",
              "spaceBetween",
              "spaceAround",
              "spaceEvenly",
              "stretch"
            ],
            default: "start",
            description: "Defines the arrangement of children along the main axis (vertically). Use 'spaceBetween' to push items to the edges (e.g. header at top, footer at bottom), or 'start'/'end'/'center' to pack them together."
          },
          align: {
            type: "string",
            enum: [
              "center",
              "end",
              "start",
              "stretch"
            ],
            default: "stretch",
            description: "Defines the alignment of children along the cross axis (horizontally). This is similar to the CSS 'align-items' property."
          },
          component: {
            const: "Column"
          }
        },
        required: [
          "id",
          "children",
          "component"
        ],
        unevaluatedProperties: false
      },
      List: {
        type: "object",
        properties: {
          id: {
            $ref: "#/$defs/ComponentId"
          },
          accessibility: {
            $ref: "#/$defs/AccessibilityAttributes"
          },
          weight: {
            type: "number",
            description: "The relative weight of this component within a Row or Column. This is similar to the CSS 'flex-grow' property. Note: this may ONLY be set when the component is a direct descendant of a Row or Column."
          },
          children: {
            $ref: "#/$defs/ChildList",
            description: "Defines the children. Use an array of strings for a fixed set of children, or a template object to generate children from a data list."
          },
          direction: {
            type: "string",
            enum: [
              "vertical",
              "horizontal"
            ],
            default: "vertical",
            description: "The direction in which the list items are laid out."
          },
          align: {
            type: "string",
            enum: [
              "start",
              "center",
              "end",
              "stretch"
            ],
            default: "stretch",
            description: "Defines the alignment of children along the cross axis."
          },
          component: {
            const: "List"
          }
        },
        required: [
          "id",
          "children",
          "component"
        ],
        unevaluatedProperties: false
      },
      Row: {
        type: "object",
        properties: {
          id: {
            $ref: "#/$defs/ComponentId"
          },
          accessibility: {
            $ref: "#/$defs/AccessibilityAttributes"
          },
          weight: {
            type: "number",
            description: "The relative weight of this component within a Row or Column. This is similar to the CSS 'flex-grow' property. Note: this may ONLY be set when the component is a direct descendant of a Row or Column."
          },
          children: {
            $ref: "#/$defs/ChildList",
            description: "Defines the children. Use an array of strings for a fixed set of children, or a template object to generate children from a data list. Children cannot be defined inline, they must be referred to by ID."
          },
          justify: {
            type: "string",
            enum: [
              "center",
              "end",
              "spaceAround",
              "spaceBetween",
              "spaceEvenly",
              "start",
              "stretch"
            ],
            default: "start",
            description: "Defines the arrangement of children along the main axis (horizontally). Use 'spaceBetween' to push items to the edges, or 'start'/'end'/'center' to pack them together."
          },
          align: {
            type: "string",
            enum: [
              "start",
              "center",
              "end",
              "stretch"
            ],
            default: "stretch",
            description: "Defines the alignment of children along the cross axis (vertically). This is similar to the CSS 'align-items' property, but uses camelCase values (e.g., 'start')."
          },
          component: {
            const: "Row"
          }
        },
        required: [
          "id",
          "children",
          "component"
        ],
        unevaluatedProperties: false
      },
      Text: {
        type: "object",
        properties: {
          id: {
            $ref: "#/$defs/ComponentId"
          },
          accessibility: {
            $ref: "#/$defs/AccessibilityAttributes"
          },
          weight: {
            type: "number",
            description: "The relative weight of this component within a Row or Column. This is similar to the CSS 'flex-grow' property. Note: this may ONLY be set when the component is a direct descendant of a Row or Column."
          },
          text: {
            $ref: "#/$defs/DynamicString",
            description: "The text content to display. While simple Markdown formatting is supported (i.e. without HTML, images, or links), utilizing dedicated UI components is generally preferred for a richer and more structured presentation."
          },
          variant: {
            type: "string",
            enum: [
              "h1",
              "h2",
              "h3",
              "h4",
              "h5",
              "caption",
              "body"
            ],
            default: "body",
            description: "A hint for the base text style."
          },
          component: {
            const: "Text"
          }
        },
        required: [
          "id",
          "text",
          "component"
        ],
        unevaluatedProperties: false
      }
    },
    $defs: {
      anyComponent: {
        oneOf: [
          {
            $ref: "#/components/Button"
          },
          {
            $ref: "#/components/Card"
          },
          {
            $ref: "#/components/Column"
          },
          {
            $ref: "#/components/List"
          },
          {
            $ref: "#/components/Row"
          },
          {
            $ref: "#/components/Text"
          }
        ],
        discriminator: {
          propertyName: "component"
        }
      },
      ComponentId: {
        type: "string",
        description: "The unique identifier for a component, used for both definitions and references within the same surface."
      },
      AccessibilityAttributes: {
        type: "object",
        description: "Attributes to enhance accessibility when using assistive technologies like screen readers.",
        properties: {
          label: {
            $ref: "#/$defs/DynamicString",
            description: "A short string, typically 1 to 3 words, used by assistive technologies to convey the purpose or intent of an element. For example, an input field might have an accessible label of 'User ID' or a button might be labeled 'Submit'."
          },
          description: {
            $ref: "#/$defs/DynamicString",
            description: "Additional information provided by assistive technologies about an element such as instructions, format requirements, or result of an action. For example, a mute button might have a label of 'Mute' and a description of 'Silences notifications about this conversation'."
          }
        }
      },
      CheckRule: {
        type: "object",
        description: "A single validation rule applied to an input component.",
        properties: {
          condition: {
            $ref: "#/$defs/DynamicBoolean"
          },
          message: {
            type: "string",
            description: "The error message to display if the check fails."
          }
        },
        required: [
          "condition",
          "message"
        ],
        additionalProperties: false
      },
      Action: {
        description: "Defines an interaction handler that can either trigger a server-side event or execute a local client-side function.",
        oneOf: [
          {
            type: "object",
            description: "Triggers a server-side event.",
            properties: {
              event: {
                type: "object",
                description: "The event to dispatch to the server.",
                properties: {
                  name: {
                    type: "string",
                    description: "The name of the action to be dispatched to the server."
                  },
                  context: {
                    type: "object",
                    description: "A JSON object containing the key-value pairs for the action context. Values can be literals or paths. Use literal values unless the value must be dynamically bound to the data model. Do NOT use paths for static IDs.",
                    additionalProperties: {
                      $ref: "#/$defs/DynamicValue"
                    }
                  }
                },
                required: [
                  "name"
                ],
                additionalProperties: false
              }
            },
            required: [
              "event"
            ],
            additionalProperties: false
          },
          {
            type: "object",
            description: "Executes a local client-side function.",
            properties: {
              functionCall: {
                $ref: "#/$defs/FunctionCall"
              }
            },
            required: [
              "functionCall"
            ],
            additionalProperties: false
          }
        ]
      },
      ChildList: {
        oneOf: [
          {
            type: "array",
            items: {
              $ref: "#/$defs/ComponentId"
            },
            description: "A static list of child component IDs."
          },
          {
            type: "object",
            description: "A template for generating a dynamic list of children from a data model list. The `componentId` is the component to use as a template.",
            properties: {
              componentId: {
                $ref: "#/$defs/ComponentId"
              },
              path: {
                type: "string",
                description: "The path to the list of component property objects in the data model."
              }
            },
            required: [
              "componentId",
              "path"
            ],
            additionalProperties: false
          }
        ]
      },
      DynamicString: {
        description: "Represents a string",
        oneOf: [
          {
            type: "string"
          },
          {
            $ref: "#/$defs/DataBinding"
          },
          {
            allOf: [
              {
                $ref: "#/$defs/FunctionCall"
              },
              {
                properties: {
                  returnType: {
                    const: "string"
                  }
                }
              }
            ]
          }
        ]
      },
      DataBinding: {
        type: "object",
        properties: {
          path: {
            type: "string",
            description: "A JSON Pointer path to a value in the data model."
          }
        },
        required: [
          "path"
        ],
        additionalProperties: false
      },
      FunctionCall: {
        type: "object",
        description: "Invokes a named function on the client.",
        properties: {
          call: {
            type: "string",
            description: "The name of the function to call."
          },
          args: {
            type: "object",
            description: "Arguments passed to the function.",
            additionalProperties: {
              anyOf: [
                {
                  $ref: "#/$defs/DynamicValue"
                },
                {
                  type: "object",
                  description: "A literal object argument (e.g. configuration)."
                }
              ]
            }
          },
          returnType: {
            type: "string",
            description: "The expected return type of the function call.",
            enum: [
              "string",
              "number",
              "boolean",
              "array",
              "object",
              "any",
              "void"
            ],
            default: "boolean"
          }
        },
        required: [
          "call"
        ],
        oneOf: [
          {
            $ref: "catalog.json#/$defs/anyFunction"
          }
        ]
      },
      DynamicBoolean: {
        description: "A boolean value that can be a literal, a path, or a function call returning a boolean.",
        oneOf: [
          {
            type: "boolean"
          },
          {
            $ref: "#/$defs/DataBinding"
          },
          {
            allOf: [
              {
                $ref: "#/$defs/FunctionCall"
              },
              {
                properties: {
                  returnType: {
                    const: "boolean"
                  }
                }
              }
            ]
          }
        ]
      },
      DynamicValue: {
        description: "A value that can be a literal, a path, or a function call returning any type.",
        oneOf: [
          {
            type: "string"
          },
          {
            type: "number"
          },
          {
            type: "boolean"
          },
          {
            type: "array"
          },
          {
            $ref: "#/$defs/DataBinding"
          },
          {
            $ref: "#/$defs/FunctionCall"
          }
        ]
      }
    }
  }
};

// cypher-executor/src/lib/ui-catalog.ts
var CATALOG = ui_catalog_generated_default;
var UI_CATALOG_ID = CATALOG.catalog_id;
var UI_PROTOCOL_VERSION = CATALOG.protocol_version;
function summarize(c) {
  return {
    canonical_id: c.canonical_id,
    component: c.a2ui.component,
    display_name: c.display_name,
    description: c.description,
    renders: c.renders,
    data_inputs: c.data_inputs.map((d) => d.name),
    interactions: c.interactions.map((i) => i.event),
    tags: c.tags
  };
}
function listUiComponents(q) {
  const needle = (q ?? "").trim().toLowerCase();
  const all = CATALOG.components;
  const hit = needle ? all.filter(
    (c) => [c.canonical_id, c.a2ui.component, c.display_name, c.description, c.renders, ...c.tags].join(" ").toLowerCase().includes(needle)
  ) : all;
  return hit.map(summarize);
}
function getUiComponent(id) {
  const k = id.trim();
  return CATALOG.components.find(
    (c) => c.canonical_id === k || c.a2ui.component === k || c.a2ui.component.toLowerCase() === k.toLowerCase()
  );
}
function a2uiCatalog() {
  return CATALOG.a2ui_catalog;
}

// cypher-executor/src/routes/ui-components.ts
var uiComponentsRouter = new Hono2();
uiComponentsRouter.get("/ui/components", (c) => {
  const q = c.req.query("q");
  const components = listUiComponents(q);
  return c.json({
    success: true,
    catalog_id: UI_CATALOG_ID,
    protocol_version: UI_PROTOCOL_VERSION,
    count: components.length,
    components,
    next: "\u8981\u67D0\u4E00\u9846\u7684\u5B8C\u6574\u5BA3\u544A\uFF08\u5C6C\u6027 schema\u3001\u5404\u72C0\u614B\u3001\u7BC4\u4F8B\uFF09\u2192 GET /ui/components/:id"
  });
});
uiComponentsRouter.get("/ui/components/:id", (c) => {
  const id = c.req.param("id");
  const component = getUiComponent(id);
  if (!component) {
    return c.json({
      success: false,
      error: `\u6C92\u6709\u540D\u70BA\u300C${id}\u300D\u7684\u756B\u9762\u5143\u4EF6`,
      available: listUiComponents().map((x) => x.canonical_id)
    }, 404);
  }
  return c.json({ success: true, catalog_id: UI_CATALOG_ID, protocol_version: UI_PROTOCOL_VERSION, component });
});
uiComponentsRouter.get("/ui/catalog", (c) => c.json(a2uiCatalog()));

// cypher-executor/src/index.ts
init_endpoints();

// cypher-executor/src/lib/secrets-grant.ts
var DEFAULT_INSTALLER_ORIGIN3 = "https://install.arcrun.dev";
var GRANT_CODE_RE = /^[A-Za-z0-9_-]{20,128}$/;
var REDEEM_TIMEOUT_MS = 8e3;
var GRANT_HEADER = "x-arcrun-secrets-grant";
function isGrantCodeShape(code) {
  return GRANT_CODE_RE.test(code);
}
async function redeemSecretsGrant(env, apiOrigin, code, fetchImpl = fetch) {
  if (!isGrantCodeShape(code)) return null;
  const installer = String(env.INSTALLER_ORIGIN || DEFAULT_INSTALLER_ORIGIN3).replace(/\/+$/, "");
  try {
    const res = await fetchImpl(`${installer}/api/grant/redeem`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ code, api_origin: apiOrigin }),
      signal: AbortSignal.timeout(REDEEM_TIMEOUT_MS)
    });
    if (!res.ok) return null;
    const j = await res.json().catch(() => null);
    const token = j && typeof j.token === "string" ? j.token : "";
    return token || null;
  } catch {
    return null;
  }
}

// cypher-executor/src/index.ts
var app = new Hono2();
var STATIC_ORIGINS = ["https://arcrun.dev", "https://www.arcrun.dev"];
app.use("*", cors({
  origin: (origin2, c) => {
    if (!origin2) return origin2;
    let extra = [];
    try {
      extra = String(c.env.UI_ORIGINS || "").split(",").map((s) => s.trim()).filter(Boolean);
    } catch {
    }
    const sub = String(c.env.WORKER_SUBDOMAIN || "").trim();
    const priv = isPrivateCloud(c.env);
    const sibling = sub && !priv ? [`https://arcrun-rag-ui.${sub}.workers.dev`] : [];
    return [...priv ? [] : STATIC_ORIGINS, ...sibling, ...extra].includes(origin2) ? origin2 : null;
  },
  allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization", "X-Arcrun-API-Key", "X-Arcrun-Secrets-Grant", "X-Arcrun-Grant-Session"],
  exposeHeaders: ["X-Arcrun-Grant-Session"],
  credentials: true
}));
app.onError((err, c) => {
  if (err instanceof AssetStoreUnavailableError) {
    const status = err.status && err.status >= 400 && err.status < 600 ? err.status : 503;
    return c.json({ success: false, error: "kbdb_unavailable", message: err.message }, status);
  }
  if (err instanceof EphemeralStoreError) {
    const status = err.status && err.status >= 400 && err.status < 600 ? err.status : 503;
    return c.json({ success: false, error: "kbdb_unavailable", message: `\u77E5\u8B58\u5EAB\u66AB\u6642\u8B80\u5BEB\u4E0D\u5230\uFF08${err.message}\uFF09\u3002\u9019\u4E0D\u662F\u7A0B\u5F0F\u58DE\u4E86\uFF0C\u4E5F\u4E0D\u662F\u5BC6\u78BC\u932F\u3002` }, status);
  }
  if (err instanceof EndpointConfigError) {
    console.error("[cypher-executor]", err.message);
    return c.json({ success: false, error: "endpoint_config_missing", missing: err.missing, message: err.message }, 500);
  }
  console.error("[cypher-executor] unhandled error", err);
  return c.json(
    { success: false, error: "internal_error", message: err instanceof Error ? err.message : String(err) },
    500
  );
});
app.use("*", async (c, next) => {
  const p = new URL(c.req.url).pathname;
  if (p.startsWith("/portal") || p.startsWith("/console") || p === "/health") {
    await hydrateAuthStore(c.env);
  }
  await next();
});
app.route("/", internalCronRouter);
app.route("/", helpRouter);
app.route("/", docsRouter);
app.route("/", healthRouter);
app.route("/", executeRouter);
app.route("/", cypherRouter);
app.route("/", validateRouter);
app.route("/", webhooksRouter);
app.route("/", webhooksNamedRouter);
app.route("/", webhooksCrudRouter);
app.route("/", webhooksListRouter);
app.route("/", recipesRouter);
app.route("/", credentialsRouter);
app.route("/", authRouter);
app.route("/", resumeRouter);
app.route("/", executionsRouter);
app.route("/", initSeedRouter);
app.route("/", kbdbProxyRouter);
app.route("/", consoleAuthRouter);
app.route("/", consoleDashboardRouter);
app.route("/", portalRouter);
app.route("/", portalDataRouter);
app.route("/", storageRouter);
app.route("/", appsRouter);
app.route("/", uiComponentsRouter);
var index_default = {
  fetch: (req, env, ctx) => {
    const perRequest = withAssetStores(env, newKbdbTally());
    const cfToken = req.headers.get("x-cf-secrets-token");
    if (cfToken) perRequest.CF_SECRETS_TOKEN_FROM_REQUEST = cfToken;
    const grant = req.headers.get(GRANT_HEADER);
    const isWrite = req.method !== "GET" && req.method !== "HEAD" && req.method !== "OPTIONS";
    const priv = isPrivateCloud(env);
    const bearer = (req.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "").trim();
    if (grant && !cfToken && isWrite && !priv) {
      return redeemSecretsGrant(env, new URL(req.url).origin, grant).then(async (t) => {
        if (!t) return app.fetch(req, perRequest, ctx);
        perRequest.CF_SECRETS_TOKEN_FROM_REQUEST = t;
        const sid = bearer ? await mintGrantSession(t, bearer) : null;
        const res = await app.fetch(req, perRequest, ctx);
        if (!sid) return res;
        const out = new Response(res.body, res);
        out.headers.set("X-Arcrun-Grant-Session", sid);
        return out;
      });
    }
    const gsess = req.headers.get(GRANT_SESSION_HEADER);
    if (gsess && !cfToken && isWrite && !priv) {
      return lookupGrantSession(gsess, bearer).then((t) => {
        if (t) perRequest.CF_SECRETS_TOKEN_FROM_REQUEST = t;
        return app.fetch(req, perRequest, ctx);
      });
    }
    return app.fetch(req, perRequest, ctx);
  },
  scheduled: (controller, env, ctx) => handleScheduled(controller, withAssetStores(env), ctx)
};
export {
  index_default as default
};
