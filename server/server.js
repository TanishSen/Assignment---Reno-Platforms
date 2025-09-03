const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads', 'schoolImages');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'school-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Database connection
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'school_directory'
};

// Create database and table if they don't exist
async function initializeDatabase() {
  try {
    // Connect without database first
    const connection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password
    });

    // Create database if it doesn't exist
    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
    await connection.end();

    // Connect to the database
    const db = await mysql.createConnection(dbConfig);

    // Create schools table if it doesn't exist
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS schools (
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
      )
    `;
    
    await db.execute(createTableQuery);
    
    // Add students column if it doesn't exist (for existing databases)
    try {
      await db.execute('ALTER TABLE schools ADD COLUMN students INT DEFAULT 0');
    } catch (error) {
      // Column already exists, ignore the error
      if (!error.message.includes('Duplicate column name')) {
        console.error('Error adding students column:', error);
      }
    }
    
    console.log('Database and table initialized successfully');
    await db.end();
  } catch (error) {
    console.error('Database initialization error:', error);
  }
}

// Initialize database on startup
initializeDatabase();

// API Routes

// Get all schools
app.get('/api/schools', async (req, res) => {
  try {
    const db = await mysql.createConnection(dbConfig);
    const [schools] = await db.execute('SELECT * FROM schools ORDER BY created_at DESC');
    await db.end();
    
    res.json(schools);
  } catch (error) {
    console.error('Error fetching schools:', error);
    res.status(500).json({ error: 'Failed to fetch schools' });
  }
});

// Add new school
app.post('/api/schools', upload.single('image'), async (req, res) => {
  try {
    const { name, address, city, state, contact, email_id, students } = req.body;
    
    // Validation
    if (!name || !address || !city || !state || !contact || !email_id || !students) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Validate students is a positive number
    const studentCount = parseInt(students);
    if (isNaN(studentCount) || studentCount <= 0) {
      return res.status(400).json({ error: 'Number of students must be a positive number' });
    }

    const imagePath = req.file ? `/uploads/schoolImages/${req.file.filename}` : null;
    
    const db = await mysql.createConnection(dbConfig);
    const [result] = await db.execute(
      'INSERT INTO schools (name, address, city, state, contact, image, email_id, students) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, address, city, state, contact, imagePath, email_id, studentCount]
    );
    await db.end();

    res.status(201).json({ 
      message: 'School added successfully', 
      id: result.insertId,
      image: imagePath
    });
  } catch (error) {
    console.error('Error adding school:', error);
    res.status(500).json({ error: 'Failed to add school' });
  }
});

// Get school by ID
app.get('/api/schools/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = await mysql.createConnection(dbConfig);
    const [schools] = await db.execute('SELECT * FROM schools WHERE id = ?', [id]);
    await db.end();
    
    if (schools.length === 0) {
      return res.status(404).json({ error: 'School not found' });
    }
    
    res.json(schools[0]);
  } catch (error) {
    console.error('Error fetching school:', error);
    res.status(500).json({ error: 'Failed to fetch school' });
  }
});

// Get statistics for dashboard
app.get('/api/stats', async (req, res) => {
  try {
    const db = await mysql.createConnection(dbConfig);
    
    // Get total schools count
    const [schoolsResult] = await db.execute('SELECT COUNT(*) as count FROM schools');
    const totalSchools = schoolsResult[0].count;
    
    // Get unique cities count
    const [citiesResult] = await db.execute('SELECT COUNT(DISTINCT city) as count FROM schools');
    const totalCities = citiesResult[0].count;
    
    // Get actual total students from database
    const [studentsResult] = await db.execute('SELECT SUM(students) as total FROM schools');
    const actualStudents = studentsResult[0].total || 0;
    
    let totalStudents;
    if (actualStudents >= 1000) {
      totalStudents = (actualStudents / 1000).toFixed(1) + 'K+';
    } else {
      totalStudents = actualStudents.toString();
    }
    
    await db.end();
    
    res.json({
      totalSchools,
      totalStudents,
      totalCities
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'API is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
