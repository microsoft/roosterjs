import EditorCore, { GetCustomData } from '../interfaces/EditorCore';

/**
 * Get custom data related with this editor
 * @param core The EditorCore object
 * @param key Key of the custom data
 * @param getter Getter function. If custom data for the given key doesn't exist,
 * call this function to get one and store it.
 * @param disposer An optional disposer function to dispose this custom data when
 * dispose editor.
 */
export const getCustomData: GetCustomData = <T>(
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
