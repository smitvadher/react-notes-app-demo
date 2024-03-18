import Notes from "./Components/Note/Notes";
import NotePopup from "./Components/Note/NotePopup";
import NotesProvider from "./Provider/NotesProvider";
import { useEffect, useState } from "react";

function App() {
  const [sizeClass, setSizeClass] = useState("");

  const matchesWidth = (width: number) => {
    return window.matchMedia(`(max-width: ${width}px)`).matches;
  };

  const getSize = () => {
    if (matchesWidth(768)) {
      return "sm";
    } else if (matchesWidth(992)) {
      return "md";
    } else if (matchesWidth(1200)) {
      return "lg";
    }
    return "";
  };

  const resizeListener = () => {
    setSizeClass(getSize());
  };

  useEffect(() => {
    resizeListener();
    window.addEventListener("resize", resizeListener);
    return () => {
      window.removeEventListener("resize", resizeListener);
    };
  }, []);

  return (
    <>
      <div className={`container ${sizeClass}`}>
        <h1 className="text-center">Notes</h1>
        <NotesProvider>
          <NotePopup></NotePopup>
          <Notes></Notes>
        </NotesProvider>
      </div>
    </>
  );
}

export default App;
