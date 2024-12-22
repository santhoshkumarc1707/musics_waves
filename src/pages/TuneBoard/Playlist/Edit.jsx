import axios from 'axios';
import React, { useEffect, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const Editplaylist = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const token = useSelector((state) => state.auth.token);
  const PlaylistRef = useRef();

  const editplaylist = useCallback((signal) => {
    if (PlaylistRef.current) {
      PlaylistRef.current.abort();
    }
    PlaylistRef.current = new AbortController();

    const config = {
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token,
      },
      signal,
    };

    axios
      .get(`${import.meta.env.VITE_BASE_URL || "http://localhost:5000"}/api/playlists/${id}`, config)


      .then((res) => {
        formik.setValues(res.data?.data);

        // clear error
        formik.setStatus({});
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          console.log("Request canceled:", err.message);
        } else {
          console.error("Error fetching song:", err);

          // clear error
          formik.setStatus({ error: err.message });
        }
      });
  }, [id, token]);

  useEffect(() => {
    editplaylist();
    return () => {
      if (PlaylistRef.current) {
        PlaylistRef.current.abort();
      }
    };
  }, [editplaylist]);

  const formik = useFormik({
    initialValues: {
      name: '',
      desc: '',
      img: null,
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Title is required'),
      desc: Yup.string().required('Description is required'),
      img: Yup.mixed().required('Image file is required'),
    }),
    onSubmit: (values) => {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('desc', values.desc);
      formData.append('img', values.img);

      axios
        .put(`${import.meta.env.VITE_BASE_URL}/api/playlists/edit/${id}`, formData, {
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

          // clear error
          formik.setStatus({ error: err.message });
        });
    },
  });

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
        <h2 className="text-2xl font-bold mb-6 text-gray-700">Edit Playlist  Details</h2>
        <form onSubmit={formik.handleSubmit}>
          <div className="grid gap-4">
            {/* Title Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Playlist Name
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

            {/* Description field*/}
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
              {formik.touched.desc && formik.errors.desc && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.desc}</p>
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
          <div>
                 <button  className="px-4 py-2 rounded  bg-green-500 text-white" onClick={()=>navigate(`/playlist/edit/${id}/addsongs`)}>Add songs</button>

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

export default Editplaylist;

