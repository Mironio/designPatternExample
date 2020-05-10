//Swapnil_tripathi
//Creational Design Pattern

// Factory Design

class Person {
    constructor(name='unnamed person')  {
        this.name = name;
    }
}

class Shopper extends Person {
    constructor(name, money=0) {
        super(name);
        this.money = money;
        this.employed = false;
    }
}

class Employee extends Shopper {
    constructor(name, money=0, employer='') {
        super(name, money);
        this.employerName = employer;
        this.employed = true;
    }
}

class PersonFactory {
    constructor(type, name, money=0) {
        switch (type) {
            case 'Employee':
                return new Employee(name, money);
            case 'Shopper':
                return new Shopper(name, money);
            case 'Person':
                return new Person(name);
                // it'd be better to have a default case for unsupported types and throw an Error
        }
    }
}
console.log(new PersonFactory('Shopper','Swapnil',100));

//------------------------------------------------------------------------------
// Structural Design pattern
// A

class OldCalculator {
    constructor() {
        this.operations = function(term1, term2, operation) {
            switch (operation) {
                case 'add':
                    return { res: term1 + term2 }; // // we can simplify this part and return just number
                case 'sub':
                    return { res: term1 - term2 }; // we can simplify this part and return just number
                default:
                    return NaN;
            }
        };
    }
}

class NewCalculator {
    constructor() {
        this.multiply = function(term1, term2) {
            return term1 * term2;
        };
        this.divide = function(term1, term2) {
            return term1 / term2;
        };
    }
}

// Good. Traditionally we tend to move functions in constructor to methods like this:
/*
class NewCalculator {
    multiply(num1, num2) {
        return num1 * num2;
    }
    divide(num1, num2) {
        return num1 / num2;
    }
}
*/
// Another alternative.
/*
class NewCalculator {
    multiply = (num1, num2) => num1 * num2;
    divide = (num1, num2) => num1 / num2;
}
*/

const OPERATION = {
    MULTIPLY: 'multiply',
    DIVIDE: 'divide',
    ADD: 'add',
    SUBSTRACT: 'sub',
};

// (B) Facade Pattern
class UltimateCalculator {
    constructor() {
        this.calculator = Object.assign(new NewCalculator(), new OldCalculator());
        // Good. But can be risky. What if NewCalculator and OldCalculator have methods with the same names?
    }

    calculate(first, second, operation) {
        switch (operation) {
            case OPERATION.MULTIPLY:
                return this.calculator.multiply(first, second);
            case OPERATION.DIVIDE:
                return this.calculator.divide(first, second);
            case OPERATION.ADD:
            case OPERATION.SUBSTRACT:
                return this.calculator.operations(first, second, operation).res;
            default:
                return this.calculator.operations(first, second, operation);
        }
    }

    add(first, second) {
        return this.calculate(first, second, OPERATION.ADD);
    }

    sub(first, second) {
        return this.calculate(first, second, OPERATION.SUBSTRACT);
    }

    multiply(first, second) {
        return this.calculate(first, second, OPERATION.MULTIPLY);
    }

    divide(first, second) {
        return this.calculate(first, second, OPERATION.DIVIDE);
    }
}

// clever calculator


// (C) Decorator Pattern
class CleverCalculator extends UltimateCalculator {

    constructor() {
        super();
        this.state = {};
    }

    operations(first, second, operation) {

        const key = `${first}${operation}${second}`;
        let value = this.state[key];

        if (value) {
            return value;
        }

        value = super.calculate(first, second, operation);
        this.state[key] = value;
        return value;
    }
}
// (D)


class LoggerCalculator extends CleverCalculator {

    // we can omit constructor and super. Inheritance will be done automatically :)
    constructor() {
        super();
    }


    operations(first, second, operation) {
        console.log('Input: ' , first, second, operation);
        const output = super.operations(first, second, operation);
        console.log('Output: ' , output);
        return output;
    }

}

var a = new LoggerCalculator();
// const a = new LoggerCalculator();
a.operations(10,10,'add');

//------------------------------------------------------------------------------

// Behavioud design pattern

// (A) Chain of Responsibility Pattern
class CumulativeSum {
    constructor() {
        this.sum = 0;
    }

    add(input) {
        this.sum += input;
        return this;
    }
}

const sum1 = new CumulativeSum();
console.log(sum1.add(10).add(2).add(50).sum);

// (B) Command Pattern

class Command {
    constructor(instance) {
        this.instance = instance;
        this.commandsExecuted = [];
    }

    execute(command) {
        this.commandsExecuted.push(command);
        return this.instance[command]();

        /* A little bit more robust solution:

        if (operation && this.specialMath[operation]) {
            this.commandsExecuted.push(operation);
            this.specialMath[operation]();
        } else {
            console.warn(`${operation} is not supported` )
        }

        */
        
    }
}
// C Oberver pattern

class ObserverClass {
    constructor() {
        this.observers = [];
        this.items = [];
    }

    subscribe(funct) {
        this.observers.push(funct);
    }
    
    // unsubscription is nice to have
    /*unSubscribe(func) {
        this.observers = this.observers.filter(f => f !== func);
    }*/
    

    push(data) {
        this.items.push(data);
        this.observers.forEach((subscriber) => subscriber(this.items));
    }
    pop() {
        this.items = this.items.pop();
        this.observers.forEach((subscriber) => subscriber(this.items));
    }
    
    // Good. Just an alternative
    /*
    push(data) {
        this.items.push(data);
        this.notify(this.items)
    }
    
    pop() {
        this.notify(this.items.pop())
    }
    
    notify(data) {
        this.observers.forEach((subscriber) => subscriber(data));
    }
    */
    
}


const obs = new ObserverClass();

obs.subscribe((text) => {
    console.log(text, 'in subs');
});


obs.push('Swapnil')
obs.push('Tripathi')
obs.pop()
//------------------------------------------------------------------------------
