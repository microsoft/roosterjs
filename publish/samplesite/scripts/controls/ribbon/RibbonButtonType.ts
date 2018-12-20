import { Editor } from 'roosterjs-editor-core';

export type DropDownRenderer = (
    editor: Editor,
    onDismiss: () => void,
    key: string,
    value: string,
) => JSX.Element;

export default interface RibbonButtonType {
    title: string;
    image: string;
    onClick: (editor: Editor, value: string) => void;
    dropDownItems?: { [key: string]: string };
    dropDownRenderer?: DropDownRenderer;
    preserveOnClickAway?: boolean;
}
