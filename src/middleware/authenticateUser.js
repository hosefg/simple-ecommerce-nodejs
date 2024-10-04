const jwt = require('jsonwebtoken');
const authenticateUser = (req, res, next) => {
    try {
        // Ensure the authorization header is present
        if (!req.headers.authorization) {
            return res.status(401).json({ error: 'Unauthorized: No token provided' });
        }

        // Split the authorization header to get the token
        const token = req.headers.authorization.split(' ')[1];

        // Verify the token
        const decodedToken = jwt.verify(token, 'secretKey');
        console.log('Decoded Token:', decodedToken); // Log the decoded token to see its structure

        // Check if accountId exists in the decoded token
        if (!decodedToken.accountId) {
            return res.status(401).json({ error: 'Unauthorized: Invalid token payload' });
        }

        // Attach the accountId to the request object
        req.accountId = decodedToken.accountId;
        console.log("account ID", req.accountId); // Log the accountId here

        next();
    } catch (error) {
        console.error('Error authenticating user:', error);
        res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
};

module.exports = authenticateUser;

