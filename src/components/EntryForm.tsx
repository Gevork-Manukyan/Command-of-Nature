import { loginAsGuest } from "@/lib/firebase/auth";
import { createGameRoom, createGuestSession, joinGameRoom } from "@/lib/firebase/game";
import { setGuestLocalStorage } from "@/lib/localstorage";
import { ChangeEvent, FormEvent, useState } from "react";

type EntryFormProps = {
    onSubmit: () => void;
}

export default function EntryForm({ onSubmit }: EntryFormProps) {
    const [formData, setFormData] = useState({
        guest_name: "",
        game_room_code: "",
    })
    
    function handleChange(event: ChangeEvent<HTMLInputElement>) {
        setFormData(prev => ({ ...prev, [event.target.name]: event.target.value }))
    }
    
    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        
        const form = event.target as HTMLFormElement;
        const buttonClicked = (form.elements.namedItem("game_start") as HTMLInputElement)?.value;    

        const user = await loginAsGuest();
        if (user) {
            console.log("Guest user logged in: ", user);
            createGuestSession(user.uid);
            setGuestLocalStorage({userId: user.uid, guestName: formData.guest_name})

            if (buttonClicked === "create") {
                createGameRoom(); 
            } else if (buttonClicked === "join") {
                joinGameRoom();
            }

            onSubmit()
        }
    }
    
    return (
        <form onSubmit={handleSubmit} className="flex flex-col border-2 border-black rounded-md p-10">
          <Label htmlFor="guest_name">Guest Name</Label>
          <TextInput 
            name="guest_name" 
            value={formData.guest_name}
            onChange={handleChange}
          />
          <Label htmlFor="game_room_code">Game Room Code</Label>
          <TextInput 
            name="game_room_code"
            value={formData.game_room_code}
            onChange={handleChange}
          />
          <div className="flex gap-2">
            <Button name="game_start" value={"create"} type="submit">Create Game</Button>
            <Button name="game_start" value={"join"} type="submit">Join Game</Button>
          </div>
        </form>
    )
}

type LabelProps = {
    children: React.ReactNode;
    htmlFor: string;
}

function Label({ children, htmlFor}: LabelProps) {
    return (
        <label 
            htmlFor={htmlFor} 
            className="pb-1 text-base">
                {children}
        </label>
    )
}

type TextInputProps = React.InputHTMLAttributes<HTMLInputElement>;

function TextInput({name, value, onChange }: TextInputProps) {
    return (
        <input 
            name={name} 
            type="text"
            className="outline-black border-black border-2 rounded-md p-2 text-lg"
            value={value}
            onChange={onChange}
        /> 
    )
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

function Button({children, ...props}: ButtonProps) {
    return (
        <button 
            {...props}
            className="mt-4 px-3 py-2 bg-green-400 border-2 border-black rounded-md"
        >
            {children}
        </button>
    )
}