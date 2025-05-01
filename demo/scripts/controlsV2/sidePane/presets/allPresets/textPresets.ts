import { Preset } from './Preset';

export const allTextFormats: Preset = {
    buttonName: 'All Text Formats',
    id: 'allTextFormats',
    content: {
        blockGroupType: 'Document',
        blocks: [
            {
                blockType: 'Paragraph',
                segments: [
                    {
                        segmentType: 'Text',
                        text: 'The quick brown fox jumps over the lazy dog - None',
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
                        text: 'The quick brown fox jumps over the lazy dog',
                        format: {
                            fontWeight: 'bold',
                        },
                    },
                    {
                        segmentType: 'Text',
                        text: ' - Bold',
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
                        text: 'The quick brown fox jumps over the lazy dog',
                        format: {
                            italic: true,
                        },
                    },
                    {
                        segmentType: 'Text',
                        text: ' - Italic',
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
                        text: 'The quick brown fox jumps over the lazy dog',
                        format: {
                            underline: true,
                        },
                    },
                    {
                        segmentType: 'Text',
                        text: ' - Underline',
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
                        text: 'The quick brown fox jumps over the lazy dog',
                        format: {
                            strikethrough: true,
                        },
                    },
                    {
                        segmentType: 'Text',
                        text: ' - Strikethrough',
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
                        text: 'The quick ',
                        format: {
                            fontFamily:
                                '"Segoe UI", "Segoe UI Web (West European)", "Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif',
                            fontSize: '14px',
                            textColor: 'rgb(0, 0, 0)',
                        },
                    },
                    {
                        segmentType: 'Text',
                        text: 'brown fox',
                        format: {
                            fontFamily:
                                '"Segoe UI", "Segoe UI Web (West European)", "Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif',
                            fontSize: '14px',
                            textColor: 'rgb(190, 91, 23)',
                        },
                    },
                    {
                        segmentType: 'Text',
                        text: ' jumps over the ',
                        format: {
                            fontFamily:
                                '"Segoe UI", "Segoe UI Web (West European)", "Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif',
                            fontSize: '14px',
                            textColor: 'rgb(0, 0, 0)',
                        },
                    },
                    {
                        segmentType: 'Text',
                        text: 'lazy dog',
                        format: {
                            fontFamily:
                                '"Segoe UI", "Segoe UI Web (West European)", "Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif',
                            fontSize: '14px',
                            textColor: 'rgb(220, 190, 34)',
                        },
                    },
                    {
                        segmentType: 'Text',
                        text: ' - Color',
                        format: {
                            fontFamily:
                                '"Segoe UI", "Segoe UI Web (West European)", "Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif',
                            fontSize: '14px',
                            textColor: 'rgb(0, 0, 0)',
                        },
                    },
                ],
                format: {
                    textAlign: 'start',
                    textIndent: '0px',
                },
                segmentFormat: {
                    fontFamily:
                        '"Segoe UI", "Segoe UI Web (West European)", "Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif',
                    fontSize: '14px',
                    textColor: 'rgb(0, 0, 0)',
                },
            },
            {
                blockType: 'Paragraph',
                segments: [
                    {
                        segmentType: 'Text',
                        text: 'The quick brown fox jumps over the lazy dog',
                        format: {
                            fontFamily:
                                '"Segoe UI", "Segoe UI Web (West European)", "Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif',
                            fontSize: '14px',
                            textColor: 'rgb(0, 0, 0)',
                            backgroundColor: 'rgb(128, 255, 128)',
                        },
                    },
                    {
                        segmentType: 'Text',
                        text: ' - Highlight',
                        format: {
                            fontFamily:
                                '"Segoe UI", "Segoe UI Web (West European)", "Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif',
                            fontSize: '14px',
                            textColor: 'rgb(0, 0, 0)',
                        },
                    },
                ],
                format: {
                    textAlign: 'start',
                    textIndent: '0px',
                },
                segmentFormat: {
                    fontFamily:
                        '"Segoe UI", "Segoe UI Web (West European)", "Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif',
                    fontSize: '14px',
                    textColor: 'rgb(0, 0, 0)',
                },
            },
            {
                blockType: 'Paragraph',
                segments: [
                    {
                        segmentType: 'Text',
                        text: 'The quick brown fox jumps over the lazy dog',
                        format: {
                            fontFamily: 'Consolas, Courier, monospace',
                            fontSize: '14px',
                            textColor: 'rgb(0, 0, 0)',
                        },
                    },
                    {
                        segmentType: 'Text',
                        text: ' - Consolas font',
                        format: {
                            fontFamily:
                                '"Segoe UI", "Segoe UI Web (West European)", "Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif',
                            fontSize: '14px',
                            textColor: 'rgb(0, 0, 0)',
                        },
                    },
                ],
                format: {
                    textAlign: 'start',
                    textIndent: '0px',
                },
                segmentFormat: {
                    fontFamily:
                        '"Segoe UI", "Segoe UI Web (West European)", "Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif',
                    fontSize: '14px',
                    textColor: 'rgb(0, 0, 0)',
                },
            },
            {
                blockType: 'Paragraph',
                segments: [
                    {
                        segmentType: 'Text',
                        text: 'The quick ',
                        format: {
                            fontFamily: 'Consolas, Courier, monospace',
                            fontSize: '14px',
                            textColor: 'rgb(0, 0, 0)',
                            backgroundColor: 'rgb(128, 255, 128)',
                            fontWeight: 'bold',
                            italic: true,
                            underline: true,
                            strikethrough: true,
                        },
                    },
                    {
                        segmentType: 'Text',
                        text: 'brown fox',
                        format: {
                            fontFamily: 'Consolas, Courier, monospace',
                            fontSize: '14px',
                            textColor: 'rgb(190, 91, 23)',
                            backgroundColor: 'rgb(128, 255, 128)',
                            fontWeight: 'bold',
                            italic: true,
                            underline: true,
                            strikethrough: true,
                        },
                    },
                    {
                        segmentType: 'Text',
                        text: ' jumps over the ',
                        format: {
                            fontFamily: 'Consolas, Courier, monospace',
                            fontSize: '14px',
                            textColor: 'rgb(0, 0, 0)',
                            backgroundColor: 'rgb(128, 255, 128)',
                            fontWeight: 'bold',
                            italic: true,
                            underline: true,
                            strikethrough: true,
                        },
                    },
                    {
                        segmentType: 'Text',
                        text: 'lazy dog',
                        format: {
                            fontFamily: 'Consolas, Courier, monospace',
                            fontSize: '14px',
                            textColor: 'rgb(220, 190, 34)',
                            backgroundColor: 'rgb(128, 255, 128)',
                            fontWeight: 'bold',
                            italic: true,
                            underline: true,
                            strikethrough: true,
                        },
                    },
                    {
                        segmentType: 'Text',
                        text: ' - All above',
                        format: {
                            fontFamily:
                                '"Segoe UI", "Segoe UI Web (West European)", "Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif',
                            fontSize: '14px',
                            textColor: 'rgb(0, 0, 0)',
                            backgroundColor: 'rgb(255, 255, 255)',
                        },
                    },
                    {
                        segmentType: 'Br',
                        format: {},
                    },
                    {
                        segmentType: 'Text',
                        text: 'The quick brown fox jumps over the lazy dog',
                        format: {
                            superOrSubScriptSequence: 'super',
                        },
                    },
                    {
                        segmentType: 'Text',
                        text: ' - Superscript',
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
                        text: 'The quick brown fox jumps over the lazy dog',
                        format: {
                            superOrSubScriptSequence: 'sub',
                        },
                    },
                    {
                        segmentType: 'Text',
                        text: ' - Subscript',
                        format: {},
                    },
                ],
                format: {},
            },
            {
                blockType: 'Paragraph',
                segments: [
                    {
                        segmentType: 'SelectionMarker',
                        isSelected: true,
                        format: {},
                    },
                    {
                        segmentType: 'Br',
                        format: {},
                    },
                ],
                format: {},
            },
        ],
        format: {},
    },
};
