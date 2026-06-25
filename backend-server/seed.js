require('dotenv').config({ path: __dirname + '/../.env' });
const mysql = require('mysql2');
const bcrypt = require('bcrypt');

const conn = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "1234",
  database: process.env.DB_NAME || "angular_db",
  port: parseInt(process.env.DB_PORT || "3306"),
});

conn.connect((err) => {
  if (err) {
    console.error('Error de conexion a DB:', err);
    process.exit(1);
  }
  console.log('Conectado a MySQL para seed');
});

// Usuarios seed
const usuarios = [
  { userName: 'Admin', userEmail: 'admin@acme.com', userPassword: bcrypt.hashSync('admin123', 10), userImg: null, userRole: 'admin' },
  { userName: 'Miguel', userEmail: 'miguel@gmail.com', userPassword: bcrypt.hashSync('miguel123', 10), userImg: null, userRole: 'admin' },
  { userName: 'Test User', userEmail: 'test@gmail.com', userPassword: bcrypt.hashSync('test123', 10), userImg: null, userRole: 'user' },
  { userName: 'Carlos Garcia', userEmail: 'carlos@gmail.com', userPassword: bcrypt.hashSync('carlos123', 10), userImg: null, userRole: 'user' },
  { userName: 'Ana Lopez', userEmail: 'ana@gmail.com', userPassword: bcrypt.hashSync('ana123', 10), userImg: null, userRole: 'user' },
];

// Productos seed
const productos = [
  { productName: 'Laptop Gamer Pro', productCode: 'PROD001', releaseDate: '2024-01-15', price: 899990, description: 'Laptop de alta gama con procesador i9 y tarjeta grafica RTX 4080', starRating: 180, imageUrl: '' },
  { productName: 'Smartphone Ultra X', productCode: 'PROD002', releaseDate: '2024-02-20', price: 599990, description: 'Celular con pantalla AMOLED de 6.7 pulgadas y camara de 108MP', starRating: 165, imageUrl: '' },
  { productName: 'Monitor 4K 27"', productCode: 'PROD003', releaseDate: '2024-03-10', price: 349990, description: 'Monitor IPS con resolucion 4K y tasa de refresco de 144Hz', starRating: 150, imageUrl: '' },
  { productName: 'Teclado Mecanico RGB', productCode: 'PROD004', releaseDate: '2024-01-25', price: 89990, description: 'Teclado mecanico con switches Cherry MX y retroiluminacion RGB', starRating: 140, imageUrl: '' },
  { productName: 'Mouse Gamer Wireless', productCode: 'PROD005', releaseDate: '2024-04-05', price: 59990, description: 'Mouse inalambrico con sensor optico de 25600 DPI', starRating: 130, imageUrl: '' },
  { productName: 'Audifonos Bluetooth', productCode: 'PROD006', releaseDate: '2024-02-14', price: 79990, description: 'Audifonos inalambricos con cancelacion de ruido activa', starRating: 120, imageUrl: '' },
  { productName: 'Tablet 10" HD', productCode: 'PROD007', releaseDate: '2024-03-22', price: 299990, description: 'Tablet con pantalla HD de 10 pulgadas y 128GB de almacenamiento', starRating: 110, imageUrl: '' },
  { productName: 'Webcam Full HD', productCode: 'PROD008', releaseDate: '2024-01-30', price: 49990, description: 'Camara web con resolucion 1080p y microfono integrado', starRating: 95, imageUrl: '' },
  { productName: 'Disco SSD 1TB', productCode: 'PROD009', releaseDate: '2024-04-12', price: 119990, description: 'Disco de estado solido NVMe con velocidades de lectura de 7000MB/s', starRating: 170, imageUrl: '' },
  { productName: 'Impresora Laser', productCode: 'PROD010', releaseDate: '2024-02-28', price: 249990, description: 'Impresora laser monocromatica con conexion WiFi', starRating: 85, imageUrl: '' },
  { productName: 'Router WiFi 6', productCode: 'PROD011', releaseDate: '2024-03-18', price: 89990, description: 'Router con tecnologia WiFi 6 y cobertura de hasta 200m2', starRating: 155, imageUrl: '' },
  { productName: 'Cargador USB-C 100W', productCode: 'PROD012', releaseDate: '2024-04-01', price: 39990, description: 'Cargador rapido USB-C con potencia de 100W', starRating: 125, imageUrl: '' },
];

const seedUsuarios = () => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT IGNORE INTO usuarios (userName, userEmail, userPassword, userImg, userRole) VALUES ?';
    const values = usuarios.map(u => [u.userName, u.userEmail, u.userPassword, u.userImg, u.userRole]);
    conn.query(sql, [values], (err, result) => {
      if (err) {
        console.error('Error al insertar usuarios:', err);
        reject(err);
        return;
      }
      console.log(`Usuarios insertados: ${result.affectedRows}`);
      resolve(result);
    });
  });
};

const seedProductos = () => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT IGNORE INTO productos (productName, productCode, releaseDate, price, description, starRating, imageUrl) VALUES ?';
    const values = productos.map(p => [p.productName, p.productCode, p.releaseDate, p.price, p.description, p.starRating, p.imageUrl]);
    conn.query(sql, [values], (err, result) => {
      if (err) {
        console.error('Error al insertar productos:', err);
        reject(err);
        return;
      }
      console.log(`Productos insertados: ${result.affectedRows}`);
      resolve(result);
    });
  });
};

const runSeed = async () => {
  try {
    await seedUsuarios();
    await seedProductos();
    console.log('Seed completado exitosamente');
    conn.end();
    process.exit(0);
  } catch (error) {
    console.error('Error en seed:', error);
    conn.end();
    process.exit(1);
  }
};

runSeed();
