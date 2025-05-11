type LabelProps = {
  children: React.ReactNode;
  htmlFor: string;
};

export default function Label({ children, htmlFor }: LabelProps) {
  return (
    <label htmlFor={htmlFor} className="pb-1 text-base">
      {children}
    </label>
  );
}
