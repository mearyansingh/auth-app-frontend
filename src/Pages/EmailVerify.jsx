// import axios from 'axios'
import { Fragment, useEffect, useRef } from 'react'
import { Button, Card, Col, Form, Spinner } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useVerifyOtpMutation } from '../slices/usersApiSlice'
import { setCredentials } from '../slices/authSlice'
// import { getBaseUrl } from '../Helpers'
// import useAppContext from '../Hooks/useAppContext'
// import { AppContext } from '../Context/AppContext'

function EmailVerify() {
	//it will add the cookie to the request
	// axios.defaults.withCredentials = true;
	// const { isLoggedIn, userData, fetchUserData } = useAppContext()

	const { userInfo } = useSelector(state => state.auth)
	const [verifyOtp, { isLoading }] = useVerifyOtpMutation()
	const dispatch = useDispatch()
	const navigate = useNavigate()

	const inputRefs = useRef([])

	//Automatically redirect to home page if user account is verified
	// useEffect(() => {
	//     isLoggedIn && userData && userData.isAccountVerified && navigate('/')
	// }, [isLoggedIn, userData])

	useEffect(() => {
		userInfo && userInfo.isAccountVerified && navigate('/')
	}, [userInfo, navigate])

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

	const onSubmitHandler = async (e) => {
		e.preventDefault()
		const otp = inputRefs.current.map(el => el.value).join('')
		try {
			const res = await verifyOtp(otp).unwrap()
			if (res.success) {
				dispatch(setCredentials(res.userData))
				toast.success(res.message)
				navigate('/')
			} else {
				toast.success(res.message)
			}
		} catch (err) {
			const msg = err?.data?.message || err?.error;
			toast.error(msg);
		}
	}

	//Handle form submit
	// const onSubmitHandler = async (e) => {
	//     e.preventDefault();
	//     try {
	//         const otpArray = inputRefs.current.map(e => e.value)
	//         const otp = otpArray.join('');
	//         const { data } = await axios.post(`${getBaseUrl()}/api/auth/verify-account`, { otp })
	//         if (data.success) {
	//             toast.success(data.message)
	//             fetchUserData()
	//             navigate('/')
	//         } else {
	//             toast.success(data.message)
	//         }
	//     } catch (error) {
	//         toast.error(error.message)
	//     }
	// }

	return (
		<Col md={8} className="mx-auto text-center">
			<Card className='border-0 shadow-lg'>
				<Card.Body className='text-center p-4'>
					<svg id="logo-39" className="d-none d-sm-block mx-auto" alt="Auth app logo" width="100" height="100" viewBox="0 0 50 40" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M25.0001 0L50 15.0098V24.9863L25.0001 40L0 24.9863V15.0099L25.0001 0Z" fill="#A5B4FC" className="ccompli2"></path> <path fillRule="evenodd" clipRule="evenodd" d="M0 15.0098L25 0L50 15.0098V24.9863L25 40L0 24.9863V15.0098ZM25 33.631L44.6967 21.8022V18.1951L44.6957 18.1945L25 30.0197L5.30426 18.1945L5.3033 18.1951V21.8022L25 33.631ZM25 24.5046L40.1018 15.4376L36.4229 13.2298L25 20.0881L13.5771 13.2298L9.89822 15.4376L25 24.5046ZM25 14.573L31.829 10.4729L25 6.37467L18.171 10.4729L25 14.573Z" fill="#4F46E5" className="ccustom"></path> <path d="M25.0001 0L0 15.0099V24.9863L25 40L25.0001 0Z" fill="#A5B4FC" className="ccompli2" fillOpacity="0.3"></path> </svg>
					<h1 className='mb-0'>Email verify OTP</h1>
					<p className='text-muted mb-4'>Enter the 6-digit code sent to your email id.</p>
					<Form onSubmit={onSubmitHandler} className='mb-1'>
						<div className='hstack gap-4 mb-4' onPaste={handlePaste}>
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
						<Button
							type="submit"
							size='lg'
							variant='outline-dark'
							className='rounded-pill d-block mx-auto'
							disabled={isLoading}
						>
							{isLoading ? (
								<>
									<Spinner animation="border" size="sm" role="status" className="me-2" aria-hidden="true" />
									Verifying...
								</>
							) : (
								'Verify OTP'
							)}
						</Button>
					</Form>
				</Card.Body>
			</Card>
		</Col>
	)
}

export default EmailVerify