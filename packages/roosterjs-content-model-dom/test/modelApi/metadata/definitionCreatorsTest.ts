import { Definition, ObjectPropertyDefinition } from 'roosterjs-content-model-types';
import {
    createNumberDefinition,
    createBooleanDefinition,
    createStringDefinition,
    createArrayDefinition,
    createObjectDefinition,
} from '../../../lib/modelApi/metadata/definitionCreators';

describe('createNumberDefinition', () => {
    it('normal case', () => {
        const def = createNumberDefinition();
        expect(def).toEqual({
            type: 'number',
            isOptional: undefined,
            value: undefined,
            maxValue: undefined,
            minValue: undefined,
            allowNull: undefined,
        });
    });

    it('full case', () => {
        const def = createNumberDefinition(true, 2, 1, 3);
        expect(def).toEqual({
            type: 'number',
            isOptional: true,
            value: 2,
            minValue: 1,
            maxValue: 3,
            allowNull: undefined,
        });
    });
});

describe('createBooleanDefinition', () => {
    it('normal case', () => {
        const def = createBooleanDefinition();
        expect(def).toEqual({
            type: 'boolean',
            isOptional: undefined,
            value: undefined,
            allowNull: undefined,
        });
    });

    it('full case', () => {
        const def = createBooleanDefinition(true, false);
        expect(def).toEqual({
            type: 'boolean',
            isOptional: true,
            value: false,
            allowNull: undefined,
        });
    });
});

describe('createStringDefinition', () => {
    it('normal case', () => {
        const def = createStringDefinition();
        expect(def).toEqual({
            type: 'string',
            isOptional: undefined,
            value: undefined,
            allowNull: undefined,
        });
    });

    it('optional case', () => {
        const def = createStringDefinition(true, 'test');
        expect(def).toEqual({
            type: 'string',
            isOptional: true,
            value: 'test',
            allowNull: undefined,
        });
    });

    it('full case', () => {
        const def = createStringDefinition(true, 'test', true);
        expect(def).toEqual({
            type: 'string',
            isOptional: true,
            value: 'test',
            allowNull: true,
        });
    });
});

describe('createArrayDefinition', () => {
    const itemDef: Definition<number> = {
        type: 'number',
    };

    it('normal case', () => {
        const def = createArrayDefinition<number>(itemDef);
        expect(def).toEqual({
            type: 'array',
            itemDef,
            isOptional: undefined,
            minLength: undefined,
            maxLength: undefined,
            allowNull: undefined,
        });
    });

    it('full case', () => {
        const def = createArrayDefinition<number>(itemDef, true, 1, 3);
        expect(def).toEqual({
            type: 'array',
            isOptional: true,
            itemDef,
            minLength: 1,
            maxLength: 3,
            allowNull: undefined,
        });
    });
});

interface TestType {
    x: number;
    y: string;
}

describe('createObjectDefinition', () => {
    const propertyDef: ObjectPropertyDefinition<TestType> = {
        x: { type: 'number' },
        y: { type: 'string' },
    };

    it('normal case', () => {
        const def = createObjectDefinition<TestType>(propertyDef);
        expect(def).toEqual({
            type: 'object',
            propertyDef,
            isOptional: undefined,
            allowNull: undefined,
        });
    });

    it('isOptional case', () => {
        const def = createObjectDefinition<TestType>(propertyDef, true);
        expect(def).toEqual({
            type: 'object',
            isOptional: true,
            propertyDef,
            allowNull: undefined,
        });
    });

    it('full case', () => {
        const def = createObjectDefinition<TestType>(propertyDef, true, true);
        expect(def).toEqual({
            type: 'object',
            isOptional: true,
            propertyDef,
            allowNull: true,
        });
    });
});
