export function Emblem({ size = 30 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      aria-hidden="true"
      style={{ display: "block" }}
    >
      <path
        d="M32 6c-9.3 0-17 7.2-17 16.9 0 5.6 2 10.3 5.3 13.5l-2.5 9.9 8.2-3 .9 2.6c1.3 3.7 3.1 6.6 5.1 6.6s3.8-2.9 5.1-6.6l.9-2.6 8.2 3-2.5-9.9c3.3-3.2 5.3-7.9 5.3-13.5C49 13.2 41.3 6 32 6z"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.6"
      />
      <circle cx="25" cy="24" r="4" fill="currentColor" />
      <circle cx="39" cy="24" r="4" fill="currentColor" />
      <path d="M32 29l3.4 6h-6.8z" fill="currentColor" />
      <path
        d="M25.5 40h13M26 43.5h12M27.5 47h9"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
