// data/goalsData.js

export const initialGoals = [
  {
    id: 1,
    text: "Finish writing summary",
    isCompleted: false,
    subgoals: [
      { id: 1, text: "Draft intro", isCompleted: false },
      { id: 2, text: "Add references", isCompleted: false }
    ]
  },
  {
    id: 2,
    text: "Take a 5 min break",
    isCompleted: false,
    subgoals: [
      { id: 1, text: "Stretch body", isCompleted: false },
      { id: 2, text: "Drink water", isCompleted: false }
    ]
  },
  {
    id: 3,
    text: "Plan next session",
    isCompleted: false,
    subgoals: []
  }
];
