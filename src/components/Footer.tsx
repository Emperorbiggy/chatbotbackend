import React from 'react';
import { Link } from 'react-router-dom'; // Assuming you're using React Router for navigation

interface FooterProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isDarkMode: boolean;
}

const Footer: React.FC<FooterProps> = ({ activeTab, setActiveTab, isDarkMode }) => {
  return (
    <footer className={`footer ${isDarkMode ? "bg-dark text-light" : "bg-light text-dark"} py-4`}>
      <div className="container text-center">
        {/* Footer Navigation Links */}
        <div className="row justify-content-center">
          <div className="col-md-4 mb-3">
            <Link 
              to="/Dashboard" 
              className={`d-block ${activeTab === "home" ? "text-primary" : "text-secondary"}`}
              onClick={() => setActiveTab("home")}
            >
              {/* Replace with your home icon */}
              <HomeIcon /> Home
            </Link>
          </div>
          <div className="col-md-4 mb-3">
            <Link 
              to="/chatbot" 
              className={`d-block ${activeTab === "chatbot" ? "text-primary" : "text-secondary"}`}
              onClick={() => setActiveTab("chatbot")}
            >
              {/* Replace with your chatbot icon */}
              <ChatbotIcon /> Chatbot
            </Link>
          </div>
          <div className="col-md-4 mb-3">
            <Link 
              to="/cms" 
              className={`d-block ${activeTab === "cms" ? "text-primary" : "text-secondary"}`}
              onClick={() => setActiveTab("cms")}
            >
              {/* Replace with your CMS icon */}
              <CmsIcon /> CMS
            </Link>
          </div>
        </div>

        {/* Footer Text */}
        <p className="mb-0 text-muted">&copy; {new Date().getFullYear()} NMBOU Marketing and Operations Cloud. All rights reserved.</p>
      </div>
    </footer>
  );
};

// Icon components (for example)
const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9L12 2l9 7v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);

const ChatbotIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.5 8.5 0 1 0-17 0 8.5 8.5 0 0 0 17 0z"></path>
    <path d="M21 11.5a8.5 8.5 0 1 0-17 0 8.5 8.5 0 0 0 17 0z"></path>
  </svg>
);

const CmsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15l1.6 1.5a1 1 0 0 0 1.4-1.4l-1.6-1.5a9 9 0 0 0 0-2.7l1.6-1.5a1 1 0 0 0-1.4-1.4L17.6 9a9.1 9.1 0 0 0-2.7 0L13.3 7a1 1 0 0 0-1.4 1.4l1.6 1.5a9 9 0 0 0 0 2.7l-1.6 1.5a1 1 0 0 0 1.4 1.4l1.6-1.5a9 9 0 0 0 2.7 0z"></path>
  </svg>
);

export default Footer;
