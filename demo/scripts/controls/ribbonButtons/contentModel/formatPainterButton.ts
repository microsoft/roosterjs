import { isContentModelEditor } from 'roosterjs-content-model-editor';
import { iterateSelections } from 'roosterjs-content-model-editor/lib/modelApi/selection/iterateSelections';
import { RibbonButton } from 'roosterjs-react';

/**
 * @internal
 * "Format Painter" button on the format ribbon
 */
export const formatPainterButton: RibbonButton<'formatPainter'> = {
    key: 'formatPainter',
    unlocalizedText: 'Format painter',
    iconName: 'Brush',
    onClick: editor => {
        if (isContentModelEditor(editor)) {
            const contentModel = editor.createContentModel();

            iterateSelections(
                [contentModel],
                (path, tableContext, block, segment) => console.log(segment),
                {
                    contentUnderSelectedTableCell: 'ignoreForTableOrCell',
                    contentUnderSelectedGeneralElement: 'contentOnly',
                },
                undefined,
                true
            );
        }
        return true;
    },
};
