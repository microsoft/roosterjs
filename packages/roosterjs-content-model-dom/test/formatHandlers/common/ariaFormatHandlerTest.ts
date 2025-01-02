import { AriaFormat, DomToModelContext, ModelToDomContext } from 'roosterjs-content-model-types';
import { ariaFormatHandler } from '../../../lib/formatHandlers/common/ariaFormatHandler';
import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';

describe('ariaFormatHandler.parse', () => {
    let div: HTMLElement;
    let format: AriaFormat;
    let context: DomToModelContext;

    beforeEach(() => {
        div = document.createElement('div');
        format = {};
        context = createDomToModelContext();
    });

    it('No title and describedby', () => {
        ariaFormatHandler.parse(format, div, context, {});
        expect(format).toEqual({});
    });

    it('has title and describedby', () => {
        div.setAttribute('title', 'test');
        div.setAttribute('aria-describedby', 'test');
        ariaFormatHandler.parse(format, div, context, {});
        expect(format).toEqual({
            title: 'test',
            ariaDescribedBy: 'test',
        });
    });

    it('has title and no describedby', () => {
        div.setAttribute('title', 'test');
        ariaFormatHandler.parse(format, div, context, {});
        expect(format).toEqual({
            title: 'test',
        });
    });

    it('no title and has describedby', () => {
        div.setAttribute('aria-describedby', 'test');
        ariaFormatHandler.parse(format, div, context, {});
        expect(format).toEqual({ ariaDescribedBy: 'test' });
    });
});

describe('idFormatHandler.apply', () => {
    let div: HTMLElement;
    let format: AriaFormat;
    let context: ModelToDomContext;

    beforeEach(() => {
        div = document.createElement('div');
        format = {};
        context = createModelToDomContext();
    });

    it('No title and no describedby', () => {
        ariaFormatHandler.apply(format, div, context);
        expect(div.outerHTML).toBe('<div></div>');
    });

    it('Has title and has describedby', () => {
        format.title = 'test';
        format.ariaDescribedBy = 'test';
        ariaFormatHandler.apply(format, div, context);
        expect(div.outerHTML).toBe('<div aria-describedby="test" title="test"></div>');
    });

    it('No title and has describedby', () => {
        format.ariaDescribedBy = 'test';
        ariaFormatHandler.apply(format, div, context);
        expect(div.outerHTML).toBe('<div aria-describedby="test"></div>');
    });

    it('Has title and no describedby', () => {
        format.title = 'test';
        ariaFormatHandler.apply(format, div, context);
        expect(div.outerHTML).toBe('<div title="test"></div>');
    });
});
