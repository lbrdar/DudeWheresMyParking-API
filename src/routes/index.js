import express from 'express';
import bcrypt from 'bcrypt-nodejs';
import moment from 'moment';
import database from '../data/database';
import { validateAddress, validateRegisterInput, validateLoginInput, validateParkingSpot, geoLocationUtils } from '../utils';

const router = express.Router();

router.get('/', function (req, res) {
  res.send('REST API ready');
});

router.post('/register', async function (req, res) {
  const validation = validateRegisterInput(req.body);

  if (!validation.valid) res.status(400).send(validation.errors);

  const passwordHash = bcrypt.hashSync(req.body.password);

  await database('user')
    .insert({ username: req.body.username, password_hash: passwordHash })
    .then(data => res.status(201).send(data))
    .catch(err => res.status(500).send(err));
});
router.post('/login', async function (req, res) {
  const validation = validateLoginInput(req.body);

  if (!validation.valid) res.status(400).send(validation.errors);

  const user = await database('user').where('id', req.body.userId).then(res => res[0]);

  if (user && bcrypt.compareSync(req.body.password, user.password_hash)) {
    res.send(200);
  } else {
    res.send(401);
  }
});

router.get('/users/:id', async function (req, res) {
  const selected = await database('user')
    .select('username', 'points')
    .where('id', req.params.id)
    .then(res => res[0]);
  res.send(selected);
});
router.put('/users/:id', async function (req, res) {
  const selected = await database('user')
    .where('id', req.params.id)
    .update({ username: req.body.username })
    .then(res => res[0]);

  res.send(selected);
});

router.get('/user_addresses/:userId', async function (req, res) {
  const selected = await database('user_address')
    .leftJoin('address', 'user_address.address_id', 'address.id')
    .select('label', 'address.address as address', 'latitude', 'longitude')
    .where('user_id', req.params.userId)
    .then(res => res);
  res.send(selected);
});
router.post('/user_addresses/:userId', async function (req, res) {
  const validation = validateAddress(req.body);

  if (!validation.valid) res.status(400).send(validation.errors);

  const { label, latitude, longitude, address } = req.body;
  await database('address')
    .insert({ latitude, longitude, address })
    .then(async (insertedId) => {
      await database('user_address')
        .insert({ label, user_id: req.params.userId, address_id: insertedId })
        .then(() => res.sendStatus(201));
    })
    .catch(err => res.status(500).send(err));
});

router.get('/parking_types', async function (req, res) {
  const selected = await database('parking_type')
    .then(res => res);
  res.send(selected);
});
router.get('/parking_taken_for_slots', async function (req, res) {
  const selected = await database('parking_taken_for_slot')
    .then(res => res);
  res.send(selected);
});

router.get('/parking_spots', async function (req, res) {
  const selected = await database('parking_spot')
    .select('parking_spot.id as id', 'latitude', 'longitude', 'created', 'taken', 'parking_taken_for_slot.duration as takenFor')
    .leftJoin('parking_taken_for_slot', 'parking_spot.takenFor_id', 'parking_taken_for_slot.id')
    .then(res => res);
  res.send(selected);
});
router.post('/parking_spots', async function (req, res) {
  const validation = validateParkingSpot(req.body.parkingSpot);

  if (!validation.valid) res.status(400).send(validation.errors);

  await database('parking_spot')
    .insert(Object.assign({}, req.body.parkingSpot, { creator_id: req.body.userId }))
    .then(async (ids) => {

      const inserted = await database('parking_spot')
        .select('parking_spot.id as id', 'latitude', 'longitude', 'created', 'taken', 'parking_taken_for_slot.duration as takenFor')
        .leftJoin('parking_taken_for_slot', 'parking_spot.takenFor_id', 'parking_taken_for_slot.id')
        .where('parking_spot.id', ids[0])
        .then(res => res);

      res.status(201).send(inserted)
    })
    .catch(err => res.status(500).send(err));
});

router.get('/parking_spots/near', async function (req, res) {
  const { radius, latitude, longitude } = req.query;

  if ((radius === undefined) || (latitude === undefined) || (longitude === undefined)) {
    res.status(400).send({ error: "Request must specify latitude, longitude and radius!" });
  } else {
    const selected = await database('parking_spot')   // TODO: try using some prefiltering method to avoid selecting all (ideas: by country, by latLng +/-10 )
      .select('parking_spot.id as id', 'latitude', 'longitude', 'created', 'taken', 'parking_taken_for_slot.duration as takenFor')
      .leftJoin('parking_taken_for_slot', 'parking_spot.takenFor_id', 'parking_taken_for_slot.id')
      .then(res => res);

    // filter selected using radius and latLng
    // also filter out those which are taken at the moment
    const filtered = selected.filter((parkingSpot) => {
      const distance = geoLocationUtils.distanceFromDegree(parkingSpot, { latitude, longitude }); // in km
      const isTakenNow = parkingSpot.taken && ( (parkingSpot.takenFor === null) || (moment(parkingSpot.taken).add(parkingSpot.takenFor, 'seconds') > moment()) );
      return (distance * 1000 <= radius) && !isTakenNow;
    });

    res.send(filtered);
  }
});

router.get('/parking_spots/:id', async function (req, res) {
  const selected = await database('parking_spot')
    .select('parking_spot.id as id', 'parking_type.label as type', 'latitude', 'longitude', 'costPerHour as cost', 'parking_taken_for_slot.duration as takenFor', 'taken', 'created')
    .leftJoin('parking_type', 'parking_spot.type_id', 'parking_type.id')
    .leftJoin('parking_taken_for_slot', 'parking_spot.takenFor_id', 'parking_taken_for_slot.id')
    .where('parking_spot.id', req.params.id)
    .then(res => res);
  res.send(selected);
});
router.put('/parking_spots/:id', async function (req, res) {
  const selected = await database('parking_spot')
    .where('id', req.params.id)
    .update({ taken: database.raw('CURRENT_TIMESTAMP()'), takenBy_id: req.body.userId, takenFor_id: req.body.takenFor_id })
    .then(res => res[0]);

  // update creator's points
  const creator = await database('parking_spot')
    .select('creator_id as id')
    .where('id', req.params.id)
    .then(res => res[0]);
  if (creator.id !== req.body.userId) { // don't add points if user took parking that he added
    await database('user').where('id', creator.id).increment('points', 5);
  }

  res.send(selected);
});

export default router;
