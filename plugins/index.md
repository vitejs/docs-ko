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

### [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-react) {#vitejs-plugin-react}

- 리액트를 지원합니다.

### [@vitejs/plugin-legacy](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy)

- 프로덕션 빌드를 위한 이전 브라우저 지원을 제공합니다.

## 커뮤니티 플러그인 {#community-plugins}

[awesome-vite](https://github.com/vitejs/awesome-vite)를 확인해 보세요. 또한 그곳에서 PR을 제출하여 여러분의 플러그인을 목록에 올릴 수 있습니다.

## `Rollup` 플러그인 {#rollup-plugins}

[Vite 플러그인](../guide/api-plugin)은 `Rollup` 플러그인 인터페이스의 확장입니다. 더 많은 정보를 알려면 [Rollup 플러그인 호환 섹션](../guide/api-plugin#rollup-plugin-compatibility)을 참고하세요.
