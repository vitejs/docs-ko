# 워커 옵션 {#worker-options}

## worker.format {#worker-format}

- **타입:** `'es' | 'iife'`
- **기본값:** `iife`

워커 번들에 대한 포맷입니다.

## worker.plugins {#worker-plugins}

- **타입:** [`(Plugin | Plugin[])[]`](#plugins)

워커 번들 시 사용되는 Vite 플러그인입니다.

## worker.rollupOptions {#worker-rollupoptions}

- **타입:** [`RollupOptions`](https://rollupjs.org/guide/en/#big-list-of-options)

워커 번들 빌드 시 Rollup 옵션입니다.