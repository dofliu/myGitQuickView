
import React from 'react';

interface PinIconProps extends React.SVGProps<SVGSVGElement> {
  solid?: boolean;
}

export const PinIcon: React.FC<PinIconProps> = ({ solid = false, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    {...props}
  >
    {solid ? (
      <path d="M10.75 4.75a.75.75 0 00-1.5 0V8.5h-.543l-1.42-1.42a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.06 0l2.25-2.25a.75.75 0 00-1.06-1.06L11.25 8.5H10.75V4.75zM8.75 11.25a.75.75 0 00-1.5 0v3a.75.75 0 001.5 0v-3zM12.75 11.25a.75.75 0 00-1.5 0v3a.75.75 0 001.5 0v-3z" />
    ) : (
      <path fillRule="evenodd" d="M10 3a.75.75 0 01.75.75v1.5h.543l1.42-1.42a.75.75 0 111.06 1.06l-2.25 2.25a.75.75 0 01-1.06 0L8.22 4.89a.75.75 0 111.06-1.06l1.42 1.42H11.25v-1.5A.75.75 0 0110 3zM8.75 6.25a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5a.75.75 0 01.75-.75zM11.25 6.25a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
    )}
    <path fillRule="evenodd" d="M4 4.75A.75.75 0 014.75 4h10.5a.75.75 0 01.75.75v10.5a.75.75 0 01-.75.75H4.75a.75.75 0 01-.75-.75V4.75zm.75 1.5v8.25h9V6.25h-9z" clipRule="evenodd" />
  </svg>
);
