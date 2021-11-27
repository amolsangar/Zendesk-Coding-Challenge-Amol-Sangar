const express = require('express');
const path = require('path');
const ZendeskApiHandler = require(__dirname+'/zendeskApiHandler')

// =======================================================
// SERVER SETUP

const server = express();
server.use(express.json());
server.use(express.static("website"));

// default URL for website
server.get('/', function(req,res){
    res.sendFile(path.join(__dirname+'/website/index.html'));
});

// =======================================================
// ERROR HANDLER

server.use((error, req, res, next) => {
  res.json({ message: error.message });
})

// =======================================================
// INITIALIZATION

require('dotenv').config()
let TOKEN = process.env.TOKEN

let subdomain = process.env.SUBDOMAIN
let emailAddress = process.env.EMAIL

let apiHandler = new ZendeskApiHandler(subdomain,emailAddress,TOKEN)

// =======================================================
// FETCHES TICKETS PER PAGE

/* Parameters - 
1. page number (page)
2. number of ticktes per page (page_size)*/

server.get('/get_tickets_per_page', function(req, res) {
    let page_size = 25
    if(req.query.page_size) {
        page_size = parseInt(req.query.page_size)
    }

    let page = 1
    if(req.query.page) {
        page = parseInt(req.query.page)
    }
    
    apiHandler.getTicketsByPage(page,page_size).then((tickets) => {
        res.send(tickets)
    })
    .catch((response) => {
        res.status(response.status).send({ message: response.statusText })
    })

});

// =======================================================
// FETCHES ALL TICKETS UPTO COUNT LIMIT 100

server.get('/get_all_tickets', function(req, res) {
    apiHandler.getTickets().then((tickets) => {
        res.send(tickets)
    })
    .catch((response) => {
        res.status(response.status).send({ message: response.statusText })
    })

});

// =======================================================
// GET TOTAL TICKET COUNT FOR PAGINATION PURPOSE

server.get('/count', function(req, res) {
    apiHandler.getTicketCount().then((ticketCount) => {
        res.send(ticketCount)
    })
    .catch((response) => {
        res.status(response.status).send({ message: response.statusText })
    })

});

// =======================================================

module.exports = server