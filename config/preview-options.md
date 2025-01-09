# 프리뷰 옵션 {#preview-options}

별도로 명시되지 않은 한, 이 섹션의 옵션들은 프리뷰에만 적용됩니다.

## preview.host {#preview-host}

- **타입:** `string | boolean`
- **기본값:** [`server.host`](./server-options#server-host)

어떤 IP 주소를 대상으로 서버가 수신 대기(Listen)하는지 지정합니다.
`0.0.0.0` 또는 `true`로 설정된 경우 LAN 및 공용 주소를 포함한 모든 주소를 대상으로 합니다.

CLI의 경우 `--host 0.0.0.0` 또는 `--host`로 지정이 가능합니다.

::: tip 참고

Vite 대신 다른 서버가 응답하는 경우가 있습니다.
이에 대해서는 [`server.host`](./server-options#server-host)를 참고해주세요.

:::

## preview.port {#preview-port}

- **타입:** `number`
- **기본값:** `4173`

서버의 포트를 지정합니다. 포트가 이미 사용 중이면 Vite가 자동으로 사용 가능한 다음 포트로 설정되기에 실제 서버 포트가 아닐 수 있습니다.

**예제:**

```js
export default defineConfig({
  server: {
    port: 3030
  },
  preview: {
    port: 8080
  }
})
```

## preview.strictPort {#preview-strictport}

- **타입:** `boolean`
- **기본값:** [`server.strictPort`](./server-options#server-strictport)

`true`로 설정한 경우, 포트가 이미 사용 중일 때 자동으로 다른 포트로 설정을 시도하지 않고 종료되도록 합니다.

## preview.https {#preview-https}

- **타입:** `https.ServerOptions`
- **기본값:** [`server.https`](./server-options#server-https)

TLS + HTTP/2를 활성화합니다. [`server.proxy`](./server-options#server-proxy) 옵션이 함께 사용되는 경우에만 TLS로 다운그레이드됩니다.

참고로 이 값은 `https.createServer()`에 전달된 [옵션 객체](https://nodejs.org/api/https.html#https_https_createserver_options_requestlistener)가 될 수도 있습니다.

## preview.open {#preview-open}

- **타입:** `boolean | string`
- **기본값:** [`server.open`](./server-options#server-open)

서버 시작 시 자동으로 브라우저를 열도록 설정할 수 있습니다. 값이 문자열인 경우 URL 경로를 의미하며, 원하는 특정 브라우저를 열고자 하는 경우에는 `process.env.BROWSER` 환경 변수를 `firefox`와 같은 값으로 설정하면 됩니다. `process.env.BROWSER_ARGS` 환경 변수를 통해 추가적인 인자를 전달할 수도 있습니다(예: `--incognito`).

`BROWSER`와 `BROWSER_ARGS`는 `.env` 파일에서 설정할 수 있는 특별한 환경 변수입니다. 자세한 내용은 [`open` 패키지](https://github.com/sindresorhus/open#app)를 참고해주세요.

## preview.proxy {#preview-proxy}

- **타입:** `Record<string, string | ProxyOptions>`
- **기본값:** [`server.proxy`](./server-options#server-proxy)

프리뷰 서버에 대한 커스텀 프락시 규칙을 설정할 수 있습니다. `{ key: options }` 형태로 구성되며, 키값이 `^`로 시작하는 경우 `RegExp`로 해석됩니다. `configure` 옵션을 사용하여 프락시 인스턴스에 접근할 수 있습니다.

이는 [`http-proxy`](https://github.com/http-party/node-http-proxy)를 사용하며, 더 많은 옵션은 [이 링크](https://github.com/http-party/node-http-proxy#options)를 참고해주세요.

## preview.cors {#preview-cors}

- **타입:** `boolean | CorsOptions`
- **기본값:** [`server.cors`](./server-options#server-cors)

프리뷰 서버에 대한 CORS를 구성합니다. 기본적으로 활성화 되어 있는 옵션이며, 모든 출처를 허용하고 있습니다. 이를 설정하기 위해서는 [옵션 객체](https://github.com/expressjs/cors#configuration-options)를 전달하고, 비활성화하고자 한다면 `false` 값으로 설정해주세요.

## preview.headers {#preview-headers}

- **타입:** `OutgoingHttpHeaders`

서버 응답 헤더를 지정합니다.