
/**Pasos de ejecución */
/**
 * Ejecutar el Script : mongosh script.js
 * https://prnt.sc/DX88IQ92tny1
 * Notas: Previamente contar con una instalación de Mongo
 * 
 * -Proveer un script para crear una base de datos de ejemplo en MongoDB. 
 * -Poblar datos de prueba con un archivo JSON. 
 */

// Conectar a MongoDB
use('financial_reports') // Creamos la base de datos

// Crear una colección llamada 'transactions' y agregar documentos de ejemplo
db.transactions.insertMany([
    {
        transaccion_id: Date.now(),
        cliente_id: 1,
        amount: -100,
        category: "Food",
        date: "2025-01-16",
        type: "gasto",
        status: "activa"
    },
    {
        transaccion_id: Date.now(),
        cliente_id: 2,
        amount: 200,
        category: "Electronics",
        date: "2025-01-16",
        type: "ingreso",
        status: "activa"
    },
    {
        transaccion_id: Date.now(),
        cliente_id: 103,
        amount: -50,
        category: "Transport",
        date: "2025-01-16",
        type: "gasto",
        status: "inactiva"
    },
    {
        transaccion_id: Date.now(),
        cliente_id: 104,
        amount: 75,
        category: "Entertainment",
        date: "2025-01-16",
        type: "ingreso",
        status: "activa"
    }
]);

// Verificar los documentos insertados
db.transactions.find().pretty();
