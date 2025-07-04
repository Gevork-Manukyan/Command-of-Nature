interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage = ({ message }: ErrorMessageProps) => (
  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
    {message}
  </div>
); 