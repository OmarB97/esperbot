import { App } from './app';
import firebase from 'firebase/app';
import 'firebase/firestore';

export const DB = App.firestore();

// Export types that exists in Firestore
// This is not always necessary, but it's used in other examples
const { GeoPoint, Timestamp } = firebase.firestore;
export { GeoPoint, Timestamp };

// if using Firebase JS SDK < 5.8.0
DB.settings({ timestampsInSnapshots: true });
