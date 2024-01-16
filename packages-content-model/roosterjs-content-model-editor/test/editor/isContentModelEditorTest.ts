import { ContentModelEditor } from '../../lib/editor/ContentModelEditor';
import { Editor } from 'roosterjs-editor-core';
import { isContentModelEditor } from '../../lib/editor/isContentModelEditor';

describe('isContentModelEditor', () => {
    it('Legacy editor', () => {
        const div = document.createElement('div');
        const editor = new Editor(div);
        const result = isContentModelEditor(editor);

        expect(result).toBeFalse();
    });

    it('Content Model editor', () => {
        const div = document.createElement('div');
        const editor = new ContentModelEditor(div);
        const result = isContentModelEditor(editor);

        expect(result).toBeTrue();
    });
});
