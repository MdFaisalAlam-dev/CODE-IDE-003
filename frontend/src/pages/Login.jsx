import React, { useState } from 'react';
import logo from "../images/logo.png";
import image from "../images/homeimg.gif";
import { Link, useNavigate } from 'react-router-dom';
import { api_base_url } from '../helper';

const Login = () => {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate(); // ✅ call it as a function

  const submitForm = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(api_base_url + "/login", {
        mode: "cors",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: pwd,
        }),
      });

      const data = await res.json();

      if (data.success === true) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("isLoggedIn", "true"); // ✅ store as string
        localStorage.setItem("userId", data.userId);
        setTimeout(() => {
          window.location.href = "/"
        }, 200);
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="container w-screen min-h-screen flex items-center justify-between pl-[100px]">
      <div className="left w-[35%]">
        <img
          className="logo-img w-[200px] border-2 rounded-lg"
          src={logo}
          alt="logo"
        />

        <form onSubmit={submitForm} className="w-full mt-[60px]">
          <div className="inputBox">
            <input
              required
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              placeholder="Email"
            />
          </div>

          <div className="inputBox">
            <input
              required
              onChange={(e) => setPwd(e.target.value)}
              value={pwd}
              type="password"
              placeholder="Password"
            />
          </div>

          <p className="text-[gray]">
            Don't have an account?{" "}
            <Link to="/signup" className="text-[#00AEEF]">
              Sign Up
            </Link>
          </p>

          {error && <p className="text-red-500 text-[14px] my-2">{error}</p>}

          <button type="submit" className="btnBlue w-full mt-[20px]">
            Login
          </button>
        </form>
      </div>

      <div className="right w-[5%]"></div>

      <img
        className="fancy-hover h-[75vh] w-[50%] object-cover border-2 rounded-lg"
        src={image}
        alt="home"
      />
    </div>
  );
};

export default Login;
