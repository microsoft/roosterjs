import { ContentModelEntityFormat } from 'roosterjs-content-model-types';
import {
    generateEntityClassNames,
    isEntityElement,
    parseEntityClassName,
} from '../../lib/domUtils/entityUtils';

export function setEntityElementClasses(
    wrapper: HTMLElement,
    type: string,
    isReadonly: boolean,
    id?: string
) {
    wrapper.className = `_Entity _EType_${type} ${id ? `_EId_${id} ` : ''}_EReadonly_${
        isReadonly ? '1' : '0'
    }`;

    if (isReadonly) {
        wrapper.contentEditable = 'false';
    }
}

describe('isEntityElement', () => {
    it('Not an entity', () => {
        const div = document.createElement('div');

        const result = isEntityElement(div);

        expect(result).toBeFalse();
    });

    it('Is an entity', () => {
        const div = document.createElement('div');

        div.className = '_Entity';

        const result = isEntityElement(div);

        expect(result).toBeTrue();
    });
});

describe('parseEntityClassName', () => {
    it('No entity class', () => {
        const format: ContentModelEntityFormat = {};

        const result = parseEntityClassName('test', format);

        expect(result).toBeFalsy();
        expect(format).toEqual({});
    });

    it('Entity class', () => {
        const format: ContentModelEntityFormat = {};

        const result = parseEntityClassName('_Entity', format);

        expect(result).toBeTrue();
        expect(format).toEqual({});
    });

    it('EntityId class', () => {
        const format: ContentModelEntityFormat = {};

        const result = parseEntityClassName('_EId_A', format);

        expect(result).toBeFalsy();
        expect(format).toEqual({
            id: 'A',
        });
    });

    it('EntityType class', () => {
        const format: ContentModelEntityFormat = {};

        const result = parseEntityClassName('_EType_B', format);

        expect(result).toBeFalsy();
        expect(format).toEqual({
            entityType: 'B',
        });
    });

    it('Entity readonly class', () => {
        const format: ContentModelEntityFormat = {};

        const result = parseEntityClassName('_EReadonly_1', format);

        expect(result).toBeFalsy();
        expect(format).toEqual({
            isReadonly: true,
        });
    });

    it('Parse class on existing format', () => {
        const format: ContentModelEntityFormat = {
            id: 'A',
        };

        const result = parseEntityClassName('_EType_B', format);

        expect(result).toBeFalsy();
        expect(format).toEqual({
            id: 'A',
            entityType: 'B',
        });
    });
});

describe('generateEntityClassNames', () => {
    it('Empty format', () => {
        const format: ContentModelEntityFormat = {};

        const className = generateEntityClassNames(format);

        expect(className).toBe('_Entity _EType_ _EReadonly_0');
    });

    it('Format with type', () => {
        const format: ContentModelEntityFormat = {
            entityType: 'A',
        };

        const className = generateEntityClassNames(format);

        expect(className).toBe('_Entity _EType_A _EReadonly_0');
    });

    it('Format with type and id and readonly', () => {
        const format: ContentModelEntityFormat = {
            entityType: 'A',
            id: 'B',
            isReadonly: true,
        };

        const className = generateEntityClassNames(format);

        expect(className).toBe('_Entity _EType_A _EId_B _EReadonly_1');
    });

    it('Fake entity format with type and id and readonly', () => {
        const format: ContentModelEntityFormat = {
            entityType: 'A',
            id: 'B',
            isReadonly: true,
            isFakeEntity: true,
        };

        const className = generateEntityClassNames(format);

        expect(className).toBe('');
    });
});
