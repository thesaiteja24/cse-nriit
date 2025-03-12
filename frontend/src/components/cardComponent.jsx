import React, { useState, useEffect } from "react";

function CardComponent({ id, name, contact, type, onDelete, onEdit }) {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setIsDropdownVisible(!isDropdownVisible);
  };

  const hideDropdown = () => {
    setIsDropdownVisible(false);
  };

  useEffect(() => {
    window.addEventListener("click", hideDropdown);
    return () => {
      window.removeEventListener("click", hideDropdown);
    };
  }, []);

  return (
    <div
      className="flex justify-evenly w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-200 dark:border-gray-700 p-4 m-2"
      onClick={hideDropdown}
    >
      <div className="flex flex-col items-start mt-4">
        <h5 className="mb-1 text-lg font-medium text-gray-900 dark:text-black">
          Name: {name}
        </h5>
        <span className="text-sm text-gray-500 dark:text-black">
          Contact Number: {contact}
        </span>
      </div>
      <div className="flex justify-end">
        <button
          onClick={toggleDropdown}
          className="text-gray-500 dark:text-gray-400 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg"
          type="button"
        >
          <span className="sr-only">Open dropdown</span>
          <svg
            className="w-5 h-5 hover:text-gray-700 dark:hover:text-white"
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
                  className="block w-full text-left px-4 py-2 text-sm text-gray-800 border border-black rounded-md transition-transform transform hover:scale-105 hover:shadow-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
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
                  className="block w-full text-left px-4 py-2 text-sm text-gray-800 border border-black rounded-md transition-transform transform hover:scale-105 hover:shadow-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                >
                  Delete
                </button>
              </li>
            </ul>
          </div>
        )}
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
        const updatedName = prompt("Enter new name:", card.name);
        const updatedcontact = prompt("Enter new course code:", card.contact);
        return {
          ...card,
          name: updatedName || card.name,
          contact: updatedcontact || card.contact,
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
          contact={card.contact}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      ))}
    </div>
  );
}

export default function App() {
  const [cards, setCards] = useState([
    { id: 1, name: "Mr. Siva Subramanyam", contact: "20A78978" },
    { id: 2, name: "Mrs. D. Ratna Bhavani", contact: "20B12345" },
    { id: 3, name: "Mrs. M. Lakshmi Durga", contact: "20C45678" },
    { id: 4, name: "Mrs. V. Aruna", contact: "20D98765" },
    { id: 5, name: "Mrs. T. Revathi", contact: "20D98765" },
    { id: 6, name: "Dr. P. Vineeth", contact: "20D98765" },
  ]);

  return (
    <div className="p-4">
      <CardGrid cards={cards} setCards={setCards} />
    </div>
  );
}
