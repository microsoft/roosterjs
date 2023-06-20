import changeCapitalization from '../../../lib/publicApi/segment/changeCapitalization';
import { addSegment } from '../../../lib/modelApi/common/addSegment';
import { ContentModelDocument } from '../../../lib/publicTypes/group/ContentModelDocument';
import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createImage } from '../../../lib/modelApi/creators/createImage';
import { createText } from '../../../lib/modelApi/creators/createText';
import { segmentTestCommon } from './segmentTestCommon';

describe('changeCapitalization', () => {
    function runTest(
        model: ContentModelDocument,
        expectedModel: ContentModelDocument,
        capitalization: 'sentence' | 'lowerCase' | 'upperCase' | 'capitalize',
        callTimes: number,
        language?: string
    ) {
        segmentTestCommon(
            'changeCapitalization',
            editor => changeCapitalization(editor, capitalization, language),
            model,
            expectedModel,
            callTimes
        );
    }

    it('Empty doc', () => {
        runTest(
            createContentModelDocument(),
            {
                blockGroupType: 'Document',
                blocks: [],
            },
            'capitalize',
            0
        );
    });

    it('Doc without selection', () => {
        const doc = createContentModelDocument();
        const text = createText('test');

        addSegment(doc, text);

        runTest(
            doc,
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        isImplicit: true,
                        segments: [
                            {
                                segmentType: 'Text',
                                format: {},
                                text: 'test',
                            },
                        ],
                    },
                ],
            },
            'capitalize',
            0
        );
    });

    it('Upper case', () => {
        const doc = createContentModelDocument();
        const text = createText('test');

        text.isSelected = true;
        addSegment(doc, text);

        runTest(
            doc,
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        isImplicit: true,
                        segments: [
                            {
                                segmentType: 'Text',
                                format: {},
                                isSelected: true,
                                text: 'TEST',
                            },
                        ],
                    },
                ],
            },
            'upperCase',
            1
        );
    });

    it('Lower case', () => {
        const doc = createContentModelDocument();
        const text = createText('TEST');

        text.isSelected = true;
        addSegment(doc, text);

        runTest(
            doc,
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        isImplicit: true,
                        segments: [
                            {
                                segmentType: 'Text',
                                format: {},
                                isSelected: true,
                                text: 'test',
                            },
                        ],
                    },
                ],
            },
            'lowerCase',
            1
        );
    });

    it('Capitalize', () => {
        const doc = createContentModelDocument();
        const text = createText('aaa BBB CcC dDd');

        text.isSelected = true;
        addSegment(doc, text);

        runTest(
            doc,
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        isImplicit: true,
                        segments: [
                            {
                                segmentType: 'Text',
                                format: {},
                                isSelected: true,
                                text: 'Aaa Bbb Ccc Ddd',
                            },
                        ],
                    },
                ],
            },
            'capitalize',
            1
        );
    });

    it('Sentence', () => {
        const doc = createContentModelDocument();
        const text = createText(
            'WHAT IS IT? please. i NeEd to KNOW! another SENTENCE. example: www.contoso.com is not capitalized but. aww is.'
        );

        text.isSelected = true;
        addSegment(doc, text);

        runTest(
            doc,
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        isImplicit: true,
                        segments: [
                            {
                                segmentType: 'Text',
                                format: {},
                                isSelected: true,
                                text:
                                    'What is it? Please. I need to know! Another sentence. Example: www.contoso.com is not capitalized but. Aww is.',
                            },
                        ],
                    },
                ],
            },
            'sentence',
            1
        );
    });

    it('Image is not impacted', () => {
        const doc = createContentModelDocument();
        const text1 = createText('test1');
        const image = createImage('test');
        const text2 = createText('test2');

        text1.isSelected = true;
        image.isSelected = true;
        text2.isSelected = true;

        addSegment(doc, text1);
        addSegment(doc, image);
        addSegment(doc, text2);

        runTest(
            doc,
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        isImplicit: true,
                        segments: [
                            {
                                segmentType: 'Text',
                                format: {},
                                isSelected: true,
                                text: 'Test1',
                            },
                            {
                                segmentType: 'Image',
                                format: {},
                                isSelected: true,
                                src: 'test',
                                dataset: {},
                            },
                            {
                                segmentType: 'Text',
                                format: {},
                                isSelected: true,
                                text: 'Test2',
                            },
                        ],
                    },
                ],
            },
            'capitalize',
            1
        );
    });

    it('Specify a language 1: does not affect uncased languages even when a cased language is passed', () => {
        const doc = createContentModelDocument();
        const text = createText('לשון הקודש');

        text.isSelected = true;
        addSegment(doc, text);

        runTest(
            doc,
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        isImplicit: true,
                        segments: [
                            {
                                segmentType: 'Text',
                                format: {},
                                isSelected: true,
                                text: 'לשון הקודש',
                            },
                        ],
                    },
                ],
            },
            'capitalize',
            1,
            'es'
        );
    });

    it('Specify a language 2: Turkish undotted uppercase dotted to lowercase ı', () => {
        const doc = createContentModelDocument();
        const text = createText('ILIK ISIRGAN IŞIK');

        text.isSelected = true;
        addSegment(doc, text);

        runTest(
            doc,
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        isImplicit: true,
                        segments: [
                            {
                                segmentType: 'Text',
                                format: {},
                                isSelected: true,
                                text: 'ılık ısırgan ışık',
                            },
                        ],
                    },
                ],
            },
            'lowerCase',
            1,
            'tr'
        );
    });

    it('Specify a language 3: Turkish undotted lowercase undotted to uppercase I', () => {
        const doc = createContentModelDocument();
        const text = createText('ılık ısırgan ışık');

        text.isSelected = true;
        addSegment(doc, text);

        runTest(
            doc,
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        isImplicit: true,
                        segments: [
                            {
                                segmentType: 'Text',
                                format: {},
                                isSelected: true,
                                text: 'ILIK ISIRGAN IŞIK',
                            },
                        ],
                    },
                ],
            },
            'upperCase',
            1,
            'tr'
        );
    });

    it('Specify a language 4: Greek Σ to lowercase: σ OR ς if terminating a word', () => {
        const doc = createContentModelDocument();
        const text = createText('Σ IS A GREEK LETTER AND APPEARS IN ΟΔΥΣΣΕΥΣ.');

        text.isSelected = true;
        addSegment(doc, text);

        runTest(
            doc,
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        isImplicit: true,
                        segments: [
                            {
                                segmentType: 'Text',
                                format: {},
                                isSelected: true,
                                text: 'σ is a greek letter and appears in οδυσσευς.',
                            },
                        ],
                    },
                ],
            },
            'lowerCase',
            1,
            'el'
        );
    });

    it('Specify a language 5: German ß to uppercase', () => {
        const doc = createContentModelDocument();
        const text = createText('grüßen');

        text.isSelected = true;
        addSegment(doc, text);

        runTest(
            doc,
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        isImplicit: true,
                        segments: [
                            {
                                segmentType: 'Text',
                                format: {},
                                isSelected: true,
                                text: 'GRÜSSEN',
                            },
                        ],
                    },
                ],
            },
            'upperCase',
            1,
            'de'
        );
    });

    it('Specify a language 6: Spanish special characters', () => {
        const doc = createContentModelDocument();
        const text = createText('A sus órdenes señora');

        text.isSelected = true;
        addSegment(doc, text);

        runTest(
            doc,
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        isImplicit: true,
                        segments: [
                            {
                                segmentType: 'Text',
                                format: {},
                                isSelected: true,
                                text: 'A SUS ÓRDENES SEÑORA',
                            },
                        ],
                    },
                ],
            },
            'upperCase',
            1,
            'es'
        );
    });
});
