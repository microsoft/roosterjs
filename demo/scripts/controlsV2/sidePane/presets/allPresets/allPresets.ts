import { allTextFormats } from './textPresets';
import { htmlParagraphs, mixedParagraphs } from './paragraphPresets';
import { image64x64Black, image64x64Gradient, image64x64White } from './imagePresets';
import { mergedTableNoText, simpleTable, simpleTableWithHeader } from './tablePresets';
import { numberedList, simpleList } from './listPresets';
import { Preset } from './Preset';
import { undeleteableText } from './undeleteablePresets';

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
    htmlParagraphs,
    allTextFormats,
    image64x64Gradient,
    image64x64Black,
    image64x64White,
    undeleteableText,
];

export function getPresetModelById(id: string) {
    return allPresets.find(p => p.id === id)?.content;
}
