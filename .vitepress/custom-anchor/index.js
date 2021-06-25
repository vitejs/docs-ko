const anchorRE = /^.+(\s*\{#([a-z0-9\-_]+?)\}\s*)$/;

const removeAnchorFromTitle = oldTitle => {
  const match = anchorRE.exec(oldTitle);
  return match !== null ? oldTitle.replace(match[1], '').trim() : oldTitle;
};

module.exports = function plugin(md) {
  const oldTitle = md.renderer.rules.text;

  md.renderer.rules.text = (tokens, ind, options, env, self) =>
    removeAnchorFromTitle(oldTitle(tokens, ind, options, env, self));

  const oldHeading = md.renderer.rules.heading_open;

  md.renderer.rules.heading_open = (tokens, ind, options, env, self) => {
    const head = oldHeading(tokens, ind, options, env, self);
    const data = md.__data;
    const headers = data.headers || (data.headers = []);

    headers.forEach(el => el.title = removeAnchorFromTitle(el.title));

    return head;
  };
};
