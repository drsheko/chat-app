import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
const Login = ({ getUser }) => {
  let navigate = useNavigate();
  const [errors, setErrors] = useState();
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const handleFormSubmit = async (e) => {
    try {
      e.preventDefault();

      var res = await fetch("http://localhost:3001/api/login", {
        method: "Post",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          username: form.username,
          password: form.password,
        }),
      });
      var data = await res.json();
      var user = await data.user;
      if ("errors" in data) {
        setErrors(data.errors.error);
      } else {
        getUser(user); //send user to app
        // Save logged user to local storage
        localStorage.setItem("CHAT_APP_user", JSON.stringify(user));
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      //setError(err)
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const togglePassword = () => {
    var input = document.getElementById("password");
    if (input.type === "password") {
      input.type = "text";
    } else {
      input.type = "password";
    }
  };

  useEffect(() => {}, [errors]);

  return (
    <div className="card  m-5 ">
      <div className="card-header">
        <h1 className=" text-center">Login</h1>
        <h5 className="text-center text-muted h6">
          New user?{" "}
          <span>
            <Link to="/signup">Sign-up</Link>
          </span>
        </h5>
      </div>

      <form onSubmit={handleFormSubmit} className="card m-5 py-2 px-5">
        <label className="form-label">Username</label>
        <input
          type="text"
          name="username"
          className="p-2 form-control "
          value={form.username}
          onChange={handleChange}
          required
        />
        <label className="form-label mt-2"> Password</label>
        <input
          type={"password"}
          name="password"
          className=" p-2 form-control"
          value={form.password}
          onChange={handleChange}
          id="password"
          autoComplete="on"
          required
        />
        <div className="form-check my-2">
          <input
            type="checkbox"
            className="form-check-input"
            id="showPassword"
            onClick={togglePassword}
          />
          <label class="form-check-label" htmlFor="showPassword">
            Show password
          </label>
        </div>

        {typeof errors != "undefined" ? (
          <h3 className="text-danger h6 my-2">-{errors}</h3>
        ) : (
          <></>
        )}
        <button
          type="submit"
          className="btn btn-primary col-6 col-md-3 text-center my-4"
          value="submit"
        >
          Log in
        </button>
      </form>
    </div>
  );
};

export default Login;
