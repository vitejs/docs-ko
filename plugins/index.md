# 플러그인 {#plugins}

:::tip 참고
Vite는 일반적인 웹 개발 패턴에 대한 기본 지원을 제공하는 것을 목표로 합니다. Vite 또는 Rollup 호환 플러그인을 찾기 전에 [기능 가이드](../guide/features.md)를 확인해 보세요. Rollup 프로젝트에서는 플러그인이 필요했던 많은 경우가 이미 Vite에서 지원됩니다.
:::

플러그인 사용법은 [플러그인 사용하기](../guide/using-plugins) 문서를 참고하세요.

## 공식 플러그인 {#official-plugins}

### [@vitejs/plugin-vue](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue) {#vitejs-plugin-vue}

Vue 3 단일 파일 컴포넌트 지원을 제공합니다.

### [@vitejs/plugin-vue-jsx](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue-jsx) {#vitejs-plugin-vue-jsx}

Vue 3 JSX 지원을 제공합니다([전용 Babel 변환](https://github.com/vuejs/babel-plugin-jsx)을 통해).

### [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-react) {#vitejs-plugin-react}

[Oxc Transformer](https://oxc.rs/docs/guide/usage/transformer)를 통해 React Fast Refresh 지원을 제공합니다.

### [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-react-swc) {#vitejs-plugin-react-swc}

SWC 플러그인 사용을 위해 개발 중 Oxc를 [SWC](https://swc.rs/)로 대체합니다. 프로덕션 빌드에서는 플러그인을 사용할 때 SWC+Oxc Transformer가 사용됩니다. 커스텀 플러그인이 필요한 대규모 프로젝트에서는 해당 플러그인을 SWC에서도 사용할 수 있다면 콜드 스타트와 Hot Module Replacement(HMR)가 훨씬 빨라질 수 있습니다.

### [@vitejs/plugin-rsc](https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-rsc) {#vitejs-plugin-rsc}

Vite는 이 플러그인을 통해 [React Server Components(RSC)](https://react.dev/reference/rsc/server-components)를 지원합니다. 이 플러그인은 [환경 API](/guide/api-environment)를 활용하여 React 프레임워크가 RSC 기능을 통합할 때 사용할 수 있는 저수준 프리미티브를 제공합니다. 다음 명령으로 최소한의 독립 실행형 RSC 애플리케이션을 사용해 볼 수 있습니다:

```bash
npm create vite@latest -- --template rsc
```

자세한 내용은 [플러그인 문서](https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-rsc)를 참고하세요.

### [@vitejs/plugin-legacy](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy) {#vitejs-plugin-legacy}

프로덕션 빌드를 위한 레거시 브라우저 지원을 제공합니다.

## 커뮤니티 플러그인 {#community-plugins}

npm에 게시된 플러그인 목록은 [Vite Plugin Registry](https://registry.vite.dev/plugins)를 확인하세요.

## Rolldown 내장 플러그인 {#rolldown-builtin-plugins}

Vite는 내부적으로 [Rolldown](https://rolldown.rs/)을 사용하며, Rolldown은 일반적인 사용 사례를 위한 몇 가지 내장 플러그인을 제공합니다.

자세한 내용은 [Rolldown 내장 플러그인 섹션](https://rolldown.rs/builtin-plugins/)을 참고하세요.

## Rolldown / Rollup 플러그인 {#rolldown-rollup-plugins}

[Vite 플러그인](../guide/api-plugin)은 Rollup 플러그인 인터페이스의 확장입니다. 자세한 내용은 [Rollup 플러그인 호환성 섹션](../guide/api-plugin#rolldown-plugin-compatibility)을 참고하세요.
