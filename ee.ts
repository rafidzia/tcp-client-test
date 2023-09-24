import EventEmitter from "events";

const ee = new EventEmitter();

console.log(ee.removeAllListeners("asd"))

// async function asd(data: string){
//     return new Promise((resolve) => {
//         setTimeout(() => {
//             console.log(data)
//             resolve(true)
//         }, 5000)
//     })
// }


// ee.on("asd", ()=>{
//     console.log("eee")
// })

// ee.prependListener("asd", async (data: string) => {
//     await asd(data)
// })


// ee.on("asd", ()=>{
//     let count = 0
//     for(let i = 0 ; i < 1000000000; i++){
//         count++
//     }
//     console.log("count", count)
// })




// ;(async ()=>{
//     ee.emit("asd", "first?")


//     console.log("second?")
// })()