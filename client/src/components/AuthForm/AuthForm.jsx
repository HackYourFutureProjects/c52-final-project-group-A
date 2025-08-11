import PropTypes from "prop-types";
import { useState } from "react";
import useFetch from "../../hooks/useFetch.js";
import style from "./AuthForm.module.css";
import InputField from "../InputField/InputField.jsx";
import GoogleButton from "../GoogleButton/GoogleButton.jsx";
import Button from "../Button.jsx";
import { Link, useNavigate } from "react-router-dom";

function AuthForm({ type }) {
  const isSignIn = type === "signIn";
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
  const [formValues, setFormValues] = useState(initialFormValues);

  const endpoint = isSignIn ? "/login" : "/register";
  const { error, performFetch } = useFetch(`${endpoint}`, () => {
    navigate("/home");
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
  };
  if (error) {
    console.error("Fetch error:", error);
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
    <div className={style.wrapper}>
      <section className={style.container}>
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
          />
        </form>
        {isSignIn && (
          <div className={style.noAccContainer}>
            <span>No account?</span>
            <Link to="/register">Create one</Link>
          </div>
        )}
      </section>
    </div>
  );
}

AuthForm.propTypes = {
  type: PropTypes.oneOf(["signIn", "signUp"]).isRequired,
};

export default AuthForm;
