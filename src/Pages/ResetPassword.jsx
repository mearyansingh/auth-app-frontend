import React, { Fragment, useEffect, useRef, useState } from 'react'
import { Button, Card, Col, FloatingLabel, Form, Spinner } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useResetPasswordMutation, useSendResetOtpMutation } from '../slices/usersApiSlice';
// import axios from 'axios';
// import { getBaseUrl } from '../Helpers';
// import useAppContext from '../Hooks/useAppContext';
// import { resetPassword, sendResetOtp } from '../../../server/controllers/authController';

function ResetPassword() {
  //it will add the cookie to the request
  // axios.defaults.withCredentials = true;
  // const { isLoggedIn, userData, fetchUserData } = useAppContext()

  //RTK QUERY
  const [sendResetOtp, { isLoading: isSendingEmail }] = useSendResetOtpMutation();
  const [resetPassword, { isLoading: isResetting }] = useResetPasswordMutation();

  const [email, setEmail] = useState("")
  const [isEmailSent, setIsEmailSent] = useState(false)
  const [otp, setOtp] = useState(0)
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false)
  const [otpTimeLeft, setOtpTimeLeft] = useState(0);
  const [newPassword, setNewPassword] = useState("")

  const inputRefs = useRef([])
  const navigate = useNavigate()
  const OTP_DURATION = 600; // 10 mins in seconds

  //auto focus on next input
  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus()
    }
  }

  const clearOtpStorage = () => {
    localStorage.removeItem('otp_expires_at');
    localStorage.removeItem('otp_email');
  };

  // Restore OTP session from localStorage
  // On component mount, check localStorage for timer
  // isEmailSent becomes true, calculate the remaining time from the stored expiration:
  useEffect(() => {
    const storedExpiry = localStorage.getItem('otp_expires_at');
    const storedEmail = localStorage.getItem('otp_email');

    if (storedExpiry && storedEmail && !isOtpSubmitted) {
      const timeLeft = Math.floor((parseInt(storedExpiry) - Date.now()) / 1000);
      if (timeLeft > 0) {
        setEmail(storedEmail);
        setIsEmailSent(true);
        setOtpTimeLeft(timeLeft);
      } else {
        clearOtpStorage();
      }
    }
  }, []);

  // Effect: OTP countdown
  // Keep the countdown running & remove expiry on OTP submit
  // remove localStorage data once OTP is expired:
  useEffect(() => {
    // if (!isEmailSent || isOtpSubmitted) return;
    if (!isEmailSent || isOtpSubmitted || otpTimeLeft <= 0) return;

    const interval = setInterval(() => {
      setOtpTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          toast.error("OTP expired. Please request a new one.");
          setIsEmailSent(false);
          clearOtpStorage();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isEmailSent, isOtpSubmitted, otpTimeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  }

  // function that sends the OTP to store the expiration time in localStorage:
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await sendResetOtp(email).unwrap();
      if (res.success) {
        const expiresAt = Date.now() + OTP_DURATION * 1000; // 10 minutes in ms
        localStorage.setItem('otp_expires_at', expiresAt);
        localStorage.setItem('otp_email', email)
        setIsEmailSent(true)
        setOtpTimeLeft(OTP_DURATION); // Start the timer
        toast.success(res.message)
      } else {
        toast.error(res.message)
      }
    } catch (err) {
      const msg = err?.data?.message || err?.error || 'Failed to send email.';
      toast.error(msg);
    }
  }

  // Clean localStorage when OTP is used
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const enteredOtp = inputRefs.current.map(e => e.value).join('')
    // const enteredOtp = otpArray.join('');
    if (!/^\d{6}$/.test(enteredOtp)) {
      toast.error('OTP must be a 6-digit number');
      return;
    }
    if (enteredOtp.length < 6) {
      toast.error('Please enter a 6-digit OTP');
      return;
    }
    setOtp(enteredOtp);
    setIsOtpSubmitted(true)
    clearOtpStorage();
  }

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const res = await resetPassword({ email, otp, newPassword }).unwrap();
      if (res.success) {
        toast.success(res.message)
        navigate('/login')
        // After navigate('/login'), consider resetting any local state just to be safe
        setEmail('');
        setOtp(0);
        setNewPassword('');
        setIsOtpSubmitted(false);
        setIsEmailSent(false);
      } else {
        toast.error(res.message)
      }
    } catch (err) {
      const msg = err?.data?.message || err?.error || 'Failed to reset password';
      toast.error(msg);
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
    const paste = e.clipboardData.getData('text').trim()
    if (/^\d{6}$/.test(paste)) {
      const pasteArray = paste.split('');
      pasteArray.forEach((char, idx) => {
        if (inputRefs.current[idx]) {
          inputRefs.current[idx].value = char;
        }
      });
      // Optionally trigger submit if all 6 digits are pasted
      if (paste.length === 6) {
        const enteredOtp = paste;
        if (otpTimeLeft > 0) {
          handleOtpSubmit({ preventDefault: () => { } }, enteredOtp);
        } else {
          toast.error('OTP has expired. Please request a new one.');
        }
      }
    } else {
      toast.warning('Pasted value is not a valid 6-digit OTP.');
    }
  }

  const renderEmailForm = () => (
    <Card className='border-0 shadow-lg'>
      <Card.Body className='text-center p-4'>
        <svg id="logo-39" className="d-none d-sm-block mx-auto" alt="Auth app logo" width="100" height="100" viewBox="0 0 50 40" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M25.0001 0L50 15.0098V24.9863L25.0001 40L0 24.9863V15.0099L25.0001 0Z" fill="#A5B4FC" className="ccompli2"></path> <path fillRule="evenodd" clipRule="evenodd" d="M0 15.0098L25 0L50 15.0098V24.9863L25 40L0 24.9863V15.0098ZM25 33.631L44.6967 21.8022V18.1951L44.6957 18.1945L25 30.0197L5.30426 18.1945L5.3033 18.1951V21.8022L25 33.631ZM25 24.5046L40.1018 15.4376L36.4229 13.2298L25 20.0881L13.5771 13.2298L9.89822 15.4376L25 24.5046ZM25 14.573L31.829 10.4729L25 6.37467L18.171 10.4729L25 14.573Z" fill="#4F46E5" className="ccustom"></path> <path d="M25.0001 0L0 15.0099V24.9863L25 40L25.0001 0Z" fill="#A5B4FC" className="ccompli2" fillOpacity="0.3"></path> </svg>
        <h1 className='mb-0'>Reset Password</h1>
        <p className='mb-4 text-body-tertiary'>Enter your registered email address to reset the password.</p>
        <Form onSubmit={handleEmailSubmit} className='mb-4'>
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
          <Button
            type="submit"
            size='lg'
            variant='outline-dark'
            className='icon-link icon-link-hover px-4 rounded-pill d-block mx-auto'
            disabled={isSendingEmail}
          >
            {isSendingEmail ? (<><Spinner animation="border" size="sm" className="me-2" /> Sending OTP...</>) : 'Reset'}
          </Button>
        </Form>
        <p className='mb-0 text-body-secondary'>
          If you don't remember your email, please contact support.
          <br />
          <a href="https://devaryan.me" target='_blank' className="text-decoration-none">Contact support</a>
        </p>
      </Card.Body>
    </Card>
  )

  const renderOtpForm = () => (
    <Card className='border-0 shadow'>
      <Card.Body className='text-center  p-4'>
        {/* otp form */}
        <svg id="logo-39" className="d-none d-sm-block mx-auto " alt="Auth app logo" width="100" height="100" viewBox="0 0 50 40" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M25.0001 0L50 15.0098V24.9863L25.0001 40L0 24.9863V15.0099L25.0001 0Z" fill="#A5B4FC" className="ccompli2"></path> <path fillRule="evenodd" clipRule="evenodd" d="M0 15.0098L25 0L50 15.0098V24.9863L25 40L0 24.9863V15.0098ZM25 33.631L44.6967 21.8022V18.1951L44.6957 18.1945L25 30.0197L5.30426 18.1945L5.3033 18.1951V21.8022L25 33.631ZM25 24.5046L40.1018 15.4376L36.4229 13.2298L25 20.0881L13.5771 13.2298L9.89822 15.4376L25 24.5046ZM25 14.573L31.829 10.4729L25 6.37467L18.171 10.4729L25 14.573Z" fill="#4F46E5" className="ccustom"></path> <path d="M25.0001 0L0 15.0099V24.9863L25 40L25.0001 0Z" fill="#A5B4FC" className="ccompli2" fillOpacity="0.3"></path> </svg>
        <h1 className='mb-0'>Reset password OTP</h1>
        <p className='text-muted mb-4'>Enter the 6-digit code sent to your email id.</p>
        {otpTimeLeft > 0 &&
          <p className='mb-4 text-danger fw-semibold mb-3'>
            {`OTP will expire in ${formatTime(otpTimeLeft)}`}
          </p>
        }
        {otpTimeLeft <= 0 && (
          <p className="mb-4 text-warning fw-semibold mb-3">OTP has expired.</p>
        )}
        <Form onSubmit={handleOtpSubmit} className='mb-1'>
          <div className='hstack gap-2 gap-sm-3 mb-4' onPaste={handlePaste}>
            {Array(6).fill(0).map((_, index) => (
              <Fragment key={index}>
                <Form.Control
                  type="text"
                  size='lg'
                  required
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  ref={(e) => inputRefs.current[index] = e}
                  onInput={(e) => handleInput(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                />
              </Fragment>
            ))}
          </div>
          <Button
            type="submit"
            size='lg'
            variant='outline-dark'
            className='rounded-pill d-block mx-auto'
          >
            Verify OTP
          </Button>
        </Form>
      </Card.Body>
    </Card>
  )

  const renderPasswordForm = () => (
    <Card className='border-0 shadow-lg'>
      <Card.Body className='text-center p-4'>
        <svg id="logo-39" className="d-none d-sm-block mx-auto" alt="Auth app logo" width="100" height="100" viewBox="0 0 50 40" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M25.0001 0L50 15.0098V24.9863L25.0001 40L0 24.9863V15.0099L25.0001 0Z" fill="#A5B4FC" className="ccompli2"></path> <path fillRule="evenodd" clipRule="evenodd" d="M0 15.0098L25 0L50 15.0098V24.9863L25 40L0 24.9863V15.0098ZM25 33.631L44.6967 21.8022V18.1951L44.6957 18.1945L25 30.0197L5.30426 18.1945L5.3033 18.1951V21.8022L25 33.631ZM25 24.5046L40.1018 15.4376L36.4229 13.2298L25 20.0881L13.5771 13.2298L9.89822 15.4376L25 24.5046ZM25 14.573L31.829 10.4729L25 6.37467L18.171 10.4729L25 14.573Z" fill="#4F46E5" className="ccustom"></path> <path d="M25.0001 0L0 15.0099V24.9863L25 40L25.0001 0Z" fill="#A5B4FC" className="ccompli2" fillOpacity="0.3"></path> </svg>
        <h1 className='mb-0'>New Password</h1>
        <p className='mb-4'>Enter the new password below.</p>
        <Form onSubmit={handleResetPassword} className='mb-1'>
          <FloatingLabel
            controlId="password"
            label="Enter new password"
            className="mb-4"
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
          <Button
            type="submit"
            size='lg'
            variant='outline-dark'
            className='rounded-pill d-block mx-auto'
            disabled={isResetting}
          >
            {isResetting ? (<><Spinner animation="border" size="sm" className="me-2" /> Resetting...</>) : 'Set Password'}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  )

  return (
    <>
      <Col md={8} className="mx-auto text-center">
        {!isEmailSent && renderEmailForm()}
        {isEmailSent && !isOtpSubmitted && renderOtpForm()}
        {isEmailSent && isOtpSubmitted && renderPasswordForm()}
      </Col>
    </>
  )
}

export default ResetPassword
// TODO:
// send a verification email when the email changes too — I can help you set that up as well.
// Want to also block resending OTP before it expires (like a resend cooldown)? I can help you with that too.
// You’re already handling paste — nicely done! You can also:
// Auto-submit once 6 digits are entered.
// Add a resend OTP option (with a cooldown timer).
// our OTP timer will now persist across page reloads! Want me to help you extract this logic into a custom hook for cleaner code?

//NOTE:This is the context based approach
// const onSubmitEmail = async (e) => {
//    e.preventDefault();
//    try {
//       const { data } = await axios.post(`${getBaseUrl()}/api/auth/send-reset-otp`, { email })
//       if (data.success) {
//          setIsEmailSent(true)
//          toast.success(data.message)
//       } else {
//          toast.error(data.message)
//       }
//    } catch (error) {
//       toast.error(error.message)
//    }
// }

// const onSubmitNewPassword = async (e) => {
//    e.preventDefault();
//    try {
//       const { data } = await axios.post(`${getBaseUrl()}/api/auth/reset-password`, { email, otp, newPassword })
//       if (data.success) {
//          toast.success(data.message)
//          navigate('/login')
//       } else {
//          toast.error(data.message)
//       }
//    } catch (error) {
//       toast.error(error.message)
//    }
// }