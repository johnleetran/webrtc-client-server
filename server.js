let express = require('express');
let app = express();
let bodyParser = require('body-parser')
let webRTC = require('wrtc');
let rtcPeerConnection = new webRTC.RTCPeerConnection();
// create application/json parser

let jsonParser = bodyParser.json()
let textParser = bodyParser.text();

app.use( (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.post("/offer", jsonParser, async (req, res) => {
    let answer = {};
    try{
        // console.log("offer made", req.body);
        let offer = req.body;
        // rtcPeerConnection.onicecandidate = (event) => {
        //     console.log(rtcPeerConnection.localDescription);
        // };
        rtcPeerConnection.ondatachannel = (event) => {
            rtcPeerConnection.dc = event.channel;
            rtcPeerConnection.dc.onmessage = (event) => {
                console.log("message:", event.data)
            };
            rtcPeerConnection.dc.onopen = (event) => {
                console.log("connection open")
            };
        };
        await rtcPeerConnection.setRemoteDescription(offer);
        answer = await rtcPeerConnection.createAnswer();
        await rtcPeerConnection.setLocalDescription(answer)

    }catch(err){
        console.log(err);
        res.json({'error': err.message})
    }
    res.json(answer)
    
})

app.listen(8081, ()=>{
    console.log("http://localhost:8081")
})