const express = require("express");
const router = express.Router();

const {checkRFID,
    scanRFIDandMarkAttendance
} = require("../controllers/rfidverificationController");

// Route to check RFID
router.post("/check", checkRFID);
router.post('/attendance', scanRFIDandMarkAttendance);

// Export the router
module.exports = router;