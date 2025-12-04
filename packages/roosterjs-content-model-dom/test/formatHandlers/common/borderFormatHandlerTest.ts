import { BorderFormat, DomToModelContext, ModelToDomContext } from 'roosterjs-content-model-types';
import { borderFormatHandler } from '../../../lib/formatHandlers/common/borderFormatHandler';
import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';

describe('borderFormatHandler.parse', () => {
    let div: HTMLElement;
    let format: BorderFormat;
    let context: DomToModelContext;

    beforeEach(() => {
        div = document.createElement('div');
        format = {};
        context = createDomToModelContext();
    });

    it('No border', () => {
        borderFormatHandler.parse(format, div, context, {});

        expect(format).toEqual({});
    });

    it('Has border values', () => {
        div.style.borderColor = 'red';
        div.style.borderStyle = 'solid';
        div.style.borderWidth = '1px';

        borderFormatHandler.parse(format, div, context, {});

        expect(format).toEqual({
            borderTop: '1px solid red',
            borderRight: '1px solid red',
            borderBottom: '1px solid red',
            borderLeft: '1px solid red',
        });
    });

    it('Has border width with different values', () => {
        div.style.borderWidth = '1px 2px 3px 4px';
        div.style.borderStyle = 'solid';
        div.style.borderColor = 'red';

        borderFormatHandler.parse(format, div, context, {});

        expect(format).toEqual({
            borderTop: '1px solid red',
            borderRight: '2px solid red',
            borderBottom: '3px solid red',
            borderLeft: '4px solid red',
        });
    });

    it('Has border width none value', () => {
        div.style.borderWidth = '1px 2px 3px 4px';
        div.style.borderStyle = 'none';
        div.style.borderColor = 'red';

        borderFormatHandler.parse(format, div, context, {});

        expect(format).toEqual({
            borderTop: jasmine.stringMatching(/1px (none )?red/),
            borderRight: jasmine.stringMatching(/2px (none )?red/),
            borderBottom: jasmine.stringMatching(/3px (none )?red/),
            borderLeft: jasmine.stringMatching(/4px (none )?red/),
        });
    });

    it('Has border width none value only', () => {
        div.style.borderStyle = '';

        borderFormatHandler.parse(format, div, context, {});

        expect(format).toEqual({});
    });

    it('Has 0 width border', () => {
        div.style.border = '0px sold black';

        borderFormatHandler.parse(format, div, context, {});

        expect(format).toEqual({});
    });

    it('Has border radius', () => {
        div.style.borderRadius = '10px';

        borderFormatHandler.parse(format, div, context, {});

        expect(format).toEqual({
            borderRadius: '10px',
        });
    });

    it('Has border radius and independant corner radius, but prefer shorthand css', () => {
        div.style.borderTopRightRadius = '7px';
        div.style.borderBottomLeftRadius = '7px';
        div.style.borderBottomRightRadius = '7px';
        div.style.borderRadius = '10px';

        borderFormatHandler.parse(format, div, context, {});

        expect(format).toEqual({
            borderRadius: '10px',
        });
    });

    it('Has border borderTopLeftRadius', () => {
        div.style.borderTopLeftRadius = '10px';

        borderFormatHandler.parse(format, div, context, {});

        expect(format).toEqual({
            borderTopLeftRadius: '10px',
        });
    });

    it('Has border borderTopRightRadius', () => {
        div.style.borderTopRightRadius = '10px';

        borderFormatHandler.parse(format, div, context, {});

        expect(format).toEqual({
            borderTopRightRadius: '10px',
        });
    });

    it('Has border borderBottomLeftRadius', () => {
        div.style.borderBottomLeftRadius = '10px';

        borderFormatHandler.parse(format, div, context, {});

        expect(format).toEqual({
            borderBottomLeftRadius: '10px',
        });
    });

    it('Has border borderBottomRightRadius', () => {
        div.style.borderBottomRightRadius = '10px';

        borderFormatHandler.parse(format, div, context, {});

        expect(format).toEqual({
            borderBottomRightRadius: '10px',
        });
    });
});

describe('borderFormatHandler.apply', () => {
    let div: HTMLElement;
    let format: BorderFormat;
    let context: ModelToDomContext;

    beforeEach(() => {
        div = document.createElement('div');
        format = {};
        context = createModelToDomContext();
    });

    it('No border', () => {
        borderFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toEqual('<div></div>');
    });

    it('Has top border', () => {
        format.borderTop = '1px solid red';

        borderFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toEqual('<div style="border-top: 1px solid red;"></div>');
    });

    it('Has border color - empty values', () => {
        format.borderTop = 'red';

        borderFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toEqual('<div style="border-top: red;"></div>');
    });

    it('Use independant border radius 1', () => {
        format.borderBottomLeftRadius = '2px';
        format.borderBottomRightRadius = '3px';
        format.borderTopRightRadius = '3px';

        borderFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toEqual(
            '<div style="border-top-right-radius: 3px; border-bottom-left-radius: 2px; border-bottom-right-radius: 3px;"></div>'
        );
    });

    it('border radius', () => {
        format.borderRadius = '50%';

        borderFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toEqual('<div style="border-radius: 50%;"></div>');
    });
});
