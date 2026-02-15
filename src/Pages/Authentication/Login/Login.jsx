import React from "react";
import { useForm } from "react-hook-form";
import { NavLink, useLocation, useNavigate } from "react-router";
import SocialLogin from "../SocialLogin/SocialLogin";
import useAuth from "../../../Hooks/useAuth";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { signIn } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from || "/";
  const onSubmit = (data) => {
    signIn(data.email, data.password)
      .then((result) => {
        console.log(result.user); 
        navigate(from);
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="max-w-[300px] mx-auto w-full">
      <div>
        <h2 className="text-2xl font-semibold mb-3">Welcome back😎</h2>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset className="fieldset">
          <label className="label">Email</label>
          <input
            {...register("email", { required: true })}
            type="email"
            className="input"
            placeholder="Email"
          />
          {errors.email?.type === "required" && (
            <p className="text-red-600">Email is required</p>
          )}
          <label className="label">Password</label>
          <input
            {...register("password", { required: true, minLength: 6 })}
            type="password"
            className="input"
            placeholder="Password"
          />
          {errors.password?.type === "required" && (
            <p className="text-red-600">Password is required</p>
          )}
          {errors.password?.type === "minLength" && (
            <p className="text-red-600">Password must be 6 char or longer</p>
          )}
          <div>
            <a className="link link-hover">Forgot password?</a>
          </div>

          <button className="btn text-slate-900 btn-primary mt-4">Login</button>
          <p>
            Don't have any account?{" "}
            <NavLink to={"/signup"} className="text-[#316d15] underline">
              sign up
            </NavLink>
          </p>
        </fieldset>
      </form>
      <SocialLogin />
    </div>
  );
};

export default Login;
