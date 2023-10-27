import Beanlstakd from "beanstalkd"
import cluster from "cluster";

const client = new Beanlstakd("127.0.0.1", 11300)


if (cluster.isPrimary) {

    for (let i = 0; i < 16; i++) {
        cluster.fork()
    }
    cluster.on("fork", (worker) => {
        console.log(`worker ${worker.process.pid} forked`);
    })
    cluster.on("exit", (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
        cluster.fork()
    })
} else {
    ; (async () => {
        await client.connect()
        await client.watch("PACKET")

        while (true) {
            let job = await client.reserve()
            // console.log(job[0])
            console.log(job[1].toString("hex"))
            client.delete(Number(job[0]))

        }
    })()
}