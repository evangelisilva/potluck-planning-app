// Model data to integrate later with mongo db
/* Schema: const rsvpSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true},
    event: { type: String, required: true},
    user: { type: String, required: true },
    response: { type: String},
    message: { type: String},
    // Note: anything that may be important for FUTURE LOGIC (i.e. is a clear identnfier, most things other tha "message")
    guests_count: { type: Number, required: true}
});
 */


const mongoose = require('mongoose');
const Rsvp = require('../models/Rsvp');
const Event = require('../models/Event');
const User = require('../models/User');

// Creating a global record with example data

let exampleEventRSVPData = {  
    
    event: "65d3d557b90bec95e14f1476", 
    
    user: "123",
    
    status: "yes",
    
    note: "Something sent to the host...",
    
    guestsBringing: 2 
    
};



let rsvpFixed = new Rsvp(exampleEventRSVPData);

// Before saving a record - try to delete the original
Rsvp.deleteMany({event: "65d3d557b90bec95e14f1476", user: '123'}).then(
    () => console.log("RSVP controller - Deleted some records from mongo db")
  ).then(
    () => rsvpFixed.save()
  ).then(
    () => console.log("rsvp controller - Added a record into mongo db")
);






// TODO (alternative) - implement chat gpt's idea for this code



// View status of RSVP for given user and event
exports.viewRSVPStatus = async(req, res) => {
    const { userId, eventId } = req.params;
    try {
        const rsvp = await Rsvp.findOne({ user: userId, event: eventId });
        if (!rsvp) {
            return res.status(201).json({ message: 'RSVP not found' });
        }
        // Note: this should have the ID auto-generated by the database in here to return (which will subsequently be used for an update)
        res.json(rsvp);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Create an RSVP record
exports.createRSVP = async(req, res) => {
    const { eventId } = req.params;
    const { user, status, note, guestsBringing} = req.body;
    try {
        const rsvp = new Rsvp({ event: eventId, user, status, note, guestsBringing});
        await rsvp.save();
        res.status(201).json(rsvp);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// TODO - add actual code in here
exports.updateRSVP = async (req, res) => {
    try {
        res.header("Access-Control-Allow-Origin", "*");
        res.json({test : "test"})
    }

    catch {
        console.error('Error updating an rsvp record:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}


/*

// Update an already-existing RSVP record
async function updateRSVP(req, res) {
    const { rsvpId } = req.params;
    const { response, guests_count } = req.body;
    try {
        const rsvp = await Rsvp.findByIdAndUpdate(rsvpId, { response, guests_count }, { new: true });
        if (!rsvp) {
            return res.status(404).json({ message: 'RSVP not found' });
        }
        res.json(rsvp);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}


*/