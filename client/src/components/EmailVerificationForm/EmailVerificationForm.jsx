import { useState, useRef } from "react";
import useFetch from "../../hooks/useFetch";
import styles from "./EmailVerificationForm.module.css";
import { useNavigate } from "react-router-dom";
import Button from "../Button.jsx";

function EmailVerificationForm() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  const {
    isLoading,
    error: fetchError,
    performFetch,
  } = useFetch("/register/verify");

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-move to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle Backspace
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = () => {
    const verificationCode = code.join("");

    if (verificationCode.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    setError("");

    performFetch({
      method: "POST",
      body: JSON.stringify({
        verificationCode,
      }),
      onSuccess: () => {
        navigate("/login");
      },
    });
  };

  // Show fetch error or local error
  const displayError = fetchError || error;

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <h1 className={styles.header}>Email Verification</h1>
        <p className={styles.subtitle}>
          We&#39;ve sent a 6-digit verification code to your email
        </p>

        {displayError && <div className={styles.error}>{displayError}</div>}

        <div className={styles.form}>
          <div className={styles.codeInputs}>
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={styles.codeInput}
                autoComplete="off"
                disabled={isLoading}
              />
            ))}
          </div>

          <Button
            label={isLoading ? "Verifying..." : "Verify Code"}
            onClick={handleSubmit}
            className={styles.submitBtn}
            disabled={isLoading}
          />
        </div>
      </div>
    </div>
  );
}

export default EmailVerificationForm;
