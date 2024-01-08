const app = require('./index');
const server = app.listen(5009, () => {
  console.log(`Express is running on port ${server.address().port} http://localhost:5009`);
});
