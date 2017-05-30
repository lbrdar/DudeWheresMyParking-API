import express from 'express';
import database from '../data/database';
import { validateParkingSpot, geoLocationUtils } from '../utils';

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

router.get('/parking_spots/near', async function(req, res) {
  const { radius, latitude, longitude } = req.query;

  if ((radius === undefined) || (latitude === undefined) || (longitude === undefined)) {
    res.status(400).send({ error: "Request must specify latitude, longitude and radius!" });
  } else {
    const selected = await database('parking_spot')   // TODO: try using some prefiltering method to avoid selecting all (ideas: by country, by latLng +/-10 )
      .select('parking_spot.id as id', 'latitude', 'longitude')
      .leftJoin('parking_type', 'parking_spot.type_id', 'parking_type.id')
      .leftJoin('parking_taken_for_slot', 'parking_spot.takenFor_id', 'parking_taken_for_slot.id')
      .then(res => res);

    // filter selected using radius and latLng
    const filtered = selected.filter((parkingSpot) => {
      const distance = geoLocationUtils.distanceFromDegree(parkingSpot, { latitude, longitude });
      return (distance <= radius);
    });

    res.send(filtered);
  }
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
