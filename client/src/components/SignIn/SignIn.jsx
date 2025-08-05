import Button from "../Button.jsx";
import { Link } from "react-router-dom";
import style from "./SignIn.module.css";
import useFetch from "../../hooks/useFetch.js";
import { useState } from "react";
import GoogleButton from "../GoogleButton/GoogleButton.jsx";
import InputField from "../InputField/InputField.jsx";
import { config } from "dotenv";

function SignIn() {
  const [formValues, setFormValues] = useState({ email: "", password: "" });
  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };
  const { BACKEND_URL } = config;
  const { performFetch } = useFetch(`${BACKEND_URL}/login`);
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

  return (
    <div className={style.wrapper}>
      <section className={style.signInContainer}>
        <h1 className={style.header}>
          Log in or
          <br />
          Create an account
        </h1>
        <GoogleButton />
        <span className={style.or}>or</span>
        <form onSubmit={handleSubmit} className={style.form}>
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
          <Button type="submit" label="Log in" className={style.logInBtn} />
        </form>
        <div className={style.noAccContainer}>
          <span>No account?</span>
          <Link to="/register">Create one</Link>
        </div>
      </section>
    </div>
  );
}

export default SignIn;
