import React, { useState, ReactNode } from "react";
import {
  Layout,
  Menu,
  Avatar,
  Badge,
  Dropdown,
  Tooltip,
  Button,
  Row,
  Col,
} from "antd";
import {
  AiOutlineMenuFold,
  AiOutlineMenuUnfold,
  AiOutlineLogout,
  AiOutlineKey,
  AiOutlineBell,
} from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  ClockCircleOutlined,
  HomeOutlined,
  UserOutlined,
} from "@ant-design/icons";
import AdminMenu from "./AdminMenu";
import "./HeaderAdmin.css";
import {
  ACCESS_TOKEN_STORAGE_KEY,
  USER_INFO_STORAGE_KEY,
} from "../../services/constants";

dayjs.extend(relativeTime);

const { Header, Sider, Content } = Layout;

type Notification = {
  createdAt: number;
  status: string;
  title: string;
  content: string;
  image?: string;
};

type HeaderAdminProps = {
  children: ReactNode;
};

export default function HeaderAdmin({ children }: HeaderAdminProps) {
  const notification: Notification[] = [];
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_INFO_STORAGE_KEY);
    navigate("/home");
  };

  const menu = (
    <Menu>
      <Menu.Item key="1">
        <Link to={`/admin/infomation/`}>
          <Avatar /> Tài khoản của tôi
        </Link>
      </Menu.Item>
      <Menu.Item key="2">
        <Link to={`/admin/change-password`}>
          <AiOutlineKey style={{ marginRight: "8px" }} /> Đổi mật khẩu
        </Link>
      </Menu.Item>
      <Menu.Item key="3" onClick={() => handleLogout()}>
        <AiOutlineLogout style={{ marginRight: "8px" }} /> Đăng xuất
      </Menu.Item>
      <Menu.Item key="4">
        <Link to={`/home`}>
          <HomeOutlined /> Trang chủ
        </Link>
      </Menu.Item>
    </Menu>
  );

  const notificationMenu = (
    <Menu>
      {notification
        .sort((a, b) => b.createdAt - a.createdAt)
        .map((noti, index) => (
          <React.Fragment key={index}>
            <Menu.Item
              style={{
                margin: "3px",
                borderRadius: "5px",
                backgroundColor: "#faebd2",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  maxWidth: "300px",
                  width: "300px",
                  height: "70px",
                }}
              >
                <Row gutter={8}>
                  <Col span={6}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "70px",
                        height: "70px",
                        borderRadius: "50%",
                      }}
                    >
                      <img
                        src={
                          noti.image
                            ? noti.image
                            : "https://res.cloudinary.com/dioxktgsm/image/upload/v1701498532/zl87yxsvlm2luo5rjnyl.png"
                        }
                        alt=""
                        width="60px"
                        height="60px"
                        style={{
                          borderRadius: "50%",
                        }}
                      />
                    </div>
                  </Col>
                  <Col span={16}>
                    <div
                      style={{
                        flexDirection: "column",
                        wordWrap: "break-word",
                        marginLeft: "5px",
                      }}
                    >
                      {noti.status === "HOAT_DONG" ? (
                        <span>
                          <b>{noti.title}</b>
                          <p style={{ margin: 0 }}>{noti.content}</p>
                        </span>
                      ) : (
                        <span style={{ color: "gray" }}>
                          <b>{noti.title}</b>
                          <p style={{ margin: 0 }}>{noti.content}</p>
                        </span>
                      )}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <ClockCircleOutlined
                          style={{
                            width: "17px",
                            color:
                              noti.status === "HOAT_DONG" ? "#FC7C27" : "gray",
                            marginRight: "5px",
                          }}
                        />
                        <span
                          style={{
                            color:
                              noti.status === "HOAT_DONG" ? "#FC7C27" : "gray",
                          }}
                        >
                          {dayjs(noti.createdAt).fromNow()}
                        </span>
                      </div>
                    </div>
                  </Col>
                  <Col span={2}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "15px",
                        height: "70px",
                      }}
                    >
                      <div
                        style={{
                          height: "15px",
                          width: "15px",
                          backgroundColor:
                            noti.status === "HOAT_DONG" ? "#faebd2" : "gray",
                          borderRadius: "50%",
                        }}
                      />
                    </div>
                  </Col>
                </Row>
              </div>
            </Menu.Item>
            {index < notification.length - 1 && (
              <hr style={{ padding: 0, margin: 0 }} />
            )}
          </React.Fragment>
        ))}
    </Menu>
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        style={{ backgroundColor: "white" }}
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              src="../../src/assets/image/logo/logo.png"
              alt="logo"
              style={{
                width: collapsed ? "100%" : "75%",
                height: collapsed ? "50%" : "50%",
              }}
            />
          </div>
          <AdminMenu small={collapsed} />
        </div>
      </Sider>
      <Layout>
        <Header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 1,
            width: "100%",
            backgroundColor: "white",
            padding: 0,
          }}
        >
          {React.createElement(
            collapsed ? AiOutlineMenuUnfold : AiOutlineMenuFold,
            {
              onClick: () => setCollapsed(!collapsed),
              className: "menu-icon",
            }
          )}
          <div style={{ float: "right" }}>
            <Dropdown overlay={notificationMenu} trigger={["click"]}>
              <Badge
                count={
                  notification.filter((item) => item.status === "HOAT_DONG")
                    .length
                }
              >
                {/* <Tooltip title="Notifications">
                  <Button icon={<AiOutlineBell />} />
                </Tooltip> */}
              </Badge>
            </Dropdown>
            <Dropdown overlay={menu} trigger={["click"]}>
              <Avatar
                style={{ marginRight: "10px", marginLeft: "15px" }}
                icon={<UserOutlined />}
              />
            </Dropdown>
          </div>
        </Header>
        <Content
          style={{
            margin: "16px 16px",
            padding: 12,
            minHeight: 280,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
