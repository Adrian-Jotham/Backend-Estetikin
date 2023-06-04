
exports.landing = (req, res) => {
    return res.status(200).json(
        {status : 'This is landing page',
        error : false,
    }
    )
} 