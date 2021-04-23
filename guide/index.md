# 시작하기

## 들어가기 전에

Vite(프랑스어로 "빠르다"를 의미하며, 발음은 `/vit/` 입니다.)은 빠르고 간결한 모던 웹 프로젝트 개발 경험에 초점을 맞춰 탄생한 빌드 도구이며, 두 가지 컨셉을 중심으로 하고 있습니다.

- 개발 시 [네이티브 ES Module](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)을 넘어 [더욱 다양한 기능](./features)을 제공합니다. 가령, [Hot Module Replacement (HMR)](./features#hot-module-replacement)과 같은 것들 말이죠.

- 번들링 시, [Rollup](https://rollupjs.org) 기반의 다양한 빌드 커맨드를 사용할 수 있습니다. 이는 높은 수준으로 최적화된 정적(Static) 리소스들을 배포할 수 있게끔 하며, 미리 정의된 설정(Pre-configured)을 제공합니다.

Vite은 기본적으로 최적화 된 설정을 제공하지만, [Plugin API](./api-plugin) 또는 [JavaScript API](./api-javascript)를 이용할 수 있습니다. (물론 TypeScript 역시 지원하구요.)

왜 Vite을 만들게 되었는지 알고 싶다면 [Vite을 사용해야 하는 이유](./why) 섹션을 참고해주세요.

## 지원하는 브라우저

- 개발 시: 반드시 [Native ESM dynamic import](https://caniuse.com/es6-module-dynamic-import)를 지원하는 브라우저를 이용해야 합니다.

- 배포 시: 기본적으로 [Script 태그를 이용한 Native ESM](https://caniuse.com/es6-module)을 지원하는 브라우저를 대상으로 하고 있습니다. 만일 레거시 브라우저 역시 타겟으로 하고 있다면, [@vitejs/plugin-legacy](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy) 플러그인을 이용해주세요. ([배포하기](./build) 섹션에서 조금 더 자세히 다룹니다.)

## 첫 Vite 프로젝트 만들어보기

::: tip Compatibility Note
Vite은 버전 12.0.0 이상의 [Node.js](https://nodejs.org/)를 요구합니다.
:::

NPM:

```bash
$ npm init @vitejs/app
```

Yarn:

```bash
$ yarn create @vitejs/app
```

이후에는 프롬프트 창에 출력된 메시지를 따라주세요.

물론 프로젝트의 이름이나 템플릿을 지정해 프로젝트를 만들 수 있습니다. 가령, Vite을 이용해 Vue 프로젝트를 만들자고 한다면...

```bash
# npm 6.x
npm init @vitejs/app my-vue-app --template vue

# npm 7+, extra double-dash is needed:
npm init @vitejs/app my-vue-app -- --template vue

# yarn
yarn create @vitejs/app my-vue-app --template vue
```

이와 같이 지정할 수 있습니다.

현재 Vite에서 공식적으로 지원하고 있는 템플릿은 아래와 같습니다.

- `vanilla`
- `vue`
- `vue-ts`
- `react`
- `react-ts`
- `preact`
- `preact-ts`
- `lit-element`
- `lit-element-ts`
- `svelte`
- `svelte-ts`

각 템플릿에 대해 조금 더 자세한 설명이 필요하다면 [@vitejs/create-app](https://github.com/vitejs/vite/tree/main/packages/create-app)을 참고해주세요.

## 비공식 템플릿

Vite에서 제공하고 있는 템플릿 말고도 [Awesome-vite templates](https://github.com/vitejs/awesome-vite#templates)와 같이 다양한 도구와 프레임워크를 타겟으로 하는 비공식 템플릿들이 있습니다. `@vitejs/create-app`은 이러한 템플릿을 기반으로도 빠르게 프로젝트를 구성할 수 있도록 지원하고 있으며, [degit](https://github.com/Rich-Harris/degit)을 이용합니다.

```bash
npx degit user/project my-project
cd my-project

npm install
npm run dev
```

만약 특정 브랜치에서 시작하고 싶다면, `#` 접미사(Suffix)를 붙여 브랜치를 명시해주세요.

```bash
npx degit user/project#main my-project
```

가령, 위 코드는 `main` 브랜치에 존재하는 템플릿을 기반으로 프로젝트를 시작하겠다는 의미입니다.

## `index.html` 그리고 프로젝트의 루트

만들어진 Vite 프로젝트를 유심히 보면 `index.html` 파일이 `public` 디렉터리가 아닌 프로젝트의 루트에 위치해 있다는 것을 발견할 수 있습니다. 의도적으로 이렇게 위치시킨 것인데, 추가적인 번들링 과정 없이 `index.html` 파일이 앱의 진입점이 되게끔 하기 위함입니다.

Vite은 `index.html` 파일을 소스 코드이자 JavaScript 모듈 그래프를 구성하는 요소 중 하나로 취급하고 있습니다. 다시말해, `<script type="module" src="...">` 태그를 이용해 JavaScript 소스 코드를 가져온다는 의미이며, 인라인으로 작성된 `<script type="module">`이나 `<link href>`와 같은 CSS 역시 Vite에서 취급이 가능합니다. 추가적으로, Vite는 `index.html` 내에 존재하는 URL에 대해 `%PUBLIC_URL%`과 같은 Placeholder 없이 사용할 수 있도록 URL 베이스를 자동으로 맞춰줍니다.

Vite은 정적(Static) HTTP 서버와 비슷하게 "루트 디렉터리"라는 개념을 갖고 있습니다. 향후 `<root>`라는 이름으로 문서 내에서 보게 되는데, 이는 Absolute URL을 프로젝트 루트를 가리키게끔 함으로써 일반적인 정적 파일 서버와 동일하게 코드를 작성할 수 있게 됩니다. 또한 Vite은 프로젝트 루트 외부에서도 디펜던시를 가져올 수 있게끔 구현했는데, 이를 이용하면 모노레포 구성 등 다양한 작업이 가능합니다.

또한 Vite은 여러 `.html` 파일을 앱의 진입점으로 하는 [Multi-page apps](./build#multi-page-app)를 지원하고 있습니다.

#### 프로젝트 루트 지정

`vite`은 개발 서버를 시작할 때 현재 위치해 있는 디렉터리를 프로젝트 루트로 가정하고 동작합니다. 만약 특정 디렉터리를 지정해 프로젝트 루트로써 동작하게끔 하고 싶다면, `vite serve some/sub/dir` 명령으로 Vite을 시작해주세요.

## CLI (Command Line Interface)

Vite이 설치된 프로젝트는 `vite` 명령을 통해 바로 Vite을 실행할 수 있습니다. (`npx vite`을 이용해도 되구요.) 기본적으로 Vite에서 제공하는 npm 스크립트는 아래와 같습니다.

```json
{
  "scripts": {
    "dev": "vite", // start dev server
    "build": "vite build", // build for production
    "serve": "vite preview" // locally preview production build
  }
}
```

Vite CLI와 함께 `--port`, `--https`와 같은 옵션을 사용할 수 있습니다. 모든 CLI 옵션을 보고자 한다면, Vite이 설치된 프로젝트 안에서 `npx vite --help` 명령을 실행해주세요.

## 배포되지 않은 Vite 사용하기

만약 아직 배포되지 않은 Vite을 사용하고자 한다면, 먼저 [Vite 리포지토리](https://github.com/vitejs/vite)를 로컬 컴퓨터로 클론한 뒤 이를 빌드해 사용하는 방법이 있습니다. ([Yarn 1.x](https://classic.yarnpkg.com/lang/en/)가 필요해요.)

```bash
git clone https://github.com/vitejs/vite.git
cd vite
yarn
cd packages/vite
yarn build
yarn link
```

이후 Vite을 클론한 프로젝트 위에서 `yarn link vite` 명령을 실행해 주세요. 이 작업 이후 개발 서버를 재시작(`yarn dev`)하게 되면, 클론된 Vite을 이용해 프로젝트를 진행할 수 있게 됩니다.

## 커뮤니티

질문이나 도움이 필요하다면, [Discord](https://discord.gg/4cmKdMfpU5) 또는 [GitHub Discussions](https://github.com/vitejs/vite/discussions)에 방문해주세요.
