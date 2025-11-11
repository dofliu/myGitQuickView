
import React from 'react';

export const ChecklistIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 20 20" 
    fill="currentColor" 
    {...props}
  >
    <path d="M5.5 16.5a1 1 0 01-1-1v-2a1 1 0 112 0v2a1 1 0 01-1 1z" />
    <path d="M5.5 11.5a1 1 0 01-1-1v-2a1 1 0 112 0v2a1 1 0 01-1 1z" />
    <path d="M5.5 6.5a1 1 0 01-1-1v-2a1 1 0 112 0v2a1 1 0 01-1 1z" />
    <path fillRule="evenodd" d="M13.854 6.646a.5.5 0 010 .708l-5 5a.5.5 0 01-.708 0l-2-2a.5.5 0 11.708-.708L8.5 11.293l4.646-4.647a.5.5 0 01.708 0z" clipRule="evenodd" />
    <path fillRule="evenodd" d="M2 3.5A1.5 1.5 0 013.5 2h13A1.5 1.5 0 0118 3.5v13a1.5 1.5 0 01-1.5 1.5h-13A1.5 1.5 0 012 16.5v-13zM3.5 3a.5.5 0 00-.5.5v13a.5.5 0 00.5.5h13a.5.5 0 00.5-.5v-13a.5.5 0 00-.5-.5h-13z" clipRule="evenodd" />
  </svg>
);
