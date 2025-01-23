const { MongoClient, ObjectId } = require("mongodb");

const uri = process.env.MONGO_URI; // String de conexión desde variables de entorno
let cachedClient = null;

const connectToDatabase = async () => {
    if (cachedClient) return cachedClient;
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    cachedClient = client;
    return client;
};

exports.handler = async (event) => {
    const { httpMethod, body, pathParameters } = event;

    // Manejo de la solicitud OPTIONS para CORS
    if (httpMethod === "OPTIONS") {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            body: ''
        };
    }

    try {
        // Conectar a la base de datos
        const client = await connectToDatabase();
        const db = client.db("financial_reports");
        const collection = db.collection("transactions");

        switch (httpMethod) {
            case "GET": {
                // Si hay un parámetro 'id', buscar por ese id
                if (pathParameters && pathParameters.id) {
                    const item = await collection.findOne({ _id: new ObjectId(pathParameters.id) });
                    return {
                        statusCode: 200,
                        headers: {
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE',
                            'Access-Control-Allow-Headers': 'Content-Type',
                        },
                        body: JSON.stringify(item),
                    };
                }
                // Si no, devolver todos los items
                const items = await collection.find({}).toArray();
                return {
                    statusCode: 200,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE',
                        'Access-Control-Allow-Headers': 'Content-Type',
                    },
                    body: JSON.stringify(items),
                };
            }

            case "POST": {
                const data = JSON.parse(body);
                const result = await collection.insertOne(data);
                return {
                    statusCode: 201,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE',
                        'Access-Control-Allow-Headers': 'Content-Type',
                    },
                    body: JSON.stringify(result),
                };
            }

            case "PUT": {
                const { id } = pathParameters;
                const data = JSON.parse(body);
                const result = await collection.updateOne({ _id: new ObjectId(id) }, { $set: data });
                return {
                    statusCode: 200,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE',
                        'Access-Control-Allow-Headers': 'Content-Type',
                    },
                    body: JSON.stringify(result),
                };
            }

            case "DELETE": {
                const { id } = pathParameters;
                const result = await collection.deleteOne({ _id: new ObjectId(id) });
                return {
                    statusCode: 200,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE',
                        'Access-Control-Allow-Headers': 'Content-Type',
                    },
                    body: JSON.stringify(result),
                };
            }

            default:
                return {
                    statusCode: 405,
                    body: "Método no permitido",
                };
        }
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Error interno del servidor" }),
        };
    }
};
