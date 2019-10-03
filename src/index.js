function eval() {
    // Do not use eval!!!
    return;
}

function expressionCalculator(expr) {
    let open = 0;
    let close = 0;
    let result;
    let spacedArr = [];
    let subIndex = new Array(2);

    let exprArr = expr.split('').filter(item => {
        return item !== ' ';
    });

    for (let i = 0; i < exprArr.length; i++) {
        let item = exprArr[i];

        if (item === '(') {
            open++;
            spacedArr.push(item);
            continue;
        } else if (item === ')') {
            close++;
            spacedArr.push(item);
            continue;
        } else if (item === '*' || item === '/' || item === '+' || item === '-') {
            spacedArr.push(item);
            continue;
        }

        if (!isNaN(exprArr[i + 1]) && !isNaN(exprArr[i + 2])) {
            let tmp = exprArr[i] + exprArr[i + 1] + exprArr[i + 2];
            spacedArr.push(tmp);
            i += 2;
            continue;
        }

        if (!isNaN(exprArr[i + 1])) {
            let tmp = exprArr[i] + exprArr[i + 1];
            spacedArr.push(tmp);
            i += 1;
            continue;
        }

        spacedArr.push(item);
    }

    if (open !== close) {
        throw new Error('ExpressionError: Brackets must be paired')
    }

    function findSubIndex() {
        subIndex[1] = spacedArr.indexOf(')');
        subIndex[0] = spacedArr.lastIndexOf('(', subIndex[1]);
    }

    function calcSub(start, end) {
        let subArr = spacedArr.slice(start + 1, end);
        let firstPriority = true;
        let secondPriority = true;
        let mult;
        let div;
        let calc;

        while (firstPriority) {
            calc = 0;

            mult = subArr.indexOf('*');
            div = subArr.indexOf('/');

            if (mult === -1 && div === -1) {
                firstPriority = false;
            }

            if (mult > 0 && div > 0) {
                if (mult < div) {
                    calc = subArr[mult - 1] * subArr[mult + 1];
                    subArr.splice(mult - 1, 3, calc);
                }

                if (div < mult) {
                    if (subArr[div + 1] == 0) {
                        throw new Error('TypeError: Division by zero.')
                    }
                    calc = subArr[div - 1] / subArr[div + 1];
                    subArr.splice(div - 1, 3, calc);
                }
            } else if (mult > 0) {
                calc = subArr[mult - 1] * subArr[mult + 1];
                subArr.splice(mult - 1, 3, calc);
            } else if (div > 0) {
                if (subArr[div + 1] == 0) {
                    throw new Error('TypeError: Division by zero.')
                }
                calc = subArr[div - 1] / subArr[div + 1];
                subArr.splice(div - 1, 3, calc);
            }
        }

        while (secondPriority) {
            calc = 0;

            if (subArr.length >= 3) {
                if (subArr[1] === '+') {
                    calc = +subArr[0] + +subArr[2];
                    subArr.splice(0, 3, calc);
                } else if (subArr[1] === '-') {
                    calc = subArr[0] - subArr[2];
                    subArr.splice(0, 3, calc);
                }
            } else {
                secondPriority = false;
            }
        }

        return subArr;
    }

    for (let i = 0; i < open; i++) {
        findSubIndex();
        result = calcSub(subIndex[0], subIndex[1]);
        spacedArr.splice(subIndex[0], subIndex[1] - subIndex[0] + 1, +result.join(''));
    }
    
    subIndex = [-1, spacedArr.length];

    result = +calcSub(subIndex[0], subIndex[1]);

    return +result.toFixed(4);
}

module.exports = {
    expressionCalculator
}