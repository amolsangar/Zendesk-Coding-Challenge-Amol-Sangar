const server = require(__dirname+'/scripts/server.js');

// =======================================================
// SERVER START
const port = 7777
server.listen(port, (error) => {
    if (error) {
        console.error('Error starting server: ', error);
    } else {
        console.log(`Server started at http://localhost:${port}`);
    }
})
