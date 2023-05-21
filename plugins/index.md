# 플러그인 {#plugins}

:::tip 참고
`Vite`는 일반적인 웹 개발 패턴들에 대한 기본적인 지원을 제공하는 것을 목표로 합니다. `Vite` 또는 `Rollup` 호환 플러그인을 검색하기 전에, [지원하는 기능들](../guide/features.md) 페이지를 확인해 보세요. `Rollup` 프로젝트에 플러그인이 필요한 많은 경우가 이미 `Vite`에 구현되어 있습니다.
:::

플러그인 사용법은 [플러그인 사용하기](../guide/using-plugins) 문서를 참고해주세요.

## 공식 플러그인 {#official-plugins}

### [@vitejs/plugin-vue](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue) {#vitejs-plugin-vue}

- Vue 3 단일 파일 컴포넌트(SFC)의 지원을 제공합니다.

### [@vitejs/plugin-vue-jsx](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue-jsx) {#vitejs-plugin-vue-jsx}

- Vue 3 JSX 지원을 제공합니다. ([전용 `Babel` 변형](https://github.com/vuejs/jsx-next)을 통해)

### [@vitejs/plugin-vue2](https://github.com/vitejs/vite-plugin-vue2) {#vitejs-plugin-vue2}

- Vue 2.7 단일 파일 컴포넌트(SFC)를 지원합니다.

### [@vitejs/plugin-vue2-jsx](https://github.com/vitejs/vite-plugin-vue2-jsx) {#vitejs-plugin-vue2-jsx}

- [전용 바벨 프리셋](https://github.com/vuejs/jsx-vue2/)을 통해 Vue 2.7 JSX를 지원합니다

### [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-react) {#vitejs-plugin-react}

- esbuild와 Babel을 사용하여 작은 패키지 크기와 Babel 변형 파이프라인의 유연성을 통해 빠른 HMR을 달성합니다. 추가 Babel 플러그인이 없으면 빌드 중 esbuild만 사용됩니다.

### [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) {#vitejs-plugin-react-swc}

- 개발 중에는 Babel 대신 SWC를 사용합니다. 빌드 중 플러그인을 사용하게 된다면 SWC+esbuild를 사용하고, 그렇지 않다면 esbuild만을 사용합니다. 비표준 React 확장이 필요하지 않은 대규모 프로젝트의 경우, 콜드 스타트와 Hot Module Replacement(HMR)이 훨씬 빠르게 작동할 수 있습니다.

### [@vitejs/plugin-legacy](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy) {#vitejs-plugin-legacy}

- 프로덕션 빌드를 위한 이전 브라우저 지원을 제공합니다.

## 커뮤니티 플러그인 {#community-plugins}

[awesome-vite](https://github.com/vitejs/awesome-vite)를 확인해 보세요. 또한 그곳에서 PR을 제출하여 여러분의 플러그인을 목록에 올릴 수 있습니다.

## `Rollup` 플러그인 {#rollup-plugins}

[Vite 플러그인](../guide/api-plugin)은 `Rollup` 플러그인 인터페이스의 확장입니다. 더 많은 정보를 알려면 [Rollup 플러그인 호환 섹션](../guide/api-plugin#rollup-plugin-compatibility)을 참고하세요.
