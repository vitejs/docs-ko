// https://github.com/vitejs/docs-cn/blob/96c6f1b1ab2c2a4231920a2ef6cda6151bf4752e/.vitepress/markdown-it-custom-anchor/index.js
const anchorMatch = /^.+(\s*\{#([a-z0-9\-_]+?)\}\s*)$/

const removeAnchorFromTitle = (oldTitle) => {
  const match = anchorMatch.exec(oldTitle)
  return match ? oldTitle.replace(match[1], '').trim() : oldTitle
}

export default function (md) {
  const oldTitle = md.renderer.rules.text
  md.renderer.rules.text = (tokens, idx, options, env, slf) => {
    const titleAndId = oldTitle(tokens, idx, options, env, slf)
    return removeAnchorFromTitle(titleAndId)
  }
}
