const WebSocket = require('ws')

const wss = new WebSocket.Server({ port: 8084 })

wss.on("connection", ws => {
    console.log("new client connected")
    ws.on("message", (data) => {
        const json = JSON.parse(data)
        wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(json));
            }
        })
    })
})
// ws.on("close", () =>{
//     console.log(ws, "is gone")
// })