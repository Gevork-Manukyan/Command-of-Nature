"use client";

import { GuestStorage } from "@/lib/localstorage";
import { ChangeEvent, FormEvent, useState } from "react";
import Label from "./form/Label";
import TextInput from "./form/TextInput";
import { useRouter } from "next/navigation";

type LoginProps = {
  onSubmit?: () => void;
};

export default function Login({ onSubmit = () => {} }: LoginProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    guest_name: "",
  });
  const [error, setError] = useState<string | null>(null);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
    setError(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ guestName: formData.guest_name }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      GuestStorage.save({
        userId: data.id,
        guestName: data.guestName,
      });
      
      onSubmit();
      router.push("/lobby");
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-96 flex flex-col border-2 border-black rounded-md p-10"
    >
      <Label htmlFor="guest_name">Guest Name</Label>
      <TextInput
        name="guest_name"
        value={formData.guest_name}
        onChange={handleChange}
      />
      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}
      <button
        className="mt-4 px-3 py-2 bg-green-400 border-2 border-black rounded-md"
        type="submit"
      >
        Enter as Guest
      </button>
    </form>
  );
}
