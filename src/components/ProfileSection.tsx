/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User as UserIcon, Mail, Camera, Upload, Check, X, ShieldCheck } from 'lucide-react';
import { LocalUser } from '../App';

interface ProfileSectionProps {
  user: LocalUser;
  onUpdate: (updated: Partial<LocalUser>) => void;
}

export default function ProfileSection({ user, onUpdate }: ProfileSectionProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startCamera = async () => {
    try {
      setShowCamera(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access denied", err);
      setShowCamera(false);
      alert("Could not access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject as MediaStream;
    stream?.getTracks().forEach(track => track.stop());
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(video, 0, 0);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setPreviewImage(dataUrl);
      stopCamera();
    }
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    if (!previewImage) return;

    setIsUpdating(true);
    try {
      onUpdate({ photoURL: previewImage });
      setPreviewImage(null);
      // Force a slight delay for dramatic effect
      setTimeout(() => setIsUpdating(false), 1000);
    } catch (err) {
      console.error("Profile update failed", err);
      setIsUpdating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Profile Card */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="md:col-span-12 lg:col-span-4 space-y-6"
        >
          <div className="glass p-8 rounded-[2.5rem] text-center relative overflow-hidden">
            {/* Avatar Section */}
            <div className="relative inline-block mb-6">
              <div className="w-32 h-32 rounded-[2rem] bg-[#1D9E75]/10 border-4 border-white dark:border-slate-800 shadow-xl overflow-hidden flex items-center justify-center">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <UserIcon className="w-16 h-16 text-[#1D9E75]" />
                )}
              </div>
              <button 
                className="absolute -bottom-2 -right-2 bg-[#1D9E75] text-white p-3 rounded-2xl shadow-lg border-2 border-white dark:border-slate-800 hover:scale-110 transition-transform"
                title="Update Avatar"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera className="w-5 h-5" />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                className="hidden" 
                accept="image/*" 
              />
            </div>

            <h3 className="text-2xl font-black text-[#0f4a38] dark:text-teal-400 break-words">
              {user.displayName || 'MoodFlow User'}
            </h3>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1 flex items-center justify-center gap-2">
              <ShieldCheck className="w-3 h-3 text-[#1D9E75]" />
              Verified Sanctuary Member
            </p>

            <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-4 text-left">
              <div className="flex items-center gap-4 group">
                <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-2xl group-hover:bg-teal-50 dark:group-hover:bg-teal-900/20 transition-colors">
                  <Mail className="w-4 h-4 text-slate-400 group-hover:text-[#1D9E75]" />
                </div>
                <div>
                  <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Email Address</div>
                  <div className="text-sm font-bold text-slate-600 dark:text-slate-300 line-clamp-1">{user.email}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 group">
                <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-2xl group-hover:bg-teal-50 dark:group-hover:bg-teal-900/20 transition-colors">
                  <ShieldCheck className="w-4 h-4 text-slate-400 group-hover:text-[#1D9E75]" />
                </div>
                <div>
                  <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Status</div>
                  <div className="text-sm font-bold text-slate-600 dark:text-slate-300">
                    Active
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="glass p-6 rounded-3xl bg-[#1D9E75]/5 border-[#1D9E75]/10">
            <h4 className="text-xs font-black text-[#1D9E75] uppercase tracking-widest mb-2">Privacy Note</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Your profile data is encrypted. MoodFlow only stores your reflections locally and within your private cloud vault.
            </p>
          </div>
        </motion.div>

        {/* Update Section */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="md:col-span-12 lg:col-span-8"
        >
          <div className="glass p-10 rounded-[2.5rem] h-full">
            <h3 className="text-2xl font-black text-[#0f4a38] dark:text-teal-400 mb-8">Personalize Your Space</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
              <button 
                onClick={startCamera}
                className="flex flex-col items-center justify-center p-8 bg-white dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2rem] hover:border-[#1D9E75] hover:bg-[#1D9E75]/5 transition-all group"
              >
                <div className="bg-slate-50 dark:bg-slate-800 p-5 rounded-full mb-4 group-hover:bg-white group-hover:shadow-lg transition-all">
                  <Camera className="w-8 h-8 text-slate-400 group-hover:text-[#1D9E75]" />
                </div>
                <span className="font-bold text-slate-600 dark:text-slate-300">Take a Photo</span>
                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-1">Use your camera</span>
              </button>

              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center p-8 bg-white dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2rem] hover:border-[#1D9E75] hover:bg-[#1D9E75]/5 transition-all group"
              >
                <div className="bg-slate-50 dark:bg-slate-800 p-5 rounded-full mb-4 group-hover:bg-white group-hover:shadow-lg transition-all">
                  <Upload className="w-8 h-8 text-slate-400 group-hover:text-[#1D9E75]" />
                </div>
                <span className="font-bold text-slate-600 dark:text-slate-300">Upload Image</span>
                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-1">Select from computer</span>
              </button>
            </div>

            <AnimatePresence>
              {showCamera && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-md"
                >
                  <div className="bg-white p-6 rounded-[3rem] w-full max-w-xl transition-all shadow-2xl relative">
                    <button 
                      onClick={stopCamera}
                      className="absolute -top-4 -right-4 bg-white p-4 rounded-full shadow-xl hover:scale-110 transition-transform z-10"
                    >
                      <X className="w-6 h-6 text-slate-400" />
                    </button>
                    
                    <div className="aspect-video bg-slate-100 rounded-[2rem] overflow-hidden relative mb-6">
                      <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover scale-x-[-1]" />
                    </div>

                    <button 
                      onClick={capturePhoto}
                      className="w-full py-5 bg-[#1D9E75] text-white rounded-[1.5rem] font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-teal-500/20 active:scale-95 transition-all flex items-center justify-center gap-3"
                    >
                      <Camera className="w-5 h-5" />
                      Capture Moment
                    </button>
                  </div>
                </motion.div>
              )}

              {previewImage && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-[2rem] shadow-xl flex flex-col sm:flex-row items-center gap-8"
                >
                  <div className="w-32 h-32 rounded-3xl overflow-hidden shadow-lg border-2 border-slate-50 dark:border-slate-800">
                    <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 space-y-4 text-center sm:text-left">
                    <div className="space-y-1">
                      <h4 className="font-bold text-[#0f4a38] dark:text-teal-400">New Profile Image</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Review your new avatar before saving it to your sanctuary.</p>
                    </div>
                    <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                      <button 
                        onClick={handleSaveProfile}
                        disabled={isUpdating}
                        className="px-8 py-3 bg-[#1D9E75] text-white rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-[#15805d] transition-all disabled:opacity-50"
                      >
                        {isUpdating ? (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            <Check className="w-4 h-4" />
                            Looks Good
                          </>
                        )}
                      </button>
                      <button 
                        onClick={() => setPreviewImage(null)}
                        className="px-8 py-3 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <canvas ref={canvasRef} className="hidden" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
