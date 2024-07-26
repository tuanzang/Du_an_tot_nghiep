import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from 'axios';
import { useEffect, useRef } from 'react';
import BreadcrumbsCustom from "../../../components/BreadcrumbsCustom";
import {
  Button,
  Card,
  Form,
  Upload,
} from "antd";
// import formatCurrency from "../../../services/common/formatCurrency";
import {
  EditOutlined,
  UploadOutlined
} from "@ant-design/icons";
import { UploadFile } from "antd/lib";
import { IProduct } from '../../../interface/Products';
import { IProductSize } from "../../../interface/ProductSize";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
  ClassicEditor, AccessibilityHelp, Alignment, Autosave, Bold, Essentials, GeneralHtmlSupport, Highlight, Italic,
  Link, Paragraph, SelectAll, SpecialCharacters, Table, TableCaption, TableCellProperties, TableColumnResize,
  TableProperties, TableToolbar, TextPartLanguage, Title, Underline, Undo
} from 'ckeditor5';
import 'ckeditor5/ckeditor5.css';
import { toast } from "react-toastify";

export default function ProductDetailAndEdit() {
  const { id } = useParams<{ id: string }>(); // Lấy ID sản phẩm từ URL
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [product, setProduct] = useState<IProduct | null>(null);
  const [name, setName] = useState<string | undefined>(undefined);
  const [price, setPrice] = useState<number | undefined>(undefined);
  const [priceOld, setPriceOld] = useState<number | undefined>(undefined);
  // const [category, setCategory] = useState<string | undefined>(undefined);
  const [description, setDescription] = useState<string | undefined>(undefined);
  const [productSizes, setProductSizes] = useState<IProductSize[]>([]);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const editorContainerRef = useRef(null);
  const editorRef = useRef(null);
  const [isLayoutReady, setIsLayoutReady] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [isChanged1, setIsChanged1] = useState(false);
  const [isChanged2, setIsChanged2] = useState(false);

  useEffect(() => {
    // Gọi API để lấy chi tiết sản phẩm
    const fetchProductDetails = async () => {
      try {
        const { data } = await axios.get(`http://localhost:3001/api/products/${id}`);
        setProduct(data.data);
        setName(data.data.name);
        setPrice(data.data.price);
        setPriceOld(data.data.priceOld);
        setDescription(data.data.description);
        if (data.data.image) {
          setFileList(data.data.image.map((url: string) => ({
            uid: url,
            name: url.split('/').pop() || '',
            status: 'done',
            url,
          })));
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };

    // Gọi API để lấy số lượng sản phẩm theo kích cỡ
    const fetchProductSizes = async () => {
      try {
        const { data } = await axios.get(`http://localhost:3001/api/products/productSize/${id}`);
        setProductSizes(data.data);

        // Cập nhật state quantities
        const initialQuantities: { [key: string]: number } = {};
        data.data.forEach((productSize: IProductSize) => {
          initialQuantities[productSize.sizeName] = productSize.quantity;
        });
        setQuantities(initialQuantities);
      } catch (error) {
        console.error('Error fetching product sizes:', error);
      }
    };

    fetchProductDetails();
    fetchProductSizes();
  }, [id]);

  // Hàm xử lý khi thay đổi số lượng
  const handleQuantityChange = (sizeName: any, value: any) => {
    setQuantities({
      ...quantities,
      [sizeName]: value
    });
    setIsChanged1(true);
  };

  const handleUploadChange = ({ fileList }: { fileList: UploadFile[] }) => {
    setFileList(fileList);
    setIsChanged(true);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setIsChanged(true);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(Number(e.target.value));
    setIsChanged(true);
  };

  const handleOldPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPriceOld(Number(e.target.value));
    setIsChanged(true);
  };

  const handleDescriptionChange = (_event: any, editor: any) => {
    const data = editor.getData();
    setDescription(data);
    setIsChanged2(true);
  };

  const handleUpdateProduct = async () => {
    try {
      const formData = new FormData();
      formData.append('name', name || '');
      formData.append('price', (price || 0).toString());
      formData.append('priceOld', (priceOld || 0).toString());
      formData.append('description', description || '');

      // Nối fileList vào formData
      fileList.forEach(file => {
        if (file.originFileObj) {
          formData.append('image', file.originFileObj);
        }
      });

      // Cập nhật thông tin sản phẩm
      await axios.put(`http://localhost:3001/api/products/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success("Cập nhật sản phẩm thành công");
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error("Cập nhật sản phẩm thất bại");
    }
  };

  const handleUpdateProductSize = async () => {
    try {
      for (const productSize of productSizes) {
        const updatedQuantity = quantities[productSize.sizeName];
        await axios.put(`http://localhost:3001/api/products/productSize/${productSize._id}`, {
          quantity: updatedQuantity,
        });
      }
      toast.success("Cập nhật sản phẩm thành công");
    } catch (error) {
      console.error('Error updating product sizes:', error);
      toast.error("Cập nhật sản phẩm thất bại");
    }
  };

  useEffect(() => {
    setIsLayoutReady(true);
    return () => setIsLayoutReady(false);
  }, []);

  const editorConfig = {
    toolbar: {
      items: [
        'undo', 'redo', '|',
        'selectAll', 'textPartLanguage', '|',
        'bold', 'italic', 'underline', '|',
        'specialCharacters', 'link', 'insertTable', 'highlight', '|',
        'alignment', '|', 'accessibilityHelp'
      ],
      shouldNotGroupWhenFull: false
    },
    plugins: [
      AccessibilityHelp, Alignment, Autosave, Bold, Essentials, GeneralHtmlSupport,
      Highlight, Italic, Link, Paragraph, SelectAll, SpecialCharacters, Table,
      TableCaption, TableCellProperties, TableColumnResize, TableProperties, TableToolbar,
      TextPartLanguage, Title, Underline, Undo
    ],
    htmlSupport: {
      allow: [
        {
          name: /^.*$/,
          styles: true,
          attributes: true,
          classes: true
        }
      ]
    },
    initialData: description || 'Mô tả sản phẩm',
    link: {
      addTargetToExternalLinks: true,
      defaultProtocol: 'https://',
      decorators: {
        toggleDownloadable: {
          mode: 'manual',
          label: 'Downloadable',
          attributes: {
            download: 'file'
          }
        }
      }
    },
    placeholder: 'Type or paste your content here!',
    table: {
      contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties']
    }
  };

  return (
    <div>
      <BreadcrumbsCustom
        listLink={[{ link: "/admin/product", name: "Sản phẩm" }]}
        nameHere={`${name}`}
      />
      <div className="w-50 mx-auto">
        <Card style={{ padding: "10px", marginBottom: "10px" }}>
          <form>
            <div className="form-group">
              <label htmlFor="">Tên sản phẩm</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={name}
                onChange={handleNameChange}
                placeholder="Tên sản phẩm"
              />
            </div>

            <div className="row">
              <div className="form-group col">
                <label htmlFor="">Giá</label>
                <input
                  type="number"
                  className="form-control"
                  name="price"
                  value={price}
                  onChange={handlePriceChange}
                  placeholder="Giá sản phẩm"
                />
              </div>

              <div className="form-group col">
                <label htmlFor="">Giá cũ</label>
                <input
                  type="number"
                  className="form-control"
                  name="priceOld"
                  value={priceOld}
                  onChange={handleOldPriceChange}
                  placeholder="Giá cũ"
                />
              </div>
            </div>


            <div className="mt-3">
              <Form.Item
                label="Ảnh"
                name="image"
                rules={[
                  { required: true, message: "Vui lòng tải lên ảnh sản phẩm!" },
                ]}
              >
                <Upload
                  name="image"
                  listType="picture"
                  beforeUpload={() => false}
                  multiple
                  accept=".jpg,.png,.jpeg"
                  fileList={fileList}
                  onChange={handleUploadChange}
                >
                  <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
                </Upload>
              </Form.Item>
            </div>

            {isChanged && (
              <Button type="primary" onClick={handleUpdateProduct} className="mt-2">
                <EditOutlined />
                Cập nhật
              </Button>
            )}
          </form>
        </Card>

        <Card style={{ padding: "10px", marginBottom: "10px" }}>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Tên</th>
                <th scope="col">Số lượng</th>
                <th scope="col">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {productSizes.map((size) => (
                <tr key={size._id}>
                  <td>{size.sizeName}</td>
                  <td>
                    <input
                      type="number"
                      value={quantities[size.sizeName]}
                      onChange={(e) => handleQuantityChange(size.sizeName, Number(e.target.value))}
                    />
                  </td>
                  <td>
                    {/* {size.status} */}
                    <div className="form-check form-switch">
                      <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {isChanged1 && (
            <Button
              type="primary"
              onClick={handleUpdateProductSize}
            >
              <EditOutlined />
              Cập nhật
            </Button>
          )}
        </Card>

        <Card style={{ padding: "10px", marginBottom: "10px" }}>
          <label style={{ fontSize: "20px" }} className="mb-2">Mô tả sản phẩm</label>
          <div className="editor-container editor-container_classic-editor" ref={editorContainerRef}>
            <div className="editor-container__editor">
              <div ref={editorRef}>
                {isLayoutReady &&
                  <CKEditor
                    editor={ClassicEditor}
                    config={editorConfig}
                    data={description || ''}
                    onChange={handleDescriptionChange}
                    name="description"
                  />}
              </div>
            </div>
          </div>
          {isChanged2 && (
            <Button type="primary" onClick={handleUpdateProduct} className="mt-4">
              <EditOutlined />
              Cập nhật
            </Button>
          )}
        </Card>
      </div>
    </div>
  );
}


