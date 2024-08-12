import { PlusOutlined } from "@ant-design/icons";
import { Upload, UploadFile } from "antd";
import { useMemo } from "react";

interface IFormImageItemProps {
  value?: File | string;
  onChange?: (file: UploadFile) => void;
}

const FormImageItem = ({ value, onChange }: IFormImageItemProps) => {
  const preview = useMemo(() => {
    if (!value) return;

    if (typeof value === "string") return value;
    return URL.createObjectURL(value);
  }, [value]);

  const UploadButton = () => {
    return (
      <button style={{ border: 0, background: "none" }} type="button">
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
      </button>
    );
  };

  return (
    <Upload
      name="avatar"
      listType="picture-card"
      className="avatar-uploader"
      showUploadList={false}
      beforeUpload={() => false}
      customRequest={() => 0}
      onChange={({ file }) => {
        onChange && onChange(file);
      }}
    >
      {value ? (
        <img src={preview} height={"100%"} style={{ objectFit: "contain" }} />
      ) : (
        <UploadButton />
      )}
    </Upload>
  );
};

export default FormImageItem;
