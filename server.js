const app = require('./app');

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`your server is flying 🚀 on port ${port}`);
});