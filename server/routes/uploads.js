const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const fs = require('fs');
const path = require('path');

// default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', (req, res) => {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files)
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No ha selecionado ningun archivo.'
            }
        })

    //valida tipo
    let tiposValidos = ['productos', 'usuarios'];

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'los tipos permitidoss son ' + tiposValidos.join(', '),
                tipo
            }
        })
    }

    let archivo = req.files.archivo;
    let nombreSplit = archivo.name.split('.');
    let extension = nombreSplit[nombreSplit.length - 1]


    //extensiones permitidas
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'las extensiones permitidas son ' + extensionesValidas.join(', '),
                ext: extension
            }
        })
    }

    //cambiar nombre al archivo
    let nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extension }`;

    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err)
            return res.status(500).json({ ok: false, err })

        if (tipo === 'usuarios')
            imagenUsuario(id, res, nombreArchivo);

        if (tipo === 'productos')
            imagenProducto(id, res, nombreArchivo);

    });

});


function imagenUsuario(id, res, nombreArchivo) {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borraArchivo(nombreArchivo, 'usuarios')

            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            borraArchivo(nombreArchivo, 'usuarios')

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        let pathImagen = path.resolve(__dirname, `../../uploads/usuarios/${usuarioDB.img}`);

        // if (fs.existsSync(pathImagen)) {
        //     fs.unlinkSync(pathImagen);
        // }

        borraArchivo(usuarioDB.img, 'usuarios')

        usuarioDB.img = nombreArchivo;
        usuarioDB.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            });
        });

    });
}

function imagenProducto(id, res, nombreArchivo) {
    Producto.findById(id, (err, productoDB) => {

        if (err) {
            borraArchivo(productoDB.img, 'productos')
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            borraArchivo(productoDB.img, 'productos')
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            });
        }

        let pathImagen = path.resolve(__dirname, `../../uploads/productos/${productoDB.img}`);
        borraArchivo(productoDB.img, 'productos')

        productoDB.img = nombreArchivo;
        productoDB.save((err, productoGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            });
        });
    });
}

function borraArchivo(nombreImagen, tipo) {
    let pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${nombreImagen}`);

    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}

module.exports = app;