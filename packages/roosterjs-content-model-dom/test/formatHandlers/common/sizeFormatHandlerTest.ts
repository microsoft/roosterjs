import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { DomToModelContext, ModelToDomContext, SizeFormat } from 'roosterjs-content-model-types';
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

    it('Image with width and height in style', () => {
        const element = document.createElement('img');

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

        expect(format).toEqual({
            width: '10px',
            height: '20px',
        });
    });

    it('Image with width and height in attribute', () => {
        const element = document.createElement('img');

        element.setAttribute('width', '10');
        element.setAttribute('height', '20');

        sizeFormatHandler.parse(format, element, context, {});

        expect(format).toEqual({
            width: '10px',
            height: '20px',
            widthAttr: '10',
            heightAttr: '20',
        });
    });

    it('Element with width and height in both style and attribute', () => {
        const element = document.createElement('div');

        element.style.width = '10px';
        element.style.height = '20px';

        element.setAttribute('width', '30');
        element.setAttribute('height', '40');

        sizeFormatHandler.parse(format, element, context, {});

        expect(format).toEqual({
            width: '10px',
            height: '20px',
        });
    });

    it('Image with width and height in both style and attribute', () => {
        const element = document.createElement('img');

        element.style.width = '10px';
        element.style.height = '20px';

        element.setAttribute('width', '30');
        element.setAttribute('height', '40');

        sizeFormatHandler.parse(format, element, context, {});

        expect(format).toEqual({
            width: '10px',
            height: '20px',
            widthAttr: '30',
            heightAttr: '40',
        });
    });

    it('Element with width and height attributes equal to 0', () => {
        const element = document.createElement('div');

        element.setAttribute('width', '0');
        element.setAttribute('height', '0');

        sizeFormatHandler.parse(format, element, context, {});

        expect(format).toEqual({});
    });

    it('image with width and height attributes equal to 0', () => {
        const element = document.createElement('img');

        element.setAttribute('width', '0');
        element.setAttribute('height', '0');

        sizeFormatHandler.parse(format, element, context, {});

        expect(format).toEqual({});
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
    let img: HTMLImageElement;
    let format: SizeFormat;
    let context: ModelToDomContext;

    beforeEach(() => {
        div = document.createElement('div');
        img = document.createElement('img');
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

    it('Image has both width and height attribute', () => {
        format.width = '10px';
        format.height = '20px';
        format.widthAttr = '30';
        format.heightAttr = '40';
        sizeFormatHandler.apply(format, img, context);
        expect(img.outerHTML).toBe(
            '<img width="30" height="40" style="width: 10px; height: 20px;">'
        );
    });
});
