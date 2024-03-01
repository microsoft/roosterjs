import { validate } from '../../../lib/domUtils/metadata/validate';
import {
    ArrayDefinition,
    BooleanDefinition,
    Definition,
    NumberDefinition,
    ObjectDefinition,
    ObjectPropertyDefinition,
    StringDefinition,
} from 'roosterjs-content-model-types';

const enum TestType {
    A = 1,
    B = 2,
    C = 3,
}

describe('validate', () => {
    function runTestInternal(input: any, def: Definition<any>, result: boolean) {
        expect(validate(input, def)).toBe(result);
    }

    function runNumberTest(
        input: any,
        resultForRequired: boolean,
        resultForOptional: boolean,
        value?: number
    ) {
        const requiredDef: NumberDefinition = {
            type: 'number',
            isOptional: false,
            value,
        };
        const optionalDef: NumberDefinition = {
            type: 'number',
            isOptional: true,
            value,
        };
        runTestInternal(input, requiredDef, resultForRequired);
        runTestInternal(input, optionalDef, resultForOptional);
    }

    function runStringTest(
        input: any,
        resultForRequired: boolean,
        resultForOptional: boolean,
        value?: string
    ) {
        const requiredDef: StringDefinition = {
            type: 'string',
            isOptional: false,
            value,
        };
        const optionalDef: StringDefinition = {
            type: 'string',
            isOptional: true,
            value,
        };
        runTestInternal(input, requiredDef, resultForRequired);
        runTestInternal(input, optionalDef, resultForOptional);
    }

    function runBooleanTest(
        input: any,
        resultForRequired: boolean,
        resultForOptional: boolean,
        value?: boolean
    ) {
        const requiredDef: BooleanDefinition = {
            type: 'boolean',
            isOptional: false,
            value,
        };
        const optionalDef: BooleanDefinition = {
            type: 'boolean',
            isOptional: true,
            value,
        };
        runTestInternal(input, requiredDef, resultForRequired);
        runTestInternal(input, optionalDef, resultForOptional);
    }

    function runArrayTest(
        input: any,
        resultForRequired: boolean,
        resultForOptional: boolean,
        minLength?: number,
        maxLength?: number
    ) {
        const itemDef: NumberDefinition = { type: 'number' };
        const requiredDef: ArrayDefinition<number[]> = {
            type: 'array',
            isOptional: false,
            minLength,
            maxLength,
            itemDef,
        };
        const optionalDef: ArrayDefinition<number[]> = {
            type: 'array',
            itemDef,
            isOptional: true,
            minLength,
            maxLength,
        };
        runTestInternal(input, requiredDef, resultForRequired);
        runTestInternal(input, optionalDef, resultForOptional);
    }

    interface TestObj {
        x: number;
        y: string;
    }

    function runObjectTest(input: any, resultForRequired: boolean, resultForOptional: boolean) {
        const propertyDef: ObjectPropertyDefinition<TestObj> = {
            x: { type: 'number' },
            y: { type: 'string' },
        };
        const requiredDef: ObjectDefinition<TestObj> = {
            type: 'object',
            propertyDef,
            isOptional: false,
        };
        const optionalDef: ObjectDefinition<TestObj> = {
            type: 'object',
            propertyDef,
            isOptional: true,
        };
        runTestInternal(input, requiredDef, resultForRequired);
        runTestInternal(input, optionalDef, resultForOptional);
    }

    it('Validate number', () => {
        runNumberTest(0, true, true);
        runNumberTest(0, true, true, 0);
        runNumberTest(0, true, true, 0.000001);
        runNumberTest(0, false, false, 1);
        runNumberTest(undefined, false, true);
        runNumberTest(null, false, false);
        runNumberTest('test', false, false);
        runNumberTest(TestType.A, true, true);
        runNumberTest(true, false, false);
        runNumberTest({}, false, false);
        runNumberTest([], false, false);
        runNumberTest({ x: 1 }, false, false);
        runNumberTest([1], false, false);
    });

    it('Validate string', () => {
        runStringTest('test', true, true);
        runStringTest('test', true, true, 'test');
        runStringTest('test', false, false, 'test1');
        runStringTest(undefined, false, true);
        runStringTest(null, false, false);
        runStringTest(1, false, false);
        runStringTest(TestType.B, false, false);
        runStringTest(true, false, false);
        runStringTest({}, false, false);
        runStringTest([], false, false);
        runStringTest({ x: 1 }, false, false);
        runStringTest([1], false, false);
    });

    it('Validate boolean', () => {
        runBooleanTest(true, true, true);
        runBooleanTest(true, true, true, true);
        runBooleanTest(true, false, false, false);
        runBooleanTest(undefined, false, true);
        runBooleanTest(null, false, false);
        runBooleanTest(1, false, false);
        runBooleanTest(TestType.C, false, false);
        runBooleanTest('test', false, false);
        runBooleanTest({}, false, false);
        runBooleanTest([], false, false);
        runBooleanTest({ x: 1 }, false, false);
        runBooleanTest([1], false, false);
    });

    it('Validate array', () => {
        runArrayTest([], true, true);
        runArrayTest(undefined, false, true);
        runArrayTest([1, 2, 3], true, true);
        runArrayTest([1, 2, 'test'], false, false);
        runArrayTest([null], false, false);
        runArrayTest([1, 2], true, true, 0, 3);
        runArrayTest([1, 2], false, false, 3);
        runArrayTest([1, 2], false, false, undefined, 1);
        runArrayTest(true, false, false);
        runArrayTest(null, false, false);
        runArrayTest(1, false, false);
        runArrayTest(TestType.A, false, false);
        runArrayTest('test', false, false);
        runArrayTest({}, false, false);
        runArrayTest({ x: 1 }, false, false);
    });

    it('Validate object', () => {
        runObjectTest({ x: 1, y: 'test' }, true, true);
        runObjectTest(undefined, false, true);
        runObjectTest({ x: 1, y: 2 }, false, false);
        runObjectTest({ x: 1 }, false, false);
        runObjectTest([], false, false);
        runObjectTest(true, false, false);
        runObjectTest(1, false, false);
        runObjectTest('test', false, false);
    });

    interface TestObj2 {
        a: number[];
        b?: TestObj;
    }

    it('Validate object 2', () => {
        const def: Definition<TestObj2> = {
            type: 'object',
            propertyDef: {
                a: { type: 'array', itemDef: { type: 'number' } },
                b: {
                    type: 'object',
                    propertyDef: {
                        x: { type: 'number' },
                        y: { type: 'string' },
                    },
                    isOptional: true,
                },
            },
        };

        expect(
            validate(
                {
                    a: [1, 2, 3],
                    b: {
                        x: 1,
                        y: 'test',
                    },
                },
                def
            )
        ).toBeTrue();
        expect(
            validate(
                {
                    a: [1, 2, 3],
                },
                def
            )
        ).toBeTrue();
        expect(
            validate(
                {
                    a: [1, 2, 3, 'test'],
                    b: {
                        x: 1,
                        y: 'test',
                    },
                },
                def
            )
        ).toBeFalse();
        expect(
            validate(
                {
                    a: null,
                    b: {
                        x: 1,
                        y: 'test',
                    },
                },
                def
            )
        ).toBeFalse();
        expect(
            validate(
                {
                    a: [1, 2, 3],
                    b: {
                        x: 1,
                        y: 'test',
                    },
                    c: 0,
                },
                def
            )
        ).toBeTrue();
    });
});
