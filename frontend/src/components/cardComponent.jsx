import React, { useState, useEffect } from 'react';

function CardComponent({ id, name, courseCode, type, onDelete, onEdit }) {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setIsDropdownVisible(!isDropdownVisible);
  };

  const hideDropdown = () => {
    setIsDropdownVisible(false);
  };

  useEffect(() => {
    window.addEventListener('click', hideDropdown);
    return () => {
      window.removeEventListener('click', hideDropdown);
    };
  }, []);

  return (
    <div
      className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 p-4 m-2"
      onClick={hideDropdown}
    >
      <div className="flex justify-end">
        <button
          onClick={toggleDropdown}
          className="inline-block text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-1.5"
          type="button"
        >
          <span className="sr-only">Open dropdown</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 16 3"
          >
            <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
          </svg>
        </button>
        {isDropdownVisible && (
          <div className="z-10 absolute mt-2 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
            <ul className="py-2">
              <li>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(id);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                >
                  Edit
                </button>
              </li>
              <li>
              <button
            onClick={(e) => {
                e.stopPropagation();
                onDelete(id);
            }}
            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
            >
            Delete
            </button>

              </li>
            </ul>
          </div>
        )}
      </div>
      <div className="flex flex-col items-start mt-4">
        <h5 className="mb-1 text-lg font-medium text-gray-900 dark:text-white">Name: {name}</h5>
        <span className="text-sm text-gray-500 dark:text-gray-400">Course Code: {courseCode}</span>
        <span className="text-sm text-gray-500 dark:text-gray-400">Type: {type}</span>
      </div>
    </div>
  );
}

function CardGrid({ cards, setCards }) {
  const handleDelete = (id) => {
    setCards((prevCards) => prevCards.filter((card) => card.id !== id));
  };

  const handleEdit = (id) => {
    const updatedCards = cards.map((card) => {
      if (card.id === id) {
        const updatedName = prompt('Enter new name:', card.name);
        const updatedCourseCode = prompt('Enter new course code:', card.courseCode);
        const updatedType = prompt('Enter new type:', card.type);
        return {
          ...card,
          name: updatedName || card.name,
          courseCode: updatedCourseCode || card.courseCode,
          type: updatedType || card.type,
        };
      }
      return card;
    });
    setCards(updatedCards);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <CardComponent
          key={card.id}
          id={card.id}
          name={card.name}
          courseCode={card.courseCode}
          type={card.type}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      ))}
    </div>
  );
}

export default function App() {
  const [cards, setCards] = useState([
    { id: 1, name: 'Computer Networks', courseCode: '20A78978', type: 'Core' },
    { id: 2, name: 'Database Systems', courseCode: '20B12345', type: 'Elective' },
    { id: 3, name: 'Operating Systems', courseCode: '20C45678', type: 'Core' },
    { id: 4, name: 'Software Engineering', courseCode: '20D98765', type: 'Elective' },
    { id: 5, name: 'Software', courseCode: '20D98765', type: 'Elective' },
  ]);

  return (
    <div className="p-4">
      <CardGrid cards={cards} setCards={setCards} />
    </div>
  );
}
