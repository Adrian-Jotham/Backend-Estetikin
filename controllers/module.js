
const modulesData = require('./moduledata')

const getStories = async (req, res) => {
    return res.status(200).json(
        {message : 'get stories, last update June 3th 2023',
        error : false,
        data: modulesData.data,
    }
)};

module.exports = { getStories }