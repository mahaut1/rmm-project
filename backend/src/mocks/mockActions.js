export const mockActions = [
  {
    action_id: "act-001",
    agent_id: "a9b1-0001",
    type: "run_command",
    payload: {
      command: "uptime"
    },
    status: "done",
    created_at: "2026-01-13T08:00:00Z",
    completed_at: "2026-01-13T08:00:02Z"
  },
  {
    action_id: "act-002",
    agent_id: "a9b1-0001",
    type: "reboot",
    payload: {},
    status: "running",
    created_at: "2026-01-13T09:00:00Z",
    completed_at: null
  },
  {
    action_id: "act-003",
    agent_id: "a9b1-0002",
    type: "run_command",
    payload: {
      command: "df -h"
    },
    status: "failed",
    created_at: "2026-01-12T16:30:00Z",
    completed_at: "2026-01-12T16:30:05Z"
  }
];
