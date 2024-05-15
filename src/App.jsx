import { useState } from 'react';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { arrayMoveImmutable } from 'array-move';

const SortableItem = SortableElement(({ value, onRemove, id }) => {
  console.log(id, 'check....');
  return (
    <>

      <div className="relative h-[70px] object-cover" style={{ margin: '5px', border: '1px solid #ccc', padding: '2px' }}>
        <button className='bg-[black]' onClick={() => onRemove(id)} style={{ position: 'absolute', top: '5px', right: '5px' }}>x</button>
        <img src={value} alt="Uploaded" className="max-w-full object-cover w-full h-full max-h-full" />
      </div>
    </>
  )
}

);

const SortableList = SortableContainer(({ items, onRemove }) => {
  return (
    <div className="max-w-[600px] mx-auto">
      {items.length ? (
        <div className="p-2 rounded bg-gray-700 grid grid-cols-8">
          {items.map((value, index) => {
            console.log(index, 'map');
            return (
              <SortableItem key={`item-${index}`} id={index} value={value} onRemove={onRemove} />
            )
          })}
        </div>
      ) : (
        ''
      )}
    </div>
  );
});

const App = () => {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const urls = files.map(file => URL.createObjectURL(file));
    setUploadedImages(prevImages => [...prevImages, ...urls]);
  };

  const onSortEnd = ({ oldIndex, newIndex }) => {
    const newData = arrayMoveImmutable(uploadedImages, oldIndex, newIndex);
    setUploadedImages(newData);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const files = Array.from(e.dataTransfer.files);
    const urls = files.map(file => URL.createObjectURL(file));
    setUploadedImages(prevImages => [...prevImages, ...urls]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDraggingOver(false);
  };

  const handleRemoveImage = (index) => {
    console.log(index, 'index');
    const updatedImages = uploadedImages.filter((_, idx) => idx !== index);
    setUploadedImages(updatedImages);
  };

  return (
    <div>
      <h2 className="mt-4 mb-8 text-center font-bold text-3xl">Draggable Cards</h2>
      <div
        className={`border-2 border-dashed ${isDraggingOver ? 'border-red-500' : 'border-gray-300'} p-4 mb-4 h-[200px] flex items-center justify-center w-[600px] mx-auto rounded-xl`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileUpload}
          id="fileInput"
        />
        <label
          htmlFor="fileInput"
          className="block text-center cursor-pointer"
        >
          Drop files here or click to upload
        </label>
      </div>
      <SortableList
        items={uploadedImages}
        onSortEnd={onSortEnd}
        onRemove={handleRemoveImage}
        axis="x"
        lockAxis="x"
      />
    </div>
  );
}

export default App;
