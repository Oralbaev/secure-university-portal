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
  username?: string
  password?: string
  remember?: boolean
}

const App: React.FC = () => {
  const navigate = useNavigate()
  const [loginError, setLoginError] = React.useState("")

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    setLoginError("")
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:5001/api"}/users/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: values.username, password: values.password }),
        }
      )
      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.message || result.err || "Unable to sign in")
      }

      const storage = values.remember ? localStorage : sessionStorage
      storage.setItem("authToken", result.token)
      storage.setItem("authUser", JSON.stringify(result.user))
      navigate(
        result.user.mustChangePassword ? "/change-password" : "/dashboard"
      )
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to sign in"
      setLoginError(message)
    }
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
            initialValues={{ remember: false }}
            onFinish={onFinish}
            autoComplete="off"
          >
            {loginError && (
              <Typography.Text type="danger">{loginError}</Typography.Text>
            )}
            <Form.Item<FieldType>
              label="Your ID"
              name="username"
              rules={[
                { required: true, message: "Please input your ID!" },
                { min: 3, max: 64, message: "ID must be 3 to 64 characters" },
              ]}
            >
              <Input maxLength={64} autoComplete="username" />
            </Form.Item>

            <Form.Item<FieldType>
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
                { min: 10, max: 128, message: "Password must be 10 to 128 characters" },
              ]}
            >
              <Input.Password maxLength={128} autoComplete="current-password" />
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
