import express from 'express';
import allRoutes from './routes';

const app = express();
const PORT = process.env.PORT || 5000;

allRoutes(app);
app.listen(PORT, () => {
  console.log(`Server listening on PORT ${PORT}`);
});

export default app;
module.exports = app;
