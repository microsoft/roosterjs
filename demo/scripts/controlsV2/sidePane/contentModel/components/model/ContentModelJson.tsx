import * as React from 'react';
import { isNodeOfType } from 'roosterjs-content-model-dom';

const styles = require('./ContentModelJson.scss');

export function ContentModelJson(props: { jsonSource: Object }) {
    const { jsonSource } = props;
    const json = JSON.stringify(
        jsonSource,
        (key, value) => {
            if (typeof value == 'object' && isNode(value)) {
                if (isNodeOfType(value, 'ELEMENT_NODE')) {
                    return (
                        Object.prototype.toString.apply(value) +
                        ': ' +
                        (value.cloneNode() as HTMLElement).outerHTML
                    );
                } else {
                    return Object.prototype.toString.apply(value);
                }
            } else if (key == 'src' && typeof value == 'string') {
                return value.length > 100 ? value.substring(0, 97) + '...' : value;
            } else {
                return value;
            }
        },
        2
    );

    return <pre className={styles.json}>{json}</pre>;
}

function isNode(obj: Object): obj is Node {
    return typeof (obj as Node).nodeType == 'number';
}
