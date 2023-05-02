import { toggleHeadingInternal } from './toggleHeading';
import { IEditor } from 'roosterjs-editor-types';

/**
 * @deprecated use toggleHeading instead
 */
export default function toggleHeader(editor: IEditor, level: number) {
    return toggleHeadingInternal(editor, level, 'toggleHeader');
}
