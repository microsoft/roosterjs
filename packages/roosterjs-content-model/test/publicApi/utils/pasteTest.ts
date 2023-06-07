import * as createFragmentFromClipboardData from 'roosterjs-editor-dom/lib/clipboard/createFragmentFromClipboardData';
import * as domToContentModel from '../../../lib/domToModel/domToContentModel';
import * as mergeModelFile from '../../../lib/modelApi/common/mergeModel';
import paste from '../../../lib/publicApi/utils/paste';
import { ClipboardData } from 'roosterjs-editor-types';
import { ContentModelDocument } from '../../../lib/publicTypes/group/ContentModelDocument';
import { IContentModelEditor } from '../../../lib/publicTypes/IContentModelEditor';

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
    let isDarkMode: jasmine.Spy;
    let getDarkColorHandler: jasmine.Spy;
    let getDefaultFormat: jasmine.Spy;
    let undoSnapshotResult: any;

    const mockedPos = 'POS' as any;

    let div: HTMLDivElement;
    let fragment = document.createDocumentFragment();

    const clipboardData: ClipboardData = {
        types: ['image/png', 'text/html'],
        text: '',
        image: <File>null!,
        rawHtml: '<html>\r\n<body>teststring<img src="" />teststring</body>\r\n</html>',
        customValues: {},
        imageDataUri: <string>null!,
    };

    beforeEach(() => {
        spyOn(domToContentModel, 'default').and.callThrough();
        spyOn(createFragmentFromClipboardData, 'default').and.returnValue(fragment);

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
        isDarkMode = jasmine.createSpy('isDarkMode');
        getFocusedPosition = jasmine.createSpy('getFocusedPosition').and.returnValue(mockedPos);
        getContent = jasmine.createSpy('getContent');
        triggerPluginEvent = jasmine.createSpy('triggerPluginEvent');
        getSelectionRange = jasmine.createSpy('getSelectionRange');
        getDarkColorHandler = jasmine.createSpy('getDarkColorHandler');
        getDefaultFormat = jasmine.createSpy('getDefaultFormat');
        getDocument = jasmine.createSpy('getDocument').and.returnValue(document);
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
            isDarkMode,
            getDarkColorHandler,
            getDefaultFormat,
        } as any) as IContentModelEditor;
    });

    afterEach(() => {
        document.body.removeChild(div);
        div = null!;
    });

    it('Execute', () => {
        paste(editor, clipboardData, false, false, false);

        expect(setContentModel).toHaveBeenCalled();
        expect(focus).toHaveBeenCalled();
        expect(addUndoSnapshot).toHaveBeenCalled();
        expect(isDarkMode).toHaveBeenCalled();
        expect(getFocusedPosition).not.toHaveBeenCalled();
        expect(getContent).toHaveBeenCalled();
        expect(triggerPluginEvent).toHaveBeenCalled();
        expect(getSelectionRange).toHaveBeenCalled();
        expect(getDarkColorHandler).toHaveBeenCalled();
        expect(getDefaultFormat).toHaveBeenCalled();
        expect(getDocument).toHaveBeenCalled();
        expect(getTrustedHTMLHandler).toHaveBeenCalled();
        expect(mockedModel).toEqual(mockedMergeModel);
        expect(clipboardData).toEqual(undoSnapshotResult);
    });
});
