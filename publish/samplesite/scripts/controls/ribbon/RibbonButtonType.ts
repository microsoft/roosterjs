import { Editor } from 'roosterjs-editor-core';
import { FormatState } from 'roosterjs-editor-types';

export type DropDownRenderer = (
    editor: Editor,
    onDismiss: () => void,
    key: string,
    value: string
) => JSX.Element;

export default interface RibbonButtonType {
    title: string;
    image: string;
    onClick: (editor: Editor, value: string) => void;
    checked?: (format: FormatState, editor: Editor) => boolean;
    dropDownItems?: { [key: string]: string };
    dropDownRenderer?: DropDownRenderer;
    preserveOnClickAway?: boolean;
}
