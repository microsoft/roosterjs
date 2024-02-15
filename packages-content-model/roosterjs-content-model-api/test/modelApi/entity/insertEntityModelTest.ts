import { ContentModelDocument, InsertEntityPosition } from 'roosterjs-content-model-types';
import { insertEntityModel } from '../../../lib/modelApi/entity/insertEntityModel';
import {
    createBr,
    createContentModelDocument,
    createDivider,
    createEntity,
    createParagraph,
    createSelectionMarker,
    createText,
} from 'roosterjs-content-model-dom';

function runTestGlobal(
    model: ContentModelDocument,
    pos: InsertEntityPosition,
    expectedResult: ContentModelDocument,
    isBlock: boolean,
    focusAfterEntity: boolean
) {
    const Entity = {
        format: {},
    } as any;

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
                    {
                        format: {},
                    } as any,
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
                        format: {},
                    } as any,
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
                    {
                        format: {},
                    } as any,
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
                        format: {},
                    } as any,
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
                    {
                        format: {},
                    } as any,
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
                    {
                        format: {},
                    } as any,
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
                    {
                        format: {},
                    } as any,
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
                    {
                        format: {},
                    } as any,
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
                    {
                        format: {},
                    } as any,
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
                    {
                        format: {},
                    } as any,
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
                    {
                        format: {},
                    } as any,
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
                        format: {},
                    } as any,
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
                    {
                        format: {},
                    } as any,
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
                        format: {},
                    } as any,
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
                    {
                        format: {},
                    } as any,
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
                        format: {},
                    } as any,
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
                    {
                        format: {},
                    } as any,
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
                    {
                        format: {},
                    } as any,
                    divider,
                ],
            }
        );
    });

    it('Before another entity', () => {
        const entity2 = createEntity({} as any);
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
                    {
                        format: {},
                    } as any,
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
                        format: {},
                    } as any,
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
                    {
                        format: {},
                    } as any,
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
                    {
                        format: {},
                    } as any,
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
                    {
                        format: {},
                    } as any,
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
                        format: {},
                    } as any,
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
                    {
                        format: {},
                    } as any,
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
                    {
                        format: {},
                    } as any,
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
                    {
                        format: {},
                    } as any,
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
                    {
                        format: {},
                    } as any,
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
                    {
                        format: {},
                    } as any,
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
                    {
                        format: {},
                    } as any,
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
                    {
                        format: {},
                    } as any,
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
                    {
                        format: {},
                    } as any,
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
                    {
                        format: {},
                    } as any,
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
                    {
                        format: {},
                    } as any,
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
                    {
                        format: {},
                    } as any,
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
                    {
                        format: {},
                    } as any,
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
                    {
                        format: {},
                    } as any,
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
                    {
                        format: {},
                    } as any,
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
                    {
                        format: {},
                    } as any,
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
                    {
                        format: {},
                    } as any,
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
                    {
                        format: {},
                    } as any,
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
                    {
                        format: {},
                    } as any,
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
                    {
                        format: {},
                    } as any,
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
                    {
                        format: {},
                    } as any,
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
        const entity2 = createEntity({} as any);

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
                        format: {},
                    } as any,
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
                    {
                        format: {},
                    } as any,
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
                    {
                        format: {},
                    } as any,
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
                    {
                        format: {},
                    } as any,
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
                    {
                        format: {},
                    } as any,
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
                    {
                        format: {},
                    } as any,
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
                    {
                        format: {},
                    } as any,
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
                    {
                        format: {},
                    } as any,
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
                        segments: [
                            {
                                format: {},
                            } as any,
                        ],
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
                        segments: [
                            {
                                format: {},
                            } as any,
                        ],
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
                        segments: [
                            {
                                format: {},
                            } as any,
                        ],
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
                        segments: [
                            {
                                format: {},
                            } as any,
                        ],
                        format: {},
                    },
                ],
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [
                            txt1,
                            marker,
                            {
                                format: {},
                            } as any,
                            txt2,
                        ],
                        format: {},
                    },
                ],
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [
                            txt1,
                            marker,
                            {
                                format: {},
                            } as any,
                            txt2,
                        ],
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
                        segments: [
                            {
                                format: {},
                            } as any,
                        ],
                        format: {},
                    },
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
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                format: {},
                            } as any,
                        ],
                        format: {},
                    },
                ],
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [
                            txt1,
                            marker,
                            {
                                format: {},
                            } as any,
                        ],
                        format: {},
                    },
                ],
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [
                            txt1,
                            marker,
                            {
                                format: {},
                            } as any,
                        ],
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
                        segments: [
                            {
                                format: {},
                            } as any,
                        ],
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
                        segments: [
                            {
                                format: {},
                            } as any,
                        ],
                        format: {},
                    },
                ],
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [
                            marker,
                            {
                                format: {},
                            } as any,
                        ],
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
                        segments: [
                            marker,
                            {
                                format: {},
                            } as any,
                        ],
                        format: {},
                    },
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
                        segments: [
                            {
                                format: {},
                            } as any,
                        ],
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
                        segments: [
                            {
                                format: {},
                            } as any,
                        ],
                        format: {},
                    },
                ],
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [
                            marker,
                            {
                                format: {},
                            } as any,
                        ],
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
                        segments: [
                            marker,
                            {
                                format: {},
                            } as any,
                        ],
                        format: {},
                    },
                    divider,
                ],
            }
        );
    });

    it('Before another entity', () => {
        const entity2 = createEntity({} as any);

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
                        segments: [
                            {
                                format: {},
                            } as any,
                        ],
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
                        segments: [
                            {
                                format: {},
                            } as any,
                        ],
                        format: {},
                    },
                ],
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [
                            marker,
                            {
                                format: {},
                            } as any,
                        ],
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
                        segments: [
                            marker,
                            {
                                format: {},
                            } as any,
                        ],
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
                        segments: [{ format } as any],
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
                        segments: [{ format } as any],
                        format: {},
                        segmentFormat: format,
                    },
                ],
                format,
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [txt1, marker, { format: {} } as any, txt2],
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
                        segments: [txt1, marker, { format: {} } as any, txt2],
                        format: {},
                    },
                ],
                format,
            }
        );
    });
});

describe('insertEntityModel, inline element, focus after entity', () => {
    const marker = createSelectionMarker();

    function runTest(
        createModel: () => ContentModelDocument,
        topResult: ContentModelDocument,
        bottomResult: ContentModelDocument,
        focusResult: ContentModelDocument,
        rootResult: ContentModelDocument
    ) {
        runTestGlobal(createModel(), 'begin', topResult, false, true);
        runTestGlobal(createModel(), 'end', bottomResult, false, true);
        runTestGlobal(createModel(), 'focus', focusResult, false, true);
        runTestGlobal(createModel(), 'root', rootResult, false, true);
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
                        segments: [
                            {
                                format: {},
                            } as any,
                            marker,
                        ],
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
                        segments: [
                            {
                                format: {},
                            } as any,
                            marker,
                        ],
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
                        segments: [
                            {
                                format: {},
                            } as any,
                            marker,
                        ],
                        format: {},
                    },
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
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                format: {},
                            } as any,
                            marker,
                        ],
                        format: {},
                    },
                ],
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [
                            txt1,
                            {
                                format: {},
                            } as any,
                            marker,
                            txt2,
                        ],
                        format: {},
                    },
                ],
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [
                            txt1,
                            {
                                format: {},
                            } as any,
                            marker,
                            txt2,
                        ],
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
                        segments: [
                            {
                                format: {},
                            } as any,
                            marker,
                        ],
                        format: {},
                    },
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
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                format: {},
                            } as any,
                            marker,
                        ],
                        format: {},
                    },
                ],
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [
                            txt1,
                            {
                                format: {},
                            } as any,
                            marker,
                        ],
                        format: {},
                    },
                ],
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [
                            txt1,
                            {
                                format: {},
                            } as any,
                            marker,
                        ],
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
                        segments: [
                            {
                                format: {},
                            } as any,
                            marker,
                        ],
                        format: {},
                    },
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
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                format: {},
                            } as any,
                            marker,
                        ],
                        format: {},
                    },
                ],
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                format: {},
                            } as any,
                            marker,
                        ],
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
                        segments: [
                            {
                                format: {},
                            } as any,
                            marker,
                        ],
                        format: {},
                    },
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
                        segments: [
                            {
                                format: {},
                            } as any,
                            marker,
                        ],
                        format: {},
                    },
                    {
                        blockType: 'Paragraph',
                        segments: [],
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
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                format: {},
                            } as any,
                            marker,
                        ],
                        format: {},
                    },
                ],
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                format: {},
                            } as any,
                            marker,
                        ],
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
                        segments: [
                            {
                                format: {},
                            } as any,
                            marker,
                        ],
                        format: {},
                    },
                    divider,
                ],
            }
        );
    });

    it('Before another entity', () => {
        const entity2 = createEntity({} as any);

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
                        segments: [
                            {
                                format: {},
                            } as any,
                            marker,
                        ],
                        format: {},
                    },
                    {
                        blockType: 'Paragraph',
                        segments: [],
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
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                format: {},
                            } as any,
                            marker,
                        ],
                        format: {},
                    },
                ],
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                format: {},
                            } as any,
                            marker,
                        ],
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
                        segments: [
                            {
                                format: {},
                            } as any,
                            marker,
                        ],
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
                    {
                        blockType: 'Paragraph',
                        segments: [{ format } as any, marker2],
                        format: {},
                        segmentFormat: format,
                    },
                    {
                        blockType: 'Paragraph',
                        segments: [txt1, txt2],
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
                    {
                        blockType: 'Paragraph',
                        segments: [{ format } as any, marker2],
                        format: {},
                        segmentFormat: format,
                    },
                ],
                format,
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [
                            txt1,
                            {
                                format: {},
                            } as any,
                            marker,
                            txt2,
                        ],
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
                        segments: [
                            txt1,
                            {
                                format: {},
                            } as any,
                            marker,
                            txt2,
                        ],
                        format: {},
                    },
                ],
                format,
            }
        );
    });
});
