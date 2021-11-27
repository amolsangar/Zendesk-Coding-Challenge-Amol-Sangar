'use-strict'
const path = require('path');
const supertest = require("supertest");
const server = require(path.join(__dirname,'../scripts/server.js'));

const port = 7777
server.listen(port, (error) => {
    if (error) {
        console.error('Error starting server: ', error);
    } else {
        console.log(`Server started at http://localhost:${port}`);
    }
})

describe('Server Testing', () => {

    test("Main Page Test - GET /", async () => {
        await supertest(server).get("/").expect(200)
    });

    test("GET /count", async () => {
        await supertest(server).get("/count").expect(200)
    });

    test("GET /get_tickets_per_page", async () => {
        await supertest(server).get("/get_tickets_per_page?page=1&page_size=5").expect(200)
    });

    test("Wrong parameters - GET /get_tickets_per_page", async () => {
        await supertest(server).get("/get_tickets_per_page?page=-1&page_size=5").expect(400)
    });
    
})