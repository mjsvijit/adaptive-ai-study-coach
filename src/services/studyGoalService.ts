import axiosInstance from "../axios/axios-instance";

export interface StudyGoal {
  id: string;
  title: string;
  description: string;
  topic: string;
  category?: "Programming" | "AI" | "Math";
  skillLevel?: "Beginner" | "Intermediate" | "Advanced";
  targetDate: string;
  estimatedHours: number;
  progress: number;
  study_status?: "Active" | "Completed" | "Paused";
  priority?: "Low" | "Medium" | "High";
  createdAt: string;
  documentId?: string;
  milestones?: { week: number; goal: string }[];
  studyPlan?: string;
  resources?: { title: string; url: string }[];
  publishedAt?: string;
}

export function getDashboardStats() {
  return new Promise(async (resolve, reject) => {
    try {
      let response: any = await axiosInstance.get(
        `${process.env["NEXT_PUBLIC_API_URL"]}/dashboard`,
      );
      resolve(response.data);
    } catch (error: any) {
      reject({ message: error?.message || "Failed to fetch dashboard stats" });
    }
  });
}

export const getGoals = (): Promise<StudyGoal[]> => {
  return new Promise(async (resolve, reject) => {
    try {
      const response: any = await axiosInstance.get(
        `${process.env["NEXT_PUBLIC_API_URL"]}/study-goals`,
      );
      resolve(response.data);
    } catch (error: any) {
      reject({ message: error?.message || "Failed to fetch goals" });
    }
  });
};

export const getGoalById = (id: string): Promise<StudyGoal> => {
  return new Promise(async (resolve, reject) => {
    try {
      const response: any = await axiosInstance.get(
        `${process.env["NEXT_PUBLIC_API_URL"]}/study-goals/${id}`,
      );
      resolve(response.data);
    } catch (error: any) {
      reject({ message: error?.message || "Failed to fetch goal" });
    }
  });
};

export const addGoal = (
  goal: Omit<StudyGoal, "id" | "createdAt">,
): Promise<StudyGoal> => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("Sending payload to Strapi:", { data: goal });
      const response: any = await axiosInstance.post(
        `${process.env["NEXT_PUBLIC_API_URL"]}/study-goals`,
        { data: goal },
      );
      resolve(response.data);
    } catch (error: any) {
      reject({ message: error?.message || "Failed to add goal" });
    }
  });
};

export const updateGoal = (
  id: string,
  updates: Partial<StudyGoal>,
): Promise<StudyGoal> => {
  return new Promise(async (resolve, reject) => {
    try {
      const response: any = await axiosInstance.put(
        `${process.env["NEXT_PUBLIC_API_URL"]}/study-goals/${id}`,
        { data: updates },
      );
      resolve(response.data);
    } catch (error: any) {
      reject({ message: error?.message || "Failed to update goal" });
    }
  });
};

export const deleteGoal = (id: string): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    try {
      await axiosInstance.delete(
        `${process.env["NEXT_PUBLIC_API_URL"]}/study-goals/${id}`,
      );
      resolve();
    } catch (error: any) {
      reject({ message: error?.message || "Failed to delete goal" });
    }
  });
};
