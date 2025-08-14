import PropTypes from "prop-types";
import { useContext, useState } from "react";
import useFetch from "../../hooks/useFetch.js";
import style from "./AuthForm.module.css";
import InputField from "../InputField/InputField.jsx";
import GoogleButton from "../GoogleButton/GoogleButton.jsx";
import Button from "../Button.jsx";
import { Link, useNavigate } from "react-router-dom";
import UserDataContext from "../../context/userDataContext/UserDataContext.js";

function AuthForm({ type }) {
  const isSignIn = type === "signIn";
  const Navigate = useNavigate();
  const initialFormValues = isSignIn
    ? { email: "", password: "" }
    : {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        passwordConfirmation: "",
      };

  const navigate = useNavigate();
  const { setUserData } = useContext(UserDataContext);
  const [formValues, setFormValues] = useState(initialFormValues);

  const endpoint = isSignIn ? "/login" : "/register";
  const { error, isLoading, performFetch } = useFetch(`${endpoint}`, (res) => {
    if (isSignIn) {
      setUserData(res.user._doc);
      navigate("/home");
    } else {
      navigate("/verify-email");
    }
  });

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formValues),
    };

    performFetch(options);
    if (!isSignIn) {
      return Navigate("/verify-email");
    }
    return Navigate("/home");
  };
  if (error) {
    console.log(error);
  }

  const renderFormFields = () => {
    if (isSignIn) {
      return (
        <>
          <InputField
            name={"email"}
            type={"email"}
            placeholder={"Email"}
            value={formValues.email}
            onChange={handleChange}
            required={true}
            autoComplete={"email"}
          />
          <InputField
            name={"password"}
            type={"password"}
            placeholder={"Password"}
            value={formValues.password}
            onChange={handleChange}
            required={true}
            autoComplete={"current-password"}
          />
        </>
      );
    } else {
      return (
        <>
          <InputField
            name={"firstName"}
            type={"text"}
            placeholder={"First name"}
            value={formValues.firstName}
            onChange={handleChange}
            required={true}
            autoComplete={"given-name"}
          />
          <InputField
            name={"lastName"}
            type={"text"}
            placeholder={"Last name"}
            value={formValues.lastName}
            onChange={handleChange}
            required={true}
            autoComplete={"family-name"}
          />
          <InputField
            name={"email"}
            type={"email"}
            placeholder={"Email"}
            value={formValues.email}
            onChange={handleChange}
            required={true}
            autoComplete={"email"}
          />
          <InputField
            name={"password"}
            type={"password"}
            placeholder={"Password"}
            value={formValues.password}
            onChange={handleChange}
            required={true}
            autoComplete={"new-password"}
          />
          <InputField
            name={"passwordConfirmation"}
            type={"password"}
            placeholder={"Repeat password"}
            value={formValues.passwordConfirmation}
            onChange={handleChange}
            required={true}
            autoComplete={"new-password"}
          />
        </>
      );
    }
  };

  return (
    <main className={style.wrapper}>
      <div className={style.container}>
        <h1 className={style.header}>
          {isSignIn ? (
            <>
              Log in or <br /> Create an account
            </>
          ) : (
            "Create an account"
          )}
        </h1>
        {isSignIn && (
          <>
            <GoogleButton />
            <span className={style.or}>or</span>
          </>
        )}
        <form onSubmit={handleSubmit} className={style.form}>
          {renderFormFields()}
          <Button
            type="submit"
            label={isSignIn ? "Log in" : "Continue"}
            className={style.submitBtn}
            disabled={isLoading}
          />
        </form>
        {isSignIn && (
          <div className={style.noAccContainer}>
            <span>No account?</span>
            <Link to="/register">Create one</Link>
          </div>
        )}
      </div>
    </main>
  );
}

AuthForm.propTypes = {
  type: PropTypes.oneOf(["signIn", "signUp"]).isRequired,
};

export default AuthForm;
