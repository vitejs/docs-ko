const position = {
  false: 'push',
  true: 'unshift',
}

export default (slug, options, state, permalink) => {
  try {
    const tokens = state.tokens
    const token = tokens[permalink]
    const title = tokens[permalink + 1].children
      .filter((token) => token.type === 'text' || token.typoe === 'code_inline')
      .reduce((acc, token) => acc + token.content, '')
    const match = /^.+(\s*\{#([a-z0-9\-_]+?)\}\s*)$/.exec(title)

    slug = match ? match[2] : slug
    token.attrSet('id', slug)

    const space = () =>
      Object.assign(new state.Token('text', '', 0), { content: '' })

    const linkTokens = [
      Object.assign(new state.Token('link_open', 'a', 1), {
        attrs: [
          ...(options.permalinkClass
            ? [['class', options.permalinkClass]]
            : []),
          ['href', options.permalinkHref(slug, state)],
          ...Object.entries(options.permalinkAttrs(slug, state)),
        ],
      }),
      Object.assign(new state.Token('html_block', '', 0), {
        content: options.permalinkSymbol,
      }),
      new state.Token('link_close', 'a', -1),
    ]

    if (options.permalinkSpace) {
      linkTokens[position[!options.permalinkBefore]](space())
    }

    state.tokens[permalink + 1].children[position[options.permalinkBefore]](
      ...linkTokens,
    )
  } catch (err) {
    console.log(err)
  }
}
