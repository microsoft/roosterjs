import { ChangedEntity } from 'roosterjs-content-model-types';
import { findAllEntities } from '../../../lib/corePlugin/utils/findAllEntities';
import {
    createContentModelDocument,
    createEntity,
    createFormatContainer,
    createGeneralBlock,
    createGeneralSegment,
    createListItem,
    createListLevel,
    createParagraph,
    createTable,
    createTableCell,
} from 'roosterjs-content-model-dom';

describe('findAllEntities', () => {
    it('Empty model', () => {
        const model = createContentModelDocument();
        const result: ChangedEntity[] = [];

        findAllEntities(model, result);

        expect(result).toEqual([]);
    });

    it('Root level block entity', () => {
        const model = createContentModelDocument();
        const wrapper = document.createElement('div');
        const entity = createEntity(wrapper);

        model.blocks.push(entity);

        const result: ChangedEntity[] = [];

        findAllEntities(model, result);

        expect(result).toEqual([
            {
                entity,
                operation: 'newEntity',
            },
        ]);
    });

    it('Inline entity under root level paragraph', () => {
        const model = createContentModelDocument();
        const para = createParagraph();
        const wrapper = document.createElement('span');
        const entity = createEntity(wrapper);

        para.segments.push(entity);
        model.blocks.push(para);

        const result: ChangedEntity[] = [];

        findAllEntities(model, result);

        expect(result).toEqual([
            {
                entity,
                operation: 'newEntity',
            },
        ]);
    });

    it('Mixed entities', () => {
        const model = createContentModelDocument();
        const para = createParagraph();
        const wrapper1 = document.createElement('div');
        const wrapper2 = document.createElement('span');
        const entity1 = createEntity(wrapper1);
        const entity2 = createEntity(wrapper2);

        para.segments.push(entity2);
        model.blocks.push(para, entity1);

        const result: ChangedEntity[] = [];

        findAllEntities(model, result);

        expect(result).toEqual([
            {
                entity: entity2,
                operation: 'newEntity',
            },
            {
                entity: entity1,
                operation: 'newEntity',
            },
        ]);
    });

    it('Inline entity under general model', () => {
        const model = createContentModelDocument();
        const para = createParagraph();
        const wrapper = document.createElement('span');
        const entity = createEntity(wrapper);
        const generalElement = document.createElement('div');
        const generalBlock = createGeneralBlock(generalElement);

        para.segments.push(entity);
        generalBlock.blocks.push(para);
        model.blocks.push(generalBlock);

        const result: ChangedEntity[] = [];

        findAllEntities(model, result);

        expect(result).toEqual([
            {
                entity,
                operation: 'newEntity',
            },
        ]);
    });

    it('Inline entity under general segment', () => {
        const model = createContentModelDocument();
        const para = createParagraph();
        const wrapper = document.createElement('span');
        const entity = createEntity(wrapper);
        const generalElement = document.createElement('span');
        const generalSegment = createGeneralSegment(generalElement);

        generalSegment.blocks.push(entity);
        para.segments.push(generalSegment);
        model.blocks.push(para);

        const result: ChangedEntity[] = [];

        findAllEntities(model, result);

        expect(result).toEqual([
            {
                entity,
                operation: 'newEntity',
            },
        ]);
    });

    it('Inline entity under list item', () => {
        const model = createContentModelDocument();
        const para = createParagraph();
        const wrapper = document.createElement('span');
        const entity = createEntity(wrapper);

        const listItem = createListItem([createListLevel('OL')]);

        para.segments.push(entity);
        listItem.blocks.push(para);
        model.blocks.push(listItem);

        const result: ChangedEntity[] = [];

        findAllEntities(model, result);

        expect(result).toEqual([
            {
                entity,
                operation: 'newEntity',
            },
        ]);
    });

    it('Inline entity under format container', () => {
        const model = createContentModelDocument();
        const para = createParagraph();
        const wrapper = document.createElement('span');
        const entity = createEntity(wrapper);

        const container = createFormatContainer('div');

        para.segments.push(entity);
        container.blocks.push(para);
        model.blocks.push(container);

        const result: ChangedEntity[] = [];

        findAllEntities(model, result);

        expect(result).toEqual([
            {
                entity,
                operation: 'newEntity',
            },
        ]);
    });

    it('Inline entity under table', () => {
        const model = createContentModelDocument();
        const para = createParagraph();
        const wrapper = document.createElement('span');
        const entity = createEntity(wrapper);

        const table = createTable(1);
        const cell = createTableCell();

        para.segments.push(entity);
        cell.blocks.push(para);
        table.rows[0].cells.push(cell);
        model.blocks.push(table);

        const result: ChangedEntity[] = [];

        findAllEntities(model, result);

        expect(result).toEqual([
            {
                entity,
                operation: 'newEntity',
            },
        ]);
    });
});
