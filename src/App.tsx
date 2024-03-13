import Notes from "./Components/Note/Notes";
import NotePopup from "./Components/Note/NotePopup";
import NoteManagerProvider from "./Context/NoteManagerProvider";

function App() {
  return (
    <>
      <div className="container">
        <h1 className="text-center">Notes</h1>
        <NoteManagerProvider>
          <NotePopup></NotePopup>
          <Notes></Notes>
        </NoteManagerProvider>
      </div>
    </>
  );
}

export default App;
