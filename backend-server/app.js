var express = require("express");
var mysql = require("mysql2");
var fireUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const cors = require("cors");

var app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(fireUpload());

let conn;

function handleDisconnect() {
  conn = mysql.createConnection({
    host: process.env.DB_HOST || "db",
    user: process.env.DB_USER || "admin",
    password: process.env.DB_PASSWORD || "1234",
    database: process.env.DB_NAME || "angular_db",
    port: 3306,
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

// Listar productos x filtrado
app.post("/productos", (req, res) => {
  const { name, code, date, price, description, rate, image } = req.body;
  const sql = `INSERT INTO productos 
        (productName, productCode, releaseDate, price, description, starRating, imageUrl) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`;

  conn.query(
    sql,
    [name, code, date, parseInt(price), description, parseFloat(rate), image],
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
    const { name, code, date, price, description, rate } = req.body;
    const sql = `UPDATE productos SET productName = ?, productCode = ?, releaseDate = ?, price = ?, description = ?, starRating = ? WHERE productId = ?`;
    conn.query(
        sql, [name, code, date, parseInt(price), description, parseInt(rate), req.params.id], (err, result) => {
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
      data: results[0],
      existe: results.length > 0
    });
  });
});

app.listen(3000, () => {
  console.log("Express Server -- Puerto 3000 online: http://localhost:3000/");
});
