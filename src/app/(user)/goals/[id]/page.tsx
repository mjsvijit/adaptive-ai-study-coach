"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  StudyGoal,
  getGoalById,
  updateGoal,
} from "@/src/services/studyGoalService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Badge from "@/src/component/ui/badge/Badge";
import Button from "@/src/component/ui/button/Button";
import {
  HiArrowLeft,
  HiCalendar,
  HiClock,
  HiCollection,
  HiStar,
  HiLightningBolt,
  HiLink,
  HiCheckCircle,
  HiBookOpen,
} from "react-icons/hi";

export default function GoalDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [goal, setGoal] = useState<StudyGoal | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const fetchGoal = async () => {
      if (id && typeof id === "string") {
        getGoalById(id)
          .then((res: any) => {
            console.log("res", res);
            setGoal(res);
          })
          .catch((err) => {
            console.log("err", err);
          });
      }
    };
    fetchGoal();
  }, [id]);

  const handleProgressUpdate = async (newProgress: number) => {
    if (id && typeof id === "string") {
      try {
        await updateGoal(id, { progress: newProgress });
        setGoal((prev) => (prev ? { ...prev, progress: newProgress } : null));
        toast.success(`Progress updated to ${newProgress}%`);
      } catch (error) {
        console.error("Failed to update progress", error);
        toast.error("Failed to update progress");
      }
    }
  };

  if (!isClient) return null;

  if (!goal) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Goal not found
        </h2>
        <p className="mt-2 text-gray-500">
          The study goal you are looking for does not exist.
        </p>
        <Button
          className="mt-6"
          onClick={() => router.push("/goals")}
          startIcon={<HiArrowLeft />}
        >
          Back to Goals
        </Button>
      </div>
    );
  }

  const getStatusColor = (status: StudyGoal["study_status"]) => {
    switch (status) {
      case "Active":
        return "success";
      case "Completed":
        return "primary";
      case "Paused":
        return "warning";
      default:
        return "light";
    }
  };

  const getPriorityColor = (priority: StudyGoal["priority"]) => {
    switch (priority) {
      case "High":
        return "error";
      case "Medium":
        return "warning";
      case "Low":
        return "success";
      default:
        return "light";
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <ToastContainer />
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/goals")}
            className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full dark:text-gray-400 dark:hover:bg-white/[0.05] dark:hover:text-white transition"
          >
            <HiArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {goal.title}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2 mt-1">
              <HiCollection className="w-4 h-4" /> {goal.topic}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge color={getStatusColor(goal.study_status)} size="md">
            {goal.study_status}
          </Badge>
          <Badge
            color={getPriorityColor(goal.priority)}
            variant="light"
            size="md"
          >
            {goal.priority} Priority
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm dark:bg-white/[0.03] dark:border-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Description
            </h3>
            <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
              {goal.description}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm dark:bg-white/[0.03] dark:border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Progress
              </h3>
              <span className="text-lg font-bold text-success-600 dark:text-success-400">
                {goal.progress}%
              </span>
            </div>
            <div className="space-y-4">
              <div className="w-full bg-gray-100 rounded-xl p-1 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                <div className="flex w-full h-8 bg-gray-200 rounded-lg overflow-hidden dark:bg-gray-700">
                  {goal.milestones && goal.milestones.length > 0 ? (
                    goal.milestones.map((milestone, index) => {
                      const segmentWidth = 100 / goal.milestones!.length;
                      const segmentEndValue = Math.round(
                        (index + 1) * segmentWidth,
                      );
                      const isCompleted = goal.progress >= segmentEndValue;
                      return (
                        <button
                          key={index}
                          className={`h-full cursor-pointer transition-all duration-300 border-r border-white/20 last:border-r-0 relative group flex-1 ${
                            isCompleted
                              ? "bg-green-500 hover:bg-green-600"
                              : "bg-gray-300 dark:bg-gray-600 hover:bg-brand-200 dark:hover:bg-brand-800"
                          }`}
                          onClick={() => handleProgressUpdate(segmentEndValue)}
                          title={`Click to set progress to ${segmentEndValue}% (Week ${milestone.week})`}
                        >
                          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap z-10 shadow-lg">
                            Week {milestone.week}: {segmentEndValue}%
                          </div>
                        </button>
                      );
                    })
                  ) : (
                    <div
                      className="bg-green-500 h-full transition-all duration-500"
                      style={{ width: `${goal.progress}%` }}
                    ></div>
                  )}
                </div>
              </div>
              <div className="flex justify-between px-2">
                {goal.milestones?.map((milestone, index) => (
                  <span
                    key={index}
                    className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider"
                  >
                    W{milestone.week}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {goal.studyPlan && (
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm dark:bg-white/[0.03] dark:border-gray-800">
              <div className="flex items-center gap-2 mb-4">
                <HiLightningBolt className="w-5 h-5 text-yellow-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Study Plan
                </h3>
              </div>
              <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                {goal.studyPlan}
              </div>
            </div>
          )}

          {goal.milestones && goal.milestones.length > 0 && (
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm dark:bg-white/[0.03] dark:border-gray-800">
              <div className="flex items-center gap-2 mb-4">
                <HiCheckCircle className="w-5 h-5 text-green-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Milestones
                </h3>
              </div>
              <div className="space-y-4">
                {goal.milestones.map((milestone, index) => (
                  <div key={index} className="flex gap-4 items-start">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center text-brand-600 dark:text-brand-400 font-bold text-sm shrink-0">
                        {milestone.week}
                      </div>
                      {index !== goal.milestones!.length - 1 && (
                        <div className="w-px h-full bg-gray-200 dark:bg-gray-800 mt-2 min-h-[20px]"></div>
                      )}
                    </div>
                    <div className="pt-1.5">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Week {milestone.week}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {milestone.goal}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {goal.resources && goal.resources.length > 0 && (
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm dark:bg-white/[0.03] dark:border-gray-800">
              <div className="flex items-center gap-2 mb-4">
                <HiBookOpen className="w-5 h-5 text-blue-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Recommended Resources
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {goal.resources.map((resource, index) => (
                  <a
                    key={index}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/[0.05] transition group"
                  >
                    <div className="p-2 bg-gray-50 dark:bg-white/[0.03] rounded text-gray-400 group-hover:text-brand-500 transition">
                      <HiLink className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition line-clamp-1">
                      {resource.title}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar details */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm dark:bg-white/[0.03] dark:border-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Details
            </h3>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-100 rounded-lg dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                  <HiCollection className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    Category
                  </p>
                  <p className="text-sm text-gray-900 dark:text-white font-medium">
                    {goal.category}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-100 rounded-lg dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                  <HiStar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    Skill Level
                  </p>
                  <p className="text-sm text-gray-900 dark:text-white font-medium">
                    {goal.skillLevel}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-100 rounded-lg dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                  <HiCalendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    Target Date
                  </p>
                  <p className="text-sm text-gray-900 dark:text-white font-medium">
                    {new Date(goal.targetDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-100 rounded-lg dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                  <HiClock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    Estimated Time
                  </p>
                  <p className="text-sm text-gray-900 dark:text-white font-medium">
                    {goal.estimatedHours} Hours
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
