import { useEffect, useState } from 'react'
import { Button, Card, Col, Form, FloatingLabel, Spinner, Badge, Alert } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { useUpdateUserMutation } from '../slices/usersApiSlice'
import { setCredentials } from '../slices/authSlice'

function Profile() {
  const { userInfo } = useSelector(state => state.auth)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })

  const isFormChanged = formData.name !== userInfo.name || formData.email !== userInfo.email

  const dispatch = useDispatch()
  const [updateProfile, { isLoading }] = useUpdateUserMutation()

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    setFormData({
      name: userInfo.name,
      email: userInfo.email,
      password: '',
    })
  }, [userInfo.name, userInfo.email])


  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const { name, email } = formData
      const res = await updateProfile({
        _id: userInfo.id,
        name,
        email,
      }).unwrap();
      if (res?.success) {
        dispatch(setCredentials(res.userUpdatedData));
        toast.success('Profile updated successfully!');
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      const msg = err?.data?.message || err?.error;
      toast.error(msg);
    }
  };

  return (
    <Col md={8} className="mx-auto text-center">
      <Card className='border-0 shadow-lg'>
        <Card.Body className='text-center p-4'>
          <svg id="logo-39" className="d-none d-sm-block mx-auto" alt="Auth app logo" width="100" height="100" viewBox="0 0 50 40" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M25.0001 0L50 15.0098V24.9863L25.0001 40L0 24.9863V15.0099L25.0001 0Z" fill="#A5B4FC" className="ccompli2"></path> <path fillRule="evenodd" clipRule="evenodd" d="M0 15.0098L25 0L50 15.0098V24.9863L25 40L0 24.9863V15.0098ZM25 33.631L44.6967 21.8022V18.1951L44.6957 18.1945L25 30.0197L5.30426 18.1945L5.3033 18.1951V21.8022L25 33.631ZM25 24.5046L40.1018 15.4376L36.4229 13.2298L25 20.0881L13.5771 13.2298L9.89822 15.4376L25 24.5046ZM25 14.573L31.829 10.4729L25 6.37467L18.171 10.4729L25 14.573Z" fill="#4F46E5" className="ccustom"></path> <path d="M25.0001 0L0 15.0099V24.9863L25 40L25.0001 0Z" fill="#A5B4FC" className="ccompli2" fillOpacity="0.3"></path> </svg>
          <h1 className='mb-0'>Update profile</h1>
          <p className='mb-4 text-body-tertiary'>Update your profile with ease.</p>
          <Form onSubmit={onSubmitHandler} className='mb-1'>
            <FloatingLabel
              controlId="fullName"
              label="Full name"
              className="mb-4"
            >
              <Form.Control
                type="text"
                placeholder="Full name"
                name='name'
                value={formData.name}
                onChange={handleChange}
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="email"
              label="Email address"
              className=" position-relative"
            >
              <Form.Control
                type="email"
                placeholder="name@example.com"
                name='email'
                value={formData.email}
                onChange={handleChange}
                className='mb-4'
              />
              { }
              <Badge bg={`${userInfo?.isAccountVerified ? 'success-subtle text-success' : 'danger-subtle text-danger'}`} className="position-absolute top-50 end-0 translate-middle">
                <i className={`bi pe-1  ${userInfo?.isAccountVerified ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'}`} />{`${userInfo?.isAccountVerified ? 'Email verified' : 'Email not verified'}`}
              </Badge>
            </FloatingLabel>
            {!userInfo?.isAccountVerified &&
              <Alert variant="danger" className='text-start'>
                <i className='bi bi-exclamation-triangle-fill fs-5 pe-1' />Your account is not verified. Please verify your email.
              </Alert>
            }
            <div className='d-flex flex-column gap-4'>
              <Button
                type="submit"
                size='lg'
                variant='outline-dark'
                className='px-4 rounded-pill align-items-center mx-auto icon-link icon-link-hover'
                disabled={isLoading || !isFormChanged}
              >
                {isLoading ? (
                  <>
                    <Spinner animation="border" size="sm" role="status" className="me-2" />
                    Updating...
                  </>
                ) : (
                  'Update'
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Col>
  )
}

export default Profile