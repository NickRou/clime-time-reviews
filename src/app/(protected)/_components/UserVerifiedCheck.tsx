import { BadgeCheck } from 'lucide-react'

interface UserVerifiedCheckProps {
  className?: string
}

export default function UserVerifiedCheck({
  className,
}: UserVerifiedCheckProps) {
  return (
    <div className="relative inline-block">
      <BadgeCheck
        style={{ color: 'red', fill: 'red' }}
        className={`${className}`}
        strokeWidth={1.5}
      />
      <svg
        className={`absolute top-0 left-0 pointer-events-none ${className}`}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7.75 12.75L10 15.25L16.25 8.75"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}
