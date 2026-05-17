"use client";
import Link from "next/link";
import { useState } from "react";
import { Form, Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Checkbox from "../form/input/Checkbox";
import Label from "../form/Label";
import Button from "../ui/button/Button";
import { handleAgentLogin } from "@/src/services/login";
export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const inputClasses = `h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden ring-0 focus:ring-1 focus:ring-brand-400 duration-200 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 `;

  interface LoginFormValues {
    email_address: string;
    password: string;
  }

  const initialValues: LoginFormValues = {
    email_address: "",
    password: "",
  };

  function handleSubmit(
    values: LoginFormValues,
    formikHelpers: {
      resetForm: () => void;
      setSubmitting: (isSubmitting: boolean) => void;
    },
  ) {
    handleAgentLogin(values)
      .then((res: any) => {
        formikHelpers.resetForm();
        const expiresIn = 7 * 24 * 60 * 60; // 604800 seconds
        document.cookie = `auth_token=${res.jwt}; path=/; max-age=${expiresIn}`;
        localStorage.setItem("user", JSON.stringify(res?.user));
        localStorage.setItem("token", res?.jwt);
        window.location.href = "/";
        toast.success("Login successful");
      })
      .catch((err: any) => {
        toast.error(
          err?.message?.response?.data?.error?.message || "Login failed",
        );
      });
  }

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <ToastContainer />
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to sign in!
            </p>
          </div>
          <div>
            <Formik<LoginFormValues>
              initialValues={initialValues}
              validationSchema={Yup.object({
                email_address: Yup.string()
                  .email("Invalid email id")
                  .required("Email id is required"),

                password: Yup.string().required("Password is required"),
              })}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, values }) => (
                <Form>
                  <div className="space-y-6">
                    <div>
                      <Label>
                        Email <span className="text-error-500">*</span>{" "}
                      </Label>
                      <Field
                        name="email_address"
                        className={inputClasses}
                        placeholder="info@gmail.com"
                        type="email"
                      />
                      <div className="text-error-500 text-xs mt-1">
                        <ErrorMessage name="email_address" />
                      </div>
                    </div>
                    <div>
                      <Label>
                        Password <span className="text-error-500">*</span>{" "}
                      </Label>
                      <div className="relative">
                        <Field
                          name="password"
                          className={inputClasses}
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
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
                      <Button
                        className="w-full"
                        size="sm"
                        type="submit"
                        variant="outline"
                      >
                        Sign in
                      </Button>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Don&apos;t have an account? {""}
                <Link
                  href="/signup"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
