import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { DomToModelContext } from '../../../lib/publicTypes/context/DomToModelContext';
import { ModelToDomContext } from '../../../lib/publicTypes/context/ModelToDomContext';
import { SizeFormat } from '../../../lib/publicTypes/format/formatParts/SizeFormat';
import { sizeFormatHandler } from '../../../lib/formatHandlers/common/sizeFormatHandler';

describe('sizeFormatHandler.parse', () => {
    let format: SizeFormat;
    let context: DomToModelContext;

    beforeEach(() => {
        format = {};
        context = createDomToModelContext();
    });

    it('Empty element', () => {
        const element = document.createElement('div');

        sizeFormatHandler.parse(format, element, context, {});

        expect(format).toEqual({});
    });

    it('Element with width and height in style', () => {
        const element = document.createElement('div');

        element.style.width = '10px';
        element.style.height = '20px';

        sizeFormatHandler.parse(format, element, context, {});

        expect(format).toEqual({ width: '10px', height: '20px' });
    });

    it('Element with width and height in attribute', () => {
        const element = document.createElement('div');

        element.setAttribute('width', '10');
        element.setAttribute('height', '20');

        sizeFormatHandler.parse(format, element, context, {});

        expect(format).toEqual({ width: '10px', height: '20px' });
    });

    it('Element with width and height in both style and attribute', () => {
        const element = document.createElement('div');

        element.style.width = '10px';
        element.style.height = '20px';

        element.setAttribute('width', '30');
        element.setAttribute('height', '40');

        sizeFormatHandler.parse(format, element, context, {});

        expect(format).toEqual({ width: '10px', height: '20px' });
    });

    it('Element with width and height in attribute in percentage', () => {
        const element = document.createElement('div');

        element.setAttribute('width', '30%');
        element.setAttribute('height', '40%');

        sizeFormatHandler.parse(format, element, context, {});

        expect(format).toEqual({ width: '30%', height: '40%' });
    });

    it('Element with min/max size', () => {
        const element = document.createElement('div');

        element.style.minWidth = '10px';
        element.style.maxWidth = '20px';
        element.style.minHeight = '30px';
        element.style.maxHeight = '40px';

        sizeFormatHandler.parse(format, element, context, {});

        expect(format).toEqual({
            minWidth: '10px',
            maxWidth: '20px',
            minHeight: '30px',
            maxHeight: '40px',
        });
    });
});

describe('sizeFormatHandler.apply', () => {
    let div: HTMLElement;
    let format: SizeFormat;
    let context: ModelToDomContext;

    beforeEach(() => {
        div = document.createElement('div');
        format = {};
        context = createModelToDomContext();
    });

    it('No size', () => {
        sizeFormatHandler.apply(format, div, context);
        expect(div.outerHTML).toBe('<div></div>');
    });

    it('Has width', () => {
        format.width = '10px';
        sizeFormatHandler.apply(format, div, context);
        expect(div.outerHTML).toBe('<div style="width: 10px;"></div>');
    });

    it('Has height', () => {
        format.height = '20px';
        sizeFormatHandler.apply(format, div, context);
        expect(div.outerHTML).toBe('<div style="height: 20px;"></div>');
    });

    it('Has both width and height', () => {
        format.width = '10px';
        format.height = '20px';
        sizeFormatHandler.apply(format, div, context);
        expect(div.outerHTML).toBe('<div style="width: 10px; height: 20px;"></div>');
    });

    it('Has min/max size', () => {
        format.minWidth = '10px';
        format.maxWidth = '20px';
        format.minHeight = '30px';
        format.maxHeight = '40px';
        sizeFormatHandler.apply(format, div, context);
        expect(div.outerHTML).toBe(
            '<div style="max-width: 20px; max-height: 40px; min-width: 10px; min-height: 30px;"></div>'
        );
    });
});
