import createEditorCore from '../../lib/editor/createEditorCore';
import { EditorCore, EditorOptions } from 'roosterjs-editor-types';

export default function createMockEditorCore(
    contentDiv: HTMLDivElement,
    options: EditorOptions
): EditorCore {
    const core = createEditorCore(contentDiv, options);
    return {
        contentDiv,
        api: core.api,
        plugins: options.plugins || [],
        autoComplete: core.autoComplete,
        darkMode: core.darkMode,
        domEvent: core.domEvent,
        edit: core.edit,
        lifecycle: core.lifecycle,
        undo: core.undo,
        pendingFormatState: core.pendingFormatState,
        entity: core.entity,
        typeAfterLink: core.typeAfterLink,
    };
}
