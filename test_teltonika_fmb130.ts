import { createConnection, Socket } from "net"

const arrData = [
    "00000000000000648e010000018b8a49df38004334533afbaadd33004a00cb0900000000000f000700ef0100f00100150500010100b300007100010701000500422f690043000000440000000600da010ef0e1000300f10000c74200100041bc010132000b0a9500000000010000db96",
    "00000000000000648e010000018b8a4a2d58004334539efbaad9f2004300a20900000000000f000700ef0100f00100150500010100b300007100010701000500422f890043000000440000000600da010ef0e1000300f10000c74200100041bc0d0132000b0a9500000000010000c083",
    "00000000000000648e010000018b8a4a7b7800433453f1fbaadb60004201400b00000000000f000700ef0100f00100150500010100b300007100010701000500422f980043000000440000000600da010ef0e1000300f10000c74200100041bc110132000b0a9500000000010000a738",

]

function test(client: Socket) {
    client.write(Buffer.from(arrData[Math.floor(Math.random() * arrData.length)], "hex"))
}

let recycledImei: number[] = []



let countClient = 0

function run() {
    let testInterval: NodeJS.Timeout | null
    // let imei: number = 353701095393621
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

    let sendAllowed = false

    let client = createConnection({ 
        // host: "20.198.161.15",
        host: "localhost",
        // port: 1200,
        port: 2000,
    }, () => {
        countClient++
        // console.log("connected to server")
        client.write(Buffer.from("000f3" + imei.toString().split("").join("3") + "3038373332", "hex"))
        testInterval = setInterval(() => {
            if(sendAllowed) test(client)
        }, 10000)

        
    })

    client.on('data', (data) => {
        if(data.toString("hex") == "000000000000000e0c010500000006676574766572010000a4c2"){
            client.write(Buffer.from("000000000000009f0c0106000000975665723a30332e32372e30375f3030204750533a41584e5f352e312e392048773a464d42313330204d6f643a343320494d45493a33353730373332393534303837333220496e69743a323032332d31312d3120363a353820557074696d653a3130323431204d41433a303031453432374143454344205350433a312830292041584c3a32204f42443a3020424c3a312e31302042543a34010000621a", "hex"))
            sendAllowed = true
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


// 000f333537303733323935343038373332

// 000000000000009f0c0106000000975665723a30332e32372e30375f3030204750533a41584e5f352e312e392048773a464d42313330204d6f643a343320494d45493a33353730373332393534303837333220496e69743a323032332d31312d3120363a353820557074696d653a3130323431204d41433a303031453432374143454344205350433a312830292041584c3a32204f42443a3020424c3a312e31302042543a34010000621a

// 00000000000000648e010000018b8a49df38004334533afbaadd33004a00cb0900000000000f000700ef0100f00100150500010100b300007100010701000500422f690043000000440000000600da010ef0e1000300f10000c74200100041bc010132000b0a9500000000010000db96