import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { defaultHTMLStyleMap } from '../../../lib/config/defaultHTMLStyleMap';
import { paddingFormatHandler } from '../../../lib/formatHandlers/block/paddingFormatHandler';
import {
    DirectionFormat,
    DomToModelContext,
    ModelToDomContext,
    PaddingFormat,
} from 'roosterjs-content-model-types';

describe('paddingFormatHandler.parse', () => {
    let div: HTMLElement;
    let format: PaddingFormat & DirectionFormat;
    let context: DomToModelContext;

    beforeEach(() => {
        div = document.createElement('div');
        format = {};
        context = createDomToModelContext();
    });

    it('No padding', () => {
        paddingFormatHandler.parse(format, div, context, {});
        expect(format).toEqual({});
    });

    it('Has padding in CSS', () => {
        div.style.padding = '1px 2px 3px 4px';
        paddingFormatHandler.parse(format, div, context, {});
        expect(format).toEqual({
            paddingTop: '1px',
            paddingRight: '2px',
            paddingBottom: '3px',
            paddingLeft: '4px',
        });
    });

    it('Overwrite padding values', () => {
        div.style.paddingLeft = '15pt';
        format.paddingLeft = '30px';
        paddingFormatHandler.parse(format, div, context, {});
        expect(format).toEqual({
            paddingLeft: '15pt',
        });
    });

    it('0 padding', () => {
        div.style.padding = '0 10px 20px 0';
        paddingFormatHandler.parse(format, div, context, {});
        expect(format).toEqual({
            paddingRight: '10px',
            paddingBottom: '20px',
        });
    });

    it('Default padding in OL, LTR', () => {
        paddingFormatHandler.parse(format, div, context, defaultHTMLStyleMap.ol!);

        expect(format).toEqual({});
    });

    it('Default padding in OL, RTL', () => {
        div.style.direction = 'rtl';

        paddingFormatHandler.parse(format, div, context, defaultHTMLStyleMap.ol!);

        expect(format).toEqual({
            direction: 'rtl',
        });
    });

    it('Default padding in UL, LTR', () => {
        paddingFormatHandler.parse(format, div, context, defaultHTMLStyleMap.ul!);

        expect(format).toEqual({});
    });

    it('Default padding in UL, RTL', () => {
        div.style.direction = 'rtl';

        paddingFormatHandler.parse(format, div, context, defaultHTMLStyleMap.ul!);

        expect(format).toEqual({
            direction: 'rtl',
        });
    });

    it('Customized padding in OL, LTR', () => {
        div.style.paddingLeft = '0';
        paddingFormatHandler.parse(format, div, context, defaultHTMLStyleMap.ol!);

        expect(format).toEqual({
            paddingLeft: '0px',
        });
    });

    it('Customized padding in OL, RTL', () => {
        div.style.direction = 'rtl';
        div.style.paddingLeft = '0';
        div.style.paddingRight = '20px';

        paddingFormatHandler.parse(format, div, context, defaultHTMLStyleMap.ol!);

        expect(format).toEqual({
            direction: 'rtl',
            paddingRight: '20px',
        });
    });

    it('Customized padding in UL, LTR', () => {
        div.style.paddingLeft = '20px';

        paddingFormatHandler.parse(format, div, context, defaultHTMLStyleMap.ul!);

        expect(format).toEqual({
            paddingLeft: '20px',
        });
    });

    it('Customized padding in UL, RTL', () => {
        div.style.direction = 'rtl';
        div.style.paddingLeft = '20px';
        div.style.paddingRight = '60px';

        paddingFormatHandler.parse(format, div, context, defaultHTMLStyleMap.ul!);

        expect(format).toEqual({
            direction: 'rtl',
            paddingLeft: '20px',
            paddingRight: '60px',
        });
    });
});

describe('paddingFormatHandler.apply', () => {
    let div: HTMLElement;
    let format: PaddingFormat & DirectionFormat;
    let context: ModelToDomContext;

    beforeEach(() => {
        div = document.createElement('div');
        format = {};
        context = createModelToDomContext();
    });

    it('No padding', () => {
        paddingFormatHandler.apply(format, div, context);
        expect(div.outerHTML).toBe('<div></div>');
    });

    it('Has padding', () => {
        format.paddingTop = '1px';
        format.paddingRight = '2px';
        format.paddingBottom = '3px';
        format.paddingLeft = '4px';

        paddingFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toBe('<div style="padding: 1px 2px 3px 4px;"></div>');
    });

    it('OL has no padding', () => {
        const ol = document.createElement('ol');

        paddingFormatHandler.apply(format, ol, context);

        expect(ol.outerHTML).toBe('<ol></ol>');
    });

    it('OL has default padding', () => {
        const ol = document.createElement('ol');

        format.paddingLeft = '40px';

        paddingFormatHandler.apply(format, ol, context);

        expect(ol.outerHTML).toBe('<ol></ol>');
    });

    it('OL has padding', () => {
        const ol = document.createElement('ol');

        format.paddingLeft = '60px';

        paddingFormatHandler.apply(format, ol, context);

        expect(ol.outerHTML).toBe('<ol style="padding-left: 60px;"></ol>');
    });

    it('UL has padding', () => {
        const ul = document.createElement('ul');

        format.paddingLeft = '60px';

        paddingFormatHandler.apply(format, ul, context);

        expect(ul.outerHTML).toBe('<ul style="padding-left: 60px;"></ul>');
    });

    it('OL has padding-left in RTL', () => {
        const ol = document.createElement('ol');

        format.paddingLeft = '40px';
        format.direction = 'rtl';

        paddingFormatHandler.apply(format, ol, context);

        expect(ol.outerHTML).toBe('<ol style="padding-left: 40px;"></ol>');
    });

    it('OL has padding-right in RTL', () => {
        const ol = document.createElement('ol');

        format.paddingRight = '40px';
        format.direction = 'rtl';

        paddingFormatHandler.apply(format, ol, context);

        expect(ol.outerHTML).toBe('<ol></ol>');
    });
});
