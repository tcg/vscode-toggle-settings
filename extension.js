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

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.main', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
        // vscode.window.showInformationMessage('Hello World!');
        main()
	});

	context.subscriptions.push(disposable);
}


function main() {
    // Get the config values object for our Extension (actually, empty string === ALL):
    const config = vscode.workspace.getConfiguration('', {});

    // const values = config.get('toggleSettingsChanges.settingsToToggle', {});
    // const values = config.get('toggleSettingsChanges.settingsToToggle', {});
    const values = config.get('toggleSettingsChanges.settingsToToggle', {});
    const settingsAreToggled = config.get('toggleSettingsChanges.settingsAreToggled', false);
    if (settingsAreToggled === false) {
        console.log("TODO: STORE EXISTING SETTINGS SOMEWHERE");
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
    // const results = settingsNames.map((name)=>{
    //     console.log("Getting value for name:", name);
    //     const existingSettingValue = config.get(name, '')
    //     console.log(`${name}: ${existingSettingValue}`)
    // });

    vscode.window.showInformationMessage('Hello MAIN!');
}


// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}