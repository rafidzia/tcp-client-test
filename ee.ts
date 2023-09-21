import EventEmitter from "events";

const ee = new EventEmitter();

async function asd(data: string){
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(data)
            resolve(true)
        }, 5000)
    })
}


ee.on("asd", ()=>{
    console.log("eee")
})

ee.prependListener("asd", async (data: string) => {
    await asd(data)
})





;(async ()=>{
    ee.emit("asd", {data: "asd"})


    console.log("second?")
})()