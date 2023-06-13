const modulesData = require('./asset/moduledata')

const getModules = async (req, res) => {
    return res.status(200).json(
        {message : 'get modules, last update June 13th 2023',
        error : false,
        data: modulesData.data,
    }
)};

module.exports = { getModules }