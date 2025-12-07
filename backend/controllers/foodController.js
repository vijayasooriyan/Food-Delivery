import foodModel from "../models/foodModel.js";

const addFood = async (req, res) => {
  try {
    // Safety check
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const food = new foodModel({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      image: req.file.filename
    });

    await food.save();
    res.status(201).json({ success: true, message: "Food Added", food });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export { addFood };
