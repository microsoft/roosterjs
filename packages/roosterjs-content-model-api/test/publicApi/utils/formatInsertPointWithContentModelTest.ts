import { createContentModelDocument, createDomToModelContext } from 'roosterjs-content-model-dom';
import { formatInsertPointWithContentModel } from '../../../lib/publicApi/utils/formatInsertPointWithContentModel';
import {
    ContentModelParagraph,
    ContentModelSegment,
    DomToModelOption,
    ElementProcessor,
} from 'roosterjs-content-model-types';

describe('formatInsertPointWithContentModel', () => {
    it('format with insertPoint', () => {
        const node = document.createElement('div');
        const offset = 0;
        const mockedInsertPoint = { node, offset };
        const mockedCallback = jasmine.createSpy('CALLBACK');
        const mockedOptions = 'OPTIONS' as any;
        const mockedModel = createContentModelDocument();
        const mockedContext = createDomToModelContext();

        const formatContentModelSpy = jasmine
            .createSpy('formatContentModel')
            .and.callFake((callback: Function, options: any, override: DomToModelOption) => {
                expect(override.processorOverride?.child).toBeDefined();
                expect(override.processorOverride?.textWithSelection).toBeDefined();

                override.processorOverride?.child!(mockedModel, node, mockedContext);

                callback(mockedModel, mockedContext);
            });
        const mockedEditor = {
            formatContentModel: formatContentModelSpy,
        } as any;

        formatInsertPointWithContentModel(
            mockedEditor,
            mockedInsertPoint,
            mockedCallback,
            mockedOptions
        );

        expect(formatContentModelSpy).toHaveBeenCalledWith(
            jasmine.anything() as any,
            mockedOptions,
            {
                processorOverride: {
                    child: jasmine.anything() as any,
                    textWithSelection: jasmine.anything() as any,
                },
                tryGetFromCache: false,
            }
        );

        const marker = {
            segmentType: 'SelectionMarker',
            isSelected: false,
            format: {},
        };
        const para: ContentModelParagraph = {
            blockType: 'Paragraph',
            segments: [],
            format: {},
            isImplicit: true,
        };
        expect(mockedCallback).toHaveBeenCalledWith(mockedModel, mockedContext, {
            path: [mockedModel],
            marker,
            paragraph: para,
        });
        expect(mockedModel).toEqual({
            blockGroupType: 'Document',
            blocks: [para],
        });
    });

    it('format with insertPoint that is not in editor', () => {
        const node1 = document.createElement('div');
        const node2 = document.createElement('div');
        const offset = 0;
        const mockedInsertPoint = { node: node1, offset };
        const mockedCallback = jasmine.createSpy('CALLBACK');
        const mockedOptions = 'OPTIONS' as any;
        const mockedModel = createContentModelDocument();
        const mockedContext = createDomToModelContext();

        const formatContentModelSpy = jasmine
            .createSpy('formatContentModel')
            .and.callFake((callback: Function, options: any, override: DomToModelOption) => {
                expect(override.processorOverride?.child).toBeDefined();
                expect(override.processorOverride?.textWithSelection).toBeDefined();

                override.processorOverride?.child!(mockedModel, node2, mockedContext);

                callback(mockedModel, mockedContext);
            });
        const mockedEditor = {
            formatContentModel: formatContentModelSpy,
        } as any;

        formatInsertPointWithContentModel(
            mockedEditor,
            mockedInsertPoint,
            mockedCallback,
            mockedOptions
        );

        expect(formatContentModelSpy).toHaveBeenCalledWith(
            jasmine.anything() as any,
            mockedOptions,
            {
                processorOverride: {
                    child: jasmine.anything() as any,
                    textWithSelection: jasmine.anything() as any,
                },
                tryGetFromCache: false,
            }
        );

        expect(mockedCallback).toHaveBeenCalledWith(mockedModel, mockedContext, undefined);
        expect(mockedModel).toEqual({
            blockGroupType: 'Document',
            blocks: [],
        });
    });
});

describe('getShadowChildProcessor', () => {
    function runTest(startOffset: number, endOffset: number, shadow: number, result: string[]) {
        const div = document.createElement('div');
        const span1 = document.createElement('span');
        const span2 = document.createElement('span');

        span1.textContent = 'a';
        span2.textContent = 'b';

        div.appendChild(span1);
        div.appendChild(span2);

        const group = createContentModelDocument();
        const context = createDomToModelContext();
        const formatContentModelSpy = jasmine.createSpy('formatContentModel');
        const mockedEditor = {
            formatContentModel: formatContentModelSpy,
        } as any;

        formatInsertPointWithContentModel(
            mockedEditor,
            {
                node: div,
                offset: shadow,
            },
            () => {}
        );

        const processor = formatContentModelSpy.calls.argsFor(0)[2].processorOverride
            .child as ElementProcessor<Node>;

        context.selection = {
            type: 'range',
            range: {
                startContainer: div,
                startOffset,
                endContainer: div,
                endOffset,
            } as any,
            isReverted: false,
        };

        processor(group, div, context);

        const actualResult = (group.blocks[0] as ContentModelParagraph).segments.map(translate);

        expect(actualResult).toEqual(result);
        expect(context.isInSelection).toBeFalse();
    }

    it('no insert point', () => {
        runTest(-1, -1, -1, ['a', 'b']);
    });

    it('has insert point', () => {
        runTest(-1, -1, 0, ['_', 'a', 'b']);
        runTest(-1, -1, 1, ['a', '_', 'b']);
        runTest(-1, -1, 2, ['a', 'b', '_']);
    });

    it('has insert point and collapsed regular selection', () => {
        runTest(0, 0, 0, ['*', '_', 'a', 'b']);
        runTest(1, 1, 0, ['_', 'a', '*', 'b']);
        runTest(2, 2, 0, ['_', 'a', 'b', '*']);
        runTest(0, 0, 1, ['*', 'a', '_', 'b']);
        runTest(1, 1, 1, ['a', '*', '_', 'b']);
        runTest(2, 2, 1, ['a', '_', 'b', '*']);
        runTest(0, 0, 2, ['*', 'a', 'b', '_']);
        runTest(1, 1, 2, ['a', '*', 'b', '_']);
        runTest(2, 2, 2, ['a', 'b', '*', '_']);
    });

    it('has insert point and expanded regular selection', () => {
        runTest(0, 1, 0, ['_', '*a', 'b']);
        runTest(1, 2, 0, ['_', 'a', '*b']);
        runTest(0, 2, 0, ['_', '*a', '*b']);
        runTest(0, 1, 1, ['*a', '_', 'b']);
        runTest(1, 2, 1, ['a', '_', '*b']);
        runTest(0, 2, 1, ['*a', '_', '*b']);
        runTest(0, 1, 2, ['*a', 'b', '_']);
        runTest(1, 2, 2, ['a', '*b', '_']);
        runTest(0, 2, 2, ['*a', '*b', '_']);
    });
});

describe('getShadowTextProcessor', () => {
    const inputText = 'abcdef';

    function runTest(
        startOffset: number,
        endOffset: number,
        shadowOffset: number,
        result: string[],
        inSelectionResult: boolean,
        alreadyInSelection?: boolean
    ) {
        const text = document.createTextNode(inputText);
        const group = createContentModelDocument();
        const context = createDomToModelContext();

        context.selection = {
            type: 'range',
            range: {
                startContainer: text,
                startOffset,
                endContainer: text,
                endOffset,
            } as any,
            isReverted: false,
        };

        if (alreadyInSelection) {
            context.isInSelection = true;
        }

        const formatContentModelSpy = jasmine.createSpy('formatContentModel');
        const mockedEditor = {
            formatContentModel: formatContentModelSpy,
        } as any;

        formatInsertPointWithContentModel(
            mockedEditor,
            {
                node: text,
                offset: shadowOffset,
            },
            () => {}
        );

        const processor = formatContentModelSpy.calls.argsFor(0)[2].processorOverride
            .textWithSelection as ElementProcessor<Node>;

        processor(group, text, context);

        const actualResult = (group.blocks[0] as ContentModelParagraph).segments.map(translate);

        expect(actualResult).toEqual(result);
        expect(context.isInSelection).toBe(inSelectionResult);
    }

    describe('no selection', () => {
        it('No selection', () => {
            runTest(-1, -1, -1, ['abcdef'], false);
            runTest(-1, -1, 0, ['_', 'abcdef'], false);
            runTest(-1, -1, 3, ['abc', '_', 'def'], false);
            runTest(-1, -1, 6, ['abcdef', '_'], false);
        });

        it('No selection, but in selection', () => {
            runTest(-1, -1, -1, ['*abcdef'], true, true);
            1081;
            runTest(-1, -1, 0, ['_', '*abcdef'], true, true);
            runTest(-1, -1, 3, ['*abc', '_', '*def'], true, true);
            runTest(-1, -1, 6, ['*abcdef', '_'], true, true);
        });
    });

    describe('Has start', () => {
        it('start at 0', () => {
            runTest(0, -1, -1, ['*abcdef'], true);
            runTest(0, -1, 0, ['_', '*abcdef'], true);
            runTest(0, -1, 3, ['*abc', '_', '*def'], true);
            runTest(0, -1, 6, ['*abcdef', '_'], true);
        });

        it('start at middle', () => {
            runTest(2, -1, -1, ['ab', '*cdef'], true);
            runTest(2, -1, 0, ['_', 'ab', '*cdef'], true);
            runTest(2, -1, 1, ['a', '_', 'b', '*cdef'], true);
            runTest(2, -1, 2, ['ab', '_', '*cdef'], true);
            runTest(2, -1, 3, ['ab', '*c', '_', '*def'], true);
            runTest(2, -1, 6, ['ab', '*cdef', '_'], true);
        });

        it('start at end', () => {
            runTest(6, -1, -1, ['abcdef', '*'], true);
            runTest(6, -1, 0, ['_', 'abcdef', '*'], true);
            runTest(6, -1, 3, ['abc', '_', 'def', '*'], true);
            runTest(6, -1, 6, ['abcdef', '_', '*'], true);
        });
    });

    describe('Has end', () => {
        it('end at 0', () => {
            runTest(-1, 0, -1, ['*', 'abcdef'], false, true);
            runTest(-1, 0, 0, ['*', '_', 'abcdef'], false, true);
            runTest(-1, 0, 3, ['*', 'abc', '_', 'def'], false, true);
            runTest(-1, 0, 6, ['*', 'abcdef', '_'], false, true);
        });

        it('end at middle', () => {
            runTest(-1, 4, -1, ['*abcd', 'ef'], false, true);
            runTest(-1, 4, 0, ['_', '*abcd', 'ef'], false, true);
            runTest(-1, 4, 3, ['*abc', '_', '*d', 'ef'], false, true);
            runTest(-1, 4, 4, ['*abcd', '_', 'ef'], false, true);
            runTest(-1, 4, 5, ['*abcd', 'e', '_', 'f'], false, true);
            runTest(-1, 4, 6, ['*abcd', 'ef', '_'], false, true);
        });

        it('end at end', () => {
            runTest(-1, 6, -1, ['*abcdef'], false, true);
            runTest(-1, 6, 0, ['_', '*abcdef'], false, true);
            runTest(-1, 6, 3, ['*abc', '_', '*def'], false, true);
            runTest(-1, 6, 6, ['*abcdef', '_'], false, true);
        });
    });

    describe('Has same start and end', () => {
        it('at 0', () => {
            runTest(0, 0, -1, ['*', 'abcdef'], false);
            runTest(0, 0, 0, ['*', '_', 'abcdef'], false);
            runTest(0, 0, 3, ['*', 'abc', '_', 'def'], false);
            runTest(0, 0, 6, ['*', 'abcdef', '_'], false);
        });

        it('at middle', () => {
            runTest(3, 3, -1, ['abc', '*', 'def'], false);
            runTest(3, 3, 0, ['_', 'abc', '*', 'def'], false);
            runTest(3, 3, 2, ['ab', '_', 'c', '*', 'def'], false);
            runTest(3, 3, 3, ['abc', '*', '_', 'def'], false);
            runTest(3, 3, 4, ['abc', '*', 'd', '_', 'ef'], false);
            runTest(3, 3, 6, ['abc', '*', 'def', '_'], false);
        });

        it('at end', () => {
            runTest(6, 6, -1, ['abcdef', '*'], false);
            runTest(6, 6, 0, ['_', 'abcdef', '*'], false);
            runTest(6, 6, 3, ['abc', '_', 'def', '*'], false);
            runTest(6, 6, 6, ['abcdef', '*', '_'], false);
        });
    });

    describe('Has different start and end', () => {
        it('start at 0, end at end', () => {
            runTest(0, 6, -1, ['*abcdef'], false);
            runTest(0, 6, 0, ['_', '*abcdef'], false);
            runTest(0, 6, 3, ['*abc', '_', '*def'], false);
            runTest(0, 6, 6, ['*abcdef', '_'], false);
        });

        it('start at 0, end at 3', () => {
            runTest(0, 3, -1, ['*abc', 'def'], false);
            runTest(0, 3, 0, ['_', '*abc', 'def'], false);
            runTest(0, 3, 2, ['*ab', '_', '*c', 'def'], false);
            runTest(0, 3, 3, ['*abc', '_', 'def'], false);
            runTest(0, 3, 4, ['*abc', 'd', '_', 'ef'], false);
            runTest(0, 3, 6, ['*abc', 'def', '_'], false);
        });

        it('start at 3, end at end', () => {
            runTest(3, 6, -1, ['abc', '*def'], false);
            runTest(3, 6, 0, ['_', 'abc', '*def'], false);
            runTest(3, 6, 2, ['ab', '_', 'c', '*def'], false);
            runTest(3, 6, 3, ['abc', '_', '*def'], false);
            runTest(3, 6, 4, ['abc', '*d', '_', '*ef'], false);
            runTest(3, 6, 6, ['abc', '*def', '_'], false);
        });

        it('start at 2, end at 4', () => {
            runTest(2, 4, -1, ['ab', '*cd', 'ef'], false);
            runTest(2, 4, 0, ['_', 'ab', '*cd', 'ef'], false);
            runTest(2, 4, 1, ['a', '_', 'b', '*cd', 'ef'], false);
            runTest(2, 4, 2, ['ab', '_', '*cd', 'ef'], false);
            runTest(2, 4, 3, ['ab', '*c', '_', '*d', 'ef'], false);
            runTest(2, 4, 4, ['ab', '*cd', '_', 'ef'], false);
            runTest(2, 4, 5, ['ab', '*cd', 'e', '_', 'f'], false);
            runTest(2, 4, 6, ['ab', '*cd', 'ef', '_'], false);
        });
    });
});

function translate(input: ContentModelSegment): string {
    if (input.segmentType == 'Text') {
        return input.isSelected ? '*' + input.text : input.text;
    } else if (input.segmentType == 'SelectionMarker') {
        return input.isSelected ? '*' : '_';
    } else {
        throw new Error('Wrong input type');
    }
}
