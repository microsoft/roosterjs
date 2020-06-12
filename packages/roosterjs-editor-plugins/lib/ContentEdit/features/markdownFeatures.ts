import { PluginKeyboardEvent } from 'roosterjs-editor-types';
import {
    Browser,
    toggleBold,
    toggleItalic,
    toggleUnderline,
    toggleStrikethrough,
} from 'roosterjs/lib';
import { Editor, ContentEditFeature, Keys } from 'roosterjs-editor-core';

const findTriggerCharactersAndCheckBetween = (triggerChar: string) => (
    event: PluginKeyboardEvent,
    editor: Editor
) => {
    let selObj = window.getSelection();
    let anchorNode = selObj.anchorNode;
    let genericTriggerCharacterIndex = anchorNode.textContent.lastIndexOf(' ' + triggerChar);
    let alterationRequired = false;
    let stringAdjust = 2;

    if (
        anchorNode.textContent.lastIndexOf(triggerChar) == 0 ||
        anchorNode.textContent.lastIndexOf(triggerChar) == 1
    ) {
        genericTriggerCharacterIndex = anchorNode.textContent.lastIndexOf(triggerChar);
    } else if (anchorNode.textContent.lastIndexOf(' ' + triggerChar) >= 0) {
        genericTriggerCharacterIndex = anchorNode.textContent.lastIndexOf(' ' + triggerChar);
    }

    let firstWhiteSpaceChecker = anchorNode.textContent.charAt(
        genericTriggerCharacterIndex + stringAdjust
    );
    let secondWhiteSpaceChecker = anchorNode.textContent.charAt(anchorNode.textContent.length - 1);
    if (!(secondWhiteSpaceChecker.trim() || firstWhiteSpaceChecker.trim())) {
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

        genericTriggerCharacterRange.setStart(anchorNode, genericTriggerCharacterIndex);
        genericTriggerCharacterRange.setEnd(anchorNode, stringToBeAltered.startOffset);
        genericTriggerCharacterRange.deleteContents();
    } else if (scenario == 'mid') {
        ++stringAdjust;
        stringToBeAltered.setStart(anchorNode, genericTriggerCharacterIndex + stringAdjust);
        stringToBeAltered.setEnd(anchorNode, anchorNode.textContent.length);

        genericTriggerCharacterRange.setStart(anchorNode, stringToBeAltered.startOffset - 1);
        genericTriggerCharacterRange.setEnd(anchorNode, stringToBeAltered.startOffset);
        genericTriggerCharacterRange.deleteContents();
    }

    let styleChar = document.createElement(generatedElement);
    stringToBeAltered.surroundContents(styleChar);

    if (Browser.isChrome || Browser.isSafari || Browser.isIE11OrGreater) {
        editor.insertNode(styleChar);
    }

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
    keys: [Keys.SQUIGGLY],
    shouldHandleEvent: findTriggerCharactersAndCheckBetween('~'),
    handleEvent: applyStyle('~', 'strike'),
};

// 6/4/2020 1:16 PM PDT
// NEW BUG:
// This doesn't bold properly: djfldj dlkfj ldkjfd dlkfj dlkfjdlf*dlkfjd* dlkjfd *dlkfj*
