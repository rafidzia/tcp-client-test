function onlyEven(value) {return value % 2 == 0;}
function timesTwo(value) {return value * 2;}
function sum(a, b) {return a + b;}

console.time('test arr');
let asd = Array.from(Array(100000000).keys())
    .filter(onlyEven)
    .map(timesTwo)
    .reduce(sum, 1000);

console.timeEnd('test arr');