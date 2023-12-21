import { DisplayFormat } from 'roosterjs-content-model-types';
import { pasteDisplayFormatParser } from '../../lib/override/pasteDisplayFormatParser';

describe('pasteDisplayFormatParser', () => {
    it('no display', () => {
        const div = document.createElement('div');
        const format: DisplayFormat = {};
        const context: any = {};

        pasteDisplayFormatParser(format, div, context, {});

        expect(format).toEqual({});
    });

    it('display: block', () => {
        const div = document.createElement('div');

        div.style.display = 'block';

        const format: DisplayFormat = {};
        const context: any = {};

        pasteDisplayFormatParser(format, div, context, {});

        expect(format).toEqual({
            display: 'block',
        });
    });

    it('display: inline', () => {
        const div = document.createElement('div');

        div.style.display = 'inline';

        const format: DisplayFormat = {};
        const context: any = {};

        pasteDisplayFormatParser(format, div, context, {});

        expect(format).toEqual({
            display: 'inline',
        });
    });

    it('display: flex', () => {
        const div = document.createElement('div');

        div.style.display = 'flex';

        const format: DisplayFormat = {};
        const context: any = {};

        pasteDisplayFormatParser(format, div, context, {});

        expect(format).toEqual({});
    });
});
