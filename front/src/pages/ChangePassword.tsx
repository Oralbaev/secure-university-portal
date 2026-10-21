import { useState } from "react"
import { Button, Form, Input, Layout, Typography } from "antd"
import { useNavigate } from "react-router-dom"

type PasswordFields = {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001/api"

const ChangePassword = () => {
  const navigate = useNavigate()
  const [error, setError] = useState("")

  const onFinish = async (values: PasswordFields) => {
    setError("")
    const token =
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken")
    try {
      const response = await fetch(`${apiUrl}/users/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.message || result.err || "Unable to change password")

      const storage = localStorage.getItem("authToken") ? localStorage : sessionStorage
      storage.setItem("authToken", result.token)
      navigate("/dashboard", { replace: true })
    } catch (changeError) {
      setError(changeError instanceof Error ? changeError.message : "Unable to change password")
    }
  }

  return (
    <Layout style={{ minHeight: "100vh", justifyContent: "center", alignItems: "center" }}>
      <Form<PasswordFields>
        layout="vertical"
        onFinish={onFinish}
        style={{ width: 340, padding: 24, background: "white", borderRadius: 12 }}
      >
        <Typography.Title level={3}>Change your password</Typography.Title>
        {error && <Typography.Text type="danger">{error}</Typography.Text>}
        <Form.Item
          label="Temporary password"
          name="currentPassword"
          rules={[{ required: true }]}
        >
          <Input.Password autoComplete="current-password" />
        </Form.Item>
        <Form.Item
          label="New password"
          name="newPassword"
          rules={[{ required: true }, { min: 10, message: "Use at least 10 characters" }]}
        >
          <Input.Password autoComplete="new-password" />
        </Form.Item>
        <Form.Item
          label="Confirm new password"
          name="confirmPassword"
          dependencies={["newPassword"]}
          rules={[
            { required: true },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) return Promise.resolve()
                return Promise.reject(new Error("Passwords do not match"))
              },
            }),
          ]}
        >
          <Input.Password autoComplete="new-password" />
        </Form.Item>
        <Button type="primary" htmlType="submit" block>
          Save password
        </Button>
      </Form>
    </Layout>
  )
}

export default ChangePassword
