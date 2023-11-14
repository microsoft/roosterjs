import { ContentModelEditor } from '../../lib/editor/ContentModelEditor';
import { ContentModelEditorCore } from '../../lib/publicTypes/ContentModelEditorCore';
import { ContentModelEditorOptions } from '../../lib/publicTypes/IContentModelEditor';
import { createEditorCore } from '../../lib/editor/createEditorCore';
import { isContentModelEditor } from '../../lib/editor/isContentModelEditor';

describe('isContentModelEditor', () => {
    it('Legacy editor', () => {
        const div = document.createElement('div');
        const option: ContentModelEditorOptions = {
            initialContent: 'test',
        };
        const mockedCreateContentModelEditorCore = jasmine
            .createSpy('createEditorCore')
            .and.callFake(
                (contentDiv, options, baseCreator) =>
                    baseCreator(contentDiv, options) as ContentModelEditorCore
            );
        const editor = new ContentModelEditor(div, mockedCreateContentModelEditorCore, option);
        const result = isContentModelEditor(editor);

        expect(mockedCreateContentModelEditorCore).toHaveBeenCalledWith(
            div,
            option,
            createEditorCore
        );
        expect(result).toBeFalse();
    });

    it('Content Model editor', () => {
        const div = document.createElement('div');
        const option: ContentModelEditorOptions = {
            initialContent: 'test',
        };
        const createContentModelEditorCoreSpy = spyOn(
            createEditorCore,
            'createEditorCore'
        ).and.callThrough();
        const editor = new ContentModelEditor(div, createEditorCore.createEditorCore, option);

        expect(createContentModelEditorCoreSpy).toHaveBeenCalledWith(div, option, createEditorCore);

        const result = isContentModelEditor(editor);

        expect(result).toBeTrue();
    });
});
