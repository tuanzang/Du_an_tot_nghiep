/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMyCartQuery } from "../../hooks/useCart";
import { Typography, Modal, Radio, Card, Space } from "antd";
import { formatPrice } from "../../services/common/formatCurrency";
import OrderApi from "../../config/orderApi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { IHistoryBill } from "../../interface/HistoryBill";
import { IUser } from "../../interface/Users";
import { useDispatch, useSelector } from "react-redux";
import { ICartItem } from "./Cart";

import {
  removeProduct,
  selectProductSelected,
  selectTotalPrice,
  updateStatus,
} from "../../store/cartSlice";
import { USER_INFO_STORAGE_KEY } from "../../services/constants";
import { useEffect, useMemo, useState } from "react";
import { socket } from "../../socket";
import { IVoucher } from "../../interface/Voucher";
import dayjs from "dayjs";
import axios from "axios";
import "./checkout.css";
const SHIPPING_COST = 30000;
const { Text } = Typography;

interface IDataBill {
  customerName: string;
  phone: string;
  address: string;
  message: string;
  paymentMethod: string;
}

const Checkout = () => {
  // lấy thông tin user đăng nhập
  const isLogged = localStorage.getItem(USER_INFO_STORAGE_KEY);
  const user: IUser | null = isLogged ? JSON.parse(isLogged) : null;

  const [dataBill, setDataBill] = useState<IDataBill>({
    customerName: user ? user.name : "",
    phone: user ? user.phoneNumber : "",
    address: "",
    message: "",
    paymentMethod: "COD",
  });

  const { data, refetch: refetchCart } = useMyCartQuery();
  const dispatch = useDispatch();
  const productSelected: ICartItem[] = useSelector(selectProductSelected);
  const totalPrice = useSelector(selectTotalPrice);

  const { refetch } = useMyCartQuery();
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [discountCodes, setDiscountCodes] = useState<IVoucher[]>([]);
  const [selectedDiscountCode, setSelectedDiscountCode] = useState(null);
  const [totalDiscount, setTotalDiscount] = useState<number>(0);

  useEffect(() => {
    dispatch(
      updateStatus({
        prevData: productSelected,
        newData: data?.data?.products,
      })
    );
  }, [data]);

  useEffect(() => {
    dispatch(
      updateStatus({
        prevData: productSelected,
        newData: data?.data?.products,
      })
    );
  }, [data]);

  // initial socket
  useEffect(() => {
    const onHiddenProduct = (productId: string) => {
      dispatch(removeProduct(productId));
    };

    const onProductUpdate = () => {
      refetchCart();
      // console.log('client update', data);
    };

    const onUpdateVoucherQnt = (code: string) => {
      console.log("client update", code);
      fetchDiscountCode();
    };

    const onOptionUpdate = () => {
      navigate(-1);
    };

    socket.on("hidden product", onHiddenProduct);
    socket.on("update product", onProductUpdate);
    socket.on("update voucher", onUpdateVoucherQnt);
    socket.on("option update", onOptionUpdate);

    return () => {
      socket.off("hidden product", onHiddenProduct);
      socket.off("update product", onProductUpdate);
      socket.off("update voucher", onUpdateVoucherQnt);
      socket.off("option update", onOptionUpdate);
    };
  }, [dispatch, navigate, productSelected.length]);

  useEffect(() => {
    if (!productSelected.length) {
      navigate(-1);
    }
  }, [navigate, productSelected.length]);

  const handleCreateBill = async (
    dataBill: IDataBill,
    productSelected: ICartItem[],
    SHIPPING_COST: number,
    totalDiscount: number
  ) => {
    try {
      const productSelectedIds = productSelected.map((it) => it.variant._id);
      const res = await OrderApi.createOrder({
        ...dataBill,
        productSelectedIds,
        shippingCost: SHIPPING_COST,
        discouVoucher: totalDiscount,
        discountCode: selectedDiscountCode,
      });
      console.log(res);

      if (res.data.success === false) {
        toast.error(res.data.message);
      }

      if (selectedDiscountCode) {
        socket.emit("update voucher", selectedDiscountCode);
      }

      if (selectedDiscountCode) {
        socket.emit("update voucher quantity", selectedDiscountCode);
      }

      if (data?.paymentMethod === "COD") {
        createNewHistory(res.data.data._id, "1", user);
        toast.success("Đặt hàng thành công!");
        navigate("/");
        refetch();
      } else {
        if (dataBill?.paymentMethod === "COD") {
          createNewHistory(res.data.data._id, "1", user);
          navigate("/");
          refetch();
        } else {
          window.location.href = res?.data?.paymentUrl;
        }
      }
    } catch (error) {
      toast.error("Đặt hàng thất bại!");
    }
  };

  const createNewHistory = async (
    idBill: string | null,
    statusBill: string | null,
    user: IUser | null
  ) => {
    if (idBill === null || statusBill === null || user === null) {
      toast.warning("Không thể tạo lịch sử đơn hàng!");
      return;
    }
    const dataHistoryBill: IHistoryBill = {
      _id: null,
      idUser: user._id,
      idBill: idBill,
      creator: user.name,
      role: user.role,
      statusBill: statusBill,
      note: "",
      createdAt: null,
    };

    try {
      // Gửi yêu cầu tạo lịch sử
      await axios.post(
        "http://localhost:3001/api//history-bill/add",
        dataHistoryBill
      );
      toast.success("Đặt hàng thành công!");
    } catch (error) {
      toast.error("Tạo lịch sử thất bại");
    }
  };

  const discountedPrice = useMemo(() => {
    const discountedPrice = totalPrice - totalDiscount;
    return discountedPrice < 0 ? 0 : discountedPrice;
  }, [totalPrice, totalDiscount]);

  const totalPriceWithShipping = discountedPrice + SHIPPING_COST;

  useEffect(() => {
    fetchDiscountCode();
  }, []);

  const fetchDiscountCode = () => {
    axios
      .get("http://localhost:3001/api/discountCode/discountCodes")
      .then((response) => {
        setDiscountCodes(response.data);
      })
      .catch((error) => {
        console.error("Error fetching discount codes:", error);
      });
  };

  const showDiscountModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    if (selectedDiscountCode) {
      const selectedCode = discountCodes.find(
        (code) => code.code === selectedDiscountCode
      );
      if (selectedCode) {
        let discountAmount = 0;
        if (selectedCode.discountType === "percentage") {
          discountAmount = Number(
            (totalPrice * Number(selectedCode.discountPercentage)) / 100
          );
        } else if (selectedCode.discountType === "amount") {
          discountAmount = Number(selectedCode.discountAmount);
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

  const handleCheckout = () => {
    if (
      !dataBill.customerName ||
      !dataBill.phone ||
      !dataBill.address ||
      !dataBill.message
    )
      return;

    handleCreateBill(dataBill, productSelected, SHIPPING_COST, totalDiscount);
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-5 mb-3">
          <h2>Thanh Toán Đơn Hàng</h2>
          <div className="mb-3">
            <label htmlFor="email" className="form-label"></label>
            <input
              type="text"
              className="form-control"
              id="customerName"
              placeholder="Họ và tên"
              value={dataBill.customerName}
              onChange={(e) =>
                setDataBill({ ...dataBill, customerName: e.target.value })
              }
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              id="number"
              placeholder="Số điện thoại"
              value={dataBill.phone}
              onChange={(e) =>
                setDataBill({ ...dataBill, phone: e.target.value })
              }
            />
          </div>

          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              id="address"
              placeholder="Địa chỉ"
              value={dataBill.address}
              onChange={(e) =>
                setDataBill({ ...dataBill, address: e.target.value })
              }
            />
          </div>

          <div className="md-3 ">
            <input
              type="text"
              className="form-control"
              id="city"
              placeholder="Ghi chú"
              value={dataBill.message}
              onChange={(e) =>
                setDataBill({ ...dataBill, message: e.target.value })
              }
            />
          </div>
          <div className="fw-normal fs-5 mt-5">Phương thức thanh toán</div>
          <div className="d-flex flex-column md-3">
            <div className=" p-2 form-check ">
              <Radio.Group
                onChange={(e) =>
                  setDataBill({ ...dataBill, paymentMethod: e.target.value })
                }
                value={dataBill.paymentMethod}
              >
                <Space direction="vertical">
                  <Radio value={"COD"}>Thanh toán sau khi nhận hàng</Radio>
                  <Radio value={"VNPAY"}>Thanh toán ngay</Radio>
                </Space>
              </Radio.Group>
            </div>
          </div>
          <hr />
          <div className="d-flex justify-content-between">
            <a href=""> Giỏ hàng</a>
            <button
              type="submit"
              className="btn btn-primary bg-warning px-4 py-3"
              onClick={handleCheckout}
              disabled={!productSelected.every((item) => item.variant.status)}
              style={{
                opacity: productSelected.every((item) => item.variant.status)
                  ? 1
                  : 0.5,
              }}
            >
              Hoàn tất đơn hàng
            </button>
          </div>
        </div>
        <div className="col-md-7 bg-light">
          <h3 className="mt-2">Giỏ Hàng</h3>
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: 180 }}>Tên sản phẩm</th>
                {/* <th>ảnh</th> */}
                <th>Giá</th>
                <th>Số lượng</th>
                <th>Option</th>
                <th>Tổng tiền</th>
              </tr>
            </thead>
            <tbody>
              {productSelected?.map((item: ICartItem) => (
                <tr
                  key={item._id}
                  style={{ opacity: item.variant.status ? 1 : 0.5 }}
                >
                  <td>
                    {item.product.name} (Size: {item.variant?.sizeName})
                    {/* {item.variant.status} */}
                    {!item.variant.status && (
                      <p className="out-of-stock-text">
                        Sản phẩm đang ngừng hoạt động
                      </p>
                    )}
                  </td>
                  <td>{formatPrice(item.variant.price)}</td>
                  <td>{item.quantity}</td>

                  <td>
                    {item.option?.name}
                    <br />
                    {item.option?.price}
                  </td>
                  <td>{formatPrice(totalPrice)}</td>
                  {/* <td> {formatPrice(SHIPPING_COST)}</td> */}
                </tr>
              ))}
            </tbody>
          </table>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px 20px",
              borderTop: "1px solid gray",
              marginTop: "20px",
            }}
          >
            <span>Tổng tiền:</span>
            <Text
              style={{
                fontSize: "18px",
                fontWeight: 800,
                color: "red",
                fontFamily: "SpaceGrotesk-Light",
              }}
            >
              {formatPrice(totalPrice)}
            </Text>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px 20px",
              borderTop: "1px solid gray",
              marginTop: "20px",
            }}
          >
            <span>Phí ship:</span>
            <Text
              style={{
                fontWeight: 800,
                color: "red",
                fontFamily: "SpaceGrotesk-Light",
                fontSize: "18px",
              }}
            >
              {formatPrice(SHIPPING_COST)}
            </Text>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "10px",
            }}
          >
            <span
              onClick={showDiscountModal}
              style={{
                cursor: "pointer",
                color: "#BEAC83",
                fontWeight: "bold",
                fontSize: "15px",
                border: "2px solid #BEAC83",
                borderRadius: "5px",
                padding: "5px 10px",
                boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                margin: "0 0 5px 5px",
                opacity: productSelected.every((item) => item.variant.status)
                  ? 1
                  : 0.5,
                pointerEvents: productSelected.every(
                  (item) => item.variant.status
                )
                  ? "auto"
                  : "none",
              }}
            >
              Chọn mã giảm giá
            </span>
          </div>

          <Modal
            title="Mã giảm giá"
            visible={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
          >
            <Radio.Group
              onChange={handleDiscountCodeChange}
              value={selectedDiscountCode}
            >
              {discountCodes.map((code: IVoucher) => {
                const isDisable = !code.minPurchaseAmount ||
                totalPrice < code.minPurchaseAmount ||
                (user && code.userIds.includes(user?._id)) ||
                code.quantity === code.usedCount ||
                code.status === 'inactive';
                
                // Nếu số lượng bằng số lượng đã sử dụng, bỏ tick radio
                if (code.quantity === code.usedCount && selectedDiscountCode === code.code) {
                  setSelectedDiscountCode(null);
                }

              

                return <Card
                  key={code._id}
                  style={{
                    backgroundColor: "#66FF66",
                    marginBottom: 10,
                    opacity:
                      isDisable ? 0.5 : 1,
                    pointerEvents:
                      isDisable ? 'none' : 'auto',
                  }}
                >
                  <Radio
                    value={code.code}
                    className="discount-radio"
                    disabled={totalPrice < !code.minPurchaseAmount}
                  >
                    <strong className="discount-code">{code.code}</strong>
                      {code.discountType === "percentage" ? (
                        <span className="discount-detail">
                          {" "}
                          - Giảm {code.discountPercentage}%
                        </span>
                      ) : (
                        <span className="discount-detail">
                          {" "}
                          - Giảm {code.discountAmount} VNĐ
                        </span>
                      )}
                      <span
                        style={{ paddingLeft: 1 }}
                        className="discount-detail"
                      >
                        {" "}
                        (Đơn tối thiểu {code.minPurchaseAmount}đ)
                      </span>
                      <br />
                      <span className="expiration-date">
                        HSD:{" "}
                        {dayjs(code.expirationDate).format(
                          "DD/MM/YYYY HH:mm:ss"
                        )}
                      </span>
                    </Radio>
                  </Card>
              })}
            </Radio.Group>
          </Modal>

          <div
            style={{
              fontWeight: 800,
              color: "red",
              fontFamily: "SpaceGrotesk-Light",
            }}
          >
            {selectedDiscountCode ? (
              <div className="d-flex justify-content-between px-3">
                <p
                  style={{
                    opacity: productSelected.every(
                      (item) => item.variant.status
                    )
                      ? 1
                      : 0.5,
                  }}
                >
                  {selectedDiscountCode}
                </p>
                <p>- {totalDiscount > 0 ? formatPrice(totalDiscount) : null}</p>
              </div>
            ) : null}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px 20px",
              borderTop: "1px solid gray",
              marginTop: "20px",
            }}
          >
            <span>Tổng thanh toán: </span>
            <Text
              style={{
                fontWeight: 800,
                color: "red",
                fontFamily: "SpaceGrotesk-Light",
                fontSize: "18px",
              }}
            >
              {formatPrice(totalPriceWithShipping)}
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;