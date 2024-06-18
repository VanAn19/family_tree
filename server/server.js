const app = require("./src/app");

const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
    console.log(`Server is running in ${PORT}..`);
});

process.on('SIGINT', () => {
    server.close(() => console.log(`Exit server express`));
});