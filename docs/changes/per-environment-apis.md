# Move to Per-environment APIs
The `Environment` instance was first introduced at `v6.0`. The deprecation of `server.moduleGraph` and other methods that are now in environments is planned for a future major. We don't recommend moving away from server methods yet. To identify your usage, set these in your vite config.
- `server.moduleGraph` -> [`environment.moduleGraph`](/guide/api-environment-instances#separate-module-graphs)
Affected scope: `Vite Plugin Authors`
  removeServerWarmupRequest: 'warn',
  removeServerPluginContainer: 'warn',
- `server.pluginContainer` -> `environment.pluginContainer`
  removeServerHot: 'warn',
- `server.hot` -> `server.client.environment.hot`
  removeServerReloadModule: 'warn',
- `server.reloadModule(module)` -> `environment.reloadModule(module)`