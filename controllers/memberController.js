const  Member  = require('../models/Member');

exports.createMember= async (req, res) => {
    try {
        const { name, surname, email, department, status } = req.body;

        // Extract username from req.user (assuming it's set by authenticateToken middleware)
        const modifiedBy = req.user.username;

        const memberData = {
            name,
            surname,
            email,
            department,
            status,
            modifiedBy: modifiedBy // Set modifiedBy to username from token
        };

        const member = await Member.create(memberData);

        res.status(201).json(member);
    } catch (error) {
        console.error('Error creating member:', error);
        res.status(400).json({ error: error.message });
    }
}