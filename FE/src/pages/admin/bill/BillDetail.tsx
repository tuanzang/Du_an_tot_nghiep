import { useParams } from "react-router-dom";
import {
  Button,
  Card,
  Col,
  Divider,
  Image,
  Input,
  Modal,
  Row,
  Space,
  Spin,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import confirmStatus from "./confirmStatus";
import DialogAddUpdate from "./DialogAddUpdateProps ";
import axios from "axios";
import printJS from "print-js";
import BreadcrumbsCustom from "../../../components/BreadcrumbsCustom";
import TimeLine from "./TimeLine";
import { IoReturnUpBack } from "react-icons/io5";
import { IoIosAdd } from "react-icons/io";
import BillHistoryDialog from "./BillHistoryDialog";
import statusHoaDon from "../../../services/constants/statusHoaDon";
import AdBillTransaction from "./AdBillTransaction";
import formatCurrency from "../../../services/common/formatCurrency";
import { IOrder } from "../../../interface/Orders";
import { toast } from "react-toastify";
import { IUser } from "../../../interface/Users";
import { IHistoryBill } from "../../../interface/HistoryBill";
import { ITransaction } from "../../../interface/Transaction";
import styleHoaDon from "../../../services/constants/styleHoaDon";
import "./BillStyle.css";
import { IProduct } from "../../../interface/Products";
import { DeleteOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";

const listHis = [{ link: "/admin/bill", name: "Quản lý đơn hàng" }];
export default function BillDetail() {
  // fake role admin
  const userAdmin = { name: "admin", role: 1 };

  // api
  const { id } = useParams();
  const [idUser, setIdUser] = useState<string | null>(null);
  const [statusBill, setStatusBill] = useState<string>("");

  // lấy ra hóa đơn
  const [loadingBill, setLoadingBill] = useState(true);
  const [billDetail, setBillDetail] = useState<IOrder>();
  const fetchDetailBill = async (id: string | null) => {
    setLoadingBill(true);
    if (id === null) {
      toast.error("Không tìm thấy hóa đơn");
    } else {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/orders/${id}`
        );
        setBillDetail(response.data?.data);
        setIdUser(response.data?.data.userId);
        setStatusBill(response.data?.data.status);
      } catch (error) {
        toast.error("Không tìm thấy hóa đơn");
      }
    }
    setLoadingBill(false);
  };

  // hủy hóa đơn
  const handleCancelBill = async (
    id: string | null,
    user: IUser | null,
    note: string
  ) => {
    setLoadingBill(true);
    if (id === null || user === null) {
      toast.error("Thiếu thông tin đầu vào");
    } else {
      try {
        await axios.post("http://localhost:3001/api/orders/update-status", {
          id: id,
          status: "0",
        });
        handleUpdateStatusBill(id, "0", user, note);
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
          "http://localhost:3001/api/orders/update-status",
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
  const createNewHistory = async (bill: IOrder, user: IUser, note: string) => {
    setLoadingHistory(true);
    if (!bill || !user) {
      toast.warning("Không thể tạo lịch sử đơn hàng!");
      return;
    }
    const dataHistoryBill: IHistoryBill = {
      _id: null,
      idUser: bill.userId,
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
  const [user, setUser] = useState<IUser>();
  const findUserById = async (idUser: string | null) => {
    if (idUser === null) {
      toast.error("Không tìm thấy thông tin người đặt hàng");
    } else {
      try {
        const response = await axios.post(
          "http://localhost:3001/api/users/findUserById",
          { _id: idUser }
        );
        setUser(response.data?.data);
      } catch (error) {
        console.log("Khong co du lieu");
      }
    }
  };

  // useEffect
  useEffect(() => {
    fetchDetailBill(id ? id : null);
    getBillHistoryByIdBill(id ? id : null);
    if (idUser !== null) {
      findUserById(idUser);
    }
    getTransBillByIdBill(id ? id : null);
  }, [id, idUser]);

  // State variables for controlling modal visibility
  const [openModalCancelBill, setOpenModalCancelBill] = useState(false);
  const [openModalConfirm, setOpenModalConfirm] = useState(false);
  const [openModalConfirmDelive, setOpenModalConfirmDelive] = useState(false);
  const [openModalConfirmPayment, setOpenModalConfirmPayment] = useState(false);
  const [openModalConfirmComplete, setOpenModalConfirmComplete] =
    useState(false);
  const [openCodalConfirmReceived, setOpenCodalConfirmReceived] =
    useState(false);
  const [openmodalReturnStt, setOpenModalReturnStt] = useState(false);
  const [openPDFView, setOpenPDFView] = useState(false);

  // xác nhận đơn hàng
  function ModalConfirmBill() {
    const [ghiChu, setGhiChu] = useState("");

    const handleConfirmOrder = () => {
      confirmStatus({ title: "Xác nhận", text: "Xác nhận hoá đơn?" }).then(
        (result) => {
          if (result) {
            handleUpdateStatusBill(
              id ? id : null,
              "2",
              user ? user : null,
              ghiChu
            );
            confirmPrintBillGiaoHang(id ? id : null);
            setOpenModalConfirm(false);
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

  // xác nhận giao hàng
  function ModalConfirmDeliver() {
    const [ghiChu, setGhiChu] = useState("");
    const handleConfirmDelever = () => {
      confirmStatus({ title: "Xác nhận", text: "Xác nhận giao hàng?" }).then(
        (result) => {
          if (result) {
            handleUpdateStatusBill(
              id ? id : null,
              "3",
              user ? user : null,
              ghiChu
            );
            setOpenModalConfirmDelive(false);
          }
        }
      );
    };
    return (
      <DialogAddUpdate
        open={openModalConfirmDelive}
        setOpen={setOpenModalConfirmDelive}
        title={"Xác nhận giao hàng"}
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

  // xác nhận đã nhận hàng
  function ModalConfirmReceived() {
    const [ghiChu, setGhiChu] = useState("");
    const handleConfirmReceived = () => {
      confirmStatus({ title: "Xác nhận", text: "Xác nhận đã nhận hàng?" }).then(
        (result) => {
          if (result) {
            handleUpdateStatusBill(
              id ? id : null,
              "4",
              user ? user : null,
              ghiChu
            );
            handleUpdateStatusBill(
              id ? id : null,
              "5",
              user ? user : null,
              ghiChu
            );
            fetchDetailBill(id ? id : null);
            setOpenCodalConfirmReceived(false);
          }
        }
      );
    };
    return (
      <DialogAddUpdate
        open={openCodalConfirmReceived}
        setOpen={setOpenCodalConfirmReceived}
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

  // thanh toán
  function ModalConfirmPayment() {
    const [ghiChu, setGhiChu] = useState("");
    const [transCode, setTransCode] = useState("");
    const [errorTransCode, setErrorTransCode] = useState("");

    // xác nhận thanh toán hóa đơn
    const handleConfirmPayment = async () => {
      setLoadingTransBill(true);
      if (!billDetail || !user) {
        toast.error("Không thể thanh toán");
        return;
      }
      if (transCode === "") {
        setErrorTransCode("Bạn cần nhập mã giao dịch");
        return;
      }

      const confirmPaymentRequest: ITransaction = {
        _id: null,
        idUser: user._id,
        idBill: billDetail._id,
        transCode: transCode,
        totalMoney: billDetail.totalPrice,
        note: ghiChu,
        status: true,
        createdAt: "",
      };

      // xác nhận thanh toán
      try {
        await axios.post(
          "http://localhost:3001/api/trans/add",
          confirmPaymentRequest
        );
        getTransBillByIdBill(billDetail._id);
        // cập nhật trạng thái
        handleUpdateStatusBill(
          billDetail._id,
          "6",
          user,
          confirmPaymentRequest.note
        );
        toast.success("Thanh toán thành công");
        setOpenModalConfirmPayment(false);
      } catch (error) {
        toast.error("Thanh toán thất bại");
        setOpenModalConfirmPayment(false);
      }
      setLoadingTransBill(false);
    };

    return (
      <DialogAddUpdate
        open={openModalConfirmPayment}
        setOpen={setOpenModalConfirmPayment}
        title={"Xác nhận thanh toán"}
        buttonSubmit={
          <Button
            style={{
              boxShadow: "none",
              textTransform: "none",
              borderRadius: "8px",
            }}
            onClick={handleConfirmPayment}
          >
            Lưu
          </Button>
        }
      >
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
            Mã giao dịch <span style={{ color: "red" }}>*</span>
          </Typography.Text>
          <Input
            size="small"
            value={transCode}
            onChange={(e) => {
              setTransCode(e.target.value);
              setErrorTransCode("");
            }}
            style={{
              marginTop: errorTransCode === "" ? "5px" : "",
              marginBottom: errorTransCode === "" ? "10px" : "",
            }}
            required
          />
          <div>
            {errorTransCode !== "" && (
              <span
                style={{ color: "red", marginTop: "5px", marginBottom: "10px" }}
              >
                {errorTransCode}
              </span>
            )}
          </div>
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
            "7",
            user ? user : null,
            ghiChu
          );
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
        } catch (error) {
          toast.error("Thanh toán thất bại");
        }
      }

      if (statusBill === "5") {
        // cập nhật trạng thái
        handleUpdateStatusBill(
          id ? id : null,
          String(Number(statusBill) - 2),
          user ? user : null,
          ghiChu
        );
        setOpenModalReturnStt(false);
      } else {
        // cập nhật trạng thái
        handleUpdateStatusBill(
          id ? id : null,
          String(Number(statusBill) - 1),
          user ? user : null,
          ghiChu
        );
        setOpenModalReturnStt(false);
      }
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
      // cập nhật trạng thái
      handleCancelBill(id ? id : null, user ? user : null, ghiChu);
      setOpenModalCancelBill(false);
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

  // trạng thái đơn hàng
  const genBtnHandleBill = (statusBill: string) => {
    if (
      listTransaction.filter((trans) => trans.status === true).length > 0 &&
      Number(statusBill) > 3 &&
      Number(statusBill) < 7 &&
      Number(statusBill) !== 0
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
                Xác nhận giao hàng
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
                Xác nhận lấy hàng
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
        default:
          return null;
      }
    }
  };

  // xác nhận và in bill
  const [pdfContent, setPdfContent] = useState("");
  const handleOpenPDF = (pdfContent: string) => {
    setPdfContent(pdfContent);
    setOpenPDFView(true);
  };

  const confirmPrintBill = async (idBill: string) => {
    const comfirm = await confirmStatus({
      title: "Xác nhận in hoá đơn",
      text: "Bạn có chắc chắn muốn in hoá đơn này?",
    });
    if (comfirm) {
      try {
        const response = await axios.get(
          "http://localhost:5173" + "/in-hoa-don/" + idBill,
          {
            responseType: "blob",
          }
        );
        const pdfContent = await new Response(response.data).blob();

        // Tạo URL từ Blob
        const pdfUrl = URL.createObjectURL(pdfContent);

        // In PDF khi lấy được nội dung
        printJS({
          printable: pdfUrl,
          type: "pdf",
          header: "Header for the PDF",
        });

        // Đảm bảo giải phóng tài nguyên khi không cần thiết
        URL.revokeObjectURL(pdfUrl);
        handleOpenPDF(String(pdfContent));
      } catch (error) {
        console.error("Error fetching or printing PDF:", error);
      }
    }
  };

  const confirmPrintBillGiaoHang = async (idBill: string | null) => {
    if (idBill !== null) {
      try {
        const response = await axios.get(
          "http://localhost:5173" + "/in-hoa-don/hd-giao-hang/" + idBill,
          {
            responseType: "blob",
          }
        );
        const pdfContent = await new Response(response.data).blob();

        // Tạo URL từ Blob
        const pdfUrl = URL.createObjectURL(pdfContent);

        // In PDF khi lấy được nội dung
        printJS({
          printable: pdfUrl,
          type: "pdf",
          header: "Header for the PDF",
        });

        // Đảm bảo giải phóng tài nguyên khi không cần thiết
        URL.revokeObjectURL(pdfUrl);
        handleOpenPDF(String(pdfContent));
      } catch (error) {
        console.error("Error fetching or printing PDF:", error);
      }
    }
  };

  const PDFViewerModal = () => {
    const pdfBlob = new Blob([pdfContent], { type: "application/pdf" });
    const pdfUrl = URL.createObjectURL(pdfBlob);

    return (
      <Modal
        open={openPDFView}
        onCancel={() => setOpenPDFView(false)}
        footer={null} // Remove footer if not needed
        width="80%" // Set the width of the modal
        style={{ padding: 0 }} // Remove padding from body
      >
        <iframe
          style={{ border: "none", width: "100%", height: "80vh" }}
          src={pdfUrl}
          title="PDF Viewer"
        />
      </Modal>
    );
  };

  const handleOpenModalChonNhanVien = () => {
    //TODO: call api danh sách nhân viên và chọn nhân viên => 2 api
  };

  return (
    <div>
      {openPDFView && <PDFViewerModal />}
      {openModalConfirm && <ModalConfirmBill />}
      {openModalConfirmDelive && <ModalConfirmDeliver />}
      {openCodalConfirmReceived && <ModalConfirmReceived />}
      {openModalConfirmPayment && <ModalConfirmPayment />}
      {openModalConfirmComplete && <ModalConfirmComplete />}
      {openModalCancelBill && <ModalCancelBill />}
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

          <Col>
            {userAdmin &&
              userAdmin.role === 1 &&
              billDetail &&
              Number(statusBill) < 7 &&
              Number(statusBill) > 1 && (
                <Button
                  type="default"
                  style={{ marginLeft: 5 }}
                  onClick={handleOpenModalChonNhanVien}
                >
                  <IoIosAdd style={{ fontSize: 20 }} />
                  Thêm nhân viên tiếp nhận
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
                  Chi tiết
                </Button>
                {billDetail && Number(statusBill) === 7 && (
                  <Button
                    type="default"
                    style={{ marginRight: 8 }}
                    onClick={() =>
                      confirmPrintBill(billDetail._id ? billDetail._id : "")
                    }
                  >
                    In hoá đơn
                  </Button>
                )}
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
                  <strong>Tên khách hàng:</strong> {user?.name}
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
                  <strong>Email:</strong> {billDetail?.email || ""}
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
              {Number(statusBill) > 3 &&
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
                title="Tên sản phẩm"
                dataIndex="name"
                key="name"
                width={"25%"}
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
                    <Button
                      icon={<MinusOutlined />}
                      disabled={
                        (billDetail &&
                          (Number(statusBill) > 1 ||
                            Number(statusBill) === 0)) ||
                        value - 1 === 0
                      }
                      style={{ marginRight: 8 }}
                    />
                    <Input
                      value={value}
                      type="number"
                      min={1}
                      size="small"
                      style={{ width: 60, textAlign: "center" }}
                      // disabled={
                      //   (billDetail && Number(statusBill) > 1) ||
                      //   value - 1 === 0
                      // }
                      readOnly
                    />
                    <Button
                      icon={<PlusOutlined />}
                      disabled={
                        billDetail &&
                        (Number(statusBill) > 1 || Number(statusBill) === 0)
                      }
                      style={{ marginLeft: 8 }}
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
              <Table.Column
                key="actions"
                width={"5%"}
                render={() => (
                  <div>
                    {billDetail && Number(statusBill) > 1 && (
                      <Tooltip title="Xoá sản phẩm">
                        <Button
                          icon={<DeleteOutlined style={{ color: "red" }} />}
                          // onClick={() =>
                          //   handleDeleteSPConfirmation(row)
                          // }
                        />
                      </Tooltip>
                    )}
                  </div>
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
              Phí vận chuyển:
              {billDetail && billDetail.totalPrice >= 1000000 ? (
                <span>0 VND</span>
              ) : (
                <Input
                  size="small"
                  value={0}
                  disabled={
                    (billDetail && Number(statusBill) > 2) ||
                    (billDetail && Number(statusBill) <= 0)
                  }
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
