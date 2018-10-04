import EditorCore, { GetCustomData } from '../editor/EditorCore';

const getCustomData: GetCustomData = <T>(
    core: EditorCore,
    key: string,
    getter: () => T,
    disposer?: (value: T) => void
): T => {
    return (core.customData[key] = core.customData[key] || {
        value: getter(),
        disposer,
    }).value as T;
};

export default getCustomData;
