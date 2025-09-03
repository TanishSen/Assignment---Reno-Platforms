# 🎓 School Directory Management System

A comprehensive full-stack web application for managing and displaying school information, built with React, Node.js, Express, and MySQL. This project provides a complete solution for school data management with dynamic statistics, image uploads, and responsive design.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Features in Detail](#features-in-detail)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### 🏫 Core Functionality
- **School Registration**: Complete form for adding new schools with validation
- **School Directory**: Browse and view all registered schools
- **Dynamic Statistics**: Real-time dashboard showing school metrics
- **Image Upload**: Upload and store school images with file validation
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### 📊 Dashboard Features
- **Live Statistics**: Dynamic counters for schools, students, and cities
- **Real-time Updates**: Statistics update automatically when new schools are added
- **Loading States**: Smooth loading animations for better UX
- **Error Handling**: Graceful error handling with fallback values

### 🎨 User Interface
- **Modern Design**: Clean, professional interface with Tailwind CSS
- **Interactive Forms**: Real-time validation with helpful error messages
- **Image Preview**: Live preview of uploaded school images
- **Navigation**: Intuitive navigation between pages
- **Toast Notifications**: User feedback for all actions

### 🔧 Technical Features
- **RESTful API**: Well-structured API endpoints
- **File Upload**: Secure image upload with size and type validation
- **Database Integration**: MySQL database with proper schema
- **CORS Support**: Cross-origin resource sharing enabled
- **Environment Configuration**: Secure environment variable management

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **React Hook Form** - Form management with validation
- **Zod** - Schema validation
- **Lucide React** - Beautiful icons
- **React Router** - Client-side routing

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MySQL2** - MySQL database driver
- **Multer** - File upload middleware
- **CORS** - Cross-origin resource sharing
- **Dotenv** - Environment variable management

### Database
- **MySQL** - Relational database
- **Auto-increment IDs** - Primary key management
- **Foreign Key Support** - Data integrity

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **MySQL** (v8.0 or higher)
- **npm** or **yarn** package manager
- **Git** for version control

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/TanishSen/Assignment---Reno-Platforms.git
cd campus-gallery-main
```

### 2. Install Dependencies

#### Frontend Dependencies
```bash
npm install
```

#### Backend Dependencies
```bash
cd server
npm install
cd ..
```

### 3. Database Setup

#### Create MySQL Database
```sql
CREATE DATABASE school_directory;
```

#### Configure Environment Variables
Create a `.env` file in the `server` directory:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=school_directory
PORT=3001
```

### 4. Start the Application

#### Start Backend Server
```bash
cd server
node server.js
```
The backend will run on `http://localhost:3001`

#### Start Frontend (in a new terminal)
```bash
npm run dev
```
The frontend will run on `http://localhost:3000`

## 📖 Usage

### Adding a New School

1. Navigate to the "Add School" page
2. Fill in all required fields:
   - School Name
   - Address (detailed location)
   - City
   - State
   - Contact Number (digits only)
   - Email Address (valid email format)
   - Number of Students (positive number)
3. Upload a school image (optional, max 5MB)
4. Click "Add School" to submit

### Viewing Schools

1. Navigate to the "Browse Schools" page
2. View all registered schools in a grid layout
3. Each school card shows:
   - School name
   - Address and city
   - School image
   - Contact information

### Dashboard Statistics

The homepage displays real-time statistics:
- **Total Schools**: Count of all registered schools
- **Total Students**: Sum of all student counts
- **Total Cities**: Count of unique cities

## 🔌 API Endpoints

### Schools Management
```
GET    /api/schools           # Get all schools
GET    /api/schools/:id       # Get school by ID
POST   /api/schools           # Create new school
```

### Statistics
```
GET    /api/stats             # Get dashboard statistics
```

### File Serving
```
GET    /uploads/*             # Serve uploaded images
```

## 🗄 Database Schema

### Schools Table
```sql
CREATE TABLE schools (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  contact VARCHAR(15) NOT NULL,
  image TEXT,
  email_id TEXT NOT NULL,
  students INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Field Descriptions
- `id`: Auto-incrementing primary key
- `name`: School name (required)
- `address`: Complete school address (required)
- `city`: City location (required)
- `state`: State location (required)
- `contact`: Contact phone number (required, digits only)
- `image`: Path to uploaded school image (optional)
- `email_id`: School email address (required, valid email)
- `students`: Number of students (required, positive integer)
- `created_at`: Automatic timestamp

## 📁 Project Structure

```
campus-gallery-main/
├── public/                    # Static assets
│   ├── favicon.ico           # Custom favicon
│   └── school-icon.svg       # School-themed icon
├── src/                      # Frontend source code
│   ├── components/           # Reusable React components
│   │   ├── ui/              # UI component library
│   │   └── ...
│   ├── pages/               # Page components
│   │   ├── Index.tsx        # Homepage with dashboard
│   │   ├── AddSchool.tsx    # School registration form
│   │   └── ShowSchools.tsx  # School directory
│   ├── lib/                 # Utility functions
│   └── hooks/               # Custom React hooks
├── server/                  # Backend source code
│   ├── server.js            # Main Express server
│   ├── uploads/             # Uploaded images storage
│   │   └── schoolImages/    # School image files
│   └── package.json         # Backend dependencies
├── package.json             # Frontend dependencies
├── vite.config.ts           # Vite configuration
├── tailwind.config.ts       # Tailwind CSS configuration
└── README.md                # This file
```

## ⚙ Configuration

### Environment Variables

Create `.env` file in the `server` directory:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=school_directory

# Server Configuration
PORT=3001

# File Upload Configuration
UPLOAD_PATH=./uploads/schoolImages
MAX_FILE_SIZE=5242880  # 5MB in bytes
```

### File Upload Settings

- **Maximum file size**: 5MB
- **Allowed formats**: JPEG, JPG, PNG, GIF
- **Storage location**: `server/uploads/schoolImages/`
- **Naming convention**: `school-{timestamp}-{random}.ext`

## 🎯 Features in Detail

### Form Validation
- **Real-time validation** with immediate feedback
- **Email format validation** using regex patterns
- **Phone number validation** (digits only, length limits)
- **Required field validation** for all mandatory fields
- **Number validation** for student count (positive integers)

### Image Upload System
- **Drag and drop interface** for image uploads
- **Live preview** of selected images
- **File type validation** (images only)
- **Size limit enforcement** (5MB maximum)
- **Automatic file naming** to prevent conflicts
- **Secure storage** in dedicated uploads directory

### Responsive Design
- **Mobile-first approach** with Tailwind CSS
- **Flexible grid layouts** that adapt to screen sizes
- **Touch-friendly interfaces** for mobile devices
- **Optimized typography** for readability
- **Consistent spacing** across all screen sizes

### Error Handling
- **Network error handling** with user-friendly messages
- **Form validation errors** with specific field highlighting
- **File upload errors** with clear instructions
- **Database connection errors** with graceful fallbacks
- **Loading states** to prevent user confusion

### Performance Optimizations
- **Lazy loading** for images
- **Efficient database queries** with proper indexing
- **Optimized bundle size** with code splitting
- **Caching strategies** for static assets
- **Database connection pooling** for better performance

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style
- Write clear, concise commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React** and **Express** communities for excellent documentation
- **Tailwind CSS** for the amazing utility-first approach
- **Lucide** for beautiful, consistent icons
- **MySQL** for reliable database management

## 📞 Support

If you have any questions or need help with the project, please:

1. Check the [Issues](https://github.com/TanishSen/Assignment---Reno-Platforms/issues) page
2. Create a new issue with detailed information
3. Contact the maintainers

---

**Assignment for Reno Platforms** - Built with ❤️ using modern web technologies

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
## Technologies Used

- React 18 with TypeScript
- Vite
- Tailwind CSS
- Shadcn/ui components
- Node.js + Express.js
- MySQL Database

## Deployment

### Frontend
```bash
npm run build
# Deploy the dist/ folder to your hosting provider
```

### Backend
1. Set up MySQL database on your server
2. Update environment variables
3. Install dependencies: `npm install`
4. Start server: `npm start`

## License

This project is for educational purposes.
