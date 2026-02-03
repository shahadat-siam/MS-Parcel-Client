import { useForm } from "react-hook-form"; 
import { NavLink } from 'react-router';

const Register = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const onSubmit = data => {
        console.log(data)
    }

    return (
        <div className="max-w-[300px]  mx-auto w-full">
            <div>
                <h2 className="text-2xl font-semibold mb-3">Create an Account</h2>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <fieldset className="fieldset">

                        <label className="label mt-1">Name</label>
                        <input {...register('name', { required: true })} type="text" className="input outline-none w-full" placeholder="Name" />
                        {
                            errors.name?.type === "required" && <p className="text-red-600">Name is required</p>
                        }

                        <label className="label mt-1">Email</label>
                        <input {...register('email', { required: true })} type="email" className="input outline-none w-full" placeholder="Email" />
                        {
                            errors.email?.type === "required" && <p className="text-red-600">Email is required</p>
                        }
                        <label className="label mt-1">Password</label>
                        <input {...register("password", { required: true, minLength: 6 })} type="password" className="input outline-none w-full" placeholder="Password" />
                        {
                            errors.password?.type === "required" && <p className="text-red-600">Password is required</p>
                        }
                        {
                            errors.password?.type === "minLength" && <p className="text-red-600">Password must be 6 char or longer</p>
                        }

                    <button className="btn text-slate-900 btn-primary mt-4">Register</button>
                    <p>Already have an account? <NavLink to={'/login'} className="text-[#316d15] underline">sign in</NavLink></p>

                </fieldset>
            </form>
        </div>
    );
};

export default Register;