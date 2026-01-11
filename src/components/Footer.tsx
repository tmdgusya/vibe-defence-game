import React from 'react';

interface FooterProps {
  gameVersion?: string;
  fps?: number;
}

const Footer: React.FC<FooterProps> = ({ gameVersion = '0.1.0', fps = 60 }) => {
  return (
    <footer className="bg-gray-800 text-white p-4 mt-auto">
      <div className="container mx-auto flex justify-between items-center text-sm">
        <div className="flex items-center space-x-4">
          <span className="text-gray-400">
            Tower Defense with Merging Mechanics
          </span>
          <span className="text-gray-500">v{gameVersion}</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-green-400">FPS: {fps}</span>
          <button className="text-blue-400 hover:text-blue-300 transition-colors">
            Help
          </button>
          <button className="text-blue-400 hover:text-blue-300 transition-colors">
            About
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
