import { IOption } from '../../../interface/Option';
import { Checkbox } from 'antd';

interface IOptionFormItemProps {
  value?: any;
  onChange?: any;
  options: IOption[]
}

const OptionFormItem = ({ value, onChange, options }: IOptionFormItemProps) => {
  if (!options.length) {
    return <p>Chưa chọn danh mục!</p>
  }

  return (
    <Checkbox.Group
      value={value}
      onChange={onChange}
      style={{
        // flexDirection: 'column'
        padding: "0 20px 0 20px"
      }}
      options={options.map(it => ({
        label: <p style={{
          fontSize: 20,
        }}>{it.name}</p>, value: it._id
      }))}
    />
  )
}

export default OptionFormItem