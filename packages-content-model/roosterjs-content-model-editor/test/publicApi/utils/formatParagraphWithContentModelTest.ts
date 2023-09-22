import * as pendingFormat from '../../../lib/modelApi/format/pendingFormat';
import { ContentModelDocument } from 'roosterjs-content-model-types';
import { formatParagraphWithContentModel } from '../../../lib/publicApi/utils/formatParagraphWithContentModel';
import { IContentModelEditor } from '../../../lib/publicTypes/IContentModelEditor';
import {
    createContentModelDocument,
    createParagraph,
    createText,
} from 'roosterjs-content-model-dom';

describe('formatParagraphWithContentModel', () => {
    let editor: IContentModelEditor;
    let addUndoSnapshot: jasmine.Spy;
    let setContentModel: jasmine.Spy;
    let triggerPluginEvent: jasmine.Spy;
    let focus: jasmine.Spy;
    let model: ContentModelDocument;

    const apiName = 'mockedApi';

    beforeEach(() => {
        addUndoSnapshot = jasmine.createSpy('addUndoSnapshot').and.callFake(callback => callback());
        setContentModel = jasmine.createSpy('setContentModel');
        triggerPluginEvent = jasmine.createSpy('triggerPluginEvent');
        focus = jasmine.createSpy('focus');

        editor = ({
            focus,
            addUndoSnapshot,
            createContentModel: () => model,
            setContentModel,
            isDarkMode: () => false,
            getCustomData: () => ({}),
            getFocusedPosition: () => 'NewPosition',
            triggerPluginEvent,
        } as any) as IContentModelEditor;
    });

    it('empty doc', () => {
        model = createContentModelDocument();

        formatParagraphWithContentModel(
            editor,
            apiName,
            paragraph => (paragraph.format.backgroundColor = 'red')
        );

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [],
        });
        expect(addUndoSnapshot).not.toHaveBeenCalled();
    });

    it('doc with selection', () => {
        model = createContentModelDocument();
        const para = createParagraph();
        const text = createText('test');

        text.isSelected = true;

        para.segments.push(text);
        model.blocks.push(para);

        formatParagraphWithContentModel(
            editor,
            apiName,
            paragraph => (paragraph.format.backgroundColor = 'red')
        );
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: { backgroundColor: 'red' },
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'test',
                            isSelected: true,
                            format: {},
                        },
                    ],
                },
            ],
        });
        expect(addUndoSnapshot).toHaveBeenCalledTimes(1);
    });

    it('Preserve pending format', () => {
        model = createContentModelDocument();
        const para = createParagraph();
        const text = createText('test');

        text.isSelected = true;

        para.segments.push(text);
        model.blocks.push(para);

        let cachedPendingFormat: any = 'PendingFormat';
        let cachedPendingPos: any = 'PendingPos';

        spyOn(pendingFormat, 'getPendingFormat').and.returnValue(cachedPendingFormat);
        spyOn(pendingFormat, 'setPendingFormat').and.callFake((_, format, pos) => {
            cachedPendingFormat = format;
            cachedPendingPos = pos;
        });
        spyOn(pendingFormat, 'clearPendingFormat').and.callFake(() => {
            cachedPendingFormat = null;
            cachedPendingPos = null;
        });

        formatParagraphWithContentModel(
            editor,
            apiName,
            paragraph => (paragraph.format.backgroundColor = 'red')
        );

        expect(cachedPendingFormat).toEqual('PendingFormat');
        expect(cachedPendingPos).toEqual('NewPosition');
    });
});
