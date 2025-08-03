import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

const swaggerSpec = swaggerJSDoc({
     definition: {
    openapi: '3.0.0',
    info: {
      title: 'API E-Commerce Produlab',
      version: '1.0.0',
      description: 'Documentación de la API para el sistema de e-commerce',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: [
    './src/routes/*.js',
    './src/controllers/*.js',
    './src/models/*.js',
  ],
})

export function swaggerDocs(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
}