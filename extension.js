// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "helloworld-minimal-sample" is now active!');

    // Get our previous storage state:
    const globalState = context.globalState; // .get("toggleSettingsChanges.state", {})

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.main', (globalState) => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
        // vscode.window.showInformationMessage('Hello World!');
        main(globalState)
	});

	context.subscriptions.push(disposable);
}


/**
 * Returns `true` if the values stored in the Config/Settings for this Extension are the same as the key/values provided in the given `settingsObject` Object. Otherwise, `false`.
 *
 * @param {object} settingsObject - An object of settings values to compare with what's stored in the settings of this extension.
 */
function settingsAreSameAsDefined(settingsObject) {
    // TODO: Not sure how best to implement this yet.
    // I'm so accustomed to Python object comparisons, I'm not 100% sure on this.
}

/**
 *
 * @param {object} state - Return value of ExtensionContext.globalState; used to store/retrieve values.
 */
function main(state) {
    // Get the config values object for our Extension (actually, empty string === ALL):
    const config = vscode.workspace.getConfiguration('', {});
    const oldState = state.get("toggleSettingsChanges.state", {});
    // const values = config.get('toggleSettingsChanges.settingsToToggle', {});
    // const values = config.get('toggleSettingsChanges.settingsToToggle', {});
    const values = config.get('toggleSettingsChanges.settingsToToggle', {});
    if (settingsAreToggled === false) {
        // const settingsAreToggled = config.get('toggleSettingsChanges.settingsAreToggled', false);
        const settingsAreToggled = state.get('toggleSettingsChanges.settingsAreToggled', false);
        console.log("TODO: STORE EXISTING SETTINGS SOMEWHERE");
    }
    if (oldState) {
        console.log("Previous State values discovered.");
        console.log(oldState)
    }
   /**/
    // STREAMING SETTINGS.
    // HT: KCD https://www.youtube.com/watch?v=IHMkIdmvD9c
    /*
    "window.zoomlevel": 2, // default: 0
    "editor.fontSize": 22, // 12
    "terminal.integrated.fontSize": 16, // 12
    "scm.diffDecorations": "none", // "all"
    "workbench.statusBar.visible": false, // true
    "editor.cursorBlinking": "solid" // blink
    /**/
    Object.keys(values).forEach(
        (key) => {
            console.log(`Reading settings key: ${key}`)
            const previousValue = config.get(key);
            if (previousValue !== null) {
                console.log("... Not null.")
                console.log(`Update setting from ${previousValue} to ${values[key]}`)
            }
            // config.update(key, values[key])
        }
    );

    vscode.window.showInformationMessage('Hello MAIN!');
}


// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}