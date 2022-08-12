import getEffectiveBackgroundColor from '../../lib/utils/getEffectiveBackgroundColor';

describe('getEffectiveBackgroundColor()', () => {
    let defaultResult = 'rgba(0, 0, 0, 0)';

    it('getEffectiveBackgroundColor() case 0', () => {
        runTest(1, '<div id=id1></div>', 'id1', defaultResult);
    });
    it('getEffectiveBackgroundColor() case 0', () => {
        runTest(1, '<div id=id1 style="background-color:red"></div>', 'id1', 'rgb(255, 0, 0)');
    });
    it('getEffectiveBackgroundColor() case 0', () => {
        runTest(1, '<div><div id=id1 ></div></div>', 'id1', defaultResult);
    });
    it('getEffectiveBackgroundColor() case 0', () => {
        runTest(
            1,
            '<div><div id=id1 style="background-color:red"></div></div>',
            'id1',
            'rgb(255, 0, 0)'
        );
    });

    function runTest(
        caseIndex: number,
        input: string,
        id: string,
        expectedEffectiveBackgroundColor: string
    ) {
        let div = document.createElement('div');
        div.style.fontFamily = 'arial';
        document.body.appendChild(div);
        div.innerHTML = input;
        let element = document.getElementById(id);
        let result = getEffectiveBackgroundColor(element, div.parentNode);
        expect(result).toEqual(expectedEffectiveBackgroundColor, `case index: ${caseIndex}`);
        document.body.removeChild(div);
    }
});
