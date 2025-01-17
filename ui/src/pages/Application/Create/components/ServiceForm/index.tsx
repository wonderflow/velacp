import React, { useState } from 'react';

import { Card, Form, Input, Tabs } from 'antd';

import CapabilityFormItem from '../CapabilityFormItem';
import TraitsFrom from '../TraitsFrom';

interface ServiceEntry {
  id: number;
  name?: string;
  type?: string;
  data?: object;
  traits?: API.TraitType[];
}
interface ServiceFormItemProps {
  service: ServiceEntry;
  setService: (service: ServiceEntry) => void;
  caps: API.CapabilityType[];
}
const ServiceFormItem: React.FC<ServiceFormItemProps> = ({ service, setService, caps }) => {
  return (
    <div>
      <Form.Item
        name={['service', service.id, 'name']}
        label="Service Name"
        required
        rules={[{ required: true, max: 200 }]}
      >
        <Input
          placeholder="Service name"
          onChange={(e) => setService({ ...service, name: e.target.value })}
        />
      </Form.Item>
      <Form.Item
        name={['service', service.id, 'type']}
        label="Service Type"
        required
        rules={[{ required: true }]}
      >
        <CapabilityFormItem
          onChange={(wd) => {
            setService({ ...service, data: wd.data, type: wd.capabilityType });
          }}
          caps={caps.filter((cap) => cap.type === 'Workload')}
        />
      </Form.Item>
      <Card title="Traits">
        <TraitsFrom
          onChange={(td) => setService({ ...service, traits: td })}
          caps={caps.filter((cap) => cap.type === 'Trait')}
        />
      </Card>
    </div>
  );
};
interface ServiceFormProps {
  onChange: (services: ServiceEntry[]) => void;
  caps: API.CapabilityType[];
}
export default ({ onChange, caps }: ServiceFormProps) => {
  const [autoId, setAutoId] = useState(0);
  const [services, setServices] = useState<ServiceEntry[]>([{ id: autoId }]);
  const [activeId, setActiveId] = useState<number>(autoId);

  const addService = () => {
    const newId = autoId + 1;
    setAutoId(newId);
    const newServices = services.concat([{ id: newId }]);
    setServices(newServices);
    onChange(newServices);
  };

  const removeService = (id: number) => {
    const removedItem = services.find((i) => i.id === id);
    if (removedItem == null) {
      return;
    }
    const newServices = services.filter((i) => i !== removedItem);
    onChange(newServices);
    setServices(newServices);
    const { length } = newServices;
    if (length > 0) {
      setActiveId(newServices[length - 1].id);
    }
  };

  const updateService = (id: number, updater: (service: ServiceEntry) => ServiceEntry) => {
    const index = services.findIndex((i) => i.id === id);
    if (index === -1) {
      return;
    }
    const current = services[index];
    services[index] = updater(current);
    const newServices = [...services];
    setServices(newServices);
    onChange(newServices);
  };

  return (
    <Tabs
      type="editable-card"
      tabPosition="top"
      activeKey={activeId.toString()}
      onChange={(e) => setActiveId(parseFloat(e))}
      onEdit={(key, action) => {
        switch (action) {
          case 'add':
            addService();
            break;
          case 'remove':
            removeService(parseFloat(key.toString()));
            break;
          default:
            throw new Error(`invalid action '${action}'.`);
        }
      }}
    >
      {services.map((s) => (
        <Tabs.TabPane
          key={s.id}
          tab={
            s.name == null || s.name === '' ? (
              'New service'
            ) : (
              <div
                title={s.name}
                style={{
                  maxWidth: '100px',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  wordBreak: 'break-all',
                }}
              >
                {s.name}
              </div>
            )
          }
          closable={services.length > 1}
          forceRender
        >
          <ServiceFormItem
            service={s}
            setService={(i) => updateService(s.id, () => i)}
            caps={caps}
          />
        </Tabs.TabPane>
      ))}
    </Tabs>
  );
};
