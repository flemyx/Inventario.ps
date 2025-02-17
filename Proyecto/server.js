const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const pdf = require('pdfkit');
const fs = require('fs');
const app = express();
const port = 3000;

const pool = new Pool({
    user: 'yourusername',
    host: 'localhost',
    database: 'InvFundaproal',
    password: 'yourpassword',
    port: 5432,
});

app.post('/api/products', async (req, res) => {
    const { codigo, descripcion, cantidad, tipo } = req.body; // Cambiado "unidad" por "cantidad"
    try {
        const result = await pool.query(
            'INSERT INTO productos (Codigo, Descripcion, Cantidad, Tipo) VALUES ($1, $2, $3, $4) RETURNING *',
            [codigo, descripcion, cantidad, tipo]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.put('/api/products/:codigo', async (req, res) => {
    const { codigo } = req.params;
    const { descripcion, cantidad, tipo } = req.body; // Cambiado "unidad" por "cantidad"
    try {
        const result = await pool.query(
            'UPDATE productos SET Descripcion = $1, Cantidad = $2, Tipo = $3 WHERE Codigo = $4 RETURNING *',
            [descripcion, cantidad, tipo, codigo]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.delete('/api/products/:codigo', async (req, res) => {
    const { codigo } = req.params;
    try {
        const result = await pool.query('DELETE FROM productos WHERE Codigo = $1 RETURNING *', [codigo]);
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/report', async (req, res) => {
    const { fecha_inicio, fecha_fin } = req.query;
    try {
        const result = await pool.query(
            'SELECT * FROM movimientos WHERE fecha BETWEEN $1 AND $2',
            [fecha_inicio, fecha_fin]
        );

        const doc = new pdf();
        doc.pipe(fs.createWriteStream('reporte.pdf'));

        doc.fontSize(20).text('Reporte de Inventario', { align: 'center' });
        doc.fontSize(12).text(`Desde: ${fecha_inicio} Hasta: ${fecha_fin}`, { align: 'center' });

        result.rows.forEach(row => {
            doc.fontSize(12).text(`Código Movimiento: ${row.codigo_mov}, Almacén: ${row.cod_almacen}, Producto: ${row.cod_producto}, Fecha: ${row.fecha}, Tipo: ${row.tipo}, Cantidad: ${row.cantidad}, Comentario: ${row.comentario}`);
        });

        doc.end();

        res.download('reporte.pdf');
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});