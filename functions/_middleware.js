// Legacy hostnames merged into this workbench: permanent redirect to the matching tab.
const LEGACY = { "history.mohammed-km.in": "https://future.mohammed-km.in/#history" };
export async function onRequest({ request, next }) {
  const target = LEGACY[new URL(request.url).hostname];
  return target ? Response.redirect(target, 308) : next();
}
