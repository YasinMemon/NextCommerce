"use client"

import React, { useEffect } from 'react'
import { use } from 'react'

import verifiedImg from '@/public/images/verified.gif'
import verificationFailedImg from '@/public/images/verification-failed.gif'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { CLIENT_HOME } from '@/app/routes/clientRoutes'

function VerifyEmail({ params } : { params: { token: string } }) {
  const { token } = params
  const [isVerified, setIsVerified] = React.useState(false)
  
  useEffect(() => {
  const verify = async () => {
    try {
      const response = await fetch('/api/auth/verifyemail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Email verified successfully:', data);
        setIsVerified(true);
      } else {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { message: 'Something went wrong' };
        }
        console.error('Error verifying email:', errorData);
      }
    } catch (error) {
      console.error('Error verifying email:', error);
    }
  };

  verify();
}, [token]);

  return (
    <Card>
      <CardContent>
        {isVerified ? (
          <div className='flex flex-col min-h-screen min-w-screen items-center justify-center gap-4'>
            <img src={verifiedImg.src} alt="Verified" className='w-48 h-48' />
            <p>Email verified successfully!</p>
            <Button asChild><Link href={CLIENT_HOME}>Continue Shopping</Link></Button>
          </div>
        ) : (
          <div className='flex flex-col min-h-screen min-w-screen items-center justify-center gap-4'>
            <img src={verificationFailedImg.src} alt="Verification Failed" className='w-48 h-48' />
            <p>Verification failed. Please try again.</p>
            
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default VerifyEmail
