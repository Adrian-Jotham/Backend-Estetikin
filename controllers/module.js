const modulesData = require('./moduledata')

const getStories = (req, res) => {
    return res.status(200).json(
        {status : 'invalid input',
        error : false,
        data: {
            books: modulesData.map((story) => ({
            id: story.id,
            title: story.title,
            description : story.description,
            genre : story.genre,
            url : story.url
            })),
        },
    }
)};

module.exports = { getStories }