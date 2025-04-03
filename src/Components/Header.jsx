import { Link, useNavigate } from "react-router-dom";
import { Button, Offcanvas, Navbar, Nav, Container, Dropdown } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import useAppContext from '../Hooks/useAppContext';

function Header() {
	// context
	const { userData, serverUrl, setUserData, setIsLoggedIn } = useAppContext();
	const navigate = useNavigate()

	const handleLogout = async () => {
		try {
			axios.defaults.withCredentials = true
			const { data } = await axios.post(`${serverUrl}/api/auth/logout`)
			if (data.success) {
				data.success && setIsLoggedIn(false)
				data.success && setUserData(null)
				toast.success(data.message)
				navigate('/')
			} else {
				toast.error(data.message)
			}
		} catch (error) {
			toast.error(error.message)
		}
	}

	const sendVerificationOtp = async () => {
		try {
			axios.defaults.withCredentials = true
			const { data } = await axios.post(`${serverUrl}/api/auth/send-verify-otp`)
			if (data.success) {
				navigate('/email-verify')
				toast.success(data.message)
			} else {
				toast.error(data.message)
			}
		} catch (error) {
			toast.error(error.message)
		}
	}

	return (
		<header className="bg-dark bg-gradient py-1 sticky-top shadow-lg ">
			<div className="container-fluid d-flex justify-content-between gap-3 align-items-center">
				<Link to="/" className='fw-bold fs-4 text-light text-decoration-none'>
					<svg id="logo-39" className='pe-2' width="80" height="80" viewBox="0 0 50 40" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M25.0001 0L50 15.0098V24.9863L25.0001 40L0 24.9863V15.0099L25.0001 0Z" fill="#A5B4FC" className="ccompli2"></path> <path fillRule="evenodd" clipRule="evenodd" d="M0 15.0098L25 0L50 15.0098V24.9863L25 40L0 24.9863V15.0098ZM25 33.631L44.6967 21.8022V18.1951L44.6957 18.1945L25 30.0197L5.30426 18.1945L5.3033 18.1951V21.8022L25 33.631ZM25 24.5046L40.1018 15.4376L36.4229 13.2298L25 20.0881L13.5771 13.2298L9.89822 15.4376L25 24.5046ZM25 14.573L31.829 10.4729L25 6.37467L18.171 10.4729L25 14.573Z" fill="#4F46E5" className="ccustom"></path> <path d="M25.0001 0L0 15.0099V24.9863L25 40L25.0001 0Z" fill="#A5B4FC" className="ccompli2" fillOpacity="0.3"></path> </svg>
					Auth App
				</Link>
				{userData ?
					<Dropdown>
						<Dropdown.Toggle as={Button} variant="link" id="dropdown-basic" className="d-block bg-light link-body-emphasis text-decoration-none">
							{userData?.name[0].toUpperCase()}
						</Dropdown.Toggle>
						<Dropdown.Menu className="border-0">
							{!userData.isAccountVerified &&
								<Dropdown.Item variant="outline-light" type="button" size='lg' onClick={sendVerificationOtp} className='rounded-pill'>Verify Email</Dropdown.Item>
							}
							<Dropdown.Item type="button" onClick={handleLogout} >Logout</Dropdown.Item>
						</Dropdown.Menu>
					</Dropdown>
					:
					<Button variant="outline-light" type="button" size='lg' as={Link} to="/login" className='icon-link icon-link-hover px-4 rounded-pill'>
						Login<i className="lh-1 bi bi-arrow-right fs-4" />
					</Button>
				}
			</div>
		</header>
	)
}

export default Header