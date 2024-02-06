import { ensureFocusableParagraphForTable } from '../../modelApi/table/ensureFocusableParagraphForTable';
import {
    createSelectionMarker,
    hasMetadata,
    setParagraphNotImplicit,
} from 'roosterjs-content-model-dom';
import {
    hasSelectionInBlock,
    applyTableFormat,
    getFirstSelectedTable,
    normalizeTable,
    setSelection,
} from 'roosterjs-content-model-core';
import type {
    ContentModelTable,
    IStandaloneEditor,
    TableSelection,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function formatTableWithContentModel(
    editor: IStandaloneEditor,
    apiName: string,
    callback: (tableModel: ContentModelTable) => void,
    selectionOverride?: TableSelection
) {
    editor.formatContentModel(
        model => {
            const [tableModel, path] = getFirstSelectedTable(model);

            if (tableModel) {
                callback(tableModel);

                if (!hasSelectionInBlock(tableModel)) {
                    const paragraph = ensureFocusableParagraphForTable(model, path, tableModel);

                    if (paragraph) {
                        const marker = createSelectionMarker(model.format);

                        paragraph.segments.unshift(marker);
                        setParagraphNotImplicit(paragraph);
                        setSelection(model, marker);
                    }
                }

                normalizeTable(tableModel, model.format);

                if (hasMetadata(tableModel)) {
                    applyTableFormat(tableModel, undefined /*newFormat*/, true /*keepCellShade*/);
                }

                return true;
            } else {
                return false;
            }
        },
        {
            apiName,
            selectionOverride,
        }
    );
}
