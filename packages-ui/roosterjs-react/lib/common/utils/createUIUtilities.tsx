import * as React from 'react';
import * as ReactDOM from 'react-dom';
import UIUtilities from '../type/UIUtilities';
import { getComputedStyles } from 'roosterjs-editor-dom';
import { PartialTheme, ThemeProvider } from '@fluentui/react/lib/Theme';
import { WindowProvider } from '@fluentui/react/lib/WindowProvider';

/**
 * Create the UI Utilities object for plugins to render additional react components
 * @param container Container DIV of editor
 * @param theme Current theme used by editor
 * @returns A UIUtilities object
 */
export default function createUIUtilities(
    container: HTMLDivElement,
    theme: PartialTheme
): UIUtilities {
    return {
        renderComponent: element => {
            const doc = container.ownerDocument;
            const div = doc.createElement('div');
            doc.body.appendChild(div);

            ReactDOM.render(
                <WindowProvider window={doc.defaultView!}>
                    <ThemeProvider theme={theme}>{element}</ThemeProvider>
                </WindowProvider>,
                div
            );

            return () => {
                ReactDOM.unmountComponentAtNode(div);
                doc.body.removeChild(div);
            };
        },
        isRightToLeft: () => {
            const dir = container && getComputedStyles(container, 'direction')[0];

            return dir == 'rtl';
        },
    };
}
