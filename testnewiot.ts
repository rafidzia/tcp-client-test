import { createConnection, Socket } from "net"

function test(client: Socket) {
    client.write(Buffer.from("78782222170a02082f19cf00c7a5350c18c71000d08d01fe0a3e990096f50100010b88608d0d0a", "hex"))
}

let recycledImei: number[] = []



let countClient = 0

function run() {
    let testInterval: NodeJS.Timeout | null
    let imei: number
    if(recycledImei.length > 0){
        let tmpimei = recycledImei.pop()
        if(tmpimei){
            imei = tmpimei
        }else{
            imei = Math.floor(100000000000000 + Math.random() * 900000000000000)
        }
    }else{
        imei = Math.floor(100000000000000 + Math.random() * 900000000000000)
    }
    let client = createConnection({ 
        // host: "20.198.161.15", 
        host: "localhost",
        port: 1200,
        // port: 2000,
    }, () => {
        countClient++
        // console.log("connected to server")
        client.write(Buffer.from("787811010" + imei.toString() + "20082bc10bec39760d0a", "hex"))
        testInterval = setInterval(() => {
            test(client)
        }, 10000)

        
    })

    client.on('data', (data) => {
        if (data.toString("hex") == "7878050110014c4d0d0a") {
            client.write(Buffer.from("78780a1346060400020bef60b70d0a", "hex"))
        }
        if (["787813800b0000000056455253494f4e00021011da780d0a", "787812800c0000000056455253494f4e231011e1b50d0a"].includes(data.toString("hex"))) {
            client.write(Buffer.from("797900332100000000015b56455253494f4e5d4e5433375f47543831305f574141445f56332e315f3232303930372e313631380bed993e0d0a", "hex"))
        }
    });

    client.on("error", (err)=>{
        console.log(err)
    })
    
    client.on("close", ()=>{
        console.log("close")
    })

    setTimeout(() => {
        clearInterval(testInterval!)
        client.destroy()
        recycledImei.unshift(imei)
        countClient--
        setTimeout(() => {
            // @ts-ignore
            client = null
            testInterval = null
        }, 1000)
    }, 1200000)
}

setInterval(() => {
    console.log("client count: ", countClient)
}, 10000)

setInterval(() => {
    run()
}, 100)