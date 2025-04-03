import { Container } from 'react-bootstrap'
import { Link } from 'react-router-dom'
function Footer() {
  return (
    <footer className=" py-3 border-top shadow-lg d-flex align-items-center">
      <Container fluid>
        <div className='d-flex flex-wrap justify-content-between align-items-center'>
          <p className="col-md-4 mb-0 text-light">© 2025 Company, Inc</p>
          <Link to="/" className="col-md-4 d-flex align-items-center justify-content-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none">
            <svg id="logo-39" className='pe-2' width="40" height="32" viewBox="0 0 50 40" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M25.0001 0L50 15.0098V24.9863L25.0001 40L0 24.9863V15.0099L25.0001 0Z" fill="#A5B4FC" className="ccompli2"></path> <path fillRule="evenodd" clipRule="evenodd" d="M0 15.0098L25 0L50 15.0098V24.9863L25 40L0 24.9863V15.0098ZM25 33.631L44.6967 21.8022V18.1951L44.6957 18.1945L25 30.0197L5.30426 18.1945L5.3033 18.1951V21.8022L25 33.631ZM25 24.5046L40.1018 15.4376L36.4229 13.2298L25 20.0881L13.5771 13.2298L9.89822 15.4376L25 24.5046ZM25 14.573L31.829 10.4729L25 6.37467L18.171 10.4729L25 14.573Z" fill="#4F46E5" className="ccustom"></path> <path d="M25.0001 0L0 15.0099V24.9863L25 40L25.0001 0Z" fill="#A5B4FC" className="ccompli2" fillOpacity="0.3"></path> </svg>
          </Link>
          <p className='mb-0 text-light'>Made with ❤️ by <a className=" text-dark fw-bold" href='https://devaryan.me'>devaryan</a></p>
        </div>
      </Container>
    </footer>
  )
}

export default Footer