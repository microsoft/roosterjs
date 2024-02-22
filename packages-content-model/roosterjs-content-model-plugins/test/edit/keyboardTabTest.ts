import * as setModelIndentation from '../../../roosterjs-content-model-api/lib/modelApi/block/setModelIndentation';
import { ContentModelDocument } from 'roosterjs-content-model-types';
import { editingTestCommon } from './editingTestCommon';
import { keyboardTab } from '../../lib/edit/keyboardTab';

describe('keyboardTab', () => {
    let takeSnapshotSpy: jasmine.Spy;
    let setModelIndentationSpy: jasmine.Spy;

    beforeEach(() => {
        takeSnapshotSpy = jasmine.createSpy('takeSnapshot');
        setModelIndentationSpy = spyOn(setModelIndentation, 'setModelIndentation');
    });

    function runTest(
        input: ContentModelDocument,
        indent: 'outdent' | 'indent' | undefined,
        shiftKey: boolean,
        expectedResult: boolean
    ) {
        const formatWithContentModelSpy = jasmine
            .createSpy('formatWithContentModel')
            .and.callFake((callback, options) => {
                const result = callback(input, {
                    newEntities: [],
                    deletedEntities: [],
                    newImages: [],
                });
                expect(result).toBe(expectedResult);
            });

        const editor = {
            focus: () => {},
            formatContentModel: formatWithContentModelSpy,
            takeSnapshot: takeSnapshotSpy,
            getDOMSelection: () => {
                return {
                    type: 'range',
                    range: {
                        collapsed: true,
                    },
                };
            },
        };

        keyboardTab(
            editor as any,
            {
                key: 'Tab',
                shiftKey: shiftKey,
                preventDefault: () => {},
            } as KeyboardEvent
        );

        expect(formatWithContentModelSpy).toHaveBeenCalled();
        if (indent) {
            expect(setModelIndentationSpy).toHaveBeenCalledWith(input as any, indent);
        } else {
            expect(setModelIndentationSpy).not.toHaveBeenCalled();
        }
    }

    it('tab on the end of paragraph', () => {
        const model: ContentModelDocument = {
            blockGroupType: 'Document',
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
            format: {},
        };

        runTest(model, undefined, false, true);
    });

    it('tab on the start of paragraph', () => {
        const model: ContentModelDocument = {
            blockGroupType: 'Document',
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
            format: {},
        };

        runTest(model, 'indent', false, true);
    });

    it('tab on empty list', () => {
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
                            ],
                            format: {},
                            isImplicit: true,
                        },
                    ],
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                startNumberOverride: 1,
                                marginTop: '0px',
                                marginBottom: '0px',
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

        runTest(model, 'indent', false, true);
    });

    it('tab on the start first item on the list', () => {
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
                            isImplicit: true,
                        },
                    ],
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                marginTop: '0px',
                                marginBottom: '0px',
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
                            isImplicit: true,
                        },
                    ],
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                marginTop: '0px',
                                marginBottom: '0px',
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
                            isImplicit: true,
                        },
                    ],
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                marginTop: '0px',
                                marginBottom: '0px',
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

        runTest(model, 'indent', false, true);
    });

    it('tab on the end first item on the list', () => {
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
                                {
                                    segmentType: 'SelectionMarker',
                                    isSelected: true,
                                    format: {},
                                },
                            ],
                            format: {},
                            isImplicit: true,
                        },
                    ],
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                marginTop: '0px',
                                marginBottom: '0px',
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
                            isImplicit: true,
                        },
                    ],
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                marginTop: '0px',
                                marginBottom: '0px',
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
                            isImplicit: true,
                        },
                    ],
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                marginTop: '0px',
                                marginBottom: '0px',
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
        runTest(model, undefined, false, false);
    });

    it('tab on the start second item on the list', () => {
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
                            isImplicit: true,
                        },
                    ],
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                marginTop: '0px',
                                marginBottom: '0px',
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
                            isImplicit: true,
                        },
                    ],
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                marginTop: '0px',
                                marginBottom: '0px',
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
                            isImplicit: true,
                        },
                    ],
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                marginTop: '0px',
                                marginBottom: '0px',
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
        runTest(model, 'indent', false, true);
    });

    it('tab on the end second item on the list', () => {
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
                                {
                                    segmentType: 'SelectionMarker',
                                    isSelected: true,
                                    format: {},
                                },
                            ],
                            format: {},
                            isImplicit: true,
                        },
                    ],
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                marginTop: '0px',
                                marginBottom: '0px',
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
                            isImplicit: true,
                        },
                    ],
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                marginTop: '0px',
                                marginBottom: '0px',
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
                            isImplicit: true,
                        },
                    ],
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                marginTop: '0px',
                                marginBottom: '0px',
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
        runTest(model, undefined, false, false);
    });

    it('shift tab on empty list item', () => {
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
                            ],
                            format: {},
                            segmentFormat: {},
                            isImplicit: true,
                        },
                    ],
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                marginTop: '0px',
                                marginBottom: '0px',
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
        runTest(model, 'outdent', true, true);
    });

    it('shift tab on the start first item on the list', () => {
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
                                    text: 'testdsadas',
                                    format: {},
                                },
                            ],
                            format: {},
                            isImplicit: true,
                        },
                    ],
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                marginTop: '0px',
                                marginBottom: '0px',
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
                                    text: 'dsadasdasdas',
                                    format: {},
                                },
                            ],
                            format: {},
                            isImplicit: true,
                        },
                    ],
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                marginTop: '0px',
                                marginBottom: '0px',
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
        runTest(model, 'outdent', true, true);
    });

    it('shift tab on the middle first item on the list', () => {
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
                                    text: 'testd',
                                    format: {},
                                },
                                {
                                    segmentType: 'SelectionMarker',
                                    isSelected: true,
                                    format: {},
                                },
                                {
                                    segmentType: 'Text',
                                    text: 'sadas',
                                    format: {},
                                },
                            ],
                            format: {},
                            isImplicit: true,
                        },
                    ],
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                marginTop: '0px',
                                marginBottom: '0px',
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
                                    text: 'dsadasdasdas',
                                    format: {},
                                },
                            ],
                            format: {},
                            isImplicit: true,
                        },
                    ],
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                marginTop: '0px',
                                marginBottom: '0px',
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
        runTest(model, undefined, true, false);
    });
});

describe('keyboardTab - handleTabOnParagraph -', () => {
    function runTest(
        input: ContentModelDocument,
        key: string,
        collapsed: boolean,
        shiftKey: boolean,
        expectedResult: ContentModelDocument,
        calledTimes: number = 1
    ) {
        const preventDefault = jasmine.createSpy('preventDefault');
        const mockedEvent = ({
            key,
            shiftKey: shiftKey,
            preventDefault,
        } as any) as KeyboardEvent;

        let editor: any;

        editingTestCommon(
            'handleTabKey',
            newEditor => {
                editor = newEditor;

                editor.getDOMSelection = () => ({
                    type: 'range',
                    range: {
                        collapsed: collapsed,
                    },
                });

                keyboardTab(editor, mockedEvent);
            },
            input,
            expectedResult,
            calledTimes
        );
    }

    it('collapsed range | tab on the end of paragraph', () => {
        const input: ContentModelDocument = {
            blockGroupType: 'Document',
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
            format: {},
        };

        const expectedResult: ContentModelDocument = {
            blockGroupType: 'Document',
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
                            segmentType: 'Text',
                            text: '    ',
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
            format: {},
        };
        runTest(input, 'Tab', true, false, expectedResult);
    });

    it('collapsed range | tab on the start of paragraph', () => {
        const input: ContentModelDocument = {
            blockGroupType: 'Document',
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
            format: {},
        };

        const expectedResult: ContentModelDocument = {
            blockGroupType: 'Document',
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
                    format: {
                        marginLeft: '40px',
                    },
                },
            ],
            format: {},
        };
        runTest(input, 'Tab', true, false, expectedResult);
    });

    it('collapsed range | tab on the middle of paragraph', () => {
        const input: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'te',
                            format: {},
                        },
                        {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {},
                        },
                        {
                            segmentType: 'Text',
                            text: 'st',
                            format: {},
                        },
                    ],
                    format: {},
                },
            ],
            format: {},
        };

        const expectedResult: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'te',
                            format: {},
                        },
                        {
                            segmentType: 'Text',
                            text: '    ',
                            format: {},
                        },
                        {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {},
                        },
                        {
                            segmentType: 'Text',
                            text: 'st',
                            format: {},
                        },
                    ],
                    format: {},
                },
            ],
            format: {},
        };
        runTest(input, 'Tab', true, false, expectedResult);
    });

    it('collapsed range | shift tab on the end of paragraph', () => {
        const input: ContentModelDocument = {
            blockGroupType: 'Document',
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
            format: {},
        };
        runTest(input, 'Tab', true, true, input, 0);
    });

    it('collapsed range | shift tab on the start of paragraph indented', () => {
        const input: ContentModelDocument = {
            blockGroupType: 'Document',
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
                    format: {
                        marginLeft: '40px',
                    },
                },
            ],
            format: {},
        };

        const expectedResult: ContentModelDocument = {
            blockGroupType: 'Document',
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
                    format: {
                        marginLeft: '0px',
                    },
                },
            ],
            format: {},
        };
        runTest(input, 'Tab', true, true, expectedResult);
    });

    it('collapsed range | shift tab on the end of paragraph indented', () => {
        const input: ContentModelDocument = {
            blockGroupType: 'Document',
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
                            segmentType: 'Text',
                            text: '    ',
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
            format: {},
        };

        const expectedResult: ContentModelDocument = {
            blockGroupType: 'Document',
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
            format: {},
        };
        runTest(input, 'Tab', true, true, expectedResult);
    });

    it('collapsed range | shift tab on the middle of paragraph indented', () => {
        const input: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'te    ',
                            format: {},
                        },
                        {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {},
                        },
                        {
                            segmentType: 'Text',
                            text: 'st',
                            format: {},
                        },
                    ],
                    format: {},
                },
            ],
            format: {},
        };
        const expectedResult: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'te',
                            format: {},
                        },
                        {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {},
                        },
                        {
                            segmentType: 'Text',
                            text: 'st',
                            format: {},
                        },
                    ],
                    format: {},
                },
            ],
            format: {},
        };
        runTest(input, 'Tab', true, true, expectedResult);
    });

    it('expanded range | tab on paragraph', () => {
        const input: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: '123',
                            format: {},
                        },
                        {
                            segmentType: 'Text',
                            text: '456',
                            format: {},
                            isSelected: true,
                        },
                        {
                            segmentType: 'Text',
                            text: '789',
                            format: {},
                        },
                    ],
                    format: {},
                },
            ],
            format: {},
        };

        const expectedResult: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: '123',
                            format: {},
                        },
                        {
                            segmentType: 'Text',
                            text: ' ',
                            format: {},
                        },
                        {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {},
                        },
                        {
                            segmentType: 'Text',
                            text: '789',
                            format: {},
                        },
                    ],
                    format: {},
                },
            ],
            format: {},
        };
        runTest(input, 'Tab', false, false, expectedResult);
    });

    it('expanded range | shift tab on paragraph', () => {
        const input: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: '123',
                            format: {},
                        },
                        {
                            segmentType: 'Text',
                            text: '456',
                            format: {},
                            isSelected: true,
                        },
                        {
                            segmentType: 'Text',
                            text: '789',
                            format: {},
                        },
                    ],
                    format: {},
                },
            ],
            format: {},
        };

        const expectedResult: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: '123',
                            format: {},
                        },
                        {
                            segmentType: 'Text',
                            text: '    ',
                            format: {},
                        },
                        {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {},
                        },
                        {
                            segmentType: 'Text',
                            text: '789',
                            format: {},
                        },
                    ],
                    format: {},
                },
            ],
            format: {},
        };
        runTest(input, 'Tab', false, true, expectedResult);
    });
});
