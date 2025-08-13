import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Docs - SaLED",
  description: "Documentation for SaLED",
  ignoreDeadLinks: "localhostLinks",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Docs", link: "/introduction" },
      { text: "Gallery", link: "/gallery" },
      {
        text: "Guides",
        items: [
          { text: "For Users", link: "/user-guide" },
          { text: "For Developers", link: "/developer-guide" },
          { text: "API Reference", link: "/api-reference" },
        ],
      },
      { text: "Team", link: "/team" },
    ],

    footer: {
      message:
        'Released under the <a href="https://github.com/Sang-Buster/SaLED/blob/main/LICENSE">GPL-3.0 License</a>.',
      copyright:
        'Copyright © 2025-present <a href="https://www.eraus.edu">ERAU</a>',
    },

    search: {
      provider: "local",
    },

    editLink: {
      pattern: "https://github.com/Sang-Buster/SaLED-docs/edit/main/docs/:path",
      text: "Edit this page on GitHub",
    },

    sidebar: [
      {
        text: "Introduction",
        link: "/introduction",
      },
      {
        text: "Gallery",
        link: "/gallery",
      },
      {
        text: "Guides",
        collapsed: false,
        items: [
          { text: "For Users", link: "/user-guide" },
          { text: "For Developers", link: "/developer-guide" },
          { text: "API Reference", link: "/api-reference" },
        ],
      },
      {
        text: "Our Team",
        link: "/team",
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/Sang-Buster/SaLED" },
    ],
  },
});
