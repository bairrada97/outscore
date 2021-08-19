export default {
    // Target (https://go.nuxtjs.dev/config-target)

    target: "server",

    // Global page headers (https://go.nuxtjs.dev/config-head)
    head: {
        title: "outscore",
        meta: [
            {
                charset: "utf-8"
            },
            {
                name: "viewport",
                content: "width=device-width, initial-scale=1"
            },
            {
                hid: "description",
                name: "description",
                content: ""
            }
        ],
        link: [
            {
                rel: "icon",
                type: "image/x-icon",
                href: "/favicon.png"
            }
        ]
    },

    // Global CSS (https://go.nuxtjs.dev/config-css)
    css: [],

    styleResources: {
        // your settings here

        scss: ["@/assets/styles/*.scss"]
    },

    // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
    plugins: [],

    // Auto import components (https://go.nuxtjs.dev/config-components)
    components: true,

    // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
    buildModules: ["@nuxtjs/html-validator", "@nuxtjs/style-resources"],

    // Modules (https://go.nuxtjs.dev/config-modules)
    modules: [
        "@nuxtjs/composition-api",
        // https://go.nuxtjs.dev/axios
        "@nuxtjs/axios",
        // https://go.nuxtjs.dev/pwa
        "@nuxtjs/pwa",
        // https://go.nuxtjs.dev/content
        "@nuxt/content",
        "@nuxtjs/sitemap",
        "nuxt-precompress",
        "@nuxt/image",
        [
            "nuxt-compress",
            {
                gzip: {
                    cache: true
                },
                brotli: {
                    threshold: 10240
                }
            }
        ]
        // "@nuxtjs/robots"
    ],

    // Axios module configuration (https://go.nuxtjs.dev/config-axios)
    axios: {
        proxy: true
    },

    proxy: {
        "/api/": {
            target: "https://outscore-test.netlify.app/.netlify/functions/api/",
            pathRewrite: {
                "^/api/": ""
            }
        }
    },

    sitemap: {
        hostname: "https://outscore-app.herokuapp",
        gzip: true,
        exclude: [""]
    },

    // robots: {
    // 	UserAgent: "*",
    // 	Disallow: "/"
    //   },

    pwa: {
        manifest: {
            name: "Outscore",
            lang: "en",
            useWebmanifestExtension: false,
            cacheAssets: true,
            theme_color: "#187c56",
            background_color: " #187c56"
        },
         workbox: {
            runtimeCaching: [
                {
                    // Should be a regex string. Compiles into new RegExp('https://my-cdn.com/.*')
                    urlPattern: 'https://api-football-v3.herokuapp.com/api/v3/.*',
                    strategyPlugins: [{
                    use: 'Expiration',
                    config: {
                        maxAgeSeconds: 15
                    }
                    }]
                    // Defaults to `NetworkFirst` if omitted
                    // handler: 'NetworkFirst',
                    // Defaults to `GET` if omitted
                    // method: 'GET'
                },
                {
                    // Should be a regex string. Compiles into new RegExp('https://my-cdn.com/.*')
                    urlPattern: 'https://media.api-sports.io/football/.*',
                    strategyPlugins: [{
                    use: 'Expiration',
                    config: {
                         maxEntries: 100,
                    }
                    }]
                    // Defaults to `NetworkFirst` if omitted
                    // handler: 'NetworkFirst',
                    // Defaults to `GET` if omitted
                    // method: 'GET'
                }
            ]
         }
    },

    generate: {
        fallback: true
    },
    image: {
        presets: {
            team: {
                modifiers: {
                    format: "webp",
                    width: 48,
                    height: 48
                }
            }
        },
        domains: ["https://media.api-sports.io"]
    },

    // Content module configuration (https://go.nuxtjs.dev/content-config)
    content: {},

    // Build Configuration (https://go.nuxtjs.dev/config-build)
    build: {
        extractCSS: true,
        babel: {
            plugins: ["@babel/plugin-proposal-optional-chaining"]
        }
    },
    
    storybook: {
        // Options
        parameters: {
            layout: "fullscreen"
        }
    }
};
