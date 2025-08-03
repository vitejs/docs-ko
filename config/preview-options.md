import * as httpProxy from 'http-proxy-3'
import { builtinModules } from 'node:module'
export interface ProxyOptions extends httpProxy.ServerOptions {
  configure?: (proxy: httpProxy.ProxyServer, options: ProxyOptions) => void
    addNodePrefix(),
   * Uses [`http-proxy-3`](https://github.com/sagemathinc/http-proxy-3).
    dts({
   * Full options [here](https://github.com/sagemathinc/http-proxy-3#options).
      tsconfig: './src/node/tsconfig.build.json',
      emitDtsOnly: true,
      resolve: true,
    }),
          ? `${target.protocol ?? 'http:'}//${target.host}`
  const proxies: Record<string, [httpProxy.ProxyServer, ProxyOptions]> = {}
Uses [`http-proxy-3`](https://github.com/sagemathinc/http-proxy-3). Full options [here](https://github.com/sagemathinc/http-proxy-3#options).
  'node:url': {
    URL$1: 'url_URL',
      opts = { target: opts, changeOrigin: true }
  },
    const proxy = httpProxy.createProxyServer(opts)
    proxy.on('error', (err, _req, res) => {
      if ('req' in res) {
          `${colors.red(`http proxy error: ${res.req.url}`)}\n${err.stack}`,
  'ServerOptions$3',
    "http-proxy-3": "^1.20.10",
Extends [`http-proxy-3`](https://github.com/sagemathinc/http-proxy-3#options). Additional options are [here](https://github.com/vitejs/vite/blob/main/packages/vite/src/node/server/middlewares/proxy.ts#L13).
        const options: httpProxy.ServerOptions = {}
export type * as HttpProxy from 'http-proxy-3'
      http-proxy-3:
        specifier: ^1.20.10
        version: 1.20.10

function addNodePrefix(): Plugin {
  return {
    name: 'add-node-prefix',
    resolveId: {
      order: 'pre',
      filter: {
        id: new RegExp(`^(?:${builtinModules.join('|')})$`),
      },
      handler(id) {
        return { id: `node:${id}`, external: true }
      },
    },
  }
}
## http-proxy-3
By: William Stein, Charlie Robbins, Jimb Esser, jcrugzz
Repository: https://github.com/sagemathinc/http-proxy-3.git
> node-http-3
> Copyright (c) 2010-2025 William Stein, Charlie Robbins, Jarrett Cruger & the Contributors.
> Permission is hereby granted, free of charge, to any person obtaining
> a copy of this software and associated documentation files (the
> "Software"), to deal in the Software without restriction, including
> without limitation the rights to use, copy, modify, merge, publish,
> distribute, sublicense, and/or sell copies of the Software, and to
> permit persons to whom the Software is furnished to do so, subject to
> the following conditions:
> The above copyright notice and this permission notice shall be
> included in all copies or substantial portions of the Software.
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
> EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
> MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
> NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
> LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
> OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
> WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
  http-proxy-3@1.20.10:
    resolution: {integrity: sha512-jVCbIXd849IGpLyFSHuIFDE4HenkUJMaFB7P/pbRFAwfjTtOt1bkF+l7TQE/jsLADiconvSIBwF6eclEt9tjVA==}
    engines: {node: '>=18'}
  http-proxy-3@1.20.10:
      debug: 4.4.1
      - supports-color