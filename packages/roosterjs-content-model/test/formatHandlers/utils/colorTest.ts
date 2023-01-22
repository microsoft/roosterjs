import { getColor, setColor } from '../../../lib/formatHandlers/utils/color';

describe('getColor', () => {
    let div: HTMLElement;

    beforeEach(() => {
        div = document.createElement('div');
    });

    function runTest(
        expectedLightTextColor: string | undefined,
        expectedLightBackColor: string | undefined,
        expectedDarkTextColor: string | undefined,
        expectedDarkBackColor: string | undefined
    ) {
        const lightTextColor = getColor(div, false);
        const lightBackColor = getColor(div, true);
        const darkTextColor = getColor(div, false);
        const darkBackColor = getColor(div, true);

        expect(lightTextColor).toBe(expectedLightTextColor);
        expect(lightBackColor).toBe(expectedLightBackColor);
        expect(darkTextColor).toBe(expectedDarkTextColor);
        expect(darkBackColor).toBe(expectedDarkBackColor);
    }

    it('no color', () => {
        runTest(undefined, undefined, undefined, undefined);
    });

    it('has CSS color', () => {
        div.style.color = 'red';
        div.style.backgroundColor = 'blue';
        runTest('red', 'blue', 'red', 'blue');
    });

    it('has CSS color', () => {
        div.style.color = 'red';
        div.style.backgroundColor = 'blue';
        runTest('red', 'blue', 'red', 'blue');
    });

    it('has attr color', () => {
        div.setAttribute('color', 'red');
        div.setAttribute('bgcolor', 'blue');
        runTest('red', 'blue', 'red', 'blue');
    });

    it('has both color', () => {
        div.style.color = 'red';
        div.style.backgroundColor = 'blue';
        div.setAttribute('color', 'green');
        div.setAttribute('bgcolor', 'yellow');
        runTest('red', 'blue', 'red', 'blue');
    });
});

describe('setColor', () => {
    function runTest(
        textColor: string,
        backColor: string,
        expectedLightHtml: string,
        expectedDarkHtml: string,
        expectedNewDarkColor: Record<string, string>
    ) {
        const lightDiv = document.createElement('div');
        const darkDiv = document.createElement('div');
        const newDarkColor: Record<string, string> = {};

        setColor(lightDiv, textColor, false, false, newDarkColor);
        setColor(lightDiv, backColor, true, false, newDarkColor);
        setColor(darkDiv, textColor, false, true, newDarkColor);
        setColor(darkDiv, backColor, true, true, newDarkColor);

        expect(lightDiv.outerHTML).toBe(expectedLightHtml);
        expect(darkDiv.outerHTML).toBe(expectedDarkHtml);
        expect(newDarkColor).toEqual(expectedNewDarkColor);
    }

    it('no color', () => {
        runTest('', '', '<div></div>', '<div></div>', {});
    });

    it('has color', () => {
        runTest(
            'red',
            'blue',
            '<div style="color: red; background-color: blue;"></div>',
            '<div style="color: var(--darkColor_red,red); background-color: var(--darkColor_blue,blue);"></div>',
            {
                '--darkColor_red': 'red',
                '--darkColor_blue': 'blue',
            }
        );
    });

    it('Mode independent color', () => {
        runTest(
            '#aaa',
            '#ccc',
            '<div style="color: rgb(170, 170, 170); background-color: rgb(204, 204, 204);"></div>',
            '<div style="color: var(--darkColor__aaa,#aaa); background-color: var(--darkColor__ccc,#ccc);"></div>',
            {
                '--darkColor__aaa': '#aaa',
                '--darkColor__ccc': '#ccc',
            }
        );
    });
});
