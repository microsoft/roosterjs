import { segmentTestCommon } from './segmentTestCommon';
import { toggleItalic } from '../../../lib/publicApi/segment/toggleItalic';
import {
    ContentModelDocument,
    IEditor,
    ContentModelFormatter,
    FormatContentModelOptions,
    ContentModelEntity,
    DeletedEntity,
    ContentModelImage,
} from 'roosterjs-content-model-types';

describe('toggleItalic', () => {
    function runTest(
        model: ContentModelDocument,
        result: ContentModelDocument,
        calledTimes: number
    ) {
        segmentTestCommon('toggleItalic', toggleItalic, model, result, calledTimes);
    }

    it('empty content', () => {
        runTest(
            {
                blockGroupType: 'Document',
                blocks: [],
            },
            {
                blockGroupType: 'Document',
                blocks: [],
            },
            0
        );
    });

    it('no selection', () => {
        runTest(
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'test',
                                format: {},
                            },
                        ],
                    },
                ],
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'test',
                                format: {},
                            },
                        ],
                    },
                ],
            },
            0
        );
    });

    it('Collapsed selection', () => {
        runTest(
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'test',
                                format: {},
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
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'test',
                                format: {},
                            },
                            {
                                segmentType: 'SelectionMarker',
                                format: { italic: true },
                                isSelected: true,
                            },
                        ],
                    },
                ],
            },
            0
        );
    });

    it('With selection', () => {
        runTest(
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
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
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'test',
                                format: {
                                    italic: true,
                                },
                                isSelected: true,
                            },
                        ],
                    },
                ],
            },
            1
        );
    });

    it('With selection, turn off italic', () => {
        runTest(
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'test',
                                format: { italic: true },
                                isSelected: true,
                            },
                        ],
                    },
                ],
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'test',
                                format: {
                                    italic: false,
                                },
                                isSelected: true,
                            },
                        ],
                    },
                ],
            },
            1
        );
    });

    it('With mixed selection', () => {
        runTest(
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'test',
                                format: { italic: true },
                                isSelected: true,
                            },
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
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'testtest',
                                format: {
                                    italic: true,
                                },
                                isSelected: true,
                            },
                        ],
                    },
                ],
            },
            1
        );
    });

    it('With separate selection', () => {
        runTest(
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'test',
                                format: {},
                                isSelected: true,
                            },
                            {
                                segmentType: 'Text',
                                text: 'test',
                                format: {},
                            },
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
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'test',
                                format: { italic: true },
                                isSelected: true,
                            },
                            {
                                segmentType: 'Text',
                                text: 'test',
                                format: {},
                            },
                            {
                                segmentType: 'Text',
                                text: 'test',
                                format: { italic: true },
                                isSelected: true,
                            },
                        ],
                    },
                ],
            },
            1
        );
    });

    describe('with announceFormatChange option', () => {
        function runTestWithAnnounceOption(
            testName: string,
            model: ContentModelDocument,
            result: ContentModelDocument,
            expectedAnnounceData: any,
            calledTimes: number
        ) {
            it(testName, () => {
                let formatResult: boolean | undefined;
                let announceData: any;
                const formatContentModel = jasmine
                    .createSpy('formatContentModel')
                    .and.callFake(
                        (callback: ContentModelFormatter, options: FormatContentModelOptions) => {
                            expect(options.apiName).toBe('toggleItalic');
                            const context = {
                                newEntities: [] as ContentModelEntity[],
                                deletedEntities: [] as DeletedEntity[],
                                newImages: [] as ContentModelImage[],
                            };
                            formatResult = callback(model, context);
                            announceData = (context as any).announceData;
                        }
                    );
                const editor = ({
                    focus: jasmine.createSpy(),
                    getPendingFormat: () => null as any,
                    formatContentModel,
                } as any) as IEditor;

                toggleItalic(editor, { announceFormatChange: true });

                expect(formatContentModel).toHaveBeenCalledTimes(1);
                expect(formatResult).toBe(calledTimes > 0);
                expect(model).toEqual(result);
                expect(announceData).toEqual(expectedAnnounceData);
            });
        }

        runTestWithAnnounceOption(
            'turn on italic with announce',
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
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
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'test',
                                format: {
                                    italic: true,
                                },
                                isSelected: true,
                            },
                        ],
                    },
                ],
            },
            {
                defaultStrings: 'announceItalicOn',
            },
            1
        );

        runTestWithAnnounceOption(
            'turn off italic with announce',
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'test',
                                format: { italic: true },
                                isSelected: true,
                            },
                        ],
                    },
                ],
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'test',
                                format: {
                                    italic: false,
                                },
                                isSelected: true,
                            },
                        ],
                    },
                ],
            },
            {
                defaultStrings: 'announceItalicOff',
            },
            1
        );

        it('no announce when option is false', () => {
            let formatResult: boolean | undefined;
            let announceData: any;
            const model: ContentModelDocument = {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
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
            };
            const formatContentModel = jasmine
                .createSpy('formatContentModel')
                .and.callFake(
                    (callback: ContentModelFormatter, options: FormatContentModelOptions) => {
                        expect(options.apiName).toBe('toggleItalic');
                        const context = {
                            newEntities: [] as ContentModelEntity[],
                            deletedEntities: [] as DeletedEntity[],
                            newImages: [] as ContentModelImage[],
                        };
                        formatResult = callback(model, context);
                        announceData = (context as any).announceData;
                    }
                );
            const editor = ({
                focus: jasmine.createSpy(),
                getPendingFormat: () => null as any,
                formatContentModel,
            } as any) as IEditor;

            toggleItalic(editor, { announceFormatChange: false });

            expect(formatContentModel).toHaveBeenCalledTimes(1);
            expect(formatResult).toBe(true);
            expect(announceData).toBeUndefined();
        });

        it('no announce when option is not provided', () => {
            let formatResult: boolean | undefined;
            let announceData: any;
            const model: ContentModelDocument = {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
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
            };
            const formatContentModel = jasmine
                .createSpy('formatContentModel')
                .and.callFake(
                    (callback: ContentModelFormatter, options: FormatContentModelOptions) => {
                        expect(options.apiName).toBe('toggleItalic');
                        const context = {
                            newEntities: [] as ContentModelEntity[],
                            deletedEntities: [] as DeletedEntity[],
                            newImages: [] as ContentModelImage[],
                        };
                        formatResult = callback(model, context);
                        announceData = (context as any).announceData;
                    }
                );
            const editor = ({
                focus: jasmine.createSpy(),
                getPendingFormat: () => null as any,
                formatContentModel,
            } as any) as IEditor;

            toggleItalic(editor);

            expect(formatContentModel).toHaveBeenCalledTimes(1);
            expect(formatResult).toBe(true);
            expect(announceData).toBeUndefined();
        });
    });
});
