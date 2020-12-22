const express = require("express");
const { verificaToken } = require("../middlewares/autenticacion");
const { populate } = require("../modelos/producto");
const app = express();
let Producto = require("../modelos/producto");

app.get("/producto", verificaToken, (req, res) => {
  let desde = req.query.desde || 0;
  desde = Number(desde);

  let limite = req.query.limite || 5;
  limite = Number(limite);

  Producto.find({ disponible: true })
    .limit(limite) //limito registros a mostrar por página
    .skip(desde) //desde que registro comienzo a mostrar
    .sort("nombre") //ordeno la lista por nombre A-Z
    .populate("usuario", "nombre email") //traigo los datos segun el id de usuario
    .populate("categoria", "descripcion") //traigo los datos segun id de categoria
    .exec((err, productos) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      Producto.count({ disponible: true }, (err, conteo) => {
        res.json({
          ok: true,
          productos,
          cantidad: conteo,
        });
      });
    });
});

app.get("/producto/:id", verificaToken, (req, res) => {
  let id = req.params.id;
  Producto.findById(id)
    .populate("usuario", "nombre email")
    .populate("categoria", "descripcion")
    .exec((err, productoDB) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err: {
            message: "El Id no existe o es incorrecto",
          },
        });
      }
      // if (!productoDB) {
      //   return res.status(400).json({
      //     ok: false,
      //     err: {
      //       message: "El ID no existe",
      //     },
      //   });
      // }
      res.json({
        ok: true,
        producto: productoDB,
      });
    });
});

/*---------------------------------
    BUSCAR PRODUCTO POR TERMINO
------------------------------- */

app.get("/producto/buscar/:termino", verificaToken, (req,res) => {
  let termino = req.params.termino

  //Para buscar por termino, no por match exacto, se usan expresiones regulares
  let reGex = new RegExp(termino,"i");

  Producto.find({nombre:reGex})
  .populate("categoria","descripcion")
  .exec((err, producto) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok:true,
      producto,
    })
  })
})

app.post("/producto", verificaToken, (req, res) => {
  let body = req.body;

  let producto = new Producto({
    usuario: req.usuario._id,
    nombre: body.nombre,
    precioUni: body.precioUni,
    descripcion: body.descripcion,
    disponible: body.disponible,
    categoria: body.categoria,
  });

  producto.save((err, productoDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    res.status(201).json({
      ok: true,
      producto: productoDB,
    });
  });
});

app.put("/producto/:id", verificaToken, (req, res) => {
  let id = req.params.id;

  let body = req.body;

  Producto.findByIdAndUpdate(id, body, { new: true }, (err, productoDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }
    if (!productoDB) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "El id no existe",
        },
      });
    }

    res.json({
      ok: true,
      message: "Producto actualizado",
      producto: productoDB,
    });
  });
});

app.delete("/producto/:id", verificaToken, (req, res) => {
  let id = req.params.id;

  let disponibleActualizado = {
    disponible: false,
  };

  Producto.findByIdAndUpdate(
    id,
    disponibleActualizado,
    { new: true },
    (err, productoBorrado) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }
      if (!productoBorrado) {
        return res.status(400).json({
          ok: false,
          message: "Producto no encontrado",
        });
      }

      res.json({
        ok: true,
        producto: productoBorrado,
      });
    }
  );
});

module.exports = app;
