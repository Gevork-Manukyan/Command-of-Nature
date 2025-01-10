'use client'

import { useState, ChangeEvent, FormEvent } from "react";
import Label from "./form/Label";
import TextInput from "./form/TextInput";
import { createGameSession, joinGameSession } from "@/lib/firebase/game";
import { auth } from "@/lib/firebase/firebase";

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
    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement;
    const buttonClicked = submitter.name
    
    const user = auth.currentUser;
    const userId = user?.uid
    if (userId && buttonClicked === "create_game") {
        createGameSession(userId)
    } else if (userId && buttonClicked === "join_game") {
        joinGameSession(formData.game_room_code, userId)
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
        <Button name="create_game" type="submit">
          Create Game
        </Button>
        <Button name="join_game" type="submit">
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
