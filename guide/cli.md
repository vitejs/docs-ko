# 커맨드 라인 인터페이스 {#command-line-interface}

## 프로세스 잠금 {#process-locks}

`vite`, `vite build`, `vite preview` 명령은 [`cacheDir`](/config/shared-options#cachedir)의 `lock` 하위 디렉터리에 잠금 파일을 만듭니다. 같은 명령, 프로젝트 루트, 설정 파일, 모드로 실행 중인 다른 프로세스가 잠금을 보유하고 있으면 Vite가 종료됩니다. 다른 인스턴스를 함께 실행하려면 `--bypass-lock`을 전달하세요.

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
| `--experimentalBundle` | 실험적인 번들 개발 모드를 사용합니다(매우 실험적인 기능입니다) (`boolean`) |
| `--bypass-lock`           | 이 프로젝트에서 다른 Vite 프로세스와 동시 실행 허용 (`boolean`)                                                                                                           |
| `-c, --config <file>`     | 설정 파일 지정 (`string`)                                                                                                                                             |
| `--base <path>`           | `base` 옵션 위치 지정 (기본값: `/`) (`string`)                                                                                                                        |
| `-l, --logLevel <level>`  | info \| warn \| error \| silent (`string`)                                                                                                                            |
| `--clearScreen`           | 로깅 시 화면을 지우는 것을 허용/비허용 (`boolean`)                                                                                                                    |
| `--configLoader <loader>` | Rolldown으로 설정을 번들링하려면 `bundle`을, 네이티브 런타임으로 로드하려면 `native`를 사용 (기본값: `bundle`)                                                            |
| `--profile [name]` | 내장 Node.js 인스펙터를 시작하고 프로파일을 `<name>.cpuprofile`에 저장합니다([성능 병목 현상](/guide/troubleshooting#performance-bottlenecks) 참고) (`boolean \| string`) |
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

| Options                        |                                                                                                                       |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| `--target <target>`            | 트랜스파일 대상 (기본값: `"baseline-widely-available"`) (`string`)                                                                      |
| `--outDir <dir>`               | 빌드 결과 디렉터리 지정 (기본값: `dist`) (`string`)                                                                   |
| `--assetsDir <dir>`            | outDir 내부의 에셋이 위치할 디렉터리 (기본값: `"assets"`) (`string`)                                                  |
| `--assetsInlineLimit <number>` | base64로 인라인되는 에셋의 바이트 임계값 (기본값: `4096`) (`number`)                                                  |
| `--ssr [entry]`                | 지정된 엔트리를 서버 사이드 렌더링을 위해 빌드 (`string`)                                                             |
| `--sourcemap [output]`         | 빌드에 소스 맵 포함 (기본값: `false`) (`boolean \| "inline" \| "hidden"`)                                             |
| `--minify [minifier]`          | minify 옵션을 활성화/비활성화하거나 사용할 minifier를 지정 (기본값: `"oxc"`) (`boolean \| "oxc" \| "terser" \| "esbuild"`) |
| `--manifest [name]`            | 빌드 매니페스트 JSON 내보내기 (`boolean \| string`)                                                                   |
| `--ssrManifest [name]`         | SSR 매니페스트 JSON 내보내기 (`boolean \| string`)                                                                    |
| `--emptyOutDir`                | outDir가 프로젝트 루트 밖에 있을 때 강제로 outDir 디렉터리를 비우기 (`boolean`)                                       |
| `-w, --watch`                  | 디스크의 모듈이 변경되면 다시 빌드 (`boolean`)                                                                        |
| `--bypass-lock`                | 이 프로젝트에서 다른 Vite 프로세스와 동시 실행 허용 (`boolean`)                                                                                                           |
| `-c, --config <file>`          | 설정 파일 지정 (`string`)                                                                                             |
| `--base <path>`                | `base` 옵션 위치 지정 (기본값: `/`) (`string`)                                                                        |
| `-l, --logLevel <level>`       | info \| warn \| error \| silent (`string`)                                                                            |
| `--clearScreen`                | 로깅 시 화면을 지우는 것을 허용/비허용 (`boolean`)                                                                    |
| `--configLoader <loader>`      | Rolldown으로 설정을 번들링하려면 `bundle`을, 네이티브 런타임으로 로드하려면 `native`를 사용 (기본값: `bundle`)                                                            |
| `--profile [name]` | 내장 Node.js 인스펙터를 시작하고 프로파일을 `<name>.cpuprofile`에 저장합니다([성능 병목 현상](/guide/troubleshooting#performance-bottlenecks) 참고) (`boolean \| string`) |
| `-d, --debug [feat]`           | 디버그 로그 표시 (`string \| boolean`)                                                                                |
| `-f, --filter <filter>`        | 디버그 로그 필터 (`string`)                                                                                           |
| `-m, --mode <mode>`            | env 모드 설정 (`string`)                                                                                              |
| `-h, --help`                   | 사용 가능한 CLI 옵션 표시                                                                                             |
| `--app`                        | 모든 환경을 빌드, `builder: {}`와 동일 (`boolean`, 실험적 기능)                                                       |

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
| `-l, --logLevel <level>`  | info \| warn \| error \| silent (`string`)                                                                      |
| `--clearScreen`           | 로깅 시 화면을 지우는 것을 허용/비허용 (`boolean`)                                                              |
| `--configLoader <loader>` | Rolldown으로 설정을 번들링하려면 `bundle`을, 네이티브 런타임으로 로드하려면 `native`를 사용 (기본값: `bundle`) |
| `-d, --debug [feat]`      | 디버그 로그 표시 (`string \| boolean`)                                                                          |
| `-f, --filter <filter>`   | 디버그 로그 필터 (`string`)                                                                                     |
| `-m, --mode <mode>`       | env 모드 설정 (`string`)                                                                                        |
| `-h, --help`              | 사용 가능한 CLI 옵션 표시                                                                                       |

### `vite preview` {#vite-preview}

프로덕션 빌드를 로컬에서 미리 봅니다. 프로덕션 서버용으로 설계되지 않았기에 프로덕션 서버로 사용하면 안 됩니다.

이 명령은 빌드 디렉터리(기본값은 `dist`)에서 서버를 시작합니다. 빌드 디렉터리가 최신 상태인지 확인하려면 먼저 `vite build`를 실행하세요. 프로젝트에 구성된 [`appType`](/config/shared-options.html#apptype)에 따라 특정 미들웨어를 사용합니다.

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
| `--outDir <dir>`          | 빌드 결과 디렉터리 지정 (기본값: `dist`) (`string`)                                                              |
| `--bypass-lock`           | 이 프로젝트에서 다른 Vite 프로세스와 동시 실행 허용 (`boolean`)                                                |
| `-c, --config <file>`     | 설정 파일 지정 (`string`)                                                                                       |
| `--base <path>`           | `base` 옵션 위치 지정 (기본값: `/`) (`string`)                                                                  |
| `-l, --logLevel <level>`  | info \| warn \| error \| silent (`string`)                                                                      |
| `--clearScreen`           | 로깅 시 화면을 지우는 것을 허용/비허용 (`boolean`)                                                              |
| `--configLoader <loader>` | Rolldown으로 설정을 번들링하려면 `bundle`을, 네이티브 런타임으로 로드하려면 `native`를 사용 (기본값: `bundle`) |
| `-d, --debug [feat]`      | 디버그 로그 표시 (`string \| boolean`)                                                                          |
| `-f, --filter <filter>`   | 디버그 로그 필터 (`string`)                                                                                     |
| `-m, --mode <mode>`       | env 모드 설정 (`string`)                                                                                        |
| `-h, --help`              | 사용 가능한 CLI 옵션 표시                                                                                       |
