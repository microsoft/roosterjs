import * as React from 'react';
import { Editor } from 'roosterjs-editor-core';
import { EditorOptions, IEditor } from 'roosterjs-editor-types';

export interface RoosterProps extends EditorOptions, React.HTMLAttributes<HTMLDivElement> {
    onDispose?: (content: string) => void;
}

export default function Rooster(props: RoosterProps) {
    const editorDiv = React.useRef<HTMLDivElement>(null);
    const editor = React.useRef<IEditor>(null);
    const { plugins, defaultFormat, experimentalFeatures, onDispose } = props;
    const pluginKey = plugins?.map(p => (p ? p.getName() : '')).join() || '';

    React.useEffect(() => {
        if (editorDiv.current) {
            editor.current = new Editor(editorDiv.current, props);
        }

        return () => {
            if (editor.current) {
                if (onDispose) {
                    onDispose(editor.current.getContent());
                }
                editor.current.dispose();
                editor.current = null;
            }
        };
    }, [pluginKey, defaultFormat, experimentalFeatures, onDispose]);

    React.useEffect(() => {
        editor.current?.setDarkModeState(props.inDarkMode);
    }, [editor.current, props.inDarkMode]);

    React.useEffect(() => {
        if (props.zoomScale) {
            editor.current?.setZoomScale(props.zoomScale);
        }
    }, [editor.current, props.zoomScale]);
    return <div ref={editorDiv} {...props}></div>;
}
