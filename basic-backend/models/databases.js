import Datastore from '@seald-io/nedb';

export const buyerDb = new Datastore({ filename: './databases/buyer.db', autoload: true });
export const sellerDb = new Datastore({ filename: './databases/seller.db', autoload: true });
export const articleDb = new Datastore({ filename: './databases/article.db', autoload: true });
export const orderDb = new Datastore({ filename: './databases/order.db', autoload: true });
export const cartDb = new Datastore({ filename: './databases/cart.db', autoload: true });
