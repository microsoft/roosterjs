import { insertHorizontalLine } from 'roosterjs-content-model-api';
import type { RibbonButton } from 'roosterjs-react';

/**
 * @internal
 * "Insert horizontal line" button on the format ribbon
 */
export const insertHorizontalLineButton: RibbonButton<'buttonNameInsertHorizontalLine'> = {
    key: 'buttonNameInsertHorizontalLine',
    unlocalizedText: 'Insert horizontal line',
    iconName: 'GripperBarHorizontal',
    onClick: editor => {
        insertHorizontalLine(editor);
    },
};
