import EditorCore, { GetCustomData } from '../editor/EditorCore';

const getCustomData: GetCustomData = <T>(
    core: EditorCore,
    key: string,
    getter: () => T,
    disposer?: (value: T) => void
): T => {
    return (this.core.customData[key] = this.core.customData[key] || {
        value: getter(),
        disposer: disposer,
    }).value as T;
}

export default getCustomData;