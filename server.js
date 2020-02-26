const browserSync = require('browser-sync');
const routes = require('./app/routes');
const config = require('./app/config');
const { App } = require('./app');

// Routes
const app = new App().createApp();
app.use('/', routes);

// Run application on configured port
if (config.env === 'development') {
  app.listen(config.port, () => {
    browserSync({
      files: ['app/views/**/*.*', 'public/**/*.*'],
      notify: true,
      open: false,
      port: config.port,
      proxy: `localhost:${config.port}`,
      ui: false,
    });
  });
} else {
  app.listen(config.port);
}
