'use strict'

const io = require("socket.io-client")
const readline = require("readline")
const rooms = require('./rooms.js')
const local = 'http://localhost:3030'
const heroku = 'https://hacker-chatroom.herokuapp.com'

let username = "anonymous"
// For local testing: http:localhost:3030
const socket = io.connect(local)
// const socket = io.connect('http://localhost:3030')

let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

socket.on('connect', (data) => {
    socket.emit('create', 'room1')
    console.log('Connected to Server')
    setName()
    // sendMessage() is called in setName
    rooms.getRooms.then((data) => {
        console.log(Object.keys(data));
    }).catch((err) => {
        console.log(err);
    })
})

socket.on('invalid', (error) => {
    console.log('error', error)
})

socket.on('test', (data) => {
    console.log('Recieved in test: ', data)
})

socket.on('general', (data) => {
    const date = new Date(data.date)
    const hour = date.getHours()
    const min = date.getMinutes()
      if (min < 10) {
        console.log(`${hour}:0${min} - ${data.name}`)
        console.log(`- ${data.message}`)
      } else {
    console.log(`${hour}:${min} - ${data.name}`)
    console.log(`- ${data.message}`)
    }
})

function setName() {
    rl.question("What should your username be? ", (uname) => {
        username = uname
        sendMessage()
    })
}

function sendMessage() {
	rl.question("What do u wana send ", (answer) => {
		if(answer === "quit"){
			rl.close
            process.exit()
		}
		socket.emit('general', {
			name: username,
			date: new Date(),
			message: answer
   		})
		sendMessage()
	})
}
