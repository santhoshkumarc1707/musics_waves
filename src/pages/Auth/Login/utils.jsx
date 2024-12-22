import * as Yup from 'yup';
export const initialValues =
{
    username: "",
    password: ""
}


export const Loginschema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required'),
});


