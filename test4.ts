


// import Jackd from "jackd"
// import { Socket } from 'net'


// const s = new Socket()
// // const client = 
// //@ts-ignore
// let a: { x?: Jackd } = {};
// let b: { x?: boolean } = {};
// let c: { x?: number } = {};

// let tolol = async (seq: number) => {

//     try {
//         if (!a.x) {
//             a.x = new Jackd();
//             await a.x.connect({
//                 host: "127.0.0.1",
//                 port: 11300
//             })
//             await a.x.use("PACKET")
//             b.x = true
//         }
//         // console.log(seq)
//         if (b.x) {
//             await a.x.put("asd", {
//                 priority: 10,
//                 delay: 0,
//                 ttr: 60
//             })
//             console.log("berhasil")
//             return true
//         } else {
//             if(!c.x) c.x = Date.now()
//             return await new Promise((resolve, reject)=>{
//                 setTimeout(() => {
//                     if(Date.now() - c.x! > 1000) {
//                         console.log("timeout")
//                         reject()
//                     }else{
//                         resolve(tolol(seq))
//                     }

//                 }, 1)
//             })
//         }

//     } catch (err) {
//         try {
//             if(b.x) await a.x?.disconnect()
//             delete a.x
//             delete b.x
//             delete c.x
//         } catch (err1) {
//             console.log(err1)
//         }
//         console.log("oo")
//     }
// }

// tolol(1)
// tolol(2)



// setTimeout(() => {
//     // tolol(3)
//     console.log("asdasd")
//     console.log(a)
//     console.log(b)
//     console.log(c)
// }, 5000)


abstract class Asd{
    #test: any

    setTest(x: any){
        this.#test = x
    }
}


class Asd2 extends Asd{
    
}

let asd = new Asd2()
Object.freeze(asd)

// asd.test = 'x'
asd.setTest('x')

// asd.test()

// console.log(asd.x)

// asd.test = function(){}







// function asd1() {
//     console.log(1)
// }
// async function asd3() {
//     setTimeout(() => {
//         console.log(3)
//     }, 5000)
// }

// function asd2() {
//     asd3()
//     throw "asd"
//     console.log(2)
// }


// try {
//     asd1()
//     asd2()
//     // asd3()
// } catch (err) { }