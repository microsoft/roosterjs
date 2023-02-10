import * as readFile from 'roosterjs-editor-dom/lib/utils/readFile';
import insertImage from '../../../lib/publicApi/image/insertImage';
import { addSegment } from '../../../lib/modelApi/common/addSegment';
import { ContentModelDocument } from '../../../lib/publicTypes/group/ContentModelDocument';
import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createSelectionMarker } from '../../../lib/modelApi/creators/createSelectionMarker';
import { IContentModelEditor } from '../../../lib/publicTypes/IContentModelEditor';

describe('insertImage', () => {
    const testUrl = 'http://test.com/test';

    function runTest(
        apiName: string,
        executionCallback: (editor: IContentModelEditor) => void,
        model: ContentModelDocument,
        result: ContentModelDocument,
        calledTimes: number
    ) {
        const addUndoSnapshot = jasmine
            .createSpy()
            .and.callFake(
                (callback: () => void, source: string, canUndoByBackspace, param: any) => {
                    expect(source).toBe('Format');
                    expect(param.formatApiName).toBe(apiName);
                    callback();
                }
            );
        const setContentModel = jasmine.createSpy().and.callFake((model: ContentModelDocument) => {
            expect(model).toEqual(result);
        });
        const editor = ({
            createContentModel: () => model,
            addUndoSnapshot,
            focus: jasmine.createSpy(),
            setContentModel,
            isDisposed: () => false,
            getDocument: () => document,
        } as any) as IContentModelEditor;

        executionCallback(editor);

        expect(addUndoSnapshot).toHaveBeenCalledTimes(calledTimes);
        expect(setContentModel).toHaveBeenCalledTimes(calledTimes);
        expect(model).toEqual(result);
    }

    beforeEach(() => {
        spyOn(readFile, 'default').and.callFake((_, callback) => {
            callback(testUrl);
        });
    });

    it('Insert image without selection', () => {
        const blob = ({ a: 1 } as any) as File;
        const model = createContentModelDocument();

        runTest(
            'insertImage',
            editor => {
                insertImage(editor, blob);
            },
            model,
            {
                blockGroupType: 'Document',
                blocks: [],
            },
            1
        );
    });

    it('Insert image with selection', () => {
        const blob = ({ a: 1 } as any) as File;
        const model = createContentModelDocument();
        const marker = createSelectionMarker();

        addSegment(model, marker);

        runTest(
            'insertImage',
            editor => {
                insertImage(editor, blob);
            },
            model,
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        isImplicit: true,
                        segments: [
                            {
                                segmentType: 'Image',
                                src: testUrl,
                                format: {},
                                dataset: {},
                            },
                            {
                                segmentType: 'SelectionMarker',
                                format: {},
                                isSelected: true,
                            },
                        ],
                    },
                ],
            },
            1
        );
    });

    it('Insert image with src', () => {
        const model = createContentModelDocument();
        const marker = createSelectionMarker();

        addSegment(model, marker);

        runTest(
            'insertImage',
            editor => {
                insertImage(editor, testUrl);
            },
            model,
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        isImplicit: true,
                        segments: [
                            {
                                segmentType: 'Image',
                                src: testUrl,
                                format: {},
                                dataset: {},
                            },
                            {
                                segmentType: 'SelectionMarker',
                                format: {},
                                isSelected: true,
                            },
                        ],
                    },
                ],
            },
            1
        );
    });

    it('Insert image with current format', () => {
        const model = createContentModelDocument({
            fontFamily: 'Test',
        });
        const marker = createSelectionMarker({
            fontSize: '20px',
        });

        addSegment(model, marker);

        runTest(
            'insertImage',
            editor => {
                insertImage(editor, testUrl);
            },
            model,
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        isImplicit: true,
                        segments: [
                            {
                                segmentType: 'Image',
                                src: testUrl,
                                format: {
                                    fontFamily: 'Test',
                                    fontSize: '20px',
                                },
                                dataset: {},
                            },
                            {
                                segmentType: 'SelectionMarker',
                                format: {
                                    fontSize: '20px',
                                },
                                isSelected: true,
                            },
                        ],
                    },
                ],
                format: {
                    fontFamily: 'Test',
                },
            },
            1
        );
    });
});
