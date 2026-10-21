import React from "react"
import {
  Layout,
  Flex,
  Typography,
  Form,
  Input,
  Checkbox,
  Button,
  Divider,
} from "antd"
import { useNavigate } from "react-router-dom"
import type { FormProps } from "antd"

const { Header, Content, Footer } = Layout
const { Title } = Typography
type FieldType = {
  id?: string
  password?: string
  remember?: string
}

const App: React.FC = () => {
  const navigate = useNavigate()

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    console.log("Success:", values)
    navigate("/dashboard")
  }

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo)
  }
  return (
    <Layout style={{ height: "100vh", width: "100vw" }}>
      <Header style={{ display: "flex", background: "#eee" }}>
        <div>
          <Title level={2}>UNI - Best education</Title>
        </div>
      </Header>
      <Content style={{ background: "#eee" }}>
        <Flex
          vertical
          gap="medium"
          style={{
            background: "#fff",
            margin: 20,
            padding: 20,
            borderRadius: 25,
            width: "50vw",
            height: "60vh",
            justifySelf: "center",
            justifyItems: "center",
            alignItems: "center",
          }}
        >
          <Title level={2} style={{}}>
            Sign in
          </Title>
          <Divider />
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ width: 300, justifyItems: "center" }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item<FieldType>
              label="Your ID"
              name="id"
              rules={[{ required: true, message: "Please input your ID!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item<FieldType>
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item<FieldType>
              name="remember"
              valuePropName="checked"
              label={null}
            >
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <Form.Item label={null}>
              <Button type="primary" htmlType="submit">
                Sign in
              </Button>
            </Form.Item>
          </Form>
        </Flex>
      </Content>
      <Footer style={{ textAlign: "center", background: "#eee" }}>
        ©{new Date().getFullYear()} Created by Yesko
      </Footer>
    </Layout>
  )
}

export default App
