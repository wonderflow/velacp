import { Select, Typography } from 'antd';

export interface CapabilitySelectorProps {
  onSelect?: (name: string) => void;
  disableCapabilities?: string[];
  caps: API.CapabilityType[];
}
const CapabilitySelector: React.FC<CapabilitySelectorProps> = ({
  onSelect,
  disableCapabilities,
  caps,
}) => {
  let loading: boolean | undefined;

  return (
    <Select
      onSelect={onSelect == null ? undefined : (e) => onSelect(e.toString())}
      loading={loading}
      placeholder={`Select an operation`}
      style={{ width: '100%' }}
      optionLabelProp="value"
    >
      {caps?.map((cap) => (
        <Select.Option
          key={cap.name}
          value={cap.name}
          disabled={disableCapabilities == null ? false : disableCapabilities.includes(cap.name)}
        >
          {cap.name}
          <Typography.Text type="secondary" style={{ fontSize: '10px', marginLeft: '5px' }}>
            {cap.desc}
          </Typography.Text>
        </Select.Option>
      ))}
    </Select>
  );
};
export default CapabilitySelector;
