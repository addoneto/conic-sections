class RCompound {
    constructor(int, root = 1) {
        this.int = int;
        this.root = root;
    }

    txt() {
        if (this.root === 1) {
            return this.int.toString();
        }
        return `${this.int} \\sqrt{${this.root}}`;
    }

    simplify() {
        let r = Math.sqrt(this.root);
        if (Number.isInteger(r)) {
            this.root = 1;
            this.int *= r;
        }
    }

    evaluate() {
        return this.int * Math.sqrt(this.root);
    }

    ftxt() {
        return this.int > 0 ? this.txt() : `(${this.txt()})`;
    }

    static mult(a, b) {
        let i = a.int * b.int;
        let r = a.root * b.root;
        return new RCompound(i, r);
    }

    static sum(a, b) {
        if (a.root === b.root) {
            return [new RCompound(a.int + b.int, a.root)];
        }
        return [a, b];
    }

    static expSimplify(arr) {
        let sumRootMap = [];
        let finalExp = [];

        for (let pivot = 0; pivot < arr.length; pivot++) {
            if (sumRootMap.includes(arr[pivot].root)) {
                continue;
            }

            let cSum = new RCompound(arr[pivot].int, arr[pivot].root);
            for (let i = pivot + 1; i < arr.length; i++) {

                // TODO: pattern leva a checagem dupla ( aqui e em RCompound.sum() )
                if (arr[i].root === arr[pivot].root) {
                    cSum = RCompound.sum(cSum, arr[i])[0];
                }
            }

            finalExp.push(cSum);
            sumRootMap.push(arr[pivot].root);
        }

        return finalExp;
    }
}

class Racional {
    constructor(nArr, dArr = [new RCompound(1)]) {
        this.numerator = nArr;
        this.denominator = dArr;
    }

    txt() {
        let ntxt = this.numerator[0].txt();
        let dtxt = this.denominator[0].txt();

        for (let i = 1; i < this.numerator.length; i++) {
            ntxt += ` + ${this.numerator[i].ftxt()}`;
        }

        for (let i = 1; i < this.denominator.length; i++) {
            dtxt += ` + ${this.denominator[i].ftxt()}`;
        }

        if (dtxt === "1") {
            return ntxt;
        }
        return `\\frac{${ntxt}}{${dtxt}}`;
    }

    ftxt() {
        if (this.evaluate() >= 0) {
            return this.txt();
        }
        return `(${this.txt()})`;
    }

    evaluate() {
        let n = 0;
        for (let i = 0; i < this.numerator.length; i++) {
            n += this.numerator[i].evaluate();
        }

        let d = 0;
        for (let i = 0; i < this.denominator.length; i++) {
            d += this.denominator[i].evaluate();
        }

        return (n / d);
    }

    static sum(a, b) {
        let dSum = [];
        for (let i = 0; i < a.denominator.length; i++) {
            for (let j = 0; j < b.denominator.length; j++) {
                dSum.push(RCompound.mult(a.denominator[i], b.denominator[j]));
            }
        }

        let nSum1 = [];

        for (let i = 0; i < b.denominator.length; i++) {
            for (let j = 0; j < a.numerator.length; j++) {
                nSum1.push(RCompound.mult(b.denominator[i], a.numerator[j]));
            }
        }

        let nSum2 = [];

        for (let i = 0; i < a.denominator.length; i++) {
            for (let j = 0; j < b.numerator.length; j++) {
                nSum2.push(RCompound.mult(a.denominator[i], b.numerator[j]));
            }
        }

        let s1simplify = RCompound.expSimplify(nSum1);
        let s2simplify = RCompound.expSimplify(nSum2);

        let nSimplifySum = RCompound.expSimplify(s1simplify.concat(s2simplify));
        let dSimplifySum = RCompound.expSimplify(dSum);

        return new Racional(nSimplifySum, dSimplifySum);
    }

    static sub(a, b) {
        let nB = new Racional([], b.denominator);
        for (let i = 0; i < b.numerator.length; i++) {
            nB.numerator.push(RCompound.mult(new RCompound(-1), b.numerator[i]));
        }

        return Racional.sum(a, nB);
    }

    static mult(a, b) {
        let n = [];
        for (let i = 0; i < a.numerator.length; i++) {
            for (let j = 0; j < b.numerator.length; j++) {
                n.push(RCompound.mult(a.numerator[i], b.numerator[j]));
            }
        }

        let d = [];
        for (let i = 0; i < a.denominator.length; i++) {
            for (let j = 0; j < b.denominator.length; j++) {
                d.push(RCompound.mult(a.denominator[i], b.denominator[j]));
            }
        }

        n = RCompound.expSimplify(n);
        d = RCompound.expSimplify(d);

        return new Racional(n, d);
    }

    static div(a, b) {
        let nB = new Racional(b.denominator, b.numerator);
        return Racional.mult(a, nB);
    }

    static sqrt(a) {
        if (a.numerator.length !== 1 || a.denominator.length !== 1 || a.denominator[0].root !== 1 || a.numerator[0].root !== 1) {
            return;
        }

        return new Racional([new RCompound(1, a.numerator[0].int)], [new RCompound(1, a.denominator[0].int)]);
    }

    simplify() {
        for (let i = 0; i < this.numerator.length; i++) {
            this.numerator[i].simplify();
        }

        for (let i = 0; i < this.denominator.length; i++) {
            this.denominator[i].simplify();
        }

        this.numerator = RCompound.expSimplify(this.numerator);
        this.denominator = RCompound.expSimplify(this.denominator);

        // TODO: simplificações mais inteligentes
        let intDiv = this.numerator[0].int / this.denominator[0].int;
        let rootDiv = this.numerator[0].root / this.denominator[0].root;
        if (this.denominator.length === 1 && this.numerator.length === 1) {
            if (Number.isInteger(intDiv)) {
                this.numerator[0].int = intDiv;
                this.denominator[0].int = 1;
            }

            if (Number.isInteger(rootDiv)) {
                this.numerator[0].root = rootDiv;
                this.denominator[0].root = 1;
            }
        }
    }

    reduceForm() {
        if (this.numerator.length !== 1 || this.denominator.length !== 1 || this.denominator[0].root !== 1 || this.numerator[0].root !== 1) {
            return;
        }

        let gcd = 0;

        do {
            gcd = greaterCommonDivisor(Math.abs(this.numerator[0].int), Math.abs(this.denominator[0].int));
            this.numerator[0].int = this.numerator[0].int / gcd;
            this.denominator[0].int = this.denominator[0].int / gcd;
        } while (gcd !== 1);    
    }
}

function greaterCommonDivisor(a, b) {
    if (!b) {
        return a;
    }

    return greaterCommonDivisor(b, a % b);
}


export { RCompound, Racional };