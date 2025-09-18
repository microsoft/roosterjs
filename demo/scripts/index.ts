import { CoauthoringAgent } from 'roosterjs-content-model-plugins';
import { ContentModelDocument } from 'roosterjs-content-model-types';
import { mount as mountV2 } from './controlsV2/mainPane/MainPane';

const mainPaneDiv1 = document.getElementById('mainPane1');
const mainPaneDiv2 = document.getElementById('mainPane2');
// const mainPaneDiv3 = document.getElementById('mainPane3');

const initialModel: ContentModelDocument = {
    blockGroupType: 'Document',
    blocks: [
        {
            blockType: 'Paragraph',
            format: {},
            segments: [
                {
                    segmentType: 'Br',
                    format: {},
                },
            ],
        },
    ],
};

const coauthoringAgent = new CoauthoringAgent(initialModel);

mountV2(mainPaneDiv1, 'Alice', coauthoringAgent);
mountV2(mainPaneDiv2, 'Bob', coauthoringAgent);
// mountV2(mainPaneDiv3, 'Charlie', coauthoringAgent);
