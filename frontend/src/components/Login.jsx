import { React, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

export default function Login() {
  const backend_url = import.meta.env.VITE_BACKEND_URL;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [flashMessage, setFlashMessage] = useState({ type: "", message: "" });

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(backend_url + "login", data);
      setFlashMessage({ type: "success", message: response.data.message });

      // Clear flash message after 5 seconds
      setTimeout(() => setFlashMessage({ type: "", message: "" }), 5000);
    } catch (err) {
      const errorMessage =
        err.response?.data.message || "An error occurred during registration";
      setFlashMessage({ type: "error", message: errorMessage });

      // Clear flash message after 5 seconds
      setTimeout(() => setFlashMessage({ type: "", message: "" }), 5000);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-200 px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-6 rounded-lg">
        {/* Flash Message */}
        {flashMessage.message && (
          <div
            className={`${
              flashMessage.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            } p-2 rounded-md mb`}
          >
            {flashMessage.message}
          </div>
        )}
        <div className="text-center">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Login to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                {...register("email", { required: "Email is required" })}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                {...register("password", { required: "Password is required" })}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                {...register("rememberMe")}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label
                htmlFor="rememberMe"
                className="ml-2 block text-sm text-gray-900"
              >
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign in
            </button>
          </div>
        </form>

        <div className="mt-6 flex items-center">
          <div className="border-t border-gray-300 w-full"></div>
          <div className="text-sm text-gray-500 px-2 m-1 whitespace-nowrap">
            Or continue with
          </div>
          <div className="border-t border-gray-300 w-full"></div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <button
            type="button"
            className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <img
              src="https://www.svgrepo.com/show/355037/google.svg"
              alt="Google"
              className="h-5 w-5 mr-2"
            />
            Google
          </button>
          <button
            type="button"
            className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <img
              src="https://www.svgrepo.com/show/469190/linkedin.svg"
              alt="LinkedIn"
              className="h-5 w-5 mr-2"
            />
            LinkedIn
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-gray-500">
          Not a user?{" "}
          <a
            href="#"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
