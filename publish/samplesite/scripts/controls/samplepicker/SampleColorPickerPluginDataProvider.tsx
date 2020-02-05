import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { default as SampleColorPicker, SampleColorPickerProps } from './SampleColorPicker';
import { Editor } from 'roosterjs-editor-core';
import { PickerDataProvider } from 'roosterjs-plugin-picker';

type LegalKeys<T> = T extends 'onClick' ? never : T;
type ComponentState = { [l in LegalKeys<keyof SampleColorPickerProps>]: SampleColorPickerProps[l] };

type InsertNodeCallback = (nodeToInsert: HTMLElement) => void;
type Color = {
    htmlColor: string;
    names: string[];
};

const pickableColors: Color[] = [
    {
        htmlColor: '#F8b195',
        names: ['pink', 'orange', 'peach'],
    },
    {
        htmlColor: '#f67280',
        names: ['pink', 'cherry', 'apple', 'red'],
    },
    {
        htmlColor: '#c06c84',
        names: ['purple', 'violet', 'purplered', 'berry'],
    },
    {
        htmlColor: '#355c7d',
        names: ['blue', 'azul', 'azure', 'dark', 'deep'],
    },
];

export default class SampleColorPickerPluginDataProvider implements PickerDataProvider {
    /**
     * For inserting a node into hte
     */
    private insertNodeCallback: InsertNodeCallback;

    private componentState: ComponentState = {
        queryString: '',
        selectedIndex: 0,
        colors: [],
        cursorX: 0,
        cursorY: 0,
    };
    private mountPoint: HTMLElement;
    private editor: Editor;

    // Function called when the plugin is intialized to register two callbacks with the data provider and a reference to the Editor.
    // The first is called in order to "commit" a new element to the editor body that isn't handled automatically by the editor plugin.
    // The second sets the isSuggesting value for situations wherethe UX needs to manipulate the suggesting state that's otherwise plugin managed.
    onInitalize(
        insertNodeCallback: InsertNodeCallback,
        setIsSuggestingCallback: (isSuggesting: boolean) => void,
        editor: Editor
    ): void {
        this.insertNodeCallback = insertNodeCallback;
        this.editor = editor;
        this.updateToQuery('', 0);

        const document = this.editor.getDocument();
        this.mountPoint = document.createElement('section');
        document.body.appendChild(this.mountPoint);
    }

    // Function called when the plugin is disposed for the data provider to do any cleanup.
    onDispose(): void {
        if (this.mountPoint) {
            this.editor.getDocument().body.removeChild(this.mountPoint);
        }
        this.mountPoint = null;
    }

    // Function called when the picker changes suggesting state (e.g. when your dialog opens)
    onIsSuggestingChanged(isSuggesting: boolean) {
        if (isSuggesting) {
            this.updateRender();
        } else {
            ReactDOM.unmountComponentAtNode(this.mountPoint);
        }
    }

    private updateToQuery(queryString: string, index: number = 0) {
        const lowerCaseQuery = queryString.toLowerCase();
        const currentSelectedColor =
            (this.componentState && this.componentState.colors[index]) || null;
        const colors = pickableColors
            .filter(color =>
                color.names.some(colorName => colorName.indexOf(lowerCaseQuery) !== -1)
            )
            .map(color => color.htmlColor);
        const newIndexOfCurrentSelectedColor = currentSelectedColor
            ? colors.indexOf(currentSelectedColor)
            : index;
        const selectedIndex = Math.max(
            0,
            Math.min(newIndexOfCurrentSelectedColor, colors.length - 1)
        );

        const rect = this.editor.getCursorRect();

        this.componentState = {
            queryString,
            selectedIndex,
            colors,
            cursorX: rect ? rect.left : 0,
            cursorY: rect ? rect.bottom : 0,
        };
    }

    private updateRender() {
        ReactDOM.render(
            <SampleColorPicker {...this.componentState} onClick={this.insertColor} />,
            this.mountPoint
        );
    }

    private insertColor = (color: string) => {
        const span = this.editor.getDocument().createElement('span');
        span.innerHTML = '⬤';
        span.style.color = color;
        this.insertNodeCallback(span);
    };

    // Function called when the query string (text after the trigger symbol) is updated.
    queryStringUpdated(queryString: string) {
        this.updateToQuery(queryString);
        this.updateRender();
    }

    // Function called when a keypress is issued that would "select" a currently highlighted option.
    selectOption() {
        const currentSelectedColor =
            (this.componentState &&
                this.componentState.colors[this.componentState.selectedIndex]) ||
            null;
        if (currentSelectedColor == null) {
            return;
        }
        this.insertColor(currentSelectedColor);
    }

    // Function called when a keypress is issued that would move the highlight on any picker UX.
    shiftHighlight(isIncrement: boolean) {
        this.updateToQuery(
            this.componentState.queryString,
            this.componentState.selectedIndex + (isIncrement ? 1 : -1)
        );
        this.updateRender();
    }

    // Function that is called when a delete command is issued.
    // Returns the intended replacement node (if partial delete) or null (if full delete)
    onRemove(nodeRemoved: Node, isBackwards: boolean): Node | null {
        return null;
    }
}
