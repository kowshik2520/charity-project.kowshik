charity-management/
├── backend/
│   ├── server.js       # Main Node.js server file
│   ├── database.db     # SQLite database file
│   └── routes/         # API routes for Donations, Campaigns, etc.
└── README.md           # Setup guide and documentation



mkdir charity-management # Create main project folder
cd charity-management    # Navigate into the project folder
mkdir backend            # Create a backend folder

cd backend


npm init -y  #initialzie node.js

npm install express sqlite3 body-parser cors  #install necessary packages


#after installing sqlite3 run the following command

sqlite3 database.db

#inside sql 

#run the create_cript.sql

#cmd to run the project
node server.js


#Steps to run UI 
1) Go inside ui folder (cd ui/charity-management)
2) npm start

Steps to run backend:
1) Go inside backend folder ( cd backend)
2) node server.js

