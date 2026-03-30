import type { OpenNextConfig } from "@opennextjs/cloudflare";

/**
 * KIYOTA ARCHITECTURE: OPEN-NEXT CONFIGURATION
 * Optimized for Cloudflare Workers / Pages
 */
const config: OpenNextConfig = {
  default: {
    // 'placement' determines if the code runs globally or near the data.
    // 'global' is the enterprise standard for low-latency coffee shop portals.
    placement: "global",
  },
  // We keep the config minimal to avoid version conflicts with the adapter
};

export default config;