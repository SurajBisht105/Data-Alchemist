export function generateSampleData() {
  const clients = [
    {
      ClientID: "C001",
      ClientName: "Acme Corp",
      PriorityLevel: 5,
      RequestedTaskIDs: ["T001", "T002", "T003"],
      GroupTag: "Enterprise",
      AttributesJSON: { industry: "Technology", size: "Large" }
    },
    {
      ClientID: "C002",
      ClientName: "Beta Industries",
      PriorityLevel: 3,
      RequestedTaskIDs: ["T004", "T005"],
      GroupTag: "SMB",
      AttributesJSON: { industry: "Manufacturing", size: "Medium" }
    }
  ];

  const workers = [
    {
      WorkerID: "W001",
      WorkerName: "John Smith",
      Skills: ["JavaScript", "React", "Node.js"],
      AvailableSlots: [1, 2, 3, 4, 5],
      MaxLoadPerPhase: 3,
      WorkerGroup: "Development",
      QualificationLevel: 4
    },
    {
      WorkerID: "W002",
      WorkerName: "Jane Doe",
      Skills: ["Python", "Data Analysis", "Machine Learning"],
      AvailableSlots: [2, 3, 4],
      MaxLoadPerPhase: 2,
      WorkerGroup: "Data Science",
      QualificationLevel: 5
    }
  ];

  const tasks = [
    {
      TaskID: "T001",
      TaskName: "Frontend Development",
      Category: "Development",
      Duration: 2,
      RequiredSkills: ["JavaScript", "React"],
      PreferredPhases: [1, 2, 3],
      MaxConcurrent: 2
    },
    {
      TaskID: "T002",
      TaskName: "API Integration",
      Category: "Development",
      Duration: 1,
      RequiredSkills: ["Node.js"],
      PreferredPhases: [2, 3, 4],
      MaxConcurrent: 1
    }
  ];

  return { clients, workers, tasks };
}