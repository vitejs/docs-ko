<script setup lang="ts">
import { ref, computed } from 'vue'

declare const __VITE_VERSION__: string

// Constants
const supportedVersionMessage = {
  color: 'var(--vp-c-brand-1)',
  text: 'supported',
}
const notSupportedVersionMessage = {
  color: 'var(--vp-c-danger-1)',
  text: 'not supported',
}
const previousMajorLatestMinors: Record<string, string> = {
  '2': '2.9',
  '3': '3.2',
  '4': '4.5',
  '5': '5.4',
  '6': '6.4',
  '7': '7.3',
}

// Current latest Vite version and support info
const parsedViteVersion = parseVersion(__VITE_VERSION__)!
const supportInfo = computeSupportInfo(parsedViteVersion)

// Check supported version input
const checkedVersion = ref(`${Math.max(parsedViteVersion.major - 3, 2)}.0.0`)
const checkedResult = computed(() => {
  const version = checkedVersion.value
  if (!isValidViteVersion(version)) return notSupportedVersionMessage

  const parsedVersion = parseVersion(checkedVersion.value)
  if (!parsedVersion) return notSupportedVersionMessage

  const satisfies = (targetVersion: string) => {
    const compared = parseVersion(targetVersion)!
    return (
      parsedVersion.major === compared.major &&
      parsedVersion.minor >= compared.minor
    )
  }
  const satisfiesOneSupportedVersion =
    parsedVersion.major >= parsedViteVersion.major || // Treat future major versions as supported
    supportInfo.regularPatches.some(satisfies) ||
    supportInfo.importantFixes.some(satisfies) ||
    supportInfo.securityPatches.some(satisfies)

  return satisfiesOneSupportedVersion
    ? supportedVersionMessage
    : notSupportedVersionMessage
})

function parseVersion(version: string) {
  let [major, minor, patch] = version.split('.').map((v) => {
    const num = /^\d+$/.exec(v)?.[0]
    return num ? parseInt(num) : null
  })
  if (!major) return null
  minor ??= 0
  patch ??= 0

  return { major, minor, patch }
}

function computeSupportInfo(
  version: NonNullable<ReturnType<typeof parseVersion>>,
) {
  const { major, minor } = version
  const f = (versions: string[]) => {
    return versions
      .map((v) => previousMajorLatestMinors[v] ?? v)
      .filter((version) => {
        if (!isValidViteVersion(version)) return false
        // Negative versions are invalid
        if (/-\d/.test(version)) return false
        return true
      })
  }

  return {
    regularPatches: f([`${major}.${minor}`]),
    importantFixes: f([`${major - 1}`, `${major}.${minor - 1}`]),
    securityPatches: f([`${major - 2}`, `${major}.${minor - 2}`]),
  }
}

function versionsToText(versions: string[]) {
  versions = versions.map((v) => `<code>vite@${v}</code>`)
  if (versions.length === 0) return ''
  if (versions.length === 1) return versions[0]
  return (
    versions.slice(0, -1).join(', ') + ' and ' + versions[versions.length - 1]
  )
}

function isValidViteVersion(version: string) {
  if (version.length === 1) version += '.'
  // Vite 0.x shouldn't be mentioned, and Vite 1.x was never released
  if (version.startsWith('0.') || version.startsWith('1.')) return false
  return true
}
</script>

<template>
  <div>
    <ul>
      <li v-if="supportInfo.regularPatches.length">
        정기 패치는
        <span v-html="versionsToText(supportInfo.regularPatches)"></span>에 릴리스됩니다.
      </li>
      <li v-if="supportInfo.importantFixes.length">
        중요한 수정 사항과 보안 패치는
        <span v-html="versionsToText(supportInfo.importantFixes)"></span>에 백포트됩니다.
      </li>
      <li v-if="supportInfo.securityPatches.length">
        보안 패치는
        <span v-html="versionsToText(supportInfo.securityPatches)"></span>에도 백포트됩니다.
      </li>
      <li>
        이보다 이전의 모든 버전은 더 이상 지원되지 않습니다. 업데이트를 받으려면
        업그레이드해야 합니다.
      </li>
    </ul>
    <p>
      사용 중인 Vite 버전이
      <input
        class="checked-input"
        type="text"
        v-model="checkedVersion"
        placeholder="0.0.0"
      />이면
      <strong :style="{ color: checkedResult.color }">{{
        checkedResult.text
      }}</strong
      >.
    </p>
  </div>
</template>

<style scoped>
.checked-input {
  display: inline-block;
  padding: 0px 5px;
  width: 100px;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg-soft);
  font-size: var(--vp-code-font-size);
  font-family: var(--vp-font-family-mono);
  border: 1px solid var(--vp-c-divider);
  border-radius: 5px;
  transition: border-color 0.1s;
}

.checked-input:focus,
.checked-input:hover {
  border-color: var(--vp-c-brand);
}
</style>
