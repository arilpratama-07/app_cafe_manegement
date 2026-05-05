const router = require("express").Router();
const ctrl = require("../controllers/orderControllers");
// routes/orderRoutes.js
router.get("/", async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        {
          model: OrderItem,
          include: ['Menu'] // Pastikan alias 'Menu' sesuai dengan definisi model kamu
        }
      ],
      order: [['createdAt', 'DESC']] // Pesanan terbaru muncul paling atas
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/", ctrl.getAll);
router.post("/", ctrl.create);

module.exports = router;