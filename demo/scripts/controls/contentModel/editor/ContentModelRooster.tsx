import * as React from 'react';
import { createUIUtilities, ReactEditorPlugin } from 'roosterjs-react';
import { divProperties, getNativeProps } from '@fluentui/react/lib/Utilities';
import { useTheme } from '@fluentui/react/lib/Theme';
import {
    ContentModelEditor,
    ContentModelEditorOptions,
    IContentModelEditor,
} from 'roosterjs-content-model-editor';
import type { EditorPlugin } from 'roosterjs-editor-types';

/**
 * Properties for Rooster react component
 */
export interface ContentModelRoosterProps
    extends ContentModelEditorOptions,
        React.HTMLAttributes<HTMLDivElement> {
    /**
     * Creator function used for creating the instance of roosterjs editor.
     * Use this callback when you have your own sub class of roosterjs Editor or force trigging a reset of editor
     */
    editorCreator?: (
        div: HTMLDivElement,
        options: ContentModelEditorOptions
    ) => IContentModelEditor;

    /**
     * Whether editor should get focus once it is created
     * Changing of this value after editor is created will not reset editor
     */
    focusOnInit?: boolean;
}

/**
 * Main component of react wrapper for roosterjs
 * @param props Properties of this component
 * @returns The react component
 */
export default function ContentModelRooster(props: ContentModelRoosterProps) {
    const editorDiv = React.useRef<HTMLDivElement>(null);
    const editor = React.useRef<IContentModelEditor | null>(null);
    const theme = useTheme();

    const { focusOnInit, editorCreator, zoomScale, inDarkMode, plugins } = props;

    React.useEffect(() => {
        if (plugins && editorDiv.current) {
            const uiUtilities = createUIUtilities(editorDiv.current, theme);

            plugins.forEach(plugin => {
                if (isReactEditorPlugin(plugin)) {
                    plugin.setUIUtilities(uiUtilities);
                }
            });
        }
    }, [theme, editorCreator]);

    React.useEffect(() => {
        if (editorDiv.current) {
            editor.current = (editorCreator || defaultEditorCreator)(editorDiv.current, props);
        }

        if (focusOnInit) {
            editor.current?.focus();
        }

        return () => {
            if (editor.current) {
                editor.current.dispose();
                editor.current = null;
            }
        };
    }, [editorCreator]);

    React.useEffect(() => {
        editor.current?.setDarkModeState(!!inDarkMode);
    }, [inDarkMode]);

    React.useEffect(() => {
        if (zoomScale) {
            editor.current?.setZoomScale(zoomScale);
        }
    }, [zoomScale]);

    const divProps = getNativeProps<React.HTMLAttributes<HTMLDivElement>>(props, divProperties);
    return <div ref={editorDiv} tabIndex={0} {...(divProps || {})}></div>;
}

function defaultEditorCreator(div: HTMLDivElement, options: ContentModelEditorOptions) {
    return new ContentModelEditor(div, options);
}

function isReactEditorPlugin(plugin: EditorPlugin): plugin is ReactEditorPlugin {
    return !!(plugin as ReactEditorPlugin)?.setUIUtilities;
}
