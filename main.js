import { RCompound, Racional } from "./Racional.js";

const an = document.getElementById("an");
const ad = document.getElementById("ad");
const bn = document.getElementById("bn");
const bd = document.getElementById("bd");
const cn = document.getElementById("cn");
const cd = document.getElementById("cd");
const dn = document.getElementById("dn");
const dd = document.getElementById("dd");
const en = document.getElementById("en");
const ed = document.getElementById("ed");
const fn = document.getElementById("fn");
const fd = document.getElementById("fd");

document.getElementById("solve-btn").addEventListener("click", updateSolution);
window.addEventListener("load", updateSolution);

let currentSolutionContainer = null;

function updateSolution() {
    generateSolution();
    MathJax.typeset();
}

function generateSolution() {
    currentSolutionContainer = document.getElementById("s1");
    currentSolutionContainer.innerHTML = "";
    const a = new Racional([new RCompound(an.value)], [new RCompound(ad.value)]);
    const b = new Racional([new RCompound(bn.value)], [new RCompound(bd.value)]);
    const c = new Racional([new RCompound(cn.value)], [new RCompound(cd.value)]);
    const d = new Racional([new RCompound(dn.value)], [new RCompound(dd.value)]);
    const e = new Racional([new RCompound(en.value)], [new RCompound(ed.value)]);
    const f = new Racional([new RCompound(fn.value)], [new RCompound(fd.value)]);

    const eq = `${a.ftxt()}x^2 + ${b.ftxt()}xy + ${c.ftxt()}y^2 + ${d.ftxt()}x + ${e.ftxt()}y + ${f.ftxt()} = 0`;

    const graph1_container = document.getElementById('graph-container1');
    graph1_container.innerHTML = "";
    const calculator1 = Desmos.GraphingCalculator(graph1_container, { expressions: false, keypad: false, settingsMenu: false });

    calculator1.setExpression({ latex: eq });

    let b_2 = Racional.div(b, new Racional([new RCompound(2)]));
    b_2.simplify();

    printTxt(`Seja \\( \\overline{x} = (x, y) \\), então \\( \\overline{x} A \\cdot \\overline{x} = ${a.ftxt()}x^2 + ${b.ftxt()}xy + ${c.ftxt()}y^2 \\) em que \\( A = \\begin{pmatrix} ${a.txt()} & ${b_2.txt()} \\\\ ${b_2.txt()} & ${c.txt()} \\end{pmatrix}  \\).`);

    printTxt(`Para eliminar o termo misto buscamos uma mudança de base em coordenadas \\( \\overline{v} = (v, w) \\) t.q \\( \\overline{x} A \\cdot \\overline{x} = \\overline{v} O \\cdot \\overline{v} \\), em que O é matriz diagonal.`);

    printTxt(`Tome D como a matriz mudança de base, composta pelos autovetores de A, vale então \\( DAD^{-1} = O \\Rightarrow O = \\begin{pmatrix} \\alpha & 0 \\\\ 0 & \\beta \\end{pmatrix} \\), para \\( \\alpha  \\) e \\( \\beta \\) autovalores.`);

    printTxt(`Para manter a forma da curva D deve ser t.q \\( D^{-1} = D^{t}\\) e \\( det(D) =1\\).`);

    printTxt(`Assim \\( \\overline{x} A \\cdot \\overline{x} = \\overline{v} DAD^{-1} \\cdot \\overline{v} = \\overline{v} DA \\cdot \\overline{v}D \\therefore \\overline{x} = \\overline{v}D \\).`);

    // SOLUTIONS

    printTxt(`I) Autovalores de A`);

    printTxt(`\\( f(\\lambda) = \\begin{vmatrix} ${a.txt()} - \\lambda & ${b_2.txt()} \\\\ ${b_2.txt()} & ${c.txt()} - \\lambda \\end{vmatrix} = (${a.txt()} - \\lambda)(${c.txt()} - \\lambda) - ${b_2.ftxt()}^2 \\)`);

    let aplusc = Racional.sum(a, c);
    let apluscpow2 = Racional.mult(aplusc, aplusc);
    let atimesc = Racional.mult(a, c);
    let b_2pow2 = Racional.mult(b_2, b_2);
    let indepTerm = Racional.sub(atimesc, b_2pow2);
    let delta = Racional.sub(apluscpow2, Racional.mult(new Racional([new RCompound(4)]), indepTerm));

    printTxt(`\\( = \\lambda ^2 - ${aplusc.ftxt()}\\lambda + ${indepTerm.ftxt()} = 0\\)`);

    let sqrtDeltaNumerator = [];
    let sqrtDeltaDenominator = []

    for (let i = 0; i < delta.numerator.length; i++) {
        sqrtDeltaNumerator.push(new RCompound(1, delta.numerator[0].int));
    }

    for (let i = 0; i < delta.denominator.length; i++) {
        sqrtDeltaDenominator.push(new RCompound(1, delta.denominator[0].int));
    }

    sqrtDeltaDenominator = RCompound.expSimplify(sqrtDeltaDenominator);

    let sqrtDelta = new Racional(sqrtDeltaNumerator, sqrtDeltaDenominator);

    let l1 = Racional.div(Racional.sum(aplusc, sqrtDelta), new Racional([new RCompound(2)]));
    let l2 = Racional.div(Racional.sub(aplusc, sqrtDelta), new Racional([new RCompound(2)]));

    l1.simplify();
    l2.simplify();

    printTxt(`\\( \\lambda = \\frac{${aplusc.ftxt()} \\pm ${sqrtDelta.txt()} }{2} \\therefore \\lambda _ 1 = \\alpha = ${l1.txt()} , \\lambda _ 2 = \\beta = ${l2.txt()} \\)`);

    printTxt(`II) Autovetores de A`);

    printTxt(`a. para \\( \\lambda = ${l1.ftxt()}\\) )`);

    let aminusalpha = Racional.sub(a, l1);
    let cminusalpha = Racional.sub(c, l1);
    let alphaVSum = Racional.sum(aminusalpha, b_2);
    let alphaWSum = Racional.sum(b_2, cminusalpha);
    alphaWSum = Racional.mult(alphaWSum, new Racional([new RCompound(-1)]));

    let v1 = [];

    printTxt(`\\( \\overline{v_1} \\begin{pmatrix} ${a.txt()} - ${l1.ftxt()} & ${b_2.txt()} \\\\ ${b_2.txt()} & ${c.txt()} - ${l1.ftxt()} \\end{pmatrix} = (v, w)\\begin{pmatrix} ${aminusalpha.txt()} & ${b_2.txt()} \\\\ ${b_2.txt()} & ${cminusalpha.txt()} \\end{pmatrix} = \\overline{0}\\).`);

    if (alphaVSum.evaluate() === alphaWSum.evaluate()) {
        printTxt(`\\( \\Rightarrow \\begin{cases} ${aminusalpha.txt()}v + ${b_2.ftxt()}w = 0 \\\\ ${b_2.txt()}v + ${cminusalpha.ftxt()}w = 0 \\end{cases} \\Rightarrow v = w \\) `);
        v1 = [
            new Racional([new RCompound(1)]),
            new Racional([new RCompound(1)])
        ];
    } else {
        let vdivw = Racional.div(alphaVSum, alphaWSum);

        printTxt(`\\( \\Rightarrow \\begin{cases} ${aminusalpha.txt()}v + ${b_2.ftxt()}w = 0 \\\\ ${b_2.txt()}v + ${cminusalpha.ftxt()}w = 0 \\end{cases} \\Rightarrow ${alphaVSum.txt()}v = ${alphaWSum.ftxt()}w \\Rightarrow \\)`);
        v1 = [
            new Racional([new RCompound(1)]),
            vdivw
        ];
    }

    printTxt(`\\( \\overline{v_1} = (${v1[0].txt()}, ${v1[1].txt()}) \\).`);

    printTxt(`b. para \\( \\lambda = ${l2.ftxt()}\\) )`);

    let aminusbeta = Racional.sub(a, l2);
    let cminusbeta = Racional.sub(c, l2);
    let betaVSum = Racional.sum(aminusbeta, b_2);
    let betaWSum = Racional.sum(b_2, cminusbeta);
    betaWSum = Racional.mult(betaWSum, new Racional([new RCompound(-1)]));

    let v2 = [];

    printTxt(`\\( \\overline{v_2} \\begin{pmatrix} ${a.txt()} - ${l1.ftxt()} & ${b_2.txt()} \\\\ ${b_2.txt()} & ${c.txt()} - ${l1.ftxt()} \\end{pmatrix} = (v, w)\\begin{pmatrix} ${aminusbeta.txt()} & ${b_2.txt()} \\\\ ${b_2.txt()} & ${cminusbeta.txt()} \\end{pmatrix} = \\overline{0}\\).`);

    if (betaVSum.evaluate() === betaWSum.evaluate()) {
        printTxt(`\\( \\Rightarrow \\begin{cases} ${aminusbeta.txt()}v + ${b_2.ftxt()}w = 0 \\\\ ${b_2.txt()}v + ${cminusbeta.ftxt()}w = 0 \\end{cases} \\Rightarrow v = w \\) `);
        v2 = [
            new Racional([new RCompound(1)]),
            new Racional([new RCompound(1)])
        ];
    } else {
        let vdivw = Racional.div(betaVSum, betaWSum);

        vdivw.simplify();

        printTxt(`\\( \\Rightarrow \\begin{cases} ${aminusbeta.txt()}v + ${b_2.ftxt()}w = 0 \\\\ ${b_2.txt()}v + ${cminusbeta.ftxt()}w = 0 \\end{cases} \\Rightarrow ${betaVSum.txt()}v = ${betaWSum.ftxt()}w \\Rightarrow \\)`);
        v2 = [
            new Racional([new RCompound(1)]),
            vdivw
        ];
    }

    printTxt(`\\( \\overline{v_2} = (${v2[0].txt()}, ${v2[1].txt()}) \\).`);

    printTxt(`Portanto, \\( D = \\begin{pmatrix} \\overline{v_{\\lambda _1}} \\\\ \\overline{v_{\\lambda _2}}  \\end{pmatrix} =  \\begin{pmatrix} ${v1[0].txt()} & ${v1[1].txt()} \\\\ ${v2[0].txt()} & ${v2[1].txt()} \\end{pmatrix} \\)`);

    let sqrV1Mag = Racional.sum(Racional.mult(v1[0], v1[0]), Racional.mult(v1[1], v1[1]));
    let sqrV2Mag = Racional.sum(Racional.mult(v2[0], v2[0]), Racional.mult(v2[1], v2[1]));

    let v1Mag = Racional.sqrt(sqrV1Mag);
    let v2Mag = Racional.sqrt(sqrV2Mag);

    console.log(sqrV2Mag);
    console.log(v2Mag);

    let normalV1 = [
        Racional.div(v1[0], v1Mag),
        Racional.div(v1[1], v1Mag)
    ];

    let normalV2 = [
        Racional.div(v2[0], v2Mag),
        Racional.div(v2[1], v2Mag)
    ];

    printTxt(`Normalizando temos \\( D = \\begin{pmatrix} \\overline{v_{\\lambda _1}} \\\\ \\overline{v_{\\lambda _2}}  \\end{pmatrix} =  \\begin{pmatrix} ${normalV1[0].txt()} & ${normalV1[1].txt()} \\\\ ${normalV2[0].txt()} & ${normalV2[1].txt()} \\end{pmatrix} \\)`);

    let determinant = Racional.sub(Racional.mult(normalV1[0], normalV2[1]), Racional.mult(normalV1[1], normalV2[0]));

    if (determinant.evaluate() === -1) {
        normalV2 = [
            Racional.mult(normalV2[0], new Racional([new RCompound(-1)])),
            Racional.mult(normalV2[1], new Racional([new RCompound(-1)])),
        ];

        printTxt(`Para \\( det(D)=1 \\) temos \\( D =  \\begin{pmatrix} ${normalV1[0].txt()} & ${normalV1[1].txt()} \\\\ ${normalV2[0].txt()} & ${normalV2[1].txt()} \\end{pmatrix} \\)`);
    } else if (determinant.evaluate() !== 1) {
        return;
    }

    printTxt(`III) Encontrando as novas coordenadas`);

    printTxt(`Tomando \\( \\overline{x} = \\overline{v}D \\Rightarrow \\begin{cases} x = ${normalV1[0].txt()}v + ${normalV2[0].ftxt()}w \\\\ y = ${normalV1[1].txt()}v + ${normalV2[1].ftxt()}w \\end{cases} \\)`);

    printTxt(`Como \\( O = \\begin{pmatrix} \\alpha & 0 \\\\ 0 & \\beta \\end{pmatrix} = \\begin{pmatrix} ${l1.txt()} & 0 \\\\ 0 & ${l2.txt()} \\end{pmatrix} \\)`);

    printTxt(`\\( ${l1.txt()}v^2 + ${l2.txt()}w^2 + ${d.txt()}(${normalV1[0].txt()}v + ${normalV2[0].ftxt()}w) + ${e.txt()}(${normalV1[1].txt()}v + ${normalV2[1].ftxt()}w) + ${f.txt()} = 0 \\)`);

    let newD = Racional.sum(Racional.mult(d, normalV1[0]), Racional.mult(e, normalV1[1]));
    let newE = Racional.sum(Racional.mult(d, normalV2[0]), Racional.mult(e, normalV2[1]));

    newD.simplify();
    newE.simplify();

    printTxt(`\\( = ${l1.ftxt()}v^2 + ${l2.ftxt()}w^2 + ${newD.ftxt()}v + ${newE.ftxt()}w + ${f.ftxt()} = 0 \\)`);

    let turnEq = `${l1.ftxt()}x^2 + ${l2.ftxt()}y^2 + ${newD.ftxt()}x + ${newE.ftxt()}y + ${f.ftxt()} = 0`;

    const graph2_container = document.getElementById('graph-container2');
    graph2_container.innerHTML = "";
    const calculator2 = Desmos.GraphingCalculator(graph2_container, { expressions: false, keypad: false, settingsMenu: false });
    calculator2.setExpression({ latex: turnEq });

    currentSolutionContainer = document.getElementById("s2");
    currentSolutionContainer.innerHTML = "";

    printTxt(`IV) Translação`);

    let squareCorrectionV;
    if (l1.evaluate() !== 0) {
        squareCorrectionV = Racional.div(newD, new Racional([new RCompound(2)]));

        printTxt(`\\( ${l1.ftxt()}v^2 + ${newD.ftxt()}v = ${l1.ftxt()}v^2 + ${newD.ftxt()}v + (${squareCorrectionV.txt()})^2 - (${squareCorrectionV.txt()})^2 \\)`);

        squareCorrectionV = Racional.div(squareCorrectionV, l1)

        printTxt(`\\( = ${l1.ftxt()}(v + ${squareCorrectionV.ftxt()})^2 - (${squareCorrectionV.txt()})^2\\)`);

        printTxt(`Tome \\( s = v + ${squareCorrectionV.ftxt()} \\)`);
    } 
    

    let squareCorrectionW;
    if (l2.evaluate() !== 0) {
        squareCorrectionW = Racional.div(newE, new Racional([new RCompound(2)]));

        printTxt(`\\( ${l2.ftxt()}w^2 + ${newE.ftxt()}w = ${l2.ftxt()}w^2 + ${newE.ftxt()}v + (${squareCorrectionW.txt()})^2 - (${squareCorrectionW.txt()})^2 \\)`);

        squareCorrectionW = Racional.div(squareCorrectionW, l2)

        printTxt(`\\( = ${l2.ftxt()}(w + ${squareCorrectionW.ftxt()})^2 - (${squareCorrectionW.txt()})^2\\)`);

        printTxt(`Tome \\( t = w + ${squareCorrectionW.ftxt()} \\)`);
    }

    let finalEq = "";
    if(l1.evaluate() !== 0 && l2.evaluate() !== 0) {
        printTxt(`Substituindo:`);

        printTxt(`Temos \\( ${l1.ftxt()}s^2 + ${l2.ftxt()}t^2 - (${squareCorrectionV.txt()})^2 - (${squareCorrectionW.txt()})^2 + ${f.ftxt()} = 0\\)`);

        let squareCorrectionVpow2 = Racional.mult(squareCorrectionV, squareCorrectionV);
        let squareCorrectionWpow2 = Racional.mult(squareCorrectionW, squareCorrectionW);
        squareCorrectionVpow2 = Racional.mult(squareCorrectionVpow2, new Racional([new RCompound(-1)]));

        let indepTermFinal = Racional.sub(squareCorrectionVpow2, squareCorrectionWpow2);
        indepTermFinal = Racional.sum(indepTermFinal, f);

        indepTermFinal.simplify();
        indepTermFinal.reduceForm();

        printTxt(`Finalmente \\( ${l1.ftxt()}s^2 + ${l2.ftxt()}t^2 + ${indepTermFinal.ftxt()} = 0\\)`);

        finalEq = `${l1.ftxt()}x^2 + ${l2.ftxt()}y^2 + ${indepTermFinal.ftxt()} = 0`;
    } else if (l1.evaluate() !== 0){
        printTxt(`Substituindo:`);

        printTxt(`Temos \\( ${l1.ftxt()}s^2 + ${newE.ftxt()}t - (${squareCorrectionV.txt()})^2 + ${f.ftxt()} = 0\\)`);

        let squareCorrectionVpow2 = Racional.mult(squareCorrectionV, squareCorrectionV);
        squareCorrectionVpow2 = Racional.mult(squareCorrectionVpow2, new Racional([new RCompound(-1)]));

        let indepTermFinal = Racional.sum(squareCorrectionVpow2, f);

        indepTermFinal.simplify();
        indepTermFinal.reduceForm();

        printTxt(`Finalmente \\( ${l1.ftxt()}s^2 + ${newE.ftxt()}t + ${indepTermFinal.ftxt()} = 0\\)`);

        finalEq = `${l1.ftxt()}x^2 + ${newE.ftxt()}y + ${indepTermFinal.ftxt()} = 0`;
    } else {
        printTxt(`Substituindo:`);

        printTxt(`Temos \\( ${l2.ftxt()}t^2 - ${newD.txt()}s - (${squareCorrectionW.txt()})^2 + ${f.ftxt()} = 0\\)`);

        let squareCorrectionWpow2 = Racional.mult(squareCorrectionW, squareCorrectionW);
        squareCorrectionWpow2 = Racional.mult(squareCorrectionWpow2, new Racional([new RCompound(-1)]));

        let indepTermFinal = Racional.sum(squareCorrectionWpow2, f);

        indepTermFinal.simplify();
        indepTermFinal.reduceForm();

        printTxt(`Finalmente \\( ${l2.ftxt()}t^2 + ${newD.ftxt()}s + ${indepTermFinal.ftxt()} = 0\\)`);

        finalEq = `${l2.ftxt()}y^2 + ${newD.ftxt()}x + ${indepTermFinal.ftxt()} = 0`;
    }

    const graph3_container = document.getElementById('graph-container3');
        graph3_container.innerHTML = "";
        const calculator3 = Desmos.GraphingCalculator(graph3_container, { expressions: false, keypad: false, settingsMenu: false });
        calculator3.setExpression({ latex: finalEq });

    MathJax.typeset();
}

function printTxt(str) {
    let p = document.createElement("p");
    p.innerHTML = str;
    currentSolutionContainer.appendChild(p);
}