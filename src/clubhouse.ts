import fetch, { Response } from "node-fetch";

export default class Clubhouse {
    private apiToken: string;

    constructor(apiToken: string) {
        this.apiToken = apiToken;
    }

    private checkStatus(res: Response) {
        if (res.ok) {
            return res;
        } else {
            throw Error(res.statusText);
        }
    }

    public async getStories(project: SelectedMenuItem, nbr_stories: number): Promise<StorySearchResults> {
        let search = '';
        if (project.id !== 0) {
            search = `project:${project.label}`;
        }
        return await fetch(`https://api.clubhouse.io/api/v3/search/stories?token=${this.apiToken}&query=${encodeURIComponent(search)}&page_size=${nbr_stories}`)
            .then(this.checkStatus)
            .then((res: Response) => res.json());
    }

    public async getAllProjects(): Promise<Project[]> {
        return await fetch(`https://api.clubhouse.io/api/v3/projects?token=${this.apiToken}`)
            .then(this.checkStatus)
            .then((res: Response) => res.json());
    }
}
