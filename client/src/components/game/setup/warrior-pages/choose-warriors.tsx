"use client";

import { Button } from "@/components/shadcn-ui/button";
import H3 from "../components/h3";
import { ElementalWarriorStarterCard } from "@shared-types";

type ChooseWarriorsProps = {
    selectedWarriors: ElementalWarriorStarterCard[];
    userWarriorSelection: ElementalWarriorStarterCard[];
    isWarriorSelected: (warrior: ElementalWarriorStarterCard) => boolean;
    canSelectMore: boolean;
    toggleWarriorSelection: (warrior: ElementalWarriorStarterCard) => void;
    handleConfirmWarriors: () => void;
};

export default function ChooseWarriors({ selectedWarriors, userWarriorSelection, isWarriorSelected, canSelectMore, toggleWarriorSelection, handleConfirmWarriors }: ChooseWarriorsProps) {
    return (
        <>
            <H3>Warrior Selection</H3>
            <p className="text-sm text-gray-600 mb-4">
                Select 2 warriors from your deck ({selectedWarriors.length}/2
                selected)
            </p>
            <div className="flex flex-row gap-4 mb-6">
                {userWarriorSelection.map((warrior) => {
                    const isSelected = isWarriorSelected(warrior);
                    const canSelect = canSelectMore || isSelected;

                    return (
                        <Button
                            key={warrior.name}
                            onClick={() => toggleWarriorSelection(warrior)}
                            disabled={!canSelect}
                            variant={isSelected ? "default" : "outline"}
                            className={`
                                ${
                                    isSelected
                                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                                        : "bg-white hover:bg-gray-50 text-gray-700 border-gray-300"
                                }
                                ${
                                    !canSelect
                                        ? "opacity-50 cursor-not-allowed"
                                        : "cursor-pointer"
                                }
                                transition-colors duration-200
                            `}
                        >
                            {warrior.name}
                            {isSelected && " ✓"}
                        </Button>
                    );
                })}
            </div>

            {selectedWarriors.length === 2 && (
                <div className="flex justify-center">
                    <Button
                        onClick={handleConfirmWarriors}
                        className="bg-green-600 hover:bg-green-700 text-white px-8 py-2"
                    >
                        Confirm Selection
                    </Button>
                </div>
            )}
        </>
    )
}