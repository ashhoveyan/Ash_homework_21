import 'dotenv/config';
import './initTable.js'
import path from "path";
import express from 'express';

import router from './routers/customersRouter.js';

const app = express();


app.set('views', path.resolve('./views'))
app.set('view engine', 'ejs')

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve('./views')))



app.use('/theatre', router)

app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);
},)
