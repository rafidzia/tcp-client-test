// class X {
//     constructor(public x: number) { 
//         console.log(`X constructor ${x}`)
//     }
// }
// let count = 0
// class A{
//     x = new X(++count)
// }


// let o = new A()
// let z = new A()

// console.log(o.x === z.x)



// const data = Buffer.from("7878222217081d083632c700c7a5180c18c5a000d0c001fe0a3e990096f50100010032a1fe0d0a", "hex")

// let hexdata = data.toString("hex")



// console.log(Buffer.from(hexdata, "hex").toString("utf-8"))

export function range(start: number, stop: number | undefined = undefined, step = 1) {
    if (!stop) {
        stop = start;
        start = 0;
    }
    return {
        [Symbol.iterator]: function* () {
            while (start < stop!) {
                yield start
                start += step
            }
        },
    };
}

export function defineTarget(targetId: number){
    let target = []
    let binerTarget = Array.from(targetId.toString(2)).reverse()
    console.log(binerTarget)
    for (let flag of range(binerTarget.length)){
        if (binerTarget[flag] == '1'){
            target.push(`P${flag+1}`)
        }
    }
    return target
}

// for(let i of range(17)){
//     let x = defineTarget(i)
//     console.log(x)
// }

function extractTarget(arrayTarget: string[]){
    let target = 0
    for (let i of range(arrayTarget.length)){
        let x = Number(arrayTarget[i].slice(1, arrayTarget[i].length))
        target += 2**(x-1)
    }
    return target
}

console.log(extractTarget(['P3', 'P5']))

// let x = binaryToPArray(20)

// console.log(x)

// function pArrayToBinary(pArray: string[]) {
//     const binaryArray = [];
//     let currentNumber = 1;
  
//     for (let i = 0; i < pArray.length; i++) {
//       const currentP = pArray[i];
//       const matches = currentP.match(/^P(\d+)$/);
  
//       if (matches && matches.length === 2) {
//         const number = parseInt(matches[1]);
//         while (currentNumber < number) {
//           binaryArray.push('0');
//           currentNumber++;
//         }
//         binaryArray.push('1');
//         currentNumber++;
//       }
//     }
  
//     return parseInt(binaryArray.join(''), 2);
//   }


//   console.log(pArrayToBinary(x))

// // let o = 0

// // x.forEach((y)=>{
// //     let num = Number(y.slice(1, y.length))
// //     console.log(num.toString(2))
// // })

// // console.log(o)