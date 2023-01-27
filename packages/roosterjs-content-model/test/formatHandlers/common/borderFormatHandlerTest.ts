import { BorderFormat } from '../../../lib/publicTypes/format/formatParts/BorderFormat';
import { borderFormatHandler } from '../../../lib/formatHandlers/common/borderFormatHandler';
import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { DomToModelContext } from '../../../lib/publicTypes/context/DomToModelContext';
import { itChromeOnly } from 'roosterjs-editor-dom/test/DomTestHelper';
import { ModelToDomContext } from '../../../lib/publicTypes/context/ModelToDomContext';

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
            borderTop: '1px none red',
            borderRight: '2px none red',
            borderBottom: '3px none red',
            borderLeft: '4px none red',
        });
    });

    it('Has border width none value only', () => {
        div.style.borderStyle = '';

        borderFormatHandler.parse(format, div, context, {});

        expect(format).toEqual({});
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

    itChromeOnly('Has border color - empty values', () => {
        format.borderTop = 'red';

        borderFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toEqual('<div style="border-top: red;"></div>');
    });
});
