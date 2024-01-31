import formatImage from '../../../lib/publicApi/utils/formatImage';
import { IStandaloneEditor } from 'roosterjs-content-model-types';
import {
    ContentModelDocument,
    ContentModelImage,
    ContentModelFormatter,
    FormatContentModelOptions,
} from 'roosterjs-content-model-types';
import {
    addSegment,
    createContentModelDocument,
    createImage,
    createText,
} from 'roosterjs-content-model-dom';

describe('formatImage', () => {
    function runTest(
        model: ContentModelDocument,
        result: ContentModelDocument,
        calledTimes: number,
        callback: (image: ContentModelImage) => void
    ) {
        segmentTestForPluginEvent(
            'apiTest',
            editor => {
                formatImage(editor, 'apiTest', callback);
            },
            model,
            result,
            calledTimes
        );
    }

    it('Empty doc', () => {
        runTest(
            createContentModelDocument(),
            {
                blockGroupType: 'Document',
                blocks: [],
            },
            0,
            (image: ContentModelImage) => {
                return;
            }
        );
    });

    it('Doc without selection', () => {
        const doc = createContentModelDocument();
        const img = createImage('test');

        addSegment(doc, img);

        runTest(
            doc,
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
                                src: 'test',
                                dataset: {},
                                format: {},
                            },
                        ],
                    },
                ],
            },
            0,
            (image: ContentModelImage) => {
                return;
            }
        );
    });

    it('Doc with selection, but no image', () => {
        const doc = createContentModelDocument();
        const text = createText('test');

        text.isSelected = true;

        addSegment(doc, text);

        runTest(
            doc,
            {
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
                                isSelected: true,
                            },
                        ],
                    },
                ],
            },
            1,
            (image: ContentModelImage) => {
                return;
            }
        );
    });

    it('Doc with selection and image - add border top ', () => {
        const doc = createContentModelDocument();
        const img = createImage('test');

        img.isSelected = true;

        addSegment(doc, img);

        runTest(
            doc,
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
                                src: 'test',
                                isSelected: true,
                                dataset: {},
                                format: {
                                    boxShadow: '0px 0px 3px 3px #aaaaaa',
                                    borderTop: '1px solid green',
                                },
                            },
                        ],
                    },
                ],
            },
            1,
            (image: ContentModelImage) => {
                image.format.borderTop = '1px solid green';
                image.format.boxShadow = '0px 0px 3px 3px #aaaaaa';
            }
        );
    });

    it('Doc with selection and image - add border top -trigger plugin event', () => {
        const doc = createContentModelDocument();
        const img = createImage('test');

        img.isSelected = true;

        addSegment(doc, img);

        runTest(
            doc,
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
                                src: 'test',
                                isSelected: true,
                                dataset: {},
                                format: {
                                    boxShadow: '0px 0px 3px 3px #aaaaaa',
                                    borderTop: '1px solid green',
                                },
                            },
                        ],
                    },
                ],
            },
            1,
            (image: ContentModelImage) => {
                image.format.borderTop = '1px solid green';
                image.format.boxShadow = '0px 0px 3px 3px #aaaaaa';
            }
        );
    });
});

function segmentTestForPluginEvent(
    apiName: string,
    executionCallback: (editor: IStandaloneEditor) => void,
    model: ContentModelDocument,
    result: ContentModelDocument,
    calledTimes: number
) {
    let formatResult: boolean | undefined;
    const formatContentModel = jasmine
        .createSpy('formatContentModel')
        .and.callFake((callback: ContentModelFormatter, options: FormatContentModelOptions) => {
            expect(options.apiName).toBe(apiName);
            formatResult = callback(model, {
                newEntities: [],
                deletedEntities: [],
                newImages: [],
            });
        });
    const editor = ({
        formatContentModel,
        getPendingFormat: () => null as any,
    } as any) as IStandaloneEditor;

    executionCallback(editor);

    expect(formatContentModel).toHaveBeenCalledTimes(1);
    expect(formatResult).toBe(calledTimes > 0);
    expect(model).toEqual(result);
}
