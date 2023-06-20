import { BoxShadowFormat } from '../../../lib/publicTypes/format/formatParts/BoxShadowFormat';
import { boxShadowFormatHandler } from '../../../lib/formatHandlers/common/boxShadowFormatHandler';
import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { DomToModelContext } from '../../../lib/publicTypes/context/DomToModelContext';
import { ModelToDomContext } from '../../../lib/publicTypes/context/ModelToDomContext';

describe('boxShadowFormatHandler.parse', () => {
    let div: HTMLElement;
    let format: BoxShadowFormat;
    let context: DomToModelContext;

    beforeEach(() => {
        div = document.createElement('div');
        format = {};
        context = createDomToModelContext();
    });

    function runTest(cssValue: string | null, expectedValue: string) {
        if (cssValue) {
            div.style.boxShadow = cssValue;
        }

        boxShadowFormatHandler.parse(format, div, context, {});

        expect(format).toEqual({
            boxShadow: expectedValue,
        });
    }

    it('No shadow', () => {
        boxShadowFormatHandler.parse(format, div, context, {});
        expect(format).toEqual({});
    });

    it('Parse shadow', () => {
        runTest('4px 4px 3px #aaaaaa', 'rgb(170, 170, 170) 4px 4px 3px');
    });
});

describe('boxShadowFormatHandler.apply', () => {
    let div: HTMLElement;
    let format: BoxShadowFormat;
    let context: ModelToDomContext;

    beforeEach(() => {
        div = document.createElement('div');
        format = {};
        context = createModelToDomContext();
    });

    it('No shadow', () => {
        boxShadowFormatHandler.apply(format, div, context);
        expect(div.outerHTML).toBe('<div></div>');
    });

    it('Apply shadow', () => {
        format.boxShadow = '4px 4px 3px #aaaaaa';
        boxShadowFormatHandler.apply(format, div, context);
        expect(div.outerHTML).toBe(
            '<div style="box-shadow: rgb(170, 170, 170) 4px 4px 3px;"></div>'
        );
    });
});
