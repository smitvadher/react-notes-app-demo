import { useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { Backgrounds } from "../../Constants/Strings";

interface BackgroundProps {
  selected: string;
  onSelect: (selected: string) => void;
  onClose: () => void;
}

const Background = ({ selected, onSelect, onClose }: BackgroundProps) => {
  const backgroundsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        backgroundsRef.current &&
        !backgroundsRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    setTimeout(() => {
      document.addEventListener("click", handleClickOutside);
    }, 10);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleColorSelect = (color: string) => {
    onSelect(color);
    onClose();
  };

  return (
    <div className="color-selector" ref={backgroundsRef}>
      {Backgrounds.map((color, index) => (
        <div
          key={index}
          className={`color-circle ${selected === color.value ? "active" : ""}`}
          style={{ backgroundColor: color.value }}
          title={color.name}
          onClick={() => handleColorSelect(color.value)}
        >
          {selected === color.value && (
            <FontAwesomeIcon className="selected-icon" icon={faCheck} />
          )}
        </div>
      ))}
    </div>
  );
};

export default Background;
