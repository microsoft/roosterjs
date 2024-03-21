import * as getFirstSelectedListItem from 'roosterjs-content-model-dom/lib/modelApi/selection/collectSelections';
import * as setModelIndentation from 'roosterjs-content-model-api/lib/modelApi/block/setModelIndentation';
import { setShortcutIndentationCommand } from '../../../lib/shortcut/utils/setShortcutIndentationCommand';
import type {
    ContentModelDocument,
    ContentModelFormatter,
    ContentModelListItem,
    FormatContentModelContext,
    IEditor,
} from 'roosterjs-content-model-types';

describe('setShortcutIndentationCommand', () => {
    let editor: IEditor;
    let formatContentModelSpy: jasmine.Spy;
    let context: FormatContentModelContext;
    let setModelIndentationSpy: jasmine.Spy;

    beforeEach(() => {
        setModelIndentationSpy = spyOn(setModelIndentation, 'setModelIndentation');
    });

    function runTest(
        model: ContentModelDocument,
        listItem: ContentModelListItem,
        shouldIndent: boolean,
        operation: 'indent' | 'outdent'
    ) {
        context = undefined!;
        formatContentModelSpy = jasmine
            .createSpy('formatContentModel')
            .and.callFake((callback: ContentModelFormatter) => {
                context = {
                    newEntities: [],
                    newImages: [],
                    deletedEntities: [],
                };
                callback(model, context);
            });

        spyOn(getFirstSelectedListItem, 'getFirstSelectedListItem').and.returnValue(listItem);

        editor = ({
            formatContentModel: formatContentModelSpy,
            focus: jasmine.createSpy('focus'),
            getPendingFormat: () => null as any,
        } as any) as IEditor;

        setShortcutIndentationCommand(editor, operation);
        expect(formatContentModelSpy).toHaveBeenCalledTimes(1);
        if (shouldIndent) {
            expect(setModelIndentationSpy).toHaveBeenCalledTimes(1);
            expect(setModelIndentationSpy).toHaveBeenCalledWith(model, operation);
        } else {
            expect(setModelIndentationSpy).not.toHaveBeenCalled();
        }
    }

    it('indent', () => {
        const model: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'SelectionMarker',
                                    isSelected: true,
                                    format: {},
                                },
                                {
                                    segmentType: 'Text',
                                    text: 'test',
                                    format: {},
                                },
                            ],
                            format: {},
                        },
                    ],
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                listStyleType: 'decimal',
                            },
                            dataset: {
                                editingInfo: '{"orderedStyleType":1}',
                            },
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: true,
                        format: {},
                    },
                    format: {},
                },
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'test',
                                    format: {},
                                },
                            ],
                            format: {},
                        },
                    ],
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                listStyleType: 'decimal',
                            },
                            dataset: {
                                editingInfo: '{"orderedStyleType":1}',
                            },
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: true,
                        format: {},
                    },
                    format: {},
                },
            ],
            format: {},
        };

        runTest(model, model.blocks[0] as ContentModelListItem, true, 'indent');
    });

    it('should not indent', () => {
        const model: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'test',
                                    format: {},
                                },
                            ],
                            format: {},
                        },
                    ],
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                listStyleType: 'decimal',
                            },
                            dataset: {
                                editingInfo: '{"orderedStyleType":1}',
                            },
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: true,
                        format: {},
                    },
                    format: {},
                },
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'test',
                                    format: {},
                                },
                                {
                                    segmentType: 'SelectionMarker',
                                    isSelected: true,
                                    format: {},
                                },
                            ],
                            format: {},
                        },
                    ],
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                listStyleType: 'decimal',
                            },
                            dataset: {
                                editingInfo: '{"orderedStyleType":1}',
                            },
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: true,
                        format: {},
                    },
                    format: {},
                },
            ],
            format: {},
        };
        runTest(model, model.blocks[1] as ContentModelListItem, false, 'indent');
    });
});
