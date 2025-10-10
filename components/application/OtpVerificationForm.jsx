import { zodSchema } from '@/lib/zodSchema'
import React from 'react'
import { useForm } from 'react-hook-form'

const OtpVerificationForm = ({ email, onSubmit, loading }) => {
    const formSchema = zodSchema.pick({
        otp: true,
        email: true
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            otp: '',
            email
        }
    })
    
    return (
        <div>
            <h1 className='text-2xl font-semibold'>OTP Verification</h1>
            <p>Please enter the OTP sent to your email</p>
            <form className='space-y-4'>
                <div>
                    <label htmlFor='otp' className='block text-sm font-medium'>OTP</label>
                    <input type='text' id='otp' className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2' />
                </div>
                <button type='submit' className='w-full bg-blue-600 text-white py-2 rounded-md'>Verify OTP</button>
            </form>
        </div>
    )
}

export default OtpVerificationForm
