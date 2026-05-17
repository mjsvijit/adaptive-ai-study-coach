"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, FieldProps } from "formik";
import * as Yup from "yup";
import { addGoal } from "@/src/services/studyGoalService";
import InputField from "@/src/component/form/input/InputField";
import TextArea from "@/src/component/form/input/TextArea";
import Select from "@/src/component/form/Select";
import Label from "@/src/component/form/Label";
import Button from "@/src/component/ui/button/Button";
import { toast, ToastContainer } from "react-toastify";

const validationSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  topic: Yup.string().required("Topic is required"),
  category: Yup.string()
    .oneOf(["Programming", "AI", "Math"])
    .required("Category is required"),
  skillLevel: Yup.string()
    .oneOf(["Beginner", "Intermediate", "Advanced"])
    .required("Skill level is required"),
  targetDate: Yup.date().required("Target date is required"),
  estimatedHours: Yup.number()
    .min(1, "Must be at least 1 hour")
    .required("Estimated hours are required"),
  progress: Yup.number()
    .min(0)
    .max(100, "Progress cannot exceed 100%")
    .required("Progress is required"),
  study_status: Yup.string()
    .oneOf(["Active", "Completed", "Paused"])
    .required("Status is required"),
  priority: Yup.string()
    .oneOf(["Low", "Medium", "High"])
    .required("Priority is required"),
});

const initialValues = {
  title: "",
  description: "",
  topic: "",
  category: "" as "Programming" | "AI" | "Math",
  skillLevel: "" as "Beginner" | "Intermediate" | "Advanced",
  targetDate: "",
  estimatedHours: 0,
  progress: 0,
  study_status: "" as "Active" | "Completed" | "Paused",
  priority: "" as "Low" | "Medium" | "High",
};

export default function AddGoalPage() {
  const router = useRouter();

  const handleSubmit = (
    values: any,
    { setSubmitting }: any,
  ) => {
    const payload = {
      ...values,
      publishedAt: new Date().toISOString(),
    };
    addGoal(payload)
      .then((res: any) => {
        toast.success("Goals added successfully");
        router.push("/goals");
      })
      .catch((err: any) => {
        console.log("err", err);
        toast.error("Something went wrong");
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <ToastContainer />
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Add New Study Goal
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Define a new learning objective to track your progress.
        </p>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm dark:bg-white/[0.03] dark:border-gray-800 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-1 md:col-span-2">
                <Label htmlFor="title">Goal Title *</Label>
                <Field name="title">
                  {({ field, meta }: FieldProps) => (
                    <InputField
                      id="title"
                      placeholder="e.g., Learn Advanced React Patterns"
                      {...field}
                      error={meta.touched && Boolean(meta.error)}
                      hint={(meta.touched && meta.error) as string}
                    />
                  )}
                </Field>
              </div>

              <div className="col-span-1 md:col-span-2">
                <Label htmlFor="description">Description *</Label>
                <Field name="description">
                  {({ field, form, meta }: FieldProps) => (
                    <TextArea
                      placeholder="Explain what you want to achieve..."
                      value={field.value}
                      onChange={(val) => form.setFieldValue(field.name, val)}
                      error={meta.touched && Boolean(meta.error)}
                      hint={(meta.touched && meta.error) as string}
                      rows={4}
                    />
                  )}
                </Field>
              </div>

              <div className="col-span-1">
                <Label htmlFor="topic">Topic *</Label>
                <Field name="topic">
                  {({ field, meta }: FieldProps) => (
                    <InputField
                      id="topic"
                      placeholder="e.g., Frontend Development"
                      {...field}
                      error={meta.touched && Boolean(meta.error)}
                      hint={(meta.touched && meta.error) as string}
                    />
                  )}
                </Field>
              </div>

              <div className="col-span-1">
                <Label htmlFor="category">Category *</Label>
                <Field name="category">
                  {({ field, form, meta }: FieldProps) => (
                    <>
                      <Select
                        options={[
                          { value: "Programming", label: "Programming" },
                          { value: "AI", label: "AI" },
                          { value: "Math", label: "Math" },
                        ]}
                        defaultValue={field.value}
                        onChange={(val) => form.setFieldValue(field.name, val)}
                      />
                      {meta.touched && meta.error && (
                        <p className="mt-1.5 text-xs text-error-500">
                          {meta.error as string}
                        </p>
                      )}
                    </>
                  )}
                </Field>
              </div>

              <div className="col-span-1">
                <Label htmlFor="skillLevel">Skill Level *</Label>
                <Field name="skillLevel">
                  {({ field, form, meta }: FieldProps) => (
                    <>
                      <Select
                        options={[
                          { value: "Beginner", label: "Beginner" },
                          { value: "Intermediate", label: "Intermediate" },
                          { value: "Advanced", label: "Advanced" },
                        ]}
                        defaultValue={field.value}
                        onChange={(val) => form.setFieldValue(field.name, val)}
                      />
                      {meta.touched && meta.error && (
                        <p className="mt-1.5 text-xs text-error-500">
                          {meta.error as string}
                        </p>
                      )}
                    </>
                  )}
                </Field>
              </div>

              <div className="col-span-1">
                <Label htmlFor="targetDate">Target Date *</Label>
                <Field name="targetDate">
                  {({ field, meta }: FieldProps) => (
                    <InputField
                      type="date"
                      id="targetDate"
                      {...field}
                      error={meta.touched && Boolean(meta.error)}
                      hint={(meta.touched && meta.error) as string}
                    />
                  )}
                </Field>
              </div>

              <div className="col-span-1">
                <Label htmlFor="estimatedHours">Estimated Hours *</Label>
                <Field name="estimatedHours">
                  {({ field, meta }: FieldProps) => (
                    <InputField
                      type="number"
                      id="estimatedHours"
                      min="1"
                      {...field}
                      error={meta.touched && Boolean(meta.error)}
                      hint={(meta.touched && meta.error) as string}
                    />
                  )}
                </Field>
              </div>

              <div className="col-span-1">
                <Label htmlFor="progress">Current Progress (%) *</Label>
                <Field name="progress">
                  {({ field, meta }: FieldProps) => (
                    <InputField
                      type="number"
                      id="progress"
                      min="0"
                      max="100"
                      {...field}
                      error={meta.touched && Boolean(meta.error)}
                      hint={(meta.touched && meta.error) as string}
                    />
                  )}
                </Field>
              </div>

              <div className="col-span-1">
                <Label htmlFor="status">Status *</Label>
                <Field name="study_status">
                  {({ field, form, meta }: FieldProps) => (
                    <>
                      <Select
                        options={[
                          { value: "Active", label: "Active" },
                          { value: "Paused", label: "Paused" },
                          { value: "Completed", label: "Completed" },
                        ]}
                        defaultValue={field.value}
                        onChange={(val) => form.setFieldValue(field.name, val)}
                      />
                      {meta.touched && meta.error && (
                        <p className="mt-1.5 text-xs text-error-500">
                          {meta.error as string}
                        </p>
                      )}
                    </>
                  )}
                </Field>
              </div>

              <div className="col-span-1">
                <Label htmlFor="priority">Priority *</Label>
                <Field name="priority">
                  {({ field, form, meta }: FieldProps) => (
                    <>
                      <Select
                        options={[
                          { value: "Low", label: "Low" },
                          { value: "Medium", label: "Medium" },
                          { value: "High", label: "High" },
                        ]}
                        defaultValue={field.value}
                        onChange={(val) => form.setFieldValue(field.name, val)}
                      />
                      {meta.touched && meta.error && (
                        <p className="mt-1.5 text-xs text-error-500">
                          {meta.error as string}
                        </p>
                      )}
                    </>
                  )}
                </Field>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
              <Button
                variant="outline"
                onClick={() => router.push("/goals")}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="outline"
                className="bg-primary-500 text-white "
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Goal"}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
