import { useEffect, useState } from "react";
import { useForm } from "react-hook-form"; 
import serviceCenters from './Riderdata'
import useAuth from "../../../Hooks/useAuth";
import useAxios from "../../../Hooks/useAxios";
import Swal from "sweetalert2";

const BeARider = () => {
  const { user } = useAuth();
  const { register, handleSubmit, setValue, watch } = useForm();
  const axiosSecure = useAxios()
  const [regions, setRegions] = useState([]);
  const [districts, setDistricts] = useState([]);

  const selectedRegion = watch("region");

  // Extract unique regions
  useEffect(() => {
    const uniqueRegions = [
      ...new Set(serviceCenters.map(item => item.region))
    ];
    setRegions(uniqueRegions);
  }, [serviceCenters]);

  // Filter districts by region
  useEffect(() => {
    if (selectedRegion) {
      const filteredDistricts = serviceCenters
        .filter(item => item.region === selectedRegion)
        .map(item => item.district);

      setDistricts(filteredDistricts);
    }
  }, [selectedRegion, serviceCenters]);

  // Set default user data
  useEffect(() => {
    if (user) {
      setValue("name", user.displayName);
      setValue("email", user.email);
      setValue("status", "pending");
    }
  }, [user, setValue]);

  const onSubmit =async data => { 
    const riderData = {
        ...data,
        create_at: new Date().toISOString(),
        status: 'pending'
    }
    // console.log(riderData)
    // send data to backend here
    await axiosSecure.post('/rider', riderData)
    .then(res => {
        if(res.data.insertedId) {
            Swal.fire({
                icon: 'success',
                title: 'Application Submitted',
                text: 'Your application is pending now'
            })
        }
    })
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Be a Rider</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Name */}
        <input
          {...register("name")}
          readOnly
          className="input outline-none input-bordered w-full"
          placeholder="Name"
        />

        {/* Email */}
        <input
          {...register("email")}
          readOnly
          className="input outline-none input-bordered w-full"
          placeholder="Email"
        />

        {/* Phone */}
        <input
          {...register("phone", { required: true })}
          className="input outline-none input-bordered w-full"
          placeholder="Phone Number"
        />

        {/* Date of Birth */}
        <input
          type="date"
          {...register("dob", { required: true })}
          className="input outline-none input-bordered w-full"
        />

        {/* National ID */}
        <input
          {...register("nid", { required: true })}
          className="input input-bordered w-full"
          placeholder="National ID Card Number"
        />

        {/* Bike Number */}
        <input
          {...register("bikeNumber", { required: true })}
          className="input outline-none input-bordered w-full"
          placeholder="Bike Number"
        />

        {/* Region */}
        <select
          {...register("region", { required: true })}
          className="select outline-none select-bordered w-full"
        >
          <option value="">Select Region</option>
          {regions.map(region => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>

        {/* District */}
        <select
          {...register("district", { required: true })}
          className="select outline-none select-bordered w-full"
        >
          <option value="">Select District</option>
          {districts.map(district => (
            <option key={district} value={district}>
              {district}
            </option>
          ))}
        </select> 

        <button
          type="submit"
          className="btn btn-primary text-black md:col-span-2"
        >
          Apply as Rider
        </button>
      </form>
    </div>
  );
};

export default BeARider;
