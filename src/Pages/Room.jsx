import { useEffect, useRef, useState } from 'react'
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { useParams } from 'react-router-dom';

function Room() {

  const [isLoading, setIsLoading] = useState(true); // New loading state
  const [hideOverlay, setHideOverlay] = useState(false);

  const { roomId } = useParams()
  const meetingContainerRef = useRef(null)
  const zpRef = useRef(null); // Store Zego instance

  useEffect(() => {

    const myMeeting = async (element) => {
      // generate Kit Token
      const appID = 343801593;
      const serverSecret = "312676368c2f1e35cf7bbe314a2132a8";
      // const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomID, randomID(5), randomID(5));
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomId, Date.now().toString(), 'devLife');

      // Create instance object from Kit Token.
      const zp = ZegoUIKitPrebuilt.create(kitToken);
      zpRef.current = zp; // Save instance

      // start the call
      try {
        await zp.joinRoom({
          container: element,
          sharedLinks: [
            {
              name: 'Personal link',
              // url:window.location.protocol + '//' + window.location.host + window.location.pathname + '?roomID=' +roomID,
              url: `${window.location.origin}/room/${roomId}`,
            },
          ],
          scenario: {
            // mode: ZegoUIKitPrebuilt.GroupCall, // To implement 1-on-1 calls, modify the parameter here to [ZegoUIKitPrebuilt.OneONoneCall].
            mode: ZegoUIKitPrebuilt.OneONoneCall, // To implement 1-on-1 calls, modify the parameter here to [ZegoUIKitPrebuilt.OneONoneCall].
          },
        });
      } catch (error) {
        console.error('Error joining room:', error);
      } finally {
        // Fade out smoothly
        setTimeout(() => {
          setHideOverlay(true); // Trigger CSS fade-out
          setTimeout(() => setIsLoading(false), 500); // After animation done, remove completely
        }, 100);
      }
    }

    if (meetingContainerRef.current) {
      myMeeting(meetingContainerRef.current);
    }

    return () => {
      if (zpRef.current) {
        zpRef.current.destroy(); // Cleanup Zego instance
        zpRef.current = null; // Clear ref
      }
    };

  }, [roomId])

  return (
    <div
      className="myCallContainer flex-grow-1 d-flex justify-content-center align-items-center"
      style={{
        width: '100%',
        height: '100vh',
        position: 'relative',
      }}
    >
      {isLoading && (
        <div
          className={`loading-overlay d-flex justify-content-center align-items-center flex-column ${hideOverlay ? 'fade-out' : ''}`}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100vh',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            zIndex: 10,
          }}
        >
          <div className="spinner pulse-glow"></div>
          <div style={{ marginTop: '1rem', fontWeight: 'bold', fontSize: '1.2rem' }}>
            Loading Meeting...
          </div>
        </div>
      )}
      <div
        style={{ width: '100%', height: '100vh' }}
        ref={meetingContainerRef}
      ></div>
    </div>
  )
}

export default Room