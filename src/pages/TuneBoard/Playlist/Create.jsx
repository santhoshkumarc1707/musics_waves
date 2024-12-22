import axios from 'axios';
import { useFormik } from 'formik';
import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const initialValues = {
  name: "",
  desc: "",
  img: null,
};

import * as yup from 'yup';

const playlistSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  desc: yup.string().optional(),
  img: yup.string().optional(),
});

const CreatePlaylist = () => {
    const token = useSelector((state) => state.auth.token);
  const id = useSelector((state) => state.auth.id);
  const navigate = useNavigate();
  const handlePlaylist = async (values, { setStatus, setSubmitting, resetForm }) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("user", id);
    formData.append("desc", values.desc);
    if (values.img) formData.append("img", values.img);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL || "http://localhost:5000"}/api/playlists`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "x-auth-token": token,
          },
        }
      );
      setStatus({ success: response.data.message });
      resetForm();
    } catch (err) {
      setStatus({ error: err.response?.data?.message || "Something went wrong" });
    } finally {
      setSubmitting(false);
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema: playlistSchema,
    onSubmit: handlePlaylist,
  });

  return (
    <>
      <div className="px-4 py-2">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700"
        >
          Back
        </button>
      </div>
      <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">

        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Create Playlist</h2>
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Playlist Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${formik.touched.name && formik.errors.name ? "border-red-500" : "border-gray-300"
                }`}
            />
            {formik.touched.name && formik.errors.name && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.name}</p>
            )}
          </div>

          {/* Description Field */}
          <div>
            <label htmlFor="desc" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="desc"
              name="desc"
              rows="3"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.desc}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            ></textarea>
          </div>

          {/* Image Upload Field */}
          <div>
            <label htmlFor="img" className="block text-sm font-medium text-gray-700 mb-1">
              Upload Image
            </label>
            <input
              type="file"
              id="img"
              name="img"
              accept="image/*"
              onChange={(event) => formik.setFieldValue("img", event.currentTarget.files[0])}
              className="w-full py-1.5 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {formik.isSubmitting ? "Creating..." : "Create Playlist"}
            </button>
          </div>
        </form>

        {/* Status Messages */}
        {formik.status?.success && (
          <p className="mt-4 text-green-600 text-center">{formik.status.success}</p>
        )}
        {formik.status?.error && (
          <p className="mt-4 text-red-600 text-center">{formik.status.error}</p>
        )}
      </div>
    </>
  );
};

export default CreatePlaylist;
