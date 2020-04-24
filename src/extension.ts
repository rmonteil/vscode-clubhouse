import * as vscode from 'vscode';
import { Story, StorySearchResults, Clubhouse } from './modules/clubhouse';

interface SelectedStory {
    id: number
    label: string
    description: string
    target: any
}

export function activate(context: vscode.ExtensionContext) {

    const setApiTokenFuntion = vscode.commands.registerCommand('vscode-clubhouse.setApiToken', async () => {
        // Ask for an API token
        const apiToken = await vscode.window.showInputBox();

        // Ask where to save the API token
        if (vscode.workspace.workspaceFolders) {
            const target = await vscode.window.showQuickPick(
                [
                    { label: 'User', description: 'User Settings', target: vscode.ConfigurationTarget.Global },
                    { label: 'Workspace', description: 'Workspace Settings', target: vscode.ConfigurationTarget.Workspace }
                ],
                { placeHolder: 'Select the context into which you want to save the Clubhouse API token.' });

            if (apiToken && target) {
                await vscode.workspace.getConfiguration().update('vscode-clubhouse.api_token', apiToken, target.target);
            }
        } else {
            await vscode.workspace.getConfiguration().update('vscode-clubhouse.api_token', apiToken, vscode.ConfigurationTarget.Global);
        }

        vscode.window.showInformationMessage('Clubhouse API token saved!');
    });

    context.subscriptions.push(setApiTokenFuntion);

    const getStoriesFunction = vscode.commands.registerCommand('vscode-clubhouse.getStories', async () => {
        const apiToken = await vscode.workspace.getConfiguration().get('vscode-clubhouse.api_token');
        if (apiToken) {
            const clubhouse = new Clubhouse(apiToken as string);
            let stories: StorySearchResults;
            try {
                stories = await clubhouse.getStories("hermes", 2);
                // console.log('stories:', stories.data.map((story: Story) => story.name));
                const storiesSelectionList: SelectedStory[] = stories.data.map((story: Story) => {
                    return {
                        id: story.id,
                        label: story.name,
                        description: "",
                        target: ""
                    };
                });
                const selectedStory = await vscode.window.showQuickPick(
                    storiesSelectionList,
                    { placeHolder: 'Select the story you want to work on.' }) as SelectedStory;
                console.log("selected story:", selectedStory);
                vscode.window.showInformationMessage(`Selected story: ${selectedStory.label} (#${selectedStory.id})`);
            } catch(e) {
                vscode.window.showErrorMessage(`Impossible to get stories: ${e}`);
            }
        } else {
            vscode.window.showErrorMessage('Please set an API token first.');
        }
    });

    context.subscriptions.push(getStoriesFunction);
}

export function deactivate() {}
