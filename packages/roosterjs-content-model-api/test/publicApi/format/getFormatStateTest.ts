import * as retrieveModelFormatState from 'roosterjs-content-model-dom/lib/modelApi/editing/retrieveModelFormatState';
import { ContentModelFormatState } from 'roosterjs-content-model-types';
import { getFormatState } from '../../../lib/publicApi/format/getFormatState';
import { IEditor } from 'roosterjs-content-model-types';
import { reducedModelChildProcessor } from '../../../lib/modelApi/common/reducedModelChildProcessor';
import {
    ContentModelDocument,
    ContentModelSegmentFormat,
    DOMHelper,
} from 'roosterjs-content-model-types';
import {
    createContentModelDocument,
    createDomToModelContext,
    normalizeContentModel,
} from 'roosterjs-content-model-dom';

const selectedNodeId = 'Selected';

describe('getFormatState', () => {
    beforeEach(() => {
        spyOn(retrieveModelFormatState, 'retrieveModelFormatState').and.callThrough();
    });

    function runTest(
        html: string,
        pendingFormat: ContentModelSegmentFormat | null,
        expectedModel: ContentModelDocument,
        expectedFormat: ContentModelFormatState
    ) {
        const mockedDOMHelper: DOMHelper = {} as any;
        const editor = ({
            getSnapshotsManager: () => ({
                hasNewContent: false,
                canMove: () => false,
            }),
            isDarkMode: () => false,
            getZoomScale: () => 1,
            getPendingFormat: () => pendingFormat,
            getDOMHelper: () => mockedDOMHelper,
            formatContentModel: (callback: Function) => {
                const model = createContentModelDocument();
                const editorDiv = document.createElement('div');

                editorDiv.innerHTML = html;

                const selectedNode = editorDiv.querySelector('#' + selectedNodeId);
                const context = createDomToModelContext(undefined, {
                    processorOverride: {
                        child: reducedModelChildProcessor,
                    },
                });

                if (selectedNode) {
                    context.selection = {
                        type: 'range',
                        range: {
                            commonAncestorContainer: selectedNode,
                        } as any,
                        isReverted: false,
                    };
                }

                context.elementProcessors.child(model, editorDiv, context);

                normalizeContentModel(model);

                callback(model);
            },
        } as any) as IEditor;

        const result = getFormatState(editor);

        expect(retrieveModelFormatState.retrieveModelFormatState).toHaveBeenCalledTimes(1);
        expect(retrieveModelFormatState.retrieveModelFormatState).toHaveBeenCalledWith(
            expectedModel,
            pendingFormat,
            {
                canUndo: false,
                canRedo: false,
                isDarkMode: false,
            },
            'remove',
            mockedDOMHelper
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
            { canUndo: false, canRedo: false, isDarkMode: false }
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
            { canUndo: false, canRedo: false, isDarkMode: false }
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
            { canUndo: false, canRedo: false, isDarkMode: false }
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
                        blockType: 'BlockGroup',
                        blockGroupType: 'FormatContainer',
                        tagName: 'div',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [{ segmentType: 'Text', text: 'line1', format: {} }],
                                format: {},
                            },
                            {
                                blockType: 'Paragraph',
                                segments: [{ segmentType: 'Text', text: 'line2', format: {} }],
                                format: {},
                            },
                        ],
                        format: { id: 'Selected' },
                    },
                ],
            },
            { canUndo: false, canRedo: false, isDarkMode: false }
        );
    });
});
