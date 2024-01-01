# toggleSettingsChanges

A VS Code settings toggler that stores previous settings, and only requires you to define a single "toggled" state for settings you want to change -- not both states.

Personally, I wanted this flexibility. If you don't need that, I suggest checking out [SettingsCycler](https://github.com/hoovercj/vscode-api-playground/tree/master/SettingsCycler)


## How to use this extension

Install it from the [Marketplace](https://marketplace.visualstudio.com/items?itemName=JohnReaganPublisher.toggle-settings-changes).

Edit the Global, User, or Workspace settings file of your choice, and add an
entry for `toggleSettingsChanges.settingsToToggle` with an object value. That
object should contain the keys/values of specific settings that you want to
toggle *to*. No need to specify the "un-toggled" state, as this extension
uses your existing (or default) settings values when switching back.

Here's an example of the settings I use (based on settings that [kentcdodds](https://github.com/kentcdodds) shows [for doing screencasts](https://www.youtube.com/watch?v=IHMkIdmvD9c)):

```json
"toggleSettingsChanges.settingsToToggle": {
    "window.zoomLevel": 2,
    "editor.fontSize": 22,
    "terminal.integrated.fontSize": 16,
    "scm.diffDecorations": "none",
    "workbench.statusBar.visible": false,
    "editor.cursorBlinking": "solid",
    "workbench.activityBar.visible": false
}
```

Once the extension is installed, it creates a VS Code Command that becomes available in the Command Palette.

You can activate the command, and toggle the assigned settings, by finding it in the Command Palette, named "Toggle Settings".

You can further customize this by adding your own keybinding for that command.


## Acknowledgements

Thanks to [Cody](https://github.com/hoovercj) for open-sourcing [SettingsCycler](https://github.com/hoovercj/vscode-api-playground/tree/master/SettingsCycler), which got me started down this road. That code was very helpful to get this up and running.

**Includes contributions from:**

* [logiclrd](https://github.com/logiclrd)
* [harshalkh](https://github.com/harshalkh)

## Development

Questions, comments, Issues, and Pull Requests are welcome! This project was created to fulfill a specific need of mine, and is open-source code available at https://github.com/tcg/vscode-toggle-settings
