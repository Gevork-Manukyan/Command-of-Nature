"use client";

import { ElementalWarriorStarterCard } from "@shared-types";
import H3 from "../components/h3";
import { Button } from "@/components/shadcn-ui/button";

type WarriorSwappingProps = {
    selectedWarriors: ElementalWarriorStarterCard[];
    onSwapWarriors: () => void;
    onPlayerFinishedSetup: () => void;
    onCancelSetup: () => void;
};

export default function WarriorSwapping({ selectedWarriors, onSwapWarriors, onPlayerFinishedSetup, onCancelSetup }: WarriorSwappingProps) {
    return (
        <>
            <H3>Warrior Swapping</H3>
            <p className="text-sm text-gray-600 mb-4">
                Swap the positions of your warriors
            </p>
            
            {/* Display the two warriors side by side */}
            <div className="flex flex-row gap-6 mb-6 justify-center">
                {selectedWarriors.map((warrior, index) => (
                    <div key={warrior.name} className="flex flex-col items-center">
                        <div className="bg-gray-100 p-4 rounded-lg border-2 border-gray-300 min-w-[200px] text-center">
                            <h4 className="font-semibold text-lg mb-2">{warrior.name}</h4>
                            <p className="text-sm text-gray-600">Position {index + 1}</p>
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Swap button */}
            <div className="flex justify-center gap-4">
                <Button 
                    onClick={onCancelSetup}
                    variant="secondary" 
                    className="px-8 py-2" 
                >
                    Back
                </Button>
                <Button 
                    onClick={onSwapWarriors}
                    className="px-8 py-2"
                    disabled={selectedWarriors.length !== 2}
                >
                    Swap Warriors
                </Button>
                <Button 
                    onClick={onPlayerFinishedSetup}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-2"
                >
                    Finish
                </Button>
            </div>
        </>
    )
}