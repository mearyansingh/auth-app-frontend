import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Card, Form, FloatingLabel, Col, Button, Spinner } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useLoginMutation, useRegisterMutation } from '../slices/usersApiSlice.js'
import { setCredentials } from '../slices/authSlice.js'
// import axios from 'axios'
// import { AppContext } from '../Context/AppContext.jsx'
// import { getBaseUrl } from '../Helpers/index.js'
function Login() {
  //context 
  // const { setIsLoggedIn, fetchUserData } = useContext(AppContext)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { userInfo } = useSelector(state => state.auth)

  // Toggle between Sign Up and Sign In
  const [state, setState] = useState('sign-up')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })

  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const [register, { isLoading: isRegisterLoading }] = useRegisterMutation();

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (userInfo) {
      navigate('/');
    }
  }, [navigate, userInfo])

  // axios.defaults.withCredentials = true; //send the cookies also
  // Handle Form Submission
  // const onSubmitHandler = async (e) => {
  //   e.preventDefault();
  //   const submissionData = state === 'sign-up' ? formData : { email: formData.email, password: formData.password };
  //   try {
  //     let response;
  //     if (state === 'sign-up') {
  //       response = await axios.post(`${getBaseUrl()}/api/auth/register`, submissionData);
  //     } else {
  //       response = await axios.post(`${getBaseUrl()}/api/auth/login`, submissionData);
  //     }
  //     const { data } = response;
  //     if (data.success) {
  //       setIsLoggedIn(true);
  //       fetchUserData();
  //       toast.success(state === 'sign-up' ? 'Sign Up Successful!' : 'Login Successful!');
  //       navigate('/');
  //     } else {
  //       toast.error(data.message);
  //     }
  //     // if (state === 'sign-up') {
  //     //   const { data } = await axios.post(`${getBaseUrl()}/api/auth/register`, submissionData)
  //     //   if (data.success) {
  //     //     setIsLoggedIn(true)
  //     //     fetchUserData()
  //     //     navigate('/')
  //     //     toast.success('Sign Up Successful!');
  //     //   } else {
  //     //     toast.error(data.message);
  //     //   }
  //     // } else {
  //     //   const { data } = await axios.post(`${getBaseUrl()}/api/auth/login`, submissionData)
  //     //   if (data.success) {
  //     //     setIsLoggedIn(true)
  //     //     fetchUserData()
  //     //     navigate('/')
  //     //     toast.success(data.message);
  //     //   } else {
  //     //     toast.error(data.message);
  //     //   }
  //     // }
  //   } catch (error) {
  //     // Log the error for debugging
  //     console.error(`Error during ${state === 'sign-up' ? 'Sign Up' : 'Login'} submission:`, error);
  //     toast.error(error.message);
  //   }
  // };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const payload = state === 'sign-up' ? { ...formData } : { email: formData.email, password: formData.password };
    try {
      const res = state === 'sign-up' ? await register(payload).unwrap() : await login(payload).unwrap();
      if (res?.success) {
        dispatch(setCredentials(res.userData));
        toast.success(state === 'sign-up' ? 'Registration successful!' : 'Login successful!');
        navigate('/');
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      const msg = err?.data?.message || err?.error;
      toast.error(msg);
    }
  };

  return (
    <>
      <Col md={8} className="mx-auto text-center">
        <Card className='border-0 shadow-lg'>
          <Card.Body className='text-center p-4'>
            <svg id="logo-39" className="d-none d-sm-block mx-auto" alt="Auth app logo" width="100" height="100" viewBox="0 0 50 40" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M25.0001 0L50 15.0098V24.9863L25.0001 40L0 24.9863V15.0099L25.0001 0Z" fill="#A5B4FC" className="ccompli2"></path> <path fillRule="evenodd" clipRule="evenodd" d="M0 15.0098L25 0L50 15.0098V24.9863L25 40L0 24.9863V15.0098ZM25 33.631L44.6967 21.8022V18.1951L44.6957 18.1945L25 30.0197L5.30426 18.1945L5.3033 18.1951V21.8022L25 33.631ZM25 24.5046L40.1018 15.4376L36.4229 13.2298L25 20.0881L13.5771 13.2298L9.89822 15.4376L25 24.5046ZM25 14.573L31.829 10.4729L25 6.37467L18.171 10.4729L25 14.573Z" fill="#4F46E5" className="ccustom"></path> <path d="M25.0001 0L0 15.0099V24.9863L25 40L25.0001 0Z" fill="#A5B4FC" className="ccompli2" fillOpacity="0.3"></path> </svg>
            <h1 className='mb-0'>{state === 'sign-up' ? 'Create account' : 'Login'}</h1>
            <p className='mb-4 text-body-tertiary'>{state === 'sign-up' ? 'Create your account' : 'Login to your account!'}</p>
            <Form onSubmit={onSubmitHandler} className='mb-3'>
              {state === 'sign-up' && (
                <FloatingLabel
                  controlId="fullName"
                  label="Full name"
                  className="mb-4"
                >
                  <Form.Control
                    type="text"
                    placeholder="Full name"
                    required
                    name='name'
                    value={formData.name}
                    onChange={handleChange}
                  />
                </FloatingLabel>
              )}
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
                  value={formData.email}
                  onChange={handleChange}
                />
              </FloatingLabel>
              <FloatingLabel
                controlId="password"
                label="Enter password"
                className="mb-4"
              >
                <Form.Control
                  type="password"
                  placeholder="Enter password"
                  required
                  name='password'
                  value={formData.password}
                  onChange={handleChange}
                />
              </FloatingLabel>
              <div className='d-flex flex-column gap-4'>
                {state === 'login' && (
                  <Link to="/reset-password" className="text-decoration-none d-block">
                    Forgot password?
                  </Link>
                )}
                <Button
                  type="submit"
                  size='lg'
                  variant='outline-dark'
                  className='px-4 rounded-pill align-items-center mx-auto icon-link icon-link-hover'
                  disabled={isLoginLoading || isRegisterLoading}
                >
                  {(isLoginLoading || isRegisterLoading) ? (
                    <>
                      <Spinner animation="border" size="sm" role="status" className="me-2" aria-hidden="true" />
                      {state === 'sign-up' ? 'Signing in...' : 'Login...'}
                    </>
                  ) : (
                    <>
                      {state === 'sign-up' ? 'Sign Up' : 'Login'}<i className="lh-1 bi bi-arrow-right fs-4" />
                    </>
                  )}
                </Button>
              </div>
            </Form>
            {state === 'sign-up' ? (
              <p className='mb-0 d-inline-flex align-items-center text-body-secondary'>Already have an account? {' '}
                <Button variant='link' className='ms-1 p-0 ' onClick={() => setState('login')}>Login here</Button>
              </p>
            ) : (
              <p className='mb-0 d-inline-flex align-items-center text-body-secondary'>Don't have an account? {' '}
                <Button variant='link' className='ms-1 p-0' onClick={() => setState('sign-up')}>Sign Up</Button>
              </p>
            )}
          </Card.Body>
        </Card>
      </Col>
    </>
  )
}

export default Login