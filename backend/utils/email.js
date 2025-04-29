// This is a mock email service for development
// In production, replace with actual email service

async function sendEmail(to, subject, text) {
    try {
        console.log('Email would be sent in production:');
        console.log(`To: ${to}`);
        console.log(`Subject: ${subject}`);
        console.log(`Content: ${text}`);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
}

module.exports = sendEmail;
