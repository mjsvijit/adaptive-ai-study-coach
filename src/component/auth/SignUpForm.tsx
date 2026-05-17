"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Formik, Form, Field, FieldProps } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import Label from "../form/Label";
import InputField from "../form/input/InputField";
import Button from "../ui/button/Button";
import { handleAgentRegister } from "@/src/services/login";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Please confirm your password"),
  });

  const handleSubmit = (
    values: typeof initialValues,
    { setSubmitting }: any,
  ) => {
    handleAgentRegister(values)
      .then((res: any) => {
        // Set auth token cookie (7 days)
        const maxAgeSeconds = 60 * 60 * 24 * 7;
        document.cookie = `auth_token=${res.jwt}; path=/; max-age=${maxAgeSeconds}`;

        // Save to local storage for persistence
        localStorage.setItem("token", res.jwt);
        localStorage.setItem("user", JSON.stringify(res.user));

        toast.success("Account created successfully!");
        router.replace("/");
      })
      .catch((err: any) => {
        toast.error(
          err?.message?.response?.data?.error?.message || "Registration failed",
        );
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full overflow-y-auto no-scrollbar">
      <div className="w-full max-w-md sm:pt-10 mx-auto mb-5 px-4">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          Back to dashboard
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto px-4">
        <div className="pb-10">
          <div className="mb-5 sm:mb-8 text-center sm:text-left">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign Up
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Create an account to start tracking your study goals.
            </p>
          </div>
          <div>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form>
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      {/* First Name */}
                      <div className="sm:col-span-1">
                        <Label htmlFor="firstName">
                          First Name<span className="text-error-500">*</span>
                        </Label>
                        <Field name="firstName">
                          {({ field, meta }: FieldProps) => (
                            <InputField
                              {...field}
                              placeholder="First name"
                              error={meta.touched && !!meta.error}
                              hint={
                                meta.touched && meta.error
                                  ? (meta.error as string)
                                  : ""
                              }
                            />
                          )}
                        </Field>
                      </div>
                      {/* Last Name */}
                      <div className="sm:col-span-1">
                        <Label htmlFor="lastName">
                          Last Name<span className="text-error-500">*</span>
                        </Label>
                        <Field name="lastName">
                          {({ field, meta }: FieldProps) => (
                            <InputField
                              {...field}
                              placeholder="Last name"
                              error={meta.touched && !!meta.error}
                              hint={
                                meta.touched && meta.error
                                  ? (meta.error as string)
                                  : ""
                              }
                            />
                          )}
                        </Field>
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <Label htmlFor="email">
                        Email<span className="text-error-500">*</span>
                      </Label>
                      <Field name="email">
                        {({ field, meta }: FieldProps) => (
                          <InputField
                            {...field}
                            type="email"
                            placeholder="Enter your email"
                            error={meta.touched && !!meta.error}
                            hint={
                              meta.touched && meta.error
                                ? (meta.error as string)
                                : ""
                            }
                          />
                        )}
                      </Field>
                    </div>

                    {/* Password */}
                    <div>
                      <Label htmlFor="password">
                        Password<span className="text-error-500">*</span>
                      </Label>
                      <div className="relative">
                        <Field name="password">
                          {({ field, meta }: FieldProps) => (
                            <>
                              <InputField
                                {...field}
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                error={meta.touched && !!meta.error}
                                hint={
                                  meta.touched && meta.error
                                    ? (meta.error as string)
                                    : ""
                                }
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute z-30 cursor-pointer right-4 top-[22px] -translate-y-1/2 text-xs font-semibold text-gray-500 hover:text-brand-500"
                              >
                                {showPassword ? "Hide" : "Show"}
                              </button>
                            </>
                          )}
                        </Field>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <Label htmlFor="confirmPassword">
                        Confirm Password
                        <span className="text-error-500">*</span>
                      </Label>
                      <div className="relative">
                        <Field name="confirmPassword">
                          {({ field, meta }: FieldProps) => (
                            <>
                              <InputField
                                {...field}
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm your password"
                                error={meta.touched && !!meta.error}
                                hint={
                                  meta.touched && meta.error
                                    ? (meta.error as string)
                                    : ""
                                }
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  setShowConfirmPassword(!showConfirmPassword)
                                }
                                className="absolute z-30 cursor-pointer right-4 top-[22px] -translate-y-1/2 text-xs font-semibold text-gray-500 hover:text-brand-500"
                              >
                                {showConfirmPassword ? "Hide" : "Show"}
                              </button>
                            </>
                          )}
                        </Field>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                      <Button
                        className="w-full"
                        type="submit"
                        disabled={isSubmitting}
                        variant="outline"
                      >
                        {isSubmitting ? "Creating account..." : "Sign Up"}
                      </Button>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Already have an account?{" "}
                <Link
                  href="/signin"
                  className="text-brand-500 font-semibold hover:text-brand-600 dark:text-brand-400"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
