import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import axios from "axios";
import { signupSchema } from "./utils";
import { assets } from "../../../assets/admin-assets/assets";
import { toast } from "react-toastify";


const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const initialValues = {
  name: "",
  email: "",
  password: "",
  gender: "",
  date: "",
  month: "",
  year: "",
  profileImg: null,
};

const Signup = () => {
  const [formLoading, setFormLoading] = useState(false);
  const navigate=useNavigate();
  const handleSignup = async (values, {  setSubmitting }) => {
    setFormLoading(true);
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("password", values.password);
      formData.append("gender", values.gender);
      formData.append("date", values.date);
      formData.append("month", values.month);
      formData.append("year", values.year);
      if (values.profileImg) {
        formData.append("profileImg", values.profileImg);
      }
      console.log(values.profileImg);

      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/users`, formData, config);
      const { data, message } = response.data;

      if (data) {
        toast.success(message); // Clear the error on success
        navigate("/");
      } else {
        toast.error("Signup failed. Please try again.")
      }
    } catch (error) {

      toast.error(error.response?.data?.message || "An error occrred.");
    } finally {
      setFormLoading(false);
      setSubmitting(false);
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema: signupSchema,
    onSubmit: handleSignup,
  });


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 shadow-lg rounded-md w-full max-w-lg">
        <div className="text-center mb-6">
          <Link to="/">
            <img src={assets.img_logo} className="mx-auto" width={140} alt="Logo" />
          </Link>
        </div>
        <h1 className="text-2xl font-bold text-center mb-4">
          Sign up for free to start listening.
        </h1>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              placeholder="Enter your Name"
              className="block w-full rounded-md border-gray-300 focus:ring-green-500 focus:border-green-500 shadow-sm p-2"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              placeholder="Create a password"
              className="block w-full rounded-md border-gray-300 focus:ring-green-500 focus:border-green-500 shadow-sm p-2"
            />
          </div>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              placeholder="Choose a username"
              className="block w-full rounded-md border-gray-300 focus:ring-green-500 focus:border-green-500 shadow-sm p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date of Birth
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                id="date"
                name="date"
                value={formik.values.date}
                onChange={formik.handleChange}
                placeholder="DD"
                className="block w-1/3 rounded-md border-gray-300 focus:ring-green-500 focus:border-green-500 shadow-sm p-2"
              />
              <select
                id="month"
                name="month"
                value={formik.values.month}
                onChange={formik.handleChange}
                className="block w-1/3 rounded-md border-gray-300 focus:ring-green-500 focus:border-green-500 shadow-sm p-2"
              >
                <option value="">Month</option>
                {months.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
              <input
                type="text"
                id="year"
                name="year"
                value={formik.values.year}
                onChange={formik.handleChange}
                placeholder="YYYY"
                className="block w-1/3 rounded-md border-gray-300 focus:ring-green-500 focus:border-green-500 shadow-sm p-2"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Gender
            </label>
            <div className="flex space-x-4">
              <label>
                <input
                  type="radio"
                  id="m"
                  name="gender"
                  value="male"
                  checked={formik.values.gender === "male"}
                  onChange={formik.handleChange}
                />
                <span className="ml-2">Male</span>
              </label>
              <label>
                <input
                  type="radio"
                  id="f"
                  name="gender"
                  value="female"
                  checked={formik.values.gender === "female"}
                  onChange={formik.handleChange}
                />
                <span className="ml-2">Female</span>
              </label>
              <label>
                <input
                  type="radio"
                  id="o"
                  name="gender"
                  value="non-binary"
                  checked={formik.values.gender === "non-binary"}
                  onChange={formik.handleChange}
                />
                <span className="ml-2">Prefer not to say</span>
              </label>
            </div>
            <div>
              <label htmlFor="profileImg" className="block text-sm font-medium text-gray-700">
                Profile Image
              </label>
              <input
                type="file"
                id="profileImg"
                name="profileImg"
                onChange={(event) => {
                  formik.setFieldValue("profileImg", event.currentTarget.files[0]);
                }}
                className="block w-full text-gray-500 rounded-md border-gray-300 focus:ring-green-500 focus:border-green-500 shadow-sm p-2"
              />
            </div>

          </div>
          <div>
            <input
              type="submit"
              value={formLoading ? "Signing Up..." : "Sign Up"}
              disabled={formLoading}
              className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition"
            />
          </div>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/" className="text-green-500 font-medium">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
