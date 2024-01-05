import { blockElementParser } from '../../../lib/paste/utils/parsers/blockElementParser';

describe('blockElementParser |', () => {
    it('remove background color', () => {
        const element: HTMLElement = document.createElement('div');
        element.style.backgroundColor = 'white';
        const format = { backgroundColor: 'white' };

        blockElementParser(format, element, <any>{}, <any>{});

        expect(format.backgroundColor).toBeUndefined();
    });

    it('dont remove background color', () => {
        const element: HTMLElement = document.createElement('div');
        const format = { backgroundColor: 'white' };

        blockElementParser(format, element, <any>{}, <any>{});

        expect(format.backgroundColor).toEqual('white');
    });
});
