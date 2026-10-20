const app = require('./app');

const PORT = Number(process.env.PORT) || 4000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
