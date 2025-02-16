"use client";

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import Peer from 'simple-peer';
import { Mic, MicOff, Video, VideoOff, Phone } from 'lucide-react';

interface Message {
  text: string;
  sender: string;
  senderName: string;
}

export default function VideoChat() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [roomId, setRoomId] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [peer, setPeer] = useState<Peer.Instance | null>(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [videoQuality, setVideoQuality] = useState<'low' | 'medium' | 'high'>('medium');
  const [userName, setUserName] = useState('');

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const newSocket = io('http://localhost:4000', {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000
    });

    newSocket.on('connect', () => {
      console.log('Connected to socket server:', newSocket.id);
      setIsReconnecting(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setIsReconnecting(true);
    });

    setSocket(newSocket);

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on('user-joined', (userId) => {
      console.log('User joined:', userId);
      initializeCall(true);
    });

    socket.on('offer', (signal) => {
      handleOffer(signal);
    });

    socket.on('answer', (signal) => {
      if (peer) {
        peer.signal(signal);
      }
    });

    socket.on('message', (message: Message) => {
      console.log('Received message:', message);
      setMessages(prev => [...prev, message]);
    });

    return () => {
      socket.off('user-joined');
      socket.off('offer');
      socket.off('answer');
      socket.off('message');
    };
  }, [socket, peer]);

  // Cleanup function for media streams
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => {
          track.stop();
        });
      }
    };
  }, [stream]);

  const getVideoConstraints = () => {
    const constraints = {
      low: { width: 640, height: 480 },
      medium: { width: 1280, height: 720 },
      high: { width: 1920, height: 1080 }
    };
    return {
      video: {
        ...constraints[videoQuality],
        facingMode: 'user'
      },
      audio: true
    };
  };

  const joinRoom = async () => {
    if (!socket || !roomId || !userName) return;
    setIsLoading(true);

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      console.log('Media stream tracks:', mediaStream.getTracks());
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = mediaStream;
        await localVideoRef.current.play().catch(e => console.error('Play error:', e));
        console.log('Local video playing');
      }
      
      setStream(mediaStream);
      socket.emit('join-room', { roomId, userName });
      setIsJoined(true);
    } catch (error) {
      console.error('Error accessing media devices:', error);
      alert('Failed to access camera/microphone. Please check permissions.');
    } finally {
      setIsLoading(false);
    }
  };

  const initializeCall = (isInitiator: boolean) => {
    if (!stream || !socket) return;

    const newPeer = new Peer({
      initiator: isInitiator,
      stream,
      trickle: false,
    });

    newPeer.on('signal', (signal) => {
      if (isInitiator) {
        socket.emit('offer', { signal, room: roomId });
      } else {
        socket.emit('answer', { signal, room: roomId });
      }
    });

    newPeer.on('stream', (remoteStream) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
      }
    });

    setPeer(newPeer);
  };

  const handleOffer = (signal: Peer.SignalData) => {
    if (peer) {
      peer.signal(signal);
    }
  };

  const sendMessage = () => {
    if (!socket || !inputMessage.trim() || !userName || !roomId) return;

    const message: Message = {
      text: inputMessage,
      sender: socket.id,
      senderName: userName
    };

    // Send message to server
    socket.emit('send-message', { message, roomId });
    
    // Add message to local state
    setMessages(prev => [...prev, message]);
    setInputMessage('');
  };

  const toggleVideo = () => {
    if (stream) {
      stream.getVideoTracks().forEach((track) => {
        track.enabled = !isVideoEnabled;
      });
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  const toggleAudio = () => {
    if (stream) {
      stream.getAudioTracks().forEach((track) => {
        track.enabled = !isAudioEnabled;
      });
      setIsAudioEnabled(!isAudioEnabled);
    }
  };

  const endCall = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    if (peer) {
      peer.destroy();
    }
    if (socket) {
      socket.disconnect();
    }
    setIsJoined(false);
    setStream(null);
    setPeer(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {isReconnecting && (
        <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-white text-center py-2">
          Reconnecting...
        </div>
      )}

      {isLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-white">Loading...</div>
        </div>
      )}

      {!isJoined ? (
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-4">Join Video Chat</h1>
          <input
            type="text"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            placeholder="Enter room ID"
            className="w-full p-2 mb-4 border rounded"
          />
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Enter your name"
            className="w-full p-2 mb-4 border rounded"
          />
          <button
            onClick={joinRoom}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Join Room
          </button>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto grid grid-cols-3 gap-4">
          <div className="col-span-2 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="relative bg-black rounded-lg overflow-hidden h-[400px]">
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                  style={{ transform: 'scaleX(-1)' }}
                />
                {!localVideoRef.current?.srcObject && <div className="text-white">No local stream</div>}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
                  <button
                    onClick={toggleVideo}
                    className="p-2 rounded-full bg-gray-800 text-white hover:bg-gray-700"
                  >
                    {isVideoEnabled ? <Video size={20} /> : <VideoOff size={20} />}
                  </button>
                  <button
                    onClick={toggleAudio}
                    className="p-2 rounded-full bg-gray-800 text-white hover:bg-gray-700"
                  >
                    {isAudioEnabled ? <Mic size={20} /> : <MicOff size={20} />}
                  </button>
                  <button
                    onClick={endCall}
                    className="p-2 rounded-full bg-red-600 text-white hover:bg-red-700"
                  >
                    <Phone size={20} />
                  </button>
                </div>
              </div>
              <div className="bg-black rounded-lg overflow-hidden h-[400px]">
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                {!remoteVideoRef.current?.srcObject && <div className="text-white">No remote stream</div>}
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 flex flex-col h-[600px]">
            <div className="flex-1 overflow-y-auto mb-4 space-y-2">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`p-2 rounded-lg ${
                    msg.sender === socket?.id
                      ? 'bg-blue-500 text-white ml-auto'
                      : 'bg-gray-200'
                  } max-w-[80%]`}
                >
                  {msg.text}
                </div>
              ))}
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..."
                className="flex-1 p-2 border rounded"
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}