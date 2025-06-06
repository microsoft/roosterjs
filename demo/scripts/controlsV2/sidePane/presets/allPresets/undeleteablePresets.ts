import { DemoUndeletableName } from '../../../options/demoUndeletableAnchorParser';
import { Preset } from './Preset';

export const undeleteableText: Preset = {
    buttonName: 'Undeleteable Text',
    id: 'undeleteableText',
    content: {
        blockGroupType: 'Document',
        blocks: [
            {
                blockType: 'Paragraph',
                segments: [
                    {
                        segmentType: 'Text',
                        text: 'Normal text 1. ',
                        format: {},
                    },
                ],
                format: {},
            },
            {
                blockType: 'Paragraph',
                segments: [
                    {
                        segmentType: 'Text',
                        text: 'Normal text 2. ',
                        format: {},
                    },
                    {
                        segmentType: 'Text',
                        text:
                            'Undeleteable anchor, the text can be deleted, but the anchor cannot. ',
                        format: {
                            fontWeight: 'bold',
                        },
                        link: {
                            dataset: {},
                            format: {
                                name: DemoUndeletableName,
                            },
                        },
                    },
                    {
                        segmentType: 'Text',
                        text: 'Normal text 3. ',
                        format: {},
                    },
                ],
                format: {},
            },
            {
                blockType: 'Paragraph',
                segments: [
                    {
                        segmentType: 'Text',
                        text: 'Normal text 4. ',
                        format: {},
                    },
                ],
                format: {},
            },
        ],
        format: {},
    },
};
