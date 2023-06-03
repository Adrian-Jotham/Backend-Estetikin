const { Module } = require('module');
const modulesData = require('./moduledata')

const getStories = (req, res) => {
    return res.status(200).json(
        {status : 'get stories, last update June 3th 2023',
        error : false,
        data: modulesData.data,
    }
)};

module.exports = { getStories }