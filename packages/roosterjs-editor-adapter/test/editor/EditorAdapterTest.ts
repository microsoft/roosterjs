import * as createDomToModelContext from 'roosterjs-content-model-dom/lib/domToModel/context/createDomToModelContext';
import * as domToContentModel from 'roosterjs-content-model-dom/lib/domToModel/domToContentModel';
import * as findAllEntities from 'roosterjs-content-model-core/lib/corePlugin/entity/findAllEntities';
import { ContentModelDocument, EditorContext, EditorCore } from 'roosterjs-content-model-types';
import { EditorAdapter } from '../../lib/editor/EditorAdapter';
import { EditorPlugin, PluginEventType } from 'roosterjs-editor-types';

const editorContext: EditorContext = {
    isDarkMode: false,
};

describe('EditorAdapter', () => {
    it('default format', () => {
        const div = document.createElement('div');
        const editor = new EditorAdapter(div, {
            defaultSegmentFormat: {
                fontWeight: 'bold',
                italic: true,
                underline: true,
                fontFamily: 'Arial',
                fontSize: '10pt',
                textColor: 'black',
                backgroundColor: 'white',
            },
        });

        const model = editor.getContentModelCopy('connected');

        expect(model.format).toEqual({
            fontWeight: 'bold',
            italic: true,
            underline: true,
            fontFamily: 'Arial',
            fontSize: '10pt',
            textColor: 'black',
            backgroundColor: 'white',
        });
    });

    it('getPendingFormat', () => {
        const div = document.createElement('div');
        const editor = new EditorAdapter(div);
        const core: EditorCore = (editor as any).core;
        const mockedFormat = 'FORMAT' as any;

        expect(editor.getPendingFormat()).toBeNull();

        core.format.pendingFormat = {
            format: mockedFormat,
        } as any;

        expect(editor.getPendingFormat()).toEqual(mockedFormat);
    });

    it('dispose', () => {
        const div = document.createElement('div');
        div.style.fontFamily = 'Arial';

        const editor = new EditorAdapter(div);

        expect(div.style.fontFamily).toBe('Arial');

        editor.dispose();

        expect(div.style.fontFamily).toBe('Arial');
    });
});
