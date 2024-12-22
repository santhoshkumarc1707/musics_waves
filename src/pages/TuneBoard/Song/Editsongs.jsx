import axios from 'axios';
import React, { useEffect, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const EditSongs = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const token = useSelector((state) => state.auth.token);
  const songref = useRef();

  const getSongs = useCallback((signal) => {
    if (songref.current) {
      songref.current.abort();
    }
    songref.current = new AbortController();

    const config = {
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token,
      },
      signal,
    };

    axios
      .get(`${import.meta.env.VITE_BASE_URL || "http://localhost:5000"}/api/songs/${id}`, config)


      .then((res) => {
        formik.setValues(res.data?.data);


      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          console.log("Request canceled:", err.message);
        } else {
          console.error("Error fetching song:", err);
        }
      });
  }, [id, token]);

  useEffect(() => {
    getSongs();
    return () => {
      if (songref.current) {
        songref.current.abort();
      }
    };
  }, [getSongs]);

  const formik = useFormik({
    initialValues: {
      name: '',
      artist: '',
      duration: '',
      song: null,
      img: null,
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Title is required'),
      artist: Yup.string().required('Artist is required'),
      duration: Yup.string().required('duration is required'),
      song: Yup.mixed().required('Song file is required'),
      img: Yup.mixed().required('Image file is required'),
    }),
    onSubmit: (values) => {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('artist', values.artist);
      formData.append('duration', values.duration);
      formData.append('song', values.song);
      formData.append('img', values.img);

      axios
        .put(`${import.meta.env.VITE_BASE_URL}/api/songs/${id}`, formData, {
          headers: {
            "x-auth-token": token,
          },
        })
        .then((res) => {
          formik.setValues(res.data);

          navigate(-1);
        })
        .catch((err) => {
          console.error('Error updating song:', err);
        });
    },
  });
  console.log(formik.values);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 w-24 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none"
        >
          Back
        </button>
        <h2 className="text-2xl font-bold mb-6 text-gray-700">Edit Song Details</h2>
        <form onSubmit={formik.handleSubmit}>
          <div className="grid gap-4">
            {/* Title Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                id="name"
                name="name"
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
                className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.name}</p>
              )}
            </div>

            {/* Artist Field */}
            <div>
              <label htmlFor="artist" className="block text-sm font-medium text-gray-700">
                Artist
              </label>
              <input
                id="artist"
                name="artist"
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.artist}
                className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              {formik.touched.artist && formik.errors.artist && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.artist}</p>
              )}
            </div>

            {/* Album Field */}
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                Duration
              </label>
              <input
                id="duration"
                name="duration"
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.duration}
                className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              {formik.touched.duration && formik.errors.duration && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.duration}</p>
              )}
            </div>

            {/* Song File Field */}
            <div>
              <label htmlFor="song" className="block text-sm font-medium text-gray-700">
                Song File
              </label>
              <input
                id="song"
                name="song"
                type="file"
                accept=".mp3,.wav"
                onChange={(e) => formik.setFieldValue("song", e.target.files[0])}
                className="mt-1 block w-full p-2 border rounded-md shadow-sm"
              />
              {formik.errors.song && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.song}</p>
              )}
            </div>

            {/* Image File Field */}
            <div>
              <label htmlFor="img" className="block text-sm font-medium text-gray-700">
                Image File
              </label>
              <input
                id="img"
                name="img"
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={(e) => formik.setFieldValue("img", e.target.files[0])}
                className="mt-1 block w-full p-2 border rounded-md shadow-sm"
              />
              {formik.errors.img && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.img}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditSongs;
