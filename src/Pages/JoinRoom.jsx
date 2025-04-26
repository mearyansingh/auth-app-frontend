import { useCallback, useState } from 'react'
import { Button } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'

function JoinRoom() {
  const [roomId, setRoomId] = useState('')
  const navigate = useNavigate()

  const handleJoinRoom = useCallback(() => {
    if (roomId.trim()) {
      navigate(`/room/${roomId}`)
    }
  }, [roomId, navigate])

  return (
    <div className="container-fluid bg-dark min-vh-100 d-flex align-items-center justify-content-center position-relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="position-absolute top-0 start-0 bg-primary rounded-circle"
        style={{ width: '300px', height: '300px', filter: 'blur(150px)', opacity: '0.3', transform: 'translate(-50%, -50%)' }}></div>
      <div className="position-absolute bottom-0 end-0 bg-info rounded-circle"
        style={{ width: '400px', height: '400px', filter: 'blur(180px)', opacity: '0.2', transform: 'translate(30%, 30%)' }}></div>

      <div className="card border-0 shadow-lg rounded-4" style={{ maxWidth: '450px', background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)' }}>
        <div className="card-body p-4 p-lg-5">
          <div className="text-center mb-5">
            <div className="badge bg-primary bg-opacity-10 text-primary fs-6 mb-3 py-2 px-3 rounded-pill">Video Conferencing</div>
            <h1 className="display-6 fw-bold mb-2">Join Room</h1>
            <p className="text-secondary">Connect with others in a secure video meeting</p>
          </div>

          <div className="form-floating mb-4">
            <input
              type="text"
              className="form-control form-control-lg border-0 bg-light"
              id="roomIdInput"
              placeholder="Enter room ID"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
            />
            <label htmlFor="roomIdInput" className="text-muted">Room ID</label>
          </div>

          <div className="d-grid gap-2 mb-4">
            <Button
              variant='primary'
              type="button"
              size='lg'
              className="py-3 rounded-pill fw-bold"
              onClick={handleJoinRoom}
              disabled={!roomId.trim()}
            >
              <span className="d-flex align-items-center justify-content-center">
                <i className="bi bi-camera-video-fill me-2"></i>
                Join Meeting
              </span>
            </Button>
          </div>

          <div className="text-center">
            <div className="d-flex justify-content-center align-items-center">
              <hr className="flex-grow-1" />
              <span className="mx-3 text-muted">or</span>
              <hr className="flex-grow-1" />
            </div>

            <Button as={Link} to='/' variant='outline-dark' className="rounded-pill mt-3">
              <i className="bi bi-arrow-left me-2"></i>
              Back to Home
            </Button>
          </div>

          <div className="alert alert-light border-0 rounded-3 mt-4 text-center bg-light bg-opacity-75">
            <small className="text-secondary">
              <i className="bi bi-shield-lock me-1"></i>
              End-to-end encrypted and secure
            </small>
          </div>
        </div>
      </div>
    </div>
  )
}

export default JoinRoom