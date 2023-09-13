import net from "node:net"
import test from "./test"

function run(){
  const client = net.createConnection({ port: 8080 }, () => {
      console.log("connected to server")
      test(client) 
      setInterval(()=>{
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
    client.end()
  }, 600000)
}


setInterval(()=>{
  run()
}, 1000)