import { containerSizeFormatParser } from '../../lib/override/containerSizeFormatParser';
import { SizeFormat } from 'roosterjs-content-model-types';

describe('containerSizeFormatParser', () => {
    it('DIV without width', () => {
        const div = document.createElement('div');
        const format: SizeFormat = {};

        containerSizeFormatParser(format, div, null!, {});

        expect(format).toEqual({});
    });

    it('DIV with width', () => {
        const div = document.createElement('div');
        const format: SizeFormat = {
            width: '10px',
        };

        containerSizeFormatParser(format, div, null!, {});

        expect(format).toEqual({});
    });

    it('SPAN with width & height', () => {
        const div = document.createElement('span');
        const format: SizeFormat = {
            width: '10px',
            height: '10px',
        };

        containerSizeFormatParser(format, div, null!, {});

        expect(format).toEqual({
            height: '10px',
            width: '10px',
        });
    });

    it('DIV with height', () => {
        const div = document.createElement('div');
        const format: SizeFormat = {
            height: '10px',
        };

        containerSizeFormatParser(format, div, null!, {});

        expect(format).toEqual({});
    });

    it('SPAN with height', () => {
        const div = document.createElement('div');
        const format: SizeFormat = {
            height: '10px',
        };

        containerSizeFormatParser(format, div, null!, {});

        expect(format).toEqual({});
    });
});
