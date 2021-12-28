
async function sendOffer(localDescription){
    let answer = await fetch("http://localhost:8081/offer", { 
        method: "POST",
        body: JSON.stringify(localDescription),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    let body = await answer.json();
    if(!body.error){
        await rtcPeerConnection.setRemoteDescription(body);
    }
}

async function openDataChannel(){
    dataChannel = rtcPeerConnection.createDataChannel("channel");
    dataChannel.onerror = function (error) {
        console.log("Data Channel Error:", error);
    };

    dataChannel.onmessage = (event) => { 
        console.log(event.data);
    };

    dataChannel.onopen = function () {
        console.log("dataChanell Open");
        dataChannel.send("first message test :)")

    };

    dataChannel.onclose = function () {
        console.log("dataChanell Closed");
    };
}


window.onload = async () => {
    var configuration = {
        "iceServers": [
            { 
                "url": "stun:stun.l.google.com:19302" 
            }
        ]
    };
    rtcPeerConnection = new RTCPeerConnection(configuration);
    await openDataChannel();
    rtcPeerConnection.onicecandidate = (event) =>{
        if(event.candidate){
            sendOffer(rtcPeerConnection.localDescription);
        }
    } 
    let offer = await rtcPeerConnection.createOffer();
    await rtcPeerConnection.setLocalDescription(offer);

}
var rtcPeerConnection, dataChannel;