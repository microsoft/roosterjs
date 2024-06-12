import * as React from 'react';
import { createUIUtilities } from '../../common/index';
import { divProperties, getNativeProps } from '@fluentui/react/lib/Utilities';
import { Editor } from 'roosterjs-content-model-core';
import { useTheme } from '@fluentui/react/lib/Theme';
import type { RoosterProps } from '../type/RoosterProps';
import type { ReactEditorPlugin } from '../../common/index';
import type { EditorPlugin, IEditor, EditorOptions } from 'roosterjs-content-model-types';

/**
 * Main component of react wrapper for roosterjs
 * @param props Properties of this component
 * @returns The react component
 */
export function Rooster(props: RoosterProps) {
    const editorDiv = React.useRef<HTMLDivElement>(null);
    const editor = React.useRef<IEditor | null>(null);
    const theme = useTheme();

    const { focusOnInit, editorCreator, inDarkMode, plugins } = props;

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

    const divProps = getNativeProps<React.HTMLAttributes<HTMLDivElement>>(props, divProperties);
    return (
        <div
            ref={editorDiv}
            tabIndex={0}
            role="textbox"
            aria-multiline="true"
            {...(divProps || {})}></div>
    );
}

function defaultEditorCreator(div: HTMLDivElement, options: EditorOptions) {
    return new Editor(div, options);
}

function isReactEditorPlugin(plugin: EditorPlugin): plugin is ReactEditorPlugin {
    return !!(plugin as ReactEditorPlugin)?.setUIUtilities;
}
