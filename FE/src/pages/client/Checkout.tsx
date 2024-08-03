/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMyCartQuery } from "../../hooks/useCart";
import { Typography, Modal, Radio, Card, Button } from "antd";
import { formatPrice } from "../../services/common/formatCurrency";
import { SubmitHandler, useForm } from "react-hook-form";
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
} from "../../store/cartSlice";
import { USER_INFO_STORAGE_KEY } from "../../services/constants";
import { useEffect, useState } from "react";
import { socket } from "../../socket";
import { IVoucher } from "../../interface/Voucher";
import dayjs from "dayjs";
import axios from "axios";
import "./checkout.css"
const SHIPPING_COST = 30000; 
// import { useLocation } from "react-router-dom";
const { Text } = Typography;

type Inputs = {
  customerName: string;
  address: string;
  phone: string;
  message: string;
  paymentMethod: string;
};

const Checkout = () => {
  // lấy thông tin user đăng nhập
  const isLogged = localStorage.getItem(USER_INFO_STORAGE_KEY);
  const user: IUser | null = isLogged ? JSON.parse(isLogged) : null;

  const dispatch = useDispatch();
  const productSelected: ICartItem[] = useSelector(selectProductSelected);
  const totalPrice = useSelector(selectTotalPrice);

  const { refetch } = useMyCartQuery();
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [discountCodes, setDiscountCodes] = useState([]);
  const [selectedDiscountCode, setSelectedDiscountCode] = useState(null);
  const [totalDiscount, setTotalDiscount] = useState(0);

  // initial socket
  useEffect(() => {
    const onHiddenProduct = (productId: string) => {
      dispatch(removeProduct(productId));
    };

    socket.on("hidden product", onHiddenProduct);

    return () => {
      socket.off("hidden product", onHiddenProduct);
    };
  }, [dispatch, navigate, productSelected.length]);

  useEffect(() => {
    if (!productSelected.length) {
      navigate(-1);
    }
  }, [navigate, productSelected.length]);

  const { register, handleSubmit } = useForm<Inputs>({
    defaultValues: {
      paymentMethod: "COD",
    },
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const productSelectedIds = productSelected.map((it) => it.variant._id);
      const res = await OrderApi.createOrder({
        ...data,
        productSelectedIds,
        shippingCost: SHIPPING_COST,
        discouVoucher: totalDiscount,
      });

      if (data?.paymentMethod === "COD") {
        createNewHistory(res.data.data._id, "1", user);
        toast.success("Đặt hàng thành công!");
        navigate("/");
        refetch();
      } else {
        window.location.href = res?.data?.paymentUrl;
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
    } catch (error) {
      toast.error("Tạo lịch sử thất bại");
    }
  };
  
const discountedPrice = totalPrice - totalDiscount;
const totalPriceWithShipping = discountedPrice + SHIPPING_COST;

  useEffect(() => {
    // Fetch mã giảm giá từ API
    axios
      .get("http://localhost:3001/api/discountCode/discountCodes")
      .then((response) => {
        setDiscountCodes(response.data);
      })
      .catch((error) => {
        console.error("Error fetching discount codes:", error);
      });
  }, []);

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
          discountAmount = (totalPrice * selectedCode.discountPercentage) / 100;
        } else if (selectedCode.discountType === "amount") {
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
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-5 mb-3">
          <h2>Thanh Toán Đơn Hàng</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label"></label>
              <input
                type="text"
                className="form-control"
                id="name"
                placeholder="Họ và tên"
                {...register("customerName", {
                  required: true,
                })}
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                id="number"
                placeholder="Số điện thoại"
                {...register("phone", {
                  required: true,
                })}
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                id="address"
                placeholder="Địa chỉ"
                {...register("address", {
                  required: true,
                })}
              />
            </div>

            <div className="md-3 ">
              <input
                type="text"
                className="form-control"
                id="city"
                placeholder="Ghi chú"
                {...register("message", {
                  required: true,
                })}
              />
            </div>
            <div className="fw-normal fs-5 mt-5">Phương thức thanh toán</div>
            <div className="d-flex flex-column md-3">
              <div className=" p-2 form-check ">
                <input
                  type="radio"
                  className="form-check-input"
                  value="COD"
                  {...register("paymentMethod")}
                />
                <label className="form-check-label">
                  Thanh toán sau khi nhận hàng
                </label>
              </div>
              <div className="p-2 form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  id="myCheckbox"
                  value="VNPAY"
                  {...register("paymentMethod")}
                />
                <label className="form-check-label" htmlFor="myCheckbox">
                  Thanh toán ngay
                </label>
              </div>
            </div>
            <hr />
            <div className="d-flex justify-content-between">
              <a href=""> Giỏ hàng</a>
              <button
                type="submit"
                className="btn btn-primary bg-warning px-4 py-3"
              >
                Hoàn tất đơn hàng
              </button>
            </div>
          </form>
        </div>
        <div className="col-md-7 bg-light">
          <h3 className="mt-2">Giỏ Hàng</h3>
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: 250 }}>Tên sản phẩm</th>
                {/* <th>ảnh</th> */}
                <th>Giá</th>
                <th>Số lượng</th>
                <th>Tổng tiền</th>
              </tr>
            </thead>
            <tbody>
              {productSelected?.map((item) => (
                <tr key={item._id}>
                  <td>
                    {item.product.name} (Size: {item.variant?.sizeName})
                  </td>
                  <td>{formatPrice(item.variant.price)}</td>
                  <td>{item.quantity}</td>
                  <td>{formatPrice(item.variant.price * item.quantity)}</td>
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
              marginTop: "20px",
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
              }}
            >
              Chọn mã giảm giá
            </span>
          </div>

          {/* <span style={{float:"right"}}>- 10.000 VNĐ</span> */}
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
              {discountCodes.map((code: IVoucher) => (
                <Card
                  key={code._id}
                  style={{
                    backgroundColor: "#66FF66",
                    marginBottom: 10,
                    opacity:
                      code.minPurchaseAmount !== undefined &&
                      totalPrice >= code.minPurchaseAmount
                        ? 1
                        : 0.5,
                    pointerEvents:
                      code.minPurchaseAmount !== undefined &&
                      totalPrice >= code.minPurchaseAmount
                        ? "auto"
                        : "none",
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
                      {dayjs(code.expirationDate).format("DD/MM/YYYY HH:mm:ss")}
                    </span>
                  </Radio>
                </Card>
              ))}
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
              <div className="d-flex justify-content-between">
                <p>{selectedDiscountCode}</p>
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
