### Timetable Generator

The *Timetable Generator* is a full-stack application designed to help educational institutions manage faculty assignments for different semesters, departments, and regulations. The application allows users to register, log in, view faculty details, add faculty, and assign faculty to specific subjects. The assignments and faculty details are stored in a database for future reference. 

---

### *Current Status*

*Frontend*: React app with a clean and responsive UI built using Tailwind CSS.  
*Backend*: Node.js Express server for handling requests and API interactions.  
*Database*: MongoDB for storing user details, faculty information, and assignments.  

---

### *Technologies Used*

*Frontend*: React, Vite, Tailwind CSS  
*Backend*: Node.js, Express  
*Database*: MongoDB  
*API*: RESTful API using Express to manage frontend-backend communication  

---

### *Features*

1. *Authentication*:  
   - *Login Page*: Users can log in with their credentials.  
   - *Registration Page*: Collects user details (name, email, and password) and stores them in the database.  

2. *Faculty Management*:  
   - *View Faculty*: Displays faculty details based on selected semester, department, and regulation.  
   - *Add Faculty*: Allows users to add new faculty members for specific semesters, departments, and regulations.  
   - *Delete Faculty*: Enables users to remove faculty from the database.

3. *Faculty Assignment*:  
   - *Assign Faculty*: Users can assign faculty to specific subjects for a particular semester.  
   - *View Assignments*: Displays assigned faculty for each subject.  
   - *Delete Assignment*: Users can remove faculty assignments.  

---

### *Folder Structure*

plaintext
Timetable_Generator/
├── frontend/              # React frontend
│   ├── public/            # Static files (index.html, images)
│   ├── src/               # Source code for the app
│   │   ├── assets/        # Assets like images
│   │   ├── components/    # Reusable React components
│   │   ├── App.css        # CSS styles
│   │   ├── App.jsx        # Main React component
│   │   ├── index.jsx      # React entry point
│   ├── package.json       # Frontend dependencies
│   ├── vite.config.js     # Vite configuration
├── backend/               # Express backend
│   ├── index.js           # Main server file
│   ├── package.json       # Backend dependencies
│   ├── package-lock.json  # Lock file for dependencies
│   ├── controllers/       # Controllers for handling requests
│   ├── models/            # Database models
│   ├── routes/            # API routes for CRUD operations
├── .gitignore             # Ignore unnecessary files in Git
├── README.md              # Project documentation
└── LICENSE                # License file


---

### *Installation*

#### *1. Clone the Repository*
bash
git clone https://github.com/thesaiteja24/cse-nriit.git
cd timetable-generator


#### *2. Frontend Setup*
bash
cd frontend
npm install
npm run dev

Open your browser and navigate to http://localhost:5173.

#### *3. Backend Setup*
bash
cd backend
npm install
node index.js

The Express server will start on http://localhost:8080.

---

### *Usage*

#### *Frontend*
- Navigate to the home page to log in or register.  
- After logging in, use the dropdown menus to select the semester, department, and regulation.  

#### *Backend*
- The backend processes requests from the frontend, interacts with the database, and sends appropriate responses.  

#### *Database*
- Faculty and assignment data are stored in MongoDB for persistence and retrieval.  

---

### *Contributing*

Contributions are welcome! Follow these steps to contribute:  

1. Fork the repository.  
2. Create a feature branch:  
   bash
   git checkout -b feature-name
   
3. Commit your changes:  
   bash
   git commit -m "Add feature-name"
   
4. Push to the branch:  
   bash
   git push origin feature-name
   
5. Open a pull request.  

---

### *License*

This project is licensed under the MIT License. See the LICENSE file for details.  

---

### *Acknowledgments*

Special thanks to:  
- The creators of React, Express, and Tailwind CSS for their fantastic tools.  
- Online tutorials and resources for inspiration and guidance.
