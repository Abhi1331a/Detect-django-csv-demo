import React, { useState } from 'react';
import Modal from 'react-modal';

// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#yourAppElement')

function ModalComponent() {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [visualizationType, setVisualizationType] = useState(null);
  const [selectedColumn, setSelectedColumn] = useState(null);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal(){
    setIsOpen(false);
  }

  function handleVisualizationTypeChange(e) {
    setVisualizationType(e.target.value);
  }

  function handleColumnSelection(e) {
    setSelectedColumn(e.target.value);
  }

  function handleSubmit() {
    // send a request to the backend
  }

  return (
    <div className='flex flex-row justify-between px-5 my-2'>
      <li key={index}>
        {file}
      </li>
      <button className="text-lg bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded" type='button' onClick={openModal}> Visualize</button>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Example Modal"
      >
        <button onClick={closeModal}>close</button>
        <form onSubmit={handleSubmit}>
          <select onChange={handleVisualizationTypeChange}>
            <option value="pie">Pie</option>
            <option value="bar">Bar</option>
          </select>

          {visualizationType && (
            <select onChange={handleColumnSelection}>
              <option value="column1">Column 1</option>
              <option value="column2">Column 2</option>
            </select>
          )}

          {selectedColumn && (
            <button type="submit">Submit</button>
          )}
        </form>
      </Modal>
    </div>
  );
}
