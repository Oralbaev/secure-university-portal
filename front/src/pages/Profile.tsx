import { useEffect, useState } from "react"
import type { FC } from "react"
import { ArrowLeftOutlined } from "@ant-design/icons"
import { useNavigate } from "react-router-dom"
import {
  Alert,
  Button,
  Descriptions,
  Layout,
  Spin,
  theme,
  Typography,
} from "antd"
import type { DescriptionsProps } from "antd"

const { Header, Content } = Layout
const { Title } = Typography

type UserProfile = {
  id: string
  username: string
  firstName?: string
  lastName?: string
  role: string
  mustChangePassword: boolean
}

type ProfileResponse = {
  status: string
  user: UserProfile
  err?: string
}

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001/api"

const clearSession = () => {
  localStorage.removeItem("authToken")
  localStorage.removeItem("authUser")
  sessionStorage.removeItem("authToken")
  sessionStorage.removeItem("authUser")
}

const Profile: FC = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let cancelled = false

    const loadProfile = async () => {
      const token =
        localStorage.getItem("authToken") || sessionStorage.getItem("authToken")

      if (!token) {
        navigate("/", { replace: true })
        return
      }

      try {
        const response = await fetch(`${apiUrl}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (response.status === 401) {
          clearSession()
          navigate("/", { replace: true })
          return
        }

        const result = (await response.json()) as ProfileResponse
        if (!response.ok) {
          throw new Error(result.err || "Unable to load profile")
        }

        if (!cancelled) setUser(result.user)
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load profile",
          )
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void loadProfile()
    return () => {
      cancelled = true
    }
  }, [navigate])

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()

  const fullName = user
    ? [user.firstName, user.lastName].filter(Boolean).join(" ") || "Not set"
    : ""

  const items: DescriptionsProps["items"] = user
    ? [
        { key: "1", label: "Username", children: user.username },
        { key: "2", label: "Full name", children: fullName },
        { key: "3", label: "Role", children: user.role },
        {
          key: "4",
          label: "Password change required",
          children: user.mustChangePassword ? "Yes" : "No",
        },
      ]
    : []

  return (
    <Layout style={{ height: "100vh", width: "100vw" }}>
      <Header
        style={{
          padding: 0,
          background: colorBgContainer,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            style={{
              fontSize: 24,
              width: 64,
              height: 64,
              position: "absolute",
              left: 16,
            }}
            onClick={() => navigate("/dashboard")}
          />
          <Title level={3} style={{ margin: "0 auto" }}>
            UNINET
          </Title>
        </div>
      </Header>

      <Content
        style={{
          margin: "24px 16px",
          padding: 24,
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
        }}
      >
        {error && (
          <Alert
            type="error"
            showIcon
            message={error}
            style={{ marginBottom: 16 }}
          />
        )}

        {loading ? (
          <div style={{ textAlign: "center", padding: 40 }}>
            <Spin size="large" />
          </div>
        ) : (
          <Descriptions title="User Info" items={items} bordered column={1} />
        )}
      </Content>
    </Layout>
  )
}

export default Profile
