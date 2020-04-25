import * as vscode from 'vscode';
import Clubhouse from './clubhouse';

export function activate(context: vscode.ExtensionContext) {
    const defaultProject: SelectedMenuItem = {
        id: 0,
        label: 'All projects',
        description: '',
        target: '',
    };

    // Create a status bar item with the selected story label
    let statusBarCurrentStory: vscode.StatusBarItem;
    statusBarCurrentStory = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
    statusBarCurrentStory.command = 'vscode-clubhouse.getStories';
    const currentStory: StatusBarStory | undefined = context.workspaceState.get("vs-code.clubhouse.current_story");
    setStatusBar(currentStory, statusBarCurrentStory, context.workspaceState);
    statusBarCurrentStory.show();
    context.subscriptions.push(statusBarCurrentStory);

    const setApiTokenFuntion = vscode.commands.registerCommand('vscode-clubhouse.setApiToken', async () => {
        // Ask for an API token
        const apiToken = await vscode.window.showInputBox();

        // TODO Manage cancellation
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
                await vscode.workspace.getConfiguration().update('vscode-clubhouse.enabled', true, target.target);
            }
        } else {
            await vscode.workspace.getConfiguration().update('vscode-clubhouse.api_token', apiToken, vscode.ConfigurationTarget.Global);
            await vscode.workspace.getConfiguration().update('vscode-clubhouse.enabled', true, vscode.ConfigurationTarget.Global);
        }

        vscode.window.showInformationMessage('Clubhouse API token saved!');
    });
    context.subscriptions.push(setApiTokenFuntion);

    const getProjectsFunction = vscode.commands.registerCommand('vscode-clubhouse.getProjects', async () => {
        const apiToken = await vscode.workspace.getConfiguration().get('vscode-clubhouse.api_token');
        if (apiToken) {
            const clubhouse = new Clubhouse(apiToken as string);
            let projects: Project[];
            try {
                projects = await clubhouse.getAllProjects();
                const projectsSelectionList: SelectedMenuItem[] = projects.map((project: Project) => {
                    return {
                        id: project.id,
                        label: project.name,
                        description: `ID ${project.id}`,
                        target: '',
                    };
                });
                projectsSelectionList.push(defaultProject);
                const selectedProject = await vscode.window.showQuickPick(
                    projectsSelectionList,
                    { placeHolder: 'Select the project you want to work on.' }) as SelectedMenuItem;
                context.workspaceState.update('vs-code.clubhouse.current_project', {
                    id: selectedProject.id,
                    label: selectedProject.label,
                    description: '',
                    target: '',
                });
            } catch(e) {
                vscode.window.showErrorMessage(`Impossible to get stories: ${e}`);
            }
        } else {
            vscode.window.showErrorMessage('Please set an API token first.');
        }
    });
    context.subscriptions.push(getProjectsFunction);

    const getStoriesFunction = vscode.commands.registerCommand('vscode-clubhouse.getStories', async () => {
        const apiToken = await vscode.workspace.getConfiguration().get('vscode-clubhouse.api_token');
        if (apiToken) {
            const clubhouse = new Clubhouse(apiToken as string);
            let stories: StorySearchResults;
            const project: SelectedMenuItem = context.workspaceState.get('vs-code.clubhouse.current_project') || defaultProject;
            const nbr_items_to_display = await vscode.workspace.getConfiguration().get('vscode-clubhouse.nbr_items_to_display') as number;
            try {
                stories = await clubhouse.getStories(project, nbr_items_to_display);
                const storiesSelectionList: SelectedMenuItem[] = stories.data.map((story: Story) => {
                    return {
                        id: story.id,
                        label: story.name,
                        description: `ID ${story.id}`,
                        target: "",
                    };
                });
                const selectedStory = await vscode.window.showQuickPick(
                    storiesSelectionList,
                    { placeHolder: 'Select the story you want to work on.' }) as SelectedMenuItem;
                setStatusBar({
                    id: selectedStory.id,
                    label_short: truncateStr(selectedStory.label),
                    label_long: selectedStory.label
                }, statusBarCurrentStory, context.workspaceState);
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

function setStatusBar(story: StatusBarStory | undefined, statusBar: vscode.StatusBarItem, workspaceState: vscode.Memento) {
    if (story) {
        statusBar.text = `[CH${story.id}] ${story.label_short}`;
        statusBar.tooltip = story.label_long;

        workspaceState.update('vs-code.clubhouse.current_story', {
            id: story.id,
            label_short: story.label_short,
            label_long: story.label_long,
        });
    } else {
        statusBar.text = 'CH: No story selected';
    }
}

function truncateStr(str: string, maxSize = 30): string {
    if (str.length > 30) {
        return `${str.substr(0, maxSize)}...`;
    }
    return str;
}
