import { sanitizeFilter } from "mongoose"
import product from "../models/product"
export const getAllProduct = async (req, res) => {
    try {
        const data = await product.find()
        if(!data || data.length === 0){
            res.status(404).json({
                message: "Không tìm thấy sản phẩm nào!",
                data: []
            })
        }

        return res.status(200).json({
            message: "Danh sách sản phẩm",
            data
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message

        })
    }
}

export const getDetailProduct = async (req, res) => {
    try {
        const data  = await product.findById(req.params.id)
        if(!data || data.length === 0){
            res.status(404).json({
                message: "Không tìm thấy sản phẩm !",
                data: []
            })
        }

        return res.status(200).json({
            message: "Đã tìm thấy sản phẩm",
            data
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message

        })
    }
}

export const createProduct = async (req, res) => {
    const size = { "M": 0, "L": 1, "XL": 2, "XXL": 3 }
    try {
        const data  = await product.create(req.body, size)   
        if(!data || data.length === 0){
            res.status(404).json({
                message: "Không thêm được sản phẩm !",
                data: []
            })
        }

        return res.status(200).json({
            message: "Thêm sản phẩm thành công",
            data
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message

        })
    }
}

export const updateProduct = async (req, res) => {
    
    try {
        const data = await product.findByIdAndUpdate(req.params.id, req.body, {new: true})
        if(!data || data.length === 0){
            res.status(404).json({
                message: "Update thất bại !",
                data: []
            })
        }

        return res.status(200).json({
            message: "Update thành công",
            data
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message

        })
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const data  = await product.findByIdAndDelete(req.params.id)
        if(!data || data.length === 0){
            res.status(404).json({
                message: "Xóa sản phẩm thất bại!",
                data: []
            })
        }

        return res.status(200).json({
            message: "Xóa sản phẩm thành công",
            data
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message

        })
    }
}