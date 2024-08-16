import address from "../models/address.js";

/**
 * API tạo 1 địa chỉ
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const createAddress = async (req, res) => {
  const {
    idUser,
    fullName,
    phoneNumber,
    provinceId,
    provinceName,
    districtId,
    districtName,
    wardId,
    wardName,
    specifically,
    isDefault,
  } = req.body;

  // validate
  if (!fullName || (fullName && !/^[\p{L}\p{N}\s.,!?-]+$/u.test(fullName))) {
    return res.status(200).json({
      message: "Họ và tên không được để trống hoặc chứa ký tự đặc biệt!",
      success: false,
    });
  }

  if (!phoneNumber || !/^(\+84|0)\d{9}$/.test(phoneNumber)) {
    return res.status(200).json({
      message:
        "Số điện thoại không hợp lệ! Số điện thoại phải có 10 ký tự và bắt đầu bằng số 0 hoặc +84.",
      success: false,
    });
  }

  if (!provinceId || isNaN(provinceId) || provinceId < 0) {
    return res.status(200).json({
      message: "Bạn chưa chọn tỉnh/thành phố!",
      success: false,
    });
  }

  if (!districtId || isNaN(districtId) || districtId < 0) {
    return res.status(200).json({
      message: "Bạn chưa chọn huyện/quận",
      success: false,
    });
  }

  if (!wardId || isNaN(wardId) || wardId < 0) {
    return res.status(200).json({
      message: "Bạn chưa chọn xã/phường!",
      success: false,
    });
  }

  if (
    !provinceName ||
    (provinceName && !/^[\p{L}\p{N}\s.,!?-]+$/u.test(provinceName))
  ) {
    return res.status(200).json({
      message: "Tên tỉnh/thành phố không đúng!",
      success: false,
    });
  }

  if (
    !districtName ||
    (districtName && !/^[\p{L}\p{N}\s.,!?-]+$/u.test(districtName))
  ) {
    return res.status(200).json({
      message: "Tên huyện/quận không đúng!",
      success: false,
    });
  }

  if (!wardName || (wardName && !/^[\p{L}\p{N}\s.,!?-]+$/u.test(wardName))) {
    return res.status(200).json({
      message: "Tên xã/phường không đúng!",
      success: false,
    });
  }

  if (
    !specifically ||
    (specifically && !/^[\p{L}\p{N}\s.,!?-]+$/u.test(specifically))
  ) {
    return res.status(200).json({
      message: "Địa chỉ cụ thể không được chứa ký tự đặc biệt!",
      success: false,
    });
  }

  // tạo mới
  try {
    // Nếu isDefault là true, cập nhật tất cả các địa chỉ của idUser thành không mặc định
    if (isDefault) {
      await address.updateMany({ idUser }, { isDefault: false });
    }

    const data = await address.create(req.body);
    if (!data) {
      return res.status(404).json({
        message: "Tạo địa chỉ thật bại!",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Tạo địa chỉ thành công",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

/**
 * Danh sách địa chỉ của 1 user
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const getAddressByIdUser = async (req, res) => {
  try {
    const data = await address.find({ idUser: req.body.idUser });
    if (!data || data.length === 0) {
      return res.status(200).json({
        message: "Không tìm thấy danh sách địa chỉ!",
        data: [],
      });
    }

    return res.status(200).json({
      message: "Đã tìm thấy danh sách địa chỉ!",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

/**
 * API cập nhật địa chỉ
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const updateAddress = async (req, res) => {
  const {
    _id,
    idUser,
    fullName,
    phoneNumber,
    provinceId,
    provinceName,
    districtId,
    districtName,
    wardId,
    wardName,
    specifically,
    isDefault,
  } = req.body;

  // validate
  if (!fullName || (fullName && !/^[\p{L}\p{N}\s.,!?-]+$/u.test(fullName))) {
    return res.status(200).json({
      message: "Họ và tên không được để trống hoặc chứa ký tự đặc biệt!",
      success: false,
    });
  }

  if (!phoneNumber || !/^(\+84|0)\d{9}$/.test(phoneNumber)) {
    return res.status(200).json({
      message:
        "Số điện thoại không hợp lệ! Số điện thoại phải có 10 ký tự và bắt đầu bằng số 0 hoặc +84.",
      success: false,
    });
  }

  if (!provinceId || isNaN(provinceId) || provinceId < 0) {
    return res.status(200).json({
      message: "Bạn chưa chọn tỉnh/thành phố!",
      success: false,
    });
  }

  if (!districtId || isNaN(districtId) || districtId < 0) {
    return res.status(200).json({
      message: "Bạn chưa chọn huyện/quận",
      success: false,
    });
  }

  if (!wardId || isNaN(wardId) || wardId < 0) {
    return res.status(200).json({
      message: "Bạn chưa chọn xã/phường!",
      success: false,
    });
  }

  if (
    !provinceName ||
    (provinceName && !/^[\p{L}\p{N}\s.,!?-]+$/u.test(provinceName))
  ) {
    return res.status(200).json({
      message: "Tên tỉnh/thành phố không đúng!",
      success: false,
    });
  }

  if (
    !districtName ||
    (districtName && !/^[\p{L}\p{N}\s.,!?-]+$/u.test(districtName))
  ) {
    return res.status(200).json({
      message: "Tên huyện/quận không đúng!",
      success: false,
    });
  }

  if (!wardName || (wardName && !/^[\p{L}\p{N}\s.,!?-]+$/u.test(wardName))) {
    return res.status(200).json({
      message: "Tên xã/phường không đúng!",
      success: false,
    });
  }

  if (
    !specifically ||
    (specifically && !/^[\p{L}\p{N}\s.,!?-]+$/u.test(specifically))
  ) {
    return res.status(200).json({
      message: "Địa chỉ cụ thể không được chứa ký tự đặc biệt!",
      success: false,
    });
  }

  try {
    // Nếu isDefault là true, cập nhật tất cả các địa chỉ khác của idUser thành isDefault: false
    if (isDefault) {
      await address.updateMany(
        { idUser, _id: { $ne: _id } }, // Cập nhật tất cả các địa chỉ của idUser ngoại trừ địa chỉ đang được cập nhật
        { isDefault: false }
      );
    }

    // Cập nhật địa chỉ với _id bằng dữ liệu mới từ req.body
    const updatedAddress = await address.findByIdAndUpdate(
      _id,
      {
        idUser,
        fullName,
        phoneNumber,
        provinceId,
        provinceName,
        districtId,
        districtName,
        wardId,
        wardName,
        specifically,
        isDefault,
      },
      { new: true } // Trả về address đã được cập nhật
    );

    if (!updatedAddress) {
      return res.status(404).json({
        message: "Không tìm thấy địa chỉ cần cập nhật!",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Cập nhật địa chỉ thành công",
      success: true,
      data: updatedAddress,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

/**
 * API xóa địa chỉ
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const deleteAddress = async (req, res) => {
  try {
    const deleteAddress = await address.findByIdAndDelete(req.params.id);

    if (!deleteAddress) {
      return res.status(404).json({
        message: "Không tìm thấy địa chỉ!",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Xóa địa chỉ thành công!",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

/**
 * Tìm địa chỉ theo ID
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const findAddressById = async (req, res) => {
  const { id } = req.params;

  try {
    const addressData = await address.findById(id);

    if (!addressData) {
      return res.status(404).json({
        message: "Không tìm thấy địa chỉ!",
        success: false,
        data: null,
      });
    }

    return res.status(200).json({
      message: "Tìm địa chỉ thành công",
      success: true,
      data: addressData,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};
