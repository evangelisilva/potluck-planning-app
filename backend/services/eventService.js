const Event = require('../models/Event');
const { sendEmail } = require('./emailService');

// Service function to create a new event
exports.createEvent = async (eventData) => {
  try {
    const event = await Event.create(eventData);
    return event;
  } catch (error) {
    throw new Error('Could not create event');
  }
};

// Service function to retrieve all events
exports.getAllEvents = async () => {
  try {
    const events = await Event.find();
    return events;
  } catch (error) {
    throw new Error('Could not retrieve events');
  }
};

// Service function to retrieve event details by event ID
exports.getEventById = async (eventId) => {
  try {
    const event = await Event.findById(eventId);
    if (!event) {
      throw new Error('Event not found');
    }
    return event;
  } catch (error) {
    throw new Error('Could not retrieve event details');
  }
};

// Service function to edit details of an event
exports.editEvent = async (eventId, eventData) => {
  try {
    const event = await Event.findByIdAndUpdate(eventId, eventData, { new: true });
    if (!event) {
      throw new Error('Event not found');
    }
    return event;
  } catch (error) {
    throw new Error('Could not edit event');
  }
};

// Service function to cancel an event
exports.cancelEvent = async (eventId) => {
  try {
    const event = await Event.findByIdAndUpdate(eventId, { status: 'cancelled' }, { new: true });
    if (!event) {
      throw new Error('Event not found');
    }
    return event;
  } catch (error) {
    throw new Error('Could not cancel event');
  }
};

// Service function to send invitations to guests
exports.sendInvitations = async (eventId, event, invitedGuests) => {
  try {
    const responses = [];
    // Send invitations to each guest
    for (const guest of invitedGuests) {
      // Construct template data using event details
      const templateData = {
        name: event.title,
        date: event.date,
        startTime: event.startTime,
        endTime: event.endTime,
        streetAddress1: event.streetAddress1,
        city: event.city,
        state: event.state,
        zipCode: event.zipCode,
        host: 'Evangeli',
        // rsvpLink: 'http://localhost:3000/events/' + eventId + '/rsvp'
        rsvpLink: 'http://localhost:3000/rsvp/65d3d557b90bec95e14f1476'
      };
      const response = await sendEmail(guest, 'ICSI518-Potluck-InvitationTemplate', templateData);
      const responseWithEventId = { eventId, ...response }; 
      responses.push(responseWithEventId); 
    }
    return responses; 
  } catch (error) {
    console.error('Error sending invitations:', error);
    throw new Error('Failed to send invitations');
  }
};

exports.sendCancellationEmail = async (updatedEvent) => {
  try {
    const templateData = {
      name: updatedEvent.title,
      host: 'Evangeli'
    };

    // Iterate through invitedGuests array and send email to each guest
    for (const guestEmail of updatedEvent.invitedGuests) {
      const response = await sendEmail(guestEmail, 'ICSI518-Potluck-CancelEventTemplate', templateData);
      console.log(`Cancellation email sent to ${guestEmail}`);
    }

    // Optionally, you can return a success message or handle response accordingly
    return { message: 'Cancellation emails sent successfully' };
  } catch (error) {
    console.error('Error sending cancellation emails:', error);
    throw new Error('Failed to send cancellation emails');
  }
};

