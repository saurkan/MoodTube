
import React from 'react';

const MenuIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);

const YoutubeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" d="M19.5 5.25a2.25 2.25 0 012.25 2.25v2.25a.75.75 0 01-1.5 0v-2.25a.75.75 0 00-.75-.75h-15a.75.75 0 00-.75.75v10.5a.75.75 0 00.75.75h15a.75.75 0 00.75-.75v-2.25a.75.75 0 011.5 0v2.25a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V7.5A2.25 2.25 0 014.5 5.25h15zm-9.3 4.5a.75.75 0 01.75.6v3.3l2.7-1.65a.75.75 0 01.75 1.3l-3.45 2.1a.75.75 0 01-1.05-.6V10.35a.75.75 0 01.75-.6z" clipRule="evenodd" />
  </svg>
);

const SearchIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>
);

export const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-zinc-700 col-span-12">
      <div className="flex items-center space-x-4">
        <MenuIcon className="h-6 w-6 text-zinc-400 cursor-pointer" />
        <div className="flex items-center space-x-2">
          <YoutubeIcon className="h-8 w-8 text-red-600" />
          <span className="text-xl font-bold">MoodStream</span>
        </div>
      </div>
      <div className="flex-1 max-w-2xl mx-4 hidden sm:flex">
        <div className="flex w-full">
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-zinc-800 border border-zinc-700 rounded-l-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
          />
          <button className="bg-zinc-700 border border-zinc-700 border-l-0 px-6 py-2 rounded-r-full hover:bg-zinc-600">
            <SearchIcon className="h-6 w-6 text-zinc-400" />
          </button>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center font-bold">
          M
        </div>
      </div>
    </header>
  );
};
