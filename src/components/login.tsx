"use client";

import { loginAsGuest } from "@/lib/firebase/auth";
import { createGuestSession } from "@/lib/firebase/game";
import { setGuestLocalStorage } from "@/lib/localstorage";
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

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const user = await loginAsGuest();

    if (user) {
      console.log("Guest user logged in: ", user);
      createGuestSession(user.uid);
      setGuestLocalStorage({
        userId: user.uid,
        guestName: formData.guest_name,
      });
      onSubmit();
      router.push("/lobby")
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
      <button
        className="mt-4 px-3 py-2 bg-green-400 border-2 border-black rounded-md"
        type="submit"
      >
        Enter as Guest
      </button>
    </form>
  );
}
