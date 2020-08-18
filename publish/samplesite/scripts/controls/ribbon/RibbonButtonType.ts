import { FormatState, IEditor } from 'roosterjs-editor-types';

export type DropDownRenderer = (
    editor: IEditor,
    onDismiss: () => void,
    key: string,
    value: string
) => JSX.Element;

export default interface RibbonButtonType {
    title: string;
    image?: string;
    onClick: (editor: IEditor, value: string) => void;
    checked?: (format: FormatState, editor: IEditor) => boolean;
    isDisabled?: (editor: IEditor) => boolean;
    dropDownItems?: { [key: string]: string };
    dropDownRenderer?: DropDownRenderer;
    preserveOnClickAway?: boolean;
}
