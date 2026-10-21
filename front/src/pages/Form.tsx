import React, { useState } from "react"
import {
  Button,
  Form,
  Input,
  Select,
  Space,
  Table,
  Layout,
  Modal,
  message,
} from "antd"
import type { TableProps } from "antd"

interface DataType {
  key: string
  id: string
  typeOfRequest: string
  description: string
}

interface RequestFormValues {
  type: { request: string }
  description: string
}

const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDescription, setSelectedDescription] = useState("")
  const [messageApi, contextHolder] = message.useMessage()

  const showModal = (description: string) => {
    setSelectedDescription(description)
    setIsModalOpen(true)
  }

  const handleOk = () => {
    setIsModalOpen(false)
  }

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Type of Request",
      dataIndex: "typeOfRequest",
      key: "typeOfRequest",
    },
    {
      title: "Description",
      key: "description",
      render: (_, record) => (
        <Button type="link" onClick={() => showModal(record.description)}>
          View
        </Button>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: () => (
        <Space size="middle">
          <a>Edit</a>
          <a>Delete</a>
        </Space>
      ),
    },
  ]

  const data: DataType[] = [
    {
      key: "1",
      id: "REQ001",
      typeOfRequest: "Academic Mobility",
      description: "Request for semester abroad program",
    },
    {
      key: "2",
      id: "REQ002",
      typeOfRequest: "Course Equivalence",
      description: "Need equivalence for completed courses",
    },
  ]

  const onFinish = (values: RequestFormValues) => {
    console.log("Received values of form: ", values)
    messageApi.open({
      type: "success",
      content: "Request submitted successfully!",
    })
  }

  return (
    <Layout>
      {contextHolder}
      <Table<DataType> columns={columns} dataSource={data} />
      <Modal
        title="Description"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleOk}
      >
        <p>{selectedDescription}</p>
      </Modal>
      <Form
        name="complex-form"
        onFinish={onFinish}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
      >
        <Form.Item label="Type of request" required>
          <Space.Compact>
            <Form.Item
              name={["type", "request"]}
              noStyle
              rules={[
                { required: true, message: "Please select a type of request" },
              ]}
            >
              <Select
                placeholder="Select a type of request"
                options={[
                  { value: "academic mobility", label: "Academic Mobility" },
                  { value: "course equivalence", label: "Course Equivalence" },
                  { value: "other", label: "Other" },
                ]}
              />
            </Form.Item>
          </Space.Compact>
        </Form.Item>
        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "Please input!" }]}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item label={null}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Layout>
  )
}

export default App
