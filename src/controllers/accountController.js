const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const express = require('express');
const Account = require('../models/account');

exports.createNewAccount = async (req, res) => {
    try {
      const { firstName, lastName, email, password } = req.body;
      const existingAccount = await Account.findOne({ where: {email} });
      if (existingAccount) {
        return res.status(400).json({ error: 'Email already registered' });
      }
  
      const salt = await bcrypt.genSalt(10);
      if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long' });
      }
      const hashedPassword = await bcrypt.hash(password, salt);
      const newAccount = await Account.create({ firstName, lastName, email, password: hashedPassword });
  
      res.status(201).json({ message: 'Account registered successfully' });
  
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        // Handle validation errors specifically
        return res.status(400).json({
          message: 'Validation Error',
          errors: error.errors.map((err) => err.message)
        });
      }
      res.status(500).json({ message: 'Failed to create user.' });
    }
}

exports.loginAccount = async(req,res) => {
    try {
      const { email, password } = req.body;
      // Check if the user exists
      const account = await await Account.findOne({ where: {email} });
      if (!account) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      // Validate the password
      const isPasswordValid = await account.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      // Generate a JWT token
      const token = jwt.sign({ accountId: account.id }, 'secretKey');
      
      res.status(200).json({ token });
    } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).json({ error: 'An error occurred while logging in' });
    }
  
  }