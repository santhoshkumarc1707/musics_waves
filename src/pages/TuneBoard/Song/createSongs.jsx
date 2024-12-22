import { useFormik } from "formik";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

const SongForm = () => {
  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: "",
      artist: "",
      album: "",
      song: null,
      img: null,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Title is required"),
      artist: Yup.string().required("Artist is required"),
      album: Yup.string().required("Album is required"),
      song: Yup.mixed().required("Song file is required"),
      img: Yup.mixed().required("Image file is required"),
    }),
    onSubmit: async (values, { setSubmitting, resetForm, setStatus }) => {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("artist", values.artist);
      formData.append("album", values.album);
      formData.append("song", values.song);
      formData.append("img", values.img);

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL || "http://localhost:5000"}/api/song`,
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
    },
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div className="px-4 py-2">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700"
        >
          Back
        </button>
      </div>
      <div className="flex-grow flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Create a New Song</h2>
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            {formik.status?.success && (
              <p className="text-green-600 bg-green-100 p-2 rounded-lg text-center">
                {formik.status.success}
              </p>
            )}
            {formik.status?.error && (
              <p className="text-red-600 bg-red-100 p-2 rounded-lg text-center">
                {formik.status.error}
              </p>
            )}

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
                className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-indigo-500"
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-red-500 text-sm">{formik.errors.name}</p>
              )}
            </div>

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
                className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-indigo-500"
              />
              {formik.touched.artist && formik.errors.artist && (
                <p className="text-red-500 text-sm">{formik.errors.artist}</p>
              )}
            </div>

            <div>
              <label htmlFor="album" className="block text-sm font-medium text-gray-700">
                Album
              </label>
              <input
                id="album"
                name="album"
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.album}
                className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-indigo-500"
              />
              {formik.touched.album && formik.errors.album && (
                <p className="text-red-500 text-sm">{formik.errors.album}</p>
              )}
            </div>

            <div>
              <label htmlFor="img" className="block text-sm font-medium text-gray-700">
                Upload Image
              </label>
              <input
                onChange={(e) => formik.setFieldValue("img", e.target.files[0])}
                type="file"
                id="img"
                accept="image/*"
                hidden
              />
              <label htmlFor="img" className="cursor-pointer">
                <img
                  src={
                    formik.values.img
                      ? URL.createObjectURL(formik.values.img)
                      : "Default Placeholder Image URL"
                  }
                  className="w-24"
                  alt="upload_area"
                />
              </label>
            </div>

            <div>
              <label htmlFor="song" className="block text-sm font-medium text-gray-700">
                Upload Song
              </label>
              <input
                onChange={(e) => formik.setFieldValue("song", e.target.files[0])}
                type="file"
                id="song"
                accept="audio/*"
                className="bg-transparent outline-green-600 border-2 border-gray-400 p-2.5"
              />
            </div>

            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
            >
              {formik.isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SongForm;
