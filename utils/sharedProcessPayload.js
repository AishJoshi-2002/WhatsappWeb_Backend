const userModel = require('../models/user.model');
const processedMessageModel = require('../models/processed_message.model');

const createUser = async ({ firstname, lastname, number, accountType, contacts }) => {
    if (!number || !accountType) {
        throw new Error('Number and AccountType are required fields');
    }
    const user = await userModel.create({
        fullname: {
            firstname,
            lastname
        },
        number,
        accountType,
        contacts
    })
    return user;
}

const addContact = async ({ userNumber, contactInfo }) => {
    const user = await userModel.findOne({ number: Number(`${userNumber}`) });
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    const contactExistsByNumber = user.contacts.some(
        c => c.number === Number(`${contactInfo.number}`)
    );

    const contactExistsByUserId = user.contacts.some(
        c => c.user && c.user.toString() === contactInfo.userId
    );

    if (contactExistsByNumber || contactExistsByUserId) {
        return res.status(400).json({ message: "Contact already exists in your contacts" });
    }

    const registeredContact = await userModel.findOne({ number: Number(`${contactInfo.number}`) });

    if (registeredContact) {
        user.contacts.push({
            user: registeredContact._id,
            name: contactInfo.name || registeredContact.fullname.firstname
        });
    } else {
        user.contacts.push({
            name: contactInfo.name,
            number: Number(`${contactInfo.number}`)
        });
    }
    return user;
}

const processPayloadMessages = async (payload) => {
    if (payload?.metaData && payload.metaData?.entry && Array.isArray(payload.metaData.entry) && payload.metaData.entry.length === 1) {
        const entry = payload.metaData.entry;
        if (entry[0] && Object.hasOwn(entry[0], "changes") && Array.isArray(entry[0].changes) && entry[0].changes.length === 1) {
            const changes = entry[0].changes;
            if (changes[0] && Object.hasOwn(changes[0], "value") && changes[0].value) {
                const value = changes[0].value;
                if (value?.messages && Array.isArray(value.messages)) {
                    for (const msg of value.messages) {
                        if (msg.type !== 'text') continue;

                        const doc = {
                            message_id: msg.id,
                            from: msg.from,
                            to: (payload._id.includes("-user") ? value.metadata?.display_phone_number : value.contacts[0]?.wa_id),
                            message: msg.text?.body || '',
                            timestamp: new Date(parseInt(msg.timestamp) * 1000),
                            current_status: 'sent',
                            status: {
                                sent: { timestamp: new Date() }
                            }
                        };

                        await addContact(doc.from, { number: doc.to });

                        await processedMessageModel.create(doc);
                    }
                }
            }
        }
    }
}

const processPayloadStatuses = async (payload) => {
    // await processedMessageModel.findOneAndUpdate(
    //     { message_id: msg.id },
    //     {
    //         $set: {
    //             current_status: "delivered",
    //             "status.delivered.timestamp": new Date()
    //         }
    //     }
    // );
}

module.exports = { createUser, addContact, processPayloadMessages, processPayloadStatuses };