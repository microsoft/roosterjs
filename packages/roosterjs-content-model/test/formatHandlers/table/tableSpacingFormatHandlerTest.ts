import { ContentModelContext } from '../../../lib/publicTypes';
import { SpacingFormat } from '../../../lib/publicTypes/format/formatParts/SpacingFormat';
import { tableSpacingFormatHandler } from '../../../lib/formatHandlers/table/tableSpacingFormatHandler';

describe('tableSpacingFormatHandler.parse', () => {
    let div: HTMLElement;
    let format: SpacingFormat;
    let context: ContentModelContext;

    beforeEach(() => {
        div = document.createElement('div');
        format = {};
        context = {
            isDarkMode: false,
            zoomScale: 1,
            isRightToLeft: false,
        };
    });

    it('No value', () => {
        tableSpacingFormatHandler.parse(format, div, context);
        expect(format).toEqual({});
    });

    it('Collapsed border', () => {
        div.style.borderCollapse = 'collapse';
        tableSpacingFormatHandler.parse(format, div, context);
        expect(format).toEqual({ borderCollapse: true });
    });

    it('Non-collapsed border', () => {
        div.style.borderCollapse = 'separate';
        tableSpacingFormatHandler.parse(format, div, context);
        expect(format).toEqual({});
    });
});

describe('tableSpacingFormatHandler.apply', () => {
    let div: HTMLElement;
    let format: SpacingFormat;
    let context: ContentModelContext;

    beforeEach(() => {
        div = document.createElement('div');
        format = {};
        context = {
            isDarkMode: false,
            zoomScale: 1,
            isRightToLeft: false,
        };
    });

    it('No value', () => {
        tableSpacingFormatHandler.apply(format, div, context);
        expect(div.outerHTML).toEqual('<div></div>');
    });

    it('Collapsed border', () => {
        format.borderCollapse = true;
        tableSpacingFormatHandler.apply(format, div, context);
        expect(div.outerHTML).toEqual(
            '<div style="border-collapse: collapse; border-spacing: 0px; box-sizing: border-box;"></div>'
        );
    });
});
