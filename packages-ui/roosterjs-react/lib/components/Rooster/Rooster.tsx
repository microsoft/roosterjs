import * as React from 'react';
import RoosterProps from './RoosterProps';
import { Editor } from 'roosterjs-editor-core';
import { EditorOptions, IEditor } from 'roosterjs-editor-types';

/**
 * Main component of react wrapper for roosterjs
 * @param props Properties of this component
 * @returns The react component
 */
export default function Rooster(props: RoosterProps) {
    const editorDiv = React.useRef<HTMLDivElement>(null);
    const editor = React.useRef<IEditor>(null);

    const { domAttributes, editorOptions, focusOnInit, editorCreator } = props;
    const { zoomScale, inDarkMode } = editorOptions || {};

    React.useEffect(() => {
        editor.current = (editorCreator || defaultEditorCreator)(editorDiv.current, editorOptions);

        if (focusOnInit) {
            editor.current.focus();
        }

        return () => {
            if (editor.current) {
                editor.current.dispose();
                editor.current = null;
            }
        };
    }, [editorCreator]);

    React.useEffect(() => {
        editor.current.setDarkModeState(!!inDarkMode);
    }, [inDarkMode]);

    React.useEffect(() => {
        editor.current.setZoomScale(zoomScale);
    }, [zoomScale]);

    return <div ref={editorDiv} tabIndex={0} {...(domAttributes || {})}></div>;
}

function defaultEditorCreator(div: HTMLDivElement, options: EditorOptions) {
    return new Editor(div, options);
}
