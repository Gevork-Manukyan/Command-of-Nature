import { loginAsGuest } from "@/lib/firebase/auth";
import {
  createGuestSession,
} from "@/lib/firebase/game";
import { setGuestLocalStorage } from "@/lib/localstorage";
import { ChangeEvent, FormEvent, useState } from "react";
import Button from "./form/Button";
import Label from "./form/Label";
import TextInput from "./form/TextInput";

type LoginProps = {
  onSubmit: () => void;
};

export default function Login({ onSubmit }: LoginProps) {
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
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col border-2 border-black rounded-md p-10"
    >
      <Label htmlFor="guest_name">Guest Name</Label>
      <TextInput
        name="guest_name"
        value={formData.guest_name}
        onChange={handleChange}
      />
      <Button>Enter as Guest</Button>
    </form>
  );
}