import { ElementalCard, ELEMENTS } from "@shared-types";

type BattlefieldCardProps = {
    spaceNumber: number;
    card: ElementalCard | null;
    isDaybreak: boolean;
    isActivated: boolean;
    isClickable: boolean;
    onCardClick?: (spaceNumber: number) => void;
}

export default function BattlefieldCard({ 
    spaceNumber, 
    card, 
    isDaybreak, 
    isActivated, 
    isClickable, 
    onCardClick 
}: BattlefieldCardProps) {
    const handleClick = () => {
        if (isClickable && onCardClick) {
            onCardClick(spaceNumber);
        }
    };

    const getCardStyle = () => {
        let baseStyle = "w-20 h-28 border-2 rounded-lg flex flex-col items-center justify-center text-xs font-medium cursor-pointer transition-all duration-200";
        
        if (!card) {
            return `${baseStyle} bg-gray-100 border-gray-300 cursor-not-allowed`;
        }
        
        if (isActivated) {
            return `${baseStyle} bg-gray-300 border-gray-400 opacity-60`;
        }
        
        if (isClickable && isDaybreak) {
            return `${baseStyle} bg-yellow-100 border-yellow-400 shadow-lg hover:shadow-xl hover:scale-105`;
        }
        
        return `${baseStyle} bg-white border-gray-400 hover:border-gray-600`;
    };

    const getElementColor = (element: ElementalCard["element"]) => {
        switch (element) {
            case ELEMENTS.TWIG: return 'bg-brown-600';
            case ELEMENTS.PEBBLE: return 'bg-gray-600';
            case ELEMENTS.LEAF: return 'bg-green-600';
            case ELEMENTS.DROPLET: return 'bg-blue-600';
            default: return 'bg-gray-600';
        }
    };

    return (
        <div className={getCardStyle()} onClick={handleClick}>
            {card ? (
                <>
                    <div className="flex justify-between w-full px-1">
                        <div className={`w-4 h-4 rounded-full ${getElementColor(card.element)} text-white text-xs flex items-center justify-center`}>
                            {card.attack}
                        </div>
                        <div className="w-4 h-4 rounded-full bg-green-500 text-white text-xs flex items-center justify-center">
                            {card.health}
                        </div>
                    </div>
                    <div className="text-xs font-bold text-center px-1 mt-1">
                        {card.element}
                    </div>
                    <div className="text-xs text-center px-1 mt-auto mb-1 leading-tight">
                        {card.name}
                    </div>
                    {isDaybreak && (
                        <div className="absolute top-0 right-0 w-3 h-3 bg-yellow-400 rounded-full border border-yellow-600"></div>
                    )}
                </>
            ) : (
                <div className="text-gray-400">Empty</div>
            )}
        </div>
    );
}