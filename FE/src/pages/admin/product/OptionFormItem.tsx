import { IOption } from '../../../interface/Option';
import { Checkbox } from 'antd';

interface IOptionFormItemProps {
  value?: any;
  onChange?: any;
  options: IOption[]
}

const OptionFormItem = ({value, onChange, options}: IOptionFormItemProps) => {
  if (!options.length) {
    return <p>Chưa chọn danh mục!</p>
  }

  return (
    <Checkbox.Group
      value={value}
      onChange={onChange}
      style={{
        flexDirection: 'column'
      }}
      options={options.map(it => ({ label: it.name, value: it._id }))}
    />
  )
}

export default OptionFormItem