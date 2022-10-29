import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { DomToModelContext } from '../../../lib/publicTypes/context/DomToModelContext';
import { ModelToDomContext } from '../../../lib/publicTypes/context/ModelToDomContext';
import { UnderlineAndLinkFormat } from '../../../lib/publicTypes/format/formatParts/UnderlineAndLinkFormat';
import { underlineAndLinkFormatHandler } from '../../../lib/formatHandlers/segment/underlineAndLinkFormatHandler';

describe('underlineAndLinkFormatHandler.parse', () => {
    let div: HTMLElement;
    let context: DomToModelContext;
    let format: UnderlineAndLinkFormat;

    beforeEach(() => {
        div = document.createElement('div');
        context = createDomToModelContext();
        format = {};
    });

    it('No underline', () => {
        underlineAndLinkFormatHandler.parse(format, div, context, {});

        expect(format).toEqual({});
    });

    it('underline from element', () => {
        ['underline', 'underline line-through'].forEach(value => {
            div.style.textDecoration = value;
            underlineAndLinkFormatHandler.parse(format, div, context, {});

            expect(format).toEqual({
                underline: true,
            });
        });
    });

    it('No underline from element', () => {
        div.style.textDecoration = 'none';
        underlineAndLinkFormatHandler.parse(format, div, context, {});

        expect(format.underline).toBeUndefined();
    });

    it('underline from default style', () => {
        ['underline', 'underline line-through'].forEach(value => {
            underlineAndLinkFormatHandler.parse(format, div, context, { textDecoration: value });

            expect(format).toEqual({
                underline: true,
            });
        });
    });

    it('No underline from default style', () => {
        underlineAndLinkFormatHandler.parse(format, div, context, { textDecoration: 'none' });

        expect(format).toEqual({});
    });

    it('underline from element overwrite default style', () => {
        ['underline', 'underline line-through'].forEach(styleValue => {
            div.style.textDecoration = styleValue;
            underlineAndLinkFormatHandler.parse(format, div, context, {
                textDecoration: 'none',
            });

            expect(format).toEqual({
                underline: true,
            });
        });
    });

    it('No underline from element overwrite default style', () => {
        ['underline', 'underline line-through'].forEach(defaultStyleValue => {
            div.style.textDecoration = 'none';
            underlineAndLinkFormatHandler.parse(format, div, context, {
                textDecoration: defaultStyleValue,
            });

            expect(format).toEqual({});
        });
    });

    it('Simple link', () => {
        let a = document.createElement('a');

        a.href = '/test';

        underlineAndLinkFormatHandler.parse(format, a, context, context.defaultStyles.a!);

        expect(format).toEqual({
            underline: true,
            href: '/test',
        });
    });

    it('Link with more attributes', () => {
        let a = document.createElement('a');

        a.href = '/test';
        a.title = 'title';
        a.id = 'id';
        a.className = 'class';
        a.rel = 'rel';
        a.target = 'target';

        underlineAndLinkFormatHandler.parse(format, a, context, context.defaultStyles.a!);

        expect(format).toEqual({
            underline: true,
            anchorClass: 'class',
            anchorId: 'id',
            anchorTitle: 'title',
            href: '/test',
            relationship: 'rel',
            target: 'target',
        });
    });

    it('Link without underline', () => {
        let a = document.createElement('a');

        a.href = '/test';
        a.style.textDecoration = 'none';

        underlineAndLinkFormatHandler.parse(format, a, context, context.defaultStyles.a!);

        expect(format).toEqual({
            href: '/test',
        });
    });
});

describe('underlineAndLinkFormatHandler.apply', () => {
    let div: HTMLElement;
    let format: UnderlineAndLinkFormat;
    let context: ModelToDomContext;

    beforeEach(() => {
        div = document.createElement('div');
        format = {};
        context = createModelToDomContext();
    });

    it('no underline', () => {
        underlineAndLinkFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toEqual('<div></div>');
    });

    it('underline is false', () => {
        format.underline = false;

        underlineAndLinkFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toEqual('<div></div>');
    });

    it('Has underline', () => {
        format.underline = true;

        underlineAndLinkFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toEqual('<div><u></u></div>');
    });

    it('Has underline with text', () => {
        format.underline = true;
        div.innerHTML = 'test';

        underlineAndLinkFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toEqual('<div><u>test</u></div>');
    });

    it('Simple link', () => {
        format.href = '/test';
        format.underline = true;
        div.innerHTML = 'test';

        underlineAndLinkFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toEqual('<div><a href="/test">test</a></div>');
    });

    it('Link with attributes', () => {
        format.href = '/test';
        format.underline = true;
        format.anchorClass = 'class';
        format.anchorId = 'id';
        format.anchorTitle = 'title';
        format.relationship = 'rel';
        format.target = 'target';
        div.innerHTML = 'test';

        underlineAndLinkFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toEqual(
            '<div><a href="/test" target="target" id="id" class="class" title="title" rel="rel">test</a></div>'
        );
    });

    it('Link without underline', () => {
        format.href = '/test';
        div.innerHTML = 'test';

        underlineAndLinkFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toEqual(
            '<div><a href="/test" style="text-decoration: none;">test</a></div>'
        );
    });

    it('Link insdie another link', () => {
        format.href = '/test';
        div.innerHTML = 'test';
        const a = document.createElement('a');
        a.appendChild(div);

        underlineAndLinkFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toEqual('<div>test</div>');
    });
});
