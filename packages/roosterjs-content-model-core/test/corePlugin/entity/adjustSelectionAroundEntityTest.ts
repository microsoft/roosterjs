import { adjustSelectionAroundEntity } from '../../../lib/corePlugin/entity/adjustSelectionAroundEntity';
import { ContentModelDocument, DOMSelection, IEditor } from 'roosterjs-content-model-types';
import {
    createContentModelDocument,
    createDomToModelContext,
    createParagraph,
    createSelectionMarker,
    domToContentModel,
} from 'roosterjs-content-model-dom';

describe('adjustSelectionAroundEntity', () => {
    let editor: IEditor;
    let formatContentModelSpy: jasmine.Spy;
    let isDisposedSpy: jasmine.Spy;
    let getDOMSelectionSpy: jasmine.Spy;
    let getComputedStyleSpy: jasmine.Spy;
    let setStartBeforeSpy: jasmine.Spy;
    let setEndBeforeSpy: jasmine.Spy;
    let setStartAfterSpy: jasmine.Spy;
    let setEndAfterSpy: jasmine.Spy;
    let cloneRangeSpy: jasmine.Spy;
    let setDOMSelectionSpy: jasmine.Spy;
    let mockedRange: Range;

    beforeEach(() => {
        formatContentModelSpy = jasmine.createSpy('formatContentModel');
        isDisposedSpy = jasmine.createSpy('isDisposed');
        getDOMSelectionSpy = jasmine.createSpy('getDOMSelection');
        getComputedStyleSpy = jasmine.createSpy('getComputedStyle').and.returnValue({
            direction: 'ltr',
        });

        setStartBeforeSpy = jasmine.createSpy('setStartBefore');
        setStartAfterSpy = jasmine.createSpy('setStartAfter');
        setEndBeforeSpy = jasmine.createSpy('setEndBefore');
        setEndAfterSpy = jasmine.createSpy('setEndAfter');

        mockedRange = {
            setStartBefore: setStartBeforeSpy,
            setStartAfter: setStartAfterSpy,
            setEndBefore: setEndBeforeSpy,
            setEndAfter: setEndAfterSpy,
        } as any;

        cloneRangeSpy = jasmine.createSpy('cloneRange').and.returnValue(mockedRange);
        setDOMSelectionSpy = jasmine.createSpy('setDOMSelection');

        editor = {
            formatContentModel: formatContentModelSpy,
            isDisposed: isDisposedSpy,
            getDOMSelection: getDOMSelectionSpy,
            getDocument: () => ({
                defaultView: {
                    getComputedStyle: getComputedStyleSpy,
                },
            }),
            setDOMSelection: setDOMSelectionSpy,
        } as any;
    });

    function runTest(
        model: ContentModelDocument,
        key: 'ArrowLeft' | 'ArrowRight',
        shiftKey: boolean,
        selection: DOMSelection | null,
        formatCalled: boolean
    ) {
        formatContentModelSpy.and.callFake((callback: Function) => {
            const result = callback(model);

            expect(result).toBeFalse();
        });
        getDOMSelectionSpy.and.returnValue(selection);

        adjustSelectionAroundEntity(editor, key, shiftKey);

        if (formatCalled) {
            expect(formatContentModelSpy).toHaveBeenCalled();
        } else {
            expect(formatContentModelSpy).not.toHaveBeenCalled();
        }
    }

    it('Editor is disposed', () => {
        isDisposedSpy.and.returnValue(true);

        runTest(null!, 'ArrowLeft', false, null, false);
    });

    it('Empty model, no selection, Left, no shift', () => {
        runTest(
            {
                blockGroupType: 'Document',
                blocks: [],
            },
            'ArrowLeft',
            false,
            null,
            false
        );
    });

    it('Model has no entity, no selection, Left, no shift', () => {
        const marker = createSelectionMarker();
        const para = createParagraph();
        const doc = createContentModelDocument();

        para.segments.push(marker);
        doc.blocks.push(para);

        runTest(doc, 'ArrowLeft', false, null, false);
    });

    it('Model has inline entity, selection is before delimiter, Right, no shift', () => {
        const doc = createContentModelDocument();

        let root = document.createElement('div');
        let text = document.createTextNode('test');

        root.appendChild(text);
        addEntity(root, false);

        runTest(
            doc,
            'ArrowRight',
            false,
            {
                type: 'range',
                range: {
                    endContainer: text,
                    endOffset: 2,
                } as any,
                isReverted: false,
            },
            false
        );
    });

    it('Model has inline entity, selection is after delimiter, Left, no shift', () => {
        const doc = createContentModelDocument();

        let root = document.createElement('div');
        let text = document.createTextNode('test');

        addEntity(root, false);
        root.appendChild(text);

        runTest(
            doc,
            'ArrowLeft',
            false,
            {
                type: 'range',
                range: {
                    endContainer: text,
                    endOffset: 2,
                } as any,
                isReverted: false,
            },
            false
        );
    });

    it('Model has inline entity, selection is on delimiter 1, Right, no shift', () => {
        let root = document.createElement('div');
        let text = document.createTextNode('test');

        root.appendChild(text);
        const { delimiter1, delimiter2 } = addEntity(root, false);

        const selection: DOMSelection = {
            type: 'range',
            range: {
                endContainer: delimiter1.firstChild,
                endOffset: 1,
                cloneRange: cloneRangeSpy,
            } as any,
            isReverted: false,
        };

        const context = createDomToModelContext();

        context.selection = selection;

        const doc = domToContentModel(root, context);

        runTest(doc, 'ArrowRight', false, selection, true);

        expect(setStartBeforeSpy).not.toHaveBeenCalled();
        expect(setStartAfterSpy).toHaveBeenCalledWith(delimiter2);
        expect(setEndBeforeSpy).not.toHaveBeenCalled();
        expect(setEndAfterSpy).toHaveBeenCalledWith(delimiter2);
        expect(setDOMSelectionSpy).toHaveBeenCalledWith({
            type: 'range',
            isReverted: false,
            range: mockedRange,
        });
    });

    it('Model has inline entity, selection is on delimiter 2, Left, no shift', () => {
        let root = document.createElement('div');
        let text = document.createTextNode('test');

        const { delimiter1, delimiter2 } = addEntity(root, false);
        root.appendChild(text);

        const selection: DOMSelection = {
            type: 'range',
            range: {
                endContainer: delimiter2.firstChild,
                endOffset: 0,
                cloneRange: cloneRangeSpy,
            } as any,
            isReverted: false,
        };

        const context = createDomToModelContext();

        context.selection = selection;

        const doc = domToContentModel(root, context);

        runTest(doc, 'ArrowLeft', false, selection, true);

        expect(setStartBeforeSpy).toHaveBeenCalledWith(delimiter1);
        expect(setStartAfterSpy).not.toHaveBeenCalled();
        expect(setEndBeforeSpy).toHaveBeenCalledWith(delimiter1);
        expect(setEndAfterSpy).not.toHaveBeenCalled();
        expect(setDOMSelectionSpy).toHaveBeenCalledWith({
            type: 'range',
            isReverted: false,
            range: mockedRange,
        });
    });

    it('Model has inline entity, selection is on delimiter 1, Shift+Right', () => {
        let root = document.createElement('div');
        let text = document.createTextNode('test');

        root.appendChild(text);
        const { delimiter1, delimiter2 } = addEntity(root, false);

        const selection: DOMSelection = {
            type: 'range',
            range: {
                endContainer: delimiter1.firstChild,
                endOffset: 1,
                cloneRange: cloneRangeSpy,
            } as any,
            isReverted: false,
        };

        const context = createDomToModelContext();

        context.selection = selection;

        const doc = domToContentModel(root, context);

        runTest(doc, 'ArrowRight', true, selection, true);

        expect(setStartBeforeSpy).not.toHaveBeenCalled();
        expect(setStartAfterSpy).not.toHaveBeenCalled();
        expect(setEndBeforeSpy).not.toHaveBeenCalled();
        expect(setEndAfterSpy).toHaveBeenCalledWith(delimiter2);
        expect(setDOMSelectionSpy).toHaveBeenCalledWith({
            type: 'range',
            isReverted: false,
            range: mockedRange,
        });
    });

    it('Model has inline entity, selection is on delimiter 1, Shift+Right, reverted', () => {
        let root = document.createElement('div');
        let text = document.createTextNode('test');

        root.appendChild(text);
        const { delimiter1, delimiter2 } = addEntity(root, false);

        const selection: DOMSelection = {
            type: 'range',
            range: {
                startContainer: delimiter1.firstChild,
                startOffset: 1,
                cloneRange: cloneRangeSpy,
            } as any,
            isReverted: true,
        };

        const context = createDomToModelContext();

        context.selection = selection;

        const doc = domToContentModel(root, context);

        runTest(doc, 'ArrowRight', true, selection, true);

        expect(setStartBeforeSpy).not.toHaveBeenCalled();
        expect(setStartAfterSpy).toHaveBeenCalledWith(delimiter2);
        expect(setEndBeforeSpy).not.toHaveBeenCalled();
        expect(setEndAfterSpy).not.toHaveBeenCalled();
        expect(setDOMSelectionSpy).toHaveBeenCalledWith({
            type: 'range',
            isReverted: true,
            range: mockedRange,
        });
    });

    it('Model has inline entity, selection is on delimiter 2, Shift+Left', () => {
        let root = document.createElement('div');
        let text = document.createTextNode('test');

        const { delimiter2 } = addEntity(root, false);
        root.appendChild(text);

        const selection: DOMSelection = {
            type: 'range',
            range: {
                endContainer: delimiter2.firstChild,
                endOffset: 0,
                cloneRange: cloneRangeSpy,
            } as any,
            isReverted: false,
        };

        const context = createDomToModelContext();

        context.selection = selection;

        const doc = domToContentModel(root, context);

        runTest(doc, 'ArrowLeft', true, selection, true);

        expect(setStartBeforeSpy).not.toHaveBeenCalled();
        expect(setStartAfterSpy).not.toHaveBeenCalled();
        expect(setEndBeforeSpy).not.toHaveBeenCalled();
        expect(setEndAfterSpy).not.toHaveBeenCalled();
        expect(setDOMSelectionSpy).not.toHaveBeenCalled();
    });

    it('Model has inline entity, selection is on delimiter 2, Shift+Left, reverted', () => {
        let root = document.createElement('div');
        let text = document.createTextNode('test');

        const { delimiter1, delimiter2 } = addEntity(root, false);
        root.appendChild(text);

        const selection: DOMSelection = {
            type: 'range',
            range: {
                startContainer: delimiter2.firstChild,
                startOffset: 0,
                cloneRange: cloneRangeSpy,
            } as any,
            isReverted: true,
        };

        const context = createDomToModelContext();

        context.selection = selection;

        const doc = domToContentModel(root, context);

        runTest(doc, 'ArrowLeft', true, selection, true);

        expect(setStartBeforeSpy).toHaveBeenCalledWith(delimiter1);
        expect(setStartAfterSpy).not.toHaveBeenCalled();
        expect(setEndBeforeSpy).not.toHaveBeenCalled();
        expect(setEndAfterSpy).not.toHaveBeenCalled();
        expect(setDOMSelectionSpy).toHaveBeenCalledWith({
            type: 'range',
            isReverted: true,
            range: mockedRange,
        });
    });

    it('Model has inline entity, selection is on entity, Left', () => {
        let root = document.createElement('div');
        let text = document.createTextNode('test');

        root.appendChild(text);
        const { delimiter1, delimiter2 } = addEntity(root, false);
        const selection: DOMSelection = {
            type: 'range',
            range: {
                startContainer: delimiter1.firstChild,
                startOffset: 0,
                endContainer: delimiter2.firstChild,
                endOffset: 0,
                cloneRange: cloneRangeSpy,
            } as any,
            isReverted: false,
        };

        const context = createDomToModelContext();

        context.selection = selection;

        const doc = domToContentModel(root, context);

        runTest(
            doc,
            'ArrowLeft',
            false,
            {
                type: 'range',
                range: {
                    startContainer: delimiter1.firstChild,
                    startOffset: 0,
                    endContainer: delimiter2.firstChild,
                    endOffset: 0,
                    cloneRange: cloneRangeSpy,
                } as any,
                isReverted: false,
            },
            true
        );

        expect(setStartBeforeSpy).not.toHaveBeenCalled();
        expect(setStartAfterSpy).not.toHaveBeenCalled();
        expect(setEndBeforeSpy).not.toHaveBeenCalled();
        expect(setEndAfterSpy).not.toHaveBeenCalled();
        expect(setDOMSelectionSpy).not.toHaveBeenCalled();
    });

    it('Model has inline entity, selection is on entity, Left, reverted', () => {
        let root = document.createElement('div');
        let text = document.createTextNode('test');

        root.appendChild(text);
        const { delimiter1, delimiter2 } = addEntity(root, false);
        const selection: DOMSelection = {
            type: 'range',
            range: {
                startContainer: delimiter1.firstChild,
                startOffset: 0,
                endContainer: delimiter2.firstChild,
                endOffset: 0,
                cloneRange: cloneRangeSpy,
            } as any,
            isReverted: true,
        };

        const context = createDomToModelContext();

        context.selection = selection;

        const doc = domToContentModel(root, context);

        runTest(
            doc,
            'ArrowLeft',
            false,
            {
                type: 'range',
                range: {
                    startContainer: delimiter1.firstChild,
                    startOffset: 0,
                    endContainer: delimiter2.firstChild,
                    endOffset: 0,
                    cloneRange: cloneRangeSpy,
                } as any,
                isReverted: false,
            },
            true
        );

        expect(setStartBeforeSpy).not.toHaveBeenCalled();
        expect(setStartAfterSpy).not.toHaveBeenCalled();
        expect(setEndBeforeSpy).not.toHaveBeenCalled();
        expect(setEndAfterSpy).not.toHaveBeenCalled();
        expect(setDOMSelectionSpy).not.toHaveBeenCalled();
    });

    it('Model has inline entity, selection is on entity, Right', () => {
        let root = document.createElement('div');
        let text = document.createTextNode('test');

        root.appendChild(text);
        const { delimiter1, delimiter2 } = addEntity(root, false);
        const selection: DOMSelection = {
            type: 'range',
            range: {
                startContainer: delimiter1.firstChild,
                startOffset: 0,
                endContainer: delimiter2.firstChild,
                endOffset: 0,
                cloneRange: cloneRangeSpy,
            } as any,
            isReverted: false,
        };

        const context = createDomToModelContext();

        context.selection = selection;

        const doc = domToContentModel(root, context);

        runTest(
            doc,
            'ArrowRight',
            false,
            {
                type: 'range',
                range: {
                    startContainer: delimiter1.firstChild,
                    startOffset: 0,
                    endContainer: delimiter2.firstChild,
                    endOffset: 0,
                    cloneRange: cloneRangeSpy,
                } as any,
                isReverted: false,
            },
            false
        );

        expect(setStartBeforeSpy).not.toHaveBeenCalled();
        expect(setStartAfterSpy).not.toHaveBeenCalled();
        expect(setEndBeforeSpy).not.toHaveBeenCalled();
        expect(setEndAfterSpy).not.toHaveBeenCalled();
        expect(setDOMSelectionSpy).not.toHaveBeenCalled();
    });

    it('Model has inline entity, selection is on entity, Right, reverted', () => {
        let root = document.createElement('div');
        let text = document.createTextNode('test');

        root.appendChild(text);
        const { delimiter1, delimiter2 } = addEntity(root, false);
        const selection: DOMSelection = {
            type: 'range',
            range: {
                startContainer: delimiter1.firstChild,
                startOffset: 0,
                endContainer: delimiter2.firstChild,
                endOffset: 0,
                cloneRange: cloneRangeSpy,
            } as any,
            isReverted: true,
        };

        const context = createDomToModelContext();

        context.selection = selection;

        const doc = domToContentModel(root, context);

        runTest(
            doc,
            'ArrowRight',
            false,
            {
                type: 'range',
                range: {
                    startContainer: delimiter1.firstChild,
                    startOffset: 0,
                    endContainer: delimiter2.firstChild,
                    endOffset: 0,
                    cloneRange: cloneRangeSpy,
                } as any,
                isReverted: false,
            },
            false
        );

        expect(setStartBeforeSpy).not.toHaveBeenCalled();
        expect(setStartAfterSpy).not.toHaveBeenCalled();
        expect(setEndBeforeSpy).not.toHaveBeenCalled();
        expect(setEndAfterSpy).not.toHaveBeenCalled();
        expect(setDOMSelectionSpy).not.toHaveBeenCalled();
    });

    it('Model has inline entity, selection is on entity, Shift+Left', () => {
        let root = document.createElement('div');
        let text = document.createTextNode('test');

        root.appendChild(text);
        const { delimiter1, delimiter2 } = addEntity(root, false);

        const selection: DOMSelection = {
            type: 'range',
            range: {
                startContainer: delimiter1.firstChild,
                startOffset: 0,
                endContainer: delimiter2.firstChild,
                endOffset: 0,
                cloneRange: cloneRangeSpy,
            } as any,
            isReverted: false,
        };

        const context = createDomToModelContext();

        context.selection = selection;

        const doc = domToContentModel(root, context);

        runTest(doc, 'ArrowLeft', true, selection, true);

        expect(setStartBeforeSpy).not.toHaveBeenCalled();
        expect(setStartAfterSpy).not.toHaveBeenCalled();
        expect(setEndBeforeSpy).toHaveBeenCalledWith(delimiter1);
        expect(setEndAfterSpy).not.toHaveBeenCalled();
        expect(setDOMSelectionSpy).toHaveBeenCalledWith({
            type: 'range',
            isReverted: false,
            range: mockedRange,
        });
    });

    it('Model has inline entity, selection is on entity, Shift+Left, Reverted', () => {
        let root = document.createElement('div');
        let text = document.createTextNode('test');

        root.appendChild(text);
        const { delimiter1, delimiter2 } = addEntity(root, false);

        const selection: DOMSelection = {
            type: 'range',
            range: {
                startContainer: delimiter1.firstChild,
                startOffset: 0,
                endContainer: delimiter2.firstChild,
                endOffset: 0,
                cloneRange: cloneRangeSpy,
            } as any,
            isReverted: true,
        };

        const context = createDomToModelContext();

        context.selection = selection;

        const doc = domToContentModel(root, context);

        runTest(doc, 'ArrowLeft', true, selection, false);

        expect(setStartBeforeSpy).not.toHaveBeenCalled();
        expect(setStartAfterSpy).not.toHaveBeenCalled();
        expect(setEndBeforeSpy).not.toHaveBeenCalled();
        expect(setEndAfterSpy).not.toHaveBeenCalled();
        expect(setDOMSelectionSpy).not.toHaveBeenCalled();
    });

    it('Model has inline entity, selection is on entity, Shift+Right', () => {
        let root = document.createElement('div');
        let text = document.createTextNode('test');

        root.appendChild(text);
        const { delimiter1, delimiter2 } = addEntity(root, false);

        const selection: DOMSelection = {
            type: 'range',
            range: {
                startContainer: delimiter1.firstChild,
                startOffset: 0,
                endContainer: delimiter2.firstChild,
                endOffset: 0,
                cloneRange: cloneRangeSpy,
            } as any,
            isReverted: false,
        };

        const context = createDomToModelContext();

        context.selection = selection;

        const doc = domToContentModel(root, context);

        runTest(doc, 'ArrowRight', true, selection, false);

        expect(setStartBeforeSpy).not.toHaveBeenCalled();
        expect(setStartAfterSpy).not.toHaveBeenCalled();
        expect(setEndBeforeSpy).not.toHaveBeenCalled();
        expect(setEndAfterSpy).not.toHaveBeenCalled();
        expect(setDOMSelectionSpy).not.toHaveBeenCalled();
    });

    it('Model has inline entity, selection is on entity, Shift+Right, Reverted', () => {
        let root = document.createElement('div');
        let text = document.createTextNode('test');

        root.appendChild(text);
        const { delimiter1, delimiter2 } = addEntity(root, false);

        const selection: DOMSelection = {
            type: 'range',
            range: {
                startContainer: delimiter1.firstChild,
                startOffset: 0,
                endContainer: delimiter2.firstChild,
                endOffset: 0,
                cloneRange: cloneRangeSpy,
            } as any,
            isReverted: true,
        };

        const context = createDomToModelContext();

        context.selection = selection;

        const doc = domToContentModel(root, context);

        runTest(doc, 'ArrowRight', true, selection, false);

        expect(setStartBeforeSpy).not.toHaveBeenCalled();
        expect(setStartAfterSpy).not.toHaveBeenCalled();
        expect(setEndBeforeSpy).not.toHaveBeenCalled();
        expect(setEndAfterSpy).not.toHaveBeenCalled();
        expect(setDOMSelectionSpy).not.toHaveBeenCalled();
    });

    it('Model has inline entity, selection is on text and entity, Shift+Left', () => {
        let root = document.createElement('div');
        let text = document.createTextNode('test');

        root.appendChild(text);
        const { delimiter1, delimiter2 } = addEntity(root, false);

        const selection: DOMSelection = {
            type: 'range',
            range: {
                startContainer: text,
                startOffset: 0,
                endContainer: delimiter2.firstChild,
                endOffset: 0,
                cloneRange: cloneRangeSpy,
            } as any,
            isReverted: false,
        };

        const context = createDomToModelContext();

        context.selection = selection;

        const doc = domToContentModel(root, context);

        runTest(doc, 'ArrowLeft', true, selection, true);

        expect(setStartBeforeSpy).not.toHaveBeenCalled();
        expect(setStartAfterSpy).not.toHaveBeenCalled();
        expect(setEndBeforeSpy).toHaveBeenCalledWith(delimiter1);
        expect(setEndAfterSpy).not.toHaveBeenCalled();
        expect(setDOMSelectionSpy).toHaveBeenCalledWith({
            type: 'range',
            isReverted: false,
            range: mockedRange,
        });
    });

    it('Model has inline entity, selection is on text and entity, Shift+Left, Reverted', () => {
        let root = document.createElement('div');
        let text = document.createTextNode('test');

        const { delimiter1 } = addEntity(root, false);
        root.appendChild(text);

        const selection: DOMSelection = {
            type: 'range',
            range: {
                startContainer: delimiter1.firstChild,
                startOffset: 1,
                endContainer: text,
                endOffset: 4,
                cloneRange: cloneRangeSpy,
            } as any,
            isReverted: true,
        };

        const context = createDomToModelContext();

        context.selection = selection;

        const doc = domToContentModel(root, context);

        runTest(doc, 'ArrowLeft', true, selection, false);

        expect(setStartBeforeSpy).not.toHaveBeenCalled();
        expect(setStartAfterSpy).not.toHaveBeenCalled();
        expect(setEndBeforeSpy).not.toHaveBeenCalled();
        expect(setEndAfterSpy).not.toHaveBeenCalled();
        expect(setDOMSelectionSpy).not.toHaveBeenCalled();
    });

    it('Model has inline entity, selection is on text and entity, Shift+Right', () => {
        let root = document.createElement('div');
        let text = document.createTextNode('test');

        root.appendChild(text);
        const { delimiter2 } = addEntity(root, false);

        const selection: DOMSelection = {
            type: 'range',
            range: {
                startContainer: text,
                startOffset: 0,
                endContainer: delimiter2.firstChild,
                endOffset: 0,
                cloneRange: cloneRangeSpy,
            } as any,
            isReverted: false,
        };

        const context = createDomToModelContext();

        context.selection = selection;

        const doc = domToContentModel(root, context);

        runTest(doc, 'ArrowRight', true, selection, false);

        expect(setStartBeforeSpy).not.toHaveBeenCalled();
        expect(setStartAfterSpy).not.toHaveBeenCalled();
        expect(setEndBeforeSpy).not.toHaveBeenCalled();
        expect(setEndAfterSpy).not.toHaveBeenCalled();
        expect(setDOMSelectionSpy).not.toHaveBeenCalled();
    });

    it('Model has inline entity, selection is on text and entity, Shift+Right, Reverted', () => {
        let root = document.createElement('div');
        let text = document.createTextNode('test');

        const { delimiter1, delimiter2 } = addEntity(root, false);
        root.appendChild(text);

        const selection: DOMSelection = {
            type: 'range',
            range: {
                startContainer: delimiter1.firstChild,
                startOffset: 1,
                endContainer: text,
                endOffset: 4,
                cloneRange: cloneRangeSpy,
            } as any,
            isReverted: true,
        };

        const context = createDomToModelContext();

        context.selection = selection;

        const doc = domToContentModel(root, context);

        runTest(doc, 'ArrowRight', true, selection, true);

        expect(setStartBeforeSpy).not.toHaveBeenCalled();
        expect(setStartAfterSpy).toHaveBeenCalledWith(delimiter2);
        expect(setEndBeforeSpy).not.toHaveBeenCalled();
        expect(setEndAfterSpy).not.toHaveBeenCalled();
        expect(setDOMSelectionSpy).toHaveBeenCalledWith({
            type: 'range',
            range: mockedRange,
            isReverted: true,
        });
    });

    it('Model has block entity, selection is on delimiter 1, Right', () => {
        let root = document.createElement('div');
        let text = document.createTextNode('test');

        const { delimiter1, delimiter2 } = addEntity(root, true);
        root.appendChild(text);

        const selection: DOMSelection = {
            type: 'range',
            range: {
                endContainer: delimiter1.firstChild,
                endOffset: 1,
                cloneRange: cloneRangeSpy,
            } as any,
            isReverted: false,
        };

        const context = createDomToModelContext();

        context.selection = selection;

        const doc = domToContentModel(root, context);

        runTest(doc, 'ArrowRight', false, selection, true);

        expect(setStartBeforeSpy).not.toHaveBeenCalled();
        expect(setStartAfterSpy).toHaveBeenCalledWith(delimiter2);
        expect(setEndBeforeSpy).not.toHaveBeenCalled();
        expect(setEndAfterSpy).toHaveBeenCalledWith(delimiter2);
        expect(setDOMSelectionSpy).toHaveBeenCalledWith({
            type: 'range',
            range: mockedRange,
            isReverted: false,
        });
    });

    it('Model has block entity, selection is on delimiter 2, Left', () => {
        let root = document.createElement('div');
        let text = document.createTextNode('test');

        const { delimiter1, delimiter2 } = addEntity(root, true);
        root.appendChild(text);

        const selection: DOMSelection = {
            type: 'range',
            range: {
                endContainer: delimiter2.firstChild,
                endOffset: 0,
                cloneRange: cloneRangeSpy,
            } as any,
            isReverted: false,
        };

        const context = createDomToModelContext();

        context.selection = selection;

        const doc = domToContentModel(root, context);

        runTest(doc, 'ArrowLeft', false, selection, true);

        expect(setStartBeforeSpy).toHaveBeenCalledWith(delimiter1);
        expect(setStartAfterSpy).not.toHaveBeenCalled();
        expect(setEndBeforeSpy).toHaveBeenCalledWith(delimiter1);
        expect(setEndAfterSpy).not.toHaveBeenCalledWith();
        expect(setDOMSelectionSpy).toHaveBeenCalledWith({
            type: 'range',
            range: mockedRange,
            isReverted: false,
        });
    });
});

function addEntity(
    parent: HTMLElement,
    isBlock: boolean
): { delimiter1: HTMLElement; delimiter2: HTMLElement; container: HTMLElement | null } {
    function addDelimiter(parent: HTMLElement, isBefore: boolean) {
        const span = document.createElement('span');
        span.className = isBefore ? 'entityDelimiterBefore' : 'entityDelimiterAfter';
        span.textContent = '\u200B';
        parent.appendChild(span);

        return span;
    }

    const wrapper = document.createElement(isBlock ? 'div' : 'span');
    wrapper.className = '_Entity _EType_A _EReadonly_1';

    if (isBlock) {
        wrapper.style.display = 'inline-block';
        wrapper.style.width = '100%';

        const container = document.createElement('div');

        container.className = '_E_EBlockEntityContainer';
        parent.appendChild(container);

        const delimiter1 = addDelimiter(container, true);

        container.appendChild(wrapper);

        const delimiter2 = addDelimiter(container, false);

        return { delimiter1, delimiter2, container };
    } else {
        const delimiter1 = addDelimiter(parent, true);

        parent.appendChild(wrapper);

        const delimiter2 = addDelimiter(parent, false);

        return { delimiter1, delimiter2, container: null };
    }
}
