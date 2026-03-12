# 플러그인 {#plugins}

:::tip 참고
`Vite`는 일반적인 웹 개발 패턴들에 대한 기본적인 지원을 제공하는 것을 목표로 합니다. `Vite` 또는 `Rollup` 호환 플러그인을 검색하기 전에, [지원하는 기능들](../guide/features.md) 페이지를 확인해 보세요. `Rollup` 프로젝트에 플러그인이 필요한 많은 경우가 이미 `Vite`에 구현되어 있습니다.
:::

플러그인 사용법은 [플러그인 사용하기](../guide/using-plugins) 문서를 참고해주세요.

## 공식 플러그인 {#official-plugins}

### [@vitejs/plugin-vue](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue) {#vitejs-plugin-vue}

Provides Vue 3 Single File Components support.

### [@vitejs/plugin-vue-jsx](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue-jsx) {#vitejs-plugin-vue-jsx}

Provides Vue 3 JSX support (via [dedicated Babel transform](https://github.com/vuejs/babel-plugin-jsx)).

### [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-react) {#vitejs-plugin-react}

Provides React Fast Refresh support via [Oxc Transformer](https://oxc.rs/docs/guide/usage/transformer).

### [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-react-swc)

Replaces Oxc with [SWC](https://swc.rs/) during development for SWC plugin usage. During production builds, SWC+Oxc Transformer are used when using plugins. For big projects that require custom plugins, cold start and Hot Module Replacement (HMR) can be significantly faster, if the plugin is also available for SWC.

### [@vitejs/plugin-rsc](https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-rsc)

Vite supports [React Server Components (RSC)](https://react.dev/reference/rsc/server-components) through the plugin. It utilizes the [Environment API](/guide/api-environment) to provide low-level primitives that React frameworks can use to integrate RSC features. You can try a minimal standalone RSC application with:

```bash
npm create vite@latest -- --template rsc
```

Read the [plugin documentation](https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-rsc) to learn more.

### [@vitejs/plugin-legacy](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy) {#vitejs-plugin-legacy}

Provides legacy browsers support for the production build.

## 커뮤니티 플러그인 {#community-plugins}

Check out [Vite Plugin Registry](https://registry.vite.dev/plugins) for the list of plugins published to npm.

## `Rollup` 플러그인 {#rollup-plugins}

[Vite 플러그인](../guide/api-plugin)은 `Rollup` 플러그인 인터페이스의 확장입니다. 더 많은 정보를 알려면 [Rollup 플러그인 호환 섹션](../guide/api-plugin#rollup-plugin-compatibility)을 참고하세요.
## Rolldown / Rollup Plugins
[Vite plugins](../guide/api-plugin) are an extension of Rollup's plugin interface. Check out the [Rollup Plugin Compatibility section](../guide/api-plugin#rolldown-plugin-compatibility) for more information.