'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as bv from './bumpVersion';


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "gps-semver" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('gpsSemver.bumpVersion', () => {
        // The code you place here will be executed every time your command is executed

        // Display a message box to the user
        vscode.window.showQuickPick(["major","minor","patch","pre"], {
            placeHolder: "Pick version level"
        }).then(            
            (type: any) => {
                if("majorminorpatchpre".indexOf(type) < 0) {
                    vscode.window.showErrorMessage("Must enter one of the following: 'major' 'minor' 'patch' 'pre'");
                    return;
                }
                var bumper = new bv.GpsSemver();

                var editor = vscode.window.activeTextEditor;

                if (!editor) {
                    vscode.window.showErrorMessage("Editor not found.");
                }
                else {
                        if(editor){
                        var document = editor.document;
                        var original = document.getText();

                        bumper.bumper(original, type || "patch")
                            .then((updated) => {

                                const fullRange = new vscode.Range(
                                    document.positionAt(0),
                                    document.positionAt(original.length)
                                );
                                var tedit = new vscode.TextEdit(fullRange, updated);
                                var wsEdit = new vscode.WorkspaceEdit();
                                wsEdit.set(document.uri, [tedit]);
                                vscode.workspace.applyEdit(wsEdit);
                                vscode.window.showInformationMessage("GPS.Semver Done.");
                            })
                            .catch((er) => {
                                vscode.window.showErrorMessage(er);
                            });
                        }
                }
            }
        );
    });

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}