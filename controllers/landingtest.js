exports.landing = (req, res) => {
    return res.status(200).json(
        {message : 'This is landing page \n selamat datang di landing pagenya cuy',
        error : false,
        }
    )
} 