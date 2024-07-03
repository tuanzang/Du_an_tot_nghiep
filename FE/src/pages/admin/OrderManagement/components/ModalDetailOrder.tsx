import { Button, Card, Modal, Table, Tooltip } from 'antd'
import React, { useState } from 'react'
import formatCurrency from '../../../../services/common/formatCurrency';
import { DoubleLeftOutlined, DoubleRightOutlined } from '@ant-design/icons';
import axios from 'axios';
import { log } from 'console';
const columns = ({ formatCurrency: any, currentPage, pageSize }) => [
    {
        title: "STT",
        dataIndex: "stt",
        key: "stt",
        width: 30,
        align: "center" as const,
        render: (text, record, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
        title: "Sản phẩm",
        dataIndex: "name",
        key: "name",
        align: "center" as const,
        width: "280",
    },
    {
        title: "Giá tiền",
        dataIndex: "price",
        key: "price",
        align: "center" as const,
        render: (text: string) => formatCurrency({ money: text }),
    },
    {
        title: "Số lượng",
        dataIndex: "quantity",
        key: "quantity",
        align: "center" as const,

    },

];
function ModalDetailOrder({ isOpenModalDetailOrder, onChangeModalDetailOrder, curData, isUpdateOrder }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const handeToogleModalDetailOrder = () => {
        onChangeModalDetailOrder()
    }
    const handleTableChange = (pagination: any) => {
        setCurrentPage(pagination.current);
        setPageSize(pagination.pageSize);
    };
    const updateOrder = async (status) => {
        try {
            const res = await axios.put(`http://localhost:3001/api/orders/${curData?._id}`, {
                status: status
            });
            isUpdateOrder({isUpdate: res?._id})

        } catch (error) {
            console.log(error);
        }
    };
    const handleChangeStatusOrder = (status) => {
        let newStatus = ""
        if (status === "Chờ xác nhận") {
            newStatus = "Chờ giao hàng"
        }else if (status === "Chờ giao hàng") {
            newStatus = "Đang vận chuyển"
        }else if (status === "Đang vận chuyển") {
            newStatus = "Đã giao hàng"
        }else if (status === "Đã giao hàng") {
            newStatus = "Đã thanh toán"
        }else if (status === "Đã thanh toán") {
            newStatus = "Hoàn thành"
        }
        updateOrder(newStatus)
    }

    // const handleChangeBackStatusOrder = (status) => {
    //     let backStatus = ""
    //     if (status === "Đang vận chuyển") {
    //         backStatus = "Chờ giao hàng"
    //     } else if (status === "Chờ giao hàng") {
    //         backStatus = "Chờ xác nhận"
    //     }
    //     updateOrder(status)
    //     console.log(status);
        
    // }


    return (
        <Modal
            title="Đơn hàng chi tiết"
            style={{ top: 20 }}
            width={1000}
            open={isOpenModalDetailOrder}
            onOk={handeToogleModalDetailOrder}
            onCancel={handeToogleModalDetailOrder}
        >
            <Card>
                <div>
                    <h1 style={{ textAlign: "center" }}>Thông tin đơn hàng</h1>
                </div>
                <Table dataSource={curData?.products} columns={columns({ currentPage, pageSize })} onChange={handleTableChange} />
                {/* <Button type="primary" icon={<DoubleLeftOutlined />} style={{ marginRight: 10 }} onClick={() => confirm("Bạn có muốn trở lại trạng thái cũ không  ?") ? handleChangeBackStatusOrder(curData?.status) : ""}>Trở lại trạng thái cũ</Button> */}
                <Button type="primary" icon={<DoubleRightOutlined />} onClick={() => confirm("Bạn có muốn chuyển trạng thái đi không  ?") ? handleChangeStatusOrder(curData?.status) : ""}>Chuyển trạng thái</Button>
            </Card>
        </Modal>
    )
}

export default ModalDetailOrder