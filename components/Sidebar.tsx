
import React from 'react';

const HomeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
  </svg>
);

const ShortsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.77 10.32c-.77-.32-1.2-.5-1.2-.5s.43-.18 1.2-.5c.4-.16.73-.3 1.01-.44.55-.27 1.22-.6 1.22-.6s-.67.33-1.22.6c-.28.14-.61.28-1.01.44zM9.5 5.65c-.28-.14-.61-.28-1.01-.44-.77-.32-1.2-.5-1.2-.5s.43-.18 1.2-.5c.4-.16.73-.3 1.01-.44.55-.27 1.22-.6 1.22-.6s-.67.33-1.22.6c-.28.14-.61.28-1.01.44zM21.5 8.5s-.67.33-1.22.6c-.28.14-.61.28-1.01.44-.77.32-1.2.5-1.2.5s.43-.18 1.2-.5c.4-.16.73-.3 1.01-.44.55-.27 1.22-.6 1.22-.6zM9.5 8.5s-.67.33-1.22.6c-.28.14-.61.28-1.01.44-.77.32-1.2.5-1.2.5s.43-.18 1.2-.5c.4-.16.73-.3 1.01-.44.55-.27 1.22-.6 1.22-.6z"/>
  </svg>
);

const SubscriptionsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
    <path d="M20 7H4V6h16v1zm2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V9c0-1.1.9-2 2-2h16c1.1 0 2 .9 2 2zm-2 0H4v12h16V9zm-8 3l3.5 2-3.5 2v-4z"/>
  </svg>
);

const LibraryIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
    <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8 12.5v-9l6 4.5-6 4.5z"/>
  </svg>
);

const MoodIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
  </svg>
);

interface SidebarProps {
  onMoodButtonClick: () => void;
}

const SidebarItem: React.FC<{ icon: React.ReactNode; label: string; isActive?: boolean }> = ({ icon, label, isActive }) => (
  <a href="#" className={`flex items-center space-x-4 px-4 py-2 rounded-lg hover:bg-gray-700 ${isActive ? 'bg-gray-700 font-semibold' : ''}`}>
    <div className={`h-6 w-6 ${isActive ? 'text-red-600' : 'text-gray-300'}`}>
      {icon}
    </div>
    <span className="text-sm hidden md:inline text-gray-300">{label}</span>
  </a>
);

export const Sidebar: React.FC<SidebarProps> = ({ onMoodButtonClick }) => {
  return (
    <aside className="w-64 bg-gray-800 border-r border-gray-700 h-full overflow-y-auto">
      <div className="p-4 space-y-2">
        <SidebarItem icon={<HomeIcon className="h-6 w-6" />} label="Home" isActive />
        <SidebarItem icon={<ShortsIcon className="h-6 w-6" />} label="Shorts" />
        <SidebarItem icon={<SubscriptionsIcon className="h-6 w-6" />} label="Subscriptions" />
        <SidebarItem icon={<LibraryIcon className="h-6 w-6" />} label="Library" />
        
        <div className="border-t border-gray-700 my-4"></div>
        
        <button 
          onClick={onMoodButtonClick} 
          className="w-full flex items-center space-x-4 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors duration-200"
        >
          <MoodIcon className="h-6 w-6"/>
          <span className="text-sm font-medium">Mood</span>
        </button>
      </div>
    </aside>
  );
};
