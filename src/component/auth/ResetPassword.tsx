"use client";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import React, { Suspense, useState } from "react";
import { Form, Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import {
  handleForgotPassword,
  handleForgotChangePassword,
} from "@/services/login";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const inputClasses = `h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden ring-0 focus:ring-1 focus:ring-brand-400 duration-200 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 `;

  interface ResetPasswordValues {
    email: string;
    password?: string;
    confirm_password?: string;
  }

  const initialValues: ResetPasswordValues = {
    email: "",
    password: "",
    confirm_password: "",
  };

  const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,}$/;

  const validationSchema = Yup.object().shape({
    email: token
      ? Yup.string()
      : Yup.string().email("Invalid email").required("Email is required"),
    password: token
      ? Yup.string()
          .matches(
            passwordRules,
            "Password must contain at least one uppercase, one lowercase, and one number",
          )
          .min(6, "Password must be at least 6 characters")
          .required("Password is required")
      : Yup.string(),
    confirm_password: token
      ? Yup.string()
          .oneOf([Yup.ref("password")], "Passwords must match")
          .required("Confirm Password is required")
      : Yup.string(),
  });

  function handleSubmit(
    values: ResetPasswordValues,
    formikHelpers: {
      resetForm: () => void;
      setSubmitting: (isSubmitting: boolean) => void;
    },
  ) {
    setSuccessMessage("");
    if (token) {
      handleForgotChangePassword({ token, password: values.password! })
        .then(() => {
          toast.success("Password changed successfully");
          router.push("/signin");
        })
        .catch((err: any) => {
          console.log("err", err);
          toast.error(
            err?.message?.response?.data?.error?.message ||
              "Something went wrong",
          );
        })
        .finally(() => formikHelpers.setSubmitting(false));
    } else {
      handleForgotPassword({ email: values.email })
        .then((res: any) => {
          const message =
            res?.data?.message ||
            res?.data?.data?.message ||
            "Password reset link sent to your email";
          setSuccessMessage(message);
          toast.success(message);
          formikHelpers.resetForm();
        })
        .catch((err: any) => {
          toast.error(err?.response?.data?.message || "Something went wrong");
        })
        .finally(() => formikHelpers.setSubmitting(false));
    }
  }

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <ToastContainer />
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto card-hover-3d-container">
        <div className="card-hover-3d bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-theme-xl border border-gray-100 dark:border-gray-800 my-6">
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              {token ? "Change Password" : "Forgot Password"}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {token
                ? "Enter your new password below."
                : "Enter your email to receive a password reset link."}
            </p>
            {successMessage && (
              <div className="mt-4 p-4 text-sm text-success-600 bg-success-50 border border-success-100 rounded-lg">
                {successMessage}
              </div>
            )}
          </div>
          <div>
            <Formik<ResetPasswordValues>
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, values }) => (
                <Form>
                  <div className="space-y-6">
                    {!token && (
                      <div>
                        <Label>
                          Email <span className="text-error-500">*</span>{" "}
                        </Label>
                        <Field
                          name="email"
                          className={inputClasses}
                          placeholder="info@gmail.com"
                          type="email"
                        />
                        <div className="text-error-500 text-xs mt-1">
                          <ErrorMessage name="email" />
                        </div>
                      </div>
                    )}

                    {token && (
                      <>
                        <div>
                          <Label>
                            New Password{" "}
                            <span className="text-error-500">*</span>{" "}
                          </Label>
                          <div className="relative">
                            <Field
                              name="password"
                              className={inputClasses}
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter your new password"
                            />
                            <span
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                            >
                              {showPassword ? (
                                <AiOutlineEye />
                              ) : (
                                <AiOutlineEyeInvisible />
                              )}
                            </span>
                          </div>
                          <div className="text-error-500 text-xs mt-1">
                            <ErrorMessage name="password" />
                          </div>
                        </div>
                        <div>
                          <Label>
                            Confirm Password{" "}
                            <span className="text-error-500">*</span>{" "}
                          </Label>
                          <div className="relative">
                            <Field
                              name="confirm_password"
                              className={inputClasses}
                              type={showPassword ? "text" : "password"}
                              placeholder="Confirm your new password"
                            />
                            <span
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                            >
                              {showPassword ? (
                                <AiOutlineEye />
                              ) : (
                                <AiOutlineEyeInvisible />
                              )}
                            </span>
                          </div>
                          <div className="text-error-500 text-xs mt-1">
                            <ErrorMessage name="confirm_password" />
                          </div>
                        </div>
                      </>
                    )}

                    <div className="flex items-center justify-end">
                      <Link
                        href="/signin"
                        className="text-sm text-brand-700 hover:text-brand-400 dark:text-brand-400 duration-200 hover:dark:text-brand-500"
                      >
                        Back to sign in
                      </Link>
                    </div>
                    <div>
                      <Button className="w-full" size="sm" type="submit">
                        {token ? "Change Password" : "Send Reset Link"}
                      </Button>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>

            <div className="mt-5">
              {/* <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Don&apos;t have an account? {""}
                <Link
                  href="/signup"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Sign Up
                </Link>
              </p> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
const ResetPasswordComponent = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <ResetPassword />
  </Suspense>
);

export default ResetPasswordComponent;
