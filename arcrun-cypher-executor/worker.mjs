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

// ../../matrix/arcrun/cypher-executor/node_modules/.pnpm/hono@4.12.10/node_modules/hono/dist/compose.js
var compose;
var init_compose = __esm({
  "../../matrix/arcrun/cypher-executor/node_modules/.pnpm/hono@4.12.10/node_modules/hono/dist/compose.js"() {
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

// ../../matrix/arcrun/cypher-executor/node_modules/.pnpm/hono@4.12.10/node_modules/hono/dist/http-exception.js
var init_http_exception = __esm({
  "../../matrix/arcrun/cypher-executor/node_modules/.pnpm/hono@4.12.10/node_modules/hono/dist/http-exception.js"() {
  }
});

// ../../matrix/arcrun/cypher-executor/node_modules/.pnpm/hono@4.12.10/node_modules/hono/dist/request/constants.js
var GET_MATCH_RESULT;
var init_constants = __esm({
  "../../matrix/arcrun/cypher-executor/node_modules/.pnpm/hono@4.12.10/node_modules/hono/dist/request/constants.js"() {
    GET_MATCH_RESULT = /* @__PURE__ */ Symbol();
  }
});

// ../../matrix/arcrun/cypher-executor/node_modules/.pnpm/hono@4.12.10/node_modules/hono/dist/utils/body.js
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
  "../../matrix/arcrun/cypher-executor/node_modules/.pnpm/hono@4.12.10/node_modules/hono/dist/utils/body.js"() {
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

// ../../matrix/arcrun/cypher-executor/node_modules/.pnpm/hono@4.12.10/node_modules/hono/dist/utils/url.js
var splitPath, splitRoutingPath, extractGroupsFromPath, replaceGroupMarks, patternCache, getPattern, tryDecode, tryDecodeURI, getPath, getPathNoStrict, mergePath, checkOptionalParameter, _decodeURI, _getQueryParam, getQueryParam, getQueryParams, decodeURIComponent_;
var init_url = __esm({
  "../../matrix/arcrun/cypher-executor/node_modules/.pnpm/hono@4.12.10/node_modules/hono/dist/utils/url.js"() {
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

// ../../matrix/arcrun/cypher-executor/node_modules/.pnpm/hono@4.12.10/node_modules/hono/dist/request.js
var tryDecodeURIComponent, HonoRequest;
var init_request = __esm({
  "../../matrix/arcrun/cypher-executor/node_modules/.pnpm/hono@4.12.10/node_modules/hono/dist/request.js"() {
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

// ../../matrix/arcrun/cypher-executor/node_modules/.pnpm/hono@4.12.10/node_modules/hono/dist/utils/html.js
var HtmlEscapedCallbackPhase, raw, resolveCallback;
var init_html = __esm({
  "../../matrix/arcrun/cypher-executor/node_modules/.pnpm/hono@4.12.10/node_modules/hono/dist/utils/html.js"() {
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

// ../../matrix/arcrun/cypher-executor/node_modules/.pnpm/hono@4.12.10/node_modules/hono/dist/context.js
var TEXT_PLAIN, setDefaultContentType, createResponseInstance, Context;
var init_context = __esm({
  "../../matrix/arcrun/cypher-executor/node_modules/.pnpm/hono@4.12.10/node_modules/hono/dist/context.js"() {
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

// ../../matrix/arcrun/cypher-executor/node_modules/.pnpm/hono@4.12.10/node_modules/hono/dist/router.js
var METHOD_NAME_ALL, METHOD_NAME_ALL_LOWERCASE, METHODS, MESSAGE_MATCHER_IS_ALREADY_BUILT, UnsupportedPathError;
var init_router = __esm({
  "../../matrix/arcrun/cypher-executor/node_modules/.pnpm/hono@4.12.10/node_modules/hono/dist/router.js"() {
    METHOD_NAME_ALL = "ALL";
    METHOD_NAME_ALL_LOWERCASE = "all";
    METHODS = ["get", "post", "put", "delete", "options", "patch"];
    MESSAGE_MATCHER_IS_ALREADY_BUILT = "Can not add a route since the matcher is already built.";
    UnsupportedPathError = class extends Error {
    };
  }
});

// ../../matrix/arcrun/cypher-executor/node_modules/.pnpm/hono@4.12.10/node_modules/hono/dist/utils/constants.js
var COMPOSED_HANDLER;
var init_constants2 = __esm({
  "../../matrix/arcrun/cypher-executor/node_modules/.pnpm/hono@4.12.10/node_modules/hono/dist/utils/constants.js"() {
    COMPOSED_HANDLER = "__COMPOSED_HANDLER";
  }
});

// ../../matrix/arcrun/cypher-executor/node_modules/.pnpm/hono@4.12.10/node_modules/hono/dist/hono-base.js
var notFoundHandler, errorHandler, Hono;
var init_hono_base = __esm({
  "../../matrix/arcrun/cypher-executor/node_modules/.pnpm/hono@4.12.10/node_modules/hono/dist/hono-base.js"() {
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

// ../../matrix/arcrun/cypher-executor/node_modules/.pnpm/hono@4.12.10/node_modules/hono/dist/router/reg-exp-router/matcher.js
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
  "../../matrix/arcrun/cypher-executor/node_modules/.pnpm/hono@4.12.10/node_modules/hono/dist/router/reg-exp-router/matcher.js"() {
    init_router();
    emptyParam = [];
  }
});

// ../../matrix/arcrun/cypher-executor/node_modules/.pnpm/hono@4.12.10/node_modules/hono/dist/router/reg-exp-router/node.js
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
  "../../matrix/arcrun/cypher-executor/node_modules/.pnpm/hono@4.12.10/node_modules/hono/dist/router/reg-exp-router/node.js"() {
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

// ../../matrix/arcrun/cypher-executor/node_modules/.pnpm/hono@4.12.10/node_modules/hono/dist/router/reg-exp-router/trie.js
var Trie;
var init_trie = __esm({
  "../../matrix/arcrun/cypher-executor/node_modules/.pnpm/hono@4.12.10/node_modules/hono/dist/router/reg-exp-router/trie.js"() {
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

// ../../matrix/arcrun/cypher-executor/node_modules/.pnpm/hono@4.12.10/node_modules/hono/dist/router/reg-exp-router/router.js
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
  "../../matrix/arcrun/cypher-executor/node_modules/.pnpm/hono@4.12.10/node_modules/hono/dist/router/reg-exp-router/router.js"() {
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

// ../../matrix/arcrun/cypher-executor/node_modules/.pnpm/hono@4.12.10/node_modules/hono/dist/router/reg-exp-router/prepared-router.js
var init_prepared_router = __esm({
  "../../matrix/arcrun/cypher-executor/node_modules/.pnpm/hono@4.12.10/node_modules/hono/dist/router/reg-exp-router/prepared-router.js"() {
    init_router();
    init_matcher();
    init_router2();
  }
});

// ../../matrix/arcrun/cypher-executor/node_modules/.pnpm/hono@4.12.10/node_modules/hono/dist/router/reg-exp-router/index.js
var init_reg_exp_router = __esm({
  "../../matrix/arcrun/cypher-executor/node_modules/.pnpm/hono@4.12.10/node_modules/hono/dist/router/reg-exp-router/index.js"() {
    init_router2();
    init_prepared_router();
  }
});

// ../../matrix/arcrun/cypher-executor/node_modules/.pnpm/hono@4.12.10/node_modules/hono/dist/router/smart-router/router.js
var SmartRouter;
var init_router3 = __esm({
  "../../matrix/arcrun/cypher-executor/node_modules/.pnpm/hono@4.12.10/node_modules/hono/dist/router/smart-router/router.js"() {
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

// ../../matrix/arcrun/cypher-executor/node_modules/.pnpm/hono@4.12.10/node_modules/hono/dist/router/smart-router/index.js
var init_smart_router = __esm({
  "../../matrix/arcrun/cypher-executor/node_modules/.pnpm/hono@4.12.10/node_modules/hono/dist/router/smart-router/index.js"() {
    init_router3();
  }
});

// ../../matrix/arcrun/cypher-executor/node_modules/.pnpm/hono@4.12.10/node_modules/hono/dist/router/trie-router/node.js
var emptyParams, hasChildren, Node2;
var init_node2 = __esm({
  "../../matrix/arcrun/cypher-executor/node_modules/.pnpm/hono@4.12.10/node_modules/hono/dist/router/trie-router/node.js"() {
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

// ../../matrix/arcrun/cypher-executor/node_modules/.pnpm/hono@4.12.10/node_modules/hono/dist/router/trie-router/router.js
var TrieRouter;
var init_router4 = __esm({
  "../../matrix/arcrun/cypher-executor/node_modules/.pnpm/hono@4.12.10/node_modules/hono/dist/router/trie-router/router.js"() {
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

// ../../matrix/arcrun/cypher-executor/node_modules/.pnpm/hono@4.12.10/node_modules/hono/dist/router/trie-router/index.js
var init_trie_router = __esm({
  "../../matrix/arcrun/cypher-executor/node_modules/.pnpm/hono@4.12.10/node_modules/hono/dist/router/trie-router/index.js"() {
    init_router4();
  }
});

// ../../matrix/arcrun/cypher-executor/node_modules/.pnpm/hono@4.12.10/node_modules/hono/dist/hono.js
var Hono2;
var init_hono = __esm({
  "../../matrix/arcrun/cypher-executor/node_modules/.pnpm/hono@4.12.10/node_modules/hono/dist/hono.js"() {
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

// ../../matrix/arcrun/cypher-executor/node_modules/.pnpm/hono@4.12.10/node_modules/hono/dist/index.js
var init_dist = __esm({
  "../../matrix/arcrun/cypher-executor/node_modules/.pnpm/hono@4.12.10/node_modules/hono/dist/index.js"() {
    init_hono();
  }
});

// ../../matrix/arcrun/cypher-executor/src/types.ts
async function kvGetNodeOutput(store, nodeId) {
  try {
    const val = await store.kv.get(`${store.runId}:node:${nodeId}`, "json");
    return val;
  } catch {
    return void 0;
  }
}
async function kvSetNodeOutput(store, nodeId, output) {
  try {
    await store.kv.put(
      `${store.runId}:node:${nodeId}`,
      JSON.stringify(output),
      { expirationTtl: 3600 }
    );
  } catch {
  }
}
var WorkflowPaused, ExecutionError;
var init_types = __esm({
  "../../matrix/arcrun/cypher-executor/src/types.ts"() {
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

// ../../matrix/arcrun/cypher-executor/src/lib/hash.ts
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
  "../../matrix/arcrun/cypher-executor/src/lib/hash.ts"() {
    "use strict";
  }
});

// ../../matrix/arcrun/cypher-executor/src/routes/recipes.ts
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
async function fetchMarketStat(env, canonicalId) {
  try {
    const base = (env.KBDB_BASE_URL ?? "https://kbdb.finally.click").replace(/\/$/, "");
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
var recipesRouter, kIdxCanonical, kIdxInstalled;
var init_recipes = __esm({
  "../../matrix/arcrun/cypher-executor/src/routes/recipes.ts"() {
    "use strict";
    init_dist();
    init_hash();
    recipesRouter = new Hono2();
    kIdxCanonical = (canonicalId) => `idx:canonical:${canonicalId}`;
    kIdxInstalled = (canonicalId) => `idx:installed:${canonicalId}`;
    recipesRouter.post("/recipes", async (c) => {
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
      const existing = await resolveRecipe(canonicalId, c.env.RECIPES);
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
      await installRecipeRecord(c.env.RECIPES, recipe);
      return c.json({ success: true, recipe });
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
      const kbdbBase2 = (c.env.KBDB_BASE_URL ?? "https://kbdb.finally.click").replace(/\/$/, "");
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
      const kbdbHeaders = { "Content-Type": "application/json" };
      if (c.env.KBDB_INTERNAL_TOKEN) kbdbHeaders["Authorization"] = `Bearer ${c.env.KBDB_INTERNAL_TOKEN}`;
      c.executionCtx.waitUntil(
        fetch(`${kbdbBase2}/entries`, {
          method: "POST",
          headers: kbdbHeaders,
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

// ../../matrix/arcrun/cypher-executor/src/lib/constants.ts
var VALID_EDGE_TYPES, SEMANTIC_EDGE_MAP, BUILTIN_COMPONENTS;
var init_constants3 = __esm({
  "../../matrix/arcrun/cypher-executor/src/lib/constants.ts"() {
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
    BUILTIN_COMPONENTS = /* @__PURE__ */ new Map([
      ["comp_passthrough", (ctx) => ctx],
      ["comp_uppercase", (ctx) => {
        const c = ctx;
        return { ...c, text: String(c.text || "").toUpperCase() };
      }],
      ["comp_counter", (ctx) => {
        const c = ctx;
        return { ...c, count: (Number(c.count) || 0) + 1 };
      }]
    ]);
  }
});

// ../../matrix/arcrun/cypher-executor/src/lib/recipe-payload.ts
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
  "../../matrix/arcrun/cypher-executor/src/lib/recipe-payload.ts"() {
    "use strict";
  }
});

// ../../matrix/arcrun/cypher-executor/src/lib/component-loader.ts
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
    const authRecipe = await resolveAuthRecipe(componentId, env.RECIPES);
    if (authRecipe) return makeAuthRecipeRunner(authRecipe);
    const kvRecipe = await resolveRecipe(componentId, env.RECIPES);
    if (kvRecipe) return pickRecipeRunner(kvRecipe, env);
    if (WASM_HTTP_RUNNER_IDS.has(componentId)) {
      return makeHttpRunner(wasmWorkerUrl(componentId, env.WORKER_SUBDOMAIN));
    }
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
      const text = await res.text();
      return { success: false, status: res.status, error: text.slice(0, 200) };
    }
    try {
      return await res.json();
    } catch {
      return { success: true, data: await res.text() };
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
  return makeHttpRunner(wasmWorkerUrl(canonicalId, env.WORKER_SUBDOMAIN));
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
var WASM_HTTP_RUNNER_IDS, LOGIC_BINDING_MAP;
var init_component_loader = __esm({
  "../../matrix/arcrun/cypher-executor/src/lib/component-loader.ts"() {
    "use strict";
    init_constants3();
    init_hash();
    init_recipes();
    init_recipe_payload();
    WASM_HTTP_RUNNER_IDS = /* @__PURE__ */ new Set([
      // 通用 HTTP 零件
      "http_request",
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
      "auth_mtls"
    ]);
    LOGIC_BINDING_MAP = {
      if_control: "SVC_IF_CONTROL",
      switch: "SVC_SWITCH",
      foreach_control: "SVC_FOREACH_CONTROL",
      filter: "SVC_FILTER",
      merge: "SVC_MERGE",
      try_catch: "SVC_TRY_CATCH",
      wait: "SVC_WAIT",
      set: "SVC_SET",
      array_ops: "SVC_ARRAY_OPS",
      string_ops: "SVC_STRING_OPS",
      number_ops: "SVC_NUMBER_OPS",
      date_ops: "SVC_DATE_OPS",
      validate_json: "SVC_VALIDATE_JSON"
      // ai_transform_compile / ai_transform_run 已刪除（2026-05-29）：
      // Arcrun 是 AI 呼叫的工具，工作流不該內嵌 AI 節點回頭呼叫 AI（n8n 才需要，因它沒大腦）。
    };
  }
});

// ../../matrix/arcrun/cypher-executor/src/lib/wasi-shim.ts
async function routedKvGet(env, apiKey, key) {
  if (key.startsWith("auth_recipe:")) {
    return env.RECIPES.get(key);
  }
  const credMatch = key.match(/^([^:]+):cred:.+$/);
  if (credMatch) {
    if (credMatch[1] !== apiKey) {
      return null;
    }
    return env.CREDENTIALS_KV.get(key);
  }
  return null;
}
async function routedKvPut(env, apiKey, key, value, ttlSeconds) {
  const oauth2Match = key.match(/^([^:]+):oauth2:.+$/);
  if (oauth2Match && oauth2Match[1] === apiKey) {
    const opts = ttlSeconds > 0 ? { expirationTtl: ttlSeconds } : void 0;
    await env.CREDENTIALS_KV.put(key, value, opts);
    return;
  }
}
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
function createArcrunHostFunctions(env, apiKey) {
  return {
    kv_get: (key) => routedKvGet(env, apiKey, key),
    kv_put: (key, value, ttlSeconds) => routedKvPut(env, apiKey, key, value, ttlSeconds),
    crypto_sign_rs256: (data, pkcs8) => rsaPkcs1Sha256Sign(data, pkcs8),
    secret_get: async (ref) => secretGet(env, ref)
  };
}
var init_wasi_shim = __esm({
  "../../matrix/arcrun/cypher-executor/src/lib/wasi-shim.ts"() {
    "use strict";
  }
});

// ../../matrix/arcrun/cypher-executor/src/routes/kbdb-proxy.ts
function kbdbBase(env) {
  const base = (env.KBDB_BASE_URL ?? "https://arcrun-kbdb.uncle6-me.workers.dev").replace(/\/$/, "");
  const headers = { "Content-Type": "application/json" };
  if (env.KBDB_INTERNAL_TOKEN) headers["Authorization"] = `Bearer ${env.KBDB_INTERNAL_TOKEN}`;
  return { base, headers };
}
function tenant(c) {
  return c.req.header("X-Arcrun-API-Key") ?? null;
}
function graphBase(env) {
  if (env.KBDB_GRAPH_URL) return env.KBDB_GRAPH_URL.replace(/\/$/, "");
  return `https://kbdb-graph-plugin.${env.WORKER_SUBDOMAIN}.workers.dev`;
}
var kbdbProxyRouter, NEED_KEY;
var init_kbdb_proxy = __esm({
  "../../matrix/arcrun/cypher-executor/src/routes/kbdb-proxy.ts"() {
    "use strict";
    init_dist();
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
      if (!body || !body.template || !body.values) {
        return c.json({ error: "template \u8207 values \u5FC5\u586B" }, 400);
      }
      const { base, headers } = kbdbBase(c.env);
      const res = await fetch(`${base}/records`, {
        method: "POST",
        headers,
        // 強制以租戶身份隔離：忽略 caller 自帶 owner_id，一律用 header 身份（防跨租戶寫入）
        body: JSON.stringify({ template: body.template, values: body.values, owner_id: owner })
      });
      return new Response(res.body, { status: res.status, headers: { "Content-Type": "application/json" } });
    });
    kbdbProxyRouter.get("/kbdb/records/by-template/:template", async (c) => {
      const owner = tenant(c);
      if (!owner) return c.json(NEED_KEY, 401);
      const { base, headers } = kbdbBase(c.env);
      const res = await fetch(
        `${base}/records/by-template/${encodeURIComponent(c.req.param("template"))}?owner_id=${encodeURIComponent(owner)}`,
        { headers }
      );
      return new Response(res.body, { status: res.status, headers: { "Content-Type": "application/json" } });
    });
    kbdbProxyRouter.get("/kbdb/records/:recordId", async (c) => {
      if (!tenant(c)) return c.json(NEED_KEY, 401);
      const { base, headers } = kbdbBase(c.env);
      const res = await fetch(`${base}/records/${encodeURIComponent(c.req.param("recordId"))}`, { headers });
      return new Response(res.body, { status: res.status, headers: { "Content-Type": "application/json" } });
    });
    kbdbProxyRouter.get("/kbdb/search", async (c) => {
      const owner = tenant(c);
      if (!owner) return c.json(NEED_KEY, 401);
      const q = c.req.query("q");
      if (!q) return c.json({ error: "q \u5FC5\u586B" }, 400);
      const { base, headers } = kbdbBase(c.env);
      const params = new URLSearchParams({ q, owner_id: owner });
      for (const k of ["entry_type", "source", "library", "mode"]) {
        const v = c.req.query(k);
        if (v) params.set(k, v);
      }
      const res = await fetch(`${base}/entries/search?${params.toString()}`, { headers });
      return new Response(res.body, { status: res.status, headers: { "Content-Type": "application/json" } });
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
      const params = new URLSearchParams();
      params.set("owner_id", owner);
      for (const k of ["entry_type", "parent_id", "page_name", "source", "library", "limit", "offset"]) {
        const v = c.req.query(k);
        if (v) params.set(k, v);
      }
      const q = c.req.query("q") || c.req.query("search");
      if (q) params.set("q", q);
      const res = await fetch(`${base}/entries?${params.toString()}`, { headers });
      return new Response(res.body, { status: res.status, headers: { "Content-Type": "application/json" } });
    });
    kbdbProxyRouter.get("/kbdb/entries/:id", async (c) => {
      if (!tenant(c)) return c.json(NEED_KEY, 401);
      const { base, headers } = kbdbBase(c.env);
      const res = await fetch(`${base}/entries/${encodeURIComponent(c.req.param("id"))}`, { headers });
      return new Response(res.body, { status: res.status, headers: { "Content-Type": "application/json" } });
    });
    kbdbProxyRouter.get("/kbdb/graph/neighbors/:name", async (c) => {
      if (!tenant(c)) return c.json(NEED_KEY, 401);
      const base = graphBase(c.env);
      const headers = {};
      if (c.env.KBDB_INTERNAL_TOKEN) headers["Authorization"] = `Bearer ${c.env.KBDB_INTERNAL_TOKEN}`;
      try {
        const res = await fetch(`${base}/graph/neighbors/${encodeURIComponent(c.req.param("name"))}`, { headers });
        return new Response(res.body, { status: res.status, headers: { "Content-Type": "application/json" } });
      } catch (e) {
        return c.json({ error: `kbdb-graph-plugin \u4E0D\u53EF\u9054\uFF08${base}\uFF09\uFF1A${e instanceof Error ? e.message : String(e)}` }, 502);
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

// ../../matrix/arcrun/cypher-executor/src/routes/credentials.ts
async function deriveSecretRef(apiKey, name) {
  const hash8 = await sha256Prefix(apiKey);
  return `CRED_${name.toUpperCase()}_${hash8.toUpperCase()}`;
}
async function storeCredential(env, apiKey, name, value, service) {
  const secretRef = await deriveSecretRef(apiKey, name);
  await putWorkerSecret(env, secretRef, value);
  await upsertCredentialEntry(env, apiKey, name, service, "standard", secretRef);
}
function validateName(name) {
  return typeof name === "string" && /^\w+$/.test(name);
}
function validSensitivity(s) {
  return s === "standard" || s === "high";
}
async function putWorkerSecret(env, secretRef, value) {
  if (!env.CF_SECRETS_API_TOKEN || !env.CF_ACCOUNT_ID) {
    throw new Error(
      "\u6B64 worker \u7F3A CF_SECRETS_API_TOKEN / CF_ACCOUNT_ID \u8A2D\u5B9A\uFF0C\u5BEB\u5165\u8DEF\u5F91\u672A\u5C31\u7DD2\uFF08\u898B credential-store-migration.md T3\uFF1Aacr init/update \u61C9\u78BA\u4FDD\u9019\u5169\u9805\u5C31\u7DD2\uFF09"
    );
  }
  const url = `https://api.cloudflare.com/client/v4/accounts/${env.CF_ACCOUNT_ID}/workers/scripts/${CYPHER_SCRIPT_NAME}/secrets`;
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${env.CF_SECRETS_API_TOKEN}`,
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
async function deleteWorkerSecret(env, secretRef) {
  if (!env.CF_SECRETS_API_TOKEN || !env.CF_ACCOUNT_ID) {
    throw new Error("\u6B64 worker \u7F3A CF_SECRETS_API_TOKEN / CF_ACCOUNT_ID \u8A2D\u5B9A\uFF0C\u522A\u9664\u8DEF\u5F91\u672A\u5C31\u7DD2");
  }
  const url = `https://api.cloudflare.com/client/v4/accounts/${env.CF_ACCOUNT_ID}/workers/scripts/${CYPHER_SCRIPT_NAME}/secrets/${secretRef}`;
  const res = await fetch(url, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${env.CF_SECRETS_API_TOKEN}` }
  });
  if (res.status === 404) return;
  const body = await res.json().catch(() => null);
  if (!res.ok || !body?.success) {
    const detail = body?.errors?.map((e) => e.message).filter(Boolean).join("; ") || `HTTP ${res.status}`;
    throw new Error(`CF Workers Secrets \u522A\u9664\u5931\u6557\uFF1A${detail}`);
  }
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
}
async function getCredentialDirectory(env, apiKey) {
  const now2 = Date.now();
  const cached = dirCache[apiKey];
  if (cached && now2 - cached.fetchedAt < DIR_CACHE_TTL_MS) return cached.rows;
  const qs = new URLSearchParams({ owner_id: apiKey, entry_type: CREDENTIAL_ENTRY_TYPE, limit: "200" });
  const res = await kbdbCredFetch(env, `/entries?${qs.toString()}`);
  if (!res.ok) {
    return [];
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
  dirCache[apiKey] = { rows, fetchedAt: now2 };
  return rows;
}
async function getCredentialSecretRefs(env, apiKey) {
  const rows = await getCredentialDirectory(env, apiKey);
  const out = {};
  for (const r of rows) {
    if (r.secret_ref) out[r.name] = r.secret_ref;
  }
  return out;
}
function touchLastUsed(env, apiKey, names) {
  const cached = dirCache[apiKey];
  if (!cached || names.length === 0) return;
  const now2 = Math.floor(Date.now() / 1e3);
  for (const r of cached.rows) {
    if (!names.includes(r.name)) continue;
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
  const qs = new URLSearchParams({ owner_id: apiKey, entry_type: CREDENTIAL_ENTRY_TYPE, limit: "200" });
  const res = await kbdbCredFetch(env, `/entries?${qs.toString()}`);
  if (!res.ok) throw new Error(`credential \u76EE\u9304\u67E5\u8A62\u5931\u6557\uFF1AHTTP ${res.status}`);
  const body = await res.json().catch(() => null);
  const rows = (body?.entries ?? []).filter((e) => !!e.page_name).map((e) => {
    const meta = parseMeta(e);
    return { name: e.page_name, service: meta.service, sensitivity: meta.sensitivity, created_at: e.created_at, last_used_at: meta.last_used_at };
  });
  return rows;
}
async function hasCredential(env, apiKey, name) {
  const entry = await findCredentialEntry(env, apiKey, name);
  return entry !== null;
}
async function writeCredential(env, apiKey, name, value, service, sensitivityRaw) {
  const sensitivity = validSensitivity(sensitivityRaw) ? sensitivityRaw : "standard";
  const secretRef = await deriveSecretRef(apiKey, name);
  await putWorkerSecret(env, secretRef, value);
  await upsertCredentialEntry(env, apiKey, name, service ?? null, sensitivity, secretRef);
  return { secretRef, sensitivity };
}
var credentialsRouter, CYPHER_SCRIPT_NAME, CREDENTIAL_ENTRY_TYPE, DIR_CACHE_TTL_MS, dirCache;
var init_credentials = __esm({
  "../../matrix/arcrun/cypher-executor/src/routes/credentials.ts"() {
    "use strict";
    init_dist();
    init_hash();
    init_kbdb_proxy();
    credentialsRouter = new Hono2();
    CYPHER_SCRIPT_NAME = "arcrun-cypher-executor";
    CREDENTIAL_ENTRY_TYPE = "credential";
    DIR_CACHE_TTL_MS = 6e4;
    dirCache = {};
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
        return c.json({ success: false, error: e instanceof Error ? e.message : String(e) }, 502);
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
        return c.json({ success: false, error: e instanceof Error ? e.message : String(e) }, 502);
      }
    });
    credentialsRouter.delete("/credentials/:name", async (c) => {
      const apiKey = c.req.header("X-Arcrun-API-Key");
      if (!apiKey) {
        return c.json({ error: "\u7F3A\u5C11 X-Arcrun-API-Key header" }, 401);
      }
      const name = c.req.param("name");
      try {
        const entry = await findCredentialEntry(c.env, apiKey, name);
        if (entry) {
          const meta = parseMeta(entry);
          if (meta.secret_ref) await deleteWorkerSecret(c.env, meta.secret_ref);
          const res = await kbdbCredFetch(c.env, `/entries/${encodeURIComponent(entry.id)}`, { method: "DELETE" });
          if (!res.ok) throw new Error(`credential \u76EE\u9304\u522A\u9664\u5931\u6557\uFF1AHTTP ${res.status}`);
          invalidateCredentialCache(apiKey);
          return c.json({ success: true, name, source: "workers-secrets" });
        }
        await c.env.CREDENTIALS_KV.delete(`${apiKey}:cred:${name}`);
        return c.json({ success: true, name, source: "legacy-kv" });
      } catch (e) {
        return c.json({ success: false, error: e instanceof Error ? e.message : String(e) }, 502);
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

// ../../matrix/arcrun/cypher-executor/src/actions/auth-dispatcher.ts
async function resolveSecretsFromNewHome(env, apiKey, names) {
  const resolved = {};
  if (names.length === 0) return resolved;
  const refs = await getCredentialSecretRefs(env, apiKey);
  if (Object.keys(refs).length === 0) return resolved;
  const secretGet2 = createArcrunHostFunctions(env, apiKey).secret_get;
  if (!secretGet2) return resolved;
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
  return resolved;
}
async function tryAuthDispatch(componentId, input, env, apiKey) {
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
  const resolvedSecrets = await resolveSecretsFromNewHome(env, apiKey, secretNames);
  const primitiveUrl = wasmWorkerUrl(`auth_${recipe.primitive}`, env.WORKER_SUBDOMAIN);
  const res = await fetch(primitiveUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "authenticate",
      api_key: apiKey,
      service,
      // 只在有取到值時帶上（空物件也無妨，WASM 對 nil/空 map 同樣 fallback）
      resolved_secrets: resolvedSecrets
    })
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `auth primitive "${recipe.primitive}" \u56DE\u50B3 ${res.status}: ${text.slice(0, 200)}`
    );
  }
  const result = await res.json().catch(() => null);
  if (!result || result.success === false) {
    throw new Error(
      `auth primitive \u5931\u6557: ${result?.error ?? "\u672A\u77E5\u932F\u8AA4"}`
    );
  }
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
async function resolveCredentialRefs(data, env, apiKey) {
  const names = /* @__PURE__ */ new Set();
  collectCredentialNames(data, names);
  if (names.size === 0) return data;
  const nameList = [...names];
  const resolvedSecrets = await resolveSecretsFromNewHome(env, apiKey, nameList);
  const url = wasmWorkerUrl("auth_static_key", env.WORKER_SUBDOMAIN);
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
    throw new Error(`credential resolve \u56DE\u50B3 ${res.status}: ${text.slice(0, 200)}`);
  }
  const result = await res.json().catch(() => null);
  if (!result || result.success === false) {
    throw new Error(`credential resolve \u5931\u6557: ${result?.error ?? "\u672A\u77E5\u932F\u8AA4"}`);
  }
  return replaceCredentialRefs(data, result.credentials ?? {});
}
var SUPPORTED_PRIMITIVES, AUTH_PRIMITIVE_IDS, CREDENTIAL_REF;
var init_auth_dispatcher = __esm({
  "../../matrix/arcrun/cypher-executor/src/actions/auth-dispatcher.ts"() {
    "use strict";
    init_recipes();
    init_component_loader();
    init_wasi_shim();
    init_credentials();
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

// ../../matrix/arcrun/cypher-executor/node_modules/.pnpm/zod@3.23.8/node_modules/zod/lib/index.mjs
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
  "../../matrix/arcrun/cypher-executor/node_modules/.pnpm/zod@3.23.8/node_modules/zod/lib/index.mjs"() {
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
        const shape = this._def.shape();
        const keys = util.objectKeys(shape);
        return this._cached = { shape, keys };
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
        const { shape, keys: shapeKeys } = this._getCached();
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
          const keyValidator = shape[key];
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
        const shape = {};
        util.objectKeys(mask).forEach((key) => {
          if (mask[key] && this.shape[key]) {
            shape[key] = this.shape[key];
          }
        });
        return new _ZodObject({
          ...this._def,
          shape: () => shape
        });
      }
      omit(mask) {
        const shape = {};
        util.objectKeys(this.shape).forEach((key) => {
          if (!mask[key]) {
            shape[key] = this.shape[key];
          }
        });
        return new _ZodObject({
          ...this._def,
          shape: () => shape
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
    ZodObject.create = (shape, params) => {
      return new ZodObject({
        shape: () => shape,
        unknownKeys: "strip",
        catchall: ZodNever.create(),
        typeName: ZodFirstPartyTypeKind.ZodObject,
        ...processCreateParams(params)
      });
    };
    ZodObject.strictCreate = (shape, params) => {
      return new ZodObject({
        shape: () => shape,
        unknownKeys: "strict",
        catchall: ZodNever.create(),
        typeName: ZodFirstPartyTypeKind.ZodObject,
        ...processCreateParams(params)
      });
    };
    ZodObject.lazycreate = (shape, params) => {
      return new ZodObject({
        shape,
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

// ../../matrix/arcrun/cypher-executor/src/lib/prompt-recipe-schema.ts
var TransformSchema, KBDBBlockFragmentSchema, KVFragmentSchema, FragmentSchema, InputSchema, PromptAssemblySchema, OutputSpecSchema, PromptRecipeSchema;
var init_prompt_recipe_schema = __esm({
  "../../matrix/arcrun/cypher-executor/src/lib/prompt-recipe-schema.ts"() {
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

// ../../matrix/arcrun/cypher-executor/src/lib/recipe-loader.ts
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
  "../../matrix/arcrun/cypher-executor/src/lib/recipe-loader.ts"() {
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

// ../../matrix/arcrun/cypher-executor/src/lib/recipe-transforms.ts
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
  "../../matrix/arcrun/cypher-executor/src/lib/recipe-transforms.ts"() {
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

// ../../matrix/arcrun/cypher-executor/src/lib/recipe-expander.ts
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
  const base = (env.KBDB_BASE_URL ?? "https://kbdb.finally.click").replace(/\/$/, "");
  let url;
  if (fragment.block_id) {
    url = `${base}/blocks/${encodeURIComponent(fragment.block_id)}`;
  } else {
    url = `${base}/blocks?page_name=${encodeURIComponent(fragment.block_page_name)}&limit=1`;
  }
  const res = await fetch(url, { headers: { Authorization: `Bearer ${apiKey}` } });
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
  "../../matrix/arcrun/cypher-executor/src/lib/recipe-expander.ts"() {
    "use strict";
    init_recipe_loader();
    init_recipe_transforms();
  }
});

// ../../matrix/arcrun/cypher-executor/src/lib/paused-runs.ts
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
  "../../matrix/arcrun/cypher-executor/src/lib/paused-runs.ts"() {
    "use strict";
    KEY_PREFIX = "paused_run:";
    IDX_PREFIX = "paused_idx:";
    TTL_SECONDS = 24 * 60 * 60;
  }
});

// ../../matrix/arcrun/cypher-executor/src/lib/magic-vars.ts
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
  "../../matrix/arcrun/cypher-executor/src/lib/magic-vars.ts"() {
    "use strict";
  }
});

// ../../matrix/arcrun/cypher-executor/src/lib/telemetry.ts
async function hashApiKey(apiKey) {
  if (!apiKey) return "anon";
  const encoder = new TextEncoder();
  const data = encoder.encode(apiKey);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.slice(0, 8).map((b) => b.toString(16).padStart(2, "0")).join("");
}
function kbdbCreateBlockUrl(env) {
  const subdomain = env.WORKER_SUBDOMAIN || "uncle6-me";
  return `https://arcrun-kbdb-create-block.${subdomain}.workers.dev`;
}
function recordTelemetry(env, apiKey, record, ctx) {
  const promise = (async () => {
    try {
      const api_key_hash = await hashApiKey(apiKey ?? "");
      const platformKey = env.PLATFORM_API_KEY || apiKey || "";
      if (!platformKey) {
        console.warn("[telemetry] no api_key, skipping");
        return;
      }
      const body = {
        api_key: platformKey,
        type: "agent-telemetry",
        source: "cypher-executor",
        user_id: "platform_telemetry",
        content: JSON.stringify(record),
        metadata_json: JSON.stringify({ ...record, api_key_hash }),
        tags_json: JSON.stringify([
          "agent-telemetry",
          `event:${record.event_type}`
        ])
      };
      const res = await fetch(kbdbCreateBlockUrl(env), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      if (!res.ok) {
        console.warn(
          "[telemetry] write failed",
          res.status,
          await res.text().catch(() => "no body")
        );
      }
    } catch (e) {
      console.warn("[telemetry] exception", e);
    }
  })();
  if (ctx?.waitUntil) {
    ctx.waitUntil(promise);
  }
}
var init_telemetry = __esm({
  "../../matrix/arcrun/cypher-executor/src/lib/telemetry.ts"() {
    "use strict";
  }
});

// ../../matrix/arcrun/cypher-executor/src/graph-executor.ts
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
  "../../matrix/arcrun/cypher-executor/src/graph-executor.ts"() {
    "use strict";
    init_types();
    init_auth_dispatcher();
    init_recipe_expander();
    init_recipes();
    init_paused_runs();
    init_magic_vars();
    init_telemetry();
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
      constructor(loader, workflowLoader, env, apiKey) {
        this.loader = loader;
        this.workflowLoader = workflowLoader;
        this.env = env;
        this.apiKey = apiKey;
      }
      async execute(graph, initialContext, kvNamespace) {
        const trace = [];
        const kvStore = kvNamespace ? { runId: `${graph.id}-${Date.now()}`, kv: kvNamespace } : void 0;
        this.currentGraph = graph;
        this.currentRunId = kvStore?.runId ?? `${graph.id}-${Date.now()}`;
        const ctxWithMagic = {
          ...initialContext,
          ...buildMagicVars()
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
        const results = await Promise.all(
          startNodes.map(
            (node) => this.executeNode(node, graph, ctxWithMagic, /* @__PURE__ */ new Set(), trace, fanIn, kvStore)
          )
        );
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
        return { data: mergedResult, trace };
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
          return { data: callback_result, trace };
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
        const results = await Promise.all(
          downstreamNodes.map(
            (node) => this.executeNode(node, graph, mergedContext, visited, trace, fanIn, kvStore)
          )
        );
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
        return { data: mergedResult, trace };
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
              const resolvedData = interpolateData(node.data, ctx);
              let mergedContext = {
                ...ctx,
                ...resolvedData
              };
              if (this.env && this.apiKey) {
                mergedContext = await resolveCredentialRefs(mergedContext, this.env, this.apiKey);
              }
              if (node.componentId === "claude_api") {
                const baseUrl = this.env?.PUBLIC_BASE_URL ?? "https://cypher.arcrun.dev";
                mergedContext.callback_url = `${baseUrl.replace(/\/$/, "")}/workflows/resume`;
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
                const dispatched = await tryAuthDispatch(node.componentId, mergedContext, this.env, this.apiKey);
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
                  input: nodeInput,
                  output: result,
                  duration_ms: Date.now() - start
                });
                await persistPausedRun(this.env.EXEC_CONTEXT, pending.task_id, {
                  run_id: this.currentRunId,
                  graph: this.currentGraph,
                  paused_node_id: node.id,
                  paused_context: context,
                  paused_pending_result: result,
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
          const errMsg = e.message || String(e);
          const duration_ms2 = Date.now() - start;
          trace.push({
            nodeId: node.id,
            type: node.type,
            input: nodeInput,
            output: null,
            error: errMsg,
            duration_ms: duration_ms2
          });
          if (this.env && node.type === "Component") {
            recordTelemetry(this.env, this.apiKey, {
              event_type: "node_failure",
              workflow_name: graph.name,
              component_id: node.componentId,
              error_code: "node_error",
              duration_ms: duration_ms2
            });
          }
          if (e instanceof ExecutionError) throw e;
          throw new ExecutionError(
            `Node ${node.id} failed: ${errMsg}`,
            node.id,
            nodeInput,
            trace
          );
        }
        const duration_ms = Date.now() - start;
        trace.push({
          nodeId: node.id,
          type: node.type,
          input: nodeInput,
          output: result,
          duration_ms
        });
        if (this.env && node.type === "Component") {
          recordTelemetry(this.env, this.apiKey, {
            event_type: "node_success",
            workflow_name: graph.name,
            component_id: node.componentId,
            duration_ms
          });
        }
        const outEdges = graph.edges.filter((e) => e.from === node.id);
        for (const edge of outEdges) {
          const nextNode = graph.nodes.find((n) => n.id === edge.to);
          if (!nextNode) continue;
          switch (edge.type) {
            case "PIPE": {
              const pipeContext = propagateCtx(context, result, node.id);
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
                  result = await this.executeNode(nextNode, graph, fanInState.ctx, visited, trace, fanIn, kvStore);
                }
              } else {
                result = await this.executeNode(nextNode, graph, pipeContext, visited, trace, fanIn, kvStore);
              }
              break;
            }
            case "ON_SUCCESS": {
              if (!isFailure(result)) {
                const mergedCtx = propagateCtx(context, result, node.id);
                result = await this.executeNode(nextNode, graph, mergedCtx, visited, trace, fanIn, kvStore);
              }
              break;
            }
            case "ON_FAIL": {
              if (isFailure(result)) {
                const mergedCtx = propagateCtx(context, result, node.id);
                result = await this.executeNode(nextNode, graph, mergedCtx, visited, trace, fanIn, kvStore);
              }
              break;
            }
            case "IF": {
              const passes = evaluateCondition(edge.condition ?? "true", result);
              if (passes) {
                const mergedCtx = propagateCtx(context, result, node.id);
                result = await this.executeNode(nextNode, graph, mergedCtx, visited, trace, fanIn, kvStore);
              }
              break;
            }
            // ── 條件邊（SDD workflow-discovery 3.11 / CP arcrun-usable 步驟 5 缺口①）──
            // 為什麼要有：`if_control` 回 {result, branch} 卻沒有邊讀得懂它，
            // AI 照規矩用了零件仍得寫 code 判斷走哪條 ⇒「全變成 code」的根（Arcrun#5）。
            // 讀法對齊零件 output_schema：優先 data.branch（if_control/switch 的正式形狀），
            // 相容 top-level branch / result 布林。讀不出分支＝不走（誠實，不亂挑一條）。
            case "ON_TRUE": {
              if (readBranch(result) === "true") {
                const mergedCtx = propagateCtx(context, result, node.id);
                result = await this.executeNode(nextNode, graph, mergedCtx, visited, trace, fanIn, kvStore);
              }
              break;
            }
            case "ON_FALSE": {
              if (readBranch(result) === "false") {
                const mergedCtx = propagateCtx(context, result, node.id);
                result = await this.executeNode(nextNode, graph, mergedCtx, visited, trace, fanIn, kvStore);
              }
              break;
            }
            case "ON_BRANCH": {
              const actual = readBranch(result);
              if (edge.branch !== void 0 && actual !== void 0 && actual === edge.branch) {
                const mergedCtx = propagateCtx(context, result, node.id);
                result = await this.executeNode(nextNode, graph, mergedCtx, visited, trace, fanIn, kvStore);
              }
              break;
            }
            case "FOREACH": {
              const iteratorKey = edge.iterator ?? "item";
              let items = getIterableFromContext(result, iteratorKey);
              if (items.length === 0) {
                items = getIterableFromContext(context, iteratorKey);
              }
              const iterResults = [];
              const baseForeachCtx = propagateCtx(context, result, node.id);
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
              result = { ...result, results: iterResults };
              break;
            }
            case "CALLS_SUBFLOW": {
              const subWorkflowId = nextNode.componentId?.replace("workflow://", "") ?? nextNode.id;
              if (this.workflowLoader) {
                const subGraph = await this.workflowLoader(subWorkflowId);
                const subExecutor = new _GraphExecutor(this.loader, this.workflowLoader);
                const subResult = await subExecutor.execute(
                  subGraph,
                  result,
                  kvStore?.kv
                );
                result = {
                  ...result,
                  ...subResult.data
                };
              }
              break;
            }
            case "ON_CLICK": {
              const mergedCtx = propagateCtx(context, result, node.id);
              result = await this.executeNode(nextNode, graph, mergedCtx, visited, trace, fanIn, kvStore);
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
        return result;
      }
    };
  }
});

// ../../matrix/arcrun/cypher-executor/src/lib/schemas.ts
var graphSchema, executeSchema;
var init_schemas = __esm({
  "../../matrix/arcrun/cypher-executor/src/lib/schemas.ts"() {
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

// ../../matrix/arcrun/cypher-executor/src/actions/execution-evaluator.ts
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
async function recordComponentStats(env, nodes, trace) {
  try {
    const base = (env.REGISTRY_BASE_URL ?? (env.WORKER_SUBDOMAIN ? wasmWorkerUrl("registry", env.WORKER_SUBDOMAIN) : void 0))?.replace(/\/$/, "");
    if (!base) return;
    const verdicts = componentVerdictsFromTrace(nodes, trace);
    if (verdicts.length === 0) return;
    await Promise.all(
      verdicts.map(
        (v) => fetch(`${base}/analytics/record`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            canonical_id: v.component_id,
            success: v.success,
            duration_ms: v.duration_ms
          })
        }).catch(() => void 0)
        // 統計失敗不影響執行
      )
    );
  } catch {
  }
}
var init_execution_evaluator = __esm({
  "../../matrix/arcrun/cypher-executor/src/actions/execution-evaluator.ts"() {
    "use strict";
    init_component_loader();
  }
});

// ../../matrix/arcrun/cypher-executor/src/actions/webhook-handlers.ts
var webhook_handlers_exports = {};
__export(webhook_handlers_exports, {
  executeWebhookGraph: () => executeWebhookGraph,
  generateToken: () => generateToken,
  validateAndParseWebhook: () => validateAndParseWebhook
});
function recordRecipeStats(env, recipeKeys, ok, at, ctx) {
  if (recipeKeys.size === 0) return;
  const base = (env.KBDB_BASE_URL ?? "https://kbdb.finally.click").replace(/\/$/, "");
  const headers = { "Content-Type": "application/json" };
  if (env.KBDB_INTERNAL_TOKEN) headers["Authorization"] = `Bearer ${env.KBDB_INTERNAL_TOKEN}`;
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
      env.EXEC_CONTEXT
    );
    const duration_ms = Date.now() - start;
    recordTelemetry(env, apiKey, {
      event_type: "run_success",
      workflow_name: token,
      duration_ms,
      agent_user_agent: userAgent
    }, ctx);
    recordRecipeStats(env, executor.usedRecipeKeys, true, Date.now(), ctx);
    {
      const statsPromise = recordComponentStats(
        env,
        parsed.data.nodes,
        result.trace
      );
      if (ctx?.waitUntil) ctx.waitUntil(statsPromise);
      else void statsPromise;
    }
    return { success: true, data: result.data, duration_ms };
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
  "../../matrix/arcrun/cypher-executor/src/actions/webhook-handlers.ts"() {
    "use strict";
    init_types();
    init_graph_executor();
    init_schemas();
    init_component_loader();
    init_telemetry();
    init_execution_evaluator();
  }
});

// ../../matrix/arcrun/cypher-executor/src/index.ts
init_dist();

// ../../matrix/arcrun/cypher-executor/node_modules/.pnpm/hono@4.12.10/node_modules/hono/dist/middleware/cors/index.js
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
          return (origin) => origin || null;
        }
        return () => optsOrigin;
      } else {
        return (origin) => optsOrigin === origin ? origin : null;
      }
    } else if (typeof optsOrigin === "function") {
      return optsOrigin;
    } else {
      return (origin) => optsOrigin.includes(origin) ? origin : null;
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

// ../../matrix/arcrun/cypher-executor/src/lib/cron-match.ts
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

// ../../matrix/arcrun/cypher-executor/src/lib/cron-index.ts
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

// ../../matrix/arcrun/cypher-executor/src/scheduled.ts
init_webhook_handlers();
init_kbdb_proxy();
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
    ctx.waitUntil(
      executeWebhookGraph(env, record.graph, triggerContext, name, apiKey).then(
        (r) => console.log("[scheduled] done", name, r.success, r.duration_ms + "ms"),
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
}

// ../../matrix/arcrun/cypher-executor/src/routes/health.ts
init_dist();

// ../../matrix/arcrun/cypher-executor/src/lib/portal-auth-store.ts
init_credentials();
var AUTH_STORE_PREFIX = "ARCRUN_AUTH_STORE";
var SHARD_MAX_BYTES = 4600;
var AUTH_OVERLAY_TTL_MS = 18e4;
var ACCEL_KEY = "auth_store_recent";
var ACCEL_TTL_SECONDS = 600;
var AUTH_ID_PREFIX = "auth:";
var AuthStoreWriteError = class extends Error {
};
var overlay = null;
var overlayAt = 0;
function emptyStore() {
  return { version: 1, console: null, users: [] };
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
function authStorePresent(env) {
  return shardNames(env).length > 0 || overlay !== null && Date.now() - overlayAt < AUTH_OVERLAY_TTL_MS;
}
function authStoreWritable(env) {
  return Boolean(env.CF_SECRETS_API_TOKEN && env.CF_ACCOUNT_ID);
}
function readAuthStore(env) {
  if (overlay && Date.now() - overlayAt < AUTH_OVERLAY_TTL_MS) return overlay;
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
function newAuthUserId() {
  const arr = new Uint8Array(12);
  crypto.getRandomValues(arr);
  return AUTH_ID_PREFIX + Array.from(arr).map((b) => b.toString(16).padStart(2, "0")).join("");
}
async function writeAuthStore(env, data) {
  if (!authStoreWritable(env)) {
    throw new AuthStoreWriteError(
      "\u9019\u53F0\u5BE6\u4F8B\u9084\u4E0D\u80FD\u5BEB\u5165\u8A8D\u8B49\u5132\u5B58\uFF08\u7F3A CF_SECRETS_API_TOKEN / CF_ACCOUNT_ID\uFF09\u3002\u8A8D\u8B49\u5206\u96E2\u9700\u8981\u9019\u5169\u9805\u624D\u5BEB\u5F97\u9032 Workers Secrets\u2014\u2014\u8ACB\u91CD\u65B0\u57F7\u884C\u5B89\u88DD\uFF0F\u66F4\u65B0\u8B93\u5B83\u5C31\u7DD2\u3002"
    );
  }
  const shards = [];
  let current = { v: 1, console: data.console ?? null, users: [] };
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
    await putWorkerSecret(env, shardNameOf(i), shards[i]);
  }
  for (const name of existing) {
    if (shardIndex(name) >= shards.length) await deleteWorkerSecret(env, name);
  }
  overlay = { version: 1, console: data.console ?? null, users: [...data.users] };
  overlayAt = Date.now();
  try {
    await env.SESSIONS_KV.put(
      ACCEL_KEY,
      JSON.stringify({ written_at: Date.now(), data: overlay }),
      { expirationTtl: ACCEL_TTL_SECONDS }
    );
  } catch {
  }
}
async function hydrateFromAccelerator(env) {
  let raw2 = null;
  try {
    raw2 = await env.SESSIONS_KV.get(ACCEL_KEY);
  } catch {
    return false;
  }
  if (!raw2) return false;
  try {
    const parsed = JSON.parse(raw2);
    if (!parsed?.data || !Array.isArray(parsed.data.users)) return false;
    if (overlay && overlayAt >= (parsed.written_at ?? 0)) return false;
    overlay = { version: 1, console: parsed.data.console ?? null, users: parsed.data.users };
    overlayAt = parsed.written_at ?? Date.now();
    return true;
  } catch {
    return false;
  }
}
async function mutateAuthStore(env, fn) {
  const data = readAuthStore(env);
  const next = { version: 1, console: data.console, users: [...data.users] };
  await fn(next);
  await writeAuthStore(env, next);
  return next;
}
function authStoreStatus(env) {
  const data = readAuthStore(env);
  return {
    present: authStorePresent(env),
    writable: authStoreWritable(env),
    users: data.users.length,
    console_configured: Boolean(data.console),
    shards: shardNames(env).length
  };
}

// ../../matrix/arcrun/cypher-executor/src/routes/health.ts
var healthRouter = new Hono2();
healthRouter.get("/health", (c) => {
  const bundleVersion = c.env.ARCRUN_BUNDLE_VERSION;
  return c.json({
    ok: true,
    ...bundleVersion ? { bundle_version: bundleVersion } : {},
    auth_store: authStoreStatus(c.env)
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

// ../../matrix/arcrun/cypher-executor/src/routes/execute.ts
init_dist();
init_types();
init_graph_executor();
init_schemas();
init_component_loader();

// ../../matrix/arcrun/cypher-executor/src/actions/execution-logger.ts
init_kbdb_proxy();
function extractTarget(input) {
  if (!input) return void 0;
  const raw2 = input.page_name ?? input.path;
  if (raw2 === void 0 || raw2 === null) return void 0;
  return typeof raw2 === "string" ? raw2 : JSON.stringify(raw2);
}
async function writeExecutionVerdict(env, workflowId, nodes, verdict, durationMs, message, input, apiKey) {
  void nodes;
  try {
    const { base, headers } = kbdbBase(env);
    await fetch(`${base}/execution-log/record`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        workflow_id: workflowId,
        owner_id: apiKey ?? null,
        verdict,
        duration_ms: Math.max(0, Math.round(durationMs)),
        message: message ?? "",
        target: extractTarget(input) ?? null
      })
    });
  } catch {
  }
}

// ../../matrix/arcrun/cypher-executor/src/routes/execute.ts
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
    const result = await executor.execute(graph, context, c.env.EXEC_CONTEXT);
    const duration_ms = Date.now() - start;
    c.executionCtx.waitUntil(
      writeExecutionVerdict(c.env, graph.id, graph.nodes, "success", duration_ms, "\u57F7\u884C\u5B8C\u6210", context, apiKey)
    );
    return c.json({ success: true, data: result.data, trace: result.trace, duration_ms });
  } catch (err) {
    const duration_ms = Date.now() - start;
    const errMsg = err instanceof Error ? err.message : String(err);
    c.executionCtx.waitUntil(
      writeExecutionVerdict(c.env, graph.id, graph.nodes, "failed", duration_ms, errMsg.slice(0, 100), context, apiKey)
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

// ../../matrix/arcrun/cypher-executor/src/routes/cypher.ts
init_dist();

// ../../matrix/arcrun/cypher-executor/src/actions/cypher-handlers.ts
init_types();
init_graph_executor();
init_schemas();
init_component_loader();
init_execution_evaluator();

// ../../matrix/arcrun/cypher-executor/src/actions/triplet-parser.ts
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

// ../../matrix/arcrun/cypher-executor/src/actions/search-nodes.ts
init_component_loader();
init_recipes();

// ../../matrix/arcrun/cypher-executor/src/lib/branch-hints.ts
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

// ../../matrix/arcrun/cypher-executor/src/actions/search-nodes.ts
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
  const sub = env?.WORKER_SUBDOMAIN;
  const registryBase = env?.REGISTRY_BASE_URL ?? (sub ? wasmWorkerUrl("registry", sub) : void 0);
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

// ../../matrix/arcrun/cypher-executor/src/actions/graph-builder.ts
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

// ../../matrix/arcrun/cypher-executor/src/actions/cypher-handlers.ts
async function handleCypherSearch(triplets, env, mode = "discover", target) {
  const parsed = parseTriplets(triplets);
  if (!parsed) {
    throw new Error("\u7121\u6CD5\u89E3\u6790\u4EFB\u4F55\u7BC0\u9EDE");
  }
  const { nodeResults, missingNodes } = await searchNodes(parsed, void 0, env, mode, target);
  const graph = buildExecutionGraph(parsed, nodeResults, "cypher-search-result", "Cypher Search Result");
  return { nodes: nodeResults, cypher: { nodes: graph.nodes, edges: graph.edges }, missing: missingNodes };
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
    const result = await executor.execute(parseResult.data, context ?? {}, env.EXEC_CONTEXT);
    const duration_ms = Date.now() - start;
    waitUntil(recordComponentStats(env, graph.nodes, result.trace));
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

// ../../matrix/arcrun/cypher-executor/src/actions/target-search.ts
init_component_loader();

// ../../matrix/arcrun/cypher-executor/src/lib/workflow-search.ts
async function fetchTenantWorkflowSearch(env, apiKey, q, mode = "semantic") {
  const base = (env.KBDB_BASE_URL ?? "https://arcrun-kbdb.uncle6-me.workers.dev").replace(/\/$/, "");
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

// ../../matrix/arcrun/cypher-executor/src/actions/target-search.ts
async function searchByTarget(target, query, env, apiKey) {
  if (target === "component") {
    const sub = env.WORKER_SUBDOMAIN;
    const registryBase = env.REGISTRY_BASE_URL ?? (sub ? wasmWorkerUrl("registry", sub) : void 0);
    if (!registryBase) return { ok: false, status: 502, error: "registry \u4F4D\u7F6E\u672A\u8A2D\u5B9A\uFF08WORKER_SUBDOMAIN\uFF0FREGISTRY_BASE_URL \u7686\u7F3A\uFF09" };
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

// ../../matrix/arcrun/cypher-executor/src/routes/cypher.ts
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

// ../../matrix/arcrun/cypher-executor/src/routes/validate.ts
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

// ../../matrix/arcrun/cypher-executor/src/routes/docs.ts
init_dist();

// ../../matrix/arcrun/cypher-executor/src/lib/openapi.ts
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

// ../../matrix/arcrun/cypher-executor/src/routes/docs.ts
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

// ../../matrix/arcrun/cypher-executor/src/routes/webhooks.ts
init_dist();
init_webhook_handlers();

// ../../matrix/arcrun/cypher-executor/src/actions/webhook-graph-resolver.ts
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

// ../../matrix/arcrun/cypher-executor/src/routes/webhooks.ts
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
    writeExecutionVerdict(c.env, workflowId, nodes, result.success ? "success" : "failed", result.duration_ms, result.error ?? "", triggerContext, apiKey)
  );
  return c.json(result, result.success ? 200 : 500);
});

// ../../matrix/arcrun/cypher-executor/src/routes/webhooks-crud.ts
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

// ../../matrix/arcrun/cypher-executor/src/routes/webhooks-list.ts
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

// ../../matrix/arcrun/cypher-executor/src/index.ts
init_recipes();
init_credentials();

// ../../matrix/arcrun/cypher-executor/src/routes/webhooks-named.ts
init_dist();
init_webhook_handlers();
init_telemetry();
var webhooksNamedRouter = new Hono2();
function kvKey(apiKey, name) {
  return `${apiKey}:wf:${name}`;
}
async function writeWorkflowSearchEntry(env, apiKey, name, description, workflowId) {
  const base = (env.KBDB_BASE_URL ?? "https://arcrun-kbdb.uncle6-me.workers.dev").replace(/\/$/, "");
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
  const cronExpr = extractCronExpr(body.graph);
  const record = {
    name,
    graph: body.graph,
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
    created_at: record.created_at
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
        (result2) => writeExecutionVerdict(c.env, workflowId, nodes, result2.success ? "success" : "failed", result2.duration_ms, result2.error ?? "", triggerContext, apiKey)
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
    writeExecutionVerdict(c.env, workflowId, nodes, result.success ? "success" : "failed", result.duration_ms, result.error ?? "", triggerContext, apiKey)
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
    writeExecutionVerdict(c.env, workflowId, nodes, result.success ? "success" : "failed", result.duration_ms, result.error ?? "", triggerContext, apiKey)
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

// ../../matrix/arcrun/cypher-executor/src/routes/auth.ts
init_dist();
init_credentials();
var authRouter = new Hono2();
function getLandingOrigin(c) {
  const origin = c.req.raw.headers.get("origin");
  const allowed = ["https://arcrun.dev", "https://www.arcrun.dev"];
  if (origin && allowed.includes(origin)) return origin;
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
    const sess = await c.env.SESSIONS_KV.get(`sess:${sessId}`, "json");
    if (sess && sess.expires_at > Date.now()) {
      const user = await c.env.USERS_KV.get(sess.user_key, "json");
      if (user && !user.revoked) return user;
    }
  }
  const apiKey = getApiKeyFromRequest(c.req.raw);
  if (apiKey) {
    const userKey = await c.env.USERS_KV.get(`apikey:${apiKey}`);
    if (userKey) {
      const user = await c.env.USERS_KV.get(userKey, "json");
      if (user && !user.revoked && user.api_key === apiKey) return user;
    }
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
  await c.env.SESSIONS_KV.put(`state:${state}`, JSON.stringify(stateRecord), { expirationTtl: 600 });
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
  await c.env.SESSIONS_KV.put(`state:${state}`, JSON.stringify(stateRecord), { expirationTtl: 600 });
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
  const stateRecord = await c.env.SESSIONS_KV.get(`state:${state}`, "json");
  if (!stateRecord) {
    return Response.redirect(`${landingOrigin}/login?error=invalid_state`, 302);
  }
  await c.env.SESSIONS_KV.delete(`state:${state}`);
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
    const userKey = `user:${provider}:${providerId}`;
    const existing = await c.env.USERS_KV.get(userKey, "json");
    let apiKey;
    if (existing && !existing.revoked) {
      apiKey = existing.api_key;
      const updated = { ...existing, display_name: displayName, avatar_url: avatarUrl };
      await c.env.USERS_KV.put(userKey, JSON.stringify(updated));
    } else {
      apiKey = generateApiKey();
      const newUser = {
        email,
        display_name: displayName,
        avatar_url: avatarUrl,
        api_key: apiKey,
        provider,
        provider_id: providerId,
        created_at: (/* @__PURE__ */ new Date()).toISOString()
      };
      await c.env.USERS_KV.put(userKey, JSON.stringify(newUser));
      await c.env.USERS_KV.put(`apikey:${apiKey}`, userKey);
    }
    if (pendingCredential) {
      try {
        await storeCredential(c.env, apiKey, pendingCredential.name, pendingCredential.value, pendingCredential.service);
      } catch (e) {
        console.error("\u5B58 provider token \u5931\u6557\uFF08\u4E0D\u5F71\u97FF\u767B\u5165\uFF09:", e instanceof Error ? e.message : String(e));
      }
    }
    const sessionId = randomToken(32);
    const session = {
      user_key: userKey,
      api_key: apiKey,
      email,
      expires_at: Date.now() + 7 * 24 * 60 * 60 * 1e3
    };
    await c.env.SESSIONS_KV.put(`sess:${sessionId}`, JSON.stringify(session), {
      expirationTtl: 7 * 24 * 60 * 60
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
    await c.env.SESSIONS_KV.delete(`sess:${sessId}`);
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
  const oldKey = user.api_key;
  const userKey = `user:${user.provider}:${user.provider_id}`;
  const updated = { ...user, api_key: newKey };
  await c.env.USERS_KV.put(userKey, JSON.stringify(updated));
  await c.env.USERS_KV.delete(`apikey:${oldKey}`);
  await c.env.USERS_KV.put(`apikey:${newKey}`, userKey);
  return c.json({
    success: true,
    api_key: newKey,
    message: "API Key rotated. Your existing workflow credentials are still stored under the old key namespace."
  });
});
authRouter.delete("/me/api-key", async (c) => {
  const user = await resolveSession(c);
  if (!user) return c.json({ error: "not authenticated" }, 401);
  const userKey = `user:${user.provider}:${user.provider_id}`;
  const revoked = { ...user, revoked: true };
  await c.env.USERS_KV.put(userKey, JSON.stringify(revoked));
  await c.env.USERS_KV.delete(`apikey:${user.api_key}`);
  const sessId = getSessionId(c.req.raw);
  if (sessId) await c.env.SESSIONS_KV.delete(`sess:${sessId}`);
  return new Response(JSON.stringify({ success: true, message: "API Key revoked." }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": "arcrun_session=; Path=/; HttpOnly; Secure; SameSite=Lax; Domain=.arcrun.dev; Max-Age=0"
    }
  });
});

// ../../matrix/arcrun/cypher-executor/src/routes/resume.ts
init_dist();
init_types();
init_graph_executor();
init_component_loader();
init_paused_runs();
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
      kvNamespace: c.env.EXEC_CONTEXT,
      recipe_output_format: state.recipe_output_format,
      recipe_output_required_fields: state.recipe_output_required_fields
    });
    const duration_ms = Date.now() - start;
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

// ../../matrix/arcrun/cypher-executor/src/routes/executions.ts
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

// ../../matrix/arcrun/cypher-executor/src/routes/init-seed.ts
init_dist();
init_hash();
init_recipes();

// ../../matrix/arcrun/cypher-executor/src/lib/api-recipe-seeds.ts
var API_RECIPE_SEEDS = [
  // ── KBDB（Supabase 模式，auth_service=kbdb static_key）──
  {
    canonical_id: "kbdb_get",
    display_name: "KBDB Get",
    description: "GET \u8B80\u53D6 block / \u67E5\u8A62\u3002_path \u5E36\u67E5\u8A62\u8DEF\u5F91\u3002auth: kbdb static_key\u3002",
    endpoint: "https://kbdb.finally.click{{_path}}",
    method: "GET",
    auth_service: "kbdb"
  },
  {
    canonical_id: "kbdb_create_block",
    display_name: "KBDB Create Block",
    description: "POST /blocks \u5EFA\u7ACB block\u3002body \u5E36 block \u6B04\u4F4D\uFF08content/type/page_name/source/user_id \u7B49\uFF09\u3002auth: kbdb static_key\u3002",
    endpoint: "https://kbdb.finally.click/blocks",
    method: "POST",
    auth_service: "kbdb"
  },
  {
    canonical_id: "kbdb_patch_block",
    display_name: "KBDB Patch Block",
    description: "PATCH /blocks/:id \u5C40\u90E8\u66F4\u65B0\u3002_path \u5E36 /blocks/{id}\uFF0Cbody \u5E36\u8981\u6539\u7684\u6B04\u4F4D\u3002auth: kbdb static_key\u3002",
    endpoint: "https://kbdb.finally.click{{_path}}",
    method: "PATCH",
    auth_service: "kbdb"
  },
  {
    canonical_id: "kbdb_delete",
    display_name: "KBDB Delete",
    description: "DELETE /blocks/:id \u522A\u9664 block\u3002_path \u5E36 /blocks/{id}\u3002auth: kbdb static_key\u3002",
    endpoint: "https://kbdb.finally.click{{_path}}",
    method: "DELETE",
    auth_service: "kbdb"
  },
  {
    canonical_id: "kbdb_ingest",
    display_name: "KBDB Ingest",
    description: "POST /blocks/ingest \u6279\u6B21\u5BEB\u5165\u3002body \u5E36 input\u3002auth: kbdb static_key\u3002",
    endpoint: "https://kbdb.finally.click/blocks/ingest",
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
  }
];

// ../../matrix/arcrun/cypher-executor/src/lib/auth-recipe-seeds.ts
var now = Date.now();
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
    base_url: "https://kbdb.finally.click",
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
    required_secrets: [
      {
        key: "google_service_account",
        label: "Service Account JSON\uFF08\u6574\u4EFD\u8CBC\u4E0A\uFF09",
        type: "json_blob",
        help: "\u81F3 GCP Console \u2192 IAM \u2192 Service Accounts \u2192 Keys \u2192 Add Key \u2192 JSON\uFF0C\u4E0B\u8F09\u5F8C\u6574\u4EFD\u8CBC\u5165",
        help_url: "https://console.cloud.google.com/iam-admin/serviceaccounts"
      }
    ],
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
    required_secrets: [
      {
        key: "google_service_account",
        label: "Service Account JSON\uFF08\u6574\u4EFD\u8CBC\u4E0A\uFF09",
        type: "json_blob",
        help: "\u9700\u8981 Domain-Wide Delegation\uFF0C\u81F3 GCP Console \u2192 IAM \u2192 Service Accounts \u8A2D\u5B9A",
        help_url: "https://developers.google.com/workspace/guides/create-credentials#service-account"
      }
    ],
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
    required_secrets: [
      {
        key: "google_service_account",
        label: "Service Account JSON\uFF08\u6574\u4EFD\u8CBC\u4E0A\uFF09",
        type: "json_blob",
        help: "\u81F3 GCP Console \u2192 IAM \u2192 Service Accounts \u2192 Keys \u2192 Add Key \u2192 JSON",
        help_url: "https://console.cloud.google.com/iam-admin/serviceaccounts"
      }
    ],
    inject: {
      header: {
        Authorization: "Bearer {{runtime.access_token}}"
      }
    },
    created_at: now,
    updated_at: now
  }
];

// ../../matrix/arcrun/cypher-executor/src/routes/portal.ts
init_dist();
init_kbdb_proxy();

// ../../matrix/arcrun/cypher-executor/src/routes/console-auth.ts
init_dist();
var consoleAuthRouter = new Hono2();
var CREDS_KEY = "console:credentials";
var SESSION_PREFIX = "console_sess:";
var SESSION_TTL_SECONDS = 30 * 24 * 60 * 60;
async function validateConsoleSession(env, authHeader) {
  const token = (authHeader ?? "").match(/^Bearer\s+(\S+)/i)?.[1];
  if (!token) return false;
  const sess = await env.SESSIONS_KV.get(`${SESSION_PREFIX}${token}`);
  return !!sess;
}
function randomHex(bytes) {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return Array.from(arr).map((b) => b.toString(16).padStart(2, "0")).join("");
}
async function sha256Hex(input) {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
async function hashPassword(password, salt) {
  let h = `${salt}:${password}`;
  for (let i = 0; i < 3; i++) h = await sha256Hex(h);
  return h;
}
function tenantOf(c) {
  return c.env.CONSOLE_TENANT || "leo";
}
async function loadCredentials(env) {
  let fromStore = readAuthStore(env).console;
  if (!fromStore && await hydrateFromAccelerator(env)) {
    fromStore = readAuthStore(env).console;
  }
  if (fromStore) return { creds: fromStore, source: "secrets" };
  const raw2 = await env.SESSIONS_KV.get(CREDS_KEY);
  if (!raw2) return { creds: null, source: "none" };
  let legacy = null;
  try {
    legacy = JSON.parse(raw2);
  } catch {
    return { creds: null, source: "none" };
  }
  try {
    await mutateAuthStore(env, (data) => {
      if (!data.console) data.console = legacy;
    });
  } catch {
  }
  return { creds: legacy, source: "legacy-kv" };
}
async function saveCredentials(env, record) {
  await mutateAuthStore(env, (data) => {
    data.console = record;
  });
}
consoleAuthRouter.get("/console/auth-status", async (c) => {
  const { creds, source } = await loadCredentials(c.env);
  return c.json({ configured: !!creds, credentials_source: source, auth_store: authStoreStatus(c.env) });
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
    await saveCredentials(c.env, record);
  } catch (e) {
    const msg = e instanceof AuthStoreWriteError ? e.message : String(e);
    return c.json({ error: `\u5E33\u5BC6\u6C92\u6709\u5B58\u8D77\u4F86\uFF1A${msg}`, code: "auth_store_not_writable" }, 502);
  }
  const token = randomHex(32);
  await c.env.SESSIONS_KV.put(`${SESSION_PREFIX}${token}`, JSON.stringify({ created_at: Date.now() }), {
    expirationTtl: SESSION_TTL_SECONDS
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
    await saveCredentials(c.env, record);
  } catch (e) {
    const msg = e instanceof AuthStoreWriteError ? e.message : String(e);
    return c.json({ error: `\u65B0\u5E33\u5BC6\u6C92\u6709\u5B58\u8D77\u4F86\uFF1A${msg}`, code: "auth_store_not_writable" }, 502);
  }
  return c.json({ success: true });
});
consoleAuthRouter.post("/console/login", async (c) => {
  const { creds: existing } = await loadCredentials(c.env);
  if (!existing) {
    return c.json(
      {
        error: "\u9019\u53F0\u5BE6\u4F8B\u9084\u6C92\u6709\u7BA1\u7406\u54E1\u5E33\u5BC6\uFF08\u6216\u8B80\u4E0D\u5230\uFF09\u2014\u2014\u4E0D\u662F\u5BC6\u78BC\u932F\u3002\u8ACB\u5148\u5B8C\u6210\u9996\u6B21\u8A2D\u5B9A\u3002",
        code: "auth_store_empty",
        auth_store: authStoreStatus(c.env)
      },
      400
    );
  }
  const body = await c.req.json().catch(() => null);
  const email = (body?.email ?? "").trim().toLowerCase();
  const password = body?.password ?? "";
  if (!email || !password) return c.json({ error: "email \u8207 password \u5FC5\u586B" }, 400);
  let creds = existing;
  let hash = await hashPassword(password, creds.salt);
  if (email !== creds.email || hash !== creds.hash) {
    if (await hydrateFromAccelerator(c.env)) {
      const again = (await loadCredentials(c.env)).creds;
      if (again) {
        creds = again;
        hash = await hashPassword(password, creds.salt);
      }
    }
  }
  if (email !== creds.email || hash !== creds.hash) {
    return c.json({ error: "email \u6216\u5BC6\u78BC\u932F\u8AA4" }, 401);
  }
  const token = randomHex(32);
  await c.env.SESSIONS_KV.put(`${SESSION_PREFIX}${token}`, JSON.stringify({ created_at: Date.now() }), {
    expirationTtl: SESSION_TTL_SECONDS
  });
  return c.json({ success: true, session_token: token, tenant: tenantOf(c) });
});
consoleAuthRouter.get("/console/session", async (c) => {
  const auth = c.req.header("authorization") ?? "";
  const token = auth.match(/^Bearer\s+(\S+)/i)?.[1];
  if (!token) return c.json({ valid: false }, 401);
  const sess = await c.env.SESSIONS_KV.get(`${SESSION_PREFIX}${token}`);
  if (!sess) return c.json({ valid: false }, 401);
  return c.json({ valid: true, tenant: tenantOf(c) });
});
consoleAuthRouter.post("/console/logout", async (c) => {
  const auth = c.req.header("authorization") ?? "";
  const token = auth.match(/^Bearer\s+(\S+)/i)?.[1];
  if (token) await c.env.SESSIONS_KV.delete(`${SESSION_PREFIX}${token}`);
  return c.json({ success: true });
});

// ../../matrix/arcrun/cypher-executor/src/lib/portal-auth.ts
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
function generatePassword(length = 16) {
  const charset = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  const arr = new Uint8Array(length);
  crypto.getRandomValues(arr);
  let out = "";
  for (const b of arr) out += charset[b % charset.length];
  return out;
}

// ../../matrix/arcrun/cypher-executor/src/lib/portal-seeds.ts
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
    name: "portal_library",
    description: "RAG Portal \u5EAB\u76EE\u9304\u767B\u8A18\uFF08portal-auth \xA73.2\uFF1B\u5EAB\uFF1Dmetadata_json.$.library \u6A19\u8A18\uFF09",
    slots: ["name", "display_name", "description", "status", "graph_source"],
    created_by: "system"
  },
  {
    // t130：rag_ingest_card.post_triplet 寫 POST /records {template:'triplet'}。
    // 新實例若無此 template 回 400「template not found: triplet」→ 三元組全滅。
    // slots 來源：kbdb_list_templates 核實（2026-07-19，library-map.test.ts PROD_TRIPLET_SLOTS）
    // + library（library-map.ts M1 預案：recompute 歸庫用，ensurePortalTemplates 若缺則 PATCH 補入）。
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
      "library"
    ],
    created_by: "system"
  }
];

// ../../matrix/arcrun/cypher-executor/src/routes/portal.ts
init_credentials();
var portalRouter = new Hono2();
var SESSION_PREFIX2 = "portal_sess:";
var LOCKFAIL_PREFIX = "portal_lockfail:";
var LOCK_LIMIT = 5;
var LOCK_TTL_SECONDS = 15 * 60;
var DEFAULT_SESSION_TTL = 604800;
var USER_TEMPLATE = "portal_user";
var LIBRARY_TEMPLATE = "portal_library";
function portalTenant(env) {
  return env.CONSOLE_TENANT || "leo";
}
function portalNamespace(env) {
  return `${portalTenant(env)}::portal`;
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
async function kbdbFetch(env, path, init) {
  const { base, headers } = kbdbBase(env);
  let res;
  try {
    res = await fetch(`${base}${path}`, { ...init, headers: { ...headers, ...init?.headers } });
  } catch (e) {
    throw new KbdbError(`fetch ${path} \u5931\u6557\uFF1A${e instanceof Error ? e.message : String(e)}`);
  }
  return res;
}
async function run(c, fn) {
  try {
    return await fn();
  } catch (e) {
    if (e instanceof AuthStoreWriteError) {
      return c.json({ error: `\u8A8D\u8B49\u5132\u5B58\u5BEB\u5165\u5931\u6557\uFF1A${e.message}`, code: "auth_store_not_writable" }, 502);
    }
    if (e instanceof KbdbError) return c.json({ error: `KBDB \u4E0D\u53EF\u9054\u6216\u56DE\u932F\uFF1A${e.message}` }, 502);
    throw e;
  }
}
async function ensurePortalTemplates(env) {
  const created = [];
  const existing = [];
  const errors = [];
  for (const seed of PORTAL_TEMPLATE_SEEDS) {
    try {
      const got = await kbdbFetch(env, `/templates/${encodeURIComponent(seed.name)}`);
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
            const patched = await kbdbFetch(env, `/templates/${encodeURIComponent(tpl.id)}`, {
              method: "PATCH",
              body: JSON.stringify({ slots: [...currentSlots, ...missing] })
            });
            if (!patched.ok) throw new KbdbError(`PATCH /templates/${seed.name} \u88DC slots \u2192 ${patched.status}`);
          }
        }
        existing.push(seed.name);
        continue;
      }
      if (got.status !== 404) throw new KbdbError(`GET /templates/${seed.name} \u2192 ${got.status}`);
      const res = await kbdbFetch(env, "/templates", {
        method: "POST",
        body: JSON.stringify({
          name: seed.name,
          slots: seed.slots,
          description: seed.description,
          created_by: seed.created_by
        })
      });
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
async function promoteLegacyUser(env, rec) {
  try {
    const email = (rec.values.email ?? "").toLowerCase();
    if (!email) return;
    if (findAuthUserByEmail(env, email)) return;
    await mutateAuthStore(env, (data) => {
      if (data.users.some((u) => u.email === email)) return;
      data.users.push(recordValuesToAuthUser(newAuthUserId(), rec.values));
    });
  } catch {
  }
}
async function findUserRecordId(env, email) {
  const inStore = findAuthUserByEmail(env, email);
  if (inStore) return inStore.id;
  return findLegacyUserRecordId(env, email);
}
async function findLegacyUserRecordId(env, email) {
  const ns = portalNamespace(env);
  const params = new URLSearchParams({
    page_name: email,
    entry_type: USER_TEMPLATE,
    owner_id: ns,
    limit: "1"
  });
  const res = await kbdbFetch(env, `/entries?${params.toString()}`);
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
  const res = await kbdbFetch(env, `/records/${encodeURIComponent(recordId)}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new KbdbError(`GET /records/${recordId} \u2192 ${res.status}`);
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
  const res = await kbdbFetch(env, `/records/${encodeURIComponent(recordId)}`, {
    method: "PATCH",
    body: JSON.stringify({ values })
  });
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
  const res = await kbdbFetch(env, `/records/${encodeURIComponent(recordId)}`, { method: "DELETE" });
  if (res.status === 404) return false;
  if (!res.ok) throw new KbdbError(`DELETE /records/${recordId} \u2192 ${res.status}`);
  return true;
}
function daemonActiveKey(env) {
  return `${portalTenant(env)}:portal:daemon_active_libs`;
}
async function listRecordsByTemplate(env, template) {
  if (template === USER_TEMPLATE) {
    const fromStore = readAuthStore(env).users.map(authUserToRecord);
    const seen = new Set(fromStore.map((r) => (r.values.email ?? "").toLowerCase()));
    let legacy = [];
    try {
      legacy = await listLegacyRecordsByTemplate(env, template);
    } catch {
      legacy = [];
    }
    return [...fromStore, ...legacy.filter((r) => !seen.has((r.values.email ?? "").toLowerCase()))];
  }
  return listLegacyRecordsByTemplate(env, template);
}
async function listLegacyRecordsByTemplate(env, template) {
  const ns = portalNamespace(env);
  const res = await kbdbFetch(env, `/records/by-template/${encodeURIComponent(template)}?owner_id=${encodeURIComponent(ns)}`);
  if (!res.ok) throw new KbdbError(`GET /records/by-template/${template} \u2192 ${res.status}`);
  const body = await res.json();
  return body.records ?? [];
}
async function createPortalUser(env, input) {
  const now2 = (/* @__PURE__ */ new Date()).toISOString();
  const id = newAuthUserId();
  await mutateAuthStore(env, (data) => {
    data.users.push({
      id,
      email: input.email.toLowerCase(),
      display_name: input.display_name,
      status: "active",
      role: input.role,
      libraries: input.libraries,
      password_hash: input.password_hash,
      created_at: now2,
      updated_at: now2
    });
  });
  return id;
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
  const sess = await c.env.SESSIONS_KV.get(`${SESSION_PREFIX2}${token}`);
  if (!sess) return { ok: false, res: c.json({ error: "session \u7121\u6548\u6216\u5DF2\u904E\u671F" }, 401) };
  let recordId;
  try {
    recordId = JSON.parse(sess).record_id;
  } catch {
  }
  if (!recordId) {
    await c.env.SESSIONS_KV.delete(`${SESSION_PREFIX2}${token}`);
    return { ok: false, res: c.json({ error: "session \u7121\u6548\u6216\u5DF2\u904E\u671F" }, 401) };
  }
  const rec = await getRecordById(c.env, recordId);
  if (!rec) {
    await c.env.SESSIONS_KV.delete(`${SESSION_PREFIX2}${token}`);
    return { ok: false, res: c.json({ error: "session \u7121\u6548\u6216\u5DF2\u904E\u671F" }, 401) };
  }
  if ((rec.values.status ?? "") !== "active") {
    await c.env.SESSIONS_KV.delete(`${SESSION_PREFIX2}${token}`);
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
  const raw2 = await env.SESSIONS_KV.get(`${LOCKFAIL_PREFIX}${email}`);
  if (!raw2) return false;
  try {
    return (JSON.parse(raw2).count ?? 0) >= LOCK_LIMIT;
  } catch {
    return false;
  }
}
async function recordLoginFail(env, email) {
  const key = `${LOCKFAIL_PREFIX}${email}`;
  const raw2 = await env.SESSIONS_KV.get(key);
  let count = 0;
  if (raw2) {
    try {
      count = JSON.parse(raw2).count ?? 0;
    } catch {
      count = 0;
    }
  }
  await env.SESSIONS_KV.put(key, JSON.stringify({ count: count + 1 }), { expirationTtl: LOCK_TTL_SECONDS });
}
async function clearLoginFail(env, email) {
  await env.SESSIONS_KV.delete(`${LOCKFAIL_PREFIX}${email}`);
}
async function instanceHasNoAuthData(env) {
  if (readAuthStore(env).users.length > 0) return false;
  try {
    return (await listLegacyRecordsByTemplate(env, USER_TEMPLATE)).length === 0;
  } catch {
    return true;
  }
}
async function findAndVerifyUser(env, email, password) {
  const attempt = async () => {
    const recordId = await findUserRecordId(env, email);
    const rec = recordId ? await getRecordById(env, recordId) : null;
    const ok = rec ? await verifyPassword(password, rec.values.password_hash ?? "") : false;
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
portalRouter.post(
  "/portal/login",
  (c) => run(c, async () => {
    const body = await c.req.json().catch(() => null);
    const email = String(body?.email ?? "").trim().toLowerCase();
    const password = String(body?.password ?? "");
    if (!email || !password) return c.json({ error: "email \u8207 password \u5FC5\u586B" }, 400);
    if (await isLocked(c.env, email)) {
      return c.json({ error: "\u767B\u5165\u5931\u6557\u6B21\u6578\u904E\u591A\uFF0C\u5DF2\u66AB\u6642\u9396\u5B9A\uFF0C\u8ACB 15 \u5206\u9418\u5F8C\u518D\u8A66" }, 429);
    }
    const { recordId, rec, ok } = await findAndVerifyUser(c.env, email, password);
    if (!recordId || !rec) {
      if (await instanceHasNoAuthData(c.env)) {
        return c.json(
          {
            error: "\u9019\u53F0\u5BE6\u4F8B\u8B80\u4E0D\u5230\u4EFB\u4F55\u767B\u5165\u8CC7\u6599\u2014\u2014\u4E0D\u662F\u5BC6\u78BC\u932F\u3002\u8A8D\u8B49\u5132\u5B58\u662F\u7A7A\u7684\uFF0C\u8ACB\u91CD\u65B0\u57F7\u884C\u5B89\u88DD\uFF0F\u66F4\u65B0\u4EE5\u91CD\u65B0\u5EFA\u7ACB\u7BA1\u7406\u54E1\u5E33\u865F\u3002",
            code: "auth_store_empty",
            auth_store: authStoreStatus(c.env)
          },
          503
        );
      }
      await recordLoginFail(c.env, email);
      return c.json({ error: "email \u6216\u5BC6\u78BC\u932F\u8AA4" }, 401);
    }
    if ((rec.values.status ?? "") !== "active") {
      return c.json({ error: "\u5E33\u865F\u5DF2\u505C\u7528" }, 403);
    }
    if (!ok) {
      await recordLoginFail(c.env, email);
      return c.json({ error: "email \u6216\u5BC6\u78BC\u932F\u8AA4" }, 401);
    }
    if (!isAuthStoreId(recordId)) await promoteLegacyUser(c.env, rec);
    await clearLoginFail(c.env, email);
    const token = randomHex2(32);
    await c.env.SESSIONS_KV.put(`${SESSION_PREFIX2}${token}`, JSON.stringify({ record_id: recordId }), {
      expirationTtl: sessionTtl(c.env)
    });
    return c.json({
      success: true,
      session_token: token,
      display_name: rec.values.display_name ?? "",
      role: rec.values.role ?? "user",
      libraries: parseLibraries(rec.values.libraries)
      // 絕不回租戶字串（design §3.3：portal_user 拿到租戶字串就能繞過庫 filter 直打 /kbdb/*）
    });
  })
);
portalRouter.post("/portal/logout", async (c) => {
  const token = bearerToken(c);
  if (token) await c.env.SESSIONS_KV.delete(`${SESSION_PREFIX2}${token}`);
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
portalRouter.post(
  "/portal/me/password",
  (c) => run(c, async () => {
    const auth = await requirePortalUser(c);
    if (!auth.ok) return auth.res;
    const body = await c.req.json().catch(() => null);
    const current = String(body?.current ?? "");
    const next = String(body?.new ?? "");
    if (!current || !next) return c.json({ error: "current \u8207 new \u5FC5\u586B" }, 400);
    if (next.length < 8) return c.json({ error: "\u65B0\u5BC6\u78BC\u81F3\u5C11 8 \u78BC" }, 400);
    const ok = await verifyPassword(current, auth.user.values.password_hash ?? "");
    if (!ok) return c.json({ error: "\u820A\u5BC6\u78BC\u4E0D\u6B63\u78BA" }, 401);
    const newHash = await hashPassword2(next);
    await patchRecordValues(c.env, auth.user.recordId, {
      password_hash: newHash,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    });
    return c.json({ success: true });
  })
);
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
    });
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
    await patchRecordValues(c.env, recordId, {
      password_hash: await hashPassword2(password),
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    });
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
    await patchRecordValues(c.env, recordId, {
      password_hash: await hashPassword2(password),
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    });
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
    graph_source: (v.graph_source ?? "") === "true"
  };
}
portalRouter.post(
  "/portal/daemon/extract",
  (c) => run(c, async () => {
    const apiKey = (c.req.header("X-Arcrun-API-Key") ?? "").trim();
    if (!apiKey) return c.json({ error: "\u7F3A\u5C11 X-Arcrun-API-Key header" }, 401);
    const body = await c.req.json().catch(() => null);
    const pageName = String(body?.page_name ?? "").trim();
    const srcText = String(body?.text ?? "");
    if (!pageName || !srcText.trim()) return c.json({ error: "page_name \u8207 text \u5FC5\u586B" }, 400);
    if (!c.env.AI) {
      return c.json({ error: "\u9019\u500B\u90E8\u7F72\u6C92\u6709\u7D81\u5B9A Workers AI\uFF08wrangler.toml \u9700\u6709 [ai] binding\uFF09\uFF0C\u8ACB\u66F4\u65B0\u77E5\u8B58\u5EAB\u7248\u672C" }, 501);
    }
    const REL = ">".repeat(2);
    const prompt = `\u628A\u4EE5\u4E0B\u539F\u7A3F\u91CD\u5BEB\u6210\u5B9A\u7A3F\u77E5\u8B58\u5361\uFF08\u6B63\u9AD4\u4E2D\u6587\uFF09\u3002\u76F4\u63A5\u8F38\u51FA\u5361\u7247\u672C\u8EAB\uFF1A\u7B2C\u4E00\u884C\u5FC5\u9808\u662F\u300C# ${pageName}\u300D\uFF0C\u4E0D\u8981\u4EFB\u4F55\u524D\u8A00\u3001\u601D\u8003\u904E\u7A0B\u3001\u82F1\u6587\u8349\u7A3F\u6216\u8AAA\u660E\u3002\u683C\u5F0F\uFF1A
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
      const out = await c.env.AI.run("@cf/meta/llama-4-scout-17b-16e-instruct", {
        messages: [{ role: "user", content: prompt }],
        max_tokens: 2048,
        temperature: 0.2
      });
      const card = String(out?.response ?? "").trim();
      if (!card) return c.json({ error: "Workers AI \u6C92\u6709\u56DE\u50B3\u5167\u5BB9" }, 502);
      const marker = `# ${pageName}`;
      const idx = card.lastIndexOf(marker);
      return c.json({ success: true, card: (idx >= 0 ? card.slice(idx) : card).trim() + "\n" });
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
      const res = await kbdbFetch(c.env, "/records", {
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
    const tenant2 = portalTenant(c.env);
    const daemonCfg = {
      cypher_url: new URL(c.req.url).origin,
      namespace: tenant2,
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
    const tenant2 = portalTenant(c.env);
    const kvKey2 = `${tenant2}:wf:rag_chat`;
    const raw2 = await c.env.WEBHOOKS.get(kvKey2, "text");
    if (!raw2) return c.json({ error: "\u9019\u500B\u5BE6\u4F8B\u6C92\u6709\u5B89\u88DD AI \u554F\u7B54\u5DE5\u4F5C\u6D41" }, 404);
    let record;
    try {
      record = JSON.parse(raw2);
    } catch {
      return c.json({ error: "AI \u554F\u7B54\u5DE5\u4F5C\u6D41\u8A18\u9304\u640D\u58DE\uFF0C\u8ACB\u91CD\u65B0\u5B89\u88DD" }, 500);
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
    if (replaced === 0) return c.json({ error: "\u5DE5\u4F5C\u6D41\u88E1\u627E\u4E0D\u5230\u91D1\u9470\u6B04\u4F4D\uFF0C\u8ACB\u91CD\u65B0\u5B89\u88DD\u5F8C\u518D\u8A66" }, 500);
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
    try {
      const tenant2 = portalTenant(c.env);
      const ownerParam = `owner_id=${encodeURIComponent(tenant2)}`;
      const [autoRes, cardRes, tripletRes] = await Promise.all([
        kbdbFetch(c.env, `/entries/libraries?${ownerParam}`).catch(() => null),
        kbdbFetch(c.env, `/entries/library-stats?${ownerParam}`).catch(() => null),
        kbdbFetch(c.env, `/records/triplet-stats?${ownerParam}`).catch(() => null)
      ]);
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
      if (autoRes?.ok) {
        const body = await autoRes.json();
        for (const name of body.libraries ?? []) {
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
      const res = await kbdbFetch(c.env, "/records", {
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
portalRouter.get(
  "/portal/admin/ai",
  (c) => run(c, async () => {
    const auth = await requirePortalAdmin(c);
    if (!auth.ok) return auth.res;
    const tenantSlug = portalTenant(c.env);
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
    const ownerId = portalTenant(c.env);
    const res = await kbdbFetch(c.env, `/execution-log/retention?owner_id=${encodeURIComponent(ownerId)}`);
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
    const ownerId = portalTenant(c.env);
    const res = await kbdbFetch(c.env, "/execution-log/retention", {
      method: "PUT",
      body: JSON.stringify({ owner_id: ownerId, retention_days: days === void 0 ? null : days })
    });
    if (!res.ok) throw new KbdbError(`PUT /execution-log/retention \u2192 ${res.status}`);
    const data = await res.json();
    return c.json({ success: true, retention_days: data.retention_days ?? null });
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
    const ownerId = portalTenant(c.env);
    const res = await kbdbFetch(c.env, "/entries/deprecate-by-library", {
      method: "PATCH",
      body: JSON.stringify({ owner_id: ownerId, library: name })
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
    const tenantSlug = portalTenant(c.env);
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
      kbdbFetch(env, `/embed/backfill/status?${new URLSearchParams({ owner_id: tenant2 }).toString()}`),
      kbdbFetch(env, `/embed/selftest?${new URLSearchParams({ owner_id: tenant2 }).toString()}`)
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
  const ownerParam = new URLSearchParams({ owner_id: tenant2 }).toString();
  try {
    const [registeredLibs, autoRes, tripletRes] = await Promise.all([
      listRecordsByTemplate(env, LIBRARY_TEMPLATE).catch(() => []),
      kbdbFetch(env, `/entries/libraries?${ownerParam}`),
      kbdbFetch(env, `/records/triplet-stats?${ownerParam}`)
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
      const probeRes = await kbdbFetch(env, `/entries?${new URLSearchParams({ owner_id: tenant2, limit: "1" }).toString()}`);
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
    const core = await buildDiagnostics(c.env, apiKey);
    return c.json({
      generated_at: (/* @__PURE__ */ new Date()).toISOString(),
      instance_url: new URL(c.req.url).origin,
      bundle_version: c.env.ARCRUN_BUNDLE_VERSION ?? null,
      ...core
    });
  })
);

// ../../matrix/arcrun/cypher-executor/src/routes/init-seed.ts
var initSeedRouter = new Hono2();
initSeedRouter.post("/init/seed", async (c) => {
  const now2 = Date.now();
  let apiOk = 0;
  let apiFail = 0;
  const apiErrors = [];
  for (const seed of API_RECIPE_SEEDS) {
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
        endpoint: seed.endpoint,
        method: (seed.method ?? "POST").toUpperCase(),
        auth_service: seed.auth_service,
        // ③ payload/回應/binding 三層（3.12）：不列進來的欄位會被**靜默吃掉**——
        // 種子帶了 body_template/response_map/auth 卻沒進 KV，症狀是 recipe 存在但跑起來
        // 「像沒設定過」，且哪裡都不會紅（08-02 manifest.daemon 欄被列舉式重建吃掉的同型）。
        body_template: seed.body_template,
        response_map: seed.response_map,
        auth: seed.auth,
        binding_name: seed.binding_name,
        created_at: existing?.created_at ?? now2,
        updated_at: now2
      };
      await installRecipeRecord(c.env.RECIPES, recipe);
      apiOk++;
    } catch (e) {
      apiFail++;
      apiErrors.push(`${seed.canonical_id}: ${e instanceof Error ? e.message : String(e)}`);
    }
  }
  let authOk = 0;
  let authFail = 0;
  const authErrors = [];
  for (const seed of AUTH_RECIPE_SEEDS) {
    try {
      const service = seed.service.trim().toLowerCase();
      const existing = await c.env.RECIPES.get(`auth_recipe:${service}`, "json");
      const recipe = {
        ...seed,
        service,
        created_at: existing?.created_at ?? now2,
        updated_at: now2
      };
      await c.env.RECIPES.put(`auth_recipe:${service}`, JSON.stringify(recipe));
      authOk++;
    } catch (e) {
      authFail++;
      authErrors.push(`${seed.service}: ${e instanceof Error ? e.message : String(e)}`);
    }
  }
  const portalTemplates = await ensurePortalTemplates(c.env);
  const allOk = apiFail === 0 && authFail === 0 && portalTemplates.errors.length === 0;
  return c.json(
    {
      success: allOk,
      api_recipes: { seeded: apiOk, failed: apiFail, errors: apiErrors },
      auth_recipes: { seeded: authOk, failed: authFail, errors: authErrors },
      portal_templates: portalTemplates,
      message: allOk ? `seed \u5B8C\u6210\uFF1A${apiOk} \u500B API recipe + ${authOk} \u500B auth recipe + portal templates\uFF08\u65B0\u5EFA ${portalTemplates.created.length}\uFF0F\u5DF2\u5B58\u5728 ${portalTemplates.existing.length}\uFF09` : `seed \u90E8\u5206\u5931\u6557\uFF08\u8AA0\u5BE6\u56DE\u5831\uFF0C\u672A\u5047\u7DA0\uFF09\uFF1AAPI ${apiOk}\u2713/${apiFail}\u2717\uFF0Cauth ${authOk}\u2713/${authFail}\u2717\uFF0Cportal templates \u932F\u8AA4 ${portalTemplates.errors.length}`
    },
    allOk ? 200 : 207
  );
});

// ../../matrix/arcrun/cypher-executor/src/index.ts
init_kbdb_proxy();

// ../../matrix/arcrun/cypher-executor/src/routes/console-dashboard.ts
init_dist();
init_kbdb_proxy();

// ../../matrix/arcrun/cypher-executor/src/lib/taipei-time.ts
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

// ../../matrix/arcrun/cypher-executor/src/lib/console-dashboard-model.ts
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

// ../../matrix/arcrun/cypher-executor/src/lib/console-triage-model.ts
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
function applyTriageCheck(content, action, nowIso) {
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
  return JSON.stringify({ ...obj, status: "done", checked_via: "console", checked_at: nowIso });
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

// ../../matrix/arcrun/cypher-executor/src/routes/console-dashboard.ts
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
  const repo = env.GITEA_SPRINT_REPO ?? "Leo/InkStoneCo";
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
  const repo = env.GITEA_SPRINT_REPO ?? "Leo/InkStoneCo";
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
  const tenant2 = c.env.CONSOLE_TENANT || "leo";
  const now2 = Date.now();
  const { base: kbdbUrl, headers: kbdbHeaders } = kbdbBase(c.env);
  const graphUrl = graphBase(c.env);
  const [
    beatEntries,
    taskEntries,
    waitEntries,
    inboxEntries,
    giteaSprint,
    kbdbHealth,
    embedStatus,
    graphStats,
    entriesTotal,
    wikiCardTotal,
    workflowTotal
  ] = await Promise.all([
    fetchEntries(c.env, tenant2, "dash_beat", 100),
    fetchEntries(c.env, tenant2, "dash_task", 200),
    fetchEntries(c.env, tenant2, "dash_wait", 100),
    fetchEntries(c.env, tenant2, "inbox", 200),
    cachedGiteaSprint(c.env, now2, (p) => c.executionCtx.waitUntil(p)),
    fetchJson(`${kbdbUrl}/health`, kbdbHeaders),
    fetchJson(`${kbdbUrl}/embed/backfill/status`, kbdbHeaders),
    fetchJson(`${graphUrl}/triplets/stats`),
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
      graph: graphStats ? { ok: true, triplets: graphStats.total ?? null } : { ok: false, triplets: null },
      workflow_total: workflowTotal
    },
    kb: {
      entries_total: entriesTotal,
      wiki_card_total: wikiCardTotal,
      triplets_total: graphStats?.total ?? null
    },
    generated_at: new Date(now2).toISOString()
  });
});
consoleDashboardRouter.get("/console/kb-scale-data", async (c) => {
  const tenant2 = c.env.CONSOLE_TENANT || "leo";
  const { base, headers } = kbdbBase(c.env);
  const graphUrl = graphBase(c.env);
  const now2 = Date.now();
  const [wikiCards, graphStats, embedStatus] = await Promise.all([
    // limit=1 順手拿最新一筆 created_at（list 為 created_at DESC）＝「最近寫入時間」
    fetchJson(
      `${base}/entries?${new URLSearchParams({ owner_id: tenant2, entry_type: "wiki_card", limit: "1" }).toString()}`,
      headers
    ),
    fetchJson(`${graphUrl}/triplets/stats`),
    fetchJson(`${base}/embed/backfill/status`, headers)
  ]);
  const latestMs = parseCreatedAtMs(wikiCards?.entries?.[0]?.created_at ?? null);
  return c.json({
    wiki_card_total: typeof wikiCards?.total === "number" ? wikiCards.total : null,
    wiki_card_latest_ago_minutes: latestMs === null ? -1 : agoMinutes(now2, latestMs),
    triplets_total: typeof graphStats?.total === "number" ? graphStats.total : null,
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
  const tenant2 = c.env.CONSOLE_TENANT || "leo";
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
  const tenant2 = c.env.CONSOLE_TENANT || "leo";
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

// ../../matrix/arcrun/cypher-executor/src/routes/portal-data.ts
init_dist();
init_kbdb_proxy();
init_webhook_handlers();
var portalDataRouter = new Hono2();
async function getTenantWorkflowGraph(env, name) {
  const raw2 = await env.WEBHOOKS.get(`${portalTenant(env)}:wf:${name}`, "text");
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
function mapGraphWorkflowOutput(data) {
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
    const existing = seen.get(page);
    if (existing) {
      existing.count += 1;
    } else {
      seen.set(page, { item, count: 1 });
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
async function fuzzyFindNode(env, tenant2, searchTerm) {
  try {
    const res = await kbdbFetch(env, `/records/by-template/triplet?owner_id=${encodeURIComponent(tenant2)}`);
    if (!res.ok) return null;
    const body = await res.json().catch(() => null);
    if (!body || !Array.isArray(body.records)) return null;
    const nodeNames = /* @__PURE__ */ new Set();
    for (const r of body.records) {
      const v = r?.values;
      if (!v || typeof v !== "object") continue;
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
    const params = new URLSearchParams({ q, owner_id: portalTenant(c.env) });
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
    const res = await kbdbFetch(c.env, `/entries/search?${params.toString()}`);
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
  "/portal/data/entries/:id",
  (c) => run(c, async () => {
    const auth = await requirePortalUser(c);
    if (!auth.ok) return auth.res;
    const libraries = parseLibraries(auth.user.values.libraries);
    if (libraries.length === 0) return notFound(c);
    const res = await kbdbFetch(c.env, `/entries/${encodeURIComponent(c.req.param("id"))}`);
    if (res.status === 404) return notFound(c);
    if (!res.ok) return c.json({ error: `KBDB \u56DE\u932F\uFF08HTTP ${res.status}\uFF09` }, 502);
    const body = await res.json();
    const entry = body.entry;
    if (!entry) return notFound(c);
    if ((entry.owner_id ?? "") !== portalTenant(c.env)) return notFound(c);
    if (!canReadLibrary(libraries, entryLibrary(entry))) return notFound(c);
    return c.json({ success: true, entry });
  })
);
portalDataRouter.get(
  "/portal/data/graph/neighbors/:name",
  (c) => run(c, async () => {
    const auth = await requirePortalUser(c);
    if (!auth.ok) return auth.res;
    const libraries = parseLibraries(auth.user.values.libraries);
    if (!await hasGraphAccess(c.env, libraries)) {
      return c.json({ error: "\u7121\u77E5\u8B58\u5716\u8B5C\u6AA2\u8996\u6B0A\u9650" }, 403);
    }
    const nodeName = normalizeCjkQuery(c.req.param("name"));
    const tenant2 = portalTenant(c.env);
    const wfGraph = await getTenantWorkflowGraph(c.env, "graph_neighbors");
    if (wfGraph) {
      const depthRaw = c.req.query("depth") ?? "";
      const depth = /^\d{1,2}$/.test(depthRaw) ? Number(depthRaw) : 2;
      const result = await executeWebhookGraph(
        c.env,
        wfGraph,
        // t116: 補傳 kbdb_base；t128: 補傳 template（workflow fetch_triplets.url 用 {{input.template}}）
        { node: nodeName, depth, namespace: tenant2, owner: tenant2, kbdb_base: c.env.KBDB_BASE_URL ?? "", template: "triplet" },
        "graph_neighbors",
        tenant2,
        c.executionCtx
      );
      if (!result.success) {
        return c.json({ error: `graph_neighbors workflow \u57F7\u884C\u5931\u6557\uFF1A${result.error ?? "\u672A\u77E5\u932F\u8AA4"}` }, 502);
      }
      return c.json(mapGraphWorkflowOutput(result.data));
    }
    const base = graphBase(c.env);
    const headers = {};
    if (c.env.KBDB_INTERNAL_TOKEN) headers["Authorization"] = `Bearer ${c.env.KBDB_INTERNAL_TOKEN}`;
    try {
      const res = await fetch(`${base}/graph/neighbors/${encodeURIComponent(nodeName)}`, { headers });
      if (!res.ok) {
        return new Response(res.body, { status: res.status, headers: { "Content-Type": "application/json" } });
      }
      const resText = await res.text().catch(() => "");
      let data = null;
      try {
        data = JSON.parse(resText);
      } catch {
      }
      if (data && Array.isArray(data.neighbors) && data.neighbors.length === 0 && Array.isArray(data.edges) && data.edges.length === 0) {
        const fallbackName = await fuzzyFindNode(c.env, tenant2, nodeName);
        if (fallbackName && fallbackName !== nodeName) {
          const res2 = await fetch(`${base}/graph/neighbors/${encodeURIComponent(fallbackName)}`, { headers });
          return new Response(res2.body, { status: res2.status, headers: { "Content-Type": "application/json" } });
        }
      }
      return new Response(resText, { status: res.status, headers: { "Content-Type": "application/json" } });
    } catch (e) {
      return c.json({ error: `kbdb-graph-plugin \u4E0D\u53EF\u9054\uFF1A${e instanceof Error ? e.message : String(e)}` }, 502);
    }
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
    const tenant2 = portalTenant(c.env);
    const res = await kbdbFetch(c.env, `/records/by-template/triplet?owner_id=${encodeURIComponent(tenant2)}`);
    if (!res.ok) {
      return new Response(res.body, { status: res.status, headers: { "Content-Type": "application/json" } });
    }
    const body = await res.json().catch(() => null);
    const records = body && Array.isArray(body.records) ? body.records : [];
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
    return c.json({ nodes, edges, node_count: nodes.length, edge_count: edges.length, truncated });
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
      portalTenant(c.env),
      c.executionCtx
    );
    if (!result.success) {
      return c.json({ error: `rag_chat workflow \u57F7\u884C\u5931\u6557\uFF1A${result.error ?? "\u672A\u77E5\u932F\u8AA4"}` }, 502);
    }
    const inner = unwrapWorkflowData(result.data, "answer");
    const rawSources = Array.isArray(inner.sources) ? inner.sources : [];
    return c.json({
      answer: typeof inner.answer === "string" ? inner.answer : "",
      sources: dedupeSourcesByPage(rawSources),
      graph_facts: inner.graph_facts ?? null
    });
  })
);
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
    const tenant2 = portalTenant(c.env);
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
        const execRes = await kbdbFetch(
          c.env,
          `/execution-log/latest?${new URLSearchParams({ workflow_id: name, owner_id: tenant2 }).toString()}`
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
  "/portal/data/diagnostics",
  (c) => run(c, async () => {
    const auth = await requirePortalUser(c);
    if (!auth.ok) return auth.res;
    const tenant2 = portalTenant(c.env);
    const core = await buildDiagnostics(c.env, tenant2);
    return c.json({
      generated_at: (/* @__PURE__ */ new Date()).toISOString(),
      instance_url: new URL(c.req.url).origin,
      bundle_version: c.env.ARCRUN_BUNDLE_VERSION ?? null,
      ...core
    });
  })
);

// ../../matrix/arcrun/cypher-executor/src/index.ts
var app = new Hono2();
var STATIC_ORIGINS = ["https://arcrun.dev", "https://www.arcrun.dev"];
app.use("*", cors({
  origin: (origin, c) => {
    if (!origin) return origin;
    let extra = [];
    try {
      extra = String(c.env.UI_ORIGINS || "").split(",").map((s) => s.trim()).filter(Boolean);
    } catch {
    }
    const sub = String(c.env.WORKER_SUBDOMAIN || "").trim();
    const sibling = sub ? [`https://arcrun-rag-ui.${sub}.workers.dev`] : [];
    return [...STATIC_ORIGINS, ...sibling, ...extra].includes(origin) ? origin : null;
  },
  allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization", "X-Arcrun-API-Key"],
  credentials: true
}));
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
var index_default = {
  fetch: app.fetch,
  scheduled: handleScheduled
};
export {
  index_default as default
};
