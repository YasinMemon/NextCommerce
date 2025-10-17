"use client"

import { zodSchema } from '@/lib/zodSchema'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../ui/input-otp'
import { zodResolver } from '@hookform/resolvers/zod'
import { ButtonLoading } from './ButtonLoading'

const OtpVerificationForm = ({ email, onSubmit, loading }) => {
    const [resendingOtp, setResendingOtp] = useState(false);
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

    const handleOtpVerification = async (values) => {
        onSubmit(values)
    }

    const resendOtp = async () => {
        try {
            setResendingOtp(true);
            const response = await fetch('/api/auth/resend-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });
            const data = await response.json();
            if (response.ok) {
                alert(data.message || 'OTP has been resent to your email');
            } else {
                alert(data.message || 'Failed to resend OTP');
            }
        } catch (error) {
            console.error('Error resending OTP:', error);
        } finally {
            setResendingOtp(false);
        }
    }

    return (
        <div>
            <Form {...form}>
                <div className="mb-6 text-center">
                    <h2 className="text-2xl font-bold mb-2">OTP Verification</h2>
                    <p className="text-sm text-gray-600">Enter the OTP sent to your email address.</p>
                </div>
                <form onSubmit={form.handleSubmit(handleOtpVerification)} className="space-y-8">
                    <div className='flex justify-center mt-4'>
                        <FormField
                            control={form.control}
                            name="otp"
                            render={({ field }) => (
                                <FormItem className='mt-4' >
                                    <FormLabel>One Time Password (OTP)</FormLabel>
                                    <FormControl>
                                        <InputOTP maxLength={6} {...field}>
                                            <InputOTPGroup>
                                                <InputOTPSlot index={0} />
                                                <InputOTPSlot index={1} />
                                                <InputOTPSlot index={2} />
                                                <InputOTPSlot index={3} />
                                                <InputOTPSlot index={4} />
                                                <InputOTPSlot index={5} />
                                            </InputOTPGroup>
                                        </InputOTP>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className='flex justify-center mt-4 space-y-4 flex-col'>
                        <ButtonLoading type="submit" text="Verify OTP" isLoading={loading} className='w-full cursor-pointer' />
                        <div className='text-center' >
                            <p className="text-sm text-gray-600">Didn't receive the OTP? <span className="text-blue-600 cursor-pointer" onClick={resendOtp} >
                                {resendingOtp ? 'Resending...' : 'Resend OTP'}
                            </span></p>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default OtpVerificationForm
