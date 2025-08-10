import { useState, useRef } from "react";
import styles from "./EmailVerification.module.css";

function EmailVerification() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  const handleChange = (index, value) => {
    // Allow only digits
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

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.header}>Email Verification</div>
        <p className={styles.subtitle}>
          We&#39;ve sent a 6-digit verification code to your email
        </p>

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
              />
            ))}
          </div>

          <button
            onClick={() => console.log("Code:", code.join(""))}
            className={styles.submitBtn}
          >
            Verify Code
          </button>
        </div>
      </div>
    </div>
  );
}

export default EmailVerification;
