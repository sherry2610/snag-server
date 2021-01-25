const setupStripe = async () => {
    const stripe = require('stripe')('sk_test_51IDRhaIdmUDlgC55MuxgIdgVkN6frav8XIvKBEhEC1XicV7VlI26zHfqWwItoZw3p4prGlLX7iEwmHxcswrGq8ti00HMHPtn8U');
    const setupIntent = await stripe.setupIntents.create({
        usage: 'on_session', // The default usage is off_session
    });      
    return stripe;
};
const stri = setupStripe();
module.exports = stri;