"use client";

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import Peer from 'simple-peer';
import { Mic, MicOff, Video, VideoOff, Phone } from 'lucide-react';

interface Message {
  text: string;
  sender: string;
  senderName: string;
  file?: {
    name: string;
    url: string;
    type: string;
  };
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isVideoElementReady, setIsVideoElementReady] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const newSocket = io('http://192.168.11.12:4000', {
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

    socket.on('user-joined', (userId: string) => {
      console.log('User joined:', userId);
      initializeCall(true);
    });

    socket.on('offer', ({ signal, from }) => {
      console.log('Received offer from:', from);
      if (peer) {
        peer.signal(signal);
      }
    });

    socket.on('answer', ({ signal, from }) => {
      console.log('Received answer from:', from);
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

  useEffect(() => {
    // Debug log to check if refs are initialized
    console.log('Video refs:', {
      local: localVideoRef.current,
      remote: remoteVideoRef.current
    });
  }, []);

  // Add effect to monitor video element
  useEffect(() => {
    if (localVideoRef.current) {
      setIsVideoElementReady(true);
      console.log('Video element mounted');
    }
  }, []);

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
    if (!socket || !roomId || !userName) {
      console.error('Missing required data:', { socket, roomId, userName });
      return;
    }
    setIsLoading(true);

    try {
      console.log('Checking media devices...');
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      console.log('Available video devices:', videoDevices);

      console.log('Requesting media stream...');
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: true
      }).catch(error => {
        console.error('getUserMedia error:', error.name, error.message);
        throw new Error(`Camera access failed: ${error.message}`);
      });
      
      console.log('Got media stream tracks:', mediaStream.getTracks());
      
      if (localVideoRef.current) {
        console.log('Setting local video source');
        localVideoRef.current.srcObject = mediaStream;
        await localVideoRef.current.play().catch(e => {
          console.error('Video play error:', e);
          throw new Error('Failed to play video stream');
        });
        console.log('Local video playing');
        
        setStream(mediaStream);
        socket.emit('join-room', { roomId, userName });
        setIsJoined(true);
      } else {
        throw new Error('Video element not found');
      }
    } catch (error) {
      console.error('Error in joinRoom:', error);
      alert(`Failed to start video: ${error.message}. Please check camera permissions and try again.`);
      setIsJoined(false);
    } finally {
      setIsLoading(false);
    }
  };

  const initializeCall = (isInitiator: boolean) => {
    if (!stream || !socket) return;

    console.log('Initializing peer connection as initiator:', isInitiator);
    
    const newPeer = new Peer({
      initiator: isInitiator,
      stream: stream,
      trickle: false,
    });

    newPeer.on('signal', (signal) => {
      console.log('Generated signal:', signal);
      if (isInitiator) {
        socket.emit('offer', { signal, room: roomId });
      } else {
        socket.emit('answer', { signal, room: roomId });
      }
    });

    newPeer.on('stream', (remoteStream) => {
      console.log('Received remote stream');
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
        remoteVideoRef.current.play().catch(e => console.error('Remote play error:', e));
      }
    });

    setPeer(newPeer);
  };

  const sendMessage = () => {
    if (!socket || !inputMessage.trim() || !userName || !roomId) return;

    const message: Message = {
      text: inputMessage,
      sender: socket?.id ?? '',
      senderName: userName
    };

    // Send message to server
    socket.emit('send-message', { message, roomId });
    console.log('Sending message:', message);
    
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

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      sendFile(file);
    }
  };

  const sendFile = async (file: File) => {
    if (!socket || !userName || !roomId) return;

    // Convert file to base64
    const reader = new FileReader();
    reader.onload = (e) => {
      const message: Message = {
        text: `Sent a file: ${file.name}`,
        sender: socket?.id ?? '',
        senderName: userName,
        file: {
          name: file.name,
          url: e.target?.result as string,
          type: file.type
        }
      };

      socket.emit('send-message', { message, roomId });
      setMessages(prev => [...prev, message]);
    };
    reader.readAsDataURL(file);
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

      <div className={isJoined ? 'hidden' : ''}>
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-4">Join Video Chat</h1>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Enter your name"
            className="w-full p-2 mb-4 border rounded"
          />
          <input
            type="text"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            placeholder="Enter room ID"
            className="w-full p-2 mb-4 border rounded"
          />
          <button
            onClick={joinRoom}
            disabled={!userName || !roomId || isLoading}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {isLoading ? 'Connecting...' : 'Join Room'}
          </button>
        </div>
      </div>

      {/* Always render video elements */}
      <div className={!isJoined ? 'hidden' : 'max-w-6xl mx-auto grid grid-cols-3 gap-4'}>
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
              <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
                You ({userName})
              </div>
              {!localVideoRef.current?.srcObject && (
                <div className="absolute inset-0 flex items-center justify-center text-white">
                  No local stream
                </div>
              )}
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
            <div className="relative bg-black rounded-lg overflow-hidden h-[400px]">
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              {!remoteVideoRef.current?.srcObject && (
                <div className="absolute inset-0 flex items-center justify-center text-white">
                  Waiting for peer...
                </div>
              )}
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
                <div className="text-xs opacity-75 mb-1">
                  {msg.sender === socket?.id ? 'You' : msg.senderName}
                </div>
                {msg.text}
                {msg.file && (
                  <div className="mt-2">
                    {msg.file.type.startsWith('image/') ? (
                      <img 
                        src={msg.file.url} 
                        alt={msg.file.name} 
                        className="max-w-full rounded"
                      />
                    ) : (
                      <a 
                        href={msg.file.url} 
                        download={msg.file.name}
                        className="text-blue-600 underline"
                      >
                        Download {msg.file.name}
                      </a>
                    )}
                  </div>
                )}
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
            />
            <label className="cursor-pointer">
              <input
                type="file"
                className="hidden"
                onChange={handleFileSelect}
                accept="image/*,.pdf,.doc,.docx"
              />
              <div className="p-2 bg-gray-200 rounded hover:bg-gray-300">
                📎
              </div>
            </label>
            <button
              onClick={sendMessage}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}