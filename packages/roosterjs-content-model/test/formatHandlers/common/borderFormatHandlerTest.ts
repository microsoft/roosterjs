import { BorderFormat } from '../../../lib/publicTypes/format/formatParts/BorderFormat';
import { borderFormatHandler } from '../../../lib/formatHandlers/common/borderFormatHandler';
import { ContentModelContext } from '../../../lib/publicTypes/ContentModelContext';

describe('borderFormatHandler.parse', () => {
    let div: HTMLElement;
    let format: BorderFormat;
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

    it('No border', () => {
        borderFormatHandler.parse(format, div, context);

        expect(format).toEqual({});
    });

    it('Has border color', () => {
        div.style.borderColor = 'red';

        borderFormatHandler.parse(format, div, context);

        expect(format).toEqual({
            borderColor: 'red',
        });
    });

    it('Has border width', () => {
        div.style.borderWidth = '1px';

        borderFormatHandler.parse(format, div, context);

        expect(format).toEqual({
            borderWidth: '1px',
        });
    });

    it('Has border style', () => {
        div.style.borderStyle = 'solid';

        borderFormatHandler.parse(format, div, context);

        expect(format).toEqual({
            borderStyle: 'solid',
        });
    });

    it('Has border width with different values', () => {
        div.style.borderWidth = '1px 2px 3px 4px';

        borderFormatHandler.parse(format, div, context);

        expect(format).toEqual({
            borderWidth: '1px 2px 3px 4px',
        });
    });

    it('Has border width with different values', () => {
        div.style.borderWidth = '1px 2px 3px 4px';

        borderFormatHandler.parse(format, div, context);

        expect(format).toEqual({
            borderWidth: '1px 2px 3px 4px',
        });
    });

    it('Has every thing', () => {
        div.style.border = 'solid 1px black';

        borderFormatHandler.parse(format, div, context);

        expect(format).toEqual({
            borderWidth: '1px',
            borderColor: 'black',
            borderStyle: 'solid',
        });
    });

    it('UseBorderBox', () => {
        const fake = ({
            getBoundingClientRect: () => ({
                width: 0,
                height: 0,
            }),
            style: {
                boxSizing: 'border-box',
            },
        } as any) as HTMLElement;
        borderFormatHandler.parse(format, fake, context);
        expect(format).toEqual({ useBorderBox: true });
    });
});

describe('borderFormatHandler.apply', () => {
    let div: HTMLElement;
    let format: BorderFormat;
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

    it('No border', () => {
        borderFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toEqual('<div></div>');
    });

    it('Has border color - empty array', () => {
        format.borderColor = '';

        borderFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toEqual('<div></div>');
    });

    it('Has border color - empty values', () => {
        format.borderColor = '';

        borderFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toEqual('<div></div>');
    });

    it('Has border color - with initial, transparent and inherit values', () => {
        format.borderColor = 'inherit initial';

        borderFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toEqual('<div></div>');
    });

    it('Has border color - one value', () => {
        format.borderColor = 'red';

        borderFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toEqual('<div style="border-color: red;"></div>');
    });

    it('Has border color - two values', () => {
        format.borderColor = 'red green';

        borderFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toEqual('<div style="border-color: red green;"></div>');
    });

    it('Has border color - three values', () => {
        format.borderColor = 'red green blue';

        borderFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toEqual('<div style="border-color: red green blue;"></div>');
    });

    it('Has border color - four values - same value', () => {
        format.borderColor = 'red red red red';

        borderFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toEqual('<div style="border-color: red;"></div>');
    });

    it('Has border color - four values - different values 1', () => {
        format.borderColor = 'red red red green';

        borderFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toEqual('<div style="border-color: red red red green;"></div>');
    });

    it('Has border color - four values - different values 2', () => {
        format.borderColor = 'red red green green';

        borderFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toEqual('<div style="border-color: red red green green;"></div>');
    });

    it('Has border color - four values - different values 3', () => {
        format.borderColor = 'red red green red';

        borderFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toEqual('<div style="border-color: red red green;"></div>');
    });

    it('Has border color - four values - different values 4', () => {
        format.borderColor = 'red green red red';

        borderFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toEqual('<div style="border-color: red green red red;"></div>');
    });

    it('Has border color - four values - different values 5', () => {
        format.borderColor = 'red green red green';

        borderFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toEqual('<div style="border-color: red green;"></div>');
    });

    it('Has border color - four values - different values 6', () => {
        format.borderColor = 'red green blue yellow';

        borderFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toEqual('<div style="border-color: red green blue yellow;"></div>');
    });

    it('Has border style', () => {
        format.borderStyle = 'solid solid solid solid';

        borderFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toEqual('<div style="border-style: solid;"></div>');
    });

    it('Has border width', () => {
        format.borderWidth = '1px 2px 3px 4px';

        borderFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toEqual('<div style="border-width: 1px 2px 3px 4px;"></div>');
    });

    it('Has everything', () => {
        format.borderColor = 'red blue green yellow';
        format.borderStyle = 'solid none dashed dotted';
        format.borderWidth = '1px 2px 3px 4px';

        borderFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toEqual(
            '<div style="border-color: red blue green yellow; border-width: 1px 2px 3px 4px; border-style: solid none dashed dotted;"></div>'
        );
    });

    it('UseBorderBox', () => {
        format.useBorderBox = true;
        borderFormatHandler.apply(format, div, context);
        expect(div.outerHTML).toBe('<div style="box-sizing: border-box;"></div>');
    });
});
