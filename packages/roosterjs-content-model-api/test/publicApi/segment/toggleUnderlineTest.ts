import { segmentTestCommon } from './segmentTestCommon';
import { toggleUnderline } from '../../../lib/publicApi/segment/toggleUnderline';
import {
    ContentModelDocument,
    IEditor,
    ContentModelFormatter,
    FormatContentModelOptions,
    ContentModelEntity,
    DeletedEntity,
    ContentModelImage,
} from 'roosterjs-content-model-types';

describe('toggleUnderline', () => {
    function runTest(
        model: ContentModelDocument,
        result: ContentModelDocument,
        calledTimes: number
    ) {
        segmentTestCommon('toggleUnderline', toggleUnderline, model, result, calledTimes);
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
                                format: { underline: true },
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
                                    underline: true,
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

    it('With selection, turn off underline', () => {
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
                                format: { underline: true },
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
                                    underline: false,
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
                                format: { underline: true },
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
                                    underline: true,
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
                                format: { underline: true },
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
                                format: { underline: true },
                                isSelected: true,
                            },
                        ],
                    },
                ],
            },
            1
        );
    });

    it('Turn on underline with link', () => {
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
                                link: {
                                    format: {},
                                    dataset: {},
                                },
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
                                format: { underline: true },
                                link: {
                                    format: { underline: true },
                                    dataset: {},
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

    it('Turn off underline with link', () => {
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
                                format: {
                                    underline: true,
                                },
                                link: {
                                    format: { underline: true },
                                    dataset: {},
                                },
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
                                format: { underline: false },
                                link: {
                                    format: { underline: false },
                                    dataset: {},
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

    it('Turn off link', () => {
        runTest(
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'Test',
                                format: {},
                                isSelected: true,
                                link: {
                                    format: {
                                        href: 'https://microsoft.github.io/roosterjs/index.html',
                                        anchorTitle: 'asd',
                                        underline: true,
                                    },
                                    dataset: {},
                                },
                            },
                        ],
                        format: {},
                    },
                ],
                format: {},
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'Test',
                                format: {
                                    underline: false,
                                },
                                isSelected: true,
                                link: {
                                    format: {
                                        href: 'https://microsoft.github.io/roosterjs/index.html',
                                        anchorTitle: 'asd',
                                        underline: false,
                                    },
                                    dataset: {},
                                },
                            },
                        ],
                        format: {},
                    },
                ],
                format: {},
            },
            1
        );
    });

    it('Turn on underline with trailing space', () => {
        runTest(
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'Test    ',
                                format: {},
                                isSelected: true,
                            },
                        ],
                        format: {},
                    },
                ],
                format: {},
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'Test    ',
                                format: {
                                    underline: true,
                                },
                                isSelected: true,
                            },
                        ],
                        format: {},
                    },
                ],
                format: {},
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
                            expect(options.apiName).toBe('toggleUnderline');
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

                toggleUnderline(editor, { announceFormatChange: true });

                expect(formatContentModel).toHaveBeenCalledTimes(1);
                expect(formatResult).toBe(calledTimes > 0);
                expect(model).toEqual(result);
                expect(announceData).toEqual(expectedAnnounceData);
            });
        }

        runTestWithAnnounceOption(
            'turn on underline with announce',
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
                                    underline: true,
                                },
                                isSelected: true,
                            },
                        ],
                    },
                ],
            },
            {
                defaultStrings: 'announceUnderlineOn',
            },
            1
        );

        runTestWithAnnounceOption(
            'turn off underline with announce',
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
                                format: { underline: true },
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
                                    underline: false,
                                },
                                isSelected: true,
                            },
                        ],
                    },
                ],
            },
            {
                defaultStrings: 'announceUnderlineOff',
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
                        expect(options.apiName).toBe('toggleUnderline');
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

            toggleUnderline(editor, { announceFormatChange: false });

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
                        expect(options.apiName).toBe('toggleUnderline');
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

            toggleUnderline(editor);

            expect(formatContentModel).toHaveBeenCalledTimes(1);
            expect(formatResult).toBe(true);
            expect(announceData).toBeUndefined();
        });
    });
});
