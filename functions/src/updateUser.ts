import * as functions from 'firebase-functions';
import {BAD_REQUEST} from './constants/text.constanst';
import {firestore} from 'firebase-admin';

const asIs = ['id', 'coins_left', 'last_game_number'];

export const updateUser = functions.https
    .onRequest(async (request, response) => {
      const {body} = request;
      const {id} = body;
      // some validation (mb middlewares) goes there
      if (!id) {
        response.status(400).send(BAD_REQUEST);

        return;
      }
      const db = firestore();

      // checking is document exist ?
      const docRef = await db.collection('user').doc(id).get();
      if (!docRef.exists) {
        await db.collection('user').doc(id).set(body);
        response.status(201).send('OK');

        return;
      }

      const newDoc: {
    [key: string]: string | number | boolean | firestore.FieldValue
  } = {};

      for (const key of Object.keys(body)) {
        const value = body[key];
        if (typeof value !== 'number' || asIs.includes(key)) {
          newDoc[key] = value;
          continue;
        }
        newDoc[key] = firestore.FieldValue.increment(value);
      }
      await db.collection('user').doc(id).update(newDoc);
      response.status(200).send('OK');
    });
