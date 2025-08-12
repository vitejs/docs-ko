# 커맨드 라인 인터페이스 {#command-line-interface}

## 개발 서버 {#dev-server}

### `vite` {#vite}

현재 디렉토리에서 Vite 개발 서버를 시작합니다. `vite dev` 및 `vite serve`는 `vite`의 별칭입니다.

#### 사용 방법 {#usage}

```bash
vite [root]
```

#### 옵션 {#options}

| Options                   |                                                                                                                                                                                      |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `--host [host]`           | Specify hostname (`string`)                                                                                                                                                          |
| `--port <port>`           | Specify port (`number`)                                                                                                                                                              |
| `--open [path]`           | Open browser on startup (`boolean \| string`)                                                                                                                                        |
| `--cors`                  | Enable CORS (`boolean`)                                                                                                                                                              |
| `--strictPort`            | Exit if specified port is already in use (`boolean`)                                                                                                                                 |
| `--force`                 | Force the optimizer to ignore the cache and re-bundle (`boolean`)                                                                                                                    |
| `-c, --config <file>`     | Use specified config file (`string`)                                                                                                                                                 |
| `--base <path>`           | Public base path (default: `/`) (`string`)                                                                                                                                           |
| `-l, --logLevel <level>`  | info \| warn \| error \| silent (`string`)                                                                                                                                           |
| `--clearScreen`           | Allow/disable clear screen when logging (`boolean`)                                                                                                                                  |
| `--configLoader <loader>` | Use `bundle` to bundle the config with esbuild, or `runner` (experimental) to process it on the fly, or `native` (experimental) to load using the native runtime (default: `bundle`) |
| `--profile`               | Start built-in Node.js inspector (check [Performance bottlenecks](/guide/troubleshooting#performance-bottlenecks))                                                                   |
| `-d, --debug [feat]`      | Show debug logs (`string \| boolean`)                                                                                                                                                |
| `-f, --filter <filter>`   | Filter debug logs (`string`)                                                                                                                                                         |
| `-m, --mode <mode>`       | Set env mode (`string`)                                                                                                                                                              |
| `-h, --help`              | Display available CLI options                                                                                                                                                        |
| `-v, --version`           | Display version number                                                                                                                                                               |

## 빌드 {#build}

### `vite build` {#vite-build}

프로덕션 빌드를 위한 명령어입니다.

#### 사용 방법 {#usage-1}

```bash
vite build [root]
```

#### 옵션 {#options-1}

| Options                        |                                                                                                                       |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| `--target <target>`            | 트랜스파일 대상 (기본값: `"modules"`) (`string`)                                                                      |
| `--outDir <dir>`               | 빌드 결과 디렉터리 지정 (기본값: `dist`) (`string`)                                                                   |
| `--assetsDir <dir>`            | outDir 내부의 에셋이 위치할 디렉터리 (기본값: `"assets"`) (`string`)                                                  |
| `--assetsInlineLimit <number>` | base64로 인라인되는 에셋의 바이트 임계값 (기본값: `4096`) (`number`)                                                  |
| `--ssr [entry]`                | 지정된 엔트리를 서버 사이드 렌더링을 위해 빌드 (`string`)                                                             |
| `--sourcemap [output]`         | 빌드에 소스 맵 포함 (기본값: `false`) (`boolean \| "inline" \| "hidden"`)                                             |
| `--minify [minifier]`          | minify 옵션을 활성화/비활성화하거나 사용할 minifier를 지정 (기본값: `"esbuild"`) (`boolean \| "terser" \| "esbuild"`) |
| `--manifest [name]`            | 빌드 매니페스트 JSON 내보내기 (`boolean \| string`)                                                                   |
| `--ssrManifest [name]`         | SSR 매니페스트 JSON 내보내기 (`boolean \| string`)                                                                    |
| `--emptyOutDir`                | outDir가 프로젝트 루트 밖에 있을 때 강제로 outDir 디렉터리를 비우기 (`boolean`)                                       |
| `-w, --watch`                  | 디스크의 모듈이 변경되면 다시 빌드 (`boolean`)                                                                        |
| `-c, --config <file>`          | 설정 파일 지정 (`string`)                                                                                             |
| `--base <path>`                | `base` 옵션 위치 지정 (기본값: `/`) (`string`)                                                                        |
| `-l, --logLevel <level>`       | Info \| warn \| error \| silent (`string`)                                                                            |
| `--clearScreen`                | 로깅 시 화면을 지우는 것을 허용/비허용 (`boolean`)                                                                    |
| `--configLoader <loader>`      | esbuild로 설정을 번들링하려면 `bundle`을, 실시간으로 처리하려면 `runner`(실험적 기능)를 사용 (기본값: `bundle`)       |
| `--profile`                    | 빌트인 Node.js 인스펙터 실행 ([성능 병목현상](/guide/troubleshooting#performance-bottlenecks) 참고)                   |
| `-d, --debug [feat]`           | 디버그 로그 표시 (`string \| boolean`)                                                                                |
| `-f, --filter <filter>`        | 디버그 로그 필터 (`string`)                                                                                           |
| `-m, --mode <mode>`            | env 모드 설정 (`string`)                                                                                              |
| `-h, --help`                   | 사용 가능한 CLI 옵션 표시                                                                                             |
| `--app`                        | 모든 환경을 빌드, `builder: {}`와 동일 (`boolean`, 실험적 기능)                                                       |

## 기타 {#others}

### `vite optimize` {#vite-optimize}

디펜던시를 미리 번들링합니다.

**Deprecated**: the pre-bundle process runs automatically and does not need to be called.

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