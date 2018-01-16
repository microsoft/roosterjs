export interface KnownEditorCustomDataTypeMap {
    PasteDiv: HTMLElement;
}

export interface CustomDataSet {
    [Key: string]: {
        value: any;
        disposer: (value: any) => void;
    };
}

export function getCustomData<Key extends keyof KnownEditorCustomDataTypeMap>(
    customDataSet: CustomDataSet,
    key: Key,
    getter: () => KnownEditorCustomDataTypeMap[Key],
    disposer?: (value: KnownEditorCustomDataTypeMap[Key]) => void
): KnownEditorCustomDataTypeMap[Key] {
    if (!customDataSet[key]) {
        customDataSet[key] = {
            value: getter(),
            disposer: disposer,
        };
    }
    return <KnownEditorCustomDataTypeMap[Key]>customDataSet[key].value;
}

export function disposeCustomData(customDataSet: CustomDataSet) {
    let keys = Object.keys(customDataSet);
    for (let key of keys) {
        let data = customDataSet[key];
        if (data.disposer) {
            data.disposer(data.value);
        }
        delete customDataSet[key];
    }
}
