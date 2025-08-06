# SSR Using `ModuleRunner` API
# Move to Per-environment APIs
Vite는 빌드 성능과 기능을 개선하기 위해, Rust 기반 JavaScript 번들러인 [Rolldown](https://rolldown.rs)을 통합할 계획입니다.

<YouTubeVideo videoId="RRjfm8cMveQ" />

## Rolldown이란 무엇인가요? {#what-is-rolldown}

## Review Your Browser Setup

Rolldown은 세 가지 핵심 원칙이 있습니다:

- **속도**: 최대 성능을 위해 Rust 기반 설계
## Environments and Frameworks
- **최적화**: esbuild와 Rollup을 뛰어넘는 기능 제공

Note Vite supports using ES modules syntax in the config file even if the project is not using native Node ESM, e.g. `"type": "module"` in `package.json`. In this case, the config file is auto pre-processed before load.

- [Move to Per-environment APIs](/changes/per-environment-apis)
- [SSR Using `ModuleRunner` API](/changes/ssr-using-modulerunner)
- [Shared Plugins During Build](/changes/shared-plugins-during-build)

3. **추가 기능**: 고급 청크 분할 제어, 내장 HMR, 모듈 페더레이션 등 Rollup이나 esbuild에서 제공하지 않는 기능들을 Rolldown에서 도입합니다.

Rolldown을 개발하게 된 동기에 대해 더 알고자 한다면, [Rolldown이 만들어진 이유](https://rolldown.rs/guide/#why-rolldown)를 참고해 주세요.

## `rolldown-vite` 이점 {#benefits-of-trying-rolldown-vite}

- 특히 대규모 프로젝트에서 훨씬 더 빠른 빌드 성능
- Vite 번들링의 미래를 만들어가는 데 도움이 되는 귀중한 피드백 제공
- 향후 공식 Rolldown 통합을 위해 프로젝트 준비

## Rolldown 시작하기 {#how-to-try-rolldown}

현재 Rolldown 기반 Vite는 `rolldown-vite`라는 별도 패키지로 제공하고 있습니다. 만약 `vite`를 직접 디펜던시로 명시해 사용하고 있다면, 패키지 내 `package.json`에서 `vite` 패키지를 `rolldown-vite`에 대한 별칭으로 등록할 수 있습니다. 기존 코드를 수정하지 않고 간단히 대체가 가능합니다:
We had the second edition of [ViteConf](https://viteconf.org/23/replay) a month ago, hosted by [StackBlitz](https://stackblitz.com). Like last year, most of the projects in the ecosystem got together to share ideas and connect to keep expanding the commons. We're also seeing new pieces complement the meta-framework tool belt like [Volar](https://volarjs.dev/) and [Nitro](https://nitro.build/). The Rollup team released [Rollup 4](https://rollupjs.org) that same day, a tradition Lukas started last year.
```json
{
  "dependencies": {
    "vite": "^7.0.0" // [!code --]

:::code-group

```json [npm]
{
  "overrides": {
    "vite": "npm:rolldown-vite@latest"
  }
}
```

```json [Yarn]
{
  "resolutions": {
    "vite": "npm:rolldown-vite@latest"
  }
}
```

```json [pnpm]
{
  "pnpm": {
    "overrides": {
      "vite": "npm:rolldown-vite@latest"
    }
  }
}
```

```json [Bun]
{
  "overrides": {
    "vite": "npm:rolldown-vite@latest"
  }
}
```

:::

오버라이드를 추가한 후 디펜던시를 재설치한 뒤, 평소처럼 개발 서버를 시작하거나 프로젝트 빌드를 수행해 주세요. 추가적인 설정 변경은 필요하지 않습니다.

## 알려진 제약 사항 {#known-limitations}

Rolldown은 Rollup 대체 목적으로 설계되었지만, 아직 구현 중인 기능과 의도적인 동작 차이가 있습니다. 자세한 목록은 정기적으로 업데이트되는 [이 GitHub PR](https://github.com/vitejs/rolldown-vite/pull/84#issue-2903144667)을 참고해 주세요.

### Option Validation Warnings

```js
// Old configuration (Rollup)
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (/\/react(?:-dom)?/.test(id)) {
            return 'vendor'
          }
        }
      }
    }
  }
}

// New configuration (Rolldown)
export default {
While Rolldown has support for the `manualChunks` option that is also exposed by Rollup, it is marked deprecated. Instead of it, Rolldown offers a more fine-grained setting via the [`advancedChunks` option](https://rolldown.rs/guide/in-depth/advanced-chunks#advanced-chunks), which is more similar to webpack's `splitChunk`:
    }
  }
}
```

Rolldown과 Oxc 덕분에 별칭(alias)이나 resolve 플러그인과 같은 다양한 Vite 내부 플러그인들이 Rust로 전환되었습니다. 다만 현재 시점에서는 플러그인 동작이 JavaScript 버전과 다를 수 있기 때문에, 기본적으로 비활성화되어 있습니다.

이를 테스트하려면 Vite 설정에서 `experimental.enableNativePlugin` 옵션을 `true`로 설정해 주세요.
```js
### `@vitejs/plugin-react-oxc`

When using `@vitejs/plugin-react` or `@vitejs/plugin-react-swc`, you can switch to the `@vitejs/plugin-react-oxc` plugin, which uses Oxc for React's fast-refresh instead of Babel or SWC. It is designed to be a drop-in replacement, providing better build performance and aligning with the underlying architecture of `rolldown-vite`.

Be aware that you can only switch to `@vitejs/plugin-react-oxc` if you are not using any Babel or SWC plugins (including the React compiler), or mutate the SWC options.

// 프로젝트 내 vite.config.ts
import { withFilter, defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  plugins: [
    // `.svg?react`로 끝나는 파일에 대해서만 `svgr` 플러그인 로드
    withFilter(
          groups: [{ name: 'vendor', test: /\/react(?:-dom)?/ }]
[이슈 생성](https://github.com/vitejs/rolldown-vite/issues/new) 시, 적절한 이슈 템플릿을 따라 필요한 내용을 입력해 주세요:

- 이슈에 대한 가장 작은 재현 방법
- 실행 환경 세부 정보 (OS, Node 버전, 패키지 관리자)
- 관련 오류 메시지 또는 로그

실시간으로 논의하고 문제를 해결하기 위해 [Rolldown 디스코드](https://chat.rolldown.rs/)에 참여할 수도 있습니다.

## 버전 관리 정책 {#version-policy}

`rolldown-vite` 버전 관리 정책은 메이저 및 마이너 버전을 기존 Vite 패키지와 일치시키는 형태로 운영됩니다. 이러한 동기화를 통해 특정 Vite 마이너 릴리스에 포함된 기능은 이에 대응하는 `rolldown-vite` 마이너 릴리스에도 포함됩니다. 다만 패치 버전은 두 프로젝트 간 동기화되지 않는다는 점에 유의하세요. 특정 Vite 변경사항이 `rolldown-vite`에도 포함되었는지 확인하려면 [`rolldown-vite` 변경 사항](https://github.com/vitejs/rolldown-vite/blob/rolldown-vite/packages/vite/CHANGELOG.md)을 참고해 주세요.
전체 번들 모드가 도입되면, 처음에는 옵션(Opt-in)으로 제공될 예정입니다. Rolldown 통합과 마찬가지로, 피드백을 수집하고 안정성을 확보한 후 기본값으로 만들고자 합니다.

## Plugin / Framework Authors Guide

- 빌드에 Rolldown 사용 (이전에는 Rollup 사용)
- 최적화 도구로 Rolldown 사용 (이전에는 esbuild 사용)
`vite`를 (피어 디펜던시가 아닌)디펜던시로 지정한 경우, `rolldownVersion` 익스포트 방식이 코드 어디에서든 사용할 수 있기에 더욱 유용합니다.

### Rolldown에서 옵션 검증 무시하기 {#ignoring-option-validation-in-rolldown}

[위에서 언급한 대로](#option-validation-errors), Rolldown은 알 수 없거나 유효하지 않은 옵션이 전달되면 오류를 발생시킵니다.

이는 [앞서 설명했듯](#detecting-rolldown-vite) `rolldown-vite` 실행 여부 확인을 통해 조건부로 옵션을 전달하는 방식으로 해결할 수 있습니다.

그리고 `ROLLDOWN_OPTIONS_VALIDATION=loose` 환경 변수를 설정해 오류를 잠시 무시하는 방법도 있습니다.
그러나 **궁극적으로는 Rolldown에서 지원하지 않는 옵션 전달을 중단해야 한다**는 점을 염두에 두세요.

### `transformWithEsbuild`는 `esbuild`를 별도로 설치해야 함 {#transformwithesbuild-requires-esbuild-to-be-installed-separately}

`esbuild` 대신 Oxc를 사용하는 `transformWithOxc`라는 유사한 함수가 `rolldown-vite`에서 익스포트됩니다.

### `esbuild` 옵션을 위한 호환성 레이어 {#compatibility-layer-for-esbuild-options}

Rolldown-Vite는 `esbuild` 옵션을 Oxc나 `rolldown` 옵션으로 변환하는 호환성 레이어를 제공합니다. [ecosystem-ci](https://github.com/vitejs/vite-ecosystem-ci/blob/rolldown-vite/README-temp.md)에서 테스트한 바와 같이, 이는 간단한 `esbuild` 플러그인을 포함해 많은 경우에서 작동합니다.
다만 **향후에는 `esbuild` 옵션 지원을 제거할 예정**이므로, 해당하는 Oxc 또는 `rolldown` 옵션을 사용해 보시기 바랍니다.
호환성 레이어가 설정한 옵션은 `configResolved` 훅에서 확인할 수 있습니다.

```js
const plugin = {
  name: 'log-config',
  configResolved(config) {
    console.log('options', config.optimizeDeps, config.oxc)
  },
},
```

      const content = fs.readFile(id, 'utf-8')
      return {
        code: `export default ${JSON.stringify(content)}`,
        moduleType: 'js', // [!code ++]
      }
    }
  },
}
```

이는 [Rolldown이 JavaScript가 아닌 모듈을 지원](https://rolldown.rs/guide/in-depth/module-types)하고, 명시적으로 지정하지 않는 한 확장자로 모듈 타입을 추론하기 때문입니다. 참고로 `rolldown-vite`는 개발 환경에서 ModuleTypes를 지원하지 않습니다.
              text: 'Move to Per-environment APIs',
              text: 'SSR Using ModuleRunner API',
              text: 'Shared Plugins During Build',
    // the error middleware.
::: tip

Since Vite 7.0.0, `this.meta` is available in all hooks. In previous versions, `this.meta` was not available in Vite-specific hooks, such as the `config` hook.

:::

As [mentioned above](#option-validation-errors), Rolldown outputs a warning when unknown or invalid options are passed.
Since Vite itself does not use `esbuild` any more, `esbuild` is now an optional peer dependency. If your plugin uses `transformWithEsbuild`, the plugin needs to add `esbuild` to its dependencies or the user needs to install it manually.

The recommended migration is to use the newly exported `transformWithOxc` function, which utilizes Oxc instead of `esbuild`.
::: tip

[`@rolldown/pluginutils`](https://www.npmjs.com/package/@rolldown/pluginutils) exports some utilities for hook filters like `exactRegex` and `prefixRegex`.

:::

This is because [Rolldown supports non-JavaScript modules](https://rolldown.rs/guide/in-depth/module-types) and infers the module type from extensions unless specified.