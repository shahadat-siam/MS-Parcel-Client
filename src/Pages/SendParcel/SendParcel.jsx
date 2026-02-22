import { useForm } from "react-hook-form"; 
import warehouseData from "./wearHouseData";
import Swal from "sweetalert2";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { useNavigate } from "react-router";

const generateTrackingId = () => {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");

  const random = Math.random().toString(36).substring(2, 7).toUpperCase();

  return `PRC-${date}-${random}`;
};

const SendParcel = () => {
  const { register, handleSubmit, watch, reset } = useForm();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate()

  const parcelType = watch("type");
  const senderRegion = watch("sender_region");
  const receiverRegion = watch("receiver_region");

  const regions = [...new Set(warehouseData.map((w) => w.region))];

  const getCentersByRegion = (region) =>
    warehouseData.filter((w) => w.region === region && w.status === "active");

  const calculateDeliveryCost = ({
    type,
    weight = 0,
    sender_region,
    receiver_region,
    sender_center,
    receiver_center,
  }) => {
    const isWithinCity =
      sender_region === receiver_region && sender_center === receiver_center;

    // 📄 DOCUMENT
    if (type === "document") {
      return isWithinCity ? 60 : 80;
    }

    // 📦 NON-DOCUMENT
    const numericWeight = Number(weight);

    // Up to 3kg
    if (numericWeight <= 3) {
      return isWithinCity ? 110 : 150;
    }

    // Above 3kg
    const basePrice = isWithinCity ? 110 : 150;
    const extraKg = numericWeight - 3;
    const extraWeightCost = extraKg * 40;
    const outsideExtra = isWithinCity ? 0 : 40;

    return basePrice + extraWeightCost + outsideExtra;
  };

  const onSubmit = (data) => {
    const cost = calculateDeliveryCost(data);

    Swal.fire({
      title: "Confirm Parcel",
      html: `
      <div class="text-left space-y-2">
        <p><b>Parcel Type:</b> ${data.type}</p>
        <p><b>Sender Center:</b> ${data.sender_center}</p>
        <p><b>Receiver Center:</b> ${data.receiver_center}</p>
        <hr />
        <p class="text-lg font-semibold">
          Delivery Cost: <span style="color:green;">৳${cost}</span>
        </p>
      </div>
    `,
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Confirm & Submit",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#22c55e", // Tailwind green-500
      cancelButtonColor: "#ef4444", // red-500
    }).then((result) => {
      if (result.isConfirmed) {
        const finalData = {
          tracking_id: generateTrackingId(),
          ...data,
          delivery_cost: cost,
          create_by: user.email,
          payment_status: "unpaid",
          delivery_status: "not collected",
          creation_date: new Date().toISOString(),
        };

        console.log("Saved Parcel:", finalData);
        // 🔁 API CALL HERE
        axiosSecure.post("/parcels", finalData).then((res) => {
          console.log(res.data);
          if (res.data.insertedId) {
            Swal.fire({
              title: "Redirect",
              text: "Proceding to Payment getway",
              icon: "success",
              timer:1500,
              confirmButtonColor: "#22c55e",
            });
            navigate('/dashboard/myparcels')
          }
        });
      }
    });
    reset()
  };

  return (
    <section className="max-w-7xl mx-auto px-3 md:px-5 py-6">
      {/* HEADER */}
      <div className="text-center">
        <h2 className="text-3xl uppercase font-urbanist ">Add Parcel</h2>
        <p className="text-gray-500 mt-2">
          Door to Door Parcel Delivery System
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 bg-base-100 p-3 md:p-6 rounded-2xl shadow-lg"
      >
        {/* PARCEL INFO */}
        <div className="bg-base-200 rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-6">📦 Parcel Info</h3>

          <div className="flex flex-col md:flex-row md:items-center gap-6">
            {/* Radio */}
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="document"
                  className="radio radio-success"
                  {...register("type", { required: true })}
                />
                Document
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="non-document"
                  className="radio radio-success"
                  {...register("type", { required: true })}
                />
                Non-Document
              </label>
            </div>

            <input
              className="input outline-none input-bordered w-full md:max-w-xs"
              placeholder="Parcel Title"
              {...register("title", { required: true })}
            />

            {parcelType === "non-document" && (
              <input
                type="number"
                className="input outline-none input-bordered w-full md:max-w-xs"
                placeholder="Weight (kg)"
                {...register("weight")}
              />
            )}
          </div>
        </div>

        {/* SENDER + RECEIVER GRID */}
        <div className="grid lg:grid-cols-2 w-full gap-8">
          {/* SENDER INFO */}
          <div className="bg-base-200 rounded-xl p-8">
            <h3 className="text-xl font-semibold mb-2">📤 Sender Info</h3>

            <div className="grid gap-3">
              <input
                className="input outline-none w-full input-bordered"
                placeholder="Sender Name"
                {...register("sender_name", { required: true })}
              />

              <input
                className="input outline-none w-full input-bordered"
                placeholder="Contact"
                {...register("sender_contact", { required: true })}
              />

              <select
                className="select outline-none w-full select-bordered"
                {...register("sender_region", { required: true })}
              >
                <option value="">Select Region</option>
                {regions.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>

              <select
                className="select outline-none w-full select-bordered"
                {...register("sender_center", { required: true })}
              >
                <option value="">Service Center</option>
                {getCentersByRegion(senderRegion).map((w) => (
                  <option key={w.district}>{w.district}</option>
                ))}
              </select>

              <input
                className="input outline-none w-full input-bordered "
                placeholder="Address"
                {...register("sender_address", { required: true })}
              />

              <textarea
                className="textarea outline-none w-full textarea-bordered "
                placeholder="Pickup Instruction"
                rows={3}
                {...register("pickup_instruction", { required: true })}
              />
            </div>
          </div>

          {/* RECEIVER INFO */}
          <div className="bg-base-200 rounded-xl p-8">
            <h3 className="text-xl font-semibold mb-2">📥 Receiver Info</h3>

            <div className="grid gap-3">
              <input
                className="input outline-none w-full input-bordered"
                placeholder="Receiver Name"
                {...register("receiver_name", { required: true })}
              />

              <input
                className="input outline-none w-full input-bordered"
                placeholder="Contact"
                {...register("receiver_contact", { required: true })}
              />

              <select
                className="select outline-none w-full select-bordered"
                {...register("receiver_region", { required: true })}
              >
                <option value="">Select Region</option>
                {regions.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>

              <select
                className="select outline-none w-full  select-bordered"
                {...register("receiver_center", { required: true })}
              >
                <option value="">Service Center</option>
                {getCentersByRegion(receiverRegion).map((w) => (
                  <option key={w.district}>{w.district}</option>
                ))}
              </select>

              <input
                className="input outline-none w-full input-bordered "
                placeholder="Address"
                {...register("receiver_address", { required: true })}
              />

              <textarea
                className="textarea outline-none w-full textarea-bordered  "
                placeholder="Delivery Instruction"
                rows={3}
                {...register("delivery_instruction", { required: true })}
              />
            </div>
          </div>
        </div>

        {/* SUBMIT */}
        <div className=" ">
          <button className="btn btn-primary text-slate-700 px-10 text-lg">
            Submit Parcel
          </button>
        </div>
      </form>
    </section>
  );
};

export default SendParcel;
