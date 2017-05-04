import express from 'express';
import database from '../data/database';

const router = express.Router();

router.get('/', function(req, res) {
  res.send('REST API ready');
});

router.get('/parking_types', async function(req, res) {
  const selected = await database('parking_type')
    .then(res => res);
  res.send(selected);
});

router.get('/parking_taken_for_slots', async function(req, res) {
  const selected = await database('parking_taken_for_slot')
    .then(res => res);
  res.send(selected);
});

router.get('/parking_spots', async function(req, res) {
  const selected = await database('parking_spot')
    .leftJoin('parking_type', 'parking_spot.type_id', 'type.id')
    .leftJoin('parking_taken_for_slot', 'takenFor_id.type_id', 'parking_taken_for_slot.id')
    .then(res => res);
  res.send(selected);
});

export default router;
