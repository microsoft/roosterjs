import * as cloneModel from 'roosterjs-content-model-dom/lib/modelApi/editing/cloneModel';
import * as createDomToModelContextForSanitizing from '../../../lib/command/createModelFromHtml/createDomToModelContextForSanitizing';
import * as domToContentModel from 'roosterjs-content-model-dom/lib/domToModel/domToContentModel';
import * as getSegmentTextFormatFile from 'roosterjs-content-model-dom/lib/modelApi/editing/getSegmentTextFormat';
import * as mergeModelFile from 'roosterjs-content-model-dom/lib/modelApi/editing/mergeModel';
import { createPasteFragment } from '../../../lib/command/paste/createPasteFragment';
import { inlineTemplate, template } from './htmlTemplates/ClipboardContent1';
import { mergePasteContent } from '../../../lib/command/paste/mergePasteContent';

import {
    addBlock,
    createContentModelDocument,
    createParagraph,
    createSelectionMarker,
    createText,
    moveChildNodes,
} from 'roosterjs-content-model-dom';
import {
    ContentModelDocument,
    ContentModelFormatter,
    ContentModelSegmentFormat,
    FormatContentModelContext,
    FormatContentModelOptions,
    InsertPoint,
    IEditor,
    ClipboardData,
} from 'roosterjs-content-model-types';

describe('mergePasteContent', () => {
    let formatResult: boolean | undefined;
    let context: FormatContentModelContext | undefined;
    let formatContentModel: jasmine.Spy;
    let sourceModel: ContentModelDocument;
    let editor: IEditor;
    let mockedClipboard: ClipboardData;

    beforeEach(() => {
        formatResult = undefined;
        context = undefined;
        mockedClipboard = 'CLIPBOARD' as any;

        formatContentModel = jasmine
            .createSpy('formatContentModel')
            .and.callFake((callback: ContentModelFormatter, options: FormatContentModelOptions) => {
                context = {
                    newEntities: [],
                    deletedEntities: [],
                    newImages: [],
                };
                formatResult = callback(sourceModel, context);

                const changedData = options.getChangeData!();

                expect(changedData).toBe(mockedClipboard);
            });

        editor = {
            formatContentModel,
            getEnvironment: () => ({
                domToModelSettings: {},
            }),
            getDocument: () => document,
        } as any;
    });

    it('merge table', () => {
        // A doc with only one table in content
        const pasteModel: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Table',
                    rows: [
                        {
                            height: 0,
                            format: {},
                            cells: [
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            blockType: 'Paragraph',
                                            segments: [
                                                {
                                                    segmentType: 'Text',
                                                    text: 'FromPaste',
                                                    format: {},
                                                },
                                            ],
                                            format: {},
                                            isImplicit: true,
                                        },
                                    ],
                                    format: {},
                                    spanLeft: false,
                                    spanAbove: false,
                                    isHeader: false,
                                    dataset: {},
                                },
                            ],
                        },
                    ],
                    format: { useBorderBox: true, borderCollapse: true },
                    widths: [],
                    dataset: {
                        editingInfo: '',
                    },
                },
            ],
        };

        // A doc with a table, and selection marker inside of it.
        sourceModel = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Table',
                    rows: [
                        {
                            height: 22,
                            format: {},
                            cells: [
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            blockType: 'Paragraph',
                                            segments: [
                                                {
                                                    segmentType: 'SelectionMarker',
                                                    isSelected: true,
                                                    format: {},
                                                },
                                                { segmentType: 'Br', format: {} },
                                            ],
                                            format: {},
                                            isImplicit: true,
                                        },
                                    ],
                                    format: {},
                                    spanLeft: false,
                                    spanAbove: false,
                                    isHeader: false,
                                    dataset: {},
                                },
                            ],
                        },
                    ],
                    format: { useBorderBox: true, borderCollapse: true },
                    widths: [120, 120],
                    dataset: {
                        editingInfo: '',
                    },
                },
                {
                    blockType: 'Paragraph',
                    segments: [{ segmentType: 'Br', format: {} }],
                    format: {},
                },
            ],
            format: {},
        };

        spyOn(mergeModelFile, 'mergeModel').and.callThrough();
        spyOn(domToContentModel, 'domToContentModel').and.returnValue(pasteModel);

        const eventResult = {
            pasteType: 'normal',
            domToModelOption: { additionalAllowedTags: [] },
            clipboardData: mockedClipboard,
        } as any;

        mergePasteContent(editor, eventResult, true);

        expect(formatContentModel).toHaveBeenCalledTimes(1);
        expect(formatResult).toBeTrue();
        expect(mergeModelFile.mergeModel).toHaveBeenCalledWith(sourceModel, pasteModel, context, {
            mergeFormat: 'none',
            mergeTable: true,
            addParagraphAfterMergedContent: undefined,
        });
        expect(context).toEqual({
            newEntities: [],
            deletedEntities: [],
            newImages: [],
            newPendingFormat: {
                backgroundColor: '',
                fontFamily: '',
                fontSize: '',
                fontWeight: '',
                italic: false,
                letterSpacing: '',
                lineHeight: '',
                strikethrough: false,
                superOrSubScriptSequence: '',
                textColor: '',
                underline: false,
            },
        });
        expect(sourceModel).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Table',
                    rows: [
                        {
                            height: 22,
                            format: {},
                            cells: [
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            blockType: 'Paragraph',
                                            segments: [
                                                {
                                                    segmentType: 'Text',
                                                    text: 'FromPaste',
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
                                    format: {
                                        useBorderBox: true,
                                        borderTop: '1px solid #ABABAB',
                                        borderRight: '1px solid #ABABAB',
                                        borderBottom: '1px solid #ABABAB',
                                        borderLeft: '1px solid #ABABAB',
                                    },
                                    spanLeft: false,
                                    spanAbove: false,
                                    isHeader: false,
                                    dataset: {},
                                },
                            ],
                        },
                    ],
                    format: { useBorderBox: true, borderCollapse: true },
                    widths: [120, 120],
                    dataset: {
                        editingInfo:
                            '{"topBorderColor":"#ABABAB","bottomBorderColor":"#ABABAB","verticalBorderColor":"#ABABAB","hasHeaderRow":false,"hasFirstColumn":false,"hasBandedRows":false,"hasBandedColumns":false,"bgColorEven":null,"bgColorOdd":"#ABABAB20","headerRowColor":"#ABABAB","tableBorderFormat":0,"verticalAlign":null}',
                    },
                },
                {
                    blockType: 'Paragraph',
                    segments: [{ segmentType: 'Br', format: {} }],
                    format: {},
                },
            ],
            format: {},
        });
    });

    it('customized merge', () => {
        const pasteModel: ContentModelDocument = createContentModelDocument();

        sourceModel = createContentModelDocument();

        const customizedMerge = jasmine.createSpy('customizedMerge');

        spyOn(mergeModelFile, 'mergeModel').and.callThrough();
        spyOn(domToContentModel, 'domToContentModel').and.returnValue(pasteModel);

        const eventResult = {
            pasteType: 'normal',
            domToModelOption: { additionalAllowedTags: [] },
            customizedMerge,
            clipboardData: mockedClipboard,
        } as any;

        mergePasteContent(editor, eventResult, true);

        expect(formatContentModel).toHaveBeenCalledTimes(1);
        expect(formatResult).toBeTrue();
        expect(mergeModelFile.mergeModel).not.toHaveBeenCalled();
        expect(customizedMerge).toHaveBeenCalledWith(sourceModel, pasteModel);
    });

    it('Apply current format', () => {
        const pasteModel: ContentModelDocument = createContentModelDocument();

        sourceModel = createContentModelDocument();

        spyOn(mergeModelFile, 'mergeModel').and.callThrough();
        spyOn(domToContentModel, 'domToContentModel').and.returnValue(pasteModel);

        const eventResult = {
            pasteType: 'mergeFormat',
            domToModelOption: { additionalAllowedTags: [] },
            clipboardData: mockedClipboard,
        } as any;

        mergePasteContent(editor, eventResult, true);

        expect(formatContentModel).toHaveBeenCalledTimes(1);
        expect(formatResult).toBeTrue();
        expect(mergeModelFile.mergeModel).toHaveBeenCalledWith(
            sourceModel,
            pasteModel,
            { newEntities: [], deletedEntities: [], newImages: [] },
            {
                mergeFormat: 'keepSourceEmphasisFormat',
                mergeTable: false,
                addParagraphAfterMergedContent: undefined,
            }
        );
    });

    it('Set pending format after merge', () => {
        const pasteModel: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [],
        };

        sourceModel = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'Text',
                            format: {
                                italic: true,
                                lineHeight: '1pt',
                            },
                            text: 'test',
                            isSelected: true,
                        },
                    ],
                },
            ],
            format: {
                fontFamily: 'Tahoma',
                fontSize: '11pt',
            },
        };
        const insertPointFormat: ContentModelSegmentFormat = {
            fontFamily: 'Arial',
        };
        const insertPoint: InsertPoint = {
            marker: {
                format: insertPointFormat,
                isSelected: true,
                segmentType: 'SelectionMarker',
            },
            paragraph: null!,
            path: [],
        };
        const mockedDomToModelContext = {
            name: 'DOMTOMODELCONTEXT',
        } as any;

        const domToContentModelSpy = spyOn(domToContentModel, 'domToContentModel').and.returnValue(
            pasteModel
        );
        const mergeModelSpy = spyOn(mergeModelFile, 'mergeModel').and.returnValue(insertPoint);
        const createDomToModelContextSpy = spyOn(
            createDomToModelContextForSanitizing,
            'createDomToModelContextForSanitizing'
        ).and.returnValue(mockedDomToModelContext);

        const mockedDomToModelOptions = 'OPTION1' as any;
        const mockedDefaultDomToModelOptions = 'OPTIONS3' as any;
        const mockedFragment = 'FRAGMENT' as any;

        (editor as any).getEnvironment = () => ({
            domToModelSettings: {
                customized: mockedDomToModelOptions,
            },
        });

        mergePasteContent(
            editor,
            {
                fragment: mockedFragment,
                domToModelOption: mockedDefaultDomToModelOptions,
                clipboardData: mockedClipboard,
            } as any,
            true
        );

        expect(formatContentModel).toHaveBeenCalledTimes(1);
        expect(formatResult).toBeTrue();
        expect(context).toEqual({
            deletedEntities: [],
            newEntities: [],
            newImages: [],
            newPendingFormat: {
                backgroundColor: '',
                fontFamily: 'Arial',
                fontSize: '11pt',
                fontWeight: '',
                italic: false,
                letterSpacing: '',
                lineHeight: '',
                strikethrough: false,
                superOrSubScriptSequence: '',
                textColor: '',
                underline: false,
            },
        });
        expect(domToContentModelSpy).toHaveBeenCalledWith(mockedFragment, mockedDomToModelContext);
        expect(mergeModelSpy).toHaveBeenCalledWith(sourceModel, pasteModel, context, {
            mergeFormat: 'none',
            mergeTable: false,
            addParagraphAfterMergedContent: undefined,
        });
        expect(createDomToModelContextSpy).toHaveBeenCalledWith(
            document,
            undefined,
            mockedDomToModelOptions,
            mockedDefaultDomToModelOptions
        );
        expect(mockedDomToModelContext.segmentFormat).toEqual({ lineHeight: '1pt' });
    });

    it('Preserve segment format after paste', () => {
        const pasteModel: ContentModelDocument = createContentModelDocument();
        const mockedFormat = {
            fontFamily: 'Arial',
        };
        sourceModel = createContentModelDocument();

        spyOn(mergeModelFile, 'mergeModel').and.returnValue({
            marker: {
                format: mockedFormat,
            },
        } as any);
        spyOn(domToContentModel, 'domToContentModel').and.returnValue(pasteModel);

        const eventResult = {
            pasteType: 'normal',
            domToModelOption: { additionalAllowedTags: [] },
            clipboardData: mockedClipboard,
            containsBlockElements: true,
        } as any;

        mergePasteContent(editor, eventResult, true);

        expect(formatContentModel).toHaveBeenCalledTimes(1);
        expect(formatResult).toBeTrue();
        expect(context).toEqual({
            newEntities: [],
            newImages: [],
            deletedEntities: [],
            newPendingFormat: {
                backgroundColor: '',
                fontFamily: 'Arial',
                fontSize: '',
                fontWeight: '',
                italic: false,
                letterSpacing: '',
                lineHeight: '',
                strikethrough: false,
                superOrSubScriptSequence: '',
                textColor: '',
                underline: false,
            },
        });
    });

    it('Merge paste content | Paste Type = normal | Make undefined text color equal to black', () => {
        const html = new DOMParser().parseFromString(template, 'text/html');
        const fragment = document.createDocumentFragment();
        moveChildNodes(fragment, html.body);

        spyOn(mergeModelFile, 'mergeModel').and.callThrough();
        spyOn(getSegmentTextFormatFile, 'getSegmentTextFormat').and.returnValue({
            fontSize: '14px',
            textColor: 'white',
        });
        sourceModel = createContentModelDocument();
        const para = createParagraph();
        const marker = createSelectionMarker();
        marker.format = {
            fontSize: '14px',
            textColor: 'white',
        };
        para.segments.push(marker);
        addBlock(sourceModel, para);

        mergePasteContent(
            editor,
            <any>{
                fragment,
                containsBlockElements: true,
                domToModelOption: <any>{},
                pasteType: 'normal',
                clipboardData: mockedClipboard,
            },
            true
        );

        expect(mergeModelFile.mergeModel).toHaveBeenCalledWith(
            sourceModel,
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'Red bold',
                                format: {
                                    fontSize: '28pt',
                                    textColor: 'rgb(192, 0, 0)',
                                    fontWeight: 'bold',
                                    lineHeight: '115%',
                                },
                            },
                            {
                                segmentType: 'Text',
                                text: '\n',
                                format: {
                                    fontSize: '14px',
                                    textColor: 'rgb(0,0,0)',
                                },
                            },
                        ],
                        format: {
                            marginTop: '1em',
                            marginBottom: '1em',
                        },
                        decorator: {
                            tagName: 'p',
                            format: {},
                        },
                    },
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'Red italic',
                                format: {
                                    fontSize: '28pt',
                                    textColor: 'rgb(192, 0, 0)',
                                    italic: true,
                                    lineHeight: '115%',
                                },
                            },
                            {
                                segmentType: 'Text',
                                text: '\n',
                                format: {
                                    fontSize: '14px',
                                    textColor: 'rgb(0,0,0)',
                                },
                            },
                        ],
                        format: {
                            marginTop: '1em',
                            marginBottom: '1em',
                        },
                        decorator: {
                            tagName: 'p',
                            format: {},
                        },
                    },
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'Red underline',
                                format: {
                                    fontSize: '28pt',
                                    textColor: 'rgb(192, 0, 0)',
                                    underline: true,
                                    lineHeight: '115%',
                                },
                            },
                            {
                                segmentType: 'Text',
                                text: '\n',
                                format: {
                                    fontSize: '14px',
                                    textColor: 'rgb(0,0,0)',
                                },
                            },
                        ],
                        format: {
                            marginTop: '1em',
                            marginBottom: '1em',
                        },
                        decorator: {
                            tagName: 'p',
                            format: {},
                        },
                    },
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'Unformatted line',
                                format: {
                                    fontSize: '28pt',
                                    textColor: 'rgb(0,0,0)',
                                    lineHeight: '115%',
                                },
                            },
                            {
                                segmentType: 'Text',
                                text: '\n',
                                format: {
                                    fontSize: '14px',
                                    textColor: 'rgb(0,0,0)',
                                },
                            },
                        ],
                        format: {
                            marginTop: '1em',
                            marginBottom: '1em',
                        },
                        decorator: {
                            tagName: 'p',
                            format: {},
                        },
                    },
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'Text underlink',
                                format: {
                                    fontSize: '28pt',
                                    textColor: 'rgb(0,0,0)',
                                    underline: true,
                                    lineHeight: '115%',
                                },
                                link: {
                                    format: {
                                        underline: true,
                                        href: 'https://github.com/microsoft/roosterjs',
                                    },
                                    dataset: {},
                                },
                            },
                            {
                                segmentType: 'Text',
                                text: '\n',
                                format: { fontSize: '14px', textColor: 'rgb(0,0,0)' },
                            },
                        ],
                        format: { marginTop: '1em', marginBottom: '1em' },
                        decorator: { tagName: 'p', format: {} },
                    },
                    {
                        blockType: 'Paragraph',
                        segments: [],
                        format: {},
                        segmentFormat: { fontSize: '14px', textColor: 'white' },
                    },
                ],
            },
            {
                newEntities: [],
                deletedEntities: [],
                newImages: [],
                newPendingFormat: {
                    backgroundColor: '',
                    fontFamily: '',
                    fontSize: '14px',
                    fontWeight: '',
                    italic: false,
                    letterSpacing: '',
                    lineHeight: '',
                    strikethrough: false,
                    superOrSubScriptSequence: '',
                    textColor: 'white',
                    underline: false,
                },
            },
            {
                mergeFormat: 'none',
                mergeTable: false,
                addParagraphAfterMergedContent: true,
            }
        );

        expect(sourceModel).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'Red bold',
                            format: {
                                fontSize: '28pt',
                                textColor: 'rgb(192, 0, 0)',
                                fontWeight: 'bold',
                                lineHeight: '115%',
                            },
                        },
                        {
                            segmentType: 'Text',
                            text: '\n',
                            format: {
                                fontSize: '14px',
                                textColor: 'rgb(0,0,0)',
                            },
                        },
                    ],
                    format: {
                        marginTop: '1em',
                        marginBottom: '1em',
                    },
                    decorator: {
                        tagName: 'p',
                        format: {},
                    },
                },
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'Red italic',
                            format: {
                                fontSize: '28pt',
                                textColor: 'rgb(192, 0, 0)',
                                italic: true,
                                lineHeight: '115%',
                            },
                        },
                        {
                            segmentType: 'Text',
                            text: '\n',
                            format: {
                                fontSize: '14px',
                                textColor: 'rgb(0,0,0)',
                            },
                        },
                    ],
                    format: {
                        marginTop: '1em',
                        marginBottom: '1em',
                    },
                    decorator: {
                        tagName: 'p',
                        format: {},
                    },
                },
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'Red underline',
                            format: {
                                fontSize: '28pt',
                                textColor: 'rgb(192, 0, 0)',
                                underline: true,
                                lineHeight: '115%',
                            },
                        },
                        {
                            segmentType: 'Text',
                            text: '\n',
                            format: {
                                fontSize: '14px',
                                textColor: 'rgb(0,0,0)',
                            },
                        },
                    ],
                    format: {
                        marginTop: '1em',
                        marginBottom: '1em',
                    },
                    decorator: {
                        tagName: 'p',
                        format: {},
                    },
                },
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'Unformatted line',
                            format: {
                                fontSize: '28pt',
                                textColor: 'rgb(0,0,0)',
                                lineHeight: '115%',
                            },
                        },
                        {
                            segmentType: 'Text',
                            text: '\n',
                            format: {
                                fontSize: '14px',
                                textColor: 'rgb(0,0,0)',
                            },
                        },
                    ],
                    format: {
                        marginTop: '1em',
                        marginBottom: '1em',
                    },
                    decorator: {
                        tagName: 'p',
                        format: {},
                    },
                },
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'Text underlink',
                            format: {
                                fontSize: '28pt',
                                textColor: 'rgb(0,0,0)',
                                underline: true,
                                lineHeight: '115%',
                            },
                            link: {
                                format: {
                                    underline: true,
                                    href: 'https://github.com/microsoft/roosterjs',
                                },
                                dataset: {},
                            },
                        },
                        {
                            segmentType: 'Text',
                            text: '\n',
                            format: { fontSize: '14px', textColor: 'rgb(0,0,0)' },
                        },
                    ],
                    format: { marginTop: '1em', marginBottom: '1em' },
                    decorator: { tagName: 'p', format: {} },
                },
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: { fontSize: '14px', textColor: 'white' },
                        },
                        {
                            segmentType: 'Br',
                            format: { fontSize: '14px', textColor: 'white' },
                        },
                    ],
                    format: {},
                    segmentFormat: { fontSize: '14px', textColor: 'white' },
                },
            ],
        });
    });

    it('Merge paste content | Paste Type = mergeFormat | Use current format', () => {
        const html = new DOMParser().parseFromString(template, 'text/html');
        const fragment = document.createDocumentFragment();
        moveChildNodes(fragment, html.body);

        spyOn(mergeModelFile, 'mergeModel').and.callThrough();
        spyOn(getSegmentTextFormatFile, 'getSegmentTextFormat').and.returnValue({
            fontSize: '14px',
            textColor: 'white',
        });
        sourceModel = createContentModelDocument();
        const para = createParagraph();
        const marker = createSelectionMarker();
        marker.format = {
            fontSize: '14px',
            textColor: 'white',
        };
        para.segments.push(marker);
        sourceModel.blocks.push(para);

        mergePasteContent(
            editor,
            {
                fragment,
                domToModelOption: <any>{},
                pasteType: 'mergeFormat',
                clipboardData: mockedClipboard,
            } as any,
            true
        );

        expect(mergeModelFile.mergeModel).toHaveBeenCalledWith(
            sourceModel,
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'Red bold',
                                format: {
                                    fontSize: '14px',
                                    textColor: 'white',
                                    fontWeight: 'bold',
                                },
                            },
                            {
                                segmentType: 'Text',
                                text: '\n',
                                format: {
                                    fontSize: '14px',
                                    textColor: 'white',
                                },
                            },
                        ],
                        format: {
                            marginTop: '1em',
                            marginBottom: '1em',
                        },
                    },
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'Red italic',
                                format: {
                                    fontSize: '14px',
                                    textColor: 'white',
                                    italic: true,
                                },
                            },
                            {
                                segmentType: 'Text',
                                text: '\n',
                                format: {
                                    fontSize: '14px',
                                    textColor: 'white',
                                },
                            },
                        ],
                        format: {
                            marginTop: '1em',
                            marginBottom: '1em',
                        },
                    },
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'Red underline',
                                format: {
                                    fontSize: '14px',
                                    textColor: 'white',
                                    underline: true,
                                },
                            },
                            {
                                segmentType: 'Text',
                                text: '\n',
                                format: {
                                    fontSize: '14px',
                                    textColor: 'white',
                                },
                            },
                        ],
                        format: {
                            marginTop: '1em',
                            marginBottom: '1em',
                        },
                    },
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'Unformatted line',
                                format: {
                                    fontSize: '14px',
                                    textColor: 'white',
                                },
                            },
                            {
                                segmentType: 'Text',
                                text: '\n',
                                format: {
                                    fontSize: '14px',
                                    textColor: 'white',
                                },
                            },
                        ],
                        format: {
                            marginTop: '1em',
                            marginBottom: '1em',
                        },
                    },
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'Text underlink',
                                format: {
                                    fontSize: '14px',
                                    textColor: 'white',
                                    underline: true,
                                },
                                link: {
                                    format: {
                                        href: 'https://github.com/microsoft/roosterjs',
                                        underline: true,
                                    },
                                    dataset: {},
                                },
                            },
                            {
                                segmentType: 'Text',
                                text: '\n',
                                format: {
                                    fontSize: '14px',
                                    textColor: 'white',
                                },
                            },
                        ],
                        format: {
                            marginTop: '1em',
                            marginBottom: '1em',
                        },
                    },
                ],
            },
            {
                newEntities: [],
                deletedEntities: [],
                newImages: [],
                newPendingFormat: {
                    backgroundColor: '',
                    fontFamily: '',
                    fontSize: '14px',
                    fontWeight: '',
                    italic: false,
                    letterSpacing: '',
                    lineHeight: '',
                    strikethrough: false,
                    superOrSubScriptSequence: '',
                    textColor: 'white',
                    underline: false,
                },
            },
            {
                mergeFormat: 'keepSourceEmphasisFormat',
                mergeTable: false,
                addParagraphAfterMergedContent: undefined,
            }
        );

        expect(sourceModel).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'Red bold',
                            format: {
                                fontSize: '14px',
                                textColor: 'white',
                                fontWeight: 'bold',
                            },
                        },
                        {
                            segmentType: 'Text',
                            text: '\n',
                            format: {
                                fontSize: '14px',
                                textColor: 'white',
                            },
                        },
                    ],
                    format: {
                        marginTop: '1em',
                        marginBottom: '1em',
                    },
                    segmentFormat: {
                        fontSize: '14px',
                        textColor: 'white',
                    },
                },
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'Red italic',
                            format: {
                                fontSize: '14px',
                                textColor: 'white',
                                italic: true,
                            },
                        },
                        {
                            segmentType: 'Text',
                            text: '\n',
                            format: {
                                fontSize: '14px',
                                textColor: 'white',
                            },
                        },
                    ],
                    format: {
                        marginTop: '1em',
                        marginBottom: '1em',
                    },
                    segmentFormat: {
                        fontSize: '14px',
                        textColor: 'white',
                    },
                },
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'Red underline',
                            format: {
                                fontSize: '14px',
                                textColor: 'white',
                                underline: true,
                            },
                        },
                        {
                            segmentType: 'Text',
                            text: '\n',
                            format: {
                                fontSize: '14px',
                                textColor: 'white',
                            },
                        },
                    ],
                    format: {
                        marginTop: '1em',
                        marginBottom: '1em',
                    },
                    segmentFormat: {
                        fontSize: '14px',
                        textColor: 'white',
                    },
                },
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'Unformatted line',
                            format: {
                                fontSize: '14px',
                                textColor: 'white',
                            },
                        },
                        {
                            segmentType: 'Text',
                            text: '\n',
                            format: {
                                fontSize: '14px',
                                textColor: 'white',
                            },
                        },
                    ],
                    format: {
                        marginTop: '1em',
                        marginBottom: '1em',
                    },
                    segmentFormat: {
                        fontSize: '14px',
                        textColor: 'white',
                    },
                },
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'Text underlink',
                            format: {
                                fontSize: '14px',
                                textColor: 'white',
                                underline: true,
                            },
                            link: {
                                format: {
                                    href: 'https://github.com/microsoft/roosterjs',
                                    underline: true,
                                },
                                dataset: {},
                            },
                        },
                        {
                            segmentType: 'Text',
                            text: '\n',
                            format: {
                                fontSize: '14px',
                                textColor: 'white',
                            },
                        },
                        {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {
                                fontSize: '14px',
                                textColor: 'white',
                            },
                        },
                    ],
                    format: {
                        marginTop: '1em',
                        marginBottom: '1em',
                    },
                    segmentFormat: {
                        fontSize: '14px',
                        textColor: 'white',
                    },
                },
            ],
        });
    });

    it('Merge paste content | Paste Type = asPlainText | Use current format', () => {
        const fragment = createPasteFragment(
            document,
            { text: 'Red bold\r\nRed italic\r\nRed underline\r\nUnformatted line\r\n' } as any,
            'asPlainText',
            document.body
        );

        spyOn(mergeModelFile, 'mergeModel').and.callThrough();
        spyOn(getSegmentTextFormatFile, 'getSegmentTextFormat').and.returnValue({
            fontSize: '14px',
            textColor: 'white',
        });
        sourceModel = createContentModelDocument();
        const para = createParagraph();
        const marker = createSelectionMarker();
        marker.format = {
            fontSize: '14px',
            textColor: 'white',
        };
        para.segments.push(marker);
        sourceModel.blocks.push(para);

        mergePasteContent(
            editor,
            {
                fragment,
                domToModelOption: <any>{},
                pasteType: 'asPlainText',
                clipboardData: mockedClipboard,
            } as any,
            true
        );

        expect(mergeModelFile.mergeModel).toHaveBeenCalledWith(
            sourceModel,
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'Red bold',
                                format: {
                                    fontSize: '14px',
                                    textColor: 'white',
                                },
                            },
                        ],
                        format: {},
                        isImplicit: true,
                        segmentFormat: {
                            fontSize: '14px',
                            textColor: 'white',
                        },
                    },
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'Red italic',
                                format: {
                                    fontSize: '14px',
                                    textColor: 'white',
                                },
                            },
                        ],
                        format: {},
                        segmentFormat: {
                            fontSize: '14px',
                            textColor: 'white',
                        },
                    },
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'Red underline',
                                format: {
                                    fontSize: '14px',
                                    textColor: 'white',
                                },
                            },
                        ],
                        format: {},
                        segmentFormat: {
                            fontSize: '14px',
                            textColor: 'white',
                        },
                    },
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'Unformatted line',
                                format: {
                                    fontSize: '14px',
                                    textColor: 'white',
                                },
                            },
                        ],
                        format: {},
                        segmentFormat: {
                            fontSize: '14px',
                            textColor: 'white',
                        },
                    },
                ],
            },
            {
                newEntities: [],
                deletedEntities: [],
                newImages: [],
                newPendingFormat: {
                    backgroundColor: '',
                    fontFamily: '',
                    fontSize: '14px',
                    fontWeight: '',
                    italic: false,
                    letterSpacing: '',
                    lineHeight: '',
                    strikethrough: false,
                    superOrSubScriptSequence: '',
                    textColor: 'white',
                    underline: false,
                },
            },
            {
                mergeFormat: 'none',
                mergeTable: false,
                addParagraphAfterMergedContent: undefined,
            }
        );

        expect(sourceModel).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'Red bold',
                            format: {
                                fontSize: '14px',
                                textColor: 'white',
                            },
                        },
                    ],
                    format: {},
                    segmentFormat: {
                        fontSize: '14px',
                        textColor: 'white',
                    },
                },
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'Red italic',
                            format: {
                                fontSize: '14px',
                                textColor: 'white',
                            },
                        },
                    ],
                    format: {},
                    segmentFormat: {
                        fontSize: '14px',
                        textColor: 'white',
                    },
                },
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'Red underline',
                            format: {
                                fontSize: '14px',
                                textColor: 'white',
                            },
                        },
                    ],
                    format: {},
                    segmentFormat: {
                        fontSize: '14px',
                        textColor: 'white',
                    },
                },
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'Unformatted line',
                            format: {
                                fontSize: '14px',
                                textColor: 'white',
                            },
                        },
                        {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {
                                fontSize: '14px',
                                textColor: 'white',
                            },
                        },
                    ],
                    format: {},
                    segmentFormat: {
                        fontSize: '14px',
                        textColor: 'white',
                    },
                },
            ],
        });
    });

    it('Merge paste content | Paste Type = normal | Paste content inline', () => {
        const html = new DOMParser().parseFromString(inlineTemplate, 'text/html');
        const fragment = document.createDocumentFragment();
        moveChildNodes(fragment, html.body);

        spyOn(mergeModelFile, 'mergeModel').and.callThrough();
        spyOn(getSegmentTextFormatFile, 'getSegmentTextFormat').and.returnValue({
            fontSize: '14px',
            textColor: 'white',
        });
        sourceModel = createContentModelDocument({
            fontFamily: 'Aptos',
            fontSize: '10pt',
            textColor: 'blue',
        });
        const para = createParagraph(undefined, undefined, {
            fontFamily: 'Aptos',
            fontSize: '10pt',
            textColor: 'blue',
        });
        const marker = createSelectionMarker();
        marker.format = {
            fontSize: '14px',
            textColor: 'white',
        };
        para.segments.push(createText('Text in source'), marker);
        addBlock(sourceModel, para);

        mergePasteContent(
            editor,
            <any>{
                fragment,
                containsBlockElements: false,
                domToModelOption: <any>{},
                pasteType: 'normal',
                clipboardData: mockedClipboard,
            },
            true
        );

        expect(mergeModelFile.mergeModel).toHaveBeenCalledWith(
            sourceModel,
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'Inline text',
                                format: {
                                    fontSize: '14px',
                                    textColor: 'rgb(0,0,0)',
                                },
                            },
                            {
                                segmentType: 'Text',
                                text: '\n',
                                format: {
                                    fontSize: '14px',
                                    textColor: 'rgb(0,0,0)',
                                },
                            },
                        ],
                        format: {},
                        isImplicit: true,
                        segmentFormat: {
                            fontSize: '14px',
                            textColor: 'rgb(0,0,0)',
                        },
                    },
                ],
            },
            {
                newEntities: [],
                deletedEntities: [],
                newImages: [],
                newPendingFormat: {
                    backgroundColor: '',
                    fontFamily: 'Aptos',
                    fontSize: '14px',
                    fontWeight: '',
                    italic: false,
                    letterSpacing: '',
                    lineHeight: '',
                    strikethrough: false,
                    superOrSubScriptSequence: '',
                    textColor: 'rgb(0,0,0)',
                    underline: false,
                },
            },
            {
                mergeFormat: 'none',
                mergeTable: false,
                addParagraphAfterMergedContent: false,
            }
        );

        expect(sourceModel).toEqual({
            blockGroupType: 'Document',
            format: { fontFamily: 'Aptos', fontSize: '10pt', textColor: 'blue' },
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'Text in source',
                            format: { fontFamily: 'Aptos', fontSize: '10pt', textColor: 'blue' },
                        },
                        {
                            segmentType: 'Text',
                            text: 'Inline text',
                            format: {
                                fontSize: '14px',
                                textColor: 'rgb(0,0,0)',
                            },
                        },
                        {
                            segmentType: 'Text',
                            text: '\n',
                            format: {
                                fontSize: '14px',
                                textColor: 'rgb(0,0,0)',
                            },
                        },
                        {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {
                                fontSize: '14px',
                                textColor: 'white',
                                fontFamily: 'Aptos',
                            },
                        },
                    ],
                    format: {},
                },
            ],
        });
    });

    it('Merge paste content | Paste Type = mergeFormat | Paste content inline', () => {
        const html = new DOMParser().parseFromString(inlineTemplate, 'text/html');
        const fragment = document.createDocumentFragment();
        moveChildNodes(fragment, html.body);

        spyOn(mergeModelFile, 'mergeModel').and.callThrough();
        spyOn(getSegmentTextFormatFile, 'getSegmentTextFormat').and.returnValue({
            fontSize: '14px',
            textColor: 'white',
        });
        sourceModel = createContentModelDocument({
            fontFamily: 'Aptos',
            fontSize: '10pt',
            textColor: 'blue',
        });
        const para = createParagraph(undefined, undefined, {
            fontFamily: 'Aptos',
            fontSize: '10pt',
            textColor: 'blue',
        });
        const marker = createSelectionMarker();
        marker.format = {
            fontSize: '14px',
            textColor: 'white',
        };
        para.segments.push(createText('Text in source'), marker);
        addBlock(sourceModel, para);

        mergePasteContent(
            editor,
            <any>{
                fragment,
                containsBlockElements: false,
                domToModelOption: <any>{},
                pasteType: 'mergeFormat',
                clipboardData: mockedClipboard,
            },
            true
        );

        expect(mergeModelFile.mergeModel).toHaveBeenCalledWith(
            sourceModel,
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'Inline text',
                                format: {
                                    fontFamily: 'Aptos',
                                    fontSize: '14px',
                                    textColor: 'white',
                                },
                            },
                            {
                                segmentType: 'Text',
                                text: '\n',
                                format: {
                                    fontFamily: 'Aptos',
                                    fontSize: '14px',
                                    textColor: 'white',
                                },
                            },
                        ],
                        format: {},
                        isImplicit: true,
                        segmentFormat: { fontSize: '14px', textColor: 'white' },
                    },
                ],
            },
            {
                newEntities: [],
                deletedEntities: [],
                newImages: [],
                newPendingFormat: {
                    backgroundColor: '',
                    fontFamily: 'Aptos',
                    fontSize: '14px',
                    fontWeight: '',
                    italic: false,
                    letterSpacing: '',
                    lineHeight: '',
                    strikethrough: false,
                    superOrSubScriptSequence: '',
                    textColor: 'white',
                    underline: false,
                },
            },
            {
                mergeFormat: 'keepSourceEmphasisFormat',
                mergeTable: false,
                addParagraphAfterMergedContent: false,
            }
        );

        expect(sourceModel).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        { segmentType: 'Text', text: 'Text in source', format: {} },
                        {
                            segmentType: 'Text',
                            text: 'Inline text',
                            format: {
                                fontFamily: 'Aptos',
                                fontSize: '14px',
                                textColor: 'white',
                            },
                        },
                        {
                            segmentType: 'Text',
                            text: '\n',
                            format: {
                                fontFamily: 'Aptos',
                                fontSize: '14px',
                                textColor: 'white',
                            },
                        },
                        {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: { fontSize: '14px', textColor: 'white' },
                        },
                    ],
                    format: {},
                    segmentFormat: { fontFamily: 'Aptos', fontSize: '10pt', textColor: 'blue' },
                },
            ],
            format: { fontFamily: 'Aptos', fontSize: '10pt', textColor: 'blue' },
        });
    });

    it('Merge paste content | Paste Type = mergeFormat | Paste content inline', () => {
        const fragment = createPasteFragment(
            document,
            { text: 'Inline text\r\n' } as any,
            'asPlainText',
            document.body
        );

        spyOn(mergeModelFile, 'mergeModel').and.callThrough();
        spyOn(getSegmentTextFormatFile, 'getSegmentTextFormat').and.returnValue({
            fontSize: '14px',
            textColor: 'white',
        });
        sourceModel = createContentModelDocument({
            fontFamily: 'Aptos',
            fontSize: '10pt',
            textColor: 'blue',
        });
        const para = createParagraph(undefined, undefined, {
            fontFamily: 'Aptos',
            fontSize: '10pt',
            textColor: 'blue',
        });
        const marker = createSelectionMarker();
        marker.format = {
            fontSize: '14px',
            textColor: 'white',
        };
        para.segments.push(createText('Text in source'), marker);
        addBlock(sourceModel, para);

        mergePasteContent(
            editor,
            <any>{
                fragment,
                containsBlockElements: false,
                domToModelOption: <any>{},
                pasteType: 'asPlainText',
                clipboardData: mockedClipboard,
            },
            true
        );

        expect(mergeModelFile.mergeModel).toHaveBeenCalledWith(
            sourceModel,
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'Inline text',
                                format: { fontSize: '14px', textColor: 'white' },
                            },
                            { segmentType: 'Br', format: { fontSize: '14px', textColor: 'white' } },
                        ],
                        format: {},
                        isImplicit: true,
                        segmentFormat: { fontSize: '14px', textColor: 'white' },
                    },
                ],
            },
            {
                newEntities: [],
                deletedEntities: [],
                newImages: [],
                newPendingFormat: {
                    backgroundColor: '',
                    fontFamily: 'Aptos',
                    fontSize: '14px',
                    fontWeight: '',
                    italic: false,
                    letterSpacing: '',
                    lineHeight: '',
                    strikethrough: false,
                    superOrSubScriptSequence: '',
                    textColor: 'white',
                    underline: false,
                },
            },
            { mergeFormat: 'none', mergeTable: false, addParagraphAfterMergedContent: false }
        );

        expect(sourceModel).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'Text in source',
                            format: {
                                fontFamily: 'Aptos',
                                fontSize: '10pt',
                                textColor: 'blue',
                            },
                        },
                        {
                            segmentType: 'Text',
                            text: 'Inline text',
                            format: { fontSize: '14px', textColor: 'white' },
                        },
                        { segmentType: 'Br', format: { fontSize: '14px', textColor: 'white' } },
                        {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {
                                fontFamily: 'Aptos',
                                fontSize: '14px',
                                textColor: 'white',
                            },
                        },
                        {
                            segmentType: 'Br',
                            format: {
                                fontFamily: 'Aptos',
                                fontSize: '14px',
                                textColor: 'white',
                            },
                        },
                    ],
                    format: {},
                },
            ],
            format: { fontFamily: 'Aptos', fontSize: '10pt', textColor: 'blue' },
        });
    });

    it('do not clone model for first paste, and keep cache', () => {
        const fragment = createPasteFragment(
            document,
            { text: 'text' } as any,
            'asPlainText',
            document.body
        );
        const div = document.createElement('div');
        const cloneModelSpy = spyOn(cloneModel, 'cloneModel').and.callThrough();

        sourceModel = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [{ segmentType: 'Br', format: {} }],
                    format: {},
                    cachedElement: div,
                },
                {
                    blockType: 'Paragraph',
                    segments: [
                        { segmentType: 'SelectionMarker', isSelected: true, format: {} },
                        { segmentType: 'Br', format: {} },
                    ],
                    format: {},
                },
            ],
            format: {},
        };

        const modelBeforePaste: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        { segmentType: 'SelectionMarker', isSelected: true, format: {} },
                        { segmentType: 'Br', format: {} },
                    ],
                    format: {},
                },
            ],
        };
        mockedClipboard = {
            modelBeforePaste,
        } as any;

        mergePasteContent(
            editor,
            <any>{
                fragment,
                containsBlockElements: false,
                domToModelOption: <any>{},
                pasteType: 'asPlainText',
                clipboardData: mockedClipboard,
            },
            true
        );

        expect(sourceModel).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [{ segmentType: 'Br', format: {} }],
                    format: {},
                    cachedElement: div,
                },
                {
                    blockType: 'Paragraph',
                    segments: [
                        { segmentType: 'Text', text: 'text', format: {} },
                        { segmentType: 'SelectionMarker', isSelected: true, format: {} },
                    ],
                    format: {},
                },
            ],
            format: {},
        });
        expect(cloneModelSpy).not.toHaveBeenCalled();
    });

    it('clone model for second paste, and clear cache', () => {
        const fragment = createPasteFragment(
            document,
            { text: 'text' } as any,
            'asPlainText',
            document.body
        );
        const div = document.createElement('div');
        const cloneModelSpy = spyOn(cloneModel, 'cloneModel').and.callThrough();

        sourceModel = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [{ segmentType: 'Br', format: {} }],
                    format: {},
                    cachedElement: div,
                },
                {
                    blockType: 'Paragraph',
                    segments: [
                        { segmentType: 'SelectionMarker', isSelected: true, format: {} },
                        { segmentType: 'Br', format: {} },
                    ],
                    format: {},
                },
            ],
            format: {},
        };

        const modelBeforePaste: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        { segmentType: 'SelectionMarker', isSelected: true, format: {} },
                        { segmentType: 'Br', format: {} },
                    ],
                    format: {},
                },
            ],
        };
        mockedClipboard = {
            modelBeforePaste,
        } as any;

        mergePasteContent(
            editor,
            <any>{
                fragment,
                containsBlockElements: false,
                domToModelOption: <any>{},
                pasteType: 'asPlainText',
                clipboardData: mockedClipboard,
            },
            false
        );

        expect(sourceModel).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        { segmentType: 'Text', text: 'text', format: {} },
                        { segmentType: 'SelectionMarker', isSelected: true, format: {} },
                    ],
                    format: {},
                    cachedElement: undefined,
                    isImplicit: undefined,
                },
            ],
            format: {},
        });
        expect(cloneModelSpy).toHaveBeenCalledTimes(1);
        expect(cloneModelSpy).toHaveBeenCalledWith(modelBeforePaste, {
            includeCachedElement: jasmine.anything(),
        } as any);
    });
    
    it('Preserve text color when pasting a link', () => {
        const html = new DOMParser().parseFromString('<a href="http://www.bing.com">www.bing.com</a>', 'text/html');
        const fragment = document.createDocumentFragment();
        moveChildNodes(fragment, html.body);

        spyOn(mergeModelFile, 'mergeModel').and.callThrough();
        sourceModel = createContentModelDocument({
            textColor: 'green', // Set document color to green
        });
        const para = createParagraph();
        const marker = createSelectionMarker();
        marker.format = {
            textColor: 'green',
        };
        para.segments.push(marker);
        addBlock(sourceModel, para);

        mergePasteContent(
            editor,
            <any>{
                fragment,
                containsBlockElements: false,
                domToModelOption: <any>{},
                pasteType: 'normal',
                clipboardData: mockedClipboard,
            },
            true
        );

        // Check that the pending format preserves the green text color even when a link is pasted
        expect(context?.newPendingFormat).toBeDefined();
        if (context?.newPendingFormat && typeof context.newPendingFormat !== 'string') {
            expect(context.newPendingFormat.textColor).toBe('green');
        }
    });
});
