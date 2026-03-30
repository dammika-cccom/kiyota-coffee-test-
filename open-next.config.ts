import type { OpenNextConfig } from "@opennextjs/cloudflare";

/**
 * KIYOTA ARCHITECTURE: OPEN-NEXT CLOUDFLARE ENGINE
 * This configuration is mirrored exactly from the Cloudflare builder's 
 * validation requirements to ensure a zero-error handshake.
 */
const config: OpenNextConfig = {
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
  // @ts-ignore - Required by Cloudflare builder validation
  edgeExternals: ["node:crypto"],
  middleware: {
    external: true,
    override: {
      wrapper: "cloudflare-edge",
      converter: "edge",
      proxyExternalRequest: "fetch",
      // @ts-ignore - Required by Cloudflare builder validation
      incrementalCache: "dummy",
      // @ts-ignore - Required by Cloudflare builder validation
      tagCache: "dummy",
      // @ts-ignore - Required by Cloudflare builder validation
      queue: "dummy",
    },
  },
};

export default config;