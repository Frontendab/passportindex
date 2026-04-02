import Flags from 'country-flag-icons/react/3x2';

function flagIcon({ countryCode }) {
    const FlagComponent = Flags[countryCode.toUpperCase()];
    return FlagComponent ? <FlagComponent className="w-[35px] h-[35px]" /> : null;
}   

export default flagIcon;