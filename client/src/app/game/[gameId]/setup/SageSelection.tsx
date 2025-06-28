import { Sage } from "@shared-types";
import { useState } from "react";

type SageSelectionProps = {
    selectedSage: Sage | null;
    availableSages: {
        [key in Sage]: boolean;
    };
    onSageConfirm: (sage: Sage) => void;
}
    
export default function SageSelection({ selectedSage, availableSages, onSageConfirm }: SageSelectionProps) {
    const [clickedSage, setClickedSage] = useState<Sage | null>(null);
    
    const handleSageSelect = (sage: Sage) => {
        if (availableSages[sage]) {
            setClickedSage(sage);
        }
    };

    const handleSageConfirmClick = () => {
        if (clickedSage) {
            onSageConfirm(clickedSage);
            setClickedSage(null);
        }
    };

    return (
        <section>
            <h3 className="text-xl font-semibold mb-4">Sage Selection</h3>
            <div className="grid grid-cols-2 gap-8">
                {Object.keys(availableSages).map((sage) => {
                    const isAvailable = availableSages[sage as Sage];
                    const isSelected = clickedSage === sage;
                    const isConfirmed = selectedSage === sage;
                    
                    return (
                        <button
                            key={sage}
                            onClick={() => handleSageSelect(sage as Sage)}
                            disabled={!isAvailable}
                            className={`p-4 border rounded-lg transition-colors ${
                                isConfirmed
                                    ? "bg-green-100 border-green-500 text-green-800" 
                                    : !isAvailable 
                                        ? "bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed"
                                        : isSelected
                                            ? "bg-blue-100 border-blue-500 text-blue-800"
                                        : "hover:bg-blue-50 border-gray-300"
                            }`}
                        >
                            <h4 className="font-medium">{sage}</h4>
                        </button>
                    );
                })}
            </div>
            <div className="mt-6 flex justify-center">
                <button
                    onClick={handleSageConfirmClick}
                    className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!clickedSage || !availableSages[clickedSage]}
                >
                    Confirm
                </button>
            </div>
        </section>
    );
}