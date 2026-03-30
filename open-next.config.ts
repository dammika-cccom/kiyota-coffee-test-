import type { OpenNextConfig } from "@opennextjs/cloudflare";

/**
 * KIYOTA ARCHITECTURE: OPEN-NEXT CLOUDFLARE CONFIG
 * This configuration explicitly maps Next.js internals to Cloudflare's 
 * V8 runtime to satisfy strict builder validation.
 */
const config: OpenNextConfig = {
  default: {
    override: {
      // Tells OpenNext to wrap the app as a Cloudflare-compatible Node.js environment
      wrapper: "cloudflare-node",
      // Ensures the request/response objects match the Edge standard
      converter: "edge",
      // Disables the persistent cache for the free version (uses in-memory instead)
      incrementalCache: "dummy",
      tagCache: "dummy",
      queue: "dummy",
    },
  },
  // Required for your Auth Middleware to run correctly on the Edge
  middleware: {
    external: true,
    override: {
      wrapper: "cloudflare-edge",
      converter: "edge",
      proxyExternalRequest: "fetch",
    },
  },
};

export default config;