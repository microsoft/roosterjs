import getObjectKeys from '../jsUtils/getObjectKeys';

const RomanValues: Record<string, number> = {
    M: 1000,
    CM: 900,
    D: 500,
    CD: 400,
    C: 100,
    XC: 90,
    L: 50,
    XL: 40,
    X: 10,
    IX: 9,
    V: 5,
    IV: 4,
    I: 1,
};

/**
 * @internal
 * Convert decimal numbers into roman numbers
 * @param decimal The decimal number that needs to be converted
 * @param isLowerCase if true the roman value will appear in lower case
 * @returns
 */
export default function convertDecimalsToRoman(decimal: number, isLowerCase?: boolean) {
    let romanValue = '';
    for (let i of getObjectKeys(RomanValues)) {
        let timesRomanCharAppear = Math.floor(decimal / RomanValues[i]);
        decimal = decimal - timesRomanCharAppear * RomanValues[i];
        romanValue = romanValue + i.repeat(timesRomanCharAppear);
    }
    return isLowerCase ? romanValue.toLocaleLowerCase() : romanValue;
}
