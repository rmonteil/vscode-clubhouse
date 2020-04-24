import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

    let disposable = vscode.commands.registerCommand('vscode-clubhouse.setApiToken', async () => {
        // Ask for an API token
        const api_token = await vscode.window.showInputBox();

        // Ask where to save the API token
        if (vscode.workspace.workspaceFolders) {
            const target = await vscode.window.showQuickPick(
                [
                    { label: 'User', description: 'User Settings', target: vscode.ConfigurationTarget.Global },
                    { label: 'Workspace', description: 'Workspace Settings', target: vscode.ConfigurationTarget.Workspace }
                ],
                { placeHolder: 'Select the context into which you want to save the Clubhouse API token.' });

            if (api_token && target) {
                await vscode.workspace.getConfiguration().update('vscode-clubhouse.api_token', api_token, target.target);
            }
        } else {
            await vscode.workspace.getConfiguration().update('vscode-clubhouse.api_token', api_token, vscode.ConfigurationTarget.Global);
        }

        vscode.window.showInformationMessage('Clubhouse API token saved!');
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
