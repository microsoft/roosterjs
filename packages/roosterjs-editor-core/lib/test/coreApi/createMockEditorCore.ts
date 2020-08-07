import createEditorCore from '../../editor/createEditorCore';
import EditorCore from '../../interfaces/EditorCore';
import EditorOptions from '../../interfaces/EditorOptions';

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
    };
}
