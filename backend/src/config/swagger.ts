import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
    definition: {
        openapi:'3.0.0',
        info: {
            title: 'Nexpay Banking API',
            version: '1.0.0',
            description: 'API documentation for Nexpay Banking Application',
            contact: {
                name: 'Nexpay Team',
            },
        },
servers: [
    {
        url: process.env.BASE_URL || 'http://localhost:5000',
        description: 'API server',
    },
],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
    },
    apis: ['./src/routes/*.ts'], // Path to the API routes
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerUi, swaggerSpec };
