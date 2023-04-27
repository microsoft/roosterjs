import * as createFragmentFromClipboardData from 'roosterjs-editor-dom/lib/clipboard/createFragmentFromClipboardData';
import * as createPasteModelFile from '../../../lib/editor/coreApi/createPasteModel';
import * as domToContentModel from '../../../lib/domToModel/domToContentModel';
import ContentModelBeforePasteEvent from '../../../lib/publicTypes/event/ContentModelBeforePasteEvent';
import { ClipboardData } from 'roosterjs-editor-types';
import { ContentModelEditorCore } from '../../../lib/publicTypes/ContentModelEditorCore';

const mockedContext = 'CONTEXT' as any;

describe('createPasteModel', () => {
    let core: ContentModelEditorCore;
    let div: HTMLDivElement;
    let createEditorContext: jasmine.Spy;
    let beforePasteEvent: ContentModelBeforePasteEvent = <ContentModelBeforePasteEvent>{
        domToModelOption: {},
    };
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
        createEditorContext = jasmine
            .createSpy('createEditorContext')
            .and.returnValue(mockedContext);
        spyOn(createPasteModelFile, 'createBeforePasteEvent').and.returnValue(beforePasteEvent);
        spyOn(domToContentModel, 'default').and.callThrough();
        spyOn(createFragmentFromClipboardData, 'default').and.returnValue(fragment);

        const triggerEvent = jasmine.createSpy().and.callThrough();

        div = document.createElement('div');
        document.body.appendChild(div);
        core = ({
            contentDiv: div,
            originalApi: {
                createPasteModel: createPasteModelFile.createPasteModel,
                triggerEvent,
                createEditorContext,
            },
            api: {
                createPasteModel: createPasteModelFile.createPasteModel,
                triggerEvent,
                createEditorContext,
            },
            trustedHTMLHandler: (s: string) => s,
        } as any) as ContentModelEditorCore;
    });

    afterEach(() => {
        document.body.removeChild(div);
        div = null!;
    });

    it('Execute', () => {
        createPasteModelFile.createPasteModel(core, clipboardData, null, false, false, false);

        expect(domToContentModel.default).toHaveBeenCalledWith(
            fragment,
            mockedContext,
            beforePasteEvent.domToModelOption
        );
    });
});
