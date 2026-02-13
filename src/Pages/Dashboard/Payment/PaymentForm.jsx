import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { TbFidgetSpinner } from "react-icons/tb";
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import Loader from '../../Shared/Loader/Loadder';
import useAuth from '../../../Hooks/useAuth';
import Swal from 'sweetalert2';

const PaymentForm = () => {
    const stripe = useStripe()
    const elements = useElements()
    const [error, setError] = useState('')
    const {user} = useAuth()
    const {id} = useParams()
    const axiosSecure = useAxiosSecure()
    const navigate = useNavigate()

    const {data: parcelInfo = {}, isPending} = useQuery({
        queryKey:['parcels', id],
        queryFn: async () => {
            const res = await axiosSecure.get(`/parcels/${id}`)
            return res.data
        }
    })

    if(isPending) {
     return <Loader/>
    }
    console.log(parcelInfo)
    const price = parcelInfo.delivery_cost
    const paymentInCents = price * 100
    console.log(paymentInCents)

    // console.log("ID from params",id)
    const handleSubmit = async(e) => {
        e.preventDefault()

        if(!stripe || !elements) {
            return
        }

        const card = elements.getElement(CardElement)
        if(!card) {
            return
        }

        const {error, paymentMethod} =await stripe.createPaymentMethod({
            type: 'card',
            card
        })
        if(error) {
            setError(error.message)
            console.log('error is :', error)
        } else{
            setError('');
            console.log('Payment Method', paymentMethod)
        }

        // payment intent
        const res = await axiosSecure.post('/create-payment-intent', {
            paymentInCents,
            id
        })
        console.log(res)
        const clientSecret = res.data.clientSecret

        const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement),
                billing_details: {
                    name: user.displayName,
                    email: user.email
                }
            }
        })

        if(result.error) {
            console.log(result.error.message)
            setError(result.error.message)
        } else {
            setError('')
            if(result.paymentIntent.status === 'succeeded') {
                console.log('Payment Succeeded !', result)
                const paymentData = {
                    id, 
                    amount: price,
                    email: user.email,
                    transactionId: result.paymentIntent.id,
                    paymentMethod: result.paymentIntent.payment_method_types 
                }
                const paymentRes = await axiosSecure.post('/payment', paymentData)
                if(paymentRes.data.insertedId) {
                    await Swal.fire({
                        icon: 'success',
                        title: 'payment Success',
                        html: `<strong>Trsnsaction ID: ${result.paymentIntent.id}</strong>`,
                        confirmButtonText: 'Go to my parcels'
                    })
                    navigate('/dashboard/myparcels')
                }
            }
        }

    }

    return (
        <div className=''>
            <form
                onSubmit={handleSubmit}
                className="max-w-md mx-auto bg-base-300 shadow-lg rounded-md items-center p-6 space-y-6"
                >
                <h2 className="text-2xl font-semibold text-center text-gray-800">
                    Complete Payment
                </h2>

                {/* Card Input */}
                <div className="p-4 border rounded-xl bg-gray-50 focus-within:ring-2 focus-within:ring-blue-500">
                    <CardElement
                    options={{
                        style: {
                        base: {
                            fontSize: "16px",
                            color: "#1f2937",
                            "::placeholder": {
                            color: "#9ca3af",
                            },
                        },
                        invalid: {
                            color: "#ef4444",
                        },
                        },
                    }}
                    />
                </div>

                {/* Pay Button */}
                <button
                    type="submit"
                    disabled={!stripe}
                    className="w-full bg-primary hover:bg-primary transition duration-300 text-black font-medium py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Pay ৳ {price}
                </button>
                { error && <p className='text-red-500'>{error}</p>}
            </form>
        </div>
    );
};

export default PaymentForm;