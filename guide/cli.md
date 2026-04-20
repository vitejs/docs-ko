# 커맨드 라인 인터페이스 {#command-line-interface}

## 개발 서버 {#dev-server}

### `vite` {#vite}

현재 디렉토리에서 Vite 개발 서버를 시작합니다. `vite dev` 및 `vite serve`는 `vite`의 별칭입니다.

#### 사용 방법 {#usage}

```bash
vite [root]
```

#### 옵션 {#options}

| 옵션                      |                                                                                                                                                                       |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--host [host]`           | 호스트 이름 지정 (`string`)                                                                                                                                           |
| `--port <port>`           | 포트 번호 지정 (`number`)                                                                                                                                             |
| `--open [path]`           | 시작 시 브라우저 열기 (`boolean \| string`)                                                                                                                           |
| `--cors`                  | CORS 활성화 (`boolean`)                                                                                                                                               |
| `--strictPort`            | 포트가 이미 사용중인 경우 종료 (`boolean`)                                                                                                                            |
| `--force`                 | 캐시를 무시하고 다시 번들링 (`boolean`)                                                                                                                               |
| `-c, --config <file>`     | 설정 파일 지정 (`string`)                                                                                                                                             |
| `--base <path>`           | `base` 옵션 위치 지정 (기본값: `/`) (`string`)                                                                                                                        |
| `-l, --logLevel <level>`  | info \| warn \| error \| silent (`string`)                                                                                                                            |
| `--clearScreen`           | 로깅 시 화면을 지우는 것을 허용/비허용 (`boolean`)                                                                                                                    |
| `--configLoader <loader>` | esbuild로 설정을 번들링하려면 `bundle`을, 실시간으로 처리하려면 `runner`(실험적 기능)를, 네이티브 런타임을 사용하려면 `native`(실험적 기능)을 전달 (기본값: `bundle`) |
| `--profile`               | 빌트인 Node.js 인스펙터 실행 ([성능 병목현상](/guide/troubleshooting#performance-bottlenecks) 참고)                                                                   |
| `-d, --debug [feat]`      | 디버그 로그 표시 (`string \| boolean`)                                                                                                                                |
| `-f, --filter <filter>`   | 디버그 로그 필터 (`string`)                                                                                                                                           |
| `-m, --mode <mode>`       | env 모드 설정 (`string`)                                                                                                                                              |
| `-h, --help`              | 사용 가능한 CLI 옵션 표시                                                                                                                                             |
| `-v, --version`           | 버전 표시                                                                                                                                                             |

## 빌드 {#build}

### `vite build` {#vite-build}

프로덕션 빌드를 위한 명령어입니다.

#### 사용 방법 {#usage-1}

```bash
vite build [root]
```

#### 옵션 {#options-1}

| Options                        |                                                                                                                          |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| `--target <target>`            | Transpile target (default: `"baseline-widely-available"`) (`string`)                                                     |
| `--outDir <dir>`               | Output directory (default: `dist`) (`string`)                                                                            |
| `--assetsDir <dir>`            | Directory under outDir to place assets in (default: `"assets"`) (`string`)                                               |
| `--assetsInlineLimit <number>` | Static asset base64 inline threshold in bytes (default: `4096`) (`number`)                                               |
| `--ssr [entry]`                | Build specified entry for server-side rendering (`string`)                                                               |
| `--sourcemap [output]`         | Output source maps for build (default: `false`) (`boolean \| "inline" \| "hidden"`)                                      |
| `--minify [minifier]`          | Enable/disable minification, or specify minifier to use (default: `"oxc"`) (`boolean \| "oxc" \| "terser" \| "esbuild"`) |
| `--manifest [name]`            | Emit build manifest json (`boolean \| string`)                                                                           |
| `--ssrManifest [name]`         | Emit ssr manifest json (`boolean \| string`)                                                                             |
| `--emptyOutDir`                | Force empty outDir when it's outside of root (`boolean`)                                                                 |
| `-w, --watch`                  | Rebuilds when modules have changed on disk (`boolean`)                                                                   |
| `-c, --config <file>`          | Use specified config file (`string`)                                                                                     |
| `--base <path>`                | Public base path (default: `/`) (`string`)                                                                               |
| `-l, --logLevel <level>`       | Info \| warn \| error \| silent (`string`)                                                                               |
| `--clearScreen`                | Allow/disable clear screen when logging (`boolean`)                                                                      |
| `--configLoader <loader>`      | Use `bundle` to bundle the config with Rolldown or `runner` (experimental) to process it on the fly (default: `bundle`)  |
| `--profile`                    | Start built-in Node.js inspector (check [Performance bottlenecks](/guide/troubleshooting#performance-bottlenecks))       |
| `-d, --debug [feat]`           | Show debug logs (`string \| boolean`)                                                                                    |
| `-f, --filter <filter>`        | Filter debug logs (`string`)                                                                                             |
| `-m, --mode <mode>`            | Set env mode (`string`)                                                                                                  |
| `-h, --help`                   | Display available CLI options                                                                                            |
| `--app`                        | Build all environments, same as `builder: {}` (`boolean`, experimental)                                                  |

## 기타 {#others}

### `vite optimize` {#vite-optimize}

디펜던시를 미리 번들링합니다.

**사용 중단**: 사전 번들링은 자동으로 실행되며, 명시적으로 실행할 필요가 없습니다.

#### 사용 방법 {#usage-2}

```bash
vite optimize [root]
```

#### 옵션 {#options-2}

| Options                   |                                                                                                                 |
| ------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `--force`                 | 캐시를 무시하고 다시 번들링 (`boolean`)                                                                         |
| `-c, --config <file>`     | 설정 파일 지정 (`string`)                                                                                       |
| `--base <path>`           | `base` 옵션 위치 지정 (기본값: `/`) (`string`)                                                                  |
| `-l, --logLevel <level>`  | Info \| warn \| error \| silent (`string`)                                                                      |
| `--clearScreen`           | 로깅 시 화면을 지우는 것을 허용/비허용 (`boolean`)                                                              |
| `--configLoader <loader>` | esbuild로 설정을 번들링하려면 `bundle`을, 실시간으로 처리하려면 `runner`(실험적 기능)를 사용 (기본값: `bundle`) |
| `-d, --debug [feat]`      | 디버그 로그 표시 (`string \| boolean`)                                                                          |
| `-f, --filter <filter>`   | 디버그 로그 필터 (`string`)                                                                                     |
| `-m, --mode <mode>`       | env 모드 설정 (`string`)                                                                                        |
| `-h, --help`              | 사용 가능한 CLI 옵션 표시                                                                                       |

### `vite preview` {#vite-preview}

프로덕션 빌드를 로컬에서 미리 봅니다. 프로덕션 서버용으로 설계되지 않았기에 프로덕션 서버로 사용하면 안 됩니다.

This command starts a server in the build directory (by default `dist`). Run `vite build` beforehand to ensure that the build directory is up-to-date. Depending on the project's configured [`appType`](/config/shared-options#apptype), it makes use of certain middleware.

#### 사용 방법 {#usage-3}

```bash
vite preview [root]
```

#### 옵션 {#options-3}

| Options                   |                                                                                                                 |
| ------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `--host [host]`           | 호스트 이름 지정 (`string`)                                                                                     |
| `--port <port>`           | 포트 번호 지정 (`number`)                                                                                       |
| `--strictPort`            | 포트가 이미 사용중인 경우 종료 (`boolean`)                                                                      |
| `--open [path]`           | 시작 시 브라우저 열기 (`boolean \| string`)                                                                     |
| `--outDir <dir>`          | 빌드 결과 디렉터리 지정 (기본값: `dist`)(`string`)                                                              |
| `-c, --config <file>`     | 설정 파일 지정 (`string`)                                                                                       |
| `--base <path>`           | `base` 옵션 위치 지정 (기본값: `/`) (`string`)                                                                  |
| `-l, --logLevel <level>`  | Info \| warn \| error \| silent (`string`)                                                                      |
| `--clearScreen`           | 로깅 시 화면을 지우는 것을 허용/비허용 (`boolean`)                                                              |
| `--configLoader <loader>` | esbuild로 설정을 번들링하려면 `bundle`을, 실시간으로 처리하려면 `runner`(실험적 기능)를 사용 (기본값: `bundle`) |
| `-d, --debug [feat]`      | 디버그 로그 표시 (`string \| boolean`)                                                                          |
| `-f, --filter <filter>`   | 디버그 로그 필터 (`string`)                                                                                     |
| `-m, --mode <mode>`       | env 모드 설정 (`string`)                                                                                        |
| `-h, --help`              | 사용 가능한 CLI 옵션 표시                                                                                       |