import React, { useState } from "react";

function LoginForm(props) {
  const userDefault = {
    login: {
      value: "",
      error: "",
    },
    password: {
      value: "",
      error: "",
    },
  };

  const [user, setUser] = useState(userDefault);
  const [hasError, setHasError] = useState(false);

  function checkValue(value) {
    if (value.length <= 3) {
      throw new Error("The field is too short!");
    }
  }

  function handleChange(e) {
    const { name: field, value } = e.target;
    if (typeof user[field] !== "undefined") {
      try {
        checkValue(value);
        setUser({ ...user, [field]: { value, error: "" } });
      } catch (error) {
        setUser({ ...user, [field]: { value, error: error.message } });
      }
    }
  }

  function throwError() {
    try {
      throw new Error("Incorrect data!");
    } catch (error) {
      setHasError(true); // Ustawienie stanu błędu
    }
  }

  function handleSubmit(e) {
    e.preventDefault();

    const { login, password } = user;

    // Walidacja przed wywołaniem tryAuth
    if (login.value.length <= 3 || password.value.length <= 3) {
      setUser({
        ...user,
        login: { ...login, error: "The field is too short!" },
        password: { ...password, error: "The field is too short!" },
      });
      return;
    }

    const { tryAuth } = props;
    try {
      const authResp = tryAuth(login.value, password.value);
      if (typeof authResp.then === "function") {
        authResp.catch(() => throwError());
      } else if (!authResp) {
        throwError();
      }
    } catch (error) {
      setHasError(true);
    }
  }

  if (hasError) {
    return (
      <h1>There was an error with your data. Please check and try again.</h1>
    );
  }

  const { login, password } = user;
  return (
    <form onSubmit={handleSubmit}>
      <p>
        <label>
          login:{" "}
          <input
            name="login"
            value={login.value}
            onChange={(e) => handleChange(e)}
          />
          {login.error && <strong>{login.error}</strong>}
        </label>
      </p>
      <p>
        <label>
          password:{" "}
          <input
            name="password"
            value={password.value}
            onChange={(e) => handleChange(e)}
          />
          {password.error && <strong>{password.error}</strong>}
        </label>
      </p>
      <p>
        <button>send</button>
      </p>
    </form>
  );
}

export default LoginForm;
