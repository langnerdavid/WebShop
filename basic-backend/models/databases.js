import Datastore from '@seald-io/nedb';

export const echoDb = new Datastore({ filename: './databases/echo.db', autoload: true });
