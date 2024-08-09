/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams } from "react-router-dom";
import {
  Button,
  Card,
  Col,
  Divider,
  Input,
  Radio,
  Row,
  Space,
  Spin,
  Table,
  Tag,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import confirmStatus from "./confirmStatus";
import DialogAddUpdate from "./DialogAddUpdateProps ";
import axios from "axios";
import BreadcrumbsCustom from "../../../components/BreadcrumbsCustom";
import TimeLine from "./TimeLine";
import BillHistoryDialog from "./BillHistoryDialog";
import statusHoaDon from "../../../services/constants/statusHoaDon";
import AdBillTransaction from "./AdBillTransaction";
import formatCurrency from "../../../services/common/formatCurrency";
import { toast } from "react-toastify";
import { IUser } from "../../../interface/Users";
import { IHistoryBill } from "../../../interface/HistoryBill";
import { ITransaction } from "../../../interface/Transaction";
import styleHoaDon from "../../../services/constants/styleHoaDon";
import "./BillStyle.css";
import { IBill, IProductBill } from "../../../interface/Bill";
import { USER_INFO_STORAGE_KEY } from "../../../services/constants";
import dayjs from "dayjs";
import { socket } from "../../../socket";

interface IProductSizeBill {
  variantId: string;
  quantity: number;
}

const listHis = [{ link: "/admin/bill", name: "Quản lý đơn hàng" }];
export default function BillDetail() {
  // lấy thông tin user đăng nhập
  const isLogged = localStorage.getItem(USER_INFO_STORAGE_KEY);
  const user: IUser | null = isLogged ? JSON.parse(isLogged) : null;

  // api
  const { id } = useParams();
  const [idCustomer, setIdCustomer] = useState<string | null>(null);
  const [statusBill, setStatusBill] = useState<string>("");
  const [statusShip, setStatusShip] = useState<boolean | null>(null);

  // lấy ra hóa đơn
  const [totalProductPrice, setTotalProductPrice] = useState<number>(0);
  const [loadingBill, setLoadingBill] = useState(true);
  const [listProductSize, setListProductSize] = useState<IProductSizeBill[]>(
    []
  );
  const [billDetail, setBillDetail] = useState<IBill>();
  const fetchDetailBill = async (id: string | null) => {
    setLoadingBill(true);
    if (id === null) {
      toast.error("Không tìm thấy hóa đơn");
    } else {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/bills/${id}`
        );
        const billData = response.data?.data;

        if (billData) {
          setBillDetail(billData);
          setIdCustomer(billData.userId);
          setStatusBill(billData.status);
          setStatusShip(billData.statusShip);
          // Trích xuất variantId và quantity từ products
          const productSizes = billData.products.map(
            (product: IProductSizeBill) => ({
              variantId: product.variantId,
              quantity: product.quantity,
            })
          );
          setListProductSize(productSizes);
          // lấy ra tổng tiền hàng
          const totalProductPrice = billData.products.reduce(
            (total: number, product: IProductBill) =>
              total + (product.price + product.optionPrice) * product.quantity,
            0
          );
          setTotalProductPrice(totalProductPrice);
        }
      } catch (error) {
        toast.error("Không tìm thấy hóa đơn");
      }
    }
    setLoadingBill(false);
  };

  // lịch sử thành toán
  const [loadingTransBill, setLoadingTransBill] = useState(true);
  const [listTransaction, setListTransaction] = useState<ITransaction[]>([]);
  const getTransBillByIdBill = async (idBill: string | null) => {
    setLoadingTransBill(true);
    if (idBill === null) {
      toast.error("Không tìm thấy lịch sử thanh toán");
    } else {
      try {
        const response = await axios.post("http://localhost:3001/api/trans", {
          idBill: idBill,
        });
        setListTransaction(response.data?.data);
      } catch (error) {
        toast.error("Đơn hàng chưa có lịch sử thanh toán");
      }
    }
    setLoadingTransBill(false);
  };

  // tạo lich sử đơn hàng
  const [loadingHistory, setLoadingHistory] = useState(true);
  const createNewHistory = async (bill: IBill, user: IUser, note: string) => {
    setLoadingHistory(true);
    if (!bill || !user) {
      toast.warning("Không thể tạo lịch sử đơn hàng!");
      return;
    }
    const dataHistoryBill: IHistoryBill = {
      _id: null,
      idUser: user._id,
      idBill: bill._id,
      creator: user.name,
      role: user.role,
      statusBill: bill.status,
      note: note,
      createdAt: "",
    };

    try {
      // Gửi yêu cầu tạo lịch sử
      await axios.post(
        "http://localhost:3001/api//history-bill/add",
        dataHistoryBill
      );
      getBillHistoryByIdBill(bill._id);
    } catch (error) {
      toast.error("Tạo lịch sử thất bại");
    }
    setLoadingHistory(false);
  };

  // lấy lịch sử đơn hàng
  const [listHistoryBill, setListHistoryBill] = useState<IHistoryBill[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const getBillHistoryByIdBill = async (idBill: string | null) => {
    setLoadingHistory(true);
    if (idBill === null) {
      toast.error("Không tìm thấy lịch sử đơn hàng");
    } else {
      try {
        const response = await axios.post(
          "http://localhost:3001/api/history-bill",
          {
            idBill: idBill,
          }
        );
        setListHistoryBill(response.data?.data);
      } catch (error) {
        toast.error("Đơn hàng chưa có lịch sử");
      }
    }
    setLoadingHistory(false);
  };

  // lấy thông tin người đặt hàng
  const [customer, setCustomer] = useState<IUser>();
  const findUserById = async (idCustomer: string | null) => {
    if (idCustomer === null) {
      toast.error("Không tìm thấy thông tin người đặt hàng");
    } else {
      try {
        const response = await axios.post(
          "http://localhost:3001/api/users/findUserById",
          { _id: idCustomer }
        );
        setCustomer(response.data?.data);
      } catch (error) {
        console.log("Khong co du lieu");
      }
    }
  };

  // useEffect
  useEffect(() => {
    fetchDetailBill(id ? id : null);
    getBillHistoryByIdBill(id ? id : null);
    if (idCustomer !== null) {
      findUserById(idCustomer);
    }
    getTransBillByIdBill(id ? id : null);
  }, [id, idCustomer]);

  // cập nhật trạng thái hóa đơn
  const handleUpdateStatusBill = async (
    id: string | null,
    status: string,
    user: IUser | null,
    note: string,
    statusShip: boolean | null
  ) => {
    setLoadingBill(true);
    if (id === null || user === null || statusShip === null) {
      toast.error("Không tìm thấy hóa đơn");
    } else {
      try {
        const response = await axios.post(
          "http://localhost:3001/api/bills/update-status",
          { id: id, status: status, statusShip: statusShip }
        );
        createNewHistory(response.data.data, user, note);
        setStatusBill(status);
      } catch (error) {
        toast.error("Không tìm thấy hóa đơn");
      }
    }
    setLoadingBill(false);
  };

  // State variables for controlling modal visibility
  const [openModalCancelBill, setOpenModalCancelBill] = useState(false); // hủy đơn
  const [openModalReturnBill, setOpenModalReturnBill] = useState(false); // hoàn đơn
  const [openModalConfirm, setOpenModalConfirm] = useState(false); // xác nhận đơn
  const [openModalPendingShip, setOpenModalPendingShip] = useState(false); // đóng gói chờ vận chuyển
  const [openModalDelive, setOpenModalDelive] = useState(false); // đang giao hàng
  const [openModalReceived, setOpenModalReceived] = useState(false); // đã giao hàng
  const [openModalPendingPayment, setOpenModalPendingPayment] = useState(false); // chờ thanh toán
  const [openModalPayment, setOpenModalPayment] = useState(false); // đã thanh toán
  const [openModalComplete, setOpenModalComplete] = useState(false); // hoàn thành

  // hủy đơn hàng
  function ModalCancelBill() {
    const [ghiChu, setGhiChu] = useState("");
    const [errorGhiChu, setErrorGhiChu] = useState("");

    // API hủy đơn hàng
    const cancelBill = async () => {
      if (ghiChu === "") {
        setErrorGhiChu("Bạn cần nhập lý do");
        return;
      }
      confirmStatus({ title: "Xác nhận", text: "Xác nhận hủy hoá đơn?" }).then(
        (result) => {
          if (result) {
            if (listProductSize.length < 1) {
              toast.error("Không thể hủy hoá đơn!");
            } else {
              // cập nhật trạng thái
              if (statusBill === "2" || statusBill === "3") {
                handleIncreaseProductSizeAndOption(listProductSize);
              }
              handleUpdateStatusBill(
                id ? id : null,
                "0",
                user ? user : null,
                ghiChu,
                statusShip
              );
              toast.success("Hủy đơn hàng thành công!");
              setOpenModalCancelBill(false);
            }
          }
        }
      );
    };
  
    return (
      <DialogAddUpdate
        open={openModalCancelBill}
        setOpen={setOpenModalCancelBill}
        title={"Huỷ đơn hàng"}
        buttonSubmit={
          <Button
            style={{
              boxShadow: "none",
              textTransform: "none",
              borderRadius: "8px",
            }}
            onClick={cancelBill}
          >
            Lưu
          </Button>
        }
      >
        <div>
          <Input
            size="small"
            placeholder="Ghi chú"
            value={ghiChu}
            onChange={(e) => setGhiChu(e.target.value)}
          />
        </div>
        <div>
          {errorGhiChu !== "" && (
            <span style={{ color: "red" }}>{errorGhiChu}</span>
          )}
        </div>
      </DialogAddUpdate>
    );
  }

  // tăng số lượng product size và option
  const handleIncreaseProductSizeAndOption = async (
    listProductSize: IProductSizeBill[]
  ) => {
    if (listProductSize.length < 1) {
      toast.error("Không thể hủy đơn hàng");
    } else {
      try {
        await axios.post(
          "http://localhost:3001/api/bills/increase-product-size",
          { listProductSize: listProductSize }
        );
      } catch (error) {
        toast.error("Không thể hủy đơn hàng");
      }
    }
  };

  // cập nhật trạng thái hóa đơn
  const handleUpdateStatusBill = async (
    id: string | null,
    status: string,
    user: IUser | null,
    note: string,
    statusShip: boolean | null
  ) => {
    setLoadingBill(true);
    if (id === null || user === null || statusShip === null) {
      toast.error("Không tìm thấy hóa đơn");
    } else {
      try {
        const response = await axios.post(
          "http://localhost:3001/api/bills/update-status",
          { id: id, status: status, statusShip: statusShip }
        );
        createNewHistory(response.data.data, user, note);
        setStatusBill(status);

        if (status === '0') {
          socket.emit('update voucher');
        }
      } catch (error) {
        toast.error("Không tìm thấy hóa đơn");

  // hoàn đơn hàng
  function ModalReturnBill() {
    const [ghiChu, setGhiChu] = useState("");
    const [errorGhiChu, setErrorGhiChu] = useState("");
    const [statusShip, setStatusShip] = useState<boolean | null>(null);
    const [errorStatusShip, setErrorStatusShip] = useState("");

    // API hoàn đơn hàng
    const returnBill = async () => {
      if (ghiChu === "") {
        setErrorGhiChu("Bạn cần nhập lý do");
        return;

      }
      if (statusShip !== true && statusShip !== false) {
        setErrorStatusShip("Bạn chọn loại phí ship");
        return;
      }
      confirmStatus({ title: "Xác nhận", text: "Xác nhận hoàn hoá đơn?" }).then(
        (result) => {
          if (result) {
            if (listProductSize.length < 1) {
              toast.error("Không thể hoàn hoá đơn!");
            } else {
              handleIncreaseProductSizeAndOption(listProductSize);
              // cập nhật trạng thái
              handleUpdateStatusBill(
                id ? id : null,
                "8",
                user ? user : null,
                ghiChu,
                statusShip
              );
              toast.success("Hoàn đơn hàng thành công!");
              setOpenModalReturnBill(false);
            }
          }
        }
      );
    };

    return (
      <DialogAddUpdate
        open={openModalReturnBill}
        setOpen={setOpenModalReturnBill}
        title={"Hoàn đơn hàng"}
        buttonSubmit={
          <Button
            style={{
              boxShadow: "none",
              textTransform: "none",
              borderRadius: "8px",
            }}
            onClick={returnBill}
          >
            Lưu
          </Button>
        }
      >
        <div>
          <Input
            size="small"
            placeholder="Ghi chú"
            value={ghiChu}
            onChange={(e) => setGhiChu(e.target.value)}
            style={{ marginBottom: "10px" }}
          />
        </div>
        <div>
          {errorGhiChu !== "" && (
            <span style={{ color: "red" }}>{errorGhiChu}</span>
          )}
        </div>
        <div>
          <span
            style={{ fontSize: "17px", fontWeight: "600", marginRight: "5px" }}
          >
            Phí ship:
          </span>

          <Radio.Group
            onChange={(e) => setStatusShip(e.target.value)}
            value={statusShip}
          >
            <Radio value={false}>Chưa gửi</Radio>
            <Radio value={true}>Đã gửi</Radio>
          </Radio.Group>
        </div>
        <div>
          {errorStatusShip !== "" && (
            <span style={{ color: "red" }}>{errorStatusShip}</span>
          )}
        </div>
      </DialogAddUpdate>
    );
  }

  // xác nhận đơn hàng
  function ModalConfirmBill() {
    const [ghiChu, setGhiChu] = useState("");

    const handleConfirmOrder = () => {
      confirmStatus({ title: "Xác nhận", text: "Xác nhận hoá đơn?" }).then(
        (result) => {
          if (result) {
            if (listProductSize.length < 1) {
              toast.error("Không thể xác nhận đơn hàng!");
            } else {
              handleUpdateStatusBill(
                id ? id : null,
                "2",
                user ? user : null,
                ghiChu,
                statusShip
              );
              handleDecreaseProductSizeAndOption(listProductSize);
              toast.success("Xác nhận đơn hàng thành công!");
              setOpenModalConfirm(false);
            }
          }
        }
      );
    };

    return (
      <DialogAddUpdate
        open={openModalConfirm}
        setOpen={setOpenModalConfirm}
        title={"Xác nhận hoá đơn"}
        buttonSubmit={
          <Button
            style={{
              boxShadow: "none",
              textTransform: "none",
              borderRadius: "8px",
            }}
            onClick={handleConfirmOrder}
          >
            Lưu
          </Button>
        }
      >
        <div>
          <Input
            size="small"
            placeholder="Ghi chú"
            value={ghiChu}
            onChange={(e) => setGhiChu(e.target.value)}
          />
        </div>
      </DialogAddUpdate>
    );
  }

  // giảm số lượng product size và option
  const handleDecreaseProductSizeAndOption = async (
    listProductSize: IProductSizeBill[]
  ) => {
    if (listProductSize.length < 1) {
      toast.error("Không thể xác nhận đơn hàng");
    } else {
      try {
        await axios.post("http://localhost:3001/api/bills/decrease-data", {
          listProductSize: listProductSize,
        });
      } catch (error) {
        toast.error("Không thể xác nhận đơn hàng");
      }
    }
  };

  // xác nhận đóng gói & vận chuyển
  function ModalPendingShip() {
    const [ghiChu, setGhiChu] = useState("");
    const handleConfirmDelever = () => {
      confirmStatus({
        title: "Xác nhận",
        text: "Xác nhận đóng gói & vận chuyển?",
      }).then((result) => {
        if (result) {
          handleUpdateStatusBill(
            id ? id : null,
            "3",
            user ? user : null,
            ghiChu,
            statusShip
          );
          toast.success("Xác nhận đóng gói & vận chuyển thành công!");
          setOpenModalPendingShip(false);
        }
      });
    };
    return (
      <DialogAddUpdate
        open={openModalPendingShip}
        setOpen={setOpenModalPendingShip}
        title={"Xác nhận đóng gói & vận chuyển"}
        buttonSubmit={
          <Button
            style={{
              boxShadow: "none",
              textTransform: "none",
              borderRadius: "8px",
            }}
            onClick={handleConfirmDelever}
          >
            Lưu
          </Button>
        }
      >
        <div>
          <Input
            size="small"
            placeholder="Ghi chú"
            value={ghiChu}
            onChange={(e) => setGhiChu(e.target.value)}
          />
        </div>
      </DialogAddUpdate>
    );
  }

  // xác nhận đang giao hàng
  function ModalConfirmDelive() {
    const [ghiChu, setGhiChu] = useState("");
    const handleConfirmReceived = () => {
      confirmStatus({
        title: "Xác nhận",
        text: "Xác nhận đang giao hàng?",
      }).then((result) => {
        if (result) {
          handleUpdateStatusBill(
            id ? id : null,
            "4",
            user ? user : null,
            ghiChu,
            statusShip
          );
          toast.success("Xác nhận đang giao hàng!");
          setOpenModalDelive(false);
        }
      });
    };

    return (
      <DialogAddUpdate
        open={openModalDelive}
        setOpen={setOpenModalDelive}
        title={"Xác nhận đang giao hàng"}
        buttonSubmit={
          <Button
            style={{
              boxShadow: "none",
              textTransform: "none",
              borderRadius: "8px",
            }}
            onClick={handleConfirmReceived}
          >
            Lưu
          </Button>
        }
      >
        <div>
          <Input
            size="small"
            placeholder="Ghi chú"
            value={ghiChu}
            onChange={(e) => setGhiChu(e.target.value)}
          />
        </div>
      </DialogAddUpdate>
    );
  }

  // xác nhận đã giao hàng
  function ModalConfirmReceived() {
    const [ghiChu, setGhiChu] = useState("");
    const handleConfirmReceived = () => {
      confirmStatus({
        title: "Xác nhận",
        text: "Xác nhận đã giao hàng?",
      }).then((result) => {
        if (result) {
          handleUpdateStatusBill(
            id ? id : null,
            "5",
            user ? user : null,
            ghiChu,
            statusShip
          );
          toast.success("Xác nhận đã giao hàng!");
          setOpenModalReceived(false);
        }
      });
    };

    return (
      <DialogAddUpdate
        open={openModalReceived}
        setOpen={setOpenModalReceived}
        title={"Xác nhận đã giao hàng"}
        buttonSubmit={
          <Button
            style={{
              boxShadow: "none",
              textTransform: "none",
              borderRadius: "8px",
            }}
            onClick={handleConfirmReceived}
          >
            Lưu
          </Button>
        }
      >
        <div>
          <Input
            size="small"
            placeholder="Ghi chú"
            value={ghiChu}
            onChange={(e) => setGhiChu(e.target.value)}
          />
        </div>
      </DialogAddUpdate>
    );
  }

  // xác nhận chờ thanh toán
  function ModalConfirmPendingPayment() {
    const [ghiChu, setGhiChu] = useState("");
    const handlePendingPayment = () => {
      confirmStatus({
        title: "Xác nhận",
        text: "Xác nhận chờ thanh toán?",
      }).then((result) => {
        if (result) {
          handleUpdateStatusBill(
            id ? id : null,
            "6",
            user ? user : null,
            ghiChu,
            statusShip
          );
          toast.success("Xác nhận chờ thanh toán!");
          setOpenModalPendingPayment(false);
        }
      });
    };

    return (
      <DialogAddUpdate
        open={openModalPendingPayment}
        setOpen={setOpenModalPendingPayment}
        title={"Xác nhận chờ thanh toán"}
        buttonSubmit={
          <Button
            style={{
              boxShadow: "none",
              textTransform: "none",
              borderRadius: "8px",
            }}
            onClick={handlePendingPayment}
          >
            Lưu
          </Button>
        }
      >
        <div>
          <Input
            size="small"
            placeholder="Ghi chú"
            value={ghiChu}
            onChange={(e) => setGhiChu(e.target.value)}
          />
        </div>
      </DialogAddUpdate>
    );
  }

  // xác nhận thanh toán
  function ModalConfirmPayment() {
    const [ghiChu, setGhiChu] = useState("");
    const [transCode, setTransCode] = useState("");
    const [type, setType] = useState(true);

    const handlePayment = async () => {
      setLoadingTransBill(true);
      if (!billDetail || !user) {
        toast.error("Không thể nhận hàng");
        return;
      }

      // cập nhật trạng thái
      handleUpdateStatusBill(billDetail._id, "7", user, ghiChu, statusShip);
      if (listTransaction.filter((trans) => trans.status === true).length > 0) {
        toast.success("nhận hàng thành công");
        setOpenModalPayment(false);
      } else {
        const confirmPaymentRequest: ITransaction = {
          _id: null,
          idUser: user._id,
          idBill: billDetail._id,
          transCode: transCode,
          type: type,
          totalMoney: billDetail.totalPrice,
          note: ghiChu,
          status: true,
          createdAt: "",
        };

        // xác nhận nhận hàng
        try {
          await axios.post(
            "http://localhost:3001/api/trans/add",
            confirmPaymentRequest
          );
          getTransBillByIdBill(billDetail._id);
          // cập nhật trạng thái
          toast.success("nhận hàng thành công");
          setOpenModalPayment(false);
        } catch (error) {
          toast.error("nhận hàng thất bại");
          setOpenModalPayment(false);
        }
      }
      setLoadingTransBill(false);
    };

    return (
      <DialogAddUpdate
        open={openModalPayment}
        setOpen={setOpenModalPayment}
        title={"Xác nhận thanh toán"}
        buttonSubmit={
          <Button
            style={{
              boxShadow: "none",
              textTransform: "none",
              borderRadius: "8px",
            }}
            onClick={handlePayment}
          >
            Lưu
          </Button>
        }
      >
        <div>
          {listTransaction.filter((trans) => trans.status === true).length <
            1 && (
            <div>
              <Typography.Text strong>
                Tổng tiền hóa đơn <span style={{ color: "red" }}>*</span>
              </Typography.Text>
              <Input
                size="small"
                value={
                  billDetail
                    ? formatCurrency({ money: String(billDetail.totalPrice) })
                    : formatCurrency({ money: "0" })
                }
                disabled
                style={{ marginTop: "5px", marginBottom: "10px" }}
              />

              <Typography.Text strong>
                Tiền khách trả <span style={{ color: "red" }}>*</span>
              </Typography.Text>
              <Input
                size="small"
                value={
                  billDetail
                    ? formatCurrency({ money: String(billDetail.totalPrice) })
                    : formatCurrency({ money: "0" })
                }
                disabled
                style={{ marginTop: "5px", marginBottom: "10px" }}
              />

              <Typography.Text strong>
                Loại thanh toán <span style={{ color: "red" }}>*</span>
              </Typography.Text>
              <Radio.Group
                style={{
                  marginLeft: "30px",
                  marginTop: "5px",
                  marginBottom: "10px",
                }}
                onChange={(e) => setType(e.target.value)}
                value={type}
              >
                <Radio value={true}>Tiền mặt</Radio>
                <Radio value={false}>Chuyển khoản</Radio>
              </Radio.Group>
            </div>
          )}
          {type === false && (
            <div>
              <Typography.Text strong>
                Mã giao dịch <span style={{ color: "red" }}>*</span>
              </Typography.Text>
              <Input
                size="small"
                value={transCode}
                onChange={(e) => {
                  setTransCode(e.target.value);
                }}
              />
            </div>
          )}
          <Typography.Text strong>Ghi chú</Typography.Text>
          <Input
            size="small"
            value={ghiChu}
            onChange={(e) => setGhiChu(e.target.value)}
            style={{ marginTop: "5px", marginBottom: "10px" }}
            required
          />
        </div>
      </DialogAddUpdate>
    );
  }

  // hoàn thành
  function ModalConfirmComplete() {
    const [ghiChu, setGhiChu] = useState("");
    const handleConfirmComplete = () => {
      confirmStatus({
        title: "Xác nhận",
        text: "Xác nhận hoàn thành đơn hàng ?",
      }).then((result) => {
        if (result) {
          handleUpdateStatusBill(
            id ? id : null,
            "8",
            user ? user : null,
            ghiChu,
            statusShip
          );
          toast.success("Xác nhận hoàn thành đơn hàng thành công!");
          setOpenModalComplete(false);
        }
      });
    };

    return (
      <DialogAddUpdate
        open={openModalComplete}
        setOpen={setOpenModalComplete}
        title={"Xác nhận hoàn thành đơn hàng"}
        buttonSubmit={
          <Button
            style={{
              boxShadow: "none",
              textTransform: "none",
              borderRadius: "8px",
            }}
            onClick={handleConfirmComplete}
          >
            Lưu
          </Button>
        }
      >
        <div>
          <Input
            size="small"
            placeholder="Ghi chú"
            value={ghiChu}
            onChange={(e) => setGhiChu(e.target.value)}
          />
        </div>
      </DialogAddUpdate>
    );
  }

  // trạng thái đơn hàng
  const genBtnHandleBill = (statusBill: string) => {
    if (
      listTransaction.filter((trans) => trans.status === true).length > 0 &&
      Number(statusBill) === 7
    ) {
      return (
        <Button
          color="cam"
          style={{ marginRight: "5px" }}
          onClick={() => setOpenModalComplete(true)}
        >
          Hoàn thành
        </Button>
      );
    }
    //billDetail.type: giao hàng
    if (Number(statusBill) !== 0) {
      switch (statusBill) {
        case "1":
          return (
            <div>
              <Button
                color="cam"
                style={{ marginRight: "5px" }}
                onClick={() => setOpenModalConfirm(true)}
              >
                Xác nhận đơn hàng
              </Button>
              <Button
                color="error"
                style={{ marginRight: "5px" }}
                onClick={() => setOpenModalCancelBill(true)}
              >
                Huỷ đơn
              </Button>
            </div>
          );
        case "2":
          return (
            <div>
              <Button
                color="cam"
                style={{ marginRight: "5px" }}
                onClick={() => setOpenModalPendingShip(true)}
              >
                Xác nhận đóng gói & vận chuyển
              </Button>
              <Button
                color="error"
                style={{ marginRight: "5px" }}
                onClick={() => setOpenModalCancelBill(true)}
              >
                Huỷ đơn
              </Button>
            </div>
          );
        case "3":
          return (
            <div>
              <Button
                className="them-moi"
                color="cam"
                style={{ marginRight: "5px" }}
                onClick={() => setOpenModalDelive(true)}
              >
                Xác nhận đang giao hàng
              </Button>
              <Button
                className="them-moi"
                color="error"
                style={{ marginRight: "5px" }}
                onClick={() => setOpenModalCancelBill(true)}
              >
                Huỷ đơn
              </Button>
            </div>
          );
        case "4":
          return (
            <div>
              <Button
                className="them-moi"
                color="cam"
                style={{ marginRight: "5px" }}
                onClick={() => setOpenModalReceived(true)}
              >
                Xác nhận đã giao hàng
              </Button>
              <Button
                className="them-moi"
                color="cam"
                style={{ marginRight: "5px" }}
                onClick={() => setOpenModalReturnBill(true)}
              >
                Xác nhận hoàn đơn hàng
              </Button>
            </div>
          );
        case "5":
          return (
            <div>
              <Button
                className="them-moi"
                color="cam"
                style={{ marginRight: "5px" }}
                onClick={() => setOpenModalPendingPayment(true)}
              >
                Xác nhận chờ thanh toán
              </Button>
            </div>
          );
        default:
          return null;
      }
    }
  };

  return (
    <div>
      {openModalConfirm && <ModalConfirmBill />}
      {openModalPendingShip && <ModalPendingShip />}
      {openModalDelive && <ModalConfirmDelive />}
      {openModalReceived && <ModalConfirmReceived />}
      {openModalPendingPayment && <ModalConfirmPendingPayment />}
      {openModalPayment && <ModalConfirmPayment />}
      {openModalComplete && <ModalConfirmComplete />}
      {openModalCancelBill && <ModalCancelBill />}
      {openModalReturnBill && <ModalReturnBill />}
      {/* {openmodalReturnStt && <ModalReturnSttBill />} */}

      <BreadcrumbsCustom
        listLink={listHis}
        nameHere={billDetail?.code ? billDetail.code : ""}
      />

      {/* lịch sử đơn hàng */}
      <Card
        title="Lịch sử đơn hàng"
        style={{
          marginTop: 16,
          marginBottom: 16,
          paddingLeft: 16,
          paddingBottom: 16,
        }}
        bordered={false}
      >
        <Row gutter={16} align="top">
          <Col span={24}>
            {loadingHistory ? (
              <Spin tip="Loading..." />
            ) : (
              <TimeLine orderTimeLine={listHistoryBill} />
            )}
          </Col>
        </Row>
        {/* <Row justify="end" style={{ marginTop: 16 }}>
          <Col>
            {billDetail && Number(statusBill) > 1 && Number(statusBill) < 7 && (
              <Button
                type="default"
                style={{
                  marginRight: 5,
                  cursor: Number(statusBill) === 1 ? "not-allowed" : "pointer",
                  opacity: Number(statusBill) === 1 ? 0.5 : 1,
                }}
                onClick={() => {
                  if (Number(statusBill) !== 1) {
                    setOpenModalReturnStt(true);
                  }
                }}
                disabled={Number(statusBill) === 1}
              >
                <IoReturnUpBack style={{ fontSize: 20 }} />
                Quay lại trạng thái trước
              </Button>
            )}
          </Col>
        </Row> */}
      </Card>

      <Card
        style={{ marginTop: 16, marginBottom: 16, padding: "16px" }}
        bordered={false}
      >
        <Row justify="space-between" align="middle">
          {/* Add your logic for `genBtnHandleBill` here */}
          {!loadingBill && genBtnHandleBill(statusBill)}

          <Col>
            <Row gutter={16}>
              <Col>
                <Button
                  type="default"
                  style={{ marginRight: 8 }}
                  onClick={() => setOpenDialog(true)}
                >
                  Chi tiết lịch sử
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>

        {loadingHistory ? (
          <div>Loading...</div>
        ) : (
          openDialog && (
            <BillHistoryDialog
              openDialog={openDialog}
              setOpenDialog={setOpenDialog}
              listOrderTimeLine={listHistoryBill}
            />
          )
        )}
      </Card>
      {/* Thông tin đơn hàng */}
      <Card
        style={{ marginTop: 16, marginBottom: 16, padding: "16px" }}
        bordered={false}
      >
        <Row justify="space-between" align="middle">
          <Typography.Title level={4}>Thông tin đơn hàng</Typography.Title>
        </Row>
        <Divider style={{ margin: "16px 0" }} />

        {/* Thông tin khách hàng */}
        <Space
          direction="vertical"
          style={{ width: "100%", marginBottom: "20px" }}
        >
          {loadingBill ? (
            <div>Loading...</div>
          ) : (
            <Row gutter={16}>
              <Col xs={24} sm={8}>
                <Typography.Text>
                  <strong>Mã:</strong> {billDetail?.code}
                </Typography.Text>
              </Col>
              <Col xs={24} sm={8}>
                <Typography.Text>
                  <Space>
                    <strong>Loại:</strong>
                    <Tag
                      color={
                        billDetail?.paymentMethod === "COD" ? "blue" : "green"
                      }
                    >
                      {billDetail?.paymentMethod}
                    </Tag>
                  </Space>
                </Typography.Text>
              </Col>
              <Col xs={24} sm={8}>
                <Typography.Text>
                  <Space>
                    <strong>Trạng thái:</strong>
                    <Tag className={styleHoaDon({ status: statusBill })}>
                      {statusHoaDon({ status: String(statusBill) })}
                    </Tag>
                  </Space>
                </Typography.Text>
              </Col>
              <Col xs={24} sm={8}>
                <Typography.Text>
                  <strong>Tên khách hàng:</strong> {customer?.name}
                </Typography.Text>
              </Col>
              <Col xs={24} sm={8}>
                <Typography.Text>
                  <strong>SĐT khách hàng:</strong> {customer?.phoneNumber}
                </Typography.Text>
              </Col>
              <Col xs={24} sm={8}>
                <Typography.Text>
                  <strong>Ghi chú:</strong> {billDetail?.message || ""}
                </Typography.Text>
              </Col>
              <Col xs={24} sm={8}>
                <Typography.Text>
                  <strong>Tên người nhận:</strong>{" "}
                  {billDetail?.customerName || ""}
                </Typography.Text>
              </Col>
              <Col xs={24} sm={8}>
                <Typography.Text>
                  <strong>SĐT người nhận:</strong> {billDetail?.phone || ""}
                </Typography.Text>
              </Col>
              <Col xs={24} sm={8}>
                <Typography.Text>
                  <strong>Địa chỉ:</strong> {billDetail?.address || ""}
                </Typography.Text>
              </Col>
            </Row>
          )}
        </Space>
      </Card>

      <Card
        style={{ marginTop: 16, marginBottom: 16, padding: "16px" }}
        bordered={false}
      >
        {/* Lịch sử thanh toán */}
        {loadingTransBill ? (
          <div>Loading...</div>
        ) : (
          <Space direction="vertical" style={{ width: "100%" }}>
            <Row justify="space-between" align="middle">
              <Typography.Title level={4}>Lịch sử thanh toán</Typography.Title>
              {Number(statusBill) === 6 &&
                listTransaction.filter((trans) => trans.status === true)
                  .length === 0 && (
                  <Button
                    style={{
                      boxShadow: "none",
                      textTransform: "none",
                      borderRadius: "8px",
                    }}
                    onClick={() => setOpenModalPayment(true)}
                  >
                    Xác nhận thanh toán
                  </Button>
                )}
            </Row>

            {listTransaction.length > 0 ? (
              <div>
                <Divider style={{ margin: "16px 0" }} />
                <AdBillTransaction listTransaction={listTransaction} />
              </div>
            ) : (
              <div>Chưa thanh toán</div>
            )}
          </Space>
        )}
      </Card>

      {/* Hóa đơn chi tiết */}
      <Card
        style={{ marginTop: 16, marginBottom: 16, padding: "16px" }}
        bordered={false}
      >
        {/* Hoá đơn chi tiết */}
        {billDetail && billDetail.products.length > 0 && (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "20px",
              }}
            >
              <Typography.Title level={3}>Danh sách sản phẩm</Typography.Title>
            </div>
            <Divider
              style={{
                backgroundColor: "black",
                height: 1,
                marginTop: 10,
              }}
            />
            <Table
              dataSource={billDetail.products}
              rowKey="id"
              pagination={false}
              style={{ maxHeight: 300, marginBottom: 40 }}
              scroll={{ y: 300 }}
            >
              <Table.Column
                title="Ảnh"
                dataIndex="imgae"
                key="image"
                width={"15%"}
                render={(_, record: IProductBill) => (
                  <img
                    src={record.image}
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
                width={"25%"}
                render={(name, record: IProductBill) => {
                  return (
                    <>
                      <p>Tên: {name}</p>
                      <p>kích cỡ: {record?.size}</p>
                      <p>Phụ kiện: {record?.optionName}</p>
                    </>
                  );
                }}
              />
              <Table.Column
                title="Số lượng"
                dataIndex="quantity"
                key="quantity"
                width={"10%"}
                render={(value: number) => (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Input
                      value={value}
                      type="number"
                      min={1}
                      size="small"
                      style={{ width: 60, textAlign: "center" }}
                      readOnly
                    />
                  </div>
                )}
              />
              <Table.Column
                title="Giá sản phẩm"
                dataIndex="price"
                key="price"
                width={"15%"}
                render={(text: string) =>
                  formatCurrency({
                    money: String(text || 0),
                  })
                }
              />
              <Table.Column
                title="Giá phụ kiện"
                key="priccOption"
                width={"15%"}
                render={(record: IProductBill) =>
                  formatCurrency({
                    money: String(record.optionPrice || 0),
                  })
                }
              />
              <Table.Column
                title="Thành tiền"
                key="totalPrice"
                width={"20%"}
                render={(row: IProductBill) => (
                  <span style={{ fontWeight: "bold", color: "red" }}>
                    {formatCurrency({
                      money: String(
                        (row.price + row.optionPrice || 0) * row.quantity
                      ),
                    })}
                  </span>
                )}
              />
            </Table>
          </div>
        )}
      </Card>
      <Card
        style={{ marginTop: 16, marginBottom: 16, padding: "16px" }}
        bordered={false}
      >
        <Row justify="space-between" align="middle">
          <Typography.Title level={4}>Thông tin thanh toán</Typography.Title>
        </Row>
        <Divider style={{ margin: "16px 0" }} />
        <Row>
          <div style={{ marginRight: "auto", width: 300, paddingRight: 16 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <Typography.Title level={5}>Ngày đặt hàng:</Typography.Title>
              {dayjs(billDetail?.createdAt).format("DD/MM/YYYY HH:mm:ss")}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <Typography.Title level={5}>Ngày giao dự kiến:</Typography.Title>
              {dayjs(billDetail?.createdAt)
                .add(7, "day")
                .format("DD/MM/YYYY HH:mm:ss")}
            </div>
          </div>
          <div style={{ marginLeft: "auto", width: 300, paddingRight: 16 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              Tổng tiền hàng:
              <span style={{ fontWeight: "bold" }}>
                {formatCurrency({
                  money: String(totalProductPrice),
                })}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              Phí ship:
              <span style={{ fontWeight: "bold" }}>
                {billDetail &&
                  formatCurrency({ money: String(billDetail.shippingCost) })}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              Giảm giá:
              <span style={{ fontWeight: "bold" }}>
                {billDetail &&
                  formatCurrency({ money: String(billDetail.discouVoucher) })}
              </span>
            </div>
            {billDetail && billDetail.totalPrice >= 1000000 && (
              <div style={{ fontSize: 12 }}>
                Miễn phí vận chuyển với đơn hàng có tổng tiền trên 1.000.000 VNĐ
              </div>
            )}
            <Divider
              style={{
                backgroundColor: "black",
                height: 2,
                marginTop: 10,
              }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <span style={{ fontWeight: "bold" }}>Tổng tiền:</span>
              <span style={{ fontWeight: "bold", color: "red" }}>
                {formatCurrency({
                  money: String(billDetail?.totalPrice || 0),
                })}
              </span>
            </div>
          </div>
        </Row>
      </Card>
    </div>
  );
}
