import { Preset } from './Preset';

export const mixedParagraphs: Preset = {
    buttonName: 'Mixed Paragraphs',
    id: 'mixedParagraphs',
    content: {
        blockGroupType: 'Document',
        blocks: [
            {
                blockType: 'Paragraph',
                segments: [
                    {
                        segmentType: 'Text',
                        text: 'Lorem Ipsum - H1',
                        format: {},
                    },
                ],
                format: {
                    textAlign: 'center',
                },
                decorator: {
                    tagName: 'h1',
                    format: {
                        fontSize: '2em',
                        fontWeight: 'bold',
                    },
                },
            },
            {
                blockType: 'Paragraph',
                segments: [
                    {
                        segmentType: 'Text',
                        text:
                            '"Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit..." - H2',
                        format: {},
                    },
                ],
                format: {
                    textAlign: 'center',
                },
                decorator: {
                    tagName: 'h2',
                    format: {
                        fontSize: '1.5em',
                        fontWeight: 'bold',
                    },
                },
            },
            {
                blockType: 'BlockGroup',
                blockGroupType: 'FormatContainer',
                tagName: 'blockquote',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text:
                                    '"There is no one who loves pain itself, who seeks after it and wants to have it, simply because it is pain..." - Quote',
                                format: {
                                    fontFamily: 'Calibri, Helvetica, sans-serif',
                                    fontSize: '11pt',
                                    textColor: 'rgb(102, 102, 102)',
                                },
                            },
                        ],
                        format: {
                            textAlign: 'center',
                        },
                        segmentFormat: {
                            fontFamily: 'Calibri, Helvetica, sans-serif',
                            fontSize: '11pt',
                            textColor: 'rgb(102, 102, 102)',
                        },
                    },
                ],
                format: {
                    marginTop: '1em',
                    marginRight: '40px',
                    marginBottom: '1em',
                    marginLeft: '40px',
                    paddingLeft: '10px',
                    borderLeft: '3px solid rgb(200, 200, 200)',
                },
            },
            {
                blockType: 'Paragraph',
                segments: [
                    {
                        segmentType: 'Text',
                        text:
                            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus fermentum leo et faucibus congue. Nunc tristique tempor magna, rhoncus pulvinar odio maximus id. Maecenas sed leo ut elit scelerisque maximus. Donec at ligula eget est gravida hendrerit. Aenean efficitur vehicula mauris at tempor. Cras pellentesque orci eu ipsum pellentesque lacinia. Praesent varius arcu elit, at varius eros imperdiet ut. Proin cursus euismod velit, eu ultrices turpis. Ut elit lectus, efficitur quis lacus nec, fringilla fringilla magna. Etiam maximus vel dui a placerat. Etiam placerat venenatis nulla, ac iaculis neque congue at. Nulla at neque ligula. Interdum et malesuada fames ac ante ipsum primis in faucibus. Curabitur ultricies dolor eget mauris facilisis egestas. Nullam eu odio justo. - H3',
                        format: {},
                    },
                ],
                format: {},
                decorator: {
                    tagName: 'h3',
                    format: {
                        fontFamily: 'Calibri, Helvetica, sans-serif',
                        fontSize: '1.17em',
                        fontWeight: 'bold',
                    },
                },
            },
            {
                blockType: 'Paragraph',
                segments: [
                    {
                        segmentType: 'Text',
                        text:
                            'Duis ullamcorper mi tellus, eget tincidunt risus semper id. Vestibulum id euismod tellus. Sed porttitor nisl malesuada, molestie tortor eget, lobortis sem. Nunc vitae urna quis libero tincidunt pretium. Morbi rutrum ex in leo porta volutpat. Nunc aliquam augue quis lacinia venenatis. Cras pretium condimentum ornare. Morbi eget consectetur nisl, non dapibus libero. Donec odio libero, dictum sed posuere vitae, efficitur sed augue. Vestibulum ullamcorper libero urna, sit amet auctor massa sollicitudin ac. Mauris a enim ac nisl porttitor accumsan ut quis lectus. In hac habitasse platea dictumst. Vivamus dignissim suscipit egestas. ',
                        format: {},
                    },
                    {
                        segmentType: 'SelectionMarker',
                        isSelected: true,
                        format: {
                            fontFamily: 'Calibri, Helvetica, sans-serif',
                        },
                    },
                    {
                        segmentType: 'Text',
                        text: '- H4, Align right',
                        format: {},
                    },
                ],
                format: {
                    textAlign: 'end',
                },
                decorator: {
                    tagName: 'h4',
                    format: {
                        fontFamily: 'Calibri, Helvetica, sans-serif',
                        fontWeight: 'bold',
                    },
                },
            },
            {
                blockType: 'Paragraph',
                segments: [
                    {
                        segmentType: 'Text',
                        text:
                            'Donec semper semper enim vel vehicula. In justo risus, commodo vitae viverra sed, pretium ac mi. Donec tempus bibendum augue sed commodo. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam at urna tempor, auctor neque at, tincidunt purus. Pellentesque cursus sem et aliquet mollis. Donec non semper justo. - Code',
                        format: {
                            fontFamily: 'Calibri, Helvetica, sans-serif',
                        },
                        code: {
                            format: {
                                fontFamily: 'monospace',
                            },
                        },
                    },
                ],
                format: {},
                segmentFormat: {
                    fontFamily: 'Calibri, Helvetica, sans-serif',
                },
            },
            {
                blockType: 'Paragraph',
                segments: [
                    {
                        segmentType: 'Br',
                        format: {
                            fontFamily: 'Calibri, Helvetica, sans-serif',
                        },
                    },
                ],
                format: {},
                segmentFormat: {
                    fontFamily: 'Calibri, Helvetica, sans-serif',
                },
            },
            {
                blockType: 'Paragraph',
                segments: [
                    {
                        segmentType: 'Text',
                        text:
                            'Aenean sit amet risus congue, interdum augue iaculis, fermentum leo. Etiam quis suscipit ex. Nunc lobortis tempor nibh, vel auctor dui scelerisque ultrices. Cras sed consequat diam. Morbi egestas gravida consequat. Vestibulum sed metus dictum, vehicula ante lobortis, viverra purus. Aliquam ac tincidunt nunc, tincidunt maximus sem. Cras quis pellentesque neque, vitae vestibulum magna. Vestibulum elementum risus non nunc eleifend, a eleifend diam lobortis. Donec efficitur dui et suscipit venenatis. Nunc efficitur vestibulum odio sit amet dictum. - No heading, Justified',
                        format: {
                            fontFamily: 'Calibri, Helvetica, sans-serif',
                        },
                    },
                ],
                format: {
                    textAlign: 'justify',
                },
                segmentFormat: {
                    fontFamily: 'Calibri, Helvetica, sans-serif',
                },
            },
        ],
        format: {},
    },
};
