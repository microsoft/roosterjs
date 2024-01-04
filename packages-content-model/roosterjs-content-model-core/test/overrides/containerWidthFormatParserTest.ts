import { containerWidthFormatParser } from '../../lib/override/containerWidthFormatParser';
import { SizeFormat } from 'roosterjs-content-model-types';

describe('containerWidthFormatParser', () => {
    it('DIV without width', () => {
        const div = document.createElement('div');
        const format: SizeFormat = {};

        containerWidthFormatParser(format, div, null!, {});

        expect(format).toEqual({});
    });

    it('DIV with width', () => {
        const div = document.createElement('div');
        const format: SizeFormat = {
            width: '10px',
        };

        containerWidthFormatParser(format, div, null!, {});

        expect(format).toEqual({});
    });

    it('SPAN with width', () => {
        const div = document.createElement('span');
        const format: SizeFormat = {
            width: '10px',
        };

        containerWidthFormatParser(format, div, null!, {});

        expect(format).toEqual({
            width: '10px',
        });
    });
});
