export default {
  // Server configuration
  server: {
    port: 9999,
    host: 'localhost'
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Microsoft Clarity テストサイト',
    htmlAttrs: {
      lang: 'ja'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'ヒートマップとユーザーレコーディングのテスト用サイトです' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
    script: [
      {
        hid: 'clarity',
        innerHTML: `
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "sjt8px4zd6");
        `
      },
      {
        hid: 'ptengine',
        src: 'https://js.ptengine.jp/448y81wd.js'
      },
      {
        hid: 'mouseflow',
        innerHTML: `
          window._mfq = window._mfq || [];
          (function() {
            var mf = document.createElement("script");
            mf.type = "text/javascript"; mf.defer = true;
            mf.src = "//cdn.mouseflow.com/projects/f1531bc1-b213-48e2-bb74-808f9d9206fd.js";
            document.getElementsByTagName("head")[0].appendChild(mf);
          })();
        `
      }
    ],
    __dangerouslyDisableSanitizersByTagID: {
      'clarity': ['innerHTML'],
      'mouseflow': ['innerHTML']
    }
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    '@nuxt/typescript-build',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
  ],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  },

  // Server-side rendering configuration  
  ssr: true,
  target: 'server'
}