exports.getRedirect = (req, res) => {
    try {
      const { token } = req.query;
      //const deepLink = `estetikin://reset_password?token=${token}`;
      const apiUrl = process.env.URL_RESET; 
      return res.render('reset', { token, apiUrl });
    } catch (err) {
      console.log('getRedirect Error:');
      console.log(err);
      return res.status(500).json({ error: true, message: "Failed to redirect" });
    }
  };
  