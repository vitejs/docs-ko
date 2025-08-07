# 시작하기 {#getting-started}

<audio id="vite-audio">
  <source src="/vite.mp3" type="audio/mpeg">
</audio>

## 들어가기 전에 {#overview}

Vite (French word for "quick", pronounced `/vit/`<button style="border:none;padding:3px;border-radius:4px;vertical-align:bottom" id="play-vite-audio" onclick="document.getElementById('vite-audio').play();"><svg style="height:2em;width:2em"><use href="/voice.svg?no-inline#voice" /></svg></button>, like "veet") is a build tool that aims to provide a faster and leaner development experience for modern web projects. It consists of two major parts:

- [네이티브 ES 모듈](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)을 통해 소스 파일을 제공하는 개발 서버로, [다양한 기능](./features)과 놀라울 정도로 빠른 [Hot Module Replacement(HMR)](./features#hot-module-replacement)를 제공합니다.

- [Rollup](https://rollupjs.org)을 사용해 코드를 번들링하는 빌드 명령어로, 프로덕션을 위해 고도로 최적화된 정적 에셋을 출력하도록 구성되어 있습니다.

Vite는 합리적인 기본 설정을 제공합니다. [기능 가이드](./features)에서 더 자세히 알아보세요. 프레임워크 지원이나 다른 도구와의 통합은 [플러그인](./using-plugins)을 통해 가능합니다. [Vite 설정 가이드](../config/)에서는 필요에 따라 프로젝트에 Vite를 적용하는 방법을 설명합니다.

또한 Vite는 타입이 완벽하게 제공되는 [플러그인 API](./api-plugin)와 [JavaScript API](./api-javascript)를 통해 높은 확장성을 제공합니다.

왜 Vite를 만들게 되었는지 알고 싶다면 [Vite를 사용해야 하는 이유](./why) 섹션을 참고해주세요.

## 지원하는 브라우저 {#browser-support}

During development, Vite assumes that a modern browser is used. This means the browser supports most of the latest JavaScript and CSS features. For that reason, Vite sets [`esnext` as the transform target](https://esbuild.github.io/api/#target). This prevents syntax lowering, letting Vite serve modules as close as possible to the original source code. Vite injects some runtime code to make the development server work. These code use features included in [Baseline](https://web-platform-dx.github.io/web-features/) Newly Available at the time of each major release (2025-05-01 for this major).

For production builds, Vite by default targets [Baseline](https://web-platform-dx.github.io/web-features/) Widely Available browsers. These are browsers that were released at least 2.5 years ago. The target can be lowered via configuration. Additionally, legacy browsers can be supported via the official [@vitejs/plugin-legacy](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy). See the [Building for Production](./build) section for more details.

## 온라인에서 Vite 체험해보기 {#trying-vite-online}

[StackBlitz](https://vite.new/)에서 Vite를 온라인으로 체험해 볼 수 있습니다. Vite를 구성하기 위해 필요한 설정들을 브라우저에서 직접 실행하므로 로컬 환경과 매우 유사하며, 컴퓨터에 그 어떠한 것도 설치할 필요가 없습니다. `vite.new/{template}` 으로 이동해 사용할 프레임워크를 선택해 시작해보세요.

현재 지원하고 있는 템플릿은 다음과 같습니다:

|             JavaScript              |                TypeScript                 |
| :---------------------------------: | :---------------------------------------: |
| [vanilla](https://vite.new/vanilla) | [vanilla-ts](https://vite.new/vanilla-ts) |
|     [vue](https://vite.new/vue)     |     [vue-ts](https://vite.new/vue-ts)     |
|   [react](https://vite.new/react)   |   [react-ts](https://vite.new/react-ts)   |
|  [preact](https://vite.new/preact)  |  [preact-ts](https://vite.new/preact-ts)  |
|     [lit](https://vite.new/lit)     |     [lit-ts](https://vite.new/lit-ts)     |
|  [svelte](https://vite.new/svelte)  |  [svelte-ts](https://vite.new/svelte-ts)  |
|   [solid](https://vite.new/solid)   |   [solid-ts](https://vite.new/solid-ts)   |
|    [qwik](https://vite.new/qwik)    |    [qwik-ts](https://vite.new/qwik-ts)    |

## 첫 Vite 프로젝트 만들어보기 {#scaffolding-your-first-vite-project}

::: tip 호환성
Vite requires [Node.js](https://nodejs.org/en/) version 20.19+, 22.12+. However, some templates require a higher Node.js version to work, please upgrade if your package manager warns about it.
:::

::: code-group

```bash [npm]
$ npm create vite@latest
```

```bash [Yarn]
$ yarn create vite
```

```bash [pnpm]
$ pnpm create vite
```

```bash [Bun]
$ bun create vite
```

```bash [Deno]
$ deno init --npm vite
```

:::

이후에는 프롬프트 창에 출력된 메시지를 따라주세요.

프로젝트의 이름이나 사용하려는 템플릿을 직접 지정할 수도 있습니다. 예를 들어, Vite + Vue 프로젝트를 만들고 싶다면 다음과 같이 입력해주세요:

::: code-group

```bash [npm]
# npm v7 이상에서는 `--` 를 반드시 붙여주세요:
$ npm create vite@latest my-vue-app -- --template vue
```

```bash [Yarn]
$ yarn create vite my-vue-app --template vue
```

```bash [pnpm]
$ pnpm create vite my-vue-app --template vue
```

```bash [Bun]
$ bun create vite my-vue-app --template vue
```

```bash [Deno]
$ deno init --npm vite my-vue-app --template vue
```

:::

또한 [create-vite](https://github.com/vitejs/vite/tree/main/packages/create-vite)에서 더욱 다양한 템플릿들에 대해 다루고 있습니다: `vanilla`, `vanilla-ts`, `vue`, `vue-ts`, `react`, `react-ts`, `react-swc`, `react-swc-ts`, `preact`, `preact-ts`, `lit`, `lit-ts`, `svelte`, `svelte-ts`, `solid`, `solid-ts`, `qwik`, `qwik-ts`.

현재 디렉터리에 프로젝트를 생성하려면 프로젝트 이름으로 `.`을 사용하세요.

## 커뮤니티 템플릿 {#community-templates}

create-vite는 인기 있는 프레임워크로 작성된 템플릿을 기반으로 프로젝트를 빠르게 시작할 수 있는 도구입니다. 이 외에도 [Awesome Vite의 templates 항목](https://github.com/vitejs/awesome-vite#templates)에서 다양한 도구와 프레임워크를 타겟으로 하는 커뮤니티 템플릿들을 확인할 수 있습니다.

템플릿이 `https://github.com/user/project`와 같이 GitHub에 호스팅되어 있다면, `https://github.stackblitz.com/user/project`로 접속해 온라인에서 템플릿을 체험해 볼 수 있습니다. (프로젝트 URL의 `github` 뒷부분에 `.stackblitz`를 붙여주세요.)

[degit](https://github.com/Rich-Harris/degit)을 이용하는 방법도 있습니다. 마찬가지로 프로젝트가 GitHub에 호스팅되어 있고 `main`을 기본 브랜치로 사용한다면, 다음과 같이 로컬에 프로젝트를 구성할 수 있습니다:

```bash
npx degit user/project#main my-project
cd my-project

npm install
npm run dev
```

## 수동 설치 {#manual-installation}

프로젝트 내에서 `vite` CLI를 설치할 수 있습니다:

::: code-group

```bash [npm]
$ npm install -D vite
```

```bash [Yarn]
$ yarn add -D vite
```

```bash [pnpm]
$ pnpm add -D vite
```

```bash [Bun]
$ bun add -D vite
```

```bash [Deno]
$ deno add -D npm:vite
```

:::

그리고 다음과 같이 `index.html` 파일을 생성해주세요:

```html
<p>Hello Vite!</p>
```

이후 아래 CLI 명령을 터미널에서 실행합니다:

::: code-group

```bash [npm]
$ npx vite
```

```bash [Yarn]
$ yarn vite
```

```bash [pnpm]
$ pnpm vite
```

```bash [Bun]
$ bunx vite
```

```bash [Deno]
$ deno run -A npm:vite
```

:::

이제 `http://localhost:5173`에서 `index.html` 파일을 확인할 수 있습니다.

## `index.html` 그리고 프로젝트의 루트 {#index-html-and-project-root}

만들어진 Vite 프로젝트를 유심히 보면 `index.html` 파일이 `public` 디렉터리가 아닌 프로젝트의 루트에 위치해 있다는 것을 발견할 수 있습니다. 의도적으로 이렇게 위치시킨 것인데, 추가적인 번들링 과정 없이 `index.html` 파일이 앱의 진입점이 되게끔 하기 위함입니다.

Vite는 `index.html` 파일을 소스 코드이자 JavaScript 모듈 그래프를 구성하는 요소 중 하나로 취급하고 있습니다. 다시말해, `<script type="module" src="...">` 태그를 이용해 JavaScript 소스 코드를 가져온다는 의미이며, 인라인으로 작성된 `<script type="module">`이나 `<link href>`와 같은 CSS 역시 Vite에서 취급이 가능합니다. 추가적으로, Vite는 `index.html` 내에 존재하는 URL에 대해 `%PUBLIC_URL%`과 같은 자리 표시자 없이 사용할 수 있도록 URL 베이스를 자동으로 맞춰줍니다.

Vite는 정적(Static) HTTP 서버와 비슷하게 "루트 디렉터리"라는 개념을 갖고 있습니다. 향후 `<root>`라는 이름으로 문서 내에서 보게 되는데, 이는 Absolute URL을 프로젝트 루트를 가리키게끔 함으로써 일반적인 정적 파일 서버와 동일하게 코드를 작성할 수 있게 됩니다. 또한 Vite는 프로젝트 루트 외부에서도 디펜던시를 가져올 수 있게끔 구현했는데, 이를 이용하면 모노리포 구성 등 다양한 작업이 가능합니다.

또한 Vite는 여러 `.html` 파일을 앱의 진입점으로 하는 [Multi-page apps](./build#multi-page-app)를 지원하고 있습니다.

#### 프로젝트 루트 지정 {#specifying-alternative-root}

`vite`은 개발 서버를 시작할 때 현재 위치해 있는 디렉터리를 프로젝트 루트로 가정하고 동작합니다. 만약 특정 디렉터리를 지정해 프로젝트 루트로써 동작하게끔 하고 싶다면, `vite serve some/sub/dir` 명령으로 Vite를 시작해주세요.
참고로 Vite는 프로젝트 루트 내에서 [설정 파일(`vite.config.js`)](/config/#configure-vite)을 확인하기에, 프로젝트 루트가 변경된다면 해당 파일도 함께 옮겨줘야 합니다.

## 커맨드 라인 인터페이스 {#command-line-interface}

vite가 설치된 프로젝트는 `vite` 명령을 통해 바로 Vite를 실행할 수 있습니다. (`npx vite`을 이용해도 되구요.) 기본적으로 Vite에서 제공하는 npm 스크립트는 아래와 같습니다.

<!-- prettier-ignore -->
```json [package.json]
{
  "scripts": {
    "dev": "vite", // 개발 서버를 실행합니다. (`vite dev` 또는 `vite serve`로도 시작이 가능합니다.)
    "build": "vite build", // 배포용 빌드 작업을 수행합니다.
    "preview": "vite preview" // 로컬에서 배포용 빌드에 대한 프리뷰 서버를 실행합니다.
  }
}
```

Vite CLI와 함께 `--port`, `--open`와 같은 옵션을 사용할 수 있습니다. 모든 CLI 옵션을 보고자 한다면, vite가 설치된 프로젝트 안에서 `npx vite --help` 명령을 실행해주세요.

좀 더 자세한 정보는 [커맨드 라인 인터페이스](./cli.md) 문서에서 다루고 있습니다.

## 릴리스되지 않은 Vite 사용하기 {#using-unreleased-commits}

최신 기능을 테스트하기 위해 새 릴리스까지 기다릴 수 없다면, https://pkg.pr.new 를 통해 특정 Vite 커밋을 설치하는 방법도 있습니다:

::: code-group

```bash [npm]
$ npm install -D https://pkg.pr.new/vite@SHA
```

```bash [Yarn]
$ yarn add -D https://pkg.pr.new/vite@SHA
```

```bash [pnpm]
$ pnpm add -D https://pkg.pr.new/vite@SHA
```

```bash [Bun]
$ bun add -D https://pkg.pr.new/vite@SHA
```

:::

`SHA`를 [Vite 커밋 SHA](https://github.com/vitejs/vite/commits/main/) 중 하나로 대체해 주세요. 참고로 한 달 이내의 커밋에 대해서만 동작하며, 그 이후 커밋 릴리스는 삭제됩니다.

또는 [vite 리포지토리](https://github.com/vitejs/vite)를 로컬 머신에 클론한 다음, 이를 직접 빌드하고 링크할 수도 있습니다([pnpm](https://pnpm.io/)이 필요합니다):

```bash
git clone https://github.com/vitejs/vite.git
cd vite
pnpm install
cd packages/vite
pnpm run build
pnpm link --global # 이 단계에서는 선호하는 패키지 관리자를 사용할 수 있습니다.
```

이후 Vite를 클론한 프로젝트 위에서 `pnpm link --global vite` 명령을 실행해 주세요(또는 `vite`를 전역적으로 링크하는 데 사용했던 패키지 관리자를 사용합니다). 이 작업 이후 개발 서버를 재시작(`yarn dev`)하게 되면, 클론된 Vite를 이용해 프로젝트를 진행할 수 있게 됩니다.

::: tip Vite를 사용하는 디펜던시
디펜던시에서 간접적으로 사용되는 Vite 버전을 교체하려면, [npm overrides](https://docs.npmjs.com/cli/v11/configuring-npm/package-json#overrides) 또는 [pnpm overrides](https://pnpm.io/package_json#pnpmoverrides)를 사용해야 합니다.
:::

## 커뮤니티 {#community}

질문이나 도움이 필요하다면, [Discord](https://chat.vite.dev) 또는 [GitHub Discussions](https://github.com/vitejs/vite/discussions)에 방문해주세요.