import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { initialValues, Loginschema } from "./utils";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setAuth } from "../../../store/authSlice";
import { assets } from "../../../assets/admin-assets/assets";
import { toast } from "react-toastify";

const Login = () => {
  const [formLoading, setFormLoading] = useState(false);
  const loginRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (values) => {
    setFormLoading(true);

    try {
      if (loginRef.current) {
        loginRef.current.abort();
      }
      loginRef.current = new AbortController();

      const config = {
        headers: {
          "Content-Type": "application/json",
        },

        signal: loginRef.current.signal,
      };
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/login`,
        {
          email: values.username,
          password: values.password,
        },
        config
      );

      const { data, message, role, id } = response.data || {};
      if (data && id && message) {
        dispatch(setAuth({ token: data, user: role, id }));
        toast.success(message);
        navigate("/dashboard");
      } else {
        alert("Invalid login credentials.");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login failed. Please try again.";
      alert(errorMessage);
    } finally {
      setFormLoading(false);
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema: Loginschema,
    onSubmit: handleLogin,
  });

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <header className="flex justify-center py-8">
          <Link to="/">
            <img src={assets.img_log} width={120} alt="Music App Logo" />
          </Link>
        </header>

        <h1 className="text-3xl font-semibold text-gray-800 text-center mb-6">
          Log in to Music App
        </h1>

        <form onSubmit={formik.handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-600"
            >
              Email or Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formik.values.username}
              onChange={formik.handleChange}
              placeholder="Enter your email or username"
              className="mt-1 p-3 block w-full border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            {formik.errors.username && formik.touched.username && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.username}</p>
            )}
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-600"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              placeholder="Enter your password"
              className="mt-1 p-3 block w-full border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            {formik.errors.password && formik.touched.password && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 text-white py-3 rounded-md hover:bg-green-600 transition duration-300"
            disabled={formLoading}
          >
            {formLoading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <div className="text-center mt-6">
          <Link to="/password/forgot" className="text-sm text-gray-500 underline">
            Forgot Password?
          </Link>
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>        Don&apos;t have an account?</p>
          <Link to="/sign-up" className="text-green-500 font-medium" onClick={() => formik.resetForm()}>
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
