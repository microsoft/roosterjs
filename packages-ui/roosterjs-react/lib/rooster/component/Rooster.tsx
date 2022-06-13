import * as React from 'react';
import * as ReactDOM from 'react-dom';
import RoosterProps from '../type/RoosterProps';
import { divProperties, getNativeProps } from '@fluentui/react/lib/Utilities';
import { Editor } from 'roosterjs-editor-core';
import { EditorOptions, EditorPlugin, IEditor } from 'roosterjs-editor-types';
import { getComputedStyles } from 'roosterjs-editor-dom';
import { PartialTheme, ThemeProvider, useTheme } from '@fluentui/react/lib/Theme';
import { ReactEditorPlugin, UIUtilities } from '../../common/index';
import { WindowProvider } from '@fluentui/react/lib/WindowProvider';

function createUIUtilities(editorDiv: HTMLDivElement, theme: PartialTheme): UIUtilities {
    return {
        renderComponent: e => {
            const doc = editorDiv.ownerDocument;
            const div = doc.createElement('div');
            doc.body.appendChild(div);

            ReactDOM.render(
                <WindowProvider window={doc.defaultView}>
                    <ThemeProvider theme={theme}>{e}</ThemeProvider>
                </WindowProvider>,
                div
            );

            return () => {
                ReactDOM.unmountComponentAtNode(div);
                doc.body.removeChild(div);
            };
        },
        isRightToLeft: () => {
            const dir = editorDiv && getComputedStyles(editorDiv, 'direction')[0];

            return dir == 'rtl';
        },
    };
}

/**
 * Main component of react wrapper for roosterjs
 * @param props Properties of this component
 * @returns The react component
 */
export default function Rooster(props: RoosterProps) {
    const editorDiv = React.useRef<HTMLDivElement>(null);
    const editor = React.useRef<IEditor>(null);
    const theme = useTheme();

    const { focusOnInit, editorCreator, zoomScale, inDarkMode, plugins } = props;

    React.useEffect(() => {
        if (plugins) {
            const uiUtilities = createUIUtilities(editorDiv.current, theme);
            plugins.forEach(plugin => {
                if (isReactEditorPlugin(plugin)) {
                    plugin.setUIUtilities(uiUtilities);
                }
            });
        }
    }, [theme]);

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

function isReactEditorPlugin(plugin: EditorPlugin): plugin is ReactEditorPlugin {
    return !!(plugin as ReactEditorPlugin)?.setUIUtilities;
}
