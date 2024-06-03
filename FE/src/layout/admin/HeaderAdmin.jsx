import React, { useState } from "react";
import {
  Layout,
  Menu,
  Avatar,
  Badge,
  Dropdown,
  Tooltip,
  Button,
  Grid,
} from "antd";
import {
  AiOutlineMenuFold,
  AiOutlineMenuUnfold,
  AiOutlineLogout,
  AiOutlineKey,
  AiOutlineBell,
} from "react-icons/ai";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import { ClockCircleOutlined, UserOutlined } from "@ant-design/icons";
import AdminMenu from "./AdminMenu";
import "./HeaderAdmin.css";

const { Header, Sider, Content } = Layout;

export default function HeaderAdmin({ children }) {
  const notification = [];
  const [collapsed, setCollapsed] = useState(false);

  const menu = (
    <Menu>
      <>
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
        <Menu.Item
          key="3"
          onClick={() => {
            console.log("Đăng xuất");
          }}
        >
          <AiOutlineLogout style={{ marginRight: "8px" }} /> Đăng xuất
        </Menu.Item>
      </>
      <Menu.Item key="4">
        <Link to={`/login`}>
          <Avatar /> Đăng nhập
        </Link>
      </Menu.Item>
    </Menu>
  );

  const notificationMenu = (
    <Menu>
      {notification
        .sort((a, b) => b.createdAt - a.createdAt)
        .map((notification, index) => (
          <>
            <Menu.Item
              key={index}
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
                <Grid container spacing={2}>
                  <Grid item xs={3}>
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
                          notification.image
                            ? notification.image
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
                  </Grid>
                  <Grid item xs={8}>
                    <div
                      style={{
                        flexDirection: "column",
                        wordWrap: "break-word",
                        marginLeft: "5px",
                      }}
                    >
                      {notification.status === "HOAT_DONG" ? (
                        <span>
                          <b>{notification.title}</b>
                          <p style={{ margin: 0 }}>{notification.content} </p>
                        </span>
                      ) : (
                        <span style={{ color: "gray" }}>
                          <b>{notification.title}</b>
                          <p style={{ margin: 0 }}>{notification.content} </p>
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
                              notification.status === "HOAT_DONG"
                                ? "#FC7C27"
                                : "gray",
                            marginRight: "5px",
                          }}
                        />
                        <span
                          style={{
                            color:
                              notification.status === "HOAT_DONG"
                                ? "#FC7C27"
                                : "gray",
                          }}
                        >
                          {dayjs(notification.createdAt).fromNow()}
                        </span>
                      </div>
                    </div>
                  </Grid>
                  <Grid item xs={1}>
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
                            notification.status === "HOAT_DONG"
                              ? "#faebd2"
                              : "gray",
                          borderRadius: "50%",
                        }}
                      />
                    </div>
                  </Grid>
                </Grid>
              </div>
            </Menu.Item>
            {index < notification.length - 1 && (
              <hr style={{ padding: 0, margin: 0 }} />
            )}
          </>
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
              src="../src/assets/image/logo/logo.png"
              alt="logo"
              style={{
                width: collapsed ? "100%" : "75%",
                height: collapsed ? "50%" : "50%",
              }}
            />
          </div>
          <AdminMenu collapsed={collapsed} />
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
                <Tooltip title="Notifications">
                  <Button icon={<AiOutlineBell />} />
                </Tooltip>
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
