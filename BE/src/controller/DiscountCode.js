import DiscountCode from '../models/DiscountCode';

export const createDiscountCode = async (req, res) => {
    try {
        const { 
            code, description, discountPercentage, discountAmount, startDate, expirationDate, quantity, minPurchaseAmount } = req.body;

        const newDiscountCode = new DiscountCode({
            code,
            description,
            discountPercentage,
            discountAmount,
            startDate,
            expirationDate,
            quantity,
            minPurchaseAmount,
            usedCount: 0,
            status: 'active',
        });

        const savedDiscountCode = await newDiscountCode.save();

        res.status(201).json(savedDiscountCode);
    } catch (error) {
        res.status(400).json({ message: 'Error creating discount code', error });
    }
};
export const updateDiscountCode = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const updatedDiscountCode = await DiscountCode.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedDiscountCode) {
            return res.status(404).json({ message: 'Discount code not found' });
        }

        res.status(200).json(updatedDiscountCode);
    } catch (error) {
        res.status(400).json({ message: 'Error updating discount code', error });
    }
};
export const deleteDiscountCode = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedDiscountCode = await DiscountCode.findByIdAndDelete(id);

        if (!deletedDiscountCode) {
            return res.status(404).json({ message: 'Discount code not found' });
        }

        res.status(200).json({ message: 'Discount code deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting discount code', error });
    }
};
export const getDiscountCodes = async (req, res) => {
    try {
        const discountCodes = await DiscountCode.find();
        res.status(200).json(discountCodes);
    } catch (error) {
        res.status(400).json({ message: 'Error fetching discount codes', error });
    }
};
