import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Helmet } from "react-helmet";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

export default function Register() {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const onSubmit = async (data) => {
    try {
      const result = await registerUser(data);

      if (result.success) {
        toast.success(result.message);
        navigate("/courses");
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      toast.error("An error occurred during registration");
    }
  };

  return (
    <>
      <Helmet>
        <title>Register</title>
        <meta name="description" content="Create a new account" />
      </Helmet>
      <div className="flex min-h-screen items-center justify-center bg-[#EDE6DA] px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-[#F6F1E6] p-6 rounded-lg">
          <div className="text-center">
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Create an account
            </h2>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="rounded-md shadow-sm -space-y-px">
              {/* Full Name Field */}
              <div>
                <label htmlFor="fullname" className="sr-only">
                  Full Name
                </label>
                <input
                  id="fullname"
                  name="fullname"
                  type="text"
                  {...register("fullname", {
                    required: "Full name is required",
                  })}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Full name"
                />
                {errors.fullname && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.fullname.message}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="text"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email address",
                    },
                  })}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="relative">
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters long",
                    },
                    pattern: {
                      value:
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                      message:
                        "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character",
                    },
                  })}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-600 z-10"
                >
                  <FontAwesomeIcon
                    icon={showPassword ? faEyeSlash : faEye}
                    className="text-lg"
                  />
                </button>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            {/* Register Button */}

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-grey-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black-500"
              >
                Register
              </button>
            </div>
          </form>
          <div className="mt-6 flex items-center">
            <div className="border-t border-gray-300 flex-grow"></div>
            <div className="text-sm text-gray-500 px-2 whitespace-nowrap m-1">
              Or continue with
            </div>
            <div className="border-t border-gray-300 flex-grow"></div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <button
              type="button"
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <img
                className="h-5 w-5 mr-2"
                src="https://www.svgrepo.com/show/355037/google.svg"
                alt="Google"
              />
              Google
            </button>
            <button
              type="button"
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <img
                className="h-5 w-5 mr-2"
                src="https://www.svgrepo.com/show/469190/linkedin.svg"
                alt="LinkedIn"
              />
              LinkedIn
            </button>
          </div>
          {/* Other Links */}
          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-black hover:text-gray-500"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
