"use client";
import React, { useEffect, useState } from "react";
import {
  HiOutlineSearch,
  HiTrendingUp,
  HiFlag,
  HiCheckCircle,
  HiPlus,
} from "react-icons/hi";
import { getGoals, StudyGoal } from "@/src/services/studyGoalService";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBullseye, faClock, faStar } from "@fortawesome/free-solid-svg-icons";
import Button from "@/src/component/ui/button/Button";

export default function Ecommerce() {
  const [isClient, setIsClient] = useState(false);

  const [goals, setGoals] = useState<StudyGoal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsClient(true);
    const fetchGoals = async () => {
      try {
        const data = await getGoals();
        setGoals(data);
      } catch (error) {
        console.error("Failed to fetch goals", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGoals();
  }, []);

  const activeGoals = goals.filter((g) => g.study_status === "Active");
  const avgProgress =
    goals.length > 0
      ? Math.round(
          goals.reduce((acc, curr) => acc + curr.progress, 0) / goals.length,
        )
      : 0;
  const completedGoals = goals.filter(
    (g) => g.study_status === "Completed" || g.progress === 100,
  ).length;

  if (!isClient) return null;

  return (
    <div className="space-y-8 p-0">
      {/* Dashboard Header */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white sm:text-3xl">
            My Learning Dashboard
          </h1>
          <p className="mt-2 text-sm font-medium text-gray-500 dark:text-gray-400">
            Keep track of your study goals and progress.
          </p>
        </div>

        <div className="relative w-full max-w-sm lg:w-50">
          <Link href="/goals/add">
            <Button startIcon={<HiPlus />} variant="outline">
              Add New Goal
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-gray-100 dark:bg-white/[0.03] dark:border-gray-800">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400">
              <HiTrendingUp size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Average Progress
              </p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {avgProgress}%
              </h3>
            </div>
          </div>
          <div className="mt-4 h-1 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 transition-all duration-500"
              style={{ width: `${avgProgress}%` }}
            ></div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-gray-100 dark:bg-white/[0.03] dark:border-gray-800">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400">
              <HiCheckCircle size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Goals Completed
              </p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {completedGoals}
              </h3>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-gray-100 dark:bg-white/[0.03] dark:border-gray-800">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400">
              <HiFlag size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Goals
              </p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {goals.length}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Active Goals Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Active Goals
          </h2>
          <Link
            href="/goals"
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
          >
            View All
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-48 animate-pulse rounded-2xl bg-gray-100 dark:bg-white/[0.03]"
              ></div>
            ))}
          </div>
        ) : activeGoals.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {activeGoals.map((goal) => (
              <Link
                key={goal.id}
                href={`/goals/${goal.documentId}`}
                className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-gray-100 transition-all hover:shadow-md hover:border-indigo-100 dark:bg-white/[0.03] dark:border-gray-800 dark:hover:border-indigo-900/40"
              >
                <div className="flex flex-col h-full justify-between gap-4">
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400">
                          <FontAwesomeIcon icon={faBullseye} size="xs" />
                        </div>
                        <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {goal.title}
                        </h3>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                          goal.priority === "High"
                            ? "bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400"
                            : goal.priority === "Medium"
                              ? "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400"
                              : "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400"
                        }`}
                      >
                        {goal.priority}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                      {goal.description}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        Progress
                      </span>
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">
                        {goal.progress}%
                      </span>
                    </div>

                    {/* Segmented Progress bar lookalike */}
                    <div className="flex h-2.5 gap-1 w-full bg-gray-50 dark:bg-gray-800/50 rounded-full p-0.5 overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-700 ease-out"
                        style={{ width: `${goal.progress}%` }}
                      ></div>
                    </div>

                    <div className="flex items-center gap-4 pt-1">
                      <div className="flex items-center gap-1.5 text-[10px] text-gray-500 dark:text-gray-400">
                        <FontAwesomeIcon icon={faClock} />
                        <span>{goal.estimatedHours}h estimated</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-gray-500 dark:text-gray-400">
                        <FontAwesomeIcon icon={faStar} />
                        <span>{goal.skillLevel}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 p-12 dark:border-gray-800">
            <p className="text-gray-500 dark:text-gray-400">
              No active goals found.
            </p>
            <Link
              href="/goals/add"
              className="mt-4 text-sm font-bold text-indigo-600 hover:underline"
            >
              Create your first goal
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
