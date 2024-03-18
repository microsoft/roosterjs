import * as ensureUniqueId from '../../../lib/coreApi/setEditorStyle/ensureUniqueId';
import { EditorCore } from 'roosterjs-content-model-types';
import { setEditorStyle } from '../../../lib/coreApi/setEditorStyle/setEditorStyle';

describe('setEditorStyle', () => {
    let core: EditorCore;
    let createElementSpy: jasmine.Spy;
    let appendChildSpy: jasmine.Spy;
    let insertRuleSpy: jasmine.Spy;
    let deleteRuleSpy: jasmine.Spy;
    let ensureUniqueIdSpy: jasmine.Spy;
    let mockedStyle: HTMLStyleElement;

    beforeEach(() => {
        createElementSpy = jasmine.createSpy('createElement');
        appendChildSpy = jasmine.createSpy('appendChild');
        insertRuleSpy = jasmine.createSpy('insertRule');
        deleteRuleSpy = jasmine.createSpy('deleteRule');
        ensureUniqueIdSpy = spyOn(ensureUniqueId, 'ensureUniqueId').and.returnValue('uniqueId');
        core = {
            physicalRoot: {
                ownerDocument: {
                    createElement: createElementSpy,
                    head: {
                        appendChild: appendChildSpy,
                    },
                },
            },
            lifecycle: {
                styleElements: {},
            },
        } as any;

        mockedStyle = {
            dataset: {},
            sheet: {
                cssRules: [],
                insertRule: insertRuleSpy,
                deleteRule: deleteRuleSpy,
            },
        } as any;
    });

    it('New key, empty rule', () => {
        setEditorStyle(core, 'key', null);

        expect(core.lifecycle.styleElements).toEqual({});
        expect(createElementSpy).not.toHaveBeenCalled();
        expect(appendChildSpy).not.toHaveBeenCalled();
        expect(insertRuleSpy).not.toHaveBeenCalled();
        expect(deleteRuleSpy).not.toHaveBeenCalled();
        expect(ensureUniqueIdSpy).not.toHaveBeenCalled();
        expect(core.lifecycle.styleElements).toEqual({});
        expect(mockedStyle.dataset).toEqual({});
    });

    it('New key, valid rule, no sub selector', () => {
        createElementSpy.and.returnValue(mockedStyle);

        setEditorStyle(core, 'key0', 'rule');

        expect(createElementSpy).toHaveBeenCalledWith('style');
        expect(appendChildSpy).toHaveBeenCalledWith(mockedStyle);
        expect(insertRuleSpy).toHaveBeenCalledTimes(1);
        expect(insertRuleSpy).toHaveBeenCalledWith('#uniqueId {rule}');
        expect(deleteRuleSpy).not.toHaveBeenCalled();
        expect(ensureUniqueIdSpy).toHaveBeenCalledTimes(1);
        expect(core.lifecycle.styleElements).toEqual({
            key0: mockedStyle,
        });
        expect(mockedStyle.dataset).toEqual({ roosterjsStyleKey: 'key0' });
    });

    it('New key, valid rule, has sub selector array', () => {
        createElementSpy.and.returnValue(mockedStyle);

        setEditorStyle(core, 'key0', 'rule', ['selector1', 'selector2']);

        expect(createElementSpy).toHaveBeenCalledWith('style');
        expect(appendChildSpy).toHaveBeenCalledWith(mockedStyle);
        expect(insertRuleSpy).toHaveBeenCalledTimes(1);
        expect(insertRuleSpy).toHaveBeenCalledWith(
            '#uniqueId selector1,#uniqueId selector2 {rule}'
        );
        expect(deleteRuleSpy).not.toHaveBeenCalled();
        expect(ensureUniqueIdSpy).toHaveBeenCalledTimes(1);
        expect(core.lifecycle.styleElements).toEqual({
            key0: mockedStyle,
        });
        expect(mockedStyle.dataset).toEqual({ roosterjsStyleKey: 'key0' });
    });

    it('New key, valid rule, has sub selector pseudo class', () => {
        createElementSpy.and.returnValue(mockedStyle);

        setEditorStyle(core, 'key0', 'rule', 'before');

        expect(createElementSpy).toHaveBeenCalledWith('style');
        expect(appendChildSpy).toHaveBeenCalledWith(mockedStyle);
        expect(insertRuleSpy).toHaveBeenCalledTimes(1);
        expect(insertRuleSpy).toHaveBeenCalledWith('#uniqueId::before {rule}');
        expect(deleteRuleSpy).not.toHaveBeenCalled();
        expect(ensureUniqueIdSpy).toHaveBeenCalledTimes(1);
        expect(core.lifecycle.styleElements).toEqual({
            key0: mockedStyle,
        });
        expect(mockedStyle.dataset).toEqual({ roosterjsStyleKey: 'key0' });
    });

    it('Existing key, null rule', () => {
        const existingStyle = {
            sheet: {
                cssRules: ['rule1', 'rule2'],
                insertRule: insertRuleSpy,
                deleteRule: deleteRuleSpy,
            },
        } as any;
        core.lifecycle.styleElements.key0 = existingStyle;

        insertRuleSpy.and.callFake((rule: string) => {
            existingStyle.sheet.cssRules.push(rule);
        });
        deleteRuleSpy.and.callFake((index: number) => {
            existingStyle.sheet.cssRules.splice(index, 1);
        });

        setEditorStyle(core, 'key0', null);

        expect(createElementSpy).not.toHaveBeenCalled();
        expect(appendChildSpy).not.toHaveBeenCalled();
        expect(insertRuleSpy).toHaveBeenCalledTimes(0);
        expect(deleteRuleSpy).toHaveBeenCalledTimes(2);
        expect(deleteRuleSpy).toHaveBeenCalledWith(1);
        expect(deleteRuleSpy).toHaveBeenCalledWith(0);
        expect(ensureUniqueIdSpy).not.toHaveBeenCalled();
        expect(core.lifecycle.styleElements).toEqual({
            key0: {
                sheet: {
                    cssRules: [],
                    insertRule: insertRuleSpy,
                    deleteRule: deleteRuleSpy,
                },
            } as any,
        });
        expect(mockedStyle.dataset).toEqual({});
    });

    it('Existing key, valid rule', () => {
        const existingStyle = {
            sheet: {
                cssRules: ['rule1', 'rule2'],
                insertRule: insertRuleSpy,
                deleteRule: deleteRuleSpy,
            },
        } as any;
        core.lifecycle.styleElements.key0 = existingStyle;

        insertRuleSpy.and.callFake((rule: string) => {
            existingStyle.sheet.cssRules.push(rule);
        });
        deleteRuleSpy.and.callFake((index: number) => {
            existingStyle.sheet.cssRules.splice(index, 1);
        });

        setEditorStyle(core, 'key0', 'rule3');

        expect(createElementSpy).not.toHaveBeenCalled();
        expect(appendChildSpy).not.toHaveBeenCalled();
        expect(insertRuleSpy).toHaveBeenCalledTimes(1);
        expect(insertRuleSpy).toHaveBeenCalledWith('#uniqueId {rule3}');
        expect(deleteRuleSpy).toHaveBeenCalledTimes(2);
        expect(ensureUniqueIdSpy).toHaveBeenCalledTimes(1);
        expect(core.lifecycle.styleElements).toEqual({
            key0: {
                sheet: {
                    cssRules: ['#uniqueId {rule3}'],
                    insertRule: insertRuleSpy,
                    deleteRule: deleteRuleSpy,
                },
            } as any,
        });
        expect(mockedStyle.dataset).toEqual({});
    });

    it('New key, valid rule, has super long sub selector array', () => {
        createElementSpy.and.returnValue(mockedStyle);
        const s1 = 'longSelector1';
        const s2 = 'longSelector2';
        const s3 = 'longSelector3';
        const s4 = 'longSelector4';
        const s5 = 'longSelector5';

        const selectors = [s1, s2, s3, s4, s5];

        setEditorStyle(core, 'key0', 'rule', selectors, 50);

        expect(createElementSpy).toHaveBeenCalledWith('style');
        expect(appendChildSpy).toHaveBeenCalledWith(mockedStyle);
        expect(insertRuleSpy).toHaveBeenCalledTimes(3);
        expect(insertRuleSpy).toHaveBeenCalledWith(
            '#uniqueId longSelector1,#uniqueId longSelector2 {rule}'
        );
        expect(insertRuleSpy).toHaveBeenCalledWith(
            '#uniqueId longSelector3,#uniqueId longSelector4 {rule}'
        );
        expect(insertRuleSpy).toHaveBeenCalledWith('#uniqueId longSelector5 {rule}');
        expect(deleteRuleSpy).not.toHaveBeenCalled();
        expect(ensureUniqueIdSpy).toHaveBeenCalledTimes(1);
        expect(core.lifecycle.styleElements).toEqual({
            key0: mockedStyle,
        });
        expect(mockedStyle.dataset).toEqual({ roosterjsStyleKey: 'key0' });
    });
});
