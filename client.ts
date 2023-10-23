import {createConnection} from "net"
import test from "./test"

function run(){
  let testInterval: NodeJS.Timeout | null
  let client = createConnection({ host: "127.0.0.1", port: 2000 }, () => {
      // console.log("connected to server")
      test(client) 
      testInterval = setInterval(()=>{
        test(client) 
      }, 5000)
  })

  // client.on('data', (data) => {
  //   console.log(data.toString());
  // });

  // client.on('end', () => {
  //   console.log('disconnected from server');
  // }); 

  // client.on("close", ()=>{
  //   console.log("close")
  // })

  setTimeout(()=>{
    clearInterval(testInterval!)
    client.destroy()
    setTimeout(()=>{
      // @ts-ignore
      client = null
      testInterval = null
    }, 1000)
  }, 600000)
}


setInterval(()=>{
  run()
}, 500)