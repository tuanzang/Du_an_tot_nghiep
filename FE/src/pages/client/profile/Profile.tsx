import { Avatar, Col, Empty, Input, Row, Typography } from "antd";
import ProfileMenu from "./ProfileMenu";
import { USER_INFO_STORAGE_KEY } from "../../../services/constants";
import { IUser } from "../../../interface/Users";

export default function Profile() {
  // lấy thông tin user đăng nhập
  const isLogged = localStorage.getItem(USER_INFO_STORAGE_KEY);
  const user: IUser | null = isLogged ? JSON.parse(isLogged) : null;
  return (
    <div>
      {/* breadcrumb area start */}
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
                    <li className="breadcrumb-item active" aria-current="page">
                      <a href="/home">Trang chủ</a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Tài khoản của tôi
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* breadcrumb area end */}
      {user ? (
        <div
          className="container"
          style={{ marginTop: "10px", marginBottom: "10px" }}
        >
          <Row gutter={16}>
            <Col span={6}>
              <ProfileMenu small={false} />
            </Col>
            <Col span={18}>
              <Typography.Title
                style={{
                  textAlign: "center",
                  marginTop: "20px",
                  color: "#c29957",
                }}
                level={3}
              >
                Hồ sơ của tôi
              </Typography.Title>
              <Row gutter={16} style={{ marginTop: "20px" }}>
                <Col
                  span={12}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                  }}
                >
                  <Avatar size={200} src={user?.avatar} />
                </Col>
                <Col span={12}>
                  <Row gutter={16}>
                    <Col span={24} style={{ marginBottom: "20px" }}>
                      <Typography.Title level={5}>
                        Tên Khách Hàng
                      </Typography.Title>
                      <Input
                        style={{ width: "100%" }}
                        value={user?.name}
                        readOnly
                      />
                    </Col>
                    <Col span={24} style={{ marginBottom: "20px" }}>
                      <Typography.Title level={5}>
                        Số điện thoại
                      </Typography.Title>
                      <Input
                        style={{ width: "100%" }}
                        value={user?.phoneNumber}
                        readOnly
                      />
                    </Col>
                    <Col span={24} style={{ marginBottom: "20px" }}>
                      <Typography.Title level={5}>Email</Typography.Title>
                      <Input
                        style={{ width: "100%" }}
                        value={user?.email}
                        readOnly
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      ) : (
        <div className="container">
          <Row gutter={16}>
            <Col span={6}>
              <ProfileMenu small={false} />
            </Col>
            <Col span={18}>
              <Typography.Title
                style={{
                  textAlign: "center",
                  marginTop: "20px",
                  color: "#c29957",
                }}
                level={3}
              >
                Hồ sơ của tôi
              </Typography.Title>
              <Empty />
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
}
