import { useState, useRef } from "react";

function EmailVerification() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "100px",
        gap: "20px",
      }}
    >
      <h2>Введите код подтверждения</h2>
      <p>Мы отправили 6-значный код на вашу почту</p>

      <div style={{ display: "flex", gap: "10px" }}>
        {code.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            maxLength="1"
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            style={{
              width: "50px",
              height: "60px",
              textAlign: "center",
              fontSize: "24px",
              fontWeight: "bold",
              border: "2px solid #ddd",
              borderRadius: "8px",
              outline: "none",
            }}
            autoComplete="off"
          />
        ))}
      </div>

      <button
        onClick={() => console.log("Код:", code.join(""))}
        style={{
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Подтвердить
      </button>
    </div>
  );
}

export default EmailVerification;
