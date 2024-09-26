// Track progress and errors with Kue: Create the Job processor
import kue from 'kue';

// Create a queue
const queue = kue.createQueue();

// Array of blacklisted phone numbers
const blacklistedNumbers = ['4153518780', '4153518781'];

/**
 * Function to send notification
 * @param {string} phoneNumber - The phone number to send the notification to.
 * @param {string} message - The message to send.
 * @param {object} job - The job object from Kue.
 * @param {function} done - Callback function to signal the job completion.
 */
function sendNotification(phoneNumber, message, job, done) {
    // Track initial job progress: 0%
    job.progress(0, 100);

    // Check if the phone number is blacklisted
    if (blacklistedNumbers.includes(phoneNumber)) {
        // Fail the job if phone number is blacklisted
        return done(new Error(`Phone number ${phoneNumber} is blacklisted`));
    }

    // Track job progress: 50%
    job.progress(50, 100);

    // Log the message being sent
    console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);

    // Complete the job successfully
    done();
}

// Process the 'push_notification_code_2' jobs, with a concurrency of 2 jobs at a time
queue.process('push_notification_code_2', 2, (job, done) => {
    const { phoneNumber, message } = job.data;
    sendNotification(phoneNumber, message, job, done);
});
