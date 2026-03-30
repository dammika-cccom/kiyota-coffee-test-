import type { OpenNextConfig } from "@opennextjs/cloudflare";

/**
 * KIYOTA ARCHITECTURE: OPEN-NEXT CONFIG
 * We use type-casting to bypass the missing 'build' property in the 
 * current version of @opennextjs/cloudflare types.
 */
const config = {
  default: {
    override: {
      wrapper: "cloudflare-node",
      converter: "edge",
      proxyExternalRequest: "fetch",
      incrementalCache: "dummy",
      tagCache: "dummy",
      queue: "dummy",
    },
  },
  // Decouples the build command to prevent the infinite recursion loop
  build: {
    buildCommand: "npm run build",
  },
  // @ts-ignore
  edgeExternals: ["node:crypto"],
  middleware: {
    external: true,
    override: {
      wrapper: "cloudflare-edge",
      converter: "edge",
      proxyExternalRequest: "fetch",
      // @ts-ignore
      incrementalCache: "dummy",
      // @ts-ignore
      tagCache: "dummy",
      // @ts-ignore
      queue: "dummy",
    },
  },
} as OpenNextConfig; // This cast resolves the 'build' property error

export default config;