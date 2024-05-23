import type { ChangedEntity, ReadonlyContentModelBlockGroup } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function findAllEntities(group: ReadonlyContentModelBlockGroup, entities: ChangedEntity[]) {
    group.blocks.forEach(block => {
        switch (block.blockType) {
            case 'BlockGroup':
                findAllEntities(block, entities);
                break;

            case 'Entity':
                entities.push({
                    entity: block,
                    operation: 'newEntity',
                });
                break;

            case 'Paragraph':
                block.segments.forEach(segment => {
                    switch (segment.segmentType) {
                        case 'Entity':
                            entities.push({
                                entity: segment,
                                operation: 'newEntity',
                            });
                            break;

                        case 'General':
                            findAllEntities(segment, entities);
                            break;
                    }
                });
                break;

            case 'Table':
                block.rows.forEach(row =>
                    row.cells.forEach(cell => findAllEntities(cell, entities))
                );
                break;
        }
    });
}
