const  Member  = require('../models/Member');
const fs = require('fs');
const csvParser = require('csv-parser');
const xlsx = require('xlsx');

// Helper function to parse CSV
const parseCSV = (filePath, cb) => {
    const results = [];
    fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (data) => results.push(data))
        .on('end', () => {
            cb(results);
        });
};

// Helper function to parse Excel
const parseExcel = (filePath, cb) => {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const results = xlsx.utils.sheet_to_json(sheet);
    cb(results);
};
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
exports.uploadMembers = (req, res) => {
    const filePath = req.file.path;
    const fileExtension = req.file.originalname.split('.').pop();

    const parseFile = fileExtension === 'csv' ? parseCSV : parseExcel;

    parseFile(filePath, async (members) => {
        try {
            // Ensure the modifiedBy field is populated for each member
            const modifiedBy = req.user.username; // Extract username from req.user
            const membersWithModifier = members.map(member => ({ ...member, modifiedBy }));
            await Member.bulkCreate(membersWithModifier);
            res.status(201).json({ message: 'Members uploaded successfully' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        } finally {
            fs.unlinkSync(filePath); // Delete the file after processing
        }
    });
};