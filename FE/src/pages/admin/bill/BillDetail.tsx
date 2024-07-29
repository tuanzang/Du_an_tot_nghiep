/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams } from "react-router-dom";
import {
  Button,
  Card,
  Col,
  Divider,
  Image,
  Input,
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
import { IoReturnUpBack } from "react-icons/io5";
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
import { IProduct } from "../../../interface/Products";
import { IBill, IProductBill } from "../../../interface/Bill";
import { USER_INFO_STORAGE_KEY } from "../../../services/constants";
import dayjs from "dayjs";

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

  // lấy ra hóa đơn
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

          // Trích xuất variantId và quantity từ products
          const productSizes = billData.products.map(
            (product: IProductSizeBill) => ({
              variantId: product.variantId,
              quantity: product.quantity,
            })
          );
          setListProductSize(productSizes);
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
              handleIncreaseProductSize(listProductSize, ghiChu, statusBill);
              setOpenModalCancelBill(false);
            }
          }
        }
      );
    };

    // tăng số lượng product size
    const handleIncreaseProductSize = async (
      listProductSize: IProductSizeBill[],
      ghiChu: string,
      statusBill: string
    ) => {
      if (listProductSize.length < 1) {
        toast.error("Không thể hủy đơn hàng");
      } else {
        try {
          if (statusBill === "2" || statusBill === "3") {
            await axios.post(
              "http://localhost:3001/api/bills/increase-product-size",
              { listProductSize: listProductSize }
            );
          }
          handleUpdateStatusBill(
            id ? id : null,
            "0",
            user ? user : null,
            ghiChu
          );
          toast.success("Hủy đơn hàng thành công!");
        } catch (error) {
          toast.error("Không thể hủy đơn hàng");
        }
      }
      setLoadingBill(false);
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

  // hoàn hóa đơn
  const handleReturnBill = async (
    id: string | null,
    user: IUser | null,
    note: string
  ) => {
    setLoadingBill(true);
    if (id === null || user === null) {
      toast.error("Thiếu thông tin đầu vào");
    } else {
      try {
        await axios.post("http://localhost:3001/api/bills/update-status", {
          id: id,
          status: "8",
        });
        handleUpdateStatusBill(id, "8", user, note);
      } catch (error) {
        toast.error("Không tìm thấy hóa đơn");
      }
    }
    setLoadingBill(false);
  };

  // cập nhật trạng thái hóa đơn
  const handleUpdateStatusBill = async (
    id: string | null,
    status: string,
    user: IUser | null,
    note: string
  ) => {
    setLoadingBill(true);
    if (id === null || user === null) {
      toast.error("Không tìm thấy hóa đơn");
    } else {
      try {
        const response = await axios.post(
          "http://localhost:3001/api/bills/update-status",
          { id: id, status: status }
        );
        createNewHistory(response.data.data, user, note);
        getBillHistoryByIdBill(id);
        setStatusBill(status);
      } catch (error) {
        toast.error("Không tìm thấy hóa đơn");
      }
    }
    setLoadingBill(false);
  };

  // State variables for controlling modal visibility
  const [openModalCancelBill, setOpenModalCancelBill] = useState(false);
  const [openModalReturnBill, setOpenModalReturnBill] = useState(false);
  const [openModalConfirm, setOpenModalConfirm] = useState(false);
  const [openModalConfirmDelive, setOpenModalConfirmDelive] = useState(false);
  const [openModalConfirmComplete, setOpenModalConfirmComplete] =
    useState(false);
  const [openCodalConfirmReceived, setOpenCodalConfirmReceived] =
    useState(false);
  const [openmodalReturnStt, setOpenModalReturnStt] = useState(false);

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
              handleDecreaseProductSize(listProductSize);
              handleUpdateStatusBill(
                id ? id : null,
                "2",
                user ? user : null,
                ghiChu
              );
              toast.success("Xác nhận đơn hàng thành công!");
              setOpenModalConfirm(false);
            }
          }
        }
      );
    };

    // giảm số lượng product size
    const handleDecreaseProductSize = async (
      listProductSize: IProductSizeBill[]
    ) => {
      if (listProductSize.length < 1) {
        toast.error("Không thể xác nhận đơn hàng");
      } else {
        try {
          await axios.post(
            "http://localhost:3001/api/bills/decrease-product-size",
            { listProductSize: listProductSize }
          );
        } catch (error) {
          toast.error("Không thể xác nhận đơn hàng");
        }
      }
      setLoadingBill(false);
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

  // xác nhận đóng gói & vận chuyển
  function ModalConfirmDeliver() {
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
            ghiChu
          );
          toast.success("Xác nhận đóng gói & vận chuyển thành công!");
          setOpenModalConfirmDelive(false);
        }
      });
    };
    return (
      <DialogAddUpdate
        open={openModalConfirmDelive}
        setOpen={setOpenModalConfirmDelive}
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
  function ModalConfirmReceived() {
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
            ghiChu
          );
          toast.success("Xác nhận đang giao hàng!");
          setOpenCodalConfirmReceived(false);
        }
      });
    };

    return (
      <DialogAddUpdate
        open={openCodalConfirmReceived}
        setOpen={setOpenCodalConfirmReceived}
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
            "7",
            user ? user : null,
            ghiChu
          );
          toast.success("Xác nhận hoàn thành đơn hàng thành công!");
          setOpenModalConfirmComplete(false);
        }
      });
    };

    return (
      <DialogAddUpdate
        open={openModalConfirmComplete}
        setOpen={setOpenModalConfirmComplete}
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

  // return trạng thái đơn hàng
  function ModalReturnSttBill() {
    const [ghiChu, setGhiChu] = useState("");
    const [errorGhiChu, setErrorGhiChu] = useState("");

    // api quay lại trạng thái trước
    const handleReturnStt = async () => {
      if (ghiChu === "") {
        setErrorGhiChu("Bạn cần nhập lý do");
        return;
      }
      if (statusBill === "6") {
        try {
          await axios.post("http://localhost:3001/api/trans/update");
          getTransBillByIdBill(id ? id : null);
          handleUpdateStatusBill(
            id ? id : null,
            String(Number(statusBill) - 2),
            user ? user : null,
            ghiChu
          );
          setOpenModalReturnStt(false);
        } catch (error) {
          toast.error("Thanh toán thất bại");
        }
      } else {
        if (statusBill === "2" && listProductSize.length > 0) {
          try {
            await axios.post(
              "http://localhost:3001/api/bills/increase-product-size",
              { listProductSize: listProductSize }
            );
          } catch (error) {
            toast.error("Không thể quay về trạng thái trước");
          }
        }
        // cập nhật trạng thái
        handleUpdateStatusBill(
          id ? id : null,
          String(Number(statusBill) - 1),
          user ? user : null,
          ghiChu
        );
        setOpenModalReturnStt(false);
      }
      toast.success("Xác nhận quay trở lại trạng thái thành công!");
    };

    return (
      <DialogAddUpdate
        open={openmodalReturnStt}
        setOpen={setOpenModalReturnStt}
        title={"Quay lại trạng thái trước"}
        buttonSubmit={
          <Button
            style={{
              boxShadow: "none",
              textTransform: "none",
              borderRadius: "8px",
            }}
            onClick={handleReturnStt}
          >
            Lưu
          </Button>
        }
      >
        <div>
          <Input
            size="small"
            placeholder={"Ghi chú"}
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

  // hoàn đơn hàng
  function ModalReturnBill() {
    const [ghiChu, setGhiChu] = useState("");
    const [errorGhiChu, setErrorGhiChu] = useState("");

    // API hoàn đơn hàng
    const returnBill = async () => {
      if (ghiChu === "") {
        setErrorGhiChu("Bạn cần nhập lý do");
        return;
      }
      // cập nhật trạng thái
      handleReturnBill(id ? id : null, user ? user : null, ghiChu);
      setOpenModalReturnBill(false);
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

  // trạng thái đơn hàng
  const genBtnHandleBill = (statusBill: string) => {
    if (
      listTransaction.filter((trans) => trans.status === true).length > 0 &&
      Number(statusBill) === 6
    ) {
      return (
        <Button
          color="cam"
          style={{ marginRight: "5px" }}
          onClick={() => setOpenModalConfirmComplete(true)}
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
                onClick={() => setOpenModalConfirmDelive(true)}
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
                onClick={() => setOpenCodalConfirmReceived(true)}
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
                onClick={() => setOpenModalReturnBill(true)}
              >
                Xác nhận hoàn đơn hàng
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
      {openModalConfirmDelive && <ModalConfirmDeliver />}
      {openCodalConfirmReceived && <ModalConfirmReceived />}
      {openModalConfirmComplete && <ModalConfirmComplete />}
      {openModalCancelBill && <ModalCancelBill />}
      {openModalReturnBill && <ModalReturnBill />}
      {openmodalReturnStt && <ModalReturnSttBill />}

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
        <Row justify="end" style={{ marginTop: 16 }}>
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
        </Row>
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
                  <strong>Sđt người nhận:</strong> {billDetail?.phone || ""}
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
                  <strong>Địa chỉ:</strong> {billDetail?.address || ""}
                </Typography.Text>
              </Col>
              <Col xs={24} sm={8}>
                <Typography.Text>
                  <strong>Ghi chú:</strong> {billDetail?.message || ""}
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
              {/* {Number(statusBill) > 3 &&
                Number(statusBill) < 7 &&
                listTransaction.filter((trans) => trans.status === true)
                  .length === 0 && (
                  <Button
                    style={{
                      boxShadow: "none",
                      textTransform: "none",
                      borderRadius: "8px",
                    }}
                    onClick={() => setOpenModalConfirmPayment(true)}
                  >
                    Xác nhận thanh toán
                  </Button>
                )} */}
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
              {billDetail &&
                billDetail.paymentMethod === "COD" &&
                statusBill === "1" &&
                listTransaction.length === 0 && (
                  <Button type="primary" style={{ marginRight: 5 }}>
                    Thêm sản phẩm
                  </Button>
                )}
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
                render={(text: string) => <Image src={text} width={100} />}
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
                    </>
                  );
                }}
              />
              <Table.Column
                title="Số lượng"
                dataIndex="quantity"
                key="quantity"
                width={"25%"}
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
                title="Giá tiền"
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
                title="Thành tiền"
                key="totalPrice"
                width={"15%"}
                render={(row: IProduct) => (
                  <span style={{ fontWeight: "bold", color: "red" }}>
                    {formatCurrency({
                      money: String((row.price || 0) * row.quantity),
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
                  money: String(billDetail?.totalPrice || 0),
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
              {billDetail && billDetail.totalPrice >= 1000000 ? (
                <span>0 VND</span>
              ) : (
                <Input
                  size="middle"
                  style={{ width: "75%" }}
                  value={0}
                  disabled={billDetail && Number(statusBill) !== 1}
                />
              )}
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
