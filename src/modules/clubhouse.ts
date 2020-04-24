import { Response } from "node-fetch";

const fetch = require("node-fetch");

export interface Story {
    app_url: string
    archived: boolean
    blocked: boolean
    blocker: boolean
    branches: any[]
    comments: any[]
    commits: any[]
    completed: boolean
    completed_at: string | null
    completed_at_override: string | null
    created_at: string
    cycle_time: number
    deadline: string | null
    description: string
    entity_type: string
    epic_id: number | null
    estimate: number | null
    external_id: string | null
    external_tickets: any[]
    files: any[]
    follower_ids: any[]
    group_mention_ids: any[]
    id: number
    iteration_id: number | null
    labels: any[]
    lead_time: number
    linked_files: any[]
    member_mention_ids: any[]
    mention_ids: any[]
    moved_at: string | null
    name: string
    owner_ids: any[]
    position: number
    previous_iteration_ids: number[]
    project_id: number
    pull_requests: any[]
    requested_by_id: string
    started: boolean
    started_at: string | null
    started_at_override: string | null
    stats: any
    story_links: any[]
    story_type: string
    tasks: any[]
    updated_at: string | null
    workflow_state_id: number
}

export interface StorySearchResults {
    cursors: string[]
    data: Story[]
    next: string | null
    total: number
}

export class Clubhouse {
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

    public async getStories(search: string, nbr_stories = 10): Promise<StorySearchResults> {
        return await fetch(`https://api.clubhouse.io/api/v3/search/stories?token=${this.apiToken}&query=${encodeURIComponent(search)}&page_size=${nbr_stories}`)
            .then(this.checkStatus)
            .then((res: Response) => res.json());
    }
}
