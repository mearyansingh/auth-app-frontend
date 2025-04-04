import React from 'react'
import { Col, Image, Container } from 'react-bootstrap'
import useAppContext from '../Hooks/useAppContext'
import { Link } from 'react-router-dom'

function Home() {
  const { userData } = useAppContext()
  return (
    <>
      <Col md={8} className="mx-auto text-center">
        <svg id="logo-39" className="d-none d-sm-block mx-auto mb-3" alt="Auth app logo" width="200" height="165" viewBox="0 0 50 40" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M25.0001 0L50 15.0098V24.9863L25.0001 40L0 24.9863V15.0099L25.0001 0Z" fill="#A5B4FC" className="ccompli2"></path> <path fillRule="evenodd" clipRule="evenodd" d="M0 15.0098L25 0L50 15.0098V24.9863L25 40L0 24.9863V15.0098ZM25 33.631L44.6967 21.8022V18.1951L44.6957 18.1945L25 30.0197L5.30426 18.1945L5.3033 18.1951V21.8022L25 33.631ZM25 24.5046L40.1018 15.4376L36.4229 13.2298L25 20.0881L13.5771 13.2298L9.89822 15.4376L25 24.5046ZM25 14.573L31.829 10.4729L25 6.37467L18.171 10.4729L25 14.573Z" fill="#4F46E5" className="ccustom"></path> <path d="M25.0001 0L0 15.0099V24.9863L25 40L25.0001 0Z" fill="#A5B4FC" className="ccompli2" fillOpacity="0.3"></path> </svg>
        <p className='fw-bold fs-3'>Hey {userData ? userData.name : 'Developer'}!</p>
        <h1 className="mb-4 fw-semibold">Welcome to Our App Where Access is Effortless and Security is Second Nature</h1>
        <p className="lead mb-4">
          Our authentication system is built for both convenience and security. Users can quickly sign up or log in, reset forgotten passwords with ease, and verify their identity through secure email confirmation. For added protection, OTP-based authentication ensures only the right person gets in. Whether you're a new user or returning, our access features make managing your account smooth, safe, and stress-free.
        </p>
        <div className="px-4 py-5">
          <h2 className="pb-2 border-bottom text-start">MERN stack authentication app</h2>

          <div className="row row-cols-1 row-cols-md-2 align-items-md-center g-5 py-5">
            <div className="col d-flex flex-column align-items-start gap-2 text-start">
              <h2 className="fw-bold text-body-emphasis">Secure & Seamless User Access</h2>
              <p className="text-body-secondary">Empower your users with flexible, secure authentication options for effortless access and account management.</p>
              <Link to="/login" className="btn btn-primary btn-lg">Explore Now</Link>
            </div>
            <div className="col">
              <div className="row row-cols-1 row-cols-sm-2 g-4">
                <div className="col d-flex flex-column gap-2 text-start">
                  <div className="feature-icon-small d-inline-flex align-items-center justify-content-center text-bg-dark bg-gradient fs-4 rounded-3">
                    <i className="bi bi-lightbulb" />
                  </div>
                  <h3 className="h4 fw-semibold mb-0 text-body-emphasis">Sign up/Login</h3>
                  <p className="text-body-secondary">Quick and secure user registration and login with personalized account access.</p>
                </div>

                <div className="col d-flex flex-column gap-2 text-start">
                  <div className="feature-icon-small d-inline-flex align-items-center justify-content-center text-bg-dark bg-gradient fs-4 rounded-3">
                    <i className="bi bi-lightning" />
                  </div>
                  <h4 className="fw-semibold mb-0 text-body-emphasis">Reset password</h4>
                  <p className="text-body-secondary">Easily reset forgotten passwords with secure email verification.</p>
                </div>

                <div className="col d-flex flex-column gap-2 text-start">
                  <div className="feature-icon-small d-inline-flex align-items-center justify-content-center text-bg-dark bg-gradient fs-4 rounded-3">
                    <i className="bi bi-shield-lock" />
                  </div>
                  <h4 className="fw-semibold mb-0 text-body-emphasis">Email authentication</h4>
                  <p className="text-body-secondary">Verify user identity through secure email-based confirmation OTP.</p>
                </div>

                <div className="col d-flex flex-column gap-2 text-start">
                  <div className="feature-icon-small d-inline-flex align-items-center justify-content-center text-bg-dark bg-gradient fs-4 rounded-3">
                    <i className="bi bi-unlock" />
                  </div>
                  <h4 className="fw-semibold mb-0 text-body-emphasis">OTP based authentication</h4>
                  <p className="text-body-secondary">Authenticate users with one-time passwords sent to their email.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Col>
    </>
  )
}

export default Home