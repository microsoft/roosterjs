import { ContentModelEntityFormat } from 'roosterjs-content-model-types';
import {
    addDelimiters,
    generateEntityClassNames,
    getAllEntityWrappers,
    isEntityDelimiter,
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

describe('getAllEntityWrappers', () => {
    it('No entity', () => {
        const div = document.createElement('div');
        div.innerHTML = '<div>test</div>';

        const result = getAllEntityWrappers(div);

        expect(result).toEqual([]);
    });

    it('Has entities', () => {
        const div = document.createElement('div');
        const child1 = document.createElement('span');
        const child2 = document.createElement('span');
        const child3 = document.createElement('span');
        const child4 = document.createElement('span');

        child1.className = 'c1';
        child2.className = '_Entity _EType_A';
        child3.className = 'c3';
        child4.className = '_Entity _EType_B';

        div.appendChild(child1);
        div.appendChild(child2);
        div.appendChild(child3);
        div.appendChild(child4);

        const result = getAllEntityWrappers(div);

        expect(result).toEqual([child2, child4]);
    });
});

describe('isEntityDelimiter', () => {
    it('Not a delimiter - empty span', () => {
        const span = document.createElement('span');

        const result = isEntityDelimiter(span);

        expect(result).toBeFalse();
    });

    it('Not a delimiter - wrong content', () => {
        const span = document.createElement('span');

        span.className = 'entityDelimiterBefore';
        span.textContent = 'aa';

        const result = isEntityDelimiter(span);

        expect(result).toBeFalse();
    });

    it('Not a delimiter - wrong class name', () => {
        const span = document.createElement('span');

        span.className = 'test';
        span.textContent = '\u200B';

        const result = isEntityDelimiter(span);

        expect(result).toBeFalse();
    });

    it('Not a delimiter - wrong tag name', () => {
        const span = document.createElement('div');

        span.className = 'entityDelimiterBefore';
        span.textContent = '\u200B';

        const result = isEntityDelimiter(span);

        expect(result).toBeFalse();
    });

    it('delimiter before', () => {
        const span = document.createElement('span');

        span.className = 'entityDelimiterBefore';
        span.textContent = '\u200B';

        const result = isEntityDelimiter(span);

        expect(result).toBeTrue();
    });

    it('delimiter after', () => {
        const span = document.createElement('span');

        span.className = 'entityDelimiterAfter';
        span.textContent = '\u200B';

        const result = isEntityDelimiter(span);

        expect(result).toBeTrue();
    });
});

describe('addDelimiters', () => {
    it('no delimiter', () => {
        const parent = document.createElement('div');
        const entity = document.createElement('span');

        parent.appendChild(entity);

        const result = addDelimiters(document, entity);

        expect(parent.innerHTML).toBe(
            '<span class="entityDelimiterBefore">\u200B</span><span></span><span class="entityDelimiterAfter">\u200B</span>'
        );
        expect(result[0]).toBe(parent.lastChild as any);
        expect(result[1]).toBe(parent.firstChild as any);
    });

    it('already has delimiter', () => {
        const parent = document.createElement('div');

        parent.innerHTML =
            '<span class="entityDelimiterBefore">\u200B</span><span class="_Entity"></span><span class="entityDelimiterAfter">\u200B</span>';

        const entity = parent.querySelector('._Entity') as HTMLElement;

        const result = addDelimiters(document, entity);

        expect(parent.innerHTML).toBe(
            '<span class="entityDelimiterBefore">\u200B</span><span class="_Entity"></span><span class="entityDelimiterAfter">\u200B</span>'
        );
        expect(result[0]).toBe(parent.lastChild as any);
        expect(result[1]).toBe(parent.firstChild as any);
    });
});
