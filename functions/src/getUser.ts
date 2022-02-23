import * as functions from 'firebase-functions';
import {BAD_REQUEST, NOT_FOUND} from './constants/text.constanst';
import {firestore, initializeApp} from 'firebase-admin';

initializeApp();

export const getUser = functions.https.onRequest(async (request, response) => {
  const {id} = request.body;

  // some validation (mb middlewares) goes there
  if (!id) {
    response.status(400).send(BAD_REQUEST);

    return;
  }

  const db = firestore();

  const doc = await db.collection('user').doc(id).get();

  if (!doc.exists) {
    response.status(404).send(NOT_FOUND);

    return;
  }

  const user = doc.data();

  functions.logger.info(id, {structuredData: true});
  response.json(user);
});
