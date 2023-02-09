import ContentModelEditor from '../../lib/editor/ContentModelEditor';
import isContentModelEditor from '../../lib/editor/isContentModelEditor';
import { Editor } from 'roosterjs-editor-core';
import { IEditor } from 'roosterjs-editor-types';

describe('isContentModelEditor', () => {
    it('Legacy editor', () => {
        const div = document.createElement('div');
        const editor: IEditor = new Editor(div);

        const result = isContentModelEditor(editor);

        expect(result).toBeFalse();
    });

    it('Content Model editor', () => {
        const div = document.createElement('div');
        const editor: IEditor = new ContentModelEditor(div);

        const result = isContentModelEditor(editor);

        expect(result).toBeTrue();
    });
});
