import { createContentModelDocument, createDomToModelContext } from 'roosterjs-content-model-dom';
import type { IEditor } from 'roosterjs-content-model-types';

/**
 * @internal
 * Get ContentModelTable from a table element if it is present in the content model
 */
export function getCMTableFromTable(editor: IEditor, table: HTMLTableElement) {
    const model = createContentModelDocument();
    const context = createDomToModelContext({
        zoomScale: editor.getDOMHelper().calculateZoomScale(),
        recalculateTableSize: true,
    });

    context.elementProcessors.element(model, table, context);

    const firstBlock = model.blocks[0];

    return firstBlock?.blockType == 'Table' ? firstBlock : undefined;
}
