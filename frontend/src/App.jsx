import FileUploader from "./components/FileUploader/FileUploader";
import "./App.css";

function App() {
  return (
    <div className="app">
      <h1 className="brand">Mereb</h1>
      <div className="card">
        <FileUploader />
      </div>
    </div>
  );
}

export default App;
