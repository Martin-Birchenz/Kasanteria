const ShippingRepository = require("../repositories/shippingRepository.js");

const ShippingController = {
  calculate: async (req, res) => {
    try {
      const { cp } = req.body;
      if (!cp || isNan(cp)) {
        return res
          .status(400)
          .json({ message: "El código postal es obligatorio" });
      }
      const rate = await ShippingRepository.calculateRate(cp);
      if (!rate) {
        return res.status(404).json({
          name: "Envío Nacional Estándar",
          cost: 5500.0,
          estimated_days: "4 a 7 días hábiles",
        });
      }
      return res.status(200).json(rate);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = ShippingController;
