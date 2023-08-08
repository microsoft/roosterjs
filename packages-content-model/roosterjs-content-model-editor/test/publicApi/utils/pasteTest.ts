import * as addParserF from '../../../lib/editor/plugins/PastePlugin/utils/addParser';
import * as domToContentModel from 'roosterjs-content-model-dom/lib/domToModel/domToContentModel';
import * as ExcelF from '../../../lib/editor/plugins/PastePlugin/Excel/processPastedContentFromExcel';
import * as getPasteSourceF from 'roosterjs-editor-dom/lib/pasteSourceValidations/getPasteSource';
import * as mergeModelFile from '../../../lib/modelApi/common/mergeModel';
import * as pasteF from '../../../lib/publicApi/utils/paste';
import * as PPT from '../../../lib/editor/plugins/PastePlugin/PowerPoint/processPastedContentFromPowerPoint';
import * as setProcessorF from '../../../lib/editor/plugins/PastePlugin/utils/setProcessor';
import * as WacComponents from '../../../lib/editor/plugins/PastePlugin/WacComponents/processPastedContentWacComponents';
import * as WordDesktopFile from '../../../lib/editor/plugins/PastePlugin/WordDesktop/processPastedContentFromWordDesktop';
import ContentModelEditor from '../../../lib/editor/ContentModelEditor';
import ContentModelPastePlugin from '../../../lib/editor/plugins/PastePlugin/ContentModelPastePlugin';
import { ClipboardData, KnownPasteSourceType, PasteType } from 'roosterjs-editor-types';
import { ContentModelDocument } from 'roosterjs-content-model-types';
import { IContentModelEditor } from '../../../lib/publicTypes/IContentModelEditor';

let clipboardData: ClipboardData;

describe('Paste ', () => {
    let editor: IContentModelEditor;
    let addUndoSnapshot: jasmine.Spy;
    let createContentModel: jasmine.Spy;
    let setContentModel: jasmine.Spy;
    let focus: jasmine.Spy;
    let mockedModel: ContentModelDocument;
    let mockedMergeModel: ContentModelDocument;
    let getFocusedPosition: jasmine.Spy;
    let getContent: jasmine.Spy;
    let getSelectionRange: jasmine.Spy;
    let getDocument: jasmine.Spy;
    let getTrustedHTMLHandler: jasmine.Spy;
    let triggerPluginEvent: jasmine.Spy;
    let undoSnapshotResult: any;

    const mockedPos = 'POS' as any;

    let div: HTMLDivElement;

    beforeEach(() => {
        spyOn(domToContentModel, 'domToContentModel').and.callThrough();
        clipboardData = {
            types: ['image/png', 'text/html'],
            text: '',
            image: <File>null!,
            rawHtml: '<html>\r\n<body>teststring<img src="" />teststring</body>\r\n</html>',
            customValues: {},
            imageDataUri: <string>null!,
        };
        div = document.createElement('div');
        document.body.appendChild(div);
        mockedModel = ({} as any) as ContentModelDocument;
        mockedMergeModel = ({} as any) as ContentModelDocument;

        addUndoSnapshot = jasmine
            .createSpy('addUndoSnapshot')
            .and.callFake(callback => (undoSnapshotResult = callback()));
        createContentModel = jasmine.createSpy('createContentModel').and.returnValue(mockedModel);
        setContentModel = jasmine.createSpy('setContentModel');
        focus = jasmine.createSpy('focus');
        getFocusedPosition = jasmine.createSpy('getFocusedPosition').and.returnValue(mockedPos);
        getContent = jasmine.createSpy('getContent');
        getDocument = jasmine.createSpy('getDocument').and.returnValue(document);
        triggerPluginEvent = jasmine.createSpy('triggerPluginEvent').and.returnValue({
            clipboardData,
            fragment: document.createDocumentFragment(),
            sanitizingOption: {
                elementCallbacks: {},
                attributeCallbacks: {},
                cssStyleCallbacks: {},
                additionalTagReplacements: {},
                additionalAllowedAttributes: [],
                additionalAllowedCssClasses: [],
                additionalDefaultStyleValues: {},
                additionalGlobalStyleNodes: [],
                additionalPredefinedCssForElement: {},
                preserveHtmlComments: false,
                unknownTagReplacement: null,
            },
            htmlBefore: '',
            htmlAfter: '',
            htmlAttributes: {},
            domToModelOption: {},
            pasteType: PasteType.Normal,
        });
        getTrustedHTMLHandler = jasmine
            .createSpy('getTrustedHTMLHandler')
            .and.returnValue((html: string) => html);
        spyOn(mergeModelFile, 'mergeModel').and.callFake(() => (mockedModel = mockedMergeModel));

        editor = ({
            focus,
            addUndoSnapshot,
            createContentModel,
            setContentModel,
            getFocusedPosition,
            getContent,
            getSelectionRange,
            getDocument,
            getTrustedHTMLHandler,
            triggerPluginEvent,
        } as any) as IContentModelEditor;
    });

    afterEach(() => {
        document.body.removeChild(div);
        div = null!;
    });

    it('Execute', () => {
        pasteF.default(editor, clipboardData, false, false, false);

        expect(setContentModel).toHaveBeenCalled();
        expect(focus).toHaveBeenCalled();
        expect(addUndoSnapshot).toHaveBeenCalled();
        expect(getFocusedPosition).not.toHaveBeenCalled();
        expect(getContent).toHaveBeenCalled();
        expect(triggerPluginEvent).toHaveBeenCalled();
        expect(getDocument).toHaveBeenCalled();
        expect(getTrustedHTMLHandler).toHaveBeenCalled();
        expect(mockedModel).toEqual(mockedMergeModel);
        expect(clipboardData).toEqual(undoSnapshotResult);
    });

    it('Execute | As plain text', () => {
        pasteF.default(editor, clipboardData, true /* asPlainText */, false, false);

        expect(setContentModel).toHaveBeenCalled();
        expect(focus).toHaveBeenCalled();
        expect(addUndoSnapshot).toHaveBeenCalled();
        expect(getFocusedPosition).not.toHaveBeenCalled();
        expect(getContent).toHaveBeenCalled();
        expect(triggerPluginEvent).not.toHaveBeenCalled();
        expect(getDocument).toHaveBeenCalled();
        expect(getTrustedHTMLHandler).toHaveBeenCalled();
        expect(mockedModel).toEqual(mockedMergeModel);
        expect(clipboardData).toEqual(undoSnapshotResult);
    });
});

describe('paste with content model & paste plugin', () => {
    let editor: ContentModelEditor | undefined;
    let div: HTMLDivElement | undefined;

    beforeEach(() => {
        div = document.createElement('div');
        document.body.appendChild(div);
        editor = new ContentModelEditor(div, {
            plugins: [new ContentModelPastePlugin()],
        });
        spyOn(addParserF, 'default').and.callThrough();
        spyOn(setProcessorF, 'setProcessor').and.callThrough();
        clipboardData = {
            types: ['image/png', 'text/html'],
            text: '',
            image: <File>null!,
            rawHtml: '<html>\r\n<body>teststring<img src="" />teststring</body>\r\n</html>',
            customValues: {},
            imageDataUri: <string>null!,
        };
    });

    afterEach(() => {
        editor?.dispose();
        editor = undefined;
        div?.remove();
        div = undefined;
    });

    it('Word Desktop', () => {
        spyOn(getPasteSourceF, 'default').and.returnValue(KnownPasteSourceType.WordDesktop);
        spyOn(WordDesktopFile, 'processPastedContentFromWordDesktop').and.callThrough();

        pasteF.default(editor!, clipboardData);

        expect(setProcessorF.setProcessor).toHaveBeenCalledTimes(1);
        expect(addParserF.default).toHaveBeenCalledTimes(4);
        expect(WordDesktopFile.processPastedContentFromWordDesktop).toHaveBeenCalledTimes(1);
    });

    it('Word Online', () => {
        spyOn(getPasteSourceF, 'default').and.returnValue(KnownPasteSourceType.WacComponents);
        spyOn(WacComponents, 'processPastedContentWacComponents').and.callThrough();

        pasteF.default(editor!, clipboardData);

        expect(setProcessorF.setProcessor).toHaveBeenCalledTimes(4);
        expect(addParserF.default).toHaveBeenCalledTimes(5);
        expect(WacComponents.processPastedContentWacComponents).toHaveBeenCalledTimes(1);
    });

    it('Excel Online', () => {
        spyOn(getPasteSourceF, 'default').and.returnValue(KnownPasteSourceType.ExcelOnline);
        spyOn(ExcelF, 'processPastedContentFromExcel').and.callThrough();

        pasteF.default(editor!, clipboardData);

        expect(setProcessorF.setProcessor).toHaveBeenCalledTimes(0);
        expect(addParserF.default).toHaveBeenCalledTimes(2);
        expect(ExcelF.processPastedContentFromExcel).toHaveBeenCalledTimes(1);
    });

    it('Excel Desktop', () => {
        spyOn(getPasteSourceF, 'default').and.returnValue(KnownPasteSourceType.ExcelDesktop);
        spyOn(ExcelF, 'processPastedContentFromExcel').and.callThrough();

        pasteF.default(editor!, clipboardData);

        expect(setProcessorF.setProcessor).toHaveBeenCalledTimes(0);
        expect(addParserF.default).toHaveBeenCalledTimes(2);
        expect(ExcelF.processPastedContentFromExcel).toHaveBeenCalledTimes(1);
    });

    it('PowerPoint', () => {
        spyOn(getPasteSourceF, 'default').and.returnValue(KnownPasteSourceType.PowerPointDesktop);
        spyOn(PPT, 'processPastedContentFromPowerPoint').and.callThrough();

        pasteF.default(editor!, clipboardData);

        expect(setProcessorF.setProcessor).toHaveBeenCalledTimes(0);
        expect(addParserF.default).toHaveBeenCalledTimes(1);
        expect(PPT.processPastedContentFromPowerPoint).toHaveBeenCalledTimes(1);
    });

    // Plain Text
    it('Word Desktop | Plain Text', () => {
        spyOn(getPasteSourceF, 'default').and.returnValue(KnownPasteSourceType.WordDesktop);
        spyOn(WordDesktopFile, 'processPastedContentFromWordDesktop').and.callThrough();

        pasteF.default(editor!, clipboardData, true /* pasteAsText */);

        expect(setProcessorF.setProcessor).toHaveBeenCalledTimes(0);
        expect(addParserF.default).toHaveBeenCalledTimes(0);
        expect(WordDesktopFile.processPastedContentFromWordDesktop).toHaveBeenCalledTimes(0);
    });

    it('Word Online | Plain Text', () => {
        spyOn(getPasteSourceF, 'default').and.returnValue(KnownPasteSourceType.WacComponents);
        spyOn(WacComponents, 'processPastedContentWacComponents').and.callThrough();

        pasteF.default(editor!, clipboardData, true /* pasteAsText */);

        expect(setProcessorF.setProcessor).toHaveBeenCalledTimes(0);
        expect(addParserF.default).toHaveBeenCalledTimes(0);
        expect(WacComponents.processPastedContentWacComponents).toHaveBeenCalledTimes(0);
    });

    it('Excel Online | Plain Text', () => {
        spyOn(getPasteSourceF, 'default').and.returnValue(KnownPasteSourceType.ExcelOnline);
        spyOn(ExcelF, 'processPastedContentFromExcel').and.callThrough();

        pasteF.default(editor!, clipboardData, true /* pasteAsText */);

        expect(setProcessorF.setProcessor).toHaveBeenCalledTimes(0);
        expect(addParserF.default).toHaveBeenCalledTimes(0);
        expect(ExcelF.processPastedContentFromExcel).toHaveBeenCalledTimes(0);
    });

    it('Excel Desktop | Plain Text', () => {
        spyOn(getPasteSourceF, 'default').and.returnValue(KnownPasteSourceType.ExcelDesktop);
        spyOn(ExcelF, 'processPastedContentFromExcel').and.callThrough();

        pasteF.default(editor!, clipboardData, true /* pasteAsText */);

        expect(setProcessorF.setProcessor).toHaveBeenCalledTimes(0);
        expect(addParserF.default).toHaveBeenCalledTimes(0);
        expect(ExcelF.processPastedContentFromExcel).toHaveBeenCalledTimes(0);
    });

    it('PowerPoint | Plain Text', () => {
        spyOn(getPasteSourceF, 'default').and.returnValue(KnownPasteSourceType.PowerPointDesktop);
        spyOn(PPT, 'processPastedContentFromPowerPoint').and.callThrough();

        pasteF.default(editor!, clipboardData, true /* pasteAsText */);

        expect(setProcessorF.setProcessor).toHaveBeenCalledTimes(0);
        expect(addParserF.default).toHaveBeenCalledTimes(0);
        expect(PPT.processPastedContentFromPowerPoint).toHaveBeenCalledTimes(0);
    });
});
