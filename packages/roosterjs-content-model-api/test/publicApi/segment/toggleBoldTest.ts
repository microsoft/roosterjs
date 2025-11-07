import { segmentTestCommon } from './segmentTestCommon';
import { toggleBold } from '../../../lib/publicApi/segment/toggleBold';
import {
    ContentModelDocument,
    IEditor,
    ContentModelFormatter,
    FormatContentModelOptions,
    ContentModelEntity,
    DeletedEntity,
    ContentModelImage,
} from 'roosterjs-content-model-types';

describe('toggleBold', () => {
    function runTest(
        model: ContentModelDocument,
        result: ContentModelDocument,
        calledTimes: number
    ) {
        segmentTestCommon('toggleBold', toggleBold, model, result, calledTimes);
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
                                format: { fontWeight: 'bold' },
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
                                    fontWeight: 'bold',
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

    it('With selection, turn off bold', () => {
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
                                format: { fontWeight: '700' },
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
                                    fontWeight: 'normal',
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
                                format: { fontWeight: '700' },
                                isSelected: true,
                            },
                            {
                                segmentType: 'Text',
                                text: 'test',
                                format: { fontWeight: 'normal' },
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
                                    fontWeight: 'bold',
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
                                format: { fontWeight: 'bold' },
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
                                format: { fontWeight: 'bold' },
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
                        ],
                        decorator: {
                            format: {
                                fontWeight: 'bold',
                            },
                            tagName: 'h1',
                        },
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
                                format: { fontWeight: 'normal' },
                                isSelected: true,
                            },
                        ],
                        decorator: {
                            format: {
                                fontWeight: 'bold',
                            },
                            tagName: 'h1',
                        },
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
                            expect(options.apiName).toBe('toggleBold');
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

                toggleBold(editor, { announceFormatChange: true });

                expect(formatContentModel).toHaveBeenCalledTimes(1);
                expect(formatResult).toBe(calledTimes > 0);
                expect(model).toEqual(result);
                expect(announceData).toEqual(expectedAnnounceData);
            });
        }

        runTestWithAnnounceOption(
            'turn on bold with announce',
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
                                    fontWeight: 'bold',
                                },
                                isSelected: true,
                            },
                        ],
                    },
                ],
            },
            {
                defaultStrings: 'announceBoldOn',
            },
            1
        );

        runTestWithAnnounceOption(
            'turn off bold with announce',
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
                                format: { fontWeight: '700' },
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
                                    fontWeight: 'normal',
                                },
                                isSelected: true,
                            },
                        ],
                    },
                ],
            },
            {
                defaultStrings: 'announceBoldOff',
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
                        expect(options.apiName).toBe('toggleBold');
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

            toggleBold(editor, { announceFormatChange: false });

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
                        expect(options.apiName).toBe('toggleBold');
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

            toggleBold(editor);

            expect(formatContentModel).toHaveBeenCalledTimes(1);
            expect(formatResult).toBe(true);
            expect(announceData).toBeUndefined();
        });
    });
});
