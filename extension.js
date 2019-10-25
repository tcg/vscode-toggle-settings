// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");

// Keys used for globalState and config key/value storage:
const SETTINGS_ARE_TOGGLED_KEY =
  "toggleSettingsChanges.state.settingsAreToggled";
const STATE_VALUES_KEY = "toggleSettingsChanges.state.values";
const SETTINGS_TO_TOGGLE_KEY = "toggleSettingsChanges.settingsToToggle";

// Message used for config setting change
const SETTINGS_ARE_TOGGLED_MESSAGE =
      "Settings were toggled Globally, for lack of an active Workspace.";
/**
 * Update a given Setting key/value, in the most granular place.
 * E.g., defaults to updating the setting in the workspace/folder, then
 * workspace, then finally *globally* updates the setting, if VSCode throws
 * on the other attempt(s).
 *
 * TODO: This feels jankyyyyy!
 *
 * Returns an object containing the following keys:
 *  global: Boolean - True if the setting had to be changed globally.
 *
 * @param {WorkspaceConfiguration} workspaceConfiguration - A config object
 *  as returned by `workspace.getConfiguration()`.
 * @param {string} key - Setting key.
 * @param {any} value - Setting value. # TODO: Any? Really?
 */
const updateMostGranularSetting = async (
  workspaceConfiguration,
  key,
  value
) => {
  const wasGlobal = await workspaceConfiguration
    .update(key, value)
    .then(() => {
      // Workspace update worked, so the settings should only be
      // applied to the window/workspace where the command ran!
      return { global: false };
    })
    .catch(() => {
      // There was an error. Probably because there was no available
      // workspace, if I'm reading the docs right.
      // In this case, we need to update the settings *globally*. This
      // will update every VSCode instance.
      workspaceConfiguration.update(key, value, true);
      return { global: true };
    });
  return wasGlobal;
};

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This <del>line of</del> code will only be executed once when your extension is activated

  // Get our previous storage state:
  const globalState = context.globalState; // .get("toggleSettingsChanges.state", {})
  // const oldState = globalState.get("toggleSettingsChanges.state", {});

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand("extension.main", () => {
    // The code you place here will be executed every time your command is executed

    // Display a message box to the user
    // vscode.window.showInformationMessage('Hello World!');
    main(globalState);
  });

  context.subscriptions.push(disposable);

  /**
   * Bonus: Just in case stored state gets messed up while we're in Alpha:
   */
  context.subscriptions.push(
    vscode.commands.registerCommand("extension.reset", () => {
      globalState.update(STATE_VALUES_KEY, undefined);
      globalState.update(SETTINGS_ARE_TOGGLED_KEY, undefined);
    })
  );
}

/**
 *
 * @param {object} state - Return value of ExtensionContext.globalState; used to store/retrieve values.
 */
const main = state => {
  // Get the config values object for our Extension (actually, empty string === ALL):
  const config = vscode.workspace.getConfiguration("");
  const settingsToToggle = config.get(SETTINGS_TO_TOGGLE_KEY, {});
  const oldStateValues = state.get(STATE_VALUES_KEY, {});
  const settingsAreToggled = state.get(SETTINGS_ARE_TOGGLED_KEY, false);

  if (oldStateValues) {
    // console.log("Previous State values discovered.");
    // console.log("Old State:", JSON.stringify(oldStateValues))
  }

  let updatedStateValues = oldStateValues;

  // If state is NOT toggled when we run, we should just store ALL
  // of the default values for the settings we're going to toggle:
  if (settingsAreToggled === false) {
    // Set state to the previous values:
    Object.keys(settingsToToggle).forEach(key => {
      // Per the docs, undefined "unsets" a value. That's useful later.
      let currentConfigReadValue = config.get(key, undefined);
      updatedStateValues = Object.assign(updatedStateValues, {
        [key]: currentConfigReadValue
      });
    });
    state.update(STATE_VALUES_KEY, updatedStateValues);

    // Flip all relevant settings to new values:
    Object.keys(settingsToToggle).forEach(async key => {
      // config.update(key, settingsToToggle[key])
      const resultObj = await updateMostGranularSetting(
        config,
        key,
        settingsToToggle[key]
      );

      if (resultObj.global) {
        vscode.window.showInformationMessage(
          SETTINGS_ARE_TOGGLED_MESSAGE
        );
      }
    });
    // Set that we HAVE toggled settings:
    state.update(SETTINGS_ARE_TOGGLED_KEY, true);
  }
  if (settingsAreToggled === true) {
    // If the settings *are* toggled, we still need to check JUST IN CASE
    // some new settings were added since we stored them as state:
    Object.keys(settingsToToggle).forEach(key => {
      if (!(key in oldStateValues)) {
        updatedStateValues = Object.assign(updatedStateValues, {
          [key]: settingsToToggle[key]
        });
      }
    });
    // Set state to the previous (w/ possibly updated) values:
    state.update(STATE_VALUES_KEY, updatedStateValues);

    // Flip all relevant settings BACK to stored values:
    Object.keys(settingsToToggle).forEach(async key => {
      // config.update(key, updatedStateValues[key])
      const resultObj = await updateMostGranularSetting(
        config,
        key,
        updatedStateValues[key]
      );
      if (resultObj.global) {
        vscode.window.showInformationMessage(
          SETTINGS_ARE_TOGGLED_MESSAGE
        );
      }
    });

    // Set that we have un-toggled settings:
    state.update(SETTINGS_ARE_TOGGLED_KEY, false);
  }
};

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate
};
