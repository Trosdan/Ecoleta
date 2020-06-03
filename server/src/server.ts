import express from 'express';

const server = express();

server.get('/users', (req, res) => {
  return res.json({
    users: [
      'Jordan Oliveira',
      'Rodrigo Martins',
      'Pedro Fernandes'
    ]
  })
})

server.listen(3333);

