require('dotenv').config({ path: __dirname + '/../.env' });
var express = require("express");
var mysql = require("mysql2");
var fireUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const cors = require("cors");
var bcrypt = require("bcrypt");
var app = express();

var jwt = require("jsonwebtoken");
let seed = "esta-es-una-semilla-para-generar-el-token";

const { OAuth2Client } = require('google-auth-library');
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

// Nodemailer + Gmail OAuth2
const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const EMAIL_CLIENT_ID = process.env.EMAIL_CLIENT_ID;
const EMAIL_CLIENT_SECRET = process.env.EMAIL_CLIENT_SECRET;
const EMAIL_REDIRECT_URI = process.env.EMAIL_REDIRECT_URI;
const EMAIL_REFRESH_TOKEN = process.env.EMAIL_REFRESH_TOKEN;

const OAuth2 = google.auth.OAuth2;
const oauth2Client = new OAuth2(EMAIL_CLIENT_ID, EMAIL_CLIENT_SECRET, EMAIL_REDIRECT_URI);
oauth2Client.setCredentials({ refresh_token: EMAIL_REFRESH_TOKEN });

let smtpTransport = null;

async function getAccessToken() {
  try {
    const { token } = await oauth2Client.getAccessToken();
    return token;
  } catch (error) {
    console.error("Error al obtener access token de Gmail:", error.message);
    return null;
  }
}

async function initSmtpTransport() {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    console.warn("No se pudo obtener access token. El envío de emails no funcionará.");
    return;
  }
  smtpTransport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.EMAIL_SENDER,
      clientId: EMAIL_CLIENT_ID,
      clientSecret: EMAIL_CLIENT_SECRET,
      refreshToken: EMAIL_REFRESH_TOKEN,
      accessToken: accessToken
    }
  });
  console.log("SMTP Transport inicializado correctamente");
}

initSmtpTransport();

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, x-cliente-key, x-client-token, x-client-secret, Authorization",
  );
  next();
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(fireUpload());

let conn;

function handleDisconnect() {
  conn = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "1234",
    database: process.env.DB_NAME || "angular_db",
    port: parseInt(process.env.DB_PORT || "3306"),
  });

  conn.connect((err) => {
    if (err) {
      console.error("Error de conexión a DB, reintentando en 5s...");
      setTimeout(handleDisconnect, 5000);
      return;
    }
    console.log(
      "Base de datos conectada correctamente (ID: " + conn.threadId + ")",
    );
  });

  conn.on("error", (err) => {
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      handleDisconnect();
    } else {
      throw err;
    }
  });
}

handleDisconnect();


app.post('/usuarios', (req, res) => {
  const { name, email, img, role } = req.body;
  let hashedPassword = bcrypt.hashSync(req.body.password, 10);

  const sql = `INSERT INTO usuarios (userName, userEmail, userPassword, userImg, userRole) VALUES (?, ?, ?, ?, ?)`;
  conn.query(sql, [name, email, hashedPassword, img, role], (err, result) => {
    if (err) throw err;
    res.status(201).json({
      ok: true,
      mensaje: 'Usuario registrado correctamente'
    });
  });
})

app.post('/login', (req, res) => {
  const { email } = req.body;
  let hashedPassword = bcrypt.hashSync(req.body.password, 10);
  const sql = `SELECT * FROM usuarios WHERE userEmail = ?`;
  conn.query(sql, [email], (err, results) => {
    if (err) throw err;
    if (results.length === 0) {
      return res.status(404).json({
        ok: false,
        mensaje: 'Usuario no encontrado'
      });
    } else {
      const user = results[0];
      if (!bcrypt.compareSync(req.body.password, user.userPassword)) {
        return res.status(401).json({
          ok: false,
          mensaje: 'Contraseña incorrecta'
        });
      }

      const token = jwt.sign({ usuario:user }, seed, { expiresIn: 14400 });
      res.status(200).json({
        ok: true,
        mensaje: 'Login exitoso',
        token: token
      });
    }
  });
});

// Verificar el token de Google
async function verifyGoogleToken(token) {
  const client = new OAuth2Client(GOOGLE_CLIENT_ID);
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  console.log(payload);
  return {
    name: payload.name,
    email: payload.email,
    picture: payload.picture
  };
}

// Login con Google
app.post('/google-login', async (req, res) => {
  const { token: googletoken } = req.body;
  console.log('Token recibido: ' + googletoken);
  try {
    const { name, email, picture } = await verifyGoogleToken(googletoken);
    conn.query('SELECT * FROM usuarios WHERE userEmail = ?', [email], (err, results) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: 'Error al consultar la base de datos',
          error: err
        });
      }
      if (results.length === 0 || !results.length) {
        console.log('Usuario no encontrado -> creando nuevo usuario');
        let datosUsuario = {
          userName: name,
          userEmail: email,
          userImg: picture,
          userPassword: bcrypt.hashSync('google-auth', 10),
          userRole: 'user',
        };
        conn.query('INSERT INTO usuarios SET ?', datosUsuario, (err, result) => {
          if (err) {
            return res.status(500).json({
              ok: false,
              mensaje: 'Error al crear el usuario',
              error: err
            });
          }
          const newUser = {
            userId: result.insertId,
            userName: name,
            userEmail: email,
            userImg: picture,
            userRole: 'user',
          };
          const token = jwt.sign({ usuario: newUser }, seed, { expiresIn: 14400 });
          res.status(201).json({
            ok: true,
            mensaje: 'Usuario creado correctamente',
            usuario: newUser,
            token: token
          });
        });
      } else {
        console.log('Usuario encontrado');
        console.log('Generar token para el usuario');
        const user = results[0];
        const token = jwt.sign({ usuario: user }, seed, { expiresIn: 14400 });
        res.status(200).json({
          ok: true,
          mensaje: 'Login exitoso',
          usuario: user,
          token: token
        });
      }
    });
  } catch (error) {
    res.status(401).json({
      ok: false,
      mensaje: 'Token no válido',
      error: error
    });
  }
});

// Enviar Email de Prueba (ANTES del middleware JWT)
app.post('/email-test', (req, res) => {
  if (!smtpTransport) {
    return res.status(503).json({
      ok: false,
      mensaje: 'Servicio de email no disponible (SMTP no inicializado)'
    });
  }

  let msg = `
    <h3>
      <span style="background-color: #ffcc00;">
        Envío de Email con NodeJS - Nodemailer y GMail
      </span>
    </h3>
    <p>Este es un <strong> email de ejemplo </strong> utilizando
      <span style="color: #ff0000;">Nodemailer</span> y <em>NodeJS</em>.
    </p>
    <ul>
      <li>Permite formato HTML</li>
      <li>Permite adjuntar archivos</li>
      <li>Se utiliza una cuenta GMail configurada con OAuth2</li>
    </ul>`;

  const { email_address } = req.body;

  const mailOptions = {
    from: "Asignatura Angular",
    to: email_address,
    subject: "Email de ejemplo con Nodemailer",
    generateTextFromHTML: true,
    html: msg
  };

  smtpTransport.sendMail(mailOptions, (err, response) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al enviar email',
        error: err
      });
    }
    console.log(response);
    smtpTransport.close();
    res.status(200).json({
      ok: true,
      mensaje: 'Email enviado correctamente'
    });
  });
});

app.use(function (req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if(!token) {
    return res.status(401).json({
      ok: false,
      mensaje: 'Token no proporcionado'
    });
  }else{
    jwt.verify(token, seed, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          ok: false,
          mensaje: 'Token inválido'
        });
      }
      req.usuario = decoded.usuario;
      next(); 
    });
  }
});

app.get("/", (req, res) => {
  res.status(200).json({
    ok: true,
    mensaje: "Petición realizada correctamente",
  });
});

// Listar todos
app.get("/productos", (req, res) => {
  const sql = "SELECT * FROM productos";
  conn.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        error: err.message,
      });
    }
    res.status(200).json({
      ok: true,
      productos: results,
    });
  });
});

// Listar un productos
app.get("/productos/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM productos WHERE productId = ?";

  conn.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        error: err.message,
      });
    }

    if (result.length === 0) {
      return res.status(404).json({
        ok: false,
        mensaje: "Producto no encontrado",
      });
    }

    res.status(200).json({
      ok: true,
      producto: result[0],
    });
  });
});

// Crear producto
app.post("/productos", (req, res) => {
  const { productName, productCode, releaseDate, price, description, starRating, imageUrl } = req.body;
  const sql = `INSERT INTO productos 
        (productName, productCode, releaseDate, price, description, starRating, imageUrl) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`;

  conn.query(
    sql,
    [productName, productCode, releaseDate, parseInt(price), description, parseFloat(starRating) || 0, imageUrl || ''],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error al insertar el producto",
          errors: err,
        });
      }
      res.status(201).json({
        ok: true,
        mensaje: "Producto añadido correctamente",
        id: result.insertId,
      });
    },
  );
});

// Borrar un producto
app.delete("/productos/:id", (req, res) => {
  const sql = `DELETE FROM productos WHERE productId = ?`;
  conn.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    res.status(200).json({
      ok: true,
      mensaje: "Producto eliminado correctamente.",
    });
  });
});

// Actualiza un producto específico en la BD
app.put('/productos/:id', (req, res) => {
    const { productName, productCode, releaseDate, price, description, starRating } = req.body;
    const sql = `UPDATE productos SET productName = ?, productCode = ?, releaseDate = ?, price = ?, description = ?, starRating = ? WHERE productId = ?`;
    conn.query(
        sql, [productName, productCode, releaseDate, parseInt(price), description, parseFloat(starRating) || 0, req.params.id], (err, result) => {
            if (err) throw err;
            res.status(200).json({
                ok: true,
                mensaje: 'Producto actualizado correctamente'
            });
        });
});

// Cambiar imágen
app.put("/upload/productos/:id", (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({
      ok: false,
      mensaje: "No se ha seleccionado ningún archivo",
    });
  }

  const file = req.files.image;
  const fileExtension = file.name.split(".").pop().toLowerCase();

  const allowedExtensions = ["png", "jpg", "jpeg", "gif"];

  if (!allowedExtensions.includes(fileExtension)) {
    return res.status(400).json({
      ok: false,
      mensaje: "Tipo de extensión no permitido",
    });
  }

  const productId = req.params.id;
  const fileName = `${productId}-${new Date().getMilliseconds()}.${fileExtension}`;

  const uploadPath = __dirname + "/uploads/productos/" + fileName;

  console.log(uploadPath);

  file.mv(uploadPath, (err) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al subir el archivo",
        error: err,
      });
    }

    const sql = "UPDATE productos SET imageUrl = ? WHERE productId = ?";

    conn.query(sql, [uploadPath, productId], (err, result) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          error: err.message,
        });
      }

      res.status(200).json({
        ok: true,
        mensaje: "Archivo subido y producto actualizado correctamente",
      });
    });
  });
});

app.get('/existeproducto/:code', (req, res) => {
  const sql = 'SELECT * FROM productos WHERE productCode = ?';
  conn.query(sql, [req.params.code], (err, result) => {
    if(err) throw err;
    res.status(200).json({
      ok: true,
      data: result[0],
      existe: result.length > 0
    });
  });
});


app.listen(3000, () => {
  console.log("Express Server -- Puerto 3000 online: http://localhost:3000/");
});
