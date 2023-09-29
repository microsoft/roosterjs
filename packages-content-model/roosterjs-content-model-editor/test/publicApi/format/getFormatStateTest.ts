import * as getPendingFormat from '../../../lib/modelApi/format/pendingFormat';
import * as retrieveModelFormatState from '../../../lib/modelApi/common/retrieveModelFormatState';
import { DomToModelContext } from 'roosterjs-content-model-types';
import { FormatState } from 'roosterjs-editor-types';
import { IContentModelEditor } from '../../../lib/publicTypes/IContentModelEditor';
import getFormatState, {
    reducedModelChildProcessor,
} from '../../../lib/publicApi/format/getFormatState';
import {
    createContentModelDocument,
    createDomToModelContext,
    normalizeContentModel,
} from 'roosterjs-content-model-dom';
import {
    ContentModelDocument,
    ContentModelSegmentFormat,
    DomToModelOption,
} from 'roosterjs-content-model-types';

const selectedNodeId = 'Selected';

describe('getFormatState', () => {
    beforeEach(() => {
        spyOn(retrieveModelFormatState, 'retrieveModelFormatState').and.callThrough();
    });

    function runTest(
        html: string,
        pendingFormat: ContentModelSegmentFormat | null,
        expectedModel: ContentModelDocument,
        expectedFormat: FormatState
    ) {
        const editor = ({
            getUndoState: () => ({
                canUndo: false,
                canRedo: false,
            }),
            isDarkMode: () => false,
            getZoomScale: () => 1,
            createContentModel: (options: DomToModelOption) => {
                const model = createContentModelDocument();
                const editorDiv = document.createElement('div');

                editorDiv.innerHTML = html;

                const selectedNode = editorDiv.querySelector('#' + selectedNodeId);
                const context = createDomToModelContext(undefined, {
                    ...(options || {}),
                });

                if (selectedNode) {
                    context.selection = {
                        type: 'range',
                        range: {
                            commonAncestorContainer: selectedNode,
                        } as any,
                    };
                }

                context.elementProcessors.child(model, editorDiv, context);

                normalizeContentModel(model);

                return model;
            },
        } as any) as IContentModelEditor;

        spyOn(getPendingFormat, 'getPendingFormat').and.returnValue(pendingFormat);

        const result = getFormatState(editor);

        expect(retrieveModelFormatState.retrieveModelFormatState).toHaveBeenCalledTimes(1);
        expect(retrieveModelFormatState.retrieveModelFormatState).toHaveBeenCalledWith(
            expectedModel,
            pendingFormat,
            {
                canUndo: false,
                canRedo: false,
                isDarkMode: false,
                zoomScale: 1,
            }
        );
        expect(result).toEqual(expectedFormat);
    }

    it('Empty model', () => {
        runTest(
            '',
            null,
            {
                blockGroupType: 'Document',
                blocks: [],
            },
            { canUndo: false, canRedo: false, isDarkMode: false, zoomScale: 1 }
        );
    });

    it('Single node', () => {
        runTest(
            `<span id=${selectedNodeId}>test</span>`,
            null,
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        isImplicit: true,
                        format: {},
                        segments: [
                            {
                                segmentType: 'Text',
                                format: {},
                                text: 'test',
                            },
                        ],
                    },
                ],
            },
            { canUndo: false, canRedo: false, isDarkMode: false, zoomScale: 1 }
        );
    });

    it('Multiple node', () => {
        runTest(
            `<div>test1</div><span id=${selectedNodeId}>test2</span><div>test3</div>`,
            null,
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        isImplicit: true,
                        format: {},
                        segments: [
                            {
                                segmentType: 'Text',
                                format: {},
                                text: 'test2',
                            },
                        ],
                    },
                ],
            },
            { canUndo: false, canRedo: false, isDarkMode: false, zoomScale: 1 }
        );
    });

    it('Multiple node, has child under selection', () => {
        runTest(
            `<div>test1</div><div id=${selectedNodeId}><div>line1</div><div>line2</div></div><div>test3</div>`,
            null,
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segments: [
                            {
                                segmentType: 'Text',
                                format: {},
                                text: 'line1',
                            },
                        ],
                    },
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segments: [
                            {
                                segmentType: 'Text',
                                format: {},
                                text: 'line2',
                            },
                        ],
                    },
                ],
            },
            { canUndo: false, canRedo: false, isDarkMode: false, zoomScale: 1 }
        );
    });
});
describe('reducedModelChildProcessor', () => {
    let context: DomToModelContext;

    beforeEach(() => {
        context = createDomToModelContext(undefined, {
            processorOverride: {
                child: reducedModelChildProcessor,
            },
        });
    });

    it('Empty DOM', () => {
        const doc = createContentModelDocument();
        const div = document.createElement('div');

        reducedModelChildProcessor(doc, div, context);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [],
        });
    });

    it('Single child node, with selected Node in context', () => {
        const doc = createContentModelDocument();
        const div = document.createElement('div');
        const span = document.createElement('span');

        div.appendChild(span);
        span.textContent = 'test';
        context.selection = {
            type: 'range',
            range: {
                commonAncestorContainer: span,
            } as any,
        };

        reducedModelChildProcessor(doc, div, context);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    isImplicit: true,
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'test',
                            format: {},
                        },
                    ],
                },
            ],
        });
    });

    it('Multiple child nodes, with selected Node in context', () => {
        const doc = createContentModelDocument();
        const div = document.createElement('div');
        const span1 = document.createElement('span');
        const span2 = document.createElement('span');
        const span3 = document.createElement('span');

        div.appendChild(span1);
        div.appendChild(span2);
        div.appendChild(span3);
        span1.textContent = 'test1';
        span2.textContent = 'test2';
        span3.textContent = 'test3';
        context.selection = {
            type: 'range',
            range: {
                commonAncestorContainer: span2,
            } as any,
        };

        reducedModelChildProcessor(doc, div, context);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    isImplicit: true,
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'test2',
                            format: {},
                        },
                    ],
                },
            ],
        });
    });

    it('Multiple child nodes, with selected Node in context, with more child nodes under selected node', () => {
        const doc = createContentModelDocument();
        const div = document.createElement('div');
        const span1 = document.createElement('span');
        const span2 = document.createElement('span');
        const span3 = document.createElement('span');

        div.appendChild(span1);
        div.appendChild(span2);
        div.appendChild(span3);
        span1.textContent = 'test1';
        span2.innerHTML = '<div>line1</div><div>line2</div>';
        span3.textContent = 'test3';
        context.selection = {
            type: 'range',
            range: {
                commonAncestorContainer: span2,
            } as any,
        };

        reducedModelChildProcessor(doc, div, context);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'line1',
                            format: {},
                        },
                    ],
                    format: {},
                },
                {
                    blockType: 'Paragraph',
                    segments: [],
                    format: {},
                    isImplicit: true,
                },
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'line2',
                            format: {},
                        },
                    ],
                    format: {},
                },
                {
                    blockType: 'Paragraph',
                    segments: [],
                    format: {},
                    isImplicit: true,
                },
            ],
        });
    });

    it('Multiple layer with multiple child nodes, with selected Node in context, with more child nodes under selected node', () => {
        const doc = createContentModelDocument();
        const div1 = document.createElement('div');
        const div2 = document.createElement('div');
        const div3 = document.createElement('div');
        const span1 = document.createElement('span');
        const span2 = document.createElement('span');
        const span3 = document.createElement('span');

        div3.appendChild(span1);
        div3.appendChild(span2);
        div3.appendChild(span3);
        div1.appendChild(div2);
        div2.appendChild(div3);
        span1.textContent = 'test1';
        span2.innerHTML = '<div>line1</div><div>line2</div>';
        span3.textContent = 'test3';

        context.selection = {
            type: 'range',
            range: {
                commonAncestorContainer: span2,
            } as any,
        };

        reducedModelChildProcessor(doc, div1, context);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
                { blockType: 'Paragraph', segments: [], format: {} },
                {
                    blockType: 'Paragraph',
                    segments: [],
                    format: {},
                },
                {
                    blockType: 'Paragraph',
                    segments: [{ segmentType: 'Text', text: 'line1', format: {} }],
                    format: {},
                },
                { blockType: 'Paragraph', segments: [], format: {}, isImplicit: true },
                {
                    blockType: 'Paragraph',
                    segments: [{ segmentType: 'Text', text: 'line2', format: {} }],
                    format: {},
                },
                {
                    blockType: 'Paragraph',
                    segments: [],
                    format: {},
                    isImplicit: true,
                },
                { blockType: 'Paragraph', segments: [], format: {}, isImplicit: true },
                { blockType: 'Paragraph', segments: [], format: {}, isImplicit: true },
            ],
        });
    });

    it('With table, need to do format for all table cells', () => {
        const doc = createContentModelDocument();
        const div = document.createElement('div');
        div.innerHTML =
            'aa<table class="tb1"><tr><td id="td1">test1</td><td id="td2"><span id="selection">test2</span></td></tr></table>bb';
        context.selection = {
            type: 'range',
            range: {
                commonAncestorContainer: div.querySelector('#selection') as HTMLElement,
            } as any,
        };

        reducedModelChildProcessor(doc, div, context);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Table',
                    rows: [
                        {
                            format: {},
                            height: 0,
                            cells: [
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            blockType: 'Paragraph',
                                            segments: [
                                                {
                                                    segmentType: 'Text',
                                                    text: 'test1',
                                                    format: {},
                                                },
                                            ],
                                            format: {},
                                            isImplicit: true,
                                        },
                                    ],
                                    format: {},
                                    spanLeft: false,
                                    spanAbove: false,
                                    isHeader: false,
                                    dataset: {},
                                },
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            blockType: 'Paragraph',
                                            segments: [
                                                {
                                                    segmentType: 'Text',
                                                    text: 'test2',
                                                    format: {},
                                                },
                                            ],
                                            format: {},
                                            isImplicit: true,
                                        },
                                    ],
                                    format: {},
                                    spanLeft: false,
                                    spanAbove: false,
                                    isHeader: false,
                                    dataset: {},
                                },
                            ],
                        },
                    ],
                    format: {},
                    widths: [],
                    dataset: {},
                },
            ],
        });
    });
});
