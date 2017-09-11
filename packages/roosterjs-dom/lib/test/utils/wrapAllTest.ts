import * as DomTestHelper from '../DomTestHelper';
import wrapAll from '../../utils/wrapAll';

describe('wrapAll()', () => {
    let testID = 'wrapAll';

    it('node = null, htmlFragment = ""', () => {
        let result = wrapAll(null, '');
        expect(result).toBeNull();
    });

    it('node = <p></p>, htmlFragment = ""', () => {
        runTest(['<p></p>', ''], '<div id="wrapAll"><p></p></div>');
    });

    it('node = <p></p>, htmlFragment = "<div style="font-size:6px"></div>"', () => {
        runTest(
            ['<p></p>', '<div style="font-size:6px"></div>'],
            '<div style="font-size:6px"><p></p></div>'
        );
    });

    it('node = <div></div><p></p>, htmlFragment = "<div style="font-size:6px"></div>"', () => {
        runTest(
            ['<div></div><p></p>', '<div style="font-size:6px"></div>'],
            '<div style="font-size:6px"><div></div><p></p></div>'
        );
    });

    it('node = disconnected <p></p>, htmlFragment = "<div></div>"', () => {
        let node = document.createElement('p');
        let result = wrapAll([node], '<div></div>') as HTMLElement;
        expect(result.outerHTML).toBe('<div><p></p></div>');
    });

    function runTest(input: [string, string], output: string) {
        let testDiv = DomTestHelper.createElementFromContent(testID, input[0]);
        let children: HTMLElement[] = [];
        for (let index = 0; index < testDiv.children.length; index++) {
            children.push(testDiv.children.item(index) as HTMLElement);
        }

        let result = wrapAll(children, input[1]) as HTMLElement;
        expect(result.outerHTML).toBe(output);

        DomTestHelper.removeElement(testID);
    }
});
