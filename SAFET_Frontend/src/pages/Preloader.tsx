import React, { useEffect } from 'react';
import gsap from 'gsap';

const Preloader: React.FC = () => {
  useEffect(() => {
    // GSAP Animations
    gsap.fromTo('.circle',
      { rotation: 0 },
      { rotation: 360, duration: 2, repeat: -1, ease: 'linear' }
    );

    gsap.fromTo('.bounce',
      { y: 0 },
      { y: -30, duration: 0.5, repeat: -1, yoyo: true, ease: 'power1.inOut' }
    );

    gsap.fromTo('.fade-text',
      { opacity: 0 },
      { opacity: 1, duration: 2, repeat: -1, yoyo: true, delay: 1 }
    );
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="flex flex-col items-center justify-center space-y-6">
        {/* Rotating Circle */}
        <div className="circle w-32 h-32 rounded-full bg-gradient-to-r from-blue-400 to-green-500"></div>

        {/* Bouncing Dots */}
        <div className="flex space-x-4">
          <div className="bounce w-8 h-8 bg-blue-500 rounded-full"></div>
          <div className="bounce w-8 h-8 bg-green-500 rounded-full"></div>
          <div className="bounce w-8 h-8 bg-purple-500 rounded-full"></div>
        </div>

        {/* Fade In Text */}
        <div className="fade-text text-white text-3xl font-semibold">Loading...</div>

        {/* Optional progress bar */}
        <div className="w-full max-w-xs mt-8">
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-sm font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                  50% Complete
                </span>
              </div>
            </div>
            <div className="flex mb-2 items-center justify-between">
              <div className="w-full bg-gray-300 rounded-full h-2.5">
                <div className="progress-bar bg-blue-500 h-2.5 rounded-full" style={{ width: '50%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preloader;