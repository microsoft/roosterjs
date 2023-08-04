import { ContentModelDocument } from 'roosterjs-content-model-types';
import { insertEntityModel } from '../../../lib/modelApi/entity/insertEntityModel';
import { InsertEntityPosition } from '../../../lib/publicTypes/parameter/InsertEntityOptions';
import {
    createBr,
    createContentModelDocument,
    createDivider,
    createEntity,
    createParagraph,
    createSelectionMarker,
    createText,
} from 'roosterjs-content-model-dom';

const Entity = 'Entity' as any;

function runTestGlobal(
    model: ContentModelDocument,
    pos: InsertEntityPosition,
    expectedResult: ContentModelDocument,
    isBlock: boolean,
    focusAfterEntity: boolean
) {
    insertEntityModel(model, Entity, pos, isBlock, focusAfterEntity);

    expect(model).toEqual(expectedResult, pos);
}

describe('insertEntityModel, block element, not focus after entity', () => {
    const marker = createSelectionMarker();

    function runTest(
        createModel: () => ContentModelDocument,
        topResult: ContentModelDocument,
        bottomResult: ContentModelDocument,
        focusResult: ContentModelDocument,
        rootResult: ContentModelDocument
    ) {
        runTestGlobal(createModel(), 'begin', topResult, true, false);
        runTestGlobal(createModel(), 'end', bottomResult, true, false);
        runTestGlobal(createModel(), 'focus', focusResult, true, false);
        runTestGlobal(createModel(), 'root', rootResult, true, false);
    }

    it('no selection', () => {
        const br = createBr();

        runTest(
            () => {
                const model = createContentModelDocument();
                const para = createParagraph();

                model.blocks.push(para);

                return model;
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    Entity,
                    {
                        blockType: 'Paragraph',
                        segments: [],
                        format: {},
                    },
                ],
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [],
                        format: {},
                    },
                    Entity,
                    {
                        blockType: 'Paragraph',
                        segments: [br],
                        format: {},
                    },
                ],
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [],
                        format: {},
                    },
                ],
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [],
                        format: {},
                    },
                ],
            }
        );
    });

    it('collapsed selection', () => {
        const txt1 = createText('test1');
        const txt2 = createText('test2');
        const br = createBr();

        runTest(
            () => {
                const model = createContentModelDocument();
                const para = createParagraph();

                para.segments.push(txt1, marker, txt2);
                model.blocks.push(para);

                return model;
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    Entity,
                    {
                        blockType: 'Paragraph',
                        segments: [txt1, marker, txt2],
                        format: {},
                    },
                ],
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [txt1, marker, txt2],
                        format: {},
                    },
                    Entity,
                    {
                        blockType: 'Paragraph',
                        segments: [br],
                        format: {},
                    },
                ],
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [txt1, marker, txt2],
                        format: {},
                    },
                    Entity,
                    {
                        blockType: 'Paragraph',
                        segments: [br],
                        format: {},
                    },
                ],
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [txt1, marker, txt2],
                        format: {},
                    },
                    Entity,
                    {
                        blockType: 'Paragraph',
                        segments: [br],
                        format: {},
                    },
                ],
            }
        );
    });

    it('Expanded selection', () => {
        const txt1 = createText('test1');
        const txt2 = createText('test2');
        const br = createBr();

        txt2.isSelected = true;

        runTest(
            () => {
                const model = createContentModelDocument();
                const para = createParagraph();

                para.segments.push(txt1, txt2);
                model.blocks.push(para);

                return model;
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    Entity,
                    {
                        blockType: 'Paragraph',
                        segments: [txt1, txt2],
                        format: {},
                    },
                ],
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [txt1, txt2],
                        format: {},
                    },
                    Entity,
                    {
                        blockType: 'Paragraph',
                        segments: [br],
                        format: {},
                    },
                ],
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [txt1, marker],
                        format: {},
                    },
                    Entity,
                    {
                        blockType: 'Paragraph',
                        segments: [br],
                        format: {},
                    },
                ],
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [txt1, marker],
                        format: {},
                    },
                    Entity,
                    {
                        blockType: 'Paragraph',
                        segments: [br],
                        format: {},
                    },
                ],
            }
        );
    });

    it('Before another paragraph', () => {
        const br = createBr();

        runTest(
            () => {
                const model = createContentModelDocument();
                const para1 = createParagraph();
                const para2 = createParagraph();

                para1.segments.push(marker);
                model.blocks.push(para1, para2);

                return model;
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    Entity,
                    {
                        blockType: 'Paragraph',
                        segments: [marker],
                        format: {},
                    },
                    {
                        blockType: 'Paragraph',
                        segments: [],
                        format: {},
                    },
                ],
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [marker],
                        format: {},
                    },
                    {
                        blockType: 'Paragraph',
                        segments: [],
                        format: {},
                    },
                    Entity,
                    {
                        blockType: 'Paragraph',
                        segments: [br],
                        format: {},
                    },
                ],
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [marker],
                        format: {},
                    },
                    Entity,
                    {
                        blockType: 'Paragraph',
                        segments: [],
                        format: {},
                    },
                ],
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [marker],
                        format: {},
                    },
                    Entity,
                    {
                        blockType: 'Paragraph',
                        segments: [],
                        format: {},
                    },
                ],
            }
        );
    });

    it('Before another divider', () => {
        const divider = createDivider('hr');
        const br = createBr();

        runTest(
            () => {
                const model = createContentModelDocument();
                const para1 = createParagraph();

                para1.segments.push(marker);
                model.blocks.push(para1, divider);

                return model;
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    Entity,
                    {
                        blockType: 'Paragraph',
                        segments: [marker],
                        format: {},
                    },
                    divider,
                ],
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [marker],
                        format: {},
                    },
                    divider,
                    Entity,
                    {
                        blockType: 'Paragraph',
                        segments: [br],
                        format: {},
                    },
                ],
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [marker],
                        format: {},
                    },
                    Entity,
                    divider,
                ],
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [marker],
                        format: {},
                    },
                    Entity,
                    divider,
                ],
            }
        );
    });

    it('Before another entity', () => {
        const entity2 = createEntity({} as any, true);
        const br = createBr();

        runTest(
            () => {
                const model = createContentModelDocument();
                const para1 = createParagraph();

                para1.segments.push(marker);
                model.blocks.push(para1, entity2);

                return model;
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    Entity,
                    {
                        blockType: 'Paragraph',
                        segments: [marker],
                        format: {},
                    },
                    entity2,
                ],
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [marker],
                        format: {},
                    },
                    entity2,
                    Entity,
                    {
                        blockType: 'Paragraph',
                        segments: [br],
                        format: {},
                    },
                ],
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [marker],
                        format: {},
                    },
                    Entity,
                    {
                        blockType: 'Paragraph',
                        segments: [br],
                        format: {},
                    },
                    entity2,
                ],
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [marker],
                        format: {},
                    },
                    Entity,
                    {
                        blockType: 'Paragraph',
                        segments: [br],
                        format: {},
                    },
                    entity2,
                ],
            }
        );
    });

    it('With default format', () => {
        const txt1 = createText('test1');
        const txt2 = createText('test2');
        const format = {
            fontSize: '10px',
        };
        const br = createBr(format);

        runTest(
            () => {
                const model = createContentModelDocument(format);
                const para = createParagraph();

                para.segments.push(txt1, marker, txt2);
                model.blocks.push(para);

                return model;
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    Entity,
                    {
                        blockType: 'Paragraph',
                        segments: [txt1, marker, txt2],
                        format: {},
                    },
                ],
                format,
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [txt1, marker, txt2],
                        format: {},
                    },
                    Entity,
                    {
                        blockType: 'Paragraph',
                        segments: [br],
                        segmentFormat: format,
                        format: {},
                    },
                ],
                format,
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [txt1, marker, txt2],
                        format: {},
                    },
                    Entity,
                    {
                        blockType: 'Paragraph',
                        segments: [br],
                        segmentFormat: format,
                        format: {},
                    },
                ],
                format,
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [txt1, marker, txt2],
                        format: {},
                    },
                    Entity,
                    {
                        blockType: 'Paragraph',
                        segments: [br],
                        segmentFormat: format,
                        format: {},
                    },
                ],
                format,
            }
        );
    });
});

describe('insertEntityModel, block element, focus after entity', () => {
    const br = createBr();
    const marker = createSelectionMarker();

    function runTest(
        createModel: () => ContentModelDocument,
        topResult: ContentModelDocument,
        bottomResult: ContentModelDocument,
        focusResult: ContentModelDocument,
        rootResult: ContentModelDocument
    ) {
        runTestGlobal(createModel(), 'begin', topResult, true, true);
        runTestGlobal(createModel(), 'end', bottomResult, true, true);
        runTestGlobal(createModel(), 'focus', focusResult, true, true);
        runTestGlobal(createModel(), 'root', rootResult, true, true);
    }

    it('no selection', () => {
        runTest(
            () => {
                const model = createContentModelDocument();
                const para = createParagraph();

                model.blocks.push(para);

                return model;
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    Entity,
                    {
                        blockType: 'Paragraph',
                        segments: [marker],
                        format: {},
                    },
                ],
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [],
                        format: {},
                    },
                    Entity,
                    {
                        blockType: 'Paragraph',
                        segments: [marker, br],
                        format: {},
                    },
                ],
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [],
                        format: {},
                    },
                ],
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [],
                        format: {},
                    },
                ],
            }
        );
    });

    it('collapsed selection', () => {
        const txt1 = createText('test1');
        const txt2 = createText('test2');

        runTest(
            () => {
                const model = createContentModelDocument();
                const para = createParagraph();

                para.segments.push(txt1, marker, txt2);
                model.blocks.push(para);

                return model;
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    Entity,
                    {
                        blockType: 'Paragraph',
                        segments: [marker, txt1, txt2],
                        format: {},
                    },
                ],
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [txt1, txt2],
                        format: {},
                    },
                    Entity,
                    {
                        blockType: 'Paragraph',
                        segments: [marker, br],
                        format: {},
                    },
                ],
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [txt1, txt2],
                        format: {},
                    },
                    Entity,
                    {
                        blockType: 'Paragraph',
                        segments: [marker, br],
                        format: {},
                    },
                ],
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [txt1, txt2],
                        format: {},
                    },
                    Entity,
                    {
                        blockType: 'Paragraph',
                        segments: [marker, br],
                        format: {},
                    },
                ],
            }
        );
    });

    it('Expanded selection', () => {
        const txt1 = createText('test1');
        const txt2 = createText('test2');

        runTest(
            () => {
                const model = createContentModelDocument();
                const para = createParagraph();

                txt2.isSelected = true;

                para.segments.push(txt1, txt2);
                model.blocks.push(para);

                return model;
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    Entity,
                    {
                        blockType: 'Paragraph',
                        segments: [marker, txt1, txt2],
                        format: {},
                    },
                ],
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [txt1, txt2],
                        format: {},
                    },
                    Entity,
                    {
                        blockType: 'Paragraph',
                        segments: [marker, br],
                        format: {},
                    },
                ],
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [txt1],
                        format: {},
                    },
                    Entity,
                    {
                        blockType: 'Paragraph',
                        segments: [marker, br],
                        format: {},
                    },
                ],
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [txt1],
                        format: {},
                    },
                    Entity,
                    {
                        blockType: 'Paragraph',
                        segments: [marker, br],
                        format: {},
                    },
                ],
            }
        );
    });

    it('Before another paragraph', () => {
        runTest(
            () => {
                const model = createContentModelDocument();
                const para1 = createParagraph();
                const para2 = createParagraph();

                para1.segments.push(marker);
                model.blocks.push(para1, para2);

                return model;
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    Entity,
                    {
                        blockType: 'Paragraph',
                        segments: [marker],
                        format: {},
                    },
                    {
                        blockType: 'Paragraph',
                        segments: [],
                        format: {},
                    },
                ],
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [],
                        format: {},
                    },
                    {
                        blockType: 'Paragraph',
                        segments: [],
                        format: {},
                    },
                    Entity,
                    {
                        blockType: 'Paragraph',
                        segments: [marker, br],
                        format: {},
                    },
                ],
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [],
                        format: {},
                    },
                    Entity,
                    {
                        blockType: 'Paragraph',
                        segments: [marker],
                        format: {},
                    },
                ],
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [],
                        format: {},
                    },
                    Entity,
                    {
                        blockType: 'Paragraph',
                        segments: [marker],
                        format: {},
                    },
                ],
            }
        );
    });

    it('Before another divider', () => {
        const divider = createDivider('hr');

        runTest(
            () => {
                const model = createContentModelDocument();
                const para1 = createParagraph();

                para1.segments.push(marker);
                model.blocks.push(para1, divider);

                return model;
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    Entity,
                    {
                        blockType: 'Paragraph',
                        segments: [marker],
                        format: {},
                    },
                    divider,
                ],
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [],
                        format: {},
                    },
                    divider,
                    Entity,
                    {
                        blockType: 'Paragraph',
                        segments: [marker, br],
                        format: {},
                    },
                ],
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [],
                        format: {},
                    },
                    Entity,
                    {
                        blockType: 'Paragraph',
                        segments: [marker, br],
                        format: {},
                    },
                    divider,
                ],
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [],
                        format: {},
                    },
                    Entity,
                    {
                        blockType: 'Paragraph',
                        segments: [marker, br],
                        format: {},
                    },
                    divider,
                ],
            }
        );
    });

    it('Before another entity', () => {
        const entity2 = createEntity({} as any, true);

        runTest(
            () => {
                const model = createContentModelDocument();
                const para1 = createParagraph();

                para1.segments.push(marker);
                model.blocks.push(para1, entity2);

                return model;
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    Entity,
                    {
                        blockType: 'Paragraph',
                        segments: [marker],
                        format: {},
                    },
                    entity2,
                ],
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [],
                        format: {},
                    },
                    entity2,
                    Entity,
                    {
                        blockType: 'Paragraph',
                        segments: [marker, br],
                        format: {},
                    },
                ],
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [],
                        format: {},
                    },
                    Entity,
                    {
                        blockType: 'Paragraph',
                        segments: [marker, br],
                        format: {},
                    },
                    entity2,
                ],
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [],
                        format: {},
                    },
                    Entity,
                    {
                        blockType: 'Paragraph',
                        segments: [marker, br],
                        format: {},
                    },
                    entity2,
                ],
            }
        );
    });

    it('With default format', () => {
        const txt1 = createText('test1');
        const txt2 = createText('test2');
        const format = {
            fontSize: '10px',
        };
        const br = createBr(format);
        const marker2 = createSelectionMarker(format);

        runTest(
            () => {
                const model = createContentModelDocument(format);
                const para = createParagraph();

                para.segments.push(txt1, marker, txt2);
                model.blocks.push(para);

                return model;
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    Entity,
                    {
                        blockType: 'Paragraph',
                        segments: [marker, txt1, txt2],
                        format: {},
                    },
                ],
                format,
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [txt1, txt2],
                        format: {},
                    },
                    Entity,
                    {
                        blockType: 'Paragraph',
                        segments: [marker2, br],
                        segmentFormat: format,
                        format: {},
                    },
                ],
                format,
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [txt1, txt2],
                        format: {},
                    },
                    Entity,
                    {
                        blockType: 'Paragraph',
                        segments: [marker2, br],
                        segmentFormat: format,
                        format: {},
                    },
                ],
                format,
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [txt1, txt2],
                        format: {},
                    },
                    Entity,
                    {
                        blockType: 'Paragraph',
                        segments: [marker2, br],
                        segmentFormat: format,
                        format: {},
                    },
                ],
                format,
            }
        );
    });
});

describe('insertEntityModel, inline element, not focus after entity', () => {
    const marker = createSelectionMarker();

    function runTest(
        createModel: () => ContentModelDocument,
        topResult: ContentModelDocument,
        bottomResult: ContentModelDocument,
        focusResult: ContentModelDocument,
        rootResult: ContentModelDocument
    ) {
        runTestGlobal(createModel(), 'begin', topResult, false, false);
        runTestGlobal(createModel(), 'end', bottomResult, false, false);
        runTestGlobal(createModel(), 'focus', focusResult, false, false);
        runTestGlobal(createModel(), 'root', rootResult, false, false);
    }

    it('no selection', () => {
        runTest(
            () => {
                const model = createContentModelDocument();
                const para = createParagraph();

                model.blocks.push(para);

                return model;
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [Entity],
                        format: {},
                    },
                    {
                        blockType: 'Paragraph',
                        segments: [],
                        format: {},
                    },
                ],
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [],
                        format: {},
                    },
                    {
                        blockType: 'Paragraph',
                        segments: [Entity],
                        format: {},
                    },
                ],
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [],
                        format: {},
                    },
                ],
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [],
                        format: {},
                    },
                ],
            }
        );
    });

    it('collapsed selection', () => {
        const txt1 = createText('test1');
        const txt2 = createText('test2');

        runTest(
            () => {
                const model = createContentModelDocument();
                const para = createParagraph();

                para.segments.push(txt1, marker, txt2);
                model.blocks.push(para);

                return model;
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [Entity],
                        format: {},
                    },
                    {
                        blockType: 'Paragraph',
                        segments: [txt1, marker, txt2],
                        format: {},
                    },
                ],
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [txt1, marker, txt2],
                        format: {},
                    },
                    {
                        blockType: 'Paragraph',
                        segments: [Entity],
                        format: {},
                    },
                ],
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [txt1, marker, Entity, txt2],
                        format: {},
                    },
                ],
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [txt1, marker, Entity, txt2],
                        format: {},
                    },
                ],
            }
        );
    });

    it('Expanded selection', () => {
        const txt1 = createText('test1');
        const txt2 = createText('test2');

        runTest(
            () => {
                const model = createContentModelDocument();
                const para = createParagraph();

                txt2.isSelected = true;

                para.segments.push(txt1, txt2);
                model.blocks.push(para);

                return model;
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [Entity],
                        format: {},
                    },
                    {
                        blockType: 'Paragraph',
                        segments: [txt1, marker],
                        format: {},
                    },
                ],
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [txt1, txt2],
                        format: {},
                    },
                    {
                        blockType: 'Paragraph',
                        segments: [Entity],
                        format: {},
                    },
                ],
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [txt1, marker, Entity],
                        format: {},
                    },
                ],
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [txt1, marker, Entity],
                        format: {},
                    },
                ],
            }
        );
    });

    it('Before another paragraph', () => {
        runTest(
            () => {
                const model = createContentModelDocument();
                const para1 = createParagraph();
                const para2 = createParagraph();

                para1.segments.push(marker);
                model.blocks.push(para1, para2);

                return model;
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [Entity],
                        format: {},
                    },
                    {
                        blockType: 'Paragraph',
                        segments: [marker],
                        format: {},
                    },
                    {
                        blockType: 'Paragraph',
                        segments: [],
                        format: {},
                    },
                ],
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [marker],
                        format: {},
                    },
                    {
                        blockType: 'Paragraph',
                        segments: [],
                        format: {},
                    },
                    {
                        blockType: 'Paragraph',
                        segments: [Entity],
                        format: {},
                    },
                ],
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [marker, Entity],
                        format: {},
                    },
                ],
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [marker, Entity],
                        format: {},
                    },
                ],
            }
        );
    });

    it('Before another divider', () => {
        const divider = createDivider('hr');

        runTest(
            () => {
                const model = createContentModelDocument();
                const para1 = createParagraph();

                para1.segments.push(marker);
                model.blocks.push(para1, divider);

                return model;
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [Entity],
                        format: {},
                    },
                    {
                        blockType: 'Paragraph',
                        segments: [marker],
                        format: {},
                    },
                    divider,
                ],
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [marker],
                        format: {},
                    },
                    divider,
                    {
                        blockType: 'Paragraph',
                        segments: [Entity],
                        format: {},
                    },
                ],
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [marker, Entity],
                        format: {},
                    },
                    divider,
                ],
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [marker, Entity],
                        format: {},
                    },
                    divider,
                ],
            }
        );
    });

    it('Before another entity', () => {
        const entity2 = createEntity({} as any, true);

        runTest(
            () => {
                const model = createContentModelDocument();
                const para1 = createParagraph();

                para1.segments.push(marker);
                model.blocks.push(para1, entity2);

                return model;
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [Entity],
                        format: {},
                    },
                    {
                        blockType: 'Paragraph',
                        segments: [marker],
                        format: {},
                    },
                    entity2,
                ],
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [marker],
                        format: {},
                    },
                    entity2,
                    {
                        blockType: 'Paragraph',
                        segments: [Entity],
                        format: {},
                    },
                ],
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [marker, Entity],
                        format: {},
                    },
                    entity2,
                ],
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [marker, Entity],
                        format: {},
                    },
                    entity2,
                ],
            }
        );
    });

    it('With default format', () => {
        const txt1 = createText('test1');
        const txt2 = createText('test2');
        const format = {
            fontSize: '10px',
        };

        runTest(
            () => {
                const model = createContentModelDocument(format);
                const para = createParagraph();

                para.segments.push(txt1, marker, txt2);
                model.blocks.push(para);

                return model;
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [Entity],
                        format: {},
                        segmentFormat: format,
                    },
                    {
                        blockType: 'Paragraph',
                        segments: [txt1, marker, txt2],
                        format: {},
                    },
                ],
                format,
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [txt1, marker, txt2],
                        format: {},
                    },
                    {
                        blockType: 'Paragraph',
                        segments: [Entity],
                        format: {},
                    },
                ],
                format,
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [txt1, marker, Entity, txt2],
                        format: {},
                    },
                ],
                format,
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [txt1, marker, Entity, txt2],
                        format: {},
                    },
                ],
                format,
            }
        );
    });
});
