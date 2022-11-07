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

    it('Not a link', () => {
        let div = document.createElement('div');

        div.setAttribute('href', '/test');

        linkFormatHandler.parse(format, div, context, context.defaultStyles.a!);

        expect(format).toEqual({});
    });

    it('Simple link', () => {
        let a = document.createElement('a');

        a.href = '/test';

        linkFormatHandler.parse(format, a, context, context.defaultStyles.a!);

        expect(format).toEqual({
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
        a.name = 'name';

        linkFormatHandler.parse(format, a, context, context.defaultStyles.a!);

        expect(format).toEqual({
            anchorClass: 'class',
            anchorId: 'id',
            anchorTitle: 'title',
            href: '/test',
            relationship: 'rel',
            target: 'target',
            name: 'name',
        });
    });
});

describe('linkFormatHandler.apply', () => {
    let format: LinkFormat;
    let context: ModelToDomContext;

    beforeEach(() => {
        format = {};
        context = createModelToDomContext();
    });

    it('Not a link', () => {
        format.href = '/test';
        const div = document.createElement('div');
        div.innerHTML = 'test';

        linkFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toEqual('<div>test</div>');
    });

    it('Simple link', () => {
        format.href = '/test';
        const a = document.createElement('a');
        a.innerHTML = 'test';

        linkFormatHandler.apply(format, a, context);

        expect(a.outerHTML).toEqual('<a href="/test">test</a>');
    });

    it('Link with attributes', () => {
        format.href = '/test';
        format.anchorClass = 'class';
        format.anchorId = 'id';
        format.anchorTitle = 'title';
        format.relationship = 'rel';
        format.target = 'target';
        format.name = 'name';

        const a = document.createElement('a');
        a.innerHTML = 'test';

        linkFormatHandler.apply(format, a, context);

        expect(a.outerHTML).toEqual(
            '<a href="/test" name="name" target="target" id="id" class="class" title="title" rel="rel">test</a>'
        );
    });
});
