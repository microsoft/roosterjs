import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { DomToModelContext } from '../../../lib/publicTypes/context/DomToModelContext';
import { LinkFormat } from '../../../lib/publicTypes/format/formatParts/LinkFormat';
import { linkFormatHandler } from '../../../lib/formatHandlers/segment/linkFormatHandler';
import { ModelToDomContext } from '../../../lib/publicTypes/context/ModelToDomContext';

describe('linkFormatHandler.parse', () => {
    let context: DomToModelContext;
    let format: LinkFormat;

    beforeEach(() => {
        context = createDomToModelContext();
        format = {};
    });

    it('No link', () => {
        let div = document.createElement('div');

        linkFormatHandler.parse(format, div, context, {});

        expect(format.anchorClass).toBeUndefined();
        expect(format.anchorId).toBeUndefined();
        expect(format.anchorTitle).toBeUndefined();
        expect(format.href).toBeUndefined();
        expect(format.relationship).toBeUndefined();
        expect(format.target).toBeUndefined();
    });

    it('Simple link', () => {
        let a = document.createElement('a');

        a.href = '/test';

        linkFormatHandler.parse(format, a, context, {});

        expect(format.anchorClass).toBeUndefined();
        expect(format.anchorId).toBeUndefined();
        expect(format.anchorTitle).toBeUndefined();
        expect(format.href).toBe('/test');
        expect(format.relationship).toBeUndefined();
        expect(format.target).toBeUndefined();
    });

    it('Link with more attributes', () => {
        let a = document.createElement('a');

        a.href = '/test';
        a.title = 'title';
        a.id = 'id';
        a.className = 'class';
        a.rel = 'rel';
        a.target = 'target';

        linkFormatHandler.parse(format, a, context, {});

        expect(format.anchorClass).toBe('class');
        expect(format.anchorId).toBe('id');
        expect(format.anchorTitle).toBe('title');
        expect(format.href).toBe('/test');
        expect(format.relationship).toBe('rel');
        expect(format.target).toBe('target');
    });
});

describe('linkFormatHandler.apply', () => {
    let div: HTMLElement;
    let format: LinkFormat;
    let context: ModelToDomContext;

    beforeEach(() => {
        div = document.createElement('div');
        format = {};
        context = createModelToDomContext();
    });

    it('no italic', () => {
        linkFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toEqual('<div></div>');
    });

    it('Italic is false', () => {
        format.italic = false;

        linkFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toEqual('<div></div>');
    });

    it('Has italic', () => {
        format.italic = true;

        linkFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toEqual('<div><i></i></div>');
    });

    it('Has italic with text', () => {
        format.italic = true;
        div.innerHTML = 'test';

        linkFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toEqual('<div><i>test</i></div>');
    });
});
