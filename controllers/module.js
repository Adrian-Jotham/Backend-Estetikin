const modulesData = require('./moduledata')

const getStories = (req, res) => {
    return res.status(200).json(
        {
        error : false,
        data: modulesData.data
        }
)};

const getStoriesbyid = (req, res) => {
    
}

module.exports = { getStories }