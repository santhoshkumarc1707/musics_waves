import * as Yup from "yup";

export const signupSchema = Yup.object().shape({
  name: Yup.string().required("Name is required").min(3, "Name must be at least 3 characters long"),
  email: Yup.string().email("Invalid email format").required("Email is required"),
  password: Yup.string().required("Password is required").min(6, "Password must be at least 6 characters long"),
  gender: Yup.string().oneOf(["male", "female", "non-binary"], "Invalid gender").required("Gender is required"),
  date: Yup.number().typeError("Date must be a number").min(1, "Date must be between 1 and 31").max(31, "Date must be between 1 and 31").required("Date is required"),
  month: Yup.string().required("Month is required"),
  year: Yup.number().typeError("Year must be a number").min(1900, "Year must be greater than or equal to 1900").max(new Date().getFullYear(), `Year must be less than or equal to ${new Date().getFullYear()}`).required("Year is required"),
});


