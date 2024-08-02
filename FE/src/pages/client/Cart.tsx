/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, InputNumber, Popconfirm, Table, Typography, Modal, Radio, Card } from "antd";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import useCartMutation, { useMyCartQuery } from "../../hooks/useCart";
import { formatPrice } from "../../services/common/formatCurrency";
import { useDispatch, useSelector } from "react-redux";
import {
  selectProductSelected,
  selectTotalPrice,
  updateProductSelected,
} from "../../store/cartSlice";
import { socket } from "../../socket";
import axios from "axios";
import { IVoucher } from "../../interface/Voucher";
import dayjs from "dayjs";

const { Text } = Typography;

export interface ICartItem {
  _id: string;
  name: string;
  image: string[];
  price: number;
  description: string;
  quantity: number;
  categoryId: string[];
  createdAt: string;
  updatedAt: string;
  product: {
    _id: string;
    name: string;
    image: string[];
    price: number;
    description: string;
    quantity: number;
    categoryId: string[];
    createdAt: string;
    updatedAt: string;
  };
  key: string;
  variant: {
    _id: string;
    price: number;
    sizeName: string;
  };
}

export default function Cart() {
  const dispatch = useDispatch();
  const productSelected: ICartItem[] = useSelector(selectProductSelected);
  const totalPrice = useSelector(selectTotalPrice);
  const { data, refetch } = useMyCartQuery();
  const { mutate: onUpdateQuantity } = useCartMutation({
    action: "UPDATE",
  });
  const { mutate: onDeleteProduct } = useCartMutation({
    action: "DELETE",
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [discountCodes, setDiscountCodes] = useState([]);
  const [selectedDiscountCode, setSelectedDiscountCode] = useState(null);
  const [totalDiscount, setTotalDiscount] = useState(0);

  const finalTotalPrice = totalPrice - totalDiscount;

  // initial socket
  useEffect(() => {
    const onConnect = () => {
      console.log("Socket client connect");
    };

    const onHiddenProduct = () => {
      refetch();
    };

    socket.on("connect", onConnect);
    socket.on("hidden product", onHiddenProduct);

    return () => {
      socket.off("connect", onConnect);
      socket.off("hidden product", onHiddenProduct);
    };
  }, [refetch]);

  const rowSelection = {
    onChange: (_: any, selectedRows: ICartItem[]) => {
      dispatch(updateProductSelected(selectedRows));
    },
  };

  const productsFormatted = useMemo(() => {
    return data?.data?.products?.map((it) => ({
      ...it.product,
      ...it,
      key: it._id,
    }));
  }, [data?.data]);

  const handleUpdateQuantity = (variantId: string, quantity: number) => {
    onUpdateQuantity({
      variantId,
      quantity: quantity,
    });
  };

  useEffect(() => {
    // Fetch mã giảm giá từ API
    axios.get("http://localhost:3001/api/discountCode/discountCodes")
      .then(response => {
        setDiscountCodes(response.data);
      })
      .catch(error => {
        console.error("Error fetching discount codes:", error);
      });
  }, []);

  const showDiscountModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    if (selectedDiscountCode) {
      const selectedCode = discountCodes.find((code) => code.code === selectedDiscountCode);
      if (selectedCode) {
        let discountAmount = 0;
        if (selectedCode.discountType === 'percentage') {
          discountAmount = (totalPrice * selectedCode.discountPercentage) / 100;
        } else if (selectedCode.discountType === 'amount') {
          discountAmount = selectedCode.discountAmount;
        }
        setTotalDiscount(discountAmount);
      }
    }
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleDiscountCodeChange = (e: any) => {
    setSelectedDiscountCode(e.target.value);
  };



  return (
    <div>
      <main>
        {/* <!-- breadcrumb area start --> */}
        <div className="breadcrumb-area">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="breadcrumb-wrap">
                  <nav aria-label="breadcrumb">
                    <ul className="breadcrumb">
                      <li className="breadcrumb-item">
                        <a href="/home">
                          <i className="fa fa-home"></i>
                        </a>
                      </li>
                      <li
                        className="breadcrumb-item active"
                        aria-current="page"
                      >
                        <a href="/cart">Giỏ hàng</a>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- breadcrumb area end --> */}

        <div
          className="shop-main-wrapper section-padding"
          style={{ paddingTop: "30px" }}
        >
          <div className="container">
            <div className="row">
              <div className="col-lg-8">
                <div className="sidebar-single">
                  <h5 className="sidebar-title">
                    <span>Sản phẩm của bạn</span>
                  </h5>
                  <Text
                    style={{
                      fontSize: "17px",
                      marginLeft: "12px",
                      marginBottom: "12px",
                      marginTop: "8px",
                    }}
                  >
                    Bạn đang có{" "}
                    <Text strong>
                      {data?.data?.products?.length || 0} sản phẩm
                    </Text>{" "}
                    trong giỏ hàng
                  </Text>
                  <div className="row">
                    <Table
                      dataSource={productsFormatted as any}
                      rowKey="key"
                      pagination={false}
                      className="cart-table"
                      rowSelection={rowSelection}
                    >
                      <Table.Column
                        title="Hình ảnh"
                        dataIndex="image"
                        key="image"
                        render={(images: string[]) => (
                          <img
                            src={images[0]}
                            alt="Product"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        )}
                      />
                      <Table.Column
                        title="Sản phẩm"
                        dataIndex="name"
                        key="name"
                        render={(_, record: any) => {
                          return (
                            <div>
                              <p>{record.name}</p>
                              <p>Size: {record.variant.sizeName}</p>
                            </div>
                          );
                        }}
                        width={100}
                      />
                      <Table.Column
                        title="Giá"
                        key="price"
                        render={(_, record: any) =>
                          formatPrice(record.variant.price)
                        }
                      />
                      <Table.Column
                        title="Số lượng"
                        dataIndex="quantity"
                        key="quantity"
                        render={(value, record: any) => (
                          <InputNumber
                            min={1}
                            value={value}
                            onChange={(quantity) =>
                              handleUpdateQuantity(record.variant._id, quantity)
                            }
                          />
                        )}
                      />
                      <Table.Column
                        title="Thành tiền"
                        dataIndex="totalPrice"
                        key="totalPrice"
                        render={(_, record: any) =>
                          formatPrice(record.variant.price * record.quantity)
                        }
                      />
                      <Table.Column
                        title="Hành động"
                        key="action"
                        render={(_, record: any) => (
                          <Popconfirm
                            title="Bạn có muốn xóa sản phẩm này khỏi giỏ hàng không?"
                            okText="Có"
                            cancelText="Không"
                            onConfirm={() =>
                              onDeleteProduct(record.variant._id)
                            }
                          >
                            <Button danger>Xóa</Button>
                          </Popconfirm>
                        )}
                      />
                    </Table>
                  </div>
                  <div style={{ marginTop: "20px" }}>
                    <Link to="/product">
                      <Button icon={<ArrowLeftOutlined />}>
                        Tiếp tục mua hàng
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="sidebar-single">
                  <h5 className="sidebar-title">
                    <span>Thông tin đơn hàng</span>
                  </h5>
                  {productSelected.length > 0 && (
                    <div style={{ marginTop: "20px" }}>
                      <h5>Sản phẩm đã chọn:</h5>
                      <Table
                        dataSource={productSelected}
                        rowKey="key"
                        pagination={false}
                        className="selected-products-table"
                        size="small"
                      >
                        <Table.Column
                          title="Hình ảnh"
                          dataIndex="image"
                          key="image"
                          render={(images: string[]) => (
                            <img
                              src={images[0]}
                              alt="Product"
                              style={{
                                width: "70%",
                                height: "70%",
                                objectFit: "cover",
                              }}
                            />
                          )}
                        />
                        <Table.Column
                          title="Tên sản phẩm"
                          dataIndex="name"
                          key="name"
                          render={(name, record: any) => (
                            <>
                              <p style={{ fontSize: "12px" }}>{name}</p>
                              <p style={{ fontSize: "12px" }}>
                                Size: {record.variant.sizeName}
                              </p>
                            </>
                          )}
                          width={100}
                        />
                        <Table.Column
                          title="Giá"
                          key="price"
                          render={(_, record: any) => (
                            <span style={{ fontSize: "12px" }}>
                              {formatPrice(record.variant.price)}
                            </span>
                          )}
                        />
                        <Table.Column
                          title="Số lượng"
                          dataIndex="quantity"
                          key="quantity"
                          render={(quantity) => (
                            <span style={{ fontSize: "12px" }}>{quantity}</span>
                          )}
                        />
                        <Table.Column
                          title="Thành tiền"
                          dataIndex="totalPrice"
                          key="totalPrice"
                          render={(_, record: any) => (
                            <span style={{ fontSize: "12px" }}>
                              {formatPrice(
                                record.variant.price * record.quantity
                              )}
                            </span>
                          )}
                        />
                      </Table>

                      <a onClick={showDiscountModal}>Sử dụng mã giảm giá</a>
                      {/* <span style={{float:"right"}}>- 10.000 VNĐ</span> */}
                      <Modal
                        title="Mã giảm giá"
                        visible={isModalVisible}
                        onOk={handleOk}
                        onCancel={handleCancel}
                      >
                        <Radio.Group onChange={handleDiscountCodeChange} value={selectedDiscountCode}>
                          {discountCodes.map((code: IVoucher) => (
                            <Card key={code._id}
                              style={{
                                marginBottom: 10,
                                opacity: code.minPurchaseAmount !== undefined && totalPrice >= code.minPurchaseAmount ? 1 : 0.5,
                                pointerEvents: code.minPurchaseAmount !== undefined && totalPrice >= code.minPurchaseAmount ? 'auto' : 'none'
                              }}>
                              <Radio value={code.code} className="discount-radio" disabled={totalPrice < !code.minPurchaseAmount}>
                                <strong className="discount-code">{code.code}</strong>
                                {code.discountType === 'percentage' ? (
                                  <span className="discount-detail"> - Giảm {code.discountPercentage}%</span>
                                ) : (
                                  <span className="discount-detail"> - Giảm {code.discountAmount} VNĐ</span>
                                )}
                                <span style={{ paddingLeft: 1 }} className="discount-detail"> (Đơn tối thiểu {code.minPurchaseAmount}đ)</span><br />
                                <span className="expiration-date">HSD: {dayjs(code.expirationDate).format('DD/MM/YYYY HH:mm:ss')}</span>
                              </Radio>
                            </Card>
                          ))}
                        </Radio.Group>
                      </Modal>

                      <div style={{ marginTop: "20px" }}>
                        {(selectedDiscountCode) ? (
                          <div className="d-flex justify-content-between">
                            <p>{selectedDiscountCode}</p>
                            <p>-{totalDiscount > 0 ? formatPrice(totalDiscount) : null}</p>
                          </div>
                        ) : (
                          null
                        )}
                      </div>

                    </div>
                  )}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "10px 20px",
                      borderTop: "1px solid gray",
                      marginTop: "20px",
                    }}
                  >
                    <span>Tổng tiền</span>
                    <Text style={{ fontWeight: 800, color: "red" }}>
                      {formatPrice(finalTotalPrice)}
                    </Text>
                  </div>
                  <Link to="/checkout">
                    <Button
                      type="primary"
                      style={{ float: "right" }}
                      disabled={!productSelected.length}
                    >
                      Thanh toán
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
