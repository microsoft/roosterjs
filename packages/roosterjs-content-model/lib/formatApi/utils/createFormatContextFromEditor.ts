import { FormatContext } from '../../formatHandlers/FormatContext';
import { IEditor } from 'roosterjs-editor-types';

// TODO: Let editor provide Content Model Context
export function createFormatContextFromEditor(
    editor: IEditor,
    isRightToLeft: boolean
): FormatContext {
    const isDarkMode = editor.isDarkMode();
    const zoomScale = editor.getZoomScale();

    return {
        isDarkMode,
        zoomScale,
        isRightToLeft,
        isInSelection: false,
    };
}
