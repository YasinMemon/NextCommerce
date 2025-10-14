"use client"

import { zodSchema } from '@/lib/zodSchema'
import React from 'react'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../ui/input-otp'
import { zodResolver } from '@hookform/resolvers/zod'
import { ButtonLoading } from './ButtonLoading'

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

    const handleOtpVerification = async (values) => {
        onSubmit(values)
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
                        <div>
                            <p className="text-sm text-gray-600">Didn't receive the OTP? <a href="#" className="text-blue-600">Resend OTP</a></p>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default OtpVerificationForm
