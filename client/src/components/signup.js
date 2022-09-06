import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  let navigate = useNavigate();
  const [error, setError] = useState();
  const [form, setForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [upload, setUpload] = useState(null);
  const [isSelected, setIsSelected] = useState(false);
  const [image, setImage] = useState(null);
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      var formData = new FormData();
      formData.append("username", form.username);
      formData.append("password", form.password);
      formData.append("confirmPassword", form.confirmPassword);
      formData.append("avatarURL", upload);

      var res = await fetch("http://localhost:3001/api/sign-up", {
        method: "Post",
        body: formData,
      });
      var data = await res.json();
      if ("errors" in data) {
        setError(data.errors);
      } else {
        navigate("/login", { replace: true });
      }
    } catch (err) {
      setError(err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const uploadFile = async (e) => {
    var file = e.target.files[0];
    setUpload(file);
    setIsSelected(true);
    if (e.target.files && e.target.files[0]) {
      setImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className="card  m-5 ">
      <div className="card-header">
        <h1 className=" text-center">Sign up</h1>
        <h5 className="text-center text-muted h6">
          Do you have an account?
          <span>
            <Link to="/login">Log in</Link>
          </span>
        </h5>
      </div>

      <form className="card m-5 py-2 px-5" onSubmit={handleFormSubmit}>
        <div className="text-center col-12">
          <img
            src={image ? image : require("../images/unknown.jpg")}
            className="rounded float-end "
            height="100"
            width={100}
          />
        </div>

        <label className="form-label">Username</label>
        <input
          type="text"
          className="form-control"
          name="username"
          value={form.username}
          onChange={handleChange}
          require
        />

        <label className="form-label"> Password</label>
        <input
          type={"password"}
          className="form-control"
          name="password"
          value={form.password}
          onChange={handleChange}
          require
        />

        <label className="form-label">Confirm Password</label>
        <input
          type={"password"}
          className="form-control"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          require
        />

        <label className="form-label">Photo</label>
        <input
          type="file"
          class="form-control"
          name="avatarURL"
          onChange={uploadFile}
        />

        {typeof error != "undefined" ? (
          error.map((err) => <h4 className="text-danger h6 my-2">- {err}</h4>)
        ) : (
          <></>
        )}
        <button
          type="submit"
          value="submit"
          className="btn btn-primary col-6 col-md-3 text-center my-4"
        >
          <span className="fw-bold  ">Sign up</span>
        </button>
      </form>
    </div>
  );
};

export default Signup;
