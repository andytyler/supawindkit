import type { Activity } from "$lib/types";
import { writable } from "svelte/store";

// Initial activities state referencing the same structure from ActivityCanvas
const defaultActivities: Activity[] = [
  // {
  //   id: "1",
  //   title: "Project Overview",
  //   type: "document",
  //   group: "Documentation",
  //   content:
  //     "This document outlines the key objectives and milestones for our Q4 project initiatives.",
  //   position: { x: 100, y: 100 },
  //   zIndex: 1,
  //   config: {
  //     minWidth: "300px",
  //     gridSize: [24, 24],
  //   },
  // },
  // {
  //   id: "2",
  //   title: "Architecture Diagram",
  //   type: "image",
  //   group: "Technical",
  //   content: "https://picsum.photos/800/600",
  //   position: { x: 200, y: 200 },
  //   zIndex: 2,
  //   config: {
  //     minWidth: "200px",
  //     gridSize: [24, 24],
  //   },
  // },
  // {
  //   id: "3",
  //   title: "Meeting Notes",
  //   type: "note",
  //   group: "Planning",
  //   content:
  //     "Key decisions from today's planning meeting:\n- Finalized tech stack\n- Agreed on MVP scope\n- Set milestone dates\n- Assigned core responsibilities",
  //   position: { x: 300, y: 100 },
  //   zIndex: 3,
  //   config: {
  //     minWidth: "250px",
  //     gridSize: [24, 24],
  //     favicon: "https://mail.google.com/mail/u/0/#inbox",
  //   },
  // },
  // {
  //   id: "4",
  //   title: "Gmail",
  //   type: "email",
  //   group: "Communications",
  //   content: {
  //     to: "team@company.com",
  //     subject: "Weekly Progress Update",
  //     body: "Hi everyone,\n\nHere's a summary of what we accomplished this week:\n\n- Completed initial architecture design\n- Set up development environment\n- Started on core features\n\nLet me know if you have any questions!\n\nBest regards",
  //   },
  //   position: { x: 400, y: 300 },
  //   zIndex: 4,
  //   config: {
  //     minWidth: "350px",
  //     favicon: "https://mail.google.com/mail/u/0/#inbox",
  //     gridSize: [24, 24],
  //   },
  // },
];

// Load activities from localStorage on initialization
const storedActivities = typeof window !== 'undefined' 
  ? JSON.parse(localStorage.getItem('activities') || 'null') 
  : null;

export const activityStore = writable<Activity[]>(storedActivities || defaultActivities);

// Subscribe to changes and save to localStorage
if (typeof window !== 'undefined') {
  activityStore.subscribe(activities => {
    localStorage.setItem('activities', JSON.stringify(activities));
  });
}

// Helper functions to manipulate activities
export function updateActivityPosition(id: string, position: { x: number; y: number }) {
  activityStore.update(activities => 
    activities.map(activity => 
      activity.id === id ? { ...activity, position } : activity
    )
  );
}

export function updateActivityZIndex(id: string, zIndex: number) {
  activityStore.update(activities => 
    activities.map(activity => 
      activity.id === id ? { ...activity, zIndex } : activity
    )
  );
}

export function addActivity(activity: Activity) {
  activityStore.update(activities => [...activities, activity]);
}

export function removeActivity(id: string) {
  activityStore.update(activities => activities.filter(activity => activity.id !== id));
}

// Add these utility functions
export function updateActivityContent(id: string, content: string | { to: string; subject: string; body: string }) {
  activityStore.update(activities => 
    activities.map(activity => 
      activity.id === id ? { ...activity, content } : activity
    )
  );
}

export function updateActivityConfig(id: string, config: Partial<Activity['config']>) {
  activityStore.update(activities => 
    activities.map(activity => 
      activity.id === id ? { 
        ...activity, 
        config: { ...activity.config, ...config }
      } : activity
    )
  );
}
