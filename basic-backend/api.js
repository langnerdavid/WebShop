import express from 'express';
import cors from 'cors';

import { echoController } from "./controllers/echo.js";
import { logRequest } from "./util/logger.js";
import {buyerController} from "./controllers/buyer.js";
import {orderController} from "./controllers/order.js";
import {articleController} from "./controllers/article.js";
import {sellerController} from "./controllers/seller.js";
import {cartController} from "./controllers/cart.js";

export const router = express.Router();

router.use(cors());
router.use(express.json());
router.use(logRequest);

router.use('/buyer', buyerController);
router.use('/seller', sellerController);
router.use('/article', articleController);
router.use('/order', orderController);
router.use('/cart', cartController);

router.use((req, res) => {
    res.status(404);
    res.send('Route does not exist');
});

export { router as apiRouter };
