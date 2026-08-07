// ../../matrix/arcrun/kbdb/node_modules/.pnpm/hono@4.12.23/node_modules/hono/dist/compose.js
var compose = (middleware, onError, onNotFound) => {
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

// ../../matrix/arcrun/kbdb/node_modules/.pnpm/hono@4.12.23/node_modules/hono/dist/request/constants.js
var GET_MATCH_RESULT = /* @__PURE__ */ Symbol();

// ../../matrix/arcrun/kbdb/node_modules/.pnpm/hono@4.12.23/node_modules/hono/dist/utils/body.js
var parseBody = async (request, options = /* @__PURE__ */ Object.create(null)) => {
  const { all = false, dot = false } = options;
  const headers = request instanceof HonoRequest ? request.raw.headers : request.headers;
  const contentType = headers.get("Content-Type");
  if (contentType?.startsWith("multipart/form-data") || contentType?.startsWith("application/x-www-form-urlencoded")) {
    return parseFormData(request, { all, dot });
  }
  return {};
};
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
var handleParsingAllValues = (form, key, value) => {
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
var handleParsingNestedValues = (form, key, value) => {
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

// ../../matrix/arcrun/kbdb/node_modules/.pnpm/hono@4.12.23/node_modules/hono/dist/utils/url.js
var splitPath = (path) => {
  const paths = path.split("/");
  if (paths[0] === "") {
    paths.shift();
  }
  return paths;
};
var splitRoutingPath = (routePath) => {
  const { groups, path } = extractGroupsFromPath(routePath);
  const paths = splitPath(path);
  return replaceGroupMarks(paths, groups);
};
var extractGroupsFromPath = (path) => {
  const groups = [];
  path = path.replace(/\{[^}]+\}/g, (match2, index) => {
    const mark = `@${index}`;
    groups.push([mark, match2]);
    return mark;
  });
  return { groups, path };
};
var replaceGroupMarks = (paths, groups) => {
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
var patternCache = {};
var getPattern = (label, next) => {
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
var tryDecode = (str, decoder) => {
  try {
    return decoder(str);
  } catch {
    return str.replace(/(?:%[0-9A-Fa-f]{2})+/g, (match2) => {
      try {
        return decoder(match2);
      } catch {
        return match2;
      }
    });
  }
};
var tryDecodeURI = (str) => tryDecode(str, decodeURI);
var getPath = (request) => {
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
var getPathNoStrict = (request) => {
  const result = getPath(request);
  return result.length > 1 && result.at(-1) === "/" ? result.slice(0, -1) : result;
};
var mergePath = (base, sub, ...rest) => {
  if (rest.length) {
    sub = mergePath(sub, ...rest);
  }
  return `${base?.[0] === "/" ? "" : "/"}${base}${sub === "/" ? "" : `${base?.at(-1) === "/" ? "" : "/"}${sub?.[0] === "/" ? sub.slice(1) : sub}`}`;
};
var checkOptionalParameter = (path) => {
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
var _decodeURI = (value) => {
  if (!/[%+]/.test(value)) {
    return value;
  }
  if (value.indexOf("+") !== -1) {
    value = value.replace(/\+/g, " ");
  }
  return value.indexOf("%") !== -1 ? tryDecode(value, decodeURIComponent_) : value;
};
var _getQueryParam = (url, key, multiple) => {
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
var getQueryParam = _getQueryParam;
var getQueryParams = (url, key) => {
  return _getQueryParam(url, key, true);
};
var decodeURIComponent_ = decodeURIComponent;

// ../../matrix/arcrun/kbdb/node_modules/.pnpm/hono@4.12.23/node_modules/hono/dist/request.js
var tryDecodeURIComponent = (str) => tryDecode(str, decodeURIComponent_);
var HonoRequest = class {
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
   * `.bytes()` parses the request body as a `Uint8Array`.
   *
   * @see {@link https://hono.dev/docs/api/request#bytes}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.bytes()
   * })
   * ```
   */
  bytes() {
    return this.#cachedBody("arrayBuffer").then((buffer) => new Uint8Array(buffer));
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

// ../../matrix/arcrun/kbdb/node_modules/.pnpm/hono@4.12.23/node_modules/hono/dist/utils/html.js
var HtmlEscapedCallbackPhase = {
  Stringify: 1,
  BeforeStream: 2,
  Stream: 3
};
var raw = (value, callbacks) => {
  const escapedString = new String(value);
  escapedString.isEscaped = true;
  escapedString.callbacks = callbacks;
  return escapedString;
};
var resolveCallback = async (str, phase, preserveCallbacks, context, buffer) => {
  if (typeof str === "object" && !(str instanceof String)) {
    if (!(str instanceof Promise)) {
      str = str.toString();
    }
    if (str instanceof Promise) {
      str = await str;
    }
  }
  const callbacks = str.callbacks;
  if (!callbacks?.length) {
    return Promise.resolve(str);
  }
  if (buffer) {
    buffer[0] += str;
  } else {
    buffer = [str];
  }
  const resStr = Promise.all(callbacks.map((c) => c({ phase, buffer, context }))).then(
    (res) => Promise.all(
      res.filter(Boolean).map((str2) => resolveCallback(str2, phase, false, context, buffer))
    ).then(() => buffer[0])
  );
  if (preserveCallbacks) {
    return raw(await resStr, callbacks);
  } else {
    return resStr;
  }
};

// ../../matrix/arcrun/kbdb/node_modules/.pnpm/hono@4.12.23/node_modules/hono/dist/context.js
var TEXT_PLAIN = "text/plain; charset=UTF-8";
var setDefaultContentType = (contentType, headers) => {
  return {
    "Content-Type": contentType,
    ...headers
  };
};
var createResponseInstance = (body, init) => new Response(body, init);
var Context = class {
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

// ../../matrix/arcrun/kbdb/node_modules/.pnpm/hono@4.12.23/node_modules/hono/dist/router.js
var METHOD_NAME_ALL = "ALL";
var METHOD_NAME_ALL_LOWERCASE = "all";
var METHODS = ["get", "post", "put", "delete", "options", "patch"];
var MESSAGE_MATCHER_IS_ALREADY_BUILT = "Can not add a route since the matcher is already built.";
var UnsupportedPathError = class extends Error {
};

// ../../matrix/arcrun/kbdb/node_modules/.pnpm/hono@4.12.23/node_modules/hono/dist/utils/constants.js
var COMPOSED_HANDLER = "__COMPOSED_HANDLER";

// ../../matrix/arcrun/kbdb/node_modules/.pnpm/hono@4.12.23/node_modules/hono/dist/hono-base.js
var notFoundHandler = (c) => {
  return c.text("404 Not Found", 404);
};
var errorHandler = (err, c) => {
  if ("getResponse" in err) {
    const res = err.getResponse();
    return c.newResponse(res.body, res);
  }
  console.error(err);
  return c.text("Internal Server Error", 500);
};
var Hono = class _Hono {
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
      subApp.#addRoute(r.method, r.path, handler, r.basePath);
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
        url.pathname = this.getPath(request).slice(pathPrefixLength) || "/";
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
  #addRoute(method, path, handler, baseRoutePath) {
    method = method.toUpperCase();
    path = mergePath(this._basePath, path);
    const r = {
      basePath: baseRoutePath !== void 0 ? mergePath(this._basePath, baseRoutePath) : this._basePath,
      path,
      method,
      handler
    };
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

// ../../matrix/arcrun/kbdb/node_modules/.pnpm/hono@4.12.23/node_modules/hono/dist/router/reg-exp-router/matcher.js
var emptyParam = [];
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

// ../../matrix/arcrun/kbdb/node_modules/.pnpm/hono@4.12.23/node_modules/hono/dist/router/reg-exp-router/node.js
var LABEL_REG_EXP_STR = "[^/]+";
var ONLY_WILDCARD_REG_EXP_STR = ".*";
var TAIL_WILDCARD_REG_EXP_STR = "(?:|/.*)";
var PATH_ERROR = /* @__PURE__ */ Symbol();
var regExpMetaChars = new Set(".\\+*[^]$()");
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
var Node = class _Node {
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

// ../../matrix/arcrun/kbdb/node_modules/.pnpm/hono@4.12.23/node_modules/hono/dist/router/reg-exp-router/trie.js
var Trie = class {
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

// ../../matrix/arcrun/kbdb/node_modules/.pnpm/hono@4.12.23/node_modules/hono/dist/router/reg-exp-router/router.js
var nullMatcher = [/^$/, [], /* @__PURE__ */ Object.create(null)];
var wildcardRegExpCache = /* @__PURE__ */ Object.create(null);
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
var RegExpRouter = class {
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

// ../../matrix/arcrun/kbdb/node_modules/.pnpm/hono@4.12.23/node_modules/hono/dist/router/smart-router/router.js
var SmartRouter = class {
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

// ../../matrix/arcrun/kbdb/node_modules/.pnpm/hono@4.12.23/node_modules/hono/dist/router/trie-router/node.js
var emptyParams = /* @__PURE__ */ Object.create(null);
var hasChildren = (children) => {
  for (const _ in children) {
    return true;
  }
  return false;
};
var Node2 = class _Node2 {
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

// ../../matrix/arcrun/kbdb/node_modules/.pnpm/hono@4.12.23/node_modules/hono/dist/router/trie-router/router.js
var TrieRouter = class {
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

// ../../matrix/arcrun/kbdb/node_modules/.pnpm/hono@4.12.23/node_modules/hono/dist/hono.js
var Hono2 = class extends Hono {
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

// ../../matrix/arcrun/kbdb/src/actions/entry-crud.ts
function uid(prefix) {
  return `${prefix}_${crypto.randomUUID()}`;
}
async function createEntry(db, input) {
  const id = input.id ?? uid("e");
  await db.prepare(
    `INSERT INTO entries (id, content, entry_type, owner_id, parent_id, page_name, refs_json, tags_json, task_status, confidence, metadata_json)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    id,
    input.content ?? null,
    input.entry_type,
    input.owner_id ?? null,
    input.parent_id ?? null,
    input.page_name ?? null,
    input.refs_json ?? "[]",
    input.tags_json ?? "[]",
    input.task_status ?? null,
    input.confidence ?? null,
    input.metadata_json ?? null
  ).run();
  const row = await getEntry(db, id);
  if (!row) throw new Error("createEntry: insert succeeded but row not found");
  return row;
}
async function getEntry(db, id) {
  const row = await db.prepare("SELECT * FROM entries WHERE id = ?").bind(id).first();
  return row ?? null;
}
async function listEntries(db, f = {}) {
  const conds = [];
  const params = [];
  if (f.entry_type) {
    conds.push("entry_type = ?");
    params.push(f.entry_type);
  }
  if (f.owner_id) {
    conds.push("owner_id = ?");
    params.push(f.owner_id);
  }
  if (f.parent_id) {
    conds.push("parent_id = ?");
    params.push(f.parent_id);
  }
  if (f.page_name) {
    conds.push("page_name = ?");
    params.push(f.page_name);
  }
  if (f.source) {
    conds.push("json_extract(metadata_json, '$.source') = ?");
    params.push(f.source);
  }
  if (f.library && f.library.length > 0) {
    conds.push(libraryPredicate(f.library));
    params.push(...f.library);
  }
  if (f.q) {
    const m = buildContentLike(f.q);
    conds.push(...m.conds);
    params.push(...m.params);
  }
  const where = conds.length ? `WHERE ${conds.join(" AND ")}` : "";
  const limit = Math.min(f.limit ?? 100, 1e3);
  const offset = f.offset ?? 0;
  const [rowsRes, countRow] = await Promise.all([
    db.prepare(`SELECT * FROM entries ${where} ORDER BY created_at DESC, rowid DESC LIMIT ? OFFSET ?`).bind(...params, limit, offset).all(),
    db.prepare(`SELECT COUNT(*) as total FROM entries ${where}`).bind(...params).first()
  ]);
  return { entries: rowsRes.results ?? [], total: countRow?.total ?? 0 };
}
async function updateEntry(db, id, patch) {
  const cols = [];
  const params = [];
  const map = patch;
  for (const k of ["content", "parent_id", "page_name", "refs_json", "tags_json", "task_status", "confidence", "metadata_json"]) {
    if (k in map && map[k] !== void 0) {
      cols.push(`${k} = ?`);
      params.push(map[k]);
    }
  }
  if (cols.length === 0) return getEntry(db, id);
  cols.push("updated_at = unixepoch()");
  await db.prepare(`UPDATE entries SET ${cols.join(", ")} WHERE id = ?`).bind(...params, id).run();
  return getEntry(db, id);
}
async function deleteEntry(db, id) {
  await db.prepare("DELETE FROM entries WHERE id = ?").bind(id).run();
}
async function embeddedIdsByLibrary(db, ownerId, library) {
  const rows = await db.prepare(
    `SELECT id FROM entries
        WHERE owner_id = ?
          AND COALESCE(NULLIF(json_extract(metadata_json, '$.library'), ''), 'general') = ?
          AND is_embedded = 1`
  ).bind(ownerId, library).all();
  return (rows.results ?? []).map((r) => r.id);
}
async function markUnembedded(db, ids) {
  if (ids.length === 0) return;
  const holes = ids.map(() => "?").join(",");
  await db.prepare(`UPDATE entries SET is_embedded = 0 WHERE id IN (${holes})`).bind(...ids).run();
}
async function deprecateEntriesByLibrary(db, ownerId, library) {
  const result = await db.prepare(
    `UPDATE entries
         SET metadata_json = json_set(COALESCE(metadata_json, '{}'), '$.status', 'deprecated'),
             updated_at = unixepoch()
       WHERE owner_id = ?
         AND COALESCE(json_extract(metadata_json, '$.library'), 'general') = ?
         AND (json_extract(metadata_json, '$.status') IS NULL
              OR json_extract(metadata_json, '$.status') != 'deprecated')`
  ).bind(ownerId, library).run();
  return result.meta?.changes ?? 0;
}
var MAX_LIKE_Q_BYTES = 48;
var MAX_LIKE_TERMS = 6;
var utf8Len = (s) => new TextEncoder().encode(s).length;
function chunkByBytes(s, maxBytes) {
  const out = [];
  let cur = "";
  for (const ch of s) {
    if (utf8Len(cur + ch) > maxBytes) {
      if (cur) out.push(cur);
      cur = ch;
    } else {
      cur += ch;
    }
  }
  if (cur) out.push(cur);
  return out;
}
function buildContentLike(q) {
  if (utf8Len(q) <= MAX_LIKE_Q_BYTES) {
    return { conds: ["content LIKE ?"], params: [`%${q}%`], split: false };
  }
  const terms = [];
  for (const word of q.split(/\s+/).filter(Boolean)) {
    for (const piece of chunkByBytes(word, MAX_LIKE_Q_BYTES)) {
      terms.push(piece);
      if (terms.length >= MAX_LIKE_TERMS) break;
    }
    if (terms.length >= MAX_LIKE_TERMS) break;
  }
  if (terms.length === 0) terms.push(chunkByBytes(q, MAX_LIKE_Q_BYTES)[0] ?? "");
  return {
    conds: terms.map(() => "content LIKE ?"),
    params: terms.map((t) => `%${t}%`),
    split: true
  };
}
function libraryPredicate(libraries) {
  const placeholders = libraries.map(() => "?").join(",");
  return `COALESCE(json_extract(metadata_json, '$.library'), 'general') IN (${placeholders})`;
}
var NOT_DEPRECATED_PREDICATE = "(json_extract(metadata_json, '$.status') IS NULL OR json_extract(metadata_json, '$.status') != 'deprecated')";
function isDeprecatedEntry(entry) {
  if (!entry.metadata_json) return false;
  try {
    const meta = JSON.parse(entry.metadata_json);
    return !!meta && meta.status === "deprecated";
  } catch {
    return false;
  }
}
async function searchEntries(db, q, owner_id, entry_type, limit = 50, library, source, includeDeprecated = false) {
  const m = buildContentLike(q);
  const conds = [...m.conds];
  const params = [...m.params];
  if (owner_id) {
    conds.push("owner_id = ?");
    params.push(owner_id);
  }
  if (entry_type) {
    conds.push("entry_type = ?");
    params.push(entry_type);
  }
  if (source) {
    conds.push("json_extract(metadata_json, '$.source') = ?");
    params.push(source);
  }
  if (library && library.length > 0) {
    conds.push(libraryPredicate(library));
    params.push(...library);
  }
  if (!includeDeprecated) {
    conds.push(NOT_DEPRECATED_PREDICATE);
  }
  const res = await db.prepare(`SELECT * FROM entries WHERE ${conds.join(" AND ")} ORDER BY updated_at DESC LIMIT ?`).bind(...params, Math.min(limit, 200)).all();
  return res.results ?? [];
}

// ../../matrix/arcrun/kbdb/src/embed.ts
var DEFAULT_EMBED_MODEL = "@cf/baai/bge-m3";
var MIN_SCORE_ABS_FLOOR = 0.45;
var MIN_SCORE_TOP_RATIO = 0.8;
function relativeMinScore(topScore) {
  return Math.max(MIN_SCORE_ABS_FLOOR, topScore * MIN_SCORE_TOP_RATIO);
}
function embedModel(env) {
  const m = (env.EMBED_MODEL ?? "").trim();
  return m || DEFAULT_EMBED_MODEL;
}
function embedEnabled(env) {
  return !!(env.VECTORIZE && env.AI);
}
async function embedText(env, text) {
  const t = (text ?? "").trim();
  if (!t || !env.AI) return null;
  const res = await env.AI.run(embedModel(env), { text: [t] });
  return res?.data?.[0] ?? null;
}
async function embedOnWrite(env, entry) {
  if (!embedEnabled(env)) return false;
  if (!isEmbeddable(entry)) return false;
  const vec = await embedText(env, entry.content ?? "");
  if (!vec) return false;
  await env.VECTORIZE.upsert([
    {
      id: entry.id,
      values: vec,
      // metadata 走 indexed 範圍：owner_id（租戶隔離）、entry_type、source（#5.1 過濾與語義共用）、
      // library（portal-auth P1「庫」filter）。library 在寫入端正規化：未標記＝'general'（design §3.2
      // 「未蓋章的舊資料視同 general」——D1 側用查詢端 COALESCE fallback，Vectorize filter 做不了
      // COALESCE，故在 upsert 時蓋 'general'，查詢端單純 $in 即可）。
      metadata: {
        owner_id: entry.owner_id ?? "",
        entry_type: entry.entry_type,
        source: readSource(entry) ?? "",
        library: readLibrary(entry) ?? "general"
      }
    }
  ]);
  await env.DB.prepare("UPDATE entries SET is_embedded = 1 WHERE id = ?").bind(entry.id).run();
  return true;
}
function isEmbeddable(entry) {
  const meta = parseMeta(entry.metadata_json);
  return meta?.embed === true;
}
function readSource(entry) {
  const meta = parseMeta(entry.metadata_json);
  const s = meta?.source;
  return typeof s === "string" ? s : null;
}
function readLibrary(entry) {
  const meta = parseMeta(entry.metadata_json);
  const l = meta?.library;
  return typeof l === "string" && l.trim() !== "" ? l : null;
}
function parseMeta(json) {
  if (!json) return null;
  try {
    const p = JSON.parse(json);
    return p && typeof p === "object" ? p : null;
  } catch {
    return null;
  }
}
var BACKFILL_PREDICATE = "is_embedded = 0 AND content IS NOT NULL AND content <> '' AND json_extract(metadata_json, '$.embed') = 1";
async function backfillEmbeddings(env, opts = {}) {
  if (!embedEnabled(env)) return { enabled: false, processed: 0, skipped: 0, remaining: 0, scanned: 0 };
  const limit = Math.min(Math.max(opts.limit ?? 25, 1), 100);
  const offset = Math.max(opts.offset ?? 0, 0);
  const basePredicate = opts.reindex ? "content IS NOT NULL AND content <> '' AND json_extract(metadata_json, '$.embed') = 1" : BACKFILL_PREDICATE;
  const conds = [basePredicate, "COALESCE(json_extract(metadata_json, '$.status'), '') != 'deprecated'"];
  const params = [];
  if (opts.owner_id) {
    conds.push("owner_id = ?");
    params.push(opts.owner_id);
  }
  if (opts.source) {
    conds.push("json_extract(metadata_json, '$.source') = ?");
    params.push(opts.source);
  }
  const where = conds.join(" AND ");
  const res = await env.DB.prepare(`SELECT * FROM entries WHERE ${where} ORDER BY created_at ASC LIMIT ? OFFSET ?`).bind(...params, limit, offset).all();
  const rows = res.results ?? [];
  const scanned = rows.length;
  let processed = 0;
  const embeddable = rows.filter((e) => (e.content ?? "").trim().length > 0);
  if (embeddable.length > 0 && env.AI && env.VECTORIZE) {
    const texts = embeddable.map((e) => (e.content ?? "").trim());
    const out = await env.AI.run(embedModel(env), { text: texts });
    const data = out?.data ?? [];
    const vectors = embeddable.map((e, i) => ({ e, vec: data[i] })).filter((x) => Array.isArray(x.vec) && x.vec.length > 0).map((x) => ({
      id: x.e.id,
      values: x.vec,
      metadata: {
        owner_id: x.e.owner_id ?? "",
        entry_type: x.e.entry_type,
        source: readSource(x.e) ?? "",
        library: readLibrary(x.e) ?? "general"
        // 同 embedOnWrite：寫入端正規化（P1）
      }
    }));
    if (vectors.length > 0) {
      await env.VECTORIZE.upsert(vectors);
      const ids = vectors.map((v) => v.id);
      const placeholders = ids.map(() => "?").join(",");
      await env.DB.prepare(`UPDATE entries SET is_embedded = 1 WHERE id IN (${placeholders})`).bind(...ids).run();
      processed = vectors.length;
    }
  }
  const remRow = await env.DB.prepare(`SELECT COUNT(*) as c FROM entries WHERE ${where}`).bind(...params).first();
  const totalMatching = remRow?.c ?? 0;
  const remaining = opts.reindex ? Math.max(0, totalMatching - (offset + scanned)) : totalMatching;
  return { enabled: true, processed, skipped: scanned - processed, remaining, scanned };
}
async function backfillStatus(env, opts = {}) {
  const conds = [];
  const params = [];
  if (opts.owner_id) {
    conds.push("owner_id = ?");
    params.push(opts.owner_id);
  }
  if (opts.source) {
    conds.push("json_extract(metadata_json, '$.source') = ?");
    params.push(opts.source);
  }
  const extra = conds.length ? ` AND ${conds.join(" AND ")}` : "";
  const pendingRow = await env.DB.prepare(`SELECT COUNT(*) as c FROM entries WHERE ${BACKFILL_PREDICATE}${extra}`).bind(...params).first();
  const embeddedRow = await env.DB.prepare(`SELECT COUNT(*) as c FROM entries WHERE is_embedded = 1 AND json_extract(metadata_json, '$.embed') = 1${extra}`).bind(...params).first();
  return { enabled: embedEnabled(env), pending: pendingRow?.c ?? 0, embedded: embeddedRow?.c ?? 0 };
}
async function embedSelfTest(env, opts = {}) {
  if (!embedEnabled(env)) {
    return { enabled: false, tested: false, passed: null, note: "embed \u6A21\u7D44\u672A\u958B\uFF08\u7F3A Vectorize/AI binding\uFF09\uFF0C\u8A9E\u7FA9\u641C\u5C0B\u9019\u689D\u8DEF\u76EE\u524D\u4E0D\u5B58\u5728" };
  }
  const conds = ["is_embedded = 1", "content IS NOT NULL AND content <> ''"];
  const params = [];
  if (opts.owner_id) {
    conds.push("owner_id = ?");
    params.push(opts.owner_id);
  }
  const where = conds.join(" AND ");
  const row = await env.DB.prepare(`SELECT * FROM entries WHERE ${where} ORDER BY updated_at DESC LIMIT 1`).bind(...params).first();
  if (!row) {
    return { enabled: true, tested: false, passed: null, note: "\u5C1A\u7121\u4EFB\u4F55\u5361\u7247\u88AB\u6A19\u8A18\u70BA\u300C\u5DF2\u5D4C\u5165\u300D\uFF0C\u7121\u6CD5\u81EA\u6211\u6AA2\u67E5\uFF08\u53EF\u80FD\u662F\u9084\u6C92\u5361\u7247\uFF0C\u4E5F\u53EF\u80FD\u662F\u5D4C\u5165\u5F9E\u672A\u6210\u529F\u904E\uFF09" };
  }
  const sample = (row.content ?? "").trim().slice(0, 200);
  if (!sample) {
    return { enabled: true, tested: false, passed: null, note: "\u53D6\u6A23\u5361\u7247\u5167\u5BB9\u70BA\u7A7A\uFF0C\u8DF3\u904E\u81EA\u6211\u6AA2\u67E5" };
  }
  const hits = await semanticSearch(env, sample, { owner_id: opts.owner_id, topK: 10, min_score: 0 });
  if (hits === null) {
    return { enabled: false, tested: false, passed: null, note: "embed \u6A21\u7D44\u56DE\u5831\u672A\u958B\uFF08binding \u6AA2\u67E5\u671F\u9593\u6D88\u5931\uFF0C\u7F55\u898B\uFF09" };
  }
  const passed = hits.some((h) => h.id === row.id);
  return {
    enabled: true,
    tested: true,
    passed,
    note: passed ? "\u62FF\u4E00\u5F35\u5DF2\u6A19\u8A18\u300C\u5DF2\u5D4C\u5165\u300D\u7684\u5361\u7247\u81EA\u6211\u67E5\u8A62\uFF0C\u80FD\u641C\u5230\u81EA\u5DF1\u2014\u2014\u8A9E\u7FA9\u641C\u5C0B\u9019\u689D\u8DEF\u662F\u901A\u7684" : "\u62FF\u4E00\u5F35\u5DF2\u6A19\u8A18\u300C\u5DF2\u5D4C\u5165\u300D\u7684\u5361\u7247\u81EA\u6211\u67E5\u8A62\uFF0C\u537B\u641C\u4E0D\u5230\u81EA\u5DF1\u2014\u2014\u50CF\u662F index \u6C92\u6536\u9304\u5230\u9019\u6279\u5411\u91CF\uFF08\u9700\u8981\u91CD\u65B0 reindex\uFF09"
  };
}
async function semanticSearch(env, q, opts = {}) {
  if (!embedEnabled(env)) return null;
  const vec = await embedText(env, q);
  if (!vec) return [];
  const filter = {};
  if (opts.owner_id) filter.owner_id = opts.owner_id;
  if (opts.source) filter.source = opts.source;
  if (opts.entry_type) filter.entry_type = opts.entry_type;
  if (opts.library && opts.library.length > 0) filter.library = { $in: opts.library };
  const res = await env.VECTORIZE.query(vec, {
    topK: Math.min(opts.topK ?? 20, 100),
    returnMetadata: "indexed",
    ...Object.keys(filter).length ? { filter } : {}
  });
  const minScore = opts.min_score ?? MIN_SCORE_ABS_FLOOR;
  return (res.matches ?? []).filter((m) => m.score >= minScore).map((m) => ({
    id: m.id,
    score: m.score,
    owner_id: m.metadata?.owner_id,
    entry_type: m.metadata?.entry_type,
    source: m.metadata?.source,
    library: m.metadata?.library
  }));
}

// ../../matrix/arcrun/kbdb/src/actions/credential-legacy-migration.ts
async function legacyCredentialsTableExists(db) {
  const row = await db.prepare(`SELECT 1 AS x FROM sqlite_master WHERE type = 'table' AND name = 'credentials'`).first();
  return row !== null;
}
async function migrateLegacyCredentialsForOwner(db, ownerId) {
  if (!ownerId) return 0;
  if (!await legacyCredentialsTableExists(db)) return 0;
  const before = await db.prepare(`SELECT COUNT(*) AS n FROM entries WHERE entry_type = 'credential' AND owner_id = ?1`).bind(ownerId).first();
  await db.prepare(
    `INSERT INTO entries (id, entry_type, owner_id, page_name, metadata_json, created_at, updated_at)
       SELECT
         'e_cred_' || lower(hex(randomblob(8))),
         'credential',
         c.api_key,
         c.name,
         json_object('service', c.service, 'sensitivity', c.sensitivity, 'secret_ref', c.secret_ref, 'last_used_at', c.last_used_at),
         c.created_at,
         unixepoch()
       FROM credentials c
       WHERE c.api_key = ?1
         AND NOT EXISTS (
           SELECT 1 FROM entries e
           WHERE e.entry_type = 'credential' AND e.owner_id = c.api_key AND e.page_name = c.name
         )`
  ).bind(ownerId).run();
  const after = await db.prepare(`SELECT COUNT(*) AS n FROM entries WHERE entry_type = 'credential' AND owner_id = ?1`).bind(ownerId).first();
  return (after?.n ?? 0) - (before?.n ?? 0);
}

// ../../matrix/arcrun/kbdb/src/routes/entries.ts
var entryRoutes = new Hono2();
function parseLibraryParam(raw2) {
  if (!raw2) return void 0;
  const libs = raw2.split(",").map((s) => s.trim()).filter(Boolean);
  return libs.length > 0 ? libs : void 0;
}
entryRoutes.post("/", async (c) => {
  const body = await c.req.json().catch(() => null);
  if (!body || !body.entry_type) return c.json({ success: false, error: "entry_type required" }, 400);
  const entry = await createEntry(c.env.DB, body);
  if (embedEnabled(c.env)) c.executionCtx.waitUntil(embedOnWrite(c.env, entry).catch(() => {
  }));
  return c.json({ success: true, entry });
});
entryRoutes.get("/libraries", async (c) => {
  const owner = c.req.query("owner_id") || "";
  const rows = await c.env.DB.prepare(
    `SELECT DISTINCT COALESCE(NULLIF(json_extract(metadata_json, '$.library'), ''), 'general') AS library
       FROM entries
      WHERE (?1 = '' OR owner_id = ?1)
        AND COALESCE(json_extract(metadata_json, '$.status'), '') != 'deprecated'
      ORDER BY library`
  ).bind(owner).all();
  const libraries = (rows.results ?? []).map((r) => r.library).filter(Boolean);
  return c.json({ success: true, libraries, count: libraries.length });
});
entryRoutes.get("/library-stats", async (c) => {
  const owner = c.req.query("owner_id") || "";
  const rows = await c.env.DB.prepare(
    `SELECT
       COALESCE(NULLIF(json_extract(metadata_json, '$.library'), ''), 'general') AS library,
       COUNT(DISTINCT page_name) AS card_count
     FROM entries
     WHERE (?1 = '' OR owner_id = ?1)
       AND entry_type = 'block'
       AND page_name IS NOT NULL
       AND COALESCE(json_extract(metadata_json, '$.status'), '') != 'deprecated'
     GROUP BY library
     ORDER BY library`
  ).bind(owner).all();
  const stats = (rows.results ?? []).map((r) => ({ library: r.library, card_count: r.card_count }));
  return c.json({ success: true, stats });
});
entryRoutes.get("/", async (c) => {
  const entryType = c.req.query("entry_type") || void 0;
  const ownerId = c.req.query("owner_id") || void 0;
  if (entryType === "credential" && ownerId) {
    await migrateLegacyCredentialsForOwner(c.env.DB, ownerId).catch(() => {
    });
  }
  const { entries, total } = await listEntries(c.env.DB, {
    entry_type: entryType,
    owner_id: ownerId,
    parent_id: c.req.query("parent_id") || void 0,
    page_name: c.req.query("page_name") || void 0,
    source: c.req.query("source") || void 0,
    library: parseLibraryParam(c.req.query("library")),
    q: c.req.query("q") || c.req.query("search") || void 0,
    limit: c.req.query("limit") ? Number(c.req.query("limit")) : void 0,
    offset: c.req.query("offset") ? Number(c.req.query("offset")) : void 0
  });
  return c.json({ success: true, entries, count: entries.length, total });
});
entryRoutes.get("/search", async (c) => {
  const q = c.req.query("q");
  if (!q) return c.json({ success: false, error: "q required" }, 400);
  const owner_id = c.req.query("owner_id") || void 0;
  const source = c.req.query("source") || void 0;
  const entry_type = c.req.query("entry_type") || void 0;
  const library = parseLibraryParam(c.req.query("library"));
  const mode = c.req.query("mode") === "semantic" ? "semantic" : "keyword";
  const include_deprecated = c.req.query("include_deprecated") === "true";
  const topKNum = Number(c.req.query("top_k"));
  const top_k = Number.isFinite(topKNum) && topKNum > 0 ? Math.floor(topKNum) : void 0;
  const minScoreNum = Number(c.req.query("min_score"));
  const min_score = Number.isFinite(minScoreNum) && minScoreNum > 0 ? minScoreNum : void 0;
  if (mode === "semantic") {
    const requestedTopK = top_k ?? 20;
    const fetchTopK = include_deprecated ? requestedTopK : Math.min(requestedTopK * 3, 100);
    const hits = await semanticSearch(c.env, q, {
      owner_id,
      source,
      entry_type,
      library,
      topK: fetchTopK,
      min_score
    });
    if (hits === null) {
      const entries3 = await searchEntries(c.env.DB, q, owner_id, entry_type, void 0, library, source, include_deprecated);
      return c.json({
        success: true,
        entries: entries3,
        count: entries3.length,
        mode: "keyword",
        requested_mode: "semantic",
        capability_hint: "\u8A9E\u610F\u641C\u5C0B\u9084\u6C92\u958B\u901A\uFF0C\u9019\u6B21\u986F\u793A\u7684\u662F\u95DC\u9375\u5B57\u6BD4\u5C0D\u7D50\u679C\uFF0C\u4E0D\u662F\u7528\u300C\u610F\u601D\u300D\u627E\u7684\u2014\u2014\u4F60\u6253\u7684\u5B57\u8981\u76E1\u91CF\u8CBC\u8FD1\u8CC7\u6599\u88E1\u5BE6\u969B\u51FA\u73FE\u7684\u8A5E\u624D\u5BB9\u6613\u641C\u5230\u3002\u60F3\u555F\u7528\u8A9E\u610F\u641C\u5C0B\uFF0C\u8ACB\u806F\u7D61\u6211\u5011\u5354\u52A9\u958B\u901A\u3002",
        admin_hint: "\u8A9E\u7FA9\u67E5\u8A62\u9700\u5148\u958B vectorize\uFF08embed \u6A21\u7D44\uFF09\u3002\u53EB CC\u300C\u5E6B\u6211\u958B\u8A9E\u7FA9\u67E5\u8A62\u300D\u5373\u53EF\uFF08\u8A2D kbdb_embed:true + redeploy\uFF09\u3002\u672C\u6B21\u5DF2\u964D\u7D1A\u95DC\u9375\u5B57\u641C\u5C0B\u3002"
      });
    }
    let entries2 = (await Promise.all(
      hits.map(async (h) => {
        const e = await getEntry(c.env.DB, h.id);
        return e ? { ...e, score: h.score } : null;
      })
    )).filter((e) => e !== null);
    if (!include_deprecated) {
      entries2 = entries2.filter((e) => !isDeprecatedEntry(e));
    }
    if (min_score === void 0 && entries2.length > 1) {
      const cut = relativeMinScore(entries2[0].score);
      entries2 = entries2.filter((e) => e.score >= cut);
    }
    entries2 = entries2.slice(0, requestedTopK);
    if (entries2.length === 0) {
      let empty_reason;
      let capability_hint;
      let admin_hint;
      if (hits.length === 0) {
        const status = await backfillStatus(c.env, { owner_id });
        if (status.embedded === 0) {
          empty_reason = "no_index";
          capability_hint = "\u9019\u500B\u77E5\u8B58\u5EAB\u76EE\u524D\u9084\u6C92\u6709\u53EF\u4F9B\u8A9E\u610F\u641C\u5C0B\u7684\u8CC7\u6599\uFF0C\u6240\u4EE5\u641C\u4E0D\u5230\u2014\u2014\u4E0D\u662F\u4F60\u6253\u7684\u5B57\u6709\u554F\u984C\u3002\u8ACB\u806F\u7D61\u6211\u5011\u78BA\u8A8D\u7D22\u5F15\u6709\u6C92\u6709\u5EFA\u597D\u3002";
          admin_hint = `owner_id=${owner_id ?? "(all)"} \u7BC4\u570D backfillStatus.embedded=0\uFF1A\u5F9E\u672A embed\uFF0C\u6216 backfill \u672A\u8DD1\u904E\u3002`;
        } else {
          empty_reason = "no_match";
          capability_hint = "\u6C92\u6709\u627E\u5230\u7B26\u5408\u7684\u5167\u5BB9\uFF0C\u63DB\u500B\u8AAA\u6CD5\u6216\u66F4\u5177\u9AD4\u7684\u95DC\u9375\u5B57\u518D\u8A66\u8A66\u770B\u3002";
          admin_hint = `owner_id=${owner_id ?? "(all)"} \u5DF2\u6709 ${status.embedded} \u7B46\u5D4C\u5165\u8CC7\u6599\uFF0C\u4F46\u672C\u6B21\u67E5\u8A62\u5728 Vectorize \u7AEF\u96F6\u547D\u4E2D\uFF08\u542B embed.ts \u7D55\u5C0D\u9580\u6ABB\u904E\u6FFE\uFF09\u3002`;
        }
      } else {
        empty_reason = "stale_index";
        capability_hint = "\u627E\u5230\u7684\u5167\u5BB9\u90FD\u5DF2\u7D93\u88AB\u4E0B\u67B6\u6216\u79FB\u9664\u4E86\uFF0C\u6240\u4EE5\u6C92\u6709\u53EF\u986F\u793A\u7684\u7D50\u679C\u2014\u2014\u63DB\u500B\u95DC\u9375\u5B57\u518D\u8A66\u8A66\u770B\uFF0C\u6216\u806F\u7D61\u6211\u5011\u78BA\u8A8D\u7D22\u5F15\u6709\u6C92\u6709\u904E\u671F\u3002";
        admin_hint = `Vectorize \u547D\u4E2D ${hits.length} \u7B46\uFF0C\u4F46 hydrate \u5F8C\u5168\u90E8\u662F\u5DF2\u4E0B\u67B6\u6216\u627E\u4E0D\u5230\u5C0D\u61C9\u8CC7\u6599\uFF08\u5B64\u5152\u5411\u91CF\uFF09\uFF0C\u975E\u5206\u6578\u9580\u6ABB\u9020\u6210\u2014\u2014\u76F8\u5C0D\u9580\u6ABB\u6578\u5B78\u4E0A\u4E0D\u53EF\u80FD\u780D\u5149\u975E\u7A7A\u7D50\u679C\uFF08cut<=top\uFF09\u3002`;
      }
      return c.json({
        success: true,
        entries: entries2,
        count: entries2.length,
        mode: "semantic",
        empty_reason,
        capability_hint,
        admin_hint
      });
    }
    return c.json({ success: true, entries: entries2, count: entries2.length, mode: "semantic" });
  }
  const entries = await searchEntries(c.env.DB, q, owner_id, entry_type, void 0, library, source, include_deprecated);
  return c.json({ success: true, entries, count: entries.length, mode: "keyword" });
});
entryRoutes.get("/:id", async (c) => {
  const entry = await getEntry(c.env.DB, c.req.param("id"));
  if (!entry) return c.json({ success: false, error: "not found" }, 404);
  return c.json({ success: true, entry });
});
entryRoutes.patch("/deprecate-by-library", async (c) => {
  const body = await c.req.json().catch(() => null);
  const ownerId = String(body?.owner_id ?? "").trim();
  const library = String(body?.library ?? "").trim();
  if (!ownerId || !library) return c.json({ success: false, error: "owner_id \u8207 library \u5FC5\u586B" }, 400);
  const ids = embedEnabled(c.env) ? await embeddedIdsByLibrary(c.env.DB, ownerId, library) : [];
  const count = await deprecateEntriesByLibrary(c.env.DB, ownerId, library);
  let vectors_deleted = 0;
  if (ids.length > 0) {
    try {
      await c.env.VECTORIZE.deleteByIds(ids);
      await markUnembedded(c.env.DB, ids);
      vectors_deleted = ids.length;
    } catch {
    }
  }
  return c.json({ success: true, deprecated_count: count, vectors_deleted });
});
entryRoutes.patch("/:id", async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const entry = await updateEntry(c.env.DB, c.req.param("id"), body);
  if (!entry) return c.json({ success: false, error: "not found" }, 404);
  if (embedEnabled(c.env) && body.content !== void 0) {
    c.executionCtx.waitUntil(embedOnWrite(c.env, entry).catch(() => {
    }));
  }
  return c.json({ success: true, entry });
});
entryRoutes.delete("/:id", async (c) => {
  if (embedEnabled(c.env)) {
    c.executionCtx.waitUntil(c.env.VECTORIZE.deleteByIds([c.req.param("id")]).then(() => {
    }).catch(() => {
    }));
  }
  await deleteEntry(c.env.DB, c.req.param("id"));
  return c.json({ success: true });
});

// ../../matrix/arcrun/kbdb/src/actions/record-crud.ts
function uid2(prefix) {
  return `${prefix}_${crypto.randomUUID()}`;
}
async function createTemplate(db, input) {
  const id = input.id ?? uid2("tpl");
  await db.prepare(`INSERT INTO templates (id, name, description, slots_json, created_by) VALUES (?, ?, ?, ?, ?)`).bind(id, input.name, input.description ?? null, JSON.stringify(input.slots), input.created_by ?? null).run();
  const row = await getTemplate(db, id);
  if (!row) throw new Error("createTemplate: row not found after insert");
  return row;
}
async function getTemplate(db, idOrName) {
  const row = await db.prepare("SELECT * FROM templates WHERE id = ? OR name = ? LIMIT 1").bind(idOrName, idOrName).first();
  return row ?? null;
}
async function listTemplates(db) {
  const res = await db.prepare("SELECT * FROM templates ORDER BY created_at DESC").all();
  return res.results ?? [];
}
async function updateTemplate(db, id, patch) {
  const cols = [];
  const params = [];
  if (patch.description !== void 0) {
    cols.push("description = ?");
    params.push(patch.description);
  }
  if (patch.slots !== void 0) {
    cols.push("slots_json = ?");
    params.push(JSON.stringify(patch.slots));
  }
  if (cols.length === 0) return getTemplate(db, id);
  cols.push("updated_at = unixepoch()");
  await db.prepare(`UPDATE templates SET ${cols.join(", ")} WHERE id = ?`).bind(...params, id).run();
  return getTemplate(db, id);
}
async function createRecord(db, input) {
  const tpl = await getTemplate(db, input.template);
  if (!tpl) throw new Error(`template not found: ${input.template}`);
  const slots = JSON.parse(tpl.slots_json);
  const recordId = input.record_id ?? uid2("rec");
  for (const slot of slots) {
    if (!(slot in input.values)) continue;
    const entry = await createEntry(db, {
      content: input.values[slot],
      entry_type: "value",
      owner_id: input.owner_id ?? null
    });
    await db.prepare(`INSERT INTO entry_values (id, record_id, template_id, slot_name, entry_id) VALUES (?, ?, ?, ?, ?)`).bind(uid2("ev"), recordId, tpl.id, slot, entry.id).run();
  }
  return { record_id: recordId, template_id: tpl.id, values: input.values };
}
async function updateRecord(db, recordId, values) {
  const evRes = await db.prepare(
    `SELECT ev.slot_name AS slot_name, ev.entry_id AS entry_id, ev.template_id AS template_id, e.owner_id AS owner_id
       FROM entry_values ev JOIN entries e ON ev.entry_id = e.id
       WHERE ev.record_id = ?`
  ).bind(recordId).all();
  const evRows = evRes.results ?? [];
  if (evRows.length === 0) return null;
  const templateId = evRows[0].template_id;
  const recordOwnerId = evRows.find((r) => r.owner_id != null)?.owner_id ?? null;
  const slotToEntry = new Map(evRows.map((r) => [r.slot_name, r.entry_id]));
  const tpl = await getTemplate(db, templateId);
  const allowed = tpl ? JSON.parse(tpl.slots_json) : [...slotToEntry.keys()];
  for (const [slot, content] of Object.entries(values)) {
    if (!allowed.includes(slot)) {
      throw new Error(`slot not in template: ${slot}`);
    }
    const entryId = slotToEntry.get(slot);
    if (entryId) {
      await db.prepare(`UPDATE entries SET content = ?, updated_at = unixepoch() WHERE id = ?`).bind(content, entryId).run();
    } else {
      const entry = await createEntry(db, { content, entry_type: "value", owner_id: recordOwnerId });
      await db.prepare(`INSERT INTO entry_values (id, record_id, template_id, slot_name, entry_id) VALUES (?, ?, ?, ?, ?)`).bind(uid2("ev"), recordId, templateId, slot, entry.id).run();
    }
  }
  return getRecord(db, recordId);
}
async function getRecord(db, recordId) {
  const res = await db.prepare(
    `SELECT ev.slot_name as slot, e.content as content, ev.template_id as template_id
       FROM entry_values ev JOIN entries e ON ev.entry_id = e.id
       WHERE ev.record_id = ?`
  ).bind(recordId).all();
  const rows = res.results ?? [];
  if (rows.length === 0) return null;
  const values = {};
  for (const r of rows) values[r.slot] = r.content;
  return { record_id: recordId, template_id: rows[0].template_id, values };
}
async function searchByTemplate(db, template, owner_id, limit = 100) {
  const tpl = await getTemplate(db, template);
  if (!tpl) return [];
  const cap = Math.min(limit, 500);
  const res = owner_id ? await db.prepare(
    `SELECT DISTINCT ev.record_id as record_id FROM entry_values ev
           JOIN entries e ON ev.entry_id = e.id
           WHERE ev.template_id = ? AND e.owner_id = ?
           ORDER BY ev.created_at DESC LIMIT ?`
  ).bind(tpl.id, owner_id, cap).all() : await db.prepare(`SELECT DISTINCT record_id FROM entry_values WHERE template_id = ? ORDER BY created_at DESC LIMIT ?`).bind(tpl.id, cap).all();
  const ids = (res.results ?? []).map((r) => r.record_id);
  if (ids.length === 0) return [];
  const byId = /* @__PURE__ */ new Map();
  for (let i = 0; i < ids.length; i += 90) {
    const chunk = ids.slice(i, i + 90);
    const placeholders = chunk.map(() => "?").join(",");
    const evRes = await db.prepare(
      `SELECT ev.record_id as record_id, ev.slot_name as slot, e.content as content, ev.template_id as template_id
         FROM entry_values ev JOIN entries e ON ev.entry_id = e.id
         WHERE ev.record_id IN (${placeholders})`
    ).bind(...chunk).all();
    for (const r of evRes.results ?? []) {
      let rec = byId.get(r.record_id);
      if (!rec) {
        rec = { record_id: r.record_id, template_id: r.template_id, values: {} };
        byId.set(r.record_id, rec);
      }
      rec.values[r.slot] = r.content;
    }
  }
  return ids.map((id) => byId.get(id)).filter((r) => !!r);
}
async function deleteRecord(db, recordId) {
  const evRes = await db.prepare("SELECT entry_id FROM entry_values WHERE record_id = ?").bind(recordId).all();
  const rows = evRes.results ?? [];
  if (rows.length === 0) return false;
  await db.prepare("DELETE FROM entry_values WHERE record_id = ?").bind(recordId).run();
  for (const { entry_id } of rows) {
    await db.prepare("DELETE FROM entries WHERE id = ?").bind(entry_id).run();
  }
  return true;
}

// ../../matrix/arcrun/kbdb/src/routes/templates.ts
var templateRoutes = new Hono2();
templateRoutes.post("/", async (c) => {
  const body = await c.req.json().catch(() => null);
  if (!body || !body.name || !Array.isArray(body.slots)) {
    return c.json({ success: false, error: "name and slots[] required" }, 400);
  }
  const tpl = await createTemplate(c.env.DB, body);
  return c.json({ success: true, template: tpl });
});
templateRoutes.get("/", async (c) => {
  const templates = await listTemplates(c.env.DB);
  return c.json({ success: true, templates, count: templates.length });
});
templateRoutes.get("/:idOrName", async (c) => {
  const tpl = await getTemplate(c.env.DB, c.req.param("idOrName"));
  if (!tpl) return c.json({ success: false, error: "not found" }, 404);
  return c.json({ success: true, template: tpl });
});
templateRoutes.patch("/:id", async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const tpl = await updateTemplate(c.env.DB, c.req.param("id"), body);
  if (!tpl) return c.json({ success: false, error: "not found" }, 404);
  return c.json({ success: true, template: tpl });
});

// ../../matrix/arcrun/kbdb/src/routes/records.ts
var recordRoutes = new Hono2();
recordRoutes.post("/", async (c) => {
  const body = await c.req.json().catch(() => null);
  if (!body || !body.template || !body.values) {
    return c.json({ success: false, error: "template and values required" }, 400);
  }
  try {
    const rec = await createRecord(c.env.DB, body);
    return c.json({ success: true, record: rec });
  } catch (e) {
    return c.json({ success: false, error: e instanceof Error ? e.message : String(e) }, 400);
  }
});
recordRoutes.get("/triplet-stats", async (c) => {
  const owner = c.req.query("owner_id") || "";
  const rows = await c.env.DB.prepare(
    `SELECT
       COALESCE(NULLIF(lib_e.content, ''), 'general') AS library,
       COUNT(*) AS triplet_count
     FROM (
       SELECT DISTINCT ev.record_id
       FROM entry_values ev
       JOIN templates t ON ev.template_id = t.id
       JOIN entries e ON ev.entry_id = e.id
       WHERE t.name = 'triplet'
         AND (?1 = '' OR e.owner_id = ?1)
     ) AS tr
     LEFT JOIN entry_values lev
       ON lev.record_id = tr.record_id AND lev.slot_name = 'library'
     LEFT JOIN entries lib_e ON lib_e.id = lev.entry_id
     GROUP BY COALESCE(NULLIF(lib_e.content, ''), 'general')
     ORDER BY library`
  ).bind(owner).all();
  const stats = (rows.results ?? []).map((r) => ({ library: r.library, triplet_count: r.triplet_count }));
  return c.json({ success: true, stats });
});
recordRoutes.get("/by-template/:template", async (c) => {
  const records = await searchByTemplate(c.env.DB, c.req.param("template"), c.req.query("owner_id") || void 0);
  return c.json({ success: true, records, count: records.length });
});
recordRoutes.get("/:recordId", async (c) => {
  const rec = await getRecord(c.env.DB, c.req.param("recordId"));
  if (!rec) return c.json({ success: false, error: "not found" }, 404);
  return c.json({ success: true, record: rec });
});
recordRoutes.patch("/:recordId", async (c) => {
  const body = await c.req.json().catch(() => null);
  if (!body || !body.values || typeof body.values !== "object") {
    return c.json({ success: false, error: "values required" }, 400);
  }
  try {
    const rec = await updateRecord(c.env.DB, c.req.param("recordId"), body.values);
    if (!rec) return c.json({ success: false, error: "not found" }, 404);
    return c.json({ success: true, record: rec });
  } catch (e) {
    return c.json({ success: false, error: e instanceof Error ? e.message : String(e) }, 400);
  }
});
recordRoutes.delete("/:recordId", async (c) => {
  const found = await deleteRecord(c.env.DB, c.req.param("recordId"));
  if (!found) return c.json({ success: false, error: "not found" }, 404);
  return c.json({ success: true });
});

// ../../matrix/arcrun/kbdb/src/actions/recipe-stat.ts
function statId(canonicalId) {
  return `recipestat:${canonicalId}`;
}
async function recordRecipeResult(db, canonicalId, ok, nowMs) {
  const id = statId(canonicalId);
  const existing = await db.prepare("SELECT metadata_json FROM entries WHERE id = ?").bind(id).first();
  let stat;
  if (existing) {
    const prev = existing.metadata_json ? JSON.parse(existing.metadata_json) : emptyStat(canonicalId);
    stat = {
      canonical_id: canonicalId,
      success_count: prev.success_count + (ok ? 1 : 0),
      failure_count: prev.failure_count + (ok ? 0 : 1),
      last_status: ok ? "success" : "failure",
      last_at: nowMs
    };
    await db.prepare("UPDATE entries SET metadata_json = ?, updated_at = unixepoch() WHERE id = ?").bind(JSON.stringify(stat), id).run();
  } else {
    stat = {
      canonical_id: canonicalId,
      success_count: ok ? 1 : 0,
      failure_count: ok ? 0 : 1,
      last_status: ok ? "success" : "failure",
      last_at: nowMs
    };
    await db.prepare("INSERT INTO entries (id, content, entry_type, metadata_json) VALUES (?, ?, ?, ?)").bind(id, canonicalId, "recipe_stat", JSON.stringify(stat)).run();
  }
  return stat;
}
async function getRecipeStat(db, canonicalId) {
  const row = await db.prepare("SELECT metadata_json FROM entries WHERE id = ?").bind(statId(canonicalId)).first();
  if (!row || !row.metadata_json) return emptyStat(canonicalId);
  return JSON.parse(row.metadata_json);
}
function emptyStat(canonicalId) {
  return { canonical_id: canonicalId, success_count: 0, failure_count: 0, last_status: null, last_at: null };
}

// ../../matrix/arcrun/kbdb/src/routes/recipe-stats.ts
var recipeStatRoutes = new Hono2();
recipeStatRoutes.post("/record", async (c) => {
  const body = await c.req.json().catch(() => null);
  if (!body || !body.canonical_id || typeof body.ok !== "boolean") {
    return c.json({ success: false, error: "canonical_id and ok(boolean) required" }, 400);
  }
  const at = typeof body.at === "number" ? body.at : 0;
  const stat = await recordRecipeResult(c.env.DB, body.canonical_id, body.ok, at);
  return c.json({ success: true, stat });
});
recipeStatRoutes.get("/:canonical_id", async (c) => {
  const stat = await getRecipeStat(c.env.DB, c.req.param("canonical_id"));
  return c.json({ success: true, stat });
});

// ../../matrix/arcrun/kbdb/src/routes/embed.ts
var embedRoutes = new Hono2();
var OFF_HINT = "\u8A9E\u7FA9\u88DC\u5D4C\u9700\u5148\u958B embed \u6A21\u7D44\uFF08Vectorize+AI binding\uFF09\u3002\u53EB CC\u300C\u5E6B\u6211\u958B\u8A9E\u7FA9\u67E5\u8A62\u300D\uFF08\u8A2D kbdb_embed:true + redeploy \u6CE8\u5165 binding\uFF09\u5F8C\u518D\u547C\u53EB\u672C\u7AEF\u9EDE\u3002";
embedRoutes.post("/backfill", async (c) => {
  if (!embedEnabled(c.env)) {
    return c.json(
      { success: false, error: "embed module not enabled (need VECTORIZE + AI bindings)", capability_hint: OFF_HINT },
      409
    );
  }
  const body = await c.req.json().catch(() => ({}));
  const result = await backfillEmbeddings(c.env, {
    limit: body.limit !== void 0 ? Number(body.limit) : void 0,
    owner_id: body.owner_id || void 0,
    source: body.source || void 0,
    // reindex（Arcrun#11）：重推既有向量讓事後建立的 Vectorize metadata index 收錄（見 embed.ts）。
    reindex: body.reindex === true,
    offset: body.offset !== void 0 ? Number(body.offset) : void 0
  });
  return c.json({ success: true, ...result });
});
embedRoutes.get("/backfill/status", async (c) => {
  const status = await backfillStatus(c.env, {
    owner_id: c.req.query("owner_id") || void 0,
    source: c.req.query("source") || void 0
  });
  return c.json({ success: true, ...status });
});
embedRoutes.get("/selftest", async (c) => {
  const result = await embedSelfTest(c.env, { owner_id: c.req.query("owner_id") || void 0 });
  return c.json({ success: true, ...result });
});

// ../../matrix/arcrun/kbdb/src/actions/library-map.ts
var LIBRARY_MAP_TEMPLATE_ID = "tpl-library-map";
var LIBRARY_MAP_TEMPLATE_NAME = "library_map";
var LIBRARY_MAP_SLOTS = [
  "library",
  "narrative",
  "top_entities",
  "relation_profile",
  "bridges",
  "triplet_count",
  "commit_hash",
  "status"
];
var DEFAULT_TRIPLET_TEMPLATE = "triplet";
async function ensureLibraryMapTemplate(db) {
  const existing = await getTemplate(db, LIBRARY_MAP_TEMPLATE_NAME);
  if (existing) return;
  try {
    await createTemplate(db, {
      id: LIBRARY_MAP_TEMPLATE_ID,
      name: LIBRARY_MAP_TEMPLATE_NAME,
      description: "per-library map block\uFF08\u85CF\u66F8\u5730\u5716\uFF1Agraph \u6A5F\u68B0\u5C0E\u51FA\uFF0C\u96F6 LLM \u751F\u6210\uFF1BArcrun#39\uFF09",
      slots: LIBRARY_MAP_SLOTS,
      created_by: "system"
    });
  } catch {
    if (!await getTemplate(db, LIBRARY_MAP_TEMPLATE_NAME)) throw new Error("ensureLibraryMapTemplate failed");
  }
}
async function ensureTripletLibrarySlot(db, tripletTemplate) {
  const tpl = await getTemplate(db, tripletTemplate);
  if (!tpl) throw new Error(`triplet template not found: ${tripletTemplate}`);
  const slots = JSON.parse(tpl.slots_json);
  if (slots.includes("library")) return false;
  await updateTemplate(db, tpl.id, { slots: [...slots, "library"] });
  return true;
}
function tripletPivotSql(ownerFiltered) {
  return `SELECT ev.record_id AS rid,
       MAX(CASE WHEN ev.slot_name = 'subject' THEN e.content END) AS subject,
       MAX(CASE WHEN ev.slot_name = 'object' THEN e.content END) AS object,
       MAX(CASE WHEN ev.slot_name = 'predicate' THEN e.content END) AS predicate,
       MAX(CASE WHEN ev.slot_name = 'status' THEN e.content END) AS status,
       MAX(CASE WHEN ev.slot_name = 'library' THEN e.content END) AS library,
       MAX(CASE WHEN ev.slot_name = 'source_uri' THEN e.content END) AS source_uri
     FROM entry_values ev JOIN entries e ON ev.entry_id = e.id
     WHERE ev.template_id = ?${ownerFiltered ? " AND e.owner_id = ?" : ""}
     GROUP BY ev.record_id`;
}
function mapPivotSql(ownerFiltered) {
  return `SELECT ev.record_id AS rid,
       MAX(CASE WHEN ev.slot_name = 'library' THEN e.content END) AS library,
       MAX(CASE WHEN ev.slot_name = 'narrative' THEN e.content END) AS narrative,
       MAX(CASE WHEN ev.slot_name = 'top_entities' THEN e.content END) AS top_entities,
       MAX(CASE WHEN ev.slot_name = 'relation_profile' THEN e.content END) AS relation_profile,
       MAX(CASE WHEN ev.slot_name = 'bridges' THEN e.content END) AS bridges,
       MAX(CASE WHEN ev.slot_name = 'triplet_count' THEN e.content END) AS triplet_count,
       MAX(CASE WHEN ev.slot_name = 'commit_hash' THEN e.content END) AS commit_hash,
       MAX(CASE WHEN ev.slot_name = 'status' THEN e.content END) AS status,
       MAX(ev.created_at) AS ts
     FROM entry_values ev JOIN entries e ON ev.entry_id = e.id
     WHERE ev.template_id = ?${ownerFiltered ? " AND e.owner_id = ?" : ""}
     GROUP BY ev.record_id`;
}
function parseJsonArray(raw2) {
  if (!raw2) return [];
  try {
    const v = JSON.parse(raw2);
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}
async function recomputeLibraryMap(db, input) {
  const library = input.library.trim();
  if (!library) throw new Error("library required");
  const tripletTemplateName = input.triplet_template ?? DEFAULT_TRIPLET_TEMPLATE;
  const topN = Math.min(Math.max(Math.floor(input.top_n ?? 10), 1), 50);
  await ensureLibraryMapTemplate(db);
  const librarySlotAdded = await ensureTripletLibrarySlot(db, tripletTemplateName);
  const tripletTpl = await getTemplate(db, tripletTemplateName);
  if (!tripletTpl) throw new Error(`triplet template not found: ${tripletTemplateName}`);
  const owner = input.owner_id || void 0;
  const pivot = tripletPivotSql(!!owner);
  const pivotParams = owner ? [tripletTpl.id, owner] : [tripletTpl.id];
  const libCond = input.source_prefix ? `(t.library = ? OR (t.library IS NULL AND t.source_uri LIKE ? || '%'))` : `t.library = ?`;
  const libParams = input.source_prefix ? [library, input.source_prefix] : [library];
  const withLib = `WITH t AS (${pivot}), lib AS (
     SELECT * FROM t WHERE COALESCE(t.status, 'active') = 'active' AND ${libCond})`;
  const baseParams = [...pivotParams, ...libParams];
  const [countRow, topRes, relRes, bridgeRes] = await Promise.all([
    db.prepare(`${withLib} SELECT COUNT(*) AS n FROM lib`).bind(...baseParams).first(),
    // degree＝entity 在該庫 active triplet 的出現次數（subject＋object 兩側都算；同名並列取名字序穩定輸出）
    db.prepare(
      `${withLib} SELECT name, COUNT(*) AS degree FROM (
           SELECT subject AS name FROM lib UNION ALL SELECT object AS name FROM lib)
         WHERE name IS NOT NULL GROUP BY name ORDER BY degree DESC, name ASC LIMIT ?`
    ).bind(...baseParams, topN).all(),
    // predicate 分布＝庫的「性格」（spec §3 relation_profile）
    db.prepare(
      `${withLib} SELECT predicate, COUNT(*) AS n FROM lib
         WHERE predicate IS NOT NULL GROUP BY predicate ORDER BY n DESC, predicate ASC LIMIT 100`
    ).bind(...baseParams).all(),
    // bridges＝本庫 entity 同時出現在其他庫（跨庫 join）。對面那側只能靠 library slot 標記值
    //（source_prefix 只描述本庫的前綴，無法反推他庫）→ M3 backfill 前 bridges 會偏稀疏，誠實現況。
    db.prepare(
      `${withLib}, labeled AS (
           SELECT DISTINCT name, library FROM (
             SELECT subject AS name, library FROM t WHERE COALESCE(status,'active') = 'active'
             UNION SELECT object AS name, library FROM t WHERE COALESCE(status,'active') = 'active')
           WHERE name IS NOT NULL AND library IS NOT NULL AND library != ?),
         mine AS (
           SELECT DISTINCT subject AS name FROM lib WHERE subject IS NOT NULL
           UNION SELECT DISTINCT object AS name FROM lib WHERE object IS NOT NULL)
         SELECT l.name AS entity, l.library AS library FROM labeled l
         JOIN mine m ON m.name = l.name ORDER BY l.name ASC, l.library ASC`
    ).bind(...baseParams, library).all()
  ]);
  const tripletCount = countRow?.n ?? 0;
  const topEntities = (topRes.results ?? []).map((r) => ({ name: r.name, degree: r.degree }));
  const relationProfile = (relRes.results ?? []).map((r) => ({ predicate: r.predicate, count: r.n }));
  const bridgeMap = /* @__PURE__ */ new Map();
  for (const r of bridgeRes.results ?? []) {
    if (!bridgeMap.has(r.entity) && bridgeMap.size >= 50) continue;
    const libs = bridgeMap.get(r.entity) ?? [];
    if (!libs.includes(r.library)) libs.push(r.library);
    bridgeMap.set(r.entity, libs);
  }
  const bridges = [...bridgeMap.entries()].map(([entity, libraries]) => ({ entity, libraries }));
  let narrative = input.narrative?.trim();
  if (!narrative) {
    const prev = await getLibraryMapDetail(db, library, owner);
    narrative = prev?.narrative?.trim() || "";
  }
  const coreNames = topEntities.slice(0, 3).map((t) => t.name);
  const content = `${library}\uFF1A${narrative || "\uFF08narrative \u5F85 ingest \u88DC\u5BEB\uFF09"}\u3002\u6838\u5FC3\uFF1A${coreNames.length ? coreNames.join("\u3001") : "\uFF08\u5C1A\u7121 entities\uFF09"}`;
  const blockEntry = await createEntry(db, {
    content,
    entry_type: "block",
    owner_id: owner ?? null,
    page_name: `library-map:${library}`,
    metadata_json: JSON.stringify({ kind: "library_map", library })
  });
  const values = {
    library,
    narrative,
    top_entities: JSON.stringify(topEntities),
    relation_profile: JSON.stringify(relationProfile),
    bridges: JSON.stringify(bridges),
    triplet_count: String(tripletCount),
    status: "active"
  };
  if (input.commit_hash) values.commit_hash = input.commit_hash;
  await createRecord(db, {
    template: LIBRARY_MAP_TEMPLATE_NAME,
    record_id: blockEntry.id,
    values,
    owner_id: owner ?? null
  });
  const mapTpl = await getTemplate(db, LIBRARY_MAP_TEMPLATE_NAME);
  const oldParams = owner ? [mapTpl.id, owner, library, blockEntry.id] : [mapTpl.id, library, blockEntry.id];
  const oldRes = await db.prepare(
    `WITH m AS (${mapPivotSql(!!owner)})
       SELECT rid FROM m WHERE m.library = ? AND COALESCE(m.status, 'active') = 'active' AND m.rid != ?`
  ).bind(...oldParams).all();
  const superseded = [];
  for (const row of oldRes.results ?? []) {
    await updateRecord(db, row.rid, { status: "superseded" });
    superseded.push(row.rid);
  }
  return {
    map: {
      record_id: blockEntry.id,
      library,
      narrative: narrative || null,
      content,
      top_entities: topEntities,
      relation_profile: relationProfile,
      bridges,
      triplet_count: tripletCount,
      commit_hash: input.commit_hash ?? null,
      status: "active",
      updated_at: blockEntry.created_at
    },
    superseded,
    triplet_template: tripletTemplateName,
    triplet_library_slot_added: librarySlotAdded
  };
}
async function liveTripletCountsByLibrary(db, tripletTemplateId, owner_id) {
  const params = owner_id ? [tripletTemplateId, owner_id] : [tripletTemplateId];
  const res = await db.prepare(
    `SELECT COALESCE(NULLIF(lib_e.content, ''), 'general') AS library, COUNT(*) AS n
       FROM (
         SELECT DISTINCT ev.record_id
         FROM entry_values ev JOIN entries e ON ev.entry_id = e.id
         WHERE ev.template_id = ?${owner_id ? " AND e.owner_id = ?" : ""}
       ) AS tr
       LEFT JOIN entry_values lev ON lev.record_id = tr.record_id AND lev.slot_name = 'library'
       LEFT JOIN entries lib_e ON lib_e.id = lev.entry_id
       GROUP BY COALESCE(NULLIF(lib_e.content, ''), 'general')`
  ).bind(...params).all();
  const m = /* @__PURE__ */ new Map();
  for (const r of res.results ?? []) m.set(r.library, r.n);
  return m;
}
async function knownLibraryNames(db, owner_id) {
  const names = /* @__PURE__ */ new Set();
  const entryParams = owner_id ? [owner_id] : [];
  const entryRows = await db.prepare(
    `SELECT DISTINCT json_extract(metadata_json, '$.library') AS library FROM entries
       WHERE ${owner_id ? "owner_id = ?" : "1=1"} AND json_extract(metadata_json, '$.library') IS NOT NULL`
  ).bind(...entryParams).all();
  for (const r of entryRows.results ?? []) if (r.library) names.add(r.library);
  const libTpl = await getTemplate(db, "portal_library");
  if (libTpl) {
    const libParams = owner_id ? [libTpl.id, owner_id] : [libTpl.id];
    const libRows = await db.prepare(
      `SELECT MAX(CASE WHEN ev.slot_name = 'name' THEN e.content END) AS name
         FROM entry_values ev JOIN entries e ON ev.entry_id = e.id
         WHERE ev.template_id = ?${owner_id ? " AND e.owner_id = ?" : ""}
         GROUP BY ev.record_id`
    ).bind(...libParams).all();
    for (const r of libRows.results ?? []) if (r.name) names.add(r.name);
  }
  return names;
}
async function ensureFreshLibraryMaps(db, owner_id, tripletTemplateName = DEFAULT_TRIPLET_TEMPLATE) {
  const tripletTpl = await getTemplate(db, tripletTemplateName);
  if (!tripletTpl) return;
  const [liveCounts, cached, known] = await Promise.all([
    liveTripletCountsByLibrary(db, tripletTpl.id, owner_id),
    listLibraryMaps(db, owner_id),
    knownLibraryNames(db, owner_id)
  ]);
  const cachedByLib = new Map(cached.map((m) => [m.library, m]));
  const stale = /* @__PURE__ */ new Set();
  for (const [library, count] of liveCounts) {
    const c = cachedByLib.get(library);
    if (!c || c.triplet_count !== count) stale.add(library);
  }
  for (const name of known) {
    if (!liveCounts.has(name) && !cachedByLib.has(name)) stale.add(name);
  }
  await Promise.all(
    [...stale].map(
      (library) => recomputeLibraryMap(db, { library, owner_id, triplet_template: tripletTemplateName }).catch(() => {
      })
    )
  );
}
async function listLibraryMaps(db, owner_id) {
  const tpl = await getTemplate(db, LIBRARY_MAP_TEMPLATE_NAME);
  if (!tpl) return [];
  const params = owner_id ? [tpl.id, owner_id] : [tpl.id];
  const res = await db.prepare(
    `WITH m AS (${mapPivotSql(!!owner_id)})
       SELECT * FROM m WHERE COALESCE(m.status, 'active') = 'active' AND m.library IS NOT NULL
       ORDER BY m.ts DESC`
  ).bind(...params).all();
  const byLib = /* @__PURE__ */ new Map();
  for (const r of res.results ?? []) {
    if (!r.library || byLib.has(r.library)) continue;
    byLib.set(r.library, {
      library: r.library,
      narrative: r.narrative || null,
      top_entities: parseJsonArray(r.top_entities).slice(0, 3).map((t) => t.name),
      triplet_count: Number(r.triplet_count ?? 0) || 0,
      updated_at: r.ts
    });
  }
  return [...byLib.values()].sort((a, b) => a.library.localeCompare(b.library));
}
async function getLibraryMapDetail(db, library, owner_id) {
  const tpl = await getTemplate(db, LIBRARY_MAP_TEMPLATE_NAME);
  if (!tpl) return null;
  const params = owner_id ? [tpl.id, owner_id, library] : [tpl.id, library];
  const row = await db.prepare(
    `WITH m AS (${mapPivotSql(!!owner_id)})
       SELECT * FROM m WHERE m.library = ? AND COALESCE(m.status, 'active') = 'active'
       ORDER BY m.ts DESC LIMIT 1`
  ).bind(...params).first();
  if (!row) return null;
  const blockEntry = await getEntry(db, row.rid);
  return {
    record_id: row.rid,
    library,
    narrative: row.narrative || null,
    content: blockEntry?.content ?? null,
    top_entities: parseJsonArray(row.top_entities),
    relation_profile: parseJsonArray(row.relation_profile),
    bridges: parseJsonArray(row.bridges),
    triplet_count: Number(row.triplet_count ?? 0) || 0,
    commit_hash: row.commit_hash || null,
    status: row.status ?? "active",
    updated_at: row.ts
  };
}

// ../../matrix/arcrun/kbdb/src/routes/map.ts
var mapRoutes = new Hono2();
mapRoutes.post("/recompute", async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const library = c.req.query("library") || (typeof body.library === "string" ? body.library : "");
  if (!library || !library.trim()) return c.json({ success: false, error: "library required" }, 400);
  try {
    const result = await recomputeLibraryMap(c.env.DB, {
      library,
      narrative: typeof body.narrative === "string" ? body.narrative : void 0,
      commit_hash: typeof body.commit_hash === "string" ? body.commit_hash : void 0,
      owner_id: typeof body.owner_id === "string" ? body.owner_id : c.req.query("owner_id") || void 0,
      source_prefix: typeof body.source_prefix === "string" ? body.source_prefix : void 0,
      triplet_template: typeof body.triplet_template === "string" ? body.triplet_template : void 0,
      top_n: typeof body.top_n === "number" ? body.top_n : void 0
    });
    return c.json({ success: true, ...result });
  } catch (e) {
    return c.json({ success: false, error: e instanceof Error ? e.message : String(e) }, 400);
  }
});
mapRoutes.get("/", async (c) => {
  const owner = c.req.query("owner_id") || void 0;
  await ensureFreshLibraryMaps(c.env.DB, owner).catch(() => {
  });
  const libraries = await listLibraryMaps(c.env.DB, owner);
  return c.json({ success: true, libraries, count: libraries.length });
});
mapRoutes.get("/:library", async (c) => {
  const owner = c.req.query("owner_id") || void 0;
  const library = c.req.param("library");
  await ensureFreshLibraryMaps(c.env.DB, owner).catch(() => {
  });
  const map = await getLibraryMapDetail(c.env.DB, library, owner);
  if (!map) return c.json({ success: false, error: "not found" }, 404);
  return c.json({ success: true, map });
});

// ../../matrix/arcrun/kbdb/src/actions/execution-log.ts
var SUCCESS_MESSAGE_MAX = 200;
var FAILED_MESSAGE_MAX = 2e3;
var TARGET_MAX = 300;
var DEFAULT_DAILY_LIMIT = 2e4;
var DEGRADE_RATIO = 0.8;
function dailyLimit(env) {
  const raw2 = env.EXECUTION_LOG_DAILY_WRITE_LIMIT;
  const n = raw2 ? parseInt(raw2, 10) : NaN;
  return Number.isFinite(n) && n > 0 ? n : DEFAULT_DAILY_LIMIT;
}
function utcDay() {
  return (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
}
function truncate(s, max) {
  if (s.length <= max) return s;
  return s.slice(0, Math.max(0, max - 1)) + "\u2026";
}
async function checkUsage(db, limit) {
  const id = `exlog-usage:${utcDay()}`;
  const existing = await db.prepare("SELECT metadata_json FROM entries WHERE id = ?").bind(id).first();
  let count;
  if (existing) {
    let prevWrites = 0;
    try {
      const prev = existing.metadata_json ? JSON.parse(existing.metadata_json) : {};
      prevWrites = Number(prev.writes) || 0;
    } catch {
      prevWrites = 0;
    }
    count = prevWrites + 1;
    await db.prepare("UPDATE entries SET metadata_json = ?, updated_at = unixepoch() WHERE id = ?").bind(JSON.stringify({ day: utcDay(), writes: count }), id).run();
  } else {
    count = 1;
    await db.prepare(`INSERT INTO entries (id, entry_type, metadata_json) VALUES (?, 'execution_log_usage', ?)`).bind(id, JSON.stringify({ day: utcDay(), writes: count })).run();
  }
  if (count > limit) return "skip";
  if (count > limit * DEGRADE_RATIO) return "log_failure_only";
  return "log";
}
async function recordExecutionLog(db, env, input) {
  const limit = dailyLimit(env);
  let mode;
  try {
    mode = await checkUsage(db, limit);
  } catch {
    mode = "log";
  }
  if (mode === "skip") return { written: false, mode };
  if (mode === "log_failure_only" && input.verdict !== "failed") return { written: false, mode };
  const maxLen = input.verdict === "failed" ? FAILED_MESSAGE_MAX : SUCCESS_MESSAGE_MAX;
  const target = input.target ? truncate(String(input.target), TARGET_MAX) : null;
  await createEntry(db, {
    entry_type: "execution_log",
    owner_id: input.owner_id ?? null,
    page_name: input.workflow_id,
    // 索引欄位（idx_entries_page）＝查詢鍵，讀取端靠它篩單一 workflow
    content: truncate(input.message ?? "", maxLen),
    metadata_json: JSON.stringify({
      verdict: input.verdict,
      duration_ms: Math.max(0, Math.round(input.duration_ms)),
      target
    })
  });
  return { written: true, mode };
}
async function listExecutionLog(db, workflowId, ownerId, limit) {
  const { entries } = await listEntries(db, {
    entry_type: "execution_log",
    page_name: workflowId,
    owner_id: ownerId,
    limit
  });
  return entries.map((e) => {
    let meta = {};
    try {
      meta = e.metadata_json ? JSON.parse(e.metadata_json) : {};
    } catch {
    }
    return {
      workflow_id: workflowId,
      verdict: meta.verdict ?? "unknown",
      duration_ms: meta.duration_ms ?? 0,
      message: e.content ?? "",
      ...meta.target ? { target: meta.target } : {},
      recorded_at: e.created_at
    };
  });
}
async function latestExecutionLog(db, workflowId, ownerId) {
  const rows = await listExecutionLog(db, workflowId, ownerId, 1);
  return rows[0] ?? null;
}

// ../../matrix/arcrun/kbdb/src/routes/execution-log.ts
var executionLogRoutes = new Hono2();
executionLogRoutes.post("/record", async (c) => {
  const body = await c.req.json().catch(() => null);
  if (!body || !body.workflow_id || body.verdict !== "success" && body.verdict !== "failed") {
    return c.json({ success: false, error: 'workflow_id \u8207 verdict("success"|"failed") \u5FC5\u586B' }, 400);
  }
  const result = await recordExecutionLog(c.env.DB, c.env, {
    workflow_id: body.workflow_id,
    owner_id: body.owner_id ?? null,
    verdict: body.verdict,
    duration_ms: typeof body.duration_ms === "number" ? body.duration_ms : 0,
    message: body.message ?? "",
    target: body.target ?? null
  });
  return c.json({ success: true, ...result });
});
executionLogRoutes.get("/", async (c) => {
  const workflowId = c.req.query("workflow_id");
  if (!workflowId) return c.json({ success: false, error: "workflow_id \u5FC5\u586B" }, 400);
  const ownerId = c.req.query("owner_id") || void 0;
  const limitParam = c.req.query("limit");
  const limit = Math.min(Math.max(parseInt(limitParam || "10", 10) || 10, 1), 100);
  const executions = await listExecutionLog(c.env.DB, workflowId, ownerId, limit);
  return c.json({ success: true, executions });
});
executionLogRoutes.get("/latest", async (c) => {
  const workflowId = c.req.query("workflow_id");
  if (!workflowId) return c.json({ success: false, error: "workflow_id \u5FC5\u586B" }, 400);
  const ownerId = c.req.query("owner_id") || void 0;
  const execution = await latestExecutionLog(c.env.DB, workflowId, ownerId);
  return c.json({ success: true, execution });
});

// ../../matrix/arcrun/kbdb/src/index.ts
var app = new Hono2();
app.use("*", async (c, next) => {
  const path = new URL(c.req.url).pathname;
  if (path === "/" || path === "/health") return next();
  const token = c.env.KBDB_INTERNAL_TOKEN;
  if (!token) {
    console.warn("[kbdb] KBDB_INTERNAL_TOKEN \u672A\u8A2D\u5B9A\u2014\u2014\u5168\u90E8\u8ACB\u6C42\u62D2\u7D55\uFF0C\u8ACB\u91CD\u8DD1\u5B89\u88DD\u5668\u4EE5\u6CE8\u5165\u91D1\u9470");
    return c.json({ error: "Unauthorized", detail: "kbdb \u5C1A\u672A\u8A2D\u5B9A\u5167\u90E8\u91D1\u9470\uFF0C\u8ACB\u91CD\u8DD1\u5B89\u88DD\u5668" }, 401);
  }
  const auth = c.req.header("Authorization");
  if (!auth || auth !== `Bearer ${token}`) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  return next();
});
app.get("/", (c) => c.json({ service: "arcrun-kbdb", tier: "base", status: "ok" }));
app.get("/health", (c) => c.json({ ok: true }));
app.route("/entries", entryRoutes);
app.route("/templates", templateRoutes);
app.route("/records", recordRoutes);
app.route("/recipe-stats", recipeStatRoutes);
app.route("/execution-log", executionLogRoutes);
app.route("/embed", embedRoutes);
app.route("/map", mapRoutes);
var index_default = app;
export {
  index_default as default
};
