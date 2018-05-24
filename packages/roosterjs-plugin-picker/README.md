# roosterjs-editor-plugins

The Picker Plugin is designed to support scenarios where you'd want to type a trigger character, for instance, an @, and then mention someone. You can see this on Github, where typing an @ opens a drop down menu with a list of people that you can mention. It also works for the # symbol as well.

The Picker Plugin is generalized to accept configuration through it's PickerDataProvider, which manages the data and UX portions of the picker experience. It can be further configured through the PickerPluginOptions interface to see trigger characters and change sources.
