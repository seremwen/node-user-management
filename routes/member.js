// routes/member.js
const express = require('express');
const router = express.Router();
const   Certificate  = require('../models/Certificate');
const  Member  = require('../models/Member');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const authenticateToken = require("../middleware/authenticateToken"); // Your authenticateToken middleware
const memberController = require('../controllers/memberController');


/**
 * @swagger
 * components:
 *   schemas:
 *     Member:
 *       type: object
 *       required:
 *         - name
 *         - surname
 *         - email
 *         - department
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated ID of the member
 *         name:
 *           type: string
 *           description: The member's first name
 *         surname:
 *           type: string
 *           description: The member's last name
 *         email:
 *           type: string
 *           description: The member's email
 *         department:
 *           type: string
 *           description: The member's department
 *         status:
 *           type: string
 *           description: The member's approval status
 *       example:
 *         name: John
 *         surname: Doe
 *         email: john.doe@example.com
 *         department: Engineering
 *         status: PENDING
 */

/**
 * @swagger
 * tags:
 *   name: Members API
 *   description: The members managing API
 */

/**
 * @swagger
 * /api/v1/members/create:
 *   post:
 *     summary: Create a new member
 *     tags: [Members API]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Member'
 *     responses:
 *       201:
 *         description: The member was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Member'
 *       400:
 *         description: Bad request
 */
router.post("/create", authenticateToken,memberController.createMember );

/**
 * @swagger
 * /api/v1/members/{id}/approve:
 *   patch:
 *     summary: Approve a member and generate a certificate number
 *     tags: [Members API]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The member ID
 *     responses:
 *       200:
 *         description: The member was successfully approved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 member:
 *                   $ref: '#/components/schemas/Member'
 *                 certificateNumber:
 *                   type: string
 *                   description: The generated certificate number
 *       400:
 *         description: Bad request
 *       404:
 *         description: Member not found
 */
router.patch('/:id/approve',authenticateToken, async (req, res) => {
  try {
    const member = await Member.findByPk(req.params.id);
    if (!member) return res.status(404).json({ error: 'Member not found' });

    if (member.status !== 'APPROVED') {
      member.status = 'APPROVED';
      await member.save();

      const certificateNumber = 'CERT-' + Math.random().toString(36).substr(2, 9).toUpperCase();
      await Certificate.create({ certificateNumber, memberId: member.id });

      res.status(200).json({ member, certificateNumber });
    } else {
      res.status(400).json({ error: 'Member is already approved' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
