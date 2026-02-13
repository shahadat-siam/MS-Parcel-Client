import React, { useState } from "react";

const DisplayParcels = ({ parcels = [], onDelete, onPay }) => {
  const [openId, setOpenId] = useState(null);

  const handleView = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">
        My Parcels ({parcels.length})
      </h2>

      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead className="bg-base-200">
            <tr>
              <th>#</th>
              <th>Type</th>
              <th>Receiver</th>
              <th>Cost</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {parcels.map((parcel, index) => (
              <React.Fragment key={parcel._id}>
                {/* SUMMARY ROW */}
                <tr
                  className={
                    openId === parcel._id ? "bg-base-200" : ""
                  }
                >
                  <td>{index + 1}</td>
                  <td className="capitalize">{parcel.type}</td>
                  <td>{parcel.receiver_name}</td>
                  <td>৳{parcel.delivery_cost}</td>

                  <td>
                    <span
                      className={`badge ${
                        parcel.payment_status === "paid"
                          ? "badge-success"
                          : "badge-warning"
                      }`}
                    >
                      {parcel.payment_status}
                    </span>
                  </td>

                  <td>
                    <span className="badge badge-info">
                      {parcel.delivery_status}
                    </span>
                  </td>

                  <td className="text-sm">
                    {new Date(
                      parcel.creation_date
                    ).toLocaleDateString()}
                  </td>

                  <td className="space-x-1">
                    <button
                      className="btn btn-xs btn-info"
                      onClick={() => handleView(parcel._id)}
                    >
                      {openId === parcel._id
                        ? "Hide"
                        : "View"}
                    </button>

                    <button
                      className="btn btn-xs btn-success"
                      disabled={
                        parcel.payment_status === "paid"
                      }
                      onClick={() => onPay?.(parcel._id)}
                    >
                      Pay
                    </button>

                    <button
                      className="btn btn-xs btn-error"
                      onClick={() => onDelete?.(parcel._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>

                {/* DETAILS ROW */}
                {openId === parcel._id && (
                  <tr>
                    <td colSpan="8" className="bg-base-100">
                      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Detail
                          title="Sender"
                          data={[
                            parcel.sender_name,
                            parcel.sender_contact,
                            `${parcel.sender_address}, ${parcel.sender_center}, ${parcel.sender_region}`,
                          ]}
                        />

                        <Detail
                          title="Receiver"
                          data={[
                            parcel.receiver_name,
                            parcel.receiver_contact,
                            `${parcel.receiver_address}, ${parcel.receiver_center}, ${parcel.receiver_region}`,
                          ]}
                        />

                        <div className="md:col-span-2">
                          <p>
                            <strong>Pickup:</strong>{" "}
                            {parcel.pickup_instruction ||
                              "N/A"}
                          </p>
                          <p>
                            <strong>Delivery:</strong>{" "}
                            {parcel.delivery_instruction ||
                              "N/A"}
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}

            {parcels.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center py-6">
                  No parcels found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* ---------- Helper Components ---------- */

const Detail = ({ title, data }) => (
  <div>
    <h4 className="font-semibold mb-1">{title}</h4>
    {data.map((item, i) => (
      <p key={i} className="text-sm text-gray-600">
        {item}
      </p>
    ))}
  </div>
);

export default DisplayParcels;
