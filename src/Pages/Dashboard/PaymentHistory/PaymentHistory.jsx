import React from 'react';
import useAuth from '../../../Hooks/useAuth';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';

const PaymentHistory = () => {
    const {user} = useAuth();
    const axiosSecure = useAxiosSecure()

    const {isPending, data: payments = []} =useQuery({
        queryKey: ['payments', user.email],
        queryFn: async() => {
            const res = await axiosSecure.get(`/payments?email=${user.email}`)
            return res.data
        }
    })
    // console.log(payments)

  return (
    <div className="p-4 md:p-8">
      <h2 className="text-2xl md:text-3xl font-bold mb-6">
        Payment History
      </h2>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="table w-full">
          <thead className="bg-base-200">
            <tr>
              <th>#</th>
              <th>Transaction ID</th>
              <th>Amount</th>
              <th>Parcel ID</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment, index) => (
              <tr key={payment._id} className="hover">
                <td>{index + 1}</td>

                {/* Full Transaction ID */}
                <td className="font-mono text-xs break-all">
                  {payment.transactionId}
                </td>

                <td className="font-semibold text-[#1D546D]">
                  ${payment.amount / 100}
                </td>

                <td>
                  <span className="font-mono text-xs">
                    {payment.id}
                  </span>
                </td>

                <td>
                  {new Date(payment.paid_at).toLocaleString()}
                </td>

                <td>
                  <span className="badge badge-success">
                    Paid
                  </span>
                </td>
              </tr>
            ))}

            {payments.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center py-6">
                  No Payment History
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Layout */}
      <div className="md:hidden space-y-5">
        {payments.map((payment, index) => (
          <div
            key={payment._id}
            className="bg-base-100 shadow-lg rounded-xl p-5 border border-base-200"
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-lg text-[#1D546D]">
                ${payment.amount / 100}
              </h3>
              <span className="badge badge-success">Paid</span>
            </div>

            <div className="space-y-2 text-sm">

              <div className='flex justify-between'>
                <span className="font-semibold ">Transaction ID:</span>
                <p className="font-mono text-xs break-all mt-1">
                  {payment.transactionId}
                </p>
              </div>

              <div className="flex justify-between">
                <span className="font-semibold">Parcel ID:</span>
                <span className="font-mono text-xs">
                  {payment.id}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="font-semibold">Date:</span>
                <span>
                  {new Date(payment.paid_at).toLocaleDateString()}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="font-semibold">Time:</span>
                <span>
                  {new Date(payment.paid_at).toLocaleTimeString()}
                </span>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentHistory;