import * as retrieveModelFormatState from '../../../lib/modelApi/common/retrieveModelFormatState';
import getFormatState from '../../../lib/publicApi/format/getFormatState';
import { ContentModelDocument, ContentModelSegmentFormat } from 'roosterjs-content-model-types';
import { ContentModelFormatState } from 'roosterjs-content-model-types';
import { IStandaloneEditor } from 'roosterjs-content-model-types';
import { reducedModelChildProcessor } from 'roosterjs-content-model-core/lib/override/reducedModelChildProcessor';
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
        const editor = ({
            getSnapshotsManager: () => ({
                hasNewContent: false,
                canMove: () => false,
            }),
            isDarkMode: () => false,
            getZoomScale: () => 1,
            getPendingFormat: () => pendingFormat,
            getContentModelCopy: () => {
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

                return model;
            },
        } as any) as IStandaloneEditor;

        const result = getFormatState(editor);

        expect(retrieveModelFormatState.retrieveModelFormatState).toHaveBeenCalledTimes(1);
        expect(retrieveModelFormatState.retrieveModelFormatState).toHaveBeenCalledWith(
            expectedModel,
            pendingFormat,
            {
                canUndo: false,
                canRedo: false,
                isDarkMode: false,
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
            { canUndo: false, canRedo: false, isDarkMode: false }
        );
    });
});
