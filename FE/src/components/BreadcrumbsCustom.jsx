import React from "react";
import Breadcrumb from "antd/lib/breadcrumb";
import Typography from "antd/lib/typography";
import { Link } from "react-router-dom";

export default function BreadcrumbsCustom({ listLink, nameHere }) {
  let items = [];

  if (Array.isArray(listLink)) {
    items = listLink.map((e, index) => ({
      key: `listLink${index + 1}`,
      title: e.link ? (
        <Link
          to={e.link}
          style={{
            textDecoration: "none",
            fontWeight: "600",
            fontSize: "calc(1.2rem + 0.15vw)",
            color: "#c29957",
          }}
        >
          {e.name}
        </Link>
      ) : (
        <Typography.Text
          strong
          style={{
            textDecoration: "none",
            fontWeight: "600",
            fontSize: "calc(1.2rem + 0.15vw)",
            color: "#c29957",
          }}
        >
          {e.name}
        </Typography.Text>
      ),
    }));
  }

  items.push({
    key: "listLink0",
    title: (
      <Typography.Text
        strong
        style={{
          textDecoration: "none",
          fontWeight: "500",
          fontSize: "calc(1.2rem + 0.15vw)",
          color: "#c29957",
        }}
      >
        {nameHere}
      </Typography.Text>
    ),
  });

  return (
    <Breadcrumb separator="/" style={{ marginBottom: "8px" }} items={items} />
  );
}
