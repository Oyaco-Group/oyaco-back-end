1. Project Title
   OyaCo Warehouse Management Website

2. Description
   The Warehouse Management Website is a comprehensive website designed to streamline inventory management, order processing, and reporting for warehouses. It provides an intuitive interface for managing stock, tracking shipments and transactions (outgoing or incoming).
   And in this Repository is part of the BackEnd / Server from OyaCo Website.

3. Table of Contents
- [features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

4. Features
- User roles and permissions
- Order management and processing
- Automated stock level alert
- Tracking transactions history
- Management warehouse (CRUD)
- Summary reporting Dashboard

5. Installation
    1. Clone the repository: 
        git clone https://github.com/VYPratama-kelompok1/oyaco-back-end

    2. Install npm package / node_modules 
        npm install
    
    3. Setting .env
        You can see the .env-example and adjust with your local database
    
    4. Migrate the database Model 
        npx prisma migrate dev
    
    5. Run the server
        npm run dev

6. Usage 
    You can try to consume API with Postman or other apps like Bruno etc. 
    API Documentation https://www.postman.com/joint-operations-observer-33331119/workspace/oyaco-api-documentation

7. Contributing
    Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

    If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement". Don't forget to give the project a star! Thanks again!

    1. Fork the Project
    2. Create your Feature Branch (git checkout -b feature/AmazingFeature)
    3. Commit your Changes (git commit -m 'Add some AmazingFeature')
    4. Push to the Branch (git push origin feature/AmazingFeature)
    5. Open a Pull Request

8. License
    This project is licensed under the OyaCo License - see the [LICENSE](LICENSE) file for details.


9. Contact
    For questions or comments, please contact [OyaCo](mailto:OyaCo.email@example.com) or open an issue in the repository.


