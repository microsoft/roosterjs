import type { ContentModelEntity, EditorContext, IEditor } from 'roosterjs-content-model-types';

/**
 * Create an EditorContext for an entity
 * @param editor The editor object
 * @param entity The entity to create the context for
 * @returns The generated EditorContext for the entity
 */
export function createEditorContextForEntity(
    editor: IEditor,
    entity: ContentModelEntity
): EditorContext {
    const domHelper = editor.getDOMHelper();
    const context: EditorContext = {
        isDarkMode: editor.isDarkMode(),
        defaultFormat: { ...entity.format },
        darkColorHandler: editor.getColorManager(),
        addDelimiterForEntity: false,
        allowCacheElement: false,
        domIndexer: undefined,
        zoomScale: domHelper.calculateZoomScale(),
        experimentalFeatures: [],
    };

    if (editor.getDocument().defaultView?.getComputedStyle(entity.wrapper).direction == 'rtl') {
        context.isRootRtl = true;
    }

    return context;
}
