import express from 'express';
const app = express();
const port = 9988;

app.use(express.urlencoded( {extended : false } ));
app.use(express.json());

import userRouter from './router/user.js';

app.use('/admin/user', userRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
