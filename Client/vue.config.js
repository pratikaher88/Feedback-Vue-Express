module.exports = {
    devServer: {
      proxy: {
        "^/api/": {
          target: "http://localhost:3000",
          pathRewrite: { "^/api/": "/api/" },
          changeOrigin: true,
          logLevel: "debug"
        }
      }
    },
    runtimeCompiler: true

  };