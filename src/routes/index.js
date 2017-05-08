import express from 'express';
import database from '../data/database';
import { validateParkingSpot } from '../utils';

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
    .select('parking_spot.id as id', 'latitude', 'longitude')
    .leftJoin('parking_type', 'parking_spot.type_id', 'parking_type.id')
    .leftJoin('parking_taken_for_slot', 'parking_spot.takenFor_id', 'parking_taken_for_slot.id')
    .then(res => res);
  res.send(selected);
});
router.post('/parking_spots', async function(req, res) {
  const validation = validateParkingSpot(req.body);

  if (!validation.valid) res.status(400).send(validation.errors);

  await database('parking_spot')
    .insert(req.body)
    .then(data => res.status(201).send(data))
    .catch(err => res.status(500).send(err));
});

router.get('/parking_spots/:id', async function(req, res) {
  const selected = await database('parking_spot')
    .select('parking_type.label as type', 'latitude', 'longitude', 'costPerHour as cost', 'parking_taken_for_slot.duration as takenFor', 'taken')
    .leftJoin('parking_type', 'parking_spot.type_id', 'parking_type.id')
    .leftJoin('parking_taken_for_slot', 'parking_spot.takenFor_id', 'parking_taken_for_slot.id')
    .where('parking_spot.id', req.params.id)
    .then(res => res);
  res.send(selected);
});

export default router;
