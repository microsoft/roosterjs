import * as iterateSelections from 'roosterjs-content-model-dom/lib/modelApi/selection/iterateSelections';
import * as normalizeContentModel from 'roosterjs-content-model-dom/lib/modelApi/common/normalizeContentModel';
import { applyPendingFormat } from '../../../lib/corePlugin/format/applyPendingFormat';
import { Editor } from '../../../lib/editor/Editor';
import {
    ContentModelDocument,
    ContentModelParagraph,
    ContentModelSelectionMarker,
    ContentModelText,
    ContentModelFormatter,
    FormatContentModelOptions,
    IEditor,
    EditorPlugin,
} from 'roosterjs-content-model-types';
import {
    createContentModelDocument,
    createParagraph,
    createSelectionMarker,
    createText,
} from 'roosterjs-content-model-dom';

describe('applyPendingFormat', () => {
    it('Has pending format', () => {
        const text: ContentModelText = {
            segmentType: 'Text',
            text: 'abc',
            format: {},
        };
        const marker: ContentModelSelectionMarker = {
            segmentType: 'SelectionMarker',
            isSelected: true,
            format: {},
        };
        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            segments: [text, marker],
            format: {},
        };
        const model: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [paragraph],
        };

        const formatContentModelSpy = jasmine
            .createSpy('formatContentModel')
            .and.callFake((callback: ContentModelFormatter, options: FormatContentModelOptions) => {
                expect(options.apiName).toEqual('applyPendingFormat');
                callback(model, {
                    newEntities: [],
                    deletedEntities: [],
                    newImages: [],
                });
            });

        const triggerEventSpy = jasmine.createSpy('triggerEvent');

        const editor = ({
            formatContentModel: formatContentModelSpy,
            triggerEvent: triggerEventSpy,
        } as any) as IEditor;

        spyOn(iterateSelections, 'iterateSelections').and.callFake((_, callback) => {
            callback([model], undefined, paragraph, [marker]);
            return false;
        });

        applyPendingFormat(editor, 'c', {
            fontSize: '10px',
        });

        expect(formatContentModelSpy).toHaveBeenCalledTimes(1);
        expect(triggerEventSpy).toHaveBeenCalledTimes(1);
        expect(triggerEventSpy).toHaveBeenCalledWith('applyPendingFormat', {
            paragraph: paragraph,
            text: { segmentType: 'Text', text: 'c', format: { fontSize: '10px' } },
            path: [model],
            format: { fontSize: '10px' },
        });
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'ab',
                            format: {},
                        },
                        {
                            segmentType: 'Text',
                            text: 'c',
                            format: {
                                fontSize: '10px',
                            },
                        },
                        {
                            segmentType: 'SelectionMarker',
                            format: { fontSize: '10px' },
                            isSelected: true,
                        },
                    ],
                },
            ],
        });
    });

    it('Has pending format but wrong text', () => {
        const text: ContentModelText = {
            segmentType: 'Text',
            text: 'abc',
            format: {},
        };
        const marker: ContentModelSelectionMarker = {
            segmentType: 'SelectionMarker',
            isSelected: true,
            format: {},
        };
        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            segments: [text, marker],
            format: {},
        };
        const model: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [paragraph],
        };

        const formatContentModelSpy = jasmine
            .createSpy('formatContentModel')
            .and.callFake((callback: ContentModelFormatter, options: FormatContentModelOptions) => {
                expect(options.apiName).toEqual('applyPendingFormat');
                callback(model, { newEntities: [], deletedEntities: [], newImages: [] });
            });

        const triggerEventSpy = jasmine.createSpy('triggerEvent');

        const editor = ({
            formatContentModel: formatContentModelSpy,
            triggerEvent: triggerEventSpy,
        } as any) as IEditor;

        spyOn(iterateSelections, 'iterateSelections').and.callFake((_, callback) => {
            callback([model], undefined, paragraph, [marker]);
            return false;
        });

        applyPendingFormat(editor, 'd', {
            fontSize: '10px',
        });

        expect(formatContentModelSpy).toHaveBeenCalledTimes(1);
        expect(triggerEventSpy).toHaveBeenCalledTimes(0);
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'abc',
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
        });
    });

    it('No pending format', () => {
        const text: ContentModelText = {
            segmentType: 'Text',
            text: 'abc',
            format: {},
        };
        const marker: ContentModelSelectionMarker = {
            segmentType: 'SelectionMarker',
            isSelected: true,
            format: {},
        };
        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            segments: [text, marker],
            format: {},
        };
        const model: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [paragraph],
        };

        const formatContentModelSpy = jasmine.createSpy('formatContentModel');
        const triggerEventSpy = jasmine.createSpy('triggerEvent');

        const editor = ({
            formatContentModel: formatContentModelSpy,
            triggerEvent: triggerEventSpy,
        } as any) as IEditor;

        spyOn(iterateSelections, 'iterateSelections').and.callFake((_, callback) => {
            callback([model], undefined, paragraph, [marker]);
            return false;
        });

        applyPendingFormat(editor, 'd', {});

        expect(triggerEventSpy).toHaveBeenCalledTimes(0);
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'abc',
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
        });
    });

    it('Selection is not collapsed', () => {
        const text: ContentModelText = {
            segmentType: 'Text',
            text: 'abc',
            format: {},
            isSelected: true,
        };
        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            segments: [text],
            format: {},
        };
        const model: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [paragraph],
        };

        const formatContentModelSpy = jasmine
            .createSpy('formatContentModel')
            .and.callFake((callback: ContentModelFormatter, options: FormatContentModelOptions) => {
                expect(options.apiName).toEqual('applyPendingFormat');
                callback(model, { newEntities: [], deletedEntities: [], newImages: [] });
            });
        const triggerEventSpy = jasmine.createSpy('triggerEvent');

        const editor = ({
            formatContentModel: formatContentModelSpy,
            triggerEvent: triggerEventSpy,
        } as any) as IEditor;

        spyOn(iterateSelections, 'iterateSelections').and.callFake((_, callback) => {
            callback([model], undefined, paragraph, [text]);
            return false;
        });

        applyPendingFormat(editor, 'd', {
            fontSize: '10px',
        });

        expect(formatContentModelSpy).toHaveBeenCalledTimes(1);
        expect(triggerEventSpy).toHaveBeenCalledTimes(0);
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'abc',
                            format: {},
                            isSelected: true,
                        },
                    ],
                },
            ],
        });
    });

    it('Implicit paragraph', () => {
        const text = createText('test');
        const marker = createSelectionMarker();
        const paragraph = createParagraph(true /*isImplicit*/);
        const model = createContentModelDocument();

        paragraph.segments.push(text, marker);
        model.blocks.push(paragraph);

        const formatContentModelSpy = jasmine
            .createSpy('formatContentModel')
            .and.callFake((callback: ContentModelFormatter, options: FormatContentModelOptions) => {
                expect(options.apiName).toEqual('applyPendingFormat');
                callback(model, { newEntities: [], deletedEntities: [], newImages: [] });
            });
        const triggerEventSpy = jasmine.createSpy('triggerEvent');

        const editor = ({
            formatContentModel: formatContentModelSpy,
            triggerEvent: triggerEventSpy,
        } as any) as IEditor;

        spyOn(iterateSelections, 'iterateSelections').and.callFake((_, callback) => {
            callback([model], undefined, paragraph, [marker]);
            return false;
        });
        spyOn(normalizeContentModel, 'normalizeContentModel').and.callThrough();

        applyPendingFormat(editor, 't', {
            fontSize: '10px',
        });

        expect(formatContentModelSpy).toHaveBeenCalledTimes(1);
        expect(triggerEventSpy).toHaveBeenCalledTimes(1);
        expect(triggerEventSpy).toHaveBeenCalledWith('applyPendingFormat', {
            paragraph: paragraph,
            text: { segmentType: 'Text', text: 't', format: { fontSize: '10px' } },
            path: [model],
            format: { fontSize: '10px' },
        });
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    isImplicit: false,
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'tes',
                            format: {},
                        },
                        {
                            segmentType: 'Text',
                            text: 't',
                            format: {
                                fontSize: '10px',
                            },
                        },
                        {
                            segmentType: 'SelectionMarker',
                            format: {
                                fontSize: '10px',
                            },
                            isSelected: true,
                        },
                    ],
                },
            ],
        });

        expect(normalizeContentModel.normalizeContentModel).toHaveBeenCalled();
    });
});

describe('applyPendingFormat with event - end to end', () => {
    let div: HTMLDivElement;

    beforeEach(() => {
        div = document.createElement('div');
        document.body.appendChild(div);
    });

    afterEach(() => {
        document.body.removeChild(div);
    });

    it('Test plugin handling applyPendingFormat event', () => {
        const onPluginEvent = jasmine.createSpy('onPluginEvent');
        const plugin: EditorPlugin = {
            getName: () => 'test',
            initialize: () => {},
            dispose: () => {},
            onPluginEvent,
        };

        const editor = new Editor(div, {
            plugins: [plugin],
            initialModel: {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'a',
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
        });

        applyPendingFormat(editor, 'a', {});

        editor.dispose();

        const text = { segmentType: 'Text', text: 'a', format: {} };
        const paragraph = {
            blockType: 'Paragraph',
            format: {},
            segments: [text, { segmentType: 'SelectionMarker', format: {}, isSelected: true }],
            cachedElement: jasmine.anything(),
        };
        const path = [
            {
                blockGroupType: 'Document',
                blocks: [paragraph],
                persistCache: true,
            },
        ];

        expect(onPluginEvent).toHaveBeenCalledWith({
            eventType: 'applyPendingFormat',
            paragraph,
            text,
            path,
            format: {},
        });
    });
});
