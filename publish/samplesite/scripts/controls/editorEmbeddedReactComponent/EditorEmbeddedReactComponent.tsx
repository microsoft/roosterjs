import * as React from 'react';
import { ReactPluginComponentProps } from 'roosterjs-plugin-react';

const shrugs = [
    'ヽ(ー_ー )ノ',
    'ヽ(´ー` )┌',
    '┐(‘～` )┌',
    'ヽ(　￣д￣)ノ',
    '┐(￣ヘ￣)┌',
    'ヽ(￣～￣　)ノ',
    '╮(￣_￣)╭',
    'ヽ(ˇヘˇ)ノ',
    '┐(￣～￣)┌',
    '┐(︶▽︶)┌',
    '╮(￣～￣)╭',
    '¯_(ツ)_/¯',
    '┐( ´ д ` )┌',
    '╮(︶︿︶)╭',
    '┐(￣∀￣)┌',
    '┐( ˘ ､ ˘ )┌',
    '╮(︶▽︶)╭',
    '╮( ˘ ､ ˘ )╭',
    '┐( ˘_˘ )┌',
    '╮( ˘_˘ )╭',
    '┐(￣ヮ￣)┌',
];

const selectRandom = <T extends any>(a: T[]): T => {
    const index = Math.floor(Math.random() * a.length);
    return a[Math.min(index, a.length - 1)];
};

export const EditorEmbeddedReactComponent = (props: Partial<ReactPluginComponentProps>) => {
    const [shrug, setShrug] = React.useState(
        props.initialSerializedSharableState || selectRandom(shrugs)
    );

    // The actual react element is rendered off-DOM, so interaction hooks
    const mountRoot = props.inEditorMountRoot;
    React.useEffect(() => {
        if (!mountRoot) {
            return;
        }
        const callback = () => {
            setShrug(selectRandom(shrugs));
        };
        mountRoot.addEventListener('click', callback);
        return () => mountRoot.removeEventListener('click', callback);
    }, [mountRoot]);

    React.useEffect(() => {
        if (props.updateSerialziedSharableState) {
            props.updateSerialziedSharableState(shrug);
        }
    }, [shrug]);

    React.useLayoutEffect(() => {
        if (props.updateDomInEditor) {
            props.updateDomInEditor();
        }
    });

    return (
        <span
            style={{
                border: '1px solid black',
                borderRadius: 2,
                padding: 12,
                userSelect: 'none',
                msUserSelect: 'none',
                WebkitUserSelect: 'none',
                display: 'inline-block',
            }}>
            Click to randomize this shrug: <span style={{ whiteSpace: 'nowrap' }}>{shrug}</span>
        </span>
    );
};
