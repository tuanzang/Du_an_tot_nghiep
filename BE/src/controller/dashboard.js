export const getDashboardByDay = async (req, res, date = new Date().toISOString().split('T')[0]) => {
    try {
        const dashboard = await axios.get("http://localhost:3001/api/orders", {
            params: {
                date : date
            },
        });
        return res.status(200).json({
            message: "Success",
            data: dashboard,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
}