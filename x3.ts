interface P {
    gender: string
    femboying: () => void
}

interface Person {
    name: string,
    age: number
    gender: string
    femboying: () => void
}

// const Person = function(this: any){

// } as any as {new(): Person};

class Person implements P{
    
}

export {Person}
// creating objects
const person1 = new Person();
const person2 = new Person();

Person.prototype.name = 'Peter';
// adding property to constructor function
Person.prototype.gender = 'male';
Person.prototype.femboying = function () {
    this.gender = "female"
}

// prototype value of Person
console.log(Person.prototype);

// inheriting the property from prototype
console.log(person1.gender);
console.log(person2.gender);

person1.femboying()

console.log(person1.gender)
console.log(person2.gender);