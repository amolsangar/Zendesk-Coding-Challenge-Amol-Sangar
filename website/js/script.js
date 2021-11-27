// =======================================================

let totalTicketCount = 0
const getTotalTicketCount = async () => {
    return new Promise(async (resolve, reject) => {
        const response = await fetch('/count');
        const myJson = await response.json();       //extract JSON from the http response
        
        if(response.status != 200) {
            errorHandler(myJson.message)
        }

        totalTicketCount = parseInt(myJson.count.value)
        resolve(myJson.count.value);
    });
}

// =======================================================

getTotalTicketCount().then((ticketCount) => {  
    let page_start = 0
    let page_end = page_start + 10

    if(page_end > totalTicketCount/page_size)
        page_end = totalTicketCount/page_size
    
    changePagination(page_start,page_end,0)
    
});

// =======================================================
// PAGINATION HANDLER

function changePagination(page_start,page_end,displayTicketNo) {
    document.getElementById("page_count").innerHTML = ""
    if(page_start != 0) {
        let prev = `<li class="page-item"> <a class="page-link" href="#" tabindex="-1" onclick="pagePrev(${page_start},${page_end})">Previous</a> </li>`
        document.getElementById("page_count").innerHTML = prev;
    }

    for(let i=page_start; i<page_end; i++) {
        let template
        if(i == displayTicketNo) {
            template = `<li class="page-item active"><a class="page-link" href="#" onclick="displayTickets(${i+1})">${i+1}</a></li>`
        }
        else {
            template = `<li class="page-item"><a class="page-link" href="#" onclick="displayTickets(${i+1})">${i+1}</a></li>`
        }

        document.getElementById("page_count").innerHTML += template;
    }
    
    if(page_end < totalTicketCount/page_size) {
        let next = `<li class="page-item"> <a class="page-link" href="#" onclick="pageNext(${page_start},${page_end})">Next</a> </li>`
        document.getElementById("page_count").innerHTML += next;
    }

    // Remove and add pagination active class
    var pagination_ul = document.getElementById("page_count");
    var btns = pagination_ul.getElementsByClassName("page-item");
    for (var i = 0; i < btns.length; i++) {
        if(btns[i].innerText != "Next" && btns[i].innerText != "Previous") {
            btns[i].addEventListener("click", function() {
                var current = document.getElementsByClassName("active");
                current[0].className = current[0].className.replace(" active", "");
                this.className += " active";
            });
        }
    }
    displayTickets(displayTicketNo+1)
}

// =======================================================

function pageNext(page_start,page_end) {
    page_start += 10
    page_end = page_start + 10

    if(page_end > totalTicketCount/page_size)
        page_end = totalTicketCount/page_size

    let displayTicketNo = page_start
    changePagination(page_start,page_end,displayTicketNo)
}

// =======================================================

function pagePrev(page_start,page_end) {
    page_start -= 10

    if(page_start < 0)
        page_start = 0

    page_end = page_start + 10

    let displayTicketNo = page_end-1
    changePagination(page_start,page_end,displayTicketNo)
}

// =======================================================

let page_size = 25

const fetchTickets = async (page) => {
    return new Promise(async (resolve, reject) => {
        const response = await fetch(`/get_tickets_per_page?page=${page}&page_size=${page_size}`);
        const myJson = await response.json();       //extract JSON from the http response

        if(response.status != 200) {
            errorHandler(myJson.message)
        }
        
        resolve(myJson);
    });
}

// =======================================================
// LIST VIEW TICKET DISPLAY

let currentTicketDetails = {}
function displayTickets(page) {
    document.getElementById("ticket_details_list").innerHTML = ""

    fetchTickets(page).then((ticketDetails) => {
        currentTicketDetails = ticketDetails
        document.getElementById("ticket_details_list").innerHTML = ""

        let displayLength = Object.keys(ticketDetails.tickets).length
        
        for(let i=0; i<displayLength; i++) {
            let subject = ticketDetails.tickets[i].subject.toString().slice(0,50)
            let desc = ticketDetails.tickets[i].description.toString().slice(0,60)
            let id = ticketDetails.tickets[i].id.toString()
            let state = ticketDetails.tickets[i].status.toString().toUpperCase()
            let state_class = "badge"

            if(state == "OPEN") {
                state_class = "badge badge-danger"
            }
            else if(state == "PENDING") {
                state_class = "badge badge-primary"
            }
            else if(state == "SOLVED") {
                state_class = "badge badge-success"
            }

            let template = `<li class="list-group-item list-padding" data-toggle="modal" data-target="#issue" data-id="${i}">
                            <div class="media">
                                <div class="media-body">
                                    <strong>${subject}</strong> 
                                    <span class="${state_class} pull-right">${state}</span>
                                    <p class="info">${desc}... <span class="number pull-right"># ${id}</span> </p>
                                </div>
                            </div>
                        </li>`

            document.getElementById("ticket_details_list").innerHTML += template;
        }
    })
}

// =======================================================
// SINGLE TICKET DISPLAY
// Dynamic Modal Handler 

$('#issue').on('show.bs.modal', 
function (event) {

    // Button that triggered the modal
    var li = $(event.relatedTarget)

    // Extract info from data attributes 
    var i = li.data('id')

    let subject = currentTicketDetails.tickets[i].subject.toString()
    let desc = currentTicketDetails.tickets[i].description.toString()
    let state = currentTicketDetails.tickets[i].status.toString().toUpperCase()
    let id = currentTicketDetails.tickets[i].id.toString()
    let requester_id = currentTicketDetails.tickets[i].requester_id.toString()
    let created = new Date(currentTicketDetails.tickets[i].created_at.toString())

    let state_class = "badge"
    if(state == "OPEN") {
        state_class = "badge badge-danger"
    }
    else if(state == "PENDING") {
        state_class = "badge badge-primary"
    }
    else if(state == "SOLVED") {
        state_class = "badge badge-success"
    }

    // Updating the modal content using 
    // jQuery query selectors
    var modal = $(this)

    modal.find('.modal-title').html(`<div class="media-body"><b>Ticket #${id}</b> <span class="${state_class} pull-right">${state}</span></div>`)
    
    desc = desc.replaceAll('\n', '<br/>')

    modal.find('.modal-body')
    .html(`
    <p style="
    margin-left: 10px;
    margin-right: 10px;">
    <b>${subject}</b><br/>
    ${desc}
    <hr/ style="margin-top: 0rem;  margin-bottom: 0rem;">
    <small class="">Requestor #${requester_id}</small>
    <small  class="pull-right">${created.toDateString()}</small>
    </p>
    `);

})

// =======================================================
// DISPLAY ERROR MESSAGE HANDLER

function errorHandler(message) {
    document.getElementById("error_message").innerHTML = message
}

// =======================================================
