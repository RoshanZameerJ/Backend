require('dotenv').config();

module.exports = {
    MONGO_URI: process.env.MONGO_URI,
    SECRET_KEY: process.env.SECRET_KEY||'secret_key',
    ADMIN_TOKEN: process.env.ADMIN_TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFkbWluX2lkIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzI0MTQ3MzY2LCJleHAiOjE3MjQyMzM3NjZ9.nTs_-AzJL538NXZjkGK1DzVWb-S3Fr-a437uUDe61h0'
};
