import validate from '../../lib/metadata/validate';
import {
    Definition,
    ObjectPropertyDefinition,
    PluginEventType,
    DefinitionType,
} from 'roosterjs-editor-types';
import {
    createArrayDefinition,
    createBooleanDefinition,
    createNumberDefinition,
    createObjectDefinition,
    createStringDefinition,
} from '../../lib/metadata/definitionCreators';

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
        const requiredDef = createNumberDefinition(false, value);
        const optionalDef = createNumberDefinition(true, value);
        runTestInternal(input, requiredDef, resultForRequired);
        runTestInternal(input, optionalDef, resultForOptional);
    }

    function runStringTest(
        input: any,
        resultForRequired: boolean,
        resultForOptional: boolean,
        value?: string
    ) {
        const requiredDef = createStringDefinition(false, value);
        const optionalDef = createStringDefinition(true, value);
        runTestInternal(input, requiredDef, resultForRequired);
        runTestInternal(input, optionalDef, resultForOptional);
    }

    function runBooleanTest(
        input: any,
        resultForRequired: boolean,
        resultForOptional: boolean,
        value?: boolean
    ) {
        const requiredDef = createBooleanDefinition(false, value);
        const optionalDef = createBooleanDefinition(true, value);
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
        const itemDef = createNumberDefinition();
        const requiredDef = createArrayDefinition<number>(itemDef, false, minLength, maxLength);
        const optionalDef = createArrayDefinition<number>(itemDef, true, minLength, maxLength);
        runTestInternal(input, requiredDef, resultForRequired);
        runTestInternal(input, optionalDef, resultForOptional);
    }

    interface TestObj {
        x: number;
        y: string;
    }

    function runObjectTest(input: any, resultForRequired: boolean, resultForOptional: boolean) {
        const propertyDef: ObjectPropertyDefinition<TestObj> = {
            x: createNumberDefinition(),
            y: createStringDefinition(),
        };
        const requiredDef = createObjectDefinition<TestObj>(propertyDef, false);
        const optionalDef = createObjectDefinition<TestObj>(propertyDef, true);
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
        runNumberTest(PluginEventType.EditorReady, true, true);
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
        runStringTest(PluginEventType.EditorReady, false, false);
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
        runBooleanTest(PluginEventType.EditorReady, false, false);
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
        runArrayTest(PluginEventType.EditorReady, false, false);
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
        const def: Definition<TestObj2> = createObjectDefinition<TestObj2>({
            a: createArrayDefinition<number>(createNumberDefinition()),
            b: createObjectDefinition<TestObj>(
                {
                    x: createNumberDefinition(),
                    y: createStringDefinition(),
                },
                true
            ),
        });

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

describe('Validate customize', () => {
    it('Validate true', () => {
        const validators = {
            trueValidator: (input: any) => true,
            falseValidator: (input: any) => false,
        };
        const trueSpy = spyOn(validators, 'trueValidator').and.callThrough();
        const input = {};
        const result = validate(
            {},
            { type: DefinitionType.Customize, validator: validators.trueValidator }
        );

        expect(result).toBe(true);
        expect(trueSpy).toHaveBeenCalledWith(input);
    });

    it('Validate false', () => {
        const validators = {
            trueValidator: (input: any) => true,
            falseValidator: (input: any) => false,
        };
        const falseSpy = spyOn(validators, 'falseValidator').and.callThrough();
        const input = {};
        const result = validate(
            {},
            { type: DefinitionType.Customize, validator: validators.falseValidator }
        );

        expect(result).toBe(false);
        expect(falseSpy).toHaveBeenCalledWith(input);
    });

    it('Validate object', () => {
        interface TestObj {
            name: string;
            value: number;
        }
        const validators = {
            trueValidator: (input: any) => true,
            falseValidator: (input: any) => false,
        };

        const trueSpy = spyOn(validators, 'trueValidator').and.callThrough();
        const def = createObjectDefinition<TestObj>({
            name: createStringDefinition(),
            value: {
                type: DefinitionType.Customize,
                validator: validators.trueValidator,
            },
        });
        const result = validate({ name: 'test', value: 1 }, def);

        expect(result).toBeTrue();
        expect(trueSpy).toHaveBeenCalledWith(1);
    });
});
