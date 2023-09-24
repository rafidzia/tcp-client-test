class X {
    constructor(public x: number) { 
        console.log(`X constructor ${x}`)
    }
}
let count = 0
class A{
    x = new X(++count)
}


let o = new A()
let z = new A()

console.log(o.x === z.x)