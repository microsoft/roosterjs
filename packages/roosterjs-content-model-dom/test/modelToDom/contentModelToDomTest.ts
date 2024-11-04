import { contentModelToDom } from '../../lib/modelToDom/contentModelToDom';
import { createBr } from '../../lib/modelApi/creators/createBr';
import { createContentModelDocument } from '../../lib/modelApi/creators/createContentModelDocument';
import { createModelToDomContext } from '../../lib/modelToDom/context/createModelToDomContext';
import { createParagraph } from '../../lib/modelApi/creators/createParagraph';
import { createSelectionMarker } from '../../lib/modelApi/creators/createSelectionMarker';
import { ImageSelection, RangeSelection } from 'roosterjs-content-model-types';

describe('contentModelToDom', () => {
    it('Empty model, no selection', () => {
        const parent = document.createElement('div');
        const model = createContentModelDocument();
        const context = createModelToDomContext();

        const range = contentModelToDom(document, parent, model, context);

        expect(range).toBeNull();
        expect(parent.innerHTML).toBe('');
        expect(context.regularSelection).toEqual({
            current: {
                block: null,
                segment: null,
            },
        });
    });

    it('With Model, no selection', () => {
        const parent = document.createElement('div');
        const model = createContentModelDocument();
        const para = createParagraph();
        const br = createBr();
        const context = createModelToDomContext();

        para.segments.push(br);
        model.blocks.push(para);

        const range = contentModelToDom(document, parent, model, context);

        expect(range).toBeNull();
        expect(parent.innerHTML).toBe('<div><br></div>');
        expect(context.regularSelection).toEqual({
            current: {
                block: parent.firstChild,
                segment: parent.firstChild!.firstChild,
            },
        });
    });

    it('With Model, with collapsed selection', () => {
        const parent = document.createElement('div');
        const model = createContentModelDocument();
        const para = createParagraph();
        const br = createBr();
        const marker = createSelectionMarker();
        const context = createModelToDomContext();

        para.segments.push(marker, br);
        model.blocks.push(para);

        const range = contentModelToDom(document, parent, model, context);

        expect(range!.type).toBe('range');
        expect((range as RangeSelection).range.startContainer).toBe(
            parent.firstChild as HTMLElement
        );
        expect((range as RangeSelection).range.startOffset).toBe(0);
        expect((range as RangeSelection).range.endContainer).toBe(parent.firstChild as HTMLElement);
        expect((range as RangeSelection).range.endOffset).toBe(0);
        expect((range as RangeSelection).isReverted).toBe(false);
        expect(parent.innerHTML).toBe('<div><br></div>');
    });

    it('Extract selection range - normal collapsed range', () => {
        const mockedHandler = jasmine.createSpy('blockGroupChildren');
        const context = createModelToDomContext(undefined, {
            modelHandlerOverride: {
                blockGroupChildren: mockedHandler,
            },
        });

        const root = document.createElement('div');
        const div = document.createElement('div');
        const br = document.createElement('br');

        div.appendChild(br);
        root.appendChild(div);

        context.regularSelection.start = {
            block: div,
            segment: br,
        };
        context.regularSelection.end = {
            block: div,
            segment: br,
        };

        const range = contentModelToDom(document, root, {} as any, context);

        expect(range!.type).toBe('range');
        expect((range as RangeSelection).range.startContainer).toBe(div);
        expect((range as RangeSelection).range.startOffset).toBe(1);
        expect((range as RangeSelection).range.endContainer).toBe(div);
        expect((range as RangeSelection).range.endOffset).toBe(1);
        expect((range as RangeSelection).isReverted).toBe(false);
    });

    it('Extract expanded range - range in middle of text', () => {
        const mockedHandler = jasmine.createSpy('blockGroupChildren');
        const context = createModelToDomContext(undefined, {
            modelHandlerOverride: {
                blockGroupChildren: mockedHandler,
            },
        });

        const root = document.createElement('div');
        const div = document.createElement('div');
        const text = document.createTextNode('abcd');

        div.appendChild(text);
        root.appendChild(div);

        context.regularSelection.start = {
            block: div,
            segment: text,
            offset: 1,
        };
        context.regularSelection.end = {
            block: div,
            segment: text,
            offset: 3,
        };

        const range = contentModelToDom(document, root, {} as any, context);

        expect(range!.type).toBe('range');
        expect((range as RangeSelection).range.startContainer).toBe(text);
        expect((range as RangeSelection).range.startOffset).toBe(1);
        expect((range as RangeSelection).range.endContainer).toBe(text);
        expect((range as RangeSelection).range.endOffset).toBe(3);
        expect((range as RangeSelection).isReverted).toBe(false);
    });

    it('Extract range after empty text', () => {
        const mockedHandler = jasmine.createSpy('blockGroupChildren');
        const context = createModelToDomContext(undefined, {
            modelHandlerOverride: {
                blockGroupChildren: mockedHandler,
            },
        });

        const root = document.createElement('div');
        const div = document.createElement('div');
        const text = document.createTextNode('');

        div.appendChild(text);
        root.appendChild(div);

        context.regularSelection.start = {
            block: div,
            segment: text,
        };
        context.regularSelection.end = {
            block: div,
            segment: text,
        };

        const range = contentModelToDom(document, root, {} as any, context);

        expect(range!.type).toBe('range');
        expect((range as RangeSelection).range.startContainer).toBe(div);
        expect((range as RangeSelection).range.startOffset).toBe(0);
        expect((range as RangeSelection).range.endContainer).toBe(div);
        expect((range as RangeSelection).range.endOffset).toBe(0);
        expect((range as RangeSelection).isReverted).toBe(false);
    });

    it('Extract selection range - normal collapsed range with empty text', () => {
        const mockedHandler = jasmine.createSpy('blockGroupChildren');
        const context = createModelToDomContext(undefined, {
            modelHandlerOverride: {
                blockGroupChildren: mockedHandler,
            },
        });

        const root = document.createElement('div');
        const div = document.createElement('div');
        const txt = document.createTextNode('');
        const br = document.createElement('br');

        div.appendChild(txt);
        div.appendChild(br);
        root.appendChild(div);

        context.regularSelection.start = {
            block: div,
            segment: txt,
        };
        context.regularSelection.end = {
            block: div,
            segment: txt,
        };

        const range = contentModelToDom(document, root, {} as any, context);

        expect(range!.type).toBe('range');
        expect((range as RangeSelection).range.startContainer).toBe(div);
        expect((range as RangeSelection).range.startOffset).toBe(0);
        expect((range as RangeSelection).range.endContainer).toBe(div);
        expect((range as RangeSelection).range.endOffset).toBe(0);
        expect((range as RangeSelection).isReverted).toBe(false);
    });

    it('Extract selection range - normal collapsed range in side text', () => {
        const mockedHandler = jasmine.createSpy('blockGroupChildren');
        const context = createModelToDomContext(undefined, {
            modelHandlerOverride: {
                blockGroupChildren: mockedHandler,
            },
        });

        const root = document.createElement('div');
        const div = document.createElement('div');
        const txt1 = document.createTextNode('test1');
        const txt2 = document.createTextNode('test2');

        div.appendChild(txt1);
        div.appendChild(txt2);
        root.appendChild(div);

        context.regularSelection.start = {
            block: div,
            segment: txt1,
        };
        context.regularSelection.end = {
            block: div,
            segment: txt1,
        };

        const range = contentModelToDom(document, root, {} as any, context);

        expect(range!.type).toBe('range');
        expect((range as RangeSelection).range.startContainer).toBe(txt1);
        expect((range as RangeSelection).range.startOffset).toBe(5);
        expect((range as RangeSelection).range.endContainer).toBe(txt1);
        expect((range as RangeSelection).range.endOffset).toBe(5);
        expect((range as RangeSelection).isReverted).toBe(false);
        expect(txt1.nodeValue).toBe('test1test2');
    });

    it('Extract selection range - no block', () => {
        const mockedHandler = jasmine.createSpy('blockGroupChildren');
        const context = createModelToDomContext(undefined, {
            modelHandlerOverride: {
                blockGroupChildren: mockedHandler,
            },
        });

        const root = document.createElement('div');
        const div = document.createElement('div');
        const txt1 = document.createTextNode('test1');

        div.appendChild(txt1);
        root.appendChild(div);

        context.regularSelection.start = {
            block: null,
            segment: txt1,
        };
        context.regularSelection.end = {
            block: null,
            segment: txt1,
        };

        const range = contentModelToDom(document, root, {} as any, context);

        expect(range).toBeNull();
    });

    it('Extract selection range - no segment', () => {
        const mockedHandler = jasmine.createSpy('blockGroupChildren');
        const context = createModelToDomContext(undefined, {
            modelHandlerOverride: {
                blockGroupChildren: mockedHandler,
            },
        });

        const root = document.createElement('div');
        const div = document.createElement('div');
        const txt1 = document.createTextNode('test1');

        div.appendChild(txt1);
        root.appendChild(div);

        context.regularSelection.start = {
            block: div,
            segment: null,
        };
        context.regularSelection.end = {
            block: div,
            segment: null,
        };

        const range = contentModelToDom(document, root, {} as any, context);

        expect(range!.type).toBe('range');
        expect((range as RangeSelection).range.startContainer).toBe(div);
        expect((range as RangeSelection).range.startOffset).toBe(0);
        expect((range as RangeSelection).range.endContainer).toBe(div);
        expect((range as RangeSelection).range.endOffset).toBe(0);
        expect((range as RangeSelection).isReverted).toBe(false);
    });

    it('Extract selection range - no end', () => {
        const mockedHandler = jasmine.createSpy('blockGroupChildren');
        const context = createModelToDomContext(undefined, {
            modelHandlerOverride: {
                blockGroupChildren: mockedHandler,
            },
        });

        const root = document.createElement('div');
        const div = document.createElement('div');
        const txt1 = document.createTextNode('test1');

        div.appendChild(txt1);
        root.appendChild(div);

        context.regularSelection.start = {
            block: div,
            segment: txt1,
        };

        const range = contentModelToDom(document, root, {} as any, context);

        expect(range).toBeNull();
    });

    it('Extract selection range - root is fragment - 1', () => {
        const mockedHandler = jasmine.createSpy('blockGroupChildren');
        const context = createModelToDomContext(undefined, {
            modelHandlerOverride: {
                blockGroupChildren: mockedHandler,
            },
        });

        const root = document.createDocumentFragment();
        const txt1 = document.createTextNode('test1');

        root.appendChild(txt1);

        context.regularSelection.start = {
            block: root,
            segment: txt1,
        };
        context.regularSelection.end = {
            block: root,
            segment: txt1,
        };

        const range = contentModelToDom(document, root, {} as any, context);

        expect(range!.type).toBe('range');
        expect((range as RangeSelection).range.startContainer).toBe(txt1);
        expect((range as RangeSelection).range.startOffset).toBe(5);
        expect((range as RangeSelection).range.endContainer).toBe(txt1);
        expect((range as RangeSelection).range.endOffset).toBe(5);
        expect((range as RangeSelection).isReverted).toBe(false);
    });

    it('Extract selection range - root is fragment - 2', () => {
        const mockedHandler = jasmine.createSpy('blockGroupChildren');
        const context = createModelToDomContext(undefined, {
            modelHandlerOverride: {
                blockGroupChildren: mockedHandler,
            },
        });

        const root = document.createDocumentFragment();
        const span = document.createElement('span');
        const txt1 = document.createTextNode('test1');

        root.appendChild(span);
        span.appendChild(txt1);

        context.regularSelection.start = {
            block: root,
            segment: span,
        };
        context.regularSelection.end = {
            block: root,
            segment: span,
        };

        const range = contentModelToDom(document, root, {} as any, context);

        expect(range!.type).toBe('range');
        expect((range as RangeSelection).range.startContainer).toBe(span);
        expect((range as RangeSelection).range.startOffset).toBe(1);
        expect((range as RangeSelection).range.endContainer).toBe(span);
        expect((range as RangeSelection).range.endOffset).toBe(1);
        expect((range as RangeSelection).isReverted).toBe(false);
    });

    it('Extract selection range - expanded range', () => {
        const mockedHandler = jasmine.createSpy('blockGroupChildren');
        const context = createModelToDomContext(undefined, {
            modelHandlerOverride: {
                blockGroupChildren: mockedHandler,
            },
        });

        const root = document.createElement('div');
        const span = document.createElement('span');
        const txt1 = document.createTextNode('test1');
        const txt2 = document.createTextNode('test2');
        const txt3 = document.createTextNode('test3');

        root.appendChild(span);
        span.appendChild(txt1);
        span.appendChild(txt2);
        span.appendChild(txt3);

        context.regularSelection.start = {
            block: span,
            segment: txt1,
        };
        context.regularSelection.end = {
            block: span,
            segment: txt2,
        };

        const range = contentModelToDom(document, root, {} as any, context);

        expect(range!.type).toBe('range');
        expect((range as RangeSelection).range.startContainer).toBe(txt1);
        expect((range as RangeSelection).range.startOffset).toBe(5);
        expect((range as RangeSelection).range.endContainer).toBe(txt1);
        expect((range as RangeSelection).range.endOffset).toBe(10);
        expect(txt1.nodeValue).toEqual('test1test2test3');
        expect((range as RangeSelection).isReverted).toBe(false);
    });

    it('Extract selection range - reverted expanded range', () => {
        const mockedHandler = jasmine.createSpy('blockGroupChildren');
        const context = createModelToDomContext(undefined, {
            modelHandlerOverride: {
                blockGroupChildren: mockedHandler,
            },
        });

        const root = document.createElement('div');
        const span = document.createElement('span');
        const txt1 = document.createTextNode('test1');
        const txt2 = document.createTextNode('test2');
        const txt3 = document.createTextNode('test3');

        root.appendChild(span);
        span.appendChild(txt1);
        span.appendChild(txt2);
        span.appendChild(txt3);

        context.regularSelection.start = {
            block: span,
            segment: txt1,
        };
        context.regularSelection.end = {
            block: span,
            segment: txt2,
        };

        const range = contentModelToDom(
            document,
            root,
            { hasRevertedRangeSelection: true } as any,
            context
        );

        expect(range!.type).toBe('range');
        expect((range as RangeSelection).range.startContainer).toBe(txt1);
        expect((range as RangeSelection).range.startOffset).toBe(5);
        expect((range as RangeSelection).range.endContainer).toBe(txt1);
        expect((range as RangeSelection).range.endOffset).toBe(10);
        expect((range as RangeSelection).isReverted).toBe(true);
        expect(txt1.nodeValue).toEqual('test1test2test3');
    });

    it('Extract selection range - image range', () => {
        const mockedHandler = jasmine.createSpy('blockGroupChildren');
        const context = createModelToDomContext(undefined, {
            modelHandlerOverride: {
                blockGroupChildren: mockedHandler,
            },
        });

        const root = document.createElement('div');
        const image = document.createElement('img');

        context.imageSelection = {
            type: 'image',
            image: image,
        };

        const range = contentModelToDom(document, root, {} as any, context);

        expect(range!.type).toBe('image');
        expect((range as ImageSelection).image).toBe(image);
    });

    it('Extract selection range - table range', () => {
        const mockedHandler = jasmine.createSpy('blockGroupChildren');
        const context = createModelToDomContext(undefined, {
            modelHandlerOverride: {
                blockGroupChildren: mockedHandler,
            },
        });

        const root = document.createElement('div');
        const mockedSelection = 'Selection' as any;

        context.tableSelection = mockedSelection;

        const range = contentModelToDom(document, root, {} as any, context);

        expect(range).toBe(mockedSelection);
    });
});
