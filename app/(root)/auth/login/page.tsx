"use client"
import { Card, CardContent } from '@/components/ui/card'
import React, { useState } from 'react'
import Logo from "@/public/images/logo-black.png"
import Image from 'next/image'
import { zodSchema } from '@/lib/zodSchema'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'

import { IoMdEye } from "react-icons/io";
import { FaEyeSlash } from "react-icons/fa6";

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from '@/components/ui/input'
import { ButtonLoading } from '@/components/application/ButtonLoading'
import Link from 'next/link'
import { CLIENT_REGISTER } from '@/app/routes/clientRoutes'

const Login = () => {
  const formSchema = zodSchema.pick({
    email: true,
  }).extend({
    password: z.string().min(4, { message: "Password field required" })
  })
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  })

  async function handleLoginSubmit(values: z.infer<typeof formSchema>){
       setLoading(true)
       const response = await fetch("/api/auth/login", {
         method: "POST",
         headers: {
            "Content-Type": "application/json"
         },
         body: JSON.stringify(values)
       })
      const data = await response.json()
      if (!response.ok) {
        // Handle error
        console.error(data)
        setLoading(false)
        return
      }
  
      // Handle success
      console.log(data)
      setLoading(false)
     }
  return <Card>
      <CardContent>
        <div className='flex justify-center items-center' >
          <Image src={Logo.src} width={Logo.width} height={Logo.height} className='max-w-[150px]' alt='logo' />
        </div>
        <div className='text-center' >
        <h1 className='text-2xl font-semibold' >Login into Account</h1>
        <p>Login into your account by filling out the form below</p>
        </div>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleLoginSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className='mt-4' >
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="example@gmail.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"

          render={({ field }) => (
            <FormItem className='relative' >
              <FormLabel>password</FormLabel>
              <FormControl>
              </FormControl>
                <Input type={showPassword ? "text" : "password"} placeholder="*****" {...field} />
                <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                className='absolute top-1/2 right-4 cursor-pointer' 
                >
                  {
                    showPassword ? <FaEyeSlash/> : <IoMdEye /> 
                  }
                  </button>  
                    
              <FormMessage />
            </FormItem>
          )}
        />
        <ButtonLoading type="submit" text="Login" isLoading={loading} className='w-full cursor-pointer' />
      </form>
    </Form>
        <div className='mt-4 flex justify-center items-center gap-1' >  
          <p>Don't have account</p>
          <Link href={CLIENT_REGISTER} className="text-primary underline cursor-pointer" > Create Account </Link>
        </div>
        <div>
          <p className='text-primary underline text-center' >Forget Password?</p>
        </div>
      </CardContent>
    </Card>
}

export default Login
