import * as createDomToModelContext from 'roosterjs-content-model-dom/lib/domToModel/context/createDomToModelContext';
import * as createPasteEntityProcessor from '../../../lib/override/pasteEntityProcessor';
import * as createPasteGeneralProcessor from '../../../lib/override/pasteGeneralProcessor';
import * as domToContentModel from 'roosterjs-content-model-dom/lib/domToModel/domToContentModel';
import * as mergeModelFile from '../../../lib/publicApi/model/mergeModel';
import { containerSizeFormatParser } from '../../../lib/override/containerSizeFormatParser';
import { createContentModelDocument } from 'roosterjs-content-model-dom';
import { mergePasteContent } from '../../../lib/utils/paste/mergePasteContent';
import { pasteBlockEntityParser } from '../../../lib/override/pasteCopyBlockEntityParser';
import { pasteDisplayFormatParser } from '../../../lib/override/pasteDisplayFormatParser';
import { pasteTextProcessor } from '../../../lib/override/pasteTextProcessor';
import {
    ContentModelDocument,
    ContentModelFormatter,
    ContentModelSegmentFormat,
    FormatWithContentModelContext,
    FormatWithContentModelOptions,
    InsertPoint,
    StandaloneEditorCore,
} from 'roosterjs-content-model-types';

describe('mergePasteContent', () => {
    let formatResult: boolean | undefined;
    let context: FormatWithContentModelContext | undefined;
    let formatContentModel: jasmine.Spy;
    let sourceModel: ContentModelDocument;
    let core: StandaloneEditorCore;
    const mockedClipboard = 'CLIPBOARD' as any;

    beforeEach(() => {
        formatResult = undefined;
        context = undefined;

        formatContentModel = jasmine
            .createSpy('formatContentModel')
            .and.callFake(
                (
                    core: any,
                    callback: ContentModelFormatter,
                    options: FormatWithContentModelOptions
                ) => {
                    context = {
                        newEntities: [],
                        deletedEntities: [],
                        newImages: [],
                    };
                    formatResult = callback(sourceModel, context);

                    const changedData = options.getChangeData!();

                    expect(changedData).toBe(mockedClipboard);
                }
            );

        core = {
            api: {
                formatContentModel,
            },
            domToModelSettings: {},
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
        } as any;

        mergePasteContent(core, eventResult, mockedClipboard);

        expect(formatContentModel).toHaveBeenCalledTimes(1);
        expect(formatResult).toBeTrue();
        expect(mergeModelFile.mergeModel).toHaveBeenCalledWith(sourceModel, pasteModel, context, {
            mergeFormat: 'none',
            mergeTable: true,
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
        } as any;

        mergePasteContent(core, eventResult, mockedClipboard);

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
        } as any;

        mergePasteContent(core, eventResult, mockedClipboard);

        expect(formatContentModel).toHaveBeenCalledTimes(1);
        expect(formatResult).toBeTrue();
        expect(mergeModelFile.mergeModel).toHaveBeenCalledWith(
            sourceModel,
            pasteModel,
            { newEntities: [], deletedEntities: [], newImages: [] },
            {
                mergeFormat: 'keepSourceEmphasisFormat',
                mergeTable: false,
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
        const mockedPasteGeneralProcessor = 'GENERALPROCESSOR' as any;
        const mockedPasteEntityProcessor = 'ENTITYPROCESSOR' as any;
        const mockedDomToModelContext = {
            name: 'DOMTOMODELCONTEXT',
        } as any;

        const domToContentModelSpy = spyOn(domToContentModel, 'domToContentModel').and.returnValue(
            pasteModel
        );
        const mergeModelSpy = spyOn(mergeModelFile, 'mergeModel').and.returnValue(insertPoint);
        const createPasteGeneralProcessorSpy = spyOn(
            createPasteGeneralProcessor,
            'createPasteGeneralProcessor'
        ).and.returnValue(mockedPasteGeneralProcessor);
        const createPasteEntityProcessorSpy = spyOn(
            createPasteEntityProcessor,
            'createPasteEntityProcessor'
        ).and.returnValue(mockedPasteEntityProcessor);
        const createDomToModelContextSpy = spyOn(
            createDomToModelContext,
            'createDomToModelContext'
        ).and.returnValue(mockedDomToModelContext);

        const mockedDomToModelOptions = 'OPTION1' as any;
        const mockedDefaultDomToModelOptions = 'OPTIONS3' as any;
        const mockedFragment = 'FRAGMENT' as any;

        (core as any).domToModelSettings = {
            customized: mockedDomToModelOptions,
        };

        mergePasteContent(
            core,
            {
                fragment: mockedFragment,
                domToModelOption: mockedDefaultDomToModelOptions,
            } as any,
            mockedClipboard
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
        });
        expect(createPasteGeneralProcessorSpy).toHaveBeenCalledWith(mockedDefaultDomToModelOptions);
        expect(createPasteEntityProcessorSpy).toHaveBeenCalledWith(mockedDefaultDomToModelOptions);
        expect(createDomToModelContextSpy).toHaveBeenCalledWith(
            undefined,
            mockedDomToModelOptions,
            {
                processorOverride: {
                    '#text': pasteTextProcessor,
                    entity: mockedPasteEntityProcessor,
                    '*': mockedPasteGeneralProcessor,
                },
                formatParserOverride: {
                    display: pasteDisplayFormatParser,
                },
                additionalFormatParsers: {
                    container: [containerSizeFormatParser],
                    entity: [pasteBlockEntityParser],
                },
            },
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
        } as any;

        mergePasteContent(core, eventResult, mockedClipboard);

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
});
