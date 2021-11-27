'use-strict'
const path = require('path');
const ZendeskApiHandler = require(path.join(__dirname,'../scripts/ZendeskApiHandler.js'))

require('dotenv').config()
let TOKEN = process.env.TOKEN
let subdomain = process.env.SUBDOMAIN
let emailAddress = process.env.EMAIL

describe('ZendeskApiHandler', () => {
  
    it('API call with CORRECT credentials - getTicketCount', async () => {
        let apiHandler = new ZendeskApiHandler(subdomain,emailAddress,TOKEN)
        const result = await apiHandler.getTicketCount()
        expect(result.count).toBeTruthy()
    })

    it('API call with CORRECT credentials - getTicketsByPage', async () => {
        let apiHandler = new ZendeskApiHandler(subdomain,emailAddress,TOKEN)
        const result = await apiHandler.getTicketsByPage(1,3)
        expect(result.tickets).toBeTruthy()
    })

    it('API call with INCORRECT credentials', async () => {
        let thrownError
        try {
            let apiHandler = new ZendeskApiHandler(subdomain,emailAddress,"SOME_RANDOM_TOKEN_TEXT")
            const result = await apiHandler.getTicketsByPage(1,3)
        }
        catch(error) {
            thrownError = error;
        }
        
        let expectedErrorObj = {                                             
            "status": 401,                                             
            "statusText": "Unauthorized : Couldn't authenticate you",  
        }                                                            
        
        expect(thrownError).toEqual(expectedErrorObj)
    })

    it('getTicketsByPage API call - Invalid Page Number', async () => {
        try {
            let apiHandler = new ZendeskApiHandler(subdomain,emailAddress,TOKEN)
            const result = await apiHandler.getTicketsByPage(-1,3)
        }
        catch(error) {
            thrownError = error;
        }
        
        let expectedErrorObj = {                                             
            "status": 400,                                             
            "statusText":"Bad Request : Invalid Ticket Id"
        }                                                            
        
        expect(thrownError).toEqual(expectedErrorObj)
    })
    
})