const path = require('path');
const fs = require('fs');

class Ticket {
    constructor(numero, escritorio){
        this.numero = numero;
        this.escritorio = escritorio;
    }
}

class TicketControl {

    constructor(){
        this.ultimo = 0;
        this.hoy = new Date().getDate();
        this.tickets = [];
        this.ultimos4 = [];
    
        this.init();
    }

    get toJson(){
        return{
            ultimo: this.ultimo,
            hoy: this.hoy,
            tickets: this.tickets,
            ultimos4: this.ultimos4
        }
    }

    init(){
        const { hoy, tickets, ultimos4, ultimo } = require('../db/data.json');// Lee el archivo json directamente
        if( hoy === this.hoy){
            this.tickets = tickets;
            this.ultimo = ultimo;
            this.ultimos4 = ultimos4;
        }else{
            // Es otro dia
            this.guardarDB();
        }
    }

    guardarDB(){

        const dbPath = path.join( __dirname, '../db/data.json');
        fs.writeFileSync( dbPath, JSON.stringify( this.toJson ) );

    }

    siguiente(){
        this.ultimo += 1;
        const ticket = new Ticket(this.ultimo, null);
        this.tickets.push( ticket );// Agrego el ticket al arreglo de tickets

        this.guardarDB();
        return 'Ticket ' + ticket.numero;
    }

    atenderTicket(escritorio){

        // No tenemos tickets
        if(this.tickets.length === 0){
            return null;
        }

        // Si tengo tickets
        const ticket = this.tickets.shift();// Extrae el primer elemento del arreglo y lo borra

        ticket.escritorio = escritorio;// Este es el ticket que tengo que atender ahora

        this.ultimos4.unshift(ticket);// Aniade un elemento nuevo al arreglo a la primera posicion
        if(this.ultimos4.length > 4){
            this.ultimos4.splice(-1,1);// (-1, quiero empezar en el menos 1, (1) quiero cortar el primer elemento)
        }

        this.guardarDB();
        return ticket;
    }

}


module.exports = TicketControl;