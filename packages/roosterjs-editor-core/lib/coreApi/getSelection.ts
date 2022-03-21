import { EditorCore, GetSelection } from 'roosterjs-editor-types';

/**
 * @internal
 * Get current or cached selection range
 * @param core The EditorCore object
 * @param tryGetFromCache Set to true to retrieve the selection range from cache if editor doesn't own the focus now
 * @returns A Range object of the selection range
 */
export const getSelection: GetSelection = (core: EditorCore) => {
    return (core.documentRoot as Document).getSelection();
};
