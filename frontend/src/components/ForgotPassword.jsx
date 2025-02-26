import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import axios from "axios";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}auth/forgot-password`,
        data
      );
      console.log(response);
      if (response.data.success) {
        toast.success(response.data.message);
        setSubmittedEmail(response.data.email);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data.message || "An error occureed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Forgot Password</title>
        <meta name="Forgot Password" content="Send passwrod reset email" />
      </Helmet>
      <div className="flex min-h-screen items-center justify-center bg-[#EDE6DA] px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-[#F6F1E6] p-6 rounded-lg">
          {!submittedEmail && (
            <div className="text-center">
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Reset Your Password
              </h2>
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="rounded-md shadow-sm -space-y-px">
              {submittedEmail ? (
                <div className="p-4 bg-green-100 border border-green-300 text-green-800 rounded-md text-center">
                  An email with instructions to reset your password has been
                  sent to <strong>{submittedEmail}</strong>. Please Check Your
                  Inbox and Spam
                </div>
              ) : (
                <div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    {...register("email", { required: "Email is required" })}
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Enter you Registered Email"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              )}
            </div>
            {!submittedEmail && (
              <div>
                <button
                  type="submit"
                  disabled={loading} // Disable button while loading
                  className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                    loading
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-black hover:bg-gray-800"
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500`}
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>
              </div>
            )}
            {submittedEmail && (
              <div>
                <button
                  onClick={() => {
                    navigate("/");
                  }}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Home
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  );
}
