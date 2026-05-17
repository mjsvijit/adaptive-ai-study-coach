"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { StudyGoal, getGoals } from "@/src/services/studyGoalService";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  tableWrapperClasses,
  tableHeaderClasses,
  tableHeaderCellClasses,
  tableRowNormalClasses,
  tableCellClasses,
  tableActionCellButtonWrapperClasses,
  previewbutton,
  tableActionDangerButtonClasses,
} from "@/src/component/ui/table";
import Badge from "@/src/component/ui/badge/Badge";
import Button from "@/src/component/ui/button/Button";
import { HiPlus, HiEye, HiTrash } from "react-icons/hi";
import { deleteGoal } from "@/src/services/studyGoalService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function StudyGoalsPage() {
  const [goals, setGoals] = useState<StudyGoal[]>([]);
  const [isClient, setIsClient] = useState(false);

  const fetchGoals = async () => {
    try {
      const data = await getGoals();
      setGoals(data);
    } catch (error) {
      console.error("Failed to fetch goals", error);
    }
  };

  useEffect(() => {
    setIsClient(true);
    fetchGoals();
  }, []);

  const handleDelete = async (documentId: string | undefined) => {
    if (!documentId) return;
    if (window.confirm("Are you sure you want to delete this goal?")) {
      try {
        await deleteGoal(documentId);
        toast.success("Goal deleted successfully");
        fetchGoals();
      } catch (error) {
        console.error("Failed to delete goal", error);
        toast.error("Failed to delete goal");
      }
    }
  };

  if (!isClient) return null;

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
    <div className="space-y-6">
      <ToastContainer />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Study Goals
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage and track your learning objectives.
          </p>
        </div>
        <Link href="/goals/add">
          <Button startIcon={<HiPlus />} variant="primary">
            Add New Goal
          </Button>
        </Link>
      </div>

      <div className={tableWrapperClasses}>
        <Table>
          <TableHeader className={tableHeaderClasses}>
            <TableRow>
              <TableCell isHeader className={tableHeaderCellClasses}>
                Title
              </TableCell>
              <TableCell isHeader className={tableHeaderCellClasses}>
                Category
              </TableCell>
              <TableCell isHeader className={tableHeaderCellClasses}>
                Target Date
              </TableCell>
              <TableCell isHeader className={tableHeaderCellClasses}>
                Progress
              </TableCell>
              <TableCell isHeader className={tableHeaderCellClasses}>
                Status
              </TableCell>
              <TableCell isHeader className={tableHeaderCellClasses}>
                Priority
              </TableCell>
              <TableCell isHeader className={tableHeaderCellClasses}>
                Actions
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {goals.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-gray-500"
                >
                  No study goals found. Create one to get started!
                </TableCell>
              </TableRow>
            ) : (
              goals.map((goal) => (
                <TableRow key={goal.id} className={tableRowNormalClasses}>
                  <TableCell className={tableCellClasses}>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {goal.title}
                    </span>
                  </TableCell>
                  <TableCell className={tableCellClasses}>
                    {goal.category}
                  </TableCell>
                  <TableCell className={tableCellClasses}>
                    {new Date(goal.targetDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell className={tableCellClasses}>
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div
                          className="bg-success-500 h-2.5 rounded-full"
                          style={{ width: `${goal.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs">{goal.progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell className={tableCellClasses}>
                    <Badge color={getStatusColor(goal.study_status)}>
                      {goal.study_status}
                    </Badge>
                  </TableCell>
                  <TableCell className={tableCellClasses}>
                    <Badge
                      color={getPriorityColor(goal.priority)}
                      variant="light"
                    >
                      {goal.priority}
                    </Badge>
                  </TableCell>
                  <TableCell className={tableCellClasses}>
                    <div className={tableActionCellButtonWrapperClasses}>
                      <Link href={`/goals/${goal.documentId}`}>
                        <button className={previewbutton} title="View Details">
                          <HiEye className="w-5 h-5" />
                        </button>
                      </Link>
                      <button
                        className={tableActionDangerButtonClasses}
                        title="Delete Goal"
                        onClick={() => handleDelete(goal.documentId)}
                      >
                        <HiTrash className="w-5 h-5" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
