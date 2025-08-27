import { Preset } from './Preset';

const logicalRootPreset: Preset = {
    buttonName: 'Logical Root',
    id: 'logicalRoot',
    content: {
        blockGroupType: 'Document',
        blocks: [
            {
                segments: [
                    {
                        segmentType: 'Br',
                        format: {
                            fontFamily: 'Calibri',
                            fontSize: '11pt',
                            textColor: '#000000',
                        },
                    },
                ],
                segmentFormat: {
                    fontFamily: 'Calibri',
                    fontSize: '11pt',
                    textColor: '#000000',
                },
                blockType: 'Paragraph',
                format: {},
            },
            {
                wrapper: createEntity(),
                entityFormat: {
                    id: 'LogicalRoot_5',
                    entityType: 'LogicalRoot',
                    isReadonly: true,
                },
                blockType: 'Entity',
                format: {},
                segmentType: 'Entity',
            },
            {
                segments: [
                    {
                        isSelected: true,
                        segmentType: 'SelectionMarker',
                        format: {
                            fontFamily: 'Calibri',
                            fontSize: '11pt',
                            textColor: 'rgb(0, 0, 0)',
                        },
                    },
                    {
                        segmentType: 'Br',
                        format: {
                            fontFamily: 'Calibri',
                            fontSize: '11pt',
                            textColor: 'rgb(0, 0, 0)',
                        },
                    },
                ],
                segmentFormat: {
                    fontFamily: 'Calibri',
                    fontSize: '11pt',
                    textColor: 'rgb(0, 0, 0)',
                },
                blockType: 'Paragraph',
                format: {},
            },
            {
                wrapper: createEntity(),
                entityFormat: {
                    id: 'LogicalRoot_6',
                    entityType: 'LogicalRoot',
                    isReadonly: true,
                },
                blockType: 'Entity',
                format: {},
                segmentType: 'Entity',
            },
            {
                segments: [
                    {
                        segmentType: 'Br',
                        format: {
                            fontFamily: 'Calibri',
                            fontSize: '11pt',
                            textColor: 'rgb(0, 0, 0)',
                        },
                    },
                ],
                segmentFormat: {
                    fontFamily: 'Calibri',
                    fontSize: '11pt',
                    textColor: 'rgb(0, 0, 0)',
                },
                blockType: 'Paragraph',
                format: {},
            },
        ],
        format: {
            fontFamily: 'Calibri',
            fontSize: '11pt',
            textColor: 'rgb(0, 0, 0)',
        },
    },
};

export default logicalRootPreset;

let id = 0;
function createEntity(): HTMLElement {
    const div = document.createElement('div');
    const newId = ++id;
    div.className = `_Entity _EType_LogicalRoot _EId_LogicalRoot_${newId} _EReadonly_1`;
    div.contentEditable = 'false';
    div.style.width = '400px';
    div.style.height = '400px';
    div.style.border = '2px solid blue';
    return div;
}
