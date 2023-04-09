# 워커 옵션 {#worker-options}

웹 워커와 관련된 옵션입니다.

## worker.format {#worker-format}

- **타입:** `'es' | 'iife'`
- **기본값:** `'iife'`

워커 번들에 대한 포맷입니다.

## worker.plugins {#worker-plugins}

- **타입:** [`(Plugin | Plugin[])[]`](#plugins)

워커 번들에 적용되는 Vite 플러그인입니다. [config.plugins](./shared-options#plugins)은 개발 모드에서만 워커에 적용되며, 빌드 시에는 여기에 설정해야 합니다.

## worker.rollupOptions {#worker-rollupoptions}

- **타입:** [`RollupOptions`](https://rollupjs.org/configuration-options/)

워커 번들 빌드 시 Rollup 옵션입니다.