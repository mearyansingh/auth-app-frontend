import axios from 'axios';
import React, { Fragment, useRef, useState } from 'react'
import { Button, Card, Col, FloatingLabel, Form } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import useAppContext from '../Hooks/useAppContext';
import { toast } from 'react-toastify';

function ResetPassword() {
   //it will add the cookie to the request
   axios.defaults.withCredentials = true;
   const navigate = useNavigate()
   const { serverUrl, isLoggedIn, userData, fetchUserData } = useAppContext()

   const inputRefs = useRef([])

   const [email, setEmail] = useState("")
   const [newPassword, setNewPassword] = useState("")
   const [isEmailSent, setIsEmailSent] = useState(false)
   const [otp, setOtp] = useState(0)
   const [isOtpSubmitted, setIsOtpSubmitted] = useState(false)

   //auto focus on next input
   const handleInput = (e, index) => {
      if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
         inputRefs.current[index + 1].focus()
      }
   }
   //backspace
   const handleKeyDown = (e, index) => {
      if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
         inputRefs.current[index - 1].focus()
      }
   }

   //paste otp 
   const handlePaste = (e) => {
      const paste = e.clipboardData.getData('text')
      const pasteArray = paste.split('');
      pasteArray.forEach((char, idx) => {
         if (inputRefs.current[idx]) {
            inputRefs.current[idx].value = char
         }
      })
   }

   const onSubmitEmail = async (e) => {
      e.preventDefault();
      try {
         const { data } = await axios.post(`${serverUrl}/api/auth/send-reset-otp`, { email })
         if (data.success) {
            setIsEmailSent(true)
            toast.success(data.message)
         } else {
            toast.error(data.message)
         }
      } catch (error) {
         toast.error(error.message)
      }
   }

   const onSubmitOtp = async (e) => {
      e.preventDefault();
      const otpArray = inputRefs.current.map(e => e.value)
      setOtp(otpArray.join(''));
      setIsOtpSubmitted(true)

   }

   const onSubmitNewPassword = async (e) => {
      e.preventDefault();
      try {
         const { data } = await axios.post(`${serverUrl}/api/auth/reset-password`, { email, otp, newPassword })
         if (data.success) {
            toast.success(data.message)
            navigate('/login')
         } else {
            toast.error(data.message)
         }
      } catch (error) {
         toast.error(error.message)
      }
   }

   return (
      <>
         <Col md={8} className="mx-auto text-center">
            {!isEmailSent &&
               <Card className='border-0 shadow-lg'>

                  <Card.Body className='text-center p-4'>
                     <svg id="logo-39" className="d-none d-sm-block mx-auto" alt="Auth app logo" width="100" height="100" viewBox="0 0 50 40" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M25.0001 0L50 15.0098V24.9863L25.0001 40L0 24.9863V15.0099L25.0001 0Z" fill="#A5B4FC" className="ccompli2"></path> <path fillRule="evenodd" clipRule="evenodd" d="M0 15.0098L25 0L50 15.0098V24.9863L25 40L0 24.9863V15.0098ZM25 33.631L44.6967 21.8022V18.1951L44.6957 18.1945L25 30.0197L5.30426 18.1945L5.3033 18.1951V21.8022L25 33.631ZM25 24.5046L40.1018 15.4376L36.4229 13.2298L25 20.0881L13.5771 13.2298L9.89822 15.4376L25 24.5046ZM25 14.573L31.829 10.4729L25 6.37467L18.171 10.4729L25 14.573Z" fill="#4F46E5" className="ccustom"></path> <path d="M25.0001 0L0 15.0099V24.9863L25 40L25.0001 0Z" fill="#A5B4FC" className="ccompli2" fillOpacity="0.3"></path> </svg>
                     <h1 className='mb-0'>Reset Password</h1>
                     <p className='mb-4 text-body-tertiary'>Enter your registered email address.</p>
                     <Form onSubmit={onSubmitEmail} className='mb-4'>
                        <FloatingLabel
                           controlId="email"
                           label="Email address"
                           className="mb-4"
                        >
                           <Form.Control
                              type="email"
                              placeholder="name@example.com"
                              required
                              name='email'
                              value={email}
                              onChange={e => setEmail(e.target.value)}
                           />
                        </FloatingLabel>
                        <Button type="submit" size='lg' variant='outline-dark' className='icon-link icon-link-hover px-4 rounded-pill d-block mx-auto'>
                           Submit<i className="lh-1 bi bi-arrow-right fs-4" />
                        </Button>
                     </Form>
                     <p className='mb-0 text-body-secondary'>
                        If you don't remember your email, please contact support.
                        <br />
                        <a href="https://devaryan.me" target='_blank' className="text-decoration-none">Contact support</a>
                     </p>
                  </Card.Body>
               </Card>
            }
            {/* Otp Verify */}
            {!isOtpSubmitted && isEmailSent &&
               <Card>
                  <Card.Body className='text-center'>
                     {/* otp form */}
                     <svg id="logo-39" className="d-none d-sm-block mx-auto mb-3" alt="Auth app logo" width="100" height="100" viewBox="0 0 50 40" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M25.0001 0L50 15.0098V24.9863L25.0001 40L0 24.9863V15.0099L25.0001 0Z" fill="#A5B4FC" className="ccompli2"></path> <path fillRule="evenodd" clipRule="evenodd" d="M0 15.0098L25 0L50 15.0098V24.9863L25 40L0 24.9863V15.0098ZM25 33.631L44.6967 21.8022V18.1951L44.6957 18.1945L25 30.0197L5.30426 18.1945L5.3033 18.1951V21.8022L25 33.631ZM25 24.5046L40.1018 15.4376L36.4229 13.2298L25 20.0881L13.5771 13.2298L9.89822 15.4376L25 24.5046ZM25 14.573L31.829 10.4729L25 6.37467L18.171 10.4729L25 14.573Z" fill="#4F46E5" className="ccustom"></path> <path d="M25.0001 0L0 15.0099V24.9863L25 40L25.0001 0Z" fill="#A5B4FC" className="ccompli2" fillOpacity="0.3"></path> </svg>
                     <h1>Reset password OTP</h1>
                     <p className='text-muted'>Enter the 6-digit code sent to your email id.</p>
                     <Form onSubmit={onSubmitOtp}>
                        <div className='hstack gap-2 mb-3' onPaste={handlePaste}>
                           {Array(6).fill(0).map((_, index) => (
                              <Fragment key={index}>
                                 <Form.Control
                                    type="text"
                                    size='lg'
                                    required
                                    maxLength={1}
                                    ref={(e) => inputRefs.current[index] = e}
                                    onInput={(e) => handleInput(e, index)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                 />
                              </Fragment>
                           ))}
                        </div>
                        <Button type="submit" size='lg' variant='outline-dark' className='rounded-pill d-block mx-auto'>
                           Verify OTP
                        </Button>
                     </Form>
                  </Card.Body>
               </Card>
            }
            {/* New Password */}
            {isOtpSubmitted && isEmailSent &&
               <Card className='border-0 shadow-lg'>
                  <Card.Body className='text-center'>
                     <svg id="logo-39" className="d-none d-sm-block mx-auto mb-3" alt="Auth app logo" width="100" height="100" viewBox="0 0 50 40" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M25.0001 0L50 15.0098V24.9863L25.0001 40L0 24.9863V15.0099L25.0001 0Z" fill="#A5B4FC" className="ccompli2"></path> <path fillRule="evenodd" clipRule="evenodd" d="M0 15.0098L25 0L50 15.0098V24.9863L25 40L0 24.9863V15.0098ZM25 33.631L44.6967 21.8022V18.1951L44.6957 18.1945L25 30.0197L5.30426 18.1945L5.3033 18.1951V21.8022L25 33.631ZM25 24.5046L40.1018 15.4376L36.4229 13.2298L25 20.0881L13.5771 13.2298L9.89822 15.4376L25 24.5046ZM25 14.573L31.829 10.4729L25 6.37467L18.171 10.4729L25 14.573Z" fill="#4F46E5" className="ccustom"></path> <path d="M25.0001 0L0 15.0099V24.9863L25 40L25.0001 0Z" fill="#A5B4FC" className="ccompli2" fillOpacity="0.3"></path> </svg>
                     <h1>New Password</h1>
                     <p>Enter the new password below.</p>
                     <Form onSubmit={onSubmitNewPassword}>
                        <FloatingLabel
                           controlId="password"
                           label="Enter new password"
                           className="mb-3"
                        >
                           <Form.Control
                              type="password"
                              placeholder="Enter new password"
                              required
                              name='password'
                              value={newPassword}
                              onChange={e => setNewPassword(e.target.value)}
                           />
                        </FloatingLabel>
                        <Button type="submit" size='lg' variant='outline-dark' className='rounded-pill d-block mx-auto'>
                           Submit
                        </Button>
                     </Form>
                  </Card.Body>
               </Card>
            }
         </Col>
      </>
   )
}

export default ResetPassword