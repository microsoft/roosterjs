import EditorCore, { GetCustomData } from '../editor/EditorCore';

const getCustomData: GetCustomData = <T>(
    core: EditorCore,
    key: string,
    getter: () => T,
    disposer?: (value: T) => void
) => {
    let customData = core.customData;
    return (customData[key] = customData[key] || {
        value: getter(),
        disposer: disposer,
    }).value;
};

export default getCustomData;
