import { EditorCore, GetCustomData } from 'roosterjs-editor-types';

export const getCustomData: GetCustomData = (
    core: EditorCore,
    key: string,
    getter?: () => any,
    disposer?: (value: any) => void
) => {
    return (core.lifecycle.customData[key] = core.lifecycle.customData[key] || {
        value: getter ? getter() : undefined,
        disposer,
    }).value;
};
