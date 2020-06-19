import { ContentEditFeature, Editor, Keys } from 'roosterjs-editor-core';
import { PluginKeyboardEvent } from 'roosterjs-editor-types';
import {
    Browser,
    toggleBold,
    toggleItalic,
    toggleUnderline,
    toggleStrikethrough,
} from 'roosterjs/lib';

const findTriggerCharactersAndCheckBetween = (triggerChar: string) => (
    event: PluginKeyboardEvent,
    editor: Editor
) => {
    let selObj = window.getSelection();
    let anchorNode = selObj.anchorNode;
    let alterationRequired = false;
    let regExp = new RegExp(/\s+[*_+~][^\s].+[^\s*_+~]$/);
    if (
        anchorNode.textContent.lastIndexOf(triggerChar) == 0 ||
        anchorNode.textContent.lastIndexOf(triggerChar) == 1
    ) {
        regExp = /[*_+~][^\s].+[^\s*_+~]$/;
        console.log(regExp.test(anchorNode.textContent.toString()));
    }
    if (regExp.test(anchorNode.textContent.toString())) {
        alterationRequired = true;
    }
    return alterationRequired;
};

const applyStyle = (triggerChar: string, generatedElement: string) => (
    event: PluginKeyboardEvent,
    editor: Editor
) => {
    let selObj = window.getSelection();
    let anchorNode = selObj.anchorNode;
    let stringToBeAltered = new Range();
    let genericTriggerCharacterRange = new Range();
    let stringAdjust = 1;
    let scenario = 'N/A';
    let genericTriggerCharacterIndex;
    let bugDetect = false;

    if (
        anchorNode.textContent.lastIndexOf(triggerChar) == 0 ||
        anchorNode.textContent.lastIndexOf(triggerChar) == 1
    ) {
        genericTriggerCharacterIndex = anchorNode.textContent.lastIndexOf(triggerChar);
        scenario = 'begin';
    } else if (anchorNode.textContent.lastIndexOf(' ' + triggerChar) >= 0) {
        genericTriggerCharacterIndex = anchorNode.textContent.lastIndexOf(' ' + triggerChar);
        scenario = 'mid';
    }

    if (scenario == 'begin') {
        stringToBeAltered.setStart(anchorNode, genericTriggerCharacterIndex + stringAdjust);
        stringToBeAltered.setEnd(anchorNode, anchorNode.textContent.length);

        if (stringToBeAltered.toString() == stringToBeAltered.toString().trim()) {
            genericTriggerCharacterRange.setStart(anchorNode, genericTriggerCharacterIndex);
            genericTriggerCharacterRange.setEnd(anchorNode, stringToBeAltered.startOffset);
            genericTriggerCharacterRange.deleteContents();
            bugDetect = true;
        }
    } else if (scenario == 'mid') {
        ++stringAdjust;
        stringToBeAltered.setStart(anchorNode, genericTriggerCharacterIndex + stringAdjust);
        stringToBeAltered.setEnd(anchorNode, anchorNode.textContent.length);

        if (stringToBeAltered.toString() == stringToBeAltered.toString().trim()) {
            genericTriggerCharacterRange.setStart(anchorNode, stringToBeAltered.startOffset - 1);
            genericTriggerCharacterRange.setEnd(anchorNode, stringToBeAltered.startOffset);
            genericTriggerCharacterRange.deleteContents();
            bugDetect = true;
        }
    }

    let styleChar = document.createElement(generatedElement);
    stringToBeAltered.surroundContents(styleChar);

    if (Browser.isChrome || Browser.isSafari || Browser.isIE11OrGreater) {
        editor.insertNode(styleChar);
    }

    if (bugDetect) {
        if (generatedElement == 'b') {
            toggleBold(editor);
        } else if (generatedElement == 'i') {
            toggleItalic(editor);
        } else if (generatedElement == 'u') {
            toggleUnderline(editor);
        } else if (generatedElement == 'strike') {
            toggleStrikethrough(editor);
        }

        event.rawEvent.preventDefault();
    }
};

export const Bold: ContentEditFeature = {
    keys: [Keys.ASTERISK],
    shouldHandleEvent: findTriggerCharactersAndCheckBetween('*'),
    handleEvent: applyStyle('*', 'b'),
};

export const Italic: ContentEditFeature = {
    keys: [Keys.UNDERSCORE],
    shouldHandleEvent: findTriggerCharactersAndCheckBetween('_'),
    handleEvent: applyStyle('_', 'i'),
};

export const Underline: ContentEditFeature = {
    keys: [Keys.PLUS],
    shouldHandleEvent: findTriggerCharactersAndCheckBetween('+'),
    handleEvent: applyStyle('+', 'u'),
};

export const Strikethrough: ContentEditFeature = {
    keys: [Keys.TILDE],
    shouldHandleEvent: findTriggerCharactersAndCheckBetween('~'),
    handleEvent: applyStyle('~', 'strike'),
};
