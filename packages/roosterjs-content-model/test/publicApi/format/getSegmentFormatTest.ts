import * as getPendingFormat from '../../../lib/modelApi/format/pendingFormat';
import getSegmentFormat from '../../../lib/publicApi/format/getSegmentFormat';
import { ContentModelSegmentFormat } from '../../../lib/publicTypes/format/ContentModelSegmentFormat';
import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { createRange } from 'roosterjs-editor-dom';
import { normalizeContentModel } from '../../../lib/modelApi/common/normalizeContentModel';
import { PositionType, SelectionRangeTypes } from 'roosterjs-editor-types';

import {
    DomToModelOption,
    IContentModelEditor,
} from '../../../lib/publicTypes/IContentModelEditor';

const selectedNodeId = 'Selected';

describe('getSegmentFormat', () => {
    function runTest(
        html: string,
        pendingFormat: ContentModelSegmentFormat | null,
        expectedFormat: ContentModelSegmentFormat | null
    ) {
        spyOn(getPendingFormat, 'getPendingFormat').and.returnValue(pendingFormat);

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
                    selectionRange: selectedNode
                        ? {
                              type: SelectionRangeTypes.Normal,
                              ranges: [
                                  createRange(
                                      selectedNode,
                                      PositionType.Begin,
                                      selectedNode,
                                      PositionType.End
                                  ),
                              ],
                              areAllCollapsed: false,
                          }
                        : undefined,
                });

                if (selectedNode) {
                    context.selectionRootNode = selectedNode;
                }

                context.elementProcessors.child(model, editorDiv, context);

                normalizeContentModel(model);

                return model;
            },
        } as any) as IContentModelEditor;
        const result = getSegmentFormat(editor);

        expect(result).toEqual(expectedFormat);
    }

    it('Empty model', () => {
        runTest('', null, null);
    });

    it('Single node', () => {
        runTest(`<span id=${selectedNodeId} style="color:red;font-size: 10px">test</span>`, null, {
            fontSize: '10px',
            textColor: 'red',
        });
    });

    it('Multiple node', () => {
        runTest(
            `<div>test1</div><span id=${selectedNodeId} style="color:red;font-size: 10px">test2</span><div>test3</div>`,
            null,
            { fontSize: '10px', textColor: 'red' }
        );
    });

    it('Multiple node, has child under selection', () => {
        runTest(
            `<div>test1</div><div id=${selectedNodeId} style="color:red;font-size: 10px"><div>line1</div><div>line2</div></div><div>test3</div>`,
            null,
            { fontSize: '10px', textColor: 'red' }
        );
    });

    it('Has pending format', () => {
        runTest('', { fontSize: '10px', textColor: 'red' }, { fontSize: '10px', textColor: 'red' });
    });
});
