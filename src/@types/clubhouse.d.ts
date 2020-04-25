interface Story {
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

interface StorySearchResults {
    cursors: string[]
    data: Story[]
    next: string | null
    total: number
}

interface Project {
    abbreviation: string
    app_url: string
    archived: boolean
    color: string
    created_at: string
    days_to_thermometer: number
    description: string
    entity_type: string
    external_id: string
    follower_ids: string[]
    id: number
    iteration_length: number
    name: string
    show_thermometer: boolean
    start_time: string
    stats: object
    team_id: number
    updated_at: string
}
