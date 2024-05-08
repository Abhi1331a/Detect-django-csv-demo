import './App.css';
import './index.css';
import axios from "axios";
import React, { useState, useEffect } from "react";
import Modal from 'react-modal';

// // Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
// Modal.setAppElement('.App')

function App() {

  const [selectedFile, setSelectedFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [visualizationType, setVisualizationType] = useState(null);
  const [selectedColumn, setSelectedColumn] = useState([]);
  const [selectedDataset, setSelectedDataset] = useState(null)

  // On file select (from the pop up)
  const onFileChange = (event) => {
    // Update the state  
    setSelectedFile(event.target.files[0]);
  };

  // On file upload (click the upload button)
  const onFileUpload = () => {
    // Create an object of formData
    try {
      const formData = new FormData();

      // Update the formData object
      formData.append(
        "myFile",
        selectedFile,
        selectedFile.name
      );

      // Details of the uploaded file
      // console.log(selectedFile);

      // Request made to the backend api
      // Send formData object
      axios.post("http://127.0.0.1:8000/csvmanager/upload", formData);

      fetchFiles()
    }
    catch {
      alert('🫡')
    }
  };

  const fetchFiles = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/csvmanager/getFiles");
      // console.log(response);
      setFiles(response.data);
    }
    catch {
      alert('🫡')
    }
  }

  useEffect(() => {
    fetchFiles()
  }, [])

  function openModal(file) {
    setSelectedDataset(file)
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  function handleVisualizationTypeChange(e) {
    setVisualizationType(e.target.value);
  }

  function handleColumnSelection(e) {
    if (!selectedColumn.includes(e.target.value)) {
      setSelectedColumn([...selectedColumn, e.target.value]);
    }
  }

  function handleSubmit(event) {
    // send a request to the backend
    event.preventDefault();
    console.log(selectedDataset, selectedColumn);
    const postData = {};
    postData.id = selectedDataset.id;
    postData.filename = selectedDataset.filename;
    postData.path = selectedDataset.path;
    postData.visualizationType = visualizationType;
    postData.selectedColumn = selectedColumn;
    console.log(postData);
    axios.post("http://127.0.0.1:8000/csvmanager/visualize", postData);

  }

  return (
    <div className="App flex flex-col">
      <div className='py-5 bg-[#282c34] text-center top-0'>
        <h1 className="text-4xl font-bold text-blue-700">CSV to Graph</h1>
        <p className="text-lg text-gray-700">Please upload your chosen CSV file</p>
      </div>
      <header className="App-header py-5 bg-gray-200 text-center flex-1">
        <div className="flex flex-col items-center gap-5 w-full">
          <div className='w-full'>
            <div className="py-2">
              <input
                type="file"
                onChange={onFileChange}
                className="border-2 border-blue-500 rounded-md p-1"
              />
            </div>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={onFileUpload}>
              Upload!
            </button>
            <div className="py-2">
              {selectedFile ? (
                <div>
                  <h2>File Details:</h2>
                  <p>
                    File Name:{" "}
                    {selectedFile.name}
                  </p>

                  <p>
                    File Type:{" "}
                    {selectedFile.type}
                  </p>

                  <p>
                    Last Modified:{" "}
                    {selectedFile.lastModifiedDate.toDateString()}
                  </p>
                </div>
              ) : (
                <div>
                  <br />
                  <h4>
                    Choose before Pressing the Upload
                    button
                  </h4>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-row w-full justify-around items-center ">
            <div className='w-1/2 text-2xl font-semibold'>
              <p>Uploaded Files</p>
              <div>
                {files.length !== 0 ? (files.map((file) => {
                  return (
                    <div className='flex flex-row justify-between px-5 my-2'>
                      {/* {console.log(file)} */}
                      <li key={file.id}>
                        {file.filename}
                      </li>
                      <button className="text-lg bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded" type='button' onClick={(e) => openModal(file)}> Visualize</button>
                    </div>
                  )
                })) : (<p className='text-slate-400'>No files uploaded yet!</p>)}
                <Modal
                  isOpen={modalIsOpen}
                  onRequestClose={closeModal}
                  contentLabel="Example Modal"
                >
                  <div><button onClick={closeModal} className="text-white bg-red-500 hover:bg-red-700 px-3 py-2 rounded float-right">Close</button></div>
                  <form onSubmit={(e) => handleSubmit(e)} className="space-y-4 mt-10">
                    <div>
                      <label for="vis"> Select your choice of visualization: </label>
                      <select type="vis" onChange={handleVisualizationTypeChange} className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                        <option selected defaultValue disabled value="">Select your choice of visualization</option>
                        <option value="pie">Pie</option>
                        <option value="bar">Bar</option>
                      </select>
                    </div>

                    {visualizationType && (
                      <div>
                        <label> Select your choice of columns: </label>
                        <div className="flex flex-col">
                          {selectedDataset.columns.map((column) => {
                            return (
                              <label className="inline-flex items-center">
                                <input type="checkbox" value={column} onChange={handleColumnSelection} className="form-checkbox h-5 w-5 text-blue-600" />
                                <span className="ml-2 text-gray-700">{column}</span>
                              </label>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {selectedColumn && (
                      <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Visualize</button>
                    )}
                  </form>

                </Modal>
              </div>
            </div>
            <div className='w-1/2 text-2xl font-semibold'><p>Visualization</p><div></div></div>
          </div>
        </div>
      </header>
    </div>

  );
}

export default App;
