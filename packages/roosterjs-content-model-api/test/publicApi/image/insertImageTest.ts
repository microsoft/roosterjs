import * as createImage from 'roosterjs-content-model-dom/lib/modelApi/creators/createImage';
import * as readFile from 'roosterjs-content-model-dom/lib/domUtils/readFile';
import * as setSelection from 'roosterjs-content-model-dom/lib/modelApi/selection/setSelection';
import { ContentModelImage, IEditor } from 'roosterjs-content-model-types';
import { insertImage } from '../../../lib/publicApi/image/insertImage';

import {
    ContentModelDocument,
    ContentModelFormatter,
    FormatContentModelOptions,
} from 'roosterjs-content-model-types';
import {
    addSegment,
    createContentModelDocument,
    createSelectionMarker,
} from 'roosterjs-content-model-dom';

describe('insertImage', () => {
    const testUrl = 'http://test.com/test';

    function runTest(
        apiName: string,
        executionCallback: (editor: IEditor) => void,
        model: ContentModelDocument,
        result: ContentModelDocument,
        calledTimes: number
    ) {
        let formatResult: boolean | undefined;
        const image = <ContentModelImage>{
            segmentType: 'Image',
            src: testUrl,
            format: {
                backgroundColor: '',
            },
            dataset: {},
        };
        spyOn(createImage, 'createImage').and.returnValue(image);
        spyOn(setSelection, 'setSelection').and.callThrough();

        const formatContentModel = jasmine
            .createSpy('formatContentModel')
            .and.callFake((callback: ContentModelFormatter, options: FormatContentModelOptions) => {
                formatResult = callback(model, {
                    newEntities: [],
                    deletedEntities: [],
                    newImages: [],
                });
            });
        const editor = ({
            focus: jasmine.createSpy(),
            isDisposed: () => false,
            formatContentModel,
        } as any) as IEditor;

        executionCallback(editor);

        expect(model).toEqual(result);
        expect(formatContentModel).toHaveBeenCalledTimes(1);
        expect(formatContentModel.calls.argsFor(0)[1]).toEqual({
            apiName,
        });
        expect(setSelection.setSelection).toHaveBeenCalledTimes(1);
        expect(setSelection.setSelection).toHaveBeenCalledWith(model, image);
        expect(image.isSelected).toBeTrue();
        expect(formatResult).toBe(calledTimes > 0);
    }

    beforeEach(() => {
        spyOn(readFile, 'readFile').and.callFake((_, callback) => {
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
                                format: {
                                    backgroundColor: '',
                                },
                                dataset: {},
                                isSelectedAsImageSelection: true,
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
                                format: {
                                    backgroundColor: '',
                                },
                                dataset: {},
                                isSelectedAsImageSelection: true,
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
                                    backgroundColor: '',
                                },
                                dataset: {},
                                isSelectedAsImageSelection: true,
                                isSelected: true,
                            },
                        ],
                        segmentFormat: { fontFamily: 'Test', fontSize: '20px' },
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
