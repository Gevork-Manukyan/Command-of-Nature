type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({ children, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className="mt-4 px-3 py-2 bg-green-400 border-2 border-black rounded-md"
    >
      {children}
    </button>
  );
}
