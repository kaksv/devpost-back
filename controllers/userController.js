exports.getUserParticipations = async (req, res) => {
    try {
      const participations = await Hackathon.find(
        { 'participants.user': req.userId },
        { _id: 1, title: 1 }
      );
      res.status(200).json(participations);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching participations' });
    }
  };