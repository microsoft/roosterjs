import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { listItemAlignFormatHandler } from '../../../lib/formatHandlers/list/listItemAlignFormatHandler';
import {
    DomToModelContext,
    ModelToDomContext,
    TextAlignFormat,
} from 'roosterjs-content-model-types';

describe('listItemAlignFormatHandler.parse', () => {
    let li: HTMLLIElement;
    let format: TextAlignFormat;
    let context: DomToModelContext;

    beforeEach(() => {
        li = document.createElement('li');
        format = {};
        context = createDomToModelContext();
    });

    it('no direction', () => {
        listItemAlignFormatHandler.parse(format, li, context, {});
        expect(format).toEqual({});
    });

    it('LTR, Align in CSS - alignSelf', () => {
        li.style.alignSelf = 'start';
        listItemAlignFormatHandler.parse(format, li, context, {});
        expect(format.textAlign).toBe('start');
    });

    it('LTR, align in CSS - textAlign (absolute)', () => {
        li.style.textAlign = 'right';
        listItemAlignFormatHandler.parse(format, li, context, {});
        expect(format.textAlign).toBe('end');
    });

    it('LTR, align in CSS - textAlign (relative)', () => {
        li.style.textAlign = 'start';
        listItemAlignFormatHandler.parse(format, li, context, {});
        expect(format.textAlign).toBe('start');
    });

    it('RTL, Align in CSS - alignSelf', () => {
        context.blockFormat.direction = 'rtl';
        li.style.alignSelf = 'start';
        listItemAlignFormatHandler.parse(format, li, context, {});
        expect(format.textAlign).toBe('start');
    });

    it('RTL, align in CSS - textAlign (absolute)', () => {
        context.blockFormat.direction = 'rtl';
        li.style.textAlign = 'right';
        listItemAlignFormatHandler.parse(format, li, context, {});
        expect(format.textAlign).toBe('start');
    });

    it('RTL, align in CSS - textAlign (relative)', () => {
        context.blockFormat.direction = 'rtl';
        li.style.textAlign = 'start';
        listItemAlignFormatHandler.parse(format, li, context, {});
        expect(format.textAlign).toBe('end');
    });

    it('RTL, align in CSS - textAlign (absolute, flex)', () => {
        context.blockFormat.direction = 'rtl';
        li.style.textAlign = 'right';

        const ol = document.createElement('ol');
        ol.style.display = 'flex';
        ol.style.flexDirection = 'column';
        ol.appendChild(li);

        listItemAlignFormatHandler.parse(format, li, context, {});
        expect(format.textAlign).toBeUndefined();
    });

    it('RTL, align in CSS - textAlign (relative, flex)', () => {
        context.blockFormat.direction = 'rtl';
        li.style.textAlign = 'start';

        const ol = document.createElement('ol');
        ol.style.display = 'flex';
        ol.style.flexDirection = 'column';
        ol.appendChild(li);

        listItemAlignFormatHandler.parse(format, li, context, {});
        expect(format.textAlign).toBeUndefined();
    });
});

describe('listItemAlignFormatHandler.apply', () => {
    let div: HTMLElement;
    let format: TextAlignFormat;
    let context: ModelToDomContext;

    beforeEach(() => {
        div = document.createElement('div');
        format = {};
        context = createModelToDomContext();
    });

    it('No alignment', () => {
        listItemAlignFormatHandler.apply(format, div, context);
        expect(div.outerHTML).toBe('<div></div>');
    });

    it('Start', () => {
        format.textAlign = 'start';
        listItemAlignFormatHandler.apply(format, div, context);
        expect(div.outerHTML).toBe('<div style="align-self: start;"></div>');
    });

    it('End with parent', () => {
        format.textAlign = 'end';
        const parent = document.createElement('div');

        parent.appendChild(div);

        listItemAlignFormatHandler.apply(format, div, context);

        expect(parent.outerHTML).toBe(
            '<div style="flex-direction: column; display: flex;"><div style="align-self: end;"></div></div>'
        );
    });
});
