import * as React from 'react';
import RoosterProps from '../type/RoosterProps';
import { divProperties, getNativeProps } from '@fluentui/react/lib/Utilities';
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

    const { focusOnInit, editorCreator, zoomScale, inDarkMode } = props;

    React.useEffect(() => {
        editor.current = (editorCreator || defaultEditorCreator)(editorDiv.current, props);

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

    const divProps = getNativeProps<React.HTMLAttributes<HTMLDivElement>>(props, divProperties);
    return <div ref={editorDiv} tabIndex={0} {...(divProps || {})}></div>;
}

function defaultEditorCreator(div: HTMLDivElement, options: EditorOptions) {
    return new Editor(div, options);
}
