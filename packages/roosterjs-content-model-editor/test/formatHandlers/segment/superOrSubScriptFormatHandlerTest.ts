import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { DomToModelContext } from '../../../lib/publicTypes/context/DomToModelContext';
import { ModelToDomContext } from '../../../lib/publicTypes/context/ModelToDomContext';
import { SuperOrSubScriptFormat } from '../../../lib/publicTypes/format/formatParts/SuperOrSubScriptFormat';
import { superOrSubScriptFormatHandler } from '../../../lib/formatHandlers/segment/superOrSubScriptFormatHandler';

describe('superOrSubScriptFormatHandler.parse', () => {
    let div: HTMLElement;
    let context: DomToModelContext;
    let format: SuperOrSubScriptFormat;

    beforeEach(() => {
        div = document.createElement('div');
        context = createDomToModelContext();
        format = {};
    });

    it('No sub/sup', () => {
        superOrSubScriptFormatHandler.parse(format, div, context, {});

        expect(format.superOrSubScriptSequence).toBeUndefined();
    });

    it('Sub from element', () => {
        div.style.verticalAlign = 'sub';
        div.style.fontSize = 'smaller';
        superOrSubScriptFormatHandler.parse(format, div, context, {});

        expect(format.superOrSubScriptSequence).toBe('sub');
    });

    it('Sup from element', () => {
        div.style.verticalAlign = 'super';
        div.style.fontSize = 'smaller';
        superOrSubScriptFormatHandler.parse(format, div, context, {});

        expect(format.superOrSubScriptSequence).toBe('super');
    });

    it('Sub from default style', () => {
        superOrSubScriptFormatHandler.parse(format, div, context, {
            fontSize: 'smaller',
            verticalAlign: 'sub',
        });

        expect(format.superOrSubScriptSequence).toBe('sub');
    });

    it('Sup from default style', () => {
        superOrSubScriptFormatHandler.parse(format, div, context, {
            fontSize: 'smaller',
            verticalAlign: 'super',
        });

        expect(format.superOrSubScriptSequence).toBe('super');
    });

    it('Font size from element overwrite default style', () => {
        div.style.verticalAlign = 'sub';
        superOrSubScriptFormatHandler.parse(format, div, context, {
            fontSize: 'smaller',
            verticalAlign: 'super',
        });

        expect(format.superOrSubScriptSequence).toBe('sub');
    });

    it('Other font size with sub/sup', () => {
        div.style.fontSize = '20px';
        div.style.verticalAlign = 'sub';
        superOrSubScriptFormatHandler.parse(format, div, context, {});

        expect(format.superOrSubScriptSequence).toBeUndefined();
    });

    it('Sub from element to existing sub', () => {
        div.style.verticalAlign = 'sub';
        div.style.fontSize = 'smaller';
        format.superOrSubScriptSequence = 'sub';

        superOrSubScriptFormatHandler.parse(format, div, context, {});

        expect(format.superOrSubScriptSequence).toBe('sub sub');
    });

    it('Sup from element to existing sub', () => {
        div.style.verticalAlign = 'super';
        div.style.fontSize = 'smaller';
        format.superOrSubScriptSequence = 'sub';

        superOrSubScriptFormatHandler.parse(format, div, context, {});

        expect(format.superOrSubScriptSequence).toBe('sub super');
    });
});

describe('superOrSubScriptFormatHandler.apply', () => {
    let div: HTMLElement;
    let format: SuperOrSubScriptFormat;
    let context: ModelToDomContext;

    beforeEach(() => {
        div = document.createElement('div');
        format = {};
        context = createModelToDomContext();
    });

    it('no sub/sup', () => {
        superOrSubScriptFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toEqual('<div></div>');
    });

    it('Has sub', () => {
        format.superOrSubScriptSequence = 'sub';

        superOrSubScriptFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toEqual('<div><sub></sub></div>');
    });

    it('Has sup', () => {
        format.superOrSubScriptSequence = 'super';

        superOrSubScriptFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toEqual('<div><sup></sup></div>');
    });

    it('Has sub,sup and text', () => {
        format.superOrSubScriptSequence = 'sub super';
        div.innerHTML = 'test';

        superOrSubScriptFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toEqual('<div><sub><sup>test</sup></sub></div>');
    });
});
