import { Definition, DefinitionType, ObjectPropertyDefinition } from 'roosterjs-editor-types';
import {
    createNumberDefinition,
    createBooleanDefinition,
    createStringDefinition,
    createArrayDefinition,
    createObjectDefinition,
} from '../../lib/metadata/definitionCreators';

describe('createNumberDefinition', () => {
    it('normal case', () => {
        const def = createNumberDefinition();
        expect(def).toEqual({
            type: DefinitionType.Number,
            isOptional: undefined,
            value: undefined,
            maxValue: undefined,
            minValue: undefined,
        });
    });

    it('full case', () => {
        const def = createNumberDefinition(true, 2, 1, 3);
        expect(def).toEqual({
            type: DefinitionType.Number,
            isOptional: true,
            value: 2,
            minValue: 1,
            maxValue: 3,
        });
    });
});

describe('createBooleanDefinition', () => {
    it('normal case', () => {
        const def = createBooleanDefinition();
        expect(def).toEqual({
            type: DefinitionType.Boolean,
            isOptional: undefined,
            value: undefined,
        });
    });

    it('full case', () => {
        const def = createBooleanDefinition(true, false);
        expect(def).toEqual({
            type: DefinitionType.Boolean,
            isOptional: true,
            value: false,
        });
    });
});

describe('createStringDefinition', () => {
    it('normal case', () => {
        const def = createStringDefinition();
        expect(def).toEqual({
            type: DefinitionType.String,
            isOptional: undefined,
            value: undefined,
        });
    });

    it('full case', () => {
        const def = createStringDefinition(true, 'test');
        expect(def).toEqual({
            type: DefinitionType.String,
            isOptional: true,
            value: 'test',
        });
    });
});

describe('createArrayDefinition', () => {
    const itemDef: Definition<number> = {
        type: DefinitionType.Number,
    };

    it('normal case', () => {
        const def = createArrayDefinition<number>(itemDef);
        expect(def).toEqual({
            type: DefinitionType.Array,
            itemDef,
            isOptional: undefined,
            minLength: undefined,
            maxLength: undefined,
        });
    });

    it('full case', () => {
        const def = createArrayDefinition<number>(itemDef, true, 1, 3);
        expect(def).toEqual({
            type: DefinitionType.Array,
            isOptional: true,
            itemDef,
            minLength: 1,
            maxLength: 3,
        });
    });
});

interface TestType {
    x: number;
    y: string;
}

describe('createObjectDefinition', () => {
    const propertyDef: ObjectPropertyDefinition<TestType> = {
        x: { type: DefinitionType.Number },
        y: { type: DefinitionType.String },
    };

    it('normal case', () => {
        const def = createObjectDefinition<TestType>(propertyDef);
        expect(def).toEqual({
            type: DefinitionType.Object,
            propertyDef,
            isOptional: undefined,
        });
    });

    it('full case', () => {
        const def = createObjectDefinition<TestType>(propertyDef, true);
        expect(def).toEqual({
            type: DefinitionType.Object,
            isOptional: true,
            propertyDef,
        });
    });
});
