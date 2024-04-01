import { allTextFormats } from './textPresets';
import { ContentModelDocument } from 'roosterjs-content-model-types';
import { image64x64Black, image64x64Gradient, image64x64White } from './imagePresets';
import { mergedTableNoText, simpleTable, simpleTableWithHeader } from './tablePresets';
import { mixedParagraphs } from './paragraphPresets';
import { numberedList, simpleList } from './listPresets';

export type Preset = {
    buttonName: string;
    id: string;
    content: ContentModelDocument;
};

const wipeEditor: Preset = {
    buttonName: 'Wipe Editor',
    id: 'wipe',
    content: {
        blockGroupType: 'Document',
        blocks: [],
        format: {},
    },
};

export const allPresets: Preset[] = [
    wipeEditor,
    simpleTable,
    simpleTableWithHeader,
    mergedTableNoText,
    simpleList,
    numberedList,
    mixedParagraphs,
    allTextFormats,
    image64x64Gradient,
    image64x64Black,
    image64x64White,
];

export function getPresetModelById(id: string) {
    return allPresets.find(p => p.id === id)?.content;
}
