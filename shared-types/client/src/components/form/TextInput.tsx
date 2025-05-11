type TextInputProps = React.InputHTMLAttributes<HTMLInputElement>;

export default function TextInput({ name, value, onChange }: TextInputProps) {
  return (
    <input
      name={name}
      type="text"
      className="outline-black border-black border-2 rounded-md p-2 text-lg"
      value={value}
      onChange={onChange}
    />
  );
}