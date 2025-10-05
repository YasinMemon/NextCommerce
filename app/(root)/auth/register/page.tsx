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
import { CLIENT_LOGIN } from '@/app/routes/clientRoutes'

function Register() {
  const formSchema = zodSchema.pick({
        fullName: true,
     email: true,
     password: true,
        confirmPassword: true
   })
   const [loading, setLoading] = useState(false);
   const [showPassword, setShowPassword] = useState(false)
 
   const form = useForm<z.infer<typeof formSchema>>({
     resolver: zodResolver(formSchema),
     defaultValues: {
         fullName: "",
       email: "",
       password: "",
            confirmPassword: ""
     }
   })
 
   async function handleRegisterSubmit(values: z.infer<typeof formSchema>){
     setLoading(true)
     const response = await fetch("/api/auth/register", {
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
         <h1 className='text-2xl font-semibold' >Create your Account</h1>
         <p>Fill out the form below to create an account</p>
         </div>
     <Form {...form}>
       <form onSubmit={form.handleSubmit(handleRegisterSubmit)} className="space-y-4">
         <FormField
           control={form.control}
           name="fullName"
           render={({ field }) => (
             <FormItem className='mt-4' >
               <FormLabel>Full Name</FormLabel>
               <FormControl>
                 <Input placeholder="John Doe" {...field} />
               </FormControl>
               <FormMessage />
             </FormItem>
           )}
         />
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
                 <Input type={"password"} placeholder="*****" {...field} />
               <FormMessage />
             </FormItem>
           )}
         />
         <FormField
           control={form.control}
           name="confirmPassword"
 
           render={({ field }) => (
             <FormItem className='relative' >
               <FormLabel>Confirm Password</FormLabel>
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
         <ButtonLoading type="submit" text="Create Account" isLoading={loading} className='w-full cursor-pointer' />
       </form>
     </Form>
         <div className='mt-4 flex justify-center items-center gap-1' >  
           <p>Already have an account?</p>
           <Link href={CLIENT_LOGIN} className="text-primary underline cursor-pointer" > Login </Link>
         </div>
       </CardContent>
     </Card>
}

export default Register