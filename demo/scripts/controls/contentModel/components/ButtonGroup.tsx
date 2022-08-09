import * as React from 'react';
import { css } from '@fluentui/react/lib/Utilities';

const styles = require('./ButtonGroup.scss');

export function ButtonGroup(props: {
    hasFormat: boolean;
    hasContent: boolean;
    bodyState: 'children' | 'format' | 'json' | 'collapsed';
    toggleVisual: () => void;
    toggleFormat: () => void;
    toggleJson: () => void;
}) {
    const { hasContent, hasFormat, bodyState, toggleFormat, toggleJson, toggleVisual } = props;

    return (
        <div>
            {hasContent ? (
                <button
                    onClick={toggleVisual}
                    title="Content"
                    className={css(styles.button, {
                        [styles.buttonChecked]: bodyState == 'children',
                    })}>
                    🔎
                </button>
            ) : null}
            {hasFormat ? (
                <button
                    onClick={toggleFormat}
                    title="Format"
                    className={css(styles.button, {
                        [styles.buttonChecked]: bodyState == 'format',
                    })}>
                    🖹
                </button>
            ) : null}
            <button
                onClick={toggleJson}
                title="JSON"
                className={css(styles.button, {
                    [styles.buttonChecked]: bodyState == 'json',
                })}>
                🅙
            </button>
        </div>
    );
}
