
import React from 'react';

const HomeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" /></svg>
);
const ShortsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" /></svg>
);
const SubscriptionsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>
);
const LibraryIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h6m-3-12.75l4.5-4.5 4.5 4.5m-9 0a2.25 2.25 0 01-2.25-2.25v-1.5a2.25 2.25 0 012.25-2.25h1.5a2.25 2.25 0 012.25 2.25v1.5a2.25 2.25 0 01-2.25 2.25h-1.5m9 0a2.25 2.25 0 002.25-2.25v-1.5a2.25 2.25 0 00-2.25-2.25h-1.5a2.25 2.25 0 00-2.25 2.25v1.5a2.25 2.25 0 002.25 2.25h1.5" /></svg>
);
const MoodIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9 9.75h.008v.008H9V9.75zm6 0h.008v.008H15V9.75z" /></svg>
);

interface SidebarProps {
  onMoodButtonClick: () => void;
}

const SidebarItem: React.FC<{ icon: React.ReactNode; label: string; isActive?: boolean }> = ({ icon, label, isActive }) => (
  <a href="#" className={`flex items-center space-x-4 px-4 py-2 rounded-lg hover:bg-zinc-700 ${isActive ? 'bg-zinc-700' : ''}`}>
    {icon}
    <span className="font-medium hidden md:inline">{label}</span>
  </a>
);

export const Sidebar: React.FC<SidebarProps> = ({ onMoodButtonClick }) => {
  return (
    <aside className="col-span-12 md:col-span-2 lg:col-span-1 p-2 md:p-4 bg-zinc-800 border-r border-zinc-700 flex flex-row md:flex-col justify-around md:justify-start md:space-y-2 overflow-y-auto">
      <SidebarItem icon={<HomeIcon className="h-6 w-6" />} label="Home" isActive />
      <SidebarItem icon={<ShortsIcon className="h-6 w-6" />} label="Shorts" />
      <SidebarItem icon={<SubscriptionsIcon className="h-6 w-6" />} label="Subscriptions" />
      <SidebarItem icon={<LibraryIcon className="h-6 w-6" />} label="Library" />
      <div className="border-t border-zinc-700 my-4 hidden md:block"></div>
      <button onClick={onMoodButtonClick} className="flex items-center space-x-4 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors duration-200">
        <MoodIcon className="h-6 w-6"/>
        <span className="font-medium hidden md:inline">Detect Mood</span>
      </button>
    </aside>
  );
};
