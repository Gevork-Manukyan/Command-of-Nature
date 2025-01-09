'use client'

import { useState, ChangeEvent, FormEvent } from "react";
import Label from "./form/Label";
import TextInput from "./form/TextInput";

export default function Lobby() {
  const [formData, setFormData] = useState({
    game_room_code: "",
  });

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const buttonClicked = (
      form.elements.namedItem("game_start") as HTMLInputElement
    )?.value;

    if (buttonClicked === "create") {
      // Create Game
    } else if (buttonClicked === "join") {
      // Join Game
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col border-2 border-black rounded-md p-10"
    >
      <Label htmlFor="game_room_code">Game Room Code</Label>
      <TextInput
        name="game_room_code"
        value={formData.game_room_code}
        onChange={handleChange}
      />
      <div className="flex gap-2">
        <Button name="game_start" value={"create"} type="submit">
          Create Game
        </Button>
        <Button name="game_start" value={"join"} type="submit">
          Join Game
        </Button>
      </div>
    </form>
  );
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

function Button({ children, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className="mt-4 px-3 py-2 bg-green-400 border-2 border-black rounded-md"
    >
      {children}
    </button>
  );
}
